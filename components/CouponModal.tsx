
import React, { useState, useEffect } from 'react';
import { PromoCode, StoreSettings } from '../types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (promo: PromoCode) => void;
  settings: StoreSettings;
  editingPromo: PromoCode | null;
}

export const CouponModal: React.FC<CouponModalProps> = ({ isOpen, onClose, onSave, settings, editingPromo }) => {
  const [formData, setFormData] = useState<PromoCode>({
    id: '',
    code: '',
    discountValue: 0,
    type: 'percent',
    status: 'active',
    usedCount: 0,
    minOrderAmount: 0,
    usageLimit: 0,
    expiresAt: ''
  });

  useEffect(() => {
    if (editingPromo) {
      setFormData(editingPromo);
    } else {
      setFormData({
        id: 'promo-' + Date.now(),
        code: '',
        discountValue: 10,
        type: 'percent',
        status: 'active',
        usedCount: 0,
        minOrderAmount: 0,
        usageLimit: 100,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [editingPromo, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-xl animate-fade-in">
      <div className="bg-[#1e2b40] w-full max-w-lg rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col animate-zoom-in">
        <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">
              {editingPromo ? 'Редактировать купон' : 'Новый промокод'}
            </h3>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Настройка маркетинговых правил</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">✕</button>
        </div>

        <div className="p-10 space-y-6 overflow-y-auto max-h-[70vh] hide-scrollbar">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Код (латиница)</label>
            <input 
              type="text" 
              value={formData.code} 
              onChange={e => setFormData({...formData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '')})}
              className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-black tracking-widest outline-none focus:border-[#3BB19B]"
              placeholder="NEWYEAR2025"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Тип скидки</label>
              <select 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none appearance-none"
              >
                <option value="percent">Процент (%)</option>
                <option value="fixed">Фикс. сумма ({settings.currency})</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Значение</label>
              <input 
                type="number" 
                value={formData.discountValue}
                onChange={e => setFormData({...formData, discountValue: parseFloat(e.target.value)})}
                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-black outline-none focus:border-[#3BB19B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Мин. сумма заказа</label>
              <input 
                type="number" 
                value={formData.minOrderAmount}
                onChange={e => setFormData({...formData, minOrderAmount: parseFloat(e.target.value)})}
                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Лимит исп.</label>
              <input 
                type="number" 
                value={formData.usageLimit}
                onChange={e => setFormData({...formData, usageLimit: parseInt(e.target.value)})}
                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase ml-4 tracking-widest">Истекает (дата)</label>
            <input 
              type="date" 
              value={formData.expiresAt?.split('T')[0]}
              onChange={e => setFormData({...formData, expiresAt: e.target.value})}
              className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B]"
            />
          </div>

          <div className="pt-4 flex gap-3">
             <div className={`flex-grow p-4 rounded-2xl border ${formData.status === 'active' ? 'bg-[#3BB19B]/10 border-[#3BB19B]/30 text-[#3BB19B]' : 'bg-slate-800/50 border-white/5 text-slate-500'} transition-all cursor-pointer text-center`} onClick={() => setFormData({...formData, status: 'active'})}>
                <p className="text-[10px] font-black uppercase tracking-widest">Активен</p>
             </div>
             <div className={`flex-grow p-4 rounded-2xl border ${formData.status === 'expired' ? 'bg-rose-500/10 border-rose-500/30 text-rose-500' : 'bg-slate-800/50 border-white/5 text-slate-500'} transition-all cursor-pointer text-center`} onClick={() => setFormData({...formData, status: 'expired'})}>
                <p className="text-[10px] font-black uppercase tracking-widest">Истек / Пауза</p>
             </div>
          </div>
        </div>

        <div className="px-10 py-8 border-t border-white/5 bg-black/10 flex justify-end gap-4 shrink-0">
          <button onClick={onClose} className="px-8 py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Отмена</button>
          <button 
            onClick={() => {
              if(!formData.code) return alert('Введите код купона');
              onSave(formData);
            }} 
            className="px-12 py-4 bg-[#3BB19B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:scale-105 transition-all"
          >
            {editingPromo ? 'Сохранить изменения' : 'Создать купон'}
          </button>
        </div>
      </div>
    </div>
  );
};
