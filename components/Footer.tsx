
import React, { useState } from 'react';
import { StoreSettings, Language } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onPageClick: (pageId: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ settings, onPageClick, language }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const texts = {
    ru: {
      newsletterTitle: 'Узнавайте первым',
      newsletterSubtitle: 'Эксклюзивные предложения и новинки в вашей почте',
      subscribe: 'Подписаться',
      success: 'ГОТОВО ✓',
      placeholder: 'Ваш email адрес',
      copyright: `© ${new Date().getFullYear()} ${settings.domain}. Все права защищены.`,
      privacy: 'Конфиденциальность',
      offer: 'Публичная оферта',
      phone: 'Служба поддержки:',
      supportTag: 'Круглосуточная поддержка'
    }
  }[language === 'ru' ? 'ru' : 'ru'];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const subscribers = JSON.parse(localStorage.getItem('ns_subscribers') || '[]');
    localStorage.setItem('ns_subscribers', JSON.stringify([...subscribers, email]));
    setIsSubscribed(true);
    setEmail('');
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const footer = settings.footer;

  return (
    <footer className="relative mt-32 pb-16 overflow-hidden no-print bg-white/30 backdrop-blur-sm pt-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#3BB19B]/30 to-transparent" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#3BB19B]/10 blur-[150px] rounded-full" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400/10 blur-[150px] rounded-full" />

      <div className="container-premium relative z-10">
        
        {/* Newsletter & Branding */}
        <div className="relative bg-white/40 backdrop-blur-3xl rounded-[5rem] p-12 md:p-16 border border-white/60 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-16 mb-24 overflow-hidden group">
           <div className="relative z-10 w-full lg:w-2/5 space-y-8">
              <h3 className="text-4xl font-black text-slate-950 tracking-tighter italic uppercase leading-none">{texts.newsletterTitle}</h3>
              <form onSubmit={handleSubscribe} className="flex bg-white/60 backdrop-blur-md rounded-3xl p-1.5 border border-white/60 shadow-xl focus-within:ring-8 focus-within:ring-[#3BB19B]/5 transition-all">
                 <input 
                   type="email" 
                   placeholder={texts.placeholder} 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="flex-grow bg-transparent px-8 py-5 text-sm font-bold text-slate-800 outline-none"
                 />
                 <button 
                   type="submit" 
                   className={`px-12 py-5 rounded-[1.4rem] font-black text-[11px] uppercase tracking-[0.2em] transition-all ${isSubscribed ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                 >
                   {isSubscribed ? texts.success : texts.subscribe}
                 </button>
              </form>
              <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.25em] pl-2">{texts.newsletterSubtitle}</p>
           </div>

           <div className="relative z-10 flex flex-col items-center">
              <div className="flex flex-col items-center leading-none">
                 <span className="text-7xl font-black italic text-[#3BB19B] tracking-tighter uppercase">GISI</span>
                 <span className="text-3xl font-black text-slate-800 tracking-[0.3em] -mt-2 uppercase opacity-80">MARKET</span>
              </div>
           </div>

           <div className="relative z-10 flex gap-4">
              {['FB', 'IG', 'TG'].map(s => (
                <button key={s} className="w-14 h-14 rounded-2xl bg-white/50 border border-white flex items-center justify-center text-slate-800 text-xs font-black hover:bg-[#3BB19B] hover:text-white transition-all shadow-lg">
                   {s}
                </button>
              ))}
           </div>
        </div>

        {/* Structured Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-20 mb-24 px-10">
          {footer.columns.filter(c => c.isVisible).map((col) => (
            <div key={col.id} className="space-y-10">
              <h4 className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.35em] text-slate-900">
                <span className="w-1.5 h-6 bg-[#3BB19B] rounded-full" />
                {col.title}
              </h4>
              <ul className="space-y-5">
                {col.items.filter(i => i.isVisible).map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => item.pageId ? onPageClick(item.pageId) : item.link ? window.open(item.link) : null}
                      className="text-[15px] font-bold text-slate-500 hover:text-[#3BB19B] hover:translate-x-2 transition-all text-left uppercase tracking-tight"
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          <div className="space-y-10">
             <h4 className="flex items-center gap-4 text-[13px] font-black uppercase tracking-[0.35em] text-slate-900">
                <span className="w-1.5 h-6 bg-indigo-500 rounded-full" />
                Связь
             </h4>
             <div className="space-y-6">
                <div>
                   <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{texts.phone}</p>
                   <p className="text-3xl font-black text-slate-950 tracking-tighter italic">8 800 123-45-67</p>
                </div>
                <div className="inline-block px-4 py-2 bg-slate-100 rounded-xl">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{texts.supportTag}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-slate-200/50 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
              {texts.copyright}
           </p>
           <div className="flex gap-12">
              <button className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-[#3BB19B] transition-colors">{texts.privacy}</button>
              <button className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] hover:text-[#3BB19B] transition-colors">{texts.offer}</button>
           </div>
        </div>
      </div>
    </footer>
  );
};
