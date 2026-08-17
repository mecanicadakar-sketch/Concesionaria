import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CarListing, BodyType, CarCondition } from '../types';
import {
  Search,
  Filter,
  Car,
  MessageCircle,
  Eye,
  Sparkles,
  ShieldCheck,
  Fuel,
  Gauge,
  SlidersHorizontal,
  RotateCcw,
  CheckCircle2,
  Building2,
  CreditCard,
  RefreshCw,
  Share2,
  ChevronRight,
  Zap,
} from 'lucide-react';

interface CatalogViewProps {
  onOpenCarDetail?: (car: CarListing) => void;
  onSelectCar?: (car: CarListing) => void;
  onOpenCarForm?: () => void;
  onOpenAgencyPanel?: () => void;
  onGoToSellCar?: () => void;
  onOpenSellCar?: () => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  onOpenCarDetail,
  onSelectCar,
  onOpenCarForm,
  onOpenAgencyPanel,
  onGoToSellCar,
  onOpenSellCar,
}) => {
  const handleSelectCar = (car: CarListing) => {
    if (onSelectCar) onSelectCar(car);
    else if (onOpenCarDetail) onOpenCarDetail(car);
  };

  const handleSellCar = () => {
    if (onOpenSellCar) onOpenSellCar();
    else if (onGoToSellCar) onGoToSellCar();
  };

  const handleAgencyPanel = () => {
    if (onOpenAgencyPanel) onOpenAgencyPanel();
    else if (onOpenCarForm) onOpenCarForm();
  };

  const {
    carListings,
    agencies,
    filters,
    setFilters,
    resetFilters,
    formatPrice,
    openWhatsappForCar,
    setSelectedCar,
  } = useApp();

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedQuickCategory, setSelectedQuickCategory] = useState<string>('all');

  // Filter listings
  const filteredListings = carListings.filter((car) => {
    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchTitle = car.title.toLowerCase().includes(q);
      const matchMake = car.make.toLowerCase().includes(q);
      const matchModel = car.model.toLowerCase().includes(q);
      const matchAgency = car.agencyName.toLowerCase().includes(q);
      if (!matchTitle && !matchMake && !matchModel && !matchAgency) return false;
    }

    // Agency
    if (filters.agencyId && car.agencyId !== filters.agencyId) return false;

    // Body Type
    if (filters.bodyType && car.bodyType !== filters.bodyType) return false;

    // Condition
    if (filters.condition && car.condition !== filters.condition) return false;

    // Transmission
    if (filters.transmission && car.transmission !== filters.transmission) return false;

    // Fuel Type
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;

    // Quick Category
    if (selectedQuickCategory === 'pickup' && car.bodyType !== 'Pickup') return false;
    if (selectedQuickCategory === 'suv' && car.bodyType !== 'SUV') return false;
    if (selectedQuickCategory === '0km' && car.condition !== '0km') return false;
    if (selectedQuickCategory === 'financing' && !car.financingAvailable) return false;
    if (selectedQuickCategory === 'trade_in' && !car.acceptsTradeIn) return false;

    // Min / Max Price
    if (filters.minPrice && car.price < filters.minPrice) return false;
    if (filters.maxPrice && car.price > filters.maxPrice) return false;

    // Min / Max Year
    if (filters.minYear && car.year < filters.minYear) return false;
    if (filters.maxYear && car.year > filters.maxYear) return false;

    // Features
    if (filters.acceptsTradeIn && !car.acceptsTradeIn) return false;
    if (filters.financingAvailable && !car.financingAvailable) return false;

    return true;
  });

  // Sort
  const sortedListings = [...filteredListings].sort((a, b) => {
    if (filters.sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (filters.sortBy === 'price_asc') return a.price - b.price;
    if (filters.sortBy === 'price_desc') return b.price - a.price;
    if (filters.sortBy === 'year_desc') return b.year - a.year;
    if (filters.sortBy === 'mileage_asc') return a.mileage - b.mileage;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const makes = Array.from(new Set(carListings.map((c) => c.make)));
  const bodyTypes: BodyType[] = ['SUV', 'Pickup', 'Sedán', 'Hatchback', 'Coupé', 'Monovolumen', 'Furgón / Utilitario'];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Hero Showcase Banner in Light Mode with Subtle Car Background Image */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-blue-900/20 p-6 sm:p-10 shadow-xl text-white">
        {/* Background Car Image (Subtle & Elegant) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none">
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&auto=format&fit=crop&q=80"
            alt="Fondo automóvil deportivo"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center sm:object-right opacity-25 scale-105 filter saturate-150 contrast-125"
          />
          {/* Gradient Overlays for maximum legibility and depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900/90 to-indigo-950/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-blue-900/30"></div>
        </div>

        {/* Ambient glow effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 z-0"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold mb-4 backdrop-blur-sm shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Red Oficial de Concesionarias & Vehículos Garantizados</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-sm">
            Encontrá tu próximo auto con <span className="text-amber-300">trato directo</span>
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 mb-6 leading-relaxed">
            Explorá el catálogo de agencias verificadas, consultá al instante por <strong className="text-emerald-300">WhatsApp</strong> con el vendedor y cotizá tu permuta o financiación al instante.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSellCar}
              className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-md shadow-amber-400/30 flex items-center gap-2 transition-transform active:scale-98"
            >
              <span>Vender o Entregar Mi Auto en Agencia</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </button>
            <button
              onClick={handleAgencyPanel}
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 flex items-center gap-2 backdrop-blur-sm transition-colors"
            >
              <Building2 className="w-4 h-4 text-amber-300" />
              <span>Portal para Vendedores y Agencias</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Quick Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
        {/* Main Search Input & Agency Select */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por marca, modelo, versión (ej. Hilux, Golf, Cronos)..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filters.agencyId}
              onChange={(e) => setFilters({ ...filters, agencyId: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-colors font-medium"
            >
              <option value="">Todas las Concesionarias</option>
              {agencies.map((agency) => (
                <option key={agency.id} value={agency.id}>
                  {agency.name} ({agency.city})
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:bg-white font-medium"
            >
              <option value="featured">Destacados Primero</option>
              <option value="price_asc">Menor Precio</option>
              <option value="price_desc">Mayor Precio</option>
              <option value="year_desc">Más Nuevos (Año)</option>
              <option value="mileage_asc">Menor Kilometraje</option>
              <option value="recent">Recién Publicados</option>
            </select>

            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                isFilterDrawerOpen
                  ? 'bg-blue-700 text-white border-blue-700 font-bold'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title="Filtros Avanzados"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Category Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          {[
            { id: 'all', label: 'Todos los Autos' },
            { id: 'pickup', label: 'Pickups 4x4 / Utilitarios' },
            { id: 'suv', label: 'SUVs & Crossovers' },
            { id: '0km', label: '0 KM Entrega Inmediata' },
            { id: 'financing', label: 'Con Financiación' },
            { id: 'trade_in', label: 'Acepta Permuta' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedQuickCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all ${
                selectedQuickCategory === cat.id
                  ? 'bg-blue-700 text-white font-bold shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Advanced Filters Drawer */}
        {isFilterDrawerOpen && (
          <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs animate-fadeIn">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Marca</label>
              <select
                value={filters.make || ''}
                onChange={(e) => setFilters({ ...filters, make: e.target.value || undefined })}
                className="w-full bg-slate-50 text-slate-800 rounded-xl p-2 border border-slate-200"
              >
                <option value="">Todas</option>
                {makes.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Carrocería</label>
              <select
                value={filters.bodyType || ''}
                onChange={(e) => setFilters({ ...filters, bodyType: (e.target.value as BodyType) || undefined })}
                className="w-full bg-slate-50 text-slate-800 rounded-xl p-2 border border-slate-200"
              >
                <option value="">Todas</option>
                {bodyTypes.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Condición</label>
              <select
                value={filters.condition || ''}
                onChange={(e) => setFilters({ ...filters, condition: (e.target.value as CarCondition) || undefined })}
                className="w-full bg-slate-50 text-slate-800 rounded-xl p-2 border border-slate-200"
              >
                <option value="">Todas</option>
                <option value="Usado">Usado Seleccionado</option>
                <option value="0km">0 KM</option>
                <option value="Certificado">Garantía / Certificado</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Transmisión</label>
              <select
                value={filters.transmission || ''}
                onChange={(e) => setFilters({ ...filters, transmission: (e.target.value as any) || undefined })}
                className="w-full bg-slate-50 text-slate-800 rounded-xl p-2 border border-slate-200"
              >
                <option value="">Todas</option>
                <option value="Manual">Manual</option>
                <option value="Automática">Automática</option>
              </select>
            </div>

            <div className="col-span-2 flex items-end justify-end gap-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1 border border-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Limpiar Filtros</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <p>
          Mostrando <strong className="text-slate-900 font-bold">{sortedListings.length}</strong> vehículos disponibles
        </p>
        <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Stock verificado en tiempo real</span>
        </div>
      </div>

      {/* Car Grid Showcase */}
      {sortedListings.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto text-blue-700">
            <Car className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No se encontraron autos con estos filtros</h3>
          <p className="text-slate-500 text-xs max-w-md mx-auto">
            Probá ajustando los criterios de búsqueda o limpiando los filtros para ver todo el inventario disponible.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs hover:bg-blue-800 transition-colors"
          >
            Ver Todos los Autos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedListings.map((car) => {
            const hasMultiplePhotos = car.photos && car.photos.length > 1;
            const coverPhoto = car.photos[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800';

            return (
              <div
                key={car.id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group"
              >
                {/* Photo Header */}
                <div
                  className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer"
                  onClick={() => handleSelectCar(car)}
                >
                  <img
                    src={coverPhoto}
                    alt={car.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Photo Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {car.isFeatured && (
                      <span className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[10px] tracking-wide flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        DESTACADO
                      </span>
                    )}
                    {car.condition === '0km' && (
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-600 text-white font-bold text-[10px] shadow-sm">
                        0 KM
                      </span>
                    )}
                    {car.condition === 'Certificado' && (
                      <span className="px-2 py-0.5 rounded-lg bg-blue-700 text-white font-bold text-[10px] shadow-sm flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        CERTIFICADO
                      </span>
                    )}
                    {car.status === 'reserved' && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-600 text-white font-bold text-[10px] shadow-sm">
                        RESERVADO
                      </span>
                    )}
                  </div>

                  {/* Multi-Photo Indicator */}
                  {hasMultiplePhotos && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-slate-900/80 backdrop-blur-sm text-white text-[11px] font-mono font-medium flex items-center gap-1">
                      <span>📸 {car.photos.length} fotos</span>
                    </div>
                  )}

                  {/* Agency Tag */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-900 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                    <Building2 className="w-3 h-3 text-blue-700" />
                    <span className="truncate max-w-[150px]">{car.agencyName}</span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Title & Version */}
                    <h3
                      onClick={() => handleSelectCar(car)}
                      className="font-bold text-base text-slate-900 hover:text-blue-700 transition-colors cursor-pointer line-clamp-1"
                    >
                      {car.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5 font-medium">
                      {car.version || `${car.make} ${car.model}`}
                    </p>

                    {/* Key Specs Pills */}
                    <div className="grid grid-cols-3 gap-2 mt-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-center text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Año</span>
                        <span className="font-bold text-slate-800 font-mono">{car.year}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Kilómetros</span>
                        <span className="font-bold text-slate-800 font-mono">{car.mileage.toLocaleString('es-ES')} km</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">Caja</span>
                        <span className="font-bold text-slate-800 truncate block">{car.transmission}</span>
                      </div>
                    </div>

                    {/* Features tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {car.acceptsTradeIn && (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold flex items-center gap-1">
                          <RefreshCw className="w-2.5 h-2.5 text-amber-600" />
                          Permuta
                        </span>
                      )}
                      {car.financingAvailable && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                          <CreditCard className="w-2.5 h-2.5 text-emerald-600" />
                          Financia
                        </span>
                      )}
                      {car.fuelType && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-medium">
                          {car.fuelType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price and Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-[11px] text-slate-400 block font-medium">Precio Contado</span>
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                          {formatPrice(car.price, car.currency)}
                        </span>
                      </div>
                      {car.financingAvailable && (
                        <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                          Cuotas fijas
                        </span>
                      )}
                    </div>

                    {/* Action Buttons: WhatsApp & View Details */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelectCar(car)}
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Ficha</span>
                      </button>

                      <button
                        onClick={() => openWhatsappForCar(car)}
                        className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-98"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
