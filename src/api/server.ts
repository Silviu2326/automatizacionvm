#!/usr/bin/env node
/**
 * Servidor API para Orquestador de Prompts
 * Conecta el frontend React con el orquestador Python
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';

// Importar rutas
import configRoutes from './routes/config.js';
import monitorRoutes from './routes/monitor.js';
import filesRoutes from './routes/files.js';
import { setupWebSocket } from './websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://34.175.149.246:5173',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar WebSocket
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Rutas API
app.use('/api/config', configRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/files', filesRoutes);

// Ruta de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Orquestador API'
  });
});

// Ruta para servir archivos estáticos del orquestador
app.use('/orquestador', express.static(path.join(__dirname, '../../orquestador-prompts')));

// Manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error en API:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
});

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor API ejecutándose en puerto ${PORT}`);
  console.log(`📡 WebSocket disponible en ws://34.175.149.246:${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://34.175.149.246:5173'}`);
  console.log(`📁 Orquestador: ${path.join(__dirname, '../../orquestador-prompts')}`);
});

export default app;

