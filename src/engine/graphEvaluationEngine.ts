import { GraphModel, ModelRubricScore } from '../data/types';

export function evaluateGraphModel(model: GraphModel): ModelRubricScore {
  const { nodes, edges } = model;

  const nodeTypes = new Set(nodes.map(n => n.type));
  const nodeLabelsLower = nodes.map(n => n.label.toLowerCase());
  const edgeRelations = new Set(edges.map(e => e.relation));

  const strengths: string[] = [];
  const suggestions: string[] = [];
  const uncertainRelations: string[] = [];

  // 1. Precisión científica (Max 3 pts)
  let scientificAccuracy = 0;
  const accuracyComments: string[] = [];
  let scientificErrorsCount = 0;

  // Check valid scientific motifs
  let validPathwaysCount = 0;
  edges.forEach(edge => {
    const srcNode = nodes.find(n => n.id === edge.source);
    const tgtNode = nodes.find(n => n.id === edge.target);
    if (!srcNode || !tgtNode) return;

    const src = srcNode.label.toLowerCase();
    const tgt = tgtNode.label.toLowerCase();
    const rel = edge.relation;

    // Check known sound biological connections
    const isUvToDimer = (src.includes('uv') || src.includes('solar')) && (tgt.includes('dímero') || tgt.includes('dimero') || tgt.includes('pirimidin'));
    const isDimerToNer = (src.includes('dímero') || src.includes('dimero')) && (tgt.includes('ner') || tgt.includes('escisión de nucleótidos'));
    const isOxoToBer = (src.includes('8-oxo') || src.includes('oxida') || src.includes('uracilo')) && (tgt.includes('ber') || tgt.includes('escisión de bases'));
    const isDsbToHr = (src.includes('rotura') || src.includes('doble hebra') || src.includes('dsb')) && (tgt.includes('hr') || tgt.includes('recombinación homóloga'));
    const isDsbToNhej = (src.includes('rotura') || src.includes('doble hebra') || src.includes('dsb')) && (tgt.includes('nhej') || tgt.includes('extremos no homólogos'));
    const isG2FavorsHr = (src.includes('g2') || src.includes('cromátida hermana')) && (tgt.includes('hr') || tgt.includes('recombinación homóloga')) && (rel === 'favorece' || rel === 'depende_de' || rel === 'requiere');
    const isMismatchToMmr = (src.includes('apareamiento') || src.includes('mismatch') || src.includes('error de replicación')) && (tgt.includes('mmr'));
    const isAlkylToMgmt = (src.includes('alquil') || src.includes('metilguanina')) && (tgt.includes('mgmt') || tgt.includes('reversión directa'));

    if (isUvToDimer || isDimerToNer || isOxoToBer || isDsbToHr || isDsbToNhej || isG2FavorsHr || isMismatchToMmr || isAlkylToMgmt) {
      validPathwaysCount++;
    }

    // Check severe biological contradictions
    const isBerRepairingDsb = (src.includes('rotura de doble hebra') || src.includes('dsb')) && tgt.includes('ber') && (rel === 'repara' || rel === 'utiliza');
    const isPhotolyaseHuman = src.includes('humano') && tgt.includes('fotoliasa') && (rel === 'utiliza' || rel === 'repara');

    if (isBerRepairingDsb) {
      scientificErrorsCount++;
      accuracyComments.push(`Inconsistencia: BER no repara roturas de doble hebra (DSB) completas en cromosomas; esa función corresponde a NHEJ o HR.`);
    }
    if (isPhotolyaseHuman) {
      scientificErrorsCount++;
      accuracyComments.push(`Inconsistencia evolutiva: La fotoliasa no está presente funcionalmente en humanos (mamíferos placentarios).`);
    }

    // If edge is unusual, flag for teacher review
    if (rel === 'es_alternativa_a' || rel === 'inhibe') {
      uncertainRelations.push(`Relación "${srcNode.label} --[${rel}]--> ${tgtNode.label}": verificar contexto pedagógico con el docente.`);
    }
  });

  if (validPathwaysCount >= 4 && scientificErrorsCount === 0) {
    scientificAccuracy = 3;
    strengths.push('Excelente coherencia molecular: conexiones científicamente rigurosas entre agentes, lesiones y rutas.');
  } else if (validPathwaysCount >= 2 && scientificErrorsCount <= 1) {
    scientificAccuracy = 2;
    strengths.push('Buena orientación biológica con relaciones causales sólidas.');
  } else if (edges.length > 0) {
    scientificAccuracy = 1;
    suggestions.push('Revisa las conexiones entre lesiones y los mecanismos enzimáticos específicos que las reparan.');
  }

  // 2. Cobertura de fuentes, lesiones y mecanismos (Max 2 pts)
  let coverage = 0;
  const hasDamageSources = nodeTypes.has('damage_source') || nodeLabelsLower.some(l => l.includes('uv') || l.includes('radiación') || l.includes('ros') || l.includes('alquilante'));
  const hasLesions = nodeTypes.has('lesion') || nodeLabelsLower.some(l => l.includes('dímero') || l.includes('8-oxo') || l.includes('uracilo') || l.includes('rotura') || l.includes('mismatch'));
  const hasMechanisms = nodeTypes.has('mechanism') || nodeLabelsLower.some(l => l.includes('ber') || l.includes('ner') || l.includes('mmr') || l.includes('hr') || l.includes('nhej'));

  const mechCount = ['ber', 'ner', 'mmr', 'hr', 'nhej', 'mgmt'].filter(m => nodeLabelsLower.some(l => l.includes(m))).length;

  if (hasDamageSources && hasLesions && hasMechanisms && mechCount >= 3) {
    coverage = 2;
    strengths.push(`Amplia cobertura temática: Integra ${mechCount} mecanismos distintos con sus lesiones y fuentes de daño.`);
  } else if (hasDamageSources || hasLesions || hasMechanisms) {
    coverage = 1;
    suggestions.push('Amplía la cobertura incorporando más mecanismos (por ejemplo, contrastar BER y NER, o NHEJ y HR).');
  }

  // 3. Condiciones celulares y alternativas (Max 2 pts)
  let conditionsAndAlternatives = 0;
  const hasConditions = nodeTypes.has('condition') || nodeLabelsLower.some(l => l.includes('g1') || l.includes('g2') || l.includes('cromátida') || l.includes('molde') || l.includes('fase s'));
  const hasConditionalEdges = edgeRelations.has('favorece') || edgeRelations.has('inhibe') || edgeRelations.has('depende_de') || edgeRelations.has('es_alternativa_a') || edges.some(e => Boolean(e.condition));

  if (hasConditions && hasConditionalEdges) {
    conditionsAndAlternatives = 2;
    strengths.push('Destacable representación condicional: Modela cómo el ciclo celular (G1 vs G2) y cofactores abren o restringen vías.');
  } else if (hasConditions || hasConditionalEdges) {
    conditionsAndAlternatives = 1;
    suggestions.push('Agrega nodos de condición celular (como fase G1 vs G2 o disponibilidad de molde) para mostrar que las vías no son absolutas.');
  } else {
    suggestions.push('El modelo actual parece lineal: añade condiciones regulatorias y alternativas entre rutas.');
  }

  // 4. Consecuencias celulares (Max 2 pts)
  let consequencesScore = 0;
  const hasOutcomes = nodeTypes.has('outcome') || nodeTypes.has('consequence') || nodeLabelsLower.some(l => l.includes('mutación') || l.includes('fidelidad') || l.includes('detención') || l.includes('apoptosis') || l.includes('indel') || l.includes('continuidad'));

  if (hasOutcomes && edges.some(e => e.relation === 'conduce_a' || e.relation === 'puede_provocar')) {
    consequencesScore = 2;
    strengths.push('Excelente visión integradora: Modela los desenlaces celulares finales (reparación fiel, mutagénesis o punto de control).');
  } else if (hasOutcomes) {
    consequencesScore = 1;
    suggestions.push('Conecta explícitamente los mecanismos con sus consecuencias celulares (fidelidad vs mutagénesis indel).');
  } else {
    suggestions.push('Falta representar qué sucede al final: ¿Se restaura la secuencia? ¿Hay mutación? ¿Se activa apoptosis?');
  }

  // 5. Claridad gráfica y conectividad (Max 1 pt)
  let clarityAndLayout = 0;
  const connectedNodeIds = new Set<string>();
  edges.forEach(e => {
    connectedNodeIds.add(e.source);
    connectedNodeIds.add(e.target);
  });
  const disconnectedCount = nodes.filter(n => !connectedNodeIds.has(n.id)).length;

  if (nodes.length >= 4 && disconnectedCount === 0 && edges.length >= 3) {
    clarityAndLayout = 1;
    strengths.push('Red bien estructurada y completamente conectada sin nodos aislados.');
  } else if (disconnectedCount > 0) {
    suggestions.push(`Hay ${disconnectedCount} nodo(s) sin conectar. Enlaza todos los elementos para formar una red continua.`);
  }

  const totalScore = scientificAccuracy + coverage + conditionsAndAlternatives + consequencesScore + clarityAndLayout;

  return {
    scientificAccuracy,
    coverage,
    conditionsAndAlternatives,
    consequences: consequencesScore,
    clarityAndLayout,
    totalScore,
    feedbackList: [
      {
        criterion: 'Precisión científica',
        score: scientificAccuracy,
        maxScore: 3,
        comments: accuracyComments.length > 0 ? accuracyComments : ['Conexiones y operaciones molecularmente fundamentadas.']
      },
      {
        criterion: 'Cobertura de mecanismos y lesiones',
        score: coverage,
        maxScore: 2,
        comments: [`Identificados ${mechCount} mecanismos moleculares en la red.`]
      },
      {
        criterion: 'Condiciones y alternativas',
        score: conditionsAndAlternatives,
        maxScore: 2,
        comments: hasConditions ? ['Condiciones de ciclo y cofactores presentes.'] : ['Se recomienda agregar condiciones reguladoras.']
      },
      {
        criterion: 'Consecuencias celulares',
        score: consequencesScore,
        maxScore: 2,
        comments: hasOutcomes ? ['Consecuencias fenotípicas y de fidelidad incorporadas.'] : ['Falta conectar con consecuencias finales.']
      },
      {
        criterion: 'Claridad gráfica y conectividad',
        score: clarityAndLayout,
        maxScore: 1,
        comments: disconnectedCount === 0 ? ['Red completamente enlazada.'] : [`${disconnectedCount} nodo(s) desconectados.`]
      }
    ],
    strengths,
    suggestions,
    uncertainRelations
  };
}
