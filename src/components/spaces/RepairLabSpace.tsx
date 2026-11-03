import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MolecularOperationId, RepairMechanismId } from '../../data/types';
import { RepairSimulationViewer } from '../RepairSimulationViewer';
import { 
  FlaskConical, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Award,
  Zap,
  Info,
  Dna
} from 'lucide-react';

const OPERATIONS_CATALOG: { id: MolecularOperationId; name: string; category: string; description: string }[] = [
  {
    id: 'recognize_distortion',
    name: 'Reconocer distorsión helicoidal',
    category: 'Reconocimiento',
    description: 'Detectar torceduras, inclinaciones de ~30° o desestabilización del apilamiento de bases.'
  },
  {
    id: 'recognize_modified_base',
    name: 'Reconocer base química individual',
    category: 'Reconocimiento',
    description: 'Voltear una base oxidada, alquilada o desaminada hacia un bolsillo enzimático específico.'
  },
  {
    id: 'recognize_mismatch',
    name: 'Reconocer error de apareamiento',
    category: 'Reconocimiento',
    description: 'Identificar puentes de hidrógeno anómalos (ej. G-T) sin alteración química intrínseca.'
  },
  {
    id: 'recognize_dsb_ends',
    name: 'Reconocer extremos de doble hebra rota',
    category: 'Reconocimiento',
    description: 'Abrazar y proteger los extremos de cromosomas rotos para evitar degradación.'
  },
  {
    id: 'direct_chemical_reversal',
    name: 'Revertir modificación directamente',
    category: 'Procesamiento',
    description: 'Transferir un grupo químico (como metilo) sin cortar el esqueleto de ADN ni retirar nucleótidos.'
  },
  {
    id: 'photoreactivation',
    name: 'Fotoreactivación por luz visible',
    category: 'Procesamiento',
    description: 'Ruptura fotoquímica de ciclobutanos mediante transferencia electrónica dependiente de luz azul.'
  },
  {
    id: 'excise_single_base',
    name: 'Eliminar una base dañada (enlace N-glucosídico)',
    category: 'Escisión',
    description: 'Hidrolizar el enlace entre la base y la desoxirribosa dejando un sitio apurínico o apirimidínico (AP).'
  },
  {
    id: 'cleave_ap_site',
    name: 'Incidir el esqueleto en sitio abásico (AP)',
    category: 'Escisión',
    description: 'Corte fosfodiéster en 5\' por una endonucleasa especializada para permitir síntesis de relleno.'
  },
  {
    id: 'excise_oligonucleotide',
    name: 'Escindir un segmento de nucleótidos (~24-32 nt)',
    category: 'Escisión',
    description: 'Cortes duales a ambos lados de la lesión para extraer el oligonucleótido que contiene el daño.'
  },
  {
    id: 'discriminate_daughter_strand',
    name: 'Discriminar hebra recién sintetizada',
    category: 'Reconocimiento',
    description: 'Distinguir la hebra hija que contiene el error usando melladuras transitorias o PCNA.'
  },
  {
    id: 'resynthesize_complementary_dna',
    name: 'Sintetizar ADN complementario',
    category: 'Síntesis',
    description: 'ADN polimerasa rellena la brecha utilizando la hebra opuesta intacta como molde fiel.'
  },
  {
    id: 'use_homologous_template',
    name: 'Utilizar información de secuencia homóloga',
    category: 'Síntesis',
    description: 'Invasión de hebra en la cromátida hermana idéntica disponible en fases S/G2.'
  },
  {
    id: 'process_and_ligate_ends',
    name: 'Procesar y unir extremos rotos',
    category: 'Unión',
    description: 'Acondicionamiento terminal y ligación directa de extremos bicatenarios sin molde extenso.'
  },
  {
    id: 'ligate_nick',
    name: 'Sellar melladura con ADN ligasa',
    category: 'Unión',
    description: 'Formación del enlace fosfodiéster final para devolver continuidad física al ADN.'
  },
  {
    id: 'arrest_cell_cycle',
    name: 'Detener temporalmente el ciclo celular',
    category: 'Regulación',
    description: 'Pausa en puntos de control (p53/ATM) para dar tiempo a la maquinaria enzimática antes de la división.'
  }
];

const MECHANISMS_LIST: { id: RepairMechanismId; name: string; shortName: string; badge: string; desc: string }[] = [
  {
    id: 'BER',
    name: 'Reparación por Escisión de Bases (BER)',
    shortName: 'BER',
    badge: 'Base Excision',
    desc: 'Corrige bases oxidadas (8-oxoG), alquiladas o desaminadas (U) mediante glucosilasas y AP endonucleasas.'
  },
  {
    id: 'NER',
    name: 'Reparación por Escisión de Nucleótidos (NER)',
    shortName: 'NER',
    badge: 'Nucleotide Excision',
    desc: 'Escinde tramos oligonucleotídicos de ~30 nt con dímeros UV o aductos voluminosos que deforman la hélice.'
  },
  {
    id: 'MMR',
    name: 'Reparación de Errores de Apareamiento (MMR)',
    shortName: 'MMR',
    badge: 'Mismatch Repair',
    desc: 'Corrige pares de bases mal apareadas (G-T) e indels posreplicativos discriminando la hebra nueva.'
  },
  {
    id: 'HR',
    name: 'Recombinación Homóloga (HR)',
    shortName: 'HR',
    badge: 'Homologous Recomb.',
    desc: 'Reparación de roturas de doble hebra de máxima fidelidad usando cromátida hermana en S/G2.'
  },
  {
    id: 'NHEJ',
    name: 'Unión de Extremos No Homólogos (NHEJ)',
    shortName: 'NHEJ',
    badge: 'End Joining',
    desc: 'Reconecta extremos bicatenarios rotos sin necesidad de molde homólogo en cualquier fase del ciclo.'
  },
  {
    id: 'DIRECT_MGMT',
    name: 'Reversión Directa por MGMT',
    shortName: 'MGMT',
    badge: 'Direct Repair',
    desc: 'Transfiere el grupo alquilo de O6-metilguanina a la enzima "suicida" sin romper enlaces fosfodiéster.'
  },
  {
    id: 'PHOTOLYASE',
    name: 'Fotoreactivación Enzimática (Fotoliasa)',
    shortName: 'Fotoliasa',
    badge: 'Procariotas/Luz',
    desc: 'Ruptura fotoquímica directa de dímeros UV mediante luz visible. Ausente en mamíferos placentarios.'
  },
  {
    id: 'PROOFREADING',
    name: 'Corrección de Pruebas (Proofreading)',
    shortName: 'Proofreading',
    badge: 'Polimerasa 3\'→5\'',
    desc: 'Actividad exonucleasa intrínseca in situ de la ADN polimerasa durante la elongación replicativa.'
  }
];

export const RepairLabSpace: React.FC = () => {
  const {
    currentScenario,
    selectedOperations,
    toggleOperation,
    chosenMechanism,
    setChosenMechanism,
    evaluationResult,
    evaluateProposal,
    setActiveSpace
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assembly' | 'evaluation'>('assembly');

  const handleEvaluate = () => {
    evaluateProposal();
    setActiveTab('evaluation');
  };

  const handleGoToPerturbations = () => {
    setActiveSpace('perturbation');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <FlaskConical className="w-4 h-4" />
            <span>Laboratorio de Reparación Molecular</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
            Escenario #{currentScenario.number}: {currentScenario.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('assembly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              activeTab === 'assembly'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            1. Ensamblar Estrategia
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            disabled={!evaluationResult}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
              activeTab === 'evaluation'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                : evaluationResult
                ? 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white'
                : 'bg-slate-950 text-slate-600 border-slate-900 cursor-not-allowed'
            }`}
          >
            2. Evaluación Multidimensional
          </button>
        </div>
      </div>

      {/* Assembly Tab: Operations & Mechanism Selection */}
      {activeTab === 'assembly' && (
        <div className="space-y-6">
          {/* Target Lesion Reminder */}
          <div className="flex items-center justify-between p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              <span className="text-slate-400">Lesión a reparar:</span>
              <strong className="text-white font-mono">{currentScenario.lesionTypeName}</strong>
            </div>
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Organismo: {currentScenario.organism.split('(')[0]}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Molecular Operations Palette (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Operaciones Moleculares Celulares</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Selecciona las operaciones que la célula debe coordinar para resolver este daño:
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {selectedOperations.length} seleccionadas
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[480px] overflow-y-auto pr-1">
                {OPERATIONS_CATALOG.map(op => {
                  const isSelected = selectedOperations.includes(op.id);
                  return (
                    <div
                      key={op.id}
                      onClick={() => toggleOperation(op.id)}
                      className={`p-3 rounded-xl border transition-all text-xs cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-cyan-950/70 border-cyan-500 text-cyan-100 shadow-md ring-1 ring-cyan-500/40'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
                            {op.category}
                          </span>
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3 fill-current" />}
                          </div>
                        </div>
                        <h4 className="font-bold text-white leading-tight">
                          {op.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                        {op.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inferred Mechanism Proposal (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Dna className="w-4 h-4 text-cyan-400" />
                    <span>Propón el Mecanismo de Reparación</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    ¿Cuál de estas vías canónicas representa la estrategia que has construido?
                  </p>
                </div>

                {/* Mechanisms options */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {MECHANISMS_LIST.map(mech => {
                    const isSelected = chosenMechanism === mech.id;
                    return (
                      <div
                        key={mech.id}
                        onClick={() => setChosenMechanism(mech.id)}
                        className={`p-3 rounded-xl border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-cyan-950 to-teal-950 border-cyan-400 text-white shadow-lg ring-1 ring-cyan-400/50'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-sm text-cyan-200">
                            {mech.shortName}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {mech.badge}
                          </span>
                        </div>
                        <div className="text-xs font-medium text-slate-200">
                          {mech.name}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                          {mech.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit for Multidimensional Evaluation */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleEvaluate}
                  disabled={!chosenMechanism || selectedOperations.length === 0}
                  className={`w-full py-3.5 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-xl flex items-center justify-center gap-2 ${
                    chosenMechanism && selectedOperations.length > 0
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white shadow-cyan-950/50 cursor-pointer'
                      : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  }`}
                >
                  <span>Evaluar Hipótesis en 4 Dimensiones</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Evaluation Tab: 4 Dimensions & Biochemical Simulation Viewer */}
      {activeTab === 'evaluation' && evaluationResult && chosenMechanism && (
        <div className="space-y-6">
          {/* Main Evaluation Verdict Banner */}
          <div className={`p-6 rounded-2xl border shadow-2xl space-y-3 ${
            evaluationResult.category === 'fully_compatible'
              ? 'bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-emerald-500/80 text-emerald-200'
              : evaluationResult.category === 'conditional_compatible'
              ? 'bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 border-cyan-500/80 text-cyan-200'
              : evaluationResult.category === 'partially_compatible'
              ? 'bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-950 border-amber-500/80 text-amber-200'
              : 'bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-950 border-rose-500/80 text-rose-200'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-950/80 border border-current">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider opacity-80 block">
                    Veredicto del Motor Científico
                  </span>
                  <h3 className="text-lg font-bold text-white">
                    {evaluationResult.categoryLabel}
                  </h3>
                </div>
              </div>

              <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-current font-mono text-xs">
                +{evaluationResult.pointsEarned} PTS ASIGNADOS
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed max-w-4xl pt-1">
              {evaluationResult.summary}
            </p>
          </div>

          {/* 4 Dimension Evaluation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(evaluationResult.dimensions).map(([key, dim]) => {
              const isOptimal = dim.score === 'optimal';
              const isAcceptable = dim.score === 'acceptable';
              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border text-xs space-y-2 bg-slate-900/90 ${
                    isOptimal
                      ? 'border-emerald-800/80'
                      : isAcceptable
                      ? 'border-amber-800/80'
                      : 'border-rose-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200 text-xs">
                      {dim.title}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                      isOptimal
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : isAcceptable
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-rose-950 text-rose-300 border border-rose-800'
                    }`}>
                      {dim.score}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {dim.feedback}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Missing Conditions or Scientific Rationale */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-mono font-bold uppercase text-[11px]">
              <Info className="w-4 h-4" />
              <span>Fundamento Bioquímico Detallado</span>
            </div>
            <p className="leading-relaxed">
              {evaluationResult.scientificExplanation}
            </p>

            <div className="pt-2 text-[11px] text-slate-400 flex flex-wrap gap-2 items-center">
              <span className="font-mono text-cyan-300">Proteínas representativas en humanos:</span>
              <span className="text-slate-200 font-mono">
                {currentScenario.representativeProteins.join(', ')}
              </span>
            </div>
          </div>

          {/* Interactive Step-by-Step Biochemical Simulation */}
          <RepairSimulationViewer
            mechanismId={chosenMechanism}
            scenario={currentScenario}
          />

          {/* Call to Action: Advance to Perturbations */}
          <div className="flex items-center justify-between p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/50 border border-indigo-900/60 rounded-2xl shadow-xl">
            <div>
              <div className="text-xs font-mono uppercase text-indigo-400 font-bold">
                Siguiente Etapa: Desafío de Condiciones
              </div>
              <h4 className="text-sm font-bold text-white mt-0.5">
                ¿Qué sucede si alteramos las condiciones celulares?
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Pon a prueba tu hipótesis introduciendo Cartas de Perturbación en el simulador.
              </p>
            </div>

            <button
              onClick={handleGoToPerturbations}
              className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-950/60 flex items-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <span>Simulador de Perturbaciones</span>
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
