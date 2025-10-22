import React, { useState, useEffect } from 'react';
import { Play, Pause, Square, Settings, FileText, BarChart3, Clock, CheckCircle, AlertCircle, Loader2, Wifi, WifiOff } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Progress } from './Progress';
import { LogViewer } from './LogViewer';
import { ConfigPanel } from './ConfigPanel';
import { TaskList } from './TaskList';
import { ConnectionStatus } from './ConnectionStatus';
import { SystemInfo } from './SystemInfo';
import { EmptyState } from './EmptyState';
import { SavedConfigDisplay } from './SavedConfigDisplay';
import { VMInfo } from './VMInfo';
import { useOrquestador, useOrquestadorHealth, useOrquestadorFiles } from '../../../lib/orquestador-hooks';

interface OrquestadorDashboardProps {
  dashboardId: string;
  vmHost: string;
  vmPort: number;
}

export const OrquestadorDashboard: React.FC<OrquestadorDashboardProps> = ({ 
  dashboardId, 
  vmHost, 
  vmPort 
}) => {
  const { 
    state, 
    logs, 
    tasks, 
    isConnected, 
    startOrquestador, 
    pauseOrquestador, 
    stopOrquestador 
  } = useOrquestador();
  
  const { isHealthy } = useOrquestadorHealth();
  const { files } = useOrquestadorFiles();
  const [showConfig, setShowConfig] = useState(false);

  // Manejar errores de conexión
  const handleStartOrquestador = async () => {
    try {
      await startOrquestador('automatic');
    } catch (error) {
      console.error('Error iniciando orquestador:', error);
    }
  };

  const handlePauseOrquestador = async () => {
    try {
      await pauseOrquestador();
    } catch (error) {
      console.error('Error pausando orquestador:', error);
    }
  };

  const handleStopOrquestador = async () => {
    try {
      await stopOrquestador();
    } catch (error) {
      console.error('Error deteniendo orquestador:', error);
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Play className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'running':
        return 'bg-blue-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🎯 Orquestador de Prompts</h1>
              <p className="text-gray-600 mt-2">
                Dashboard de monitoreo y control - {vmHost}:{vmPort}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Estado de conexión */}
              <ConnectionStatus 
                isConnected={isConnected}
                isHealthy={isHealthy}
                lastUpdate={state.startTime}
              />

              {/* Estado del orquestador */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {state.status === 'idle' && 'Inactivo'}
                  {state.status === 'running' && 'Ejecutando'}
                  {state.status === 'paused' && 'Pausado'}
                  {state.status === 'completed' && 'Completado'}
                  {state.status === 'error' && 'Error'}
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => setShowConfig(!showConfig)}
                className="flex items-center space-x-2"
              >
                <Settings className="h-4 w-4" />
                <span>Configurar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* VM Info */}
        <VMInfo 
          vmHost={vmHost}
          vmPort={vmPort}
          isConnected={isConnected}
          isHealthy={isHealthy}
          lastSeen={state.startTime ? new Date(state.startTime) : undefined}
        />

        {/* System Info */}
        <SystemInfo 
          isHealthy={isHealthy}
          isConnected={isConnected}
          totalFiles={files.length}
          lastUpdate={state.startTime}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Páginas Procesadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.totalPages > 0 ? `${Math.floor(state.currentProgress / 100 * state.totalPages)}/${state.totalPages}` : '0/0'}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiempo Transcurrido</p>
                <p className="text-2xl font-bold text-gray-900">{state.elapsedTime}</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold text-gray-900">{Math.floor(state.currentProgress)}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Estado</p>
                <Badge variant={state.status === 'running' ? 'default' : 'secondary'}>
                  {getStatusIcon()}
                  <span className="ml-2">
                    {state.status === 'idle' && 'Inactivo'}
                    {state.status === 'running' && 'Ejecutando'}
                    {state.status === 'paused' && 'Pausado'}
                    {state.status === 'completed' && 'Completado'}
                    {state.status === 'error' && 'Error'}
                  </span>
                </Badge>
              </div>
            </div>
          </Card>
        </div>

        {/* Control Panel */}
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Panel de Control</h2>
            <div className="flex items-center space-x-2">
              {state.currentPage && (
                <span className="text-sm text-gray-600">
                  Procesando: <span className="font-medium">{state.currentPage}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!state.isRunning ? (
              <Button
                onClick={handleStartOrquestador}
                disabled={!isConnected || !isHealthy}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Play className="h-4 w-4" />
                <span>Iniciar</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={handlePauseOrquestador}
                  variant="outline"
                  disabled={!isConnected}
                  className="flex items-center space-x-2 disabled:opacity-50"
                >
                  {state.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  <span>{state.isPaused ? 'Reanudar' : 'Pausar'}</span>
                </Button>
                
                <Button
                  onClick={handleStopOrquestador}
                  variant="outline"
                  disabled={!isConnected}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  <Square className="h-4 w-4" />
                  <span>Detener</span>
                </Button>
              </>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <Progress value={state.currentProgress} className="h-2" />
          </div>
        </Card>

        {/* Main Content */}
        {!state.isRunning && tasks.length === 0 ? (
          /* Estado vacío cuando no hay actividad */
          <SavedConfigDisplay 
            onStart={handleStartOrquestador}
            onConfigure={() => setShowConfig(true)}
            isConnected={isConnected}
            isHealthy={isHealthy}
          />
        ) : (
          /* Contenido normal cuando hay actividad */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Task List */}
            <div>
              <TaskList tasks={tasks} />
            </div>

            {/* Log Viewer */}
            <div>
              <LogViewer logs={logs} />
            </div>
          </div>
        )}

        {/* Configuration Panel */}
        {showConfig && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <ConfigPanel onClose={() => setShowConfig(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
