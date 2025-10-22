/**
 * Componente para mostrar el resumen del workflow configurado
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Clock, FileText, Database, Settings, Zap, Palette } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { WorkflowStep } from './WorkflowSteps';
import { config } from '../../../lib/config';

interface WorkflowSummaryProps {
  steps: WorkflowStep[];
}

export const WorkflowSummary: React.FC<WorkflowSummaryProps> = ({ steps }) => {
  const [calculatedTime, setCalculatedTime] = useState<{
    numeroModulos: number;
    tiempoTotal: number;
    tiempoTotalMinutos: number;
  } | null>(null);

  useEffect(() => {
    const calculateTime = async () => {
      if (steps.length === 0) return;

      try {
        // Calcular tiempo para cada paso
        for (const step of steps) {
          if (step.enabled && step.jsonFile) {
            const response = await fetch(`${config.apiUrl}/api/calculate-time`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                archivo_json: step.jsonFile,
                tiempo_por_paso: step.waitTime
              })
            });

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setCalculatedTime(data);
                break; // Solo calcular para el primer paso activo
              }
            }
          }
        }
      } catch (error) {
        console.error('Error calculando tiempo:', error);
      }
    };

    calculateTime();
  }, [steps]);

  if (steps.length === 0) {
    return null;
  }

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

  const totalTime = calculatedTime?.tiempoTotal || steps.reduce((total, step) => total + step.waitTime, 0);
  const enabledSteps = steps.filter(step => step.enabled);

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-4">
        <ArrowRight className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">Resumen del Workflow</h3>
      </div>

      <div className="space-y-4">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{steps.length}</div>
            <div className="text-sm text-blue-700">Total Pasos</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{enabledSteps.length}</div>
            <div className="text-sm text-green-700">Pasos Activos</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {calculatedTime ? `${calculatedTime.tiempoTotalMinutos}m` : `${totalTime}s`}
            </div>
            <div className="text-sm text-purple-700">
              {calculatedTime ? 'Tiempo Real' : 'Tiempo Total'}
            </div>
          </div>
        </div>

        {/* Flujo de pasos */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Flujo de Ejecución:</h4>
          <div className="space-y-2">
            {steps
              .sort((a, b) => a.order - b.order)
              .map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border ${
                    step.enabled 
                      ? 'border-gray-200 bg-white' 
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.enabled 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        step.enabled ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.name}
                      </span>
                      {!step.enabled && (
                        <Badge variant="outline" className="text-xs">
                          Inactivo
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {step.jsonFile} • {step.waitTime}s
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getModeIcon(step.dataFlowMode)}
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        step.dataFlowMode === 'md-to-module' 
                          ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 text-green-800 font-semibold shadow-sm ring-1 ring-green-200' 
                          : step.dataFlowMode === 'stylize-module'
                          ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-pink-300 text-pink-800 font-semibold shadow-sm ring-1 ring-pink-200'
                          : ''
                      }`}
                    >
                      {getModeLabel(step.dataFlowMode)}
                    </Badge>
                  </div>

                  {index < steps.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Clock className="h-4 w-4 text-gray-500 mt-0.5" />
            <div>
              <h5 className="text-sm font-medium text-gray-900">
                Tiempo de Ejecución Estimado
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                {calculatedTime ? (
                  <>
                    Tiempo total: {calculatedTime.tiempoTotalMinutos}m 
                    {calculatedTime.numeroModulos > 1 && ` (${calculatedTime.numeroModulos} módulos)`}
                  </>
                ) : (
                  <>
                    Tiempo total: {Math.floor(totalTime / 60)}m {totalTime % 60}s
                    {enabledSteps.length < steps.length && 
                      ` (${steps.length - enabledSteps.length} pasos inactivos)`
                    }
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
