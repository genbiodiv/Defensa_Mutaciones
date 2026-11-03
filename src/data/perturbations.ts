import { PerturbationCard } from './types';

export const PERTURBATION_CARDS: PerturbationCard[] = [
  {
    id: 'cell_enters_g2',
    number: 1,
    title: 'La célula entra en fase G2',
    shortTag: 'Fase G2 / Cromátida hermana',
    description: 'La célula completa la duplicación de su genoma y entra en fase G2. Ahora cuenta con una cromátida hermana idéntica íntimamente alineada por complejos de cohesina y una alta actividad de quinasas dependientes de ciclinas (CDK).',
    cellularImpact: 'La cromátida hermana proporciona un molde intacto libre de error para roturas bicatenarias. Se desinhibe la resección 5\'→3\' mediante CtIP y MRN.',
    impactSummary: 'Abre la vía de Recombinación Homóloga (HR) de alta fidelidad frente a roturas de doble hebra, compitiendo favorablemente con NHEJ.',
    modifiedMechanisms: [
      {
        mechanismId: 'HR',
        effect: 'favored',
        detail: 'Pasa de estar inaccesible (en G1) a ser la vía predominante y preferente para reparar roturas bicatenarias de forma fidedigna.'
      },
      {
        mechanismId: 'NHEJ',
        effect: 'altered_outcome',
        detail: 'Sigue siendo capaz de actuar, pero pierde su monopolio frente a la recombinación homóloga.'
      }
    ],
    discussionQuestion: '¿Por qué la presencia de una cromátida hermana transforma radicalmente la estrategia celular frente a una rotura de doble hebra?'
  },

  {
    id: 'no_sister_chromatid',
    number: 2,
    title: 'No existe cromátida hermana disponible',
    shortTag: 'Sin cromátida hermana / G1-G0',
    description: 'La célula se encuentra en fase G1 o en estado de quiescencia (G0). Cada cromosoma está presente como una sola cromátida individual; el homólogo paterno/materno no está disponible como molde.',
    cellularImpact: 'La falta de molde idéntico prohíbe la invasión de hebra homóloga fidedigna. 53BP1 bloquea la resección de extremos.',
    impactSummary: 'Inhibe por completo la Recombinación Homóloga (HR) y fuerza a la célula a depender exclusivamente de la unión no homóloga (NHEJ).',
    modifiedMechanisms: [
      {
        mechanismId: 'HR',
        effect: 'inhibited',
        detail: 'Imposible de ejecutar de manera fisiológica; su activación forzada causaría aberraciones cromosómicas masivas o pérdida de heterocigosidad.'
      },
      {
        mechanismId: 'NHEJ',
        effect: 'favored',
        detail: 'Se convierte en la única vía disponible para rescatar la continuidad física del cromosoma roto.'
      }
    ],
    discussionQuestion: '¿Qué compromiso biológico asume una célula al usar NHEJ cuando no tiene otra opción?'
  },

  {
    id: 'ligase_defective',
    number: 3,
    title: 'La ADN ligasa no funciona correctamente',
    shortTag: 'Fallo de ADN Ligasa',
    description: 'Una mutación o un inhibidor farmacológico compromete la actividad catalítica de las ADN ligasas (Ligasa I, III o IV), impidiendo la formación final del enlace fosfodiéster.',
    cellularImpact: 'Se acumulan melladuras (nicks) o roturas monocatenarias/bicatenarias abiertas no selladas en todos los procesos de reparación y replicación.',
    impactSummary: 'Bloquea el último paso común de casi todas las vías de escisión (BER, NER, MMR, NHEJ), convirtiendo lesiones iniciales en roturas letales.',
    modifiedMechanisms: [
      {
        mechanismId: 'BER',
        effect: 'inhibited',
        detail: 'El intermediario con corte en 5\' no se puede sellar; el choque con una horquilla de replicación generará una rotura de doble hebra.'
      },
      {
        mechanismId: 'NER',
        effect: 'inhibited',
        detail: 'El parche resintetizado de ~30 nt permanece abierto, activando daño persistente y parada del ciclo celular.'
      },
      {
        mechanismId: 'NHEJ',
        effect: 'inhibited',
        detail: 'La ligasa IV/XRCC4 no puede unir los extremos procesados de los fragmentos cromosómicos.'
      }
    ],
    discussionQuestion: '¿Por qué la ligasa es el "cuello de botella universal" de la estabilidad genómica?'
  },

  {
    id: 'recognition_protein_absent',
    number: 4,
    title: 'Una proteína de reconocimiento está ausente',
    shortTag: 'Fallo de Reconocimiento',
    description: 'Falta un sensor clave de reconocimiento temprano: por ejemplo, pérdida de XPC/XPE (en NER), ausencia de una ADN glucosilasa como OGG1/UNG (en BER), o fallo de MutS (en MMR).',
    cellularImpact: 'El ADN dañado no es detectado; la célula no inicia la cascada enzimática de reparación a pesar de que las enzimas efectoras (polimerasas, ligasas) están intactas.',
    impactSummary: 'La vía de reparación queda completamente ciega ante la lesión, permitiendo que el daño persista y sea replicado con alta tasa de mutagénesis.',
    modifiedMechanisms: [
      {
        mechanismId: 'NER',
        effect: 'inhibited',
        detail: 'Sin XPC o CSB, los dímeros UV o aductos pasan inadvertidos, replicándose mediante polimerasas de translesión mutagénicas.'
      },
      {
        mechanismId: 'BER',
        effect: 'inhibited',
        detail: 'Sin glucosilasa específica, la base oxidada o desaminada permanece apareando erróneamente.'
      }
    ],
    discussionQuestion: '¿De qué sirve tener excelentes enzimas de corte y pegado si el sensor molecular inicial no detecta el daño?'
  },

  {
    id: 'replication_fork_arrives',
    number: 5,
    title: 'La célula comienza a replicar su ADN',
    shortTag: 'Llegada de Horquilla de Replicación',
    description: 'La célula supera el punto de restricción de G1 e inicia la fase S. Las horquillas de replicación avanzan rápidamente a lo largo de los cromosomas antes de que las lesiones hayan sido eliminadas.',
    cellularImpact: 'Al colisionar la ADN polimerasa replicativa con una lesión no reparada (dímero, aducto, sitio AP o rotura monocatenaria), la horquilla se colapsa, convirtiendo lesiones simples en roturas bicatenarias severas.',
    impactSummary: 'Aumenta exponencialmente el peligro biológico de cualquier lesión previa no reparada, forzando síntesis de translesión (TLS) o recombinación de rescate.',
    modifiedMechanisms: [
      {
        mechanismId: 'BER',
        effect: 'altered_outcome',
        detail: 'Un sitio AP no reparado colapsa la horquilla y genera una rotura de doble hebra de un solo extremo (single-ended DSB).'
      },
      {
        mechanismId: 'NER',
        effect: 'altered_outcome',
        detail: 'La persistencia del dímero durante la fase S exige el reclutamiento de ADN polimerasas de translesión propensas a error (como Polimerasa η).'
      }
    ],
    discussionQuestion: '¿Por qué la replicación del ADN es el momento de mayor vulnerabilidad para una célula con daños no resueltos?'
  },

  {
    id: 'mmr_deficient',
    number: 6,
    title: 'El sistema MMR es deficiente',
    shortTag: 'Deficiencia en MMR (Lynch/MSI)',
    description: 'Se produce la inactivación bialélica de genes del sistema de desapareamiento (MSH2, MLH1, MSH6 o PMS2), característica molecular del Síndrome de Lynch y del fenotipo de inestabilidad de microsatélites (MSI-H).',
    cellularImpact: 'Los errores de inserción de nucleótidos erróneos y deslizamientos de hebra en repeticiones en tándem escapan sin ser corregidos tras la replicación.',
    impactSummary: 'La tasa de mutación basal se multiplica de 100 a 1000 veces, generando un fenotipo hipermutador.',
    modifiedMechanisms: [
      {
        mechanismId: 'MMR',
        effect: 'inhibited',
        detail: 'Completamente inactivo; los apareamientos G-T o bucles de inserción-deleción quedan fijados como mutaciones en la siguiente división.'
      }
    ],
    discussionQuestion: '¿Cómo explica este defecto que los pacientes con síndrome de Lynch desarrollen tumores a edades tan tempranas?'
  },

  {
    id: 'brca2_loss',
    number: 7,
    title: 'La célula pierde BRCA2 funcional',
    shortTag: 'Pérdida de BRCA2 (Deficiencia HR)',
    description: 'Pérdida de ambos alelos funcionales de BRCA2. La célula es incapaz de desplazar a RPA y cargar los filamentos de la recombinasa Rad51 sobre extremos de ADN monocatenario.',
    cellularImpact: 'Incapacidad absoluta para realizar invasión homóloga fidedigna de hebra frente a roturas bicatenarias o colapsos de horquillas.',
    impactSummary: 'La célula se vuelve extremadamente dependiente de NHEJ y microhomology-mediated end joining (MMEJ), y sumamente vulnerable a inhibidores de PARP.',
    modifiedMechanisms: [
      {
        mechanismId: 'HR',
        effect: 'inhibited',
        detail: 'Anulado. Las roturas bicatenarias ya no pueden repararse por recombinación homóloga precisa.'
      },
      {
        mechanismId: 'NHEJ',
        effect: 'favored',
        detail: 'Se convierte en la vía forzosa de supervivencia celular, aunque introduzca deleciones y aberraciones estructurales complejas.'
      }
    ],
    discussionQuestion: '¿Cómo explota la oncología médica la pérdida de BRCA2 mediante el concepto de "letalidad sintética"?'
  },

  {
    id: 'persistent_lesion',
    number: 8,
    title: 'La lesión persiste durante varias divisiones',
    shortTag: 'Persistencia del Daño',
    description: 'La alteración molecular no es reconocida ni procesada a tiempo, y la célula continúa progresando a través de mitosis sucesivas con el daño en su genoma.',
    cellularImpact: 'La lesión química se convierte irreversiblemente en una mutación fijada en ambas hebras del ADN (ejemplo: transición C:G → T:A) o causa fragmentación cromosómica.',
    impactSummary: 'Una vez fijada la mutación, los sistemas de reparación fisiológicos ya no reconocen ninguna anormalidad porque las bases forman pares Watson-Crick perfectos.',
    modifiedMechanisms: [
      {
        mechanismId: 'BER',
        effect: 'inhibited',
        detail: 'Inútil una vez fijada la mutación: un par T:A copiado tiene dos bases normales y no contiene uracilo ni 8-oxoG reconocible.'
      },
      {
        mechanismId: 'MMR',
        effect: 'inhibited',
        detail: 'Inútil: el nuevo par T:A no presenta ningún desapareamiento de puentes de hidrógeno.'
      }
    ],
    discussionQuestion: '¿Por qué la célula ya no puede distinguir cuál era la secuencia ancestral una vez que la mutación se ha copiado en ambas hebras?'
  },

  {
    id: 'multiple_damages',
    number: 9,
    title: 'Se acumulan múltiples tipos de daño simultáneo',
    shortTag: 'Estrés Genotóxico Múltiple',
    description: 'La célula es golpeada simultáneamente por daño oxidativo masivo, radiación y daño químico, saturando las reservas de factores de reparación y desestabilizando múltiples sitios cromosómicos.',
    cellularImpact: 'Se agotan los depósitos de NAD+ y ATP por hiperactivación de PARP1; la maquinaria celular compite caóticamente por los mismos sitios.',
    impactSummary: 'Disminuye la probabilidad de reparación fiel; se activa masivamente el punto de control p53 conduciendo hacia senescencia permanente o apoptosis.',
    modifiedMechanisms: [
      {
        mechanismId: 'BER',
        effect: 'altered_outcome',
        detail: 'Dos sitios abásicos contiguos en hebras opuestas se transforman en una rotura bicatenaria de difícil resolución.'
      },
      {
        mechanismId: 'HR',
        effect: 'altered_outcome',
        detail: 'Sobrecarga de focos Rad51 y agotamiento de reservas de RPA.'
      }
    ],
    discussionQuestion: '¿En qué momento la célula decide que el daño es irreparable y es mejor activar la muerte programada (apoptosis)?'
  },

  {
    id: 'incompatible_ends',
    number: 10,
    title: 'Una rotura genera extremos incompatibles y dañados',
    shortTag: 'Extremos Sucios / Incompatibles',
    description: 'La rotura de doble hebra no deja extremos limpios 5\'-fosfato y 3\'-hidroxilo, sino grupos químicos oxidados bloqueados (como fosfoglicolato en 3\' o extremos irregulares deshilachados).',
    cellularImpact: 'La ADN ligasa no puede unir directamente los extremos. Se requiere reclutar a la endonucleasa/exonucleasa Artemis y polinucleótido quinasa (PNKP) para recortar y acondicionar los terminales.',
    impactSummary: 'Obliga a un procesamiento nucleolítico previo que inevitablemente pierde pares de bases terminales antes de la ligación por NHEJ.',
    modifiedMechanisms: [
      {
        mechanismId: 'NHEJ',
        effect: 'altered_outcome',
        detail: 'Pierde la posibilidad de unión fidedigna directa; introduce casi con total seguridad pequeñas deleciones locales (mutagénico).'
      }
    ],
    discussionQuestion: '¿Por qué los extremos producidos por radiación ionizante casi siempre dejan cicatrices genéticas tras su reparación?'
  },

  {
    id: 'checkpoint_failure',
    number: 11,
    title: 'La célula no puede detener adecuadamente su ciclo',
    shortTag: 'Fallo de Punto de Control (p53/ATM mutado)',
    description: 'Mutaciones inactivadoras en ATM, ATR, CHK2 o p53 impiden que la célula pause el ciclo celular en los puntos de control G1/S o G2/M frente a lesiones genómicas.',
    cellularImpact: 'La célula continúa forzosamente hacia la fase S o hacia la anafase mitótica con cromosomas rotos o no reparados.',
    impactSummary: 'Catástrofe mitótica masiva, formación de puentes anafásicos, micronúcleos, aneuploidías severas y chromothripsis.',
    modifiedMechanisms: [
      {
        mechanismId: 'HR',
        effect: 'inhibited',
        detail: 'No hay tiempo fisiológico suficiente para la compleja y lenta cinética de invasión de hebra antes de entrar en mitosis.'
      },
      {
        mechanismId: 'NHEJ',
        effect: 'altered_outcome',
        detail: 'Intentos apresurados de unión provocan translocaciones cromosómicas desastrosas al conectar cromosomas equivocados.'
      }
    ],
    discussionQuestion: '¿Por qué p53 es denominado el "guardián del genoma"? ¿Qué ocurre cuando este centinela se ausenta?'
  },

  {
    id: 'imprecise_ligation',
    number: 12,
    title: 'La reparación introduce una pequeña deleción',
    shortTag: 'Cicatriz Mutacional (Indel)',
    description: 'Durante el procesamiento de los extremos por nucleasas en NHEJ, se pierden 4 pares de bases antes de que la ligasa IV consiga sellar la molécula.',
    cellularImpact: 'Se restablece con éxito la continuidad física del cromosoma, pero la secuencia codificante del gen pierde nucleótidos, alterando el marco de lectura abierto (frameshift).',
    impactSummary: 'Demuestra empíricamente que la reparación puede salvar al cromosoma pero a expensas de sacrificar la fidelidad del mensaje genético codificado.',
    modifiedMechanisms: [
      {
        mechanismId: 'NHEJ',
        effect: 'altered_outcome',
        detail: 'Cumplió su función mecánica estructural (evitó fragmentación cromosómica), pero introdujo una mutación génica definitiva.'
      }
    ],
    discussionQuestion: 'En un tejido no proliferativo como las neuronas o el músculo cardíaco, ¿qué es peor: perder un gen o romper un cromosoma en dos fragmentos sueltos?'
  }
];
