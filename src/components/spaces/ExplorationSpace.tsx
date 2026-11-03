import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DnaVisualizer } from '../DnaVisualizer';
import { 
  HelpCircle, 
  CheckCircle2, 
  Lightbulb, 
  AlertTriangle, 
  ArrowRight, 
  Info,
  Microscope,
  Stethoscope,
  BookOpen
} from 'lucide-react';

export const ExplorationSpace: React.FC = () => {
  const {
    currentScenario,
    selectScenario,
    allScenarios,
    roundStage,
    selectedHypothesisIds,
    toggleHypothesis,
    isHypothesisSubmitted,
    submitHypothesis,
    confirmLesion,
    setActiveSpace,
    unlockedHints,
    unlockHint
  } = useApp();

  const [activeHintTab, setActiveHintTab] = useState<1 | 2 | 3>(1);

  const scenarioHints = unlockedHints[currentScenario.id] || { l1: false, l2: false, l3: false };

  const handleNextToLab = () => {
    confirmLesion();
    setActiveSpace('repair_lab');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* Top Scenario Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 font-mono font-bold flex items-center justify-center text-sm border border-cyan-500/30">
            #{currentScenario.number}
          </div>
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">
              {currentScenario.organism}
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              {currentScenario.title}
            </h2>
          </div>
        </div>

        {/* Quick Scenario Dropdown Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Cambiar escenario:</span>
          <select
            value={currentScenario.id}
            onChange={(e) => selectScenario(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
          >
            {allScenarios.map(sc => (
              <option key={sc.id} value={sc.id}>
                Escenario {sc.number}: {sc.title.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: 2 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Stage 1 (Encounter & Hypotheses) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card: El Caso Biológico */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
                <Microscope className="w-4 h-4" />
                <span>Etapa 1: Encuentro con el problema molecular</span>
              </div>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                Información inicial
              </span>
            </div>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-normal">
              {currentScenario.initialContext}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">Agente / Fuente de daño:</span>
                <span className="text-cyan-300 font-semibold mt-0.5 block">
                  {currentScenario.damageSourceName}
                </span>
              </div>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                <span className="text-slate-400 block text-[11px] font-mono">Modelo biológico:</span>
                <span className="text-slate-200 font-medium mt-0.5 block">
                  {currentScenario.organism}
                </span>
              </div>
            </div>
          </div>

          {/* Formulate Hypotheses */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Formula tu hipótesis inicial
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Selecciona todas las afirmaciones que consideres biológicamente plausibles para este caso:
                </p>
              </div>
              <span className="text-xs font-mono text-amber-400">
                {selectedHypothesisIds.length} seleccionadas
              </span>
            </div>

            {/* Hypothesis options list */}
            <div className="space-y-2.5">
              {currentScenario.hypothesisOptions.map((opt) => {
                const isSelected = selectedHypothesisIds.includes(opt.id);
                const showFeedback = isHypothesisSubmitted;

                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleHypothesis(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all text-xs cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-500 text-cyan-100 shadow-md ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </div>

                      <div className="space-y-1">
                        <span className="leading-relaxed block font-medium">
                          {opt.text}
                        </span>

                        {showFeedback && (
                          <div className={`mt-2 pt-2 border-t text-[11px] flex items-start gap-1.5 ${
                            opt.isScientificallySound
                              ? 'border-emerald-800/60 text-emerald-300'
                              : 'border-amber-800/60 text-amber-300'
                          }`}>
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{opt.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Hypotheses Button */}
            {!isHypothesisSubmitted ? (
              <button
                onClick={submitHypothesis}
                disabled={selectedHypothesisIds.length === 0}
                className={`w-full py-3 rounded-xl text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-lg ${
                  selectedHypothesisIds.length > 0
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/50 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                Registrar Hipótesis y Revelar Evidencias Experimentales
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hipótesis registradas. Observaciones experimentales desbloqueadas a la derecha.</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">+ Puntos otorgados</span>
              </div>
            )}
          </div>

          {/* Clinical Connection Box */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-indigo-900/40 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-[11px]">
              <Stethoscope className="w-4 h-4" />
              <span>Relevancia Médica y Clínica</span>
            </div>
            <p className="leading-relaxed text-slate-300">
              {currentScenario.clinicalConnection}
            </p>
          </div>
        </div>

        {/* Right Column: Stage 2 (Visual DNA & Lesion Identification) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">

          {/* Interactive DNA Lesion Visualizer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-xs">
              <span className="font-mono text-cyan-400 font-bold uppercase">
                Etapa 2: Identificación de la Lesión
              </span>
              <span className="text-slate-400 text-[11px]">
                {currentScenario.lesionTypeName.split('(')[0]}
              </span>
            </div>

            <DnaVisualizer 
              lesionType={currentScenario.lesionTypeId} 
              activeOperationStep={0}
              showLabels={true}
            />
          </div>

          {/* Experimental Observations & Evidence Revealed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>Observaciones para comprobar la hipótesis</span>
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isHypothesisSubmitted ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-slate-800 text-slate-500'
              }`}>
                {isHypothesisSubmitted ? 'Reveladas' : 'Bloqueadas'}
              </span>
            </div>

            {isHypothesisSubmitted ? (
              <div className="space-y-2 text-xs">
                {currentScenario.observationsToConfirm.map((obs, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-slate-300">
                    <span className="font-mono text-cyan-400 font-bold">{idx + 1}.</span>
                    <span>{obs}</span>
                  </div>
                ))}

                {/* Why is this a problem */}
                <div className="mt-3 p-3 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>¿Por qué esta alteración es un problema crítico?</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">
                    {currentScenario.whyIsProblem}
                  </p>
                </div>

                {/* Continue to Stage 3 */}
                <div className="pt-2">
                  <button
                    onClick={handleNextToLab}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-bold text-xs uppercase font-mono tracking-wider shadow-lg shadow-teal-950/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Pasar al Laboratorio de Reparación</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-xs space-y-2">
                <HelpCircle className="w-8 h-8 mx-auto text-slate-600 stroke-[1.5]" />
                <p>Formula tu hipótesis a la izquierda para revelar las evidencias experimentales y pasar a la resolución molecular.</p>
              </div>
            )}
          </div>

          {/* 3-Level Hints System */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>Sistema de Pistas Progresivas</span>
              </div>
              <span className="text-[10px] text-slate-500">Solicitud activa</span>
            </div>

            {/* Hint Tabs */}
            <div className="grid grid-cols-3 gap-1.5">
              {[1, 2, 3].map((lvl) => {
                const isUnlocked = lvl === 1 ? scenarioHints.l1 : lvl === 2 ? scenarioHints.l2 : scenarioHints.l3;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      if (!isUnlocked) unlockHint(currentScenario.id, lvl as 1 | 2 | 3);
                      setActiveHintTab(lvl as 1 | 2 | 3);
                    }}
                    className={`py-1.5 px-2 rounded-lg text-xs font-mono transition-all border ${
                      activeHintTab === lvl
                        ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold'
                        : isUnlocked
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-950 text-slate-500 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    Nivel {lvl} {isUnlocked ? '✓' : '🔒'}
                  </button>
                );
              })}
            </div>

            {/* Hint Content Display */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 min-h-[70px] flex items-center">
              {activeHintTab === 1 && (
                scenarioHints.l1 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1">Nivel 1 — Orientación:</strong>
                    <span>{currentScenario.hints.level1}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic en Nivel 1 para solicitar una pregunta orientadora sin revelar respuestas.</span>
                )
              )}

              {activeHintTab === 2 && (
                scenarioHints.l2 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1">Nivel 2 — Pista Mecanística:</strong>
                    <span>{currentScenario.hints.level2}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic en Nivel 2 para ver qué tipo de operación molecular podría resolver la lesión.</span>
                )
              )}

              {activeHintTab === 3 && (
                scenarioHints.l3 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1">Nivel 3 — Explicación Profunda:</strong>
                    <span>{currentScenario.hints.level3}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic en Nivel 3 para revelar la lógica completa del mecanismo molecular.</span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
