
import React, { useState } from 'react';

interface Device {
  id: string;
  name: string;
  browser: string;
  ip: string;
  location: string;
  date?: string;
  isCurrent?: boolean;
}

interface DevicesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevicesModal: React.FC<DevicesModalProps> = ({ isOpen, onClose }) => {
  // Fix: Add missing 'ip' property to Device objects
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', name: 'Chrome 144', browser: 'Chrome', ip: '81.16.11.174', location: 'Ереван', isCurrent: true },
    { id: '2', name: 'Desktop Windows', browser: 'Chrome 137.0', ip: '81.16.11.174', location: 'Армения, Ереван', date: '17 августа 2025 в 12:26' },
    { id: '3', name: 'Desktop Windows', browser: 'Chrome 130.0', ip: '45.89.66.154', location: 'Россия, Москва', date: '29 ноября 2024 в 15:03' },
  ]);

  if (!isOpen) return null;

  const removeDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const terminateAll = () => {
    setDevices(devices.filter(d => d.isCurrent));
    alert('Вы вышли из всех остальных сессий');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <div className="relative bg-white w-full max-w-[500px] rounded-[2.5rem] shadow-2xl overflow-hidden animate-zoom-in flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 pb-4 flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ваши устройства</h2>
            <p className="text-xs font-medium text-slate-400">На них вы входили в этот профиль Gisi Market</p>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-slate-500 transition-colors p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Device List */}
        <div className="flex-grow overflow-y-auto px-8 py-4 space-y-4 hide-scrollbar">
          {devices.map((device) => (
            <div 
              key={device.id} 
              className={`p-6 rounded-[1.8rem] relative transition-all ${device.isCurrent ? 'bg-slate-50/50 border border-[#3BB19B]/20' : 'bg-slate-50 hover:bg-slate-100/80 border border-transparent'}`}
            >
              {!device.isCurrent && (
                <button 
                  onClick={() => removeDevice(device.id)}
                  className="absolute top-4 right-4 p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              )}
              
              <div className="space-y-1 pr-8">
                <h4 className="font-black text-slate-800 text-sm tracking-tight">{device.name} • {device.browser} • {device.ip}</h4>
                {device.isCurrent ? (
                  <p className="text-[11px] font-black text-[#3BB19B] uppercase tracking-widest">Текущий сеанс • {device.location}</p>
                ) : (
                  <p className="text-[11px] font-bold text-slate-400">
                    {device.date} • {device.location}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Action */}
        <div className="p-8 pt-4 shrink-0">
          <button 
            onClick={terminateAll}
            className="w-full py-5 bg-[#3BB19B]/10 hover:bg-[#3BB19B]/20 text-[#3BB19B] rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all active:scale-95"
          >
            Выйти на всех, кроме этого
          </button>
        </div>
      </div>
    </div>
  );
};
