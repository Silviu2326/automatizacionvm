/**
 * Componentes optimizados para dispositivos móviles
 */

import React, { useState, useEffect } from 'react';
import { Smartphone, Wifi, Battery, Signal } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useOrquestadorHealth } from '../lib/orquestador-hooks';

export const MobileOptimized: React.FC = () => {
  const { isHealthy, checking, connectionStatus } = useOrquestadorHealth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  // Detectar cambios de conectividad
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Obtener nivel de batería si está disponible
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
      });
    }
  }, []);

  const getConnectionIcon = () => {
    if (!isOnline) return <Wifi className="h-4 w-4 text-red-500" />;
    if (checking) return <Wifi className="h-4 w-4 text-yellow-500 animate-pulse" />;
    if (isHealthy) return <Wifi className="h-4 w-4 text-green-500" />;
    return <Wifi className="h-4 w-4 text-red-500" />;
  };

  const getConnectionText = () => {
    if (!isOnline) return 'Sin conexión';
    if (checking) return 'Verificando...';
    if (isHealthy) return 'Conectado';
    return 'Error de conexión';
  };

  return (
    <div className="space-y-4">
      {/* Estado de conexión */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-blue-500" />
            <div>
              <h3 className="font-semibold text-gray-900">Estado del Dispositivo</h3>
              <p className="text-sm text-gray-600">Conectividad y recursos</p>
            </div>
          </div>
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? "En línea" : "Desconectado"}
          </Badge>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          {/* Conexión a la VM */}
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <div>
              <p className="text-sm font-medium">VM</p>
              <p className="text-xs text-gray-600">{getConnectionText()}</p>
            </div>
          </div>

          {/* Latencia */}
          {connectionStatus && (
            <div className="flex items-center gap-2">
              <Signal className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Latencia</p>
                <p className="text-xs text-gray-600">{connectionStatus.latency}ms</p>
              </div>
            </div>
          )}

          {/* Batería */}
          {batteryLevel !== null && (
            <div className="flex items-center gap-2">
              <Battery className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-sm font-medium">Batería</p>
                <p className="text-xs text-gray-600">{batteryLevel}%</p>
              </div>
            </div>
          )}

          {/* Última verificación */}
          {connectionStatus && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-sm font-medium">Última verificación</p>
                <p className="text-xs text-gray-600">
                  {connectionStatus.lastCheck.toLocaleTimeString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Optimizaciones móviles */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Optimizaciones Móviles</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Modo de ahorro de batería</span>
            <Badge variant="outline">Activo</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Compresión de datos</span>
            <Badge variant="outline">Habilitada</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Caché local</span>
            <Badge variant="outline">Activo</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm">Reconexión automática</span>
            <Badge variant="outline">Habilitada</Badge>
          </div>
        </div>
      </Card>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline" 
          className="h-12 flex flex-col items-center gap-1"
          disabled={!isHealthy}
        >
          <Wifi className="h-4 w-4" />
          <span className="text-xs">Reconectar</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-12 flex flex-col items-center gap-1"
          disabled={!isHealthy}
        >
          <Signal className="h-4 w-4" />
          <span className="text-xs">Probar Latencia</span>
        </Button>
      </div>
    </div>
  );
};

export default MobileOptimized;





