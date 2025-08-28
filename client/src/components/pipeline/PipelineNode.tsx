import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAgentTypeById } from '@/lib/agentTypes';
import { useLanguage } from '@/hooks/useLanguage';

interface PipelineNodeProps {
  id: string;
  agentId: string;
  position: { x: number; y: number };
  status: 'idle' | 'running' | 'success' | 'error';
  metrics: Record<string, any>;
  isSelected: boolean;
  isConnecting?: boolean;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
  onConnectionStart?: (id: string) => void;
}

export default function PipelineNode({
  id,
  agentId,
  position,
  status,
  metrics,
  isSelected,
  isConnecting = false,
  onSelect,
  onPositionChange,
  onConnectionStart,
}: PipelineNodeProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });

  const agentType = getAgentTypeById(agentId);
  if (!agentType) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    
    const handleMouseMove = (e: MouseEvent) => {
      const newPosition = {
        x: Math.max(0, e.clientX - dragStartPos.current.x),
        y: Math.max(0, e.clientY - dragStartPos.current.y),
      };
      
      onPositionChange(id, newPosition);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onSelect(id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(id);
  };

  const getStatusColor = () => {
    switch (status) {
      case 'running':
        return 'border-green-400 shadow-green-100';
      case 'success':
        return 'border-blue-400 shadow-blue-100';
      case 'error':
        return 'border-red-400 shadow-red-100';
      default:
        return 'border-gray-200 shadow-gray-100';
    }
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'running':
        return <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>;
      case 'success':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>;
      case 'error':
        return <div className="w-2 h-2 bg-red-500 rounded-full"></div>;
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>;
    }
  };

  const renderMetrics = () => {
    const metricEntries = Object.entries(metrics);
    if (metricEntries.length === 0) return null;

    return metricEntries.slice(0, 2).map(([key, value], index) => (
      <div key={key} className="flex justify-between text-xs">
        <span className="text-gray-500 capitalize">{key}:</span>
        <span className={`${key.includes('rate') || key.includes('accuracy') || key.includes('valid') 
          ? 'text-green-600 font-medium' : 'text-gray-700'}`}>
          {value}
        </span>
      </div>
    ));
  };

  const renderTooltipMetrics = () => {
    const metricEntries = Object.entries(metrics);
    return metricEntries.map(([key, value]) => (
      <div key={key} className="capitalize">{key}: {value}</div>
    ));
  };

  return (
    <motion.div
      ref={nodeRef}
      className={`absolute bg-white border-2 rounded-xl p-6 shadow-lg cursor-pointer select-none
        ${getStatusColor()} 
        ${isSelected ? 'ring-2 ring-dingl-blue' : ''} 
        ${isConnecting ? 'ring-2 ring-blue-400 bg-blue-50' : ''}
        ${isDragging ? 'cursor-grabbing z-50' : 'cursor-grab hover:z-10'}
        ${isHovered ? 'transform scale-105 shadow-xl' : ''}`}
      style={{ left: position.x, top: position.y, width: 200 }}
      data-node-id={id}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Status Indicator */}
      <div className="absolute top-2 right-2 flex items-center space-x-1">
        {onConnectionStart && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Plus button clicked for node:', id);
              onConnectionStart(id);
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`w-6 h-6 text-white rounded-full text-xs transition-colors flex items-center justify-center ${
              isConnecting ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            title={isConnecting ? "Click another node to connect" : "Connect to another node"}
          >
            {isConnecting ? '→' : '+'}
          </button>
        )}
        {getStatusIndicator()}
      </div>

      <div className="flex items-center space-x-3 mb-3">
        <div className={`w-10 h-10 ${agentType.bgColor.replace('50', '100')} rounded-lg flex items-center justify-center`}>
          <i className={`${agentType.icon} ${agentType.color}`}></i>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{t(agentType.id as any) || agentType.name}</div>
          <div className="text-xs text-gray-500">{agentType.description}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        {renderMetrics()}
      </div>

      {/* Hover Tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-50 pointer-events-none"
        >
          <div className="font-medium">{t(agentType.id as any) || agentType.name}</div>
          {renderTooltipMetrics()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </motion.div>
      )}
    </motion.div>
  );
}
