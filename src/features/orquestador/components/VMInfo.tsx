/**
 * Componente para mostrar información de la máquina virtual
 */

import React from 'react';
import { Server, Monitor, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface VMInfoProps {
  vmHost: string;
  vmPort: number;
  isConnected: boolean;
  isHealthy: boolean;
  lastSeen?: Date;
}

export const VMInfo: React.FC<VMInfoProps> = ({ 
  vmHost, 
  vmPort, 
  isConnected, 
  isHealthy, 
  lastSeen 
}) => {
  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-gray-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Máquina Virtual
              </h3>
              <p className="text-xs text-gray-500">
                {vmHost}:{vmPort}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm text-gray-700">
              {isConnected ? 'Conectado' : 'Desconectado'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge 
            variant={isConnected && isHealthy ? 'default' : 'destructive'}
            className="text-xs"
          >
            {isConnected && isHealthy ? 'Sistema OK' : 'Error'}
          </Badge>

          {lastSeen && (
            <span className="text-xs text-gray-500">
              Última conexión: {lastSeen.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};






