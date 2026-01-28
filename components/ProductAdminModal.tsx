
import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, StoreSettings } from '../types';

interface ProductAdminModalProps {
  product: Product | null;
  categories: Category[];
  settings: StoreSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}

export const ProductAdminModal: React.FC<ProductAdminModalProps> = ({
  product, categories, settings, isOpen, onClose, onSave
}) => {
  const [formData, setFormData] = useState<Product>({
    id: '', sku: '', name: '', brand: '', description: '', 
    categoryId: '', subCategoryId: '', image: '', images: [], 
    price: 0, costPrice: 0, maxDiscount: 0, stock: 0, unit: 'шт', 
    status: 'active', rating: 5, features: [], attributes: [],
    isNew: true, isHit: false, isPromo: false
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) setFormData(product);
    else setFormData({
      id: 'p-' + Date.now(), sku: '', name: '', brand: '', description: '', 
      categoryId: categories[0]?.id || '', subCategoryId: '', 
      image: 'https://via.placeholder.com/400', images: [], 
      price: 0, costPrice: 0, maxDiscount: 10, stock: 0, unit: 'шт', 
      status: 'active', rating: 5, features: [], attributes: [],
      isNew: true, isHit: false, isPromo: false
    });
  }, [product, isOpen, categories]);

  if (!isOpen) return null;

  const minPrice = formData.price * (1 - (formData.maxDiscount / 100));
  const profit = formData.price - formData.costPrice;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const url = ev.target?.result as string;
        setFormData(prev => ({
          ...prev,
          image: prev.image.includes('placeholder') ? url : prev.image,
          images: [...prev.images, url]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddAttr = () => {
    setFormData(prev => ({
      ...prev,
      attributes: [...(prev.attributes || []), { label: '', value: '' }]
    }));
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-6 bg-slate-950/50 backdrop-blur-md animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-[1240px] max-h-[90vh] bg-[#F4F7F6] rounded-[3rem] shadow-[0_60px_150px_-30px_rgba(0,0,0,0.4)] border border-white/40 overflow-hidden flex flex-col animate-zoom-in">
        
        {/* Header - Styled as requested (Red Box Reference) */}
        <div className="px-10 py-5 flex items-center justify-between shrink-0 bg-white/80 border-b border-slate-200">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              {product ? 'Редактирование товара' : 'Добавление товара'}
            </h2>
            <p className="text-[9px] font-black text-[#3BB19B] uppercase tracking-[0.2em] mt-1.5 opacity-80">GISI MARKET ADMIN PRO</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose} 
              className="px-8 py-3 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200"
            >
              Отмена
            </button>
            <button 
              onClick={() => onSave(formData)} 
              className="px-8 py-3 bg-[#3BB19B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-100/50 hover:scale-105 active:scale-95 transition-all"
            >
              Сохранить и опубликовать
            </button>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto hide-scrollbar p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Основная информация */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[#3BB19B] text-white rounded-lg flex items-center justify-center font-black text-sm">1</div>
                 <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Основная информация</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Название товара</label>
                  <input 
                    type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-[#3BB19B] transition-all"
                    placeholder="Введите название..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Бренд</label>
                    <input 
                      type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}
                      className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-[#3BB19B]"
                    />
                   </div>
                   <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Артикул / SKU</label>
                    <input 
                      type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})}
                      className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-[#3BB19B]"
                    />
                   </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                   <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Категория</label>
                    <select 
                      value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}
                      className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-[#3BB19B] appearance-none"
                    >
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                   </div>
                   <div className="flex flex-col justify-end">
                      <div className="flex gap-2 p-1.5 bg-slate-100/50 rounded-2xl border border-slate-100">
                        {['active', 'hidden', 'out_of_stock'].map(s => (
                          <button 
                            key={s} onClick={() => setFormData({...formData, status: s as any})}
                            className={`flex-grow py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${formData.status === s ? 'bg-white text-[#3BB19B] shadow-sm' : 'text-slate-400'}`}
                          >
                            {s === 'active' ? 'Активен' : s === 'hidden' ? 'Скрыт' : 'Нет'}
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            </section>

            {/* 2. Фото и медиа */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-[#3BB19B] text-white rounded-lg flex items-center justify-center font-black text-sm">2</div>
                 <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Фото и медиа</h3>
              </div>
              <div className="flex gap-6">
                 <div className="w-48 h-48 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-center p-4 relative group shrink-0">
                    <img src={formData.image} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    <div className="absolute top-2 left-2 bg-[#3BB19B] text-white text-[6px] font-black uppercase px-2 py-0.5 rounded-md">Главное</div>
                 </div>
                 <div className="flex-grow grid grid-cols-4 gap-3">
                    {formData.images.map((img, i) => (
                      <div key={i} className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 p-2 relative group overflow-hidden">
                        <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                        <button onClick={() => setFormData({...formData, images: formData.images.filter((_, idx) => idx !== i)})} className="absolute top-1 right-1 w-5 h-5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs">✕</button>
                      </div>
                    ))}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-white hover:border-[#3BB19B] transition-all text-slate-400 hover:text-[#3BB19B]"
                    >
                      <span className="text-xl">+</span>
                      <span className="text-[7px] font-black uppercase">Добавить</span>
                    </button>
                 </div>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleImageUpload} />
            </section>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* 4. Цена и склад */}
            <section className="bg-[#1e2b6e] p-8 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#3BB19B]/30 blur-[60px] rounded-full" />
              <div className="flex items-center gap-3 relative">
                 <div className="w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-lg flex items-center justify-center font-black text-sm">4</div>
                 <h3 className="text-[12px] font-black uppercase tracking-widest italic">Цена и склад</h3>
              </div>
              <div className="grid grid-cols-2 gap-5 relative">
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-2">Закупка</label>
                    <input 
                      type="number" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: parseFloat(e.target.value)})}
                      className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl font-black text-lg outline-none focus:bg-white/20 transition-all text-emerald-400"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-2">Продажа</label>
                    <input 
                      type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl font-black text-lg outline-none focus:bg-white/20 transition-all"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-2">Скидка %</label>
                    <input 
                      type="number" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: parseInt(e.target.value)})}
                      className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl font-black text-lg outline-none focus:bg-white/20 transition-all text-rose-400"
                    />
                 </div>
                 <div className="space-y-1">
                    <label className="text-[8px] font-black text-white/40 uppercase tracking-widest ml-2">Остаток</label>
                    <input 
                      type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                      className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl font-black text-lg outline-none focus:bg-white/20 transition-all"
                    />
                 </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3 relative">
                 <div className="flex justify-between items-center">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Мин. цена:</p>
                    <p className="text-xl font-black text-emerald-400 italic tracking-tighter">{minPrice.toLocaleString()} <span className="text-xs">{settings.currency}</span></p>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em]">Прибыль:</p>
                    <p className={`text-xl font-black italic ${profit > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{profit.toLocaleString()}</p>
                 </div>
              </div>
            </section>

            {/* 5. Характеристики */}
            <section className="bg-white p-8 rounded-[2.5rem] border border-white shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#3BB19B] text-white rounded-lg flex items-center justify-center font-black text-sm">5</div>
                   <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Характеристики</h3>
                </div>
                <button 
                  onClick={handleAddAttr}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                >+ добавить</button>
              </div>
              <div className="space-y-3">
                 {(formData.attributes || []).map((attr, i) => (
                   <div key={i} className="flex gap-2 group animate-slide-up">
                      <input 
                        type="text" placeholder="Параметр" value={attr.label}
                        onChange={e => {
                          const newAttrs = [...formData.attributes!];
                          newAttrs[i].label = e.target.value;
                          setFormData({...formData, attributes: newAttrs});
                        }}
                        className="w-1/3 p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none focus:bg-white focus:border-[#3BB19B]"
                      />
                      <input 
                        type="text" placeholder="Значение" value={attr.value}
                        onChange={e => {
                          const newAttrs = [...formData.attributes!];
                          newAttrs[i].value = e.target.value;
                          setFormData({...formData, attributes: newAttrs});
                        }}
                        className="flex-grow p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-[10px] outline-none focus:bg-white focus:border-[#3BB19B]"
                      />
                      <button 
                        onClick={() => setFormData({...formData, attributes: formData.attributes!.filter((_, idx) => idx !== i)})}
                        className="p-3 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100"
                      >✕</button>
                   </div>
                 ))}
                 {formData.attributes?.length === 0 && (
                   <div className="py-4 text-center opacity-30 italic text-[10px]">Список пуст</div>
                 )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
