import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MolecularOperationId, RepairMechanismId } from '../../data/types';
import { DnaVisualizer } from '../DnaVisualizer';
import { RepairSimulationViewer } from '../RepairSimulationViewer';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Lightbulb, 
  Info, 
  AlertTriangle, 
  FlaskConical, 
  Zap, 
  BookOpen, 
  Network, 
  RotateCcw,
  Stethoscope,
  Microscope,
  Award,
  Sparkles,
  Layers,
  Dna,
  Save,
  Wand2,
  Unlock
} from 'lucide-react';

const OPERATIONS_BY_CATEGORY: { category: string; icon: string; ops: { id: MolecularOperationId; name: string; desc: string }[] }[] = [
  {
    category: '1. Reconocimiento Molecular',
    icon: '🔍',
    ops: [
      { id: 'recognize_distortion', name: 'Reconocer distorsión helicoidal', desc: 'Detectar torceduras o abultamientos de ~30° en la doble hélice' },
      { id: 'recognize_modified_base', name: 'Reconocer base química individual', desc: 'Voltear una base oxidada o alterada hacia el bolsillo catalítico' },
      { id: 'recognize_mismatch', name: 'Reconocer error de apareamiento', desc: 'Detectar puentes de H no canónicos (ej. G-T) sin rotura química' },
      { id: 'recognize_dsb_ends', name: 'Reconocer extremos bicatenarios rotos', desc: 'Abrazar y proteger los extremos de cromosomas rotos (complejo Ku)' }
    ]
  },
  {
    category: '2. Escisión y Procesamiento',
    icon: '✂️',
    ops: [
      { id: 'excise_single_base', name: 'Eliminar una base dañada (enlace N-glucosídico)', desc: 'Hidrolizar la base anómala dejando un sitio apurínico/apirimidínico (AP)' },
      { id: 'cleave_ap_site', name: 'Incidir el esqueleto en sitio AP', desc: 'Corte fosfodiéster en 5\' por AP endonucleasa para abrir la hebra' },
      { id: 'excise_oligonucleotide', name: 'Escindir tramo de oligonucleótidos (~24-32 nt)', desc: 'Cortes duales a ambos lados de la distorsión helicoidal' },
      { id: 'discriminate_daughter_strand', name: 'Discriminar hebra recién sintetizada', desc: 'Distinguir la hebra hija que lleva el error mediante melladuras o PCNA' },
      { id: 'direct_chemical_reversal', name: 'Reversión directa sin corte', desc: 'Transferir químicamente el grupo alquilo directo a la enzima (MGMT)' },
      { id: 'photoreactivation', name: 'Fotoreactivación por luz visible', desc: 'Ruptura fotoquímica de ciclobutanos mediada por fotones azules (bacterias)' }
    ]
  },
  {
    category: '3. Síntesis y Relleno',
    icon: '🧬',
    ops: [
      { id: 'resynthesize_complementary_dna', name: 'Sintetizar ADN complementario', desc: 'Polimerasa rellena la brecha usando la hebra opuesta como molde' },
      { id: 'use_homologous_template', name: 'Utilizar molde homólogo (cromátida hermana)', desc: 'Invasión de hebra homóloga en fases S/G2 libre de error' }
    ]
  },
  {
    category: '4. Unión y Regulación',
    icon: '🔗',
    ops: [
      { id: 'ligate_nick', name: 'Sellar melladura con ADN ligasa', desc: 'Restablecer el enlace fosfodiéster continuo en la molécula' },
      { id: 'process_and_ligate_ends', name: 'Procesar y unir extremos bicatenarios', desc: 'Acondicionamiento y ligación no homóloga directa (NHEJ)' },
      { id: 'arrest_cell_cycle', name: 'Detener temporalmente el ciclo celular', desc: 'Pausa en puntos de control para dar tiempo a la maquinaria' }
    ]
  }
];

const MECHANISMS_CHOICES: { id: RepairMechanismId; name: string; tag: string; description: string }[] = [
  { id: 'BER', name: 'Reparación por Escisión de Bases (BER)', tag: 'Glucosilasas / Sitio AP', description: 'Corrige alteraciones químicas discretas de bases (oxidadas, uracilo, alquiladas pequeñas).' },
  { id: 'NER', name: 'Reparación por Escisión de Nucleótidos (NER)', tag: 'Incisión dual ~30 nt', description: 'Elimina tramos que contienen distorsiones volumétricas rígidas (dímeros UV, aductos voluminosos).' },
  { id: 'MMR', name: 'Reparación de Errores de Apareamiento (MMR)', tag: 'Posreplicativo MutS/MutL', description: 'Corrige pares de bases no canónicas que escaparon a la corrección de pruebas.' },
  { id: 'HR', name: 'Recombinación Homóloga (HR)', tag: 'Rad51 / Molde S/G2', description: 'Reparación de alta fidelidad de roturas de doble hebra usando la cromátida hermana.' },
  { id: 'NHEJ', name: 'Unión de Extremos No Homólogos (NHEJ)', tag: 'Ku70/80 / Sin molde', description: 'Reconecta directamente extremos de cromosomas rotos en cualquier fase del ciclo.' },
  { id: 'DIRECT_MGMT', name: 'Reversión Directa por MGMT', tag: 'Enzima suicida', description: 'Transfiere el grupo alquilo de O6-metilguanina directamente sin cortar enlaces fosfodiéster.' },
  { id: 'PHOTOLYASE', name: 'Fotoreactivación Enzimática', tag: 'Luz visible azul', description: 'Ruptura fotoquímica de dímeros de pirimidinas presente en procariotas (ausente en humanos).' },
  { id: 'PROOFREADING', name: 'Corrección de Pruebas (Proofreading)', tag: 'Polimerasa 3\'→5\'', description: 'Actividad exonucleasa intrínseca in situ de la polimerasa durante la síntesis replicativa.' }
];

export const GuidedInvestigationSpace: React.FC = () => {
  const {
    currentScenario,
    selectScenario,
    allScenarios,
    coreScenarios,
    additionalScenarios,
    roundStage,
    setRoundStage,
    selectedHypothesisIds,
    toggleHypothesis,
    isHypothesisSubmitted,
    submitHypothesis,
    selectedOperations,
    setSelectedOperations,
    toggleOperation,
    chosenMechanism,
    setChosenMechanism,
    evaluationResult,
    evaluateProposal,
    isResolvedWithoutPoints,
    resolveWithoutPoints,
    retryForPoints,
    restartCurrentScenario,
    activePerturbationId,
    setActivePerturbationId,
    reEvaluateUnderPerturbation,
    perturbationNotes,
    setPerturbationNotes,
    saveCurrentRoundToLog,
    addScenarioComponentsToGraph,
    setActiveSpace,
    unlockedHints,
    unlockHint,
    profile
  } = useApp();

  const [showHintsModal, setShowHintsModal] = useState<boolean>(false);
  const [activeHintLevel, setActiveHintLevel] = useState<1 | 2 | 3>(1);
  const [showAssistedHints, setShowAssistedHints] = useState<boolean>(false);

  const scenarioHints = unlockedHints[currentScenario.id] || { l1: false, l2: false, l3: false };

  // Strategy Analysis & Corrective Hints computation
  const primaryMechanism = currentScenario.compatibleMechanisms.find(m => m.isPrimary)?.mechanismId 
    || currentScenario.compatibleMechanisms[0]?.mechanismId;
  const isMechanismCompatible = currentScenario.compatibleMechanisms.some(m => m.mechanismId === chosenMechanism);
  const incompatibleEntry = currentScenario.incompatibleMechanisms.find(m => m.mechanismId === chosenMechanism);
  const missingOps = currentScenario.appropriateOperations.filter(op => !selectedOperations.includes(op));
  const extraOps = selectedOperations.filter(op => !currentScenario.appropriateOperations.includes(op));

  const allOpsFlattened = OPERATIONS_BY_CATEGORY.flatMap(c => c.ops);
  const getOpInfo = (opId: MolecularOperationId) => allOpsFlattened.find(o => o.id === opId);

  const stepsList = [
    { num: 1, title: 'El Caso' },
    { num: 2, title: 'El ADN' },
    { num: 3, title: 'Estrategia' },
    { num: 4, title: 'Simulación' },
    { num: 5, title: 'Conclusión' }
  ];

  // Helper navigation between steps
  const goToStep = (step: number) => {
    setRoundStage(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextFromStep1 = () => {
    if (!isHypothesisSubmitted) {
      submitHypothesis();
    }
    goToStep(2);
  };

  const handleNextFromStep3 = () => {
    evaluateProposal();
    goToStep(4);
  };

  const handleGoToConclusion = () => {
    const mechToUse = chosenMechanism || primaryMechanism || currentScenario.compatibleMechanisms[0]?.mechanismId;
    if (mechToUse) {
      addScenarioComponentsToGraph(currentScenario, mechToUse);
    }
    saveCurrentRoundToLog();
    goToStep(5);
  };

  // Asegurar que al terminar el caso e ingresar al Paso 5 de conclusión, los componentes y conexiones estén en el modelo gráfico
  useEffect(() => {
    if (roundStage === 5) {
      const mechToUse = chosenMechanism || primaryMechanism || currentScenario.compatibleMechanisms[0]?.mechanismId;
      if (mechToUse) {
        addScenarioComponentsToGraph(currentScenario, mechToUse);
      }
    }
  }, [roundStage, currentScenario.id, chosenMechanism]);

  const handleNextScenario = () => {
    const currentIndex = allScenarios.findIndex(s => s.id === currentScenario.id);
    const nextScenario = allScenarios[(currentIndex + 1) % allScenarios.length];
    selectScenario(nextScenario.id);
    goToStep(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 select-none">
      
      {/* Top Header: Scenario Title & Stepper */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        {/* Scenario identifier and quick switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400 font-mono font-bold flex items-center justify-center text-xs">
              #{currentScenario.number}
            </span>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block font-semibold">
                {currentScenario.isAdditional ? 'Caso Adicional / Especializado' : 'Caso Principal (Ruta Base)'} • #{currentScenario.number}
              </span>
              <h1 className="text-base sm:text-lg font-bold text-white leading-tight">
                {currentScenario.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Reset Case and Points Button */}
            <button
              onClick={() => {
                restartCurrentScenario();
                goToStep(1);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition-colors cursor-pointer"
              title="Reiniciar este caso desde el Paso 1 y reiniciar puntos a 0"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>

            {/* Hint Trigger Button */}
            <button
              onClick={() => setShowHintsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-700/80 text-amber-300 text-xs font-mono font-semibold hover:bg-amber-900/80 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Pistas</span>
            </button>

            {/* Quick Switch Scenario with groups */}
            <select
              value={currentScenario.id}
              onChange={(e) => {
                selectScenario(e.target.value);
                goToStep(1);
              }}
              className="bg-slate-950 border border-slate-700 text-slate-300 text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none focus:border-cyan-500 max-w-[210px] sm:max-w-none"
            >
              <optgroup label="── CASOS PRINCIPALES (5) ──">
                {coreScenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    Caso {sc.number}: {sc.title.slice(0, 24)}...
                  </option>
                ))}
              </optgroup>
              <optgroup label="── CASOS ADICIONALES (5) ──">
                {additionalScenarios.map(sc => (
                  <option key={sc.id} value={sc.id}>
                    Caso {sc.number}: {sc.title.slice(0, 24)}...
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* The 5-Step Visual Stepper */}
        <div className="grid grid-cols-5 gap-1.5 pt-1">
          {stepsList.map(step => {
            const isActive = roundStage === step.num;
            const isCompleted = roundStage > step.num;
            return (
              <button
                key={step.num}
                onClick={() => goToStep(step.num)}
                className={`flex flex-col items-center py-2 px-1 rounded-xl border text-center transition-all ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-md ring-1 ring-cyan-400/40'
                    : isCompleted
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-950/50 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold mb-0.5">
                  <span>{step.num}</span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-cyan-400" />}
                </div>
                <span className="text-[10px] font-medium truncate w-full hidden sm:inline">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PASO 1: EL CASO BIOLÓGICO E HIPÓTESIS                                     */}
      {/* ========================================================================= */}
      {roundStage === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Microscope className="w-4 h-4" />
            <span>Paso 1: Situación Biológica e Hipótesis Inicial</span>
          </div>

          {/* The Biological Situation Card */}
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Situación experimental:
            </span>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              {currentScenario.initialContext}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-900 text-xs text-slate-400 font-mono">
              <div>
                <span>Agente: </span>
                <strong className="text-cyan-300">{currentScenario.damageSourceName}</strong>
              </div>
              <span>•</span>
              <div>
                <span>Organismo: </span>
                <strong className="text-slate-300">{currentScenario.organism}</strong>
              </div>
            </div>
          </div>

          {/* Question & Hypothesis Formulation */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                ¿Qué tipo de daño o alteraciones sospechas que podrían producirse?
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Selecciona las posibilidades que consideres científicamente plausibles para este caso:
              </p>
            </div>

            <div className="space-y-2.5">
              {currentScenario.hypothesisOptions.map((opt) => {
                const isSelected = selectedHypothesisIds.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleHypothesis(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all text-xs cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-cyan-950/70 border-cyan-400 text-cyan-100 shadow-md ring-1 ring-cyan-400/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                    </div>

                    <div className="space-y-1">
                      <span className="font-medium block leading-relaxed">
                        {opt.text}
                      </span>
                      {isHypothesisSubmitted && (
                        <p className={`text-[11px] pt-1 border-t ${
                          opt.isScientificallySound ? 'border-emerald-800/60 text-emerald-300' : 'border-amber-800/60 text-amber-300'
                        }`}>
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleNextFromStep1}
              disabled={selectedHypothesisIds.length === 0}
              className={`px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${
                selectedHypothesisIds.length > 0
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>{isHypothesisSubmitted ? 'Continuar a Examinar el ADN (Paso 2)' : 'Registrar Hipótesis y Ver el ADN'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 2: INSPECCIÓN DE LA LESIÓN EN EL ADN                                */}
      {/* ========================================================================= */}
      {roundStage === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Dna className="w-4 h-4" />
            <span>Paso 2: Inspección Molecular de la Lesión en el ADN</span>
          </div>

          {/* The DNA Visualizer */}
          <div className="space-y-2">
            <DnaVisualizer
              lesionType={currentScenario.lesionTypeId}
              showLabels={true}
            />
          </div>

          {/* Identification Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">
                Naturaleza de la Lesión:
              </span>
              <h4 className="text-sm font-bold text-white">
                {currentScenario.lesionTypeName}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {currentScenario.lesionDescription}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-bold block flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>¿Por qué es un problema molecular?</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {currentScenario.whyIsProblem}
              </p>
            </div>
          </div>

          {/* Experimental Observations Revealed */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
            <span className="font-mono text-slate-400 font-bold uppercase text-[10px] block">
              Observaciones Experimentales que Confirman la Lesión:
            </span>
            <ul className="space-y-1 text-slate-300">
              {currentScenario.observationsToConfirm.map((obs, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">•</span>
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical Context Note */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-900/60 text-xs text-slate-300 flex items-start gap-2.5">
            <Stethoscope className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-indigo-300 block font-mono text-[10px] uppercase">Correlación Médica:</strong>
              <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">
                {currentScenario.clinicalConnection}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => goToStep(1)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver a la Situación</span>
            </button>

            <button
              onClick={() => goToStep(3)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-950 flex items-center gap-2 cursor-pointer"
            >
              <span>Diseñar la Reparación Celular (Paso 3)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 3: LABORATORIO MOLECULAR (ESTRATEGIA Y MECANISMO)                    */}
      {/* ========================================================================= */}
      {roundStage === 3 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <FlaskConical className="w-4 h-4" />
              <span>Paso 3: Diseñar la Estrategia de Reparación</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowAssistedHints(!showAssistedHints)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                  showAssistedHints
                    ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-md ring-1 ring-amber-400/40'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title="Muestra u oculta pistas orientadoras sobre las operaciones y mecanismos recomendados"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                <span>{showAssistedHints ? 'Pistas de Estrategia: ON' : '💡 Activar Pistas de Corrección'}</span>
              </button>

              <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                Lesión: <strong className="text-cyan-300">{currentScenario.lesionTypeName.split('(')[0]}</strong>
              </span>
            </div>
          </div>

          {/* Assisted Hints Banner (When toggled on) */}
          {showAssistedHints && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/50 via-slate-900 to-cyan-950/40 border border-amber-500/80 space-y-3 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase">
                  <Lightbulb className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>Asistente de Razonamiento para Diseñar la Estrategia:</span>
                </div>
                <button
                  onClick={() => {
                    if (primaryMechanism) {
                      setChosenMechanism(primaryMechanism);
                      setSelectedOperations([...currentScenario.appropriateOperations]);
                    }
                  }}
                  className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-[11px] font-bold shadow flex items-center gap-1.5 active:scale-95 transition-transform"
                  title="Preselecciona automáticamente las operaciones y el mecanismo canónico"
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  <span>Preseleccionar estrategia recomendada</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">1. Pregunta Clave de Orientación:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{currentScenario.hints.level1}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block">2. Pista Mecanística:</span>
                  <p className="text-slate-300 text-[11px] leading-relaxed">{currentScenario.hints.level2}</p>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span className="text-cyan-400 font-bold">💡 Tip:</span>
                <span>Presta atención a las insignias &quot;💡 Recomendada&quot; en las operaciones y &quot;💡 Vía canónica recomendada&quot; en los mecanismos.</span>
              </div>
            </div>
          )}

          {/* Phase 1: Select Molecular Operations (Organized into 4 clear groups) */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>1. ¿Qué operaciones moleculares necesita coordinar la célula?</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecciona las acciones bioquímicas requeridas para resolver el daño:
              </p>
            </div>

            <div className="space-y-3">
              {OPERATIONS_BY_CATEGORY.map((cat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400 block">
                    {cat.icon} {cat.category}
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {cat.ops.map(op => {
                      const isSelected = selectedOperations.includes(op.id);
                      const isRecommended = showAssistedHints && currentScenario.appropriateOperations.includes(op.id);
                      return (
                        <div
                          key={op.id}
                          onClick={() => toggleOperation(op.id)}
                          className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                            isSelected
                              ? 'bg-cyan-950/80 border-cyan-400 text-cyan-100 shadow-md ring-1 ring-cyan-400/40'
                              : isRecommended
                              ? 'bg-slate-900/90 border-cyan-500/60 text-slate-200 ring-1 ring-cyan-500/30'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded mt-0.5 shrink-0 flex items-center justify-center border ${
                            isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 fill-current" />}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold block leading-tight">{op.name}</span>
                              {isRecommended && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-600/80 shrink-0">
                                  💡 Recomendada
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">{op.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2: Inferred Mechanism Proposal */}
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Dna className="w-4 h-4 text-cyan-400" />
                <span>2. ¿Cuál es el mecanismo canónico correspondiente a esta estrategia?</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Selecciona la vía celular que agrupa estas operaciones:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {MECHANISMS_CHOICES.map(mech => {
                const isSelected = chosenMechanism === mech.id;
                const isPrimary = showAssistedHints && mech.id === primaryMechanism;
                const isIncompatible = showAssistedHints && currentScenario.incompatibleMechanisms.some(m => m.mechanismId === mech.id);

                return (
                  <div
                    key={mech.id}
                    onClick={() => setChosenMechanism(mech.id)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950 to-teal-950 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                        : isPrimary
                        ? 'bg-emerald-950/30 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 gap-1">
                      <strong className="text-cyan-200 text-xs">{mech.name}</strong>
                      <div className="flex items-center gap-1 shrink-0">
                        {isPrimary && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold">
                            💡 Vía canónica
                          </span>
                        )}
                        {isIncompatible && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-900">
                            ⚠️ Incompatible
                          </span>
                        )}
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          {mech.tag}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {mech.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => goToStep(2)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al ADN</span>
            </button>

            <button
              onClick={handleNextFromStep3}
              disabled={!chosenMechanism || selectedOperations.length === 0}
              className={`px-6 py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 ${
                chosenMechanism && selectedOperations.length > 0
                  ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-950 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <span>Ejecutar y Evaluar Estrategia (Paso 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 4: SIMULACIÓN MOLECULAR Y VEREDICTO CIENTÍFICO                       */}
      {/* ========================================================================= */}
      {roundStage === 4 && evaluationResult && chosenMechanism && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Paso 4: Simulación Molecular y Veredicto Científico</span>
            </div>
            {evaluationResult.category === 'fully_compatible' && !isResolvedWithoutPoints ? (
              <span className="font-mono text-xs text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded border border-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>+100 PTS</span>
              </span>
            ) : isResolvedWithoutPoints ? (
              <span className="font-mono text-xs text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-700 font-bold flex items-center gap-1">
                <Unlock className="w-3.5 h-3.5" />
                <span>0 PTS (Resuelto sin puntos)</span>
              </span>
            ) : (
              <span className="font-mono text-xs text-rose-300 bg-rose-950/80 px-2.5 py-0.5 rounded border border-rose-700 font-bold flex items-center gap-1">
                <span>0 PTS (Estrategia no óptima)</span>
              </span>
            )}
          </div>

          {/* Veredicto Banner */}
          <div className={`p-5 rounded-2xl border shadow-lg space-y-2 ${
            isResolvedWithoutPoints
              ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
              : evaluationResult.category === 'fully_compatible'
              ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200'
              : evaluationResult.category === 'conditional_compatible'
              ? 'bg-cyan-950/40 border-cyan-500/80 text-cyan-200'
              : evaluationResult.category === 'partially_compatible'
              ? 'bg-amber-950/40 border-amber-500/80 text-amber-200'
              : 'bg-rose-950/40 border-rose-500/80 text-rose-200'
          }`}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase tracking-wider opacity-80">Categoría:</span>
              <strong className="text-base text-white">
                {isResolvedWithoutPoints ? 'Demostración Asistida (Vía Canónica)' : evaluationResult.categoryLabel}
              </strong>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {isResolvedWithoutPoints 
                ? `Se ha ejecutado la vía canónica ${chosenMechanism} para que observes la secuencia enzimática en acción. Puedes examinar el proceso y continuar.`
                : evaluationResult.summary}
            </p>
          </div>

          {/* Interactive Step-by-Step Simulation Animation */}
          <RepairSimulationViewer
            mechanismId={chosenMechanism}
            scenario={currentScenario}
          />

          {/* ========================================================================= */}
          {/* PANEL DE PISTAS PARA CORREGIR LA ESTRATEGIA (ASISTENTE GUIADO)            */}
          {/* ========================================================================= */}
          <div className={`p-5 rounded-2xl border transition-all space-y-4 ${
            evaluationResult.category === 'fully_compatible' && !isResolvedWithoutPoints
              ? 'bg-emerald-950/20 border-emerald-800/80 text-emerald-100'
              : isResolvedWithoutPoints
              ? 'bg-amber-950/20 border-amber-800/80 text-amber-100'
              : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-cyan-950/40 border-amber-600/80 text-slate-200 shadow-xl'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  evaluationResult.category === 'fully_compatible' && !isResolvedWithoutPoints
                    ? 'bg-emerald-900/60 text-emerald-300'
                    : isResolvedWithoutPoints
                    ? 'bg-amber-900/60 text-amber-300'
                    : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {isResolvedWithoutPoints ? (
                    <Unlock className="w-5 h-5 text-amber-300" />
                  ) : (
                    <Lightbulb className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white uppercase font-mono tracking-wider">
                    {evaluationResult.category === 'fully_compatible' && !isResolvedWithoutPoints
                      ? '✓ Estrategia Correcta y Fisiológica (+100 PTS)'
                      : isResolvedWithoutPoints
                      ? '🔓 Caso Resuelto con Asistencia Didáctica (0 PTS)'
                      : '💡 Pistas para Corregir tu Estrategia de Reparación'}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {evaluationResult.category === 'fully_compatible' && !isResolvedWithoutPoints
                      ? 'Tu propuesta cumple con los principios biofísicos y enzimáticos de este daño.'
                      : isResolvedWithoutPoints
                      ? 'Se ha configurado la vía canónica celular para que puedas estudiar la simulación completa sin penalización didáctica.'
                      : 'Solo se otorgan puntos (+100 PTS) si tu propuesta es 100% correcta. Corrige con las pistas o resuelve sin puntos:'}
                  </p>
                </div>
              </div>

              {/* Master Resolver sin puntos Button (Only when not correct and not already resolved without points) */}
              {evaluationResult.category !== 'fully_compatible' && !isResolvedWithoutPoints && (
                <button
                  onClick={resolveWithoutPoints}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-mono text-xs font-bold shadow-lg shadow-amber-950/60 flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-95 border border-amber-500/60 cursor-pointer"
                  title="Aplica la combinación enzimática canónica para ver la simulación molecular sin ganar puntos (0 PTS)"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Resolver sin puntos</span>
                </button>
              )}
            </div>

            {/* If Resolved Without Points: Detailed Educational Explanation */}
            {isResolvedWithoutPoints ? (
              <div className="space-y-4">
                {/* Status Notice Banner */}
                <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-600/70 text-xs text-amber-100 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold text-amber-300 text-sm">
                      <Unlock className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Modo Demostración Asistida Activo (0 PTS asignados)</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Has activado la vía canónica <strong>{chosenMechanism}</strong> para ver la simulación en acción. Abajo tienes el desglose exacto de lo que se requería para los 100 puntos.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setShowAssistedHints(true);
                        retryForPoints();
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-600/70 font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reintentar por los 100 PTS</span>
                    </button>
                    <button
                      onClick={handleGoToConclusion}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Avanzar a la Conclusión (Paso 5) →</span>
                    </button>
                  </div>
                </div>

                {/* EXPLICACIÓN DIDÁCTICA: LO QUE SE DEBÍA PONER PARA LOS 100 PUNTOS */}
                <div className="p-5 rounded-2xl bg-slate-950/90 border border-amber-500/70 shadow-xl space-y-4 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2 text-amber-300 font-mono font-bold uppercase tracking-wider text-xs">
                      <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>¿Qué debías seleccionar para obtener los 100 puntos?</span>
                    </div>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                      Solución Canónica Celular
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Requisito 1: Mecanismo Canónico */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                          1. Mecanismo Celular Canónico:
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          {primaryMechanism}
                        </span>
                      </div>

                      <div className="text-white font-bold text-sm">
                        {MECHANISMS_CHOICES.find(m => m.id === primaryMechanism)?.name || primaryMechanism}
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1.5 text-[11px] leading-relaxed text-slate-300">
                        <span className="text-cyan-300 font-bold block">
                          Fundamento Biofísico / Bioquímico:
                        </span>
                        <p>
                          {currentScenario.compatibleMechanisms.find(m => m.isPrimary)?.scientificRationale ||
                           currentScenario.compatibleMechanisms[0]?.scientificRationale}
                        </p>
                      </div>

                      {currentScenario.representativeProteins.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono uppercase text-slate-400 block">
                            Enzimas y complejos efectores en {currentScenario.organism}:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentScenario.representativeProteins.map((prot, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-200 text-[10px] font-mono">
                                {prot}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Requisito 2: Operaciones Moleculares Requeridas */}
                    <div className="space-y-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                          2. Operaciones Moleculares Necesarias ({currentScenario.appropriateOperations.length}):
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                          Secuencia Coordinada
                        </span>
                      </div>

                      <div className="space-y-2">
                        {currentScenario.appropriateOperations.map((opId, index) => {
                          const opInfo = getOpInfo(opId);
                          return (
                            <div key={opId} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] flex items-start gap-2.5">
                              <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-700/60 text-cyan-300 font-mono text-[10px] flex items-center justify-center shrink-0 font-bold mt-0.5">
                                {index + 1}
                              </span>
                              <div className="space-y-0.5">
                                <span className="font-bold text-slate-100 block">
                                  {opInfo?.name || opId}
                                </span>
                                <span className="text-slate-400 text-[10px] block leading-tight">
                                  {opInfo?.desc}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/50 text-[11px] text-amber-200/90 leading-relaxed">
                        💡 <strong>Criterio para los 100 puntos:</strong> Debes seleccionar exactamente estas operaciones clave correspondientes a la lesión y no incluir pasos extraños (como cortes erróneos o translesión mutagénica) que comprometan la fidelidad.
                      </div>
                    </div>
                  </div>

                  {/* Call to action to retry and earn 100 points */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-slate-300 text-[11px]">
                      Ahora que conoces la vía y la combinación bioquímica exacta, puedes aplicarla tú mismo:
                    </span>
                    <button
                      onClick={() => {
                        setShowAssistedHints(true);
                        retryForPoints();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-mono text-xs font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Volver al Paso 3 y configurar para 100 PTS</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : evaluationResult.category === 'fully_compatible' ? (
              /* If Fully Compatible & Earned 100 Points */
              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-950/50 rounded-2xl border border-emerald-600/70 text-xs text-emerald-200 flex flex-wrap items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="font-medium">
                      ¡Excelente! Tu selección de mecanismo (<strong>{chosenMechanism}</strong>) y operaciones moleculares es la canónica celular (+100 PTS).
                    </span>
                  </div>
                  <button
                    onClick={handleGoToConclusion}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold shrink-0 cursor-pointer shadow-md transition-colors"
                  >
                    Completar Caso y Ver Conclusión (Paso 5) →
                  </button>
                </div>

                {/* Graph Model Insertion Notice */}
                <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/40">
                      <Network className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                        Componentes ingresados al Modelo Gráfico
                      </span>
                      <p className="text-slate-300 text-[11px] leading-snug">
                        Se incorporaron a tu red causal: Fuente ({currentScenario.damageSourceName}), Lesión ({currentScenario.lesionTypeName}), Mecanismo ({chosenMechanism}), Enzimas ({currentScenario.representativeProteins.slice(0, 3).join(', ')}) y Restauración fidedigna.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveSpace('graph_builder')}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    <Network className="w-3.5 h-3.5" />
                    <span>Ver en Modelo Gráfico</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Diagnostic Pistas Breakdown */
              <div className="space-y-3 text-xs">
                
                {/* Pista 1: Mecanismo Celular */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase font-bold text-amber-400 flex items-center gap-1.5">
                      <span>1. Pista sobre la Vía / Mecanismo:</span>
                    </span>
                    {!isMechanismCompatible ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                        Incompatible
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Adecuado
                      </span>
                    )}
                  </div>

                  {!isMechanismCompatible ? (
                    <div className="space-y-2">
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        ⚠️ El mecanismo elegido (<strong>{chosenMechanism}</strong>) no puede resolver esta lesión (<em className="text-cyan-300">{currentScenario.lesionTypeName}</em>).
                        {incompatibleEntry && <span className="block mt-1 text-slate-400">{incompatibleEntry.reason}</span>}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/60">
                        <span className="text-amber-200 text-[11px]">
                          👉 <strong>Vía Recomendada:</strong> La célula utiliza preferentemente <strong>{primaryMechanism}</strong> ({MECHANISMS_CHOICES.find(m => m.id === primaryMechanism)?.name}).
                        </span>
                        {primaryMechanism && (
                          <button
                            onClick={() => evaluateProposal(primaryMechanism, selectedOperations)}
                            className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-mono font-bold flex items-center gap-1 transition-colors"
                          >
                            <span>Cambiar a {primaryMechanism} →</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-emerald-300 text-[11px]">
                      ✓ Has elegido correctamente <strong>{chosenMechanism}</strong> como mecanismo celular para procesar este daño.
                    </p>
                  )}
                </div>

                {/* Pista 2: Operaciones Faltantes */}
                {missingOps.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-cyan-400">
                        2. Operaciones Esenciales que te Faltan ({missingOps.length}):
                      </span>
                      <button
                        onClick={() => {
                          const updated = Array.from(new Set([...selectedOperations, ...missingOps]));
                          evaluateProposal(chosenMechanism, updated);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Añadir faltantes (+{missingOps.length})</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {missingOps.map(opId => {
                        const opInfo = getOpInfo(opId);
                        return (
                          <div key={opId} className="p-2.5 rounded-lg bg-slate-900 border border-cyan-900/60 text-[11px] space-y-0.5">
                            <strong className="text-cyan-300 block font-mono">+ {opInfo?.name || opId}</strong>
                            <span className="text-slate-400 text-[10px] block leading-snug">{opInfo?.desc}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Pista 3: Operaciones Sobrantes o Incompatibles */}
                {extraOps.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-bold text-rose-400">
                        3. Operaciones que Sobran o No Aplican ({extraOps.length}):
                      </span>
                      <button
                        onClick={() => {
                          const updated = selectedOperations.filter(op => currentScenario.appropriateOperations.includes(op));
                          evaluateProposal(chosenMechanism, updated);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-[10px] font-mono font-bold flex items-center gap-1 transition-colors"
                      >
                        <span>Retirar sobrantes (-{extraOps.length})</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {extraOps.map(opId => {
                        const opInfo = getOpInfo(opId);
                        return (
                          <span key={opId} className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-800/70 text-rose-300 text-[11px] font-mono flex items-center gap-1">
                            <span>✕ {opInfo?.name || opId}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quick Return Option */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/60 text-[11px] font-mono">
                  <span className="text-slate-400">¿Prefieres ajustar manualmente?</span>
                  <button
                    onClick={() => {
                      setShowAssistedHints(true);
                      goToStep(3);
                    }}
                    className="font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5 underline"
                  >
                    <span>Volver al Paso 3 con Pistas Visuales Activadas →</span>
                  </button>
                </div>

              </div>
            )}
          </div>

          {/* 4 Dimension Evaluation Cards (Compact and focused) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(evaluationResult.dimensions).map(([key, dim]) => (
              <div key={key} className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{dim.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                    dim.score === 'optimal' ? 'bg-emerald-950 text-emerald-300' : dim.score === 'acceptable' ? 'bg-amber-950 text-amber-300' : 'bg-rose-950 text-rose-300'
                  }`}>
                    {dim.score}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {dim.feedback}
                </p>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => goToStep(3)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Ajustar Estrategia</span>
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {evaluationResult.category !== 'fully_compatible' && !isResolvedWithoutPoints && (
                <button
                  onClick={resolveWithoutPoints}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-amber-950 transition-colors cursor-pointer"
                  title="Aplica la solución canónica para continuar sin ganar puntos (0 PTS)"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Resolver sin puntos</span>
                </button>
              )}

              <button
                onClick={handleGoToConclusion}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-950 flex items-center gap-2 cursor-pointer"
              >
                <span>Completar Caso y Ver Conclusión (Paso 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PASO 5: CONCLUSIÓN DEL CASO Y MI BITÁCORA                                 */}
      {/* ========================================================================= */}
      {roundStage === 5 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Paso 5: Caso Completado y Registro en Bitácora</span>
            </div>
            <button
              onClick={() => goToStep(4)}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver a Simulación</span>
            </button>
          </div>

          {/* Success Banner */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-600/70 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">
                ¡Investigación del Caso #{currentScenario.number} Registrada con Éxito!
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Has formulado la hipótesis inicial, inspeccionado la lesión molecular en el ADN, coordinado la estrategia enzimática celular y verificado la simulación del proceso de reparación.
            </p>
          </div>

          {/* Key Molecular Synthesis Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">1. Lesión Clave:</span>
              <strong className="text-white block font-mono">{currentScenario.lesionTypeName.split('(')[0]}</strong>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase">2. Vía Celular Canónica:</span>
              <strong className="text-cyan-300 block font-mono">{chosenMechanism || 'NER'}</strong>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase">3. Puntuación / Estado:</span>
              <strong className="text-amber-300 block font-mono">
                {isResolvedWithoutPoints ? '0 PTS (Asistida)' : '+100 PTS (Completada)'}
              </strong>
            </div>
          </div>

          {/* Componentes ingresados al Modelo Gráfico */}
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/40">
                <Network className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  Componentes integrados al Modelo Gráfico
                </span>
                <p className="text-slate-300 text-xs">
                  La fuente de daño ({currentScenario.damageSourceName}), la lesión ({currentScenario.lesionTypeName}), el mecanismo ({chosenMechanism}) y sus enzimas ({currentScenario.representativeProteins.slice(0, 3).join(', ')}) se han conectado en tu red causal.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveSpace('graph_builder')}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Abrir Modelo Gráfico</span>
            </button>
          </div>

          {/* What to do next? Clear Educational Next Steps */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <span className="text-xs font-mono uppercase font-bold text-slate-400 block">
              ¿Cuál es tu siguiente paso en el laboratorio?
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Option A: Next Scenario */}
              <button
                onClick={handleNextScenario}
                className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center mb-2">
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-300">
                  Siguiente Escenario
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pasa al siguiente problema biológico de la serie de 10 casos.
                </p>
              </button>

              {/* Option B: View in Graph Model */}
              <button
                onClick={() => setActiveSpace('graph_builder')}
                className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-2">
                  <Network className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-indigo-300">
                  Constructor de Modelos
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Revisa cómo se ensamblaron los nodos y evalúa la red con la rúbrica.
                </p>
              </button>

              {/* Option C: View Reference Material */}
              <button
                onClick={() => setActiveSpace('log')}
                className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center mb-2">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-teal-300">
                  Material de Consulta
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Revisa los fundamentos por capítulos y enzimas clave.
                </p>
              </button>

              {/* Option D: Restart this case */}
              <button
                onClick={() => {
                  restartCurrentScenario();
                  goToStep(1);
                }}
                className="p-4 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center mb-2">
                  <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                </div>
                <h4 className="text-xs font-bold text-white group-hover:text-amber-300">
                  Reiniciar este Caso
                </h4>
                <p className="text-[10px] text-slate-400 mt-1">
                  Repite el caso desde el Paso 1 reiniciando el contador (0 PTS).
                </p>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE PISTAS PROGRESSIVAS (No invasivo)                                */}
      {/* ========================================================================= */}
      {showHintsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-600/80 rounded-3xl p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold uppercase">
                <Lightbulb className="w-4 h-4" />
                <span>Pistas Progresivas para este Caso</span>
              </div>
              <button
                onClick={() => setShowHintsModal(false)}
                className="text-slate-400 hover:text-white text-base font-bold"
              >
                ✕
              </button>
            </div>

            {/* Level Tabs */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((lvl) => {
                const isUnlocked = lvl === 1 ? scenarioHints.l1 : lvl === 2 ? scenarioHints.l2 : scenarioHints.l3;
                return (
                  <button
                    key={lvl}
                    onClick={() => {
                      if (!isUnlocked) unlockHint(currentScenario.id, lvl as 1 | 2 | 3);
                      setActiveHintLevel(lvl as 1 | 2 | 3);
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                      activeHintLevel === lvl
                        ? 'bg-amber-950 border-amber-400 text-amber-200'
                        : isUnlocked
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}
                  >
                    Nivel {lvl} {isUnlocked ? '✓' : '🔒'}
                  </button>
                );
              })}
            </div>

            {/* Hint Content */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 min-h-[90px] flex items-center">
              {activeHintLevel === 1 && (
                scenarioHints.l1 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1 font-mono uppercase text-[10px]">Nivel 1 — Orientación:</strong>
                    <p className="text-slate-200 leading-relaxed">{currentScenario.hints.level1}</p>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic para desbloquear una pregunta orientadora sin revelar respuestas.</span>
                )
              )}

              {activeHintLevel === 2 && (
                scenarioHints.l2 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1 font-mono uppercase text-[10px]">Nivel 2 — Pista Mecanística:</strong>
                    <p className="text-slate-200 leading-relaxed">{currentScenario.hints.level2}</p>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic para desbloquear qué operación molecular resuelve esta alteración.</span>
                )
              )}

              {activeHintLevel === 3 && (
                scenarioHints.l3 ? (
                  <div>
                    <strong className="text-amber-400 block mb-1 font-mono uppercase text-[10px]">Nivel 3 — Explicación Profunda:</strong>
                    <p className="text-slate-200 leading-relaxed">{currentScenario.hints.level3}</p>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Haz clic para revelar el mecanismo molecular canónico y su justificación.</span>
                )
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowHintsModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cerrar Pistas
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
