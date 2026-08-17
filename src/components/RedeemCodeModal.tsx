import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KeyRound, CheckCircle2, AlertCircle, Sparkles, X, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { EmailVerificationModal } from './EmailVerificationModal';

interface RedeemCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RedeemCodeModal: React.FC<RedeemCodeModalProps> = ({ isOpen, onClose }) => {
  const { redeemAccessCode, currentAgency, currentUser, accessCodes } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successResult, setSuccessResult] = useState<{ message: string; planName: string } | null>(null);
  const [isEmailOtpOpen, setIsEmailOtpOpen] = useState(false);
  const [requireOtp, setRequireOtp] = useState(false);

  if (!isOpen) return null;

  const handleRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessResult(null);

    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage('Por favor ingresa tu código de suscripción.');
      return;
    }

    if (requireOtp) {
      setIsEmailOtpOpen(true);
      return;
    }

    finalizeRedeem(cleanCode);
  };

  const finalizeRedeem = (codeToRedeem: string) => {
    const res = redeemAccessCode(codeToRedeem, currentAgency?.id, currentUser?.email);
    if (res.success) {
      setSuccessResult({
        message: res.message,
        planName: res.codeDetails?.planName || 'Plan MiCarro SaaS',
      });
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleUseDemoCode = (codeStr: string) => {
    setInputCode(codeStr);
    finalizeRedeem(codeStr);
  };

  const availableDemoCodes = accessCodes.filter((c) => c.status === 'active');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
            <KeyRound className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Canjear Código de Suscripción</h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-sm">
            Ingresá tu código de un solo acceso para activar o renovar la membresía de <strong>{currentAgency?.name || 'tu concesionaria'}</strong>.
          </p>
        </div>

        {/* Success State */}
        {successResult ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-900">¡Membresía Activada con Éxito!</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{successResult.message}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-left space-y-1">
              <p className="font-semibold text-slate-800">✅ Concesionaria: {currentAgency?.name}</p>
              <p className="font-semibold text-slate-800">✅ Plan Actualizado: {successResult.planName}</p>
              <p className="font-semibold text-slate-800">✅ Estado: 🟢 Activa</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm shadow-md"
            >
              Ir a mi Salón de Ventas
            </button>
          </div>
        ) : (
          <form onSubmit={handleRedeem} className="space-y-4">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Input Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5 uppercase tracking-wide">
                Código de Activación *
              </label>
              <input
                type="text"
                required
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="Ej. MICARRO-PRO-9842-X7K"
                className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-slate-900 rounded-xl px-4 py-3.5 border-2 border-slate-200 focus:border-blue-600 focus:outline-none font-mono font-bold text-base tracking-wider text-center transition-all uppercase"
                autoFocus
              />
            </div>

            {/* Toggle 2FA */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail className="w-4 h-4 text-blue-600" />
                <span>Validar titular por correo electrónico</span>
              </div>
              <input
                type="checkbox"
                checked={requireOtp}
                onChange={(e) => setRequireOtp(e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Activar Membresía Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Demo Codes Helper */}
            {availableDemoCodes.length > 0 && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wide">
                  Códigos de prueba disponibles para canjear:
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableDemoCodes.slice(0, 2).map((dc) => (
                    <button
                      key={dc.id}
                      type="button"
                      onClick={() => handleUseDemoCode(dc.code)}
                      className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-mono text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <span>{dc.code}</span>
                      <span className="text-[10px] text-blue-600 font-sans">({dc.planName.split(' ')[1]})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </form>
        )}
      </div>

      {/* 2FA Modal */}
      <EmailVerificationModal
        isOpen={isEmailOtpOpen}
        onClose={() => setIsEmailOtpOpen(false)}
        targetEmail={currentAgency?.email || currentUser?.email || 'mecanicadakar@gmail.com'}
        purposeTitle="Validar Canje de Código"
        onSuccess={() => {
          finalizeRedeem(inputCode.trim().toUpperCase());
        }}
      />
    </div>
  );
};
