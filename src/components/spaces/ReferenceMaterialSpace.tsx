import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { REFERENCE_CHAPTERS, ReferenceChapter, ReferenceSubSection } from '../../data/referenceManualData';
import { SCENARIOS } from '../../data/scenarios';
import { 
  BookOpen, 
  Search, 
  Dna, 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Stethoscope, 
  Sparkles, 
  Download, 
  Printer, 
  ChevronRight,
  Bookmark,
  Layers,
  HelpCircle,
  FileText,
  FlaskConical
} from 'lucide-react';

export const ReferenceMaterialSpace: React.FC = () => {
  const { 
    themeMode, 
    selectScenario, 
    setActiveSpace, 
    setRoundStage 
  } = useApp();

  const isLight = themeMode === 'light';

  const [activeChapterId, setActiveChapterId] = useState<string>(REFERENCE_CHAPTERS[0].id);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isFullReadingMode, setIsFullReadingMode] = useState<boolean>(false);

  // Active Chapter
  const activeChapter = useMemo(() => {
    return REFERENCE_CHAPTERS.find(c => c.id === activeChapterId) || REFERENCE_CHAPTERS[0];
  }, [activeChapterId]);

  // Search Results
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const term = searchTerm.toLowerCase();

    const matches: { chapter: ReferenceChapter; subsection: ReferenceSubSection }[] = [];
    REFERENCE_CHAPTERS.forEach(chap => {
      chap.subsections.forEach(sub => {
        const inTitle = sub.title.toLowerCase().includes(term);
        const inContent = sub.content.toLowerCase().includes(term);
        const inEnzymes = sub.keyEnzymes?.some(e => e.toLowerCase().includes(term));
        const inClinical = sub.clinicalSignificance?.toLowerCase().includes(term);
        const inTip = sub.diagnosticTip?.toLowerCase().includes(term);

        if (inTitle || inContent || inEnzymes || inClinical || inTip) {
          matches.push({ chapter: chap, subsection: sub });
        }
      });
    });
    return matches;
  }, [searchTerm]);

  const handleGoToScenario = (scenarioNum: number) => {
    const sc = SCENARIOS.find(s => s.number === scenarioNum);
    if (sc) {
      selectScenario(sc.id);
      setRoundStage(1);
      setActiveSpace('exploration');
    }
  };

  const exportAsMarkdown = () => {
    let md = `# MATERIAL DE CONSULTA: BIOLOGÍA MOLECULAR Y REPARACIÓN DEL ADN\n`;
    md += `Guía Teórica y Práctica por Capítulos - Defensa contra Mutaciones Indeseadas\n\n`;

    REFERENCE_CHAPTERS.forEach(chap => {
      md += `\n# CAPÍTULO ${chap.chapterNumber}: ${chap.title.toUpperCase()}\n`;
      md += `*${chap.subtitle}*\n\n`;
      md += `${chap.summary}\n\n`;

      chap.subsections.forEach(sub => {
        md += `## ${sub.title}\n\n`;
        md += `${sub.content}\n\n`;
        if (sub.keyEnzymes && sub.keyEnzymes.length > 0) {
          md += `**Enzimas clave:** ${sub.keyEnzymes.join(', ')}\n\n`;
        }
        if (sub.diagnosticTip) {
          md += `> **💡 Clave Diagnóstica:** ${sub.diagnosticTip}\n\n`;
        }
        if (sub.clinicalSignificance) {
          md += `**🏥 Relevancia Clínica:** ${sub.clinicalSignificance}\n\n`;
        }
        if (sub.keyPoints && sub.keyPoints.length > 0) {
          md += `**Puntos esenciales:**\n`;
          sub.keyPoints.forEach(p => {
            md += `- ${p}\n`;
          });
          md += `\n`;
        }
      });
      md += `\n---\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `material_de_consulta_reparacion_adn.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner Header */}
      <div className={`p-6 rounded-3xl border shadow-xl transition-all ${
        isLight 
          ? 'bg-gradient-to-r from-teal-50 via-cyan-50 to-white border-teal-200/80 shadow-teal-950/5' 
          : 'bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-900/60 shadow-black/40'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold tracking-wider uppercase border ${
                isLight 
                  ? 'bg-teal-100 text-teal-800 border-teal-300' 
                  : 'bg-teal-950/80 text-teal-300 border-teal-800'
              }`}>
                Manual de Referencia Oficial
              </span>
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                7 Capítulos Estructurados
              </span>
            </div>

            <h1 className={`text-xl sm:text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Material de Consulta: Reparación y Estabilidad del ADN
            </h1>

            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              Toda la información teórica y práctica necesaria para resolver los 10 problemas del laboratorio: 
              enzimología paso a paso, morfología de lesiones, árboles de decisión y correlaciones clínicas.
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsFullReadingMode(!isFullReadingMode)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isFullReadingMode
                  ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                  : isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Alternar entre vista de capítulos y vista de lectura continua"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isFullReadingMode ? 'Vista por Capítulos' : 'Lectura Continua'}</span>
            </button>

            <button
              onClick={exportAsMarkdown}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Descargar toda la guía en archivo Markdown"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar MD</span>
            </button>

            <button
              onClick={handlePrint}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                isLight
                  ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
              title="Imprimir guía para estudio"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-800/80">
          <div className="relative">
            <Search className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-400' : 'text-slate-500'
            }`} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar concepto, enzima, síndrome o lesión (ej. TFIIH, 8-oxoG, Lynch, Olaparib, CRISPR, Ku70, G1)..."
              className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs border transition-colors focus:outline-none focus:ring-2 ${
                isLight
                  ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:ring-teal-500/30 focus:border-teal-600'
                  : 'bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus:ring-cyan-500/30 focus:border-cyan-500'
              }`}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Topics */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] font-mono">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Temas rápidos:</span>
            {[
              { label: 'Todos', value: 'all' },
              { label: 'BER (Escisión de Bases)', value: 'BER' },
              { label: 'NER (Nucleótidos)', value: 'NER' },
              { label: 'MMR (Apareamiento)', value: 'MMR' },
              { label: 'NHEJ (Rotura G1)', value: 'NHEJ' },
              { label: 'HR (Recombinación)', value: 'HR' },
              { label: 'Árbol Diagnóstico', value: 'algoritmo' },
              { label: 'Letalidad Sintética (PARP)', value: 'parp' }
            ].map(f => (
              <button
                key={f.value}
                onClick={() => {
                  setFilterCategory(f.value);
                  if (f.value === 'all') setSearchTerm('');
                  else if (f.value === 'algoritmo') setActiveChapterId('capitulo_5_algoritmo');
                  else setSearchTerm(f.value);
                }}
                className={`px-2 py-0.5 rounded-lg border transition-all ${
                  (filterCategory === f.value && !searchTerm) || searchTerm.toLowerCase() === f.value.toLowerCase()
                    ? 'bg-teal-600 text-white border-teal-500 font-bold'
                    : isLight
                    ? 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SEARCH RESULTS VIEW */}
      {searchResults && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-mono font-bold uppercase tracking-wider ${
              isLight ? 'text-cyan-800' : 'text-cyan-300'
            }`}>
              Resultados de la búsqueda: &quot;{searchTerm}&quot; ({searchResults.length} {searchResults.length === 1 ? 'coincidencia' : 'coincidencias'})
            </h3>
            <button
              onClick={() => setSearchTerm('')}
              className={`text-xs font-mono font-bold underline ${isLight ? 'text-slate-600' : 'text-slate-400'}`}
            >
              Limpiar búsqueda
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className={`p-8 text-center rounded-2xl border ${
              isLight ? 'bg-white border-slate-200 text-slate-500' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <HelpCircle className="w-8 h-8 mx-auto mb-2 opacity-60" />
              <p className="text-sm font-semibold">No se encontraron coincidencias exactas para &quot;{searchTerm}&quot;.</p>
              <p className="text-xs mt-1">Prueba con términos como: OGG1, XPC, MMR, Ku70, Rad51, Uracilo, Temozolomida o Dímero.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {searchResults.map(({ chapter, subsection }, idx) => (
                <div 
                  key={`${subsection.id}-${idx}`}
                  className={`p-5 rounded-2xl border transition-all space-y-2.5 ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/90 border-slate-800 shadow-md'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      Capítulo {chapter.chapterNumber}: {chapter.title}
                    </span>
                    <button
                      onClick={() => {
                        setActiveChapterId(chapter.id);
                        setSearchTerm('');
                      }}
                      className={`text-xs font-mono font-bold flex items-center gap-1 ${
                        isLight ? 'text-cyan-700 hover:text-cyan-900' : 'text-cyan-400 hover:text-cyan-200'
                      }`}
                    >
                      <span>Ver en capítulo completo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {subsection.title}
                  </h4>

                  <div className={`text-xs leading-relaxed whitespace-pre-line ${
                    isLight ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {subsection.content}
                  </div>

                  {subsection.diagnosticTip && (
                    <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                      isLight ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                    }`}>
                      <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
                      <div>
                        <strong className="block font-mono uppercase text-[10px]">Consejo Diagnóstico para Resolver Casos:</strong>
                        <span>{subsection.diagnosticTip}</span>
                      </div>
                    </div>
                  )}

                  {subsection.relatedScenarioNumbers && subsection.relatedScenarioNumbers.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] font-mono text-slate-500">Casos que resuelven con esto:</span>
                      {subsection.relatedScenarioNumbers.map(n => (
                        <button
                          key={n}
                          onClick={() => handleGoToScenario(n)}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-colors border ${
                            isLight 
                              ? 'bg-slate-100 border-slate-200 text-cyan-800 hover:bg-cyan-100 hover:border-cyan-300' 
                              : 'bg-slate-950 border-slate-800 text-cyan-300 hover:bg-cyan-950 hover:border-cyan-700'
                          }`}
                        >
                          Resolver Caso #{n} →
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STANDARD CHAPTER OR CONTINUOUS VIEW */}
      {!searchResults && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Chapter Index Navigation (Hidden in continuous print mode if desired) */}
          <div className="lg:col-span-4 space-y-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                Índice de Capítulos
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                isLight ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-300'
              }`}>
                7 Capítulos
              </span>
            </div>

            <div className="space-y-1.5">
              {REFERENCE_CHAPTERS.map(chapter => {
                const isSelected = activeChapterId === chapter.id && !isFullReadingMode;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => {
                      setActiveChapterId(chapter.id);
                      setIsFullReadingMode(false);
                      window.scrollTo({ top: 220, behavior: 'smooth' });
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 group ${
                      isSelected
                        ? isLight
                          ? 'bg-cyan-50 border-cyan-400 shadow-md ring-2 ring-cyan-400/30'
                          : 'bg-cyan-950/70 border-cyan-500 shadow-lg ring-1 ring-cyan-500/40 text-white'
                        : isLight
                        ? 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50 text-slate-800'
                        : 'bg-slate-900 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/70 text-slate-300'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : isLight
                        ? 'bg-slate-100 text-slate-700 group-hover:bg-teal-100 group-hover:text-teal-800'
                        : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
                    }`}>
                      {chapter.chapterNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                          isSelected
                            ? isLight ? 'text-cyan-800' : 'text-cyan-300'
                            : isLight ? 'text-slate-500' : 'text-slate-400'
                        }`}>
                          {chapter.badge}
                        </span>
                        <span className={`text-[9px] font-mono ${
                          isLight ? 'text-slate-400' : 'text-slate-500'
                        }`}>
                          {chapter.subsections.length} secciones
                        </span>
                      </div>
                      
                      <h3 className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isSelected
                          ? isLight ? 'text-cyan-950' : 'text-white'
                          : isLight ? 'text-slate-800' : 'text-slate-200'
                      }`}>
                        {chapter.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Diagnostic Guide Banner */}
            <div className={`p-4 rounded-2xl border space-y-2 mt-4 ${
              isLight ? 'bg-amber-50/80 border-amber-200 text-amber-950' : 'bg-amber-950/30 border-amber-900/60 text-amber-200'
            }`}>
              <div className="flex items-center gap-2 font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
                <Lightbulb className="w-4 h-4" />
                <span>¿Atascado en un Escenario?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ve directamente al <strong>Capítulo 5</strong> para consultar el árbol de decisión de 4 preguntas y la tabla de solución de los 10 casos.
              </p>
              <button
                onClick={() => {
                  setActiveChapterId('capitulo_5_algoritmo');
                  setIsFullReadingMode(false);
                }}
                className={`w-full py-1.5 px-3 rounded-xl text-xs font-mono font-bold transition-all border ${
                  isLight 
                    ? 'bg-amber-200/60 hover:bg-amber-200 border-amber-300 text-amber-950' 
                    : 'bg-amber-900/50 hover:bg-amber-900 border-amber-700 text-amber-200'
                }`}
              >
                Abrir Árbol Diagnóstico →
              </button>
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {(isFullReadingMode ? REFERENCE_CHAPTERS : [activeChapter]).map((chapter) => (
              <div 
                key={chapter.id}
                className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-all ${
                  isLight ? 'bg-white border-slate-200 shadow-slate-900/5' : 'bg-slate-900/90 border-slate-800 shadow-black/40'
                }`}
              >
                {/* Chapter Header */}
                <div className="border-b border-slate-200 dark:border-slate-800 pb-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider border ${
                      isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-300' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      Capítulo #{chapter.chapterNumber} • {chapter.badge}
                    </span>

                    {/* Quick Scenario Jump */}
                    {chapter.relatedScenarioIds.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono">
                        <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Casos vinculados:</span>
                        <div className="flex flex-wrap gap-1">
                          {chapter.relatedScenarioIds.map(scId => {
                            const sc = SCENARIOS.find(s => s.id === scId);
                            if (!sc) return null;
                            return (
                              <button
                                key={sc.id}
                                onClick={() => {
                                  selectScenario(sc.id);
                                  setRoundStage(1);
                                  setActiveSpace('exploration');
                                }}
                                title={`Ir a Caso #${sc.number}: ${sc.title}`}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                                  isLight 
                                    ? 'bg-slate-100 hover:bg-cyan-100 text-slate-700 hover:text-cyan-900 border-slate-300' 
                                    : 'bg-slate-950 hover:bg-cyan-950 text-slate-300 hover:text-cyan-200 border-slate-800'
                                }`}
                              >
                                #{sc.number}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <h2 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {chapter.title}
                  </h2>
                  <p className={`text-xs sm:text-sm italic ${isLight ? 'text-teal-700' : 'text-teal-400'}`}>
                    {chapter.subtitle}
                  </p>
                  <p className={`text-xs leading-relaxed pt-1 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    {chapter.summary}
                  </p>
                </div>

                {/* Subsections */}
                <div className="space-y-6">
                  {chapter.subsections.map(sub => (
                    <div 
                      key={sub.id}
                      className={`p-5 rounded-2xl border space-y-3 transition-colors ${
                        isLight ? 'bg-slate-50/70 border-slate-200/90' : 'bg-slate-950/60 border-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className={`text-sm sm:text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {sub.title}
                        </h3>
                      </div>

                      {/* Main Prose Content */}
                      <div className={`text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}>
                        {sub.content}
                      </div>

                      {/* Diagnostic Tip Box */}
                      {sub.diagnosticTip && (
                        <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
                          isLight ? 'bg-amber-50/90 border-amber-300 text-amber-950' : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                        }`}>
                          <Lightbulb className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-mono uppercase font-bold text-[10px] block text-amber-600 dark:text-amber-400">
                              Consejo para Resolver los Problemas del Laboratorio:
                            </span>
                            <p className="leading-snug">{sub.diagnosticTip}</p>
                          </div>
                        </div>
                      )}

                      {/* Key Enzymes / Molecules Badges */}
                      {(sub.keyEnzymes || sub.keyMolecules) && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className={`text-[10px] font-mono uppercase font-bold ${
                            isLight ? 'text-slate-500' : 'text-slate-400'
                          }`}>
                            Enzimas & Componentes:
                          </span>
                          {sub.keyEnzymes?.map(enz => (
                            <span 
                              key={enz}
                              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${
                                isLight 
                                  ? 'bg-cyan-50 text-cyan-800 border-cyan-200' 
                                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80'
                              }`}
                            >
                              {enz}
                            </span>
                          ))}
                          {sub.keyMolecules?.map(mol => (
                            <span 
                              key={mol}
                              className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold border ${
                                isLight 
                                  ? 'bg-purple-50 text-purple-800 border-purple-200' 
                                  : 'bg-purple-950/80 text-purple-300 border-purple-800/80'
                              }`}
                            >
                              {mol}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Clinical Relevance Box */}
                      {sub.clinicalSignificance && (
                        <div className={`p-3 rounded-xl border flex items-start gap-2 text-xs ${
                          isLight ? 'bg-rose-50/80 border-rose-200 text-rose-950' : 'bg-rose-950/30 border-rose-900/60 text-rose-200'
                        }`}>
                          <Stethoscope className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
                          <div>
                            <strong className="block font-mono uppercase text-[10px] text-rose-600 dark:text-rose-400">
                              Relevancia Clínica & Patología Humana:
                            </strong>
                            <p className="leading-snug">{sub.clinicalSignificance}</p>
                          </div>
                        </div>
                      )}

                      {/* Essential Bullet Points */}
                      {sub.keyPoints && sub.keyPoints.length > 0 && (
                        <div className={`p-3 rounded-xl border space-y-1.5 text-xs ${
                          isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-slate-800'
                        }`}>
                          <span className={`block font-mono font-bold uppercase text-[10px] ${
                            isLight ? 'text-slate-600' : 'text-slate-400'
                          }`}>
                            Puntos Esenciales para la Rúbrica:
                          </span>
                          <ul className="space-y-1">
                            {sub.keyPoints.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                                <span className={isLight ? 'text-slate-700' : 'text-slate-300'}>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Related Lab Scenarios */}
                      {sub.relatedScenarioNumbers && sub.relatedScenarioNumbers.length > 0 && (
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
                          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                            Aplica estos conceptos en el laboratorio:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {sub.relatedScenarioNumbers.map(sNum => {
                              const sObj = SCENARIOS.find(s => s.number === sNum);
                              return (
                                <button
                                  key={sNum}
                                  onClick={() => handleGoToScenario(sNum)}
                                  className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all border flex items-center gap-1 group ${
                                    isLight
                                      ? 'bg-teal-50 hover:bg-teal-100 border-teal-300 text-teal-900'
                                      : 'bg-teal-950/80 hover:bg-teal-900 border-teal-800 text-teal-200'
                                  }`}
                                >
                                  <FlaskConical className="w-3.5 h-3.5 text-teal-500" />
                                  <span>Resolver Caso #{sNum}{sObj ? `: ${sObj.title.split(' ')[0]}` : ''}</span>
                                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                {/* Chapter Bottom Navigation */}
                {!isFullReadingMode && (
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                    {chapter.chapterNumber > 1 ? (
                      <button
                        onClick={() => {
                          const prev = REFERENCE_CHAPTERS.find(c => c.chapterNumber === chapter.chapterNumber - 1);
                          if (prev) {
                            setActiveChapterId(prev.id);
                            window.scrollTo({ top: 220, behavior: 'smooth' });
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all ${
                          isLight 
                            ? 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200' 
                            : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        ← Capítulo Anterior
                      </button>
                    ) : <div />}

                    {chapter.chapterNumber < REFERENCE_CHAPTERS.length ? (
                      <button
                        onClick={() => {
                          const next = REFERENCE_CHAPTERS.find(c => c.chapterNumber === chapter.chapterNumber + 1);
                          if (next) {
                            setActiveChapterId(next.id);
                            window.scrollTo({ top: 220, behavior: 'smooth' });
                          }
                        }}
                        className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold shadow-md flex items-center gap-1.5"
                      >
                        <span>Siguiente Capítulo ({chapter.chapterNumber + 1})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setActiveSpace('exploration');
                          setRoundStage(1);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md flex items-center gap-1.5"
                      >
                        <span>Ir al Laboratorio de Casos</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

              </div>
            ))}

          </div>
        </div>
      )}

    </div>
  );
};
