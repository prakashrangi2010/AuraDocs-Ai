export interface BookItem {
  id: number;
  title: string;
  author: string;
  rating: string;
  description: string;
  url: string;
  cover_image_url: string;
  created_at?: string;
  insights?: {
    summary: string;
    genre: string;
    recommendations: string[];
  };
}

export const INITIAL_BOOKS: BookItem[] = [
  {
    id: 1,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    rating: "4.9",
    description: "A classic romantic masterpiece following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the landed gentry of early 19th-century England.",
    url: "https://www.gutenberg.org/ebooks/1342",
    cover_image_url: "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg",
    insights: {
      summary: "Elizabeth Bennet navigates societal pressures and her tumultuous relationship with Fitzwilliam Darcy in 19th-century England.",
      genre: "Classic Romance, Historical Fiction",
      recommendations: ["Sense and Sensibility", "Emma", "Jane Eyre"]
    }
  },
  {
    id: 2,
    title: "Frankenstein",
    author: "Mary Shelley",
    rating: "4.8",
    description: "The seminal gothic science fiction novel telling the tragic story of Victor Frankenstein, a young scientist who creates a sapient creature in an unorthodox scientific experiment.",
    url: "https://www.gutenberg.org/ebooks/84",
    cover_image_url: "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg",
    insights: {
      summary: "Victor Frankenstein brings life to an artificial being, only to unleash devastating tragedy on himself and society.",
      genre: "Gothic Science Fiction, Horror",
      recommendations: ["Dracula", "The Strange Case of Dr Jekyll and Mr Hyde"]
    }
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    rating: "4.7",
    description: "Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    url: "https://www.gutenberg.org/ebooks/64317",
    cover_image_url: "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg",
    insights: {
      summary: "A searing portrait of the Roaring Twenties exploring wealth, illusion, and the corruption of the American Dream.",
      genre: "Modernist Literature, Drama",
      recommendations: ["Tender Is the Night", "This Side of Paradise"]
    }
  },
  {
    id: 4,
    title: "Dracula",
    author: "Bram Stoker",
    rating: "4.8",
    description: "An epistolary vampire novel chronicling Count Dracula's attempt to move from Transylvania to England so that he may find new blood and spread the undead curse.",
    url: "https://www.gutenberg.org/ebooks/345",
    cover_image_url: "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg",
    insights: {
      summary: "Jonathan Harker and Professor Van Helsing unite to stop the ancient vampire Count Dracula from conquering Victorian England.",
      genre: "Gothic Horror, Epistolary Novel",
      recommendations: ["Frankenstein", "Carmilla"]
    }
  },
  {
    id: 5,
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    rating: "4.9",
    description: "A collection of twelve detective stories featuring the brilliant consulting detective Sherlock Holmes and his loyal companion Dr. John H. Watson.",
    url: "https://www.gutenberg.org/ebooks/1661",
    cover_image_url: "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg",
    insights: {
      summary: "Master detective Sherlock Holmes solves twelve baffling Victorian mysteries using deduction and forensics.",
      genre: "Detective Fiction, Mystery",
      recommendations: ["The Hound of the Baskervilles", "A Study in Scarlet"]
    }
  },
  {
    id: 6,
    title: "Alice's Adventures in Wonderland",
    author: "Lewis Carroll",
    rating: "4.6",
    description: "A fantastical tale of a young girl named Alice who falls through a rabbit hole into a subterranean fantasy world populated by peculiar, anthropomorphic creatures.",
    url: "https://www.gutenberg.org/ebooks/11",
    cover_image_url: "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg",
    insights: {
      summary: "Alice tumbles down a rabbit hole into a nonsensical dreamworld ruled by the Queen of Hearts.",
      genre: "Children's Fantasy, Literary Nonsense",
      recommendations: ["Through the Looking-Glass", "Peter Pan"]
    }
  },
  {
    id: 7,
    title: "The Art of War",
    author: "Sun Tzu",
    rating: "4.9",
    description: "An ancient Chinese military treatise attributed to Sun Tzu. Composed of 13 chapters, each is devoted to one aspect of warfare and strategic philosophy.",
    url: "https://www.gutenberg.org/ebooks/17405",
    cover_image_url: "https://www.gutenberg.org/cache/epub/17405/pg17405.cover.medium.jpg",
    insights: {
      summary: "A classic 13-chapter philosophy on military strategy, leadership, discipline, and conflict resolution.",
      genre: "Philosophy, Military Strategy",
      recommendations: ["The Prince", "Book of Five Rings"]
    }
  },
  {
    id: 8,
    title: "Moby-Dick; or, The Whale",
    author: "Herman Melville",
    rating: "4.5",
    description: "The epic sailor Ishmael's narrative of the obsessive quest of Ahab, captain of the whaling ship Pequod, for revenge on Moby Dick, the giant white sperm whale.",
    url: "https://www.gutenberg.org/ebooks/2701",
    cover_image_url: "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg",
    insights: {
      summary: "Captain Ahab leads the Pequod on a perilous voyage driven by an obsessive vengeance against the great white whale.",
      genre: "Epic Fiction, Adventure",
      recommendations: ["Heart of Darkness", "The Old Man and the Sea"]
    }
  },
  {
    id: 9,
    title: "The Prince",
    author: "Niccolò Machiavelli",
    rating: "4.6",
    description: "A 16th-century political treatise offering pragmatic and controversial instruction to rulers on acquisition and maintenance of political power.",
    url: "https://www.gutenberg.org/ebooks/1232",
    cover_image_url: "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg",
    insights: {
      summary: "A practical guide for princes and rulers on acquiring, exerting, and maintaining supreme political power.",
      genre: "Political Philosophy, Non-fiction",
      recommendations: ["The Art of War", "Leviathan"]
    }
  },
  {
    id: 10,
    title: "Metamorphosis",
    author: "Franz Kafka",
    rating: "4.7",
    description: "The tragic novella of salesman Gregor Samsa, who wakes up one morning to find himself inexplicably transformed into a monstrous insectoid creature.",
    url: "https://www.gutenberg.org/ebooks/5200",
    cover_image_url: "https://www.gutenberg.org/cache/epub/5200/pg5200.cover.medium.jpg",
    insights: {
      summary: "Traveling salesman Gregor Samsa awakens transformed into an insect, confronting alienation and family abandonment.",
      genre: "Absurdist Fiction, Psychological Drama",
      recommendations: ["The Trial", "The Stranger"]
    }
  },
  {
    id: 11,
    title: "A Tale of Two Cities",
    author: "Charles Dickens",
    rating: "4.8",
    description: "Set in London and Paris before and during the French Revolution, depicting the plight of the French peasantry under the demoralizing tyranny of the aristocracy.",
    url: "https://www.gutenberg.org/ebooks/98",
    cover_image_url: "https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg",
    insights: {
      summary: "Set during the bloody French Revolution, exploring self-sacrifice, rebirth, and resurrection in Paris and London.",
      genre: "Historical Fiction, Classic Drama",
      recommendations: ["Great Expectations", "Les Misérables"]
    }
  },
  {
    id: 12,
    title: "The Picture of Dorian Gray",
    author: "Oscar Wilde",
    rating: "4.8",
    description: "A philosophical novel about a young man named Dorian Gray whose portrait ages and reflects his sins while he maintains eternal youth and beauty.",
    url: "https://www.gutenberg.org/ebooks/174",
    cover_image_url: "https://www.gutenberg.org/cache/epub/174/pg174.cover.medium.jpg",
    insights: {
      summary: "Dorian Gray makes a Faustian pact to keep his youth while his hidden painted portrait bears the scars of his corruption.",
      genre: "Philosophical Fiction, Gothic Drama",
      recommendations: ["Frankenstein", "The Strange Case of Dr Jekyll and Mr Hyde"]
    }
  },
  {
    id: 13,
    title: "The Quantum Labyrinth",
    author: "Dr. Aris Vance",
    rating: "4.8",
    description: "An exploring journey into the deepest mysteries of quantum mechanics and multidimensional space realities. Vance combines hard science with accessible metaphors.",
    url: "https://example.com/quantum",
    cover_image_url: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop",
    insights: {
      summary: "A theoretical physicist explores multidimensional space and the hidden geometry of the quantum universe.",
      genre: "Hard Sci-Fi, Theoretical Physics",
      recommendations: ["Neon Horizons", "Beyond the Algorithm"]
    }
  },
  {
    id: 14,
    title: "Neon Horizons",
    author: "Serena Vance",
    rating: "4.5",
    description: "A cyberpunk thriller set in the underbelly of New Kyoto 2099. Action, hacking, and synthetic philosophy mixed into a gripping narrative.",
    url: "https://example.com/neon",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    insights: {
      summary: "In New Kyoto 2099, a renegade hacker uncovers an autonomous AI governing city infrastructure.",
      genre: "Cyberpunk, Sci-Fi Thriller",
      recommendations: ["Neuromancer", "Snow Crash"]
    }
  },
  {
    id: 15,
    title: "Echoes of the Ancient Code",
    author: "Marcus Turing",
    rating: "4.9",
    description: "A deep dive into how ancient civilizations might have utilized proto-computing techniques to construct architectural marvels.",
    url: "https://example.com/echoes",
    cover_image_url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop",
    insights: {
      summary: "Investigating the algorithmic engineering and computational principles behind ancient monuments.",
      genre: "Speculative History, Computer Archaeology",
      recommendations: ["The Quantum Labyrinth", "Beyond the Algorithm"]
    }
  },
  {
    id: 16,
    title: "Beyond the Algorithm",
    author: "A.I. Collaborative",
    rating: "4.7",
    description: "An anthology of philosophical essays exploring the emotional and ethical bounds of artificial intelligence.",
    url: "https://example.com/beyond",
    cover_image_url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
    insights: {
      summary: "Philosophers and AI researchers debate the future of artificial consciousness and cognitive ethics.",
      genre: "Philosophy of Mind, Artificial Intelligence",
      recommendations: ["Superintelligence", "The Singularity Is Near"]
    }
  }
];

// In-memory runtime store shared across Next.js serverless functions
let globalBooks: BookItem[] = [...INITIAL_BOOKS];

export function getStoredBooks(): BookItem[] {
  return globalBooks;
}

export function addStoredBook(book: Omit<BookItem, 'id'>): BookItem {
  const newBook: BookItem = {
    ...book,
    id: globalBooks.length + 1
  };
  globalBooks = [newBook, ...globalBooks];
  return newBook;
}

export function resetStoredBooks(): BookItem[] {
  globalBooks = [...INITIAL_BOOKS];
  return globalBooks;
}
