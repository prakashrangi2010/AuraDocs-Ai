'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Plus, Sparkles, Star, BookOpen, Clock } from 'lucide-react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: string;
  description: string;
  url: string;
  cover_image_url?: string;
}

export default function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/books/');
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books", error);
    }
  };

  const handleScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;
    setIsScraping(true);
    try {
      await axios.post('http://localhost:8000/api/upload/', { url: urlInput });
      setUrlInput('');
      fetchBooks(); // Refresh list
    } catch (error) {
      console.error("Error scraping book", error);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="flex-1 container mx-auto px-6 py-10 flex flex-col gap-12">
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
            <span className="text-sm tracking-wide">AI Document Intelligence</span>
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
            Upload any book link and let AI generate insightful summaries, discover the genre, and answer any questions you have using retrieval augmented generation.
          </p>
          
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-xl group flex shadow-2xl rounded-2xl" 
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
                className="block w-full bg-transparent py-5 pl-14 pr-4 text-zinc-200 placeholder:text-zinc-500 focus:outline-none transition-all text-lg"
                placeholder="Paste a link from Goodreads or OpenLibrary..."
              />
              <button 
                disabled={isScraping}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed m-1 rounded-xl"
              >
                {isScraping ? (
                  <div className="h-5 w-5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <>
                    <Plus className="h-5 w-5" />
                    Process
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-0 right-40 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
      </section>

      {/* Library Section */}
      <section className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <h2 className="font-outfit text-3xl font-bold text-white flex items-center gap-3">
             <span className="h-8 w-2 rounded-full bg-indigo-500" />
            Your Intelligent Library
          </h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search library..."
              className="pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-colors w-64"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.length === 0 && !isScraping && (
             <div className="col-span-full py-12 text-center text-zinc-500 bg-zinc-900/30 rounded-2xl border border-zinc-800 border-dashed">
               No books in your library yet. Paste a link above to get started!
             </div>
          )}
          {books.map((book, idx) => (
            <motion.div 
              key={book.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
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
                    {book.rating || 'N/A'}
                  </div>
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-80" />
                </div>
                
                {/* Content Section */}
                <div className="p-5 flex flex-col flex-1 relative">
                  <div className="absolute -top-10 right-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-2xl group-hover:bg-indigo-500/40 transition-colors duration-500 pointer-events-none" />
                  
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
                      Recently Added
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
