import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

def scrape_book_details(url):
    """
    Scrapes book details from a URL using Selenium.
    Returns a dictionary with title, author, rating, description.
    """
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36")

    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        driver.get(url)
        time.sleep(3) # Wait for JS to render
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        # Heuristics for OpenLibrary or Goodreads or generic OpenGraph tags
        title = ""
        author = ""
        description = ""
        rating = "4.5" # Default placeholder fallback if not found
        
        # Try finding OpenGraph metadata first (works on most sites)
        og_title = soup.find("meta", property="og:title")
        if og_title: title = og_title.get("content", "")
            
        og_desc = soup.find("meta", property="og:description")
        if og_desc: description = og_desc.get("content", "")
            
        # If openlibrary:
        if "openlibrary.org" in url:
            title_el = soup.find("h1", class_="work-title")
            if title_el: title = title_el.text.strip()
            author_el = soup.find("a", itemprop="author")
            if author_el: author = author_el.text.strip()
            desc_el = soup.find("div", class_="work-description")
            if desc_el: description = desc_el.text.strip()
            
        # If goodreads:
        elif "goodreads.com" in url:
            title_el = soup.find("h1", {"data-testid": "bookTitle"})
            if title_el: title = title_el.text.strip()
            author_el = soup.find("span", {"data-testid": "name"})
            if author_el: author = author_el.text.strip()
            desc_el = soup.find("div", {"data-testid": "description"})
            if desc_el: description = desc_el.text.strip()
            rating_el = soup.find("div", class_="RatingStatistics__rating")
            if rating_el: rating = rating_el.text.strip()

        # Final Fallback if empty
        if not title:
            title = soup.title.string if soup.title else "Unknown Title"
        if not author:
            author = "Unknown Author"

        return {
            "title": title[:255],
            "author": author[:255],
            "rating": rating[:50],
            "description": description[:10000] if description else "No description available.",
            "url": url
        }
    except Exception as e:
        print(f"Error scraping: {e}")
        return {
            "title": "Failed to Scrape",
            "author": "N/A",
            "rating": "N/A",
            "description": str(e),
            "url": url
        }
    finally:
        driver.quit()

import chromadb
from chromadb.utils import embedding_functions
from openai import OpenAI
import os

# Global placeholders for lazy loading
chroma_client = None
embedding_func = None
collection = None

def get_chroma_collection():
    global chroma_client, embedding_func, collection
    if collection is None:
        chroma_client = chromadb.PersistentClient(path="./chroma_db")
        embedding_func = embedding_functions.SentenceTransformerEmbeddingFunction(model_name="all-MiniLM-L6-v2")
        collection = chroma_client.get_or_create_collection(name="books_rag", embedding_function=embedding_func)
    return collection

# Initialize OpenAI client for Groq
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY", ""),
    timeout=15.0
)

def generate_insights(description):
    """
    Generates AI insights (Summary, Genre, Recommendations) using Groq LLM.
    """
    if not description or description == "No description available.":
        return {
            "summary": "No description available to summarize.",
            "genre": "Unknown",
            "recommendations": []
        }
        
    prompt = f"Analyze the following book description:\n{description}\n\nProvide a short summary, the genre, and 2 similar book recommendations. Format strictly as:\nSummary: [text]\nGenre: [text]\nRecommendations: [book 1, book 2]"
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )
        result = response.choices[0].message.content
        
        # Simple parsing
        summary = ""
        genre = ""
        recommendations = []
        
        for line in result.split("\n"):
            if line.startswith("Summary:"): summary = line.replace("Summary:", "").strip()
            elif line.startswith("Genre:"): genre = line.replace("Genre:", "").strip()
            elif line.startswith("Recommendations:"): 
                recs = line.replace("Recommendations:", "").split(",")
                recommendations = [r.strip() for r in recs]

        return {
            "summary": summary if summary else "Generated summary.",
            "genre": genre if genre else "Fiction",
            "recommendations": recommendations if recommendations else ["Book A", "Book B"]
        }
    except Exception as e:
        print(f"Error generating insights: {e}")
        return {
            "summary": f"AI generation failed: {str(e)}",
            "genre": "Unknown",
            "recommendations": []
        }

def add_to_rag(book_id, text):
    """
    Chunks textual data and adds it to ChromaDB vector store.
    """
    if not text:
        return
        
    # Extremely basic chunking for example purposes
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    ids = [f"book_{book_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"book_id": book_id} for _ in chunks]
    
    coll = get_chroma_collection()
    coll.add(
        documents=chunks,
        metadatas=metadatas,
        ids=ids
    )

def query_rag(question):
    """
    Queries the RAG pipeline to answer a question using live Groq API.
    """
    try:
        # 1. Search ChromaDB for relevant book chunks
        coll = get_chroma_collection()
        results = coll.query(
            query_texts=[question],
            n_results=3
        )
        
        context = " ".join(results["documents"][0]) if results["documents"] else ""
        
        if not context:
            return "I don't have enough information in the active library to answer this. Try adding more books first!"
            
        prompt = f"Answer the user's question using ONLY the provided context from our library.\n\nContext: {context}\n\nQuestion: {question}\n\nAnswer:"
        
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content
        
    except Exception as e:
        print(f"Error querying RAG: {e}")
        return f"AI Error: {str(e)}"
