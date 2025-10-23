/**
 * Configuración del servidor API
 */

export const config = {
  // Puerto del servidor API
  port: process.env.API_PORT || 3001,
  
  // URL del frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://34.175.149.246:5173',
  
  // Ruta del orquestador Python
  orquestadorPath: process.env.ORQUESTADOR_PATH || '../../orquestador-prompts',
  
  // Configuración de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://34.175.149.246:5173',
    credentials: true
  },
  
  // Configuración de archivos
  upload: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['application/json', '.json']
  },
  
  // Configuración de WebSocket
  websocket: {
    pingInterval: 30000, // 30 segundos
    maxReconnectAttempts: 5,
    reconnectDelay: 1000
  },
  
  // Configuración de logs
  logs: {
    maxLogs: 1000,
    logLevels: ['info', 'success', 'warning', 'error']
  }
};

export default config;

