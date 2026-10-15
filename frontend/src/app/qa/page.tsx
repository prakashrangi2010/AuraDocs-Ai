'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, LibraryBig, BookCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  sources?: string[];
}

export default function QAPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'assistant', text: 'Hello! I am Aura, your document intelligence assistant. Ask me anything about the classic books or uploaded materials in your library!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    "What are the central themes of Pride and Prejudice?",
    "Summarize Frankenstein and its main moral dilemma.",
    "Who is Jay Gatsby and what does he desire?",
    "What strategies are outlined in Sun Tzu's The Art of War?"
  ];

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendQuery = async (questionText: string) => {
    if (!questionText.trim()) return;

    const userMessage: Message = { id: messages.length + 1, role: 'user', text: questionText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/qa/`, { question: questionText });
      const ansData = response.data;
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 1, 
          role: 'assistant', 
          text: ansData.answer || 'No answer provided.',
          sources: ansData.sources || []
        }
      ]);
    } catch (error) {
      console.error("Error querying RAG", error);
      setMessages(prev => [
        ...prev, 
        { 
          id: prev.length + 1, 
          role: 'assistant', 
          text: "I'm processing your query using Supabase vector context. Make sure your backend API is connected."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 py-6 pb-0 relative z-10">
      <div className="w-full max-w-4xl flex-1 glass-panel rounded-t-[2rem] overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-6 border-b border-white/5 bg-black/40 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <div className="absolute inset-0 bg-white/20 rounded-2xl pointer-events-none" />
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-outfit text-2xl font-bold text-white tracking-tight">Aura AI Assistant</h1>
              <p className="text-xs text-indigo-400 font-medium flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                RAG Pipeline + Supabase Vector Store Active
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-indigo-200/70 text-sm bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 font-medium tracking-wide">
            <LibraryBig className="h-4 w-4" /> Multi-Document RAG
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none" />
          
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                  {msg.role === 'user' ? <User className="h-5 w-5 text-zinc-400" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl p-5 leading-relaxed shadow-lg relative ${msg.role === 'user' ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-sm' : 'bg-black/60 backdrop-blur-md border border-indigo-500/20 text-zinc-200 rounded-tl-sm'}`}>
                  <span className="relative z-10 whitespace-pre-line">{msg.text}</span>
                  
                  {/* Sources Attribution */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs text-indigo-300">
                      <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                        <BookCheck className="h-3.5 w-3.5" /> Referenced Sources:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((src, i) => (
                          <span key={i} className="bg-indigo-500/20 border border-indigo-500/30 px-2.5 py-1 rounded-md text-[11px] font-medium text-indigo-200">
                            📖 {src}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
                <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
              </div>
              <div className="bg-black/50 border border-zinc-800 rounded-2xl rounded-tl-none p-4 flex gap-1 items-center h-12">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4 w-full flex-shrink-0" />
        </div>

        {/* Preset Sample Prompts */}
        <div className="px-6 py-2 bg-black/40 border-t border-white/5 flex items-center gap-2 overflow-x-auto custom-scrollbar">
          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1 flex-shrink-0">
            <Sparkles className="h-3.5 w-3.5" /> Quick Prompts:
          </span>
          {sampleQuestions.map((q, i) => (
            <button 
              key={i}
              onClick={() => handleSendQuery(q)}
              className="text-xs bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 rounded-full px-3 py-1 flex-shrink-0 transition-all hover:scale-[1.02]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#050511]/80 backdrop-blur-xl z-20">
          <form onSubmit={handleSend} className="relative flex items-end gap-3 bg-black/60 ring-1 ring-white/10 rounded-2xl p-2 focus-within:ring-indigo-500/50 shadow-2xl transition-all">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your library... (e.g. 'Compare Pride and Prejudice with Frankenstein')"
              className="w-full bg-transparent resize-none max-h-32 p-3 outline-none text-zinc-200 placeholder:text-zinc-600 custom-scrollbar text-base"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1 mr-1 relative overflow-hidden group"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

