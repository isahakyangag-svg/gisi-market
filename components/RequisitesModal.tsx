
import React, { useState } from 'react';

interface RequisitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type RequisitesView = 'list' | 'add';

export const RequisitesModal: React.FC<RequisitesModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<RequisitesView>('list');
  const [reqName, setReqName] = useState('');
  const [account, setAccount] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('Armenia');

  if (!isOpen) return null;

  const renderListView = () => (
    <div className="p-10 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Реквизиты</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <button 
        onClick={() => setView('add')}
        className="w-full flex items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] group hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-400 group-hover:text-[#3BB19B] transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/></svg>
          </div>
          <span className="text-base font-bold text-slate-700">Добавить реквизиты</span>
        </div>
        <svg className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
      </button>

      <button 
        onClick={onClose}
        className="w-full py-5 bg-[#3BB19B] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-95"
      >
        Закрыть
      </button>
    </div>
  );

  const renderAddView = () => (
    <div className="p-10 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <button onClick={() => setView('list')} className="text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Добавить реквизиты</h2>
        <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Выберите страну банка</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <span className="text-xl">🇦🇲</span>
            </div>
            <select 
              value={country} 
              onChange={e => setCountry(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-sm outline-none focus:border-[#3BB19B] transition-all appearance-none cursor-pointer"
            >
              <option value="Armenia">Армения</option>
              <option value="Russia">Россия</option>
              <option value="USA">США</option>
            </select>
            <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Название реквизитов</label>
          <input 
            type="text" 
            value={reqName}
            onChange={e => setReqName(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-sm outline-none focus:border-[#3BB19B] transition-all"
            placeholder="Например: Моя карта ArCa"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Счёт получателя</label>
          <input 
            type="text" 
            value={account}
            onChange={e => setAccount(e.target.value.replace(/[^0-9]/g, ''))}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-sm outline-none focus:border-[#3BB19B] transition-all"
            placeholder="От 12 до 16 цифр"
            maxLength={16}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">ФИО (полностью)</label>
          <input 
            type="text" 
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-[1.2rem] font-bold text-sm outline-none focus:border-[#3BB19B] transition-all"
            placeholder="Иванов Иван Иванович"
          />
        </div>
      </div>

      <div className="pt-4">
        <button 
          onClick={onClose}
          className="w-full py-5 bg-[#3BB19B] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-95"
        >
          Добавить
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] min-h-[550px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in flex flex-col justify-center">
        {view === 'list' ? renderListView() : renderAddView()}
      </div>
    </div>
  );
};
