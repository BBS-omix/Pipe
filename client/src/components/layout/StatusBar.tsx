import { RefreshCw } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface StatusBarProps {
  pipelineStatus: string;
  processed: number;
  successRate: string;
  lastUpdated: string;
  onRefresh?: () => void;
}

export default function StatusBar({ 
  pipelineStatus, 
  processed, 
  successRate, 
  lastUpdated, 
  onRefresh 
}: StatusBarProps) {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white border-t border-gray-200 px-6 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              pipelineStatus === 'running' ? 'bg-dingl-success animate-pulse' : 'bg-gray-400'
            }`}></div>
            <span className="text-gray-600">
              {t('pipelineStatus')}: <span className="capitalize">{pipelineStatus}</span>
            </span>
          </div>
          <div className="text-gray-600">{t('processed')}: {processed.toLocaleString()} documents</div>
          <div className="text-gray-600">{t('successRate')}: {successRate}</div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">{t('lastUpdated')}: {lastUpdated}</span>
          <button 
            onClick={onRefresh}
            className="text-dingl-blue hover:text-blue-700 transition-colors p-1"
            title={t('refresh')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
