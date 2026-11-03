export interface ScientificReference {
  title: string;
  authors: string;
  edition: string;
  topics: string;
  notes: string;
}

export interface GlossaryConcept {
  term: string;
  definition: string;
  category: 'mecanismo' | 'lesion' | 'enzima' | 'regulacion';
  clinicalNote?: string;
}

export const SCIENTIFIC_REFERENCES: ScientificReference[] = [
  {
    title: 'Molecular Biology of the Cell',
    authors: 'Alberts, B., Johnson, A., Lewis, J., Morgan, D., Raff, M., Roberts, K., & Walter, P.',
    edition: '7th / 6th Edition, Garland Science / W. W. Norton',
    topics: 'Mecanismos de reparación del ADN (BER, NER, MMR, NHEJ, HR), puntos de control del ciclo celular (ATM/ATR, Chk1/Chk2, p53).',
    notes: 'Referencia fundamental para la arquitectura del complejo de recombinación Rad51/BRCA2 y la incisión dual de NER por TFIIH.'
  },
  {
    title: 'Molecular Cell Biology',
    authors: 'Lodish, H., Berk, A., Kaiser, C. A., Krieger, M., Bretscher, A., Ploegh, H., Martin, K. C., Yaffe, M. B., & Amon, A.',
    edition: '9th / 8th Edition, Macmillan Learning',
    topics: 'Fidelidad de la copia del ADN, química de las lesiones oxidativas y alquilantes, reparación de roturas de doble hebra y letalidad sintética.',
    notes: 'Detalla con especial claridad el reconocimiento por volteo de base (base flipping) en las ADN glucosilasas y la genética del síndrome de Lynch.'
  },
  {
    title: 'Molecular Biology of the Gene',
    authors: 'Watson, J. D., Baker, T. A., Bell, S. P., Gann, A., Levine, M., & Losick, R.',
    edition: '7th Edition, Pearson',
    topics: 'Mecanismo catalítico del proofreading por la ADN polimerasa, fotoliasa procariota y especificidad molecular de reversión directa.',
    notes: 'Imprescindible para comprender la diferencia entre Proofreading (corrección de pruebas) y Mismatch Repair (MMR).'
  },
  {
    title: 'DNA Repair and Mutagenesis',
    authors: 'Friedberg, E. C., Walker, G. C., Siede, W., Wood, R. D., Schultz, R. A., & Ellenberger, T.',
    edition: '2nd Edition, ASM Press',
    topics: 'Tratado monográfico exhaustivo sobre todas las rutas bioquímicas de reparación de daño genómico.',
    notes: 'Referencia canónica para las cinéticas de enzimas como MGMT, UNG y la excinucleasa humana.'
  }
];

export const GLOSSARY_CONCEPTS: GlossaryConcept[] = [
  {
    term: 'Reparación por Escisión de Bases (BER)',
    definition: 'Mecanismo que corrige modificaciones químicas discretas de bases individuales (oxidadas como 8-oxoG, alquiladas o desaminadas como uracilo). Se inicia con una ADN glucosilasa específica que hidroliza el enlace N-glucosídico dejando un sitio apurínico o apirimidínico (AP), seguido de incisión por AP endonucleasa, polimerización de relleno y ligación.',
    category: 'mecanismo',
    clinicalNote: 'Mutaciones en MUTYH causan poliposis adenomatosa colorrectal.'
  },
  {
    term: 'Reparación por Escisión de Nucleótidos (NER)',
    definition: 'Vía enzimática versátil encargada de eliminar lesiones que provocan distorsiones volumétricas y rigidez en la doble hélice del ADN, como los dímeros de pirimidinas inducidos por UV y los aductos voluminosos de hidrocarburos policíclicos. Opera mediante incisión dual de un tramo de 24 a 32 nucleótidos.',
    category: 'mecanismo',
    clinicalNote: 'Defectos en NER causan Xeroderma Pigmentoso (XP), Síndrome de Cockayne y Tricotiodistrofia.'
  },
  {
    term: 'Reparación de Errores de Apareamiento (MMR)',
    definition: 'Sistema de corrección posreplicativo que detecta pares de bases no canónicas (mismatches) y pequeños bucles de inserción/deleción originados por el deslizamiento de la ADN polimerasa que han escapado a su actividad de corrección de pruebas. En humanos es coordinado por los heterodímeros MutSα y MutLα.',
    category: 'mecanismo',
    clinicalNote: 'Mutaciones en genes MMR (MSH2, MLH1, MSH6, PMS2) originan el Síndrome de Lynch con inestabilidad de microsatélites (MSI).'
  },
  {
    term: 'Recombinación Homóloga (HR)',
    definition: 'Vía de reparación de roturas de doble hebra de máxima fidelidad (libre de error) que requiere una secuencia homóloga idéntica como molde, generalmente la cromátida hermana presente en las fases S y G2. Involucra resección 5\'→3\', formación de filamentos Rad51 y formación del lazo de invasión (D-loop).',
    category: 'mecanismo',
    clinicalNote: 'Deficiencia en BRCA1 o BRCA2 anula HR y confiere extrema sensibilidad a fármacos inhibidores de PARP (Olaparib).'
  },
  {
    term: 'Unión de Extremos No Homólogos (NHEJ)',
    definition: 'Vía predominante en células humanas para reparar roturas de doble hebra que opera en cualquier fase del ciclo celular (especialmente G1). Los extremos rotos son protegidos por el anillo heterodimérico Ku70/80, procesados por nucleasas (Artemis) y unidos directamente por la ADN Ligasa IV sin necesidad de molde homólogo extenso.',
    category: 'mecanismo',
    clinicalNote: 'Defectos en Ligasa IV o Artemis causan Inmunodeficiencia Combinada Grave con Radiosensibilidad (RS-SCID).'
  },
  {
    term: 'Reversión Directa por MGMT',
    definition: 'Mecanismo en el que una enzima transfiere un grupo químico añadido anómalo (como el grupo metilo de O6-metilguanina) directamente a un residuo interno de cisteína de su propio sitio activo, restaurando la base sin necesidad de escindir ningún enlace fosfodiéster ni gastar nucleótidos.',
    category: 'mecanismo',
    clinicalNote: 'La hipermetilación del promotor de MGMT en glioblastoma predice una excelente respuesta quimioterápica a temozolomida.'
  },
  {
    term: 'Fotoreactivación Enzimática',
    definition: 'Proceso de reversión directa mediado por la enzima fotoliasa, la cual absorbe energía de fotones de luz visible (azul, 350-450 nm) a través de cromóforos antena para transferir un electrón y romper fotoquímicamente los dímeros de pirimidina. Está presente en bacterias, levaduras y plantas, pero AUSENTE en mamíferos placentarios.',
    category: 'mecanismo',
    clinicalNote: 'Los seres humanos carecemos de fotoliasa funcional, lo que nos hace totalmente dependientes de NER para sobrevivir a la radiación solar.'
  },
  {
    term: 'Corrección de Pruebas (Proofreading)',
    definition: 'Capacidad catalítica intrínseca de ciertas ADN polimerasas replicativas (como Pol δ y Pol ε) mediada por un dominio exonucleasa 3\'→5\'. Cuando se detecta un nucleótido mal apareado inmediatamente tras su inserción, la polimerasa retrocede un nucleótido, lo escinde e inserta el correcto antes de continuar.',
    category: 'mecanismo',
    clinicalNote: 'Mutaciones germinales en los dominios exonucleasa de POLE y POLD1 predisponen a poliposis y cáncer colorrectal con hipermutación ultraelevada.'
  },
  {
    term: 'Lesión Química vs Mutación Establecida',
    definition: 'Una lesión química es un daño estructural reconocible (base rota, distorsión, base modificada) que la maquinaria celular puede identificar y reparar. Una mutación establecida es un cambio de secuencia que ya se ha copiado en ambas hebras con apareamiento canónico Watson-Crick (ej. T:A), por lo que ya NO es reconocida como daño por los sistemas de reparación fisiológicos.',
    category: 'lesion'
  },
  {
    term: 'Letalidad Sintética',
    definition: 'Fenómeno biológico en el que la deficiencia simultánea de dos genes o vías celulares conduce a la muerte celular, mientras que la alteración de solo uno de ellos es compatible con la viabilidad. Se explota farmacológicamente administrando inhibidores de PARP en células tumorales deficientes en HR (BRCA1/2-/-).',
    category: 'regulacion'
  }
];
