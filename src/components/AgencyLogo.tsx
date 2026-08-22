import React, { useState, useEffect } from 'react';
import { Building2, Car, Shield } from 'lucide-react';
import defaultLogo from '../assets/images/logo.png';

interface AgencyLogoProps {
  logoUrl?: string;
  name: string;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const AgencyLogo: React.FC<AgencyLogoProps> = ({
  logoUrl,
  name,
  className = '',
  size = 'md',
}) => {
  const [imgError, setImgError] = useState(false);

  // When the logoUrl or agency changes, reset error state so the new logo displays immediately
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const sizeClasses = {
    xs: 'w-5 h-5 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 text-xl',
    '2xl': 'w-32 h-32 text-2xl',
  };

  const getInitials = (str: string) => {
    if (!str) return 'AG';
    const words = str.trim().split(' ');
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  // Determine the actual image source to render
  const resolvedSrc = !logoUrl || logoUrl.trim() === '' || logoUrl === '/logo.png' ? defaultLogo : logoUrl;

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      {!imgError ? (
        <img
          src={resolvedSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain filter drop-shadow-md"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-900 border border-sky-300/40 shadow-lg flex flex-col items-center justify-center text-white relative group">
          {/* Subtle background badge structure */}
          <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-black/30 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center justify-center p-1 text-center">
            {size === 'xl' || size === '2xl' || size === 'lg' ? (
              <>
                <div className="flex items-center gap-1 opacity-90 mb-0.5">
                  <Car className="w-5 h-5 sm:w-6 sm:h-6 text-sky-200" />
                </div>
                <span className="font-black tracking-wider drop-shadow-md font-mono text-white text-xs sm:text-sm md:text-base uppercase leading-tight line-clamp-1 max-w-[90%]">
                  {getInitials(name)}
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold text-sky-200 uppercase tracking-widest opacity-80 mt-0.5">
                  AGENCIA
                </span>
              </>
            ) : (
              <span className="font-black tracking-wider drop-shadow-sm font-mono text-white leading-none">
                {getInitials(name)}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
