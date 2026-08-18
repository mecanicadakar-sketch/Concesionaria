import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Car,
  Check,
  Fuel,
  Gauge,
  Calendar,
  DollarSign,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MessageCircle,
  Trash2,
  GitCompare,
} from 'lucide-react';

interface CompareCarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCar?: (car: any) => void;
}

export const CompareCarsModal: React.FC<CompareCarsModalProps> = ({
  isOpen,
  onClose,
  onSelectCar,
}) => {
  const {
    comparedCarIds,
    carListings,
    removeCarFromCompare,
    clearCompareCars,
    openWhatsappForCar,
    formatPrice,
  } = useApp();

  if (!isOpen) return null;

  const comparedCars = carListings.filter((c) => comparedCarIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-700/20">
              <GitCompare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">Comparador de Vehículos</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold font-mono">
                  {comparedCars.length} / 3
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Comparativa técnica detallada lado a lado de especificaciones, precios y equipamiento.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedCars.length > 0 && (
              <button
                onClick={clearCompareCars}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6">
          {comparedCars.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Car className="w-8 h-8 opacity-60" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">No hay vehículos en la comparativa</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  En el catálogo de autos haz clic en el botón <strong className="text-blue-700">"Comparar"</strong> (icono de balanza/comparar) en las tarjetas para contrastar hasta 3 modelos simultáneos.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-xs font-bold shadow hover:bg-blue-800 transition-colors"
              >
                Explorar Catálogo de Autos
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                {/* Table Header: Photos & Quick Actions */}
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="p-3 w-44 min-w-36 font-bold text-slate-400 uppercase tracking-wider align-bottom">
                      Vehículo
                    </th>
                    {comparedCars.map((car) => (
                      <th key={car.id} className="p-3 min-w-64 max-w-xs align-top">
                        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                          <img
                            src={car.photos[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500'}
                            alt={car.title}
                            className="w-full h-36 object-cover"
                          />
                          <button
                            onClick={() => removeCarFromCompare(car.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 transition-colors shadow"
                            title="Quitar de la comparativa"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <div className="p-3 space-y-1.5 bg-white">
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                              {car.agencyName}
                            </span>
                            <h4 className="font-black text-slate-900 text-sm leading-snug line-clamp-2">
                              {car.title}
                            </h4>
                            <div className="text-base font-black text-blue-700 font-mono">
                              {formatPrice(car.price, car.currency)}
                            </div>
                            <div className="pt-2 flex gap-2">
                              <button
                                onClick={() => openWhatsappForCar(car)}
                                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow-sm transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                              {onSelectCar && (
                                <button
                                  onClick={() => {
                                    onSelectCar(car);
                                    onClose();
                                  }}
                                  className="py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                                >
                                  Ver Ficha
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                    {/* Empty Slots */}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, idx) => (
                      <th key={`empty-${idx}`} className="p-3 min-w-60 align-top">
                        <div className="h-64 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-4 text-center text-slate-400">
                          <Car className="w-8 h-8 mb-2 stroke-1 opacity-50" />
                          <span className="font-bold text-xs">Espacio Disponible</span>
                          <span className="text-[11px] text-slate-400 mt-0.5">
                            Selecciona otro auto del catálogo
                          </span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Table Body: Specifications */}
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {/* Category: Principales */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="p-2.5 font-black text-blue-900 uppercase tracking-wider text-[11px]">
                      1. Datos Principales
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Marca / Modelo</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-bold text-slate-900">
                        {c.make} {c.model}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Año de Fabricación</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-mono font-bold text-slate-900">
                        {c.year}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Kilometraje</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-mono font-semibold text-slate-800">
                        {c.mileage.toLocaleString('es-ES')} km
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Condición</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-800">
                          {c.condition}
                        </span>
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Category: Mecánica & Motor */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="p-2.5 font-black text-blue-900 uppercase tracking-wider text-[11px]">
                      2. Motor & Transmisión
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Motor / Cilindrada</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.engine || c.version}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Transmisión</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.transmission}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Combustible</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-slate-800">
                        {c.fuelType}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Tracción</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-mono font-bold text-slate-800">
                        {c.traction || '4x2'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Carrocería / Puertas</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 text-slate-800">
                        {c.bodyType} • {c.doors} puertas
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Category: Financiación & Permuta */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="p-2.5 font-black text-blue-900 uppercase tracking-wider text-[11px]">
                      3. Condiciones Comerciales
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Permuta (Toma Usados)</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.acceptsTradeIn ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Sí, acepta permuta
                          </span>
                        ) : (
                          <span className="text-slate-400">Sólo contado</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Financiación en Cuotas</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3">
                        {c.financingAvailable ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Disponible
                          </span>
                        ) : (
                          <span className="text-slate-400">No disponible</span>
                        )}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500">Garantía Mecánica</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 font-semibold text-blue-700">
                        {c.warrantyMonths ? `${c.warrantyMonths} meses oficial` : 'Consultar'}
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>

                  {/* Category: Equipamiento Destacado */}
                  <tr className="bg-blue-50/50">
                    <td colSpan={4} className="p-2.5 font-black text-blue-900 uppercase tracking-wider text-[11px]">
                      4. Equipamiento & Confort
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-500 align-top">Equipamiento</td>
                    {comparedCars.map((c) => (
                      <td key={c.id} className="p-3 align-top">
                        <ul className="space-y-1">
                          {c.features.slice(0, 6).map((f, i) => (
                            <li key={i} className="flex items-center gap-1.5 text-slate-700">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                          {c.features.length > 6 && (
                            <li className="text-[10px] text-blue-600 font-bold pt-1">
                              +{c.features.length - 6} características más
                            </li>
                          )}
                        </ul>
                      </td>
                    ))}
                    {Array.from({ length: 3 - comparedCars.length }).map((_, i) => (
                      <td key={i} className="p-3 text-slate-300">-</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
