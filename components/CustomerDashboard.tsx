
import React, { useState, useMemo } from 'react';
import { User, Product, StoreSettings, Order, BonusTransaction, UserSession, SupportTicket, Address } from '../types';
import { ProductCard } from './ProductCard';

interface CustomerDashboardProps {
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
  products: Product[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  settings: StoreSettings;
  orders: Order[];
}

type Section = 'home' | 'orders' | 'addresses' | 'payment' | 'bonuses' | 'wishlist' | 'reviews' | 'notifications' | 'settings' | 'security' | 'support';

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ 
  user, onUpdateUser, products, wishlist, onToggleWishlist, onLogout, settings, onClose, orders
}) => {
  const [activeSection, setActiveSection] = useState<Section>('home');
  
  // Mock data for internal dashboard state
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Дом', city: 'Ереван', street: 'ул. Абовяна', house: '15', apartment: '42', isDefault: true },
    { id: '2', label: 'Офис', city: 'Ереван', street: 'пр. Маштоца', house: '5', isDefault: false }
  ]);

  const [bonusHistory] = useState<BonusTransaction[]>([
    { id: '1', type: 'accrual', amount: 500, description: 'Приветственный бонус', date: '10.01.2024' },
    { id: '2', type: 'accrual', amount: 750, description: 'Кэшбэк за заказ №123456', date: '19.04.2024' }
  ]);

  const loginHistory: UserSession[] = [
    { id: '1', device: 'Chrome / MacOS', ip: '81.16.11.174', lastActive: '10:15 Сегодня', isCurrent: true },
    { id: '2', device: 'iPhone 15 Pro', ip: '45.89.66.154', lastActive: '18:30 Вчера', isCurrent: false },
    { id: '3', device: 'Windows 11 / Edge', ip: '81.16.11.174', lastActive: '12:22 Вчера', isCurrent: false }
  ];

  const menuItems = [
    { id: 'home', label: 'Главная', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'orders', label: 'Мои заказы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { id: 'addresses', label: 'Адреса доставки', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'payment', label: 'Оплата', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
    { id: 'bonuses', label: 'Бонусы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    { id: 'wishlist', label: 'Избранное', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
    { id: 'reviews', label: 'Отзывы', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
    { id: 'notifications', label: 'Уведомления', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>, badge: 5 },
    { id: 'settings', label: 'Настройки', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    { id: 'security', label: 'Безопасность', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
  ];

  const renderHome = () => (
    <div className="space-y-6 animate-fade-in">
       {/* Top Widgets Row */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500">Мои заказы</span>
             </div>
             <div className="p-6 bg-slate-50/40">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900">Заказ № 123456</p>
                      <p className="text-[10px] font-bold text-slate-400">19 апреля 2024</p>
                   </div>
                   <button onClick={() => setActiveSection('orders')} className="ml-auto px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">Отследить</button>
                </div>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col justify-center cursor-pointer hover:border-indigo-100 transition-colors" onClick={() => setActiveSection('bonuses')}>
             <p className="text-xs font-bold text-slate-500 mb-2">Бонусы</p>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">{user.loyaltyPoints}</span>
                <span className="text-sm font-bold text-slate-500">Бонусных баллов</span>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
             <p className="text-xs font-bold text-slate-500 mb-2">Купоны и скидки</p>
             <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">2</span>
                <span className="text-sm font-bold text-slate-500">Активные купоны</span>
             </div>
          </div>
       </div>

       {/* Middle Content Grid */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">Избранное</h3>
                <button onClick={() => setActiveSection('wishlist')} className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Перейти</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/50 rounded-[1.5rem] border border-slate-100 p-6 flex flex-col items-center">
                   <div className="flex -space-x-4 mb-6">
                      {products.slice(0, 3).map((p, idx) => (
                        <div key={idx} className="w-14 h-14 bg-white rounded-full border-2 border-white shadow-sm flex items-center justify-center p-2"><img src={p.image} className="object-contain" /></div>
                      ))}
                   </div>
                   <p className="text-lg font-black text-slate-900">{wishlist.length} <span className="text-sm font-bold text-slate-400 ml-1 uppercase">Товаров</span></p>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Рекомендации для вас</p>
                   </div>
                   <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                      {products.slice(3, 6).map((p, idx) => (
                        <div key={idx} className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center p-2 shrink-0 border border-slate-100"><img src={p.image} className="object-contain" /></div>
                      ))}
                   </div>
                   <button className="w-full py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-slate-50 transition-colors">Смотреть все</button>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 flex flex-col">
             <h3 className="text-base font-black text-slate-900 mb-8 uppercase tracking-tight">Поддержка</h3>
             <div className="flex-grow flex flex-col justify-center">
                <div className="flex items-baseline gap-2 mb-8">
                   <span className="text-5xl font-black text-slate-900">1</span>
                   <span className="text-sm font-bold text-slate-500">Ожидает ответа</span>
                </div>
                <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02]">Мои обращения</button>
             </div>
          </div>
       </div>

       {/* Security Row */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
             <h3 className="text-base font-black text-slate-900 mb-6 uppercase tracking-tight">История входов</h3>
             <div className="space-y-4">
                {loginHistory.slice(0, 2).map(session => (
                   <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.lastActive}</p>
                         <p className="text-xs font-bold text-slate-900">{session.device} • {session.ip}</p>
                      </div>
                      {session.isCurrent && <span className="text-[8px] font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md uppercase">Online</span>}
                   </div>
                ))}
             </div>
          </div>
          <div className="bg-[#1e2b6e] rounded-[2rem] shadow-xl p-8 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full" />
             <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">Gisi Club Status</h3>
             <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-8">Уровень: {user.loyaltyLevel.toUpperCase()}</p>
             <div className="flex items-end justify-between">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Баланс</p>
                   <p className="text-3xl font-black italic tracking-tighter">{user.loyaltyPoints} баллов</p>
                </div>
                <button className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Привилегии</button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">История заказов</h3>
             <div className="flex gap-2">
                <span className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-slate-400 uppercase">Всего: {orders.length}</span>
             </div>
          </div>
          <div className="p-0">
             {orders.length > 0 ? (
               <div className="divide-y divide-slate-50">
                  {orders.map(order => (
                    <div key={order.id} className="p-8 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-center gap-8">
                       <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
                          <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                       </div>
                       <div className="flex-grow space-y-1 text-center md:text-left">
                          <p className="text-sm font-black text-slate-900">{order.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.date}</p>
                       </div>
                       <div className="flex flex-col items-center md:items-end gap-1">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${order.status.includes('подтвержден') ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'}`}>{order.status}</span>
                          <p className="text-base font-black text-slate-900">{order.total.toLocaleString()} {settings.currency}</p>
                       </div>
                       <button className="px-6 py-3 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:shadow-md transition-all">Детали</button>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-20 text-center flex flex-col items-center justify-center opacity-30">
                  <div className="text-6xl mb-6">📦</div>
                  <p className="font-black uppercase tracking-[0.2em] text-slate-900">Заказов пока нет</p>
               </div>
             )}
          </div>
       </div>
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Адреса доставки</h3>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Добавить адрес</button>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(addr => (
             <div key={addr.id} className={`p-8 bg-white rounded-[2.5rem] border shadow-sm flex flex-col justify-between ${addr.isDefault ? 'border-indigo-100 ring-2 ring-indigo-50' : 'border-slate-100'}`}>
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest bg-indigo-50 px-3 py-1 rounded-lg">{addr.label}</span>
                      {addr.isDefault && <span className="text-[9px] font-black uppercase text-emerald-500">Основной</span>}
                   </div>
                   <div>
                      <p className="text-lg font-black text-slate-900">{addr.city}</p>
                      <p className="text-sm font-bold text-slate-500">{addr.street}, д. {addr.house}{addr.apartment ? `, кв. ${addr.apartment}` : ''}</p>
                   </div>
                </div>
                <div className="mt-8 flex gap-4 pt-6 border-t border-slate-50">
                   <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900">Изменить</button>
                   <button className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600">Удалить</button>
                </div>
             </div>
          ))}
       </div>
    </div>
  );

  const renderPayment = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Методы оплаты</h3>
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 transition-all hover:scale-105">Привязать карту</button>
       </div>
       <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="flex items-center gap-8 mb-12">
             <div className="w-20 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg overflow-hidden relative group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-black italic">VISA</span>
             </div>
             <div className="flex-grow">
                <p className="text-sm font-black text-slate-900">•••• 4242</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Основная карта • 12/28</p>
             </div>
             <button className="text-rose-500 text-[10px] font-black uppercase tracking-widest">Удалить</button>
          </div>
          
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">💰</div>
                <p className="text-xs font-black text-slate-900 uppercase tracking-widest">Gisi Pay Balance</p>
             </div>
             <p className="text-sm font-black text-slate-400">0.00 AMD</p>
          </div>
       </div>
    </div>
  );

  const renderBonuses = () => (
    <div className="space-y-6 animate-fade-in">
       <div className="bg-[#1e2b6e] rounded-[3rem] p-10 md:p-14 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
          <div className="relative z-10 space-y-12">
             <div className="flex justify-between items-start">
                <div>
                   <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Gisi Club</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mt-2">Лояльность и привилегии</p>
                </div>
                <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10">
                   <span className="text-[10px] font-black uppercase tracking-widest">{user.loyaltyLevel}</span>
                </div>
             </div>
             <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black tracking-tighter italic">{user.loyaltyPoints}</span>
                <span className="text-lg font-bold opacity-60 uppercase tracking-widest">баллов</span>
             </div>
             <div className="flex gap-4">
                <button className="flex-grow py-5 bg-white text-indigo-900 rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02]">Как потратить?</button>
                <button className="px-10 py-5 bg-white/10 hover:bg-white/20 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all">История</button>
             </div>
          </div>
       </div>
       
       <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-10">
          <h3 className="text-base font-black text-slate-900 uppercase tracking-widest mb-8">Последние операции</h3>
          <div className="space-y-6">
             {bonusHistory.map(tx => (
                <div key={tx.id} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-50">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${tx.type === 'accrual' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                         {tx.type === 'accrual' ? '+' : '-'}
                      </div>
                      <div>
                         <p className="text-sm font-black text-slate-800">{tx.description}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase">{tx.date}</p>
                      </div>
                   </div>
                   <span className={`text-sm font-black ${tx.type === 'accrual' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.type === 'accrual' ? '+' : '-'}{tx.amount}
                   </span>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderWishlist = () => {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    return (
      <div className="space-y-10 animate-fade-in">
         <div className="flex justify-between items-baseline">
            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Избранные товары</h3>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{wishlistProducts.length} позиций</span>
         </div>
         {wishlistProducts.length > 0 ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
              {wishlistProducts.map(p => (
                <ProductCard 
                  key={p.id} product={p} language={'ru'} currency={settings.currency} 
                  onAddToCart={() => {}} onClick={() => {}} isComparing={false} 
                  onToggleCompare={() => {}} onAddReview={() => {}} 
                  isWishlisted={true} onToggleWishlist={onToggleWishlist}
                />
              ))}
           </div>
         ) : (
           <div className="py-40 text-center opacity-30 flex flex-col items-center">
              <div className="text-6xl mb-6">❤️</div>
              <p className="font-black uppercase tracking-[0.2em] text-slate-900">В списке пока пусто</p>
           </div>
         )}
      </div>
    );
  };

  const renderReviews = () => (
    <div className="space-y-10 animate-fade-in">
       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Мои отзывы</h3>
       <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center opacity-30">
          <div className="text-6xl mb-6">⭐</div>
          <p className="font-black uppercase tracking-[0.2em] text-slate-900">Вы еще не оставили ни одного отзыва</p>
          <button onClick={() => setActiveSection('orders')} className="mt-8 text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline">Написать первый отзыв</button>
       </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-10 animate-fade-in">
       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Уведомления</h3>
       <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
             <div>
                <p className="text-sm font-black text-slate-900">Статус заказа</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Push и E-mail</p>
             </div>
             <div className="w-12 h-6 bg-indigo-600 rounded-full flex items-center justify-end px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-slate-50">
             <div>
                <p className="text-sm font-black text-slate-900">Акции и скидки</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">E-mail</p>
             </div>
             <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center justify-start px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>
          </div>
          <div className="flex items-center justify-between py-2">
             <div>
                <p className="text-sm font-black text-slate-900">СМС информирование</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">SMS</p>
             </div>
             <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center justify-start px-1 cursor-pointer"><div className="w-4 h-4 bg-white rounded-full" /></div>
          </div>
       </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-10 animate-fade-in">
       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Личные данные</h3>
       <div className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8">
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Полное имя</label>
                <input type="text" defaultValue={user.name} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-indigo-100" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">E-mail адрес</label>
                <input type="email" defaultValue={user.email} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-indigo-100" />
             </div>
             <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Номер телефона</label>
                <input type="text" defaultValue={user.phone || ''} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-sm outline-none focus:bg-white focus:border-indigo-100" />
             </div>
          </div>
          <div className="flex flex-col items-center justify-center p-10 bg-slate-50/50 rounded-[3rem] border border-slate-50">
             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl mb-6 relative group">
                <img src={user.avatar} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                   <span className="text-[8px] font-black text-white uppercase tracking-widest">Сменить</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">ID Пользователя: {user.id}</p>
             <button className="mt-10 px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl">Сохранить изменения</button>
          </div>
       </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-10 animate-fade-in">
       <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Безопасность</h3>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
             <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Пароль</h4>
             <p className="text-xs font-bold text-slate-400 leading-relaxed">Регулярная смена пароля повышает безопасность вашего аккаунта.</p>
             <button className="w-full py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">Сменить пароль</button>
          </div>
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-8">
             <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">2FA Аутентификация</h4>
             <p className="text-xs font-bold text-slate-400 leading-relaxed">Дополнительный уровень защиты с использованием кода из приложения.</p>
             <button className="w-full py-4 bg-emerald-50 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-colors">Включить 2FA</button>
          </div>
       </div>
       <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8">Активные сессии</h4>
          <div className="space-y-4">
             {loginHistory.map(session => (
                <div key={session.id} className="flex items-center justify-between p-6 bg-slate-50/50 rounded-2xl border border-slate-50">
                   <div className="flex items-center gap-4">
                      <div className="text-2xl">{session.device.includes('iPhone') ? '📱' : '💻'}</div>
                      <div>
                         <p className="text-sm font-black text-slate-900">{session.device}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{session.lastActive} • {session.ip}</p>
                      </div>
                   </div>
                   {!session.isCurrent ? (
                     <button className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">Завершить</button>
                   ) : (
                     <span className="text-[9px] font-black text-[#3bb19b] uppercase tracking-widest">Current</span>
                   )}
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] bg-[#F4F7F6] flex overflow-hidden animate-fade-in no-print">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-8 pb-4">
           {/* Profile Summary */}
           <div className="flex flex-col items-center text-center space-y-3 mb-10">
              <div className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-xl overflow-hidden relative group cursor-pointer">
                 <img src={user.avatar} className="w-full h-full object-cover" />
                 <div className="absolute inset-0 bg-indigo-600/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity" onClick={() => setActiveSection('settings')}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                 </div>
              </div>
              <div>
                 <h2 className="text-base font-black text-slate-900 tracking-tight leading-none">{user.name}</h2>
                 <p className="text-[10px] font-bold text-slate-400 mt-1">{user.email}</p>
              </div>
           </div>

           <nav className="space-y-1">
              {menuItems.map(item => (
                 <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as Section)}
                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all ${
                       activeSection === item.id 
                       ? 'bg-indigo-600/5 text-indigo-600' 
                       : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                 >
                    <span className={`${activeSection === item.id ? 'text-indigo-600' : 'text-slate-300'}`}>{item.icon}</span>
                    <span className="flex-grow text-left">{item.label}</span>
                    {item.badge && (
                       <span className="bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center">{item.badge}</span>
                    )}
                 </button>
              ))}
           </nav>
        </div>
        <div className="mt-auto p-8 border-t border-slate-50">
           <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 bg-rose-50 text-rose-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all hover:bg-rose-500 hover:text-white group">
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Выход
           </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-grow flex flex-col min-w-0 bg-[#F4F7F6] overflow-hidden">
         {/* HEADER */}
         <header className="h-24 bg-white/50 backdrop-blur-md px-10 flex items-center justify-between shrink-0 border-b border-slate-100">
            <div className="flex items-center gap-4">
               <button onClick={onClose} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-indigo-600 transition-all shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
               </button>
               <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">{user.name}</h1>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-100">
                  <button onClick={() => setActiveSection('home')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}>Dashboard</button>
                  <button onClick={() => setActiveSection('settings')} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeSection === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-700'}`}>Profile</button>
               </div>
               <div className="w-px h-8 bg-slate-100" />
               <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300 hover:text-indigo-600 transition-all border border-slate-100 shadow-sm relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
               </button>
            </div>
         </header>

         {/* VIEWPORT */}
         <div className="flex-grow overflow-y-auto p-10 hide-scrollbar">
            {activeSection === 'home' && renderHome()}
            {activeSection === 'orders' && renderOrders()}
            {activeSection === 'addresses' && renderAddresses()}
            {activeSection === 'payment' && renderPayment()}
            {activeSection === 'bonuses' && renderBonuses()}
            {activeSection === 'wishlist' && renderWishlist()}
            {activeSection === 'reviews' && renderReviews()}
            {activeSection === 'notifications' && renderNotifications()}
            {activeSection === 'settings' && renderSettings()}
            {activeSection === 'security' && renderSecurity()}
            
            {(activeSection === 'support') && (
               <div className="flex flex-col items-center justify-center h-full opacity-20 text-center animate-fade-in py-40">
                  <div className="text-8xl mb-6">🛠️</div>
                  <h2 className="text-3xl font-black uppercase italic tracking-tighter">Служба поддержки временно недоступна</h2>
                  <p className="text-sm font-bold uppercase tracking-widest mt-2 max-w-sm">Мы работаем над улучшением чатов. Пожалуйста, воспользуйтесь формой обратной связи.</p>
                  <button onClick={() => setActiveSection('home')} className="mt-10 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase">Вернуться на главную</button>
               </div>
            )}
         </div>
      </main>
    </div>
  );
};
