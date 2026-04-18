import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from api.models import Book

def seed_books():
    books = [
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

    for book_data in books:
        book, created = Book.objects.get_or_create(
            title=book_data['title'],
            defaults=book_data
        )
        if created:
            print(f"Created: {book.title}")
        else:
            print(f"Already exists: {book.title}")

if __name__ == '__main__':
    seed_books()
