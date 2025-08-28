import { useRef, useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import PipelineNode from './PipelineNode';
import { getAgentTypeById } from '@/lib/agentTypes';
import { useLanguage } from '@/hooks/useLanguage';

interface PipelineCanvasProps {
  nodes: any[];
  connections: any[];
  selectedNodeId: string | null;
  connectingMode: { from: string | null; to: string | null };
  onNodeSelect: (id: string | null) => void;
  onNodePositionChange: (id: string, position: { x: number; y: number }) => void;
  onNodeAdd: (agentId: string, position: { x: number; y: number }) => string;
  onDragOver: (isDragging: boolean) => void;
  onConnectionStart: (nodeId: string) => void;
  onConnectionCancel: () => void;
}

export default function PipelineCanvas({
  nodes,
  connections,
  selectedNodeId,
  connectingMode,
  onNodeSelect,
  onNodePositionChange,
  onNodeAdd,
  onDragOver,
  onConnectionStart,
  onConnectionCancel,
}: PipelineCanvasProps) {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragOver) {
      setIsDragOver(true);
      onDragOver(true);
    }
  }, [isDragOver, onDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { clientX, clientY } = e;
    if (
      clientX <= rect.left ||
      clientX >= rect.right ||
      clientY <= rect.top ||
      clientY >= rect.bottom
    ) {
      setIsDragOver(false);
      onDragOver(false);
    }
  }, [onDragOver]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDragOver(false);

    const agentId = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('application/x-agent-id');
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !agentId) {
      console.log('Drop failed: no rect or agentId', { rect: !!rect, agentId, dataTypes: Array.from(e.dataTransfer.types) });
      return;
    }

    // Account for zoom and pan transformations
    const canvasX = (e.clientX - rect.left - pan.x) / zoom;
    const canvasY = (e.clientY - rect.top - pan.y) / zoom;

    const position = {
      x: Math.max(0, canvasX - 100), // Offset by node width/2, ensure positive
      y: Math.max(0, canvasY - 60),  // Offset by node height/2, ensure positive
    };

    console.log('Dropping agent:', agentId, 'at position:', position, 'zoom:', zoom, 'pan:', pan);
    const newNodeId = onNodeAdd(agentId, position);
    console.log('Created node with ID:', newNodeId);
  }, [onNodeAdd, onDragOver, zoom, pan]);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === canvasRef.current && !isPanning) {
      if (connectingMode.from) {
        onConnectionCancel();
      } else {
        onNodeSelect(null);
      }
    }
  }, [onNodeSelect, isPanning, connectingMode.from, onConnectionCancel]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    
    // Smoother zoom with finer granularity
    const zoomFactor = 0.05;
    const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
    
    setZoom(prev => {
      const newZoom = Math.max(0.2, Math.min(3, prev + delta));
      return newZoom;
    });
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Allow panning on canvas background, SVG, and empty areas
    if (target === canvasRef.current || 
        target.classList.contains('canvas-background') ||
        target.tagName === 'svg' ||
        target.classList.contains('transformable-content')) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Generate connection paths
  const generatePath = (sourcePos: { x: number; y: number }, targetPos: { x: number; y: number }) => {
    const sourceX = sourcePos.x + 200; // node width
    const sourceY = sourcePos.y + 60;  // node center
    const targetX = targetPos.x;
    const targetY = targetPos.y + 60;

    // Create more curved paths with dynamic control points
    const deltaX = targetX - sourceX;
    const deltaY = targetY - sourceY;
    
    const controlPoint1X = sourceX + Math.abs(deltaX) * 0.5;
    const controlPoint1Y = sourceY + deltaY * 0.3;
    const controlPoint2X = targetX - Math.abs(deltaX) * 0.5;
    const controlPoint2Y = targetY - deltaY * 0.3;

    return `M ${sourceX} ${sourceY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${targetX} ${targetY}`;
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Canvas Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        {/* <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Enterprise Document Processing</h2>
            <p className="text-sm text-gray-500">End-to-end business automation with AI validation and ERP integration</p>
          </div> */}
          <div className="flex items-center space-x-4">
            {connectingMode.from && (
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700 font-medium">Connecting Mode</span>
                <button 
                  onClick={onConnectionCancel}
                  className="text-blue-500 hover:text-blue-700 ml-2"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-dingl-success rounded-full animate-pulse"></div>
              <span className="text-sm text-dingl-success font-medium">Active Pipeline</span>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">11 Agents</span> • <span className="text-dingl-success">1.2K docs/day</span>
            </div>
          </div>
        </div>


      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className={`flex-1 relative bg-gray-50 overflow-hidden select-none ${isDragOver ? 'bg-blue-50' : ''} ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && connectingMode.from) {
            onConnectionCancel();
          }
        }}
        tabIndex={0}
      >
        {/* Transformable Canvas Content */}
        <div 
          className="transformable-content"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            width: '2000px',
            height: '1400px',
            transition: isPanning ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 canvas-background" 
            style={{
              backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
              backgroundSize: `${20 / zoom}px ${20 / zoom}px`
            }}
          ></div>
          
          {/* SVG for connections */}
          <svg 
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none" 
            style={{ zIndex: 1 }}
          >
          <defs>
            <marker 
              id="arrowhead" 
              markerWidth="10" 
              markerHeight="7" 
              refX="9" 
              refY="3.5" 
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/>
            </marker>
          </defs>
          
          {connections.map(connection => {
            const sourceNode = nodes.find(n => n.id === connection.source);
            const targetNode = nodes.find(n => n.id === connection.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const midX = (sourceNode.position.x + 200 + targetNode.position.x) / 2;
            const midY = (sourceNode.position.y + 60 + targetNode.position.y + 60) / 2;
            
            return (
              <g key={connection.id}>
                <path
                  className="stroke-slate-500 stroke-2 fill-none marker-end-[url(#arrowhead)]"
                  d={generatePath(sourceNode.position, targetNode.position)}
                  style={{
                    strokeDasharray: '5,5',
                    animation: 'flow 2s linear infinite',
                  }}
                />
                {connection.label && (
                  <text
                    x={midX}
                    y={midY - 5}
                    className="text-xs fill-gray-600 font-medium"
                    textAnchor="middle"
                    style={{ pointerEvents: 'none' }}
                  >
                    {connection.label}
                  </text>
                )}
                <rect
                  x={midX - connection.label?.length * 3 || 0}
                  y={midY - 15}
                  width={(connection.label?.length || 0) * 6}
                  height={20}
                  className="fill-white opacity-80"
                  style={{ pointerEvents: 'none' }}
                />
              </g>
            );
          })}
        </svg>

          {/* Pipeline Nodes */}
          <div className="absolute inset-0 p-8" style={{ zIndex: 2, pointerEvents: isPanning ? 'none' : 'auto' }}>
            {nodes.map(node => (
              <PipelineNode
                key={node.id}
                id={node.id}
                agentId={node.agentId}
                position={node.position}
                status={node.status}
                metrics={node.metrics}
                isSelected={selectedNodeId === node.id}
                isConnecting={connectingMode.from === node.id}
                onSelect={onNodeSelect}
                onPositionChange={onNodePositionChange}
                onConnectionStart={onConnectionStart}
              />
            ))}

            {/* Drop Zone Indicator */}
            {isDragOver && (
              <div className="absolute inset-0 bg-blue-50 border-2 border-dashed border-dingl-blue rounded-lg flex items-center justify-center text-dingl-blue font-medium z-40 pointer-events-none">
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Drop agent here to add to pipeline</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Connection Mode Indicator */}
        {connectingMode.from && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
            <div className="text-sm font-medium">{t('connectionModeActive')}</div>
            <div className="text-xs">{t('clickNodeToConnect')}</div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute bottom-4 right-4 flex flex-col space-y-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-50">
          <button
            onClick={() => setZoom(prev => Math.min(2, prev * 1.2))}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
          >
            +
          </button>
          <div className="text-xs text-center text-gray-600 font-medium">
            {Math.round(zoom * 100)}%
          </div>
          <button
            onClick={() => setZoom(prev => Math.max(0.5, prev / 1.2))}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
          >
            −
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-xs font-medium"
          >
            ⌂
          </button>
        </div>
      </div>
    </div>
  );
}
