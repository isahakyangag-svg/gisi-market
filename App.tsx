
import React, { useState, useMemo, useEffect } from 'react';
import { products as initialProducts } from './data/products';
import { 
  Product, CartItem, StoreSettings, Category, 
  User, Order, Banner, CMSPage, Language, PromoCode, Promotion, Review, SEOData, AuditLog
} from './types';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { AdminPanel } from './components/AdminPanel';
import { AuthModal } from './components/AuthModal';
import { AnnaAssistant } from './components/AnnaAssistant';
import { CustomerDashboard } from './components/CustomerDashboard';
import { Footer } from './components/Footer';
import { CartPage } from './components/CartPage';
import { HeroSlider } from './components/HeroSlider';
import { ComparisonModal } from './components/ComparisonModal';
import { translations } from './translations';

const DynamicStyles = ({ settings }: { settings: StoreSettings }) => {
  const branding = settings.design || {
    primaryColor: settings.primaryColor || '#3BB19B',
    linkColor: settings.linkColor || settings.primaryColor || '#3BB19B',
    headerBackground: settings.headerBackground || 'rgba(255, 255, 255, 0.4)',
    footerBackground: settings.footerBackground || 'rgba(255, 255, 255, 0.3)',
    buttonColor: settings.buttonColor || settings.primaryColor || '#3BB19B',
    buttonTextColor: settings.buttonTextColor || '#ffffff',
    buttonHoverColor: settings.buttonHoverColor || '#2ea38d',
    buttonBorderRadius: settings.buttonBorderRadius || '20px',
    borderRadius: settings.borderRadius || '48px',
    fontFamily: settings.fontFamily || 'Inter'
  };

  return (
    <style>
      {`
        :root {
          --primary-theme: ${branding.primaryColor};
          --radius-theme: ${branding.borderRadius};
          --font-theme: "${branding.fontFamily}", sans-serif;
          --header-bg: ${branding.headerBackground};
          --footer-bg: ${branding.footerBackground};
          --button-bg: ${branding.buttonColor};
          --button-text: ${branding.buttonTextColor};
          --button-hover: ${branding.buttonHoverColor};
          --button-radius: ${branding.buttonBorderRadius};
          --link-color: ${branding.linkColor};
        }
        
        .glass-header {
           background: var(--header-bg) !important;
           backdrop-filter: blur(20px) saturate(180%);
           border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        footer {
           background: var(--footer-bg) !important;
           backdrop-filter: blur(20px);
           border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .glass-main-container {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(30px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.25);
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.15);
          border-radius: var(--radius-theme);
        }

        .premium-btn, 
        .cart-action-btn,
        .auth-submit-btn,
        .product-action-btn,
        [class*="rounded-"] {
           border-radius: var(--radius-theme) !important;
        }

        .premium-btn, 
        .cart-action-btn,
        .auth-submit-btn {
           background: var(--button-bg) !important;
           color: var(--button-text) !important;
           border-radius: var(--button-radius) !important;
        }
        
        .premium-btn:hover, 
        .cart-action-btn:hover,
        .auth-submit-btn:hover {
           background: var(--button-hover) !important;
           transform: translateY(-2px);
        }

        .glass-card, 
        .modal-content,
        .dashboard-card {
           border-radius: var(--radius-theme) !important;
           background: rgba(255, 255, 255, 0.2) !important;
           backdrop-filter: blur(15px) !important;
           border: 1px solid rgba(255, 255, 255, 0.3) !important;
        }
        
        a, .link-text, .text-primary-theme {
          color: var(--link-color) !important;
        }

        body {
          font-family: var(--font-theme) !important;
        }

        .header-tooltip {
          position: absolute;
          top: calc(100% + 12px);
          left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          color: white;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 200;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .group:hover .header-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      `}
    </style>
  );
};

const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('ns_lang');
    return (saved as Language) || 'ru';
  });

  // Safe translation access with fallback
  const t = useMemo(() => translations[language] || translations['ru'], [language]);

  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [activeSubCategoryId, setActiveSubCategoryId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('ns_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [promos, setPromos] = useState<PromoCode[]>(() => {
    const saved = localStorage.getItem('ns_promos');
    return saved ? JSON.parse(saved) : [
      { id: 'p1', code: 'NEWYEAR2024', discountValue: 10, type: 'percent', status: 'active', usedCount: 0, minOrderAmount: 10000 },
      { id: 'p2', code: 'HELLO_GISI', discountValue: 5000, type: 'fixed', status: 'active', usedCount: 12, minOrderAmount: 50000, expiresAt: '2025-12-31' }
    ];
  });

  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('ns_promotions');
    return saved ? JSON.parse(saved) : [];
  });

  const [pages, setPages] = useState<CMSPage[]>(() => {
    const saved = localStorage.getItem('ns_pages');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'p1', title: 'О нас', slug: 'about', content: '<h1>О GISI Market</h1><p>Мы предлагаем лучшую электронику с премиальным сервисом.</p>', status: 'published' },
      { id: 'p2', title: 'Доставка', slug: 'shipping', content: '<h1>Информация о доставке</h1><p>Быстрая доставка до вашей двери в течение 24 часов.</p>', status: 'published' },
      { id: 'p3', title: 'Условия использования', slug: 'terms', content: '<h1>Условия и положения</h1><p>Пожалуйста, внимательно ознакомьтесь с правилами использования.</p>', status: 'published' },
      { id: 'p4', title: 'Поддержка и гарантия', slug: 'support', content: '<h1>Сервис и поддержка</h1><p>Свяжитесь с нами для получения технической помощи или гарантийного обслуживания.</p>', status: 'published' },
      { id: 'p5', title: 'Политика возврата', slug: 'returns', content: '<h1>Возврат товара</h1><p>14-дневная гарантия возврата денег для всех товаров.</p>', status: 'published' },
      { id: 'p6', title: 'Контакты', slug: 'contact', content: '<h1>Контактная информация</h1><p>Свяжитесь с нами по адресу support@gisimarket.am</p>', status: 'published' }
    ];
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('ns_banners');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'bn-1', title: 'НОВЫЙ НОУТБУК SANCTY', subtitle: 'Мощь и стиль для работы и игр. Скидка 35% только на этой неделе.', buttonText: 'Узнать больше', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&q=80', status: 'active', order: 1, link: 'p_laptop_01' },
      { id: 'bn-2', title: 'УМНЫЙ ДОМ С BALLU', subtitle: 'Кондиционеры нового поколения with smart control.', buttonText: 'Смотреть предложения', imageUrl: 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=1600&q=80', status: 'active', order: 2, link: 'p_ballu_01' }
    ];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('ns_categories');
    if (saved) return JSON.parse(saved);
    return [
      { id: 'cat5', name: 'КОНДИЦИОНЕРЫ', slug: 'air-con', order: 1, status: 'active', seo: { title: 'Кондиционеры Ереван', description: 'Лучшие цены на кондиционеры', keywords: 'кондиционер, купить, ереван', slug: 'air-con' }, subcategories: [ { id: 'sub1', name: 'Сплит-системы', icon: '❄️', slug: 'split' }, { id: 'sub2', name: 'Мобильные', icon: '📱', slug: 'mobile' }, { id: 'sub3', name: 'Для офиса', icon: '🏢', slug: 'office' } ] },
      { id: 'cat1', name: 'ЭЛЕКТРОНИКА', slug: 'electronics', order: 2, status: 'active', seo: { title: 'Электроника — GISI Market', description: 'Большой выбор гаджетов', keywords: 'гаджеты, техника', slug: 'electronics' }, subcategories: [ { id: 'sub4', name: 'Смартфоны', icon: '🤳', slug: 'phones' }, { id: 'sub5', name: 'Наушники', icon: '🎧', slug: 'audio' }, { id: 'sub6', name: 'Часы', icon: '⌚', slug: 'watches' } ] },
      { id: 'cat2', name: 'КОМПЬЮТЕРЫ', slug: 'computers', order: 3, status: 'active', seo: { title: 'Компьютеры и комплектующие', description: 'Все для вашего ПК', keywords: 'пк, ноутбуки', slug: 'computers' }, subcategories: [ { id: 'sub4', name: 'Смартфоны', icon: '🤳', slug: 'phones' }, { id: 'sub7', name: 'Ноутбуки', icon: '💻', slug: 'laptops' }, { id: 'sub8', name: 'Мониторы', icon: '🖥️', slug: 'monitors' }, { id: 'sub9', name: 'Аксессуары', icon: '🖱️', slug: 'accessories' } ] }
    ];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('ns_audit_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('ns_settings');
    const defaults: any = {
      storeName: 'GISI Market', 
      domain: 'gisimarket.am', 
      currency: 'AMD',
      primaryColor: '#3BB19B', 
      borderRadius: '48px', 
      textColor: '#000000', 
      fontFamily: 'Inter',
      design: {
        primaryColor: '#3BB19B',
        linkColor: '#3BB19B',
        headerBackground: 'rgba(255, 255, 255, 0.4)',
        footerBackground: 'rgba(255, 255, 255, 0.3)',
        buttonColor: '#3BB19B',
        buttonTextColor: '#ffffff',
        buttonHoverColor: '#2ea38d',
        buttonBorderRadius: '20px',
        borderRadius: '48px',
        fontFamily: 'Inter'
      },
      background: { 
        type: 'image', mode: 'casual', color: '#ffffff', gradient: '', 
        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=2000&q=90',
        morningImageUrl: 'https://images.unsplash.com/photo-1470252649358-96f3c8024117?w=2000&q=90',
        dayImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=2000&q=90',
        eveningImageUrl: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?w=2000&q=90',
        nightImageUrl: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=2000&q=90',
        useTimeBasedImages: true,
        opacity: 100, lightOverlay: 0, blur: 0, applyToAll: true, applyToCart: true, applyToHome: true 
      },
      footer: {
        newsletterTitle: 'Подпишитесь на нашу рассылку',
        newsletterSubtitle: 'Получайте новости о скидках и новых поступлениях',
        copyrightText: '© GISI Market. Все права защищены.',
        columns: [
          { id: 'c1', title: 'Информация', isVisible: true, items: [{ id: 'fi1', label: 'О компании', pageId: 'p1', isVisible: true }, { id: 'fi2', label: 'Контакты', pageId: 'p6', isVisible: true }] },
          { id: 'c2', title: 'Сервисы и документы', isVisible: true, items: [{ id: 'fi3', label: 'Доставка и оплата', pageId: 'p2', isVisible: true }, { id: 'fi4', label: 'Условия использования', pageId: 'p3', isVisible: true }, { id: 'fi5', label: 'Политика возврата', pageId: 'p5', isVisible: true }] },
          { id: 'c3', title: 'Сервис и поддержка', isVisible: true, items: [{ id: 'fi6', label: 'Служба поддержки', pageId: 'p4', isVisible: true }, { id: 'fi7', label: 'Гарантийные случаи', pageId: 'p4', isVisible: true }] }
        ]
      },
      homeBlocks: [],
      globalSeo: { title: 'GISI Market', description: 'Премиальная электроника в Армении', keywords: 'электроника, ереван, магазин', slug: 'home' },
      security: {
        is2FAEnabled: false,
        allowedIPs: [],
        loginLogs: []
      }
    };

    if (!saved) return defaults;
    try {
      const parsed = JSON.parse(saved);
      // Merge logic: ensure nested objects are present
      return {
        ...defaults,
        ...parsed,
        design: parsed.design ? { ...defaults.design, ...parsed.design } : defaults.design,
        globalSeo: parsed.globalSeo ? { ...defaults.globalSeo, ...parsed.globalSeo } : defaults.globalSeo,
        background: parsed.background ? { ...defaults.background, ...parsed.background } : defaults.background,
        footer: parsed.footer ? { ...defaults.footer, ...parsed.footer } : defaults.footer,
        security: parsed.security ? { ...defaults.security, ...parsed.security } : defaults.security
      };
    } catch(e) {
      return defaults;
    }
  });

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('ns_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartPageOpen, setIsCartPageOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ns_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [comparisonIds, setComparisonIds] = useState<string[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState(false);
  
  // State for Scroll To Top visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentBackgroundImage = useMemo(() => {
    if (!settings.background?.useTimeBasedImages) return settings.background?.imageUrl;
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return settings.background.morningImageUrl || settings.background.imageUrl;
    if (hour >= 12 && hour < 18) return settings.background.dayImageUrl || settings.background.imageUrl;
    if (hour >= 18 && hour < 22) return settings.background.eveningImageUrl || settings.background.imageUrl;
    return settings.background.nightImageUrl || settings.background.imageUrl;
  }, [settings.background]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = !activeCategoryId || p.categoryId === activeCategoryId;
      const matchesSubCategory = !activeSubCategoryId || p.subCategoryId === activeSubCategoryId;
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = !searchLower || 
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.sku.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSubCategory && matchesSearch;
    });
  }, [products, activeCategoryId, activeSubCategoryId, searchTerm]);

  const activeCategory = useMemo(() => categories.find(c => c.id === activeCategoryId), [categories, activeCategoryId]);

  useEffect(() => {
    localStorage.setItem('ns_orders', JSON.stringify(orders));
    localStorage.setItem('ns_banners', JSON.stringify(banners));
    localStorage.setItem('ns_products', JSON.stringify(products));
    localStorage.setItem('ns_categories', JSON.stringify(categories));
    localStorage.setItem('ns_pages', JSON.stringify(pages));
    localStorage.setItem('ns_settings', JSON.stringify(settings));
    localStorage.setItem('ns_lang', language);
    localStorage.setItem('ns_promos', JSON.stringify(promos));
    localStorage.setItem('ns_promotions', JSON.stringify(promotions));
    localStorage.setItem('ns_audit_logs', JSON.stringify(auditLogs));
  }, [orders, banners, products, categories, pages, settings, language, promos, promotions, auditLogs]);

  // Scroll listener for the "Scroll To Top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleToggleCompare = (id: string) => {
    setComparisonIds(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) {
        alert(language === 'ru' ? 'Вы можете сравнивать не более 4 товаров одновременно.' : 'You can compare up to 4 products at a time.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    localStorage.setItem('ns_user', JSON.stringify(updatedUser));
  };

  const handleAddReview = (productId: string, review: Review) => {
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [review, ...(p.reviews || [])] } : p));
    if (selectedProduct?.id === productId) setSelectedProduct(prev => prev ? { ...prev, reviews: [review, ...(prev.reviews || [])] } : null);
  };

  const handlePlaceOrder = (total: number, details: { address: string, paymentMethod: string }) => {
    if (!currentUser) return setIsAuthOpen(true);
    const newOrder: Order = {
      id: 'ЗАКАЗ-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      total,
      status: 'подтвержден',
      date: new Date().toLocaleDateString(),
      items: [...cart],
      deliveryAddress: details.address
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsCartPageOpen(false);
    setIsDashboardOpen(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ns_user');
    setIsDashboardOpen(false);
  };

  const handleResetCatalog = () => {
    setIsDashboardOpen(false);
    setIsCartPageOpen(false);
    setActivePageId(null);
    setSearchTerm('');
    setActiveCategoryId('');
    setActiveSubCategoryId('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PageViewer = () => {
    const page = pages.find(p => p.id === activePageId);
    if (!page) return null;
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-xl animate-fade-in no-print">
        <div className="bg-white/95 w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col animate-zoom-in">
           <div className="p-10 border-b border-slate-50 flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{page.title}</h2>
              <button onClick={() => setActivePageId(null)} className="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
           </div>
           <div className="p-12 overflow-y-auto flex-grow prose prose-slate max-w-none font-medium text-slate-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </div>
    );
  };

  if (isAdminMode && currentUser?.role === 'admin') {
    return (
      <AdminPanel 
        products={products} onUpdateProducts={setProducts} 
        categories={categories} onUpdateCategories={setCategories} 
        orders={orders} onUpdateOrders={setOrders} 
        customers={[]} onUpdateCustomers={()=>{}} 
        reviews={[]} onUpdateReviews={()=>{}} 
        promos={promos} onUpdatePromos={setPromos} 
        pages={pages} onUpdatePages={setPages} 
        banners={banners} onUpdateBanners={setBanners} 
        settings={settings} onUpdateSettings={setSettings} 
        auditLogs={auditLogs} onUpdateAuditLogs={setAuditLogs}
        onExit={() => setIsAdminMode(false)} 
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative p-4 md:p-8">
      <DynamicStyles settings={settings} />
      <div className="fixed inset-0 z-[-1] no-print">
        <img src={currentBackgroundImage} className="w-full h-full object-cover transition-all duration-[2000ms]" alt="фон" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[30px]" />
      </div>

      <div className="flex-grow flex flex-col glass-main-container overflow-hidden shadow-2xl">
        <header className="sticky top-0 z-[120] glass-header px-6 md:px-12 py-4 flex items-center justify-between no-print gap-8 transition-all duration-500 rounded-t-[var(--radius-theme)]">
          <div className="flex items-center gap-12 shrink-0">
            <div className="flex flex-col leading-none cursor-pointer group" onClick={handleResetCatalog}>
              <span className="text-4xl md:text-5xl font-black italic text-[#3BB19B] tracking-tighter uppercase group-hover:scale-105 transition-transform duration-300">GISI</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-[0.25em] -mt-1 uppercase group-hover:opacity-100 transition-opacity">MARKET</span>
            </div>
            
            {/* New Prominent Catalog Link */}
            <button 
              onClick={handleResetCatalog}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/40 border border-white/40 rounded-2xl text-[13px] font-black uppercase tracking-widest text-slate-900 transition-all hover:scale-105 active:scale-95 shadow-sm group"
            >
              <svg className="w-5 h-5 text-[#3BB19B] group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {t.catalog || 'Каталог'}
            </button>
          </div>

          <div className="flex-grow max-w-2xl hidden lg:block">
            <div className="relative group">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3BB19B] transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input 
                type="text" 
                placeholder={t.searchPlaceholder} 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full pl-14 pr-12 py-4 bg-white/30 border border-white/40 rounded-2xl text-[15px] font-bold text-slate-950 outline-none focus:bg-white/60 focus:border-[#3BB19B] focus:ring-4 focus:ring-[#3BB19B]/5 transition-all placeholder:text-slate-500" 
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {currentUser?.role === 'admin' && (
              <div className="relative group">
                <button 
                  onClick={() => setIsAdminMode(true)} 
                  className="w-12 h-12 flex items-center justify-center text-white bg-[#3BB19B] hover:bg-[#2ea38d] hover:scale-110 active:scale-95 transition-all rounded-full border-2 border-white/80 shadow-lg"
                >
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" strokeWidth="2.5"><path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2z" /></svg>
                </button>
                <div className="header-tooltip">Панель управления</div>
              </div>
            )}
            
            <div className="relative group">
              <button 
                onClick={() => setIsDashboardOpen(true)} 
                className="w-12 h-12 flex items-center justify-center text-white bg-[#3BB19B] hover:bg-[#2ea38d] hover:scale-110 active:scale-95 transition-all rounded-full border-2 border-white/80 shadow-lg relative"
              >
                <svg className="w-6 h-6" fill={wishlist.length > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#f91155] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black border-2 border-white">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <div className="header-tooltip">{t.wishlist}</div>
            </div>

            <div className="relative group">
              <button 
                onClick={() => currentUser ? setIsDashboardOpen(true) : setIsAuthOpen(true)} 
                className="flex items-center gap-3 px-6 py-3 bg-[#3BB19B] hover:bg-[#2ea38d] text-white rounded-full border-2 border-white/80 shadow-lg transition-all"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 ring-2 ring-white/30 flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  )}
                </div>
                <span className="text-[13px] font-black uppercase text-white tracking-widest hidden md:block">
                  {currentUser ? currentUser.name.split(' ')[0] : t.login}
                </span>
              </button>
              <div className="header-tooltip">{t.account}</div>
            </div>

            <div className="relative group">
              <button 
                onClick={() => setIsCartPageOpen(true)} 
                className="w-12 h-12 flex items-center justify-center text-white bg-[#3BB19B] hover:bg-[#2ea38d] relative border-2 border-white/80 hover:scale-110 active:scale-95 transition-all rounded-full shadow-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#f91155] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 border-white animate-zoom-in">
                    {cart.length}
                  </span>
                )}
              </button>
              <div className="header-tooltip">{t.cart}</div>
            </div>
          </div>
        </header>

        <main className="flex-grow">
          {isDashboardOpen && currentUser ? (
            <CustomerDashboard 
              user={currentUser} onUpdateUser={handleUpdateUser} products={products} wishlist={wishlist} onToggleWishlist={handleToggleWishlist} 
              isOpen={true} onClose={() => setIsDashboardOpen(false)} onLogout={handleLogout} 
              settings={settings} cart={cart} onUpdateCart={()=>{}} onAdminOpen={() => setIsAdminMode(true)}
              orders={orders}
            />
          ) : isCartPageOpen ? (
            <CartPage items={cart} user={currentUser} settings={settings} promoCodes={promos} onUpdateQuantity={(id, d) => setCart(prev => prev.map(it => it.id === id ? {...it, quantity: Math.max(1, it.quantity + d)} : it))} onRemove={(id) => setCart(prev => prev.filter(it => it.id !== id))} onToggleWishlist={handleToggleWishlist} onClose={()=>setIsCartPageOpen(false)} onAuth={()=>setIsAuthOpen(true)} onPlaceOrder={handlePlaceOrder} language={language} />
          ) : (
            <div className="space-y-12 pb-32">
              {!activeCategoryId && !searchTerm && (
                <HeroSlider banners={banners} settings={settings} onBannerClick={(b) => b.link && setSelectedProduct(products.find(p => p.id === b.link) || null)} />
              )}
              
              {/* Main Category Selection */}
              <div className="container-premium no-print relative z-[90] mt-10">
                 <div className="px-10 py-6 glass-card flex justify-center gap-6 shadow-2xl overflow-x-auto hide-scrollbar">
                    <button 
                      onClick={() => { setActiveCategoryId(''); setActiveSubCategoryId(''); setSearchTerm(''); }}
                      className={`px-8 py-4 rounded-[1.8rem] text-[13px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${!activeCategoryId ? 'bg-[#1e2b6e] text-white shadow-xl' : 'text-slate-500 hover:bg-white/50'}`}
                    >
                      ВСЕ ТОВАРЫ
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat.id}
                        onClick={() => { setActiveCategoryId(cat.id); setActiveSubCategoryId(''); setSearchTerm(''); }}
                        className={`px-8 py-4 rounded-[1.8rem] text-[13px] font-black uppercase tracking-widest transition-all duration-500 whitespace-nowrap ${activeCategoryId === cat.id ? 'bg-[#3BB19B] text-white shadow-xl' : 'text-slate-500 hover:bg-white/50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                 </div>
              </div>

              {/* Sub-Category Row */}
              {activeCategory && activeCategory.subcategories && activeCategory.subcategories.length > 0 && (
                <div className="container-premium no-print animate-fade-in">
                  <div className="flex flex-wrap justify-center gap-4 bg-white/10 backdrop-blur-3xl p-5 rounded-[4rem] border border-white/20 shadow-xl">
                     {activeCategory.subcategories.map(sub => (
                       <button 
                          key={sub.id}
                          onClick={() => setActiveSubCategoryId(sub.id)}
                          className={`flex items-center gap-4 px-8 py-4 rounded-[2rem] text-[12px] font-black uppercase tracking-[0.1em] transition-all border border-white/30 shadow-md ${activeSubCategoryId === sub.id ? 'bg-[#1e2b6e] text-white' : 'bg-white/60 text-slate-800 hover:scale-105 hover:bg-white/80'}`}
                       >
                          <span className="text-2xl leading-none">{sub.icon}</span>
                          {sub.name}
                       </button>
                     ))}
                  </div>
                </div>
              )}

              {/* Products Listing */}
              <section className="container-premium space-y-16 mt-12">
                <div className="flex items-baseline justify-between">
                  <h2 className="section-title">
                    {searchTerm ? `Поиск: "${searchTerm}"` : (activeSubCategoryId ? activeCategory?.subcategories?.find(s=>s.id===activeSubCategoryId)?.name : (activeCategory?.name || 'Популярные товары'))}
                  </h2>
                </div>
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredProducts.map(p => (
                      <ProductCard 
                        key={p.id} 
                        product={p} 
                        currency={settings.currency} 
                        onAddToCart={handleAddToCart} 
                        onClick={setSelectedProduct} 
                        isComparing={comparisonIds.includes(p.id)} 
                        onToggleCompare={handleToggleCompare} 
                        onAddReview={handleAddReview} 
                        language={language} 
                        isWishlisted={wishlist.includes(p.id)} 
                        onToggleWishlist={handleToggleWishlist} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-40 text-center flex flex-col items-center justify-center space-y-8 glass-card rounded-[4rem]">
                    <div className="w-32 h-32 bg-slate-100/30 rounded-[3rem] flex items-center justify-center text-slate-300 animate-float">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Товары не найдены</h3>
                      <p className="text-slate-400 font-bold uppercase tracking-widest">Попробуйте изменить параметры поиска или фильтры</p>
                    </div>
                    <button onClick={() => { setSearchTerm(''); setActiveCategoryId(''); setActiveSubCategoryId(''); }} className="premium-btn px-16">Сбросить фильтры</button>
                  </div>
                )}
              </section>
            </div>
          )}
        </main>

        <Footer settings={settings} onPageClick={setActivePageId} language={language} />
      </div>

      {/* Scroll to Top Button - Positioned as requested in the bottom left area */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-32 left-12 z-[130] w-16 h-16 bg-[#3BB19B] text-white rounded-2xl shadow-[0_20px_50px_-10px_rgba(59,177,155,0.5)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-slide-up no-print group"
          title="Наверх"
        >
          <svg className="w-8 h-8 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Floating Comparison Bar */}
      {comparisonIds.length > 0 && !isCartPageOpen && !isDashboardOpen && !isAdminMode && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 z-[130] animate-slide-up no-print">
          <div className="bg-slate-900/90 backdrop-blur-2xl px-10 py-5 rounded-full border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] flex items-center gap-8">
            <div className="flex -space-x-4">
              {comparisonIds.map(id => {
                const p = products.find(prod => prod.id === id);
                return p ? (
                  <div key={id} className="w-12 h-12 rounded-full border-2 border-slate-900 bg-white p-1 overflow-hidden">
                    <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                  </div>
                ) : null;
              })}
            </div>
            <div className="h-6 w-px bg-white/20" />
            <div className="text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Сравнение</p>
              <p className="text-sm font-black italic">{comparisonIds.length} {language === 'ru' ? 'товара' : 'items'}</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsComparisonModalOpen(true)}
                className="bg-[#3BB19B] text-white px-8 py-3 rounded-full text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                {language === 'ru' ? 'Сравнить' : 'Compare'}
              </button>
              <button 
                onClick={() => setComparisonIds([])}
                className="text-white/40 hover:text-rose-500 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                {language === 'ru' ? 'Очистить' : 'Clear'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleAddToCart} onAddReview={handleAddReview} language={language} currency={settings.currency} />
      
      <ComparisonModal 
        isOpen={isComparisonModalOpen} 
        onClose={() => setIsComparisonModalOpen(false)} 
        products={products.filter(p => comparisonIds.includes(p.id))}
        onAddToCart={handleAddToCart}
        onRemove={handleToggleCompare}
        language={language}
        currency={settings.currency}
      />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onLogin={(u) => { setCurrentUser(u); setIsAuthOpen(false); }} language={language} settings={settings} />
      {activePageId && <PageViewer />}
      <AnnaAssistant language={language} user={currentUser} settings={settings} onUpdateSettings={setSettings} tasks={[]} onAddTask={()=>{}} onUpdateTask={()=>{}} />
    </div>
  );
};

export default App;
