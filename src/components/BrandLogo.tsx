import React, { useState } from 'react';
import micarroLogo from '../assets/images/logo.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon-only';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'icon-only',
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  // Modern Vector SVG Logo for MiCarro (Guaranteed 100% online rendering under all network conditions)
  const VectorLogo = (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-md"
    >
      <defs>
        <linearGradient id="mclg-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
        <linearGradient id="mclg-car" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="mclg-acc" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Background */}
      <rect width="100" height="100" rx="26" fill="url(#mclg-bg)" />
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="24"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
      />

      {/* Dynamic Speed Lines */}
      <path
        d="M18 36H32"
        stroke="rgba(56, 189, 248, 0.6)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M14 44H26"
        stroke="rgba(56, 189, 248, 0.4)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Aerodynamic Sports Car Profile */}
      <path
        d="M26 58C26 58 29 48 36 43C42 38 52 35 63 35C74 35 79 38 84 46L88 56C89.5 59 87 62 84 62H28C26.5 62 25.5 60 26 58Z"
        fill="url(#mclg-car)"
      />

      {/* Aerodynamic Cabin / Windshield Glass */}
      <path
        d="M44 41C48 37 56 37 62 37C67 37 72 39 74 44L77 50H37L44 41Z"
        fill="#0f172a"
        opacity="0.85"
      />

      {/* Headlight Flare */}
      <polygon points="82,51 92,53 82,56" fill="#38bdf8" />

      {/* Wheels */}
      {/* Front Wheel */}
      <circle cx="73" cy="62" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="73" cy="62" r="3.5" fill="#ffffff" />

      {/* Rear Wheel */}
      <circle cx="37" cy="62" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.5" />
      <circle cx="37" cy="62" r="3.5" fill="#ffffff" />

      {/* Speed Stripe Accent */}
      <path
        d="M20 74L76 74C82 74 86 70 88 66"
        stroke="url(#mclg-acc)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeClasses[size]} ${className}`}>
      {!imageError ? (
        <img
          src={micarroLogo}
          alt="MiCarro Logo"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain filter drop-shadow-sm"
          referrerPolicy="no-referrer"
        />
      ) : (
        VectorLogo
      )}
    </div>
  );
};
