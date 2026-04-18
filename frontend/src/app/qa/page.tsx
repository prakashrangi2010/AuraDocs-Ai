'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, LibraryBig } from 'lucide-react';
import axios from 'axios';

export default function QAPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: 'assistant', text: 'Hello! I am Aura, your document intelligence assistant. You can ask me questions about any of the books in your library. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: messages.length + 1, role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Connect to backend RAG /qa endpoint
      const response = await axios.post('http://127.0.0.1:8000/api/qa/', { question: input });
      setMessages(prev => [
        ...prev, 
        { id: prev.length + 1, role: 'assistant', text: response.data.answer || 'No answer provided.' }
      ]);
    } catch (error) {
      console.error("Error querying RAG", error);
      setMessages(prev => [
        ...prev, 
        { id: prev.length + 1, role: 'assistant', text: "I'm sorry, my AI backend is currently unreachable. Make sure LM Studio or OpenAI is running!" }
      ]);
    } finally {
      setIsLoading(false);
    }
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
              <h1 className="font-outfit text-2xl font-bold text-white tracking-tight">Aura AI</h1>
              <p className="text-xs text-indigo-400 font-medium flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                RAG Pipeline Active
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-indigo-200/70 text-sm bg-indigo-500/10 px-4 py-2 rounded-full border border-indigo-500/20 font-medium tracking-wide">
            <LibraryBig className="h-4 w-4" /> Fully Indexed
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar relative z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent pointer-events-none" />
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                  {msg.role === 'user' ? <User className="h-5 w-5 text-zinc-400" /> : <Bot className="h-5 w-5" />}
                </div>
                <div className={`max-w-[75%] rounded-2xl p-5 leading-relaxed shadow-lg relative ${msg.role === 'user' ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-sm' : 'bg-black/60 backdrop-blur-md border border-indigo-500/20 text-zinc-300 rounded-tl-sm'}`}>
                  {msg.role === 'assistant' && (
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 pointer-events-none" />
                  )}
                  <span className="relative z-10">{msg.text}</span>
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

        {/* Input Area */}
        <div className="p-6 border-t border-white/5 bg-[#050511]/80 backdrop-blur-xl z-20">
          <form onSubmit={handleSend} className="relative flex items-end gap-3 bg-black/60 ring-1 ring-white/10 rounded-2xl p-2 focus-within:ring-indigo-500/50 shadow-2xl transition-all">
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your library... (e.g. 'What is the genre?')"
              className="w-full bg-transparent resize-none max-h-32 p-3 outline-none text-zinc-200 placeholder:text-zinc-600 custom-scrollbar text-lg"
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
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
              <Send className="h-5 w-5 translate-x-[-1px] translate-y-[1px]" />
            </button>
          </form>
          <div className="text-center mt-3 text-xs text-indigo-300/50 font-medium">
            Aura AI can hallucinate. Cross-reference generated answers with source material.
          </div>
        </div>
      </div>
    </div>
  );
}
