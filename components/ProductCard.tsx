
import React, { useState } from 'react';
import { Product, Language } from '../types';
import { translations } from '../translations';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
  isComparing: boolean;
  onToggleCompare: (id: string) => void;
  onAddReview: (productId: string, any: any) => void;
  language: Language;
  currency: string;
  isWishlisted?: boolean;
  onToggleWishlist?: (id: string) => void;
  buttonLabel?: string;
  // Новые пропсы для кастомизации стилей
  containerClassName?: string;
  imageClassName?: string;
  titleClassName?: string;
  priceClassName?: string;
  buttonClassName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onClick, 
  currency,
  language,
  isComparing,
  onToggleCompare,
  isWishlisted,
  onToggleWishlist,
  buttonLabel,
  containerClassName,
  imageClassName,
  titleClassName,
  priceClassName,
  buttonClassName
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = translations[language];
  
  const images = product.images && product.images.length > 0 ? product.images : [product.image];
  const discountPercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <div 
  className={`group relative cursor-pointer p-5 bg-white/40 ... flex flex-col 
              w-[290px] h-[800px]   // ← фиксируем размер
              ${containerClassName || ''}`}
  onClick={() => onClick(product)}
>

      {/* Product Image Area */}
      <div className="relative aspect-[4/4.8] mb-6 flex flex-col items-center justify-center p-8 bg-white/30 dark:bg-white/5 rounded-[3rem] border border-white/40 dark:border-white/5 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center relative transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110">
          <img 
            src={images[currentImageIndex]} 
            alt={product.name} 
            className={`max-h-full max-w-full object-contain mix-blend-multiply dark:mix-blend-screen drop-shadow-2xl ${imageClassName || ''}`} 
          />
        </div>

        {/* Action Buttons */}
        <div className="absolute top-5 right-5 flex flex-col gap-3 z-10">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product.id); }}
            className={`w-12 h-12 rounded-full transition-all border flex items-center justify-center shadow-lg ${isWishlisted ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/90 text-slate-600 border-white hover:text-rose-500'}`}
          >
            <svg className="w-6 h-6" fill={isWishlisted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleCompare(product.id); }}
            className={`w-12 h-12 rounded-full transition-all border flex items-center justify-center shadow-lg ${isComparing ? 'bg-[#3BB19B] text-white border-[#3BB19B]' : 'bg-white/90 text-slate-600 border-white hover:text-[#3BB19B]'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </button>
        </div>

        {/* Dynamic Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-10">
          {(product.isPromo || product.oldPrice) && (
            <div className="bg-gradient-to-r from-rose-500 to-orange-500 text-white text-[11px] font-black px-4 py-2 rounded-2xl uppercase shadow-lg tracking-widest">
              ВЫГОДА
            </div>
          )}
          {discountPercent > 0 && (
            <div className="bg-slate-950 text-white text-[12px] font-black px-3 py-1.5 rounded-xl uppercase shadow-md self-start">
              -{discountPercent}%
            </div>
          )}
        </div>
      </div>
      
      {/* Product Information Section */}
      <div className="flex flex-col px-2 flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] bg-slate-200/50 dark:bg-white/10 px-3 py-1.5 rounded-xl">
            {product.brand}
          </span>
          <div className="flex items-center gap-1">
            <div className="flex text-amber-500 text-[12px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= Math.round(product.rating) ? 'text-amber-500' : 'text-slate-300 dark:text-slate-700'}>★</span>
              ))}
            </div>
            <span className="text-[13px] font-black text-slate-900 dark:text-white ml-1">{product.rating}</span>
          </div>
        </div>

        <h3 className={`text-[20px] font-black text-slate-950 dark:text-white leading-tight line-clamp-2 h-14 uppercase tracking-tight mb-4 group-hover:text-[#3BB19B] transition-colors ${titleClassName || ''}`}>
          {product.name}
        </h3>

        {/* Key Parameters Preview */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="flex flex-col gap-2 mb-6">
            {product.attributes.slice(0, 2).map((attr, idx) => (
              <div key={idx} className="flex justify-between items-center text-[12px]">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{attr.label}</span>
                <span className="font-black text-slate-900 dark:text-slate-200">{attr.value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-auto space-y-1 mb-8">
          {product.oldPrice && (
            <span className="text-[16px] font-bold text-slate-400 dark:text-slate-500 line-through block">
              {product.oldPrice.toLocaleString()} {currency}
            </span>
          )}
          <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black text-slate-950 dark:text-white tracking-tighter italic ${priceClassName || ''}`}>
              {product.price.toLocaleString()}
            </span>
            <span className="text-[13px] font-black uppercase text-slate-500 dark:text-slate-400 tracking-widest">{currency}</span>
          </div>
        </div>

        {/* Multi-image pagination dots */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2.5 mb-8">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'bg-[#3BB19B] w-10' : 'bg-slate-300 dark:bg-slate-700 w-2'}`}
              />
            ))}
          </div>
        )}

        {/* Call to Action Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className={`w-full py-5 rounded-[2rem] font-black text-[14px] uppercase tracking-[0.25em] transition-all duration-300 shadow-xl active:scale-95 ${
            product.oldPrice || product.isPromo
              ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-rose-200/50' 
              : 'bg-slate-950 text-white hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700'
          } ${buttonClassName || ''}`}
        >
          {buttonLabel || (product.oldPrice || product.isPromo ? 'ЗАБРАТЬ ВЫГОДУ' : t.addToCart)}
        </button>
      </div>
    </div>
  );
};
