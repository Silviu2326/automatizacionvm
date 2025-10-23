/**
 * Componente para mostrar información del sistema
 */

import React from 'react';
import { Server, Database, FileText, Clock } from 'lucide-react';
import { Card } from '../../../components/ui/card';

interface SystemInfoProps {
  isHealthy: boolean;
  isConnected: boolean;
  totalFiles?: number;
  lastUpdate?: string;
}

export const SystemInfo: React.FC<SystemInfoProps> = ({ 
  isHealthy, 
  isConnected, 
  totalFiles = 0,
  lastUpdate 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {/* Estado del Servidor */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Estado del Servidor</p>
            <p className={`text-2xl font-bold ${isHealthy ? 'text-green-600' : 'text-red-600'}`}>
              {isHealthy ? 'Online' : 'Offline'}
            </p>
          </div>
          <Server className={`h-8 w-8 ${isHealthy ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </Card>

      {/* Estado de Conexión */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Conexión API</p>
            <p className={`text-2xl font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </p>
          </div>
          <Database className={`h-8 w-8 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
        </div>
      </Card>

      {/* Archivos Disponibles */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Archivos JSON</p>
            <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-500" />
        </div>
      </Card>

      {/* Última Actualización */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Última Actualización</p>
            <p className="text-2xl font-bold text-gray-900">
              {lastUpdate ? new Date(lastUpdate).toLocaleTimeString() : 'N/A'}
            </p>
          </div>
          <Clock className="h-8 w-8 text-purple-500" />
        </div>
      </Card>
    </div>
  );
};






