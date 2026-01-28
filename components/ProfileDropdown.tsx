
import React from 'react';
import { User } from '../types';

interface ProfileDropdownProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenFullProfile: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ 
  user, 
  isOpen, 
  onClose,
  onLogout,
  onOpenFullProfile
}) => {
  if (!isOpen) return null;

  const MenuItem = ({ icon, label, extra, onClick }: { icon?: React.ReactNode, label: string, extra?: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-2 py-2.5 hover:bg-slate-50 transition-colors group text-left"
    >
      {icon && <div className="w-6 h-6 flex items-center justify-center text-slate-400 group-hover:text-slate-900 transition-colors">{icon}</div>}
      <span className="flex-grow text-[14px] font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
      {extra && <span className="text-[14px] font-bold text-slate-400">{extra}</span>}
    </button>
  );

  return (
    <div 
      className="absolute top-full right-0 mt-2 w-[300px] bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[200] animate-fade-in py-5 px-4"
      onMouseLeave={onClose}
    >
      {/* Пользователь и Уведомления */}
      <div className="flex items-center justify-between mb-5 px-2">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenFullProfile}>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-100 ring-2 ring-slate-50">
            <img src={user?.avatar || 'https://i.pravatar.cc/150?u=gag'} className="w-full h-full object-cover" alt="avatar" />
          </div>
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-900 text-[15px] group-hover:text-[#3bb19b] transition-colors">{user?.name?.split(' ')[0] || 'Покупатель'}</span>
            <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
          </div>
        </div>
        <div className="relative cursor-pointer hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-[#f91155] text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white">1</span>
        </div>
      </div>

      {/* Баннер Клуба */}
      <div className="bg-[#fff0f3] p-4 rounded-2xl mb-4 flex items-center justify-between group cursor-pointer hover:bg-[#ffe5ea] transition-all">
        <span className="text-2xl font-black text-[#f91155] italic leading-none">клуб</span>
        <div className="text-right leading-none">
           <p className="text-[10px] font-bold text-slate-700 mb-0.5">Больше выгоды</p>
           <p className="text-[9px] font-medium text-slate-400">от ежедневных покупок</p>
        </div>
      </div>

      {/* Список */}
      <div className="space-y-0.5">
        <MenuItem 
          label="Избранное" 
          onClick={onOpenFullProfile}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2"/></svg>} 
        />
      </div>

      <div className="h-px bg-slate-50 my-3 mx-2" />

      <div className="space-y-0.5">
        <button className="w-full text-left px-2 py-2 hover:bg-slate-50 transition-colors">
          <p className="text-[14px] font-medium text-slate-700">Чаты</p>
          <p className="text-[11px] text-slate-400">С поддержкой и курьерами</p>
        </button>
        <button className="w-full text-left px-2 py-2 hover:bg-slate-50 transition-colors">
          <p className="text-[14px] font-medium text-slate-700">Отзывы и вопросы</p>
        </button>
      </div>

      <div className="h-px bg-slate-50 my-3 mx-2" />

      <button onClick={onLogout} className="w-full text-left px-2 py-2 text-[14px] font-medium text-slate-400 hover:text-rose-500 transition-colors">Выйти</button>
    </div>
  );
};
