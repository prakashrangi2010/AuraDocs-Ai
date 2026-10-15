'use client';

import { use, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Star, Heart, Share2, BookOpen, Clock, Tag, 
  Sparkles, MessageSquare, Sun, Moon, Type, ExternalLink, 
  Bookmark, Send, Loader2, Bot, User, AlignLeft, Check, Compass
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

// Sample curated chapter text for public domain classics
const BOOK_CHAPTERS_DATA: Record<string, { title: string; chapters: { number: number; title: string; text: string }[] }> = {
  "Pride and Prejudice": {
    title: "Pride and Prejudice",
    chapters: [
      {
        number: 1,
        title: "Chapter 1",
        text: `It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.\n\nHowever little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.\n\n"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"\n\nMr. Bennet replied that he had not.\n\n"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."\n\nMr. Bennet made no answer.\n\n"Do you not want to know who has taken it?" cried his wife impatiently.\n\n"You want to tell me, and I have no objection to hearing it."\n\nThis was invitation enough.`
      },
      {
        number: 2,
        title: "Chapter 2",
        text: `Mr. Bennet was among the earliest of those who waited on Mr. Bingley. He had always intended to visit him, though to the last always assuring his wife that he should not go; and till the evening after the visit was paid she had no knowledge of it. It was then disclosed in the following manner.\n\nObserving his second daughter employed in trimming a hat, he suddenly addressed her with:\n\n"I hope Mr. Bingley will like it, Lizzy."\n\n"We are not in a position to know what Mr. Bingley likes," said her mother resentfully, "since we are not to visit."\n\n"But you forget, mamma," said Elizabeth, "that we shall meet him at the assemblies, and that Mrs. Long promised to introduce him."\n\n"I do not believe Mrs. Long will do any such thing. She has two nieces of her own. She is a selfish, hypocritical woman, and I have no opinion of her."`
      },
      {
        number: 3,
        title: "Chapter 3",
        text: `Not all that Mrs. Bennet, however with the assistance of her five daughters, could ask on the subject, was sufficient to draw from her husband any satisfactory description of Mr. Bingley. They attacked him in various ways—with barefaced questions, ingenious suppositions, and distant surmises; but he eluded the skill of them all, and they were at last obliged to accept the second-hand intelligence of their neighbour Lady Lucas.\n\nHer report was highly favourable. Sir William had been delighted with him. He was quite young, wonderfully handsome, extremely agreeable, and, to crown the whole, he meant to be at the next assembly with a large party.`
      }
    ]
  },
  "Frankenstein": {
    title: "Frankenstein",
    chapters: [
      {
        number: 1,
        title: "Letter I",
        text: `To Mrs. Saville, England.\nSt. Petersburgh, Dec. 11th, 17--.\n\nYou will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.\n\nI am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling? This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes.`
      },
      {
        number: 2,
        title: "Chapter 1",
        text: `I am by birth a Genevese, and my family is one of the most distinguished of that republic. My ancestors had been for many years counsellors and syndics, and my father had served several public offices with honour and reputation. He was respected by all who knew him for his integrity and indefatigable attention to public business.\n\nHe passed his younger days always occupied by the affairs of his country; several circumstances had prevented his marrying early, nor was it until the decline of life that he became a husband and the father of a family.`
      }
    ]
  },
  "The Great Gatsby": {
    title: "The Great Gatsby",
    chapters: [
      {
        number: 1,
        title: "Chapter 1",
        text: `In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\n"Whenever you feel like criticizing any one," he told me, "just remember that all the people in this world haven't had the advantages that you've had."\n\nHe didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence, I'm inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores.\n\nThe abnormal mind is quick to detect and attach itself to this quality when it appears in a normal person.`
      }
    ]
  },
  "Dracula": {
    title: "Dracula",
    chapters: [
      {
        number: 1,
        title: "Chapter 1 - Jonathan Harker's Journal",
        text: `3 May. Bistritz.—Left Munich at 8:35 P. M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.\n\nWe left in good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale. I had for dinner, or rather supper, a chicken done up some way with red pepper, which was very good but thirsty. (Mem., get recipe for Mina.)\n\nThe impression I had was that we were leaving the West and entering the East.`
      }
    ]
  },
  "The Adventures of Sherlock Holmes": {
    title: "The Adventures of Sherlock Holmes",
    chapters: [
      {
        number: 1,
        title: "A Scandal in Bohemia",
        text: `To Sherlock Holmes she is always the woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex. It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind.\n\nHe was, I take it, the most perfect reasoning and observing machine that the world has seen, but as a lover he would have placed himself in a false position.\n\nHe never spoke of the softer passions, save with a gibe and a sneer. They were admirable things for the observer—excellent for drawing the veil from men's motives and actions.`
      }
    ]
  },
  "The Art of War": {
    title: "The Art of War",
    chapters: [
      {
        number: 1,
        title: "Chapter I: Laying Plans",
        text: `1. Sun Tzu said: The art of war is of vital importance to the State.\n2. It is a matter of life and death, a road either to safety or to ruin. Hence it is a subject of inquiry which can on no account be neglected.\n3. The art of war, then, is governed by five constant factors, all to be taken into account in one's deliberations, when seeking to determine the conditions obtaining in the field.\n4. These are: (1) The Moral Law; (2) Heaven; (3) Earth; (4) The Commander; (5) Method and discipline.\n5. The Moral Law causes the people to be in complete accord with their ruler, so that they will follow him regardless of their lives, undismayed by any danger.`
      }
    ]
  }
};

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tab State: 'read' | 'insights' | 'chat'
  const [activeTab, setActiveTab] = useState<'read' | 'insights' | 'chat'>('read');

  // Reader Customization State
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'light' | 'midnight'>('dark');
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl' | '2xl'>('lg');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Inline AI Assistant State
  const [inlineMessages, setInlineMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    { role: 'assistant', text: 'Hi! I am Aura. Ask me any questions about this book!' }
  ]);
  const [inlineInput, setInlineInput] = useState('');
  const [isInlineLoading, setIsInlineLoading] = useState(false);

  const readerRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/books/${resolvedParams.id}/`);
        setBook(response.data);
      } catch (error) {
        console.error("Error fetching book", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [resolvedParams.id]);

  // Track Reader scroll percentage
  const handleScroll = () => {
    if (readerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = readerRef.current;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.round((scrollTop / totalScroll) * 100));
        setScrollProgress(currentProgress);
      }
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [inlineMessages, isInlineLoading]);

  // Handle Inline Book AI Query
  const handleSendInlineQuery = async (queryText: string) => {
    if (!queryText.trim() || isInlineLoading) return;

    const userText = queryText.trim();
    setInlineMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInlineInput('');
    setIsInlineLoading(true);

    try {
      const promptWithContext = `Regarding the book "${book?.title}" by ${book?.author}:\n${userText}`;
      const resp = await axios.post(`${API_BASE_URL}/api/qa/`, { question: promptWithContext });
      setInlineMessages(prev => [
        ...prev,
        { role: 'assistant', text: resp.data.answer || "I don't have enough details to answer that specific question." }
      ]);
    } catch (err) {
      setInlineMessages(prev => [
        ...prev,
        { role: 'assistant', text: "Sorry, I couldn't reach the AI engine right now. Please make sure the backend is active." }
      ]);
    } finally {
      setIsInlineLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 container mx-auto px-6 py-20 flex flex-col justify-center items-center gap-4">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
        <p className="text-zinc-400 font-medium text-sm">Loading book content & AI environment...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex-1 container mx-auto px-6 py-20 text-center text-zinc-400">
        <p className="text-xl mb-4">Book not found in library.</p>
        <Link href="/" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium inline-block">
          Return to Library
        </Link>
      </div>
    );
  }

  // Get curated or generated chapter data
  const bookDataEntry = BOOK_CHAPTERS_DATA[book.title] || {
    title: book.title,
    chapters: [
      {
        number: 1,
        title: "Full Work / Overview",
        text: book.description 
          ? `${book.description}\n\nThis classic work is available in full public domain archives. Use the Gutenberg or Open Library links below to read the complete unmodified manuscript.`
          : "Full manuscript text loading..."
      },
      {
        number: 2,
        title: "Historical Context & Themes",
        text: `${book.title} by ${book.author} stands as an important work in literary history. It explores key human themes, socio-cultural observations, and timeless storytelling.`
      }
    ]
  };

  const currentChapter = bookDataEntry.chapters[activeChapterIndex] || bookDataEntry.chapters[0];

  // Theme styling rules
  const themeClasses = {
    dark: {
      bg: 'bg-[#09090b]',
      card: 'bg-zinc-900/90 border-zinc-800',
      text: 'text-zinc-200',
      muted: 'text-zinc-400',
      accent: 'indigo'
    },
    sepia: {
      bg: 'bg-[#fbf0d9]',
      card: 'bg-[#f2e5c8] border-[#e2d4b4]',
      text: 'text-[#36291a]',
      muted: 'text-[#6b5742]',
      accent: 'amber'
    },
    light: {
      bg: 'bg-white',
      card: 'bg-zinc-50 border-zinc-200',
      text: 'text-zinc-900',
      muted: 'text-zinc-600',
      accent: 'indigo'
    },
    midnight: {
      bg: 'bg-[#0b132b]',
      card: 'bg-[#1c2541] border-[#29324e]',
      text: 'text-[#e0e1dd]',
      muted: 'text-[#a3a8b7]',
      accent: 'blue'
    }
  }[readerTheme];

  // Typography font size rules
  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose',
    '2xl': 'text-2xl leading-loose'
  }[fontSize];

  // Typography font family rules
  const fontFamilyClass = {
    serif: 'font-serif',
    sans: 'font-sans',
    mono: 'font-mono'
  }[fontFamily];

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-zinc-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-lg line-clamp-1 flex items-center gap-2">
              <span>{book.title}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-normal border border-indigo-500/30">
                {book.author}
              </span>
            </h1>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          <button 
            onClick={() => setActiveTab('read')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'read' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <BookOpen className="h-3.5 w-3.5" /> Read Book
          </button>
          <button 
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'insights' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Insights
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Ask AI
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* TAB 1: READ BOOK READER MODE */}
        {activeTab === 'read' && (
          <div className={`flex-1 flex flex-col ${themeClasses.bg} transition-colors duration-300`}>
            {/* Reading Progress Indicator Bar */}
            <div className="w-full bg-zinc-800/40 h-1">
              <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
            </div>

            {/* Customization Toolbar */}
            <div className={`px-6 py-3 border-b ${themeClasses.card} flex flex-wrap items-center justify-between gap-4 text-xs`}>
              {/* Chapter Select */}
              <div className="flex items-center gap-2">
                <span className={`${themeClasses.muted} font-medium flex items-center gap-1`}>
                  <AlignLeft className="h-3.5 w-3.5" /> Chapter:
                </span>
                <select 
                  value={activeChapterIndex}
                  onChange={(e) => setActiveChapterIndex(Number(e.target.value))}
                  className={`bg-black/30 border ${themeClasses.card} ${themeClasses.text} px-3 py-1.5 rounded-lg outline-none font-medium cursor-pointer`}
                >
                  {bookDataEntry.chapters.map((ch, idx) => (
                    <option key={idx} value={idx} className="bg-zinc-900 text-white">
                      {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Toggle */}
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                <button 
                  onClick={() => setReaderTheme('dark')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${readerTheme === 'dark' ? 'bg-zinc-800 text-white shadow' : themeClasses.muted}`}
                  title="Dark Theme"
                >
                  <Moon className="h-3 w-3" /> Dark
                </button>
                <button 
                  onClick={() => setReaderTheme('sepia')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${readerTheme === 'sepia' ? 'bg-[#e5d5b7] text-[#2c2013] font-bold shadow' : themeClasses.muted}`}
                  title="Sepia Vintage Theme"
                >
                  <BookOpen className="h-3 w-3" /> Sepia
                </button>
                <button 
                  onClick={() => setReaderTheme('light')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${readerTheme === 'light' ? 'bg-white text-zinc-900 font-bold shadow' : themeClasses.muted}`}
                  title="Light Theme"
                >
                  <Sun className="h-3 w-3" /> Light
                </button>
                <button 
                  onClick={() => setReaderTheme('midnight')}
                  className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${readerTheme === 'midnight' ? 'bg-[#1c2541] text-white font-bold shadow' : themeClasses.muted}`}
                  title="Midnight Theme"
                >
                  <Compass className="h-3 w-3" /> Midnight
                </button>
              </div>

              {/* Font Family & Size Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Type className={`h-3.5 w-3.5 ${themeClasses.muted}`} />
                  <button 
                    onClick={() => setFontFamily('serif')}
                    className={`px-2 py-1 rounded ${fontFamily === 'serif' ? 'bg-indigo-600 text-white font-serif' : themeClasses.muted}`}
                  >
                    Serif
                  </button>
                  <button 
                    onClick={() => setFontFamily('sans')}
                    className={`px-2 py-1 rounded ${fontFamily === 'sans' ? 'bg-indigo-600 text-white font-sans' : themeClasses.muted}`}
                  >
                    Sans
                  </button>
                  <button 
                    onClick={() => setFontFamily('mono')}
                    className={`px-2 py-1 rounded ${fontFamily === 'mono' ? 'bg-indigo-600 text-white font-mono' : themeClasses.muted}`}
                  >
                    Mono
                  </button>
                </div>

                <div className="h-4 w-px bg-zinc-700/40" />

                <div className="flex items-center gap-1">
                  {(['sm', 'base', 'lg', 'xl', '2xl'] as const).map((sz) => (
                    <button 
                      key={sz}
                      onClick={() => setFontSize(sz)}
                      className={`w-6 h-6 rounded flex items-center justify-center font-bold transition-all ${fontSize === sz ? 'bg-indigo-600 text-white' : themeClasses.muted}`}
                    >
                      {sz === 'sm' ? 'A-' : sz === '2xl' ? 'A+' : 'A'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Book Reader Viewport */}
            <div 
              ref={readerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-6 py-12 custom-scrollbar flex justify-center"
            >
              <div className="max-w-3xl w-full flex flex-col gap-8">
                {/* Book Header Inside Reader */}
                <div className="text-center border-b border-zinc-800/40 pb-8">
                  <h2 className="text-3xl font-extrabold tracking-tight mb-2">{currentChapter.title}</h2>
                  <p className={`${themeClasses.muted} text-sm font-medium`}>
                    {book.title} • {book.author}
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-4 text-xs">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
                      📖 {scrollProgress}% Read
                    </span>
                    <span className={`px-3 py-1 rounded-full border ${themeClasses.card} ${themeClasses.muted}`}>
                      ⏱️ ~5 min chapter read
                    </span>
                  </div>
                </div>

                {/* Chapter Text Body */}
                <div className={`whitespace-pre-line ${fontFamilyClass} ${fontSizeClass} ${themeClasses.text} tracking-wide space-y-6`}>
                  {currentChapter.text}
                </div>

                {/* Chapter Bottom Navigation & External Links */}
                <div className="mt-12 pt-8 border-t border-zinc-800/40 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button 
                      disabled={activeChapterIndex === 0}
                      onClick={() => setActiveChapterIndex(prev => Math.max(0, prev - 1))}
                      className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-800 text-xs font-semibold"
                    >
                      ← Previous Chapter
                    </button>
                    <button 
                      disabled={activeChapterIndex >= bookDataEntry.chapters.length - 1}
                      onClick={() => setActiveChapterIndex(prev => Math.min(bookDataEntry.chapters.length - 1, prev + 1))}
                      className="px-4 py-2 rounded-xl bg-indigo-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-indigo-500 text-xs font-semibold shadow-lg"
                    >
                      Next Chapter →
                    </button>
                  </div>

                  {book.url && (
                    <a 
                      href={book.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-indigo-300 text-xs font-semibold flex items-center gap-2 border border-zinc-700/50"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Read Full eBook Source (Gutenberg / Google)
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: AI INSIGHTS & OVERVIEW */}
        {activeTab === 'insights' && (
          <div className="flex-1 overflow-y-auto p-8 container mx-auto max-w-4xl custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="md:col-span-1">
                <div className="aspect-[2/3] bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative mb-4">
                  {book.cover_image_url ? (
                    <img src={book.cover_image_url} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-3 p-6 text-center">
                      <BookOpen className="h-12 w-12 stroke-[1.5]" />
                      <span className="text-xs">No Cover Available</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between px-2 text-sm text-zinc-400">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-4 w-4 fill-amber-400" /> {book.rating || "4.8"}
                  </span>
                  <span>Public Domain / Free API</span>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl font-extrabold text-white mb-2">{book.title}</h1>
                  <p className="text-lg text-indigo-400 font-medium mb-6">By {book.author}</p>
                  
                  <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl mb-6">
                    <h3 className="text-sm uppercase font-bold text-zinc-400 mb-3 flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-indigo-400" /> Plot & Overview
                    </h3>
                    <p className="text-zinc-300 leading-relaxed text-sm">
                      {book.description || "No detailed overview provided."}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setActiveTab('read')}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <BookOpen className="h-4 w-4" /> Start Reading Now
                  </button>
                  <button 
                    onClick={() => setActiveTab('chat')}
                    className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageSquare className="h-4 w-4 text-indigo-400" /> Ask AI Companion
                  </button>
                </div>
              </div>
            </div>

            {/* AI Insights Block */}
            <div className="bg-gradient-to-br from-indigo-950/30 to-purple-950/20 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" /> AI Book Intelligence
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/50 border border-zinc-800/80 p-5 rounded-2xl">
                  <h4 className="text-xs uppercase font-bold text-indigo-300 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-400" /> Summary
                  </h4>
                  <p className="text-zinc-300 text-xs leading-relaxed">
                    {book.insights?.summary || `${book.title} is a classic work exploring key human themes and timeless narratives.`}
                  </p>
                </div>

                <div className="bg-black/50 border border-zinc-800/80 p-5 rounded-2xl">
                  <h4 className="text-xs uppercase font-bold text-indigo-300 mb-2 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-purple-400" /> Genre
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {(book.insights?.genre || "Classic Literature, Fiction").split(', ').map((g: string) => (
                      <span key={g} className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20 font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INLINE AI ASSISTANT CHAT */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-zinc-950 max-w-4xl mx-auto w-full border-x border-zinc-800/50">
            {/* AI Chat Header */}
            <div className="p-4 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Aura AI Book Companion</h3>
                  <p className="text-xs text-indigo-400">Ask anything about "{book.title}"</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                RAG Context Active
              </span>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 custom-scrollbar">
              {inlineMessages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${msg.role === 'user' ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-indigo-600 text-white'}`}>
                    {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {isInlineLoading && (
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-xs text-zinc-400 flex items-center gap-2">
                    Analyzing book text & Supabase library...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-6 py-2 bg-zinc-900/40 border-t border-zinc-800 flex items-center gap-2 overflow-x-auto custom-scrollbar">
              <span className="text-xs text-indigo-400 font-semibold flex-shrink-0 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Prompts:
              </span>
              {[
                `Summarize key themes of ${book.title}`,
                `Who are the main characters in ${book.title}?`,
                `What is the central conflict in this story?`,
                `Explain the historical impact of this book.`
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendInlineQuery(p)}
                  className="text-xs px-3 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 rounded-full flex-shrink-0 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendInlineQuery(inlineInput);
              }}
              className="p-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center gap-3"
            >
              <input 
                type="text"
                value={inlineInput}
                onChange={(e) => setInlineInput(e.target.value)}
                placeholder={`Ask Aura about ${book.title}...`}
                className="flex-1 bg-black/60 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
              <button 
                type="submit"
                disabled={!inlineInput.trim() || isInlineLoading}
                className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm disabled:opacity-50 flex items-center gap-2 shadow-lg"
              >
                <Send className="h-4 w-4" /> Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
