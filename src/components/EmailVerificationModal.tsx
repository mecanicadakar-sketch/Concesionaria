import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, CheckCircle2, AlertCircle, RefreshCw, X, Shield, ArrowRight } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetEmail: string;
  purposeTitle?: string;
  onSuccess: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  targetEmail,
  purposeTitle = 'Verificación de Seguridad',
  onSuccess,
}) => {
  const { sendEmailVerificationCode, verifyEmailCode, lastGeneratedOtp } = useApp();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
      setSuccessMsg('');
      setDigits(['', '', '', '', '', '']);
      setCountdown(60);
      setCanResend(false);
      // Auto-send OTP when opening
      sendEmailVerificationCode(targetEmail, purposeTitle);
    }
  }, [isOpen, targetEmail, purposeTitle]);

  useEffect(() => {
    if (!isOpen) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown, isOpen]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/[^0-9]/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);
    setErrorMsg('');

    // Auto focus next input
    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto verify if all 6 digits are filled
    const fullCode = newDigits.join('');
    if (fullCode.length === 6 && !newDigits.includes('')) {
      handleVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = (codeToVerify?: string) => {
    const code = codeToVerify || digits.join('');
    if (code.length !== 6) {
      setErrorMsg('Por favor ingresa los 6 dígitos del código de verificación.');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');

    setTimeout(() => {
      const result = verifyEmailCode(targetEmail, code);
      setIsVerifying(false);

      if (result.success) {
        setSuccessMsg('¡Código verificado con éxito!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 600);
      } else {
        setErrorMsg(result.message || 'Código incorrecto. Verifica e intenta de nuevo.');
      }
    }, 400);
  };

  const handleResend = () => {
    if (!canResend) return;
    sendEmailVerificationCode(targetEmail, purposeTitle);
    setCountdown(60);
    setCanResend(false);
    setErrorMsg('');
    setDigits(['', '', '', '', '', '']);
    setSuccessMsg('Nuevo código enviado a tu correo.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-inner">
            <Mail className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">{purposeTitle}</h3>
          <p className="text-sm text-slate-600 mt-1 max-w-xs">
            Ingresa el código de 6 dígitos que enviamos a:
          </p>
          <span className="inline-block mt-1.5 px-3 py-1 bg-slate-100 text-blue-700 font-semibold text-xs rounded-full border border-slate-200">
            {targetEmail}
          </span>
        </div>

        {/* 6 Digit Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {digits.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-input-${idx}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-mono rounded-xl bg-slate-50 border-2 border-slate-200 text-slate-900 focus:border-blue-600 focus:bg-white focus:outline-none transition-all shadow-sm"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {/* Status Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isVerifying || digits.join('').length !== 6}
          className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
        >
          {isVerifying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verificando...</span>
            </>
          ) : (
            <>
              <span>Validar Código</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend & Timer */}
        <div className="mt-5 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          {countdown > 0 ? (
            <span>Reenviar código en <strong className="text-slate-800 font-semibold">{countdown}s</strong></span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 hover:text-blue-800 font-bold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reenviar código por Email</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
