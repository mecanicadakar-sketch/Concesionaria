import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Shield, Eye, EyeOff, AlertTriangle, CheckCircle2, KeyRound, Sparkles, Mail } from 'lucide-react';
import { EmailVerificationModal } from './EmailVerificationModal';

interface AdminAuthViewProps {
  onSuccess?: () => void;
}

export const AdminAuthView: React.FC<AdminAuthViewProps> = ({ onSuccess }) => {
  const {
    authenticateAdmin,
    adminFailedAttempts,
    adminLockoutUntil,
    unlockAdminDirectly,
  } = useApp();

  const [adminEmail, setAdminEmail] = useState('admin@micarro.com');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isEmailOtpOpen, setIsEmailOtpOpen] = useState(false);

  const isLocked = adminLockoutUntil ? adminLockoutUntil > Date.now() : false;
  const minutesRemaining = adminLockoutUntil ? Math.ceil((adminLockoutUntil - Date.now()) / (60 * 1000)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const result = authenticateAdmin(adminEmail, pin);
    if (result.success) {
      setSuccessMessage('¡Acceso concedido! Redirigiendo al panel de control...');
      if (onSuccess) {
        setTimeout(() => onSuccess(), 400);
      }
    } else {
      setErrorMessage(result.message);
    }
  };

  const handle2FAEmailFlow = () => {
    setIsEmailOtpOpen(true);
  };

  const handle2FASuccess = () => {
    unlockAdminDirectly();
    setSuccessMessage('¡Identidad verificada por Email correctamente!');
    if (onSuccess) {
      setTimeout(() => onSuccess(), 400);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 relative overflow-hidden">
        
        {/* Top Lock Icon Badge */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border-2 border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
            <Lock className="w-8 h-8 stroke-[2.2]" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-center tracking-tight mb-6">
          Acceso Administrador Seguro
        </h2>

        {/* Anti-Brute Force Protection Banner - Exact Style of TallerYa */}
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 text-emerald-950 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-bold text-emerald-800 mb-2">
            <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Protección Anti-Fuerza Bruta Activa</span>
          </div>
          <ul className="space-y-1 text-xs text-emerald-900 pl-4 list-disc marker:text-emerald-500">
            <li>Límite estricto de <strong>3 intentos</strong> por dirección IP.</li>
            <li>Bloqueo automático temporal por <strong>15 minutos</strong> en caso de 3 fallos.</li>
            <li>Autenticación cifrada en tiempo constante.</li>
          </ul>
        </div>

        {/* Lockout Warning if applicable */}
        {isLocked && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Acceso Temporalmente Bloqueado</p>
              <p className="mt-0.5">
                Por seguridad se han superado los 3 intentos. Por favor espera {minutesRemaining} minutos o valida tu identidad mediante el código de verificación por email.
              </p>
            </div>
          </div>
        )}

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Main Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Email Field */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1.5">
              1. Email de Administrador *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="ej. mecanicadakar@gmail.com"
                className="w-full bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3.5 border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 font-medium text-sm transition-all outline-none"
              />
            </div>
          </div>

          {/* 2. Password / PIN Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                2. Contraseña / PIN *
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                {showPin ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar PIN</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>👁️ Ver PIN</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Ingresa tu contraseña o PIN"
                className="w-full bg-blue-50/40 hover:bg-blue-50/70 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3.5 border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 font-medium text-sm transition-all outline-none font-mono"
              />
            </div>
          </div>

          {/* Submit Button - Solid Blue matching TallerYa */}
          <button
            type="submit"
            disabled={isLocked}
            className="w-full py-4 px-6 rounded-xl bg-blue-700 hover:bg-blue-800 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base shadow-lg shadow-blue-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ingresar como Administrador</span>
          </button>
        </form>

        {/* Secondary Action: Email OTP verification alternative */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-center">
          <button
            type="button"
            onClick={handle2FAEmailFlow}
            className="text-blue-700 hover:text-blue-900 font-bold text-xs flex items-center gap-2 py-2 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200/60 shadow-sm"
          >
            <Mail className="w-4 h-4 text-blue-600" />
            <span>¿Olvidaste tu PIN o deseas validar con Código por Email (OTP)?</span>
          </button>
        </div>
      </div>

      {/* Email Verification OTP Modal */}
      <EmailVerificationModal
        isOpen={isEmailOtpOpen}
        onClose={() => setIsEmailOtpOpen(false)}
        targetEmail={adminEmail}
        purposeTitle="Acceso Administrador Seguro"
        onSuccess={handle2FASuccess}
      />
    </div>
  );
};
