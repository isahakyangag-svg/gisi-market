
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { chatWithAssistant } from '../services/geminiService';
import { ChatMessage, Language } from '../types';

interface AIAssistantProps {
  language: Language;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: language === 'hy' ? 'Բարև: Ես Նովան եմ՝ Ձեր AI օգնականը:' : language === 'ru' ? 'Привет! Я Нова, ваш AI-помощник.' : 'Hi! I’m Nova, your AI assistant.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatWithAssistant([], userMsg, language);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Error" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-[350px] md:w-[400px] h-[550px] shadow-2xl rounded-3xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
          <div className="bg-indigo-600 p-5 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">N</div>
              <div>
                <h4 className="font-bold leading-none">Nova AI</h4>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-5 space-y-4 hide-scrollbar bg-slate-50" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 text-sm rounded-2xl shadow-sm ${
                  m.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-slate-900 border border-slate-100 rounded-bl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
              <button onClick={handleSend} className="absolute right-2 p-2 text-indigo-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
            </div>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
      )}
    </div>
  );
};
