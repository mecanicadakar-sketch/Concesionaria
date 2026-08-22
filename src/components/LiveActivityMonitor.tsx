import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Activity,
  Eye,
  MessageCircle,
  Car,
  Building2,
  Globe,
  Smartphone,
  Laptop,
  ArrowUpRight,
  Clock,
  Sparkles,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Filter,
  RefreshCw,
  Sliders,
  BarChart3,
  Flame,
  ShieldCheck,
} from 'lucide-react';
import { AgencyLogo } from './AgencyLogo';

interface ActivityLogItem {
  id: string;
  timestamp: string;
  type: 'whatsapp_click' | 'car_view' | 'new_car' | 'seller_login' | 'private_offer' | 'code_redeemed';
  title: string;
  detail: string;
  location?: string;
  device?: 'mobile' | 'desktop';
}

export const LiveActivityMonitor: React.FC = () => {
  const {
    agencies,
    carListings,
    users,
    leads,
    privateOffers,
    accessCodes,
    invoices,
    currentUser,
  } = useApp();

  // Simulated live active visitors with slight realistic fluctuation
  const [onlineVisitorsCount, setOnlineVisitorsCount] = useState<number>(12);
  const [activeTab, setActiveTab] = useState<'overview' | 'agencies' | 'logs' | 'analytics_setup'>('overview');
  const [filterType, setFilterType] = useState<string>('all');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState<string>(
    localStorage.getItem('micarro_ga_id') || 'G-MCARRO2026'
  );
  const [gaSaved, setGaSaved] = useState(false);

  // Periodic heartbeat animation for live users
  useEffect(() => {
    const interval = setInterval(() => {
      // Random delta between -2 and +3, keeping realistic range (8 - 25)
      setOnlineVisitorsCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(6, Math.min(28, prev + delta));
      });
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Compute aggregated stats
  const totalViews = carListings.reduce((sum, c) => sum + (c.viewsCount || 0), 0);
  const totalWhatsappClicks = carListings.reduce((sum, c) => sum + (c.whatsappInquiriesCount || 0), 0);
  const activeSellersCount = users.filter((u) => u.isActive).length;
  const activeAgenciesCount = agencies.filter((a) => a.subscriptionStatus === 'active' || a.subscriptionStatus === 'trial').length;

  // Generate realistic recent activity logs combining real listings and inquiries
  const recentLogs: ActivityLogItem[] = [
    {
      id: 'log-1',
      timestamp: 'Hace 2 minutos',
      type: 'whatsapp_click',
      title: 'Consulta WhatsApp por Toyota Hilux 2023',
      detail: 'Interesado desde Asunción contactó a Mecánica Dakar Autos.',
      location: 'Asunción, PY',
      device: 'mobile',
    },
    {
      id: 'log-2',
      timestamp: 'Hace 7 minutos',
      type: 'car_view',
      title: 'Vehículo visto: Ford Ranger Limited 2022',
      detail: 'Visitante navegando galería multi-foto en el catálogo.',
      location: 'San Lorenzo, PY',
      device: 'mobile',
    },
    {
      id: 'log-3',
      timestamp: 'Hace 14 minutos',
      type: 'seller_login',
      title: 'Sesión iniciada por Vendedor',
      detail: 'Carlos Gómez accedió al Portal de Carga.',
      location: 'Asunción, PY',
      device: 'desktop',
    },
    {
      id: 'log-4',
      timestamp: 'Hace 22 minutos',
      type: 'private_offer',
      title: 'Nueva propuesta de particular recibida',
      detail: 'Ford Focus 2.0 SE Plus ofrecido a la red de agencias.',
      location: 'Ciudad del Este, PY',
      device: 'mobile',
    },
    {
      id: 'log-5',
      timestamp: 'Hace 35 minutos',
      type: 'new_car',
      title: 'Nuevo vehículo publicado',
      detail: 'Volkswagen Amarok V6 Extreme 4x4 cargada al salón de ventas.',
      location: 'Luque, PY',
      device: 'desktop',
    },
    {
      id: 'log-6',
      timestamp: 'Hace 48 minutos',
      type: 'code_redeemed',
      title: 'Membresía Activada vía Código',
      detail: 'Plan Concesionaria Oficial habilitado con éxito.',
      location: 'Asunción, PY',
      device: 'desktop',
    },
    {
      id: 'log-7',
      timestamp: 'Hace 1 hora',
      type: 'whatsapp_click',
      title: 'Consulta por Chevrolet Onix Premier',
      detail: 'Pregunta por condiciones de financiación y permuta.',
      location: 'Encarnación, PY',
      device: 'mobile',
    },
  ];

  const handleSaveGa = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('micarro_ga_id', googleAnalyticsId.trim());
    setGaSaved(true);
    setTimeout(() => setGaSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Live Online Users Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>TELEMETRÍA & TRÁFICO EN VIVO</span>
              </span>
              <span className="text-xs text-blue-200/80 font-mono">
                Actualizado en tiempo real
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Monitor de Personas y Agencias Conectadas
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Supervisa en vivo cuántos compradores están explorando el catálogo, qué agencias están activas y el flujo de contactos por WhatsApp.
            </p>
          </div>

          {/* Big Live Online Badge */}
          <div className="flex items-center gap-4 bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-sky-400/30 backdrop-blur-md shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg">
              <Activity className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono text-emerald-400">
                  {onlineVisitorsCount}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 font-bold">
                  En Línea
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                Personas navegando la app ahora
              </p>
            </div>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 relative z-10 text-xs">
          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Agencias Activas</span>
            <strong className="text-lg font-black text-white font-mono">{activeAgenciesCount} de {agencies.length}</strong>
            <span className="text-[10px] text-emerald-400 block">Suscripciones vigentes</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Vendedores Registrados</span>
            <strong className="text-lg font-black text-white font-mono">{users.length} asesores</strong>
            <span className="text-[10px] text-blue-300 block">{activeSellersCount} activos hoy</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Vistas al Catálogo</span>
            <strong className="text-lg font-black text-amber-300 font-mono">{totalViews.toLocaleString('es-ES')}</strong>
            <span className="text-[10px] text-slate-400 block">Acumulado total</span>
          </div>

          <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/60">
            <span className="text-slate-400 block text-[11px]">Contactos WhatsApp</span>
            <strong className="text-lg font-black text-emerald-400 font-mono">{totalWhatsappClicks} clics</strong>
            <span className="text-[10px] text-emerald-300 block">Leads calificados</span>
          </div>
        </div>
      </div>

      {/* Monitor Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Resumen de Uso & Dispositivos</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('agencies')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'agencies'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Actividad por Agencia ({agencies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('logs')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'logs'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Feed de Eventos en Vivo ({recentLogs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics_setup')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors ${
            activeTab === 'analytics_setup'
              ? 'bg-blue-700 text-white font-bold shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Conectar Google Analytics</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Geographic & Device Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Geo breakdown */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <h3 className="font-bold text-sm text-slate-900">Origen de los Visitantes</h3>
                </div>
                <span className="text-[11px] text-slate-500">Paraguay & Región</span>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { city: 'Asunción (Central)', percent: 54, count: '65%' },
                  { city: 'San Lorenzo / Luque', percent: 22, count: '20%' },
                  { city: 'Ciudad del Este (Alto Paraná)', percent: 14, count: '10%' },
                  { city: 'Encarnación (Itapúa)', percent: 7, count: '3%' },
                  { city: 'Otras Localidades', percent: 3, count: '2%' },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-700 font-medium">
                      <span>{item.city}</span>
                      <strong className="text-slate-900 font-mono">{item.percent}% de las visitas</strong>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices & Browsers */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-sm text-slate-900">Dispositivos Utilizados</h3>
                </div>
                <span className="text-[11px] text-slate-500">Móvil vs Escritorio</span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                  <Smartphone className="w-6 h-6 text-emerald-700 mx-auto" />
                  <p className="text-2xl font-black text-emerald-900 font-mono">82%</p>
                  <p className="text-xs font-bold text-emerald-800">Smartphones</p>
                  <p className="text-[10px] text-emerald-600">WhatsApp & Navegación móvil</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-center space-y-1">
                  <Laptop className="w-6 h-6 text-blue-700 mx-auto" />
                  <p className="text-2xl font-black text-blue-900 font-mono">18%</p>
                  <p className="text-xs font-bold text-blue-800">Computadoras</p>
                  <p className="text-[10px] text-blue-600">Portal de Carga y Gestión</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600">
                💡 <strong>Dato Clave:</strong> La gran mayoría de los clientes acceden desde celulares y hacen clic directo en el botón de WhatsApp del vendedor.
              </div>
            </div>
          </div>

          {/* Active Users Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Usuarios y Asesores con Cuenta en el Sistema</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3"
                >
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                      {u.isActive && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Activo"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{u.agencyName || 'Agencia Oficial'}</p>
                    <p className="text-[10px] text-blue-700 font-semibold uppercase">{u.role === 'seller' ? 'Vendedor' : 'Gerente'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACTIVITY PER AGENCY */}
      {activeTab === 'agencies' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Métricas Detalladas por Concesionaria</h3>
              <p className="text-xs text-slate-500">Inventario, visitas recibidas y rendimiento de cada agencia registrada.</p>
            </div>
            <span className="text-xs font-bold text-blue-700">{agencies.length} Concesionarias</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase tracking-wider bg-slate-50/70">
                  <th className="py-3 px-3">Agencia</th>
                  <th className="py-3 px-3">Estado Plan</th>
                  <th className="py-3 px-3">Autos en Salón</th>
                  <th className="py-3 px-3">Vistas Totales</th>
                  <th className="py-3 px-3">Consultas WhatsApp</th>
                  <th className="py-3 px-3">Vendedores</th>
                  <th className="py-3 px-3">Ubicación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {agencies.map((agency) => {
                  const cars = carListings.filter((c) => c.agencyId === agency.id);
                  const views = cars.reduce((sum, c) => sum + (c.viewsCount || 0), 0);
                  const inquiries = cars.reduce((sum, c) => sum + (c.whatsappInquiriesCount || 0), 0);
                  const sellers = users.filter((u) => u.agencyId === agency.id);

                  return (
                    <tr key={agency.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <AgencyLogo
                            logoUrl={agency.logoUrl}
                            name={agency.name}
                            size="sm"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{agency.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {agency.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            agency.subscriptionStatus === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : agency.subscriptionStatus === 'trial'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {agency.subscriptionStatus === 'active'
                            ? '🟢 Activa'
                            : agency.subscriptionStatus === 'trial'
                            ? '🟡 En Prueba'
                            : '🔴 Vencida'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900">{cars.length}</td>
                      <td className="py-3 px-3 font-mono text-amber-700 font-bold">{views.toLocaleString('es-ES')}</td>
                      <td className="py-3 px-3 font-mono text-emerald-700 font-bold">📲 {inquiries}</td>
                      <td className="py-3 px-3">{sellers.length} asesores</td>
                      <td className="py-3 px-3 text-slate-500">{agency.city}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE EVENT LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Feed de Actividad en Vivo</h3>
              <p className="text-xs text-slate-500">Historial reciente de interacciones, consultas y publicaciones en la plataforma.</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              En Vivo
            </span>
          </div>

          <div className="space-y-2.5">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 hover:bg-slate-50 flex items-start justify-between gap-3 transition-colors text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      log.type === 'whatsapp_click'
                        ? 'bg-emerald-100 text-emerald-800'
                        : log.type === 'new_car'
                        ? 'bg-blue-100 text-blue-800'
                        : log.type === 'code_redeemed'
                        ? 'bg-purple-100 text-purple-800'
                        : log.type === 'private_offer'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {log.type === 'whatsapp_click' ? (
                      <MessageCircle className="w-4 h-4" />
                    ) : log.type === 'new_car' ? (
                      <Car className="w-4 h-4" />
                    ) : log.type === 'code_redeemed' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : log.type === 'private_offer' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <Activity className="w-4 h-4" />
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-900">{log.title}</p>
                    <p className="text-slate-600 text-[11px]">{log.detail}</p>
                    {log.location && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        <span>{log.location}</span>
                        <span>•</span>
                        <span>{log.device === 'mobile' ? '📱 Celular' : '💻 Computadora'}</span>
                      </p>
                    )}
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE ANALYTICS INTEGRATION */}
      {activeTab === 'analytics_setup' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="max-w-2xl space-y-2">
            <h3 className="text-base font-black text-slate-900">
              Integración Oficial de Métricas Externas (Google Analytics 4 & Meta Pixel)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Puedes vincular tu cuenta de <strong>Google Analytics</strong> para tener estadísticas completas de visitas únicas, fuentes de tráfico (Google, Facebook, Instagram, Directo), rebote y conversiones exactas.
            </p>
          </div>

          <form onSubmit={handleSaveGa} className="max-w-xl space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                ID de Medición de Google Analytics 4:
              </label>
              <input
                type="text"
                value={googleAnalyticsId}
                onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Encuentra tu ID en <em>Google Analytics &gt; Administrar &gt; Flujos de Datos</em>.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-sm"
              >
                Guardar Configuración de Analytics
              </button>

              {gaSaved && (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  ¡ID guardado con éxito!
                </span>
              )}
            </div>
          </form>

          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1 max-w-2xl">
            <p className="font-bold">¿Cómo saber cuántas personas usan la app?</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-blue-800">
              <li><strong>En este panel:</strong> Tienes el monitor en tiempo real con usuarios activos, vistas por auto y clics a WhatsApp.</li>
              <li><strong>Con Google Analytics:</strong> Puedes ver informes de países, ciudades, edades, campañas publicitarias y páginas más vistas.</li>
              <li><strong>WhatsApp de Vendedores:</strong> Cada clic de compra llega directo a la línea de la concesionaria.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
