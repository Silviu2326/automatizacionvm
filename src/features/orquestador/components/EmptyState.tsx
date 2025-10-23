/**
 * Componente para mostrar estado vacío cuando no hay actividad
 */

import React from 'react';
import { Play, Settings, FileText, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';

interface EmptyStateProps {
  onStart: () => void;
  onConfigure: () => void;
  isConnected: boolean;
  isHealthy: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  onStart, 
  onConfigure, 
  isConnected, 
  isHealthy 
}) => {
  return (
    <Card className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Orquestador Inactivo
          </h3>
          <p className="text-gray-600">
            El orquestador está listo para procesar páginas de Notion. 
            Configura los parámetros y inicia el procesamiento.
          </p>
        </div>

        <div className="space-y-4">
          {/* Estado de conexión */}
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className={`flex items-center space-x-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isConnected ? 'API Conectada' : 'API Desconectada'}</span>
            </div>
            <div className={`flex items-center space-x-2 ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isHealthy ? 'Sistema OK' : 'Sistema Error'}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-center space-x-3">
            <Button
              onClick={onConfigure}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Configurar</span>
            </Button>
            
            <Button
              onClick={onStart}
              disabled={!isConnected || !isHealthy}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>Iniciar Orquestador</span>
            </Button>
          </div>

          {/* Información adicional */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Archivos JSON listos</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Procesamiento automático</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Configuración flexible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};






