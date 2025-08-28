import { useEffect, useState } from 'react';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import Header from '@/components/layout/Header';
import StatusBar from '@/components/layout/StatusBar';
import AgentLibrary from '@/components/pipeline/AgentLibrary';
import PipelineCanvas from '@/components/pipeline/PipelineCanvas';
import PropertiesPanel from '@/components/pipeline/PropertiesPanel';
import PipelineSelector from '@/components/pipeline/PipelineSelector';
import { usePipeline } from '@/hooks/usePipeline';
import { usePipelineManager, PipelineManagerProvider } from '@/hooks/usePipelineManager';
import { Button } from '@/components/ui/button';
import { LanguageProvider } from '@/hooks/useLanguage';

function DashboardContent() {
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const {
    pipeline,
    selectedNode,
    connectingMode,
    addNode,
    updateNode,
    deleteNode,
    selectNode,
    startConnection,
    cancelConnection,
    startMetricsUpdates,
    stopMetricsUpdates,
    setPipeline,
  } = usePipeline();

  const { activePipeline, updatePipeline } = usePipelineManager();

  // Sync with active pipeline when it changes
  useEffect(() => {
    if (activePipeline && activePipeline.id !== pipeline.id) {
      setPipeline({
        id: activePipeline.id,
        name: activePipeline.name,
        description: 'End-to-end business automation',
        status: 'running' as const,
        nodes: activePipeline.nodes || [],
        connections: activePipeline.connections || [],
      });
    }
  }, [activePipeline?.id, setPipeline]);

  // Save pipeline changes back to the manager (throttled)
  useEffect(() => {
    if (activePipeline && pipeline.id === activePipeline.id && pipeline.nodes.length >= 0) {
      const timeoutId = setTimeout(() => {
        updatePipeline(activePipeline.id, {
          nodes: pipeline.nodes,
          connections: pipeline.connections,
        });
      }, 500); // Longer delay to prevent loops
      
      return () => clearTimeout(timeoutId);
    }
  }, [pipeline.nodes.length, pipeline.connections.length, activePipeline?.id, updatePipeline]);

  useEffect(() => {
    startMetricsUpdates();
    return () => stopMetricsUpdates();
  }, [startMetricsUpdates, stopMetricsUpdates]);

  const handleDragStart = (agentId: string, event: React.DragEvent) => {
    // Drag start handled in AgentLibrary
  };

  const handleRunPipeline = () => {
    // TODO: Implement pipeline execution
    console.log('Running pipeline...');
  };

  const handleExpandCanvas = () => {
    // TODO: Implement canvas expansion
    console.log('Expanding canvas...');
  };

  const handleDragOver = (isDragging: boolean) => {
    // Handle drag over state if needed
  };

  const totalProcessed = pipeline.nodes.reduce((sum, node) => {
    const processed = node.metrics.processed || node.metrics.files || node.metrics.reports || 0;
    return sum + (typeof processed === 'number' ? processed : 0);
  }, 0);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-dingl-bg flex flex-col">
        <Header onRunPipeline={handleRunPipeline} onExpandCanvas={handleExpandCanvas} />
        
        {/* Pipeline Selector */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="w-80">
              <PipelineSelector />
            </div>
            <div className="text-sm text-gray-500">
              {pipeline.nodes.length} agents connected
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden relative">
          <AgentLibrary onDragStart={handleDragStart} />
        
          <PipelineCanvas
            nodes={pipeline.nodes}
            connections={pipeline.connections}
            selectedNodeId={pipeline.nodes.find(n => n.id === selectedNode?.id)?.id || null}
            connectingMode={connectingMode}
            onNodeSelect={selectNode}
            onNodePositionChange={(id, position) => updateNode(id, { position })}
            onNodeAdd={addNode}
            onDragOver={handleDragOver}
            onConnectionStart={startConnection}
            onConnectionCancel={cancelConnection}
          />
          
          {/* Panel Toggle Button */}
          <Button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`absolute top-4 right-4 z-50 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 shadow-lg transition-all duration-300 ${
              isPanelOpen ? 'mr-80' : ''
            }`}
            size="sm"
            variant="outline"
          >
            {isPanelOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>
          
          {/* Properties Panel */}
          <div className={`absolute top-0 right-0 h-full bg-white border-l border-gray-200 transition-transform duration-300 ease-in-out z-40 ${
            isPanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`} style={{ width: '320px' }}>
            <PropertiesPanel
              selectedNode={selectedNode}
              onNodeUpdate={updateNode}
              onNodeDelete={deleteNode}
            />
          </div>
        </div>
        
        <StatusBar
          pipelineStatus={pipeline.status}
          processed={totalProcessed}
          successRate="94.2%"
          lastUpdated={`${Math.floor(Math.random() * 10) + 1} seconds ago`}
          onRefresh={() => window.location.reload()}
        />
      </div>
    </LanguageProvider>
  );
}

export default function Dashboard() {
  return (
    <LanguageProvider>
      <PipelineManagerProvider>
        <DashboardContent />
      </PipelineManagerProvider>
    </LanguageProvider>
  );
}