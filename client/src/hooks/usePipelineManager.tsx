import { createContext, useContext, useState, ReactNode } from 'react';

export interface Pipeline {
  id: string;
  name: string;
  nodes: any[];
  connections: any[];
  createdAt: Date;
  lastModified: Date;
}

interface PipelineManagerContextType {
  pipelines: Pipeline[];
  activePipelineId: string | null;
  activePipeline: Pipeline | null;
  createPipeline: (name: string) => void;
  deletePipeline: (id: string) => void;
  switchPipeline: (id: string) => void;
  renamePipeline: (id: string, name: string) => void;
  updatePipeline: (id: string, updates: Partial<Pipeline>) => void;
}

const PipelineManagerContext = createContext<PipelineManagerContextType | undefined>(undefined);

export function PipelineManagerProvider({ children }: { children: ReactNode }) {
  // Initialize with 5 distinct user story-based pipelines
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: 'field-inspector',
      name: 'Bağımsız Saha Denetçisi',
      nodes: [
        {
          id: 'mobile-capture',
          agentId: 'document-intake',
          position: { x: 100, y: 100 },
          configuration: {},
          status: 'running',
          metrics: { files: 324, formats: 'MP4/JPG/PDF' }
        },
        {
          id: 'gps-tagger',
          agentId: 'data-transformer',
          position: { x: 100, y: 300 },
          configuration: {},
          status: 'success',
          metrics: { coordinates: 324, accuracy: '±2m' }
        },
        {
          id: 'metadata-extractor',
          agentId: 'data-extractor',
          position: { x: 400, y: 100 },
          configuration: {},
          status: 'running',
          metrics: { exif_data: 318, timestamps: 324 }
        },
        {
          id: 'ocr-engine',
          agentId: 'smart-ocr',
          position: { x: 700, y: 100 },
          configuration: {},
          status: 'success',
          metrics: { text_blocks: 1247, confidence: '98.5%' }
        },
        {
          id: 'vision-classifier',
          agentId: 'image-analyzer',
          position: { x: 1000, y: 100 },
          configuration: {},
          status: 'running',
          metrics: { objects: 2156, defects: 47, tags: 412 }
        },
        {
          id: 'asset-matcher',
          agentId: 'pattern-detector',
          position: { x: 700, y: 300 },
          configuration: {},
          status: 'success',
          metrics: { asset_ids: 289, match_rate: '94.2%' }
        },
        {
          id: 'checklist-engine',
          agentId: 'business-validator',
          position: { x: 1300, y: 100 },
          configuration: {},
          status: 'running',
          metrics: { criteria: 156, compliance: '≥90%' }
        },
        {
          id: 'anomaly-detector',
          agentId: 'anomaly-detector',
          position: { x: 1000, y: 300 },
          configuration: {},
          status: 'warning',
          metrics: { anomalies: 23, risk_score: 'Medium' }
        },
        {
          id: 'compliance-checker',
          agentId: 'compliance-check',
          position: { x: 1300, y: 300 },
          configuration: {},
          status: 'success',
          metrics: { regulations: 45, violations: 3 }
        },
        {
          id: 'report-generator',
          agentId: 'analytics-reporter',
          position: { x: 1600, y: 200 },
          configuration: {},
          status: 'success',
          metrics: { reports: 287, same_day: '100%' }
        },
        {
          id: 'client-portal',
          agentId: 'notification-center',
          position: { x: 1900, y: 200 },
          configuration: {},
          status: 'success',
          metrics: { notifications: 287, delivery: 'instant' }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'mobile-capture', target: 'metadata-extractor' },
        { id: 'conn-2', source: 'mobile-capture', target: 'gps-tagger' },
        { id: 'conn-3', source: 'metadata-extractor', target: 'ocr-engine' },
        { id: 'conn-4', source: 'ocr-engine', target: 'vision-classifier' },
        { id: 'conn-5', source: 'vision-classifier', target: 'checklist-engine' },
        { id: 'conn-6', source: 'gps-tagger', target: 'asset-matcher' },
        { id: 'conn-7', source: 'asset-matcher', target: 'anomaly-detector' },
        { id: 'conn-8', source: 'vision-classifier', target: 'anomaly-detector' },
        { id: 'conn-9', source: 'anomaly-detector', target: 'compliance-checker' },
        { id: 'conn-10', source: 'checklist-engine', target: 'compliance-checker' },
        { id: 'conn-11', source: 'compliance-checker', target: 'report-generator' },
        { id: 'conn-12', source: 'report-generator', target: 'client-portal' }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
    },
    {
      id: 'machine-shop',
      name: 'Precision Machine Shop QA',
      nodes: [
        {
          id: 'erp-connector',
          agentId: 'erp-connector',
          position: { x: 100, y: 120 },
          configuration: {},
          status: 'running',
          metrics: { work_orders: 156, active_jobs: 89 }
        },
        {
          id: 'mobile-inspector',
          agentId: 'document-intake',
          position: { x: 100, y: 350 },
          configuration: {},
          status: 'running',
          metrics: { photos: 847, checklists: 156 }
        },
        {
          id: 'wo-parser',
          agentId: 'data-extractor',
          position: { x: 400, y: 120 },
          configuration: {},
          status: 'success',
          metrics: { specifications: 142, tolerances: 89 }
        },
        {
          id: 'step-mapper',
          agentId: 'workflow-orchestrator',
          position: { x: 700, y: 120 },
          configuration: {},
          status: 'running',
          metrics: { steps: 445, sequences: 156 }
        },
        {
          id: 'visual-inspector',
          agentId: 'image-analyzer',
          position: { x: 400, y: 350 },
          configuration: {},
          status: 'success',
          metrics: { measurements: 1247, defects: 23 }
        },
        {
          id: 'tolerance-checker',
          agentId: 'business-validator',
          position: { x: 700, y: 350 },
          configuration: {},
          status: 'running',
          metrics: { dimensions: 334, in_spec: '97.2%' }
        },
        {
          id: 'process-validator',
          agentId: 'compliance-check',
          position: { x: 1000, y: 120 },
          configuration: {},
          status: 'success',
          metrics: { step_coverage: '95%', timestamps: 'verified' }
        },
        {
          id: 'quality-scorer',
          agentId: 'sentiment-analyzer',
          position: { x: 1000, y: 350 },
          configuration: {},
          status: 'running',
          metrics: { quality_score: 8.7, reject_rate: '2.8%' }
        },
        {
          id: 'traceability-engine',
          agentId: 'audit-logger',
          position: { x: 1300, y: 120 },
          configuration: {},
          status: 'success',
          metrics: { lot_tracking: '100%', genealogy: 'complete' }
        },
        {
          id: 'defect-analyzer',
          agentId: 'anomaly-detector',
          position: { x: 1300, y: 350 },
          configuration: {},
          status: 'warning',
          metrics: { patterns: 15, trending: 'up 5%' }
        },
        {
          id: 'qa-reporter',
          agentId: 'analytics-reporter',
          position: { x: 1600, y: 235 },
          configuration: {},
          status: 'success',
          metrics: { certificates: 142, yield: '+5-10%' }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'erp-connector', target: 'wo-parser' },
        { id: 'conn-2', source: 'wo-parser', target: 'step-mapper' },
        { id: 'conn-3', source: 'mobile-inspector', target: 'visual-inspector' },
        { id: 'conn-4', source: 'visual-inspector', target: 'tolerance-checker' },
        { id: 'conn-5', source: 'step-mapper', target: 'process-validator' },
        { id: 'conn-6', source: 'tolerance-checker', target: 'quality-scorer' },
        { id: 'conn-7', source: 'process-validator', target: 'traceability-engine' },
        { id: 'conn-8', source: 'quality-scorer', target: 'defect-analyzer' },
        { id: 'conn-9', source: 'tolerance-checker', target: 'process-validator' },
        { id: 'conn-10', source: 'traceability-engine', target: 'qa-reporter' },
        { id: 'conn-11', source: 'defect-analyzer', target: 'qa-reporter' }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
    },
    {
      id: 'hr-consultancy',
      name: 'HR Consultancy - CV Screening',
      nodes: [
        {
          id: 'cv-aggregator',
          agentId: 'document-intake',
          position: { x: 100, y: 140 },
          configuration: {},
          status: 'running',
          metrics: { cvs: 1847, sources: 'Email/Portal/API' }
        },
        {
          id: 'format-normalizer',
          agentId: 'data-transformer',
          position: { x: 100, y: 360 },
          configuration: {},
          status: 'success',
          metrics: { pdf: 1203, docx: 644, formats: 'normalized' }
        },
        {
          id: 'job-requirement-parser',
          agentId: 'document-classifier',
          position: { x: 380, y: 140 },
          configuration: {},
          status: 'success',
          metrics: { job_specs: 23, criteria: 156, weights: 'assigned' }
        },
        {
          id: 'entity-extractor',
          agentId: 'data-extractor',
          position: { x: 660, y: 140 },
          configuration: {},
          status: 'running',
          metrics: { entities: 1623, skills: 4521, experience: 1847 }
        },
        {
          id: 'skill-matcher',
          agentId: 'sentiment-analyzer',
          position: { x: 940, y: 140 },
          configuration: {},
          status: 'success',
          metrics: { skill_matches: '89%', relevance: 'weighted' }
        },
        {
          id: 'experience-analyzer',
          agentId: 'pattern-detector',
          position: { x: 660, y: 360 },
          configuration: {},
          status: 'running',
          metrics: { years_exp: 'calculated', career_progression: 'analyzed' }
        },
        {
          id: 'education-validator',
          agentId: 'business-validator',
          position: { x: 940, y: 360 },
          configuration: {},
          status: 'success',
          metrics: { degrees: 1456, institutions: 'verified', certifications: 892 }
        },
        {
          id: 'ranking-engine',
          agentId: 'smart-router',
          position: { x: 1220, y: 140 },
          configuration: {},
          status: 'running',
          metrics: { ranked: 1847, top_10_percent: 185, scores: 'normalized' }
        },
        {
          id: 'bias-detector',
          agentId: 'anomaly-detector',
          position: { x: 1220, y: 360 },
          configuration: {},
          status: 'success',
          metrics: { bias_check: 'passed', fairness: '97%', demographic_balance: 'maintained' }
        },
        {
          id: 'pii-scrubber',
          agentId: 'compliance-check',
          position: { x: 1500, y: 140 },
          configuration: {},
          status: 'success',
          metrics: { pii_masked: '100%', gdpr_compliant: 'yes', dlp: 'secured' }
        },
        {
          id: 'shortlist-generator',
          agentId: 'analytics-reporter',
          position: { x: 1780, y: 140 },
          configuration: {},
          status: 'success',
          metrics: { shortlists: 23, candidates: 345, pack_rate: '≥95%' }
        },
        {
          id: 'client-portal',
          agentId: 'notification-center',
          position: { x: 2060, y: 140 },
          configuration: {},
          status: 'success',
          metrics: { delivery: '6h→1h', client_access: 'instant', audit_trail: '95%' }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'cv-aggregator', target: 'job-requirement-parser' },
        { id: 'conn-2', source: 'cv-aggregator', target: 'format-normalizer' },
        { id: 'conn-3', source: 'format-normalizer', target: 'entity-extractor' },
        { id: 'conn-4', source: 'job-requirement-parser', target: 'entity-extractor' },
        { id: 'conn-5', source: 'entity-extractor', target: 'skill-matcher' },
        { id: 'conn-6', source: 'entity-extractor', target: 'experience-analyzer' },
        { id: 'conn-7', source: 'experience-analyzer', target: 'education-validator' },
        { id: 'conn-8', source: 'skill-matcher', target: 'ranking-engine' },
        { id: 'conn-9', source: 'education-validator', target: 'ranking-engine' },
        { id: 'conn-10', source: 'ranking-engine', target: 'bias-detector' },
        { id: 'conn-11', source: 'bias-detector', target: 'pii-scrubber' },
        { id: 'conn-12', source: 'pii-scrubber', target: 'shortlist-generator' },
        { id: 'conn-13', source: 'shortlist-generator', target: 'client-portal' }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
    },
    {
      id: 'energy-utility',
      name: 'Energy Utility - Asset Risk Scoring',
      nodes: [
        {
          id: 'drone-fleet',
          agentId: 'api-gateway',
          position: { x: 100, y: 160 },
          configuration: {},
          status: 'running',
          metrics: { drones: 12, flights: 89, coverage: '2847 km' }
        },
        {
          id: 'simc-connector',
          agentId: 'erp-connector',
          position: { x: 100, y: 380 },
          configuration: {},
          status: 'success',
          metrics: { asset_db: 45612, maintenance: 1247, historical: '5 years' }
        },
        {
          id: 'video-processor',
          agentId: 'data-transformer',
          position: { x: 400, y: 160 },
          configuration: {},
          status: 'running',
          metrics: { video_hours: 156, keyframes: 1523, fps: '30' }
        },
        {
          id: 'metadata-enricher',
          agentId: 'data-extractor',
          position: { x: 400, y: 380 },
          configuration: {},
          status: 'success',
          metrics: { gps_coords: 2341, weather: 'correlated', timestamps: 'synced' }
        },
        {
          id: 'defect-detector',
          agentId: 'image-analyzer',
          position: { x: 700, y: 160 },
          configuration: {},
          status: 'running',
          metrics: { defects: 89, corrosion: 34, damage: 23, insulator: 32 }
        },
        {
          id: 'asset-identifier',
          agentId: 'pattern-detector',
          position: { x: 700, y: 380 },
          configuration: {},
          status: 'success',
          metrics: { towers: 456, lines: 1234, transformers: 89 }
        },
        {
          id: 'gis-mapper',
          agentId: 'smart-router',
          position: { x: 1000, y: 160 },
          configuration: {},
          status: 'running',
          metrics: { gps_accuracy: '±1m', ogiss_match: '98%', topology: 'updated' }
        },
        {
          id: 'risk-calculator',
          agentId: 'sentiment-analyzer',
          position: { x: 1000, y: 380 },
          configuration: {},
          status: 'success',
          metrics: { risk_scores: 2156, critical: 23, high: 89, medium: 234 }
        },
        {
          id: 'alarm-correlator',
          agentId: 'anomaly-detector',
          position: { x: 1300, y: 160 },
          configuration: {},
          status: 'warning',
          metrics: { active_alarms: 23, correlated: 15, false_positive: '12%' }
        },
        {
          id: 'maintenance-scheduler',
          agentId: 'workflow-orchestrator',
          position: { x: 1300, y: 380 },
          configuration: {},
          status: 'running',
          metrics: { work_orders: 67, priority: 'risk-based', schedule: 'optimized' }
        },
        {
          id: 'dashboard-generator',
          agentId: 'analytics-reporter',
          position: { x: 1600, y: 270 },
          configuration: {},
          status: 'success',
          metrics: { dashboards: 12, kpis: 45, real_time: 'yes' }
        },
        {
          id: 'field-notifications',
          agentId: 'notification-center',
          position: { x: 1900, y: 270 },
          configuration: {},
          status: 'success',
          metrics: { crews_notified: 23, response_time: 'hours', trucks: '-15%' }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'drone-fleet', target: 'video-processor' },
        { id: 'conn-2', source: 'simc-connector', target: 'metadata-enricher' },
        { id: 'conn-3', source: 'video-processor', target: 'defect-detector' },
        { id: 'conn-4', source: 'metadata-enricher', target: 'asset-identifier' },
        { id: 'conn-5', source: 'defect-detector', target: 'gis-mapper' },
        { id: 'conn-6', source: 'asset-identifier', target: 'risk-calculator' },
        { id: 'conn-7', source: 'gis-mapper', target: 'alarm-correlator' },
        { id: 'conn-8', source: 'risk-calculator', target: 'alarm-correlator' },
        { id: 'conn-9', source: 'alarm-correlator', target: 'maintenance-scheduler' },
        { id: 'conn-10', source: 'risk-calculator', target: 'maintenance-scheduler' },
        { id: 'conn-11', source: 'maintenance-scheduler', target: 'dashboard-generator' },
        { id: 'conn-12', source: 'dashboard-generator', target: 'field-notifications' }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
    },
    {
      id: 'pharmaceutical-qa',
      name: 'Pharmaceutical QA - BMR Compliance',
      nodes: [
        {
          id: 'lims-connector',
          agentId: 'erp-connector',
          position: { x: 100, y: 180 },
          configuration: {},
          status: 'running',
          metrics: { test_results: 1247, batch_records: 267, lab_data: 'real-time' }
        },
        {
          id: 'mes-connector',
          agentId: 'api-gateway',
          position: { x: 100, y: 400 },
          configuration: {},
          status: 'success',
          metrics: { production_data: 345, equipment: 89, operators: 156 }
        },
        {
          id: 'bmr-parser',
          agentId: 'smart-ocr',
          position: { x: 400, y: 180 },
          configuration: {},
          status: 'running',
          metrics: { pages: 2341, fields: 15678, accuracy: '99.2%' }
        },
        {
          id: 'signature-validator',
          agentId: 'business-validator',
          position: { x: 400, y: 400 },
          configuration: {},
          status: 'success',
          metrics: { signatures: 534, verified: '100%', chain_custody: 'maintained' }
        },
        {
          id: 'data-extractor',
          agentId: 'data-extractor',
          position: { x: 700, y: 180 },
          configuration: {},
          status: 'running',
          metrics: { key_values: 1523, operators: 89, timestamps: 2341 }
        },
        {
          id: 'process-mapper',
          agentId: 'workflow-orchestrator',
          position: { x: 700, y: 400 },
          configuration: {},
          status: 'success',
          metrics: { steps: 456, sequences: 89, deviations: 23 }
        },
        {
          id: 'deviation-detector',
          agentId: 'anomaly-detector',
          position: { x: 1000, y: 180 },
          configuration: {},
          status: 'warning',
          metrics: { deviations: 45, critical: 8, investigations: 12 }
        },
        {
          id: 'compliance-checker',
          agentId: 'compliance-check',
          position: { x: 1000, y: 400 },
          configuration: {},
          status: 'running',
          metrics: { regulations: 156, cfr_21: 'compliant', gmp: 'verified' }
        },
        {
          id: 'capa-router',
          agentId: 'smart-router',
          position: { x: 1300, y: 180 },
          configuration: {},
          status: 'running',
          metrics: { capa_required: 23, routes: 45, assignments: 'auto' }
        },
        {
          id: 'batch-releaser',
          agentId: 'sentiment-analyzer',
          position: { x: 1300, y: 400 },
          configuration: {},
          status: 'success',
          metrics: { batches_reviewed: 267, release_rate: '94%', hold_rate: '6%' }
        },
        {
          id: 'audit-trail',
          agentId: 'audit-logger',
          position: { x: 1600, y: 180 },
          configuration: {},
          status: 'success',
          metrics: { entries: 15678, integrity: '100%', retention: '25 years' }
        },
        {
          id: 'regulatory-reporter',
          agentId: 'analytics-reporter',
          position: { x: 1900, y: 290 },
          configuration: {},
          status: 'success',
          metrics: { reports: 45, review_time: '-60-70%', compliance: '99.8%' }
        }
      ],
      connections: [
        { id: 'conn-1', source: 'lims-connector', target: 'bmr-parser' },
        { id: 'conn-2', source: 'mes-connector', target: 'signature-validator' },
        { id: 'conn-3', source: 'bmr-parser', target: 'data-extractor' },
        { id: 'conn-4', source: 'signature-validator', target: 'process-mapper' },
        { id: 'conn-5', source: 'data-extractor', target: 'deviation-detector' },
        { id: 'conn-6', source: 'process-mapper', target: 'compliance-checker' },
        { id: 'conn-7', source: 'deviation-detector', target: 'capa-router' },
        { id: 'conn-8', source: 'compliance-checker', target: 'batch-releaser' },
        { id: 'conn-9', source: 'capa-router', target: 'audit-trail' },
        { id: 'conn-10', source: 'batch-releaser', target: 'audit-trail' },
        { id: 'conn-11', source: 'deviation-detector', target: 'compliance-checker' },
        { id: 'conn-12', source: 'audit-trail', target: 'regulatory-reporter' }
      ],
      createdAt: new Date(),
      lastModified: new Date(),
    }
  ]);
  
  const [activePipelineId, setActivePipelineId] = useState<string>('field-inspector');

  const activePipeline = pipelines.find(p => p.id === activePipelineId) || null;

  const createPipeline = (name: string) => {
    const newPipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name,
      nodes: [],
      connections: [],
      createdAt: new Date(),
      lastModified: new Date(),
    };
    
    setPipelines(prev => [...prev, newPipeline]);
    setActivePipelineId(newPipeline.id);
  };

  const deletePipeline = (id: string) => {
    if (pipelines.length <= 1) return; // Don't delete the last pipeline
    
    setPipelines(prev => prev.filter(p => p.id !== id));
    
    if (activePipelineId === id) {
      const remainingPipelines = pipelines.filter(p => p.id !== id);
      setActivePipelineId(remainingPipelines[0]?.id || '');
    }
  };

  const switchPipeline = (id: string) => {
    setActivePipelineId(id);
  };

  const renamePipeline = (id: string, name: string) => {
    setPipelines(prev => prev.map(p => 
      p.id === id 
        ? { ...p, name, lastModified: new Date() }
        : p
    ));
  };

  const updatePipeline = (id: string, updates: Partial<Pipeline>) => {
    setPipelines(prev => prev.map(p => 
      p.id === id 
        ? { ...p, ...updates, lastModified: new Date() }
        : p
    ));
  };

  return (
    <PipelineManagerContext.Provider value={{
      pipelines,
      activePipelineId,
      activePipeline,
      createPipeline,
      deletePipeline,
      switchPipeline,
      renamePipeline,
      updatePipeline,
    }}>
      {children}
    </PipelineManagerContext.Provider>
  );
}

export function usePipelineManager() {
  const context = useContext(PipelineManagerContext);
  if (context === undefined) {
    throw new Error('usePipelineManager must be used within a PipelineManagerProvider');
  }
  return context;
}