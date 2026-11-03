import React from 'react';
import { useApp } from '../../context/AppContext';
import { PERTURBATION_CARDS } from '../../data/perturbations';
import { 
  Zap, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  Sliders, 
  MessageSquare,
  ShieldAlert,
  Save
} from 'lucide-react';

export const PerturbationSimulatorSpace: React.FC = () => {
  const {
    currentScenario,
    chosenMechanism,
    activePerturbationId,
    reEvaluateUnderPerturbation,
    evaluationResult,
    perturbationNotes,
    setPerturbationNotes,
    saveCurrentRoundToLog,
    setActiveSpace
  } = useApp();

  const activePerturbation = PERTURBATION_CARDS.find(p => p.id === activePerturbationId) || PERTURBATION_CARDS[0];

  const handleSelectPerturbation = (cardId: string) => {
    reEvaluateUnderPerturbation(cardId);
  };

  const handleRegisterAndGoToLog = () => {
    saveCurrentRoundToLog();
    setActiveSpace('log');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold uppercase">
            <Zap className="w-4 h-4" />
            <span>Etapa 5: Simulador de Perturbaciones Celulares</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Escenario: {currentScenario.title}
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Mecanismo bajo prueba:</span>
          <span className="px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 font-bold">
            {chosenMechanism || 'Sin seleccionar'}
          </span>
        </div>
      </div>

      {/* Main Grid: Perturbation Deck (Left) + Impact & Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: 12 Perturbation Cards Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Baraja de Perturbaciones (12 Cartas)</span>
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              Haz clic para aplicar
            </span>
          </div>

          <div className="space-y-2 max-h-[560px] overflow-y-auto pr-1">
            {PERTURBATION_CARDS.map(card => {
              const isActive = activePerturbationId === card.id;
              const isDefault = currentScenario.defaultPerturbationId === card.id;

              return (
                <div
                  key={card.id}
                  onClick={() => handleSelectPerturbation(card.id)}
                  className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-950 to-slate-900 border-indigo-400 text-white shadow-lg ring-1 ring-indigo-400/50'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[11px] font-mono">
                    <span className="font-bold text-indigo-300">
                      CARTA #{card.number}
                    </span>
                    {isDefault && (
                      <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px]">
                        Recomendada
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-slate-100 text-xs leading-snug">
                    {card.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {card.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Card Effect & Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* Active Card Expanded View */}
          <div className="bg-slate-900 border border-indigo-900/60 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-mono uppercase text-indigo-300 font-bold">
                  Perturbación Activa en el Sistema
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                Carta #{activePerturbation.number}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                {activePerturbation.title}
              </h3>
              <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                {activePerturbation.description}
              </p>
            </div>

            {/* Cellular Impact Summary */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold block">
                Impacto Fisiológico en la Célula:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {activePerturbation.cellularImpact}
              </p>
            </div>

            {/* Effect on Mechanisms */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-mono text-amber-400 uppercase font-bold block">
                Alteración de Rutas Moleculares:
              </span>
              <div className="grid grid-cols-1 gap-2">
                {activePerturbation.modifiedMechanisms.map((mod, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold font-mono text-cyan-300">
                        Ruta: {mod.mechanismId}
                      </span>
                      <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                        {mod.detail}
                      </p>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shrink-0 ${
                      mod.effect === 'favored'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : mod.effect === 'inhibited'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {mod.effect}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Socratic Discussion Prompt */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-300">
                <MessageSquare className="w-4 h-4" />
                <span>Pregunta de Razonamiento Guiado:</span>
              </div>
              <p className="text-slate-200 text-sm font-medium italic">
                &laquo;{activePerturbation.discussionQuestion}&raquo;
              </p>
            </div>
          </div>

          {/* Student Reflection Input Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Tu Registro de Reflexión Científica</span>
            </h4>
            <p className="text-xs text-slate-400">
              ¿Qué ha cambiado respecto al escenario base? ¿Qué posibilidades se abren y cuáles se reducen bajo esta perturbación?
            </p>

            <textarea
              value={perturbationNotes}
              onChange={(e) => setPerturbationNotes(e.target.value)}
              placeholder="Explica con tus propias palabras cómo cambia la defensa del genoma frente a mutaciones con esta perturbación (ej. la pérdida de la cromátida hermana bloquea HR y fuerza NHEJ propenso a deleciones)..."
              className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
            />

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => reEvaluateUnderPerturbation(activePerturbation.id)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reevaluar Vía</span>
              </button>

              <button
                onClick={handleRegisterAndGoToLog}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Guardar en Mi Bitácora</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
