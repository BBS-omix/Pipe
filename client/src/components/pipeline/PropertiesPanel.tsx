import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { getAgentTypeById } from '@/lib/agentTypes';
import { Trash2, Save } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface PropertiesPanelProps {
  selectedNode: any;
  onNodeUpdate: (nodeId: string, updates: any) => void;
  onNodeDelete: (nodeId: string) => void;
}

export default function PropertiesPanel({ selectedNode, onNodeUpdate, onNodeDelete }: PropertiesPanelProps) {
  const { t } = useLanguage();
  const [config, setConfig] = useState(selectedNode?.configuration || {});

  if (!selectedNode) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('properties')}</h2>
          <p className="text-sm text-gray-500">{t('selectNodeToConfigure')}</p>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <i className="fas fa-mouse-pointer text-4xl mb-2"></i>
            <p>{t('selectNodeToView')}</p>
          </div>
        </div>
      </div>
    );
  }

  const agentType = getAgentTypeById(selectedNode.agentId);
  if (!agentType) return null;

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev: Record<string, any>) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onNodeUpdate(selectedNode.id, { configuration: config });
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete the "${agentType.name}" node? This action cannot be undone.`)) {
      onNodeDelete(selectedNode.id);
    }
  };

  const renderConfigFields = () => {
    switch (agentType.subtype) {
      case 'llm':
        return (
          <>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">LLM Model</Label>
              <Select value={config.model || 'gpt-4-turbo'} onValueChange={(value) => handleConfigChange('model', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="claude-3">Claude 3</SelectItem>
                  <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">
                Temperature: {config.temperature || 0.1}
              </Label>
              <Slider
                value={[config.temperature || 0.1]}
                onValueChange={(value) => handleConfigChange('temperature', value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">Business Rules</Label>
              <Select value={config.validationChecks?.[0] || 'completeness'} onValueChange={(value) => handleConfigChange('validationChecks', [value])}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completeness">Completeness Check</SelectItem>
                  <SelectItem value="accuracy">Accuracy Validation</SelectItem>
                  <SelectItem value="compliance">Compliance Review</SelectItem>
                  <SelectItem value="fraud">Fraud Detection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      case 'ocr':
        return (
          <>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">Language</Label>
              <Select value={config.language || 'en'} onValueChange={(value) => handleConfigChange('language', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="tr">Turkish</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">
                Confidence Threshold: {config.confidence || 0.8}
              </Label>
              <Slider
                value={[config.confidence || 0.8]}
                onValueChange={(value) => handleConfigChange('confidence', value[0])}
                max={1}
                min={0}
                step={0.1}
                className="w-full"
              />
            </div>
          </>
        );
      case 'api':
        return (
          <>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">URL</Label>
              <Input
                type="url"
                value={config.url || ''}
                onChange={(e) => handleConfigChange('url', e.target.value)}
                className="text-sm"
                placeholder="https://api.example.com"
              />
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700 mb-1">Method</Label>
              <Select value={config.method || 'GET'} onValueChange={(value) => handleConfigChange('method', value)}>
                <SelectTrigger className="text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return (
          <div className="text-sm text-gray-500">
            No specific configuration available for this agent type.
          </div>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">{t('properties')}</h2>
        <p className="text-sm text-gray-500">{t('selectNodeToConfigure')}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* Node Info */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('nodeInformation')}</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1">Name</Label>
                <Input 
                  type="text" 
                  value={agentType.name}
                  className="text-sm"
                  disabled
                />
              </div>
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-1">Description</Label>
                <Textarea 
                  rows={3} 
                  value={agentType.description}
                  className="text-sm resize-none"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">{t('configuration')}</h3>
            <div className="space-y-3">
              {renderConfigFields()}
            </div>
          </div>

          {/* Business Rules for LLM Validators */}
          {agentType.subtype === 'llm' && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('businessRules')}</h3>
              <Textarea 
                rows={4} 
                value={config.businessRules?.join('\n') || 'Amount validation: Check invoice totals\nVendor verification: Validate against approved list\nDate consistency: Ensure dates are logical'}
                onChange={(e) => handleConfigChange('businessRules', e.target.value.split('\n'))}
                className="text-sm resize-none"
                placeholder="Enter business rules..."
              />
            </div>
          )}

          {/* Performance Metrics */}
          {selectedNode.metrics && Object.keys(selectedNode.metrics).length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">{t('performance')}</h3>
              <div className="space-y-3">
                {Object.entries(selectedNode.metrics).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 capitalize">{key}</span>
                    <span className={`text-xs font-medium ${
                      key.includes('rate') || key.includes('accuracy') || key.includes('valid')
                        ? 'text-dingl-success' 
                        : key.includes('error')
                        ? 'text-red-600'
                        : 'text-gray-700'
                    }`}>
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <Button 
                onClick={handleSave}
                className="w-full bg-dingl-blue text-white hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {t('saveChanges')}
              </Button>
              <Button 
                onClick={handleDelete}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {t('deleteNode')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
