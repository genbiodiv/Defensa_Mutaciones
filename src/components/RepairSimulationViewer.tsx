import React, { useState, useEffect } from 'react';
import { RepairMechanismId, Scenario } from '../data/types';
import { Play, RotateCcw, ChevronRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface RepairSimulationViewerProps {
  mechanismId: RepairMechanismId;
  scenario: Scenario;
  isPerturbed?: boolean;
  perturbationSummary?: string;
  onStepChange?: (step: number) => void;
}

interface StepDetails {
  step: number;
  name: string;
  proteinName: string;
  description: string;
  actionGraphic: string;
}

export const RepairSimulationViewer: React.FC<RepairSimulationViewerProps> = ({
  mechanismId,
  scenario,
  isPerturbed = false,
  perturbationSummary,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Dynamic biochemical steps per mechanism
  const getStepsForMechanism = (mech: RepairMechanismId): StepDetails[] => {
    switch (mech) {
      case 'BER':
        return [
          {
            step: 1,
            name: 'Reconocimiento y Volteo de Base',
            proteinName: 'ADN Glucosilasa específica (OGG1 / UNG)',
            description: 'La enzima escanea el surco menor, voltea la base nitrogenada alterada hacia su bolsillo catalítico y rompe selectivamente el enlace N-glucosídico dejando un sitio AP.',
            actionGraphic: 'Glycosylase flipping base -> AP site created'
          },
          {
            step: 2,
            name: 'Incisión del Esqueleto Fosfodiéster',
            proteinName: 'AP Endonucleasa (APE1)',
            description: 'APE1 reconoce el azúcar abásico desprovisto de base y corta el enlace fosfodiéster en el extremo 5\', dejando un extremo 3\'-OH libre y un 5\'-dRP.',
            actionGraphic: 'APE1 nicking 5\' phosphodiester bond'
          },
          {
            step: 3,
            name: 'Síntesis de Relleno Nucleotídico',
            proteinName: 'ADN Polimerasa β (y complejo XRCC1)',
            description: 'La Polimerasa β retira el residuo 5\'-desoxirribofosfato con su actividad liasa e inserta el dNTP complementario correcto guiado por la hebra molde intacta.',
            actionGraphic: 'Pol beta inserts correct dNTP'
          },
          {
            step: 4,
            name: 'Ligación y Sellado Covalente',
            proteinName: 'ADN Ligasa III-XRCC1 (o Ligasa I)',
            description: 'La ligasa cataliza la formación del enlace fosfodiéster final dependiente de ATP/NAD+, restituyendo la continuidad intacta de la molécula.',
            actionGraphic: 'Ligase seals the single-strand nick'
          }
        ];

      case 'NER':
        return [
          {
            step: 1,
            name: 'Detección de la Distorsión Helicoidal',
            proteinName: 'Complejo XPC-RAD23B (GG-NER) o ARN Pol II estancada con CSB (TC-NER)',
            description: 'El sensor detecta la rigidez y deformación de la doble hélice, reclutando al complejo multiproteico TFIIH con sus helicasas XPB y XPD.',
            actionGraphic: 'XPC senses bulge, TFIIH unwinds 30 nt bubble'
          },
          {
            step: 2,
            name: 'Incisión Dual y Escisión del Oligonucleótido',
            proteinName: 'Endonucleasas XPF-ERCC1 (en 5\') y XPG (en 3\')',
            description: 'El complejo realiza dos cortes precisos a ambos lados de la distorsión, liberando un fragmento monocatenario de 24 a 32 nucleótidos con el dímero o aducto.',
            actionGraphic: 'Dual incision releases 24-32 nt damaged oligo'
          },
          {
            step: 3,
            name: 'Resíntesis por Polimerasa Replicativa',
            proteinName: 'ADN Polimerasa δ / ε acoplada a PCNA y RPA',
            description: 'La polimerasa rellena la brecha monocatenaria de ~30 nucleótidos utilizando la hebra complementaria opuesta como molde fidedigno.',
            actionGraphic: 'Pol delta/epsilon resynthesizes 30 nt gap'
          },
          {
            step: 4,
            name: 'Sellado de la Melladura',
            proteinName: 'ADN Ligasa I (o Ligasa III-XRCC1)',
            description: 'Se forma el enlace fosfodiéster terminal, completando la restitución de la doble hélice sin mutaciones.',
            actionGraphic: 'Ligase I seals final nick'
          }
        ];

      case 'MMR':
        return [
          {
            step: 1,
            name: 'Reconocimiento del Apareamiento No Canónico',
            proteinName: 'Heterodímero MutSα (MSH2-MSH6) o MutSβ (MSH2-MSH3)',
            description: 'MutS abraza el dúplex de ADN, detecta el desapareamiento de puentes de hidrógeno (ej. G-T) e hidroliza ATP para formar una abrazadera deslizante.',
            actionGraphic: 'MutSalpha slides and clamps onto mismatch'
          },
          {
            step: 2,
            name: 'Reclutamiento de Endonucleasa y Discriminación de Hebra',
            proteinName: 'MutLα (MLH1-PMS2) y PCNA',
            description: 'MutLα orientada por PCNA incide específicamente la hebra recién sintetizada en una melladura preexistente, señalando el tramo a eliminar.',
            actionGraphic: 'MutLalpha cuts newly synthesized daughter strand'
          },
          {
            step: 3,
            name: 'Degradación por Exonucleasa y Resíntesis',
            proteinName: 'Exonucleasa 1 (EXO1), RPA y ADN Polimerasa δ',
            description: 'EXO1 degrada un tramo extenso de la hebra hija desde el corte pasando por el error; RPA protege la hebra molde y la Pol δ resintetiza el tramo.',
            actionGraphic: 'EXO1 degrades daughter strand past the error, Pol delta resynthesizes'
          },
          {
            step: 4,
            name: 'Sellado Final del Dúplex',
            proteinName: 'ADN Ligasa I',
            description: 'La ADN ligasa I sella la hebra hija, consolidando la corrección con una fidelidad global de 1 error en 10^9 pb.',
            actionGraphic: 'Ligase I completes repair of mismatch'
          }
        ];

      case 'HR':
        return [
          {
            step: 1,
            name: 'Resección 5\'→3\' y Formación de Colas 3\' Monocatenarias',
            proteinName: 'Complejo MRN (Mre11-Rad50-Nbs1), CtIP y EXO1/BLM',
            description: 'Favorecido en S/G2 por alta actividad CDK. Se degradan selectivamente las hebras 5\' dejando colas 3\' largas monocatenarias que son recubiertas por RPA.',
            actionGraphic: '5\' to 3\' resection creates 3\' overhangs'
          },
          {
            step: 2,
            name: 'Carga de Rad51 mediada por BRCA1/BRCA2',
            proteinName: 'BRCA1, BRCA2 y Recombinasa Rad51',
            description: 'BRCA2 desplaza a RPA y ensambla los filamentos nucleoproteicos de Rad51 sobre el ADN monocatenario, activándolo para la búsqueda de homología.',
            actionGraphic: 'BRCA2 loads Rad51 nucleoprotein filaments'
          },
          {
            step: 3,
            name: 'Invasión de Hebra y Síntesis Asistida por Molde (D-loop)',
            proteinName: 'Rad51, Rad54 y ADN Polimerasa δ',
            description: 'El filamento invade la cromátida hermana idéntica, desenrolla el dúplex homólogo (lazo D) y la polimerasa copia la secuencia perdida usando el molde perfecto.',
            actionGraphic: 'D-loop invasion into sister chromatid'
          },
          {
            step: 4,
            name: 'Resolución de Uniones de Holliday y Ligación',
            proteinName: 'Resolvasas (GEN1, BTR complex) y ADN Ligasa I',
            description: 'Se disuelven o cortan los intermediarios cruzados de Holliday, restaurando los dos cromosomas homólogos con fidelidad absoluta libre de mutaciones.',
            actionGraphic: 'Holliday junction resolution, seamless repair'
          }
        ];

      case 'NHEJ':
        return [
          {
            step: 1,
            name: 'Reconocimiento y Protección de Extremos Bicatenarios',
            proteinName: 'Heterodímero en anillo Ku70 / Ku80',
            description: 'El heterodímero Ku se desliza sobre los extremos rotos del ADN, protegiéndolos de nucleasas inespecíficas y reclutando a la quinasa DNA-PKcs.',
            actionGraphic: 'Ku70/80 ring clamps broken DNA ends'
          },
          {
            step: 2,
            name: 'Sinapsis y Fosforilación Trans',
            proteinName: 'DNA-PKcs y complejo MRN (opcional)',
            description: 'Dos complejos DNA-PKcs en extremos opuestos forman un puente físico de sinapsis, activando su dominio quinasa para autofosforilarse y abrir paso.',
            actionGraphic: 'DNA-PKcs bridges both chromosome ends'
          },
          {
            step: 3,
            name: 'Acondicionamiento y Procesamiento de Extremos',
            proteinName: 'Nucleasa Artemis, PNKP y Polimerasas μ / λ',
            description: 'Si los extremos están dañados o son incompatibles, Artemis recorta los extremos monocatenarios y las polimerasas rellenan pequeñas brechas.',
            actionGraphic: 'Artemis trims ends (may create small indels)'
          },
          {
            step: 4,
            name: 'Ligación Directa Bicatenaria',
            proteinName: 'Complejo ADN Ligasa IV - XRCC4 - XLF',
            description: 'La ADN Ligasa IV especializada sella ambas hebras fosfodiéster, restituyendo la continuidad cromosómica.',
            actionGraphic: 'DNA Ligase IV joins the two DNA ends'
          }
        ];

      case 'DIRECT_MGMT':
        return [
          {
            step: 1,
            name: 'Interrogación Estérica y Volteo de Base Alquilada',
            proteinName: 'MGMT (O6-alquilguanina-ADN alquiltransferasa)',
            description: 'MGMT inserta un lazo hidrofóbico en el surco menor del ADN, volteando la O6-metilguanina hacia su bolsillo catalítico interno sin cortar el ADN.',
            actionGraphic: 'MGMT flips O6-MeG into active site'
          },
          {
            step: 2,
            name: 'Transferencia Directa del Grupo Metilo',
            proteinName: 'Residuo catalítico Cys145 de MGMT',
            description: 'El grupo tiolato de la Cys145 ataca nucleofílicamente al carbono del grupo metilo, transfiriendo covalentemente el metilo a la proteína.',
            actionGraphic: 'Cys145 accepts -CH3 directly from guanine'
          },
          {
            step: 3,
            name: 'Restitución Inmediata de Guanina Nativa',
            proteinName: 'ADN intacto (sin uso de polimerasa ni nucleasa)',
            description: 'La guanina queda instantáneamente desmetilada y vuelve a la doble hélice, restaurando sus 3 puentes de hidrógeno canónicos con citosina.',
            actionGraphic: 'Guanine restored without breaking DNA backbone'
          },
          {
            step: 4,
            name: 'Inactivación y Degradación de la Enzima "Suicida"',
            proteinName: 'Vía Ubiquitina-Proteasoma 26S',
            description: 'La metilación de Cys145 induce un cambio conformacional irreversible que marca a MGMT para ubiquitinación y destrucción proteasomal inmediata.',
            actionGraphic: 'Methylated MGMT is degraded (suicide enzyme)'
          }
        ];

      case 'PHOTOLYASE':
        return [
          {
            step: 1,
            name: 'Reconocimiento en Oscuridad del Dímero CPD',
            proteinName: 'ADN Fotoliasa (Phr)',
            description: 'La enzima bacteriana se une con alta afinidad al dímero de ciclobutano de timina, volteándolo hacia su centro catalítico.',
            actionGraphic: 'Photolyase binds cyclobutane pyrimidine dimer'
          },
          {
            step: 2,
            name: 'Absorción de Fotón de Luz Azul por Cromóforo',
            proteinName: 'Cofactor Antena (MTHF o Deazaflavina)',
            description: 'La enzima absorbe un fotón de luz visible (~350-450 nm) y transfiere la energía de excitación al cofactor catalítico FADH-.',
            actionGraphic: 'Blue light photon excites FADH- cofactor'
          },
          {
            step: 3,
            name: 'Transferencia de Electrón y Ruptura Fotoquímica',
            proteinName: 'Cofactor catalítico FADH-',
            description: 'FADH-* cede un electrón al dímero, formando un radical transitorio que cataliza la ruptura espontánea de los enlaces C-C del ciclobutano.',
            actionGraphic: 'Electron transfer breaks cyclobutane ring'
          },
          {
            step: 4,
            name: 'Retorno del Electrón y Regeneración Catalítica',
            proteinName: 'FADH regenerado y dímero revertido',
            description: 'El electrón regresa a la flavina para regenerar FADH-; la enzima se disocia de las dos timinas sanas y queda lista para un nuevo ciclo catalítico.',
            actionGraphic: 'Normal thymines restored, enzyme ready for next photon'
          }
        ];

      default:
        return [
          {
            step: 1,
            name: 'Reconocimiento',
            proteinName: 'Proteína sensora',
            description: 'Identificación de la lesión molecular.',
            actionGraphic: 'Sensado'
          },
          {
            step: 2,
            name: 'Escisión / Modificación',
            proteinName: 'Complejo efector',
            description: 'Eliminación del daño.',
            actionGraphic: 'Escisión'
          },
          {
            step: 3,
            name: 'Síntesis',
            proteinName: 'ADN Polimerasa',
            description: 'Copia del molde complementario.',
            actionGraphic: 'Síntesis'
          },
          {
            step: 4,
            name: 'Ligación',
            proteinName: 'ADN Ligasa',
            description: 'Sellado covalente del esqueleto.',
            actionGraphic: 'Ligación'
          }
        ];
    }
  };

  const steps = getStepsForMechanism(mechanismId);

  // Play animation through 4 steps
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= 4) {
            setIsPlaying(false);
            return 4;
          }
          const next = prev + 1;
          if (onStepChange) onStepChange(next);
          return next;
        });
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onStepChange]);

  const handleStepSelect = (step: number) => {
    setIsPlaying(false);
    setCurrentStep(step);
    if (onStepChange) onStepChange(step);
  };

  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  const handlePlay = () => {
    if (currentStep >= 4) {
      setCurrentStep(1);
      if (onStepChange) onStepChange(1);
    }
    setIsPlaying(true);
  };

  const currentStepData = steps[currentStep - 1] || steps[0];

  return (
    <div className={`w-full rounded-2xl p-5 shadow-lg space-y-4 border transition-colors ${
      isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-cyan-900/50 text-slate-200'
    }`}>
      {/* Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 ${
        isLight ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div>
          <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
            isLight ? 'text-cyan-700' : 'text-cyan-400'
          }`}>
            Simulación Mecanística Paso a Paso
          </span>
          <h4 className={`text-base font-bold flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>Ruta:</span>
            <span className={`font-mono underline underline-offset-4 ${
              isLight ? 'text-cyan-700 decoration-cyan-400' : 'text-cyan-300 decoration-cyan-500/50'
            }`}>
              {mechanismId}
            </span>
          </h4>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStepSelect(1)}
            title="Reiniciar a Paso 1"
            className={`p-2 rounded-lg transition-colors border ${
              isLight 
                ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-md ${
              isPlaying
                ? isLight
                  ? 'bg-cyan-100 text-cyan-600 border border-cyan-300 cursor-not-allowed'
                  : 'bg-cyan-950 text-cyan-500 border border-cyan-800 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-900/40'
            }`}
          >
            <Play className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'Animando ruta...' : 'Reproducir simulación'}</span>
          </button>
        </div>
      </div>

      {/* Step Pills Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map(s => {
          const isActive = s.step === currentStep;
          const isPassed = s.step < currentStep;
          return (
            <button
              key={s.step}
              onClick={() => handleStepSelect(s.step)}
              className={`p-2.5 rounded-xl text-left border transition-all ${
                isActive
                  ? isLight
                    ? 'bg-cyan-50 border-cyan-500 text-cyan-900 shadow-sm ring-1 ring-cyan-400'
                    : 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-950 ring-1 ring-cyan-400/50'
                  : isPassed
                  ? isLight
                    ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-600'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-1">
                <span className="font-bold">PASO {s.step}</span>
                {isPassed && <CheckCircle2 className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />}
                {isActive && <span className={`w-2 h-2 rounded-full animate-ping ${isLight ? 'bg-cyan-600' : 'bg-cyan-400'}`} />}
              </div>
              <div className="text-[11px] font-semibold truncate leading-tight">
                {s.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Biochemical Stage Display */}
      <div className={`rounded-xl p-4 space-y-3 border ${
        isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-cyan-950'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className={`text-xs font-mono uppercase tracking-wide ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              Operación activa ({currentStep}/4)
            </div>
            <h5 className={`text-lg font-bold mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {currentStepData.name}
            </h5>
          </div>

          <div className={`px-2.5 py-1 rounded-md text-xs font-mono border ${
            isLight
              ? 'bg-cyan-100 border-cyan-300 text-cyan-900 font-bold'
              : 'bg-cyan-950 border-cyan-800/80 text-cyan-300'
          }`}>
            {currentStepData.proteinName}
          </div>
        </div>

        {/* Detailed Explanation */}
        <p className={`text-sm leading-relaxed p-3 rounded-lg border ${
          isLight ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'
        }`}>
          {currentStepData.description}
        </p>

        {/* Schematic Micro-Graphic */}
        <div className={`flex items-center justify-between pt-2 text-xs font-mono border-t ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className={`font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>Estado molecular:</span>
            <span className={isLight ? 'text-slate-900 font-medium' : 'text-slate-200'}>{currentStepData.actionGraphic}</span>
          </div>

          <div className={`flex items-center gap-1 text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
            <span>Paso {currentStep} de 4</span>
            <ChevronRight className={`w-3 h-3 ${isLight ? 'text-cyan-600' : 'text-cyan-400'}`} />
          </div>
        </div>
      </div>

      {/* Perturbation Alert if active */}
      {isPerturbed && perturbationSummary && (
        <div className={`flex items-start gap-3 p-3 rounded-xl text-xs border ${
          isLight 
            ? 'bg-rose-50 border-rose-200 text-rose-800' 
            : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
        }`}>
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className={`font-bold uppercase tracking-wider block ${
              isLight ? 'text-rose-900' : 'text-rose-300'
            }`}>
              Impacto de la perturbación activa:
            </span>
            <p className="mt-0.5 leading-relaxed">{perturbationSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
};
