/**
 * Componente para mostrar la configuración guardada y permitir ejecutarla
 */

import React, { useState, useEffect } from 'react';
import { Play, Settings, CheckCircle, AlertCircle, Clock, FileText, Database, Monitor, Activity, Terminal } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { useOrquestadorHealth } from '../../../lib/orquestador-hooks';
import { config } from '../../../lib/config';

interface SavedConfigDisplayProps {
  onStart: () => void;
  onConfigure: () => void;
  isConnected: boolean;
  isHealthy: boolean;
}

interface SavedConfig {
  hasConfig: boolean;
  config?: string;
  parsed?: {
    general: Record<string, string>;
    coordinates: Record<string, string>;
    templates: Record<string, string>;
  };
  message: string;
}

interface OrquestadorStatus {
  isRunning: boolean;
  currentStep: number;
  totalSteps: number;
  currentModule: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  logs: string[];
  startTime?: Date;
  estimatedTime?: number;
}

interface ModuleProgress {
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: Date;
  endTime?: Date;
  prompt?: string;
}

export const SavedConfigDisplay: React.FC<SavedConfigDisplayProps> = ({ 
  onStart, 
  onConfigure, 
  isConnected, 
  isHealthy 
}) => {
  const [savedConfig, setSavedConfig] = useState<SavedConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [orquestadorStatus, setOrquestadorStatus] = useState<OrquestadorStatus>({
    isRunning: false,
    currentStep: 0,
    totalSteps: 0,
    currentModule: '',
    status: 'idle',
    logs: []
  });
  const [moduleProgress, setModuleProgress] = useState<ModuleProgress[]>([]);
  const [showMonitoring, setShowMonitoring] = useState(false);
  
  // Usar el hook de salud para obtener el estado real de conexión
  const { isHealthy: realIsHealthy, connectionStatus } = useOrquestadorHealth();

  // Cargar configuración guardada
  useEffect(() => {
    const fetchSavedConfig = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.apiUrl}/api/config/saved`);
        const data = await response.json();
        setSavedConfig(data);
      } catch (error) {
        console.error('Error cargando configuración guardada:', error);
        setSavedConfig({
          hasConfig: false,
          message: 'Error cargando configuración'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavedConfig();
  }, []);

  // Monitorear estado del orquestador
  useEffect(() => {
    const checkOrquestadorStatus = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/api/status`);
        const status = await response.json();
        setOrquestadorStatus(prev => ({
          ...prev,
          ...status,
          isRunning: status.status === 'running'
        }));
      } catch (error) {
        console.error('Error obteniendo estado del orquestador:', error);
      }
    };

    const interval = setInterval(checkOrquestadorStatus, 1000); // Cada 1 segundo
    return () => clearInterval(interval);
  }, []);

  // Inicializar progreso de módulos cuando se carga la configuración
  useEffect(() => {
    if (savedConfig?.parsed?.pasos_trabajo) {
      const modulos = [];
      const numPasos = parseInt(savedConfig.parsed.pasos_trabajo.numero_pasos || '0');
      
      for (let i = 1; i <= numPasos; i++) {
        const nombre = savedConfig.parsed.pasos_trabajo[`paso_${i}_nombre`] || `Paso ${i}`;
        modulos.push({
          name: nombre,
          status: 'pending' as const
        });
      }
      
      setModuleProgress(modulos);
    }
  }, [savedConfig]);

  if (loading) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando configuración...</p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {savedConfig?.hasConfig ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            )}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {savedConfig?.hasConfig ? 'Configuración Guardada' : 'Sin Configuración'}
          </h3>
          <p className="text-gray-600">
            {savedConfig?.hasConfig 
              ? 'El orquestador está configurado y listo para ejecutar.'
              : 'No hay configuración guardada. Configura el sistema primero.'
            }
          </p>
        </div>

        {/* Estado de conexión */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <div className={`flex items-center space-x-2 ${realIsHealthy ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full ${realIsHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{realIsHealthy ? 'API Conectada' : 'API Desconectada'}</span>
          </div>
          <div className={`flex items-center space-x-2 ${realIsHealthy ? 'text-green-600' : 'text-red-600'}`}>
            <div className={`w-3 h-3 rounded-full ${realIsHealthy ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="font-medium">{realIsHealthy ? 'Sistema OK' : 'Sistema Error'}</span>
          </div>
          {connectionStatus && (
            <div className="text-xs text-gray-500">
              Latencia: {connectionStatus.latency}ms
            </div>
          )}
        </div>

        {/* Panel de monitoreo - siempre visible cuando hay configuración */}
        {savedConfig?.hasConfig && (
          <Card className="p-6 mb-8 bg-gray-50 border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Monitor className="h-5 w-5 text-gray-600" />
                <h4 className="font-semibold text-gray-900">Estado del Orquestador</h4>
                <Badge variant={orquestadorStatus.status === 'running' ? 'default' : 'secondary'}>
                  {orquestadorStatus.status === 'running' ? 'Ejecutando' : 
                   orquestadorStatus.status === 'completed' ? 'Completado' :
                   orquestadorStatus.status === 'error' ? 'Error' : 'Inactivo'}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMonitoring(!showMonitoring)}
                className="flex items-center space-x-2"
              >
                <Terminal className="h-4 w-4" />
                <span>{showMonitoring ? 'Ocultar' : 'Mostrar'} Logs</span>
              </Button>
            </div>

            {/* Información del estado actual */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">Progreso</div>
                <div className="text-lg font-semibold">
                  {orquestadorStatus.currentStep}/{orquestadorStatus.totalSteps || 1}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${orquestadorStatus.totalSteps > 0 ? (orquestadorStatus.currentStep / orquestadorStatus.totalSteps) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">Módulo Actual</div>
                <div className="text-lg font-semibold truncate">
                  {orquestadorStatus.currentModule || 'Ninguno'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">Estado</div>
                <div className="text-lg font-semibold">
                  {orquestadorStatus.status === 'running' ? '🔄 Procesando' :
                   orquestadorStatus.status === 'completed' ? '✅ Completado' :
                   orquestadorStatus.status === 'error' ? '❌ Error' : '⏸️ Inactivo'}
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border">
                <div className="text-sm text-gray-600 mb-1">Tiempo Restante</div>
                <div className="text-lg font-semibold">
                  {orquestadorStatus.estimatedTime ? `${Math.round(orquestadorStatus.estimatedTime / 60)}m ${orquestadorStatus.estimatedTime % 60}s` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Logs en tiempo real */}
            {showMonitoring && (
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <Terminal className="h-4 w-4" />
                  <span>Logs del Orquestador</span>
                </div>
                {orquestadorStatus.logs.length > 0 ? (
                  orquestadorStatus.logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">No hay logs disponibles</div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Monitoreo en tiempo real - solo cuando está ejecutándose */}
        {(orquestadorStatus.isRunning || orquestadorStatus.status === 'running') && (
          <Card className="p-6 mb-8 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600 animate-pulse" />
                <h4 className="font-semibold text-blue-900">Orquestador en Ejecución</h4>
                <Badge variant="default" className="bg-blue-600">
                  {orquestadorStatus.currentStep}/{orquestadorStatus.totalSteps}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMonitoring(!showMonitoring)}
                className="flex items-center space-x-2"
              >
                <Monitor className="h-4 w-4" />
                <span>{showMonitoring ? 'Ocultar' : 'Mostrar'} Logs</span>
              </Button>
            </div>

            {/* Progreso de módulos */}
            <div className="space-y-3 mb-4">
              {moduleProgress.map((modulo, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div className={`w-3 h-3 rounded-full ${
                    modulo.status === 'completed' ? 'bg-green-500' :
                    modulo.status === 'processing' ? 'bg-blue-500 animate-pulse' :
                    modulo.status === 'error' ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <span className="flex-1 font-medium">{modulo.name}</span>
                  <Badge variant={
                    modulo.status === 'completed' ? 'default' :
                    modulo.status === 'processing' ? 'default' :
                    modulo.status === 'error' ? 'destructive' : 'secondary'
                  }>
                    {modulo.status === 'completed' ? 'Completado' :
                     modulo.status === 'processing' ? 'Procesando' :
                     modulo.status === 'error' ? 'Error' : 'Pendiente'}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Logs en tiempo real */}
            {showMonitoring && (
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                <div className="flex items-center space-x-2 mb-2">
                  <Terminal className="h-4 w-4" />
                  <span>Logs en tiempo real</span>
                </div>
                {orquestadorStatus.logs.map((log, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-400">[{new Date().toLocaleTimeString()}]</span> {log}
                  </div>
                ))}
                {orquestadorStatus.logs.length === 0 && (
                  <div className="text-gray-500">Esperando logs...</div>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Configuración guardada */}
        {savedConfig?.hasConfig && savedConfig.parsed && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Información General */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Database className="h-5 w-5 text-blue-500" />
                <h4 className="font-semibold text-gray-900">Configuración General</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chats:</span>
                  <Badge variant="outline">{savedConfig.parsed.general.cantidad_chats || '1'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tiempo espera:</span>
                  <Badge variant="outline">{savedConfig.parsed.general.tiempo_espera_segundos || '600'}s</Badge>
                </div>
              </div>
            </Card>

            {/* Pasos de Trabajo */}
            {savedConfig.parsed.pasos_trabajo && Object.keys(savedConfig.parsed.pasos_trabajo).length > 0 && (
              <Card className="p-6 col-span-2">
                <div className="flex items-center space-x-2 mb-6">
                  <Clock className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-gray-900">Pasos de Trabajo</h4>
                  <Badge variant="outline" className="ml-2">
                    {savedConfig.parsed.pasos_trabajo.numero_pasos || '0'} pasos
                  </Badge>
                </div>
                <div className="space-y-4">
                  {Array.from({ length: parseInt(savedConfig.parsed.pasos_trabajo.numero_pasos || '0') }, (_, i) => i + 1).map((stepNum) => {
                    const stepName = savedConfig.parsed.pasos_trabajo[`paso_${stepNum}_nombre`];
                    const stepFile = savedConfig.parsed.pasos_trabajo[`paso_${stepNum}_archivo`];
                    const stepMode = savedConfig.parsed.pasos_trabajo[`paso_${stepNum}_modo`];
                    const stepTime = savedConfig.parsed.pasos_trabajo[`paso_${stepNum}_tiempo`];
                    const stepActive = savedConfig.parsed.pasos_trabajo[`paso_${stepNum}_activo`];
                    
                    if (!stepName) return null;
                    
                    return (
                      <div key={stepNum} className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        stepActive === 'true' 
                          ? 'bg-green-50 border-green-200 shadow-sm' 
                          : 'bg-gray-50 border-gray-200'
                      }`}>
                        {/* Header del paso */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              stepActive === 'true' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-400 text-white'
                            }`}>
                              {stepNum}
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 text-lg">{stepName}</h5>
                              <p className="text-sm text-gray-500">Paso {stepNum} del proceso</p>
                            </div>
                          </div>
                          <Badge 
                            variant={stepActive === 'true' ? 'default' : 'secondary'}
                            className={`${
                              stepActive === 'true' 
                                ? 'bg-green-100 text-green-800 border-green-200' 
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {stepActive === 'true' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        
                        {/* Información detallada */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">Archivo</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium truncate" title={stepFile || 'No especificado'}>
                              {stepFile || 'No especificado'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Settings className="h-4 w-4 text-purple-500" />
                              <span className="text-sm font-medium text-gray-700">Modo</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">
                              {stepMode || 'No especificado'}
                            </p>
                          </div>
                          
                          <div className="bg-white p-3 rounded-md border border-gray-100">
                            <div className="flex items-center space-x-2 mb-2">
                              <Clock className="h-4 w-4 text-orange-500" />
                              <span className="text-sm font-medium text-gray-700">Duración</span>
                            </div>
                            <p className="text-sm text-gray-900 font-medium">
                              {stepTime ? `${stepTime}s` : 'No especificado'}
                            </p>
                          </div>
                        </div>
                        
                        {/* Barra de progreso visual */}
                        <div className="mt-4 flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                stepActive === 'true' ? 'bg-green-500' : 'bg-gray-400'
                              }`}
                              style={{ width: stepActive === 'true' ? '100%' : '0%' }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {stepActive === 'true' ? 'Listo para ejecutar' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={onConfigure}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>{savedConfig?.hasConfig ? 'Modificar Configuración' : 'Configurar Sistema'}</span>
          </Button>
          
          {savedConfig?.hasConfig && (
            <Button
              onClick={onStart}
              disabled={!realIsHealthy}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              <span>Ejecutar con Configuración Guardada</span>
            </Button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
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
    </Card>
  );
};
