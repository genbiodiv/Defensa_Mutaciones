import React from 'react';
import { LesionTypeId } from '../data/types';
import { useApp } from '../context/AppContext';

interface DnaVisualizerProps {
  lesionType: LesionTypeId;
  interactive?: boolean;
  activeOperationStep?: number; // 0: baseline, 1: recognition, 2: excision, 3: resynthesis, 4: resolved
  highlightElement?: string;
  showLabels?: boolean;
}

export const DnaVisualizer: React.FC<DnaVisualizerProps> = ({
  lesionType,
  activeOperationStep = 0,
  showLabels = true
}) => {
  const { themeMode } = useApp();
  const isLight = themeMode === 'light';

  // SVG Dimensions
  const width = 640;
  const height = 260;

  // Adaptive color tokens
  const hBondColor = isLight ? '#94a3b8' : '#475569';
  const labelColor = isLight ? '#334155' : '#94a3b8';
  const captionColor = isLight ? '#475569' : '#94a3b8';

  return (
    <div className={`relative w-full rounded-2xl p-4 shadow-lg overflow-hidden select-none transition-colors border ${
      isLight 
        ? 'bg-gradient-to-b from-white via-slate-50 to-white border-slate-300' 
        : 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-cyan-900/40'
    }`}>
      {/* Background grid for laboratory atmosphere */}
      <div className={`absolute inset-0 [background-size:16px_16px] pointer-events-none ${
        isLight 
          ? 'bg-[radial-gradient(#0284c7_1px,transparent_1px)] opacity-[0.08]' 
          : 'bg-[radial-gradient(#0891b2_1px,transparent_1px)] opacity-15'
      }`} />

      {/* Header bar */}
      <div className={`flex items-center justify-between pb-2 mb-2 border-b text-xs font-mono ${
        isLight ? 'border-slate-200 text-cyan-800' : 'border-slate-800 text-cyan-400'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full animate-pulse shadow-sm ${
            isLight ? 'bg-cyan-600 shadow-cyan-600' : 'bg-cyan-400 shadow-cyan-400'
          }`} />
          <span className="tracking-wider uppercase font-semibold">Visualizador Biofísico de ADN</span>
        </div>
        <div className={`flex items-center gap-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <span>5&apos; → 3&apos; Top</span>
          <span>•</span>
          <span>3&apos; → 5&apos; Bottom</span>
          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] border ${
            isLight
              ? 'bg-cyan-100 border-cyan-300 text-cyan-900'
              : 'bg-cyan-950/80 border-cyan-800/60 text-cyan-300'
          }`}>
            {lesionType.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto max-h-64 object-contain filter drop-shadow"
      >
        <defs>
          <linearGradient id="backboneGradTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0ea5e9" />
          </linearGradient>
          <linearGradient id="backboneGradBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Normal base pairs left (x: 60, 110, 160, 210) */}
        {[60, 110, 160, 210].map((x, i) => (
          <g key={`left-pair-${i}`} className="transition-all duration-300">
            {/* Hydrogen bonds */}
            <line x1={x} y1={80} x2={x} y2={180} stroke={hBondColor} strokeWidth="2" strokeDasharray="3 3" />
            {/* Top base */}
            <rect x={x - 12} y={80} width={24} height={36} rx={4} fill={i % 2 === 0 ? '#38bdf8' : '#34d399'} opacity="0.9" />
            <text x={x} y={102} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
              {i % 2 === 0 ? 'A' : 'G'}
            </text>
            {/* Bottom base */}
            <rect x={x - 12} y={144} width={24} height={36} rx={4} fill={i % 2 === 0 ? '#fb7185' : '#f59e0b'} opacity="0.9" />
            <text x={x} y={166} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
              {i % 2 === 0 ? 'T' : 'C'}
            </text>
          </g>
        ))}

        {/* Normal base pairs right (x: 430, 480, 530, 580) */}
        {[430, 480, 530, 580].map((x, i) => (
          <g key={`right-pair-${i}`} className="transition-all duration-300">
            {/* Hydrogen bonds */}
            <line x1={x} y1={80} x2={x} y2={180} stroke={hBondColor} strokeWidth="2" strokeDasharray="3 3" />
            {/* Top base */}
            <rect x={x - 12} y={80} width={24} height={36} rx={4} fill={i % 2 === 0 ? '#f59e0b' : '#38bdf8'} opacity="0.9" />
            <text x={x} y={102} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
              {i % 2 === 0 ? 'C' : 'A'}
            </text>
            {/* Bottom base */}
            <rect x={x - 12} y={144} width={24} height={36} rx={4} fill={i % 2 === 0 ? '#34d399' : '#fb7185'} opacity="0.9" />
            <text x={x} y={166} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">
              {i % 2 === 0 ? 'G' : 'T'}
            </text>
          </g>
        ))}

        {/* DYNAMIC CENTER: Specific Lesion Rendering */}

        {/* Case A: THYMINE DIMER (NER / UV) */}
        {lesionType === 'thymine_dimer' && (
          <g className="transition-all duration-500">
            {/* Distorted backbone top */}
            <path d="M 210 80 Q 300 35 340 50 Q 380 65 430 80" fill="none" stroke="#e11d48" strokeWidth="4.5" />
            <path d="M 210 180 Q 320 200 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            {/* Thymine Dimer Cyclobutane Ring between T-T */}
            <g transform="translate(290, 45)">
              <rect x="0" y="10" width="26" height="34" rx="4" fill="#e11d48" />
              <text x="13" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">T</text>
              <rect x="34" y="10" width="26" height="34" rx="4" fill="#e11d48" />
              <text x="47" y="32" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">T</text>

              {/* Covalent Cyclobutane linkage box */}
              <rect x="18" y="16" width="24" height="12" rx="2" fill="#fecdd3" stroke="#be123c" strokeWidth="1.5" />
              <text x="30" y="25" textAnchor="middle" fill="#881337" fontSize="8" fontWeight="black">CPD</text>
            </g>

            {/* Opposing unbonded bases */}
            <g transform="translate(290, 140)">
              <rect x="0" y="4" width="26" height="34" rx="4" fill="#38bdf8" opacity="0.6" strokeDasharray="2 2" stroke="#0284c7" />
              <text x="13" y="26" textAnchor="middle" fill="#0c4a6e" fontSize="11">A</text>
              <rect x="34" y="4" width="26" height="34" rx="4" fill="#38bdf8" opacity="0.6" strokeDasharray="2 2" stroke="#0284c7" />
              <text x="47" y="26" textAnchor="middle" fill="#0c4a6e" fontSize="11">A</text>
            </g>

            {/* Broken / strained H-bonds */}
            <line x1={303} y1={88} x2={303} y2={144} stroke="#e11d48" strokeWidth="1.5" strokeDasharray="2 4" />
            <line x1={337} y1={88} x2={337} y2={144} stroke="#e11d48" strokeWidth="1.5" strokeDasharray="2 4" />

            {/* Angle Indicator */}
            <path d="M 270 78 L 320 45 L 370 75" fill="none" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="320" y="35" textAnchor="middle" fill={isLight ? '#92400e' : '#fef08a'} fontSize="10" fontFamily="monospace" fontWeight="bold">
              Inflexión helicoidal ~30°
            </text>
          </g>
        )}

        {/* Case B: 8-OXOGUANINE (BER) */}
        {lesionType === '8_oxo_guanine' && (
          <g className="transition-all duration-500">
            <path d="M 210 80 L 430 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 210 180 L 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            {/* 8-OxoG base */}
            <g transform="translate(305, 80)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#e11d48" />
              <text x="15" y="23" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">8-oxoG</text>
              {/* Oxygen addition icon */}
              <circle cx="26" cy="4" r="8" fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
              <text x="26" y="7" textAnchor="middle" fill="#451a03" fontSize="8" fontWeight="bold">=O</text>
            </g>

            {/* Hoogsteen mispair with Adenine or Cytosine */}
            <g transform="translate(305, 144)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#f59e0b" stroke="#b45309" />
              <text x="15" y="23" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold">C (o A)</text>
            </g>

            <line x1={320} y1={116} x2={320} y2={144} stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
            <text x="320" y="236" textAnchor="middle" fill={isLight ? '#b91c1c' : '#f43f5e'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Oxigenación en C8: riesgo de apareamiento Hoogsteen con A]
            </text>
          </g>
        )}

        {/* Case C: URACIL IN DNA (BER) */}
        {lesionType === 'uracil_in_dna' && (
          <g className="transition-all duration-500">
            <path d="M 210 80 L 430 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 210 180 L 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            {/* Uracil */}
            <g transform="translate(305, 80)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#9333ea" />
              <text x="15" y="23" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="bold">U</text>
              <text x="15" y="-6" textAnchor="middle" fill={isLight ? '#7e22ce' : '#d8b4fe'} fontSize="9" fontWeight="semibold">Desaminada</text>
            </g>

            {/* Parental Guanine */}
            <g transform="translate(305, 144)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#34d399" />
              <text x="15" y="23" textAnchor="middle" fill="#064e3b" fontSize="12" fontWeight="bold">G</text>
              <text x="15" y="48" textAnchor="middle" fill={isLight ? '#047857' : '#6ee7b7'} fontSize="9">Molde parental</text>
            </g>

            <line x1={320} y1={116} x2={320} y2={144} stroke="#a855f7" strokeWidth="2" strokeDasharray="2 3" />
            <text x="320" y="236" textAnchor="middle" fill={isLight ? '#7e22ce' : '#c084fc'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Par anómalo U:G en ADN: sustrato de Uracilo-ADN Glucosilasa]
            </text>
          </g>
        )}

        {/* Case D: MISMATCH (MMR) */}
        {lesionType === 'mismatch' && (
          <g className="transition-all duration-500">
            <path d="M 210 80 Q 320 65 430 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 210 180 Q 320 195 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            {/* Mismatched T on daughter strand */}
            <g transform="translate(305, 75)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#fb7185" stroke="#e11d48" strokeWidth="2" />
              <text x="15" y="23" textAnchor="middle" fill="#881337" fontSize="12" fontWeight="bold">T</text>
              <text x="15" y="-6" textAnchor="middle" fill={isLight ? '#be123c' : '#fda4af'} fontSize="9" fontWeight="bold">Hebra hija errónea</text>
            </g>

            {/* Parental G */}
            <g transform="translate(305, 148)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#34d399" />
              <text x="15" y="23" textAnchor="middle" fill="#064e3b" fontSize="12" fontWeight="bold">G</text>
              <text x="15" y="48" textAnchor="middle" fill={isLight ? '#047857' : '#6ee7b7'} fontSize="9">Molde parental</text>
            </g>

            <line x1={320} y1={111} x2={320} y2={148} stroke="#ef4444" strokeWidth="2.5" strokeDasharray="2 4" />
            <text x="320" y="236" textAnchor="middle" fill={isLight ? '#b91c1c' : '#fb7185'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Par G-T no canónico: flexión local detectada por MutSα]
            </text>
          </g>
        )}

        {/* Case E: O6-METHYLGUANINE (DIRECT REPAIR) */}
        {lesionType === 'o6_methylguanine' && (
          <g className="transition-all duration-500">
            <path d="M 210 80 L 430 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 210 180 L 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            {/* O6-MeG */}
            <g transform="translate(305, 80)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#0284c7" />
              <text x="15" y="23" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">O6-MeG</text>
              <circle cx="26" cy="4" r="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="1.5" />
              <text x="26" y="7" textAnchor="middle" fill="#082f49" fontSize="8" fontWeight="black">-CH3</text>
            </g>

            {/* Thymine mispairing */}
            <g transform="translate(305, 144)">
              <rect x="0" y="0" width="30" height="36" rx="4" fill="#fb7185" opacity="0.8" />
              <text x="15" y="23" textAnchor="middle" fill="#fff" fontSize="11">T / C</text>
            </g>

            <line x1={320} y1={116} x2={320} y2={144} stroke="#0284c7" strokeWidth="2" strokeDasharray="3 3" />
            <text x="320" y="236" textAnchor="middle" fill={isLight ? '#0369a1' : '#38bdf8'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Grupo metilo en O6: diana estequiométrica de MGMT]
            </text>
          </g>
        )}

        {/* Case F: DOUBLE STRAND BREAK (NHEJ / HR) */}
        {lesionType === 'double_strand_break' && (
          <g className="transition-all duration-500">
            {/* Left fragment */}
            <path d="M 210 80 L 290 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 210 180 L 290 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />
            <line x1={260} y1={80} x2={260} y2={180} stroke={hBondColor} strokeWidth="2" strokeDasharray="3 3" />
            <rect x={248} y={80} width={24} height={36} rx={4} fill="#38bdf8" />
            <text x={260} y={102} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">C</text>
            <rect x={248} y={144} width={24} height={36} rx={4} fill="#34d399" />
            <text x={260} y={166} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">G</text>

            {/* BREAK GAP */}
            <rect x={290} y={60} width="60" height="140" fill={isLight ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.15)'} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" rx="8" />
            <text x={320} y={128} textAnchor="middle" fill="#b91c1c" fontSize="14" fontWeight="black" letterSpacing="1">
              DSB
            </text>
            <text x={320} y={144} textAnchor="middle" fill={isLight ? '#991b1b' : '#f87171'} fontSize="9" fontFamily="monospace" fontWeight="bold">
              ROTURA TOTAL
            </text>

            {/* Right fragment separated */}
            <path d="M 350 80 L 430 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
            <path d="M 350 180 L 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />
            <line x1={380} y1={80} x2={380} y2={180} stroke={hBondColor} strokeWidth="2" strokeDasharray="3 3" />
            <rect x={368} y={80} width={24} height={36} rx={4} fill="#f59e0b" />
            <text x={380} y={102} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">A</text>
            <rect x={368} y={144} width={24} height={36} rx={4} fill="#fb7185" />
            <text x={380} y={166} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold">T</text>

            {/* Free ends indicator dots */}
            <circle cx={290} cy={80} r="5" fill="#ef4444" />
            <circle cx={290} cy={180} r="5" fill="#ef4444" />
            <circle cx={350} cy={80} r="5" fill="#ef4444" />
            <circle cx={350} cy={180} r="5" fill="#ef4444" />

            <text x={320} y={236} textAnchor="middle" fill={isLight ? '#b91c1c' : '#f87171'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Pérdida de continuidad física bicatenaria: sustrato de Ku70/80 o Rad51]
            </text>
          </g>
        )}

        {/* Case G: BULKY ADDUCT (NER) */}
        {lesionType === 'bulky_adduct' && (
          <g className="transition-all duration-500">
            <path d="M 210 80 Q 320 30 430 80" fill="none" stroke="#d97706" strokeWidth="4.5" />
            <path d="M 210 180 Q 320 190 430 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

            <g transform="translate(300, 40)">
              <polygon points="10,25 25,12 45,12 55,25 45,38 25,38" fill="#b45309" stroke="#d97706" strokeWidth="2" />
              <polygon points="35,38 45,50 65,50 75,38 65,25 45,25" fill="#d97706" stroke="#b45309" strokeWidth="2" opacity="0.9" />
              <text x="35" y="28" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="black">BPDE</text>
              <rect x="25" y="48" width="22" height="32" rx="4" fill="#34d399" />
              <text x="36" y="68" textAnchor="middle" fill="#022c22" fontSize="11" fontWeight="bold">G</text>
            </g>

            <g transform="translate(325, 144)">
              <rect x="0" y="0" width="22" height="34" rx="4" fill="#f59e0b" opacity="0.6" />
              <text x="11" y="22" textAnchor="middle" fill="#451a03" fontSize="11">C</text>
            </g>

            <text x={320} y={236} textAnchor="middle" fill={isLight ? '#b45309' : '#fbbf24'} fontSize="11" fontFamily="monospace" fontWeight="bold">
              [Aducto policíclico voluminoso: desestabiliza apilamiento helicoidal]
            </text>
          </g>
        )}

        {/* Global Outer Backbones */}
        <path d="M 40 80 L 210 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
        <path d="M 430 80 L 600 80" fill="none" stroke="url(#backboneGradTop)" strokeWidth="4" />
        <path d="M 40 180 L 210 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />
        <path d="M 430 180 L 600 180" fill="none" stroke="url(#backboneGradBottom)" strokeWidth="4" />

        {/* Operation Step Marker Indicator */}
        {activeOperationStep > 0 && (
          <g transform="translate(20, 20)">
            <rect 
              x="0" 
              y="0" 
              width="160" 
              height="26" 
              rx="6" 
              fill={isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(15, 23, 42, 0.85)'} 
              stroke={isLight ? '#0284c7' : '#38bdf8'} 
              strokeWidth="1.5" 
            />
            <text 
              x="10" 
              y="17" 
              fill={isLight ? '#0369a1' : '#38bdf8'} 
              fontSize="11" 
              fontFamily="sans-serif" 
              fontWeight="bold"
            >
              {activeOperationStep === 1 && 'Paso 1: Reconocimiento'}
              {activeOperationStep === 2 && 'Paso 2: Escisión / Modif.'}
              {activeOperationStep === 3 && 'Paso 3: Síntesis ADN'}
              {activeOperationStep === 4 && 'Paso 4: Ligación / Resolución'}
            </text>
          </g>
        )}
      </svg>

      {/* Explanatory Caption */}
      {showLabels && (
        <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[11px] ${
          isLight ? 'border-slate-200 text-slate-600' : 'border-slate-800/80 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Esqueleto azúcar-fosfato</span>
            <span className="mx-1">•</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>Bases nitrogenadas canónicas</span>
          </div>
          <div className={isLight ? 'text-rose-600 font-medium' : 'text-rose-400 font-medium'}>
            Zona de lesión molecular destacada
          </div>
        </div>
      )}
    </div>
  );
};
