
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, Language, User, StoreSettings, AITask } from '../types';

interface AnnaAssistantProps {
  language: Language;
  user: User | null;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  tasks: AITask[];
  onAddTask: (task: AITask) => void;
  onUpdateTask: (id: string, updates: Partial<AITask>) => void;
}

export const AnnaAssistant: React.FC<AnnaAssistantProps> = ({ 
  language, user, settings, onUpdateSettings, tasks, onAddTask, onUpdateTask 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Привет! Я Анна, ваш виртуальный помощник в GISI Market. Чем я могу помочь вам сегодня?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === 'admin';
  const annaAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Определение инструментов для администратора
  const tools: FunctionDeclaration[] = [
    {
      name: 'update_theme_color',
      description: 'Изменить основной цвет оформления (темы) сайта. Используйте этот инструмент, когда администратор просит сменить цвет.',
      parameters: {
        type: Type.OBJECT,
        properties: { 
          color: { type: Type.STRING, description: 'HEX код цвета, например #FF5733' } 
        },
        required: ['color']
      }
    },
    {
      name: 'update_store_name',
      description: 'Изменить название магазина. Используйте этот инструмент, когда администратор просит переименовать проект.',
      parameters: {
        type: Type.OBJECT,
        properties: { 
          name: { type: Type.STRING, description: 'Новое название магазина' } 
        },
        required: ['name']
      }
    },
    {
      name: 'update_currency',
      description: 'Изменить используемую валюту на сайте.',
      parameters: {
        type: Type.OBJECT,
        properties: { 
          currency: { type: Type.STRING, description: 'Код валюты, например USD, AMD, RUB' } 
        },
        required: ['currency']
      }
    }
  ];

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userMsg,
        config: {
          systemInstruction: `Ты Анна — экспертный консультант и ИИ-управляющий магазина электроники GISI Market. 
          Твоя цель: помогать покупателям с выбором и помогать администраторам настраивать сайт.
          
          ИНСТРУКЦИИ ДЛЯ ПОКУПАТЕЛЕЙ:
          - Будь вежливой, дружелюбной и профессиональной.
          - Отвечай только на вопросы, связанные с электроникой, покупками и работой магазина.
          - Если тебя просят сделать что-то, выходящее за рамки (например, написать код или стихи), мягко верни диалог к покупкам.
          
          ИНСТРУКЦИИ ДЛЯ АДМИНИСТРАТОРА (${isAdmin ? 'СЕЙЧАС ПИШЕТ АДМИНИСТРАТОР' : 'СЕЙЧАС ПИШЕТ ОБЫЧНЫЙ КЛИЕНТ'}):
          - Если пишет администратор, ты можешь использовать доступные инструменты для изменения настроек сайта.
          - Всегда подтверждай выполнение команды в чате.
          
          ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ.`,
          tools: isAdmin ? [{ functionDeclarations: tools }] : []
        }
      });

      if (response.functionCalls && isAdmin) {
        let executionSummary = "";
        
        for (const call of response.functionCalls) {
          if (call.name === 'update_theme_color' && call.args && typeof call.args.color === 'string') {
            onUpdateSettings({ ...settings, primaryColor: call.args.color });
            executionSummary += `Я обновила основной цвет темы на ${call.args.color}. `;
          }
          if (call.name === 'update_store_name' && call.args && typeof call.args.name === 'string') {
            onUpdateSettings({ ...settings, storeName: call.args.name });
            executionSummary += `Название магазина успешно изменено на "${call.args.name}". `;
          }
          if (call.name === 'update_currency' && call.args && typeof call.args.currency === 'string') {
            const newCurrency = call.args.currency.toUpperCase();
            onUpdateSettings({ ...settings, currency: newCurrency });
            executionSummary += `Валюта сайта изменена на ${newCurrency}. `;
          }
        }

        setMessages(prev => [...prev, { role: 'model', text: executionSummary || 'Команды выполнены.' }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: response.text || 'Простите, я не смогла обработать ваш запрос. Попробуйте еще раз.' }]);
      }
    } catch (error) {
      console.error("Anna AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Произошла ошибка связи с моим мозгом. Пожалуйста, попробуйте позже." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[1000]">
      {isOpen ? (
        <div className="bg-white/60 backdrop-blur-[40px] w-[380px] md:w-[420px] h-[600px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] rounded-[3rem] border border-white/80 flex flex-col overflow-hidden animate-zoom-in">
          
          {/* Header */}
          <div className="bg-[#1e2b6e] p-7 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={annaAvatar} className="w-12 h-12 rounded-full border-2 border-white/20 object-cover shadow-lg" alt="Anna" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-[#1e2b6e] rounded-full" />
              </div>
              <div className="flex flex-col">
                <h4 className="font-black text-lg tracking-tighter uppercase leading-none">АННА</h4>
                <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">В сети • ИИ Консультант</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6 hide-scrollbar flex flex-col" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {m.role === 'model' && (
                  <img src={annaAvatar} className="w-9 h-9 rounded-full border border-white/40 shadow-sm shrink-0 mt-1" alt="Anna" />
                )}
                <div className={`p-4 text-sm font-bold shadow-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-[#1e2b6e] text-white rounded-3xl rounded-tr-none' 
                    : 'bg-white/80 text-slate-800 border border-white/60 rounded-3xl rounded-tl-none'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
               <div className="flex gap-1.5 p-4 bg-white/40 w-fit rounded-2xl animate-pulse ml-12">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
               </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-8 pt-2">
            {isAdmin && (
              <div className="mb-4 px-4 py-2 bg-[#3BB19B]/10 rounded-xl border border-[#3BB19B]/20">
                <p className="text-[9px] font-black text-[#3BB19B] uppercase tracking-widest text-center">Режим администратора активен</p>
              </div>
            )}
            <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-full px-7 py-1.5 border border-white/80 shadow-xl group focus-within:ring-8 focus-within:ring-[#1e2b6e]/5 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isAdmin ? "Введите команду или вопрос..." : "Ваш вопрос Анне..."}
                className="w-full py-4 bg-transparent border-none outline-none text-[14px] font-bold text-slate-700 placeholder-slate-400"
              />
              <button 
                onClick={handleSend} 
                className="text-[#1e2b6e] p-2 hover:scale-125 transition-transform active:scale-95 disabled:opacity-30"
                disabled={!input.trim() || isTyping}
              >
                 <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                 </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Floating Button */
        <button 
          onClick={() => setIsOpen(true)} 
          className="w-20 h-20 bg-[#1e2b6e] rounded-[2.2rem] shadow-[0_25px_60px_-15px_rgba(30,43,110,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-500 group relative overflow-hidden"
        >
          <div className="absolute top-2 right-2 z-20 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full animate-pulse shadow-lg" />
          <img src={annaAvatar} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Anna" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
             <svg className="w-9 h-9 text-white drop-shadow-xl" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03-8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
          </div>
        </button>
      )}
    </div>
  );
};
