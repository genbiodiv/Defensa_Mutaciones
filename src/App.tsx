import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeSpace } from './components/spaces/HomeSpace';
import { GuidedInvestigationSpace } from './components/spaces/GuidedInvestigationSpace';
import { ReferenceMaterialSpace } from './components/spaces/ReferenceMaterialSpace';
import { GraphBuilderSpace } from './components/spaces/GraphBuilderSpace';
import { TeacherSpace } from './components/spaces/TeacherSpace';
import { ReferenceGlossaryModal } from './components/spaces/ReferenceGlossaryModal';
import { SplashScreen } from './components/SplashScreen';
import { Dna } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeSpace, 
    isProjectorMode, 
    profile, 
    setStudentName,
    themeMode,
    isHighContrast,
    fontSizeScale,
    teacherNotification,
    setTeacherNotification,
    showSplashScreen,
    setShowSplashScreen
  } = useApp();

  const themeClass = themeMode === 'light' ? 'theme-light' : 'theme-dark';
  const contrastClass = isHighContrast ? 'high-contrast-bw' : '';
  const fontClass = `font-scale-${fontSizeScale}`;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${themeClass} ${contrastClass} ${fontClass} ${
      isProjectorMode ? 'contrast-125' : ''
    } ${themeMode === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'}`}>
      <Navbar />

      {/* Welcome Splash Screen Modal */}
      <SplashScreen 
        isOpen={showSplashScreen} 
        onClose={() => setShowSplashScreen(false)} 
      />

      {/* Floating Teacher Mode Unlocked Toast */}
      {teacherNotification && (
        <div className="fixed top-16 right-4 z-[999] bg-indigo-600 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-indigo-300 font-mono text-xs flex items-center gap-3 animate-pulse">
          <span className="text-base">🎓</span>
          <span className="font-bold">{teacherNotification}</span>
          <button 
            onClick={() => setTeacherNotification(null)}
            className="text-indigo-200 hover:text-white font-bold ml-1"
          >
            ✕
          </button>
        </div>
      )}

      <main className="flex-1 pb-16">
        {activeSpace === 'home' && <HomeSpace />}
        {(activeSpace === 'exploration' || activeSpace === 'repair_lab' || activeSpace === 'perturbation') && (
          <GuidedInvestigationSpace />
        )}
        {activeSpace === 'log' && <ReferenceMaterialSpace />}
        {activeSpace === 'graph_builder' && <GraphBuilderSpace />}
        {activeSpace === 'teacher' && <TeacherSpace />}
        {activeSpace === 'references' && <ReferenceGlossaryModal />}
      </main>

      {/* Laboratory Academic Footer */}
      <footer className={`border-t py-5 px-4 text-xs font-mono select-none transition-colors ${
        themeMode === 'light' 
          ? 'bg-white border-slate-200 text-slate-600' 
          : 'bg-slate-950 border-slate-900 text-slate-500'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 font-bold ${themeMode === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>
              <Dna className={`w-4 h-4 ${themeMode === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`} />
              <span>DEFENSA CONTRA MUTACIONES INDESEADAS</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Grupo:</span>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setStudentName(e.target.value)}
                title="Haz clic para editar tu nombre o grupo"
                className={`px-2 py-0.5 rounded border font-sans focus:outline-none w-36 text-xs transition-colors ${
                  themeMode === 'light'
                    ? 'bg-slate-100 border-slate-300 text-slate-800 focus:border-cyan-600'
                    : 'bg-slate-900 border-slate-800 text-slate-300 focus:border-cyan-500'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Biología Molecular Médica</span>
            <span>•</span>
            <span className={themeMode === 'light' ? 'text-slate-500' : 'text-slate-400'}>Aprendizaje Basado en Problemas</span>
            <span>•</span>
            <span className={themeMode === 'light' ? 'text-teal-700 font-semibold' : 'text-teal-400 font-medium'}>10 Casos Progresivos</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
