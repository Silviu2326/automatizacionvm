/**
 * Cliente API para comunicación con el orquestador
 * Proporciona funciones para interactuar con el backend del orquestador
 */

import config from './config.js';

export interface OrquestadorConfig {
  chatCount: number;
  waitTime: number;
  coordinates: Record<string, { x: number; y: number }>;
  templates: Record<string, { type: string; file: string }>;
}

export interface OrquestadorState {
  isRunning: boolean;
  isPaused: boolean;
  currentProgress: number;
  totalPages: number;
  currentPage: string;
  startTime: string | null;
  elapsedTime: string;
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error';
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface Task {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  startTime?: string;
  endTime?: string;
  duration?: string;
}

export interface JsonFile {
  name: string;
  size: number;
  modified: string;
  path: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class OrquestadorAPI {
  private baseURL: string;
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(baseURL: string = config.apiUrl) {
    this.baseURL = baseURL;
  }

  // ===== CONFIGURACIÓN =====

  async getConfig(): Promise<OrquestadorConfig> {
    const response = await fetch(`${this.baseURL}/api/config`);
    const result: ApiResponse<OrquestadorConfig> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error obteniendo configuración');
    }
    
    return result.data!;
  }

  async updateConfig(config: Partial<OrquestadorConfig>): Promise<void> {
    console.log('🌐 Enviando PUT a /api/config con:', config);
    
    const response = await fetch(`${this.baseURL}/api/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });
    
    console.log('📡 Respuesta HTTP:', response.status, response.statusText);
    
    const result: ApiResponse = await response.json();
    console.log('📄 Respuesta JSON:', result);
    
    if (!result.success) {
      throw new Error(result.error || 'Error actualizando configuración');
    }
  }

  async resetConfig(): Promise<OrquestadorConfig> {
    const response = await fetch(`${this.baseURL}/api/config/reset`, {
      method: 'POST',
    });
    
    const result: ApiResponse<OrquestadorConfig> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error reiniciando configuración');
    }
    
    return result.data!;
  }

  async getConfigStatus(): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/config/status`);
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error obteniendo estado de configuración');
    }
    
    return result.data;
  }

  // ===== MONITOREO =====

  async getState(): Promise<OrquestadorState> {
    const response = await fetch(`${this.baseURL}/api/monitor/state`);
    const result: ApiResponse<OrquestadorState> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error obteniendo estado');
    }
    
    return result.data!;
  }

  async startOrquestador(mode: 'automatic' | 'manual' = 'automatic'): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mode }),
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error iniciando orquestador');
    }
  }

  async pauseOrquestador(): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/monitor/pause`, {
      method: 'POST',
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error pausando orquestador');
    }
  }

  async stopOrquestador(): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/monitor/stop`, {
      method: 'POST',
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error deteniendo orquestador');
    }
  }

  // ===== ARCHIVOS =====

  async getFiles(): Promise<JsonFile[]> {
    const response = await fetch(`${this.baseURL}/api/files`);
    const result: ApiResponse<JsonFile[]> = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error obteniendo archivos');
    }
    
    return result.data!;
  }

  async uploadFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${this.baseURL}/api/files/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error subiendo archivo');
    }
  }

  async downloadFile(filename: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/files/download/${filename}`);
    
    if (!response.ok) {
      throw new Error('Error descargando archivo');
    }
    
    return await response.blob();
  }

  async getFileContent(filename: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/files/content/${filename}`);
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error obteniendo contenido del archivo');
    }
    
    return result.data;
  }

  async deleteFile(filename: string): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/files/${filename}`, {
      method: 'DELETE',
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error eliminando archivo');
    }
  }

  async createExampleFile(filename?: string, content?: any): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/files/create-example`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename, content }),
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error creando archivo de ejemplo');
    }
  }

  async validateFile(filename: string): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/files/validate/${filename}`, {
      method: 'POST',
    });
    
    const result: ApiResponse = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Error validando archivo');
    }
    
    return result.data;
  }

  // ===== WEBSOCKET =====

  connectWebSocket(onMessage: (data: any) => void): void {
    const wsUrl = config.wsUrl;
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parseando mensaje WebSocket:', error);
      }
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket desconectado');
      this.attemptReconnect(onMessage);
    };
    
    this.ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
  }

  private attemptReconnect(onMessage: (data: any) => void): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Intentando reconectar... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket(onMessage);
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('Máximo número de intentos de reconexión alcanzado');
    }
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // ===== UTILIDADES =====

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      const result = await response.json();
      return result.status === 'ok';
    } catch (error) {
      return false;
    }
  }
}

// Instancia singleton
export const orquestadorAPI = new OrquestadorAPI();

export default OrquestadorAPI;

