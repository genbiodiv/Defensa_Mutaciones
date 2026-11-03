import { 
  Scenario, 
  RepairMechanismId, 
  MolecularOperationId, 
  EvaluationResult, 
  EvaluationDimension, 
  PerturbationCard 
} from '../data/types';
import { PERTURBATION_CARDS } from '../data/perturbations';

export function evaluateStudentProposal(
  scenario: Scenario,
  chosenMechanism: RepairMechanismId,
  selectedOperations: MolecularOperationId[],
  activePerturbationId?: string
): EvaluationResult {
  const activePerturbation: PerturbationCard | undefined = activePerturbationId 
    ? PERTURBATION_CARDS.find(p => p.id === activePerturbationId)
    : undefined;

  const compatibleEntry = scenario.compatibleMechanisms.find(m => m.mechanismId === chosenMechanism);
  const incompatibleEntry = scenario.incompatibleMechanisms.find(m => m.mechanismId === chosenMechanism);

  // Check perturbation impact on the chosen mechanism
  let perturbationEffect: 'favored' | 'inhibited' | 'altered_outcome' | 'unaffected' = 'unaffected';
  let perturbationDetail = '';

  if (activePerturbation) {
    const mod = activePerturbation.modifiedMechanisms.find(m => m.mechanismId === chosenMechanism);
    if (mod) {
      perturbationEffect = mod.effect;
      perturbationDetail = mod.detail;
    }
  }

  // 1. Dimension: Compatibilidad con la lesión
  let lesionComp: EvaluationDimension;
  if (compatibleEntry) {
    lesionComp = {
      title: 'Compatibilidad con el tipo de lesión',
      score: 'optimal',
      feedback: `El mecanismo ${chosenMechanism} está bioquímicamente adaptado para resolver la lesión (${scenario.lesionTypeName}). ${compatibleEntry.scientificRationale}`
    };
  } else if (incompatibleEntry) {
    lesionComp = {
      title: 'Compatibilidad con el tipo de lesión',
      score: 'inadequate',
      feedback: `Incompatible: ${incompatibleEntry.reason}`
    };
  } else {
    lesionComp = {
      title: 'Compatibilidad con el tipo de lesión',
      score: 'inadequate',
      feedback: `La vía ${chosenMechanism} no es la maquinaria fisiológica canónica para procesar ${scenario.lesionTypeName}.`
    };
  }

  // 2. Dimension: Disponibilidad de componentes
  let compAvail: EvaluationDimension;
  const hasCrucialOperations = scenario.appropriateOperations.some(op => selectedOperations.includes(op));
  const missingOps = scenario.appropriateOperations.filter(op => !selectedOperations.includes(op));
  const extraOps = selectedOperations.filter(op => !scenario.appropriateOperations.includes(op));
  const missingCoreOps = missingOps.filter(op => op !== 'arrest_cell_cycle');
  const isCoreComplete = missingCoreOps.length === 0 && extraOps.length === 0;

  if (chosenMechanism === 'PHOTOLYASE' && scenario.organism.toLowerCase().includes('homo sapiens')) {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'inadequate',
      feedback: 'Ausencia evolutiva de componentes: Los mamíferos placentarios (humanos) carecen de enzima fotoliasa activa.'
    };
  } else if (activePerturbation?.id === 'recognition_protein_absent') {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'inadequate',
      feedback: `Componente esencial ausente por perturbación: La falta de la proteína sensora impide iniciar la cascada de ${chosenMechanism}.`
    };
  } else if (activePerturbation?.id === 'brca2_loss' && chosenMechanism === 'HR') {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'inadequate',
      feedback: 'BRCA2 ausente: La célula no puede cargar la recombinasa Rad51 sobre el ADN monocatenario para ejecutar Recombinación Homóloga.'
    };
  } else if (activePerturbation?.id === 'mmr_deficient' && chosenMechanism === 'MMR') {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'inadequate',
      feedback: 'Componente MMR defectuoso: La pérdida de función en MutS/MutL impide la escisión de la hebra con el error posreplicativo.'
    };
  } else if (isCoreComplete) {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'optimal',
      feedback: `La estrategia seleccionada incluye todas las operaciones moleculares clave (${selectedOperations.length} seleccionadas). Proteínas implicadas: ${scenario.representativeProteins.slice(0, 3).join(', ')}.`
    };
  } else if (hasCrucialOperations) {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'acceptable',
      feedback: `La estrategia seleccionada incluye operaciones moleculares afines, pero ${missingOps.length > 0 ? `faltan pasos esenciales (${missingOps.length})` : ''}${extraOps.length > 0 ? ` e incluye pasos no canónicos (${extraOps.length})` : ''}.`
    };
  } else {
    compAvail = {
      title: 'Disponibilidad de componentes moleculares',
      score: 'inadequate',
      feedback: 'Las operaciones moleculares seleccionadas no coinciden con la secuencia bioquímica requerida por esta vía.'
    };
  }

  // 3. Dimension: Contexto celular y ciclo
  let cellContext: EvaluationDimension;
  if (chosenMechanism === 'HR' && (scenario.id === 'escenario_6_dsb_g1' || activePerturbation?.id === 'no_sister_chromatid')) {
    cellContext = {
      title: 'Compatibilidad con el contexto celular',
      score: 'inadequate',
      feedback: 'Contexto celular incompatible: La Recombinación Homóloga fidedigna requiere indispensablemente una cromátida hermana idéntica como molde (fases S/G2). En G1 o sin cromátida hermana, esta vía está bloqueada.'
    };
  } else if (chosenMechanism === 'PROOFREADING' && scenario.id === 'escenario_4_replicacion') {
    cellContext = {
      title: 'Compatibilidad con el contexto celular',
      score: 'inadequate',
      feedback: 'Contexto temporal desfasado: La corrección de pruebas (Proofreading) solo actúa de inmediato en el sitio catalítico activo de la polimerasa. Una vez que la horquilla avanzó cientos de bases, el error ya no es accesible para el dominio 3\'→5\' exonucleasa in situ.'
    };
  } else if (activePerturbation?.id === 'cell_enters_g2' && chosenMechanism === 'HR') {
    cellContext = {
      title: 'Compatibilidad con el contexto celular',
      score: 'optimal',
      feedback: 'Contexto óptimo favorecido por la perturbación: En fase G2 la cromátida hermana y la alta actividad CDK desinhiben la resección y la invasión de hebra homóloga.'
    };
  } else if (activePerturbation?.id === 'checkpoint_failure') {
    cellContext = {
      title: 'Compatibilidad con el contexto celular',
      score: 'acceptable',
      feedback: 'Contexto de riesgo crítico: La ausencia de detención del ciclo celular obliga a una reparación apresurada antes de la mitosis.'
    };
  } else {
    cellContext = {
      title: 'Compatibilidad con el contexto celular',
      score: compatibleEntry ? 'optimal' : 'acceptable',
      feedback: compatibleEntry ? compatibleEntry.conditions : 'Las condiciones celulares deben verificarse para este mecanismo.'
    };
  }

  // 4. Dimension: Posibles consecuencias
  let consequencesDim: EvaluationDimension;
  if (chosenMechanism === 'NHEJ') {
    consequencesDim = {
      title: 'Consecuencias de la vía seleccionada',
      score: 'acceptable',
      feedback: 'Consecuencia dual: Restaura rápidamente la continuidad física del cromosoma, pero al no usar un molde extenso, con frecuencia nucleasas introducen microdeleciones (indels de 1-10 pb) que pueden alterar el marco de lectura génico.'
    };
  } else if (chosenMechanism === 'HR') {
    consequencesDim = {
      title: 'Consecuencias de la vía seleccionada',
      score: 'optimal',
      feedback: 'Consecuencia de alta fidelidad: Copia exactamente la información de la cromátida hermana idéntica, reparando la rotura sin introducir mutaciones.'
    };
  } else if (compatibleEntry) {
    consequencesDim = {
      title: 'Consecuencias de la vía seleccionada',
      score: 'optimal',
      feedback: compatibleEntry.consequences
    };
  } else {
    consequencesDim = {
      title: 'Consecuencias de la vía seleccionada',
      score: 'inadequate',
      feedback: 'Si se aplica una vía inadecuada para esta lesión, el daño persistirá o se generarán roturas secundarias y toxicidad génica.'
    };
  }

  // Determine overall Category and Points
  let category: EvaluationResult['category'];
  let categoryLabel: string;
  let pointsEarned = 0;
  let summary = '';
  const missingConditions: string[] = [];

  const scores = [lesionComp.score, compAvail.score, cellContext.score, consequencesDim.score];
  const optimalCount = scores.filter(s => s === 'optimal').length;
  const adequateCount = scores.filter(s => s === 'acceptable').length;
  const inadequateCount = scores.filter(s => s === 'inadequate').length;

  if (perturbationEffect === 'inhibited') {
    category = 'partially_compatible';
    categoryLabel = 'Incompatible bajo la perturbación actual';
    summary = `Aunque ${chosenMechanism} es teóricamente afín a esta lesión, la condición perturbada (${activePerturbation?.title}) lo inhabilita: ${perturbationDetail}`;
    pointsEarned = 0;
    missingConditions.push(`Condición alterada: ${activePerturbation?.title}. Se requiere una vía alternativa o restaurar el factor.`);
  } else if (inadequateCount >= 2 || lesionComp.score === 'inadequate') {
    category = 'poorly_compatible';
    categoryLabel = 'Poco compatible con el escenario';
    summary = `La propuesta no encaja con las restricciones moleculares del problema: ${lesionComp.feedback}`;
    pointsEarned = 0;
    if (incompatibleEntry) missingConditions.push(incompatibleEntry.reason);
  } else if (inadequateCount === 1) {
    category = 'conditional_compatible';
    categoryLabel = 'Compatible bajo ciertas condiciones';
    summary = `La vía es válida pero está fuertemente supeditada al contexto molecular: ${cellContext.feedback}`;
    pointsEarned = 0;
    missingConditions.push('Verificar fase del ciclo celular o disponibilidad de cofactores.');
  } else if (optimalCount >= 3 && isCoreComplete && Boolean(compatibleEntry) && inadequateCount === 0) {
    category = 'fully_compatible';
    categoryLabel = 'Compatible y bien justificada';
    summary = `Excelente razonamiento científico: La estrategia ${chosenMechanism} resuelve con precisión el problema molecular planteado respetando el contexto celular.`;
    pointsEarned = 100;
  } else {
    category = 'partially_compatible';
    categoryLabel = 'Parcialmente compatible';
    summary = `La estrategia contiene aciertos pero requiere afinar las operaciones moleculares y las restricciones del contexto celular.`;
    pointsEarned = 0;
    if (missingOps.length > 0) missingConditions.push(`Completar ${missingOps.length} operaciones moleculares esenciales.`);
    if (extraOps.length > 0) missingConditions.push(`Retirar ${extraOps.length} operaciones que no aplican a esta vía.`);
  }

  const scientificExplanation = compatibleEntry 
    ? compatibleEntry.scientificRationale 
    : (incompatibleEntry ? incompatibleEntry.reason : 'Revisa las características de la lesión y los componentes enzimáticos requeridos.');

  return {
    category,
    categoryLabel,
    summary,
    dimensions: {
      lesionCompatibility: lesionComp,
      componentsAvailability: compAvail,
      cellularContext: cellContext,
      consequences: consequencesDim
    },
    missingConditions: missingConditions.length > 0 ? missingConditions : undefined,
    scientificExplanation,
    pointsEarned
  };
}
