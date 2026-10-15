import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Book
from api import services

def seed_books():
    books = [
        {
            "title": "Pride and Prejudice",
            "author": "Jane Austen",
            "rating": "4.9",
            "description": "A classic romantic masterpiece following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the landed gentry of early 19th-century England.",
            "url": "https://www.gutenberg.org/ebooks/1342",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg"
        },
        {
            "title": "Frankenstein",
            "author": "Mary Shelley",
            "rating": "4.8",
            "description": "The seminal gothic science fiction novel telling the tragic story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.",
            "url": "https://www.gutenberg.org/ebooks/84",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg"
        },
        {
            "title": "The Great Gatsby",
            "author": "F. Scott Fitzgerald",
            "rating": "4.7",
            "description": "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
            "url": "https://www.gutenberg.org/ebooks/64317",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg"
        },
        {
            "title": "Dracula",
            "author": "Bram Stoker",
            "rating": "4.8",
            "description": "An epistolary vampire novel chronicling Count Dracula's attempt to move from Transylvania to England so that he may find new blood and spread the undead curse.",
            "url": "https://www.gutenberg.org/ebooks/345",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg"
        },
        {
            "title": "The Adventures of Sherlock Holmes",
            "author": "Arthur Conan Doyle",
            "rating": "4.9",
            "description": "A collection of twelve detective stories featuring the brilliant consulting detective Sherlock Holmes and his loyal companion Dr. John H. Watson.",
            "url": "https://www.gutenberg.org/ebooks/1661",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg"
        },
        {
            "title": "Alice's Adventures in Wonderland",
            "author": "Lewis Carroll",
            "rating": "4.6",
            "description": "A fantastical tale of a young girl named Alice who falls through a rabbit hole into a subterranean fantasy world populated by peculiar, anthropomorphic creatures.",
            "url": "https://www.gutenberg.org/ebooks/11",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg"
        },
        {
            "title": "The Art of War",
            "author": "Sun Tzu",
            "rating": "4.9",
            "description": "An ancient Chinese military treatise attributed to Sun Tzu. Composed of 13 chapters, each is devoted to one aspect of warfare and strategic philosophy.",
            "url": "https://www.gutenberg.org/ebooks/17405",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/17405/pg17405.cover.medium.jpg"
        },
        {
            "title": "Moby-Dick; or, The Whale",
            "author": "Herman Melville",
            "rating": "4.5",
            "description": "The epic sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale.",
            "url": "https://www.gutenberg.org/ebooks/2701",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg"
        },
        {
            "title": "The Prince",
            "author": "Niccolò Machiavelli",
            "rating": "4.6",
            "description": "A 16th-century political treatise offering pragmatic and controversial instruction to rulers on acquisition and maintenance of political power.",
            "url": "https://www.gutenberg.org/ebooks/1232",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg"
        },
        {
            "title": "Metamorphosis",
            "author": "Franz Kafka",
            "rating": "4.7",
            "description": "The tragic novella of salesman Gregor Samsa, who wakes up one morning to find himself inexplicably transformed into a monstrous insectoid creature.",
            "url": "https://www.gutenberg.org/ebooks/5200",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg"
        },
        {
            "title": "A Tale of Two Cities",
            "author": "Charles Dickens",
            "rating": "4.8",
            "description": "Set in London and Paris before and during the French Revolution, depicting the plight of the French peasantry under the demoralizing tyranny of the aristocracy.",
            "url": "https://www.gutenberg.org/ebooks/98",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg"
        },
        {
            "title": "The Picture of Dorian Gray",
            "author": "Oscar Wilde",
            "rating": "4.8",
            "description": "A philosophical novel about a young man named Dorian Gray whose portrait ages and reflects his sins while he maintains eternal youth and beauty.",
            "url": "https://www.gutenberg.org/ebooks/174",
            "cover_image_url": "https://www.gutenberg.org/cache/epub/174/pg174.cover.medium.jpg"
        },
        {
            "title": "The Quantum Labyrinth",
            "author": "Dr. Aris Vance",
            "rating": "4.8",
            "description": "An exploring journey into the deepest mysteries of quantum mechanics and multidimensional space realities. Vance combines hard science with accessible metaphors.",
            "url": "https://example.com/quantum",
            "cover_image_url": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop"
        },
        {
            "title": "Neon Horizons",
            "author": "Serena Vance",
            "rating": "4.5",
            "description": "A cyberpunk thriller set in the underbelly of New Kyoto 2099. Action, hacking, and synthetic philosophy mixed into a gripping narrative.",
            "url": "https://example.com/neon",
            "cover_image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop"
        },
        {
            "title": "Echoes of the Ancient Code",
            "author": "Marcus Turing",
            "rating": "4.9",
            "description": "A deep dive into how ancient civilizations might have utilized proto-computing techniques to construct architectural marvels.",
            "url": "https://example.com/echoes",
            "cover_image_url": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop"
        },
        {
            "title": "Beyond the Algorithm",
            "author": "A.I. Collaborative",
            "rating": "4.7",
            "description": "An anthology of philosophical essays exploring the emotional and ethical bounds of artificial intelligence.",
            "url": "https://example.com/beyond",
            "cover_image_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop"
        }
    ]

    count = 0
    for book_data in books:
        book, created = Book.objects.get_or_create(
            title=book_data['title'],
            defaults=book_data
        )
        # Always make sure it is indexed in RAG
        text_to_embed = f"Title: {book.title}\nAuthor: {book.author}\nDescription: {book.description}"
        services.add_to_rag(book.id, text_to_embed, metadata={"title": book.title, "author": book.author})
        
        if created:
            count += 1
            print(f"Seeded new book & RAG vectors: {book.title}")

    return count

if __name__ == '__main__':
    created_count = seed_books()
    print(f"Done! Seeded {created_count} new books into Django DB and Supabase.")


