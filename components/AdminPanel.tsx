
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Product, Order, StoreSettings, Category, Banner, 
  User, PromoCode, CMSPage, AuditLog
} from '../types';
import { ProductAdminModal } from './ProductAdminModal';
import { CouponModal } from './CouponModal';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (p: Product[]) => void;
  categories: Category[];
  onUpdateCategories: (c: Category[]) => void;
  orders: Order[];
  onUpdateOrders: (o: Order[]) => void;
  customers: User[];
  onUpdateCustomers: (u: User[]) => void;
  reviews: any[];
  onUpdateReviews: (r: any[]) => void;
  promos: PromoCode[];
  onUpdatePromos: (p: PromoCode[]) => void;
  pages: CMSPage[];
  onUpdatePages: (p: CMSPage[]) => void;
  banners: Banner[];
  onUpdateBanners: (b: Banner[]) => void;
  settings: StoreSettings;
  onUpdateSettings: (s: StoreSettings) => void;
  auditLogs: AuditLog[];
  onUpdateAuditLogs: (logs: AuditLog[]) => void;
  onExit: () => void;
  currentUser: User;
}

interface ChatMsg {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  products, onUpdateProducts, categories, onUpdateCategories, 
  orders, onUpdateOrders, promos, onUpdatePromos, 
  pages, onUpdatePages, banners, onUpdateBanners,
  settings, onUpdateSettings, onExit, customers,
  auditLogs, onUpdateAuditLogs, currentUser
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Marketing State
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromoCode | null>(null);

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    { id: '1', sender: 'Система', text: 'Добро пожаловать в центр управления коммуникациями.', time: '10:00', isMe: false },
    { id: '2', sender: 'Поддержка (L1)', text: 'У нас новый запрос по возврату от заказа #ЗАКАЗ-431.', time: '10:05', isMe: false }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Banner Management State
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, showChat]);

  // Stats Logic
  const totalRevenue = useMemo(() => orders.reduce((sum, o) => sum + o.total, 0), [orders]);
  const avgOrderValue = useMemo(() => orders.length ? Math.round(totalRevenue / orders.length) : 0, [orders]);
  const lowStockCount = useMemo(() => products.filter(p => p.stock < 5).length, [products]);

  const addAuditLog = (action: string, details: string, type: AuditLog['type']) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      adminName: currentUser.name,
      adminEmail: currentUser.email,
      action,
      details,
      type,
      timestamp: new Date().toISOString()
    };
    onUpdateAuditLogs([newLog, ...auditLogs].slice(0, 1000));
  };

  const getStatusBadgeClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('подтвержден') || s.includes('оплачен') || s === 'active') return 'bg-emerald-500/10 text-emerald-500';
    if (s.includes('отменен') || s === 'hidden' || s === 'inactive' || s === 'expired') return 'bg-rose-500/10 text-rose-500';
    return 'bg-indigo-500/10 text-indigo-500';
  };
// Удаление товара
const handleDeleteProduct = (productId: string) => {
  const product = products.find(p => p.id === productId);
  const name = product?.name || 'товар';

  if (!confirm(`Удалить "${name}"?`)) return;

  const updatedProducts = products.filter(p => p.id !== productId);
  onUpdateProducts(updatedProducts);

  addAuditLog('Удаление товара', name, 'product');
};
  const handlePrintInvoice = (order: Order) => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Счёт #${order.id}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #333; }
            .header { border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 40px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            .total { font-size: 20px; font-weight: bold; text-align: right; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.storeName}</h1>
            <p>Счёт на оплату: ${order.id}</p>
            <p>Дата: ${order.date}</p>
          </div>
          <p><strong>Покупатель:</strong> ${order.customerName} (${order.customerEmail})</p>
          <table>
            <thead><tr><th>Товар</th><th>Кол-во</th><th>Цена</th><th>Сумма</th></tr></thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.price} ${settings.currency}</td>
                  <td>${item.price * item.quantity} ${settings.currency}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="total">Итого к оплате: ${order.total} ${settings.currency}</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
    addAuditLog('Печать счета', `Распечатан счет для заказа ${order.id}`, 'order');
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg: ChatMsg = {
      id: Date.now().toString(),
      sender: currentUser.name,
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput('');
    
    // Auto-reply mock
    setTimeout(() => {
      const reply: ChatMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'Система',
        text: 'Сообщение доставлено всем участникам чата.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setChatMessages(prev => [...prev, reply]);
    }, 1000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { id: 'orders', label: 'Заказы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
    { id: 'products', label: 'Товары', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { id: 'banners', label: 'Баннеры', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
    { id: 'customers', label: 'Клиенты', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'marketing', label: 'Маркетинг', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
    { id: 'analytics', label: 'Аналитика', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'inventory', label: 'Склад', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
    { id: 'settings', label: 'Настройки', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  const renderDashboard = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e2b40] p-6 rounded-3xl border border-white/5 shadow-lg relative overflow-hidden group">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Общий объем продаж</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-white italic tracking-tighter">{totalRevenue.toLocaleString()} {settings.currency}</h3>
            <span className="text-emerald-400 text-[10px] font-black uppercase">+12% Сегодня</span>
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <span>На этой неделе: 1,235</span>
            <span>Ср. чек: ${avgOrderValue}</span>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <svg className="w-16 h-16 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" /></svg>
          </div>
        </div>

        <div className="bg-[#1e2b40] p-6 rounded-3xl border border-white/5 shadow-lg">
          <div className="flex justify-between items-start mb-4">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Управление складом</p>
             <button className="text-[10px] text-indigo-400 font-black uppercase hover:underline">Отчет</button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
               <span className="text-sm text-white font-bold">В наличии: <span className="text-[#3BB19B]">1,230</span></span>
               <span className="text-[10px] bg-rose-500/10 text-rose-500 px-2 py-1 rounded-lg font-black">Мало: {lowStockCount}</span>
            </div>
            <div className="flex gap-2">
               <button className="flex-grow py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl border border-white/5 transition-all">Импорт CSV</button>
               <button className="flex-grow py-2.5 bg-slate-800/50 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-xl border border-white/5 transition-all">Экспорт</button>
            </div>
          </div>
        </div>

        <div className="bg-[#1e2b40] p-6 rounded-3xl border border-white/5 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
             <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Детали заказа</p>
             <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg font-black uppercase tracking-widest">Новый Оплачен</span>
          </div>
          <div className="space-y-3">
             {orders[0] ? (
               <>
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-xl text-slate-400 font-bold">👤</div>
                    <div>
                       <p className="text-sm font-black text-white">{orders[0].customerName}</p>
                       <p className="text-[10px] text-slate-500 font-bold">{orders[0].customerEmail}</p>
                    </div>
                 </div>
                 <p className="text-xs text-slate-300 font-medium">Заказ {orders[0].id} <span className="float-right font-black">{orders[0].total} {settings.currency}</span></p>
                 <button 
                   onClick={() => handlePrintInvoice(orders[0])}
                   className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                 >
                   Распечатать счет
                 </button>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center h-24 opacity-30">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white">Нет активных заказов</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-xl min-h-[400px]">
           <div className="flex justify-between items-center mb-10">
              <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">Обзор продаж</h4>
              <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
                 <button className="px-4 py-1.5 text-slate-400 text-[9px] font-black rounded-lg hover:text-white transition-colors">День</button>
                 <button className="px-4 py-1.5 bg-indigo-600 text-white text-[9px] font-black rounded-lg shadow-lg">Неделя</button>
              </div>
           </div>
           
           <div className="relative h-64 w-full flex items-end gap-3 px-2">
              {[30, 50, 25, 75, 55, 90, 45, 80, 60, 95, 70, 85].map((h, i) => (
                <div key={i} className="flex-grow group relative h-full flex flex-col justify-end">
                   <div style={{ height: `${h}%` }} className="bg-indigo-500/20 rounded-t-xl transition-all group-hover:bg-indigo-500/30" />
                   <div style={{ height: `${h-15}%` }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-xl shadow-lg shadow-indigo-500/20" />
                   <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[8px] font-black text-indigo-400">${h*100}</span>
                   </div>
                </div>
              ))}
           </div>
           <div className="mt-8 flex justify-between text-[10px] font-black text-slate-500 uppercase px-2 tracking-tighter">
              <span>Янв</span><span>Фев</span><span>Мар</span><span>Апр</span><span>Май</span><span>Июн</span><span>Июл</span><span>Авг</span><span>Сен</span><span>Окт</span><span>Ноя</span><span>Дек</span>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
              <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest mb-8">Топ товаров</h4>
              <div className="space-y-6">
                 {products.slice(0, 3).map(p => (
                   <div key={p.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
                        <img src={p.image} className="max-w-full max-h-full object-contain mix-blend-screen" alt={p.name} />
                      </div>
                      <div className="flex-grow overflow-hidden">
                         <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{p.name}</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.brand}</p>
                      </div>
                      <span className="text-xs font-black text-indigo-400 italic">${p.price}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-slate-400 text-xs font-black uppercase tracking-widest">Маркетинг и акции</h4>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 group hover:border-[#3BB19B]/30 cursor-pointer transition-all">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Flash Sale 20% OFF</span>
                    <span className="text-[9px] text-emerald-400 font-black uppercase tracking-widest">Активен</span>
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-white/5 group hover:border-indigo-400/30 cursor-pointer transition-all">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Spring Promo BOGO</span>
                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Завтра</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  const handleSavePromo = (promo: PromoCode) => {
    const updated = promos.some(p => p.id === promo.id) 
      ? promos.map(p => p.id === promo.id ? promo : p)
      : [promo, ...promos];
    
    onUpdatePromos(updated);
    addAuditLog(promos.some(p => p.id === promo.id) ? 'Обновление купона' : 'Создание купона', promo.code, 'settings');
    setIsPromoModalOpen(false);
    setEditingPromo(null);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;
    
    const updatedBanners = banners.some(b => b.id === editingBanner.id)
      ? banners.map(b => b.id === editingBanner.id ? editingBanner : b)
      : [...banners, editingBanner];
    
    onUpdateBanners(updatedBanners);
    addAuditLog(banners.some(b => b.id === editingBanner.id) ? 'Обновление баннера' : 'Создание баннера', editingBanner.title || 'Безымянный', 'settings');
    setIsBannerModalOpen(false);
  };

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingBanner) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (file.type.startsWith('video/')) {
        setEditingBanner({ ...editingBanner, videoUrl: result, imageUrl: undefined });
      } else {
        setEditingBanner({ ...editingBanner, imageUrl: result, videoUrl: undefined });
      }
    };
    reader.readAsDataURL(file);
  };

  const renderBanners = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Баннеры на главной</h2>
          <button 
            onClick={() => { 
              setEditingBanner({ 
                id: 'bn-' + Date.now(), 
                status: 'active', 
                order: banners.length + 1, 
                animationType: 'fade', 
                contentAlignment: 'left',
                overlayOpacity: 0.4
              }); 
              setIsBannerModalOpen(true); 
            }}
            className="px-6 py-3 bg-[#3BB19B] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Добавить баннер
          </button>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.sort((a,b) => a.order - b.order).map(banner => (
            <div key={banner.id} className="bg-[#1e2b40] rounded-[2.5rem] border border-white/5 overflow-hidden shadow-xl group">
               <div className="relative aspect-[16/9] bg-black/40">
                  {banner.videoUrl ? (
                    <video src={banner.videoUrl} className="w-full h-full object-cover opacity-60" muted autoPlay loop />
                  ) : (
                    <img src={banner.imageUrl} className="w-full h-full object-cover opacity-60" />
                  )}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                     <p className="text-xs font-black text-white italic tracking-tighter truncate">{banner.title}</p>
                     <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Порядок: {banner.order}</p>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => { setEditingBanner(banner); setIsBannerModalOpen(true); }} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-[#3BB19B] transition-all">✏️</button>
                     <button onClick={() => { if(confirm('Удалить баннер?')) onUpdateBanners(banners.filter(b => b.id !== banner.id)); }} className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-rose-500 transition-all">🗑️</button>
                  </div>
                  <div className="absolute top-4 left-4">
                     <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${getStatusBadgeClass(banner.status)}`}>{banner.status}</span>
                  </div>
               </div>
               <div className="p-6 flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span>Переход: {banner.animationType}</span>
                  <div className="flex gap-1">
                     {banner.imageUrl?.endsWith('.gif') && <span className="bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded">GIF</span>}
                     {banner.videoUrl && <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">VIDEO</span>}
                  </div>
               </div>
            </div>
          ))}
       </div>

       {isBannerModalOpen && editingBanner && (
         <div className="fixed inset-0 z-[2100] flex items-center justify-center p-6 bg-[#0F172A]/80 backdrop-blur-xl animate-fade-in">
            <div className="bg-[#1e2b40] w-full max-w-5xl rounded-[3rem] shadow-2xl border border-white/5 overflow-hidden flex flex-col max-h-[90vh] animate-zoom-in">
               <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase leading-none">Настройка баннера</h3>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-2">Визуальный редактор NovaScale™</p>
                  </div>
                  <button onClick={() => setIsBannerModalOpen(false)} className="text-slate-500 hover:text-white transition-colors">✕</button>
               </div>

               <div className="flex-grow overflow-y-auto p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 hide-scrollbar">
                  <form onSubmit={handleSaveBanner} className="space-y-6">
                     <div className="space-y-4">
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Заголовок баннера</label>
                           <input type="text" value={editingBanner.title || ''} onChange={e => setEditingBanner({...editingBanner, title: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B]" />
                        </div>
                        <div className="space-y-1">
                           <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Подзаголовок</label>
                           <textarea value={editingBanner.subtitle || ''} onChange={e => setEditingBanner({...editingBanner, subtitle: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B] h-24 resize-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Текст кнопки</label>
                              <input type="text" value={editingBanner.buttonText || ''} onChange={e => setEditingBanner({...editingBanner, buttonText: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none" />
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Ссылка / ID товара</label>
                              <input type="text" value={editingBanner.link || ''} onChange={e => setEditingBanner({...editingBanner, link: e.target.value})} className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-white/5">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Анимация и Стиль</h4>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Тип перехода</label>
                              <select 
                                value={editingBanner.animationType} 
                                onChange={e => setEditingBanner({...editingBanner, animationType: e.target.value as any})}
                                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold appearance-none"
                              >
                                 <option value="fade">Плавное затухание (Fade)</option>
                                 <option value="slide">Сдвиг (Slide)</option>
                              </select>
                           </div>
                           <div className="space-y-1">
                              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Выравнивание контента</label>
                              <select 
                                value={editingBanner.contentAlignment} 
                                onChange={e => setEditingBanner({...editingBanner, contentAlignment: e.target.value as any})}
                                className="w-full p-4 bg-black/20 border border-white/5 rounded-2xl text-white font-bold appearance-none"
                              >
                                 <option value="left">Слева</option>
                                 <option value="center">По центру</option>
                                 <option value="right">Справа</option>
                              </select>
                           </div>
                        </div>
                        <div className="space-y-2">
                           <div className="flex justify-between items-center">
                              <label className="text-[9px] font-black text-slate-500 uppercase ml-2 tracking-widest">Прозрачность наложения: {Math.round((editingBanner.overlayOpacity || 0.4) * 100)}%</label>
                           </div>
                           <input 
                             type="range" min="0" max="1" step="0.1" 
                             value={editingBanner.overlayOpacity} 
                             onChange={e => setEditingBanner({...editingBanner, overlayOpacity: parseFloat(e.target.value)})}
                             className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#3BB19B]" 
                           />
                        </div>
                     </div>
                  </form>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Фон баннера (Image / GIF / Video)</h4>
                     <div 
                       onClick={() => bannerFileRef.current?.click()}
                       className="relative aspect-video bg-black/40 rounded-[2.5rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer group hover:border-[#3BB19B]/50 transition-all overflow-hidden"
                     >
                        {(editingBanner.imageUrl || editingBanner.videoUrl) ? (
                           <>
                             {editingBanner.videoUrl ? (
                               <video src={editingBanner.videoUrl} className="absolute inset-0 w-full h-full object-cover" muted autoPlay loop />
                             ) : (
                               <img src={editingBanner.imageUrl} className="absolute inset-0 w-full h-full object-cover" />
                             )}
                             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Сменить медиафайл</span>
                             </div>
                           </>
                        ) : (
                           <div className="text-center space-y-3 opacity-30 group-hover:opacity-100 transition-opacity">
                              <span className="text-4xl text-slate-400">📁</span>
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">Кликните для загрузки с компьютера</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase italic">Поддержка JPG, PNG, GIF, MP4</p>
                           </div>
                        )}
                     </div>
                     <input type="file" ref={bannerFileRef} className="hidden" accept="image/*,video/*" onChange={handleBannerFileUpload} />

                     <div className="bg-black/20 p-6 rounded-[2.5rem] border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Превью контента</span>
                        </div>
                        <div className={`p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 ${editingBanner.contentAlignment === 'center' ? 'text-center' : editingBanner.contentAlignment === 'right' ? 'text-right' : 'text-left'}`}>
                           <h4 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none mb-3">{editingBanner.title || 'Заголовок'}</h4>
                           <p className="text-xs text-slate-400 font-bold max-w-xs inline-block">{editingBanner.subtitle || 'Ваше описание здесь'}</p>
                           <div className="mt-6">
                              <button className="px-6 py-2.5 bg-[#3BB19B] text-white rounded-xl text-[9px] font-black uppercase tracking-widest">{editingBanner.buttonText || 'Перейти'}</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="px-10 py-8 border-t border-white/5 bg-black/10 flex justify-end gap-4 shrink-0">
                  <button onClick={() => setIsBannerModalOpen(false)} className="px-10 py-4 text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">Отмена</button>
                  <button onClick={handleSaveBanner} className="px-12 py-4 bg-[#3BB19B] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all">Сохранить баннер</button>
               </div>
            </div>
         </div>
       )}
    </div>
  );

  const renderOrders = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Заказы</h2>
          <div className="flex gap-4">
             <input 
               type="text" placeholder="Поиск по ID или имени..." 
               className="bg-[#1e2b40] border border-white/5 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-indigo-500" 
             />
             <button className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Экспорт CSV</button>
          </div>
       </div>
       <div className="bg-[#1e2b40] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-900/40 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                <tr><th className="px-8 py-6">Заказ</th><th className="px-4 py-6">Клиент</th><th className="px-4 py-6">Сумма</th><th className="px-4 py-6">Статус</th><th className="px-8 py-6 text-right">Действия</th></tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-white/5 transition-colors">
                     <td className="px-8 py-5"><span className="text-xs font-black text-white">{o.id}</span><p className="text-[10px] text-slate-500">{o.date}</p></td>
                     <td className="px-4 py-5"><p className="text-sm font-bold text-white">{o.customerName}</p><p className="text-[10px] text-slate-500">{o.customerEmail}</p></td>
                     <td className="px-4 py-5 font-black text-indigo-400">{o.total.toLocaleString()} {settings.currency}</td>
                     <td className="px-4 py-5"><span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${getStatusBadgeClass(o.status)}`}>{o.status}</span></td>
                     <td className="px-8 py-5 text-right flex justify-end gap-2">
                        <button onClick={() => handlePrintInvoice(o)} className="p-2 text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2"/></svg></button>
                        <button className="p-2 text-slate-400 hover:text-white transition-colors"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeWidth="2"/><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth="2"/></svg></button>
                     </td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td colSpan={5} className="py-20 text-center text-slate-500">Заказов нет</td></tr>}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Клиенты</h2>
       </div>
       <div className="bg-[#1e2b40] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-900/40 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                <tr><th className="px-8 py-6">Имя</th><th className="px-4 py-6">Контакты</th><th className="px-4 py-6">Регистрация</th><th className="px-4 py-6">Статус</th><th className="px-8 py-6 text-right">Управление</th></tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {[currentUser, ...customers].filter(Boolean).map((c: any) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                     <td className="px-8 py-5 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[10px]">{c.name[0]}</div>
                        <span className="text-sm font-black text-white">{c.name}</span>
                     </td>
                     <td className="px-4 py-5"><p className="text-xs text-white">{c.email}</p><p className="text-[10px] text-slate-500">{c.phone || 'Нет телефона'}</p></td>
                     <td className="px-4 py-5 text-xs text-slate-400">{new Date(c.joinedDate).toLocaleDateString()}</td>
                     <td className="px-4 py-5"><span className="px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">Активен</span></td>
                     <td className="px-8 py-5 text-right"><button className="text-indigo-400 font-black text-[10px] uppercase hover:underline">Подробнее</button></td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderMarketing = () => (
    <div className="p-8 space-y-8 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Маркетинг и Купоны</h2>
          <button 
            onClick={() => {
               setEditingPromo(null);
               setIsPromoModalOpen(true);
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
          >Создать купон</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
             <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Активные купоны</h4>
             <div className="space-y-4">
                {promos.map(p => (
                   <div key={p.id} className="flex items-center justify-between p-6 bg-black/20 rounded-2xl border border-white/5 group hover:border-[#3BB19B]/30 transition-all">
                      <div>
                         <p className="text-sm font-black text-white tracking-widest mb-1">{p.code}</p>
                         <p className="text-[10px] text-slate-500 font-bold uppercase">Скидка {p.discountValue}{p.type === 'percent' ? '%' : ' ' + settings.currency}</p>
                         {p.expiresAt && <p className="text-[8px] text-slate-600 font-black uppercase mt-1">До: {new Date(p.expiresAt).toLocaleDateString()}</p>}
                      </div>
                      <div className="text-right space-y-2">
                         <p className="text-[10px] text-emerald-400 font-black uppercase">Исп: {p.usedCount}</p>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingPromo(p); setIsPromoModalOpen(true); }} className="text-indigo-400 text-[9px] font-black uppercase hover:underline">Изм.</button>
                            <button onClick={() => { if(confirm('Удалить купон?')) onUpdatePromos(promos.filter(x => x.id !== p.id)); }} className="text-rose-500 text-[9px] font-black uppercase hover:underline">Удалить</button>
                         </div>
                      </div>
                   </div>
                ))}
                {promos.length === 0 && <p className="text-center py-10 text-slate-500 text-xs italic">Список купонов пуст</p>}
             </div>
          </div>
       </div>

       <CouponModal 
          isOpen={isPromoModalOpen} 
          onClose={() => setIsPromoModalOpen(false)} 
          onSave={handleSavePromo} 
          settings={settings} 
          editingPromo={editingPromo} 
       />
    </div>
  );

  const renderInventory = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Складской учёт</h2>
       </div>
       <div className="bg-[#1e2b40] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-900/40 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                <tr><th className="px-8 py-6">Товар</th><th className="px-4 py-6">SKU</th><th className="px-4 py-6">На складе</th><th className="px-4 py-6">Резерв</th><th className="px-8 py-6 text-right">Статус</th></tr>
             </thead>
             <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                     <td className="px-8 py-5 flex items-center gap-4">
                        <img src={p.image} className="w-10 h-10 rounded-xl bg-white/10 object-contain p-1" />
                        <span className="text-sm font-black text-white">{p.name}</span>
                     </td>
                     <td className="px-4 py-5 text-xs text-slate-400 font-mono">{p.sku}</td>
                     <td className="px-4 py-5"><span className={`font-black text-sm ${p.stock < 5 ? 'text-rose-400' : 'text-emerald-400'}`}>{p.stock} {p.unit}</span></td>
                     <td className="px-4 py-5 text-xs text-slate-500 font-bold">0 {p.unit}</td>
                     <td className="px-8 py-5 text-right">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.stock < 5 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {p.stock < 5 ? 'Мало' : 'Ок'}
                        </span>
                     </td>
                  </tr>
                ))}
             </tbody>
          </table>
       </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="p-8 space-y-10 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Аналитика и отчёты</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-lg">
             <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Распределение по брендам</h4>
             <div className="space-y-4">
                {Array.from(new Set(products.map(p => p.brand))).map(brand => {
                   const count = products.filter(p => p.brand === brand).length;
                   const perc = Math.round((count / products.length) * 100);
                   return (
                     <div key={brand} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase text-white tracking-widest">
                           <span>{brand}</span>
                           <span>{count} шт. ({perc}%)</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                           <div style={{ width: `${perc}%` }} className="h-full bg-indigo-500" />
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>
          <div className="bg-[#1e2b40] p-8 rounded-[2.5rem] border border-white/5 shadow-lg md:col-span-2">
             <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">Динамика прибыли</h4>
             <div className="h-64 flex items-end gap-3 px-4">
                {[10, 40, 25, 60, 45, 80, 50, 95, 70, 40, 85, 100].map((v, i) => (
                  <div key={i} className="flex-grow bg-emerald-500/20 rounded-t-lg relative group transition-all hover:bg-emerald-500/40">
                     <div style={{ height: `${v}%` }} className="w-full bg-emerald-500 rounded-t-lg shadow-xl shadow-emerald-500/10" />
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="p-10 animate-fade-in space-y-10 overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none">Настройки системы</h2>
          <button 
            onClick={() => {
               alert('Настройки успешно сохранены в базе данных');
               addAuditLog('Обновление настроек', 'Обновлены основные настройки системы', 'settings');
            }}
            className="px-10 py-4 bg-[#3BB19B] text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-teal-500/20"
          >Сохранить всё</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#1e2b40] p-10 rounded-[3rem] border border-white/5 space-y-8">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Основные данные</h4>
             <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Название магазина</label>
                   <input 
                     type="text" value={settings.storeName} 
                     onChange={e => onUpdateSettings({...settings, storeName: e.target.value})}
                     className="w-full p-5 bg-black/20 border border-white/5 rounded-2xl text-white font-bold outline-none focus:border-[#3BB19B] transition-all" 
                   />
                </div>
             </div>
          </div>
       </div>
    </div>
  );

  const renderProductsList = () => (
    <div className="p-8 space-y-6 animate-fade-in overflow-y-auto max-h-screen hide-scrollbar">
       <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Управление товарами</h2>
          <button 
            onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
            className="px-6 py-3 bg-[#3BB19B] text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Добавить товар
          </button>
       </div>
       <div className="bg-[#1e2b40] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
          <table className="w-full text-left">
             <thead className="bg-slate-900/40 text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">
                <tr><th className="px-8 py-6">Товар</th><th className="px-4 py-6">SKU</th><th className="px-4 py-6">Цена</th><th className="px-4 py-6">Склад</th><th className="px-8 py-6 text-right">Действия</th></tr>
             </thead>
             <tbody className="divide-y divide-white/5">
{products.map(p => (
  <tr key={p.id} className="hover:bg-white/5 transition-colors group">
    <td className="px-8 py-5 flex items-center gap-4">
      <img src={p.image} className="w-10 h-10 rounded-xl bg-white/10 object-contain p-1" />
      <span className="text-sm font-black text-white">{p.name}</span>
    </td>
    <td className="px-4 py-5 text-xs text-slate-400 font-mono uppercase">{p.sku}</td>
    <td className="px-4 py-5 text-sm font-black text-indigo-400">${p.price}</td>
    <td className="px-4 py-5">
      <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${p.stock < 5 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
        {p.stock} шт
      </span>
    </td>
    <td className="px-8 py-5 text-right flex justify-end gap-2">
      <button
        onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }}
        className="p-2 text-slate-500 hover:text-[#3BB19B] transition-colors"
        title="Редактировать"
      >
        ✏️
      </button>

      <button
        onClick={() => handleDeleteProduct(p.id)}
        className="p-2 text-rose-400 hover:text-rose-500 transition-colors"
        title="Удалить товар"
      >
        🗑️
      </button>
    </td>
  </tr>
))}
             </tbody>
          </table>
       </div>
       <ProductAdminModal product={editingProduct} categories={categories} settings={settings} isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)} onSave={(p) => { 
         const updated = products.some(old => old.id === p.id) ? products.map(o => o.id === p.id ? p : o) : [p, ...products];
         onUpdateProducts(updated);
         addAuditLog(editingProduct ? 'Обновление' : 'Создание', p.name, 'product');
         setIsProductModalOpen(false);
       }} />
    </div>
  );

  return (
    <div className="fixed inset-0 bg-[#0F172A] flex overflow-hidden no-print z-[1000] text-slate-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0B1120] border-r border-white/5 flex flex-col shrink-0">
        <div className="p-8 mb-4">
          <div className="flex flex-col leading-none select-none">
            <span className="text-4xl font-black italic text-[#3BB19B] tracking-tighter uppercase drop-shadow-xl">GISI</span>
            <span className="text-xl font-black text-white/90 tracking-[0.3em] -mt-1 uppercase opacity-80">ADMIN</span>
          </div>
        </div>

        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4 px-4">Меню</p>
           {menuItems.map(item => (
             <button
               key={item.id}
               onClick={() => setActiveTab(item.id)}
               className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all ${
                 activeTab === item.id 
                   ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                   : 'text-slate-500 hover:bg-white/5 hover:text-white'
               }`}
             >
               <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500'}`}>{item.icon}</span>
               {item.label}
             </button>
           ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-black/20 space-y-4">
           <button onClick={() => setShowChat(true)} className="w-full flex items-center gap-3 text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600/20 transition-all text-slate-400 group-hover:text-indigo-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              Поддержка
           </button>
           <button onClick={() => window.open('https://docs.google.com/document/d/1v9Xv1oX1w1v1v1v1v1v1v1v1v1v1v1v/edit')} className="w-full flex items-center gap-3 text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-widest transition-colors group">
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-emerald-600/20 transition-all text-slate-400 group-hover:text-emerald-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              Документация
           </button>
           <button onClick={onExit} className="w-full mt-6 py-4 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all">Выйти</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#0F172A]">
        
        {/* GLOBAL TOP BAR */}
        <header className="h-20 bg-[#0B1120]/80 backdrop-blur-xl border-b border-white/5 px-10 flex items-center justify-between shrink-0">
           <div className="flex-grow max-w-2xl relative">
              <input 
                type="text" placeholder="Быстрый поиск заказов, товаров, клиентов..." 
                className="w-full pl-14 pr-12 py-3 bg-white/5 border border-white/5 rounded-full text-xs font-bold text-white outline-none focus:bg-white/10 transition-all"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-500 hover:text-white transition-colors relative">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                       <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-[#0B1120]">3</span>
                    </button>
                    {showNotifications && (
                       <div className="absolute top-full right-0 mt-4 w-80 bg-[#1e2b40] rounded-3xl border border-white/5 shadow-2xl p-6 z-[200] animate-zoom-in">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Уведомления</p>
                          <div className="space-y-4">
                             <div className="p-3 bg-black/20 rounded-xl border-l-4 border-rose-500"><p className="text-xs text-white font-bold">Низкий запас товара</p><p className="text-[9px] text-slate-400 mt-1">BALLU BSPR09HN1 - осталось 2 шт.</p></div>
                             <div className="p-3 bg-black/20 rounded-xl border-l-4 border-emerald-500"><p className="text-xs text-white font-bold">Новый заказ #ЗАКАЗ-431</p><p className="text-[9px] text-slate-400 mt-1">Оплачено: 45,000 AMD</p></div>
                          </div>
                       </div>
                    )}
                 </div>
                 <button onClick={() => setShowChat(!showChat)} className={`p-2 transition-colors relative ${showChat ? 'text-[#3BB19B]' : 'text-slate-500 hover:text-white'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B1120] animate-pulse"></span>
                 </button>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-white leading-none mb-1 uppercase tracking-tight">{currentUser.name}</p>
                    <p className="text-[10px] font-bold text-[#3BB19B] uppercase tracking-widest">{currentUser.role}</p>
                 </div>
                 <div className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-[#3BB19B]/30"><img src={currentUser.avatar} className="w-full h-full object-cover" alt="Admin" /></div>
              </div>
           </div>
        </header>

        {/* CONTENT SWITCHER */}
        <div className="flex-grow relative overflow-hidden">
           {activeTab === 'dashboard' && renderDashboard()}
           {activeTab === 'orders' && renderOrders()}
           {activeTab === 'products' && renderProductsList()}
           {activeTab === 'banners' && renderBanners()}
           {activeTab === 'customers' && renderCustomers()}
           {activeTab === 'marketing' && renderMarketing()}
           {activeTab === 'inventory' && renderInventory()}
           {activeTab === 'analytics' && renderAnalytics()}
           {activeTab === 'settings' && renderSettings()}
        </div>

        {/* Admin Chat Overlay */}
        {showChat && (
          <div className="fixed bottom-10 right-10 w-[400px] h-[600px] bg-[#1e2b40] rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col z-[3000] animate-zoom-in overflow-hidden">
             <div className="p-6 bg-slate-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#3BB19B]/20 rounded-xl flex items-center justify-center text-emerald-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                   </div>
                   <div>
                      <h4 className="text-xs font-black text-white uppercase tracking-widest">Личный Чат</h4>
                      <p className="text-[9px] font-bold text-emerald-400 uppercase">Онлайн</p>
                   </div>
                </div>
                <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white transition-colors">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             
             <div className="flex-grow overflow-y-auto p-6 space-y-4 hide-scrollbar">
                {chatMessages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                     {!msg.isMe && <span className="text-[8px] font-black text-slate-500 uppercase mb-1 ml-1">{msg.sender}</span>}
                     <div className={`max-w-[85%] p-3.5 rounded-2xl text-[13px] font-bold ${msg.isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-900 text-slate-200 border border-white/5 rounded-tl-none'}`}>
                        {msg.text}
                        <div className={`text-[8px] mt-1.5 opacity-50 ${msg.isMe ? 'text-right' : 'text-left'}`}>{msg.time}</div>
                     </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
             </div>

             <div className="p-6 bg-slate-900/50">
                <div className="relative flex items-center bg-black/40 rounded-2xl border border-white/5 p-1 px-4 focus-within:border-[#3BB19B]/50 transition-all">
                   <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Написать сообщение..."
                      className="w-full py-3 bg-transparent border-none outline-none text-xs font-bold text-white placeholder:text-slate-600"
                   />
                   <button 
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim()}
                      className="p-2 text-[#3BB19B] disabled:opacity-30 hover:scale-110 transition-transform active:scale-95"
                   >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                   </button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};
