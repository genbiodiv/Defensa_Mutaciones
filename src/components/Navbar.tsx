import React from 'react';
import { useApp } from '../context/AppContext';
import { SpaceId } from '../data/types';
import { 
  Compass, 
  BookOpen, 
  Network, 
  GraduationCap, 
  Award, 
  Tv, 
  Library, 
  Dna, 
  ChevronRight,
  HelpCircle,
  RotateCcw
} from 'lucide-react';
import { AppearanceToolbar } from './AppearanceToolbar';

export const Navbar: React.FC = () => {
  const { 
    activeSpace, 
    setActiveSpace, 
    profile, 
    resetPoints,
    isTeacherMode, 
    setIsTeacherMode, 
    isProjectorMode, 
    setIsProjectorMode,
    currentScenario,
    roundStage,
    themeMode,
    setShowSplashScreen
  } = useApp();

  const isLight = themeMode === 'light';

  const mainTabs: { id: SpaceId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'exploration', label: 'Investigación Guiada', icon: Compass },
    { id: 'log', label: 'Material de Consulta', icon: BookOpen },
    { id: 'graph_builder', label: 'Constructor de Modelos', icon: Network }
  ];

  const stageLabels = [
    '',
    '1. El Caso',
    '2. El ADN',
    '3. Estrategia',
    '4. Simulación',
    '5. Perturbación',
    '6. Conclusión'
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b px-4 py-2.5 transition-colors select-none ${
      isLight 
        ? 'bg-white/95 border-slate-200 shadow-sm text-slate-800' 
        : 'bg-slate-950/95 border-cyan-950/80 shadow-xl text-white'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveSpace('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-950/30 group-hover:scale-105 transition-transform shrink-0">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center transition-colors ${
              isLight ? 'bg-white' : 'bg-slate-950'
            }`}>
              <Dna className={`w-5 h-5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
            </div>
          </div>
          <div>
            <span className={`text-[10px] font-mono tracking-widest block uppercase font-bold leading-none ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              Lab de Biología Molecular
            </span>
            <span className={`text-sm font-extrabold tracking-tight transition-colors ${
              isLight ? 'text-slate-900 group-hover:text-cyan-700' : 'text-white group-hover:text-cyan-200'
            }`}>
              DEFENSA CONTRA MUTACIONES INDESEADAS
            </span>
          </div>
        </button>

        {/* 3 Main Focused Navigation Tabs */}
        <nav className={`hidden md:flex items-center gap-1.5 p-1 rounded-xl border transition-colors ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-900/90 border-slate-800'
        }`}>
          {mainTabs.map(item => {
            const Icon = item.icon;
            const isActive = activeSpace === item.id || 
              (item.id === 'exploration' && (activeSpace === 'repair_lab' || activeSpace === 'perturbation'));

            return (
              <button
                key={item.id}
                onClick={() => setActiveSpace(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/30 font-semibold'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/80'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.id === 'exploration' && activeSpace === 'exploration' && (
                  <span className={`ml-1 px-1.5 py-0.2 rounded font-mono text-[10px] border ${
                    isLight 
                      ? 'bg-cyan-100 text-cyan-800 border-cyan-300' 
                      : 'bg-cyan-950/90 text-cyan-300 border-cyan-700/60'
                  }`}>
                    {stageLabels[roundStage]}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Tools: Appearance (Theme, Font), Reference glossary, Points, Teacher Mode */}
        <div className="flex items-center gap-2">
          {/* Appearance Toolbar: Dark/Light, Font Size */}
          <AppearanceToolbar />

          {/* Glossary Button */}
          <button
            onClick={() => setActiveSpace('references')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              activeSpace === 'references'
                ? isLight
                  ? 'bg-teal-100 text-teal-800 border-teal-300'
                  : 'bg-teal-950 text-teal-300 border-teal-700'
                : isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Glosario y Bibliografía Universitaria"
          >
            <Library className={`w-3.5 h-3.5 ${isLight ? 'text-teal-700' : 'text-teal-400'}`} />
            <span className="hidden sm:inline">Glosario</span>
          </button>

          {/* Points / Score Badge with quick reset */}
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-mono text-xs transition-colors ${
            isLight
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-slate-900 border-amber-900/40 text-amber-300'
          }`}>
            <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="font-bold">{profile.totalScore}</span>
            <span className={`text-[10px] ${isLight ? 'text-amber-700' : 'text-amber-500/80'}`}>PTS</span>
            {profile.totalScore > 0 && (
              <button
                onClick={resetPoints}
                className={`p-0.5 rounded hover:bg-amber-200/60 dark:hover:bg-amber-900/60 text-amber-600 dark:text-amber-400 transition-colors ml-0.5`}
                title="Reiniciar contador de puntos (0 PTS)"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Splash Screen Opener */}
          <button
            onClick={() => setShowSplashScreen(true)}
            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1.5 ${
              isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:text-cyan-800 hover:border-cyan-400'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-cyan-300 hover:border-cyan-600'
            }`}
            title="Abrir Guía de Bienvenida e Introducción"
          >
            <HelpCircle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span className="hidden xl:inline text-[11px] font-mono font-semibold">Introducción</span>
          </button>

          {/* Projector Mode Toggle */}
          <button
            onClick={() => setIsProjectorMode(!isProjectorMode)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isProjectorMode
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold'
                : isLight
                ? 'bg-slate-100 text-slate-600 border-slate-300 hover:text-slate-900'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Modo Proyector de Aula (Alto contraste y tipografía grande)"
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Teacher Mode: Only visible when unlocked via 5x 'h' shortcut */}
          {isTeacherMode && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-600 text-white border border-indigo-400 shadow-md text-xs font-semibold">
              <button
                onClick={() => setActiveSpace('teacher')}
                className="flex items-center gap-1.5 hover:underline"
                title="Ir al Panel de Control Docente"
              >
                <GraduationCap className="w-4 h-4 text-white" />
                <span className="hidden sm:inline">Modo Docente</span>
              </button>
              <button
                onClick={() => {
                  setIsTeacherMode(false);
                  setActiveSpace('home');
                }}
                className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-indigo-800 hover:bg-indigo-900 text-indigo-100"
                title="Salir del Modo Docente y volver a vista de estudiante"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Bar */}
      <div className={`md:hidden flex items-center justify-between gap-1 overflow-x-auto pt-2 mt-2 border-t text-xs ${
        isLight ? 'border-slate-200' : 'border-slate-900'
      }`}>
        {mainTabs.map(item => {
          const Icon = item.icon;
          const isActive = activeSpace === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSpace(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md shrink-0 ${
                isActive 
                  ? 'bg-cyan-600 text-white font-semibold' 
                  : isLight 
                  ? 'text-slate-600' 
                  : 'text-slate-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
