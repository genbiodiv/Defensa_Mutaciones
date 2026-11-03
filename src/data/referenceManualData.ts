export interface ReferenceSubSection {
  id: string;
  title: string;
  content: string;
  keyEnzymes?: string[];
  keyMolecules?: string[];
  diagnosticTip?: string;
  relatedScenarioNumbers?: number[];
  clinicalSignificance?: string;
  keyPoints?: string[];
}

export interface ReferenceChapter {
  id: string;
  chapterNumber: number;
  title: string;
  subtitle: string;
  summary: string;
  badge: string;
  subsections: ReferenceSubSection[];
  relatedScenarioIds: string[];
}

export const REFERENCE_CHAPTERS: ReferenceChapter[] = [
  {
    id: 'capitulo_1_fundamentos',
    chapterNumber: 1,
    title: 'Fundamentos de la Estabilidad Genómica y Fuentes de Daño',
    subtitle: 'El dilema biofísico: reactividad celular y agentes genotóxicos exógenos y endógenos',
    badge: 'Biofísica & Agentes',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_2_oxidativo', 'escenario_4_desaminacion', 'escenario_7_ionizante', 'escenario_9_aducto_tabaco'],
    summary: 'El ADN no es un polímero químicamente inerte, sino una molécula dinámica sometida continuamente a ataques termodinámicos, oxidativos, radiaciones electromagnéticas y agentes químicos ambientales. Una célula humana normal sufre entre 10,000 y 100,000 lesiones moleculares por día.',
    subsections: [
      {
        id: 'sec_1_1',
        title: '1.1 La paradoja de la estabilidad del ADN',
        content: `A pesar de ser el portador de la información genética de la vida, el ADN contiene enlaces N-glucosídicos, puentes fosfodiéster y bases nitrogenadas ricos en nitrógeno y oxígeno que son intrínsecamente reactivos frente a electrófilos, radicales libres y agua a 37°C. La integridad de la doble hélice depende de un equilibrio dinámico entre la tasa de daño basal y la eficiencia de los complejos multienzimáticos de vigilancia y reparación celular.`,
        keyPoints: [
          'El genoma humano sufre decenas de miles de agresiones químicas por célula diariamente.',
          'La no reparación de lesiones conduce a mutaciones permanentes, paradas de horquillas de replicación, inestabilidad cromosómica o senescencia/apoptosis.',
          'Diferentes agentes inducen alteraciones estructurales marcadamente distintas, dictando la activación de vías de reparación específicas.'
        ]
      },
      {
        id: 'sec_1_2',
        title: '1.2 Agentes Físicos: Radiación Ultravioleta (UV) vs Radiación Ionizante (IR)',
        content: `La radiación ultravioleta (UVB: 290-320 nm, UVC: 100-290 nm) es absorbida directamente por las bases púricas y pirimidínicas conjugadas del ADN. La excitación fotoquímica provoca la formación de dímeros covalentes entre pirimidinas adyacentes de la misma hebra (ciclobutano CPD y fotoproductos 6-4). Estos dímeros introducen un ángulo de torsión de ~30° que bloquea físicamente a las polimerasas.
Por el contrario, la Radiación Ionizante (Rayos X, rayos gamma, partículas alfa) posee suficiente energía para arrancar electrones directamente de los átomos, generando racimos de ionización. Su efecto es dual: ionización directa del esqueleto desoxirribosa-fosfato y radiólisis del agua intracelular (H2O → •OH + H•), generando roturas bicatenarias (Double-Strand Breaks o DSBs) que fracturan el cromosoma en dos fragmentos independientes.`,
        keyEnzymes: ['Rad51', 'Ku70/Ku80', 'XPC', 'TFIIH', 'DNA-PKcs'],
        diagnosticTip: 'Distingue siempre si el agente físico induce una deformación fotoquímica de bases contiguas (UV → Dímeros → NER) o una rotura física simultánea del esqueleto en ambas hebras (Rayos X → DSB → NHEJ/HR).',
        relatedScenarioNumbers: [1, 7],
        clinicalSignificance: 'La exposición a UVB solar es el principal factor etiológico del carcinoma basocelular y melanoma cutáneo. La radiación ionizante se utiliza en radioterapia oncológica para inducir DSBs letales que colapsan tumores.'
      },
      {
        id: 'sec_1_3',
        title: '1.3 Agentes Químicos Exógenos: Alquilantes e Hidrocarburos Aromáticos',
        content: `Los agentes alquilantes (como las nitrosoureas, el metilmetanosulfonato MMS y el fármaco quimioterápico Temozolomida) son electrófilos que transfieren grupos metilo o etilo a átomos nucleofílicos del ADN. La lesión más citotóxica y mutagénica es la O6-metilguanina (O6-meG), que al replicarse se aparea erróneamente con la timina.
Por otra parte, los Hidrocarburos Aromáticos Policíclicos (HAP), como el Benzo[a]pireno presente en el humo de tabaco y combustión fósil, son procarcinógenos inertes que al ser metabolizados por las oxigenasas hepáticas del citocromo P450 (CYP1A1) se transforman en epóxidos reactivos: (+)anti-benzo[a]pireno diol epóxido (BPDE). El BPDE se une covalentemente al grupo amino exocíclico (N2) de la guanina, generando un aducto voluminoso y desestabilizador de la hélice.`,
        keyEnzymes: ['MGMT', 'Citocromo P450 (CYP1A1)', 'XPC-RAD23B', 'ERCC1-XPF'],
        diagnosticTip: 'Una base pequeña metilada en O6 se repara por reversión directa (MGMT); un hidrocarburo voluminoso unido a la base desestabiliza la hélice completa y exige escisión de nucleótidos (NER).',
        relatedScenarioNumbers: [5, 9],
        clinicalSignificance: 'Los aductos de BPDE generan mutaciones características de transversión G:C → T:A en codones diana del gen supresor tumoral TP53 en pacientes con cáncer de pulmón fumadores.'
      },
      {
        id: 'sec_1_4',
        title: '1.4 Agentes Químicos Endógenos: Especies Reactivas de Oxígeno (ROS) e Hidrólisis',
        content: `El metabolismo celular aeróbico genera en la cadena de transporte de electrones mitocondrial especies reactivas de oxígeno (anión superóxido O2•-, peróxido de hidrógeno H2O2 y radical hidroxilo •OH). El •OH reacciona ávidamente con el C8 de la guanina (la base con menor potencial de ionización), formando 8-oxo-7,8-dihidroguanina (8-oxoG). La 8-oxoG adopta una conformación sin anómala que mimetiza timina y se aparea con adenina durante la replicación (generando transversiones G:C → T:A).
Adicionalmente, en medio acuoso a 37°C, la citosina sufre una desaminación hidrolítica espontánea de su grupo amino en C4 a una tasa de ~100-500 eventos por día por célula humana, transformándose en Uracilo. Como el uracilo se aparea con adenina en lugar de guanina, si no se remueve provocará una transición permanente C:G → T:A.`,
        keyEnzymes: ['OGG1', 'UDG (Uracil DNA Glycosylase)', 'APE1', 'Polimerasa beta'],
        diagnosticTip: 'Las lesiones oxidativas o hidrolíticas individuales alteran la identidad química de una sola base pero NO provocan protuberancias masivas de la hélice. Son el sustrato clásico de la vía BER (Base Excision Repair).',
        relatedScenarioNumbers: [2, 4],
        clinicalSignificance: 'La acumulación de 8-oxoG está íntimamente ligada a la senescencia celular, enfermedades neurodegenerativas (Parkinson, Alzheimer) y envejecimiento vascular.'
      },
      {
        id: 'sec_1_5',
        title: '1.5 Errores Replicativos y Herramientas Biológicas Dirigidas',
        content: `Durante la fase S del ciclo celular, las ADN polimerasas replicativas (Pol delta y Pol epsilon) incorporan nucleótidos a una velocidad de ~50 nt/s. Aunque poseen actividad correctora de pruebas 3'→5' (proofreading), cometen un error residual cada 10^7 bases. Además, en secuencias repetitivas en tándem (microsatélites), la hebra naciente puede resbalar temporalmente (replication slippage), generando bucles de inserción o deleción (indels).
En el ámbito biotecnológico, el sistema bacteriano CRISPR-Cas9 utiliza un ARN guía sintético (sgRNA) para dirigir la endonucleasa Cas9 a una secuencia diana específica contigua a un motivo PAM (5'-NGG-3'). Los dos dominios catalíticos de Cas9 (RuvC y HNH) cortan ambas hebras del ADN a 3 pares de bases del PAM, introduciendo deliberadamente una rotura bicatenaria (DSB) de extremos romos para provocar la intervención de las maquinarias de reparación de la célula huésped.`,
        keyEnzymes: ['Cas9', 'MutS-alfa (MSH2-MSH6)', 'MutL-alfa (MLH1-PMS2)', 'EXO1'],
        diagnosticTip: 'Los errores de apareamiento ocurren exclusivamente en la hebra recién sintetizada durante la replicación; el DSB de CRISPR-Cas9 es una rotura bicatenaria limpia producida por una endonucleasa dirigida.',
        relatedScenarioNumbers: [6, 10]
      }
    ]
  },
  {
    id: 'capitulo_2_lesiones',
    chapterNumber: 2,
    title: 'Catálogo Detallado de Lesiones Moleculares del ADN',
    subtitle: 'Morfología química, geometría espacial, consecuencias estéricas y mutagenicidad',
    badge: 'Patología Molecular',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_2_oxidativo', 'escenario_4_desaminacion', 'escenario_5_alquilante', 'escenario_6_deslizamiento', 'escenario_7_ionizante', 'escenario_8_dsb_g2', 'escenario_9_aducto_tabaco', 'escenario_10_crispr'],
    summary: 'Cada tipo de lesión impone un desafío estereoquímico único a la maquinaria de la célula. Comprender si la alteración es una base químicamente modificada, un aducto voluminoso, un desapareamiento no covalente o una discontinuidad del esqueleto fosfodiéster es el primer paso obligado para resolver cualquier caso.',
    subsections: [
      {
        id: 'sec_2_1',
        title: '2.1 Bases Modificadas Discretas: 8-oxoGuanina y Uracilo',
        content: `Las lesiones discretas no deforman de manera masiva la geometría helicoidal del ADN y el esqueleto de azúcar-fosfato permanece completamente intacto.
- 8-oxo-7,8-dihidroguanina (8-oxoG): La adición de un átomo de oxígeno en el carbono 8 permite que la base gire de su orientación normal anti a una orientación anómala syn. En conformación syn, 8-oxoG establece dos puentes de hidrógeno de tipo Hoogsteen con la adenina entrante (A:8-oxoG). Si la célula replica sin reparar, la siguiente ronda de replicación incorporará una timina frente a la adenina, completando una transversión mutagénica irreversible G:C → T:A.
- Uracilo en ADN: Producido por desaminación oxidativa de citosina o por incorporación errónea accidental de dUTP durante la síntesis. El uracilo empareja canónicamente con adenina. Al duplicarse la célula, lo que era un par C:G se convierte en un par T:A en la progenie.`,
        keyMolecules: ['8-oxo-dGTP', 'dUTP', 'Sitio AP (Apurínico/Apirimidínico)'],
        diagnosticTip: 'Ambas lesiones son retiradas por ADN glucosilasas específicas que reconocen la base individual, volteándola hacia fuera de la hélice (base flipping) e hidrolizando el enlace N-glucosídico.',
        relatedScenarioNumbers: [2, 4]
      },
      {
        id: 'sec_2_2',
        title: '2.2 Adición de Grupos Químicos Alquilos: O6-Metilguanina',
        content: `La metilación del átomo de oxígeno en la posición 6 del anillo de guanina genera O6-metilguanina (O6-meG). Esta modificación altera los átomos donantes y aceptores de puentes de hidrógeno: el grupo metilo bloquea el enlace de hidrógeno canónico con la citosina y favorece el apareamiento ilegítimo con timina (O6-meG : T).
Si no se repara de inmediato, la ADN polimerasa incorpora timina. La vía de reparación de desapareamientos (MMR) detectará el par O6-meG:T en la hebra hija y escindirá la timina recién sintetizada, pero al resintetizar volverá a encontrar la O6-meG en la hebra molde e insertará nuevamente timina. Este ciclo fútil y repetitivo de MMR termina induciendo roturas bicatenarias, bloqueo de horquillas de replicación y apoptosis celular mediada por p53.`,
        keyEnzymes: ['MGMT (O6-metilguanina-ADN metiltransferasa)'],
        diagnosticTip: 'La O6-meG no deforma la hélice lo suficiente para activar NER y su esqueleto no está roto. La célula la repara mediante una proteína de sacrificio que transfiere el grupo metilo directamente a su propia estructura.',
        relatedScenarioNumbers: [5]
      },
      {
        id: 'sec_2_3',
        title: '2.3 Lesiones Voluminosas con Distorsión Helicoidal: CPD, 6-4PP y Aductos BPDE',
        content: `Estas lesiones alteran dramáticamente los parámetros espaciales de la doble hélice del ADN:
- Dímeros de Ciclobutano Pirimidina (CPD): Se forman por cicloadición fotoquímica [2+2] entre los enlaces C5=C6 de dos timinas o citosinas adyacentes de la misma cadena, fijándolas a una distancia de ~1.6 Å (en lugar de los 3.4 Å fisiológicos). Esto genera una angulación rígida de ~30° en el eje del ADN y una pérdida de contacto con el surco mayor.
- Fotoproductos 6-4 pirimidina-pirimidona (6-4PP): Unión covalente entre el C6 de una pirimidina 5' y el C4 de la pirimidina 3' adyacente, generando una distorsión torsional extrema de ~44°.
- Aducto de Benzo[a]pireno diol epóxido (BPDE-N2-dG): El anillo policíclico hidrofóbico aromático voluminoso del carcinógeno se aloja en el surco menor del ADN o se intercala parcialmente, ensanchando la doble hélice y desestabilizando los pares de bases adyacentes.`,
        diagnosticTip: 'Cualquier lesión que desestabilice más de 1-2 pares de bases e impida el paso de la ARN polimerasa o helicasas requiere escisión de un fragmento oligonucleotídico largo (NER).',
        relatedScenarioNumbers: [1, 9]
      },
      {
        id: 'sec_2_4',
        title: '2.4 Errores de Apareamiento (Mismatches) y Bucles Indel de Microsatélites',
        content: `A diferencia de las bases químicamente oxidadas o alquiladas, en un error de apareamiento las bases nitrogenadas son completamente normales en su estructura química individual, pero su emparejamiento entre hebras opuestas es incorrecto:
- Apareamiento erróneo puntual (ej. Guanina emparejada con Timina, G:T): No existen enlaces covalentes anómalos ni roturas de hebra, pero los puentes de hidrógeno son incompatibles con la simetría de Watson-Crick.
- Bucles de inserción/deleción (IDLs): Ocurren por resbalamiento (slippage) de la ADN polimerasa en repeticiones de mononucleótidos o dinucleótidos (ej. (CA)n o (A)n). La hebra molde o la naciente se desalinea temporalmente formando un bucle extrahelical de 1 a varios nucleótidos.`,
        keyEnzymes: ['MutS-alfa (MSH2/MSH6)', 'MutL-alfa (MLH1/PMS2)', 'EXO1'],
        diagnosticTip: 'La maquinaria celular debe saber obligatoriamente cuál de las dos hebras es la errónea (la hebra hija recién copiada) para no cometer el error fatal de eliminar la hebra molde original.',
        relatedScenarioNumbers: [6]
      },
      {
        id: 'sec_2_5',
        title: '2.5 Roturas del Esqueleto Fosfodiéster: Roturas de Doble Hebra (DSB)',
        content: `Las roturas de doble hebra (Double-Strand Breaks, DSB) representan la forma más destructiva y peligrosa de daño genómico. Al romperse simultáneamente los enlaces fosfodiéster de ambas cadenas a una distancia menor de ~10 pares de bases, la continuidad física del cromosoma se pierde por completo.
Los dos cabos cromosómicos resultantes pueden dispersarse en el nucleoplasma, lo que conlleva el riesgo inminente de translocaciones cromosómicas masivas, deleciones gigantescas de megabases, fusión telomérica o muerte celular inmediata.
El destino de la reparación de un DSB depende fundamentalmente de la fase del ciclo celular: si no existe una cromátida hermana idéntica disponible (fase G0 y G1), la célula debe ligar directamente los cabos mediante NHEJ; si se encuentra en fases S o G2, dispone de la cromátida hermana para copiar fielmente la secuencia perdida mediante Recombinación Homóloga (HR).`,
        keyEnzymes: ['Ku70/Ku80', 'DNA-PKcs', 'Artemis', 'Ligasa IV', 'MRN', 'CtIP', 'Rad51', 'BRCA1/BRCA2'],
        diagnosticTip: 'Ante un DSB, la primera pregunta es siempre la fase del ciclo celular: ¿G1 (sin cromátida hermana) o S/G2 (con cromátida hermana)?',
        relatedScenarioNumbers: [7, 8, 10]
      }
    ]
  },
  {
    id: 'capitulo_3_mecanismos',
    chapterNumber: 3,
    title: 'Los 5 Grandes Mecanismos Canónicos de Reparación Celular',
    subtitle: 'Rutas moleculares paso a paso, sustratos específicos, complejos proteicos y resolución',
    badge: 'Mecanismos Canónicos',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_2_oxidativo', 'escenario_4_desaminacion', 'escenario_6_deslizamiento', 'escenario_7_ionizante', 'escenario_8_dsb_g2', 'escenario_9_aducto_tabaco'],
    summary: 'La célula viva utiliza cinco grandes autopistas bioquímicas para preservar su genoma: BER (bases individuales), NER (distorsiones voluminosas), MMR (errores replicativos), NHEJ (DSBs rápidos) y HR (DSBs de alta fidelidad). Cada una posee un conjunto estricto de enzimas y operaciones.',
    subsections: [
      {
        id: 'sec_3_1',
        title: '3.1 BER (Base Excision Repair - Reparación por Escisión de Bases)',
        content: `La vía BER repara lesiones discretas y no voluminosas de bases producidas por oxidación, desaminación espontánea y alquilación menor.
Paso a paso molecular:
1. Reconocimiento y escisión de la base: Una ADN glucosilasa específica (ej. OGG1 para 8-oxoG, UDG/UNG para uracilo) explora el surco menor, voltea la base dañada hacia su bolsillo catalítico e hidroliza el enlace N-glucosídico entre la base y la desoxirribosa, liberando la base libre y generando un sitio AP (apurínico/apirimidínico).
2. Incisión endonucleolítica del esqueleto: La AP endonucleasa 1 (APE1) reconoce el sitio AP e incide el enlace fosfodiéster en el lado 5' de la lesión, generando un extremo 3'-OH libre y un azúcar 5'-desoxirribofosfato (5'-dRP) abásico.
3. Resíntesis y procesamiento de extremos:
   - Vía de parche corto (Short-Patch BER, ~85% de los casos): La ADN Polimerasa beta (Pol beta) inserta un solo nucleótido correcto utilizando su actividad polimerasa y retira el grupo 5'-dRP mediante su actividad liasa intrínseca.
   - Vía de parche largo (Long-Patch BER, ~15%): Si el extremo 5'-dRP está modificado o bloqueado, Pol delta o Pol epsilon sintetizan de 2 a 10 nucleótidos desplazando la hebra naciente en forma de solapa (flap), la cual es recortada por la endonucleasa FEN1.
4. Sellado de la muesca (Ligación): El complejo ADN Ligasa III - XRCC1 (en short-patch) o ADN Ligasa I - PCNA (en long-patch) sella covalentemente el enlace fosfodiéster.`,
        keyEnzymes: ['OGG1', 'UDG / UNG', 'APE1', 'Polimerasa beta', 'Ligasa III / XRCC1', 'FEN1', 'Ligasa I'],
        diagnosticTip: 'Si la lesión es una sola base alterada químicamente y no hay rotura del esqueleto de ADN inicial, la respuesta canónica es siempre BER con su glucosilasa correspondiente.',
        relatedScenarioNumbers: [2, 4],
        clinicalSignificance: 'Deficiencias en OGG1 o MUTYH provocan poliposis adenomatosa y predisposición hereditaria al cáncer colorrectal (poliposis asociada a MUTYH).'
      },
      {
        id: 'sec_3_2',
        title: '3.2 NER (Nucleotide Excision Repair - Reparación por Escisión de Nucleótidos)',
        content: `La vía NER es la principal defensa celular contra lesiones voluminosas que distorsionan significativamente la doble hélice del ADN, como los fotoproductos inducidos por radiación UV y los aductos de carcinógenos químicos (benzo[a]pireno).
Paso a paso molecular:
1. Reconocimiento de la lesión (dos ramas de entrada):
   - GG-NER (Global Genome NER): Opera en todo el genoma silente y activo. El complejo proteico XPC - RAD23B (apoyado por el sensor DDB1-XPE/DDB2) detecta la distorsión helicoidal y la pérdida de apareamiento de bases.
   - TC-NER (Transcription-Coupled NER): Ocurre de forma preferencial y ultrarrápida en las hebras transcritas de genes activos. Cuando la ARN Polimerasa II en elongación choca contra una lesión y se detiene físicamente, recluta a las proteínas CSA y CSB.
2. Apertura de la hélice y verificación: Ambas ramas convergen reclutando al factor de transcripción basal TFIIH, cuyas subunidades helicasas dependientes de ATP (XPB con polaridad 3'→5' y XPD con polaridad 5'→3') desenrollan ~30 pares de bases alrededor de la lesión. La proteína RPA estabiliza la hebra no dañada y XPA verifica químicamente la lesión.
3. Incisión dual asimétrica: Dos endonucleasas específicas cortan la hebra dañada a ambos lados de la lesión:
   - ERCC1 - XPF incide a 20-24 nucleótidos hacia el lado 5'.
   - XPG incide a 5-6 nucleótidos hacia el lado 3'.
   Se libera un fragmento oligonucleotídico monocatenario de 24 a 32 nucleótidos que contiene el dímero o aducto.
4. Resíntesis y ligación: Las ADN polimerasas replicativas de alta fidelidad Pol delta o Pol epsilon, guiadas por el cofactor PCNA y RFC, sintetizan el tramo faltante usando la hebra intacta opuesta como molde. Finalmente, la ADN Ligasa I (o Ligasa III-XRCC1) sella la muesca residual.`,
        keyEnzymes: ['XPC-RAD23B', 'CSB / CSA', 'TFIIH (XPB, XPD)', 'RPA', 'ERCC1-XPF (corte 5\')', 'XPG (corte 3\')', 'Pol delta/epsilon', 'Ligasa I'],
        diagnosticTip: 'A diferencia de BER (que retira solo una base dañada), NER siempre corta la hebra a ambos lados y extirpa un oligonucleótido completo de ~24-32 nucleótidos.',
        relatedScenarioNumbers: [1, 9],
        clinicalSignificance: 'Las mutaciones germinales en genes de NER causan Xeroderma Pigmentosum (hipersensibilidad solar extrema y cáncer cutáneo precoz) y Síndrome de Cockayne (defecto en TC-NER con neurodegeneración precoz sin propensión tumoral).'
      },
      {
        id: 'sec_3_3',
        title: '3.3 MMR (Mismatch Repair - Reparación de Errores de Apareamiento)',
        content: `La vía MMR corrige los nucleótidos mal apareados y los bucles de inserción/deleción (indels) que logran escapar a la actividad correctora 3'→5' de las ADN polimerasas durante la replicación celular. Su función incrementa la fidelidad de la copia de 100 a 1000 veces.
Paso a paso molecular en humanos:
1. Reconocimiento del error:
   - Heterodímero MutS-alfa (MSH2 - MSH6): Reconoce errores puntuales de apareamiento (ej. G:T, A:C) y bucles pequeños de inserción/deleción de 1 o 2 nucleótidos.
   - Heterodímero MutS-beta (MSH2 - MSH3): Reconoce bucles de inserción/deleción más grandes (de 2 a 8 nucleótidos).
2. Reclutamiento del complejo efector y discriminación de hebra: MutS unido al error recluta al heterodímero MutL-alfa (MLH1 - PMS2). La subunidad PMS2 posee actividad endonucleasa latente dependiente de ATP. En eucariotas, la discriminación de la hebra recién sintetizada (que porta el error) depende de discontinuidades preexistentes (como los extremos de los fragmentos de Okazaki en la hebra discontinua o muescas orientadas por el cofactor PCNA cargado asimétricamente).
3. Incisión y escisión direccional: MutL-alfa realiza cortes endonucleolíticos en la hebra hija a uno o ambos lados del error. La exonucleasa 1 (EXO1), estimulada por PCNA y MutS-alfa, degrada la hebra hija con polaridad 5'→3' desde la muesca hasta sobrepasar la posición del desapareamiento, dejando una brecha monocatenaria estabilizada por RPA.
4. Resíntesis y sellado: La ADN polimerasa delta rellena la brecha utilizando la hebra parental intacta como molde, y la ADN Ligasa I sella covalentemente la muesca final.`,
        keyEnzymes: ['MSH2', 'MSH6 (MutS-alfa)', 'MLH1', 'PMS2 (MutL-alfa)', 'EXO1', 'PCNA', 'Polimerasa delta', 'Ligasa I'],
        diagnosticTip: 'El reto central de MMR es la discriminación de hebras: si cortara al azar la hebra parental en lugar de la hija recién sintetizada, fijaría la mutación de forma irreversible.',
        relatedScenarioNumbers: [6],
        clinicalSignificance: 'La pérdida de función hereditaria de MSH2, MLH1, MSH6 o PMS2 produce el Síndrome de Lynch (cáncer de colon y endometrio hereditario no polipósico), caracterizado molecularmente por Inestabilidad de Microsatélites (MSI-H).'
      },
      {
        id: 'sec_3_4',
        title: '3.4 NHEJ (Non-Homologous End Joining - Unión de Extremos No Homólogos)',
        content: `NHEJ es la vía de reparación de roturas de doble hebra (DSB) predominante en células de mamífero durante todo el ciclo celular, y la única disponible durante las fases G0 y G1 (cuando no existe una cromátida hermana disponible).
Paso a paso molecular:
1. Reconocimiento y protección de extremos: El heterodímero en forma de anillo Ku70 / Ku80 se desliza de inmediato sobre los dos extremos bicatenarios rotos del ADN, protegiéndolos de la degradación incontrolada por nucleasas no específicas.
2. Reclutamiento de la subunidad catalítica: El complejo Ku unido al ADN recluta a la serina/treonina cinasa DNA-PKcs (DNA-dependent Protein Kinase catalytic subunit), formando el holoenzima activo DNA-PK. Las moléculas de DNA-PKcs de ambos cabos interactúan a través de la brecha cromosómica, manteniendo los dos extremos rotos en estrecha proximidad física (sinapsis).
3. Procesamiento enzimático de extremos: Los DSBs fisiológicos o inducidos por radiación raramente poseen extremos compatibles y fosforilados para ligar directamente. La cinasa fosforila y activa a la endo/exonucleasa Artemis. Artemis corta colas monocatenarias salientes y abre estructuras en horquilla (hairpins). Polimerasas de la familia X (Pol mu y Pol lambda) rellenan pequeños huecos si es necesario.
4. Ligación de los extremos: Un complejo proteico especializado compuesto por ADN Ligasa IV, su cofactor estabilizador XRCC4 y la proteína XLF (Cernunnos) alinea y sella covalentemente los dos extremos bicatenarios.
Propensión a errores: Al resecionarse bases dañadas o incompatibles, NHEJ con frecuencia pierde o gana de 1 a varios nucleótidos en el punto de unión. Es un mecanismo propenso a mutaciones (error-prone), pero prioriza la restitución de la continuidad del cromosoma frente a la muerte celular por fractura cariotípica.`,
        keyEnzymes: ['Ku70 / Ku80', 'DNA-PKcs', 'Artemis', 'Ligasa IV', 'XRCC4', 'XLF (Cernunnos)', 'Polimerasa mu / lambda'],
        diagnosticTip: 'Si una célula sufre un DSB y se encuentra en fase G1 (o en células quiescentes diferenciadas como neuronas), la única vía disponible para salvar el cromosoma es NHEJ.',
        relatedScenarioNumbers: [7, 10],
        clinicalSignificance: 'NHEJ es también la maquinaria esencial para la recombinación V(D)J en linfocitos B y T. Mutaciones en Artemis o Ligasa IV causan Inmunodeficiencia Combinada Severa (SCID) con radiosensibilidad.'
      },
      {
        id: 'sec_3_5',
        title: '3.5 HR / HDR (Homologous Recombination - Recombinación Homóloga)',
        content: `La Recombinación Homóloga (HR) es una vía de reparación de roturas bicatenarias (DSB) de ultra-alta fidelidad (error-free) que utiliza la secuencia de la cromátida hermana idéntica como molde para restaurar exactamente la información perdida. Por esta razón, opera exclusivamente durante las fases S tardía y G2 del ciclo celular.
Paso a paso molecular:
1. Detección y señalización sensor: El complejo sensor MRN (Mre11 - Rad50 - Nbs1) reconoce de inmediato los extremos bicatenarios rotos y recluta y activa a la cinasa maestra ATM, que fosforila a la histona H2AX (generando focos gamma-H2AX).
2. Resección 5'→3' de extremos: Para iniciar la recombinación, los extremos bicatenarios deben resecionarse. El complejo MRN junto con la proteína CtIP inicia una incisión endonucleolítica corta. Luego, la exonucleasa EXO1 o la helicasa BLM en complejo con DNA2 catalizan una resección extensa en dirección 5'→3', degradando las hebras 5' y generando largas colas monocatenarias salientes con extremos 3'-OH (3'-ssDNA overhangs).
3. Recubrimiento por RPA y mediación por BRCA1/BRCA2: Las colas 3'-ssDNA son rápidamente recubiertas por la proteína de unión a monocatenario RPA para evitar la formación de estructuras secundarias. El supresor tumoral BRCA1, actuando en complejo con PALB2 y BRCA2, media el desplazamiento coordinado de RPA y carga selectivamente múltiples monómeros de la recombinasa Rad51 sobre el 3'-ssDNA.
4. Formación del nucleofilamento presináptico y búsqueda de homología: Los monómeros de Rad51 forman un filamento helicoidal activo sobre el ssDNA. Este nucleofilamento escanea el genoma nuclear hasta localizar la secuencia homóloga perfecta en la cromátida hermana emparejada.
5. Invasión de hebra y bucle de desplazamiento (D-loop): El extremo 3'-ssDNA con Rad51 invade la doble hélice de la cromátida hermana homóloga, separando sus cadenas y formando una estructura de tres hebras denominada D-loop (displacement loop).
6. Extensión replicativa y resolución: El extremo 3'-OH invasor sirve como cebador para que una ADN polimerasa copie con absoluta precisión la secuencia de la cromátida hermana. La estructura puede resolverse mediante síntesis dependiente de apareamiento de hebras (SDSA) o mediante la formación y resolución de dobles uniones de Holliday por resolvasas (como el complejo GEN1 o BRCAl-BLM), restaurando el cromosoma sin ninguna pérdida ni ganancia de nucleótidos.`,
        keyEnzymes: ['Complejo MRN (Mre11-Rad50-Nbs1)', 'ATM', 'CtIP', 'EXO1 / BLM-DNA2', 'RPA', 'BRCA1', 'BRCA2', 'PALB2', 'Rad51'],
        diagnosticTip: 'Para que HR sea viable son indispensables tres condiciones: 1) Presencia de una cromátida hermana (fases S/G2); 2) Resección activa 5\'→3\' que genere colas 3\'-ssDNA; 3) Funcionalidad intacta de BRCA1, BRCA2 y Rad51.',
        relatedScenarioNumbers: [8, 10],
        clinicalSignificance: 'Las mutaciones germinales en BRCA1 o BRCA2 provocan deficiencia en HR (recombination deficiency o HRD), base patogénica del síndrome de cáncer de mama y ovario hereditario y diana de la terapia de letalidad sintética con inhibidores de PARP.'
      }
    ]
  },
  {
    id: 'capitulo_4_vias_especiales',
    chapterNumber: 4,
    title: 'Vías Especializadas, Directas y Evolutivas',
    subtitle: 'Reversión directa por enzimas suicidas, fotorreactivación y control en edición CRISPR-Cas9',
    badge: 'Vías Especiales & CRISPR',
    relatedScenarioIds: ['escenario_3_fotoliasa', 'escenario_5_alquilante', 'escenario_10_crispr'],
    summary: 'No todas las reparaciones requieren el complejo corte del esqueleto de ADN. La naturaleza diseñó enzimas de reversión directa que deshacen el enlace químico anómalo en un solo paso, o aprovechan la luz solar, mientras que la biotecnología moderna aprovecha estas rutas en CRISPR-Cas9.',
    subsections: [
      {
        id: 'sec_4_1',
        title: '4.1 Reversión Directa por Enzimas Suicidas: MGMT',
        content: `A diferencia de BER, NER o MMR, la reversión directa no requiere romper el esqueleto fosfodiéster de la doble hélice, ni extirpar nucleótidos, ni resintetizar ADN con polimerasas ni ligar con ligasas.
La enzima O6-metilguanina-ADN metiltransferasa (MGMT) es una proteína especializada que repara la lesión mutagénica O6-metilguanina (inducida por agentes alquilantes como la Temozolomida) mediante un mecanismo estequiométrico singular:
1. Reconocimiento: MGMT reconoce la O6-meG y voltea la base metilada hacia su centro activo.
2. Transferencia catalítica: Un residuo catalítico de cisteína conservado en la posición 145 (Cys-145) ataca como aceptor nucleofílico al grupo metilo (-CH3) de la guanina, transfiriéndolo irreversiblemente hacia el grupo tiol de su propia cisteína interna (formando S-metilcisteína).
3. Suicidio enzimático y degradación: La adquisición del grupo metilo en la Cys-145 induce un cambio conformacional drástico en la proteína MGMT que la inactiva permanentemente. Cada molécula de MGMT puede actuar una sola vez en su vida. La proteína "suicida" metilada es ubiquitinada y degradada en el proteasoma 26S.
Por tanto, la capacidad celular de resistir a agentes alquilantes depende enteramente del número absoluto de moléculas de MGMT preexistentes o de la tasa de síntesis de novo.`,
        keyEnzymes: ['MGMT (O6-alquilguanina-ADN alquiltransferasa, Cys-145)'],
        diagnosticTip: 'En el laboratorio, si aplicas una perturbación de inhibición de MGMT (ej. con O6-bencilguanina), la célula se vuelve extraordinariamente sensible a la muerte celular por temozolomida.',
        relatedScenarioNumbers: [5],
        clinicalSignificance: 'En neurooncología, la metilación epigenética del promotor del gen MGMT silencia su expresión en células de glioblastoma multiforme. Los pacientes con promotor metilado carecen de MGMT y responden mucho mejor a la quimioterapia con Temozolomida.'
      },
      {
        id: 'sec_4_2',
        title: '4.2 Fotorreactivación por Fotoliasa: Evolución y Pérdida en Mamíferos',
        content: `La fotorreactivación enzimática es el mecanismo de reparación del ADN más simple y energéticamente eficiente que existe en la naturaleza:
Mecanismo biofísico:
La enzima ADN fotoliasa contiene dos cromóforos conjugados: un cromóforo antena que capta la luz (generalmente meteniltetrahidrofolato MTHF o 8-hidroxi-5-deazaflavina 8-HDF) y un cofactor catalítico en estado reducido (FADH-).
1. La fotoliasa se une en la oscuridad con gran afinidad al dímero de ciclobutano (CPD).
2. Al absorber un fotón en el rango de luz visible azul o cercano al ultravioleta (300-500 nm), el cromóforo antena transfiere energía de excitación al FADH-.
3. El FADH- activado transfiere un electrón al dímero de timina, generando un radical aniónico inestable.
4. Este radical cataliza la ruptura inmediata de los dos enlaces carbono-carbono del anillo de ciclobutano en una escala de picosegundos, restaurando las dos timinas monoméricas intactas.
5. El electrón regresa instantáneamente a la flavina para regenerar el FADH- catalíticamente activo, y la enzima se disocia.
Perspectiva evolutiva:
La fotoliasa está presente en bacterias (como Escherichia coli), arqueas, hongos, plantas, invertebrados y vertebrados como aves, peces y marsupiales. Sin embargo, los mamíferos placentarios (euterios, incluida la especie humana) perdieron por completo los genes de fotoliasa activa durante el Mesozoico. La hipótesis evolutiva aceptada propone un "cuello de botella nocturno": los primeros mamíferos vivían en hábitos nocturnos para eludir a los dinosaurios diurnos, lo que llevó a la pérdida de la presión selectiva para mantener enzimas dependientes de luz solar visible. En su lugar, los humanos dependemos exclusivamente de la vía NER para reparar dímeros UV.`,
        keyEnzymes: ['ADN Fotoliasa (PhrB)', 'Cofactores: FADH- y MTHF/8-HDF'],
        diagnosticTip: 'En bacterias expuestas a radiación UV, la reparación canónica y óptima es la fotoliasa en presencia de luz blanca. Si el caso ocurre en humanos, la fotoliasa es biológicamente imposible.',
        relatedScenarioNumbers: [3]
      },
      {
        id: 'sec_4_3',
        title: '4.3 CRISPR-Cas9 y el Control de Destino: NHEJ vs HDR',
        content: `La tecnología de edición génica CRISPR-Cas9 explota deliberadamente los mecanismos celulares endógenos de reparación de roturas de doble hebra:
1. Corte dirigido: La nucleasa Cas9, guiada por un ARN guía de 20 nucleótidos (sgRNA), genera un corte bicatenario limpio (DSB de extremos romos) a 3 pares de bases hacia 5' del motivo PAM (5'-NGG-3') en el locus diana genómico.
2. La bifurcación celular de reparación:
   - Estrategia Knock-Out (Disrupción Génica vía NHEJ): En ausencia de un molde exógeno de reparación o en células en fase G1, la célula repara el corte mediante NHEJ. Como NHEJ es propenso a errores al ligar extremos, introduce pequeñas inserciones o deleciones (indels de 1 a decenas de pb). Al ocurrir en una región codificante, estos indels alteran el marco de lectura (frameshift), generando codones de parada prematuros que inactivan el gen por completo.
   - Estrategia Knock-In (Inserción / Corrección Precisa vía HDR): Si los investigadores co-introducen junto con Cas9 un molde de ADN exógeno (un oligonucleótido monocatenario ssODN o un plásmido donor bicatenario) con brazos de homología que flanquean el corte, y la célula se encuentra en fases S o G2, la maquinaria de HDR utilizará el molde artificial para incorporar con precisión absoluta la secuencia deseada o corregir una mutación puntual puntual.`,
        keyEnzymes: ['Cas9', 'sgRNA', 'Ku70/Ku80 (vía NHEJ)', 'Rad51 / BRCA2 (vía HDR)'],
        diagnosticTip: 'Para lograr edición precisa (knock-in) es imprescindible sincronizar las células en fases S/G2 o inhibir transitoriamente los componentes de NHEJ (como DNA-PKcs o Ligasa IV).',
        relatedScenarioNumbers: [10],
        clinicalSignificance: 'Las terapias génicas aprobadas con CRISPR (como Exa-cel para anemia de células falciformes) utilizan cortes dirigidos para alterar secuencias reguladoras mediante indels o integrar secuencias terapéuticas.'
      }
    ]
  },
  {
    id: 'capitulo_5_algoritmo',
    chapterNumber: 5,
    title: 'Guía y Algoritmo de Decisión Diagnóstica Paso a Paso',
    subtitle: 'El árbol lógico de 4 preguntas para resolver cualquier escenario de daño en el laboratorio',
    badge: 'Algoritmo Diagnóstico',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_2_oxidativo', 'escenario_3_fotoliasa', 'escenario_4_desaminacion', 'escenario_5_alquilante', 'escenario_6_deslizamiento', 'escenario_7_ionizante', 'escenario_8_dsb_g2', 'escenario_9_aducto_tabaco', 'escenario_10_crispr'],
    summary: 'Para resolver con éxito cada uno de los 10 problemas del laboratorio, nunca intentes adivinar el mecanismo al azar. Sigue el árbol de decisión metódico de 4 preguntas jerárquicas basado en la estructura biofísica del daño.',
    subsections: [
      {
        id: 'sec_5_1',
        title: '5.1 Las 4 Preguntas Clave del Árbol de Decisión Molecular',
        content: `Sigue siempre esta secuencia rigurosa de razonamiento:
1. PREGUNTA 1: ¿Están fracturadas AMBAS hebras del esqueleto fosfodiéster (DSB)?
   - SÍ → Es una Rotura de Doble Hebra. Pasa inmediatamente a evaluar el ciclo celular:
     * Si la célula está en fase G1 (o G0): NO hay cromátida hermana. La única vía viable es NHEJ (Ku70/80, DNA-PKcs, Artemis, Ligasa IV).
     * Si la célula está en fase S tardía o G2: SÍ hay cromátida hermana idéntica. La vía de elección y alta fidelidad es HR / HDR (MRN, CtIP, RPA, BRCA1/2, Rad51).
   - NO → El esqueleto de al menos una hebra está continuo. Pasa a la Pregunta 2.
2. PREGUNTA 2: ¿Existe una distorsión geométrica voluminosa de la doble hélice (>30° de curvatura o bloqueo de ARN Pol II)?
   - SÍ → La lesión deforma el diámetro o surco de la hélice (ej. Dímero de timina por UV, o Aducto voluminoso de Benzo[a]pireno). Las glucosilasas de BER no caben en la distorsión. La vía canónica es NER (Escisión de Nucleótidos): GG-NER si ocurre en genoma global (XPC), o TC-NER si detiene la transcripción (CSB/ARN Pol II), extirpando un oligonucleótido de 24-32 nt con ERCC1-XPF y XPG.
   - NO → Pasa a la Pregunta 3.
3. PREGUNTA 3: ¿Se trata de un error post-replicativo con bases químicamente normales pero desapareadas o bucles de microsatélites?
   - SÍ → Ocurrió durante la replicación celular en la hebra hija recién copiada (ej. par G:T o bucle por resbalamiento de la polimerasa). La vía de elección es MMR (Mismatch Repair: MutS-alfa, MutL-alfa, discriminación de hebra hija, EXO1 y Pol delta).
   - NO → Pasa a la Pregunta 4.
4. PREGUNTA 4: ¿Es una base químicamente alterada en su estructura molecular individual?
   - Si es una O6-metilguanina generada por alquilantes → La vía canónica es Reversión Directa por MGMT (enzima suicida que transfiere el metilo a Cys-145).
   - Si es una base oxidada (8-oxoG) o un uracilo por desaminación espontánea → La vía canónica es BER (Base Excision Repair), usando la glucosilasa específica (OGG1 para 8-oxoG, UDG para uracilo), seguida de APE1, Pol beta y Ligasa.
   - Si es un procariota (E. coli) expuesto a luz visible → Fotorreactivación por Fotoliasa (dependiente de fotones y FADH-).`,
        diagnosticTip: 'Memoriza las 4 preguntas: 1) ¿DSB ambas hebras? 2) ¿Distorsión voluminosa de hélice? 3) ¿Error de apareamiento replicativo? 4) ¿Base química individual?',
        keyPoints: [
          'DSB + Fase G1 = NHEJ (rápido, propenso a indels).',
          'DSB + Fase S/G2 = HR (fiel, requiere molde homólogo).',
          'Distorsión helicoidal (UV, benzopireno) = NER (GG-NER / TC-NER).',
          'Base modificada discreta (8-oxoG, uracilo) = BER (glucosilasa + APE1 + Pol beta).',
          'Desapareamiento o bucle de microsatélite = MMR (MutS + MutL + EXO1).',
          'O6-metilguanina = MGMT (reversión directa suicida).',
          'Dímero UV en bacteria + luz visible = Fotoliasa.'
        ]
      },
      {
        id: 'sec_5_2',
        title: '5.2 Tabla de Correspondencia: Solución de los 10 Casos del Laboratorio',
        content: `Utiliza esta tabla comparativa para cotejar tu razonamiento en cada escenario del laboratorio:

• CASO #1 (Exposición solar y distorsión helicoidal en humanos):
  - Daño: UVB solar.
  - Lesión: Dímero de ciclobutano de timina (CPD / 6-4PP).
  - Vía correcta: NER (Nucleotide Excision Repair: XPC, TFIIH, ERCC1-XPF, XPG, Pol delta/epsilon, Ligasa I).
  - Por qué fallan otras: BER no acomoda el dímero en sus glucosilasas; los mamíferos placentarios carecen de fotoliasa.

• CASO #2 (Estrés oxidativo mitocondrial):
  - Daño: ROS metabólicos (radical hidroxilo).
  - Lesión: 8-oxoGuanina (8-oxoG).
  - Vía correcta: BER (Base Excision Repair: Glucosilasa OGG1, APE1, Pol beta, Ligasa III-XRCC1).
  - Por qué fallan otras: La hélice no está distorsionada para activar NER; no hay rotura bicatenaria.

• CASO #3 (Fotorreactivación bacteriana en E. coli):
  - Daño: Radiación UV en procariota.
  - Lesión: Dímero de pirimidinas.
  - Vía correcta: Fotorreactivación por Fotoliasa (PhrB con FADH- y luz visible 300-500 nm).
  - Por qué fallan otras: Es la vía más eficiente y directa en bacterias; no requiere gastar energía en cortar oligonucleótidos.

• CASO #4 (Desaminación espontánea a 37°C):
  - Daño: Ataque hidrolítico fisiológico.
  - Lesión: Uracilo en ADN (proveniente de citosina desaminada).
  - Vía correcta: BER (Glucosilasa Uracil-DNA Glycosylase UDG/UNG, APE1, Pol beta, Ligasa I/III).
  - Por qué fallan otras: UDG reconoce específicamente el uracilo; NER es innecesariamente costoso.

• CASO #5 (Agente alquilante y Temozolomida):
  - Daño: Fármaco alquilante en glioblastoma.
  - Lesión: O6-metilguanina.
  - Vía correcta: Reversión Directa por MGMT (transferencia a Cys-145).
  - Por qué fallan otras: Si interviene MMR, provoca ciclos fútiles de corte y muerte celular apoptótica.

• CASO #6 (Deslizamiento replicativo en microsatélites):
  - Daño: Error de la polimerasa en repeticiones de dinucleótidos.
  - Lesión: Desapareamiento de bases y bucles de inserción/deleción (IDL).
  - Vía correcta: MMR (Mismatch Repair: MutS-alfa MSH2/6, MutL-alfa MLH1/PMS2, EXO1, Pol delta, Ligasa I).
  - Por qué fallan otras: Las bases no están químicamente rotas; BER y NER no pueden distinguir la hebra hija de la molde.

• CASO #7 (Radiación ionizante en fase G1):
  - Daño: Rayos X / gamma.
  - Lesión: Rotura de doble hebra (DSB) en célula que no ha duplicado su ADN.
  - Vía correcta: NHEJ (Ku70/80, DNA-PKcs, Artemis, Complejo Ligasa IV-XRCC4-XLF).
  - Por qué fallan otras: HR es inviable porque NO existe cromátida hermana en fase G1.

• CASO #8 (Rotura bicatenaria en fase S/G2 con cromátida hermana):
  - Daño: DSB durante o tras la replicación.
  - Lesión: Fractura cromosómica con cromátida idéntica al lado.
  - Vía correcta: HR (Recombinación Homóloga: MRN, CtIP, RPA, BRCA1, BRCA2, Rad51, síntesis fiel).
  - Por qué fallan otras: Aunque NHEJ podría actuar, causaría mutaciones innecesarias; la célula prefiere la fidelidad de HR.

• CASO #9 (Aducto voluminoso de benzo[a]pireno por tabaco):
  - Daño: Metabolito reactivo BPDE en epitelio bronquial.
  - Lesión: Aducto covalente voluminoso en N2 de la guanina con distorsión helicoidal.
  - Vía correcta: NER (XPC-RAD23B, TFIIH, ERCC1-XPF, XPG, Pol delta/epsilon, Ligasa I).
  - Por qué fallan otras: El grupo policíclico hidrocarburo es demasiado grande para caber en una glucosilasa de BER.

• CASO #10 (Edición génica con CRISPR-Cas9 y elección de vía):
  - Daño: Endonucleasa Cas9 guiada por sgRNA.
  - Lesión: DSB romo a 3 pb del PAM.
  - Vía correcta: Si se busca Knock-out = NHEJ; si se provee molde donor en fase S/G2 para Knock-in = HDR.
  - Por qué fallan otras: Es una competencia cinética entre la rapidez de Ku (NHEJ) y la resección para Rad51 (HDR).`,
        relatedScenarioNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    ]
  },
  {
    id: 'capitulo_6_patologia',
    chapterNumber: 6,
    title: 'Patología Humana, Síndromes Genéticos y Farmacología Molecular',
    subtitle: 'Correlaciones clínicas: Xeroderma, Síndrome de Lynch, mutaciones BRCA y Letalidad Sintética',
    badge: 'Clínica & Fármacos',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_5_alquilante', 'escenario_6_deslizamiento', 'escenario_7_ionizante', 'escenario_8_dsb_g2', 'escenario_9_aducto_tabaco'],
    summary: 'Los defectos genéticos o farmacológicos en las vías de reparación del ADN son la causa directa de síndromes de inestabilidad genómica y cáncer hereditario, pero también ofrecen la mayor oportunidad para la terapia dirigida contra el cáncer.',
    subsections: [
      {
        id: 'sec_6_1',
        title: '6.1 Defectos en NER: Xeroderma Pigmentosum y Síndrome de Cockayne',
        content: `Las mutaciones en los genes de NER ejemplifican la diferencia funcional entre la vigilancia global del genoma y el acoplamiento transcripcional:
- Xeroderma Pigmentosum (XP): Causado por mutaciones en cualquiera de los 7 genes XPA hasta XPG (ej. XPC en reconocimiento global o ERCC1-XPF en incisión). Los pacientes presentan una hipersensibilidad solar extrema con quemaduras graves tras mínima exposición y un incremento de más de 2000 veces en la incidencia de carcinomas basocelulares, escamocelulares y melanomas antes de los 10 años de edad.
- Síndrome de Cockayne (CS): Causado por mutaciones en los genes CSA (ERCC8) o CSB (ERCC6), que intervienen exclusivamente en la rama de transcripción acoplada (TC-NER). Las ARN polimerasas bloqueadas por lesiones en genes transcritos no pueden reanudarse, provocando la muerte celular por apoptosis de células activas. Los pacientes sufren microcefalia, retraso grave del neurodesarrollo, degeneración retiniana y fenotipo de envejecimiento prematuro caquéctico, pero curiosamente NO presentan mayor incidencia de cáncer de piel (porque las células dañadas mueren en lugar de mutar).`,
        relatedScenarioNumbers: [1, 9],
        clinicalSignificance: 'Diagnóstico diferencial clave en genética médica entre defectos globales mutagénicos (XP) y defectos transcripcionales proapoptóticos (CS).'
      },
      {
        id: 'sec_6_2',
        title: '6.2 Defectos en MMR: Síndrome de Lynch e Inestabilidad de Microsatélites (MSI-H)',
        content: `El Síndrome de Lynch (antiguamente llamado Cáncer Colorrectal Hereditario No Polipósico o HNPCC) se hereda de forma autosómica dominante por mutaciones germinales en MSH2, MLH1, MSH6 o PMS2.
Al perderse el alelo normal en una célula somática (pérdida de heterocigosidad), la célula pierde la capacidad de reparar errores de apareamiento y resbalamientos en microsatélites. Como consecuencia, las repeticiones de secuencias mononucleotídicas (como Poli-A) acumulan inserciones y deleciones aberrantes por todo el genoma, un fenómeno denominado molecularmente Inestabilidad de Microsatélites de Alto Grado (MSI-H).
Impacto clínico e inmunoterapia: Los tumores MSI-H generan miles de proteínas truncadas anómalas (neoantígenos frameshift) que son reconocidas por el sistema inmunitario. Por ello, los tumores con deficiencia en MMR están intensamente infiltrados por linfocitos T citotóxicos y muestran una respuesta clínica espectacular a los inhibidores de puntos de control inmunitario (anti-PD-1 como Pembrolizumab).`,
        relatedScenarioNumbers: [6],
        clinicalSignificance: 'La detección de MSI-H por PCR o pérdida de expresión de MSH2/MLH1 por inmunohistoquímica es de obligada evaluación en todo paciente con cáncer colorrectal o de endometrio.'
      },
      {
        id: 'sec_6_3',
        title: '6.3 Mutaciones en BRCA1/2 y el Principio de Letalidad Sintética con Inhibidores de PARP',
        content: `La letalidad sintética es uno de los conceptos terapéuticos más revolucionarios de la oncología molecular contemporánea:
Concepto biológico:
Dos genes son sintéticamente letales si la mutación o inhibición de cualquiera de ellos por separado es compatible con la vida celular, pero la deficiencia simultánea de ambos conduce indefectiblemente a la muerte celular.
Mecanismo de acción:
1. Las células normales disponen de dos vías paralelas para reparar daños: la vía PARP1 (que repara decenas de miles de roturas de hebra simple o SSB basales) y la vía de Recombinación Homóloga HR dependiente de BRCA1 y BRCA2 (que repara roturas de doble hebra DSB).
2. Los pacientes portadores de mutaciones germinales en BRCA1 o BRCA2 desarrollan tumores de mama, ovario o próstata que han perdido la función de HR (tumores HRD o "BRCA-deficientes").
3. Si tratamos a este paciente con un inhibidor farmacológico de PARP (como Olaparib, Niraparib o Talazoparib), el fármaco atrapa a PARP1 sobre las roturas de hebra simple (SSB) del ADN.
4. Cuando la horquilla de replicación avanza y choca contra una SSB bloqueada por PARP, la horquilla colapsa inmediatamente, convirtiendo la rotura simple en una rotura de doble hebra (DSB).
5. Las células sanas del organismo, que conservan un alelo BRCA funcional, reparan estos DSBs fielmente mediante Recombinación Homóloga (HR) y sobreviven.
6. En cambio, las células tumorales carecen de BRCA funcional y no pueden reparar los DSBs por HR. Intentan repararlos mediante NHEJ aberrante, acumulando catástrofes cromosómicas y muriendo masivamente de forma selectiva.`,
        keyEnzymes: ['PARP1', 'BRCA1', 'BRCA2', 'Rad51'],
        relatedScenarioNumbers: [8],
        clinicalSignificance: 'Los inhibidores de PARP han transformado el tratamiento del cáncer de ovario seroso de alto grado y cáncer de mama triple negativo con mutación en BRCA1/2.'
      },
      {
        id: 'sec_6_4',
        title: '6.4 Epigenética de MGMT y Sensibilidad a Temozolomida en Glioblastoma',
        content: `El glioblastoma multiforme es el tumor cerebral primario más agresivo del adulto. Su tratamiento estándar incluye radioterapia combinada con el agente alquilante Temozolomida (TMZ).
La Temozolomida introduce grupos metilo en el ADN, siendo la O6-metilguanina la lesión más letal. Si la célula tumoral expresa la enzima MGMT, esta repara de inmediato la O6-meG, otorgando resistencia total a la quimioterapia.
Sin embargo, en aproximadamente el 45% de los pacientes, el promotor del gen MGMT sufre una hipermetilación epigenética de sus islas CpG. Esta hipermetilación silencia la transcripción del gen, haciendo que las células tumorales carezcan de MGMT. Al recibir Temozolomida, las células no pueden retirar la O6-meG, la cual genera ciclos fútiles de MMR, fracturas cromosómicas y muerte tumoral. Por ello, la determinación del estado de metilación del promotor de MGMT es un biomarcador predictivo obligado para el pronóstico y respuesta terapéutica.`,
        keyEnzymes: ['MGMT', 'DNA Metiltransferasas (DNMT)'],
        relatedScenarioNumbers: [5]
      }
    ]
  },
  {
    id: 'capitulo_7_glosario',
    chapterNumber: 7,
    title: 'Glosario Técnico de Operaciones Moleculares y Enzimas del Laboratorio',
    subtitle: 'Fichas rápidas de consulta sobre las herramientas y catalizadores que debes seleccionar',
    badge: 'Fichas Enzimáticas',
    relatedScenarioIds: ['escenario_1_uv', 'escenario_2_oxidativo', 'escenario_3_fotoliasa', 'escenario_4_desaminacion', 'escenario_5_alquilante', 'escenario_6_deslizamiento', 'escenario_7_ionizante', 'escenario_8_dsb_g2', 'escenario_9_aducto_tabaco', 'escenario_10_crispr'],
    summary: 'Diccionario de referencia rápida con las operaciones moleculares clave y las enzimas que intervienen en cada paso de las simulaciones del laboratorio.',
    subsections: [
      {
        id: 'sec_7_1',
        title: '7.1 Las 15 Operaciones Moleculares del Laboratorio',
        content: `En la Etapa 3 de cada caso debes seleccionar las operaciones moleculares exactas que componen la estrategia de reparación:
1. Reconocer distorsión helicoidal: Detección de ángulos anormales (~30°) en la hélice provocados por dímeros UV o aductos voluminosos (vía NER).
2. Reconocer base modificada individual: Volteo de una base químicamente dañada (8-oxoG, Uracilo) hacia el bolsillo de una glucosilasa (vía BER).
3. Reconocer error de apareamiento: Identificación de puentes de H no canónicos o bucles de microsatélites por MutS-alfa (vía MMR).
4. Reconocer extremos bicatenarios rotos: Captura de los dos cabos cromosómicos libres de un DSB por Ku70/80 (vía NHEJ) o el complejo MRN (vía HR).
5. Eliminar base dañada (enlace N-glucosídico): Hidrólisis específica de la base nitrogenada dejando un sitio abásico AP intacto en su esqueleto (Glucosilasas en BER).
6. Incidir el esqueleto en sitio AP: Corte endonucleolítico en el lado 5' del azúcar abásico para liberar un extremo 3'-OH iniciador (APE1 en BER).
7. Escindir oligonucleótido (~24-32 nt): Doble incisión asimétrica a ambos lados de una distorsión para liberar un fragmento largo (ERCC1-XPF y XPG en NER).
8. Discriminar hebra recién sintetizada: Identificación de la hebra hija portadora del error mediante muescas o PCNA para no mutar la hebra parental (vía MMR).
9. Reversión directa sin corte: Transferencia estequiométrica del grupo metilo a la propia cisteína de la enzima sin romper fosfodiéster (MGMT).
10. Fotorreactivación por luz visible: Ruptura catalítica del anillo ciclobutano mediante electrones activados por luz azul visible (Fotoliasa en bacterias).
11. Sintetizar ADN complementario: Resíntesis de la brecha utilizando la hebra opuesta como molde (Polimerasas replicativas o Pol beta).
12. Utilizar molde homólogo (cromátida hermana): Invasión de hebra idéntica en fase S/G2 para copia libre de error (vía HR).
13. Procesar y ligar extremos no compatibles: Corte de salientes por Artemis y sellado bicatenario por Ligasa IV (vía NHEJ).
14. Ligar muesca (nick): Cierre covalente final del enlace fosfodiéster entre un 3'-OH y un 5'-fosfato (ADN Ligasas I o III).
15. Detener ciclo celular: Activación de puntos de control (checkpoints p53/ATM/ATR) para pausar la replicación mientras dura la reparación.`,
        keyPoints: [
          'No todas las operaciones son compatibles con todos los mecanismos.',
          'Seleccionar operaciones innecesarias reduce la precisión científica en la evaluación del laboratorio.'
        ]
      },
      {
        id: 'sec_7_2',
        title: '7.2 Catálogo Maestro de Enzimas y Complejos',
        content: `• OGG1: 8-oxoguanina ADN glucosilasa. Hidroliza 8-oxoG en BER.
• UDG / UNG: Uracilo ADN glucosilasa. Retira uracilo originado por desaminación en BER.
• APE1: AP endonucleasa 1. Incide en 5' de sitios abásicos.
• Polimerasa beta: Polimerasa nuclear especializada de baja procesividad con actividad dRP liasa en BER.
• XPC-RAD23B: Sensor principal de distorsión helicoidal en GG-NER.
• TFIIH (XPB, XPD): Complejo con actividad helicasa dual que abre 30 pb alrededor de lesiones voluminosas en NER.
• ERCC1-XPF: Endonucleasa que corta a 5' de la distorsión en NER.
• XPG: Endonucleasa que corta a 3' de la distorsión en NER.
• MSH2-MSH6 (MutS-alfa): Heterodímero sensor de apareamientos erróneos puntuales en MMR.
• MLH1-PMS2 (MutL-alfa): Endonucleasa coordinadora estimulada por PCNA en MMR.
• EXO1: Exonucleasa 5'→3' que degrada la hebra hija con el error en MMR y reseciona extremos en HR.
• Ku70/Ku80: Heterodímero en anillo que abraza extremos rotos bicatenarios en NHEJ.
• DNA-PKcs: Proteína cinasa dependiente de ADN que forma el holoenzima DNA-PK en NHEJ.
• Artemis: Nucleasa que abre horquillas y procesa extremos no cohesivos en NHEJ.
• Ligasa IV - XRCC4: Complejo especializado de ligación bicatenaria en NHEJ.
• MRN (Mre11-Rad50-Nbs1): Sensor de extremos bicatenarios y activador de ATM en HR.
• BRCA1 / BRCA2 / PALB2: Mediadores que reclutan y cargan a Rad51 sobre ssDNA en HR.
• Rad51: Recombinasa que forma el nucleofilamento presináptico y cataliza la invasión del D-loop en HR.
• MGMT: O6-metilguanina-ADN metiltransferasa. Enzima suicida de reversión directa.
• Fotoliasa: Flavoenzima dependiente de luz visible para escindir dímeros CPD en bacterias.
• Cas9: Endonucleasa dirigida por sgRNA de tipo II en CRISPR que induce DSBs romos.`,
        relatedScenarioNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      }
    ]
  }
];
