
import React, { useState, useRef, useEffect } from 'react';
import { askQuantumAssistant } from '../services/geminiService';
import { Language } from '../types';

const QuantumAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [chat, setChat] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat]);

  const handleSend = async () => {
    if (!query.trim()) return;
    const userMsg = query;
    setQuery('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askQuantumAssistant(userMsg);
    setChat(prev => [...prev, { role: 'bot', text: response || 'No response' }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1050]">
      {isOpen ? (
        <div className="glass-panel w-80 md:w-96 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-500 border border-zinc-200 dark:border-white/10">
          <div className="bg-zinc-900 dark:bg-white p-5 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <h3 className="text-white dark:text-black font-bold text-xs uppercase tracking-widest font-display">Quantum Consultant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/50 dark:text-black/50 hover:text-white dark:hover:text-black transition-colors interactive">
              <iconify-icon icon="solar:close-circle-linear" width="20"></iconify-icon>
            </button>
          </div>
          
          <div ref={scrollRef} className="h-80 overflow-y-auto p-5 space-y-4 bg-transparent">
            {chat.length === 0 && (
              <div className="text-zinc-500 text-xs text-center py-10 font-mono uppercase tracking-tight">
                IDENTIFICATION REQUIRED. <br/> ASK A QUANTUM INQUIRY.
              </div>
            )}
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed ${
                  msg.role === 'user' 
                  ? 'bg-cyan-500/10 dark:bg-cyan-500/10 text-zinc-900 dark:text-cyan-400 border border-cyan-500/20' 
                  : 'bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-zinc-300 border border-zinc-200 dark:border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 dark:bg-white/5 rounded-2xl px-4 py-3 text-xs border border-zinc-200 dark:border-white/5 text-zinc-500 font-mono animate-pulse uppercase tracking-tight">
                  SYNTHESIZING...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-white/10 flex space-x-2">
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query protocol..."
              className="flex-1 bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-full px-4 py-2 text-xs dark:text-white focus:outline-none focus:border-cyan-500 transition-colors interactive font-mono"
            />
            <button 
              onClick={handleSend}
              disabled={loading}
              className="bg-zinc-900 dark:bg-white text-white dark:text-black p-2 rounded-full disabled:opacity-50 transition-colors interactive"
            >
              <iconify-icon icon="solar:arrow-right-linear" width="18"></iconify-icon>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-zinc-900 dark:bg-white text-white dark:text-black p-5 rounded-full shadow-2xl hover:scale-110 transition-all group interactive"
        >
          <iconify-icon icon="solar:chat-round-dots-linear" width="24" className="group-hover:rotate-12 transition-transform"></iconify-icon>
        </button>
      )}
    </div>
  );
};

export default QuantumAssistant;
