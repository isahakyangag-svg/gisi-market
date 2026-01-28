
import React, { useState, useMemo } from 'react';
import { CartItem, PromoCode, User, Language, StoreSettings } from '../types';
import { Button } from './Button';

interface CartPageProps {
  items: CartItem[];
  user: User | null;
  settings: StoreSettings;
  promoCodes: PromoCode[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  onClose: () => void;
  onAuth: () => void;
  onPlaceOrder: (total: number, details: { address: string, paymentMethod: string }) => void;
  language: Language;
}

type PaymentMethod = 'cash' | 'card' | 'transfer';

export const CartPage: React.FC<CartPageProps> = ({
  items,
  user,
  settings,
  promoCodes,
  onUpdateQuantity,
  onRemove,
  onToggleWishlist,
  onClose,
  onAuth,
  onPlaceOrder,
  language
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [isEditingAddress, setIsEditingAddress] = useState(!user?.address);

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);
  const originalSubtotal = useMemo(() => items.reduce((acc, item) => acc + (item.oldPrice || item.price) * item.quantity, 0), [items]);
  
  const discountFromProducts = originalSubtotal - subtotal;
  
  const promoDiscount = useMemo(() => {
    if (!activePromo) return 0;
    if (activePromo.type === 'percent') return (subtotal * activePromo.discountValue) / 100;
    return activePromo.discountValue;
  }, [activePromo, subtotal]);

  const totalDiscount = discountFromProducts + promoDiscount;
  const grandTotal = Math.max(0, subtotal - promoDiscount);

  const handleApplyPromo = () => {
    const found = promoCodes.find(p => p.code.toLowerCase() === promoInput.toLowerCase());
    
    if (!found) {
      alert('Промокод не найден');
      return;
    }

    if (found.status !== 'active') {
      alert('Промокод более не активен');
      return;
    }

    if (found.expiresAt && new Date(found.expiresAt) < new Date()) {
      alert('Срок действия промокода истек');
      return;
    }

    if (found.minOrderAmount && subtotal < found.minOrderAmount) {
      alert(`Минимальная сумма заказа для этого промокода: ${found.minOrderAmount.toLocaleString()} ${settings.currency}`);
      return;
    }

    if (found.usageLimit && found.usedCount >= found.usageLimit) {
      alert('Лимит использования промокода исчерпан');
      return;
    }

    setActivePromo(found);
    alert(`Промокод ${found.code} успешно применен!`);
  };

  const paymentOptions = [
    { id: 'cash', label: 'Наличными', icon: '💵' },
    { id: 'card', label: 'Картой', icon: '💳' },
    { id: 'transfer', label: 'Перевод', icon: '📲' },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 animate-in fade-in">
        <div className="w-32 h-32 bg-slate-50 rounded-[3rem] flex items-center justify-center mb-8 text-slate-200">
           <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Корзина пуста</h2>
        <Button onClick={onClose} className="bg-[#3bb19b] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Вернуться к покупкам</Button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 md:px-10 py-10 animate-in fade-in duration-500">
      <button onClick={onClose} className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#3bb19b] hover:translate-x-[-4px] transition-transform">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg> Назад в магазин
      </button>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-50">
             <div className="flex items-baseline gap-4 mb-10">
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Корзина</h1>
                <span className="text-slate-300 font-bold uppercase tracking-widest text-xs">{items.length} товара</span>
             </div>
             <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="py-8 flex flex-col md:flex-row gap-8 items-center">
                     <div className="w-32 h-32 bg-slate-50 rounded-[2rem] p-4 flex items-center justify-center shrink-0 border border-slate-100/50">
                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                     </div>
                     <div className="flex-grow space-y-2 text-center md:text-left">
                        <h3 className="text-lg font-black text-slate-900 leading-tight">{item.name}</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.brand}</p>
                        {item.stock < 5 && (
                           <div className="mt-4 flex items-center gap-2 text-[#f91155] font-black text-[10px] uppercase tracking-widest">
                              <span className="w-2 h-2 bg-[#f91155] rounded-full animate-pulse" />
                              Осталось {item.stock} шт.
                           </div>
                        )}
                     </div>
                     <div className="flex flex-col md:items-end gap-4 shrink-0 w-full md:w-auto">
                        <div className="flex items-center gap-6 justify-center">
                           <div className="flex items-center bg-slate-100 rounded-xl p-1">
                              <button onClick={() => onUpdateQuantity(item.id, -1)} className="w-8 h-8 font-black">-</button>
                              <span className="w-10 text-center font-black text-sm">{item.quantity}</span>
                              <button onClick={() => onUpdateQuantity(item.id, 1)} className="w-8 h-8 font-black">+</button>
                           </div>
                           <p className="text-xl font-black text-slate-950">{(item.price * item.quantity).toLocaleString()} {settings.currency}</p>
                        </div>
                        <button onClick={() => onRemove(item.id)} className="text-rose-500 font-black text-[10px] uppercase tracking-widest md:self-end">Удалить</button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-6">
             <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Способ доставки</h3>
                <button onClick={() => setIsEditingAddress(!isEditingAddress)} className="text-[10px] font-black uppercase text-[#3bb19b] tracking-widest">{isEditingAddress ? 'Закрыть' : 'Изменить адрес'}</button>
             </div>
             {isEditingAddress ? (
                <div className="space-y-4 animate-in fade-in">
                   <input type="text" placeholder="Введите адрес доставки (город, улица, дом)..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-[#3bb19b]/20 outline-none font-bold text-sm" />
                   <Button onClick={() => setIsEditingAddress(false)} className="bg-[#3bb19b] text-white py-3 px-8 rounded-xl text-[10px] font-black uppercase">Сохранить адрес</Button>
                </div>
             ) : (
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">📍</div>
                   <div>
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Адрес получения:</p>
                      <p className="text-sm font-black text-slate-900">{deliveryAddress || 'Адрес не указан'}</p>
                   </div>
                </div>
             )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-6">
                <h3 className="text-xl font-black text-slate-900">Способ оплаты</h3>
                {!user ? (<p className="text-sm text-slate-400 font-bold leading-relaxed"><button onClick={onAuth} className="text-[#3bb19b] hover:underline">Войти</button>, чтобы выбрать оплату</p>) : (
                   <div className="grid grid-cols-1 gap-3">
                      {paymentOptions.map((opt) => (
                         <button key={opt.id} onClick={() => setPaymentMethod(opt.id as PaymentMethod)} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${paymentMethod === opt.id ? 'border-[#3bb19b] bg-[#3bb19b]/5 shadow-md shadow-[#3bb19b]/5' : 'border-slate-50 bg-slate-50 hover:bg-slate-100'}`}>
                            <div className="flex items-center gap-3"><span className="text-xl">{opt.icon}</span><span className="text-xs font-black uppercase tracking-widest text-slate-900">{opt.label}</span></div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === opt.id ? 'bg-[#3bb19b] border-[#3bb19b]' : 'bg-white border-slate-200'}`}>{paymentMethod === opt.id && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>}</div>
                         </button>
                      ))}
                   </div>
                )}
             </div>
             <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-6">
                <h3 className="text-xl font-black text-slate-900">Мои данные</h3>
                {!user ? (<p className="text-sm text-slate-400 font-bold"><button onClick={onAuth} className="text-[#3bb19b] hover:underline">Войти</button>, чтобы оформить заказ</p>) : (
                   <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-slate-300 uppercase mb-1">Покупатель</p><p className="text-sm font-black text-slate-900">{user.name}</p></div>
                      <div className="p-4 bg-slate-50 rounded-2xl"><p className="text-[9px] font-black text-slate-300 uppercase mb-1">Контакты</p><p className="text-xs font-bold text-slate-500">{user.phone || '—'} / {user.email}</p></div>
                   </div>
                )}
             </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-8 sticky top-32">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-8">
             <h2 className="text-2xl font-black text-slate-900 uppercase tracking-widest">Итого</h2>
             <div className="space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest"><span>Товары, {items.length} шт.</span><span>{originalSubtotal.toLocaleString()} {settings.currency}</span></div>
                {totalDiscount > 0 && (<div className="flex justify-between items-center text-sm font-black text-[#f91155] uppercase tracking-widest"><span>Скидка</span><span>–{totalDiscount.toLocaleString()} {settings.currency}</span></div>)}
             </div>
             <div className="flex justify-between items-end pt-8 border-t border-slate-50"><span className="text-2xl font-black text-slate-900 tracking-tighter">К оплате</span><span className="text-4xl font-black text-[#3bb19b] tracking-tighter">{grandTotal.toLocaleString()} {settings.currency}</span></div>
             <div className="space-y-6 pt-6">
                <Button onClick={() => { if (!deliveryAddress) return alert('Укажите адрес доставки'); if (!paymentMethod) return alert('Выберите способ оплаты'); if (!agreedToTerms) return alert('Подтвердите согласие с правилами'); onPlaceOrder(grandTotal, { address: deliveryAddress, paymentMethod: paymentMethod }); }} disabled={!agreedToTerms} className="w-full py-6 bg-[#3bb19b] hover:bg-[#2e8e7c] text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl transition-all disabled:opacity-50">Оформить заказ</Button>
                <label className="flex items-start gap-4 cursor-pointer group"><div className="relative mt-0.5"><input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="peer h-5 w-5 appearance-none rounded-lg border-2 border-slate-200 checked:bg-[#3bb19b] checked:border-[#3bb19b] transition-all cursor-pointer" /><svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg></div><span className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-widest group-hover:text-slate-600 transition-colors">Соглашаюсь с правилами пользования и возврата</span></label>
             </div>
          </div>
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-50 space-y-6">
             <div className="flex items-center gap-3"><h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Промокод</h3></div>
             {activePromo ? (
                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100 animate-in zoom-in">
                   <div className="flex flex-col"><span className="text-xs font-black text-emerald-600 tracking-widest">{activePromo.code}</span><span className="text-[10px] font-bold text-emerald-500 uppercase">Скидка применена</span></div>
                   <button onClick={() => setActivePromo(null)} className="text-emerald-300 hover:text-rose-500 transition-colors">✕</button>
                </div>
             ) : (
                <>
                  <div className="relative"><input type="text" placeholder="Введите промокод" value={promoInput} onChange={(e) => setPromoInput(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-[#3bb19b]/20 outline-none font-bold text-sm transition-all" /></div>
                  <Button variant="outline" className="w-full py-4 rounded-2xl border-2 border-[#3bb19b]/30 text-[#3bb19b] font-black uppercase text-[10px]" onClick={handleApplyPromo}>Применить</Button>
                </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};
