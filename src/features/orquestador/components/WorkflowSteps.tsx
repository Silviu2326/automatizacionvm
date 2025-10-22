/**
 * Componente para configurar pasos de trabajo secuenciales
 */

import React, { useState } from 'react';
import { Plus, Trash2, ArrowRight, FileText, Database, Settings, GripVertical, Zap, Palette } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Badge } from '../../../components/ui/badge';

export interface WorkflowStep {
  id: string;
  name: string;
  jsonFile: string;
  dataFlowMode: 'json-to-notion' | 'md-to-module' | 'module-to-backend' | 'stylize-module';
  waitTime: number;
  enabled: boolean;
  order: number;
}

interface WorkflowStepsProps {
  steps: WorkflowStep[];
  availableFiles: Array<{ name: string; size: number; modified: Date }>;
  onStepsChange: (steps: WorkflowStep[]) => void;
}

export const WorkflowSteps: React.FC<WorkflowStepsProps> = ({
  steps,
  availableFiles,
  onStepsChange
}) => {
  const [draggedStep, setDraggedStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: `step-${Date.now()}`,
      name: `Paso ${steps.length + 1}`,
      jsonFile: availableFiles[0]?.name || '',
      dataFlowMode: 'json-to-notion',
      waitTime: 30,
      enabled: true,
      order: steps.length
    };
    onStepsChange([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    // Reordenar los pasos restantes
    const reorderedSteps = updatedSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    onStepsChange(reorderedSteps);
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    const updatedSteps = steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    onStepsChange(updatedSteps);
  };

  const toggleStep = (stepId: string) => {
    updateStep(stepId, { enabled: !steps.find(s => s.id === stepId)?.enabled });
  };

  const moveStep = (fromIndex: number, toIndex: number) => {
    const newSteps = [...steps];
    const [movedStep] = newSteps.splice(fromIndex, 1);
    newSteps.splice(toIndex, 0, movedStep);
    
    // Actualizar el orden
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    onStepsChange(reorderedSteps);
  };

  const getModeIcon = (mode: WorkflowStep['dataFlowMode']) => {
    switch (mode) {
      case 'json-to-notion':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'md-to-module':
        return <Zap className="h-4 w-4 text-green-500" />;
      case 'module-to-backend':
        return <Settings className="h-4 w-4 text-purple-500" />;
      case 'stylize-module':
        return <Palette className="h-4 w-4 text-pink-500" />;
    }
  };

  const getModeColor = (mode: WorkflowStep['dataFlowMode']) => {
    switch (mode) {
      case 'json-to-notion':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'md-to-module':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 font-semibold';
      case 'module-to-backend':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'stylize-module':
        return 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300 text-pink-800 font-semibold';
    }
  };

  const getModeLabel = (mode: WorkflowStep['dataFlowMode']) => {
    switch (mode) {
      case 'json-to-notion':
        return 'JSON → Notion';
      case 'md-to-module':
        return 'MD → Módulo';
      case 'module-to-backend':
        return 'Módulo → Backend';
      case 'stylize-module':
        return 'Estilizar Módulo';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ArrowRight className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Pasos de Trabajo</h3>
        </div>
        <Button
          onClick={addStep}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Agregar Paso</span>
        </Button>
      </div>

      <div className="space-y-4">
        {steps.length === 0 ? (
          <div className="text-center py-8">
            <ArrowRight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              No hay pasos configurados
            </h4>
            <p className="text-gray-600 mb-4">
              Crea pasos secuenciales para ejecutar diferentes procesos
            </p>
            <Button onClick={addStep} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Crear Primer Paso</span>
            </Button>
          </div>
        ) : (
          steps
            .sort((a, b) => a.order - b.order)
            .map((step, index) => (
              <div
                key={step.id}
                className={`p-4 border-2 rounded-lg transition-all duration-200 ${
                  step.enabled 
                    ? 'border-gray-200 bg-white' 
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 cursor-move">
                    <GripVertical className="h-4 w-4 text-gray-400" />
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step.enabled 
                        ? 'bg-blue-100 text-blue-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Nombre del Paso
                        </Label>
                        <Input
                          value={step.name}
                          onChange={(e) => updateStep(step.id, { name: e.target.value })}
                          className="mt-1"
                          disabled={!step.enabled}
                        />
                      </div>

                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Archivo JSON
                        </Label>
                        <select
                          value={step.jsonFile}
                          onChange={(e) => updateStep(step.id, { jsonFile: e.target.value })}
                          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          disabled={!step.enabled}
                        >
                          <option value="">Seleccionar archivo...</option>
                          {availableFiles.map(file => (
                            <option key={file.name} value={file.name}>
                              {file.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-700">
                          Modo de Flujo
                        </Label>
                        <select
                          value={step.dataFlowMode}
                          onChange={(e) => updateStep(step.id, { 
                            dataFlowMode: e.target.value as WorkflowStep['dataFlowMode'] 
                          })}
                          className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                          disabled={!step.enabled}
                        >
                          <option value="json-to-notion">JSON → Notion</option>
                          <option value="md-to-module">MD → Módulo</option>
                          <option value="module-to-backend">Módulo → Backend</option>
                          <option value="stylize-module">Estilizar Módulo</option>
                        </select>
                      </div>

                      <div className="w-32">
                        <Label className="text-sm font-medium text-gray-700">
                          Tiempo (s)
                        </Label>
                        <Input
                          type="number"
                          value={step.waitTime}
                          onChange={(e) => updateStep(step.id, { 
                            waitTime: parseInt(e.target.value) || 30 
                          })}
                          className="mt-1"
                          min="5"
                          max="1200"
                          disabled={!step.enabled}
                        />
                      </div>
                    </div>

                    {/* Mode Badge */}
                    <div className="flex items-center space-x-2">
                      {getModeIcon(step.dataFlowMode)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getModeColor(step.dataFlowMode)} ${
                        step.dataFlowMode === 'md-to-module' 
                          ? 'shadow-sm ring-1 ring-green-200' 
                          : step.dataFlowMode === 'stylize-module'
                          ? 'shadow-sm ring-1 ring-pink-200'
                          : ''
                      }`}
                    >
                      {getModeLabel(step.dataFlowMode)}
                    </Badge>
                    </div>
                  </div>

                  {/* Step Actions */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStep(step.id)}
                      className={step.enabled ? 'text-green-600' : 'text-gray-400'}
                    >
                      {step.enabled ? 'Activo' : 'Inactivo'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {steps.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <ArrowRight className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-900">
                Flujo de Ejecución
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Los pasos se ejecutarán en orden secuencial. Cada paso procesará su archivo JSON 
                con el modo de flujo especificado y esperará el tiempo configurado antes del siguiente paso.
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
