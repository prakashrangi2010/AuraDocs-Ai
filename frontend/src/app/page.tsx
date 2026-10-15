'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Plus, Sparkles, Star, BookOpen, Clock, Download, Library, Database, Cpu, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: string;
  description: string;
  url: string;
  cover_image_url?: string;
}

interface FreeBook {
  title: string;
  author: string;
  rating: string;
  description: string;
  url: string;
  cover_image_url: string;
  source: string;
}

interface LibraryStats {
  total_books: number;
  vector_chunks: number;
  rag_status: string;
  free_api_source: string;
}

export default function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Free Books API state
  const [freeQuery, setFreeQuery] = useState('classics');
  const [freeBooks, setFreeBooks] = useState<FreeBook[]>([]);
  const [isSearchingFree, setIsSearchingFree] = useState(false);
  const [importingTitle, setImportingTitle] = useState<string | null>(null);

  // Stats and Seeding state
  const [stats, setStats] = useState<LibraryStats | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchBooks();
    fetchStats();
    searchFreeBooks('classics');
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/books/`);
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stats/`);
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats", error);
    }
  };

  const searchFreeBooks = async (q: string) => {
    if (!q.trim()) return;
    setIsSearchingFree(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/free-books/search/?q=${encodeURIComponent(q)}`);
      setFreeBooks(response.data.results || []);
    } catch (error) {
      console.error("Error searching free books", error);
    } finally {
      setIsSearchingFree(false);
    }
  };

  const handleImportFreeBook = async (book: FreeBook) => {
    setImportingTitle(book.title);
    try {
      await axios.post(`${API_BASE_URL}/api/free-books/import/`, book);
      setStatusMessage(`Successfully imported "${book.title}" into AI Library!`);
      fetchBooks();
      fetchStats();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (error) {
      console.error("Error importing free book", error);
    } finally {
      setImportingTitle(null);
    }
  };

  const handleSeedLibrary = async () => {
    setIsSeeding(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/seed/`);
      setStatusMessage(res.data.message || 'Seeded classic books!');
      fetchBooks();
      fetchStats();
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (error) {
      console.error("Error seeding library", error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setIsScraping(true);
    try {
      await axios.post(`${API_BASE_URL}/api/upload/`, { url: urlInput });
      setUrlInput('');
      fetchBooks();
      fetchStats();
    } catch (error) {
      console.error("Error scraping book", error);
    } finally {
      setIsScraping(false);
    }
  };

  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 container mx-auto px-6 py-10 flex flex-col gap-12">
      {/* Notification Toast */}
      {statusMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-emerald-400/30"
        >
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{statusMessage}</span>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/20 backdrop-blur-2xl p-8 sm:p-12 md:p-16 shadow-[0_0_100px_rgba(99,102,241,0.1)] mt-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 opacity-50" />
        <div className="relative z-10 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 font-medium text-indigo-300 ring-1 ring-inset ring-indigo-500/20 mb-8 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm tracking-wide">AI Document Intelligence & Free Books API</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-outfit text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight"
          >
            Transform Books into <span className="text-gradient">Knowledge</span>
          </motion.h1>
          <p className="text-lg text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            Search thousands of free public domain books, import them with 1-click, or upload any book link for automated RAG vector storage and AI Q&A.
          </p>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 max-w-xl">
            <motion.form 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative flex-1 group flex shadow-2xl rounded-2xl" 
              onSubmit={handleScrape}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-hover:duration-200" />
              <div className="relative flex w-full bg-black/80 ring-1 ring-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <BookOpen className="h-5 w-5 text-indigo-400/70 group-focus-within:text-indigo-400 transition-colors" />
                </div>
                <input 
                  type="text" 
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="block w-full bg-transparent py-4 pl-14 pr-4 text-zinc-200 placeholder:text-zinc-500 focus:outline-none transition-all text-base"
                  placeholder="Paste URL from Goodreads or OpenLibrary..."
                />
                <button 
                  disabled={isScraping}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed m-1 rounded-xl text-sm"
                >
                  {isScraping ? (
                    <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Add URL
                    </>
                  )}
                </button>
              </div>
            </motion.form>

            <button 
              onClick={handleSeedLibrary}
              disabled={isSeeding}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-4 font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl hover:shadow-purple-500/20 text-sm whitespace-nowrap disabled:opacity-50"
            >
              {isSeeding ? (
                <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Quick Seed (16 Classics)
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Stats Strip */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400">
              <Library className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats?.total_books ?? books.length}</div>
              <div className="text-xs text-zinc-400">Library Books</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats?.vector_chunks ?? 0}</div>
              <div className="text-xs text-zinc-400">RAG Vector Chunks</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">Supabase RAG</div>
              <div className="text-xs text-zinc-400">RAG Engine</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">Gutenberg API</div>
              <div className="text-xs text-zinc-400">Free Books Catalog</div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Public Domain Books Catalog Section */}
      <section className="flex flex-col gap-6 relative z-10 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2">
              <Download className="h-3.5 w-3.5" />
              Free Books API (Project Gutenberg & Open Library)
            </div>
            <h2 className="font-outfit text-3xl font-bold text-white">
              Discover & Import Free Books
            </h2>
          </div>

          {/* Search Input for Free Books */}
          <form 
            onSubmit={(e) => { e.preventDefault(); searchFreeBooks(freeQuery); }}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                value={freeQuery}
                onChange={(e) => setFreeQuery(e.target.value)}
                placeholder="Search classics, fiction, sci-fi..."
                className="w-full pl-10 pr-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button 
              type="submit"
              disabled={isSearchingFree}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              {isSearchingFree ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Search Free"}
            </button>
          </form>
        </div>

        {/* Free Books Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {freeBooks.map((book, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-black/40 border border-white/10 hover:border-indigo-500/40 rounded-2xl p-4 flex flex-col justify-between gap-4 transition-all hover:bg-black/60 shadow-lg"
            >
              <div className="flex gap-4">
                <img 
                  src={book.cover_image_url} 
                  alt={book.title}
                  className="w-20 h-28 object-cover rounded-xl border border-white/10 shadow-md flex-shrink-0"
                />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md w-fit mb-1">
                    {book.source}
                  </span>
                  <h4 className="font-outfit font-bold text-white text-base line-clamp-2 leading-snug">
                    {book.title}
                  </h4>
                  <p className="text-zinc-400 text-xs mt-1">by {book.author}</p>
                </div>
              </div>

              <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                {book.description}
              </p>

              <button 
                onClick={() => handleImportFreeBook(book)}
                disabled={importingTitle === book.title}
                className="w-full bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 hover:border-indigo-500 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {importingTitle === book.title ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Embedding Vectors...
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    Import to AI Library
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Library Section */}
      <section className="flex flex-col gap-6 relative z-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="font-outfit text-3xl font-bold text-white flex items-center gap-3">
             <span className="h-8 w-2 rounded-full bg-indigo-500" />
            Your Intelligent Library ({filteredBooks.length})
          </h2>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.length === 0 && !isScraping && (
             <div className="col-span-full py-16 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed flex flex-col items-center justify-center gap-3">
               <BookOpen className="h-12 w-12 text-zinc-600" />
               <p className="text-zinc-400 font-medium">No books matching your search.</p>
               <button onClick={handleSeedLibrary} className="text-xs text-indigo-400 underline font-semibold">
                 Click here to Quick Seed 16 Classic Books
               </button>
             </div>
          )}
          {filteredBooks.map((book, idx) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                href={`/book/${book.id}`}
                className="group flex flex-col h-full bg-[#0a0a14] hover:bg-[#0f0f1d] border border-white/5 hover:border-indigo-500/30 rounded-2xl transition-all duration-500 relative overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1"
              >
                {/* Book Cover Image Container */}
                <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-zinc-900 border-b border-white/5">
                  {book.cover_image_url ? (
                    <img 
                      src={book.cover_image_url} 
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-950 to-zinc-900 text-zinc-600">
                      <BookOpen className="h-10 w-10 mb-2 opacity-30" />
                      <span className="text-xs font-medium uppercase tracking-widest opacity-50">No Cover</span>
                    </div>
                  )}
                  {/* Rating Badge Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 text-xs font-bold border border-white/10 shadow-lg">
                    <Star className="h-3 w-3 fill-amber-400" />
                    {book.rating || '4.8'}
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 relative">
                  <h3 className="font-outfit text-lg sm:text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors duration-300 line-clamp-1">
                    {book.title}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-3 font-medium flex items-center gap-1.5">
                    <span className="w-4 h-px bg-zinc-600"></span>
                    {book.author || 'Unknown Author'}
                  </p>
                  <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
                    {book.description || 'No description available for this book.'}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between text-xs text-zinc-600 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 group-hover:text-zinc-400 transition-colors">
                      <Clock className="h-3.5 w-3.5" />
                      Indexed in RAG
                    </div>
                    <div className="flex items-center gap-1 text-indigo-400/0 group-hover:text-indigo-400 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300 font-medium">
                      View Details &rarr;
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

