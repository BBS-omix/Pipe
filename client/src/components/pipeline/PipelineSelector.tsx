import { useState } from 'react';
import { Plus, ChevronDown, FolderOpen, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePipelineManager } from '@/hooks/usePipelineManager';
import { useLanguage } from '@/hooks/useLanguage';

export default function PipelineSelector() {
  const { t } = useLanguage();
  const {
    pipelines,
    activePipelineId,
    activePipeline,
    createPipeline,
    deletePipeline,
    switchPipeline,
    renamePipeline,
  } = usePipelineManager();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newPipelineName, setNewPipelineName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleCreatePipeline = () => {
    if (newPipelineName.trim()) {
      createPipeline(newPipelineName.trim());
      setNewPipelineName('');
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  const handleRenamePipeline = (id: string) => {
    if (editingName.trim()) {
      renamePipeline(id, editingName.trim());
      setEditingId(null);
      setEditingName('');
    }
  };

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  return (
    <div className="relative">
      {/* Current Pipeline Display */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="w-full justify-between bg-white hover:bg-gray-50 border-gray-200"
      >
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">
            {activePipeline?.name || 'No Pipeline'}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {/* Pipeline Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {/* Pipeline List */}
            <div className="max-h-48 overflow-y-auto">
              {pipelines.map((pipeline) => (
                <div
                  key={pipeline.id}
                  className={`flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer ${
                    pipeline.id === activePipelineId ? 'bg-blue-50 border border-blue-200' : ''
                  }`}
                >
                  {editingId === pipeline.id ? (
                    <div className="flex-1 flex items-center space-x-2">
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRenamePipeline(pipeline.id);
                          } else if (e.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        onBlur={() => handleRenamePipeline(pipeline.id)}
                        className="text-sm"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div
                      className="flex-1 flex items-center space-x-2"
                      onClick={() => {
                        switchPipeline(pipeline.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">{pipeline.name}</div>
                        <div className="text-xs text-gray-500">
                          {pipeline.nodes.length} agents • Updated {pipeline.lastModified.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {editingId !== pipeline.id && (
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditing(pipeline.id, pipeline.name);
                        }}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        <Edit className="w-3 h-3 text-gray-500" />
                      </button>
                      {pipelines.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete "${pipeline.name}"? This action cannot be undone.`)) {
                              deletePipeline(pipeline.id);
                            }
                          }}
                          className="p-1 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-red-500" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Create New Pipeline */}
            <div className="border-t border-gray-200 mt-2 pt-2">
              {isCreating ? (
                <div className="flex items-center space-x-2">
                  <Input
                    value={newPipelineName}
                    onChange={(e) => setNewPipelineName(e.target.value)}
                    placeholder={t('newPipeline')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleCreatePipeline();
                      } else if (e.key === 'Escape') {
                        setIsCreating(false);
                        setNewPipelineName('');
                      }
                    }}
                    className="text-sm"
                    autoFocus
                  />
                  <Button
                    onClick={handleCreatePipeline}
                    size="sm"
                    className="px-3"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setIsCreating(true)}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-600 hover:text-gray-900"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {t('createPipeline')}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}