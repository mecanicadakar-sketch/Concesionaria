import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CarListing, PrivateCarOffer, AgencyInvoice, AppUser } from '../types';
import {
  Building2,
  Car,
  Plus,
  Edit,
  Trash2,
  Eye,
  MessageCircle,
  Sparkles,
  DollarSign,
  TrendingUp,
  Tag,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  Phone,
  MapPin,
  AlertTriangle,
  Receipt,
  FileText,
  UserCheck,
  X,
  Users,
  UserPlus,
  KeyRound,
  Lock,
  Filter,
  Search,
  SlidersHorizontal,
  Star,
  Copy,
  Check,
} from 'lucide-react';

interface AgencyPanelViewProps {
  onOpenCarForm: (car?: CarListing) => void;
  onOpenCarDetail: (car: CarListing) => void;
  onGoToSaasAdmin: () => void;
  onOpenRedeemCode?: () => void;
}

export const AgencyPanelView: React.FC<AgencyPanelViewProps> = ({
  onOpenCarForm,
  onOpenCarDetail,
  onGoToSaasAdmin,
  onOpenRedeemCode,
}) => {
  const {
    currentAgency,
    agencies,
    carListings,
    deleteCarListing,
    toggleCarFeatured,
    updateCarStatus,
    privateOffers,
    updatePrivateOfferStatus,
    leads,
    updateLeadStatus,
    invoices,
    subscriptionPlans,
    paymentGateways,
    formatPrice,
    openWhatsappForCar,
    markInvoicePaid,
    currentUser,
    users,
    addUser,
    updateUser,
    deleteUser,
    setIsAuthModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'inventory' | 'sellers' | 'offers' | 'leads' | 'subscription'>('inventory');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedSellerFilter, setSelectedSellerFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [selectedOffer, setSelectedOffer] = useState<PrivateCarOffer | null>(null);
  const [agencyNoteInput, setAgencyNoteInput] = useState('');
  const [copiedCarId, setCopiedCarId] = useState<string | null>(null);
  const [copiedPaymentText, setCopiedPaymentText] = useState(false);

  // New Seller Modal State
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [newSellerName, setNewSellerName] = useState('');
  const [newSellerUsername, setNewSellerUsername] = useState('');
  const [newSellerEmail, setNewSellerEmail] = useState('');
  const [newSellerPhone, setNewSellerPhone] = useState('');
  const [newSellerWhatsapp, setNewSellerWhatsapp] = useState('');
  const [newSellerPassword, setNewSellerPassword] = useState('');
  const [newSellerCommission, setNewSellerCommission] = useState<number>(1.5);
  const [sellerFormError, setSellerFormError] = useState('');

  if (!currentAgency) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
        No hay ninguna concesionaria seleccionada actualmente.
      </div>
    );
  }

  // Cars of this agency
  const agencyCars = carListings.filter((c) => c.agencyId === currentAgency.id);
  const availableCars = agencyCars.filter((c) => c.status === 'available');
  const reservedCars = agencyCars.filter((c) => c.status === 'reserved');
  const soldCars = agencyCars.filter((c) => c.status === 'sold');

  // Filtered cars based on user filters
  const filteredCars = agencyCars.filter((car) => {
    if (selectedStatusFilter !== 'all' && car.status !== selectedStatusFilter) return false;
    if (selectedSellerFilter !== 'all' && car.createdBySellerId !== selectedSellerFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${car.make} ${car.model} ${car.version} ${car.year} ${car.color}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Sellers of this agency
  const agencySellers = users.filter((u) => u.agencyId === currentAgency.id);

  // Total valuation of current available stock
  const totalStockValueUsd = availableCars.reduce(
    (sum, c) => sum + (c.currency === 'USD' ? c.price : c.price / 1200),
    0
  );
  const totalWhatsappClicks = agencyCars.reduce((sum, c) => sum + (c.whatsappInquiriesCount || 0), 0);

  // Private offers targeted to this agency or to all
  const relevantOffers = privateOffers.filter(
    (o) =>
      o.preferredAgencyId === currentAgency.id ||
      o.preferredAgencyId === 'all' ||
      o.assignedAgencyId === currentAgency.id
  );

  // Agency subscription plan
  const agencyPlan =
    subscriptionPlans.find((p) => p.id === currentAgency.subscriptionPlanId) || subscriptionPlans[1];
  const maxCarsAllowed = agencyPlan ? agencyPlan.maxCars : 30;
  const capacityPercent = Math.min(Math.round((agencyCars.length / maxCarsAllowed) * 100), 100);

  // Invoices of this agency
  const agencyInvoices = invoices.filter((i) => i.agencyId === currentAgency.id);

  // Leads for this agency
  const agencyLeads = leads.filter((l) => l.agencyId === currentAgency.id);

  // Copy quick WhatsApp sales pitch to clipboard
  const handleCopyPitch = (car: CarListing) => {
    const text = `🚗 *${car.make} ${car.model} ${car.version}* (${car.year})\n💰 Precio: ${car.currency} ${car.price.toLocaleString('es-ES')}\n⚡ Kilometraje: ${car.mileage.toLocaleString('es-ES')} km | Transmisión: ${car.transmission}\n🛡️ Garantía oficial con peritaje mecánico.\n📲 ¡Consultame ahora por WhatsApp para más detalles!`;
    navigator.clipboard.writeText(text);
    setCopiedCarId(car.id);
    setTimeout(() => setCopiedCarId(null), 2000);
  };

  const handleCreateSeller = (e: React.FormEvent) => {
    e.preventDefault();
    setSellerFormError('');

    if (!newSellerName.trim() || !newSellerUsername.trim() || !newSellerEmail.trim() || !newSellerPassword) {
      setSellerFormError('Por favor completa todos los campos obligatorios.');
      return;
    }

    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === newSellerUsername.trim().toLowerCase() ||
        u.email.toLowerCase() === newSellerEmail.trim().toLowerCase()
    );

    if (exists) {
      setSellerFormError('El nombre de usuario o correo ya está registrado.');
      return;
    }

    addUser({
      name: newSellerName.trim(),
      username: newSellerUsername.trim().toLowerCase(),
      email: newSellerEmail.trim().toLowerCase(),
      phone: newSellerPhone.trim() || currentAgency.phone,
      whatsappNumber: newSellerWhatsapp.trim().replace(/[^0-9]/g, '') || currentAgency.whatsappNumber,
      agencyId: currentAgency.id,
      agencyName: currentAgency.name,
      role: 'seller',
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      password: newSellerPassword,
      isActive: true,
      commissionRate: Number(newSellerCommission) || 1.5,
      carsLoadedCount: 0,
      carsSoldCount: 0,
    });

    setIsAddSellerOpen(false);
    setNewSellerName('');
    setNewSellerUsername('');
    setNewSellerEmail('');
    setNewSellerPhone('');
    setNewSellerWhatsapp('');
    setNewSellerPassword('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Welcome Bar with Seller Info & Fast Actions */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Agency & Seller Profile Info */}
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={currentAgency.logoUrl}
              alt={currentAgency.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm shrink-0 bg-slate-50"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentAgency.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {agencyPlan.name}
                </span>
                {currentAgency.verified && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verificada
                  </span>
                )}
              </div>

              {/* Logged in seller tag */}
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-600 pt-0.5">
                {currentUser ? (
                  <div className="flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-4 h-4 rounded-full object-cover border border-blue-500"
                    />
                    <span>
                      Sesión activa: <strong className="text-blue-900 font-bold">{currentUser.name}</strong> (
                      {currentUser.role === 'seller' ? 'Vendedor' : 'Gerente'})
                    </span>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="text-blue-700 hover:text-blue-900 underline text-[11px] ml-1 font-semibold"
                    >
                      Cambiar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-1.5 bg-blue-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Iniciar Sesión de Vendedor</span>
                  </button>
                )}

                <span className="text-slate-300 hidden sm:inline">•</span>
                <span className="text-slate-500 hidden sm:inline flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  {currentAgency.address}, {currentAgency.city}
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onOpenCarForm()}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-700/20 transition-all active:scale-98"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>➕ Cargar Nuevo Auto</span>
            </button>

            <button
              onClick={() => setIsAddSellerOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors"
            >
              <UserPlus className="w-4 h-4 text-blue-700" />
              <span>Nuevo Vendedor</span>
            </button>
          </div>
        </div>

        {/* Inventory Capacity Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span>Cupo de Salón ({agencyPlan.name}):</span>
            <strong className="text-slate-900 font-bold">
              {agencyCars.length} / {maxCarsAllowed} vehículos
            </strong>
          </div>
          <div className="w-full sm:w-64 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent > 85 ? 'bg-rose-500' : 'bg-blue-600'
              }`}
              style={{ width: `${capacityPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">En Salón</span>
            <Car className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{availableCars.length}</p>
          <p className="text-[10px] text-emerald-700 font-semibold">Listos para entrega</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Reservados</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-2xl font-black text-purple-700">{reservedCars.length}</p>
          <p className="text-[10px] text-slate-500">Seña ingresada</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Vendidos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{soldCars.length}</p>
          <p className="text-[10px] text-emerald-700/80 font-semibold">Operaciones cerradas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Clics WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalWhatsappClicks}</p>
          <p className="text-[10px] text-slate-500">Consultas directas</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Vendedores</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-blue-700">{agencySellers.length}</p>
          <p className="text-[10px] text-slate-500">Asesores activos</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-semibold">Valor Salón</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg sm:text-xl font-black text-emerald-700 truncate font-mono">
            ${Math.round(totalStockValueUsd).toLocaleString('es-ES')}
          </p>
          <p className="text-[10px] text-slate-500">Stock disponible (USD)</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'inventory'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Salón de Autos ({agencyCars.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sellers')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'sellers'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Equipo de Vendedores ({agencySellers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'leads'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Prospectos & CRM ({agencyLeads.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('offers')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'offers'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Toma de Usados ({relevantOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscription')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'subscription'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Mi Suscripción</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY & SALON */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-3 text-xs shadow-sm">
            <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por marca, modelo..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'available', label: 'Disponibles' },
                  { id: 'reserved', label: 'Reservados' },
                  { id: 'sold', label: 'Vendidos' },
                  { id: 'draft', label: 'Borrador' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStatusFilter(st.id)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                      selectedStatusFilter === st.id
                        ? 'bg-blue-700 text-white font-bold shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Seller Filter */}
              <select
                value={selectedSellerFilter}
                onChange={(e) => setSelectedSellerFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-medium"
              >
                <option value="all">Todos los Vendedores</option>
                {currentUser && (
                  <option value={currentUser.id}>👤 Mis Autos ({currentUser.name})</option>
                )}
                {agencySellers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role === 'seller' ? 'Vendedor' : 'Gerente'})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <span className="text-slate-500 text-xs">{filteredCars.length} autos mostrados</span>
              <button
                onClick={() => onOpenCarForm()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow transition-all"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>Cargar Auto</span>
              </button>
            </div>
          </div>

          {/* Cars List Grid */}
          {filteredCars.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
              <Car className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No hay autos con los filtros seleccionados</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Probá cambiando los filtros o cargá tu primer vehículo al salón para comenzar a recibir consultas por WhatsApp.
              </p>
              <button
                onClick={() => onOpenCarForm()}
                className="px-4 py-2 rounded-xl bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-2 mt-2 shadow"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Cargar Primer Auto</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCars.map((car) => {
                const isCopied = copiedCarId === car.id;
                return (
                  <div
                    key={car.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl overflow-hidden shadow-sm flex flex-col group transition-all"
                  >
                    {/* Photo Banner with Badges */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={car.photos[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'}
                        alt={car.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                              car.status === 'available'
                                ? 'bg-emerald-600 text-white'
                                : car.status === 'reserved'
                                ? 'bg-purple-600 text-white'
                                : car.status === 'sold'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-600 text-white'
                            }`}
                          >
                            {car.status === 'available'
                              ? 'Disponible'
                              : car.status === 'reserved'
                              ? 'Reservado'
                              : car.status === 'sold'
                              ? 'Vendido'
                              : 'Borrador'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 shadow-sm">
                            {car.year}
                          </span>
                        </div>

                        <button
                          onClick={() => toggleCarFeatured(car.id)}
                          title="Destacar en portada"
                          className={`p-1.5 rounded-lg backdrop-blur-md transition-colors ${
                            car.isFeatured
                              ? 'bg-amber-400 text-slate-950 shadow-md'
                              : 'bg-white/80 text-slate-600 hover:text-amber-500'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      {/* Price Pill */}
                      <div className="absolute bottom-2.5 left-2.5">
                        <span className="px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-900 font-black text-sm border border-slate-200 shadow-sm font-mono">
                          {formatPrice(car.price, car.currency)}
                        </span>
                      </div>

                      {/* WhatsApp Clicks Pill */}
                      <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 shadow-sm">
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>{car.whatsappInquiriesCount || 0} clics</span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3
                          onClick={() => onOpenCarDetail(car)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-700 cursor-pointer line-clamp-1"
                        >
                          {car.title}
                        </h3>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-medium">
                          <span>{car.mileage.toLocaleString('es-ES')} km</span>
                          <span>•</span>
                          <span>{car.transmission}</span>
                          <span>•</span>
                          <span>{car.fuelType}</span>
                        </div>

                        {/* Seller assigned badge */}
                        <div className="mt-2 text-[11px] text-slate-600 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
                          <UserCheck className="w-3 h-3 text-blue-700 shrink-0" />
                          <span className="truncate">
                            Vendedor: <strong className="text-slate-900">{car.sellerName || 'Concesionaria'}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Quick Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1">
                          {/* Change status quick dropdown */}
                          <select
                            value={car.status}
                            onChange={(e) => updateCarStatus(car.id, e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 text-slate-800 rounded-lg px-2 py-1 text-[11px] font-bold"
                          >
                            <option value="available">🟢 Disponible</option>
                            <option value="reserved">🟣 Reservado</option>
                            <option value="sold">🔴 Vendido</option>
                            <option value="draft">⚪ Borrador</option>
                          </select>

                          {/* Quick pitch copy button */}
                          <button
                            onClick={() => handleCopyPitch(car)}
                            title="Copiar texto de venta para WhatsApp"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenCarForm(car)}
                            title="Editar datos del auto"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors border border-slate-200"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => openWhatsappForCar(car)}
                            title="Probar enlace de WhatsApp"
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm(`¿Estás seguro de eliminar el auto ${car.title}?`)) {
                                deleteCarListing(car.id);
                              }
                            }}
                            title="Eliminar auto"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      )}

      {/* TAB 2: SELLERS TEAM MANAGEMENT */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <span>Equipo de Vendedores y Asesores de {currentAgency.name}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cada vendedor tiene su usuario y contraseña para cargar autos, responder cotizaciones y atender WhatsApp.
              </p>
            </div>

            <button
              onClick={() => setIsAddSellerOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2.5]" />
              <span>Registrar Nuevo Vendedor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agencySellers.map((seller) => {
              const loadedCarsCount = carListings.filter((c) => c.createdBySellerId === seller.id).length;
              const soldCarsCount = carListings.filter(
                (c) => c.createdBySellerId === seller.id && c.status === 'sold'
              ).length;

              return (
                <div
                  key={seller.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm flex flex-col justify-between space-y-4 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={seller.avatarUrl}
                      alt={seller.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-blue-200 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{seller.name}</h3>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            seller.role === 'agency_admin'
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {seller.role === 'agency_admin' ? 'Gerente' : 'Vendedor'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700 font-mono">@{seller.username}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{seller.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <p className="text-slate-500 text-[11px]">Autos Cargados:</p>
                      <p className="font-bold text-slate-900">{loadedCarsCount} unidades</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">Ventas Cerradas:</p>
                      <p className="font-bold text-emerald-700">{soldCarsCount} ventas</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">WhatsApp Directo:</p>
                      <p className="font-bold text-blue-700 font-mono">{seller.whatsappNumber}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[11px]">Comisión Pactada:</p>
                      <p className="font-bold text-slate-900">{seller.commissionRate || 1.5}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Estado: <strong className="text-emerald-700">Activo</strong>
                    </span>
                    <button
                      onClick={() => {
                        const phone = seller.whatsappNumber.replace(/[^0-9]/g, '');
                        window.open(`https://wa.me/${phone}`, '_blank');
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: LEADS & CRM */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-700" />
              <span>Prospectos y Consultas Recibidas (CRM)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Clientes que hicieron clic en WhatsApp o enviaron formularios de consulta por vehículos de tu salón.
            </p>
          </div>

          {agencyLeads.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 shadow-sm">
              No hay prospectos registrados aún para esta concesionaria.
            </div>
          ) : (
            <div className="space-y-3">
              {agencyLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm space-y-3 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {lead.clientName} • <span className="text-blue-700">{lead.carTitle}</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Tel: {lead.clientPhone} {lead.clientEmail && `• ${lead.clientEmail}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold"
                      >
                        <option value="new">🟢 Nuevo</option>
                        <option value="contacted">🔵 Contactado</option>
                        <option value="test_drive_scheduled">🟣 Prueba Agendada</option>
                        <option value="reserved">🟡 Con Seña</option>
                        <option value="sold">⭐ Vendido</option>
                        <option value="discarded">⚪ Descartado</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-700 italic">"{lead.message}"</p>
                    {lead.tradeInVehicle && (
                      <p className="text-[11px] text-amber-800 font-bold pt-1">
                        🚘 Entrega Usado en Permuta: {lead.tradeInVehicle}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      {new Date(lead.createdAt).toLocaleString('es-ES')}
                    </span>

                    <button
                      onClick={() => {
                        const phone = lead.clientPhone.replace(/[^0-9]/g, '');
                        const msg = `¡Hola ${lead.clientName}! 👋 Te escribo de *${currentAgency.name}* sobre tu consulta por el *${lead.carTitle}*. ¿Cómo estás?`;
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Abrir Chat de WhatsApp</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PRIVATE OFFERS / TOMA DE USADOS */}
      {activeTab === 'offers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-5 h-5 text-blue-700" />
              <span>Autos Ofrecidos por Particulares para Toma Directa o Consignación</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Particulares que completaron el formulario "Vender Mi Auto" seleccionando tu agencia o la red general.
            </p>
          </div>

          {relevantOffers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 text-slate-500 shadow-sm">
              No hay ofertas de particulares registradas aún.
            </div>
          ) : (
            <div className="space-y-3">
              {relevantOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-slate-900">
                          {offer.make} {offer.model} {offer.version} ({offer.year})
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-xs border border-emerald-200">
                          Pretende: {offer.currency} {offer.expectedPrice.toLocaleString('es-ES')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {offer.mileage.toLocaleString('es-ES')} km • {offer.transmission} • {offer.fuelType} • {offer.city}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={offer.status}
                        onChange={(e) => updatePrivateOfferStatus(offer.id, e.target.value as any)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-bold"
                      >
                        <option value="pending">🟡 Pendiente de Revisión</option>
                        <option value="agency_interested">🟢 Nos Interesa (Contactar)</option>
                        <option value="consigned">🟣 En Consignación</option>
                        <option value="rejected">🔴 Descartar</option>
                      </select>

                      <button
                        onClick={() => {
                          const phone = offer.contactWhatsapp.replace(/[^0-9]/g, '');
                          const msg = `¡Hola ${offer.contactName}! 👋 Te escribo de la concesionaria *${currentAgency.name}*. Vimos la publicación de tu *${offer.make} ${offer.model} ${offer.year}* en MiCarro. Nos interesa coordinar un peritaje para evaluarlo. ¿Te queda bien esta semana?`;
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp Propietario</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700">
                    <p>
                      <strong>Contacto:</strong> {offer.contactName} ({offer.contactPhone}) • {offer.contactEmail}
                    </p>
                    <p className="mt-1 text-slate-500">
                      <strong>Detalles:</strong> {offer.conditionNotes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: SUBSCRIPTION & PAYMENT METHODS (PARAGUAY) */}
      {activeTab === 'subscription' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-blue-500/30 text-blue-200 text-xs font-bold border border-blue-400/30">
                  Plan Activo de Concesionaria
                </span>
                <span className="text-xs text-blue-200">
                  Vigente hasta: <strong className="text-white">{currentAgency.subscriptionExpiresAt || '2027-01-01'}</strong>
                </span>
              </div>
              <h2 className="text-2xl font-black mt-1 text-white">{agencyPlan.name}</h2>
              <p className="text-xs text-blue-100/80 mt-0.5 max-w-xl">
                {agencyPlan.description}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {onOpenRedeemCode && (
                <button
                  onClick={onOpenRedeemCode}
                  className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                >
                  <KeyRound className="w-4 h-4 text-slate-900" />
                  <span>Canjear Código de Suscripción</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: Plan Quota & Features */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>Detalles de tu Membresía</span>
                </h3>
                <span className="text-xs font-bold text-blue-700 font-mono">
                  {formatPrice(agencyPlan.monthlyPrice, agencyPlan.currency)} / mes
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Capacidad de Salón:</span>
                  <span className="font-bold text-slate-900">{maxCarsAllowed} vehículos simultáneos</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Fotos por Vehículo:</span>
                  <span className="font-bold text-slate-900">Hasta {agencyPlan.maxPhotosPerCar} fotos HD</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Cupos Destacados en Portada:</span>
                  <span className="font-bold text-blue-700">{agencyPlan.featuredSlots} cupos</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Redacción con Inteligencia Artificial:</span>
                  <span className="font-bold text-emerald-700">Habilitado</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-600">Acceso a Ofertas de Particulares:</span>
                  <span className="font-bold text-emerald-700">Incluido</span>
                </div>
              </div>

              {onOpenRedeemCode && (
                <button
                  onClick={onOpenRedeemCode}
                  className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <KeyRound className="w-4 h-4 text-blue-600" />
                  <span>¿Tienes un código de suscripción? Canjearlo aquí</span>
                </button>
              )}

              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>Seguridad de Planes & Facturación SaaS</span>
                </p>
                <p className="text-amber-800/90 leading-relaxed">
                  La configuración de precios de los planes y el control maestro de facturación se administran de forma segura exclusivamente desde el Panel de Administración Master.
                </p>
                <button
                  onClick={onGoToSaasAdmin}
                  className="inline-flex items-center gap-1 font-bold text-blue-800 hover:underline pt-1 text-xs"
                >
                  <span>Ir al Acceso de Administrador Master</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Column 2 & 3: Payment Methods Available in Paraguay */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Medios de Pago Habilitados en Paraguay</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Canales autorizados para abonar o renovar tu membresía de software MiCarro.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const text = `🏦 DATOS DE PAGO MICARRO PARAGUAY:\n\n• Transferencia SIPAP 24/7:\n  Banco: Banco Itaú Paraguay / Continental / Ueno Bank\n  Cta Cte Gs: 72019482\n  Cta USD: 83019482\n  Alias SIPAP: MICARRO.PY\n  RUC: 80099432-1\n  Titular: MiCarro Software Paraguay S.A.\n\n• Tarjetas: Aceptamos Visa, Mastercard, Panal, Cabal (Bancard / Vpos)\n• Efectivo en Sede: Av. Santa Teresa y Aviadores del Chaco, Asunción`;
                    navigator.clipboard.writeText(text);
                    setCopiedPaymentText(true);
                    setTimeout(() => setCopiedPaymentText(false), 3000);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  {copiedPaymentText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">¡Datos Copiados!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copiar Todos los Datos</span>
                    </>
                  )}
                </button>
              </div>

              {/* Grid of Paraguayan Payment Gateways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentGateways
                  .filter((gw) => gw.isEnabled)
                  .map((gw) => (
                    <div
                      key={gw.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            {gw.type === 'bank_transfer'
                              ? 'Transferencia SIPAP'
                              : gw.type === 'card'
                              ? 'Tarjetas (Bancard)'
                              : gw.type === 'cash'
                              ? 'Efectivo en Sede'
                              : 'Billetera Digital'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">Paraguay</span>
                        </div>

                        <h4 className="font-bold text-slate-900 text-sm">{gw.name}</h4>

                        {gw.bankName && (
                          <div className="text-xs text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                            <p><strong>Banco:</strong> {gw.bankName}</p>
                            {gw.accountHolder && <p><strong>Titular:</strong> {gw.accountHolder}</p>}
                            {gw.cuitOrTaxId && <p><strong>RUC:</strong> {gw.cuitOrTaxId}</p>}
                            {gw.accountNumber && <p className="font-mono text-blue-900"><strong>{gw.accountNumber}</strong></p>}
                            {gw.cbuOrAlias && <p className="font-mono text-emerald-800 font-bold"><strong>{gw.cbuOrAlias}</strong></p>}
                          </div>
                        )}

                        {gw.locationOrOffice && (
                          <div className="text-xs text-slate-700 space-y-1 bg-white p-2.5 rounded-xl border border-slate-200">
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                              <span>{gw.locationOrOffice}</span>
                            </p>
                            {gw.currencyAccepted && (
                              <p className="text-[11px] text-slate-600"><strong>Acepta:</strong> {gw.currencyAccepted}</p>
                            )}
                          </div>
                        )}

                        {gw.paymentLink && (
                          <div className="pt-1">
                            <a
                              href={gw.paymentLink}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pagar con Tarjeta Online</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {gw.instructions && (
                          <p className="text-[11px] text-slate-600 leading-relaxed italic">
                            {gw.instructions}
                          </p>
                        )}
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Acreditación Inmediata
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Notify Payment WhatsApp Callout */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>¿Realizaste una transferencia bancaria o pago en efectivo?</span>
                  </h4>
                  <p className="text-emerald-800 text-xs">
                    Envíanos el comprobante por WhatsApp para activar o extender tu plan al instante.
                  </p>
                </div>

                <a
                  href={`https://wa.me/595981489055?text=${encodeURIComponent(
                    `¡Hola Administración MiCarro! 👋 Adjunto el comprobante de pago de la membresía para la concesionaria *${currentAgency.name}* (RUC: ${currentAgency.cuitOrTaxId || 'Consultar'}) para el plan *${agencyPlan.name}*.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm whitespace-nowrap self-start sm:self-auto"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Notificar Pago por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Seller */}
      {isAddSellerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Registrar Nuevo Vendedor</h3>
                  <p className="text-[11px] text-slate-500">{currentAgency.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSellerOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sellerFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {sellerFormError}
              </div>
            )}

            <form onSubmit={handleCreateSeller} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={newSellerName}
                  onChange={(e) => setNewSellerName(e.target.value)}
                  placeholder="Ej: Marcelo Castro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Usuario de Acceso *</label>
                  <input
                    type="text"
                    required
                    value={newSellerUsername}
                    onChange={(e) => setNewSellerUsername(e.target.value)}
                    placeholder="marcelo.castro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={newSellerPassword}
                    onChange={(e) => setNewSellerPassword(e.target.value)}
                    placeholder="vendedor123"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={newSellerEmail}
                  onChange={(e) => setNewSellerEmail(e.target.value)}
                  placeholder="marcelo@concesionaria.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp de Atención *</label>
                  <input
                    type="text"
                    required
                    value={newSellerWhatsapp}
                    onChange={(e) => setNewSellerWhatsapp(e.target.value)}
                    placeholder="5491148905501"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">% Comisión por Venta</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSellerCommission}
                    onChange={(e) => setNewSellerCommission(Number(e.target.value))}
                    placeholder="1.5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSellerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow"
                >
                  Guardar Vendedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
