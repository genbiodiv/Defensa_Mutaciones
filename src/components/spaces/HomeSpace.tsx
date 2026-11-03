import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  RotateCcw, 
  Network, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  BookOpen,
  Dna,
  ShieldCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Flame
} from 'lucide-react';

export const HomeSpace: React.FC = () => {
  const { 
    setActiveSpace, 
    selectScenario, 
    allScenarios, 
    coreScenarios,
    additionalScenarios,
    profile, 
    currentScenario,
    setRoundStage,
    themeMode,
    setShowSplashScreen 
  } = useApp();

  const [showAdditional, setShowAdditional] = useState<boolean>(false);
  const isLight = themeMode === 'light';

  const handleStartActiveScenario = () => {
    setRoundStage(1);
    setActiveSpace('exploration');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10 select-none">
      
      {/* Serene Hero Header */}
      <div className="text-center space-y-3 pt-2">
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
          isLight 
            ? 'bg-cyan-50 border-cyan-200 text-cyan-800' 
            : 'bg-cyan-950/80 border-cyan-800/80 text-cyan-300'
        }`}>
          <Sparkles className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
          <span>Laboratorio de Biología Molecular • Medicina</span>
        </div>

        <h1 className={`text-3xl sm:text-5xl font-black tracking-tight ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          DEFENSA CONTRA MUTACIONES INDESEADAS
        </h1>

        <p className={`text-sm sm:text-base font-light max-w-2xl mx-auto italic leading-relaxed ${
          isLight ? 'text-slate-700' : 'text-slate-300'
        }`}>
          &laquo;Cada día, el ADN de tus células experimenta miles de alteraciones. ¿Cómo consigue una célula preservar su información genética?&raquo;
        </p>

        <p className={`text-xs max-w-xl mx-auto leading-relaxed ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}>
          Aprende de forma incremental a través de 6 pasos guiados: desde el caso clínico y la inspección del ADN dañado, hasta el diseño molecular, la simulación y las perturbaciones celulares.
        </p>

        <div className="pt-1 flex items-center justify-center">
          <button
            onClick={() => setShowSplashScreen(true)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold border transition-all hover:scale-105 active:scale-95 ${
              isLight
                ? 'bg-white hover:bg-cyan-50 border-cyan-300 text-cyan-900 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-800 border-cyan-800 text-cyan-300 shadow-md'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>¿Primera vez? Ver guía de introducción y opciones de inicio →</span>
          </button>
        </div>
      </div>

      {/* Featured Active Mission Card */}
      <div className={`p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden space-y-5 border transition-colors ${
        isLight
          ? 'bg-gradient-to-br from-white via-cyan-50/40 to-teal-50/50 border-cyan-200 text-slate-800 shadow-slate-200/50'
          : 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 border-cyan-700/60 text-slate-200 shadow-2xl'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
          isLight ? 'border-cyan-100' : 'border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider ${
            isLight ? 'text-cyan-800' : 'text-cyan-400'
          }`}>
            <Dna className="w-4 h-4" />
            <span>Misión Científica Activa: Caso #{currentScenario.number}</span>
          </div>

          <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
            isLight 
              ? 'text-slate-600 bg-white border-slate-200 shadow-sm' 
              : 'text-slate-400 bg-slate-950 border-slate-800'
          }`}>
            {profile.completedScenarioIds.includes(currentScenario.id) ? '✓ Ya explorado' : 'Pendiente de resolución'}
          </span>
        </div>

        <div className="space-y-2">
          <h2 className={`text-xl sm:text-2xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {currentScenario.title}
          </h2>
          <p className={`text-xs sm:text-sm leading-relaxed max-w-3xl ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {currentScenario.initialContext}
          </p>
        </div>

        {/* 6 Steps Roadmap Preview */}
        <div className={`p-3.5 rounded-2xl border space-y-2 ${
          isLight ? 'bg-white/80 border-cyan-100 shadow-sm' : 'bg-slate-950/70 border-slate-800/80'
        }`}>
          <span className={`text-[10px] font-mono uppercase tracking-wider block font-semibold ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Ruta Incremental en 6 Pasos:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs font-mono text-center">
            {['1. Caso & Hipótesis', '2. ADN Dañado', '3. Estrategia', '4. Simulación', '5. Perturbación', '6. Consulta'].map((label, idx) => (
              <div 
                key={idx} 
                className={`p-2 rounded-lg border font-medium ${
                  isLight 
                    ? 'bg-cyan-50/70 border-cyan-200/80 text-cyan-900' 
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
          <div className={`text-xs font-mono space-y-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            <div>
              <span>Ruta Principal: </span>
              <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}>
                {profile.completedScenarioIds.filter(id => coreScenarios.some(cs => cs.id === id)).length}
              </strong> de 5 casos
            </div>
            <div className="text-[11px] opacity-80">
              <span>Casos Adicionales: </span>
              <strong className={isLight ? 'text-slate-900 font-semibold' : 'text-white font-semibold'}>
                {profile.completedScenarioIds.filter(id => additionalScenarios.some(as => as.id === id)).length}
              </strong> de 5 completados
            </div>
          </div>

          <button
            onClick={handleStartActiveScenario}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-500 hover:from-cyan-500 hover:to-teal-400 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-xl shadow-cyan-900/30 flex items-center gap-2.5 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Iniciar Investigación Guiada (Paso a Paso)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 1. Core Scenarios Catalog (Clean, un-overwhelming 5 primary cases) */}
      <div className="space-y-4">
        <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <h3 className={`text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Ruta Principal: 5 Casos Fundamentales</span>
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Los 5 mecanismos canónicos de reparación del ADN: NER, BER, MMR, NHEJ y HR
            </p>
          </div>
          <span className={`text-xs font-mono font-semibold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
            Paso a paso progresivo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {coreScenarios.map(sc => {
            const isCurrent = sc.id === currentScenario.id;
            const isDone = profile.completedScenarioIds.includes(sc.id);

            return (
              <div
                key={sc.id}
                onClick={() => {
                  selectScenario(sc.id);
                  setRoundStage(1);
                  setActiveSpace('exploration');
                }}
                className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                  isCurrent
                    ? isLight
                      ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-400/40 shadow-sm'
                      : 'bg-cyan-950/50 border-cyan-500 ring-1 ring-cyan-500/40 shadow-md'
                    : isDone
                    ? isLight
                      ? 'bg-emerald-50/50 border-emerald-300 hover:bg-emerald-50'
                      : 'bg-slate-900/80 border-emerald-900/60 hover:border-slate-700'
                    : isLight
                    ? 'bg-white border-slate-200 hover:border-cyan-300 hover:bg-slate-50 shadow-sm'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                    <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                      CASO #{sc.number}
                    </span>
                    {isDone ? (
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${
                        isLight 
                          ? 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold' 
                          : 'text-emerald-300 bg-emerald-950 border-emerald-800'
                      }`}>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completado</span>
                      </span>
                    ) : (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isLight ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}>
                        Principal
                      </span>
                    )}
                  </div>
                  <h4 className={`font-bold text-xs leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {sc.title}
                  </h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                    {sc.damageSourceName}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                  isLight ? 'border-slate-100 text-cyan-700' : 'border-slate-800/80 text-cyan-400'
                }`}>
                  <span className="truncate max-w-[130px]">{sc.organism.split('(')[0]}</span>
                  <span className="font-bold">Explorar →</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Additional & Specialized Cases Section */}
      <div className={`p-5 rounded-3xl border transition-colors space-y-4 ${
        isLight 
          ? 'bg-slate-100/70 border-slate-200 shadow-sm' 
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase ${
                isLight ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-purple-950/80 text-purple-300 border-purple-800'
              }`}>
                Profundización
              </span>
              <h3 className={`text-sm font-bold font-mono uppercase tracking-wider ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                Casos Adicionales y Especializados ({additionalScenarios.length})
              </h3>
            </div>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Desaminación a Uracilo, Reversión MGMT, Aductos por humo de tabaco, Fotoliasa evolutiva y Edición CRISPR-Cas9
            </p>
          </div>

          <button
            onClick={() => setShowAdditional(!showAdditional)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-colors ${
              isLight 
                ? 'bg-white border-slate-300 text-purple-800 hover:bg-slate-50' 
                : 'bg-slate-950 border-purple-800/80 text-purple-300 hover:bg-slate-900'
            }`}
          >
            <span>{showAdditional ? 'Ocultar Casos Adicionales' : 'Ver 5 Casos Adicionales'}</span>
            {showAdditional ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showAdditional && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
            {additionalScenarios.map(sc => {
              const isCurrent = sc.id === currentScenario.id;
              const isDone = profile.completedScenarioIds.includes(sc.id);

              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    selectScenario(sc.id);
                    setRoundStage(1);
                    setActiveSpace('exploration');
                  }}
                  className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all flex flex-col justify-between ${
                    isCurrent
                      ? isLight
                        ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-400/40 shadow-sm'
                        : 'bg-purple-950/50 border-purple-500 ring-1 ring-purple-500/40 shadow-md'
                      : isDone
                      ? isLight
                        ? 'bg-emerald-50/50 border-emerald-300 hover:bg-emerald-50'
                        : 'bg-slate-900/80 border-emerald-900/60 hover:border-slate-700'
                      : isLight
                      ? 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50 shadow-sm'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[11px]">
                      <span className={`font-bold ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>
                        CASO #{sc.number}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        isDone
                          ? isLight 
                            ? 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold' 
                            : 'text-emerald-300 bg-emerald-950 border-emerald-800'
                          : isLight 
                          ? 'bg-purple-50 border-purple-200 text-purple-700' 
                          : 'bg-purple-950/60 border-purple-900 text-purple-300'
                      }`}>
                        {isDone ? '✓ Hecho' : 'Adicional'}
                      </span>
                    </div>
                    <h4 className={`font-bold text-xs leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {sc.title}
                    </h4>
                    <p className={`text-[11px] mt-1 line-clamp-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                      {sc.damageSourceName}
                    </p>
                  </div>

                  <div className={`mt-3 pt-2 border-t flex items-center justify-between text-[10px] font-mono ${
                    isLight ? 'border-slate-100 text-purple-700' : 'border-slate-800/80 text-purple-400'
                  }`}>
                    <span className="truncate max-w-[130px]">{sc.organism.split('(')[0]}</span>
                    <span className="font-bold">Iniciar adicional →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Two Secondary Hub Cards: Material de Consulta & Constructor */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Material de Consulta Card */}
        <div 
          onClick={() => setActiveSpace('log')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group text-xs space-y-2 shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-teal-400 hover:shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-teal-700/80'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-teal-100 text-teal-700' : 'bg-teal-500/20 text-teal-400'
          }`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900 group-hover:text-teal-700' : 'text-white group-hover:text-teal-300'}`}>
            Material de Consulta por Capítulos
          </h3>
          <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Guía teórica y práctica completa dividida en 7 capítulos: enzimología paso a paso, árboles de decisión diagnóstica y correlaciones clínicas para resolver todos los casos.
          </p>
        </div>

        {/* Constructor de Modelos Card */}
        <div 
          onClick={() => setActiveSpace('graph_builder')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group text-xs space-y-2 shadow-sm ${
            isLight
              ? 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md'
              : 'bg-slate-900 border-slate-800 hover:border-indigo-700/80'
          }`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
            isLight ? 'bg-indigo-100 text-indigo-700' : 'bg-indigo-500/20 text-indigo-400'
          }`}>
            <Network className="w-5 h-5" />
          </div>
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900 group-hover:text-indigo-700' : 'text-white group-hover:text-indigo-300'}`}>
            Constructor de Modelos Gráficos
          </h3>
          <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Construye la red causal de decisiones celulares conectando fuentes, lesiones, mecanismos y condiciones con rúbrica de 10 puntos.
          </p>
        </div>
      </div>

      {/* Teacher Mode Secret Access Notice */}
      <div className={`text-center pt-2 text-[11px] font-mono transition-colors opacity-60 ${
        isLight ? 'text-slate-500' : 'text-slate-400'
      }`}>
        <span className="inline-flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Acceso Docente: presiona 5 veces seguidas la letra &apos;H&apos;</span>
        </span>
      </div>

    </div>
  );
};
