import React, { useState } from 'react';
import { Button } from './Button';
import { Language, User, StoreSettings } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: User) => void;
  language: Language;
  settings?: StoreSettings;
}

type AuthView = 'login' | 'register' | '2fa';
type LoginMethod = 'email' | 'phone';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  language,
  settings,
}) => {
  // Какой экран показываем: вход / регистрация / 2FA
  const [view, setView] = useState<AuthView>('login');
  // Вход по email или телефону
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('email');

  // Данные форм
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+374');
  const [faCode, setFaCode] = useState('');

  // Служебные состояния
  const [isLoading, setIsLoading] = useState(false);
  const [pendingAdmin, setPendingAdmin] = useState<User | null>(null);

  if (!isOpen) return null;

  // --- ХЭЛПЕРЫ ---

  // Регистрация (только email / пароль, без SMS)
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes('@')) {
      alert('Введите корректный E-mail');
      return;
    }

    if (name.trim().length < 2) {
      alert('Введите имя');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newUser: User = {
        id: 'u-' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        phone: phone || '+374 00 00 00',
        // Телефон теперь не проверяем через SMS
        isPhoneVerified: false,
        joinedDate: new Date().toISOString(),
        role: 'customer',
        status: 'active',
        loyaltyPoints: 0,
        loyaltyLevel: 'basic',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name || 'User'
        )}&background=3BB19B&color=fff`,
        // SMS полностью выключены
        smsNotificationsEnabled: false,
      };

      onLogin(newUser);
      setIsLoading(false);
      onClose();
    }, 1500);
  };

  // Вход (только админ admin / 1)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      // Тестовый админ: логин "admin", пароль "1"
      if (email.toLowerCase() === 'admin' && password === '1') {
        const admin: User = {
          id: 'admin-01',
          name: 'GISI ADMIN',
          email: 'admin@gisimarket.am',
          phone: '+374 99 000 000',
          role: 'admin',
          status: 'active',
          joinedDate: new Date().toISOString(),
          loyaltyPoints: 999999,
          loyaltyLevel: 'platinum',
          isPhoneVerified: true,
          avatar:
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
        };

        // Если включена 2FA в настройках — просим код
        if (settings?.security?.is2FAEnabled) {
          setPendingAdmin(admin);
          setView('2fa');
          setIsLoading(false);
          return;
        }

        onLogin(admin);
        onClose();
      } else {
        // Любой другой логин/пароль — ошибка, пользователя не создаём
        alert(
          'Неверный логин или пароль. Если у вас нет аккаунта — сначала зарегистрируйтесь.'
        );
      }

      setIsLoading(false);
    }, 1500);
  };

  // 2FA для админа
  const handle2FASubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (faCode === '777777') {
      if (pendingAdmin) onLogin(pendingAdmin);
      onClose();
    } else {
      alert('Неверный код 2FA (тестовый код: 777777)');
    }
  };

  // Лого
  const Logo = () => (
    <div className="flex flex-col items-center leading-none mb-10 select-none">
      <span className="text-6xl font-black italic text-[#3BB19B] tracking-tighter uppercase drop-shadow-sm">
        GISI
      </span>
      <span className="text-2xl font-black text-[#2e4750] tracking-[0.35em] -mt-1 uppercase opacity-90">
        MARKET
      </span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-[500px] animate-zoom-in">
        <div className="bg-white/40 backdrop-blur-[50px] border border-white/60 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] rounded-[3.5rem] p-10 md:p-14 overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <Logo />

          {/* 2FA */}
          {view === '2fa' ? (
            <div className="space-y-8 animate-fade-in text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-[#1e2b6e] tracking-tight">
                  Подтверждение
                </h2>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60 italic">
                  Введите 6-значный код из Authenticator
                </p>
              </div>
              <form onSubmit={handle2FASubmit} className="space-y-6">
                <input
                  type="text"
                  placeholder="000 000"
                  value={faCode}
                  onChange={(e) => setFaCode(e.target.value)}
                  maxLength={6}
                  className="w-full px-8 py-6 bg-white border border-white rounded-3xl text-center text-3xl font-black tracking-[0.5em] text-[#3BB19B] outline-none shadow-inner"
                />
                <button
                  type="submit"
                  className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-black"
                >
                  ПОДТВЕРДИТЬ
                </button>
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                >
                  Вернуться назад
                </button>
              </form>
            </div>
          ) : view === 'login' ? (
            // ----- ЭКРАН ВХОДА -----
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#1e2b6e] tracking-tight">
                  Вход в аккаунт
                </h2>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">
                  Рады видеть вас снова!
                </p>
              </div>

              <div className="bg-white/30 p-1.5 rounded-3xl flex border border-white/40">
                <button
                  onClick={() => setLoginMethod('email')}
                  className={`flex-grow py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${
                    loginMethod === 'email'
                      ? 'bg-white text-[#3BB19B] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Через E-mail
                </button>
                <button
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-grow py-3 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all ${
                    loginMethod === 'phone'
                      ? 'bg-white text-[#3BB19B] shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Через телефон
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-6">
                {loginMethod === 'email' ? (
                  <>
                    <input
                      type="text"
                      placeholder="E-mail или логин"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                    />
                    <input
                      type="password"
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    placeholder="+374 00 00-00-00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-lg tracking-tight outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                  />
                )}

                <div className="flex justify-between items-center px-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-5 h-5 rounded-lg border-white/60 bg-white/30 text-[#3BB19B] focus:ring-0"
                    />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-800 transition-colors">
                      Запомнить меня
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-[10px] font-black text-[#3BB19B] uppercase tracking-widest hover:underline"
                  >
                    Забыли пароль?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-6 bg-gradient-to-r from-[#3BB19B] to-[#4ade80] text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#3BB19B]/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  {isLoading ? 'АВТОРИЗАЦИЯ...' : 'ВОЙТИ'}
                </button>
              </form>

              <div className="pt-6 border-t border-white/40 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Ещё нет аккаунта?{' '}
                  <button
                    onClick={() => setView('register')}
                    className="text-[#3BB19B] hover:underline"
                  >
                    Зарегистрироваться
                  </button>
                </p>
              </div>
            </div>
          ) : (
            // ----- ЭКРАН РЕГИСТРАЦИИ (один шаг, без SMS) -----
            <div className="space-y-8 animate-fade-in">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-[#1e2b6e] tracking-tight">
                  Создать аккаунт
                </h2>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest opacity-60">
                  Заполните данные для регистрации
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                />
                <input
                  type="email"
                  placeholder="Email (для входа)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                />
                <input
                  type="text"
                  placeholder="Номер телефона (+374...) — не обязательно"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-8 py-5 bg:white/40 border border-white/60 rounded-3xl font-bold text-lg tracking-tight outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                />
                <input
                  type="password"
                  placeholder="Придумайте пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-8 py-5 bg-white/40 border border-white/60 rounded-3xl font-bold text-sm outline-none focus:bg-white focus:ring-4 focus:ring-[#3BB19B]/10 transition-all placeholder:text-slate-400"
                />

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? 'СОЗДАЁМ АККАУНТ...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
                  </button>
                </div>
              </form>

              <div className="pt-6 border-t border-white/40 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                  Продолжая, вы соглашаетесь с{' '}
                  <button className="text-[#3BB19B] underline">
                    Приватностью
                  </button>{' '}
                  и{' '}
                  <button className="text-[#3BB19B] underline">
                    Политикой использования
                  </button>
                </p>
                <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => setView('login')}
                    className="text-[#3BB19B] hover:underline"
                  >
                    Войти
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
