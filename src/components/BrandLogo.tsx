import React from 'react';
import { MICARRO_LOGO_BASE64 } from '../assets/logoData';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
  customLogoUrl?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'icon-only',
  customLogoUrl,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24 sm:w-28 sm:h-28',
  };

  const activeSrc = customLogoUrl && customLogoUrl.trim() !== '' ? customLogoUrl : MICARRO_LOGO_BASE64;

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      <img
        src={activeSrc}
        alt="MiCarro Logo"
        className="w-full h-full object-contain select-none filter drop-shadow-sm"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};


