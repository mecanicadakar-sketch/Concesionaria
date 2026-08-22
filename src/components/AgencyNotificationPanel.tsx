import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CarListing, PrivateCarOffer, LeadInquiry } from '../types';
import {
  Bell,
  BellRing,
  MessageCircle,
  Car,
  FileText,
  CheckCircle2,
  Clock,
  Trash2,
  CheckCheck,
  ExternalLink,
  Sparkles,
  Volume2,
  VolumeX,
  Plus,
  AlertCircle,
  Tag,
  DollarSign,
  Send,
  Phone,
  User,
  ShieldCheck,
  Eye,
  Filter,
  X,
} from 'lucide-react';

export interface AgencyNotification {
  id: string;
  agencyId: string;
  type: 'quote_inquiry' | 'private_seller' | 'financing_request' | 'trade_in';
  title: string;
  message: string;
  clientName: string;
  clientPhone: string;
  clientWhatsapp: string;
  clientEmail?: string;
  carId?: string;
  carTitle?: string;
  offerId?: string;
  vehicleSummary?: string;
  amountOrPrice?: string;
  photoUrl?: string;
  timestamp: string;
  isRead: boolean;
  priority?: 'high' | 'normal';
}

// Subtle Audio Chime using Web Audio API
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // First high note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Second higher note for pleasant chime
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.2, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // Ignore audio context autoplay restrictions gracefully
  }
};

interface AgencyNotificationPanelProps {
  onOpenCarDetail?: (car: CarListing) => void;
  onOpenQuotePdf?: (car: CarListing) => void;
  onNavigateToTab?: (tab: 'inventory' | 'sellers' | 'offers' | 'leads' | 'company' | 'subscription' | 'notifications') => void;
}

export const AgencyNotificationPanel: React.FC<AgencyNotificationPanelProps> = ({
  onOpenCarDetail,
  onOpenQuotePdf,
  onNavigateToTab,
}) => {
  const {
    currentAgency,
    carListings,
    leads,
    privateOffers,
    addLead,
    addPrivateOffer,
    formatPrice,
    updateLeadStatus,
    updatePrivateOfferStatus,
  } = useApp();

  const storageKey = `micarro_agency_notifs_${currentAgency?.id || 'demo'}`;

  const [notifications, setNotifications] = useState<AgencyNotification[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'quotes' | 'sellers' | 'unread'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('micarro_notif_sound') !== 'false';
  });
  const [activeToast, setActiveToast] = useState<AgencyNotification | null>(null);

  // Initialize notifications from real leads and private offers
  useEffect(() => {
    if (!currentAgency) return;

    // Load persisted notification state
    const savedNotifsRaw = localStorage.getItem(storageKey);
    let savedNotifs: AgencyNotification[] = [];
    if (savedNotifsRaw) {
      try {
        savedNotifs = JSON.parse(savedNotifsRaw);
      } catch {
        savedNotifs = [];
      }
    }

    // Build synthesized notifications from leads
    const agencyLeads = leads.filter((l) => l.agencyId === currentAgency.id);
    const leadNotifs: AgencyNotification[] = agencyLeads.map((l) => {
      const foundCar = carListings.find((c) => c.id === l.carId);
      const isQuoteType = l.channel === 'financing_quote' || l.message.toLowerCase().includes('cotiz') || l.message.toLowerCase().includes('cuota') || l.message.toLowerCase().includes('precio');
      
      const existing = savedNotifs.find((s) => s.id === `lead-${l.id}`);

      return {
        id: `lead-${l.id}`,
        agencyId: currentAgency.id,
        type: isQuoteType ? 'quote_inquiry' : 'financing_request',
        title: isQuoteType
          ? `Solicitud de Cotización: ${l.carTitle}`
          : `Consulta de Cliente: ${l.carTitle}`,
        message: l.message,
        clientName: l.clientName,
        clientPhone: l.clientPhone,
        clientWhatsapp: l.clientPhone.replace(/[^0-9]/g, ''),
        clientEmail: l.clientEmail,
        carId: l.carId,
        carTitle: l.carTitle,
        vehicleSummary: foundCar ? `${foundCar.make} ${foundCar.model} ${foundCar.year}` : l.carTitle,
        amountOrPrice: foundCar ? `${foundCar.currency} ${foundCar.price.toLocaleString('es-ES')}` : undefined,
        photoUrl: foundCar?.photos?.[0],
        timestamp: l.createdAt,
        isRead: existing ? existing.isRead : l.status !== 'new',
        priority: 'high',
      };
    });

    // Build synthesized notifications from private offers
    const agencyOffers = privateOffers.filter(
      (o) =>
        o.preferredAgencyId === currentAgency.id ||
        o.preferredAgencyId === 'all' ||
        o.assignedAgencyId === currentAgency.id
    );

    const offerNotifs: AgencyNotification[] = agencyOffers.map((o) => {
      const existing = savedNotifs.find((s) => s.id === `offer-${o.id}`);
      return {
        id: `offer-${o.id}`,
        agencyId: currentAgency.id,
        type: 'private_seller',
        title: `Particular quiere vender: ${o.make} ${o.model} (${o.year})`,
        message: o.conditionNotes || 'Vehículo ofrecido por particular para toma directa o consignación.',
        clientName: o.contactName,
        clientPhone: o.contactPhone,
        clientWhatsapp: o.contactWhatsapp.replace(/[^0-9]/g, '') || o.contactPhone.replace(/[^0-9]/g, ''),
        clientEmail: o.contactEmail,
        offerId: o.id,
        vehicleSummary: `${o.make} ${o.model} ${o.version || ''} (${o.year}) - ${o.mileage.toLocaleString('es-ES')} km`,
        amountOrPrice: `Pretende: ${o.currency} ${o.expectedPrice.toLocaleString('es-ES')}`,
        photoUrl: o.photos?.[0],
        timestamp: o.submittedAt,
        isRead: existing ? existing.isRead : o.status !== 'pending',
        priority: 'high',
      };
    });

    // Merge generated custom notifs that might not be in mock lists
    const customOnly = savedNotifs.filter(
      (s) => !leadNotifs.some((ln) => ln.id === s.id) && !offerNotifs.some((on) => on.id === s.id)
    );

    const combined = [...leadNotifs, ...offerNotifs, ...customOnly].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setNotifications(combined);
  }, [currentAgency?.id, leads, privateOffers, carListings]);

  // Persist notification read status
  const persistNotifications = (updated: AgencyNotification[]) => {
    setNotifications(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save notifications to localStorage', e);
    }
  };

  const handleMarkAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    persistNotifications(updated);
  };

  const handleToggleRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: !n.isRead } : n));
    persistNotifications(updated);
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    persistNotifications(updated);
  };

  const handleDeleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    persistNotifications(updated);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem('micarro_notif_sound', next ? 'true' : 'false');
    if (next) playNotificationChime();
  };

  // Trigger a Toast Alert
  const showToast = (notif: AgencyNotification) => {
    setActiveToast(notif);
    if (soundEnabled) playNotificationChime();
    setTimeout(() => {
      setActiveToast((curr) => (curr?.id === notif.id ? null : curr));
    }, 6500);
  };

  // SIMULATOR 1: Inbound Quote Lead from a Buyer
  const handleSimulateQuoteLead = () => {
    if (!currentAgency) return;
    const agencyCars = carListings.filter((c) => c.agencyId === currentAgency.id && c.status === 'available');
    const targetCar = agencyCars[Math.floor(Math.random() * agencyCars.length)] || carListings[0];

    const sampleNames = ['Rodrigo Benítez', 'Camila Duarte', 'Esteban Galeano', 'Mariana Sosa', 'Alejandro Morales'];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomPhone = `+595 981 ${Math.floor(100000 + Math.random() * 900000)}`;
    const randomWhatsapp = randomPhone.replace(/[^0-9]/g, '');

    const downPayment = targetCar ? Math.round(targetCar.price * 0.3) : 5000;
    const installmentAmount = targetCar ? Math.round((targetCar.price * 0.7) / 24) : 450;

    const message = `¡Hola ${currentAgency.name}! 👋 Vi el ${targetCar ? targetCar.title : 'auto'} en MiCarro. Me gustaría solicitar una cotización formal con anticipo de USD ${downPayment.toLocaleString('es-ES')} y el saldo financiado en 24 cuotas de aprox. USD ${installmentAmount.toLocaleString('es-ES')}. ¿Tienen entrega inmediata?`;

    // Add to AppContext leads
    addLead({
      carId: targetCar ? targetCar.id : 'car-demo',
      carTitle: targetCar ? targetCar.title : 'Toyota Corolla Cross',
      agencyId: currentAgency.id,
      agencyName: currentAgency.name,
      clientName: randomName,
      clientPhone: randomPhone,
      clientEmail: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      channel: 'financing_quote',
      message: message,
      status: 'new',
    });

    const newNotif: AgencyNotification = {
      id: `lead-sim-${Date.now()}`,
      agencyId: currentAgency.id,
      type: 'quote_inquiry',
      title: `Nueva Solicitud de Cotización: ${targetCar ? targetCar.title : 'Vehículo'}`,
      message: message,
      clientName: randomName,
      clientPhone: randomPhone,
      clientWhatsapp: randomWhatsapp,
      clientEmail: `${randomName.toLowerCase().replace(' ', '.')}@gmail.com`,
      carId: targetCar?.id,
      carTitle: targetCar?.title,
      vehicleSummary: targetCar ? `${targetCar.make} ${targetCar.model} ${targetCar.year}` : 'Vehículo',
      amountOrPrice: targetCar ? `${targetCar.currency} ${targetCar.price.toLocaleString('es-ES')}` : undefined,
      photoUrl: targetCar?.photos?.[0],
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high',
    };

    const updated = [newNotif, ...notifications];
    persistNotifications(updated);
    showToast(newNotif);
  };

  // SIMULATOR 2: Private Owner Offering a Car
  const handleSimulatePrivateOffer = () => {
    if (!currentAgency) return;

    const sampleSellers = [
      {
        name: 'Guillermo Valdez',
        phone: '+595 971 450 820',
        city: 'Asunción, Paraguay',
        make: 'Toyota',
        model: 'Vitz RS',
        year: 2019,
        km: 48000,
        price: 9200,
        currency: 'USD' as const,
        notes: 'Impecable estado, volante original, cubiertas nuevas y mantenimiento al día. Busco venta directa al contado en agencia.',
        photo: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
      },
      {
        name: 'Valeria Bogado',
        phone: '+595 982 315 990',
        city: 'San Lorenzo, Central',
        make: 'Volkswagen',
        model: 'T-Cross Highline',
        year: 2022,
        km: 32000,
        price: 18500,
        currency: 'USD' as const,
        notes: 'Único dueño, service en Diesa oficial con garantía de fábrica vigente. Busco entregar en parte de pago o venta.',
        photo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&auto=format&fit=crop&q=80',
      },
    ];

    const sample = sampleSellers[Math.floor(Math.random() * sampleSellers.length)];

    addPrivateOffer({
      contactName: sample.name,
      contactPhone: sample.phone,
      contactWhatsapp: sample.phone.replace(/[^0-9]/g, ''),
      contactEmail: `${sample.name.toLowerCase().replace(' ', '.')}@hotmail.com`,
      city: sample.city,
      make: sample.make,
      model: sample.model,
      year: sample.year,
      mileage: sample.km,
      expectedPrice: sample.price,
      currency: sample.currency,
      transmission: 'Automática',
      fuelType: 'Nafta/Gasolina',
      conditionNotes: sample.notes,
      photos: [sample.photo],
      preferredAgencyId: currentAgency.id,
    });

    const newNotif: AgencyNotification = {
      id: `offer-sim-${Date.now()}`,
      agencyId: currentAgency.id,
      type: 'private_seller',
      title: `Particular interesado en vender: ${sample.make} ${sample.model} (${sample.year})`,
      message: sample.notes,
      clientName: sample.name,
      clientPhone: sample.phone,
      clientWhatsapp: sample.phone.replace(/[^0-9]/g, ''),
      clientEmail: `${sample.name.toLowerCase().replace(' ', '.')}@hotmail.com`,
      vehicleSummary: `${sample.make} ${sample.model} (${sample.year}) • ${sample.km.toLocaleString('es-ES')} km • ${sample.city}`,
      amountOrPrice: `Pretende: ${sample.currency} ${sample.price.toLocaleString('es-ES')}`,
      photoUrl: sample.photo,
      timestamp: new Date().toISOString(),
      isRead: false,
      priority: 'high',
    };

    const updated = [newNotif, ...notifications];
    persistNotifications(updated);
    showToast(newNotif);
  };

  // Filtered list
  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'unread') return !n.isRead;
    if (selectedFilter === 'quotes') return n.type === 'quote_inquiry' || n.type === 'financing_request';
    if (selectedFilter === 'sellers') return n.type === 'private_seller';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const quoteCount = notifications.filter((n) => n.type === 'quote_inquiry' || n.type === 'financing_request').length;
  const sellerCount = notifications.filter((n) => n.type === 'private_seller').length;

  return (
    <div className="space-y-6">
      {/* FLOATING LIVE ALERT TOAST */}
      {activeToast && (
        <div className="fixed top-20 right-4 sm:right-6 z-50 max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="p-4 rounded-2xl bg-slate-950/95 border-2 border-amber-400 text-white shadow-2xl backdrop-blur-xl space-y-3 ring-4 ring-amber-400/20">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                  activeToast.type === 'private_seller' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-blue-500/20 text-sky-300 border border-sky-400/30'
                }`}>
                  {activeToast.type === 'private_seller' ? <Tag className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-mono">
                    {activeToast.type === 'private_seller' ? '🚗 Toma de Usado' : '💬 Nueva Cotización'}
                  </span>
                  <h4 className="text-xs font-bold text-white mt-1 line-clamp-1">{activeToast.title}</h4>
                </div>
              </div>

              <button
                onClick={() => setActiveToast(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              "{activeToast.message}"
            </p>

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[11px] text-amber-300 font-bold font-mono truncate">
                {activeToast.clientName} ({activeToast.clientPhone})
              </span>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    handleMarkAsRead(activeToast.id);
                    const phone = activeToast.clientWhatsapp;
                    const text = activeToast.type === 'private_seller'
                      ? `¡Hola ${activeToast.clientName}! 👋 Te escribo de la concesionaria *${currentAgency?.name}*. Recibimos los datos de tu vehículo en MiCarro y nos gustaría coordinar una cotización/inspección.`
                      : `¡Hola ${activeToast.clientName}! 👋 Te escribo de *${currentAgency?.name}* respecto a tu solicitud de cotización por el *${activeToast.carTitle || 'auto'}*.`;
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
                    setActiveToast(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    handleMarkAsRead(activeToast.id);
                    setActiveToast(null);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER & STATS CARD */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 border border-sky-400/30 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm font-mono">
              <BellRing className="w-3.5 h-3.5" /> Centro de Alertas
            </span>
            {unreadCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 border border-rose-400/40 text-rose-300 text-xs font-bold animate-pulse">
                {unreadCount} {unreadCount === 1 ? 'alerta sin leer' : 'alertas sin leer'}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
                ✓ Todo al día
              </span>
            )}
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <span>Notificaciones & Alertas Comerciales</span>
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Recibe avisos inmediatos cuando un cliente solicita una cotización formal de tu inventario o cuando un particular publica un auto buscando venderlo a tu concesionaria.
          </p>
        </div>

        {/* Quick Simulator & Sound Control Tools */}
        <div className="flex flex-wrap items-center gap-2 relative z-10">
          <button
            type="button"
            onClick={toggleSound}
            className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              soundEnabled
                ? 'bg-sky-950/80 border-sky-400/40 text-sky-300 hover:bg-sky-900'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title={soundEnabled ? 'Sonido de alertas activado' : 'Sonido silenciado'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>{soundEnabled ? 'Sonido ON' : 'Sonido OFF'}</span>
          </button>

          <button
            type="button"
            onClick={handleSimulateQuoteLead}
            className="px-3.5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-transform active:scale-95"
            title="Simular un comprador solicitando cotización de cuotas y anticipo"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>+ Simular Cotización</span>
          </button>

          <button
            type="button"
            onClick={handleSimulatePrivateOffer}
            className="px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-transform active:scale-95"
            title="Simular un particular ofreciendo un auto usado a la agencia"
          >
            <Car className="w-3.5 h-3.5 text-emerald-200" />
            <span>+ Simular Particular</span>
          </button>
        </div>
      </div>

      {/* METRIC COUNTERS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setSelectedFilter('quotes')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedFilter === 'quotes'
              ? 'bg-blue-50 border-blue-400 shadow-md ring-2 ring-blue-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Mensajes de Cotización</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{quoteCount}</p>
          <p className="text-[11px] text-blue-700 font-semibold">Solicitudes de precio & cuotas</p>
        </div>

        <div
          onClick={() => setSelectedFilter('sellers')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedFilter === 'sellers'
              ? 'bg-emerald-50 border-emerald-400 shadow-md ring-2 ring-emerald-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Particulares (Venta / Permuta)</span>
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{sellerCount}</p>
          <p className="text-[11px] text-emerald-700 font-semibold">Ofertas para toma directa</p>
        </div>

        <div
          onClick={() => setSelectedFilter('unread')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm ${
            selectedFilter === 'unread'
              ? 'bg-amber-50 border-amber-400 shadow-md ring-2 ring-amber-200'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold">Pendientes de Gestión</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{unreadCount}</p>
          <p className="text-[11px] text-slate-500">Requieren contacto por WhatsApp</p>
        </div>
      </div>

      {/* FILTER BAR & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl transition-all ${
              selectedFilter === 'all'
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('quotes')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedFilter === 'quotes'
                ? 'bg-blue-700 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Cotizaciones ({quoteCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('sellers')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedFilter === 'sellers'
                ? 'bg-emerald-700 text-white font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Particulares ({sellerCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('unread')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
              selectedFilter === 'unread'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>No Leídas ({unreadCount})</span>
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Marcar todas leídas</span>
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      {filteredNotifications.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Bell className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No hay notificaciones en este filtro</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cuando un cliente pregunte por un auto o un particular cargue su vehículo para venta, aparecerá aquí al instante.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              type="button"
              onClick={handleSimulateQuoteLead}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Probar con Cotización Demo
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notif) => {
            const isQuote = notif.type === 'quote_inquiry' || notif.type === 'financing_request';
            const foundCar = notif.carId ? carListings.find((c) => c.id === notif.carId) : null;

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all duration-200 relative overflow-hidden shadow-sm hover:shadow-md ${
                  !notif.isRead
                    ? isQuote
                      ? 'bg-blue-50/40 border-blue-300 ring-1 ring-blue-200'
                      : 'bg-emerald-50/40 border-emerald-300 ring-1 ring-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Left accent color bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                    !notif.isRead ? (isQuote ? 'bg-blue-600' : 'bg-emerald-500') : 'bg-transparent'
                  }`}
                />

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left Column: Icon, Badges, Title & Content */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    {/* Vehicle Photo or Icon */}
                    {notif.photoUrl ? (
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                        <img
                          src={notif.photoUrl}
                          alt={notif.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                          isQuote
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {isQuote ? <FileText className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                      </div>
                    )}

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full font-mono ${
                            isQuote
                              ? 'bg-blue-100 text-blue-800 border border-blue-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {isQuote ? '💬 Cotización / Financiación' : '🚗 Particular Vende Auto'}
                        </span>

                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="No leída" />
                        )}

                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {new Date(notif.timestamp).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h3>

                      {notif.vehicleSummary && (
                        <p className="text-xs text-blue-800 font-semibold flex items-center gap-1.5">
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          <span>{notif.vehicleSummary}</span>
                          {notif.amountOrPrice && (
                            <span className="px-2 py-0.2 rounded-md bg-slate-100 text-slate-800 font-bold font-mono">
                              {notif.amountOrPrice}
                            </span>
                          )}
                        </p>
                      )}

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 italic">
                        "{notif.message}"
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 flex-wrap font-mono">
                        <span>
                          <strong>Contacto:</strong> {notif.clientName}
                        </span>
                        <span>•</span>
                        <span>{notif.clientPhone}</span>
                        {notif.clientEmail && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500">{notif.clientEmail}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* WhatsApp Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        const phone = notif.clientWhatsapp || notif.clientPhone.replace(/[^0-9]/g, '');
                        const msg = isQuote
                          ? `¡Hola ${notif.clientName}! 👋 Te escribo de la concesionaria *${currentAgency?.name}* respecto a tu solicitud de cotización por el *${notif.carTitle || 'vehículo'}*. ¿Cómo estás? Te confirmo disponibilidad para avanzar.`
                          : `¡Hola ${notif.clientName}! 👋 Te escribo de la concesionaria *${currentAgency?.name}*. Recibimos los datos de tu *${notif.vehicleSummary || 'auto'}* que querés vender. Nos interesa tasarlo e inspeccionarlo. ¿Cuándo te queda bien acercarlo?`;
                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contactar por WhatsApp</span>
                    </button>

                    {/* PDF Quote Button if Car exists */}
                    {isQuote && foundCar && onOpenQuotePdf && (
                      <button
                        type="button"
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          onOpenQuotePdf(foundCar);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>📄 Generar Cotización PDF</span>
                      </button>
                    )}

                    {/* Offer Tab Navigation if it's a private seller */}
                    {!isQuote && onNavigateToTab && (
                      <button
                        type="button"
                        onClick={() => {
                          handleMarkAsRead(notif.id);
                          onNavigateToTab('offers');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Tag className="w-3.5 h-3.5 text-amber-300" />
                        <span>Ver en Toma de Usados</span>
                      </button>
                    )}

                    {/* Secondary Actions: Toggle Read / Delete */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => handleToggleRead(notif.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-xs flex items-center gap-1 transition-colors"
                        title={notif.isRead ? 'Marcar como no leída' : 'Marcar como leída'}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${notif.isRead ? 'text-emerald-600' : 'text-slate-400'}`} />
                        <span className="text-[11px]">{notif.isRead ? 'Leída' : 'Marcar leída'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteNotification(notif.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Eliminar notificación"
                      >
                        <Trash2 className="w-4 h-4" />
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
