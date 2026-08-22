import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';

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

  // Reset error state when logoUrl changes
  useEffect(() => {
    setImgError(false);
  }, [logoUrl]);

  const sizeClasses = {
    xs: 'w-5 h-5',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28',
    '2xl': 'w-32 h-32',
  };

  const brandSizeMap: Record<string, 'sm' | 'md' | 'lg' | 'xl'> = {
    xs: 'sm',
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
    '2xl': 'xl',
  };

  const hasCustomLogo = Boolean(
    logoUrl &&
    logoUrl.trim() !== '' &&
    logoUrl !== '/logo.png' &&
    logoUrl !== 'logo.png' &&
    !imgError
  );

  return (
    <div
      className={`relative flex items-center justify-center rounded-2xl overflow-hidden shrink-0 select-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-sky-400/30 shadow-lg ${sizeClasses[size]} ${className}`}
    >
      {hasCustomLogo ? (
        <img
          src={logoUrl}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-contain p-1.5 filter drop-shadow-md"
          referrerPolicy="no-referrer"
        />
      ) : (
        <BrandLogo
          size={brandSizeMap[size] || 'md'}
          className="w-full h-full p-1"
        />
      )}
    </div>
  );
};

