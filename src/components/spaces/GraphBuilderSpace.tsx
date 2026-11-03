import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  GraphNodeType, 
  GraphEdgeType, 
  GraphNode
} from '../../data/types';
import { 
  Network, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  Award, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Info,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Sparkles,
  Hand,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Crosshair,
  Layers,
  Move
} from 'lucide-react';

const NODE_COLORS: Record<GraphNodeType, { bg: string; border: string; text: string; label: string }> = {
  damage_source: { bg: 'bg-amber-950/70', border: 'border-amber-500', text: 'text-amber-200', label: 'Fuente de daño' },
  lesion: { bg: 'bg-rose-950/70', border: 'border-rose-500', text: 'text-rose-200', label: 'Lesión molecular' },
  recognition: { bg: 'bg-purple-950/70', border: 'border-purple-500', text: 'text-purple-200', label: 'Reconocimiento' },
  mechanism: { bg: 'bg-cyan-950/70', border: 'border-cyan-400', text: 'text-cyan-200', label: 'Mecanismo' },
  operation: { bg: 'bg-teal-950/70', border: 'border-teal-500', text: 'text-teal-200', label: 'Operación' },
  condition: { bg: 'bg-indigo-950/70', border: 'border-indigo-400', text: 'text-indigo-200', label: 'Condición celular' },
  component: { bg: 'bg-blue-950/70', border: 'border-blue-400', text: 'text-blue-200', label: 'Componente' },
  outcome: { bg: 'bg-emerald-950/70', border: 'border-emerald-400', text: 'text-emerald-200', label: 'Resultado' },
  consequence: { bg: 'bg-fuchsia-950/70', border: 'border-fuchsia-400', text: 'text-fuchsia-200', label: 'Consecuencia' }
};

const getNodeClasses = (type: GraphNodeType, isLight: boolean) => {
  if (isLight) {
    const lightMap: Record<GraphNodeType, { bg: string; border: string; text: string; label: string }> = {
      damage_source: { bg: 'bg-amber-100', border: 'border-amber-400', text: 'text-amber-950', label: 'Fuente de daño' },
      lesion: { bg: 'bg-rose-100', border: 'border-rose-400', text: 'text-rose-950', label: 'Lesión molecular' },
      recognition: { bg: 'bg-purple-100', border: 'border-purple-400', text: 'text-purple-950', label: 'Reconocimiento' },
      mechanism: { bg: 'bg-cyan-100', border: 'border-cyan-400', text: 'text-cyan-950', label: 'Mecanismo' },
      operation: { bg: 'bg-teal-100', border: 'border-teal-400', text: 'text-teal-950', label: 'Operación' },
      condition: { bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-950', label: 'Condición celular' },
      component: { bg: 'bg-blue-100', border: 'border-blue-400', text: 'text-blue-950', label: 'Componente' },
      outcome: { bg: 'bg-emerald-100', border: 'border-emerald-400', text: 'text-emerald-950', label: 'Resultado' },
      consequence: { bg: 'bg-fuchsia-100', border: 'border-fuchsia-400', text: 'text-fuchsia-950', label: 'Consecuencia' }
    };
    return lightMap[type] || lightMap.mechanism;
  }
  return NODE_COLORS[type] || NODE_COLORS.mechanism;
};

const EDGE_RELATIONS: { id: GraphEdgeType; label: string }[] = [
  { id: 'puede_producir', label: 'puede producir' },
  { id: 'produce', label: 'produce' },
  { id: 'es_reconocido_por', label: 'es reconocido por' },
  { id: 'repara', label: 'repara' },
  { id: 'requiere', label: 'requiere' },
  { id: 'favorece', label: 'favorece' },
  { id: 'inhibe', label: 'inhibe' },
  { id: 'utiliza', label: 'utiliza' },
  { id: 'depende_de', label: 'depende de' },
  { id: 'puede_provocar', label: 'puede provocar' },
  { id: 'conduce_a', label: 'conduce a' },
  { id: 'es_alternativa_a', label: 'es una alternativa a' }
];

export const GraphBuilderSpace: React.FC = () => {
  const {
    graphModel,
    updateGraphModel,
    addGraphNode,
    updateGraphNode,
    deleteGraphNode,
    addGraphEdge,
    deleteGraphEdge,
    rubricEvaluation,
    evaluateCurrentGraph,
    loadTemplateGraph,
    resetGraph,
    reorganizeGraph,
    discoveryLogs,
    themeMode
  } = useApp();

  const isLight = themeMode === 'light';

  // Canvas zoom and panning
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 20, y: 20 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mobile Interaction States
  const [mobileMode, setMobileMode] = useState<'drag' | 'pan'>('drag');
  const [touchHoldingNodeId, setTouchHoldingNodeId] = useState<string | null>(null);
  const [lastTouchDist, setLastTouchDist] = useState<number | null>(null);
  const [lastTouchMid, setLastTouchMid] = useState<{ x: number; y: number } | null>(null);

  // Node Dragging state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Creation Modals
  const [isAddingNode, setIsAddingNode] = useState<boolean>(false);
  const [newNodeLabel, setNewNodeLabel] = useState<string>('');
  const [newNodeType, setNewNodeType] = useState<GraphNodeType>('mechanism');

  // Connection Creation State
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [selectedRelation, setSelectedRelation] = useState<GraphEdgeType>('repara');
  const [edgeCondition, setEdgeCondition] = useState<string>('');

  // Selected Node/Edge for inspection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const selectedNode = graphModel.nodes.find(n => n.id === selectedNodeId);

  // Rubric Modal
  const [showRubricModal, setShowRubricModal] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate canvas-relative world coordinates (takes canvas rect, pan, zoom into account)
  const getWorldCoords = (clientX: number, clientY: number) => {
    const rect = canvasRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    return {
      x: (clientX - rect.left - pan.x) / zoom,
      y: (clientY - rect.top - pan.y) / zoom
    };
  };

  // Connection selection helper
  const handleConnectionSelect = (nodeId: string) => {
    if (!connectSourceId) {
      setConnectSourceId(nodeId);
    } else if (connectSourceId !== nodeId) {
      addGraphEdge({
        source: connectSourceId,
        target: nodeId,
        relation: selectedRelation,
        condition: edgeCondition || undefined
      });
      setIsConnecting(false);
      setConnectSourceId(null);
      setEdgeCondition('');
    }
  };

  // Node Mouse Down
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (isConnecting) {
      handleConnectionSelect(nodeId);
      return;
    }

    const node = graphModel.nodes.find(n => n.id === nodeId);
    if (!node) return;

    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    setDraggingNodeId(nodeId);
    const coords = getWorldCoords(e.clientX, e.clientY);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y
    });
  };

  // Node Touch Start (Sostener y arrastrar en móvil)
  const handleNodeTouchStart = (e: React.TouchEvent, nodeId: string) => {
    e.stopPropagation();
    if (isConnecting) {
      handleConnectionSelect(nodeId);
      return;
    }

    const node = graphModel.nodes.find(n => n.id === nodeId);
    if (!node) return;

    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    } catch {
      // ignore
    }

    setSelectedNodeId(nodeId);
    setSelectedEdgeId(null);
    setTouchHoldingNodeId(nodeId);
    setDraggingNodeId(nodeId);

    const touch = e.touches[0];
    const coords = getWorldCoords(touch.clientX, touch.clientY);
    setDragOffset({
      x: coords.x - node.x,
      y: coords.y - node.y
    });
  };

  // Mouse Move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggingNodeId) {
      const coords = getWorldCoords(e.clientX, e.clientY);
      const newX = Math.round(coords.x - dragOffset.x);
      const newY = Math.round(coords.y - dragOffset.y);
      updateGraphNode(draggingNodeId, { x: Math.max(10, newX), y: Math.max(10, newY) });
    } else if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      });
    }
  }, [draggingNodeId, dragOffset, isPanning, startPan, updateGraphNode, zoom, pan]);

  // Mouse Up
  const handleMouseUp = () => {
    setDraggingNodeId(null);
    setTouchHoldingNodeId(null);
    setIsPanning(false);
  };

  // Canvas Mouse Down
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setSelectedNodeId(null);
      setSelectedEdgeId(null);
      setIsPanning(true);
      setStartPan({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  // Canvas Touch Start (Pinch zoom & pan)
  const handleCanvasTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      setLastTouchDist(Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY));
      setLastTouchMid({ x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 });
      return;
    }

    if (e.touches.length === 1) {
      const target = e.target as HTMLElement;
      if (target === canvasRef.current || target.tagName === 'svg' || mobileMode === 'pan') {
        setSelectedNodeId(null);
        setSelectedEdgeId(null);
        setIsPanning(true);
        const touch = e.touches[0];
        setStartPan({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
      }
    }
  };

  // Canvas Touch Move
  const handleCanvasTouchMove = (e: React.TouchEvent) => {
    // 2-finger pinch & pan
    if (e.touches.length === 2) {
      e.preventDefault();
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const mid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };

      if (lastTouchDist && lastTouchDist > 0) {
        const scaleFactor = dist / lastTouchDist;
        setZoom(z => Math.max(0.35, Math.min(2.2, z * scaleFactor)));
      }
      if (lastTouchMid) {
        const dx = mid.x - lastTouchMid.x;
        const dy = mid.y - lastTouchMid.y;
        setPan(p => ({ x: p.x + dx, y: p.y + dy }));
      }
      setLastTouchDist(dist);
      setLastTouchMid(mid);
      return;
    }

    // 1-finger drag node
    if (draggingNodeId && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const coords = getWorldCoords(touch.clientX, touch.clientY);
      const newX = Math.round(coords.x - dragOffset.x);
      const newY = Math.round(coords.y - dragOffset.y);
      updateGraphNode(draggingNodeId, { x: Math.max(10, newX), y: Math.max(10, newY) });
      return;
    }

    // 1-finger canvas pan
    if (isPanning && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setPan({
        x: touch.clientX - startPan.x,
        y: touch.clientY - startPan.y
      });
    }
  };

  // Canvas Touch End
  const handleCanvasTouchEnd = () => {
    setDraggingNodeId(null);
    setTouchHoldingNodeId(null);
    setIsPanning(false);
    setLastTouchDist(null);
    setLastTouchMid(null);
  };

  // Auto-Reorganize into clean functional columns
  const handleAutoReorganize = () => {
    reorganizeGraph();
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setZoom(0.65);
      setPan({ x: 15, y: 30 });
    } else {
      setZoom(0.85);
      setPan({ x: 30, y: 30 });
    }
  };

  // Nudge Node by DX, DY
  const handleNudgeNode = (dx: number, dy: number) => {
    if (!selectedNodeId) return;
    const node = graphModel.nodes.find(n => n.id === selectedNodeId);
    if (!node) return;
    updateGraphNode(selectedNodeId, {
      x: Math.max(10, node.x + dx),
      y: Math.max(10, node.y + dy)
    });
  };

  // Fit all nodes on screen
  const handleFitToScreen = () => {
    if (graphModel.nodes.length === 0) {
      setZoom(1);
      setPan({ x: 20, y: 20 });
      return;
    }
    const minX = Math.min(...graphModel.nodes.map(n => n.x));
    const maxX = Math.max(...graphModel.nodes.map(n => n.x + 160));
    const minY = Math.min(...graphModel.nodes.map(n => n.y));
    const maxY = Math.max(...graphModel.nodes.map(n => n.y + 120));

    const canvasWidth = canvasRef.current?.clientWidth || 800;
    const canvasHeight = canvasRef.current?.clientHeight || 600;

    const graphWidth = maxX - minX + 50;
    const graphHeight = maxY - minY + 50;

    const scaleX = canvasWidth / graphWidth;
    const scaleY = canvasHeight / graphHeight;
    const newZoom = Math.min(1.2, Math.max(0.4, Math.min(scaleX, scaleY) * 0.9));

    setZoom(newZoom);
    setPan({
      x: Math.round((canvasWidth - graphWidth * newZoom) / 2 - minX * newZoom),
      y: Math.round((canvasHeight - graphHeight * newZoom) / 2 - minY * newZoom)
    });
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    addGraphNode({
      label: newNodeLabel.trim(),
      type: newNodeType,
      x: Math.round((-pan.x + 300) / zoom),
      y: Math.round((-pan.y + 200) / zoom)
    });

    setNewNodeLabel('');
    setIsAddingNode(false);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(graphModel, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `modelo_genomico_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.nodes && parsed.edges) {
          updateGraphModel(parsed);
        }
      } catch {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  // Add suggested elements from Discovery Log
  const handleAddFromLog = (label: string, type: GraphNodeType) => {
    if (graphModel.nodes.some(n => n.label.toLowerCase() === label.toLowerCase())) return;
    addGraphNode({
      label,
      type,
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 300
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 select-none">
      {/* Top Controls Toolbar */}
      <div className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl shadow-xl border transition-colors ${
        isLight ? 'bg-white border-slate-200' : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            isLight ? 'bg-cyan-50 text-cyan-700 border-cyan-200' : 'bg-cyan-950 text-cyan-400 border-cyan-800'
          }`}>
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className={`text-[10px] font-mono uppercase tracking-wider ${
              isLight ? 'text-cyan-700' : 'text-cyan-400'
            }`}>
              Espacio de Modelado Conceptual
            </div>
            <h2 className={`text-sm sm:text-base font-bold flex items-center gap-2 ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              <span>{graphModel.title}</span>
              <span className={`text-xs font-mono font-normal ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}>
                ({graphModel.nodes.length} nodos, {graphModel.edges.length} relaciones)
              </span>
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Node Button */}
          <button
            onClick={() => setIsAddingNode(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold transition-all shadow-md shadow-cyan-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Nodo</span>
          </button>

          {/* Connect Mode Toggle */}
          <button
            onClick={() => {
              setIsConnecting(!isConnecting);
              setConnectSourceId(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
              isConnecting
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse font-bold'
                : isLight
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-900'
                : 'bg-slate-950 text-slate-300 border-slate-700 hover:text-white'
            }`}
          >
            <span>{isConnecting ? '1. Haz clic en origen y luego destino' : 'Conectar Nodos'}</span>
          </button>

          {/* Evaluate Rubric Button */}
          <button
            onClick={() => {
              evaluateCurrentGraph();
              setShowRubricModal(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-bold shadow-md shadow-emerald-950"
          >
            <Award className="w-4 h-4" />
            <span>Evaluar Mi Modelo (10 pts)</span>
          </button>

          {/* Reorganize Button */}
          <button
            onClick={handleAutoReorganize}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition-all shadow-sm ${
              isLight 
                ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 border-teal-300' 
                : 'bg-teal-950/80 text-teal-300 hover:bg-teal-900 border-teal-700'
            }`}
            title="Auto-reorganizar nodos en columnas biológicas limpias"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Reorganizar Red</span>
            <span className="sm:hidden">Reorganizar</span>
          </button>

          {/* Template / Reset */}
          <button
            onClick={loadTemplateGraph}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-slate-100 text-slate-600 hover:text-cyan-700 border-slate-300' 
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300 border-slate-800'
            }`}
            title="Cargar plantilla de referencia inicial"
          >
            <Lightbulb className="w-4 h-4" />
          </button>
          <button
            onClick={resetGraph}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-slate-100 text-slate-600 hover:text-rose-600 border-slate-300' 
                : 'bg-slate-950 text-slate-400 hover:text-rose-400 border-slate-800'
            }`}
            title="Vaciar lienzo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Export / Import JSON */}
          <button
            onClick={handleExportJSON}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-slate-100 text-slate-600 hover:text-cyan-700 border-slate-300' 
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300 border-slate-800'
            }`}
            title="Exportar modelo en JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-1.5 rounded-lg border transition-colors ${
              isLight 
                ? 'bg-slate-100 text-slate-600 hover:text-cyan-700 border-slate-300' 
                : 'bg-slate-950 text-slate-400 hover:text-cyan-300 border-slate-800'
            }`}
            title="Importar modelo JSON"
          >
            <Upload className="w-4 h-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJSON}
            className="hidden"
          />
        </div>
      </div>

      {/* Main Canvas + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Visual Graph Canvas (9 cols) */}
        <div 
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleCanvasTouchStart}
          onTouchMove={handleCanvasTouchMove}
          onTouchEnd={handleCanvasTouchEnd}
          onTouchCancel={handleCanvasTouchEnd}
          className={`lg:col-span-9 h-[540px] sm:h-[640px] rounded-2xl relative overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing select-none border transition-colors touch-none ${
            isLight ? 'bg-slate-100 border-slate-300' : 'bg-slate-950 border-slate-800'
          }`}
        >
          {/* Laboratory grid */}
          <div 
            className={`absolute inset-0 [background-size:24px_24px] pointer-events-none ${
              isLight 
                ? 'bg-[radial-gradient(#94a3b8_1.5px,transparent_1.5px)]' 
                : 'bg-[radial-gradient(#1e293b_1.5px,transparent_1.5px)]'
            }`}
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          />

          {/* Floating Mobile Control Bar (Top Left) */}
          <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 p-1 rounded-xl backdrop-blur-md border shadow-lg bg-slate-900/90 border-slate-800 text-xs">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setMobileMode('drag')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                  mobileMode === 'drag'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Mover: Toca y arrastra nodos"
              >
                <Hand className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mover</span>
              </button>
              <button
                onClick={() => setMobileMode('pan')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 transition-colors ${
                  mobileMode === 'pan'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Modo Desplazar: Arrastra el lienzo para navegar"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Lienzo</span>
              </button>
            </div>

            {/* Quick Reorganize button */}
            <button
              onClick={handleAutoReorganize}
              className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-[11px] font-mono font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
              title="Auto-reorganizar nodos en columnas lógicas"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-200" />
              <span>Reorganizar</span>
            </button>

            {/* Center / Fit to screen */}
            <button
              onClick={handleFitToScreen}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Ajustar y centrar todos los nodos en la pantalla"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

          {/* Floating Precision Nudge Tool for Selected Node (Mobile & Desktop) */}
          {selectedNode && (
            <div className={`absolute top-3 right-3 z-30 p-2.5 rounded-xl border backdrop-blur-md shadow-2xl text-xs space-y-2 max-w-[210px] transition-all animate-in fade-in zoom-in-95 ${
              isLight ? 'bg-white/95 border-cyan-400 text-slate-800' : 'bg-slate-900/95 border-cyan-700/80 text-white'
            }`}>
              <div className="flex items-center justify-between border-b pb-1 text-[11px] font-mono">
                <span className="font-bold truncate text-cyan-400" title={selectedNode.label}>
                  {selectedNode.label}
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="text-slate-400 hover:text-white font-bold px-1 ml-1 cursor-pointer"
                  title="Deseleccionar"
                >
                  ✕
                </button>
              </div>

              {/* Directional Pad */}
              <div className="space-y-1">
                <div className="text-[10px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
                  <Move className="w-3 h-3 text-cyan-400" />
                  <span>Ajuste fino de posición:</span>
                </div>
                <div className="grid grid-cols-3 gap-1 w-28 mx-auto">
                  <div />
                  <button
                    onClick={() => handleNudgeNode(0, -35)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div />
                  <button
                    onClick={() => handleNudgeNode(-35, 0)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Mover izquierda"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleNudgeNode(0, 35)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleNudgeNode(35, 0)}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-cyan-600 text-slate-200 flex items-center justify-center font-bold cursor-pointer"
                    title="Mover derecha"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Node Actions */}
              <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-slate-700/60 font-mono text-[10px]">
                <button
                  onClick={() => {
                    setIsConnecting(true);
                    setConnectSourceId(selectedNode.id);
                  }}
                  className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors cursor-pointer"
                >
                  Conectar
                </button>
                <button
                  onClick={() => {
                    deleteGraphNode(selectedNode.id);
                    setSelectedNodeId(null);
                  }}
                  className="p-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                  title="Eliminar nodo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Floating Canvas Controls: Zoom, Center */}
          <div className={`absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl backdrop-blur-sm border shadow-md ${
            isLight ? 'bg-white/95 border-slate-300 text-slate-600' : 'bg-slate-900/90 border-slate-800 text-slate-400'
          }`}>
            <button
              onClick={() => setZoom(z => Math.max(0.4, z - 0.1))}
              className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className={`px-2 text-xs font-mono font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(2.0, z + 0.1))}
              className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-slate-800 hover:text-white'}`}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleFitToScreen}
              className={`p-1.5 rounded-lg ${isLight ? 'hover:bg-slate-100 hover:text-slate-900' : 'hover:bg-slate-800 hover:text-white'}`}
              title="Ajustar y centrar todos los nodos"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Layer for Connections */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            <defs>
              <marker
                id="arrow"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={isLight ? '#0284c7' : '#38bdf8'} />
              </marker>
              <marker
                id="arrow-inhibits"
                viewBox="0 0 10 10"
                refX="22"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={isLight ? '#e11d48' : '#f43f5e'} />
              </marker>
            </defs>

            {graphModel.edges.map(edge => {
              const srcNode = graphModel.nodes.find(n => n.id === edge.source);
              const tgtNode = graphModel.nodes.find(n => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              // Node box dimensions: approx 150x55
              const srcX = srcNode.x + 75;
              const srcY = srcNode.y + 25;
              const tgtX = tgtNode.x + 75;
              const tgtY = tgtNode.y + 25;

              const isSelected = selectedEdgeId === edge.id;
              const isInhibits = edge.relation === 'inhibe';

              // Midpoint for text label
              const midX = (srcX + tgtX) / 2;
              const midY = (srcY + tgtY) / 2;

              return (
                <g 
                  key={edge.id}
                  className="pointer-events-auto cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEdgeId(edge.id);
                    setSelectedNodeId(null);
                  }}
                >
                  {/* Invisible thicker stroke for easy clicking */}
                  <line
                    x1={srcX}
                    y1={srcY}
                    x2={tgtX}
                    y2={tgtY}
                    stroke="transparent"
                    strokeWidth="16"
                  />
                  {/* Visible edge line */}
                  <line
                    x1={srcX}
                    y1={srcY}
                    x2={tgtX}
                    y2={tgtY}
                    stroke={
                      isInhibits 
                        ? (isLight ? '#e11d48' : '#f43f5e') 
                        : isSelected 
                        ? (isLight ? '#0284c7' : '#38bdf8') 
                        : (isLight ? '#64748b' : '#64748b')
                    }
                    strokeWidth={isSelected ? 3 : 2}
                    strokeDasharray={edge.condition ? '4 4' : undefined}
                    markerEnd={isInhibits ? 'url(#arrow-inhibits)' : 'url(#arrow)'}
                  />
                  {/* Relation label box */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-55"
                      y="-11"
                      width="110"
                      height="22"
                      rx="6"
                      fill={isLight ? '#ffffff' : '#090d16'}
                      stroke={isSelected ? (isLight ? '#0284c7' : '#38bdf8') : (isLight ? '#cbd5e1' : '#334155')}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={
                        isInhibits 
                          ? (isLight ? '#be123c' : '#fda4af') 
                          : (isLight ? '#1e293b' : '#cbd5e1')
                      }
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {edge.relation.replace(/_/g, ' ')}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Nodes Layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: '0 0'
            }}
          >
            {graphModel.nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isConnectingSource = connectSourceId === node.id;
              const isHolding = touchHoldingNodeId === node.id || (draggingNodeId === node.id && mobileMode === 'drag');
              const colors = getNodeClasses(node.type, isLight);

              return (
                <div
                  key={node.id}
                  onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  onTouchStart={(e) => handleNodeTouchStart(e, node.id)}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    width: '150px'
                  }}
                  className={`absolute p-2.5 rounded-xl border pointer-events-auto transition-transform select-none cursor-grab active:cursor-grabbing shadow-lg touch-none ${
                    colors.bg
                  } ${colors.border} ${
                    isHolding
                      ? 'ring-4 ring-cyan-400 scale-110 shadow-2xl z-30'
                      : isSelected
                      ? isLight ? 'ring-2 ring-cyan-600 shadow-xl scale-105 z-20' : 'ring-2 ring-white shadow-2xl scale-105 z-20'
                      : isConnectingSource
                      ? 'ring-2 ring-amber-400 animate-pulse z-20'
                      : 'hover:scale-[1.02] z-10'
                  }`}
                >
                  {isHolding && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-600 text-white font-mono text-[9px] font-bold shadow-md uppercase tracking-wider flex items-center gap-1 whitespace-nowrap">
                      <span>✋ Sosteniendo</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                    <span className={`uppercase font-bold tracking-wider truncate ${colors.text}`}>
                      {colors.label}
                    </span>
                    <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-slate-700' : 'bg-current'}`} />
                  </div>

                  <div className={`text-xs font-bold leading-tight break-words ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {node.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Sidebar: Node & Edge Inspector + Discovery Palette (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Connection Settings Bar if Connecting */}
          {isConnecting && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 transition-colors ${
              isLight 
                ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-sm' 
                : 'bg-amber-950/70 border-amber-500 text-amber-200'
            }`}>
              <span className="font-mono font-bold block uppercase text-[10px]">
                Modo de Conexión Activo
              </span>
              <p className={`text-[11px] ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                {!connectSourceId 
                  ? 'Paso 1: Haz clic en el nodo de ORIGEN en el lienzo.' 
                  : 'Paso 2: Ahora haz clic en el nodo de DESTINO.'}
              </p>

              <div>
                <label className={`text-[10px] font-mono block mb-1 ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
                  Tipo de relación:
                </label>
                <select
                  value={selectedRelation}
                  onChange={(e) => setSelectedRelation(e.target.value as GraphEdgeType)}
                  className={`w-full rounded-lg p-1.5 text-xs font-mono focus:outline-none border transition-colors ${
                    isLight 
                      ? 'bg-white border-amber-300 text-slate-900' 
                      : 'bg-slate-950 border-amber-600 text-white'
                  }`}
                >
                  {EDGE_RELATIONS.map(rel => (
                    <option key={rel.id} value={rel.id}>
                      {rel.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`text-[10px] font-mono block mb-1 ${isLight ? 'text-amber-900' : 'text-amber-400'}`}>
                  Condición (opcional):
                </label>
                <input
                  type="text"
                  value={edgeCondition}
                  onChange={(e) => setEdgeCondition(e.target.value)}
                  placeholder="ej. en presencia de molde..."
                  className={`w-full rounded-lg p-1.5 text-xs font-mono focus:outline-none border transition-colors ${
                    isLight 
                      ? 'bg-white border-amber-300 text-slate-900' 
                      : 'bg-slate-950 border-amber-600 text-white'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Inspector Panel for Selected Node */}
          {selectedNodeId && (
            <div className={`p-4 rounded-xl border text-xs space-y-3 transition-colors ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-cyan-800'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <span className={`font-mono font-bold uppercase text-[10px] ${
                  isLight ? 'text-cyan-700' : 'text-cyan-400'
                }`}>
                  Propiedades del Nodo
                </span>
                <button
                  onClick={() => deleteGraphNode(selectedNodeId)}
                  className="text-rose-500 hover:text-rose-600 p-1"
                  title="Eliminar nodo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {(() => {
                const node = graphModel.nodes.find(n => n.id === selectedNodeId);
                if (!node) return null;
                return (
                  <div className="space-y-2">
                    <div>
                      <label className={`text-[10px] font-mono block mb-1 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Etiqueta:
                      </label>
                      <input
                        type="text"
                        value={node.label}
                        onChange={(e) => updateGraphNode(node.id, { label: e.target.value })}
                        className={`w-full rounded-lg p-1.5 text-xs font-sans focus:outline-none border transition-colors ${
                          isLight 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600' 
                            : 'bg-slate-950 border-slate-700 text-white focus:border-cyan-500'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`text-[10px] font-mono block mb-1 ${
                        isLight ? 'text-slate-600' : 'text-slate-400'
                      }`}>
                        Tipo de elemento:
                      </label>
                      <select
                        value={node.type}
                        onChange={(e) => updateGraphNode(node.id, { type: e.target.value as GraphNodeType })}
                        className={`w-full rounded-lg p-1.5 text-xs font-mono focus:outline-none border transition-colors ${
                          isLight 
                            ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600' 
                            : 'bg-slate-950 border-slate-700 text-white focus:border-cyan-500'
                        }`}
                      >
                        {Object.entries(NODE_COLORS).map(([t, info]) => (
                          <option key={t} value={t}>
                            {info.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Inspector Panel for Selected Edge */}
          {selectedEdgeId && (
            <div className={`p-4 rounded-xl border text-xs space-y-3 transition-colors ${
              isLight ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-900 border-cyan-800'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <span className={`font-mono font-bold uppercase text-[10px] ${
                  isLight ? 'text-cyan-700' : 'text-cyan-400'
                }`}>
                  Propiedades de la Relación
                </span>
                <button
                  onClick={() => {
                    deleteGraphEdge(selectedEdgeId);
                    setSelectedEdgeId(null);
                  }}
                  className="text-rose-500 hover:text-rose-600 p-1"
                  title="Eliminar relación"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {(() => {
                const edge = graphModel.edges.find(e => e.id === selectedEdgeId);
                if (!edge) return null;
                return (
                  <div className="space-y-2">
                    <div className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
                      Relación: <strong className={`font-mono ${isLight ? 'text-cyan-700' : 'text-cyan-300'}`}>{edge.relation}</strong>
                    </div>
                    {edge.condition && (
                      <div className={`text-[11px] ${isLight ? 'text-amber-800' : 'text-amber-300'}`}>
                        Condición: {edge.condition}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick Discoveries Palette (From student bitácora) */}
          <div className={`p-4 rounded-xl border text-xs space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-slate-900 border-slate-800'
          }`}>
            <h4 className={`font-mono font-bold uppercase text-[10px] flex items-center gap-1.5 ${
              isLight ? 'text-slate-800' : 'text-slate-300'
            }`}>
              <Plus className={`w-3.5 h-3.5 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
              <span>Elementos Sugeridos de tu Bitácora</span>
            </h4>
            <p className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Haz clic para agregar conceptos descubiertos en tus rondas:
            </p>

            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto">
              <button
                onClick={() => handleAddFromLog('Radiación UVB', 'damage_source')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100' 
                    : 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900'
                }`}
              >
                + Radiación UVB
              </button>
              <button
                onClick={() => handleAddFromLog('Dímero de Pirimidinas', 'lesion')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100' 
                    : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900'
                }`}
              >
                + Dímero Timina
              </button>
              <button
                onClick={() => handleAddFromLog('NER', 'mechanism')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100' 
                    : 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                }`}
              >
                + NER
              </button>
              <button
                onClick={() => handleAddFromLog('8-oxoguanina', 'lesion')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100' 
                    : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900'
                }`}
              >
                + 8-oxoguanina
              </button>
              <button
                onClick={() => handleAddFromLog('BER', 'mechanism')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100' 
                    : 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                }`}
              >
                + BER
              </button>
              <button
                onClick={() => handleAddFromLog('Rotura de doble hebra (DSB)', 'lesion')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100' 
                    : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900'
                }`}
              >
                + DSB
              </button>
              <button
                onClick={() => handleAddFromLog('Fase G2 / Cromátida hermana', 'condition')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100' 
                    : 'bg-indigo-950/60 border-indigo-800 text-indigo-300 hover:bg-indigo-900'
                }`}
              >
                + Fase G2
              </button>
              <button
                onClick={() => handleAddFromLog('Fase G1 (Sin cromátida)', 'condition')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-900 hover:bg-indigo-100' 
                    : 'bg-indigo-950/60 border-indigo-800 text-indigo-300 hover:bg-indigo-900'
                }`}
              >
                + Fase G1
              </button>
              <button
                onClick={() => handleAddFromLog('Recombinación Homóloga (HR)', 'mechanism')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100' 
                    : 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                }`}
              >
                + HR
              </button>
              <button
                onClick={() => handleAddFromLog('NHEJ', 'mechanism')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 hover:bg-cyan-100' 
                    : 'bg-cyan-950/60 border-cyan-800 text-cyan-300 hover:bg-cyan-900'
                }`}
              >
                + NHEJ
              </button>
              <button
                onClick={() => handleAddFromLog('Restauración Fiel sin Mutación', 'outcome')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100' 
                    : 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                }`}
              >
                + Restauración Fiel
              </button>
              <button
                onClick={() => handleAddFromLog('Deleción / Indel mutagénico', 'outcome')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100' 
                    : 'bg-amber-950/60 border-amber-800 text-amber-300 hover:bg-amber-900'
                }`}
              >
                + Indel
              </button>
              <button
                onClick={() => handleAddFromLog('Detención de ciclo / Apoptosis', 'consequence')}
                className={`px-2 py-1 rounded-md text-[10px] font-mono border transition-colors ${
                  isLight 
                    ? 'bg-fuchsia-50 border-fuchsia-300 text-fuchsia-900 hover:bg-fuchsia-100' 
                    : 'bg-fuchsia-950/60 border-fuchsia-800 text-fuchsia-300 hover:bg-fuchsia-900'
                }`}
              >
                + Parada / Apoptosis
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Node Modal */}
      {isAddingNode && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateNode}
            className={`w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 text-xs border transition-colors ${
              isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-cyan-800 text-white'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <Plus className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
                <span>Agregar Nuevo Nodo al Modelo</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNode(false)}
                className={`p-1 ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <div>
              <label className={`text-[11px] font-mono block mb-1 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Nombre / Etiqueta del Nodo:
              </label>
              <input
                type="text"
                value={newNodeLabel}
                onChange={(e) => setNewNodeLabel(e.target.value)}
                placeholder="ej. Recombinación Homóloga, O6-metilguanina, Fase G2..."
                className={`w-full p-2.5 rounded-xl border text-xs focus:outline-none transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600' 
                    : 'bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-500'
                }`}
                autoFocus
              />
            </div>

            <div>
              <label className={`text-[11px] font-mono block mb-1 ${
                isLight ? 'text-slate-700' : 'text-slate-300'
              }`}>
                Categoría conceptual:
              </label>
              <select
                value={newNodeType}
                onChange={(e) => setNewNodeType(e.target.value as GraphNodeType)}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono focus:outline-none transition-colors ${
                  isLight 
                    ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-cyan-600' 
                    : 'bg-slate-950 border-slate-700 text-slate-200 focus:border-cyan-500'
                }`}
              >
                {Object.entries(NODE_COLORS).map(([t, info]) => (
                  <option key={t} value={t}>
                    {info.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 border-t ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <button
                type="button"
                onClick={() => setIsAddingNode(false)}
                className={`px-4 py-2 rounded-xl transition-colors ${
                  isLight 
                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold"
              >
                Crear Nodo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rubric Evaluation Modal (10 points) */}
      {showRubricModal && rubricEvaluation && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-xs my-8 border transition-colors ${
            isLight ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-900 border-cyan-800 text-slate-200'
          }`}>
            {/* Modal Header with Total Score */}
            <div className={`flex items-start justify-between border-b pb-4 ${
              isLight ? 'border-slate-200' : 'border-slate-800'
            }`}>
              <div>
                <div className={`flex items-center gap-2 font-mono text-xs font-bold uppercase ${
                  isLight ? 'text-cyan-700' : 'text-cyan-400'
                }`}>
                  <Award className="w-4 h-4" />
                  <span>Rúbrica de Evaluación del Modelo Conceptual</span>
                </div>
                <h3 className={`text-xl font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Calificación Científica: {rubricEvaluation.totalScore} / 10
                </h3>
              </div>

              <button
                onClick={() => setShowRubricModal(false)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isLight ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Rubric Criteria Breakdown */}
            <div className="space-y-3">
              {rubricEvaluation.feedbackList.map((item, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border space-y-1 transition-colors ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/80 border-slate-800'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>{item.criterion}</span>
                    <span className={`font-mono font-bold ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                      {item.score} / {item.maxScore} pts
                    </span>
                  </div>
                  <ul className={`text-[11px] space-y-0.5 list-disc list-inside ${
                    isLight ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {item.comments.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Strengths and Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rubricEvaluation.strengths.length > 0 && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                }`}>
                  <span className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Fortalezas Identificadas:</span>
                  </span>
                  <ul className={`text-[11px] list-disc list-inside space-y-0.5 ${
                    isLight ? 'text-emerald-800' : 'text-slate-300'
                  }`}>
                    {rubricEvaluation.strengths.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rubricEvaluation.suggestions.length > 0 && (
                <div className={`p-3 rounded-xl border space-y-1 ${
                  isLight 
                    ? 'bg-amber-50 border-amber-300 text-amber-900' 
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                }`}>
                  <span className="font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Oportunidades de Mejora:</span>
                  </span>
                  <ul className={`text-[11px] list-disc list-inside space-y-0.5 ${
                    isLight ? 'text-amber-800' : 'text-slate-300'
                  }`}>
                    {rubricEvaluation.suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Uncertain relations for teacher review */}
            {rubricEvaluation.uncertainRelations.length > 0 && (
              <div className={`p-3 rounded-xl border text-[11px] space-y-1 ${
                isLight 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-900' 
                  : 'bg-indigo-950/40 border-indigo-800 text-indigo-300'
              }`}>
                <span className="font-bold block">Marcadas para Discusión con el Profesor:</span>
                <ul className={`list-disc list-inside ${isLight ? 'text-indigo-800' : 'text-slate-300'}`}>
                  {rubricEvaluation.uncertainRelations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowRubricModal(false)}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs"
              >
                Continuar Refinando Modelo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
