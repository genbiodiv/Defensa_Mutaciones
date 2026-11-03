import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCIENTIFIC_REFERENCES, GLOSSARY_CONCEPTS } from '../../data/references';
import { 
  Library, 
  BookMarked, 
  HelpCircle, 
  Search, 
  ArrowRight,
  Bookmark,
  Sparkles
} from 'lucide-react';

export const ReferenceGlossaryModal: React.FC = () => {
  const { setActiveSpace, themeMode } = useApp();
  const isLight = themeMode === 'light';

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredConcepts = GLOSSARY_CONCEPTS.filter(c => {
    const matchesCat = activeCategory === 'all' || c.category === activeCategory;
    const matchesSearch = searchTerm === '' || 
      c.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.definition.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8 select-none">
      {/* Header */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-3 transition-colors ${
        isLight
          ? 'bg-gradient-to-r from-teal-50 via-white to-cyan-50 border-teal-200 text-slate-800'
          : 'bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 border-teal-800/60 text-slate-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLight ? 'bg-teal-100 text-teal-700 border-teal-300' : 'bg-teal-600/30 text-teal-300 border-teal-500/40'
            }`}>
              <Library className="w-6 h-6" />
            </div>
            <div>
              <span className={`text-xs font-mono uppercase tracking-widest font-bold block ${
                isLight ? 'text-teal-700' : 'text-teal-400'
              }`}>
                Fundamentos y Bibliografía Universitaria
              </span>
              <h1 className={`text-xl sm:text-2xl font-black ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Conceptos Clave y Referencias Científicas
              </h1>
            </div>
          </div>

          <button
            onClick={() => setActiveSpace('exploration')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium border transition-colors ${
              isLight 
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-sm' 
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            ← Volver al Lab
          </button>
        </div>

        <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${isLight ? 'text-slate-600' : 'text-teal-200/90'}`}>
          Basado en los tratados de referencia de Biología Molecular y Celular médica (Alberts et al., Lodish et al., Watson et al.). Distingue con rigor las adaptaciones didácticas de las realidades mecanísticas.
        </p>
      </div>

      {/* Main Canonical Bookshelf Grid */}
      <div className="space-y-4">
        <h2 className={`text-sm font-bold font-mono uppercase tracking-wider flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <BookMarked className={`w-4 h-4 ${isLight ? 'text-teal-700' : 'text-teal-400'}`} />
          <span>Tratados de Referencia Recomendados</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SCIENTIFIC_REFERENCES.map((ref, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl text-xs space-y-2 shadow-lg border transition-colors ${
                isLight 
                  ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50 hover:border-teal-400' 
                  : 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-teal-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {ref.title}
                </h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                  isLight ? 'bg-teal-50 text-teal-800 border-teal-200 font-bold' : 'bg-teal-950 text-teal-300 border-teal-800'
                }`}>
                  {ref.edition}
                </span>
              </div>

              <div className={`font-mono text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {ref.authors}
              </div>

              <p className={`pt-1 leading-relaxed ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                <strong>Temas cubiertos:</strong> {ref.topics}
              </p>

              <p className={`italic text-[11px] pt-1 ${isLight ? 'text-teal-800' : 'text-teal-300/80'}`}>
                {ref.notes}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Molecular Glossary Section */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 border transition-colors ${
        isLight ? 'bg-white border-slate-200 text-slate-800 shadow-slate-200/50' : 'bg-slate-900 border-slate-800 text-slate-200'
      }`}>
        <div className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
          isLight ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <h2 className={`text-base font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
              <Bookmark className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
              <span>Glosario de Mecanismos y Principios Moleculares</span>
            </h2>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Definiciones rigurosas adaptadas a Medicina y Biología Molecular
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              isLight ? 'bg-slate-50 border-slate-300' : 'bg-slate-950 border-slate-800'
            }`}>
              <Search className={`w-3.5 h-3.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar término o enzima..."
                className={`bg-transparent text-xs focus:outline-none w-40 font-mono ${
                  isLight ? 'text-slate-800 placeholder-slate-400' : 'text-slate-200 placeholder-slate-500'
                }`}
              />
            </div>

            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={`border rounded-xl px-3 py-1.5 font-mono focus:outline-none transition-colors ${
                isLight 
                  ? 'bg-slate-50 border-slate-300 text-slate-800 focus:border-cyan-600' 
                  : 'bg-slate-950 border-slate-800 text-slate-300'
              }`}
            >
              <option value="all">Todas las categorías</option>
              <option value="mecanismo">Mecanismos</option>
              <option value="lesion">Lesiones</option>
              <option value="regulacion">Regulación</option>
            </select>
          </div>
        </div>

        {/* Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredConcepts.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border space-y-2 text-xs transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <h4 className={`font-bold text-xs ${isLight ? 'text-cyan-800 font-extrabold' : 'text-cyan-300'}`}>
                  {item.term}
                </h4>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                  isLight ? 'bg-white border-slate-200 text-slate-600 font-bold' : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  {item.category}
                </span>
              </div>

              <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                {item.definition}
              </p>

              {item.clinicalNote && (
                <div className={`p-2 rounded text-[11px] border ${
                  isLight 
                    ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 font-medium' 
                    : 'bg-indigo-950/40 border-indigo-900/60 text-indigo-300'
                }`}>
                  <strong className={isLight ? 'text-indigo-900' : 'text-indigo-200'}>Correlación Clínica:</strong> {item.clinicalNote}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The Final Pedagogical Horizon Question (Section 19) */}
      <div className={`p-8 rounded-3xl shadow-2xl space-y-4 border transition-colors ${
        isLight
          ? 'bg-gradient-to-br from-white via-cyan-50/30 to-teal-50/40 border-cyan-200 text-slate-800'
          : 'bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 border-cyan-800/80 text-slate-200'
      }`}>
        <div className={`flex items-center gap-2 font-mono text-xs uppercase font-bold tracking-wider ${
          isLight ? 'text-cyan-800' : 'text-cyan-400'
        }`}>
          <Sparkles className="w-4 h-4" />
          <span>El Horizonte Pedagógico Final</span>
        </div>

        <h3 className={`text-xl sm:text-2xl font-black leading-snug ${isLight ? 'text-slate-900' : 'text-white'}`}>
          ¿Qué sucede cuando una célula no logra reparar adecuadamente su ADN?
        </h3>

        <p className={`text-sm leading-relaxed max-w-3xl italic ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
          &laquo;¿Cómo decide una célula si continúa dividiéndose tolerando el daño, detiene permanentemente su ciclo celular en senescencia replicativa, o inicia su muerte programada por apoptosis?&raquo;
        </p>

        <p className={`text-xs leading-relaxed max-w-3xl ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
          Esta pregunta no se resuelve por completo en este módulo de integridad genómica, pues constituye el puente conceptual que da inicio a la siguiente unidad del curso: <strong>Puntos de Control del Ciclo Celular, Oncogenes y Supresión Tumoral</strong>.
        </p>
      </div>
    </div>
  );
};
