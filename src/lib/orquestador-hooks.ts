/**
 * Hooks personalizados para el orquestador
 * Proporciona estado y funciones para interactuar con el orquestador
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { orquestadorAPI, OrquestadorConfig, OrquestadorState, LogEntry, Task, JsonFile } from './orquestador-api.js';
import { apiClient, ConnectionStatus } from './api-client.js';

// ===== HOOK PRINCIPAL DEL ORQUESTADOR =====

export function useOrquestador() {
  const [state, setState] = useState<OrquestadorState>({
    isRunning: false,
    isPaused: false,
    currentProgress: 0,
    totalPages: 0,
    currentPage: '',
    startTime: null,
    elapsedTime: '00:00:00',
    status: 'idle'
  });

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // Conectar WebSocket
  const connectWebSocket = useCallback(() => {
    orquestadorAPI.connectWebSocket((data) => {
      switch (data.type) {
        case 'state':
          setState(data.data);
          break;
        case 'log':
          setLogs(prev => [...prev, data.data]);
          break;
        case 'logs':
          setLogs(data.data);
          break;
        case 'task':
          setTasks(prev => {
            const index = prev.findIndex(t => t.id === data.data.id);
            if (index >= 0) {
              const newTasks = [...prev];
              newTasks[index] = data.data;
              return newTasks;
            }
            return [...prev, data.data];
          });
          break;
        case 'tasks':
          setTasks(data.data);
          break;
        case 'progress':
          setState(prev => ({ ...prev, currentProgress: data.data.progress }));
          break;
        case 'pong':
          setIsConnected(true);
          break;
      }
    });
  }, []);

  // Desconectar WebSocket
  const disconnectWebSocket = useCallback(() => {
    orquestadorAPI.disconnectWebSocket();
    setIsConnected(false);
  }, []);

  // Iniciar orquestador
  const startOrquestador = useCallback(async (mode: 'automatic' | 'manual' = 'automatic') => {
    try {
      await orquestadorAPI.startOrquestador(mode);
    } catch (error) {
      console.error('Error iniciando orquestador:', error);
      throw error;
    }
  }, []);

  // Pausar orquestador
  const pauseOrquestador = useCallback(async () => {
    try {
      await orquestadorAPI.pauseOrquestador();
    } catch (error) {
      console.error('Error pausando orquestador:', error);
      throw error;
    }
  }, []);

  // Detener orquestador
  const stopOrquestador = useCallback(async () => {
    try {
      await orquestadorAPI.stopOrquestador();
    } catch (error) {
      console.error('Error deteniendo orquestador:', error);
      throw error;
    }
  }, []);

  // Efecto para conectar WebSocket al montar
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, [connectWebSocket, disconnectWebSocket]);

  // Ping periódico para mantener conexión
  useEffect(() => {
    const interval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Ping cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    logs,
    tasks,
    isConnected,
    startOrquestador,
    pauseOrquestador,
    stopOrquestador,
    connectWebSocket,
    disconnectWebSocket
  };
}

// ===== HOOK DE CONFIGURACIÓN =====

export function useOrquestadorConfig() {
  const [config, setConfig] = useState<OrquestadorConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar configuración
  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const configData = await orquestadorAPI.getConfig();
      setConfig(configData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar configuración
  const updateConfig = useCallback(async (newConfig: Partial<OrquestadorConfig>) => {
    try {
      setError(null);
      console.log('🔄 Enviando configuración a la API...', newConfig);
      const response = await orquestadorAPI.updateConfig(newConfig);
      console.log('📥 Respuesta de la API:', response);
      await loadConfig(); // Recargar configuración
      return response;
    } catch (err) {
      console.error('❌ Error en updateConfig:', err);
      setError(err instanceof Error ? err.message : 'Error actualizando configuración');
      throw err;
    }
  }, [loadConfig]);

  // Reiniciar configuración
  const resetConfig = useCallback(async () => {
    try {
      setError(null);
      const newConfig = await orquestadorAPI.resetConfig();
      setConfig(newConfig);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error reiniciando configuración');
      throw err;
    }
  }, []);

  // Cargar configuración al montar
  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    loadConfig,
    updateConfig,
    resetConfig
  };
}

// ===== HOOK DE ARCHIVOS =====

export function useOrquestadorFiles() {
  const [files, setFiles] = useState<JsonFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar archivos
  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const filesData = await orquestadorAPI.getFiles();
      setFiles(filesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando archivos');
    } finally {
      setLoading(false);
    }
  }, []);

  // Subir archivo
  const uploadFile = useCallback(async (file: File) => {
    try {
      setError(null);
      await orquestadorAPI.uploadFile(file);
      await loadFiles(); // Recargar archivos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error subiendo archivo');
      throw err;
    }
  }, [loadFiles]);

  // Descargar archivo
  const downloadFile = useCallback(async (filename: string) => {
    try {
      setError(null);
      const blob = await orquestadorAPI.downloadFile(filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error descargando archivo');
      throw err;
    }
  }, []);

  // Eliminar archivo
  const deleteFile = useCallback(async (filename: string) => {
    try {
      setError(null);
      await orquestadorAPI.deleteFile(filename);
      await loadFiles(); // Recargar archivos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando archivo');
      throw err;
    }
  }, [loadFiles]);

  // Crear archivo de ejemplo
  const createExampleFile = useCallback(async (filename?: string, content?: any) => {
    try {
      setError(null);
      await orquestadorAPI.createExampleFile(filename, content);
      await loadFiles(); // Recargar archivos
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando archivo de ejemplo');
      throw err;
    }
  }, [loadFiles]);

  // Validar archivo
  const validateFile = useCallback(async (filename: string) => {
    try {
      setError(null);
      return await orquestadorAPI.validateFile(filename);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error validando archivo');
      throw err;
    }
  }, []);

  // Cargar archivos al montar
  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  return {
    files,
    loading,
    error,
    loadFiles,
    uploadFile,
    downloadFile,
    deleteFile,
    createExampleFile,
    validateFile
  };
}

// ===== HOOK DE SALUD DEL SISTEMA =====

export function useOrquestadorHealth() {
  const [isHealthy, setIsHealthy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus | null>(null);

  const checkHealth = useCallback(async () => {
    try {
      setChecking(true);
      console.log('🔍 Verificando salud del servidor...');
      const status = await apiClient.healthCheck();
      console.log('📊 Estado de conexión:', status);
      setConnectionStatus(status);
      setIsHealthy(status.isConnected);
    } catch (error) {
      console.error('❌ Error verificando salud:', error);
      setIsHealthy(false);
      setConnectionStatus(null);
    } finally {
      setChecking(false);
    }
  }, []);

  // Verificar salud al montar y cada 10 segundos
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Cada 10 segundos
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    isHealthy,
    checking,
    connectionStatus,
    checkHealth
  };
}

// ===== HOOK COMBINADO =====

export function useOrquestadorSystem() {
  const orquestador = useOrquestador();
  const config = useOrquestadorConfig();
  const files = useOrquestadorFiles();
  const health = useOrquestadorHealth();

  return {
    orquestador,
    config,
    files,
    health
  };
}

