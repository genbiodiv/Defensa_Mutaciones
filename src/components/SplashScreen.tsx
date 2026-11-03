import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Dna, 
  Compass, 
  BookOpen, 
  Network, 
  ArrowRight, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Microscope,
  CheckCircle2
} from 'lucide-react';

interface SplashScreenProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ isOpen, onClose }) => {
  const { 
    themeMode, 
    isHighContrast, 
    setActiveSpace, 
    selectScenario, 
    setRoundStage 
  } = useApp();

  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  if (!isOpen) return null;

  const isLight = themeMode === 'light';

  const handleStartInvestigation = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('splash_dismissed', 'true');
    }
    selectScenario('escenario_1_uv');
    setRoundStage(1);
    setActiveSpace('exploration');
    onClose();
  };

  const handleReadTheory = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('splash_dismissed', 'true');
    }
    setActiveSpace('log');
    onClose();
  };

  const handleBuildGraph = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('splash_dismissed', 'true');
    }
    setActiveSpace('graph_builder');
    onClose();
  };

  const handleClose = () => {
    if (dontShowAgain) {
      sessionStorage.setItem('splash_dismissed', 'true');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto backdrop-blur-md bg-slate-950/80 animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-5xl rounded-3xl border shadow-2xl overflow-hidden transition-all my-auto ${
          isLight 
            ? 'bg-white border-slate-200 shadow-slate-900/20 text-slate-800' 
            : 'bg-slate-900 border-slate-700/80 shadow-black/80 text-slate-100'
        }`}
      >
        {/* Top Bar with Dismiss */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/60 border-slate-800'
        }`}>
          <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Laboratorio Virtual de Biología Molecular</span>
          </div>

          <button
            onClick={handleClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight 
                ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-200' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Cerrar introducción e ir al panel general"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase border bg-cyan-50 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span>Bienvenido a la Plataforma Científica</span>
            </div>

            <h1 className={`text-2xl sm:text-4xl font-black tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              DEFENSA CONTRA MUTACIONES INDESEADAS
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              Cada día, el genoma de cada una de tus células experimenta decenas de miles de agresiones químicas, 
              radiaciones y fallos de replicación. ¿Cómo reconoce una célula una base oxidada frente a una fractura bicatenaria 
              o una distorsión voluminosa? ¿Qué vía enzimática activa para salvar la vida celular y qué ocurre si falla?
            </p>

            <p className={`text-[11px] sm:text-xs font-mono font-medium ${
              isLight ? 'text-cyan-800' : 'text-cyan-400'
            }`}>
              Selecciona cómo deseas comenzar tu experiencia de aprendizaje:
            </p>
          </div>

          {/* 3 Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            {/* OPTION 1: Iniciar la Investigación */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group hover:-translate-y-1 hover:shadow-xl ${
              isLight 
                ? 'bg-gradient-to-b from-cyan-50/60 to-white border-cyan-200 hover:border-cyan-400 shadow-sm' 
                : 'bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/40 border-slate-800 hover:border-cyan-500 shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-700 dark:text-cyan-400 font-bold block">
                    Paso a Paso Interactivo
                  </span>
                  <h3 className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    1. Iniciar la Investigación
                  </h3>
                </div>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Resuelve casos guiados basados en problemas reales (radiación UV solar, estrés oxidativo, desaminación espontánea, roturas DSB y CRISPR).
                </p>

                <ul className="space-y-1.5 text-[11px] font-mono pt-1">
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Inspecciona el ADN dañado</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Diseña la estrategia enzimática</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>Simula y prueba perturbaciones</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5">
                <button
                  onClick={handleStartInvestigation}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono shadow-md flex items-center justify-center gap-2 group-hover:gap-2.5 transition-all"
                >
                  <span>Iniciar Caso #1 (UV)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 2: Leer sobre el Tema */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group hover:-translate-y-1 hover:shadow-xl ${
              isLight 
                ? 'bg-gradient-to-b from-teal-50/60 to-white border-teal-200 hover:border-teal-400 shadow-sm' 
                : 'bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950/40 border-slate-800 hover:border-teal-500 shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-600/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-teal-700 dark:text-teal-400 font-bold block">
                    Fundamentos & Manual
                  </span>
                  <h3 className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    2. Leer sobre el Tema
                  </h3>
                </div>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Consulta el manual oficial en 7 capítulos con toda la teoría necesaria para comprender y resolver cualquier problema biológico.
                </p>

                <ul className="space-y-1.5 text-[11px] font-mono pt-1">
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Los 5 mecanismos canónicos (BER, NER, MMR, NHEJ, HR)</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Árbol diagnóstico de 4 preguntas clave</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>Correlaciones clínicas (Lynch, Xeroderma, PARP)</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5">
                <button
                  onClick={handleReadTheory}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold font-mono shadow-md flex items-center justify-center gap-2 group-hover:gap-2.5 transition-all"
                >
                  <span>Abrir Material de Consulta</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* OPTION 3: Generar un Esquema */}
            <div className={`p-5 rounded-2xl border flex flex-col justify-between transition-all group hover:-translate-y-1 hover:shadow-xl ${
              isLight 
                ? 'bg-gradient-to-b from-indigo-50/60 to-white border-indigo-200 hover:border-indigo-400 shadow-sm' 
                : 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border-slate-800 hover:border-indigo-500 shadow-md'
            }`}>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Network className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-700 dark:text-indigo-400 font-bold block">
                    Modelo Causal Interactivo
                  </span>
                  <h3 className={`text-base font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    3. Generar un Esquema
                  </h3>
                </div>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Construye y conecta tu propia red conceptual de relaciones biológicas en el lienzo interactivo del laboratorio.
                </p>

                <ul className="space-y-1.5 text-[11px] font-mono pt-1">
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Conecta fuentes, lesiones y enzimas</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Añade condiciones y consecuencias</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Evaluación automática con rúbrica de 10 pts</span>
                  </li>
                </ul>
              </div>

              <div className="pt-5">
                <button
                  onClick={handleBuildGraph}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold font-mono shadow-md flex items-center justify-center gap-2 group-hover:gap-2.5 transition-all"
                >
                  <span>Construir Esquema</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Dismissal and Preferences */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
              />
              <span className="text-[11px]">No mostrar automáticamente al inicio de esta sesión</span>
            </label>

            <button
              onClick={handleClose}
              className={`px-4 py-1.5 rounded-xl font-mono text-xs font-semibold transition-colors border ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              Explorar Panel Principal →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
