import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Car,
  PlusCircle,
  Bot,
  CheckCircle2,
  X,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react';

interface AgencyOnboardingTutorialProps {
  onOpenNewCarModal: () => void;
  agencyName: string;
}

const STORAGE_TUTORIAL_KEY = 'micarro_agency_onboarding_session_seen';

export const AgencyOnboardingTutorial: React.FC<AgencyOnboardingTutorialProps> = ({
  onOpenNewCarModal,
  agencyName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    try {
      const isCompleted = sessionStorage.getItem(STORAGE_TUTORIAL_KEY);
      if (!isCompleted) {
        // Automatically open for agency visitors after a short delay
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {
      // SessionStorage error fallback
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(STORAGE_TUTORIAL_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleLaunchCarModal = () => {
    handleClose();
    onOpenNewCarModal();
  };

  const steps = [
    {
      title: '¡Bienvenido al Portal de Agencia!',
      subtitle: `Guía rápida para la gestión del inventario de ${agencyName}`,
      icon: Sparkles,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description:
        'Aprende en 3 simples pasos cómo publicar tu primer vehículo, aprovechar la IA para descripciones automáticas y compartir fichas técnicas a clientes por WhatsApp.',
      bulletPoints: [
        'Capacidad de salón controlada en tiempo real según tu plan.',
        'Herramienta de fotos con marca de agua y optimización.',
        'Generador de fichas técnicas en PDF y cotizaciones instantáneas.',
      ],
      actionLabel: 'Comenzar Tour',
    },
    {
      title: '1. El botón "+ Publicar Auto"',
      subtitle: 'Inicio de carga rápida de unidad',
      icon: PlusCircle,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      description:
        'En la esquina superior derecha de tu salón encuentras el botón azul "+ Publicar Auto". Al pulsarlo se abrirá el asistente comercial completo.',
      bulletPoints: [
        'Ingresa marca, modelo, año, kilometraje y precio (USD / Guaraníes).',
        'Asigna qué vendedor de tu equipo atenderá las consultas del auto.',
        'Define si el vehículo acepta permuta o financiación bancaria.',
      ],
      actionLabel: 'Siguiente: Fotos & IA',
    },
    {
      title: '2. Fotos y Redacción con IA',
      subtitle: 'Atrae 3x más consultas con publicaciones atractivas',
      icon: Bot,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      description:
        'Sube imágenes claras del vehículo y pulsa el botón "Generar con IA" para redactar automáticamente una descripción profesional y vendedora.',
      bulletPoints: [
        'Organiza la foto de portada arrastrando la imagen principal.',
        'La IA destaca el estado del motor, equipamiento y confort.',
        'Añade ficha técnica detallada (transmisión, combustible, potencia).',
      ],
      actionLabel: 'Siguiente: Publicar y Vender',
    },
    {
      title: '3. Salón Activo y Herramientas',
      subtitle: 'Comparte con clientes y cierra ventas',
      icon: Car,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description:
        'Una vez publicado, tu vehículo aparecerá en el catálogo general con el logo oficial de tu concesionaria y podrás generar cotizaciones en PDF.',
      bulletPoints: [
        'Botón de contacto directo por WhatsApp con mensaje prearmado.',
        'Descarga de ficha técnica formal para imprimir o enviar.',
        'Posibilidad de destacar la unidad en la portada principal.',
      ],
      actionLabel: 'Publicar Mi Primer Auto Ahora',
      isFinal: true,
    },
  ];

  const stepData = steps[currentStep];
  const IconComponent = stepData.icon;

  return (
    <>
      {/* Prominent persistent trigger button to re-open the tutorial anytime */}
      <button
        id="btn-reopen-agency-tutorial"
        onClick={() => {
          setCurrentStep(0);
          setIsOpen(true);
        }}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 hover:text-amber-200 border border-amber-400/40 transition-all shadow-md active:scale-95 group cursor-pointer backdrop-blur-md"
        title="Ver guía rápida interactiva para agencias"
      >
        <Lightbulb className="w-4 h-4 text-amber-400 group-hover:scale-110 group-hover:rotate-12 transition-transform shrink-0" />
        <span className="font-bold">Guía de Uso</span>
      </button>

      {/* Modal Dialog rendered in React Portal to avoid stacking context collisions */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <div
                id="modal-agency-onboarding"
                className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md"
                onClick={(e) => {
                  if (e.target === e.currentTarget) handleClose();
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 15 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-[1000000]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Top Banner Accent */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

                  {/* Close Button */}
                  <button
                    id="btn-close-agency-tutorial"
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Cerrar guía"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Modal Body */}
                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Header with Icon and Step indicator */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm flex-shrink-0 ${stepData.iconColor}`}
                      >
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30">
                            Paso {currentStep + 1} de {steps.length}
                          </span>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{stepData.title}</h2>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">{stepData.subtitle}</p>
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
                      <p className="text-sm text-slate-200 leading-relaxed">{stepData.description}</p>

                      <div className="space-y-2 pt-2 border-t border-slate-800/80">
                        {stepData.bulletPoints.map((point, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{point}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex items-center justify-center gap-2 pt-1">
                      {steps.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentStep(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                            idx === currentStep
                              ? 'w-8 bg-blue-500'
                              : idx < currentStep
                              ? 'w-3 bg-blue-700/60'
                              : 'w-2 bg-slate-800'
                          }`}
                          aria-label={`Ir al paso ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
                    {currentStep > 0 ? (
                      <button
                        id="btn-tutorial-prev"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Anterior</span>
                      </button>
                    ) : (
                      <button
                        id="btn-tutorial-skip"
                        onClick={handleClose}
                        className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-2 py-2 cursor-pointer"
                      >
                        Omitir tutorial
                      </button>
                    )}

                    <div className="flex items-center gap-2">
                      {stepData.isFinal ? (
                        <button
                          id="btn-tutorial-publish-first-car"
                          onClick={handleLaunchCarModal}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
                        >
                          <PlusCircle className="w-4 h-4" />
                          <span>{stepData.actionLabel}</span>
                        </button>
                      ) : (
                        <button
                          id="btn-tutorial-next"
                          onClick={() => setCurrentStep((prev) => prev + 1)}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                        >
                          <span>{stepData.actionLabel}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
