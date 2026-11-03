import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  SpaceId, 
  Scenario, 
  DiscoveryLogEntry, 
  GraphModel, 
  GraphNode, 
  GraphEdge, 
  ModelRubricScore, 
  Achievement, 
  StudentProfile, 
  MolecularOperationId, 
  RepairMechanismId, 
  EvaluationResult,
  ThemeMode,
  FontSizeScale,
  GraphNodeType,
  GraphEdgeType
} from '../data/types';
import { SCENARIOS } from '../data/scenarios';
import { evaluateStudentProposal } from '../engine/evaluationEngine';
import { evaluateGraphModel } from '../engine/graphEvaluationEngine';
import confetti from 'canvas-confetti';

interface AppContextType {
  activeSpace: SpaceId;
  setActiveSpace: (space: SpaceId) => void;
  
  // Scenario & Round
  currentScenario: Scenario;
  currentScenarioId: string;
  selectScenario: (id: string) => void;
  allScenarios: Scenario[];
  coreScenarios: Scenario[];
  additionalScenarios: Scenario[];

  // Stage in current round (1 to 6)
  roundStage: number;
  setRoundStage: (stage: number) => void;

  // Stage 1: Hypotheses
  selectedHypothesisIds: string[];
  toggleHypothesis: (id: string) => void;
  isHypothesisSubmitted: boolean;
  submitHypothesis: () => void;

  // Stage 2: Lesion
  selectedLesionNotes: string;
  setSelectedLesionNotes: (notes: string) => void;
  isLesionConfirmed: boolean;
  confirmLesion: () => void;

  // Stage 3 & 4: Operations & Mechanism
  selectedOperations: MolecularOperationId[];
  setSelectedOperations: (ops: MolecularOperationId[]) => void;
  toggleOperation: (op: MolecularOperationId) => void;
  chosenMechanism: RepairMechanismId | null;
  setChosenMechanism: (mech: RepairMechanismId | null) => void;
  evaluationResult: EvaluationResult | null;
  evaluateProposal: (customMech?: RepairMechanismId, customOps?: MolecularOperationId[], awardPoints?: boolean) => void;
  isResolvedWithoutPoints: boolean;
  resolveWithoutPoints: () => void;
  retryForPoints: () => void;
  restartCurrentScenario: () => void;

  // Stage 5: Perturbations
  activePerturbationId: string | null;
  setActivePerturbationId: (id: string | null) => void;
  perturbationNotes: string;
  setPerturbationNotes: (notes: string) => void;
  reEvaluateUnderPerturbation: (perturbationId: string) => void;

  // Stage 6: Reflection & Save to Log
  studentReflectionNotes: string;
  setStudentReflectionNotes: (notes: string) => void;
  saveCurrentRoundToLog: () => void;

  // Hints
  unlockedHints: { [scenarioId: string]: { l1: boolean; l2: boolean; l3: boolean } };
  unlockHint: (scenarioId: string, level: 1 | 2 | 3) => void;

  // Bitácora / Discovery Log
  discoveryLogs: DiscoveryLogEntry[];
  deleteLogEntry: (id: string) => void;
  clearAllLogs: () => void;

  // Graph Builder
  graphModel: GraphModel;
  updateGraphModel: (model: GraphModel) => void;
  addGraphNode: (node: Omit<GraphNode, 'id'>) => void;
  updateGraphNode: (id: string, updates: Partial<GraphNode>) => void;
  deleteGraphNode: (id: string) => void;
  addGraphEdge: (edge: Omit<GraphEdge, 'id'>) => void;
  deleteGraphEdge: (id: string) => void;
  rubricEvaluation: ModelRubricScore | null;
  evaluateCurrentGraph: () => void;
  loadTemplateGraph: () => void;
  resetGraph: () => void;
  addScenarioComponentsToGraph: (scenario: Scenario, mechanismId: RepairMechanismId) => void;
  reorganizeGraph: () => void;
  graphInjectedScenarioId: string | null;

  // Profile & Gamification
  profile: StudentProfile;
  setStudentName: (name: string) => void;
  addPoints: (pts: number, reason?: string) => void;
  resetPoints: () => void;

  // Teacher Mode
  isTeacherMode: boolean;
  setIsTeacherMode: (val: boolean) => void;
  isProjectorMode: boolean;
  setIsProjectorMode: (val: boolean) => void;
  largeFont: boolean;
  setLargeFont: (val: boolean) => void;
  teacherScoreOverride: number | undefined;
  setTeacherScoreOverride: (score: number | undefined) => void;
  teacherFeedback: string;
  setTeacherFeedback: (fb: string) => void;
  comparedModels: [GraphModel | null, GraphModel | null];
  setComparedModels: (models: [GraphModel | null, GraphModel | null]) => void;

  // Reset entire activity
  resetAllProgress: () => void;

  // Appearance & Accessibility Tools
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  isHighContrast: boolean;
  setIsHighContrast: (val: boolean) => void;
  toggleHighContrast: () => void;
  fontSizeScale: FontSizeScale;
  setFontSizeScale: (scale: FontSizeScale) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  teacherNotification: string | null;
  setTeacherNotification: (msg: string | null) => void;
  showSplashScreen: boolean;
  setShowSplashScreen: (val: boolean) => void;
}

const STORAGE_KEY = 'destino_genoma_v3';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'investigador_lesiones',
    title: 'Investigador de Lesiones',
    description: 'Identificaste correctamente las características moleculares de 3 tipos de daño.',
    iconName: 'Microscope',
    unlocked: false
  },
  {
    id: 'explorador_rutas',
    title: 'Explorador de Rutas',
    description: 'Descubriste y evaluaste con éxito 3 mecanismos de reparación diferentes.',
    iconName: 'Route',
    unlocked: false
  },
  {
    id: 'especialista_recombinacion',
    title: 'Especialista en Recombinación',
    description: 'Comprendiste el dilema NHEJ vs HR en fases G1 y G2 con cromátida hermana.',
    iconName: 'Dna',
    unlocked: false
  },
  {
    id: 'detector_condiciones',
    title: 'Detector de Condiciones',
    description: 'Superaste 3 perturbaciones celulares complejas adaptando tu hipótesis.',
    iconName: 'Sliders',
    unlocked: false
  },
  {
    id: 'constructor_modelos',
    title: 'Arquitecto del Genoma',
    description: 'Construiste un modelo de red evaluado con más de 7/10 en la rúbrica científica.',
    iconName: 'Network',
    unlocked: false
  }
];

const DEFAULT_GRAPH: GraphModel = {
  id: 'modelo_estudiante_1',
  title: 'Red de Decisiones Genómicas',
  author: 'Estudiante de Medicina',
  updatedAt: new Date().toISOString(),
  nodes: [
    { id: 'n_uv', type: 'damage_source', label: 'Radiación UVB Solar', x: 80, y: 100 },
    { id: 'n_dimer', type: 'lesion', label: 'Dímero de Pirimidinas (CPD)', x: 300, y: 100 },
    { id: 'n_ner', type: 'mechanism', label: 'NER (Escisión de Nucleótidos)', x: 550, y: 100 },
    { id: 'n_resec', type: 'operation', label: 'Incisión dual ~30 nt (TFIIH/XPF/XPG)', x: 550, y: 220 },
    { id: 'n_dsb', type: 'lesion', label: 'Rotura de Doble Hebra (DSB)', x: 300, y: 340 },
    { id: 'n_g2', type: 'condition', label: 'Fase G2 / Cromátida Hermana', x: 100, y: 340 },
    { id: 'n_hr', type: 'mechanism', label: 'Recombinación Homóloga (Rad51/BRCA2)', x: 550, y: 340 },
    { id: 'n_fid', type: 'outcome', label: 'Restauración Fiel sin Mutación', x: 800, y: 220 }
  ],
  edges: [
    { id: 'e1', source: 'n_uv', target: 'n_dimer', relation: 'produce' },
    { id: 'e2', source: 'n_dimer', target: 'n_ner', relation: 'repara' },
    { id: 'e3', source: 'n_ner', target: 'n_resec', relation: 'requiere' },
    { id: 'e4', source: 'n_g2', target: 'n_hr', relation: 'favorece' },
    { id: 'e5', source: 'n_dsb', target: 'n_hr', relation: 'puede_provocar' },
    { id: 'e6', source: 'n_hr', target: 'n_fid', relation: 'conduce_a' }
  ]
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation
  const [activeSpace, setActiveSpace] = useState<SpaceId>('home');
  const [currentScenarioId, setCurrentScenarioId] = useState<string>('escenario_1_uv');

  // Round flow (Stage 1 to 6)
  const [roundStage, setRoundStage] = useState<number>(1);
  const [selectedHypothesisIds, setSelectedHypothesisIds] = useState<string[]>([]);
  const [isHypothesisSubmitted, setIsHypothesisSubmitted] = useState<boolean>(false);

  const [selectedLesionNotes, setSelectedLesionNotes] = useState<string>('');
  const [isLesionConfirmed, setIsLesionConfirmed] = useState<boolean>(false);

  const [selectedOperations, setSelectedOperations] = useState<MolecularOperationId[]>([]);
  const [chosenMechanism, setChosenMechanism] = useState<RepairMechanismId | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [isResolvedWithoutPoints, setIsResolvedWithoutPoints] = useState<boolean>(false);

  const [activePerturbationId, setActivePerturbationId] = useState<string | null>(null);
  const [perturbationNotes, setPerturbationNotes] = useState<string>('');

  const [studentReflectionNotes, setStudentReflectionNotes] = useState<string>('');

  // Unlocked hints per scenario
  const [unlockedHints, setUnlockedHints] = useState<{ [scenarioId: string]: { l1: boolean; l2: boolean; l3: boolean } }>({});

  // Discovery Log
  const [discoveryLogs, setDiscoveryLogs] = useState<DiscoveryLogEntry[]>([]);

  // Graph Model
  const [graphModel, setGraphModel] = useState<GraphModel>(DEFAULT_GRAPH);
  const [rubricEvaluation, setRubricEvaluation] = useState<ModelRubricScore | null>(null);
  const [graphInjectedScenarioId, setGraphInjectedScenarioId] = useState<string | null>(null);

  // Student Profile & Gamification
  const [profile, setProfile] = useState<StudentProfile>({
    name: 'Grupo Clínico A-1',
    totalScore: 0,
    completedScenarioIds: [],
    achievements: INITIAL_ACHIEVEMENTS,
    activeScenarioId: 'escenario_1_uv'
  });

  // Teacher Mode
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [teacherScoreOverride, setTeacherScoreOverride] = useState<number | undefined>(undefined);
  const [teacherFeedback, setTeacherFeedback] = useState<string>('');
  const [comparedModels, setComparedModels] = useState<[GraphModel | null, GraphModel | null]>([null, null]);

  // Appearance & Accessibility State
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [fontSizeScale, setFontSizeScale] = useState<FontSizeScale>('base');
  const [teacherNotification, setTeacherNotification] = useState<string | null>(null);
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('splash_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  // 5x 'h' consecutive keypresses triggers teacher mode
  useEffect(() => {
    let count = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea or contenteditable element
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
          return;
        }
      }

      if (e.key === 'h' || e.key === 'H') {
        count += 1;
        if (resetTimer) clearTimeout(resetTimer);

        if (count >= 5) {
          count = 0;
          setIsTeacherMode(true);
          setActiveSpace('teacher');
          setTeacherNotification('¡Modo Docente Activado! (Secuencia 5x "H" detectada)');
        } else {
          // Reset if next 'h' isn't pressed within 3 seconds
          resetTimer = setTimeout(() => {
            count = 0;
          }, 3000);
        }
      } else {
        // Any other key breaks the sequence
        count = 0;
        if (resetTimer) clearTimeout(resetTimer);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, []);

  // Auto-dismiss teacher notification after 4.5 seconds
  useEffect(() => {
    if (!teacherNotification) return;
    const timer = setTimeout(() => {
      setTeacherNotification(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [teacherNotification]);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile) setProfile(parsed.profile);
        if (parsed.discoveryLogs) setDiscoveryLogs(parsed.discoveryLogs);
        if (parsed.graphModel) setGraphModel(parsed.graphModel);
        if (parsed.unlockedHints) setUnlockedHints(parsed.unlockedHints);
        if (parsed.currentScenarioId) setCurrentScenarioId(parsed.currentScenarioId);
        if (parsed.themeMode) setThemeMode(parsed.themeMode);
        if (typeof parsed.isHighContrast === 'boolean') setIsHighContrast(parsed.isHighContrast);
        if (parsed.fontSizeScale) setFontSizeScale(parsed.fontSizeScale);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    try {
      const dataToSave = {
        profile,
        discoveryLogs,
        graphModel,
        unlockedHints,
        currentScenarioId,
        themeMode,
        isHighContrast,
        fontSizeScale
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      // ignore
    }
  }, [profile, discoveryLogs, graphModel, unlockedHints, currentScenarioId, themeMode, isHighContrast, fontSizeScale]);

  // Synchronize font scale with HTML root and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const fontSizes: Record<FontSizeScale, string> = {
      sm: '14px',
      base: '16px',
      lg: '18.5px',
      xl: '21px'
    };
    root.style.fontSize = fontSizes[fontSizeScale] || '16px';
    root.setAttribute('data-font-scale', fontSizeScale);
  }, [fontSizeScale]);

  const coreScenarios = SCENARIOS.filter(s => !s.isAdditional);
  const additionalScenarios = SCENARIOS.filter(s => s.isAdditional);
  const currentScenario = SCENARIOS.find(s => s.id === currentScenarioId) || SCENARIOS[0];

  const selectScenario = (id: string) => {
    setCurrentScenarioId(id);
    setRoundStage(1);
    setSelectedHypothesisIds([]);
    setIsHypothesisSubmitted(false);
    setSelectedLesionNotes('');
    setIsLesionConfirmed(false);
    setSelectedOperations([]);
    setChosenMechanism(null);
    setEvaluationResult(null);
    setIsResolvedWithoutPoints(false);
    setActivePerturbationId(null);
    setPerturbationNotes('');
    setStudentReflectionNotes('');
    // Reinicia el contador de puntos cada vez que se reinicia / selecciona un caso
    setProfile(prev => ({ ...prev, totalScore: 0 }));
  };

  const restartCurrentScenario = () => {
    selectScenario(currentScenarioId);
  };

  const resetPoints = () => {
    setProfile(prev => ({ ...prev, totalScore: 0 }));
  };

  const addPoints = (pts: number, reason?: string) => {
    setProfile(prev => ({
      ...prev,
      totalScore: Math.max(0, prev.totalScore + pts)
    }));

    if (pts >= 70) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.85 }
        });
      } catch {
        // confetti fallback
      }
    }
  };

  const unlockAchievement = (achId: string) => {
    setProfile(prev => {
      const updated = prev.achievements.map(a => {
        if (a.id === achId && !a.unlocked) {
          try {
            confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
          } catch {
            // ignore
          }
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return a;
      });
      return { ...prev, achievements: updated };
    });
  };

  const toggleHypothesis = (id: string) => {
    if (isHypothesisSubmitted) return;
    setSelectedHypothesisIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const submitHypothesis = () => {
    setIsHypothesisSubmitted(true);
    // Score based on sound choices without overly penalizing initial exploration
    const soundCount = selectedHypothesisIds.filter(id => {
      const opt = currentScenario.hypothesisOptions.find(o => o.id === id);
      return opt?.isScientificallySound;
    }).length;
    addPoints(soundCount * 15, 'Hipótesis formulada');
    setRoundStage(2);
  };

  const confirmLesion = () => {
    setIsLesionConfirmed(true);
    addPoints(25, 'Lesión molecular identificada');
    setRoundStage(3);

    // Check achievement 1: Investigador de lesiones
    if (profile.completedScenarioIds.length >= 2) {
      unlockAchievement('investigador_lesiones');
    }
  };

  const toggleOperation = (op: MolecularOperationId) => {
    setSelectedOperations(prev =>
      prev.includes(op) ? prev.filter(x => x !== op) : [...prev, op]
    );
  };

  const evaluateProposal = (customMech?: RepairMechanismId, customOps?: MolecularOperationId[], awardPoints = true) => {
    const mechToUse = customMech || chosenMechanism;
    const opsToUse = customOps || selectedOperations;
    if (!mechToUse) return;

    if (customMech) setChosenMechanism(customMech);
    if (customOps) setSelectedOperations(customOps);

    // In Step 4, evaluate the basal physiological strategy without perturbations
    setActivePerturbationId(null);

    const result = evaluateStudentProposal(
      currentScenario,
      mechToUse,
      opsToUse,
      undefined
    );

    if (!awardPoints) {
      result.pointsEarned = 0;
      setIsResolvedWithoutPoints(true);
    } else {
      setIsResolvedWithoutPoints(false);
    }

    setEvaluationResult(result);

    // Only award points when awardPoints is true AND result earned points (> 0)
    if (awardPoints && result.pointsEarned > 0) {
      addPoints(result.pointsEarned, 'Propuesta evaluada');
    }
    setRoundStage(4);

    if (result.category === 'fully_compatible' || result.category === 'conditional_compatible') {
      // In cada caso exitoso, ingresa esos componentes en el modelo grafico
      if (result.category === 'fully_compatible') {
        addScenarioComponentsToGraph(currentScenario, mechToUse);
      }
      // Check achievement 2: Explorador de rutas
      unlockAchievement('explorador_rutas');
    }

    if (currentScenario.id === 'escenario_6_dsb_g1' || currentScenario.id === 'escenario_7_dsb_g2') {
      unlockAchievement('especialista_recombinacion');
    }
  };

  const resolveWithoutPoints = () => {
    const primary = currentScenario.compatibleMechanisms.find(m => m.isPrimary)?.mechanismId 
      || currentScenario.compatibleMechanisms[0]?.mechanismId;
    if (!primary) return;

    setActivePerturbationId(null);
    evaluateProposal(primary, currentScenario.appropriateOperations, false);
  };

  const retryForPoints = () => {
    setIsResolvedWithoutPoints(false);
    setActivePerturbationId(null);
    // Reinicia el contador de puntos cada vez que se reinicia el intento
    setProfile(prev => ({ ...prev, totalScore: 0 }));
    setRoundStage(3);
  };

  const reEvaluateUnderPerturbation = (perturbationId: string) => {
    setActivePerturbationId(perturbationId);
    if (chosenMechanism) {
      const result = evaluateStudentProposal(
        currentScenario,
        chosenMechanism,
        selectedOperations,
        perturbationId
      );
      setEvaluationResult(result);
      unlockAchievement('detector_condiciones');
    }
  };

  const unlockHint = (scenarioId: string, level: 1 | 2 | 3) => {
    setUnlockedHints(prev => {
      const cur = prev[scenarioId] || { l1: false, l2: false, l3: false };
      return {
        ...prev,
        [scenarioId]: {
          ...cur,
          [`l${level}`]: true
        }
      };
    });
  };

  const saveCurrentRoundToLog = () => {
    const newEntry: DiscoveryLogEntry = {
      id: `log_${Date.now()}`,
      scenarioId: currentScenario.id,
      scenarioTitle: currentScenario.title,
      timestamp: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' }),
      damageSource: currentScenario.damageSourceName,
      identifiedLesion: currentScenario.lesionTypeName,
      cellularContext: currentScenario.initialContext,
      consideredMechanisms: chosenMechanism ? [chosenMechanism] : [],
      discardedMechanisms: currentScenario.incompatibleMechanisms.map(i => ({
        mechanism: i.mechanismId,
        reason: i.reason
      })),
      compatibleMechanisms: currentScenario.compatibleMechanisms.map(c => ({
        mechanism: c.mechanismId,
        conditions: c.conditions
      })),
      chosenOperations: selectedOperations,
      evaluationCategory: evaluationResult?.category || 'partially_compatible',
      activePerturbation: activePerturbationId || undefined,
      perturbationImpact: evaluationResult?.summary,
      studentHypothesisNotes: selectedHypothesisIds.map(hId => {
        return currentScenario.hypothesisOptions.find(o => o.id === hId)?.text || '';
      }).filter(Boolean).join('; '),
      studentReflectionNotes: studentReflectionNotes || 'Sin notas de reflexión adicionales.',
      keyInsights: currentScenario.keyConcepts
    };

    setDiscoveryLogs(prev => [newEntry, ...prev]);

    // Mark scenario completed if not already
    setProfile(prev => {
      const completed = prev.completedScenarioIds.includes(currentScenario.id)
        ? prev.completedScenarioIds
        : [...prev.completedScenarioIds, currentScenario.id];
      return { ...prev, completedScenarioIds: completed };
    });

    // In cada caso exitoso, ingresa esos componentes en el modelo grafico
    if (chosenMechanism) {
      addScenarioComponentsToGraph(currentScenario, chosenMechanism);
    }

    addPoints(30, 'Descubrimiento registrado en Bitácora');
  };

  const deleteLogEntry = (id: string) => {
    setDiscoveryLogs(prev => prev.filter(e => e.id !== id));
  };

  const clearAllLogs = () => {
    setDiscoveryLogs([]);
  };

  // Graph Builder functions
  const updateGraphModel = (model: GraphModel) => {
    setGraphModel({
      ...model,
      updatedAt: new Date().toISOString()
    });
  };

  const addGraphNode = (node: Omit<GraphNode, 'id'>) => {
    const newNode: GraphNode = {
      ...node,
      id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setGraphModel(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date().toISOString()
    }));
  };

  const updateGraphNode = (id: string, updates: Partial<GraphNode>) => {
    setGraphModel(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === id ? { ...n, ...updates } : n),
      updatedAt: new Date().toISOString()
    }));
  };

  const deleteGraphNode = (id: string) => {
    setGraphModel(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== id),
      edges: prev.edges.filter(e => e.source !== id && e.target !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const addGraphEdge = (edge: Omit<GraphEdge, 'id'>) => {
    const newEdge: GraphEdge = {
      ...edge,
      id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`
    };
    setGraphModel(prev => ({
      ...prev,
      edges: [...prev.edges, newEdge],
      updatedAt: new Date().toISOString()
    }));
  };

  const deleteGraphEdge = (id: string) => {
    setGraphModel(prev => ({
      ...prev,
      edges: prev.edges.filter(e => e.id !== id),
      updatedAt: new Date().toISOString()
    }));
  };

  const evaluateCurrentGraph = () => {
    const rubric = evaluateGraphModel(graphModel);
    setRubricEvaluation(rubric);
    if (rubric.totalScore >= 7) {
      unlockAchievement('constructor_modelos');
    }
  };

  const loadTemplateGraph = () => {
    setGraphModel(DEFAULT_GRAPH);
    setRubricEvaluation(null);
  };

  const resetGraph = () => {
    setGraphModel({
      id: `model_${Date.now()}`,
      title: 'Nuevo Modelo Genómico',
      author: profile.name,
      updatedAt: new Date().toISOString(),
      nodes: [],
      edges: []
    });
    setRubricEvaluation(null);
  };

  const addScenarioComponentsToGraph = (scenario: Scenario, mechanismId: RepairMechanismId) => {
    setGraphModel(prev => {
      const existingNodes = [...prev.nodes];
      const existingEdges = [...prev.edges];

      // Helper to find existing node by id or type+label
      const findOrAddNode = (id: string, type: GraphNodeType, label: string, x: number, y: number): string => {
        const norm = label.trim().toLowerCase();
        const found = existingNodes.find(n =>
          n.id === id || (n.type === type && (n.label.trim().toLowerCase() === norm || n.label.toLowerCase().includes(norm) || norm.includes(n.label.toLowerCase())))
        );
        if (found) {
          return found.id;
        }
        existingNodes.push({ id, type, label, x, y });
        return id;
      };

      // Spacing per scenario so they don't overlap vertically
      const rowY = 80 + ((scenario.number - 1) % 8) * 160;

      const sourceLabel = scenario.damageSourceName;
      const lesionLabel = scenario.lesionTypeName;
      const isPrimary = scenario.compatibleMechanisms.find(m => m.mechanismId === mechanismId)?.isPrimary;
      const mechLabel = `${mechanismId} (${isPrimary ? 'Canónico' : 'Compatible'})`;
      const compLabel = scenario.representativeProteins.slice(0, 3).join(', ') || 'Maquinaria de reparación';
      const outcomeLabel = `Restauración Fiel sin Mutación (Caso ${scenario.number})`;

      const sourceNodeId = findOrAddNode(`n_src_${scenario.id}`, 'damage_source', sourceLabel, 80, rowY);
      const lesionNodeId = findOrAddNode(`n_les_${scenario.id}`, 'lesion', lesionLabel, 300, rowY);
      const mechNodeId = findOrAddNode(`n_mech_${mechanismId}_${scenario.id}`, 'mechanism', mechLabel, 550, rowY);
      const compNodeId = findOrAddNode(`n_comp_${scenario.id}`, 'component', compLabel, 550, rowY + 75);
      const outcomeNodeId = findOrAddNode(`n_out_${scenario.id}`, 'outcome', outcomeLabel, 800, rowY);

      // Helper to add edge if not exists
      const addEdgeIfNotExists = (source: string, target: string, relation: GraphEdgeType) => {
        const exists = existingEdges.some(e => e.source === source && e.target === target && e.relation === relation);
        if (!exists) {
          existingEdges.push({
            id: `edge_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            source,
            target,
            relation
          });
        }
      };

      addEdgeIfNotExists(sourceNodeId, lesionNodeId, 'produce');
      addEdgeIfNotExists(lesionNodeId, mechNodeId, 'repara');
      addEdgeIfNotExists(mechNodeId, compNodeId, 'requiere');
      addEdgeIfNotExists(mechNodeId, outcomeNodeId, 'conduce_a');

      // Condición celular contextual si aplica (ej. G1 vs G2 para DSB)
      if (scenario.initialContext.toLowerCase().includes('g1')) {
        const condNodeId = findOrAddNode(`n_cond_g1_${scenario.id}`, 'condition', 'Fase G1 (Sin cromátida)', 80, rowY + 75);
        addEdgeIfNotExists(condNodeId, mechNodeId, 'favorece');
      } else if (scenario.initialContext.toLowerCase().includes('g2')) {
        const condNodeId = findOrAddNode(`n_cond_g2_${scenario.id}`, 'condition', 'Fase G2 (Cromátida disponible)', 80, rowY + 75);
        addEdgeIfNotExists(condNodeId, mechNodeId, 'favorece');
      }

      return {
        ...prev,
        nodes: existingNodes,
        edges: existingEdges,
        updatedAt: new Date().toISOString()
      };
    });

    setGraphInjectedScenarioId(scenario.id);
  };

  const reorganizeGraph = () => {
    setGraphModel(prev => {
      // Column X coordinates based on biological role
      const typeCols: Record<GraphNodeType, number> = {
        damage_source: 60,
        lesion: 260,
        condition: 480,
        mechanism: 480,
        operation: 700,
        component: 700,
        outcome: 920,
        consequence: 920,
        recognition: 260
      };

      const colCounters: Record<number, number> = {
        60: 0,
        260: 0,
        480: 0,
        700: 0,
        920: 0
      };

      const updatedNodes = prev.nodes.map(node => {
        const colX = typeCols[node.type] || 480;
        const indexInCol = colCounters[colX] || 0;
        colCounters[colX] = indexInCol + 1;
        const rowY = 70 + indexInCol * 135;
        return {
          ...node,
          x: colX,
          y: rowY
        };
      });

      return {
        ...prev,
        nodes: updatedNodes,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const resetAllProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setDiscoveryLogs([]);
    setGraphModel(DEFAULT_GRAPH);
    setRubricEvaluation(null);
    setUnlockedHints({});
    setRoundStage(1);
    setSelectedHypothesisIds([]);
    setIsHypothesisSubmitted(false);
    setSelectedOperations([]);
    setChosenMechanism(null);
    setEvaluationResult(null);
    setProfile({
      name: 'Grupo Clínico A-1',
      totalScore: 0,
      completedScenarioIds: [],
      achievements: INITIAL_ACHIEVEMENTS,
      activeScenarioId: 'escenario_1_uv'
    });
  };

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const FONT_SCALES: FontSizeScale[] = ['sm', 'base', 'lg', 'xl'];

  const increaseFontSize = () => {
    setFontSizeScale(prev => {
      const idx = FONT_SCALES.indexOf(prev);
      return idx < FONT_SCALES.length - 1 ? FONT_SCALES[idx + 1] : prev;
    });
  };

  const decreaseFontSize = () => {
    setFontSizeScale(prev => {
      const idx = FONT_SCALES.indexOf(prev);
      return idx > 0 ? FONT_SCALES[idx - 1] : prev;
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeSpace,
        setActiveSpace,
        currentScenario,
        currentScenarioId,
        selectScenario,
        allScenarios: SCENARIOS,
        coreScenarios,
        additionalScenarios,
        roundStage,
        setRoundStage,
        selectedHypothesisIds,
        toggleHypothesis,
        isHypothesisSubmitted,
        submitHypothesis,
        selectedLesionNotes,
        setSelectedLesionNotes,
        isLesionConfirmed,
        confirmLesion,
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
        perturbationNotes,
        setPerturbationNotes,
        reEvaluateUnderPerturbation,
        studentReflectionNotes,
        setStudentReflectionNotes,
        saveCurrentRoundToLog,
        unlockedHints,
        unlockHint,
        discoveryLogs,
        deleteLogEntry,
        clearAllLogs,
        graphModel,
        updateGraphModel,
        addGraphNode,
        updateGraphNode,
        deleteGraphNode,
        addGraphEdge,
        deleteGraphEdge,
        rubricEvaluation,
        evaluateCurrentGraph,
        loadTemplateGraph,
        resetGraph,
        addScenarioComponentsToGraph,
        reorganizeGraph,
        graphInjectedScenarioId,
        profile,
        setStudentName: (name: string) => setProfile(p => ({ ...p, name })),
        addPoints,
        resetPoints,
        isTeacherMode,
        setIsTeacherMode,
        isProjectorMode,
        setIsProjectorMode,
        largeFont,
        setLargeFont,
        teacherScoreOverride,
        setTeacherScoreOverride,
        teacherFeedback,
        setTeacherFeedback,
        comparedModels,
        setComparedModels,
        resetAllProgress,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        isHighContrast,
        setIsHighContrast,
        toggleHighContrast: () => setIsHighContrast(prev => !prev),
        fontSizeScale,
        setFontSizeScale,
        increaseFontSize,
        decreaseFontSize,
        teacherNotification,
        setTeacherNotification,
        showSplashScreen,
        setShowSplashScreen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
