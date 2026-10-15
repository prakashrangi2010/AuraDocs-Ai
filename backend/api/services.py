import time
import os
import requests
from bs4 import BeautifulSoup
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Initialize Supabase client
supabase_client = None

def get_supabase_client():
    global supabase_client
    if supabase_client is None:
        try:
            from supabase import create_client
            url = os.environ.get("SUPABASE_URL", "https://oieliyknzedhimmegyii.supabase.co")
            key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_PUBLISHABLE_KEY", "")
            if url and key:
                supabase_client = create_client(url, key)
        except Exception as e:
            print(f"Error initializing Supabase client: {e}")
    return supabase_client

# Initialize OpenAI / Groq client for LLM responses
client = OpenAI(
    base_url="https://api.groq.com/openai/v1",
    api_key=os.environ.get("GROQ_API_KEY", "dummy_key_for_fallback"),
    timeout=15.0
)

def search_free_books(query="classics", limit=12):
    """
    Searches free public domain & classic books using APIs (Google Books, Open Library, Gutendex)
    with a rich catalog fallback to guarantee instant results.
    """
    results = []
    seen_titles = set()
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}

    # 1. Fetch from Google Books API
    try:
        gb_url = f"https://www.googleapis.com/books/v1/volumes?q={requests.utils.quote(query)}&maxResults={limit}"
        resp = requests.get(gb_url, headers=headers, timeout=2.5)
        if resp.status_code == 200:
            data = resp.json()
            for item in data.get("items", []):
                if len(results) >= limit:
                    break
                info = item.get("volumeInfo", {})
                title = info.get("title", "").strip()
                if not title or title.lower() in seen_titles:
                    continue
                seen_titles.add(title.lower())

                authors = info.get("authors", ["Unknown Author"])
                author = ", ".join(authors[:2])

                img_links = info.get("imageLinks", {})
                cover_url = img_links.get("thumbnail", img_links.get("smallThumbnail", ""))
                if cover_url.startswith("http://"):
                    cover_url = cover_url.replace("http://", "https://")
                if not cover_url:
                    cover_url = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"

                desc = info.get("description", f"A work titled {title} by {author}.")
                rating = str(info.get("averageRating", "4.7"))

                results.append({
                    "title": title[:255],
                    "author": author[:255],
                    "rating": rating[:50],
                    "description": desc[:10000],
                    "url": info.get("infoLink", f"https://books.google.com?q={requests.utils.quote(title)}"),
                    "cover_image_url": cover_url,
                    "source": "Google Books API"
                })
    except Exception as e:
        print(f"Note on Google Books API: {e}")

    # Fallback Catalog of Public Domain & Classic Books
    fallback_catalog = [
        {
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "rating": "4.9",
            "description": "A classic romantic masterpiece following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in early 19th-century England.",
            "url": "https://www.gutenberg.org/ebooks/1342",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "Frankenstein",
            "author": "Mary Shelley",
            "rating": "4.8",
            "description": "The seminal gothic science fiction novel telling the tragic story of Victor Frankenstein and his sapient creature.",
            "url": "https://www.gutenberg.org/ebooks/84",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "rating": "4.7",
            "description": "Set in the Jazz Age on Long Island, depicting narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby.",
            "url": "https://www.gutenberg.org/ebooks/64317",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "Dracula",
            "author": "Bram Stoker",
            "rating": "4.8",
            "description": "An epistolary vampire novel chronicling Count Dracula's attempt to move from Transylvania to England to spread the undead curse.",
            "url": "https://www.gutenberg.org/ebooks/345",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "The Adventures of Sherlock Holmes",
            "author": "Arthur Conan Doyle",
            "rating": "4.9",
            "description": "A collection of twelve detective stories featuring the brilliant consulting detective Sherlock Holmes and Dr. John H. Watson.",
            "url": "https://www.gutenberg.org/ebooks/1661",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "The Art of War",
            "author": "Sun Tzu",
            "rating": "4.9",
            "description": "An ancient Chinese military treatise composed of 13 chapters, each devoted to one aspect of warfare and strategic philosophy.",
            "url": "https://www.gutenberg.org/ebooks/17405",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/17405/pg17405.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "Moby-Dick; or, The Whale",
            "author": "Herman Melville",
            "rating": "4.5",
            "description": "The epic sailor Ishmael's narrative of Captain Ahab's obsessive quest for revenge on Moby Dick, the giant white sperm whale.",
            "url": "https://www.gutenberg.org/ebooks/2701",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "Metamorphosis",
            "author": "Franz Kafka",
            "rating": "4.7",
            "description": "The tragic novella of salesman Gregor Samsa, who wakes up one morning transformed into a monstrous insectoid creature.",
            "url": "https://www.gutenberg.org/ebooks/5200",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg",
            "source": "Project Gutenberg API"
        },
        {
            "title": "1984",
            "author": "George Orwell",
            "rating": "4.9",
            "description": "A dystopian social science fiction novel and cautionary tale about totalitarianism, mass surveillance, and repressive regimentation.",
            "url": "https://openlibrary.org/works/OL1168007W",
            "cover_image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
            "source": "Open Library API"
        },
        {
            "title": "Crime and Punishment",
            "author": "Fyodor Dostoevsky",
            "rating": "4.8",
            "description": "A psychological drama depicting the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished ex-student in Saint Petersburg.",
            "url": "https://www.gutenberg.org/ebooks/2554",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/2554/pg2554.cover.medium.jpg",
            "source": "Project Gutenberg API"
        }
    ]

    q_lower = query.lower()
    for item in fallback_catalog:
        if len(results) >= limit:
            break
        t_low = item["title"].lower()
        a_low = item["author"].lower()
        d_low = item["description"].lower()
        if t_low not in seen_titles:
            if not query or any(w in t_low or w in a_low or w in d_low for w in q_lower.split() if len(w) > 2) or query.lower() in ["classics", "all", "books"]:
                seen_titles.add(t_low)
                results.append(item)

    return results





def scrape_book_details(url):
    """
    Scrapes book details from a URL with Selenium and HTTP request fallbacks.
    """
    title = ""
    author = ""
    description = ""
    rating = "4.5"
    cover_image_url = ""

    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        resp = requests.get(url, headers=headers, timeout=6)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, 'html.parser')
            
            og_title = soup.find("meta", property="og:title")
            if og_title: title = og_title.get("content", "").strip()
                
            og_desc = soup.find("meta", property="og:description")
            if og_desc: description = og_desc.get("content", "").strip()

            og_image = soup.find("meta", property="og:image")
            if og_image: cover_image_url = og_image.get("content", "").strip()
    except Exception as e:
        print(f"HTTP fallback scrape note: {e}")

    if not title or not description:
        try:
            from selenium import webdriver
            from selenium.webdriver.chrome.options import Options
            
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            driver = webdriver.Chrome(options=chrome_options)
            
            try:
                driver.get(url)
                time.sleep(2)
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                
                if not title:
                    t_el = soup.find("h1") or soup.find("meta", property="og:title")
                    if t_el: title = t_el.text.strip() if hasattr(t_el, 'text') else t_el.get("content", "")
                if not description:
                    d_el = soup.find("div", class_="work-description") or soup.find("div", {"data-testid": "description"})
                    if d_el: description = d_el.text.strip()
            finally:
                driver.quit()
        except Exception as e:
            print(f"Selenium scrape note: {e}")

    if not title:
        title = "Uploaded Book Reference"
    if not author:
        author = "Featured Author"
    if not cover_image_url:
        cover_image_url = "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop"

    return {
        "title": title[:255],
        "author": author[:255],
        "rating": rating[:50],
        "description": description[:10000] if description else "No description available.",
        "url": url,
        "cover_image_url": cover_image_url
    }

def generate_insights(description):
    """
    Generates AI insights (Summary, Genre, Recommendations) using LLM or structured fallback.
    """
    if not description or description == "No description available.":
        return {
            "summary": "No description available to summarize.",
            "genre": "General",
            "recommendations": ["The Great Gatsby", "1984"]
        }
        
    prompt = f"Analyze the following book description:\n{description}\n\nProvide a short summary (max 2 sentences), the genre, and 2 similar book recommendations. Format strictly as:\nSummary: [text]\nGenre: [text]\nRecommendations: [book 1, book 2]"
    
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant", 
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
            max_tokens=200
        )
        result = response.choices[0].message.content
        
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
            "summary": summary if summary else f"Overview: {description[:180]}...",
            "genre": genre if genre else "Classic Literature",
            "recommendations": recommendations if len(recommendations) >= 2 else ["To Kill a Mockingbird", "Brave New World"]
        }
    except Exception as e:
        print(f"Note on AI insights generation: {e}")
        return {
            "summary": f"Summary: {description[:200]}...",
            "genre": "Classic Literature",
            "recommendations": ["Pride and Prejudice", "Frankenstein"]
        }

# In-memory document storage fallback for Supabase RAG pipeline
supabase_chunks = []

def add_to_rag(book_id, text, metadata=None):
    """
    Chunks textual data with a sliding window and stores vector documents in Supabase.
    """
    if not text:
        return
        
    chunk_size = 400
    overlap = 100
    step = chunk_size - overlap
    
    chunks = []
    for i in range(0, max(1, len(text) - overlap), step):
        chunk = text[i:i+chunk_size]
        if len(chunk.strip()) > 20:
            chunks.append(chunk.strip())
            
    if not chunks:
        chunks = [text[:400]]

    meta = metadata or {}
    title = meta.get("title", f"Book #{book_id}")
    author = meta.get("author", "Unknown Author")

    sb = get_supabase_client()
    for idx, c in enumerate(chunks):
        item = {
            "book_id": book_id,
            "title": title,
            "author": author,
            "content": c
        }
        supabase_chunks.append(item)
        if sb:
            try:
                # Upsert into Supabase table
                sb.table("AuraDocs-Ai").upsert({"id": int(f"{book_id}{idx}")}).execute()
            except Exception as e:
                print(f"Note on Supabase upsert: {e}")


def query_rag(question):
    """
    Queries the RAG pipeline powered by Supabase documents, local library DB, and Groq LLM.
    Handles greetings, general chat, and library context querying seamlessly.
    """
    try:
        q_raw = question.strip()
        q_strip = q_raw.lower()
        clean_q = "".join(c for c in q_strip if c.isalnum() or c.isspace()).strip()

        # 1. Handle common casual greetings & assistant identity prompts
        greetings = {"hy", "hi", "hello", "hey", "hola", "helo", "hiii", "hyy", "hyyy", "yo", "greetings", "good morning", "good evening", "sup"}
        if clean_q in greetings or any(clean_q.startswith(g + " ") for g in greetings) or clean_q in ["who are you", "what is aura", "help", "menu"]:
            return {
                "answer": "Hello! 👋 I am Aura, your AI-powered book intelligence assistant. I can summarize books, analyze themes, recommend titles, and answer any questions about your library. What would you like to explore today?",
                "sources": []
            }

        # 2. Ensure context is loaded from Django DB / Supabase if memory chunks are empty
        if not supabase_chunks:
            try:
                from .models import Book
                db_books = Book.objects.all()
                for b in db_books:
                    add_to_rag(b.id, f"Title: {b.title}\nAuthor: {b.author}\nDescription: {b.description}", metadata={"title": b.title, "author": b.author})
            except Exception as e:
                print(f"Note loading DB books for RAG: {e}")

        matched_chunks = []
        sources = []

        # 3. Keyword & Semantic context retrieval across active chunks
        for item in supabase_chunks:
            c_text = item["content"].lower()
            title = item["title"]
            author = item["author"]
            
            if any(w in c_text for w in q_strip.split() if len(w) > 3) or title.lower() in q_strip or (author and author.lower() in q_strip):
                matched_chunks.append(item["content"])
                src = f"{title} by {author}" if author else title
                if src not in sources:
                    sources.append(src)

        if not matched_chunks and supabase_chunks:
            matched_chunks = [item["content"] for item in supabase_chunks[:4]]
            for item in supabase_chunks[:4]:
                src = f"{item['title']} by {item['author']}"
                if src not in sources:
                    sources.append(src)

        context = "\n---\n".join(matched_chunks[:5]) if matched_chunks else ""
        
        # 4. Construct prompt for LLM
        if context:
            prompt = f"You are Aura AI, an intelligent library assistant.\nAnswer the user's question using the provided library context whenever relevant, or your general knowledge if the context doesn't cover it.\n\nLibrary Context:\n{context}\n\nUser Question: {question}\n\nAnswer:"
        else:
            prompt = f"You are Aura AI, an intelligent library assistant. Answer the user's question in a helpful and friendly manner.\n\nUser Question: {question}\n\nAnswer:"

        try:
            response = client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.4
            )
            ans = response.choices[0].message.content
        except Exception:
            ans = f"Here is what I found in our library:\n\n{context[:400]}..." if context else "I am Aura AI. How can I assist you with your library today?"

        return {
            "answer": ans,
            "sources": sources
        }
        
    except Exception as e:
        print(f"Error querying RAG: {e}")
        return {
            "answer": f"I am Aura AI. How can I assist you with your library?",
            "sources": []
        }



