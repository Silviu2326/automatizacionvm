/**
 * Componente para mostrar el estado de conexión en tiempo real
 */

import React from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';

interface ConnectionStatusProps {
  isConnected: boolean;
  isHealthy: boolean;
  lastUpdate?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  isHealthy, 
  lastUpdate 
}) => {
  const getStatusIcon = () => {
    if (!isConnected) {
      return <WifiOff className="h-4 w-4 text-red-500" />;
    }
    if (!isHealthy) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
    return <Wifi className="h-4 w-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (!isConnected) return 'Desconectado';
    if (!isHealthy) return 'Sistema con errores';
    return 'Conectado';
  };

  const getStatusColor = () => {
    if (!isConnected) return 'bg-red-500';
    if (!isHealthy) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Icono de estado */}
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </div>

      {/* Indicador visual */}
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`}></div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} style={{ animationDelay: '0.2s' }}></div>
        <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} style={{ animationDelay: '0.4s' }}></div>
      </div>

      {/* Badge de estado */}
      <Badge 
        variant={isConnected && isHealthy ? 'default' : 'destructive'}
        className="text-xs"
      >
        {isConnected && isHealthy ? (
          <div className="flex items-center space-x-1">
            <CheckCircle className="h-3 w-3" />
            <span>Sistema OK</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1">
            <AlertCircle className="h-3 w-3" />
            <span>Error</span>
          </div>
        )}
      </Badge>

      {/* Última actualización */}
      {lastUpdate && (
        <span className="text-xs text-gray-500">
          Última actualización: {new Date(lastUpdate).toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};



