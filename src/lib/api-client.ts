/**
 * Cliente API optimizado para comunicación con la VM
 * Incluye manejo de errores, reintentos y caché
 */

import config from './config.js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastCheck: Date;
  latency: number;
  retryCount: number;
}

class ApiClient {
  private baseURL: string;
  private retryCount = 0;
  private maxRetries = 3;
  private retryDelay = 1000;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private cacheTimeout = 30000; // 30 segundos

  constructor(baseURL: string = config.apiUrl) {
    this.baseURL = baseURL;
  }

  // ===== MÉTODOS PRIVADOS =====

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = `${options.method || 'GET'}:${url}`;

    // Verificar caché
    if (options.method === 'GET' && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      const data: ApiResponse<T> = await response.json();

      // Guardar en caché si es GET y exitoso
      if (options.method === 'GET' && data.success) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
        });
      }

      this.retryCount = 0;
      return data;
    } catch (error) {
      console.error(`Error en API request: ${endpoint}`, error);
      
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        await this.delay(this.retryDelay * this.retryCount);
        return this.makeRequest(endpoint, options);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error de conexión',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== MÉTODOS PÚBLICOS =====

  async healthCheck(): Promise<ConnectionStatus> {
    const start = Date.now();
    try {
      const response = await fetch(`${this.baseURL}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 segundos timeout
      });
      
      const data = await response.json();
      const latency = Date.now() - start;
      
      return {
        isConnected: response.ok && data.status === 'ok',
        lastCheck: new Date(),
        latency,
        retryCount: this.retryCount,
      };
    } catch (error) {
      return {
        isConnected: false,
        lastCheck: new Date(),
        latency: Date.now() - start,
        retryCount: this.retryCount,
      };
    }
  }

  async getConfig(): Promise<ApiResponse> {
    return this.makeRequest('/api/config');
  }

  async updateConfig(config: any): Promise<ApiResponse> {
    return this.makeRequest('/api/config', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  async startOrquestador(): Promise<ApiResponse> {
    return this.makeRequest('/api/start', {
      method: 'POST',
    });
  }

  async stopOrquestador(): Promise<ApiResponse> {
    return this.makeRequest('/api/stop', {
      method: 'POST',
    });
  }

  async getStatus(): Promise<ApiResponse> {
    return this.makeRequest('/api/status');
  }

  async getLogs(): Promise<ApiResponse> {
    return this.makeRequest('/api/logs');
  }

  // ===== WEBSOCKET =====

  connectWebSocket(onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket(config.wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket conectado');
      this.retryCount = 0;
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parseando mensaje WebSocket:', error);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket desconectado');
      // Intentar reconectar después de un delay
      setTimeout(() => {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++;
          this.connectWebSocket(onMessage);
        }
      }, this.retryDelay * this.retryCount);
    };
    
    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };
    
    return ws;
  }

  // ===== UTILIDADES =====

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }

  getRetryCount(): number {
    return this.retryCount;
  }

  resetRetryCount(): void {
    this.retryCount = 0;
  }
}

// Instancia singleton
export const apiClient = new ApiClient();
export default ApiClient;





