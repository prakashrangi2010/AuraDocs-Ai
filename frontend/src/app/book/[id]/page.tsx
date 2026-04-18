'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Star, Heart, Share2, BookOpen, Clock, Tag } from 'lucide-react';
import axios from 'axios';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/books/${resolvedParams.id}/`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex-1 container mx-auto px-6 py-20 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!book) {
    return <div className="flex-1 container mx-auto px-6 py-20 text-center text-zinc-400">Book not found.</div>;
  }

  return (
    <div className="flex-1 container mx-auto px-6 py-10 relative">
      <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 group transition-colors">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Library
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Book Identity */}
        <div className="lg:col-span-1 border-r border-zinc-800 pr-0 lg:pr-12">
          <div className="aspect-[2/3] bg-zinc-900 rounded-3xl border border-zinc-800 flex items-center justify-center p-0 relative overflow-hidden mb-8 group shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
             {book.cover_image_url ? (
               <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full border-2 border-dashed border-zinc-700/50 rounded-xl flex flex-col items-center justify-center text-zinc-600 gap-4 m-8">
                 <BookOpen className="h-12 w-12 stroke-[1.5]" />
                 <span className="text-sm font-medium">Cover not available</span>
               </div>
             )}
          </div>
          
          <h1 className="font-outfit text-4xl font-extrabold text-white mb-2 leading-tight">{book.title}</h1>
          <p className="text-xl text-zinc-400 font-medium mb-6">{book.author}</p>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold border border-amber-500/20">
              <Star className="h-4 w-4 fill-amber-500" />
              {book.rating} Rating
            </div>
          </div>

          <div className="flex gap-3">
             <Link href="/qa" className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
               Ask AI about Book
             </Link>
             <button className="h-12 w-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition-colors">
               <Heart className="h-5 w-5" />
             </button>
             <button className="h-12 w-12 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl flex items-center justify-center transition-colors">
               <Share2 className="h-5 w-5" />
             </button>
          </div>
        </div>

        {/* Right Column: Details & Insights */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <section>
            <h2 className="text-sm uppercase tracking-widest text-indigo-400 font-bold mb-4 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Original Description
            </h2>
            <p className="text-zinc-300 leading-relaxed text-lg">
              {book.description}
            </p>
          </section>

          <div className="h-px border-b border-dashed border-zinc-800" />

          {/* AI Insights Section */}
          <section className="bg-gradient-to-br from-indigo-950/20 to-transparent border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
             {/* decorative blob */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
             
             <h2 className="font-outfit text-2xl font-bold text-white mb-8 flex items-center gap-3">
               <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                 ✨
               </span>
               AI Book Insights
             </h2>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm">
                 <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                   <Clock className="h-4 w-4 text-emerald-400" /> Quick Summary
                 </h3>
                 <p className="text-zinc-400 text-sm leading-relaxed">
                   {book.insights?.summary || "AI summary not generated yet for this book."}
                 </p>
               </div>
               
               <div className="flex flex-col gap-8">
                 <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm">
                   <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                     <Tag className="h-4 w-4 text-purple-400" /> Detected Genre
                   </h3>
                   <div className="flex flex-wrap gap-2">
                     {(book.insights?.genre || "Unknown").split(', ').map((g: string) => (
                       <span key={g} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs rounded-lg border border-zinc-700/50">{g}</span>
                     ))}
                   </div>
                 </div>

                 <div className="bg-black/40 border border-zinc-800/50 p-6 rounded-2xl backdrop-blur-sm">
                   <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                     📚 AI Recommendations
                   </h3>
                   <ul className="text-zinc-400 text-sm leading-relaxed space-y-2 list-disc list-inside">
                     {(book.insights?.recommendations || []).map((r: string) => (
                       <li key={r}>{r}</li>
                     ))}
                   </ul>
                 </div>
               </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
