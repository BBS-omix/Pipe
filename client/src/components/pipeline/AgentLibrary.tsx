import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { agentTypes, getAgentTypesByCategory } from '@/lib/agentTypes';
import { useLanguage } from '@/hooks/useLanguage';

interface AgentLibraryProps {
  onDragStart: (agentId: string, event: React.DragEvent) => void;
}

export default function AgentLibrary({ onDragStart }: AgentLibraryProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAgents = agentTypes.filter(agent =>
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [
    { key: 'data-source', label: t('dataInputs') },
    { key: 'processor', label: t('businessProcessors') },
    { key: 'ai', label: t('aiBusinessLogic') },
    { key: 'output', label: t('businessActions') }
  ] as const;

  const handleDragStart = (agentId: string, event: React.DragEvent) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/plain', agentId);
    event.dataTransfer.setData('application/x-agent-id', agentId);
    console.log('Drag started for agent:', agentId);
    onDragStart(agentId, event);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('agentLibrary')}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder={t('searchAgents')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 focus:ring-2 focus:ring-dingl-blue focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map(category => {
          const categoryAgents = filteredAgents.filter(agent => agent.type === category.key);
          
          if (categoryAgents.length === 0) return null;

          return (
            <div key={category.key} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                {category.label}
              </h3>
              <div className="space-y-2">
                {categoryAgents.map(agent => (
                  <div
                    key={agent.id}
                    className={`pipeline-node ${agent.bgColor} border ${agent.borderColor} rounded-lg p-3 cursor-grab hover:scale-105 transition-all duration-200 hover:shadow-lg`}
                    draggable
                    onDragStart={(e) => handleDragStart(agent.id, e)}
                    data-agent-id={agent.id}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${agent.bgColor.replace('50', '100')} rounded-lg flex items-center justify-center`}>
                        <i className={`${agent.icon} ${agent.color}`}></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500">{agent.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
