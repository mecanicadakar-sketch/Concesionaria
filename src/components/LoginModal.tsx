import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppUser } from '../types';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    users,
    login,
    loginAsDemoUser,
    logout,
    addUser,
    agencies,
    currentAgencyId,
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'demo'>('login');
  
  // Login form state
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regAgencyId, setRegAgencyId] = useState(currentAgencyId);
  const [regRole, setRegRole] = useState<'seller' | 'agency_admin'>('seller');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim()) {
      setErrorMessage('Por favor ingrese su nombre de usuario o correo electrónico.');
      return;
    }

    if (!password) {
      setErrorMessage('Por favor ingrese su contraseña.');
      return;
    }

    const result = login(identifier, password);
    if (result.success) {
      setSuccessMessage('¡Sesión iniciada con éxito!');
      setTimeout(() => {
        onClose();
        setSuccessMessage('');
        setIdentifier('');
        setPassword('');
      }, 500);
    } else {
      setErrorMessage(result.message || 'Error al iniciar sesión.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regUsername.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Por favor complete todos los campos obligatorios.');
      return;
    }

    const exists = users.some(
      (u) =>
        u.username.toLowerCase() === regUsername.trim().toLowerCase() ||
        u.email.toLowerCase() === regEmail.trim().toLowerCase()
    );

    if (exists) {
      setErrorMessage('El nombre de usuario o correo electrónico ya está registrado.');
      return;
    }

    const targetAgency = agencies.find((a) => a.id === regAgencyId) || agencies[0];

    const newUser: AppUser = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      username: regUsername.trim().toLowerCase(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim() || targetAgency.phone,
      whatsappNumber: regWhatsapp.trim().replace(/[^0-9]/g, '') || targetAgency.whatsappNumber,
      agencyId: targetAgency.id,
      agencyName: targetAgency.name,
      role: regRole,
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      password: regPassword,
      isActive: true,
      commissionRate: 1.5,
      carsLoadedCount: 0,
      carsSoldCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addUser(newUser);
    login(newUser.username, regPassword);
    setSuccessMessage('¡Cuenta creada y sesión iniciada!');

    setTimeout(() => {
      onClose();
      setSuccessMessage('');
      setRegName('');
      setRegUsername('');
      setRegEmail('');
      setRegPassword('');
    }, 600);
  };

  const handleDemoSelect = (u: AppUser) => {
    loginAsDemoUser(u.id);
    setSuccessMessage(`Ingresaste como ${u.name} (${u.role === 'seller' ? 'Vendedor' : 'Gerente'})`);
    setTimeout(() => {
      onClose();
      setSuccessMessage('');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-sm">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Portal de Acceso para Vendedores
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                  MiCarro
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Ingreso con usuario y contraseña para gestión de inventario y salón
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1.5 border-b border-slate-200 gap-1 text-xs">
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'login'
                ? 'bg-blue-700 text-white shadow font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Ingresar</span>
          </button>
          <button
            onClick={() => {
              setMode('demo');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'demo'
                ? 'bg-blue-700 text-white shadow font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Usuarios Demo</span>
          </button>
          <button
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              mode === 'register'
                ? 'bg-blue-700 text-white shadow font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Registrar</span>
          </button>
        </div>

        {/* Body Container */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Current User Status Banner */}
          {currentUser && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-blue-600"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
                    <span className="px-1.5 py-0.2 text-[10px] font-semibold rounded bg-blue-100 text-blue-800">
                      {currentUser.role === 'seller'
                        ? 'Vendedor'
                        : currentUser.role === 'agency_admin'
                        ? 'Gerente Agencia'
                        : 'Super Admin'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    @{currentUser.username} • {currentUser.agencyName}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          )}

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Usuario o Correo Electrónico
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Ej: dakar.auto o tu@email.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Panel de Vendedores</span>
              </button>
            </form>
          )}

          {/* 2. Demo User Fast-Switcher */}
          {mode === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Selecciona un asesor o gerente para probar el sistema de carga y atención inmediata con sus credenciales:
              </p>
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => handleDemoSelect(u)}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center justify-between text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-300"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">{u.name}</p>
                          <span className="text-[10px] text-blue-700 font-mono font-bold">@{u.username}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {u.agencyName} • {u.role === 'seller' ? 'Vendedor' : 'Gerente'}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-700 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Register New Seller */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ej: Marcelo Castro"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Usuario *</label>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="marcelo.castro"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contraseña *</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="tu@agencia.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">WhatsApp de Atención</label>
                  <input
                    type="text"
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="5491148905501"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Concesionaria</label>
                  <select
                    value={regAgencyId}
                    onChange={(e) => setRegAgencyId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-600 font-semibold"
                  >
                    {agencies.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-3"
              >
                <UserPlus className="w-4 h-4" />
                <span>Registrar y Comenzar a Cargar Autos</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
