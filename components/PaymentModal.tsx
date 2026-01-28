
import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentView = 'list' | 'add_card';

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<PaymentView>('list');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) return parts.join(' ');
    return value;
  };

  const renderListView = () => (
    <div className="p-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Способы оплаты</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <button 
        onClick={() => setView('add_card')}
        className="w-full flex items-center justify-between p-6 bg-white/50 backdrop-blur-sm rounded-[1.8rem] group hover:bg-white transition-all border border-white shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-[#3BB19B] transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>
          </div>
          <span className="text-base font-bold text-slate-700">Привязать карту</span>
        </div>
        <svg className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
      </button>

      <button 
        onClick={onClose}
        className="w-full py-5 bg-[#3BB19B] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-95"
      >
        Закрыть
      </button>
    </div>
  );

  const renderAddCardView = () => (
    <div className="p-10 space-y-10 animate-fade-in">
      {/* Шапка модального окна */}
      <div className="flex items-center justify-between">
        <button onClick={() => setView('list')} className="p-2 text-slate-300 hover:text-[#3BB19B] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Привязка карты</h2>
        <button onClick={onClose} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      {/* Логотипы платежных систем в стиле макета */}
      <div className="flex flex-wrap items-center gap-5 py-2 px-1">
        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-4 opacity-80" alt="Visa" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6 opacity-80" alt="Mastercard" />
        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-4 opacity-80" alt="Paypal" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ArCa</span>
        <span className="text-[10px] font-black text-[#00a651] uppercase tracking-tighter">МИР</span>
      </div>

      {/* Форма с эффектом Glassmorphism */}
      <div className="space-y-6">
        <div className="group relative">
          <input 
            type="text" 
            placeholder="Номер карты"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className="w-full p-6 bg-white/40 backdrop-blur-md border border-white/80 rounded-[1.8rem] font-bold text-lg outline-none focus:border-[#3BB19B] transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
           <input 
            type="text" 
            placeholder="ММ/ГГ"
            value={expiry}
            maxLength={5}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full p-6 bg-white/40 backdrop-blur-md border border-white/80 rounded-[1.8rem] font-bold text-lg outline-none focus:border-[#3BB19B] transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
          />
           <div className="relative">
             <input 
              type="password" 
              placeholder="CVV/CVC"
              value={cvv}
              maxLength={3}
              onChange={(e) => setCvv(e.target.value)}
              className="w-full p-6 bg-white/40 backdrop-blur-md border border-white/80 rounded-[1.8rem] font-bold text-lg outline-none focus:border-[#3BB19B] transition-all shadow-sm placeholder:text-slate-400 text-slate-800"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2.5"/></svg>
            </div>
           </div>
        </div>
      </div>

      {/* Кнопка с градиентом и футер */}
      <div className="space-y-8 pt-4">
        <button 
          onClick={onClose}
          className="w-full py-6 bg-gradient-to-r from-[#3BB19B] to-[#4ade80] text-white rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-100 transition-all hover:scale-[1.03] active:scale-95 hover:brightness-110"
        >
          Привязать
        </button>
        
        <div className="flex items-center justify-center gap-3 text-slate-400">
          <svg className="w-5 h-5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="2.5"/></svg>
          <span className="text-[10px] font-black uppercase tracking-[0.1em] opacity-60">Данные карты надёжно защищены</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      {/* Стеклянная панель */}
      <div className="relative bg-white/60 backdrop-blur-[40px] w-full max-w-[500px] rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-white/80 overflow-hidden animate-zoom-in">
        {view === 'list' ? renderListView() : renderAddCardView()}
      </div>
    </div>
  );
};
