
import React, { useState } from 'react';
import { User } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, user, onUpdateUser }) => {
  const [phoneInput, setPhoneInput] = useState(user.phone || '+374');
  const [isVerifying, setIsVerifying] = useState(false);
  const [smsCode, setSmsCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleStartVerification = () => {
    if (phoneInput.length < 10) return alert('Введите корректный номер');
    setIsLoading(true);
    setTimeout(() => {
      setIsVerifying(true);
      setIsLoading(false);
    }, 1000);
  };

  const handleVerifyCode = () => {
    if (smsCode === '1234') {
      onUpdateUser({ 
        phone: phoneInput, 
        isPhoneVerified: true,
        smsNotificationsEnabled: false 
      });
      setIsVerifying(false);
      alert('Номер успешно подтвержден!');
    } else {
      alert('Неверный код (используйте 1234)');
    }
  };

  const toggleSms = () => {
    if (!user.isPhoneVerified) return alert('Пожалуйста, сначала подтвердите номер телефона');
    onUpdateUser({ smsNotificationsEnabled: !user.smsNotificationsEnabled });
  };

  const Toggle = ({ checked, onChange, label, sublabel, disabled }: { checked: boolean, onChange: () => void, label: string, sublabel?: string, disabled?: boolean }) => (
    <div className={`flex items-center justify-between py-2 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[15px] font-bold text-slate-700 leading-tight">{label}</span>
        {sublabel && (
          <span className={`text-[13px] font-medium ${disabled ? 'text-rose-400' : 'text-slate-400'}`}>
            {sublabel}
          </span>
        )}
      </div>
      <button 
        onClick={onChange}
        disabled={disabled}
        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-[#3BB19B]' : 'bg-slate-200'} ${disabled ? 'cursor-not-allowed' : ''}`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in">
        <div className="p-10 space-y-10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Настройки</h2>
            <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <Toggle 
                label="Получать СМС-рассылки" 
                sublabel={user.isPhoneVerified ? user.phone : 'Номер не подтвержден'} 
                checked={!!user.smsNotificationsEnabled} 
                onChange={toggleSms}
                disabled={!user.isPhoneVerified}
              />

              {!user.isPhoneVerified && !isVerifying && (
                <div className="bg-slate-50 p-6 rounded-[1.8rem] border border-slate-100 space-y-4">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Добавить номер телефона</p>
                  <input 
                    type="text" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} 
                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold outline-none focus:border-[#3BB19B]"
                  />
                  <button 
                    onClick={handleStartVerification}
                    className="w-full py-3 bg-[#3BB19B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                  >
                    Подтвердить по СМС
                  </button>
                </div>
              )}

              {isVerifying && (
                <div className="bg-emerald-50 p-6 rounded-[1.8rem] border border-emerald-100 space-y-4 animate-in fade-in slide-in-from-top-4">
                   <p className="text-[11px] font-black text-emerald-600 uppercase tracking-widest text-center">Код отправлен на {phoneInput}</p>
                   <input 
                      type="text" placeholder="0000" value={smsCode} onChange={(e) => setSmsCode(e.target.value)} maxLength={4}
                      className="w-full p-4 bg-white border border-emerald-200 rounded-2xl text-center text-xl font-black outline-none tracking-[0.5em]"
                   />
                   <div className="grid grid-cols-2 gap-3">
                     <button onClick={handleVerifyCode} className="py-3 bg-[#3BB19B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest">OK</button>
                     <button onClick={() => setIsVerifying(false)} className="py-3 bg-white text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest">Отмена</button>
                   </div>
                </div>
              )}
            </div>

            <Toggle 
              label="Учитывать предпочтения" 
              sublabel="в результатах поиска"
              checked={true} 
              onChange={() => {}} 
            />
          </div>

          <button 
            onClick={onClose}
            className="w-full py-5 bg-[#3BB19B] text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-teal-100 transition-all hover:scale-[1.02] active:scale-95"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};
