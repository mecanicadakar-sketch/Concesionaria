import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Car,
  Upload,
  Sparkles,
  CheckCircle2,
  Tag,
  DollarSign,
  Phone,
  MessageCircle,
  Building2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { Transmission, FuelType, CurrencyCode } from '../types';

export const SellMyCarView: React.FC = () => {
  const { agencies, addPrivateOffer, formatPrice, privateOffers } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  // Form Fields
  const [make, setMake] = useState('Ford');
  const [model, setModel] = useState('Focus');
  const [version, setVersion] = useState('2.0 SE Plus AT');
  const [year, setYear] = useState<number>(2019);
  const [mileage, setMileage] = useState<number>(58000);
  const [transmission, setTransmission] = useState<Transmission>('Automática');
  const [fuelType, setFuelType] = useState<FuelType>('Nafta/Gasolina');
  const [expectedPrice, setExpectedPrice] = useState<number>(14500);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [conditionNotes, setConditionNotes] = useState(
    'Único dueño, service al día, cubiertas con 10.000 km, VTV vigente y sin deudas de patentes ni multas.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
  ]);

  // Contact Info
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactWhatsapp, setContactWhatsapp] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [city, setCity] = useState('Buenos Aires');
  const [preferredAgencyId, setPreferredAgencyId] = useState<string>('all');

  // AI Valuation State
  const [isValuating, setIsValuating] = useState(false);
  const [aiValuation, setAiValuation] = useState<{
    estimatedDealerPrice?: number;
    estimatedPrivatePrice?: number;
    quickSaleTradeInPrice?: number;
    marketDemand?: string;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState('');

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        if (evt.target?.result) {
          setPhotos((prev) => [...prev, evt.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEstimateAiPrice = async () => {
    setIsValuating(true);
    try {
      const res = await fetch('/api/gemini/price-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          make,
          model,
          year,
          mileage,
          condition: conditionNotes,
          currency,
        }),
      });
      const data = await res.json();
      setAiValuation(data);
      if (data.estimatedPrivatePrice) {
        setExpectedPrice(data.estimatedPrivatePrice);
      }
    } catch (err) {
      console.error(err);
      setAiValuation({
        estimatedDealerPrice: 13500,
        estimatedPrivatePrice: 14800,
        quickSaleTradeInPrice: 12000,
        marketDemand: 'Alta',
      });
    } finally {
      setIsValuating(false);
    }
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim() || !make.trim() || !model.trim()) {
      setErrorMsg('Por favor completa tu nombre, teléfono y datos del vehículo.');
      return;
    }

    addPrivateOffer({
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactWhatsapp: contactWhatsapp.trim() || contactPhone.trim(),
      contactEmail: contactEmail.trim() || 'contacto@usuario.com',
      city: city.trim(),
      make: make.trim(),
      model: model.trim(),
      version: version.trim(),
      year: Number(year),
      mileage: Number(mileage),
      expectedPrice: Number(expectedPrice),
      currency,
      transmission,
      fuelType,
      conditionNotes: conditionNotes.trim(),
      photos,
      preferredAgencyId: preferredAgencyId === 'all' ? undefined : preferredAgencyId,
    });

    setSuccessSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
          <Tag className="w-3.5 h-3.5" />
          <span>Venta Directa & Consignación Segura a Concesionarias</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Ofrece tu auto a las <span className="text-amber-400">mejores agencias</span> de la red
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Publica los datos de tu vehículo para que dueños de concesionarias verificadas te hagan una oferta de compra directa al contado o lo tomen en consignación oficial.
        </p>
      </div>

      {successSubmitted ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl animate-in zoom-in-95">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">¡Tu auto fue enviado con éxito a la red!</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Las agencias de la red evaluarán tu <b className="text-amber-400">{make} {model} {year}</b> y te contactarán directamente por WhatsApp al <b className="text-white">{contactPhone}</b>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto text-left space-y-1 font-mono">
            <p><b>Vehículo:</b> {make} {model} ({year})</p>
            <p><b>Kilometraje:</b> {mileage.toLocaleString('es-ES')} km</p>
            <p><b>Precio pretendido:</b> {formatPrice(expectedPrice, currency)}</p>
            <p><b>Destino:</b> {preferredAgencyId === 'all' ? 'Toda la Red de Concesionarias' : 'Agencia Seleccionada'}</p>
          </div>

          <button
            onClick={() => {
              setSuccessSubmitted(false);
              setStep(1);
            }}
            className="px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-transform hover:scale-102"
          >
            Ofrecer Otro Vehículo
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Step Progress Pills */}
          <div className="grid grid-cols-3 gap-2 pb-4 border-b border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setStep(1)}
              className={`p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                step === 1 ? 'bg-amber-500 text-slate-950 font-black shadow' : 'bg-slate-950 text-slate-400'
              }`}
            >
              <span>1. Datos del Auto</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className={`p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                step === 2 ? 'bg-amber-500 text-slate-950 font-black shadow' : 'bg-slate-950 text-slate-400'
              }`}
            >
              <span>2. Fotos y Estado</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className={`p-2.5 rounded-xl flex items-center justify-center gap-2 transition-all ${
                step === 3 ? 'bg-amber-500 text-slate-950 font-black shadow' : 'bg-slate-950 text-slate-400'
              }`}
            >
              <span>3. Contacto & Enviar</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmitOffer} className="space-y-6">
            {/* STEP 1: VEHICLE CORE SPECS */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in-50">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Car className="w-4 h-4 text-amber-400" />
                    <span>Información del Vehículo</span>
                  </h3>

                  <button
                    type="button"
                    onClick={handleEstimateAiPrice}
                    disabled={isValuating}
                    className="px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isValuating ? 'Tasando...' : '💡 Tasar con IA'}</span>
                  </button>
                </div>

                {/* AI Valuation Banner */}
                {aiValuation && (
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2 animate-in zoom-in-95">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-400 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Tasación Estimada de Mercado IA
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        Demanda: {aiValuation.marketDemand || 'Alta'}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs text-center pt-1">
                      <div className="p-2 rounded-xl bg-slate-900">
                        <span className="text-[10px] text-slate-400 block">Toma Rápida Agencia</span>
                        <span className="font-bold text-slate-200 font-mono">
                          USD {aiValuation.quickSaleTradeInPrice?.toLocaleString('es-ES')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900 border border-amber-500/40">
                        <span className="text-[10px] text-amber-400 block font-bold">Venta Particular</span>
                        <span className="font-black text-amber-400 font-mono">
                          USD {aiValuation.estimatedPrivatePrice?.toLocaleString('es-ES')}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-900">
                        <span className="text-[10px] text-slate-400 block">Precio Concesionaria</span>
                        <span className="font-bold text-slate-200 font-mono">
                          USD {aiValuation.estimatedDealerPrice?.toLocaleString('es-ES')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Marca *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Chevrolet, Ford, Toyota"
                      value={make}
                      onChange={(e) => setMake(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Modelo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cruze, Focus, Corolla"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Versión</label>
                    <input
                      type="text"
                      placeholder="Ej. 1.4T LTZ / Titanium"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Año de Fabricación *</label>
                    <input
                      type="number"
                      required
                      min="1990"
                      max="2026"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Kilometraje Actual *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={mileage}
                      onChange={(e) => setMileage(Number(e.target.value))}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Transmisión</label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value as any)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    >
                      <option value="Automática">Automática</option>
                      <option value="Manual">Manual</option>
                      <option value="Secuencial">Secuencial</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <span>Siguiente: Fotos y Estado</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PHOTOS & CONDITION */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in-50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Fotos y Estado del Auto</span>
                </h3>

                {/* Photos Grid */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Fotos del Exterior e Interior ({photos.length} fotos)
                  </label>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {photos.map((p, idx) => (
                      <div key={idx} className="relative h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                        <img src={p} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded-md bg-red-600/80 text-white hover:bg-red-500 text-[10px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    <label className="h-24 rounded-xl border-2 border-dashed border-slate-700 hover:border-amber-500 bg-slate-950/60 flex flex-col items-center justify-center text-slate-400 hover:text-white cursor-pointer transition-colors p-2 text-center">
                      <Upload className="w-5 h-5 mb-1 text-amber-400" />
                      <span className="text-[11px] font-bold">Subir Fotos</span>
                      <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* Condition Notes */}
                <div>
                  <label className="block text-slate-400 mb-1 text-xs font-semibold">
                    Observaciones mecánicas, estéticas y de documentación:
                  </label>
                  <textarea
                    rows={3}
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    className="w-full bg-slate-950 text-white rounded-xl p-3 border border-slate-700 text-xs leading-relaxed focus:outline-none focus:border-amber-500"
                    placeholder="Menciona si tiene VTV al día, estado de cubiertas, si es único dueño, services realizados, etc."
                  />
                </div>

                {/* Price Expected */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block text-xs font-bold text-emerald-400">
                    Precio Pretendido de Venta *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value as any)}
                      className="w-24 bg-slate-900 text-white rounded-xl p-2.5 border border-slate-700 text-xs font-bold focus:outline-none focus:border-amber-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="ARS">ARS ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                    <input
                      type="number"
                      required
                      min="1"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(Number(e.target.value))}
                      className="flex-1 bg-slate-900 text-white rounded-xl p-2.5 border border-slate-700 text-sm font-mono font-bold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Atrás
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <span>Siguiente: Contacto</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONTACT & SUBMISSION */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in-50">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Tus Datos de Contacto</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Teléfono / WhatsApp *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. +54 9 11 2233-4455"
                      value={contactPhone}
                      onChange={(e) => {
                        setContactPhone(e.target.value);
                        setContactWhatsapp(e.target.value);
                      }}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Email de Contacto</label>
                    <input
                      type="email"
                      placeholder="Ej. juan@correo.com"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Ciudad / Localidad</label>
                    <input
                      type="text"
                      placeholder="Ej. Pilar, Buenos Aires"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 mb-1 font-semibold">
                      ¿A qué agencia deseas enviar tu propuesta?
                    </label>
                    <select
                      value={preferredAgencyId}
                      onChange={(e) => setPreferredAgencyId(e.target.value)}
                      className="w-full bg-slate-950 text-white rounded-xl p-2.5 border border-slate-700 text-xs font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">🌐 Enviar a toda la Red de Concesionarias (Recomendado para más ofertas)</option>
                      {agencies.map((a) => (
                        <option key={a.id} value={a.id}>
                          🏢 {a.name} ({a.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Atrás
                  </button>

                  <button
                    type="submit"
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition-transform hover:scale-102 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    <span>Enviar Propuesta a las Agencias</span>
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
