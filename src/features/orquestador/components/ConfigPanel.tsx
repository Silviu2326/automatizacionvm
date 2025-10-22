import React, { useState } from 'react';
import { X, Settings, Users } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { useOrquestadorConfig, useOrquestadorFiles } from '../../../lib/orquestador-hooks';
import { WorkflowSteps, WorkflowStep } from './WorkflowSteps';
import { WorkflowSummary } from './WorkflowSummary';

interface ConfigPanelProps {
  onClose: () => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ onClose }) => {
  const { config, loading: configLoading, updateConfig, resetConfig } = useOrquestadorConfig();
  const { files, loading: filesLoading, createExampleFile } = useOrquestadorFiles();
  
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>([]);


  const handleSaveConfig = async () => {
    if (!config) return;
    
    try {
      console.log('💾 Guardando configuración...', {
        chatCount: config.chatCount,
        waitTime: config.waitTime,
        coordinates: config.coordinates,
        templates: config.templates,
        workflowSteps: workflowSteps
      });
      
      const response = await updateConfig({
        chatCount: config.chatCount,
        waitTime: config.waitTime,
        coordinates: config.coordinates,
        templates: config.templates,
        workflowSteps: workflowSteps
      });
      
      console.log('✅ Respuesta de la API al guardar configuración:', response);
      onClose();
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
    }
  };

  const handleResetConfig = async () => {
    try {
      await resetConfig();
    } catch (error) {
      console.error('Error reiniciando configuración:', error);
    }
  };

  // Mostrar estado de carga si no hay configuración
  if (configLoading || !config) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">⚙️ Configuración del Sistema</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cerrar</span>
          </Button>
        </div>
        <div className="text-center py-8">
          <div className="text-gray-500">Cargando configuración...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">⚙️ Configuración del Sistema</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onClose}
          className="flex items-center space-x-2"
        >
          <X className="h-4 w-4" />
          <span>Cerrar</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Cantidad de Chats */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Cantidad de Chats</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="1"
                max="6"
                value={config?.chatCount || 1}
                onChange={(e) => {
                  if (config) {
                    updateConfig({ ...config, chatCount: parseInt(e.target.value) });
                  }
                }}
                className="flex-1"
                disabled={configLoading}
              />
              <span className="text-lg font-medium text-gray-700 min-w-[3rem]">
                {config?.chatCount || 1}
              </span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <Button
                  key={count}
                  variant={config?.chatCount === count ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    if (config) {
                      updateConfig({ ...config, chatCount: count });
                    }
                  }}
                  className="text-sm"
                  disabled={configLoading}
                >
                  {count} chat{count > 1 ? 's' : ''}
                </Button>
              ))}
            </div>
            
            <p className="text-sm text-gray-600">
              {config?.chatCount === 1 && 'Solo Notion - Recomendado para procesamiento básico'}
              {config?.chatCount === 2 && 'Frontend + Backend'}
              {config?.chatCount === 3 && 'Frontend + Backend + Marketing'}
              {config?.chatCount === 4 && 'Frontend + Backend + Marketing + Analytics'}
              {config?.chatCount && config.chatCount > 4 && 'Configuración personalizada'}
            </p>
          </div>
        </Card>


        {/* Pasos de Trabajo */}
        <WorkflowSteps 
          steps={workflowSteps}
          availableFiles={files.map(f => ({
            name: f.name,
            size: f.size,
            modified: new Date(f.modified)
          }))}
          onStepsChange={setWorkflowSteps}
        />

        {/* Resumen del Workflow */}
        {workflowSteps.length > 0 && (
          <WorkflowSummary steps={workflowSteps} />
        )}


        {/* Coordenadas (Solo si hay más de 1 chat) */}
        {config && config.chatCount > 1 && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="h-5 w-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-900">Coordenadas de Chats</h3>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Configura las posiciones de los chats en la pantalla
              </p>
              
              {Array.from({ length: config?.chatCount || 1 }, (_, i) => i + 1).map((chatNum) => (
                <div key={chatNum} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700 w-16">
                    Chat {chatNum}:
                  </span>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      placeholder="X"
                      value={config?.coordinates?.[`chat${chatNum}` as keyof typeof config.coordinates]?.x || 0}
                      onChange={(e) => {
                        if (config) {
                          updateConfig({
                            ...config,
                            coordinates: {
                              ...config.coordinates,
                              [`chat${chatNum}` as keyof typeof config.coordinates]: {
                                ...config.coordinates[`chat${chatNum}` as keyof typeof config.coordinates],
                                x: parseInt(e.target.value) || 0
                              }
                            }
                          });
                        }
                      }}
                      className="w-20"
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={config?.coordinates?.[`chat${chatNum}` as keyof typeof config.coordinates]?.y || 0}
                      onChange={(e) => {
                        if (config) {
                          updateConfig({
                            ...config,
                            coordinates: {
                              ...config.coordinates,
                              [`chat${chatNum}` as keyof typeof config.coordinates]: {
                                ...config.coordinates[`chat${chatNum}` as keyof typeof config.coordinates],
                                y: parseInt(e.target.value) || 0
                              }
                            }
                          });
                        }
                      }}
                      className="w-20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}


        {/* Botones de Acción */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              onClick={handleResetConfig}
              disabled={configLoading}
              className="text-orange-600 hover:text-orange-700"
            >
              Reiniciar Configuración
            </Button>
            <Button 
              variant="outline" 
              onClick={() => createExampleFile()}
              disabled={filesLoading}
              className="text-green-600 hover:text-green-700"
            >
              Crear Archivo de Ejemplo
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveConfig} 
              disabled={configLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {configLoading ? 'Guardando...' : 'Guardar Configuración'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
