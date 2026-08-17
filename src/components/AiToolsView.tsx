import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Car,
  Copy,
  Check,
  Share2,
  DollarSign,
  TrendingUp,
  MessageCircle,
  FileText,
  Send,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const AiToolsView: React.FC = () => {
  const { carListings, currentAgency, formatPrice } = useApp();

  const [activeTab, setActiveTab] = useState<'copy-generator' | 'valuation' | 'sales-reply'>('copy-generator');

  // Copy Generator State
  const [selectedCarId, setSelectedCarId] = useState<string>(carListings[0]?.id || '');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<{
    webDescription?: string;
    socialMediaCaption?: string;
    highlights?: string[];
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Valuation State
  const [valMake, setValMake] = useState('Toyota');
  const [valModel, setValModel] = useState('Corolla');
  const [valYear, setValYear] = useState<number>(2022);
  const [valKm, setValKm] = useState<number>(42000);
  const [valCondition, setValCondition] = useState('Excelente estado, services oficiales');
  const [isValuating, setIsValuating] = useState(false);
  const [valuationResult, setValuationResult] = useState<any>(null);

  // Sales Reply State
  const [clientQuestion, setClientQuestion] = useState(
    'Hola! ¿Tienen financiación bancaria para la Hilux y cuánto me tomarían una Ranger 2019 en parte de pago?'
  );
  const [replyCarId, setReplyCarId] = useState<string>(carListings[0]?.id || '');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [suggestedReply, setSuggestedReply] = useState<string>('');

  const selectedCar = carListings.find((c) => c.id === selectedCarId) || carListings[0];
  const replyCar = carListings.find((c) => c.id === replyCarId) || carListings[0];

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Generate Copy
  const handleGenerateCopy = async () => {
    if (!selectedCar) return;
    setIsGeneratingCopy(true);
    try {
      const res = await fetch('/api/gemini/generate-car-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car: {
            ...selectedCar,
            agencyName: currentAgency?.name,
          },
        }),
      });
      const data = await res.json();
      setGeneratedCopy(data);
    } catch (err) {
      console.error(err);
      setGeneratedCopy({
        webDescription: `🚗 ${selectedCar.title} (${selectedCar.year})\n\n✨ Kilometraje: ${selectedCar.mileage.toLocaleString('es-ES')} km\n✨ Transmisión: ${selectedCar.transmission}\n\n🛡️ Garantía mecánica de agencia y peritaje oficial.\n🏦 Financiación a sola firma y tomamos tu usado en parte de pago.`,
        socialMediaCaption: `🔥 DISPONIBLE EN STOCK 🔥\n${selectedCar.title}\n\n💰 Precio: ${selectedCar.currency} ${selectedCar.price.toLocaleString('es-ES')}\n📲 ¡Escríbenos por WhatsApp para coordinar tu prueba de manejo!`,
        highlights: ['Documentación al día', 'Acepta permuta', 'Financiación disponible'],
      });
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // 2. Market Valuation
  const handleRunValuation = async () => {
    setIsValuating(true);
    try {
      const res = await fetch('/api/gemini/price-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make: valMake,
          model: valModel,
          year: valYear,
          mileage: valKm,
          condition: valCondition,
          currency: 'USD',
        }),
      });
      const data = await res.json();
      setValuationResult(data);
    } catch (err) {
      console.error(err);
      setValuationResult({
        estimatedDealerPrice: 24500,
        estimatedPrivatePrice: 26000,
        quickSaleTradeInPrice: 21500,
        currency: 'USD',
        marketDemand: 'Alta',
        depreciationTrend: 'Excelente retención de valor en plaza.',
        valuationTips: ['Verificar historial de services para justificar precio superior.'],
      });
    } finally {
      setIsValuating(false);
    }
  };

  // 3. Sales WhatsApp Assistant
  const handleGenerateSalesReply = async () => {
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/gemini/sales-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientQuestion,
          car: replyCar,
          agencyName: currentAgency?.name,
        }),
      });
      const data = await res.json();
      setSuggestedReply(data.suggestedReply || '');
    } catch (err) {
      console.error(err);
      setSuggestedReply(
        `¡Hola! 👋 Gracias por contactarnos en ${currentAgency?.name || 'nuestra agencia'}.\n\nEl ${replyCar.title} está disponible en nuestro showroom. Tomamos tu vehículo usado en parte de pago y contamos con planes de financiación hasta en 36 cuotas.\n\n¿Te gustaría que coordinemos una visita para que lo pruebes y evaluemos tu usado?`
      );
    } finally {
      setIsGeneratingReply(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Suite de Inteligencia Artificial para Concesionarias</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Herramientas Inteligentes de Venta Automotriz
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Aumenta tus ventas con descripciones optimizadas para redes y WhatsApp, tasaciones instantáneas de mercado y respuestas de alta conversión para tus vendedores.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs sm:text-sm font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('copy-generator')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-colors shrink-0 ${
            activeTab === 'copy-generator'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Generador de Copys & Publicaciones</span>
        </button>

        <button
          onClick={() => setActiveTab('valuation')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-colors shrink-0 ${
            activeTab === 'valuation'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Tasador de Mercado Automotriz</span>
        </button>

        <button
          onClick={() => setActiveTab('sales-reply')}
          className={`py-3.5 px-5 flex items-center gap-2 border-b-2 transition-colors shrink-0 ${
            activeTab === 'sales-reply'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>Asistente de Respuestas WhatsApp</span>
        </button>
      </div>

      {/* TAB 1: COPY GENERATOR */}
      {activeTab === 'copy-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in-50">
          {/* Left Column: Car Selection */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-amber-400" />
              <span>Selecciona un Vehículo del Inventario</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Auto a Publicar:</label>
              <select
                value={selectedCarId}
                onChange={(e) => setSelectedCarId(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-700 text-xs font-bold focus:outline-none focus:border-amber-500"
              >
                {carListings.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.year} - {c.currency} {c.price.toLocaleString('es-ES')})
                  </option>
                ))}
              </select>
            </div>

            {selectedCar && (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="h-32 rounded-xl overflow-hidden bg-slate-900">
                  <img
                    src={selectedCar.photos[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-xs space-y-1 text-slate-300">
                  <p className="font-bold text-white text-sm">{selectedCar.title}</p>
                  <p>{selectedCar.mileage.toLocaleString('es-ES')} km • {selectedCar.transmission} • {selectedCar.fuelType}</p>
                  <p className="font-mono text-amber-400 font-bold">{formatPrice(selectedCar.price, selectedCar.currency)}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleGenerateCopy}
              disabled={isGeneratingCopy}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingCopy ? 'Redactando con IA...' : '✨ Generar Textos de Venta con IA'}</span>
            </button>
          </div>

          {/* Right Column: Generated Copies */}
          <div className="lg:col-span-7 space-y-4">
            {generatedCopy ? (
              <div className="space-y-4">
                {/* Web & Marketplace Copy */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-amber-400 uppercase tracking-wider">
                      Ficha Web & MercadoLibre / Clasificados
                    </h4>
                    <button
                      onClick={() => handleCopyText(generatedCopy.webDescription || '', 'web')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      {copiedKey === 'web' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'web' ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {generatedCopy.webDescription}
                  </div>
                </div>

                {/* Social Media & WhatsApp Status Caption */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider">
                      Instagram / Facebook / Estados de WhatsApp
                    </h4>
                    <button
                      onClick={() => handleCopyText(generatedCopy.socialMediaCaption || '', 'social')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                    >
                      {copiedKey === 'social' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedKey === 'social' ? '¡Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {generatedCopy.socialMediaCaption}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-xl">
                <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Genera copys de alta conversión</h3>
                <p className="text-xs max-w-md mx-auto">
                  Selecciona un auto a la izquierda y presiona "Generar Textos de Venta con IA" para redactar publicaciones profesionales listas para compartir en un clic.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MARKET VALUATION */}
      {activeTab === 'valuation' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in-50">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Datos para Peritaje y Tasación</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Marca</label>
                <input
                  type="text"
                  value={valMake}
                  onChange={(e) => setValMake(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Modelo</label>
                <input
                  type="text"
                  value={valModel}
                  onChange={(e) => setValModel(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Año</label>
                <input
                  type="number"
                  value={valYear}
                  onChange={(e) => setValYear(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white font-mono rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Kilometraje</label>
                <input
                  type="number"
                  value={valKm}
                  onChange={(e) => setValKm(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white font-mono rounded-xl p-2.5 border border-slate-700"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Estado y Observaciones</label>
                <input
                  type="text"
                  value={valCondition}
                  onChange={(e) => setValCondition(e.target.value)}
                  className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700"
                />
              </div>
            </div>

            <button
              onClick={handleRunValuation}
              disabled={isValuating}
              className="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{isValuating ? 'Calculando Tasación...' : 'Estimar Valor de Mercado'}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {valuationResult ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-xs text-amber-400 font-bold uppercase">Informe de Tasación</span>
                    <h3 className="text-lg font-black text-white">{valMake} {valModel} ({valYear})</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    Demanda: {valuationResult.marketDemand || 'Alta'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Toma en Permuta (Agencia)</span>
                    <span className="text-xl font-black text-slate-200 font-mono mt-1 block">
                      USD {valuationResult.quickSaleTradeInPrice?.toLocaleString('es-ES')}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border-2 border-amber-500/80">
                    <span className="text-[11px] text-amber-400 block font-bold">Venta Particular Recomendada</span>
                    <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">
                      USD {valuationResult.estimatedPrivatePrice?.toLocaleString('es-ES')}
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block font-medium">Precio Concesionaria (Garantía)</span>
                    <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                      USD {valuationResult.estimatedDealerPrice?.toLocaleString('es-ES')}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-xs">
                  <p className="font-bold text-white">Comportamiento y Liquidez del Modelo:</p>
                  <p className="text-slate-300 leading-relaxed">{valuationResult.depreciationTrend}</p>
                </div>

                {valuationResult.valuationTips && (
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <p className="font-bold text-amber-400">Consejos para Maximizar el Valor:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-400">
                      {valuationResult.valuationTips.map((tip: string, i: number) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-xl">
                <DollarSign className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Tasador Automático</h3>
                <p className="text-xs max-w-md mx-auto">
                  Ingresa las características del auto a tasar a la izquierda para obtener un rango preciso de precios de toma y reventa.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SALES WHATSAPP ASSISTANT */}
      {activeTab === 'sales-reply' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in-50">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consulta del Cliente</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Auto Consultado:</label>
              <select
                value={replyCarId}
                onChange={(e) => setReplyCarId(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-700 text-xs font-bold"
              >
                {carListings.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Mensaje recibido por WhatsApp:
              </label>
              <textarea
                rows={3}
                value={clientQuestion}
                onChange={(e) => setClientQuestion(e.target.value)}
                className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-700 text-xs leading-relaxed"
                placeholder="Pega aquí lo que preguntó el cliente..."
              />
            </div>

            <button
              onClick={handleGenerateSalesReply}
              disabled={isGeneratingReply}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-102"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingReply ? 'Generando Respuesta...' : 'Generar Respuesta de Venta'}</span>
            </button>
          </div>

          <div className="lg:col-span-7">
            {suggestedReply ? (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-xs text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle className="w-4 h-4" />
                    Respuesta Sugerida para WhatsApp
                  </h4>
                  <button
                    onClick={() => handleCopyText(suggestedReply, 'reply')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5"
                  >
                    {copiedKey === 'reply' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'reply' ? '¡Copiado!' : 'Copiar Texto'}</span>
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {suggestedReply}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      const link = `https://wa.me/?text=${encodeURIComponent(suggestedReply)}`;
                      window.open(link, '_blank');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Abrir en WhatsApp Web</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-xl">
                <MessageCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                <h3 className="text-base font-bold text-white">Respuestas Automáticas para Vendedores</h3>
                <p className="text-xs max-w-md mx-auto">
                  Pega la consulta de un interesado para obtener respuestas redactadas con técnicas de persuasión comercial enfocadas en cerrar visitas al salón.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
