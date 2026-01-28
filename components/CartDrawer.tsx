
import React from 'react';
import { CartItem, Language } from '../types';
import { Button } from './Button';
import { translations } from '../translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  language: Language;
  currency: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  onCheckout,
  language,
  currency
}) => {
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const t = translations[language];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-500">
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">{t.cart}</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full"><svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        <div className="flex-grow overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <p className="text-slate-500 font-medium text-lg">{t.cartEmpty}</p>
              <Button variant="outline" onClick={onClose}>{t.continueShopping}</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
                  <div className="flex-grow">
                    <div className="flex justify-between">
                      <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                      <button onClick={() => onRemove(item.id)} className="text-slate-400 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                    </div>
                    <p className="text-indigo-600 font-bold mt-1">{currency}{item.price.toFixed(2)}</p>
                    <div className="flex items-center border border-slate-200 rounded-lg w-fit mt-3">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="px-2 py-1">-</button>
                      <span className="px-3 py-1 text-sm font-bold border-x border-slate-200">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="px-2 py-1">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50/50">
            <div className="flex justify-between items-center text-lg"><span className="text-slate-500">{t.subtotal}</span><span className="font-bold text-slate-900">{currency}{total.toFixed(2)}</span></div>
            <p className="text-xs text-slate-400">{t.shippingNote}</p>
            {/* Fix: Access t.checkout.title instead of the checkout object to avoid [object Object] rendering */}
            <Button className="w-full py-4 text-lg" onClick={onCheckout}>{t.checkout.title}</Button>
          </div>
        )}
      </div>
    </div>
  );
};
