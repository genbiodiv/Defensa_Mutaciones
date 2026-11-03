import { Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'escenario_1_uv',
    number: 1,
    title: 'Exposición solar y distorsión helicoidal',
    subtitle: 'Una célula epitelial humana recibe radiación ultravioleta B (UVB)',
    organism: 'Homo sapiens (célula epidérmica)',
    initialContext: 'Tras una exposición solar prolongada sin fotoprotección, queratinocitos de la epidermis basal reciben radiación UVB (~290-320 nm). En el laboratorio se detecta un bloqueo inmediato del avance de la ARN polimerasa II durante la transcripción y detención de horquillas de replicación.',
    damageSourceId: 'uv_radiation',
    damageSourceName: 'Radiación ultravioleta (UVB solar)',
    lesionTypeId: 'thymine_dimer',
    lesionTypeName: 'Dímero de pirimidinas (Ciclobutano CPD / 6-4 fotoproducto)',
    lesionDescription: 'Formación de enlaces covalentes anómalos entre dos timinas contiguas de la misma hebra (anillo ciclobutano), provocando una inflexión rígida (~30°) y distorsión física del esqueleto fosfodiéster.',
    whyIsProblem: 'La distorsión helicoidal impide el apareamiento de bases normal y desestabiliza el surco mayor/menor, bloqueando físicamente el paso esteroespecífico de las ADN y ARN polimerasas replicativas y transcripcionales.',
    
    hypothesisOptions: [
      {
        id: 'hyp_1',
        text: 'Formación de enlaces covalentes cruzados entre bases pirimidínicas adyacentes de la misma hebra',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'La excitación fotoquímica por fotones UV induce dímeros de timina (anillo ciclobutano) y fotoproductos 6-4.'
      },
      {
        id: 'hyp_2',
        text: 'Ruptura inmediata de ambas hebras del esqueleto fosfodiéster en cromosomas enteros',
        category: 'damage_type',
        isScientificallySound: false,
        explanation: 'La radiación UV causa primordialmente dímeros fotoquímicos y distorsiones; las roturas de doble hebra son típicas de radiación ionizante (rayos X/gamma), no de dosis fisiológicas de UVB.'
      },
      {
        id: 'hyp_3',
        text: 'Distorsión estérico-geométrica de la doble hélice con rigidez local',
        category: 'structure_affected',
        isScientificallySound: true,
        explanation: 'El anillo de ciclobutano fuerza una inclinación de ~30° en el eje de la doble hélice, impidiendo el paso enzimático.'
      },
      {
        id: 'hyp_4',
        text: 'Detención física de la ARN polimerasa II y colapso de horquillas replicativas',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'La polimerasa choca contra la base deformada y no puede acomodarla en su sitio catalítico, activando la vía TC-NER o detención del ciclo.'
      }
    ],
    
    observationsToConfirm: [
      'Electroforesis con endonucleasa T4 específica de dímeros que revela fragmentación inducida por escisión de sitios UV.',
      'Inmunoensayo con anticuerpos monoclonales anti-CPD (ciclobutano pirimidina dímero).',
      'Bloqueo transcripcional medido por incorporación deficiente de 5-etiniluridina (EU).'
    ],
    
    correctLesionCharacteristics: [
      'Afecta bases contiguas de la misma hebra (cintrastrand covalent bonds).',
      'Genera una protuberancia y distorsión estructural de la doble hélice.',
      'No rompe el esqueleto de azúcar-fosfato inmediatamente.',
      'No es una simple base oxidada individual sino un bloque rígido voluminoso.'
    ],
    
    appropriateOperations: [
      'recognize_distortion',
      'excise_oligonucleotide',
      'resynthesize_complementary_dna',
      'ligate_nick',
      'arrest_cell_cycle'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'NER',
        isPrimary: true,
        conditions: 'Funciona en cualquier fase del ciclo celular (GG-NER mediado por XPC/XPE o TC-NER mediado por CSB al bloquear ARN polimerasa).',
        scientificRationale: 'NER es la vía evolutiva universal en humanos para escindir tramos oligonucleotídicos (~24-32 nt) que contienen lesiones deformantes de la hélice.',
        consequences: 'Restaura fielmente la secuencia original utilizando la hebra complementaria no dañada como molde.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'BER',
        reason: 'Las ADN glucosilasas de BER reconocen bases químicamente modificadas discretas (como uracilo u 8-oxoG) y no pueden acomodar en su bolsillo catalítico la estructura dímera voluminosa ni distorsiones globales.'
      },
      {
        mechanismId: 'PHOTOLYASE',
        reason: 'Los mamíferos placentarios (incluido el ser humano) perdieron los genes de fotoliasa activa durante la evolución («cuello de botella nocturno» en el Mesozoico).'
      },
      {
        mechanismId: 'NHEJ',
        reason: 'NHEJ actúa sobre extremos de ADN bicatenario rotos; aquí no hay rotura de doble hebra inicial sino una alteración en una sola hebra.'
      }
    ],
    
    representativeProteins: ['XPC', 'XPA', 'TFIIH (XPB/XPD helicasas)', 'XPF-ERCC1', 'XPG', 'ADN Polimerasa δ/ε', 'ADN Ligasa I'],
    
    defaultPerturbationId: 'recognition_protein_absent',
    applicablePerturbations: ['recognition_protein_absent', 'replication_fork_arrives', 'checkpoint_failure', 'persistent_lesion'],
    
    clinicalConnection: 'Xeroderma Pigmentosum (XP): Mutaciones congénitas en XPA-XPG provocan una incapacidad extrema para reparar dímeros UV, causando fotosensibilidad severa y un incremento de >1000 veces en la incidencia de carcinomas y melanomas cutáneos en zonas fotoexpuestas.',
    
    keyConcepts: [
      'Distorsión física de la doble hélice frente a modificación puntual de base.',
      'Escisión de un oligonucleótido de ~30 nucleótidos mediante endonucleasas duales (XPF en 5\' y XPG en 3\').',
      'Diferencia entre GG-NER (genoma global) y TC-NER (acoplado a transcripción).',
      'Ausencia de fotoliasa en seres humanos.'
    ],
    
    hints: {
      level1: 'Observa la forma de la doble hélice: ¿está afectada únicamente una base química o se ha torcido y distorsionado físicamente la arquitectura del dúplex?',
      level2: 'La célula necesita un complejo capaz de sensar la deformación helicoidal, cortar a ambos lados de la lesión eliminando un fragmento de varios nucleótidos, y reconstruir la hebra usando el molde opuesto intacto.',
      level3: 'El mecanismo requerido es NER (Reparación por Escisión de Nucleótidos). El complejo TFIIH desenrolla la hélice y endonucleasas cortan ~24-32 nucleótidos que contienen el dímero, seguido de síntesis por ADN polimerasa y ligación.'
    },
    isAdditional: false,
    categoryTier: 'core'
  },

  {
    id: 'escenario_2_oxidacion',
    number: 2,
    title: 'Metabolismo aerobio y daño oxidativo',
    subtitle: 'Una célula metabólicamente muy activa acumula 8-oxoguanina en su ADN',
    organism: 'Homo sapiens (hepatocito con alta tasa mitocondrial)',
    initialContext: 'En un hepatocito con intensa actividad fosforilativa y producción de especies reactivas de oxígeno (ERO/ROS como radical hidroxilo •OH), se constata la conversión de guaninas en 8-oxo-7,8-dihidroguanina (8-oxoG).',
    damageSourceId: 'oxidative_stress',
    damageSourceName: 'Especies reactivas de oxígeno (ERO / Radicales libres metabólicos)',
    lesionTypeId: '8_oxo_guanine',
    lesionTypeName: '8-oxo-7,8-dihidroguanina (8-oxoG)',
    lesionDescription: 'Oxigenación en la posición C8 de la guanina. Esta alteración no distorsiona groseramente la doble hélice pero permite que la 8-oxoG adopte conformación syn y forme puentes de hidrógeno estables con adenina.',
    whyIsProblem: 'La 8-oxoG apareada con Adenina (8-oxoG:A) durante la replicación engaña a las ADN polimerasas, provocando mutaciones de transversión G:C → T:A en la siguiente ronda replicativa.',
    
    hypothesisOptions: [
      {
        id: 'hyp_ox_1',
        text: 'Modificación química discreta de una base nitrogenada que retiene su azúcar-fosfato',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'La 8-oxoG es una alteración puntual de un átomo en la base purínica, sin rotura inicial del enlace fosfodiéster.'
      },
      {
        id: 'hyp_ox_2',
        text: 'Potencial de apareamiento aberrante con Adenina en conformación alternativa',
        category: 'structure_affected',
        isScientificallySound: true,
        explanation: 'La 8-oxoG rota hacia conformación syn mimetiza a una timina y aparea eficazmente con adenina tipo Hoogsteen.'
      },
      {
        id: 'hyp_ox_3',
        text: 'Rotura masiva de ambas hebras que desintegra el cromosoma',
        category: 'damage_type',
        isScientificallySound: false,
        explanation: 'Las ERO basales oxidan nucleótidos individuales; las roturas DSB solo surgen si dos lesiones oxidativas coinciden muy próximas en hebras opuestas.'
      },
      {
        id: 'hyp_ox_4',
        text: 'Generación de mutaciones fijadas de transversión G:C → T:A si no se retira antes de replicar',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'Si la polimerasa incorpora dAMP frente a 8-oxoG, en la siguiente ronda el molde A incorporará T, fijando la transversión.'
      }
    ],
    
    observationsToConfirm: [
      'Detección por HPLC acoplado a espectrometría de masas (HPLC-MS/MS) de niveles elevados de 8-OHdG.',
      'Sensibilidad a la incisión por la enzima OGG1 (8-oxoguanina ADN glucosilasa recombinante).'
    ],
    
    correctLesionCharacteristics: [
      'Base química oxidada individual.',
      'No produce distorsión volumétrica notable en la doble hélice.',
      'Riesgo directo de transversión por mal apareamiento con Adenina.'
    ],
    
    appropriateOperations: [
      'recognize_modified_base',
      'excise_single_base',
      'cleave_ap_site',
      'resynthesize_complementary_dna',
      'ligate_nick'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'BER',
        isPrimary: true,
        conditions: 'Requiere la presencia de la glucosilasa específica OGG1 y AP endonucleasa (APE1) funcionales.',
        scientificRationale: 'BER (Base Excision Repair) está específicamente optimizado para reconocer bases oxidadas, desaminadas o alquiladas menores volteando la base hacia un bolsillo enzimático específico.',
        consequences: 'Restaura una G intacta sin alterar los nucleótidos vecinos (vía short-patch) o reemplazando 2-8 nt (vía long-patch).'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'NER',
        reason: 'NER reconoce distorsiones volumétricas de la hélice; la 8-oxoG pasa desapercibida para XPC/TFIIH.'
      },
      {
        mechanismId: 'HR',
        reason: 'HR repara roturas de doble hebra en S/G2 usando cromátida hermana, no bases nitrogenadas oxidadas aisladas.'
      }
    ],
    
    representativeProteins: ['OGG1 (ADN glucosilasa)', 'APE1 (AP endonucleasa)', 'ADN Polimerasa β', 'XRCC1', 'ADN Ligasa III'],
    
    defaultPerturbationId: 'recognition_protein_absent',
    applicablePerturbations: ['recognition_protein_absent', 'ligase_defective', 'replication_fork_arrives'],
    
    clinicalConnection: 'Polimorfismos o deficiencia en OGG1 se asocian a mayor susceptibilidad a cáncer de pulmón y colon, y a acumulación acelerada de daño mutagénico en tejidos con alto estrés oxidativo mitocondrial.',
    
    keyConcepts: [
      'Volteo de base (base flipping) en el bolsillo de la ADN glucosilasa.',
      'Generación intermedia de un sitio abásico (AP o apurínico).',
      'Corte fosfodiéster en 5\' por AP endonucleasa (APE1).',
      'BER de parche corto (1 nucleótido) vs parche largo (2-8 nucleótidos).'
    ],
    
    hints: {
      level1: '¿La alteración deforma toda la doble hélice o afecta a un solo enlace químico de una base individual?',
      level2: 'La célula utiliza una enzima que rompe el enlace N-glucosídico entre la base dañada y la desoxirribosa, dejando un sitio apurínico (AP) que luego es procesado.',
      level3: 'El mecanismo es BER (Reparación por Escisión de Bases): la glucosilasa OGG1 elimina la 8-oxoG, APE1 corta el sitio AP, la polimerasa β inserta el nucleótido correcto y la ligasa sella la hebra.'
    },
    isAdditional: false,
    categoryTier: 'core'
  },

  {
    id: 'escenario_3_desaminacion',
    number: 3,
    title: 'Inestabilidad química espontánea',
    subtitle: 'Desaminación hidrolítica de citosina a uracilo en el ADN',
    organism: 'Homo sapiens (célula somática en reposo)',
    initialContext: 'En condiciones fisiológicas acuosas a 37°C, la citosina sufre espontáneamente una pérdida hidrolítica de su grupo amino exocíclico (~100-500 eventos por célula/día), convirtiéndose en uracilo.',
    damageSourceId: 'spontaneous_deamination',
    damageSourceName: 'Desaminación hidrolítica espontánea (pH y temperatura fisiológica)',
    lesionTypeId: 'uracil_in_dna',
    lesionTypeName: 'Uracilo en el ADN (apareamiento anómalo U:G)',
    lesionDescription: 'La citosina se transforma químicamente en uracilo. Aunque el uracilo es una base normal del ARN, es una base extraña e inapropiada en el ADN bicatenario.',
    whyIsProblem: 'Si no se elimina antes de la replicación, la ADN polimerasa leerá el Uracilo como Timina, incorporando dAMP y originando una mutación fija de transición C:G → T:A.',
    
    hypothesisOptions: [
      {
        id: 'hyp_des_1',
        text: 'Presencia de una base propia de ARN (Uracilo) en el genoma de ADN',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'El uracilo carece del grupo metilo de la timina y proviene de la pérdida espontánea del grupo amino de citosina.'
      },
      {
        id: 'hyp_des_2',
        text: 'La lesión actual es un daño químico reversible, aún NO es una mutación establecida fijada',
        category: 'structure_affected',
        isScientificallySound: true,
        explanation: 'Mientras el uracilo siga presente frente a la guanina molde original (par U:G), la célula puede saber cuál es la base anómala.'
      },
      {
        id: 'hyp_des_3',
        text: 'El uracilo se repara indistintamente reemplazando a la guanina complementaria',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'El sistema reconoce inequívocamente al uracilo como erróneo en el ADN, eliminando el U y conservando la Guanina molde original.'
      }
    ],
    
    observationsToConfirm: [
      'Extracción de ADN y digestión con Uracilo-ADN Glucosilasa (UNG) purificada, revelando sitios AP.',
      'Secuenciación con bisulfito / química de uracilo que localiza pares U:G antes de la replicación.'
    ],
    
    correctLesionCharacteristics: [
      'Presencia de uracilo frente a guanina.',
      'Daño químico en una base nitrogenada individual.',
      'Distinción fundamental: lesión química corregible vs mutación fija T:A ya copiada.'
    ],
    
    appropriateOperations: [
      'recognize_modified_base',
      'excise_single_base',
      'cleave_ap_site',
      'resynthesize_complementary_dna',
      'ligate_nick'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'BER',
        isPrimary: true,
        conditions: 'Uracilo-ADN glucosilasa (UNG o SMUG1) activa en el núcleo.',
        scientificRationale: 'La enzima UNG posee una extraordinaria selectividad de sustrato: rechaza timina por su grupo 5-metilo y escinde específicamente uracilo en ADN bicatenario y monocatenario.',
        consequences: 'Restaura una citosina normal utilizando la Guanina de la hebra opuesta como molde fiel.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'DIRECT_MGMT',
        reason: 'MGMT transfiere grupos alquilo (metilo/etilo); no puede transferir grupos amino ni revertir desaminaciones.'
      },
      {
        mechanismId: 'MMR',
        reason: 'MMR repara apareamientos incorrectos posreplicativos donde ambas bases son normales de ADN (ej. G-T, A-C), no elimina uracilo vía glucosilasa.'
      }
    ],
    
    representativeProteins: ['UNG (Uracil-DNA Glycosylase)', 'APE1', 'ADN Polimerasa β', 'ADN Ligasa III / XRCC1'],
    
    defaultPerturbationId: 'replication_fork_arrives',
    applicablePerturbations: ['replication_fork_arrives', 'recognition_protein_absent', 'ligase_defective'],
    
    clinicalConnection: 'La desaminación de 5-metilcitosina genera Timina (par T:G), lo que es mucho más difícil de distinguir para la célula, convirtiendo las islas CpG metiladas en los principales puntos calientes (hotspots) de mutaciones del genoma humano y del gen supresor tumoral TP53.',
    
    keyConcepts: [
      'Razón evolutiva de por qué el ADN utiliza Timina en lugar de Uracilo: permitir detectar la desaminación espontánea de citosina.',
      'Diferencia entre lesión química (sustrato de reparación) y mutación fijada (cambio estable irreversible por mecanismos basales).',
      'Velocidad de acción de la enzima UNG (una de las enzimas más eficientes del genoma).'
    ],
    
    hints: {
      level1: 'Pregúntate: ¿Por qué la evolución seleccionó timina para el ADN en lugar de uracilo? ¿Cómo sabe la célula qué base sobra?',
      level2: 'Existe una ADN glucosilasa específica capaz de reconocer la ausencia del grupo metilo en el uracilo y sacarlo de la doble hélice rompiendo el enlace con la desoxirribosa.',
      level3: 'El mecanismo es BER iniciado por la Uracilo-ADN Glucosilasa (UNG). Deja un sitio AP que APE1 incide, polimerasa β rellena con dCTP y ligasa sella.'
    },
    isAdditional: true,
    categoryTier: 'additional'
  },

  {
    id: 'escenario_4_replicacion',
    number: 4,
    title: 'Fidelidad replicativa y error de apareamiento',
    subtitle: 'Una base errónea se incorpora durante la replicación y escapa al proofreading',
    organism: 'Homo sapiens (célula de cripta intestinal en proliferación activa)',
    initialContext: 'Durante la fase S en una célula del epitelio del colon, la ADN polimerasa δ incorpora por error una Timina frente a una Guanina (par G-T). La actividad exonucleasa 3\'→5\' intrínseca de la polimerasa (proofreading) no detecta el fallo y la horquilla continúa avanzando.',
    damageSourceId: 'replication_polymerase_error',
    damageSourceName: 'Error estocástico de la ADN polimerasa durante replicación',
    lesionTypeId: 'mismatch',
    lesionTypeName: 'Apareamiento erróneo posreplicativo (Mismatch de bases no complementarias)',
    lesionDescription: 'Desapareamiento de bases normales no complementarias (par G-T) sin modificación química de las bases, provocando una ligera inestabilidad de puentes de hidrógeno y flexión local.',
    whyIsProblem: 'Ambas bases son nucleótidos naturales y sanos del ADN. La célula debe descifrar cuál de las dos hebras contiene la base incorrecta (la hebra recién sintetizada) antes de que la siguiente ronda fije permanentemente la mutación.',
    
    hypothesisOptions: [
      {
        id: 'hyp_mmr_1',
        text: 'Apareamiento no canónico entre dos bases químicas normales (G-T) sin daño químico intrínseco',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'Ninguna de las bases está químicamente rota; el problema es que no forman un par complementario canónico Watson-Crick.'
      },
      {
        id: 'hyp_mmr_2',
        text: 'Se requiere un mecanismo capaz de distinguir la hebra hija recién copiada de la hebra molde parental',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'Si la célula retirase la base de la hebra molde parental, convertiría el error en una mutación fija permanente.'
      },
      {
        id: 'hyp_mmr_3',
        text: 'La corrección de pruebas 3\'→5\' puede regresar horas después desde varios miles de nucleótidos atrás',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'El proofreading es inmediato y cotranscripcional/correplicativo; una vez la polimerasa avanzó, no puede retroceder a distancia.'
      }
    ],
    
    observationsToConfirm: [
      'Presencia de melladuras transitorias (nicks) en la hebra discontinua (fragmentos de Okazaki) o señalización PCNA cargada en la hebra hija.',
      'Secuenciación que revela microsatélites inestables en células con mutaciones en MSH2 o MLH1.'
    ],
    
    correctLesionCharacteristics: [
      'Bases normales con enlaces de hidrógeno no canónicos.',
      'Ocurre inmediatamente tras el paso de la horquilla de replicación (fase S tardía).',
      'Exige discriminación de la hebra recién sintetizada.'
    ],
    
    appropriateOperations: [
      'recognize_mismatch',
      'discriminate_daughter_strand',
      'excise_oligonucleotide',
      'resynthesize_complementary_dna',
      'ligate_nick'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'MMR',
        isPrimary: true,
        conditions: 'Complejos heterodiméricos MutSα (MSH2-MSH6) y MutLα (MLH1-PMS2) funcionales y presencia de nicks/PCNA que dirijan la escisión hacia la hebra hija.',
        scientificRationale: 'MMR (Mismatch Repair) incrementa la fidelidad de replicación en 100 a 1000 veces escindiendo el tramo de la hebra nueva que contiene el error.',
        consequences: 'Restaura el par canónico G:C original sin alterar la información de la hebra parental.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'PROOFREADING',
        reason: 'El proofreading (corrección de pruebas) de la ADN polimerasa opera exclusivamente en el sitio catalítico activo durante la elongación; una vez que la horquilla se alejó, el error ya no es accesible al dominio exonucleasa 3\'->5\'.'
      },
      {
        mechanismId: 'BER',
        reason: 'Las glucosilasas no pueden discriminar cuál de las dos bases normales (G o T) es la equivocada en un apareamiento erróneo sin hebra señalizada.'
      }
    ],
    
    representativeProteins: ['MutSα (MSH2/MSH6)', 'MutLα (MLH1/PMS2)', 'Exonucleasa 1 (EXO1)', 'PCNA', 'ADN Polimerasa δ', 'RPA', 'ADN Ligasa I'],
    
    defaultPerturbationId: 'mmr_deficient',
    applicablePerturbations: ['mmr_deficient', 'ligase_defective', 'persistent_lesion'],
    
    clinicalConnection: 'Síndrome de Lynch (Cáncer Colorrectal Hereditario No Polipósico - HNPCC): Mutaciones germinales en MSH2, MLH1, MSH6 o PMS2 provocan pérdida del sistema MMR, inestabilidad de microsatélites (MSI-H) y predisposición a cáncer colorrectal, endometrial y gástrico.',
    
    keyConcepts: [
      'Diferencia estricta entre Proofreading (corrección inmediata in situ de polimerasa) y MMR (corrección posreplicativa a distancia).',
      'Mecanismo de discriminación de hebra: en eucariotas se basa en melladuras preexistentes (Okazaki o extremos 3\'/5\') y orientación de PCNA; en E. coli en hemimetilación de secuencias GATC por Dam metilasa.',
      'Inestabilidad de microsatélites por deslizamiento (slippage).'
    ],
    
    hints: {
      level1: 'Ninguna de las dos bases está dañada químicamente. ¿Cómo sabe la célula cuál de las dos hebras se acaba de copiar?',
      level2: 'Se necesita un heterodímero que reconozca el abultamiento del desapareamiento, reclute una endonucleasa orientada por PCNA para cortar la hebra hija, y una exonucleasa (EXO1) para degradar el tramo erróneo.',
      level3: 'El mecanismo es MMR (Reparación de Errores de Apareamiento), orquestado por MutSα y MutLα. Su fallo causa el síndrome de Lynch.'
    },
    isAdditional: false,
    categoryTier: 'core'
  },

  {
    id: 'escenario_5_alquilantes',
    number: 5,
    title: 'Agentes alquilantes y reversión directa',
    subtitle: 'Modificación por O6-metilguanina tras exposición a compuestos alquilantes',
    organism: 'Homo sapiens (célula glia / astrocitoma expuesto a temozolomida)',
    initialContext: 'Células expuestas a un agente alquilante (como nitrosaminas del humo de tabaco o fármacos como temozolomida) presentan una transferencia de grupos alquilo al oxígeno en posición 6 de la guanina, formando O6-metilguanina (O6-MeG).',
    damageSourceId: 'alkylating_agents',
    damageSourceName: 'Agentes alquilantes (temozolomida, nitrosaminas)',
    lesionTypeId: 'o6_methylguanine',
    lesionTypeName: 'O6-metilguanina (O6-MeG)',
    lesionDescription: 'Adición de un grupo metilo (-CH3) al átomo de oxígeno en C6 de la guanina. Este grupo bloquea la formación de los 3 puentes de hidrógeno habituales con citosina.',
    whyIsProblem: 'La O6-metilguanina aparea preferentemente con timina en lugar de citosina durante la replicación, lo que induce transiciones mutagénicas G:C → A:T y ciclos fútiles de reparación con toxicidad celular.',
    
    hypothesisOptions: [
      {
        id: 'hyp_alq_1',
        text: 'Adición de un radical alquilo que altera los puentes de hidrógeno de la guanina',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'El grupo metilo en O6 altera la capacidad donadora/aceptora de puentes de hidrógeno.'
      },
      {
        id: 'hyp_alq_2',
        text: 'Reversión directa sin necesidad de romper el esqueleto de ADN ni retirar la base',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'Ciertas proteínas especializadas pueden transferir químicamente el grupo metilo a un residuo propio de cisteína.'
      },
      {
        id: 'hyp_alq_3',
        text: 'Ruptura inmediata de cromátidas con intercambio de brazos cromosómicos',
        category: 'damage_type',
        isScientificallySound: false,
        explanation: 'La metilación es una modificación covalente de la base; no produce roturas cromosómicas directas inmediatas.'
      }
    ],
    
    observationsToConfirm: [
      'Inactivación estequiométrica 1:1 de la proteína MGMT tras la reparación.',
      'Sensibilidad tumoral a temozolomida cuando el promotor de MGMT está hipermetilado (silenciado epigenéticamente).'
    ],
    
    correctLesionCharacteristics: [
      'Grupo metilo unido covalentemente al oxígeno 6 de la guanina.',
      'Apareamiento aberrante con timina.',
      'Sustrato clásico de reversión directa enzimática "suicida".'
    ],
    
    appropriateOperations: [
      'recognize_modified_base',
      'direct_chemical_reversal'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'DIRECT_MGMT',
        isPrimary: true,
        conditions: 'Requiere moléculas intactas de la proteína MGMT (O6-metilguanina-ADN metiltransferasa). Cada molécula solo puede reparar una única lesión antes de ser ubiquitinada y degradada.',
        scientificRationale: 'MGMT transfiere directamente el grupo metilo desde el ADN hasta un residuo Cys145 de su propio centro activo en una reacción de un solo paso sin incisión de nucleótidos.',
        consequences: 'Restaura instantáneamente la guanina nativa sin generar intermediarios mutagénicos ni roturas de hebra.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'NHEJ',
        reason: 'NHEJ se ocupa de roturas de doble hebra, no de la metilación puntual de una base.'
      },
      {
        mechanismId: 'MMR',
        reason: 'Si el par O6-MeG:T es reconocido por MMR, este retira la T de la hebra nueva, pero la polimerasa vuelve a incorporar T frente a la O6-MeG persistente, generando un ciclo fútil letal.'
      }
    ],
    
    representativeProteins: ['MGMT (O6-alquilguanina-ADN alquiltransferasa)'],
    
    defaultPerturbationId: 'recognition_protein_absent',
    applicablePerturbations: ['recognition_protein_absent', 'persistent_lesion', 'mmr_deficient'],
    
    clinicalConnection: 'Neurooncología clínica: En el glioblastoma multiforme, los pacientes cuyo tumor tiene el promotor de MGMT hipermetilado (MGMT inactivo) responden significativamente mejor a la quimioterapia con temozolomida, porque las células tumorales no pueden reparar las lesiones O6-MeG y mueren por apoptosis.',
    
    keyConcepts: [
      'Enzima «suicida» (mecanismo estequiométrico 1 a 1, no catalítico regenerable).',
      'Reversión directa sin rotura fosfodiéster ni gasto de polimerasa/ligasa.',
      'Ciclo fútil de MMR frente a O6-MeG persistente.'
    ],
    
    hints: {
      level1: '¿Es estrictamente necesario cortar el ADN y sintetizar una nueva hebra si el único problema es un pequeño grupo químico adherido a la base?',
      level2: 'Existe una proteína que actúa como «enzima suicida», sacrificándose a sí misma para aceptar el grupo alquilo y devolver la base a su estado intacto.',
      level3: 'El mecanismo es la Reparación Directa mediante MGMT (O6-metilguanina-ADN metiltransferasa). Transfiere el metilo a una cisteína interna y luego se degrada.'
    },
    isAdditional: true,
    categoryTier: 'additional'
  },

  {
    id: 'escenario_6_dsb_g1',
    number: 6,
    title: 'Cromosoma roto en fase G1',
    subtitle: 'Rotura de doble hebra (DSB) en una célula que no dispone de cromátida hermana',
    organism: 'Homo sapiens (linfocito maduro o fibroblasto en fase G1)',
    initialContext: 'Tras recibir una dosis de radiación ionizante (o estrés oxidativo severo), se produce una rotura de doble hebra (DSB) en un cromosoma durante la fase G1 del ciclo celular. La célula no ha replicado su genoma: cada cromosoma es una cromátida única.',
    damageSourceId: 'ionizing_radiation',
    damageSourceName: 'Radiación ionizante (rayos X / gamma) o rotura bicatenaria espontánea',
    lesionTypeId: 'double_strand_break',
    lesionTypeName: 'Rotura de doble hebra (Double-Strand Break - DSB)',
    lesionDescription: 'Disrupción completa y simultánea de los enlaces fosfodiéster de ambas hebras de la doble hélice a poca distancia entre sí, dejando fragmentos cromosómicos separados.',
    whyIsProblem: 'La pérdida de continuidad física del cromosoma conduce a translocaciones letales, pérdida de brazos cromosómicos enteros durante la mitosis y activación masiva de puntos de control dependientes de p53/ATM.',
    
    hypothesisOptions: [
      {
        id: 'hyp_g1_1',
        text: 'Pérdida total de continuidad física bicatenaria en el cromosoma',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'Ambas hebras están escindidas; no queda ninguna hebra intacta en esa molécula para servir de molde directo.'
      },
      {
        id: 'hyp_g1_2',
        text: 'En fase G1 no existe una cromátida hermana idéntica alineada como molde homólogo',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'Antes de la fase S solo hay un cromosoma homólogo materno y paterno (demasiado divergentes e inaccesibles espacialmente en interfase).'
      },
      {
        id: 'hyp_g1_3',
        text: 'La recombinación homóloga de alta fidelidad con Rad51 es la vía preponderante en G1',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'La recombinación homóloga está fuertemente reprimida en G1 por falta de resección de extremos y ausencia de cromátida hermana accesible.'
      }
    ],
    
    observationsToConfirm: [
      'Formación de focos nucleares de γ-H2AX y 53BP1 mediante inmunofluorescencia.',
      'Secuenciación del sitio de unión que revela frecuentes microdeleciones de 1 a 10 pares de bases.'
    ],
    
    correctLesionCharacteristics: [
      'Rotura bicatenaria de ambas hebras.',
      'Célula en fase G1 (sin cromátida hermana disponible).',
      'Extremos libres que deben protegerse de degradación descontrolada.'
    ],
    
    appropriateOperations: [
      'recognize_dsb_ends',
      'process_and_ligate_ends',
      'arrest_cell_cycle'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'NHEJ',
        isPrimary: true,
        conditions: 'Vía obligatoria y dominante en fase G1. El heterodímero Ku70/Ku80 reconoce y abraza los extremos rotos, reclutando a DNA-PKcs y al complejo Artemis/Ligasa IV.',
        scientificRationale: 'NHEJ (Non-Homologous End Joining) une físicamente los extremos sin necesidad de un molde homólogo. Es rápido y restaura la continuidad del cromosoma.',
        consequences: 'Puede ser preciso si los extremos son compatibles y limpios; con frecuencia requiere procesamiento nucleolítico que introduce pequeñas deleciones o inserciones (mutagénico tolerable para salvar la continuidad cromosómica).'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'HR',
        reason: 'La recombinación homóloga requiere una cromátida hermana idéntica inmediatamente contigua y está activamente inhibida en G1 por 53BP1 y baja actividad de quinasas dependientes de ciclinas (CDK).'
      },
      {
        mechanismId: 'BER',
        reason: 'BER escinde bases individuales dejando el esqueleto opuesto como molde; es incapaz de reconectar dos extremos cromosómicos completamente separados.'
      }
    ],
    
    representativeProteins: ['Ku70 / Ku80', 'DNA-PKcs', 'Artemis (nucleasa)', 'XRCC4', 'ADN Ligasa IV', '53BP1'],
    
    defaultPerturbationId: 'cell_enters_g2',
    applicablePerturbations: ['cell_enters_g2', 'incompatible_ends', 'ligase_defective', 'checkpoint_failure', 'imprecise_ligation'],
    
    clinicalConnection: 'Inmunodeficiencia combinada grave (SCID): Las mutaciones en componentes de NHEJ (como Artemis o Ligasa IV) impiden la recombinación V(D)J en linfocitos B y T, provocando ausencia total de linfocitos maduros además de radiosensibilidad extrema.',
    
    keyConcepts: [
      'Compromiso de supervivencia: continuidad cromosómica vs fidelidad de secuencia.',
      'Papel protector del anillo heterodímero Ku70/80.',
      'Represión de la resección en G1 mediada por 53BP1 y ausencia de CDK activas.',
      'Riesgo de translocaciones cromosómicas aberrantes si se ligan extremos de cromosomas distintos.'
    ],
    
    hints: {
      level1: 'Fíjate en el ciclo celular: la célula está en G1. ¿Existe una copia idéntica del cromosoma lista para servir de molde?',
      level2: 'La prioridad celular urgente es evitar que los fragmentos cromosómicos se dispersen y causen anomalías mitóticas. Un complejo en forma de anillo sostiene y procesa directamente los extremos para ligarlos.',
      level3: 'El mecanismo es NHEJ (Unión de Extremos No Homólogos). No requiere molde de cromátida hermana y reconecta los extremos mediante el complejo Ku70/80 y ADN Ligasa IV.'
    },
    isAdditional: false,
    categoryTier: 'core'
  },

  {
    id: 'escenario_7_dsb_g2',
    number: 7,
    title: 'Cromosoma roto en fase G2 y cromátida hermana',
    subtitle: 'Rotura de doble hebra cuando existe una cromátida hermana disponible',
    organism: 'Homo sapiens (célula proliferativa en fase G2 tardía)',
    initialContext: 'La misma clase de rotura de doble hebra (DSB) se produce ahora en una célula en fase G2, una vez completada con éxito la replicación. Justo al lado del cromosoma roto se encuentra su cromátida hermana físicamente retenida por cohesinas.',
    damageSourceId: 'ionizing_radiation',
    damageSourceName: 'Radiación ionizante / Rotura bicatenaria en fase G2',
    lesionTypeId: 'double_strand_break',
    lesionTypeName: 'Rotura de doble hebra en presencia de cromátida hermana',
    lesionDescription: 'Rotura de ambas hebras en una molécula de ADN bicatenario cuando existe una copia idéntica adyacente (cromátida hermana).',
    whyIsProblem: 'La célula tiene ante sí una encrucijada de decisión molecular: ¿usar la cromátida hermana para copiar fielmente la secuencia original (HR) o reconectar rápidamente los extremos (NHEJ)?',
    
    hypothesisOptions: [
      {
        id: 'hyp_g2_1',
        text: 'Presencia de una cromátida hermana físicamente disponible y retenida por cohesinas',
        category: 'structure_affected',
        isScientificallySound: true,
        explanation: 'En G2, el ADN ya se duplicó y la cromátida hermana actúa como molde perfecto de secuencias idénticas.'
      },
      {
        id: 'hyp_g2_2',
        text: 'La alta actividad de CDK favorece la resección 5\'→3\' abriendo la vía de Recombinación Homóloga (HR)',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'En fase S y G2, la fosforilación por CDK estimula a CtIP y al complejo MRN para generar extremos monocatenarios 3\' ricos en Rad51.'
      },
      {
        id: 'hyp_g2_3',
        text: 'NHEJ queda estrictamente prohibido y destruido en fase G2',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'NHEJ sigue estando funcional y compite con HR; si la resección no ocurre rápidamente, NHEJ puede reparar la rotura incluso en G2.'
      }
    ],
    
    observationsToConfirm: [
      'Visualización de filamentos nucleoproteicos de Rad51 mediante microscopía confocal superresolutiva.',
      'Detección de intermediarios de unión de Holliday en ensayos de electroforesis bidimensional.'
    ],
    
    correctLesionCharacteristics: [
      'Rotura bicatenaria con extremos libres.',
      'Célula en fase G2 con alta actividad CDK.',
      'Disponibilidad espacial de cromátida hermana idéntica.'
    ],
    
    appropriateOperations: [
      'recognize_dsb_ends',
      'use_homologous_template',
      'resynthesize_complementary_dna',
      'ligate_nick',
      'arrest_cell_cycle'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'HR',
        isPrimary: true,
        conditions: 'Fase S/G2, actividad CDK elevada, complejo MRN/CtIP para resección 5\'→3\', y proteínas mediadoras BRCA1, BRCA2 y recombinasa Rad51.',
        scientificRationale: 'La recombinación homóloga (HR) invade la cromátida hermana idéntica con el extremo 3\' monocatenario recubierto de Rad51, copiando la secuencia original con fidelidad absoluta (reparación libre de error).',
        consequences: 'Restaura exactamente la secuencia de nucleótidos nativa sin inserciones ni deleciones.'
      },
      {
        mechanismId: 'NHEJ',
        isPrimary: false,
        conditions: 'Permanece disponible como alternativa rápida o si falla la resección inicial.',
        scientificRationale: 'NHEJ puede actuar en cualquier fase del ciclo; sin embargo, en G2 la vía de HR está favorecida cinéticamente en eucariotas superiores para evitar mutaciones en regiones génicas críticas.',
        consequences: 'Rápida reconexión pero con posible pérdida menor de nucleótidos terminales.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'MMR',
        reason: 'MMR se limita a desapareamientos de bases de nucleótidos en ADN bicatenario continuo; no puede reconectar extremos rotos ni invadir cromátidas.'
      }
    ],
    
    representativeProteins: ['MRN (Mre11-Rad50-Nbs1)', 'CtIP', 'BRCA1', 'BRCA2', 'Rad51', 'RPA', 'ADN Polimerasa δ'],
    
    defaultPerturbationId: 'brca2_loss',
    applicablePerturbations: ['brca2_loss', 'no_sister_chromatid', 'checkpoint_failure', 'ligase_defective'],
    
    clinicalConnection: 'Cáncer hereditario de mama y ovario (HBOC): Mutaciones en BRCA1 o BRCA2 anulan la capacidad de la célula para realizar recombinación homóloga (HR). Esto las hace dependientes de vías alternativas propensas a error y extraordinariamente sensibles a inhibidores de PARP (letalidad sintética).',
    
    keyConcepts: [
      'Regulación por ciclo celular: el papel de CDK en promover la resección 5\'→3\'.',
      'Carga de Rad51 mediada por BRCA2 desplazando a RPA.',
      'Invasión de hebra (D-loop) y síntesis dirigida por homología.',
      'Concepto terapéutico de letalidad sintética (Inhibidores de PARP en tumores HR-deficientes).'
    ],
    
    hints: {
      level1: 'Compara este escenario con el anterior (G1): ¿Qué elemento molecular y espacial crucial está presente ahora en G2?',
      level2: 'La presencia de una cromátida hermana idéntica permite a la célula realizar una invasión de hebra catalizada por Rad51 para copiar la información perdida con máxima fidelidad.',
      level3: 'El mecanismo óptimo es la Recombinación Homóloga (HR), que depende críticamente de BRCA1, BRCA2 y Rad51, ofreciendo reparación libre de error en S/G2.'
    },
    isAdditional: false,
    categoryTier: 'core'
  },

  {
    id: 'escenario_8_aducto_voluminoso',
    number: 8,
    title: 'Carcinógenos químicos y aductos voluminosos',
    subtitle: 'Un metabolito del humo de tabaco (benzo[a]pireno) se une al ADN',
    organism: 'Homo sapiens (célula del epitelio bronquial)',
    initialContext: 'En un fumador crónico, el benzo[a]pireno inhalado es metabolizado por enzimas citocromo P450 al metabolito electrofílico BPDE (benzo[a]pireno diol epóxido), el cual reacciona covalentemente con el grupo amino exocíclico de la guanina, formando un aducto policíclico masivo.',
    damageSourceId: 'chemical_carcinogen',
    damageSourceName: 'Metabolito carcinógeno ambiental (Benzo[a]pireno / BPDE)',
    lesionTypeId: 'bulky_adduct',
    lesionTypeName: 'Aducto voluminoso de ADN (BPDE-N2-Guanina)',
    lesionDescription: 'Unión covalente de un anillo aromático tetracíclico hidrocarbonado gigante al nitrógeno N2 de la guanina. El tamaño de la molécula carcinógena sobresale e interrumpe el apilamiento normal de bases nitrogenadas.',
    whyIsProblem: 'El volumen estérico del aducto desestabiliza localmente la doble hélice e impide el cierre de las polimerasas replicativas y transcripcionales, induciendo mutaciones transversionales directas o muerte por apoptosis.',
    
    hypothesisOptions: [
      {
        id: 'hyp_ad_1',
        text: 'Adhesión covalente de una estructura química voluminosa que distorsiona la conformación helicoidal',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'El hidrocarburo aromático intercala y deforma la regularidad geométrica del dúplex de ADN.'
      },
      {
        id: 'hyp_ad_2',
        text: 'Una ADN glucosilasa sencilla de BER puede voltear y procesar fácilmente el aducto gigante',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'El bolsillo catalítico de las glucosilasas de BER es estrecho y específico para bases pequeñas; no puede albergar aductos voluminosos policíclicos.'
      },
      {
        id: 'hyp_ad_3',
        text: 'Requiere la maquinaria de incisión dual de oligonucleótidos de NER',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'Al igual que con los dímeros UV, la distorsión helicoidal activa a XPC y TFIIH para retirar un tramo completo de ~30 nucleótidos.'
      }
    ],
    
    observationsToConfirm: [
      'Inmunocromatografía o espectrometría de masas en tándem que detecta aductos BPDE-ADN.',
      'Ensayos de síntesis no programada de ADN (UDS) estimulada por incisión de TFIIH.'
    ],
    
    correctLesionCharacteristics: [
      'Aducto covalente voluminoso (múltiples anillos aromáticos).',
      'Distorsión severa del apilamiento de bases de la doble hélice.',
      'Incompatibilidad estérico-catalítica con las ADN glucosilasas de BER.'
    ],
    
    appropriateOperations: [
      'recognize_distortion',
      'excise_oligonucleotide',
      'resynthesize_complementary_dna',
      'ligate_nick'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'NER',
        isPrimary: true,
        conditions: 'Complejo XPC-RAD23B para reconocimiento de la distorsión o bloqueo de la ARN Pol II para la vía TC-NER.',
        scientificRationale: 'NER está evolutivamente adaptado para reconocer cualquier lesión que desestabilice la conformación estereoquímica de la hélice, sin importar la fórmula química exacta del compuesto que causó la distorsión.',
        consequences: 'Elimina el fragmento que contiene el aducto restituyendo la secuencia fidedigna original.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'BER',
        reason: 'Las ADN glucosilasas poseen un bolsillo estérico rígido que solo admite bases individuales ligeramente oxidadas o desaminadas, siendo incapaces de alojar aductos policíclicos voluminosos.'
      },
      {
        mechanismId: 'DIRECT_MGMT',
        reason: 'MGMT transfiere únicamente pequeños grupos alquilo (metilo/etilo); no posee capacidad para revertir aductos aromáticos policíclicos como BPDE.'
      }
    ],
    
    representativeProteins: ['XPC', 'TFIIH', 'XPA', 'ERCC1-XPF', 'XPG', 'ADN Polimerasa ε'],
    
    defaultPerturbationId: 'recognition_protein_absent',
    applicablePerturbations: ['recognition_protein_absent', 'replication_fork_arrives', 'persistent_lesion'],
    
    clinicalConnection: 'Mutagénesis de TP53 en cáncer de pulmón: Los aductos de BPDE se forman preferentemente en codones específicos (como 157, 248 y 273) del gen TP53, coincidiendo exactamente con las mutaciones G→T descritas en los tumores de pacientes fumadores.',
    
    keyConcepts: [
      'Flexibilidad de reconocimiento de NER: reconoce la distorsión geométrica, no el agente específico.',
      'Comparación fundamental entre BER (sustrato químico específico) y NER (sustrato geométrico-estructural).',
      'Mecanismos de tolerancia al daño: síntesis translesión (TLS) si la horquilla alcanza el aducto.'
    ],
    
    hints: {
      level1: 'Compara el tamaño del benzo[a]pireno con una base nitrogenada normal: ¿cabe este aducto gigante en el bolsillo de una glucosilasa de BER?',
      level2: 'La célula detecta la deformación helicoidal mediante un complejo que abre una burbuja de ~30 nucleótidos alrededor de la lesión para cortarla por ambos lados.',
      level3: 'El mecanismo es NER (Reparación por Escisión de Nucleótidos). Es el mismo mecanismo que repara los dímeros UV, demostrando que NER responde a distorsiones conformacionales amplias.'
    },
    isAdditional: true,
    categoryTier: 'additional'
  },

  {
    id: 'escenario_9_fotoreactivacion',
    number: 9,
    title: 'Fotoreactivación biológica y especificidad evolutiva',
    subtitle: 'Una bacteria dispone de fotoliasa activada por luz visible para revertir dímeros UV',
    organism: 'Escherichia coli (bacteria procariota)',
    initialContext: 'Un cultivo de bacterias E. coli es expuesto brevemente a radiación ultravioleta C/B y posteriormente incubado en presencia de luz visible (rango azul, ~350-450 nm). Se observa una supervivencia bacteriana drásticamente superior a la observada en la oscuridad.',
    damageSourceId: 'bacterial_uv',
    damageSourceName: 'Radiación ultravioleta en procariotas',
    lesionTypeId: 'thymine_dimer',
    lesionTypeName: 'Dímero de timina en genoma bacteriano',
    lesionDescription: 'Anillo de ciclobutano entre timinas adyacentes inducido por UV en el cromosoma circular bacteriano.',
    whyIsProblem: 'El dímero detiene la ADN polimerasa III bacteriana y la ARN polimerasa. La bacteria dispone de dos opciones moleculares: fotoreactivación enzimática o escisión por el sistema UvrABC.',
    
    hypothesisOptions: [
      {
        id: 'hyp_foto_1',
        text: 'La bacteria cuenta con una enzima fotoliasa capaz de utilizar la energía de un fotón visible para romper el dímero',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'La ADN fotoliasa captura fotones en el rango azul mediante cromóforos antena y transfiere un electrón para romper el anillo ciclobutano.'
      },
      {
        id: 'hyp_foto_2',
        text: 'Los mamíferos placentarios como los humanos poseen exactamente la misma enzima fotoliasa activa',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'Los mamíferos placentarios carecen de fotoliasas de ADN reparadoras (sus genes homólogos derivaron en criptocromos del reloj circadiano).'
      },
      {
        id: 'hyp_foto_3',
        text: 'Si se mantiene a la bacteria en oscuridad total, aún puede recurrir a su sistema de escisión (UvrABC)',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'El sistema UvrABC es el equivalente bacteriano de NER y no requiere luz visible para escindir el segmento dañado.'
      }
    ],
    
    observationsToConfirm: [
      'Dependencia absoluta de la longitud de onda luminosa (~380-440 nm) para la catálisis por FADH-.',
      'Persistencia de reparación en cepas deficientes en phr mediante el complejo UvrABC.'
    ],
    
    correctLesionCharacteristics: [
      'Dímero de timinas en organismo no placentario (procariota).',
      'Posibilidad de reversión directa mediada por luz visible.',
      'Existencia simultánea de vía alternativa de escisión (UvrABC).'
    ],
    
    appropriateOperations: [
      'recognize_distortion',
      'photoreactivation',
      'direct_chemical_reversal'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'PHOTOLYASE',
        isPrimary: true,
        conditions: 'Presencia de enzima fotoliasa funcional y disponibilidad de luz visible (fotones azules ~350-450 nm).',
        scientificRationale: 'La fotoliasa transfiere un electrón desde su cofactor flavina reducido (FADH-) hacia el dímero de ciclobutano, rompiendo los enlaces C-C anómalos y regenerando las dos timinas originales sin cortar el ADN.',
        consequences: 'Restaura directamente la secuencia intacta de manera energéticamente eficiente y sin intermediarios de rotura.'
      },
      {
        mechanismId: 'NER',
        isPrimary: false,
        conditions: 'Funciona tanto en luz como en oscuridad mediante el complejo bacteriano UvrA-UvrB-UvrC (UvrABC excinucleasa).',
        scientificRationale: 'UvrA2B sensa la distorsión, UvrC realiza cortes duales (a 8 nt en 5\' y 4-5 nt en 3\') y UvrD desenrolla el oligonucleótido de 12-13 nt.',
        consequences: 'Restaura la secuencia pero con mayor gasto energético de hidrólisis de ATP y resíntesis.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'DIRECT_MGMT',
        reason: 'MGMT transfiere grupos alquilo; carece de cofactores cromóforos y no puede revertir dímeros de timina.'
      }
    ],
    
    representativeProteins: ['ADN Fotoliasa (Phr)', 'Cofactor FADH-', 'Complejo UvrABC (NER bacteriano)', 'UvrD helicasa'],
    
    defaultPerturbationId: 'recognition_protein_absent',
    applicablePerturbations: ['recognition_protein_absent', 'ligase_defective', 'persistent_lesion'],
    
    clinicalConnection: 'Diferencia biológica crucial: Por qué los humanos sufrimos cáncer de piel y quemaduras solares con mucha mayor facilidad. Al carecer de fotoliasa, nuestras células dependen exclusivamente de la compleja maquinaria de NER. En biotecnología se ensayan cremas con fotoliasa encapsulada en liposomas para pacientes con xeroderma pigmentoso.',
    
    keyConcepts: [
      'Catálisis impulsada por transferencia electrónica activada por luz (fotoquímica enzimática).',
      'Coexistencia de dos rutas distintas para una misma lesión: Fotoreactivación directa vs Escisión (UvrABC/NER).',
      'Diferencias evolutivas procariotas / metazoos basales vs mamíferos placentarios.'
    ],
    
    hints: {
      level1: 'Observa las condiciones experimentales: la bacteria fue expuesta a luz visible tras el daño. ¿Qué enzima especial tienen las bacterias que los humanos no poseemos?',
      level2: 'La enzima absorbe fotones azules mediante cromóforos y devuelve un electrón al anillo de pirimidinas para revertirlo directamente sin cortar el ADN.',
      level3: 'El mecanismo es la Fotoreactivación enzimática dependiente de fotoliasa (Phr). Como alternativa en la oscuridad, la bacteria cuenta con el sistema de escisión UvrABC (NER).'
    },
    isAdditional: true,
    categoryTier: 'additional'
  },

  {
    id: 'escenario_10_crispr',
    number: 10,
    title: 'Edición génica y encrucijada de reparación celular',
    subtitle: 'Una ribonucleoproteína CRISPR-Cas9 produce un corte bicatenario dirigido en el genoma',
    organism: 'Homo sapiens (célula madre pluripotente inducida - iPSC)',
    initialContext: 'En un experimento de terapia génica en iPSCs, se transfecta la nucleasa Cas9 guiada por un ARN guía (sgRNA) diseñado para inducir una rotura de doble hebra (DSB) en el exón 2 de un gen diana. Los investigadores agregan simultáneamente un oligonucleótido monocatenario como molde donor homólogo.',
    damageSourceId: 'crispr_cas9',
    damageSourceName: 'Endonucleasa guiada por ARN programada (CRISPR-Cas9)',
    lesionTypeId: 'double_strand_break',
    lesionTypeName: 'Corte bicatenario dirigido (DSB dirigido)',
    lesionDescription: 'Corte neto de ambas hebras a 3 pares de bases upstream de la secuencia PAM (NGG), generando extremos romos iniciales en una coordenada genómica exacta.',
    whyIsProblem: 'La célula no sabe que el corte fue hecho artificialmente por un biólogo molecular: su sistema inmune genómico activa de inmediato las vías de reparación celular endógenas (NHEJ vs HDR).',
    
    hypothesisOptions: [
      {
        id: 'hyp_cr_1',
        text: 'El resultado genético final dependerá de cuál mecanismo celular de reparación procese el corte',
        category: 'cellular_process',
        isScientificallySound: true,
        explanation: 'La herramienta CRISPR solo corta el ADN; el cambio genético efectivo lo ejecuta la propia célula según la vía de reparación elegida.'
      },
      {
        id: 'hyp_cr_2',
        text: 'Añadir un ADN molde exógeno garantiza al 100% que la célula usará reparación homóloga precisa',
        category: 'cellular_process',
        isScientificallySound: false,
        explanation: 'Incluso suministrando molde donor en abundancia, NHEJ compite fuertemente y suele generar indels no deseados si la célula está en fase G1 o si la cinética de NHEJ es más rápida.'
      },
      {
        id: 'hyp_cr_3',
        text: 'NHEJ generará pequeñas inserciones o deleciones (indels) que frecuentemente causan pérdida de marco de lectura (Knockout)',
        category: 'damage_type',
        isScientificallySound: true,
        explanation: 'La unión repetida y corte iterativo por Cas9 termina introduciendo un indel que silencia el gen.'
      }
    ],
    
    observationsToConfirm: [
      'Ensayo T7E1 (T7 Endonuclease I) que revela heteroduplexes debidos a indels generados por NHEJ.',
      'Secuenciación masiva (NGS amplicon) para cuantificar la proporción exacta de eventos HDR precisos vs indels NHEJ.'
    ],
    
    correctLesionCharacteristics: [
      'Rotura dirigida de doble hebra con coordenadas genómicas exactas.',
      'Concurrencia de vías celulares competitivas: NHEJ vs HDR.',
      'El resultado fenotípico depende de la fase del ciclo celular y de la presencia/fidelidad del molde.'
    ],
    
    appropriateOperations: [
      'recognize_dsb_ends',
      'use_homologous_template',
      'process_and_ligate_ends',
      'ligate_nick'
    ],
    
    compatibleMechanisms: [
      {
        mechanismId: 'NHEJ',
        isPrimary: true,
        conditions: 'Ocurre predominantemente en G1, pero también compite activamente en S y G2.',
        scientificRationale: 'NHEJ reconecta los extremos; si reconecta perfectamente, Cas9 vuelve a cortar. Cuando finalmente NHEJ comete un error (indel de ±1-10 pb), se pierde el sitio diana o PAM y se fija una mutación por cambio de marco (knockout génico).',
        consequences: 'Genera inserciones y deleciones (indels) impredecibles que inactivan el gen.'
      },
      {
        mechanismId: 'HR',
        isPrimary: false,
        conditions: 'Restringida a fases S y G2; requiere resección 5\'→3\' y la presencia del molde donor homólogo introducido.',
        scientificRationale: 'HDR (Homology-Directed Repair) utiliza el molde suministrado para copiar la secuencia deseada (ej. corregir una mutación patogénica o introducir un tag).',
        consequences: 'Inserción o corrección genética milimétrica y precisa.'
      }
    ],
    
    incompatibleMechanisms: [
      {
        mechanismId: 'BER',
        reason: 'BER solo retira bases nitrogenadas dañadas individuales; no tiene competencia catalítica sobre extremos rotos bicatenarios de cromosomas enteros.'
      }
    ],
    
    representativeProteins: ['Cas9', 'Ku70/Ku80', 'Rad51', 'BRCA1/2', 'ADN Ligasa IV', 'CtIP'],
    
    defaultPerturbationId: 'cell_enters_g2',
    applicablePerturbations: ['cell_enters_g2', 'no_sister_chromatid', 'imprecise_ligation', 'brca2_loss'],
    
    clinicalConnection: 'Terapia génica en anemia de células falciformes (Casgevy / Exa-cel): Se induce un corte dirigido por Cas9 en el potenciador del gen BCL11A en células madre hematopoyéticas. La reparación deliberada mediante NHEJ rompe el sitio de unión del represor, reactivando la hemoglobina fetal protectora.',
    
    keyConcepts: [
      'CRISPR es una tijera programable, no un pegamento ni un editor autónomo: el resultado genético es obra de la reparación celular.',
      'Competencia cinética entre NHEJ (rápido, predominante, propenso a indels) y HDR (lento, dependiente de fase S/G2 y molde).',
      'Estrategias moleculares modernas para favorecer HDR: sincronizar células en S/G2 o inhibir transitoriamente componentes de NHEJ.'
    ],
    
    hints: {
      level1: '¿Qué tipo de daño físico genera la nucleasa Cas9 en el ADN? ¿Es una base alterada o una rotura completa de ambas hebras?',
      level2: 'La rotura bicatenaria abre dos caminos celulares: si se reconectan los extremos directamente (NHEJ) se generan indels; si se utiliza el molde aportado por los investigadores (HDR) se produce una edición precisa.',
      level3: 'Las dos vías en competencia son NHEJ (que genera disrupción de marco para knockout) y HDR/HR (que utiliza el molde para knock-in preciso en fase S/G2).'
    },
    isAdditional: true,
    categoryTier: 'additional'
  }
];
