import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import micarroLogo from '../assets/images/logo.png';
import {
  Car,
  Building2,
  Tag,
  ShieldCheck,
  Sparkles,
  Plus,
  Settings,
  Menu,
  X,
  Phone,
  ChevronDown,
  CheckCircle2,
  User,
  LogIn,
  LogOut,
  Users,
  KeyRound,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  onOpenCarForm: () => void;
  onOpenSettings?: () => void;
  onOpenRedeemCode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCarForm, onOpenSettings, onOpenRedeemCode }) => {
  const {
    currentView,
    setCurrentView,
    currentAgency,
    currentAgencyId,
    setCurrentAgencyId,
    agencies,
    carListings,
    privateOffers,
    leads,
    currentUser,
    setIsAuthModalOpen,
    logout,
    isAdminAuthenticated,
    resetFilters,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agencyDropdownOpen, setAgencyDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleGoHome = () => {
    setCurrentView('catalog');
    if (resetFilters) resetFilters();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
    setAgencyDropdownOpen(false);
    setUserDropdownOpen(false);
  };

  const pendingOffersCount = privateOffers.filter((o) => o.status === 'pending').length;
  const newAgencyLeadsCount = leads.filter((l) => l.agencyId === currentAgencyId && l.status === 'new').length;
  const totalAgencyAlerts = newAgencyLeadsCount + pendingOffersCount;
  const agencyCarsCount = carListings.filter((c) => c.agencyId === currentAgencyId).length;

  const navLinks = [
    {
      id: 'agency-panel',
      label: 'Portal Carga & Salón',
      icon: Building2,
      badge: totalAgencyAlerts > 0 ? `🔔 ${totalAgencyAlerts} alertas` : `${agencyCarsCount} autos`,
      highlight: true,
    },
    {
      id: 'catalog',
      label: 'Catálogo de Autos',
      icon: Car,
      badge: `${carListings.filter((c) => c.status === 'available').length}`,
    },
    {
      id: 'sell-my-car',
      label: 'Vender Mi Auto',
      icon: Tag,
      badge: pendingOffersCount > 0 ? `${pendingOffersCount} nuevas` : undefined,
    },
    {
      id: 'admin-panel',
      label: 'Administrador SaaS',
      icon: ShieldCheck,
      badge: isAdminAuthenticated ? '🟢 Activo' : 'Protegido',
    },
    {
      id: 'ai-tools',
      label: 'Herramientas IA',
      icon: Sparkles,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Bar with Agency & Vendedor Active Session info */}
      <div className="bg-slate-900 text-slate-100 px-4 py-1.5 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-slate-300">
          <button
            onClick={handleGoHome}
            className="flex items-center gap-1.5 font-bold text-white hover:text-blue-300 transition-colors text-left cursor-pointer"
            title="Volver al inicio"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>MiCarro SaaS • Plataforma Multiconcesionaria</span>
          </button>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-300">Control de Salón, Carga y Códigos de Activación</span>
        </div>

        {/* Agency Switcher, Redeem Code & User Login Pill */}
        <div className="flex items-center gap-2">
          {/* Quick Redeem Code Button */}
          {onOpenRedeemCode && (
            <button
              onClick={onOpenRedeemCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-800 hover:bg-blue-700 text-white font-semibold text-xs border border-blue-600 transition-colors"
              title="Canjear código de suscripción"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Canjear Código</span>
            </button>
          )}

          {/* Agency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setAgencyDropdownOpen(!agencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-medium text-xs transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="max-w-[130px] truncate">{currentAgency?.name || 'Seleccionar Agencia'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {agencyDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-1 z-50 animate-in fade-in zoom-in-95 text-slate-900">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] text-slate-500 font-bold uppercase tracking-wide">
                  Cambiar de Concesionaria
                </div>
                {agencies.map((agency) => (
                  <button
                    key={agency.id}
                    onClick={() => {
                      setCurrentAgencyId(agency.id);
                      setAgencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-blue-50 text-xs transition-colors ${
                      agency.id === currentAgencyId ? 'bg-blue-50/80 text-blue-800 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={agency.logoUrl}
                        alt={agency.name}
                        className="w-5 h-5 object-contain shrink-0 filter drop-shadow-xs"
                      />
                      <span className="truncate">{agency.name}</span>
                    </div>
                    {agency.id === currentAgencyId && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                  </button>
                ))}
                <div className="p-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCurrentView('admin-panel');
                      setAgencyDropdownOpen(false);
                    }}
                    className="w-full text-center py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold"
                  >
                    Gestionar Concesionarias en SaaS
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User / Seller Login Button or Profile */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold transition-colors"
              >
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-4 h-4 rounded-full object-cover border border-blue-400"
                />
                <span className="max-w-[120px] truncate">{currentUser.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 text-slate-900">
                  <div className="px-4 pb-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-blue-700 font-mono">@{currentUser.username}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {currentUser.role === 'seller'
                        ? 'Vendedor / Asesor Comercial'
                        : currentUser.role === 'agency_admin'
                        ? 'Gerente de Concesionaria'
                        : 'Super Admin MiCarro'}
                    </p>
                  </div>

                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setCurrentView('agency-panel');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2 font-medium"
                    >
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span>Mi Panel de Carga & Salón</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 flex items-center gap-2 font-medium"
                    >
                      <KeyRound className="w-4 h-4 text-blue-600" />
                      <span>Cambiar de Vendedor / Cuentas</span>
                    </button>
                  </div>

                  <div className="p-1.5 border-t border-slate-100">
                    <button
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
            >
              <LogIn className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Ingreso Vendedores</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Bar with Logo & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Brand Logo - Crisp MiCarro style (Click to go Home) */}
        <div className="flex items-center gap-3">
          <button
            id="navbar-brand-logo-btn"
            onClick={handleGoHome}
            aria-label="Volver al inicio - MiCarro"
            title="Volver al inicio de la página"
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 rounded-2xl p-1.5 -m-1.5 hover:bg-slate-50 transition-all active:scale-98"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 overflow-hidden group-hover:scale-105 group-active:scale-95 transition-transform flex items-center justify-center shrink-0">
              <img
                src={micarroLogo}
                alt="Logo MiCarro"
                className="w-full h-full object-contain filter drop-shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                  MiCarro
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  SaaS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium group-hover:text-slate-700 transition-colors">
                Software de Venta & Gestión de Autos
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setCurrentView(link.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all relative ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                    : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{link.label}</span>
                {link.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      isActive
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCarForm}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md shadow-blue-700/20 transition-all hover:scale-102 active:scale-98"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>➕ Cargar Nuevo Auto</span>
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-in slide-in-from-top-2 text-slate-900">
          {currentUser && (
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-blue-400"
                />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-700">@{currentUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-rose-600 font-semibold hover:underline"
              >
                Salir
              </button>
            </div>
          )}

          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between ${
                  isActive ? 'bg-blue-700 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] ${
                      isActive ? 'bg-blue-900 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                onOpenCarForm();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-700/20"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Cargar Nuevo Auto para Venta</span>
            </button>
            {!currentUser && (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 text-blue-700 font-bold text-xs flex items-center justify-center gap-2 border border-slate-200"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar como Vendedor</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

