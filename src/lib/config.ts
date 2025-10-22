/**
 * Configuración centralizada para el frontend
 */

export const config = {
  // URLs de la API
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:3001',
  
  // Variables de Notion
  notionToken: import.meta.env.VITE_NOTION_TOKEN,
  notionParentId: import.meta.env.VITE_NOTION_PARENT_ID,
  
  // Configuración de la app
  appName: 'Orquestador de Prompts',
  version: '1.0.0',
  
  // Configuración de reconexión
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  
  // Configuración de logs
  maxLogEntries: 1000,
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  
  // Configuración de archivos
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['.json', '.txt', '.md', '.csv'],
  
  // Configuración de UI
  theme: {
    primary: '#3b82f6',
    secondary: '#64748b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  
  // Configuración de notificaciones
  notifications: {
    enabled: true,
    duration: 5000,
    position: 'top-right',
  },
  
  // Configuración de desarrollo
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default config;


