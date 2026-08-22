import React from 'react';

export interface CarBrandItem {
  name: string;
  renderIcon: () => React.ReactNode;
}

export const POPULAR_CAR_BRANDS: CarBrandItem[] = [
  {
    name: 'Toyota',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <ellipse cx="12" cy="12" rx="10" ry="7" />
        <ellipse cx="12" cy="11.5" rx="4" ry="5.5" />
        <ellipse cx="12" cy="9.5" rx="7.5" ry="2.8" />
      </svg>
    ),
  },
  {
    name: 'Volkswagen',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M7 7.5l2.5 5.5L12 8l2.5 5L17 7.5M8.5 13l3.5 5 3.5-5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Ford',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="12" rx="10" ry="6" fill="#1d4ed8" stroke="currentColor" strokeWidth="1" />
        <text x="12" y="14" fill="#ffffff" fontSize="6.5" fontStyle="italic" fontWeight="900" fontFamily="serif" textAnchor="middle">Ford</text>
      </svg>
    ),
  },
  {
    name: 'Chevrolet',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 7h6v3h6v4h-6v3H9v-3H3v-4h6V7z" />
      </svg>
    ),
  },
  {
    name: 'Nissan',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <rect x="2.5" y="10.2" width="19" height="3.6" rx="0.8" fill="currentColor" />
        <text x="12" y="12.8" fill="#020617" fontSize="2.8" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="sans-serif">NISSAN</text>
      </svg>
    ),
  },
  {
    name: 'Kia',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 8h2.2v8H4V8zm3.2 4.4L11 8h2.5L10 12.4 13.6 16H11l-3.8-3.6zm6.8-4.4h2.2l2.2 8h-2.2l-.4-1.8h-1.4l-.4 1.8H14l2-8zm1.8 4.6l-.5-2.2-.5 2.2h1z" />
      </svg>
    ),
  },
  {
    name: 'Hyundai',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <ellipse cx="12" cy="12" rx="9" ry="6.5" transform="rotate(-15 12 12)" />
        <path d="M8 8.5v7m8-7v7M8 12h8" strokeWidth="1.8" strokeLinecap="round" transform="skewX(-15)" />
      </svg>
    ),
  },
  {
    name: 'Mazda',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M6 13c3-3 6-3 6 0 0-3 3-3 6 0-3-1.5-6 1-6 4 0-3-3-5.5-6-4z" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: 'BMW',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="#0f172a" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 3 A9 9 0 0 1 21 12 L12 12 Z" fill="#38bdf8" />
        <path d="M12 12 L3 12 A9 9 0 0 1 12 3 Z" fill="#ffffff" />
        <path d="M12 12 L12 21 A9 9 0 0 1 3 12 Z" fill="#38bdf8" />
        <path d="M12 12 L21 12 A9 9 0 0 1 12 21 Z" fill="#ffffff" />
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
    ),
  },
  {
    name: 'Mercedes-Benz',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9M12 12l-7.8 4.5M12 12l7.8 4.5" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Honda',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="4" width="17" height="16" rx="3.5" />
        <path d="M7 6v12M17 6v12M7 11h10" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Audi',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="6" cy="12" r="3.2" />
        <circle cx="10" cy="12" r="3.2" />
        <circle cx="14" cy="12" r="3.2" />
        <circle cx="18" cy="12" r="3.2" />
      </svg>
    ),
  },
  {
    name: 'Jeep',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <text x="12" y="15" fill="currentColor" fontSize="8" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">JEEP</text>
      </svg>
    ),
  },
  {
    name: 'Fiat',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="6.5" width="18" height="11" rx="3" fill="#dc2626" />
        <text x="12" y="14.5" fill="#ffffff" fontSize="6.5" fontWeight="900" fontStyle="italic" textAnchor="middle">FIAT</text>
      </svg>
    ),
  },
  {
    name: 'Peugeot',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M7 5l5-2 5 2v7c0 4.5-5 8-5 8s-5-3.5-5-8V5z" />
        <path d="M10 10c0-1.5 1-2 2-2s2 .5 2 2-1 2-2 3v2" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: 'Renault',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <polygon points="12,3 19,12 12,21 5,12" />
        <polygon points="12,7 16,12 12,17 8,12" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
  },
  {
    name: 'Citroën',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M7 8l5-4 5 4M7 14l5-4 5 4M7 20l5-4 5 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'RAM',
    renderIcon: () => (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="currentColor">
        <text x="12" y="15" fill="currentColor" fontSize="7.5" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">RAM</text>
      </svg>
    ),
  },
];

interface CarBrandStripProps {
  selectedBrand?: string;
  onSelectBrand: (brandName: string) => void;
  title?: string;
  theme?: 'dark' | 'light';
  className?: string;
}

export const CarBrandStrip: React.FC<CarBrandStripProps> = ({
  selectedBrand = '',
  onSelectBrand,
  title = 'Marcas destacadas:',
  theme = 'dark',
  className = '',
}) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {title && (
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold tracking-wide ${
              theme === 'dark' ? 'text-sky-200/90' : 'text-slate-600'
            }`}
          >
            {title}
          </span>
          {selectedBrand && (
            <button
              onClick={() => onSelectBrand('')}
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              Limpiar filtro ({selectedBrand}) ✕
            </button>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar scroll-smooth">
        {/* "Todas" button */}
        <button
          type="button"
          onClick={() => onSelectBrand('')}
          className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 shadow-sm ${
            !selectedBrand
              ? theme === 'dark'
                ? 'bg-blue-600 border-sky-400 text-white shadow-md shadow-blue-600/40 scale-102 ring-1 ring-sky-400/40'
                : 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/25'
              : theme === 'dark'
              ? 'bg-slate-900/80 border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-400/50 hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-blue-300'
          }`}
        >
          <span>Todas</span>
        </button>

        {POPULAR_CAR_BRANDS.map((b) => {
          const isSelected =
            selectedBrand.toLowerCase() === b.name.toLowerCase() ||
            (b.name === 'Mercedes-Benz' && selectedBrand.toLowerCase().includes('mercedes'));

          return (
            <button
              key={b.name}
              type="button"
              onClick={() => onSelectBrand(isSelected ? '' : b.name)}
              className={`shrink-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 shadow-sm backdrop-blur-md ${
                isSelected
                  ? theme === 'dark'
                    ? 'bg-blue-600 border-sky-300 text-white font-black shadow-md shadow-blue-600/40 scale-105 ring-2 ring-sky-400/40'
                    : 'bg-blue-600 border-blue-600 text-white font-black shadow-md shadow-blue-600/25 scale-105'
                  : theme === 'dark'
                  ? 'bg-slate-900/75 border-slate-700/60 text-slate-300 hover:text-white hover:border-sky-400/60 hover:bg-slate-800/90 hover:scale-102'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-102'
              }`}
              title={`Filtrar por ${b.name}`}
            >
              <span
                className={`transition-transform duration-200 ${
                  isSelected ? 'text-white scale-110' : theme === 'dark' ? 'text-sky-400' : 'text-slate-600'
                }`}
              >
                {b.renderIcon()}
              </span>
              <span className="tracking-tight whitespace-nowrap">{b.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
