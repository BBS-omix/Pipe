import { Play, ExpandIcon as Expand, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface HeaderProps {
  onRunPipeline?: () => void;
  onExpandCanvas?: () => void;
}

export default function Header({ onRunPipeline, onExpandCanvas }: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-dingl-blue rounded-lg flex items-center justify-center">
              <i className="fas fa-robot text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900">{t('title')}</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-dingl-blue font-medium">Pipelines</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Data Sources</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Agents</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Analytics</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            onClick={onRunPipeline}
            className="bg-dingl-blue text-white hover:bg-blue-700 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            {t('runPipeline')}
          </Button>
          <button 
            onClick={onExpandCanvas}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
          >
            <Expand className="w-5 h-5" />
          </button>
          
          {/* Language Toggle Button */}
          <Button
            onClick={() => setLanguage(language === 'en' ? 'tr' : 'en')}
            variant="outline"
            size="sm"
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === 'en' ? 'TR' : 'EN'}
          </Button>
          
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
