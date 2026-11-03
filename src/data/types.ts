export type SpaceId = 
  | 'home'
  | 'exploration'
  | 'repair_lab'
  | 'perturbation'
  | 'log'
  | 'graph_builder'
  | 'teacher'
  | 'references';

export type DamageSourceId = 
  | 'uv_radiation'
  | 'oxidative_stress'
  | 'spontaneous_deamination'
  | 'replication_polymerase_error'
  | 'alkylating_agents'
  | 'ionizing_radiation'
  | 'chemical_carcinogen'
  | 'bacterial_uv'
  | 'crispr_cas9'
  | 'replication_slippage';

export type LesionTypeId = 
  | 'thymine_dimer'
  | '8_oxo_guanine'
  | 'uracil_in_dna'
  | 'mismatch'
  | 'o6_methylguanine'
  | 'double_strand_break'
  | 'single_strand_break'
  | 'bulky_adduct'
  | 'indel_loop';

export type MolecularOperationId = 
  | 'recognize_distortion'
  | 'recognize_modified_base'
  | 'recognize_mismatch'
  | 'recognize_dsb_ends'
  | 'direct_chemical_reversal'
  | 'photoreactivation'
  | 'excise_single_base'
  | 'cleave_ap_site'
  | 'excise_oligonucleotide'
  | 'discriminate_daughter_strand'
  | 'resynthesize_complementary_dna'
  | 'use_homologous_template'
  | 'process_and_ligate_ends'
  | 'ligate_nick'
  | 'arrest_cell_cycle';

export type RepairMechanismId = 
  | 'BER'
  | 'NER'
  | 'MMR'
  | 'HR'
  | 'NHEJ'
  | 'DIRECT_MGMT'
  | 'PHOTOLYASE'
  | 'PROOFREADING';

export type EvaluationCategory = 
  | 'fully_compatible'
  | 'conditional_compatible'
  | 'partially_compatible'
  | 'poorly_compatible'
  | 'unsupported';

export interface EvaluationDimension {
  title: string;
  score: 'optimal' | 'acceptable' | 'inadequate';
  feedback: string;
}

export interface EvaluationResult {
  category: EvaluationCategory;
  categoryLabel: string;
  summary: string;
  dimensions: {
    lesionCompatibility: EvaluationDimension;
    componentsAvailability: EvaluationDimension;
    cellularContext: EvaluationDimension;
    consequences: EvaluationDimension;
  };
  missingConditions?: string[];
  scientificExplanation: string;
  pointsEarned: number;
}

export interface ScenarioHypothesisOption {
  id: string;
  text: string;
  category: 'damage_type' | 'structure_affected' | 'cellular_process';
  isScientificallySound: boolean;
  explanation: string;
}

export interface Scenario {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  organism: string;
  initialContext: string;
  damageSourceId: DamageSourceId;
  damageSourceName: string;
  lesionTypeId: LesionTypeId;
  lesionTypeName: string;
  lesionDescription: string;
  whyIsProblem: string;
  
  // Etapa 1: Encuentro
  hypothesisOptions: ScenarioHypothesisOption[];
  observationsToConfirm: string[];
  
  // Etapa 2: Identificación
  correctLesionCharacteristics: string[];
  
  // Etapa 3: Reparación
  appropriateOperations: MolecularOperationId[];
  compatibleMechanisms: {
    mechanismId: RepairMechanismId;
    isPrimary: boolean;
    conditions: string;
    scientificRationale: string;
    consequences: string;
  }[];
  incompatibleMechanisms: {
    mechanismId: RepairMechanismId;
    reason: string;
  }[];
  representativeProteins: string[];
  
  // Perturbación por defecto
  defaultPerturbationId: string;
  applicablePerturbations: string[];
  
  // Vínculos clínicos y conceptos
  clinicalConnection: string;
  keyConcepts: string[];
  
  // 3 Niveles de Pistas
  hints: {
    level1: string; // Orientación
    level2: string; // Pista mecanística
    level3: string; // Explicación profunda
  };

  // Clasificación de Ruta
  isAdditional?: boolean;
  categoryTier?: 'core' | 'additional';
}

export interface PerturbationCard {
  id: string;
  number: number;
  title: string;
  shortTag: string;
  description: string;
  cellularImpact: string;
  // Impacto en mecanismos
  impactSummary: string;
  modifiedMechanisms: {
    mechanismId: RepairMechanismId;
    effect: 'favored' | 'inhibited' | 'altered_outcome' | 'unaffected';
    detail: string;
  }[];
  discussionQuestion: string;
}

export interface DiscoveryLogEntry {
  id: string;
  scenarioId: string;
  scenarioTitle: string;
  timestamp: string;
  damageSource: string;
  identifiedLesion: string;
  cellularContext: string;
  consideredMechanisms: RepairMechanismId[];
  discardedMechanisms: { mechanism: RepairMechanismId; reason: string }[];
  compatibleMechanisms: { mechanism: RepairMechanismId; conditions: string }[];
  chosenOperations: MolecularOperationId[];
  evaluationCategory: EvaluationCategory;
  activePerturbation?: string;
  perturbationImpact?: string;
  studentHypothesisNotes: string;
  studentReflectionNotes: string;
  keyInsights: string[];
}

export type GraphNodeType = 
  | 'damage_source'
  | 'lesion'
  | 'recognition'
  | 'mechanism'
  | 'operation'
  | 'condition'
  | 'component'
  | 'outcome'
  | 'consequence';

export type GraphEdgeType = 
  | 'produce'
  | 'puede_producir'
  | 'es_reconocido_por'
  | 'requiere'
  | 'favorece'
  | 'inhibe'
  | 'repara'
  | 'utiliza'
  | 'depende_de'
  | 'puede_provocar'
  | 'conduce_a'
  | 'es_alternativa_a';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  x: number;
  y: number;
  customDescription?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relation: GraphEdgeType;
  condition?: string;
}

export interface GraphModel {
  id: string;
  title: string;
  author: string;
  updatedAt: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  teacherScoreOverride?: number;
  teacherFeedback?: string;
}

export interface ModelRubricScore {
  scientificAccuracy: number; // Max 3
  coverage: number; // Max 2
  conditionsAndAlternatives: number; // Max 2
  consequences: number; // Max 2
  clarityAndLayout: number; // Max 1
  totalScore: number; // Max 10
  feedbackList: {
    criterion: string;
    score: number;
    maxScore: number;
    comments: string[];
    needsTeacherReview?: boolean;
  }[];
  strengths: string[];
  suggestions: string[];
  uncertainRelations: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface StudentProfile {
  name: string;
  totalScore: number;
  completedScenarioIds: string[];
  achievements: Achievement[];
  activeScenarioId: string;
}

export type ThemeMode = 'dark' | 'light';
export type FontSizeScale = 'sm' | 'base' | 'lg' | 'xl';
