import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Agency, CarListing, PredefinedWhatsappMessage } from '../types';
import {
  MessageCircle,
  Smartphone,
  Sparkles,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  RefreshCw,
  Zap,
  Car,
  CheckCircle2,
  CreditCard,
  Building2,
  Tag,
  Calendar,
  Layers,
  Info,
} from 'lucide-react';

interface AgencyWhatsAppSettingsProps {
  agency: Agency;
  agencyCars: CarListing[];
}

const DEFAULT_PRESETS = [
  {
    name: 'Estándar Comercial',
    text: '¡Hola {agencia}! 👋 Vi en MiCarro su publicación del *{auto} {año}* ({precio}) con código *#{codigo}*. ¿Sigue disponible para coordinar una visita y conocer facilidades de pago o permuta?',
  },
  {
    name: 'Financiación & Cuotas',
    text: '¡Hola equipo de {agencia}! 🚗 Me interesa el *{auto} {año}* (Cód: #{codigo}). Quisiera consultar por el plan de financiación, entrega inicial mínima y opciones en cuotas fijas.',
  },
  {
    name: 'Toma de Usado / Permuta',
    text: '¡Hola {agencia}! 🚘 Vi publicado el *{auto} {año}* ({precio}, Cód: #{codigo}). Tengo un vehículo usado para entregar en parte de pago, ¿podríamos coordinar una tasación preliminar?',
  },
  {
    name: 'Agendar Test Drive',
    text: '¡Hola {agencia}! 🏎️ Quisiera consultar por el *{auto} {año}* (Cód: #{codigo}) y solicitar un turno para Test Drive / visita en el salón de ventas.',
  },
  {
    name: 'Atención Inmediata con Ficha',
    text: '¡Hola {agencia}{vendedor}! 👋 Quisiera recibir más información técnica, fotos adicionales y disponibilidad del *{auto} {año}* ({precio}, Cód: #{codigo}).',
  },
];

const AVAILABLE_VARIABLES = [
  { tag: '{agencia}', label: 'Nombre Agencia', sample: 'Agencia Demo' },
  { tag: '{auto}', label: 'Marca y Modelo', sample: 'Toyota Hilux' },
  { tag: '{version}', label: 'Versión', sample: '2.8 TDI SRX 4x4' },
  { tag: '{año}', label: 'Año', sample: '2023' },
  { tag: '{precio}', label: 'Precio', sample: 'USD 39.800' },
  { tag: '{codigo}', label: 'Código #', sample: 'car-1' },
  { tag: '{km}', label: 'Kilometraje', sample: '28.500 km' },
  { tag: '{vendedor}', label: 'Asesor', sample: ' (Atención: Asesor Comercial)' },
  { tag: '{link}', label: 'Link de la publicación', sample: 'https://micarro.app/?car=car-1' },
];

export const AgencyWhatsAppSettings: React.FC<AgencyWhatsAppSettingsProps> = ({
  agency,
  agencyCars,
}) => {
  const { updateAgency, formatWhatsappTemplate } = useApp();

  // Form states
  const [whatsappBusinessNumber, setWhatsappBusinessNumber] = useState(
    agency.whatsappBusinessNumber || agency.whatsappNumber || ''
  );
  const [carInquiryTemplate, setCarInquiryTemplate] = useState(
    agency.whatsappCarInquiryTemplate ||
      '¡Hola {agencia}! 👋 Vi en MiCarro su publicación del *{auto} {año}* ({precio}) con código *#{codigo}*. ¿Sigue disponible para coordinar una visita y conocer facilidades de pago o permuta?'
  );
  const [financingTemplate, setFinancingTemplate] = useState(
    agency.whatsappFinancingTemplate ||
      '¡Hola equipo de {agencia}! 🚗 Me interesa el *{auto} {año}* (Cód: #{codigo}). Quisiera consultar por el plan de financiación, entrega inicial mínima y opciones en cuotas fijas.'
  );
  const [tradeInTemplate, setTradeInTemplate] = useState(
    agency.whatsappTradeInTemplate ||
      '¡Hola {agencia}! 🚘 Vi publicado el *{auto} {año}* ({precio}, Cód: #{codigo}). Tengo un vehículo usado para entregar en parte de pago, ¿podríamos coordinar una tasación preliminar?'
  );
  const [testDriveTemplate, setTestDriveTemplate] = useState(
    agency.whatsappTestDriveTemplate ||
      '¡Hola {agencia}! 🏎️ Quisiera consultar por el *{auto} {año}* (Cód: #{codigo}) y solicitar un turno para Test Drive / visita en el salón de ventas.'
  );
  const [predefinedMessages, setPredefinedMessages] = useState<PredefinedWhatsappMessage[]>(
    agency.whatsappPredefinedMessages || [
      {
        id: 'msg-1',
        title: 'Consulta General Ficha de Auto',
        category: 'car_inquiry',
        text: '¡Hola {agencia}! 👋 Vi en MiCarro su publicación del *{auto} {año}* ({precio}) con código *#{codigo}*. ¿Sigue disponible para coordinar una visita y conocer facilidades de pago o permuta?',
        isDefault: true,
      },
      {
        id: 'msg-2',
        title: 'Plan de Financiación y Cuotas',
        category: 'financing',
        text: '¡Hola equipo de {agencia}! 🚗 Me interesa el *{auto} {año}* (Cód: #{codigo}). Quisiera consultar por el plan de financiación, entrega inicial mínima y opciones en cuotas fijas.',
      },
      {
        id: 'msg-3',
        title: 'Toma de Usado / Permuta',
        category: 'trade_in',
        text: '¡Hola {agencia}! 🚘 Vi publicado el *{auto} {año}* ({precio}, Cód: #{codigo}). Tengo un vehículo usado para entregar en parte de pago, ¿podríamos coordinar una tasación preliminar?',
      },
      {
        id: 'msg-4',
        title: 'Agendamiento de Test Drive',
        category: 'test_drive',
        text: '¡Hola {agencia}! 🏎️ Quisiera consultar por el *{auto} {año}* (Cód: #{codigo}) y solicitar un turno para Test Drive / visita en el salón de ventas.',
      },
      {
        id: 'msg-5',
        title: 'Reserva & Datos de Transferencia Bancaria',
        category: 'reservation',
        text: '¡Hola! 💳 Para avanzar con la reserva formal del *{auto} {año}* (Cód: #{codigo}), te enviamos los datos bancarios oficiales de la concesionaria. Una vez realizada la seña te emitimos el recibo proforma con validez de bloqueo.',
      },
    ]
  );

  // UI Tabs inside WhatsApp Settings
  const [activeSettingsSection, setActiveSettingsSection] = useState<
    'inquiry' | 'financing' | 'tradein' | 'testdrive' | 'quickreplies'
  >('inquiry');

  // Preview Simulator state
  const [previewCarIndex, setPreviewCarIndex] = useState(0);
  const selectedPreviewCar = agencyCars[previewCarIndex] || {
    id: 'car-demo-1',
    agencyId: agency.id,
    agencyName: agency.name,
    agencyWhatsapp: whatsappBusinessNumber || '5491148905500',
    agencyCity: agency.city || 'Buenos Aires',
    title: 'Toyota Hilux 2.8 TDI SRX 4x4 AT 2023',
    make: 'Toyota',
    model: 'Hilux',
    version: '2.8 TDI SRX 4x4 AT',
    year: 2023,
    mileage: 28500,
    price: 39800,
    currency: 'USD',
    condition: 'Certificado',
    transmission: 'Automática',
    fuelType: 'Diésel',
    bodyType: 'Pickup',
    color: 'Gris Plata',
    doors: 4,
    status: 'available',
    photos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1000&auto=format&fit=crop&q=80'],
    features: ['4x4', 'Cuero', 'Cámara 360'],
    acceptsTradeIn: true,
    financingAvailable: true,
    viewsCount: 142,
    whatsappInquiriesCount: 18,
    createdAt: new Date().toISOString(),
  } as CarListing;

  // New Custom Quick Reply Modal
  const [isAddingQuickReply, setIsAddingQuickReply] = useState(false);
  const [newReplyTitle, setNewReplyTitle] = useState('');
  const [newReplyCategory, setNewReplyCategory] = useState<
    'car_inquiry' | 'financing' | 'trade_in' | 'test_drive' | 'general' | 'reservation'
  >('general');
  const [newReplyText, setNewReplyText] = useState('');

  // Copy Feedback state
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync with agency props when agency changes
  useEffect(() => {
    setWhatsappBusinessNumber(agency.whatsappBusinessNumber || agency.whatsappNumber || '');
    if (agency.whatsappCarInquiryTemplate) {
      setCarInquiryTemplate(agency.whatsappCarInquiryTemplate);
    }
    if (agency.whatsappFinancingTemplate) {
      setFinancingTemplate(agency.whatsappFinancingTemplate);
    }
    if (agency.whatsappTradeInTemplate) {
      setTradeInTemplate(agency.whatsappTradeInTemplate);
    }
    if (agency.whatsappTestDriveTemplate) {
      setTestDriveTemplate(agency.whatsappTestDriveTemplate);
    }
    if (agency.whatsappPredefinedMessages && agency.whatsappPredefinedMessages.length > 0) {
      setPredefinedMessages(agency.whatsappPredefinedMessages);
    }
  }, [agency.id, agency.whatsappBusinessNumber, agency.whatsappNumber]);

  // Insert tag into active template
  const handleInsertTag = (tag: string) => {
    if (activeSettingsSection === 'inquiry') {
      setCarInquiryTemplate((prev) => `${prev} ${tag}`);
    } else if (activeSettingsSection === 'financing') {
      setFinancingTemplate((prev) => `${prev} ${tag}`);
    } else if (activeSettingsSection === 'tradein') {
      setTradeInTemplate((prev) => `${prev} ${tag}`);
    } else if (activeSettingsSection === 'testdrive') {
      setTestDriveTemplate((prev) => `${prev} ${tag}`);
    }
  };

  // Get active template string
  const getActiveTemplateText = () => {
    switch (activeSettingsSection) {
      case 'inquiry':
        return carInquiryTemplate;
      case 'financing':
        return financingTemplate;
      case 'tradein':
        return tradeInTemplate;
      case 'testdrive':
        return testDriveTemplate;
      default:
        return carInquiryTemplate;
    }
  };

  // Formatted preview text
  const renderedPreviewText = formatWhatsappTemplate(
    getActiveTemplateText(),
    selectedPreviewCar
  );

  // Copy to clipboard
  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Test Open in WhatsApp
  const handleTestOpenWhatsapp = (textToTest?: string) => {
    const cleanPhone = (whatsappBusinessNumber || agency.whatsappNumber || '5491148905500').replace(/[^0-9]/g, '');
    const message = textToTest || renderedPreviewText;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  // Add custom quick reply
  const handleAddQuickReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyTitle.trim() || !newReplyText.trim()) return;

    const newMsg: PredefinedWhatsappMessage = {
      id: `msg-${Date.now()}`,
      title: newReplyTitle.trim(),
      category: newReplyCategory,
      text: newReplyText.trim(),
      isDefault: false,
    };

    setPredefinedMessages((prev) => [...prev, newMsg]);
    setNewReplyTitle('');
    setNewReplyText('');
    setIsAddingQuickReply(false);
  };

  // Delete quick reply
  const handleDeleteQuickReply = (id: string) => {
    setPredefinedMessages((prev) => prev.filter((m) => m.id !== id));
  };

  // Save changes to agency
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const cleanNumber = whatsappBusinessNumber.trim().replace(/[^0-9]/g, '');

    updateAgency(agency.id, {
      whatsappBusinessNumber: cleanNumber,
      whatsappNumber: cleanNumber || agency.whatsappNumber,
      whatsappCarInquiryTemplate: carInquiryTemplate.trim(),
      whatsappFinancingTemplate: financingTemplate.trim(),
      whatsappTradeInTemplate: tradeInTemplate.trim(),
      whatsappTestDriveTemplate: testDriveTemplate.trim(),
      whatsappPredefinedMessages: predefinedMessages,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
                <MessageCircle className="w-6 h-6 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    WhatsApp Business & Mensajes Predefinidos
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-400/20 text-emerald-300 font-bold border border-emerald-400/30 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-400" />
                    Canal Comercial Oficial
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Vincula el número exclusivo de tu concesionaria y personaliza las respuestas automáticas para consultas de autos, financiación y permutas.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleTestOpenWhatsapp()}
              className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-400/40 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Abrir chat de prueba con el número configurado"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Probar Enlace de WhatsApp</span>
            </button>

            <button
              onClick={() => handleSaveAll()}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccess && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>¡Configuración de WhatsApp Business y plantillas guardada exitosamente! Ya está activa en todo el catálogo público.</span>
            </div>
            <button
              onClick={() => setSaveSuccess(false)}
              className="text-emerald-300 hover:text-white font-bold text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Number Linking & Template Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: WhatsApp Business Number Linking */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Número de WhatsApp Business Conectado
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-600" />
                Canal Oficial Verificado
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Número de WhatsApp Business (con código de país) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-mono text-xs font-bold">
                    📲 +
                  </div>
                  <input
                    type="text"
                    required
                    value={whatsappBusinessNumber}
                    onChange={(e) => setWhatsappBusinessNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="5491148905500 o 595975635770"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-900 font-mono font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Introduce sólo números (Ej: <strong>5491148905500</strong> en Arg, <strong>595975635770</strong> en Py).</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    wa.me/{whatsappBusinessNumber.replace(/[^0-9]/g, '') || '5491148905500'}
                  </span>
                </div>
              </div>

              {/* Tips Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5 text-xs text-emerald-950">
                <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong>Recomendación:</strong> Utiliza una cuenta registrada en la aplicación oficial <em>WhatsApp Business</em> para habilitar mensajes de bienvenida automáticos, horarios de atención y catálogo de productos sincronizado.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Predefined Templates Editor */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Editor de Mensajes Predefinidos por Tipo de Consulta
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define el texto inicial que se cargará cuando los compradores hagan clic en WhatsApp.
                  </p>
                </div>
              </div>
            </div>

            {/* Template Selector Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveSettingsSection('inquiry')}
                className={`flex-1 min-w-[120px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeSettingsSection === 'inquiry'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>1. Ficha de Auto (Principal)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsSection('financing')}
                className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeSettingsSection === 'financing'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>2. Financiación</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsSection('tradein')}
                className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeSettingsSection === 'tradein'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>3. Usado / Permuta</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSettingsSection('testdrive')}
                className={`flex-1 min-w-[110px] py-2 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeSettingsSection === 'testdrive'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>4. Test Drive</span>
              </button>
            </div>

            {/* Quick Presets Picker */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Plantillas y estilos rápidos sugeridos:</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DEFAULT_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      if (activeSettingsSection === 'inquiry') setCarInquiryTemplate(preset.text);
                      else if (activeSettingsSection === 'financing') setFinancingTemplate(preset.text);
                      else if (activeSettingsSection === 'tradein') setTradeInTemplate(preset.text);
                      else if (activeSettingsSection === 'testdrive') setTestDriveTemplate(preset.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    ✨ {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Template Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Cuerpo del Mensaje (con formato de negritas *texto*):
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {getActiveTemplateText().length} caracteres
                </span>
              </div>

              {activeSettingsSection === 'inquiry' && (
                <textarea
                  rows={4}
                  value={carInquiryTemplate}
                  onChange={(e) => setCarInquiryTemplate(e.target.value)}
                  placeholder="Escribe la plantilla del mensaje de consulta..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              )}

              {activeSettingsSection === 'financing' && (
                <textarea
                  rows={4}
                  value={financingTemplate}
                  onChange={(e) => setFinancingTemplate(e.target.value)}
                  placeholder="Escribe la plantilla para consultas de financiación..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              )}

              {activeSettingsSection === 'tradein' && (
                <textarea
                  rows={4}
                  value={tradeInTemplate}
                  onChange={(e) => setTradeInTemplate(e.target.value)}
                  placeholder="Escribe la plantilla para consultas de permuta / toma de usados..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              )}

              {activeSettingsSection === 'testdrive' && (
                <textarea
                  rows={4}
                  value={testDriveTemplate}
                  onChange={(e) => setTestDriveTemplate(e.target.value)}
                  placeholder="Escribe la plantilla para solicitud de test drives..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-emerald-600 focus:bg-white leading-relaxed"
                />
              )}
            </div>

            {/* Smart Dynamic Variables Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>Insertar Etiquetas Dinámicas con 1 clic:</span>
                </span>
                <span className="text-[10px] text-slate-400">Se reemplazan automáticamente con los datos de cada auto</span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {AVAILABLE_VARIABLES.map((v) => (
                  <button
                    key={v.tag}
                    type="button"
                    onClick={() => handleInsertTag(v.tag)}
                    className="px-2 py-1 rounded-lg bg-white hover:bg-blue-50 text-blue-700 font-mono text-[11px] font-bold border border-blue-200 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                    title={`Insertar ${v.tag} (${v.label})`}
                  >
                    <Plus className="w-3 h-3 text-blue-500" />
                    <span>{v.tag}</span>
                    <span className="text-[9px] text-slate-400 font-sans font-normal">({v.label})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 3: Library of Predefined Quick Replies */}
          <div className="p-5 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Biblioteca de Respuestas Rápidas (Quick Replies)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Mensajes predefinidos para que tu equipo comercial copie y responda al instante en WhatsApp Web.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingQuickReply(true)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nuevo Mensaje</span>
              </button>
            </div>

            {/* Quick Replies List */}
            <div className="space-y-2.5">
              {predefinedMessages.map((msg) => {
                const rendered = formatWhatsappTemplate(msg.text, selectedPreviewCar);
                const isCopied = copiedId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{msg.title}</span>
                        <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-600 uppercase">
                          {msg.category}
                        </span>
                        {msg.isDefault && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700">
                            Predeterminado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyText(rendered, msg.id)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                          title="Copiar texto con datos de auto para pegar en WhatsApp"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">¡Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleTestOpenWhatsapp(rendered)}
                          className="p-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                          title="Enviar por WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        </button>

                        {!msg.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDeleteQuickReply(msg.id)}
                            className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Eliminar mensaje predefinido"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 italic font-mono bg-white p-2 rounded-xl border border-slate-100">
                      "{msg.text}"
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive WhatsApp Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-5 sm:p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-xl space-y-4 sticky top-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Simulador WhatsApp en Vivo</span>
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Vista Previa Real</span>
            </div>

            {/* Test Car Selector */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Seleccionar Vehículo de Prueba del Salón:
              </label>
              <select
                value={previewCarIndex}
                onChange={(e) => setPreviewCarIndex(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                {agencyCars.map((car, idx) => (
                  <option key={car.id} value={idx}>
                    {car.make} {car.model} {car.year} - {car.currency} {car.price.toLocaleString('es-ES')} (#{car.id})
                  </option>
                ))}
                {agencyCars.length === 0 && (
                  <option value={0}>Toyota Hilux 2.8 TDI SRX 4x4 2023 (Ejemplo)</option>
                )}
              </select>
            </div>

            {/* Phone Screen Mockup */}
            <div className="rounded-3xl bg-[#0b141a] border-4 border-slate-800 overflow-hidden shadow-2xl flex flex-col">
              {/* WhatsApp Header Bar */}
              <div className="bg-[#202c33] px-3.5 py-2.5 flex items-center justify-between text-white border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-700/80 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4 text-emerald-200" />
                  </div>
                  <div>
                    <div className="font-bold text-xs truncate max-w-[170px]">
                      {agency.name}
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                      +{whatsappBusinessNumber || '5491148905500'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-900/60 text-emerald-300 text-[10px] font-bold border border-emerald-700/50">
                    Business
                  </span>
                </div>
              </div>

              {/* Chat Canvas Area */}
              <div className="p-4 space-y-3 min-h-[260px] max-h-[360px] overflow-y-auto bg-[#0b141a] bg-opacity-95 flex flex-col justify-end">
                {/* Date Bubble */}
                <div className="flex justify-center">
                  <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 font-medium shadow-xs">
                    HOY • CANAL DE CONSULTAS
                  </span>
                </div>

                {/* Simulated Outgoing Customer Bubble */}
                <div className="self-end max-w-[92%] bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tr-xs p-3.5 shadow-md space-y-2 text-xs">
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {renderedPreviewText}
                  </p>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] font-mono">
                    <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="text-[#53bdeb] font-black">✓✓</span>
                  </div>
                </div>
              </div>

              {/* Simulated WhatsApp Input Bar */}
              <div className="bg-[#202c33] p-2.5 flex items-center gap-2 border-t border-slate-800">
                <div className="flex-1 bg-[#2a3942] rounded-full px-3.5 py-1.5 text-[11px] text-slate-400 truncate">
                  Mensaje listo para enviar...
                </div>
                <button
                  type="button"
                  onClick={() => handleTestOpenWhatsapp()}
                  className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition-transform active:scale-90"
                  title="Abrir en WhatsApp Real"
                >
                  <MessageCircle className="w-4 h-4 fill-slate-950" />
                </button>
              </div>
            </div>

            {/* Action Buttons Under Phone */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => handleTestOpenWhatsapp()}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-transform active:scale-98 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir Mensaje de Prueba en WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleCopyText(renderedPreviewText, 'preview-box')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                {copiedId === 'preview-box' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">¡Texto Copiado al Portapapeles!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Texto Renderizado</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Create Custom Quick Reply */}
      {isAddingQuickReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-700" />
                <h3 className="text-base font-black text-slate-900">
                  Crear Nuevo Mensaje Predefinido
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddingQuickReply(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddQuickReply} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Título identificador del mensaje *
                </label>
                <input
                  type="text"
                  required
                  value={newReplyTitle}
                  onChange={(e) => setNewReplyTitle(e.target.value)}
                  placeholder="Ej: Requisitos de Crédito Bancario"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Categoría del Mensaje
                </label>
                <select
                  value={newReplyCategory}
                  onChange={(e) => setNewReplyCategory(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                >
                  <option value="car_inquiry">Ficha de Auto</option>
                  <option value="financing">Financiación</option>
                  <option value="trade_in">Permuta / Usados</option>
                  <option value="test_drive">Test Drive</option>
                  <option value="reservation">Reserva & Seña</option>
                  <option value="general">Atención General</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Texto del Mensaje (puedes usar {'{agencia}'}, {'{auto}'}, {'{precio}'}, {'{codigo}'}, {'{km}'}) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newReplyText}
                  onChange={(e) => setNewReplyText(e.target.value)}
                  placeholder="Ej: ¡Hola! Te informamos los requisitos para el crédito: Cédula de identidad, comprobante de ingresos y factura de servicios..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingQuickReply(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-transform active:scale-95"
                >
                  Guardar Mensaje Predefinido
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
