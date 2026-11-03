import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FontSizeScale } from '../data/types';
import { 
  Sun, 
  Moon, 
  Minus, 
  Plus,
  Contrast 
} from 'lucide-react';

export const AppearanceToolbar: React.FC = () => {
  const {
    themeMode,
    toggleThemeMode,
    isHighContrast,
    toggleHighContrast,
    fontSizeScale,
    setFontSizeScale,
    increaseFontSize,
    decreaseFontSize
  } = useApp();

  const [showFontMenu, setShowFontMenu] = useState<boolean>(false);

  const fontLabels: Record<FontSizeScale, { name: string; tag: string; percent: string }> = {
    sm: { name: 'Compacta', tag: 'A-', percent: '85%' },
    base: { name: 'Normal', tag: 'A', percent: '100%' },
    lg: { name: 'Grande', tag: 'A+', percent: '120%' },
    xl: { name: 'Extra', tag: 'A++', percent: '140%' }
  };

  const isLight = themeMode === 'light';

  return (
    <div className={`flex items-center gap-1.5 p-1 rounded-xl border shadow-sm transition-colors ${
      isLight 
        ? 'bg-slate-100/90 border-slate-300 text-slate-800' 
        : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
    }`}>
      
      {/* 1. Dark / Light Mode Toggle Button */}
      <button
        onClick={toggleThemeMode}
        title={isLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
        className={`p-1.5 rounded-lg transition-colors flex items-center gap-1.5 font-medium ${
          isLight
            ? 'hover:bg-slate-200 text-slate-700 hover:text-slate-900'
            : 'hover:bg-slate-800 text-slate-300 hover:text-amber-300'
        }`}
      >
        {isLight ? (
          <Moon className="w-4 h-4 text-cyan-600" />
        ) : (
          <Sun className="w-4 h-4 text-amber-400" />
        )}
        <span className="text-[11px] font-mono font-bold hidden xl:inline">
          {isLight ? 'Oscuro' : 'Claro'}
        </span>
      </button>

      <span className={`w-px h-4 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      {/* Alto Contraste B/N Toggle */}
      <button
        onClick={toggleHighContrast}
        title={isHighContrast ? 'Desactivar Modo Blanco y Negro' : 'Activar Modo Alto Contraste (Blanco y Negro)'}
        className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-1 font-medium text-xs ${
          isHighContrast
            ? 'bg-black text-white dark:bg-white dark:text-black font-extrabold ring-1 ring-black dark:ring-white'
            : isLight
            ? 'hover:bg-slate-200 text-slate-700'
            : 'hover:bg-slate-800 text-slate-300'
        }`}
      >
        <Contrast className="w-3.5 h-3.5" />
        <span className="text-[11px] font-mono font-bold hidden sm:inline">
          {isHighContrast ? 'B/N' : 'B/N'}
        </span>
      </button>

      <span className={`w-px h-4 ${isLight ? 'bg-slate-300' : 'bg-slate-700'}`} />

      {/* 2. Font Size Scaling: A- / A / A+ */}
      <div className="relative flex items-center gap-0.5">
        <button
          onClick={decreaseFontSize}
          disabled={fontSizeScale === 'sm'}
          title="Disminuir tamaño de letra (A-)"
          className={`p-1 rounded-md transition-all ${
            fontSizeScale === 'sm'
              ? 'opacity-30 cursor-not-allowed text-slate-400'
              : isLight
              ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95'
          }`}
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setShowFontMenu(!showFontMenu)}
          title={`Tamaño actual: ${fontLabels[fontSizeScale].name} (${fontLabels[fontSizeScale].percent}). Haz clic para elegir tamaño.`}
          className={`px-2 py-0.5 text-[11px] font-mono font-bold rounded-lg transition-all flex items-center gap-1 border ${
            isLight
              ? 'bg-white border-slate-300 text-cyan-800 hover:bg-cyan-50 hover:border-cyan-400'
              : 'bg-slate-950 border-slate-700 text-cyan-300 hover:bg-slate-800 hover:border-cyan-600'
          }`}
        >
          <span>{fontLabels[fontSizeScale].tag}</span>
          <span className="opacity-70 text-[9px] hidden sm:inline font-normal">
            {fontLabels[fontSizeScale].percent}
          </span>
        </button>

        <button
          onClick={increaseFontSize}
          disabled={fontSizeScale === 'xl'}
          title="Aumentar tamaño de letra (A+)"
          className={`p-1 rounded-md transition-all ${
            fontSizeScale === 'xl'
              ? 'opacity-30 cursor-not-allowed text-slate-400'
              : isLight
              ? 'text-slate-700 hover:text-slate-950 hover:bg-slate-200 active:scale-95'
              : 'text-slate-300 hover:text-white hover:bg-slate-800 active:scale-95'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
        </button>

        {/* Font size dropdown */}
        {showFontMenu && (
          <div className={`absolute right-0 top-full mt-2 w-44 border rounded-2xl shadow-2xl p-1.5 z-50 text-xs backdrop-blur-md ${
            isLight
              ? 'bg-white/98 border-slate-300 text-slate-800 shadow-slate-900/10'
              : 'bg-slate-900/98 border-slate-700 text-slate-200 shadow-black/50'
          }`}>
            <span className={`text-[10px] font-mono uppercase px-2.5 py-1 block font-bold ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}>
              Tamaño de Letra
            </span>
            {(['sm', 'base', 'lg', 'xl'] as FontSizeScale[]).map(s => (
              <button
                key={s}
                onClick={() => {
                  setFontSizeScale(s);
                  setShowFontMenu(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all ${
                  fontSizeScale === s
                    ? isLight
                      ? 'bg-cyan-100 text-cyan-900 font-bold border border-cyan-300'
                      : 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                    : isLight
                    ? 'text-slate-700 hover:bg-slate-100'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-xs">{fontLabels[s].tag}</span>
                  <span>{fontLabels[s].name}</span>
                </div>
                <span className="font-mono text-[10px] opacity-75 font-semibold">
                  {fontLabels[s].percent}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
