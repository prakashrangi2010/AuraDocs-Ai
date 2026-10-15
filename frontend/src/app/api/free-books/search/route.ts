import { NextResponse } from 'next/server';

const FALLBACK_FREE_BOOKS = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    rating: "4.9",
    description: "A classic romantic masterpiece following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in early 19th-century England.",
    url: "https://www.gutenberg.org/ebooks/1342",
    cover_image_url: "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    rating: "4.8",
    description: "The seminal gothic science fiction novel telling the tragic story of Victor Frankenstein and his sapient creature.",
    url: "https://www.gutenberg.org/ebooks/84",
    cover_image_url: "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: "4.7",
    description: "Set in the Jazz Age on Long Island, depicting narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby.",
    url: "https://www.gutenberg.org/ebooks/64317",
    cover_image_url: "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    rating: "4.8",
    description: "An epistolary vampire novel chronicling Count Dracula's attempt to move from Transylvania to England to spread the undead curse.",
    url: "https://www.gutenberg.org/ebooks/345",
    cover_image_url: "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    rating: "4.9",
    description: "A collection of twelve detective stories featuring the brilliant consulting detective Sherlock Holmes and Dr. John H. Watson.",
    url: "https://www.gutenberg.org/ebooks/1661",
    cover_image_url: "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "The Art of War",
    author: "Sun Tzu",
    rating: "4.9",
    description: "An ancient Chinese military treatise composed of 13 chapters, each devoted to one aspect of warfare and strategic philosophy.",
    url: "https://www.gutenberg.org/ebooks/17405",
    cover_image_url: "https://www.gutenberg.org/cache/epub/17405/pg17405.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "Moby-Dick; or, The Whale",
    author: "Herman Melville",
    rating: "4.5",
    description: "The epic sailor Ishmael's narrative of Captain Ahab's obsessive quest for revenge on Moby Dick, the giant white sperm whale.",
    url: "https://www.gutenberg.org/ebooks/2701",
    cover_image_url: "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg",
    source: "Project Gutenberg API"
  },
  {
    title: "Metamorphosis",
    author: "Franz Kafka",
    rating: "4.7",
    description: "The tragic novella of salesman Gregor Samsa, who wakes up one morning transformed into a monstrous insectoid creature.",
    url: "https://www.gutenberg.org/ebooks/5200",
    cover_image_url: "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg",
    source: "Project Gutenberg API"
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || 'classics';
  const results: any[] = [];
  const seenTitles = new Set<string>();

  // Try Google Books API
  try {
    const gbUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;
    const resp = await fetch(gbUrl, { next: { revalidate: 60 } });
    if (resp.ok) {
      const data = await resp.json();
      for (const item of data.items || []) {
        const info = item.volumeInfo || {};
        const title = (info.title || '').trim();
        if (!title || seenTitles.has(title.toLowerCase())) continue;
        seenTitles.add(title.toLowerCase());

        const authors = info.authors || ['Unknown Author'];
        const author = authors.slice(0, 2).join(', ');
        const imgLinks = info.imageLinks || {};
        let coverUrl = imgLinks.thumbnail || imgLinks.smallThumbnail || '';
        if (coverUrl.startsWith('http://')) {
          coverUrl = coverUrl.replace('http://', 'https://');
        }
        if (!coverUrl) {
          coverUrl = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';
        }

        results.push({
          title,
          author,
          rating: String(info.averageRating || '4.8'),
          description: info.description || `A literary work titled ${title} by ${author}.`,
          url: info.infoLink || `https://books.google.com?q=${encodeURIComponent(title)}`,
          cover_image_url: coverUrl,
          source: 'Google Books API'
        });
      }
    }
  } catch (err) {
    // Fallback to catalog
  }

  // Complement with curated fallback catalog
  const qLower = query.toLowerCase();
  for (const item of FALLBACK_FREE_BOOKS) {
    if (results.length >= 12) break;
    const tLow = item.title.toLowerCase();
    const aLow = item.author.toLowerCase();
    if (!seenTitles.has(tLow)) {
      if (!query || qLower.split(' ').some((w: string) => w.length > 2 && (tLow.includes(w) || aLow.includes(w))) || ['classics', 'all', 'books'].includes(qLower)) {
        seenTitles.add(tLow);
        results.push(item);
      }
    }
  }

  return NextResponse.json({
    results: results.length > 0 ? results : FALLBACK_FREE_BOOKS,
    count: results.length > 0 ? results.length : FALLBACK_FREE_BOOKS.length
  });
}
