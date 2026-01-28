
import React, { useState } from 'react';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amount: number) => void;
  currency: string;
}

type ModalView = 'amount' | 'payment_method';

export const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSuccess, currency }) => {
  const [view, setView] = useState<ModalView>('amount');
  const [amount, setAmount] = useState<string>('1000');
  const quickAmounts = [1000, 5000, 10000, 20000];

  if (!isOpen) return null;

  const handleNextStep = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Пожалуйста, введите корректную сумму');
      return;
    }
    setView('payment_method');
  };

  const handleFinalPay = () => {
    const numAmount = parseFloat(amount);
    onSuccess(numAmount);
    setAmount('1000');
    setView('amount');
    onClose();
  };

  const renderAmountView = () => (
    <div className="p-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">Пополнить баланс</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-6">
        {/* Поле ввода как на скриншоте */}
        <div className="relative bg-slate-50/50 rounded-[1.8rem] p-8 border border-slate-100/50 group focus-within:bg-white focus-within:shadow-inner transition-all">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent font-black text-4xl text-slate-900 outline-none text-left"
          />
          <span className="absolute right-8 top-1/2 -translate-y-1/2 font-black text-slate-300 uppercase tracking-widest text-sm">
            {currency === 'AMD' ? 'AMD' : currency}
          </span>
        </div>

        {/* Сетка быстрого выбора */}
        <div className="grid grid-cols-2 gap-4">
          {quickAmounts.map((q) => (
            <button 
              key={q}
              onClick={() => setAmount(q.toString())}
              className="py-5 bg-slate-50/50 hover:bg-white border border-transparent hover:border-[#3BB19B]/20 rounded-[1.5rem] text-[12px] font-black text-slate-500 hover:text-[#3BB19B] transition-all uppercase tracking-widest shadow-sm"
            >
              + {q.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6 pt-4 text-center">
        <button 
          onClick={handleNextStep}
          className="w-full py-6 bg-[#3BB19B] text-white rounded-[1.8rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Перейти к оплате
        </button>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Безопасная оплата через шлюз Gisi Pay</p>
      </div>
    </div>
  );

  const renderPaymentMethodView = () => (
    <div className="p-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <button onClick={() => setView('amount')} className="text-slate-300 hover:text-[#3BB19B] transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic text-center">Оплата: {parseFloat(amount).toLocaleString()} {currency}</h2>
        <div className="w-6" /> {/* Spacer */}
      </div>

      <div className="space-y-4">
        {/* Привязанная карта */}
        <button 
          onClick={handleFinalPay}
          className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.8rem] hover:border-[#3BB19B] hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 10h18M7 15h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" strokeWidth="2"/></svg>
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Основная карта</p>
              <p className="text-sm font-black text-slate-900">•••• 4242</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#3BB19B] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Выбрать</span>
        </button>

        {/* Idram */}
        <button 
          onClick={handleFinalPay}
          className="w-full flex items-center justify-between p-6 bg-white border border-slate-100 rounded-[1.8rem] hover:border-[#FF7F00] hover:shadow-lg transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#FF7F00]/5 rounded-2xl flex items-center justify-center text-[#FF7F00] font-black italic">
              id
            </div>
            <div className="text-left">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Электронный кошелек</p>
              <p className="text-sm font-black text-slate-900">Idram / Rocket Line</p>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#FF7F00] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Выбрать</span>
        </button>

        {/* Другая карта */}
        <button 
          onClick={handleFinalPay}
          className="w-full flex items-center justify-between p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-[1.8rem] hover:bg-white hover:border-slate-400 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeWidth="3"/></svg>
            </div>
            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Другая карта</span>
          </div>
        </button>
      </div>

      <div className="pt-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-4 opacity-30 grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
          <span className="text-[10px] font-black">МИР</span>
          <span className="text-[10px] font-black">ArCa</span>
        </div>
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Комиссия 0%</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[480px] rounded-[3rem] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden animate-zoom-in">
        {view === 'amount' ? renderAmountView() : renderPaymentMethodView()}
      </div>
    </div>
  );
};
