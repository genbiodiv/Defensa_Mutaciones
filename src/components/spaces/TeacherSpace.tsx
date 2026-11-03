import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PERTURBATION_CARDS } from '../../data/perturbations';
import { GraphModel } from '../../data/types';
import { DnaVisualizer } from '../DnaVisualizer';
import { 
  GraduationCap, 
  Tv, 
  Eye, 
  EyeOff, 
  Sliders, 
  RotateCcw, 
  Upload, 
  Columns, 
  Award, 
  MessageSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';

export const TeacherSpace: React.FC = () => {
  const {
    allScenarios,
    coreScenarios,
    additionalScenarios,
    currentScenario,
    selectScenario,
    activePerturbationId,
    setActivePerturbationId,
    isProjectorMode,
    setIsProjectorMode,
    largeFont,
    setLargeFont,
    graphModel,
    resetAllProgress,
    teacherScoreOverride,
    setTeacherScoreOverride,
    teacherFeedback,
    setTeacherFeedback,
    themeMode
  } = useApp();

  const isLight = themeMode === 'light';

  const [showAllAnswers, setShowAllAnswers] = useState<boolean>(false);
  const [modelA, setModelA] = useState<GraphModel | null>(graphModel);
  const [modelB, setModelB] = useState<GraphModel | null>(null);

  const fileInputARef = useRef<HTMLInputElement>(null);
  const fileInputBRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (target === 'A') setModelA(parsed);
        else setModelB(parsed);
      } catch {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 py-6 space-y-8 select-none ${largeFont ? 'text-base' : 'text-xs'}`}>
      {/* Top Banner: Teacher Mode Dashboard */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 transition-colors ${
        isLight
          ? 'bg-gradient-to-r from-indigo-50/80 via-white to-purple-50/60 border-indigo-200 text-slate-800'
          : 'bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 border-indigo-700/60 text-slate-200'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-indigo-100 text-indigo-700 border-indigo-300' : 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                isLight ? 'text-indigo-700' : 'text-indigo-400'
              }`}>
                Panel Docente y Sala de Control
              </span>
              <h1 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Gestión de Clase y Proyección Universitaria
              </h1>
            </div>
          </div>

          {/* Quick Projection Toggles */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsProjectorMode(!isProjectorMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono text-xs font-bold transition-all border ${
                isProjectorMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg font-bold'
                  : isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>Modo Proyección: {isProjectorMode ? 'ACTIVADO' : 'NORMAL'}</span>
            </button>

            <button
              onClick={() => setLargeFont(!largeFont)}
              className={`px-3 py-2 rounded-xl font-mono text-xs border transition-colors ${
                largeFont 
                  ? 'bg-indigo-600 text-white border-indigo-400' 
                  : isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
            >
              Tipografía Grande {largeFont ? 'ON' : 'OFF'}
            </button>

            <button
              onClick={() => setShowAllAnswers(!showAllAnswers)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-colors ${
                isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              {showAllAnswers ? <EyeOff className="w-4 h-4 text-indigo-500" /> : <Eye className="w-4 h-4 text-indigo-500" />}
              <span>{showAllAnswers ? 'Ocultar Fundamentos' : 'Revelar Solución'}</span>
            </button>
          </div>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${isLight ? 'text-slate-600' : 'text-indigo-200/90'}`}>
          Controla la experiencia pedagógica para las Sesiones 1 (Exploración de daños y lesiones) y 2 (Construcción y comparación de grafos). Introduce perturbaciones en vivo para formular dilemas socráticos ante el auditorio.
        </p>
      </div>

      {/* Live Classroom Discussion Box: "¿Qué pasaría si...?" */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-4 border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-indigo-900/60 text-slate-200'
      }`}>
        <div className={`flex items-center justify-between border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className={`flex items-center gap-2 font-mono font-bold uppercase text-xs ${
            isLight ? 'text-indigo-700' : 'text-indigo-400'
          }`}>
            <MessageSquare className="w-4 h-4" />
            <span>Discusión Socrática Colectiva para Proyección</span>
          </div>
          <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
            Escenario #{currentScenario.number}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scenario Selector for Teacher */}
          <div>
            <label className={`text-xs font-mono block mb-1.5 font-bold ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>
              1. Proyectar Escenario:
            </label>
            <select
              value={currentScenario.id}
              onChange={(e) => selectScenario(e.target.value)}
              className={`w-full rounded-xl p-2.5 text-xs font-mono focus:outline-none border transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-indigo-600' 
                  : 'bg-slate-950 border-slate-700 text-slate-100 focus:border-indigo-500'
              }`}
            >
              <optgroup label="── CASOS PRINCIPALES (5) ──">
                {coreScenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    Escenario #{sc.number}: {sc.title}
                  </option>
                ))}
              </optgroup>
              <optgroup label="── CASOS ADICIONALES (5) ──">
                {additionalScenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    Escenario #{sc.number}: {sc.title}
                  </option>
                ))}
              </optgroup>
            </select>
            <div className={`mt-2 text-xs leading-relaxed p-2.5 rounded-lg border ${
              isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-slate-950/60 border-slate-800 text-slate-400'
            }`}>
              {currentScenario.initialContext}
            </div>
          </div>

          {/* Live Perturbation Injector */}
          <div>
            <label className={`text-xs font-mono block mb-1.5 font-bold flex items-center gap-1.5 ${
              isLight ? 'text-indigo-700' : 'text-indigo-400'
            }`}>
              <Sliders className="w-3.5 h-3.5" />
              <span>2. Inyectar Perturbación en Vivo:</span>
            </label>
            <select
              value={activePerturbationId || ''}
              onChange={(e) => setActivePerturbationId(e.target.value || null)}
              className={`w-full rounded-xl p-2.5 text-xs font-mono focus:outline-none border transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-indigo-300 text-indigo-900 focus:border-indigo-600' 
                  : 'bg-slate-950 border-indigo-700 text-indigo-200'
              }`}
            >
              <option value="">Sin perturbación (Condición basal)</option>
              {PERTURBATION_CARDS.map(p => (
                <option key={p.id} value={p.id}>
                  Carta #{p.number}: {p.title}
                </option>
              ))}
            </select>

            {activePerturbationId && (
              <div className={`mt-2 text-xs p-2.5 rounded-lg border space-y-1 ${
                isLight 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                  : 'bg-indigo-950/50 border-indigo-800 text-indigo-200'
              }`}>
                <span className={`font-bold block ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>Pregunta al grupo:</span>
                <p className="italic">
                  &laquo;{PERTURBATION_CARDS.find(p => p.id === activePerturbationId)?.discussionQuestion}&raquo;
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Projected Lesion Visualizer */}
        <div className="pt-2">
          <DnaVisualizer
            lesionType={currentScenario.lesionTypeId}
            showLabels={true}
          />
        </div>

        {/* Revealed Scientific Justification (if toggled) */}
        {showAllAnswers && (
          <div className={`p-4 rounded-xl border text-xs space-y-2 ${
            isLight 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
          }`}>
            <span className={`font-mono font-bold uppercase block ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              Solución y Justificación Bioquímica Canónica:
            </span>
            <p className="leading-relaxed">
              Vías primarias: {currentScenario.compatibleMechanisms.map(m => m.mechanismId).join(', ')}.
            </p>
            <p className={isLight ? 'text-emerald-800' : 'text-slate-300'}>
              {currentScenario.compatibleMechanisms[0]?.scientificRationale}
            </p>
          </div>
        )}
      </div>

      {/* Model Comparison Tool (Sesión 2 - Trabajo en Tríos y Grupal) */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-4 border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Columns className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
              <span>Comparador de Modelos de Estudiantes (Fase de Consenso en Tríos)</span>
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Carga los archivos exportados por dos estudiantes para contrastar sus estructuras y discutir discrepancias.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputARef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Upload className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
              <span>Cargar Modelo A</span>
            </button>
            <input
              ref={fileInputARef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'A')}
              className="hidden"
            />

            <button
              onClick={() => fileInputBRef.current?.click()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                isLight 
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Upload className={`w-3.5 h-3.5 ${isLight ? 'text-indigo-700' : 'text-indigo-400'}`} />
              <span>Cargar Modelo B</span>
            </button>
            <input
              ref={fileInputBRef}
              type="file"
              accept=".json"
              onChange={(e) => handleFileUpload(e, 'B')}
              className="hidden"
            />
          </div>
        </div>

        {/* Side-by-Side Model Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Model A */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isLight ? 'bg-cyan-50/50 border-cyan-200' : 'bg-slate-950 border-cyan-900/60'
          }`}>
            <div className={`flex items-center justify-between font-mono font-bold ${
              isLight ? 'text-cyan-800' : 'text-cyan-400'
            }`}>
              <span>MODELO A: {modelA?.author || 'Estudiante 1'}</span>
              <span>{modelA?.nodes.length || 0} nodos / {modelA?.edges.length || 0} aristas</span>
            </div>

            <div className={`space-y-1 max-h-48 overflow-y-auto font-mono text-[11px] pr-1 ${
              isLight ? 'text-slate-700' : 'text-slate-300'
            }`}>
              {modelA?.edges.map((e, idx) => (
                <div key={idx} className={`p-1.5 rounded border ${
                  isLight ? 'bg-white border-cyan-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  {e.source} --[{e.relation}]--&gt; {e.target}
                </div>
              ))}
            </div>
          </div>

          {/* Model B */}
          <div className={`p-4 rounded-xl border space-y-3 ${
            isLight ? 'bg-indigo-50/50 border-indigo-200' : 'bg-slate-950 border-indigo-900/60'
          }`}>
            <div className={`flex items-center justify-between font-mono font-bold ${
              isLight ? 'text-indigo-800' : 'text-indigo-400'
            }`}>
              <span>MODELO B: {modelB?.author || 'Estudiante 2 (Esperando carga)'}</span>
              <span>{modelB?.nodes.length || 0} nodos / {modelB?.edges.length || 0} aristas</span>
            </div>

            {modelB ? (
              <div className={`space-y-1 max-h-48 overflow-y-auto font-mono text-[11px] pr-1 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                {modelB.edges.map((e, idx) => (
                  <div key={idx} className={`p-1.5 rounded border ${
                    isLight ? 'bg-white border-indigo-200' : 'bg-slate-900 border-slate-800'
                  }`}>
                    {e.source} --[{e.relation}]--&gt; {e.target}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center py-10 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>
                Carga el archivo JSON del segundo estudiante para ver la comparación.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Manual Grade Adjustment & Teacher Feedback */}
      <div className={`rounded-2xl p-6 shadow-xl space-y-4 border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <h3 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Award className="w-4 h-4 text-amber-500" />
          <span>Ajuste de Calificación y Retroalimentación Cualitativa</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className={`block mb-1 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Calificación Docente (0 - 10 pts):
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              value={teacherScoreOverride !== undefined ? teacherScoreOverride : ''}
              onChange={(e) => setTeacherScoreOverride(e.target.value ? parseFloat(e.target.value) : undefined)}
              placeholder="Automática por rúbrica"
              className={`w-full p-2.5 rounded-xl font-mono focus:outline-none border transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600' 
                  : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>

          <div className="md:col-span-2">
            <label className={`block mb-1 font-mono ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Observaciones y feedback para el grupo:
            </label>
            <input
              type="text"
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              placeholder="ej. Excelente justificación de NHEJ en G1, profundizar en la función de BRCA2..."
              className={`w-full p-2.5 rounded-xl font-sans focus:outline-none border transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-600' 
                  : 'bg-slate-950 border-slate-700 text-white'
              }`}
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className={`pt-3 border-t flex items-center justify-between ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className={`text-[11px] flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>El restablecimiento borra el estado local guardado para reiniciar la clase.</span>
          </div>
          <button
            onClick={() => {
              if (confirm('¿Deseas reiniciar todas las actividades y el progreso de la sesión?')) {
                resetAllProgress();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reiniciar Sesión de Clase</span>
          </button>
        </div>
      </div>
    </div>
  );
};
