/**
 * Componente para mostrar el estado de conexión con la VM
 */

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useOrquestadorHealth } from '../lib/orquestador-hooks';

interface ConnectionStatusProps {
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const { isHealthy, checking, checkHealth } = useOrquestadorHealth();
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    if (!checking) {
      setLastChecked(new Date());
    }
  }, [checking]);

  const getStatusIcon = () => {
    if (checking) {
      return <AlertCircle className="h-4 w-4 animate-pulse text-yellow-500" />;
    }
    if (isHealthy) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    return <WifiOff className="h-4 w-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (checking) return 'Verificando...';
    if (isHealthy) return 'Conectado';
    return 'Desconectado';
  };

  const getStatusColor = () => {
    if (checking) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (isHealthy) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{getStatusText()}</span>
      </div>
      
      <Badge 
        variant="outline" 
        className={`text-xs ${getStatusColor()}`}
      >
        VM
      </Badge>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={checkHealth}
        disabled={checking}
        className="h-6 px-2 text-xs"
      >
        {checking ? 'Verificando...' : 'Verificar'}
      </Button>
      
      {lastChecked && (
        <span className="text-xs text-gray-500">
          {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;





