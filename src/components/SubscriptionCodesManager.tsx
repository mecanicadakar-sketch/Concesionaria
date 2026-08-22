import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SubscriptionAccessCode, SubscriptionPlan } from '../types';
import {
  KeyRound,
  Plus,
  Copy,
  Check,
  Share2,
  Trash2,
  Ban,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Mail,
  Calendar,
  Sparkles,
  ShieldCheck,
  Send,
  ExternalLink,
  MessageSquare,
  Search,
  Filter,
} from 'lucide-react';
import { EmailVerificationModal } from './EmailVerificationModal';

export const SubscriptionCodesManager: React.FC = () => {
  const {
    accessCodes,
    generateAccessCode,
    revokeAccessCode,
    deleteAccessCode,
    subscriptionPlans,
    agencies,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'redeemed' | 'revoked'>('all');

  // Form State for new code
  const [newCodeData, setNewCodeData] = useState({
    codePrefix: 'MICARRO',
    planId: subscriptionPlans[1]?.id || 'plan-pro',
    targetAgencyId: '',
    targetEmail: 'contacto@agenciademo.com',
    durationMonths: 12,
    discountPercentage: 100,
    notes: 'Código de bonificación exclusiva para concesionaria',
    requireEmailOtp: false,
  });

  const [notificationMsg, setNotificationMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingCodeToGenerate, setPendingCodeToGenerate] = useState<any | null>(null);

  const handleCopyCode = (code: SubscriptionAccessCode) => {
    navigator.clipboard.writeText(code.code);
    setCopiedCodeId(code.id);
    setNotificationMsg({ type: 'success', text: `Código ${code.code} copiado al portapapeles.` });
    setTimeout(() => {
      setCopiedCodeId(null);
      setNotificationMsg(null);
    }, 2500);
  };

  const handleSendWhatsapp = (code: SubscriptionAccessCode) => {
    const text = encodeURIComponent(
      `🚗 *MiCarro SaaS - Código de Suscripción Exclusivo*\n\n` +
      `¡Hola! Te otorgamos tu código de activación de un solo uso para tu concesionaria:\n\n` +
      `🔑 *CÓDIGO:* ${code.code}\n` +
      `📦 *Plan:* ${code.planName}\n` +
      `⏳ *Duración:* ${code.durationMonths >= 900 ? 'Permanente / Vitalicio' : `${code.durationMonths} meses`}\n` +
      `📅 *Válido hasta:* ${new Date(code.expiresAt).toLocaleDateString('es-AR')}\n\n` +
      `Para activarlo, ingresá al Portal de Concesionaria en MiCarro y hacé clic en *"Canjear Código"*.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleGenerateRandomCode = (prefix: string, planName: string) => {
    const cleanPrefix = prefix.trim().toUpperCase() || 'MICARRO';
    const planTag = planName.toLowerCase().includes('premium') || planName.toLowerCase().includes('completa')
      ? 'ENT'
      : planName.toLowerCase().includes('pro')
      ? 'PRO'
      : 'BASIC';
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${cleanPrefix}-${planTag}-${randomNum}-${randomChars}`;
  };

  const handleSubmitNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPlan = subscriptionPlans.find((p) => p.id === newCodeData.planId) || subscriptionPlans[0];
    const generatedCodeString = handleGenerateRandomCode(newCodeData.codePrefix, selectedPlan.name);
    
    // Calculate expiration date for the code validity (default 60 days to redeem)
    const codeExpires = new Date();
    codeExpires.setDate(codeExpires.getDate() + 60);

    const agencyObj = newCodeData.targetAgencyId ? agencies.find((a) => a.id === newCodeData.targetAgencyId) : undefined;

    const payload = {
      code: generatedCodeString,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      targetAgencyId: newCodeData.targetAgencyId || undefined,
      targetAgencyName: agencyObj?.name || 'Cualquier Concesionaria',
      targetEmail: newCodeData.targetEmail,
      durationMonths: Number(newCodeData.durationMonths),
      discountPercentage: Number(newCodeData.discountPercentage),
      expiresAt: codeExpires.toISOString(),
      createdByEmail: 'admin@micarro.com',
      notes: newCodeData.notes,
    };

    if (newCodeData.requireEmailOtp) {
      setPendingCodeToGenerate(payload);
      setIsOtpModalOpen(true);
    } else {
      finalizeCodeCreation(payload);
    }
  };

  const finalizeCodeCreation = (payload: any) => {
    const created = generateAccessCode(payload);
    setIsCreateModalOpen(false);
    setNotificationMsg({
      type: 'success',
      text: `¡Código de activación ${created.code} generado con éxito para ${created.targetAgencyName}!`,
    });
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  // Metrics
  const totalCodes = accessCodes.length;
  const activeCodes = accessCodes.filter((c) => c.status === 'active').length;
  const redeemedCodes = accessCodes.filter((c) => c.status === 'redeemed').length;

  const filteredCodes = accessCodes.filter((code) => {
    const matchesSearch =
      code.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
      code.planName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (code.targetAgencyName && code.targetAgencyName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (code.targetEmail && code.targetEmail.toLowerCase().includes(searchFilter.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || code.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & New Code Trigger */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm shrink-0">
              <KeyRound className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Códigos de Suscripción de Un Solo Acceso
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  Tipo TallerYa
                </span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
                Generá y otorgá códigos de membresía exclusivos para activar o bonificar planes a agencias y concesionarias.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 transition-transform hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Generar Nuevo Código de Activación</span>
          </button>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500">Total Códigos Emitidos</p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCodes}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <KeyRound className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-700">Disponibles para Canjear</p>
              <p className="text-2xl font-black text-emerald-900 mt-0.5">{activeCodes}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-700">Canjeados / Usados</p>
              <p className="text-2xl font-black text-blue-900 mt-0.5">{redeemedCodes}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {notificationMsg && (
        <div
          className={`p-4 rounded-2xl text-sm flex items-center gap-3 shadow-sm ${
            notificationMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{notificationMsg.text}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por código, agencia, email..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Estado:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 text-slate-900 text-xs font-semibold rounded-xl px-3 py-2 border border-slate-200 focus:outline-none focus:border-blue-600"
          >
            <option value="all">Todos ({accessCodes.length})</option>
            <option value="active">🟢 Disponibles ({activeCodes})</option>
            <option value="redeemed">🔵 Canjeados ({redeemedCodes})</option>
            <option value="revoked">🔴 Revocados</option>
          </select>
        </div>
      </div>

      {/* Codes Table / Cards */}
      <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Código de Activación</th>
                <th className="py-3.5 px-4">Plan Otorgado</th>
                <th className="py-3.5 px-4">Duración</th>
                <th className="py-3.5 px-4">Destinatario</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    No se encontraron códigos de suscripción con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredCodes.map((code) => {
                  const isCopied = copiedCodeId === code.id;
                  return (
                    <tr key={code.id} className="hover:bg-blue-50/30 transition-colors">
                      {/* Code Pill */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm bg-slate-100 text-blue-950 px-3 py-1.5 rounded-xl border border-slate-200 tracking-wider">
                            {code.code}
                          </span>
                          <button
                            onClick={() => handleCopyCode(code)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                            title="Copiar código"
                          >
                            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        {code.notes && (
                          <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">{code.notes}</p>
                        )}
                      </td>

                      {/* Plan */}
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>{code.planName}</span>
                        </div>
                      </td>

                      {/* Duration */}
                      <td className="py-4 px-4 text-slate-700">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {code.durationMonths >= 900 ? 'Permanente' : `${code.durationMonths} meses`}
                        </span>
                      </td>

                      {/* Target */}
                      <td className="py-4 px-4">
                        <p className="font-semibold text-slate-900">{code.targetAgencyName || 'Cualquier Concesionaria'}</p>
                        {code.targetEmail && (
                          <p className="text-[11px] text-slate-500 font-mono">{code.targetEmail}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {code.status === 'active' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            Disponible
                          </span>
                        )}
                        {code.status === 'redeemed' && (
                          <div>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Canjeado
                            </span>
                            {code.redeemedAt && (
                              <p className="text-[10px] text-slate-500 mt-0.5">
                                el {new Date(code.redeemedAt).toLocaleDateString('es-AR')}
                              </p>
                            )}
                          </div>
                        )}
                        {code.status === 'revoked' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Revocado
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {code.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleSendWhatsapp(code)}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs flex items-center gap-1 transition-colors"
                                title="Enviar por WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                onClick={() => revokeAccessCode(code.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Revocar código"
                              >
                                <Ban className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            onClick={() => deleteAccessCode(code.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Eliminar registro"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Code Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-black text-slate-900 tracking-tight mb-1">
              Generar Código de Suscripción
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Creá un código de un solo acceso para otorgar o bonificar planes a concesionarias.
            </p>

            <form onSubmit={handleSubmitNewCode} className="space-y-4 text-xs sm:text-sm">
              {/* Plan Selection */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Plan a Otorgar *</label>
                <select
                  value={newCodeData.planId}
                  onChange={(e) => setNewCodeData({ ...newCodeData, planId: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 font-semibold focus:border-blue-600 focus:bg-white outline-none"
                >
                  {subscriptionPlans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} — ({plan.maxCars} autos, {plan.featuredSlots} destacados)
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Duración *</label>
                  <select
                    value={newCodeData.durationMonths}
                    onChange={(e) => setNewCodeData({ ...newCodeData, durationMonths: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 font-semibold focus:border-blue-600 focus:bg-white outline-none"
                  >
                    <option value={1}>1 Mes (30 días)</option>
                    <option value={3}>3 Meses (Trimestral)</option>
                    <option value={6}>6 Meses (Semestral)</option>
                    <option value={12}>12 Meses (Anual)</option>
                    <option value={999}>Vitalicio / Permanente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Prefijo del Código</label>
                  <input
                    type="text"
                    value={newCodeData.codePrefix}
                    onChange={(e) => setNewCodeData({ ...newCodeData, codePrefix: e.target.value.toUpperCase() })}
                    placeholder="MICARRO"
                    className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 font-mono font-bold focus:border-blue-600 focus:bg-white outline-none uppercase"
                  />
                </div>
              </div>

              {/* Target Agency */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Asignar a Concesionaria Específica (Opcional)</label>
                <select
                  value={newCodeData.targetAgencyId}
                  onChange={(e) => setNewCodeData({ ...newCodeData, targetAgencyId: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 font-medium focus:border-blue-600 focus:bg-white outline-none"
                >
                  <option value="">Abierto (Cualquier concesionaria puede canjearlo)</option>
                  {agencies.map((agency) => (
                    <option key={agency.id} value={agency.id}>
                      {agency.name} ({agency.city})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Email */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Email Destinatario / Notificación *</label>
                <input
                  type="email"
                  required
                  value={newCodeData.targetEmail}
                  onChange={(e) => setNewCodeData({ ...newCodeData, targetEmail: e.target.value })}
                  placeholder="ej. mecanicadakar@gmail.com"
                  className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 font-medium focus:border-blue-600 focus:bg-white outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Notas / Motivo de Bonificación</label>
                <input
                  type="text"
                  value={newCodeData.notes}
                  onChange={(e) => setNewCodeData({ ...newCodeData, notes: e.target.value })}
                  placeholder="Ej. Bonificación de bienvenida o acuerdo comercial"
                  className="w-full bg-slate-50 text-slate-900 rounded-xl p-3 border border-slate-200 text-xs focus:border-blue-600 focus:bg-white outline-none"
                />
              </div>

              {/* Require OTP Toggle */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="font-bold text-blue-900 text-xs">Exigir Código OTP por Email para emisión</p>
                  <p className="text-[11px] text-blue-700">Verifica la identidad con token de 6 dígitos antes de emitir.</p>
                </div>
                <input
                  type="checkbox"
                  checked={newCodeData.requireEmailOtp}
                  onChange={(e) => setNewCodeData({ ...newCodeData, requireEmailOtp: e.target.checked })}
                  className="w-5 h-5 accent-blue-700 cursor-pointer rounded"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold shadow-md shadow-blue-700/20"
                >
                  Emitir Código
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal if required */}
      <EmailVerificationModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        targetEmail={newCodeData.targetEmail || 'mecanicadakar@gmail.com'}
        purposeTitle="Autorizar Emisión de Código"
        onSuccess={() => {
          if (pendingCodeToGenerate) {
            finalizeCodeCreation(pendingCodeToGenerate);
            setPendingCodeToGenerate(null);
          }
        }}
      />
    </div>
  );
};
