import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface PipelineNode {
  id: string;
  agentId: string;
  position: { x: number; y: number };
  configuration: Record<string, any>;
  status: 'idle' | 'running' | 'success' | 'error';
  metrics: Record<string, any>;
}

interface PipelineConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

interface Pipeline {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'running' | 'stopped' | 'error';
  nodes: PipelineNode[];
  connections: PipelineConnection[];
}

export function usePipeline() {
  const [pipeline, setPipeline] = useState<Pipeline>({
    id: uuidv4(),
    name: 'Enterprise Document Processing Workflow',
    description: 'End-to-end business automation with compliance and fraud detection',
    status: 'running',
    nodes: [
      {
        id: 'intake-1',
        agentId: 'document-intake',
        position: { x: 100, y: 100 },
        configuration: {},
        status: 'running',
        metrics: {
          documents: 1247,
          rate: '15 docs/min',
          types: 'PDF, JPG, DOCX'
        }
      },
      {
        id: 'classifier-1',
        agentId: 'document-classifier',
        position: { x: 450, y: 100 },
        configuration: {},
        status: 'running',
        metrics: {
          classified: 1201,
          accuracy: '97.8%',
          types: 'Invoice, Contract, Receipt'
        }
      },
      {
        id: 'ocr-1',
        agentId: 'smart-ocr',
        position: { x: 800, y: 100 },
        configuration: {},
        status: 'running',
        metrics: {
          accuracy: '98.5%',
          processed: 1180,
          avgTime: '2.3s',
          languages: 'EN, ES, FR'
        }
      },
      {
        id: 'extractor-1',
        agentId: 'data-extractor',
        position: { x: 1150, y: 100 },
        configuration: {},
        status: 'running',
        metrics: {
          fieldsExtracted: '15.2K',
          accuracy: '96.1%',
          keyFields: 'Amount, Date, Vendor'
        }
      },
      {
        id: 'validator-1',
        agentId: 'business-validator',
        position: { x: 275, y: 350 },
        configuration: {
          model: 'gpt-4-turbo',
          temperature: 0.1,
          businessRules: ['amount_validation', 'vendor_verification', 'date_consistency'],
          validationChecks: ['completeness', 'accuracy', 'compliance']
        },
        status: 'running',
        metrics: {
          validRate: '94.2%',
          processed: '1.2M tokens',
          flagged: '67 docs',
          avgTime: '1.8s'
        }
      },
      {
        id: 'fraud-1',
        agentId: 'fraud-detector',
        position: { x: 625, y: 350 },
        configuration: {},
        status: 'running',
        metrics: {
          analyzed: 1156,
          flagged: 23,
          riskScore: 'Low',
          falsePositives: '2.1%'
        }
      },
      {
        id: 'compliance-1',
        agentId: 'compliance-check',
        position: { x: 975, y: 350 },
        configuration: {},
        status: 'running',
        metrics: {
          checked: 1133,
          violations: 4,
          regulations: 'SOX, GDPR',
          passRate: '99.6%'
        }
      },
      {
        id: 'router-1',
        agentId: 'smart-router',
        position: { x: 625, y: 600 },
        configuration: {},
        status: 'running',
        metrics: {
          routed: 1129,
          approvalQueue: 89,
          autoApproved: 1040,
          avgTime: '0.8s'
        }
      },
      {
        id: 'approval-1',
        agentId: 'approval-workflow',
        position: { x: 275, y: 850 },
        configuration: {},
        status: 'running',
        metrics: {
          pending: 89,
          approved: 847,
          rejected: 12,
          avgTime: '4.2h'
        }
      },
      {
        id: 'erp-1',
        agentId: 'erp-updater',
        position: { x: 975, y: 850 },
        configuration: {},
        status: 'running',
        metrics: {
          updated: 1887,
          system: 'SAP',
          successRate: '99.1%',
          errors: 8
        }
      },
      {
        id: 'notifications-1',
        agentId: 'notification-center',
        position: { x: 625, y: 1100 },
        configuration: {},
        status: 'running',
        metrics: {
          sent: 234,
          channels: 'Email, Slack',
          deliveryRate: '99.8%',
          responseTime: '0.3s'
        }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'intake-1',
        target: 'classifier-1',
        label: 'Raw Documents'
      },
      {
        id: 'conn-2',
        source: 'classifier-1',
        target: 'ocr-1',
        label: 'Classified Docs'
      },
      {
        id: 'conn-3',
        source: 'ocr-1',
        target: 'extractor-1',
        label: 'Extracted Text'
      },
      {
        id: 'conn-4',
        source: 'extractor-1',
        target: 'validator-1',
        label: 'Structured Data'
      },
      {
        id: 'conn-5',
        source: 'validator-1',
        target: 'fraud-1',
        label: 'Validated Data'
      },
      {
        id: 'conn-6',
        source: 'fraud-1',
        target: 'compliance-1',
        label: 'Risk Assessed'
      },
      {
        id: 'conn-7',
        source: 'compliance-1',
        target: 'router-1',
        label: 'Compliant Data'
      },
      {
        id: 'conn-8',
        source: 'router-1',
        target: 'approval-1',
        label: 'Requires Approval'
      },
      {
        id: 'conn-9',
        source: 'router-1',
        target: 'erp-1',
        label: 'Auto-Approved'
      },
      {
        id: 'conn-10',
        source: 'approval-1',
        target: 'erp-1',
        label: 'Manually Approved'
      },
      {
        id: 'conn-11',
        source: 'erp-1',
        target: 'notifications-1',
        label: 'Process Complete'
      }
    ]
  });

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('validator-1');
  const [connectingMode, setConnectingMode] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
  const metricsUpdateInterval = useRef<NodeJS.Timeout>();

  const addNode = useCallback((agentId: string, position: { x: number; y: number }) => {
    const newNode: PipelineNode = {
      id: uuidv4(),
      agentId,
      position,
      configuration: {},
      status: 'idle',
      metrics: {}
    };

    setPipeline(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    console.log('Added node:', newNode);
    return newNode.id;
  }, []);

  const updateNode = useCallback((nodeId: string, updates: Partial<PipelineNode>) => {
    setPipeline(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    }));
  }, []);

  const deleteNode = useCallback((nodeId: string) => {
    setPipeline(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== nodeId),
      connections: prev.connections.filter(conn => 
        conn.source !== nodeId && conn.target !== nodeId
      )
    }));

    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  const addConnection = useCallback((source: string, target: string, label?: string) => {
    // Check if connection already exists
    const existingConnection = pipeline.connections.find(
      conn => conn.source === source && conn.target === target
    );
    
    if (existingConnection) return;

    const newConnection: PipelineConnection = {
      id: uuidv4(),
      source,
      target,
      label: label || 'Data Flow',
    };

    setPipeline(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
  }, [pipeline.connections]);

  const deleteConnection = useCallback((connectionId: string) => {
    setPipeline(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== connectionId)
    }));
  }, []);

  const selectNode = useCallback((nodeId: string | null) => {
    if (connectingMode.from && nodeId && connectingMode.from !== nodeId) {
      // Complete connection
      addConnection(connectingMode.from, nodeId);
      setConnectingMode({ from: null, to: null });
    } else if (connectingMode.from) {
      // Cancel connection mode
      setConnectingMode({ from: null, to: null });
    }
    setSelectedNodeId(nodeId);
  }, [connectingMode, addConnection]);

  const startConnection = useCallback((nodeId: string) => {
    console.log('Starting connection from node:', nodeId);
    setConnectingMode({ from: nodeId, to: null });
  }, []);

  const cancelConnection = useCallback(() => {
    setConnectingMode({ from: null, to: null });
  }, []);

  const getSelectedNode = useCallback(() => {
    if (!selectedNodeId) return null;
    return pipeline.nodes.find(node => node.id === selectedNodeId) || null;
  }, [selectedNodeId, pipeline.nodes]);

  // Simulate real-time metrics updates
  const startMetricsUpdates = useCallback(() => {
    if (metricsUpdateInterval.current) {
      clearInterval(metricsUpdateInterval.current);
    }

    metricsUpdateInterval.current = setInterval(() => {
      setPipeline(prev => ({
        ...prev,
        nodes: prev.nodes.map(node => {
          if (node.status !== 'running') return node;
          
          let updatedMetrics = { ...node.metrics };
          
          switch (node.agentId) {
            case 'document-intake':
              updatedMetrics.documents = Math.floor(Math.random() * 100) + 1200;
              break;
            case 'document-classifier':
              updatedMetrics.classified = Math.floor(Math.random() * 50) + 1150;
              break;
            case 'smart-ocr':
              updatedMetrics.processed = Math.floor(Math.random() * 50) + 1150;
              break;
            case 'data-extractor':
              updatedMetrics.fieldsExtracted = (Math.random() * 2 + 14).toFixed(1) + 'K';
              break;
            case 'business-validator':
              updatedMetrics.processed = (Math.random() * 0.5 + 1.0).toFixed(1) + 'M tokens';
              updatedMetrics.flagged = Math.floor(Math.random() * 10) + 60 + ' docs';
              break;
            case 'fraud-detector':
              updatedMetrics.flagged = Math.floor(Math.random() * 10) + 20;
              break;
            case 'compliance-check':
              updatedMetrics.violations = Math.floor(Math.random() * 3) + 3;
              break;
            case 'smart-router':
              updatedMetrics.approvalQueue = Math.floor(Math.random() * 20) + 80;
              break;
            case 'approval-workflow':
              updatedMetrics.pending = Math.floor(Math.random() * 20) + 80;
              break;
            case 'erp-updater':
              updatedMetrics.updated = Math.floor(Math.random() * 50) + 1850;
              updatedMetrics.errors = Math.floor(Math.random() * 5) + 5;
              break;
            case 'notification-center':
              updatedMetrics.sent = Math.floor(Math.random() * 20) + 220;
              break;
          }
          
          return { ...node, metrics: updatedMetrics };
        })
      }));
    }, 3000);
  }, []);

  const stopMetricsUpdates = useCallback(() => {
    if (metricsUpdateInterval.current) {
      clearInterval(metricsUpdateInterval.current);
      metricsUpdateInterval.current = undefined;
    }
  }, []);

  return {
    pipeline,
    selectedNodeId,
    selectedNode: getSelectedNode(),
    connectingMode,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
    selectNode,
    startConnection,
    cancelConnection,
    startMetricsUpdates,
    stopMetricsUpdates,
    setPipeline,
  };
}
