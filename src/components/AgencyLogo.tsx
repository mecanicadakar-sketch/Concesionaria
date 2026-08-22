import React, { useState, useEffect } from 'react';
import { MICARRO_LOGO_BASE64 } from '../assets/logoData';

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

  const hasCustomLogo = Boolean(
    logoUrl &&
    logoUrl.trim() !== '' &&
    logoUrl !== '/logo.png' &&
    logoUrl !== 'logo.png' &&
    !imgError
  );

  return (
    <div
      className={`relative flex items-center justify-center shrink-0 select-none ${sizeClasses[size]} ${className}`}
    >
      <img
        src={hasCustomLogo && logoUrl ? logoUrl : MICARRO_LOGO_BASE64}
        alt={name || 'Logo MiCarro'}
        onError={() => setImgError(true)}
        className="w-full h-full object-contain filter drop-shadow-sm select-none"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};


