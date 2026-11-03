import { describe, it } from 'node:test';
import assert from 'node:assert';
import { SCENARIOS } from '../data/scenarios';
import { PERTURBATION_CARDS } from '../data/perturbations';
import { evaluateStudentProposal } from './evaluationEngine';
import { evaluateGraphModel } from './graphEvaluationEngine';
import { GraphModel } from '../data/types';

describe('Scientific Engine Verification', () => {
  it('should have all 10 scenarios loaded with valid properties', () => {
    assert.strictEqual(SCENARIOS.length, 10);
    SCENARIOS.forEach(scen => {
      assert.ok(scen.id);
      assert.ok(scen.title);
      assert.ok(scen.compatibleMechanisms.length > 0);
      assert.ok(scen.appropriateOperations.length > 0);
      assert.ok(scen.representativeProteins.length > 0);
      assert.ok(scen.hints.level1 && scen.hints.level2 && scen.hints.level3);
    });
  });

  it('should have all 12 perturbation cards', () => {
    assert.strictEqual(PERTURBATION_CARDS.length, 12);
  });

  it('evaluates NER correctly for UV Thymine Dimer', () => {
    const uvScenario = SCENARIOS.find(s => s.id === 'escenario_1_uv')!;
    const evalResult = evaluateStudentProposal(
      uvScenario,
      'NER',
      ['recognize_distortion', 'excise_oligonucleotide', 'resynthesize_complementary_dna', 'ligate_nick']
    );
    assert.strictEqual(evalResult.category, 'fully_compatible');
    assert.strictEqual(evalResult.pointsEarned, 100);
  });

  it('evaluates Photolyase as incompatible in humans', () => {
    const uvScenario = SCENARIOS.find(s => s.id === 'escenario_1_uv')!;
    const evalResult = evaluateStudentProposal(
      uvScenario,
      'PHOTOLYASE',
      ['recognize_distortion', 'photoreactivation']
    );
    assert.strictEqual(evalResult.dimensions.componentsAvailability.score, 'inadequate');
  });

  it('evaluates HR in G1 as cellular context incompatible', () => {
    const dsbG1Scenario = SCENARIOS.find(s => s.id === 'escenario_6_dsb_g1')!;
    const evalResult = evaluateStudentProposal(
      dsbG1Scenario,
      'HR',
      ['recognize_dsb_ends', 'use_homologous_template']
    );
    assert.strictEqual(evalResult.dimensions.cellularContext.score, 'inadequate');
  });

  it('evaluates graph model rubric scoring up to 10 points', () => {
    const sampleModel: GraphModel = {
      id: 'test_model',
      title: 'Modelo Test',
      author: 'Estudiante',
      updatedAt: new Date().toISOString(),
      nodes: [
        { id: '1', type: 'damage_source', label: 'Radiación UV', x: 0, y: 0 },
        { id: '2', type: 'lesion', label: 'Dímero de Pirimidinas', x: 100, y: 0 },
        { id: '3', type: 'mechanism', label: 'NER', x: 200, y: 0 },
        { id: '4', type: 'condition', label: 'Fase G2 / Cromátida hermana', x: 0, y: 100 },
        { id: '5', type: 'lesion', label: 'Rotura de Doble Hebra DSB', x: 100, y: 100 },
        { id: '6', type: 'mechanism', label: 'Recombinación Homóloga HR', x: 200, y: 100 },
        { id: '7', type: 'outcome', label: 'Restauración Fiel sin mutación', x: 300, y: 100 }
      ],
      edges: [
        { id: 'e1', source: '1', target: '2', relation: 'produce' },
        { id: 'e2', source: '2', target: '3', relation: 'repara' },
        { id: 'e3', source: '4', target: '6', relation: 'favorece' },
        { id: 'e4', source: '5', target: '6', relation: 'puede_provocar' },
        { id: 'e5', source: '6', target: '7', relation: 'conduce_a' }
      ]
    };

    const rubric = evaluateGraphModel(sampleModel);
    assert.ok(rubric.totalScore >= 7);
    assert.ok(rubric.strengths.length > 0);
  });

  it('strictly awards 0 points for any non-fully compatible strategy in step 4', () => {
    const uvScenario = SCENARIOS.find(s => s.id === 'escenario_1_uv')!;
    
    // Incompatible mechanism (BER for UV thymine dimer)
    const resIncompatible = evaluateStudentProposal(uvScenario, 'BER', ['recognize_distortion']);
    assert.notStrictEqual(resIncompatible.category, 'fully_compatible');
    assert.strictEqual(resIncompatible.pointsEarned, 0);

    // Partially compatible (correct mechanism NER, but missing operations)
    const resPartial = evaluateStudentProposal(uvScenario, 'NER', ['recognize_distortion']);
    assert.notStrictEqual(resPartial.category, 'fully_compatible');
    assert.strictEqual(resPartial.pointsEarned, 0);
  });

  it('validates graph components structure for successful cases', () => {
    // For each core scenario, ensure primary mechanism and appropriate operations yield fully_compatible
    SCENARIOS.slice(0, 5).forEach(sc => {
      const primaryMech = sc.compatibleMechanisms.find(m => m.isPrimary)?.mechanismId;
      assert.ok(primaryMech, `Scenario ${sc.id} has primary mechanism`);
      const result = evaluateStudentProposal(sc, primaryMech, sc.appropriateOperations);
      assert.strictEqual(result.category, 'fully_compatible');
      assert.strictEqual(result.pointsEarned, 100);

      // Verify representative proteins and lesion labels exist for graph insertion
      assert.ok(sc.damageSourceName.length > 0);
      assert.ok(sc.lesionTypeName.length > 0);
      assert.ok(sc.representativeProteins.length > 0);
    });
  });
});

