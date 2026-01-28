
import React, { useState, useEffect, useRef } from 'react';
import { Banner, StoreSettings } from '../types';

interface HeroSliderProps {
  banners: Banner[];
  settings: StoreSettings;
  onBannerClick?: (banner: Banner) => void;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({ banners, settings, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const activeBanners = banners.filter(b => b.status === 'active').sort((a, b) => a.order - b.order);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    // Check if auto-play is enabled and there are enough banners
    if (activeBanners.length <= 1 || settings.bannerAutoPlay === false) return;

    const interval = setInterval(() => {
      handleNext();
    }, settings.bannerAutoPlaySpeed || 8000);
    
    return () => clearInterval(interval);
  }, [activeBanners.length, settings.bannerAutoPlay, settings.bannerAutoPlaySpeed, currentIndex]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    setTimeout(() => setIsAnimating(false), 1000);
  };

  if (activeBanners.length === 0) return null;

  return (
    <div className="container-premium mt-6 animate-fade-in no-print">
      <div 
        className="relative overflow-hidden rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] bg-slate-900 group h-[400px] md:h-[520px]"
      >
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          const animType = banner.animationType || 'fade';
          
          let animationStyles = '';
          if (animType === 'fade') {
            animationStyles = isActive ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0';
          } else {
            // Slide animation
            const isPrev = (index === (currentIndex - 1 + activeBanners.length) % activeBanners.length);
            const isNext = (index === (currentIndex + 1) % activeBanners.length);
            
            if (isActive) animationStyles = 'translate-x-0 z-10 opacity-100';
            else if (isPrev) animationStyles = '-translate-x-full z-0 opacity-0';
            else animationStyles = 'translate-x-full z-0 opacity-0';
          }

          return (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out transform-gpu ${animationStyles}`}
            >
              {banner.videoUrl ? (
                <video
                  ref={el => { videoRefs.current[index] = el; }}
                  src={banner.videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${1 - (banner.overlayOpacity || 0.3)})` }}
                />
              ) : (
                <img
                  src={banner.imageUrl || 'https://via.placeholder.com/2560x1440?text=Premium+Experience'}
                  alt={banner.title || ''}
                  className="w-full h-full object-cover"
                  style={{ filter: `brightness(${1 - (banner.overlayOpacity || 0.3)})` }}
                />
              )}

              {/* Dark gradient overlay for readability - dynamic opacity */}
              <div 
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" 
                style={{ opacity: banner.overlayOpacity || 0.4 }}
              />

              {(banner.title || banner.subtitle || banner.buttonText) && (
                <div className={`absolute inset-0 flex items-center p-6 md:p-16 ${
                  banner.contentAlignment === 'center' ? 'justify-center text-center' : 
                  banner.contentAlignment === 'right' ? 'justify-end text-right' : 'justify-start text-left'
                }`}>
                  <div className={`max-w-2xl bg-white/10 backdrop-blur-3xl p-10 md:p-16 rounded-[3.5rem] md:rounded-[4.5rem] border border-white/20 shadow-2xl transition-all duration-1000 delay-300 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {banner.title && (
                      <h2 className="text-4xl md:text-7xl font-black text-white leading-[0.85] mb-6 tracking-tighter italic uppercase drop-shadow-2xl">
                        {banner.title}
                      </h2>
                    )}
                    {banner.subtitle && (
                      <p className="text-white/90 text-lg md:text-xl font-black mb-10 leading-snug uppercase tracking-widest drop-shadow-xl max-w-lg">
                        {banner.subtitle}
                      </p>
                    )}
                    {banner.buttonText && (
                      <div className={banner.contentAlignment === 'center' ? 'flex justify-center' : banner.contentAlignment === 'right' ? 'flex justify-end' : ''}>
                        <button 
                          onClick={() => onBannerClick?.(banner)}
                          className="premium-btn px-16 py-5 text-xs"
                        >
                          {banner.buttonText}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Navigation Arrows */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-8 right-8 z-20 flex gap-3">
            <button 
              onClick={handlePrev} 
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={handleNext} 
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-2xl border border-white/30 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all shadow-xl hover:scale-110 active:scale-95"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        )}

        {/* Indicator dots */}
        <div className="absolute bottom-8 left-12 z-20 flex gap-2.5">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? 'w-10 bg-[#3BB19B]' : 'w-3 bg-white/20 hover:bg-white/40'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
