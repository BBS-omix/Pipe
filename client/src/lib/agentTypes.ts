export interface AgentType {
  id: string;
  name: string;
  type: 'data-source' | 'processor' | 'ai' | 'output';
  subtype: string;
  description: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  configuration: Record<string, any>;
}

export const agentTypes: AgentType[] = [
  // Input & Data Ingestion
  {
    id: 'document-intake',
    name: 'Belge Alımı',
    type: 'data-source',
    subtype: 'file',
    description: 'Receive invoices, contracts, forms',
    icon: 'fas fa-inbox',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    configuration: {
      acceptedTypes: ['.pdf', '.jpg', '.png', '.docx'],
      autoClassify: true,
      maxSize: '25MB',
    }
  },
  {
    id: 'email-monitor',
    name: 'E-posta İzleyici',
    type: 'data-source',
    subtype: 'email',
    description: 'Watch inbox for new documents',
    icon: 'fas fa-envelope-open',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    configuration: {
      emailFilters: [],
      attachmentTypes: ['.pdf', '.xlsx'],
      pollInterval: 300,
    }
  },
  {
    id: 'erp-connector',
    name: 'ERP Entegrasyonu',
    type: 'data-source',
    subtype: 'api',
    description: 'Connect to SAP, Oracle, NetSuite',
    icon: 'fas fa-building',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    configuration: {
      system: 'SAP',
      endpoint: '',
      credentials: {},
      syncFrequency: 'hourly',
    }
  },

  // Document Processing & Vision
  {
    id: 'smart-ocr',
    name: 'Akıllı OCR',
    type: 'processor',
    subtype: 'ocr',
    description: 'Extract text with context awareness',
    icon: 'fas fa-eye',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    configuration: {
      language: 'multi',
      preserveLayout: true,
      confidenceThreshold: 0.85,
      preprocessing: 'auto',
    }
  },
  {
    id: 'document-classifier',
    name: 'Belge Sınıflandırıcı',
    type: 'processor',
    subtype: 'classification',
    description: 'Auto-categorize document types',
    icon: 'fas fa-tags',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    configuration: {
      categories: ['invoice', 'contract', 'receipt', 'form'],
      confidenceThreshold: 0.9,
      manualReview: true,
    }
  },
  {
    id: 'data-extractor',
    name: 'Veri Çıkarıcı',
    type: 'processor',
    subtype: 'extraction',
    description: 'Extract key-value pairs',
    icon: 'fas fa-search-plus',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    configuration: {
      fields: ['amount', 'date', 'vendor', 'invoice_number'],
      useTemplates: true,
      fuzzyMatching: true,
    }
  },

  // AI Business Logic
  {
    id: 'business-validator',
    name: 'İş Doğrulayıcı',
    type: 'ai',
    subtype: 'llm',
    description: 'Validate against business rules',
    icon: 'fas fa-check-circle',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    configuration: {
      model: 'gpt-4-turbo',
      businessRules: [],
      validationChecks: ['completeness', 'accuracy', 'compliance'],
      temperature: 0.1,
    }
  },
  {
    id: 'fraud-detector',
    name: 'Dolandırıcılık Tespit Edici',
    type: 'ai',
    subtype: 'mcp',
    description: 'Detect anomalies and fraud',
    icon: 'fas fa-shield-alt',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    configuration: {
      riskThreshold: 0.7,
      mlModel: 'fraud-detection-v2',
      flagActions: ['hold', 'review', 'approve'],
    }
  },
  {
    id: 'compliance-check',
    name: 'Uyumluluk Kontrolü',
    type: 'ai',
    subtype: 'rag',
    description: 'Verify regulatory compliance',
    icon: 'fas fa-balance-scale',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300',
    configuration: {
      regulations: ['SOX', 'GDPR', 'PCI-DSS'],
      vectorDb: 'compliance-rules',
      confidence: 0.8,
    }
  },
  {
    id: 'smart-router',
    name: 'Akıllı Yönlendirici',
    type: 'ai',
    subtype: 'llm',
    description: 'Route to appropriate workflow',
    icon: 'fas fa-route',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    configuration: {
      routingRules: [],
      destinations: [],
      fallbackAction: 'manual_review',
    }
  },

  // Business Actions & Outputs
  {
    id: 'approval-workflow',
    name: 'Onay İş Akışı',
    type: 'output',
    subtype: 'workflow',
    description: 'Trigger approval processes',
    icon: 'fas fa-user-check',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300',
    configuration: {
      approvers: [],
      thresholds: {},
      escalationRules: [],
    }
  },
  {
    id: 'erp-updater',
    name: 'ERP Güncelleyici',
    type: 'output',
    subtype: 'api',
    description: 'Update business systems',
    icon: 'fas fa-sync-alt',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300',
    configuration: {
      targetSystem: '',
      mappingRules: {},
      errorHandling: 'retry',
    }
  },
  {
    id: 'notification-center',
    name: 'Bildirim Merkezi',
    type: 'output',
    subtype: 'notification',
    description: 'Alert stakeholders',
    icon: 'fas fa-bell',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    configuration: {
      channels: ['email', 'slack', 'sms'],
      templates: {},
      scheduling: 'immediate',
    }
  },
  {
    id: 'analytics-reporter',
    name: 'Analitik Raporlayıcı',
    type: 'output',
    subtype: 'report',
    description: 'Generate business insights',
    icon: 'fas fa-chart-line',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-300',
    configuration: {
      reportType: 'dashboard',
      metrics: [],
      frequency: 'daily',
      recipients: [],
    }
  },

  // Additional Data Sources
  {
    id: 'api-gateway',
    name: 'API Ağ Geçidi',
    type: 'data-source',
    subtype: 'api',
    description: 'Connect to external APIs and services',
    icon: 'fas fa-plug',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    configuration: {
      endpoint: '',
      authentication: 'api-key',
      rateLimit: 1000,
      timeout: 30,
    }
  },
  {
    id: 'ftp-connector',
    name: 'FTP Bağlayıcı', 
    type: 'data-source',
    subtype: 'ftp',
    description: 'Monitor and retrieve files from FTP',
    icon: 'fas fa-server',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    configuration: {
      host: '',
      port: 21,
      username: '',
      secure: true,
      watchFolder: '/incoming',
    }
  },
  {
    id: 'web-scraper',
    name: 'Web Scraper',
    type: 'data-source',
    subtype: 'scraper',
    description: 'Extract data from websites',
    icon: 'fas fa-spider',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    configuration: {
      targetUrl: '',
      selectors: {},
      frequency: 'hourly',
      respectRobots: true,
    }
  },

  // Additional Processors
  {
    id: 'pdf-processor',
    name: 'PDF İşleyici',
    type: 'processor',
    subtype: 'pdf',
    description: 'Advanced PDF parsing and extraction',
    icon: 'fas fa-file-pdf',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    configuration: {
      extractTables: true,
      preserveFormatting: true,
      extractImages: false,
      pageRange: 'all',
    }
  },
  {
    id: 'image-analyzer',
    name: 'Görüntü Analizci',
    type: 'processor',
    subtype: 'image',
    description: 'Analyze and extract from images',
    icon: 'fas fa-camera',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    configuration: {
      extractText: true,
      detectObjects: false,
      enhanceQuality: true,
      supportedFormats: ['.jpg', '.png', '.tiff'],
    }
  },
  {
    id: 'data-transformer',
    name: 'Veri Dönüştürücü',
    type: 'processor',
    subtype: 'transformation',
    description: 'Transform and normalize data',
    icon: 'fas fa-exchange-alt',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    configuration: {
      transformations: [],
      outputFormat: 'json',
      validation: true,
      errorHandling: 'skip',
    }
  },
  {
    id: 'quality-checker',
    name: 'Kalite Kontrol',
    type: 'processor',
    subtype: 'validation',
    description: 'Validate data quality and completeness',
    icon: 'fas fa-check-double',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    configuration: {
      qualityRules: [],
      thresholds: { completeness: 0.95, accuracy: 0.9 },
      reportFormat: 'detailed',
    }
  },

  // Additional AI Agents
  {
    id: 'sentiment-analyzer',
    name: 'Duygu Analizci',
    type: 'ai',
    subtype: 'nlp',
    description: 'Analyze sentiment and emotion',
    icon: 'fas fa-smile',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    configuration: {
      model: 'sentiment-v1',
      granularity: 'sentence',
      emotions: ['positive', 'negative', 'neutral'],
      confidence: 0.8,
    }
  },
  {
    id: 'content-generator',
    name: 'İçerik Üretici',
    type: 'ai',
    subtype: 'llm',
    description: 'Generate content using AI',
    icon: 'fas fa-pen-fancy',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    configuration: {
      model: 'gpt-4',
      maxTokens: 2000,
      temperature: 0.7,
      style: 'professional',
    }
  },
  {
    id: 'pattern-detector',
    name: 'Desen Tespit Edici',
    type: 'ai',
    subtype: 'ml',
    description: 'Detect patterns and anomalies',
    icon: 'fas fa-chart-line',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    configuration: {
      algorithm: 'isolation-forest',
      sensitivity: 0.1,
      windowSize: 100,
      alertThreshold: 0.05,
    }
  },
  {
    id: 'language-translator',
    name: 'Dil Çevirmeni',
    type: 'ai',
    subtype: 'nlp',
    description: 'Multi-language translation',
    icon: 'fas fa-language',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    configuration: {
      sourceLanguage: 'auto',
      targetLanguages: ['en', 'tr', 'es', 'fr'],
      preserveFormatting: true,
      quality: 'high',
    }
  },
  {
    id: 'risk-assessor',
    name: 'Risk Değerlendirici',
    type: 'ai',
    subtype: 'ml',
    description: 'AI-powered risk assessment',
    icon: 'fas fa-exclamation-triangle',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    configuration: {
      riskFactors: [],
      riskLevels: ['low', 'medium', 'high', 'critical'],
      scoringModel: 'risk-v2',
      thresholds: { low: 0.3, medium: 0.6, high: 0.8 },
    }
  },

  // Additional Output Agents
  {
    id: 'webhook-sender',
    name: 'Webhook Gönderici',
    type: 'output',
    subtype: 'webhook',
    description: 'Send data via webhooks',
    icon: 'fas fa-arrow-right',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    configuration: {
      webhookUrl: '',
      method: 'POST',
      headers: {},
      retryAttempts: 3,
      timeout: 30,
    }
  },
  {
    id: 'archive-system',
    name: 'Arşiv Sistemi',
    type: 'output',
    subtype: 'storage',
    description: 'Archive processed documents',
    icon: 'fas fa-archive',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    configuration: {
      storageType: 's3',
      retentionPolicy: '7-years',
      encryption: true,
      compression: 'gzip',
    }
  },
  {
    id: 'audit-logger',
    name: 'Denetim Kaydedici',
    type: 'output',
    subtype: 'logging',
    description: 'Log activities for compliance',
    icon: 'fas fa-clipboard-list',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    configuration: {
      logLevel: 'info',
      includePayload: false,
      retention: '5-years',
      format: 'json',
    }
  },
  {
    id: 'email-sender',
    name: 'E-posta Gönderici',
    type: 'output',
    subtype: 'email',
    description: 'Send automated emails',
    icon: 'fas fa-paper-plane',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    configuration: {
      smtpSettings: {},
      templates: {},
      attachments: true,
      tracking: false,
    }
  },
];

export const getAgentTypeById = (id: string): AgentType | undefined => {
  return agentTypes.find(agent => agent.id === id);
};

export const getAgentTypesByCategory = (type: 'data-source' | 'processor' | 'ai' | 'output'): AgentType[] => {
  return agentTypes.filter(agent => agent.type === type);
};
