import React from 'react';
import { StoreSettings, Language } from '../types';

interface FooterProps {
  settings: StoreSettings;
  onPageClick: (pageId: string) => void;
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ settings, onPageClick, language }) => {
  const footer = settings.footer;

  const t = {
    newsletterTitle:
      footer?.newsletterTitle ||
      (language === 'ru'
        ? 'Подпишитесь на нашу рассылку'
        : 'Subscribe to our newsletter'),
    newsletterSubtitle:
      footer?.newsletterSubtitle ||
      (language === 'ru'
        ? 'Получайте новости о скидках и новых поступлениях'
        : 'Get updates about news and discounts'),
    subscribe: language === 'ru' ? 'Подписаться' : 'Subscribe',
    success: language === 'ru' ? 'ГОТОВО ✓' : 'DONE ✓',
    placeholder: language === 'ru' ? 'Ваш email адрес' : 'Your email address',
    privacy: language === 'ru' ? 'Конфиденциальность' : 'Privacy policy',
    offer: language === 'ru' ? 'Публичная оферта' : 'Terms of use',
    phoneLabel:
      language === 'ru' ? 'Служба поддержки:' : 'Support phone:',
    supportTag:
      language === 'ru' ? 'Круглосуточная поддержка' : '24/7 support',
    copyright:
      footer?.copyrightText ||
      `© ${new Date().getFullYear()} ${settings.storeName || 'GISI Market'}. Все права защищены.`,
    phoneNumber: footer?.supportPhone || '374 77 066 957',
  };

  const columns = footer?.columns || [];

  return (
    <footer className="mt-auto border-t border-white/20 bg-white/40 backdrop-blur-2xl relative z-[80]">
      <div className="container-premium py-12 md:py-16 space-y-12">
        {/* Верхний блок: рассылка + телефон */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start lg:items-center justify-between">
          {/* Рассылка */}
          <div className="space-y-4 max-w-xl">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-500">
              {language === 'ru' ? 'Будьте в курсе' : 'Stay tuned'}
            </p>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
              {t.newsletterTitle}
            </h3>
            <p className="text-sm text-slate-500 font-medium">
              {t.newsletterSubtitle}
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-3 mt-4"
            >
              <input
                type="email"
                placeholder={t.placeholder}
                className="flex-1 px-5 py-3 rounded-2xl bg-white/70 border border-white/80 text-sm font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#3BB19B]/30 focus:border-[#3BB19B] transition-all"
              />
              <button
                type="submit"
                className="px-8 py-3 rounded-2xl bg-[#3BB19B] text-white text-xs font-black uppercase tracking-[0.2em] shadow-md hover:bg-[#2ea38d] transition-all"
              >
                {t.subscribe}
              </button>
            </form>
          </div>

          {/* Телефон поддержки */}
          <div className="bg-white/70 border border-white/80 rounded-3xl px-6 py-4 shadow-lg flex flex-col gap-1 min-w-[220px]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {t.phoneLabel}
            </p>
            <p className="text-2xl md:text-3xl font-black text-slate-950 tracking-tighter italic">
              {t.phoneNumber}
            </p>
            <p className="text-[11px] font-semibold text-emerald-600 uppercase tracking-[0.18em]">
              {t.supportTag}
            </p>
          </div>
        </div>

        {/* Колонки ссылок */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12">
          {columns
            .filter((col) => col.isVisible !== false)
            .map((col) => (
              <div key={col.id} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.items
                    ?.filter((it) => it.isVisible !== false)
                    .map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => item.pageId && onPageClick(item.pageId)}
                          className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Нижняя полоска */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/40">
          <p className="text-[11px] text-slate-500 font-medium">
            {t.copyright}
          </p>
          <div className="flex gap-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            <button className="hover:text-slate-900 transition-colors">
              {t.privacy}
            </button>
            <button className="hover:text-slate-900 transition-colors">
              {t.offer}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
