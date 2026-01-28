
import React, { useMemo } from 'react';
import { Product, Language } from '../types';
import { Button } from './Button';
import { translations } from '../translations';

interface ComparisonModalProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRemove: (id: string) => void;
  language: Language;
  currency: string;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({ 
  products, 
  isOpen, 
  onClose, 
  onAddToCart,
  onRemove,
  language,
  currency
}) => {
  const t = translations[language];

  // Dynamically collect all unique attribute labels from all products
  const allAttributeLabels = useMemo(() => {
    const labels = new Set<string>();
    products.forEach(p => {
      p.attributes?.forEach(attr => labels.add(attr.label));
    });
    return Array.from(labels);
  }, [products]);

  // Find best values for highlighting
  const bestPrice = useMemo(() => Math.min(...products.map(p => p.price)), [products]);
  const bestRating = useMemo(() => Math.max(...products.map(p => p.rating)), [products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
      <div 
        className="absolute inset-0 bg-[#0F172A]/60 backdrop-blur-xl animate-fade-in" 
        onClick={onClose} 
      />
      
      <div className="relative bg-white/90 backdrop-blur-3xl w-full max-w-7xl max-h-[90vh] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white overflow-hidden flex flex-col animate-zoom-in">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{t.compare}</h2>
            <p className="text-[10px] font-black text-[#3BB19B] uppercase tracking-[0.2em] mt-1">{products.length} {language === 'ru' ? 'ТОВАРА В СПИСКЕ' : 'ITEMS IN LIST'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-4 bg-slate-50 hover:bg-rose-50 hover:text-rose-500 rounded-2xl text-slate-400 transition-all shadow-sm"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Comparison Table Container */}
        <div className="flex-grow overflow-auto hide-scrollbar p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-40 opacity-30">
               <div className="text-6xl mb-6">⚖️</div>
               <p className="font-black uppercase tracking-widest text-slate-900">Список пуст</p>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <table className="w-full border-separate border-spacing-0">
                <thead>
                  <tr className="bg-white/50 backdrop-blur-md sticky top-0 z-20">
                    <th className="sticky left-0 z-30 bg-slate-50/80 backdrop-blur-xl p-8 text-left border-b border-r border-slate-100 min-w-[240px]">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Характеристики</span>
                    </th>
                    {products.map(p => (
                      <th key={p.id} className="p-8 border-b border-slate-100 min-w-[280px] relative group">
                        <button 
                          onClick={() => onRemove(p.id)}
                          className="absolute top-4 right-4 p-2 bg-white rounded-xl shadow-md text-slate-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <path d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="flex flex-col items-center text-center gap-4">
                          <div className="w-32 h-32 bg-white rounded-3xl p-4 shadow-inner border border-slate-50 flex items-center justify-center">
                            <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain mix-blend-multiply" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[9px] font-black text-[#3BB19B] uppercase tracking-widest">{p.brand}</p>
                            <h4 className="font-black text-slate-900 text-sm line-clamp-2 uppercase tracking-tight h-10">{p.name}</h4>
                          </div>
                          <Button 
                            onClick={() => onAddToCart(p)}
                            size="sm"
                            className="w-full py-3 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                          >
                            {t.addToCart}
                          </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {/* Price Row */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white/80 p-8 border-r border-slate-100 font-black text-[11px] text-slate-500 uppercase tracking-widest">Цена</td>
                    {products.map(p => (
                      <td key={p.id} className="p-8 text-center">
                        <div className={`inline-block px-4 py-2 rounded-2xl ${p.price === bestPrice ? 'bg-emerald-50 border border-emerald-100 shadow-sm' : ''}`}>
                          <span className={`text-2xl font-black tracking-tighter italic ${p.price === bestPrice ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {p.price.toLocaleString()} {currency}
                          </span>
                          {p.price === bestPrice && (
                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest mt-1">Лучшая цена</p>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Rating Row */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white/80 p-8 border-r border-slate-100 font-black text-[11px] text-slate-500 uppercase tracking-widest">Рейтинг</td>
                    {products.map(p => (
                      <td key={p.id} className="p-8 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex text-amber-500 text-lg">
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s}>{s <= Math.round(p.rating) ? '★' : '☆'}</span>
                            ))}
                          </div>
                          <span className={`text-sm font-black ${p.rating === bestRating ? 'text-[#3BB19B]' : 'text-slate-400'}`}>
                            {p.rating} / 5
                          </span>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Stock Row */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white/80 p-8 border-r border-slate-100 font-black text-[11px] text-slate-500 uppercase tracking-widest">Наличие</td>
                    {products.map(p => (
                      <td key={p.id} className="p-8 text-center">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${p.stock > 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                          {p.stock > 0 ? `В наличии (${p.stock})` : 'Нет в наличии'}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Dynamic Attributes Rows */}
                  {allAttributeLabels.map(label => (
                    <tr key={label} className="hover:bg-slate-50/50 transition-colors">
                      <td className="sticky left-0 z-10 bg-white/80 p-8 border-r border-slate-100 font-black text-[11px] text-slate-500 uppercase tracking-widest">
                        {label}
                      </td>
                      {products.map(p => {
                        const attr = p.attributes?.find(a => a.label === label);
                        return (
                          <td key={p.id} className="p-8 text-center text-sm font-bold text-slate-700">
                            {attr ? attr.value : <span className="text-slate-300">—</span>}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  {/* Features Row */}
                  <tr className="hover:bg-slate-50/50 transition-colors">
                    <td className="sticky left-0 z-10 bg-white/80 p-8 border-r border-slate-100 font-black text-[11px] text-slate-500 uppercase tracking-widest">Особенности</td>
                    {products.map(p => (
                      <td key={p.id} className="p-8">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {p.features.map((f, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100">
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        {/* Footer actions */}
        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 shrink-0">
           <button 
             onClick={onClose}
             className="px-10 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors"
           >
             Закрыть окно
           </button>
           <button 
             onClick={() => {
               const first = products[0];
               if (first) onAddToCart(first);
             }}
             disabled={products.length === 0}
             className="px-12 py-4 bg-[#1e2b6e] text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all disabled:opacity-30"
           >
             Добавить первый в корзину
           </button>
        </div>
      </div>
    </div>
  );
};
