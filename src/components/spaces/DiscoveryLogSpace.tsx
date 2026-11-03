import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BookOpen, 
  Trash2, 
  Download, 
  Filter, 
  Network, 
  Search, 
  Dna,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const DiscoveryLogSpace: React.FC = () => {
  const { 
    discoveryLogs, 
    deleteLogEntry, 
    clearAllLogs, 
    setActiveSpace, 
    selectScenario,
    themeMode 
  } = useApp();

  const isLight = themeMode === 'light';

  const [filterMechanism, setFilterMechanism] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredLogs = discoveryLogs.filter(entry => {
    const matchesMech = filterMechanism === 'all' || entry.consideredMechanisms.includes(filterMechanism as any);
    const matchesSearch = searchTerm === '' || 
      entry.scenarioTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.identifiedLesion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.damageSource.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesMech && matchesSearch;
  });

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(discoveryLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `bitacora_descubrimientos_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportAsMarkdown = () => {
    let md = `# BITÁCORA CIENTÍFICA: DEFENSA CONTRA MUTACIONES INDESEADAS\n`;
    md += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n\n`;

    discoveryLogs.forEach((e, idx) => {
      md += `## Entrada ${idx + 1}: ${e.scenarioTitle}\n`;
      md += `- **Fecha:** ${e.timestamp}\n`;
      md += `- **Fuente de daño:** ${e.damageSource}\n`;
      md += `- **Lesión molecular identificada:** ${e.identifiedLesion}\n`;
      md += `- **Contexto inicial:** ${e.cellularContext}\n`;
      md += `- **Mecanismo evaluado:** ${e.consideredMechanisms.join(', ')}\n`;
      md += `- **Categoría de compatibilidad:** ${e.evaluationCategory}\n`;
      md += `- **Perturbación aplicada:** ${e.activePerturbation || 'Ninguna'}\n`;
      md += `- **Hipótesis inicial del estudiante:** ${e.studentHypothesisNotes}\n`;
      md += `- **Reflexión y condiciones:** ${e.studentReflectionNotes}\n`;
      md += `- **Conceptos clave:** ${e.keyInsights.join('; ')}\n\n`;
      md += `---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `informe_bitacora_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* Top Header */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl shadow-xl border transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900/90 border-slate-800'
      }`}>
        <div>
          <div className={`flex items-center gap-2 font-mono text-xs font-semibold uppercase ${
            isLight ? 'text-cyan-700' : 'text-cyan-400'
          }`}>
            <BookOpen className="w-4 h-4" />
            <span>Mi Bitácora de Descubrimientos Moleculares</span>
          </div>
          <h2 className={`text-base sm:text-lg font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Historial de Investigaciones y Relaciones Causal-Condicionales
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {discoveryLogs.length > 0 && (
            <>
              <button
                onClick={exportAsMarkdown}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Exportar informe en formato Markdown"
              >
                <FileText className={`w-3.5 h-3.5 ${isLight ? 'text-teal-700' : 'text-teal-400'}`} />
                <span>Exportar Informe (.md)</span>
              </button>

              <button
                onClick={exportAsJSON}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300' 
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="Exportar datos en formato JSON"
              >
                <Download className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                <span>JSON</span>
              </button>

              <button
                onClick={clearAllLogs}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isLight 
                    ? 'bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-300' 
                    : 'bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border-slate-700'
                }`}
                title="Limpiar historial de bitácora"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          <button
            onClick={() => setActiveSpace('graph_builder')}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold uppercase tracking-wider shadow-md shadow-cyan-900/30 transition-colors"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Llevar al Constructor de Modelos</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border text-xs transition-colors ${
        isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className={`flex items-center gap-2 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          <Filter className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
          <span className="font-mono">Filtrar por mecanismo:</span>
          <select
            value={filterMechanism}
            onChange={(e) => setFilterMechanism(e.target.value)}
            className={`border text-xs rounded-lg px-2.5 py-1 font-mono focus:outline-none transition-colors ${
              isLight 
                ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-600' 
                : 'bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-500'
            }`}
          >
            <option value="all">Todos los mecanismos</option>
            <option value="BER">BER (Escisión de Bases)</option>
            <option value="NER">NER (Escisión de Nucleótidos)</option>
            <option value="MMR">MMR (Apareamiento)</option>
            <option value="HR">HR (Recombinación Homóloga)</option>
            <option value="NHEJ">NHEJ (Unión No Homóloga)</option>
            <option value="DIRECT_MGMT">MGMT (Reversión Directa)</option>
            <option value="PHOTOLYASE">Fotoliasa</option>
          </select>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border w-full sm:w-auto transition-colors ${
          isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
        }`}>
          <Search className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por lesión, agente..."
            className={`bg-transparent text-xs focus:outline-none w-48 font-mono ${
              isLight ? 'text-slate-800 placeholder-slate-400' : 'text-slate-200 placeholder-slate-500'
            }`}
          />
        </div>
      </div>

      {/* Log Entries List */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-4">
          {filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-2xl p-5 shadow-xl space-y-4 text-xs border transition-colors ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'
              }`}
            >
              {/* Header */}
              <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${
                isLight ? 'border-slate-100' : 'border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {entry.scenarioTitle}
                  </h3>
                </div>

                <div className={`flex items-center gap-3 font-mono text-[11px] ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{entry.timestamp}</span>
                  </span>

                  <button
                    onClick={() => deleteLogEntry(entry.id)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                    title="Eliminar entrada"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Grid with 6 Pedagogical Answers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* 1. Initial Thought */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold block ${
                    isLight ? 'text-cyan-700' : 'text-cyan-400'
                  }`}>
                    1. ¿Qué pensabas inicialmente? (Hipótesis)
                  </span>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {entry.studentHypothesisNotes || 'Hipótesis registradas en la etapa 1.'}
                  </p>
                </div>

                {/* 2. New Info / Lesion */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold block ${
                    isLight ? 'text-teal-700' : 'text-teal-400'
                  }`}>
                    2. ¿Qué nueva información apareció? (Lesión identificada)
                  </span>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    Lesión: <strong className={isLight ? 'text-slate-900 font-bold' : 'text-white'}>{entry.identifiedLesion}</strong> producida por <strong className={isLight ? 'text-cyan-700 font-bold' : 'text-cyan-300'}>{entry.damageSource}</strong>.
                  </p>
                </div>

                {/* 3. Compatible Mechanism */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold block ${
                    isLight ? 'text-emerald-700' : 'text-emerald-400'
                  }`}>
                    3. ¿Qué mecanismo resultó compatible?
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {entry.consideredMechanisms.map(m => (
                      <span key={m} className={`px-2 py-0.5 rounded font-mono font-bold text-xs border ${
                        isLight 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800' 
                          : 'bg-emerald-950 border-emerald-800 text-emerald-300'
                      }`}>
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. Crucial Conditions */}
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800/80'
                }`}>
                  <span className={`text-[10px] font-mono uppercase font-bold block ${
                    isLight ? 'text-amber-800' : 'text-amber-400'
                  }`}>
                    4. ¿Qué condición celular resultó importante?
                  </span>
                  <p className={`leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                    {entry.activePerturbation 
                      ? `Perturbación ensayada: ${entry.activePerturbation}. ${entry.perturbationImpact || ''}` 
                      : 'Condiciones basales del tejido.'}
                  </p>
                </div>
              </div>

              {/* 5. Reflection & Model Connection */}
              <div className={`p-3 rounded-xl border space-y-1 ${
                isLight ? 'bg-indigo-50 border-indigo-200 text-indigo-950' : 'bg-indigo-950/30 border-indigo-900/60 text-slate-200'
              }`}>
                <span className={`text-[10px] font-mono uppercase font-bold block ${
                  isLight ? 'text-indigo-800' : 'text-indigo-300'
                }`}>
                  5. ¿Qué conexión incorporar a tu modelo conceptual? (Reflexión)
                </span>
                <p className="italic leading-relaxed">
                  &laquo;{entry.studentReflectionNotes}&raquo;
                </p>
              </div>

              {/* Bottom Quick Action: Revisit scenario */}
              <div className={`flex items-center justify-between pt-1 border-t text-[11px] ${
                isLight ? 'border-slate-100 text-slate-500' : 'border-slate-800/80 text-slate-400'
              }`}>
                <span>Operaciones asociadas: {entry.chosenOperations.length} operaciones moleculares</span>
                <button
                  onClick={() => {
                    selectScenario(entry.scenarioId);
                    setActiveSpace('exploration');
                  }}
                  className={`font-mono font-medium flex items-center gap-1 ${
                    isLight ? 'text-cyan-700 hover:text-cyan-800' : 'text-cyan-400 hover:text-cyan-300'
                  }`}
                >
                  <span>Revisitar este escenario</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={`text-center py-16 rounded-2xl border border-dashed space-y-3 ${
          isLight ? 'bg-white border-slate-300' : 'bg-slate-900/40 border-slate-800'
        }`}>
          <Dna className={`w-12 h-12 mx-auto ${isLight ? 'text-slate-400' : 'text-slate-700'}`} />
          <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Tu Bitácora está vacía</h3>
          <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Explora un escenario, formula tu estrategia de reparación y guárdala tras aplicar una perturbación para acumular evidencias en tu bitácora.
          </p>
          <button
            onClick={() => setActiveSpace('exploration')}
            className="mt-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold uppercase shadow-sm"
          >
            Ir a Explorar Escenarios
          </button>
        </div>
      )}
    </div>
  );
};
