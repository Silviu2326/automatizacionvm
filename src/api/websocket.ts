/**
 * WebSocket Server para comunicación en tiempo real
 * Maneja updates del orquestador Python al frontend React
 */

import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';

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

// Event Emitter para comunicación entre módulos
export const orquestadorEvents = new EventEmitter();

// Estado global del orquestador
export let orquestadorState: OrquestadorState = {
  isRunning: false,
  isPaused: false,
  currentProgress: 0,
  totalPages: 0,
  currentPage: '',
  startTime: null,
  elapsedTime: '00:00:00',
  status: 'idle'
};

export let logs: LogEntry[] = [];
export let tasks: Task[] = [];

export function setupWebSocket(wss: WebSocketServer) {
  console.log('🔌 Configurando WebSocket Server...');

  wss.on('connection', (ws: WebSocket) => {
    console.log('👤 Cliente WebSocket conectado');
    
    // Enviar estado inicial al cliente
    ws.send(JSON.stringify({
      type: 'state',
      data: orquestadorState
    }));

    ws.send(JSON.stringify({
      type: 'logs',
      data: logs
    }));

    ws.send(JSON.stringify({
      type: 'tasks',
      data: tasks
    }));

    // Manejar mensajes del cliente
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        handleClientMessage(ws, message);
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
        ws.send(JSON.stringify({
          type: 'error',
          data: { message: 'Error procesando mensaje' }
        }));
      }
    });

    ws.on('close', () => {
      console.log('👤 Cliente WebSocket desconectado');
    });

    ws.on('error', (error) => {
      console.error('Error en WebSocket:', error);
    });
  });

  // Configurar listeners para eventos del orquestador
  setupOrquestadorEventListeners(wss);
}

function handleClientMessage(ws: WebSocket, message: any) {
  switch (message.type) {
    case 'ping':
      ws.send(JSON.stringify({ type: 'pong' }));
      break;
    
    case 'get_state':
      ws.send(JSON.stringify({
        type: 'state',
        data: orquestadorState
      }));
      break;
    
    case 'get_logs':
      ws.send(JSON.stringify({
        type: 'logs',
        data: logs
      }));
      break;
    
    case 'get_tasks':
      ws.send(JSON.stringify({
        type: 'tasks',
        data: tasks
      }));
      break;
    
    default:
      console.log('Mensaje WebSocket no reconocido:', message.type);
  }
}

function setupOrquestadorEventListeners(wss: WebSocketServer) {
  // Escuchar cambios de estado
  orquestadorEvents.on('state_change', (newState: OrquestadorState) => {
    orquestadorState = newState;
    broadcastToAllClients(wss, {
      type: 'state',
      data: newState
    });
  });

  // Escuchar nuevos logs
  orquestadorEvents.on('log_add', (log: LogEntry) => {
    logs.push(log);
    // Mantener solo los últimos 1000 logs
    if (logs.length > 1000) {
      logs = logs.slice(-1000);
    }
    broadcastToAllClients(wss, {
      type: 'log',
      data: log
    });
  });

  // Escuchar cambios en tareas
  orquestadorEvents.on('task_update', (task: Task) => {
    const index = tasks.findIndex(t => t.id === task.id);
    if (index >= 0) {
      tasks[index] = task;
    } else {
      tasks.push(task);
    }
    broadcastToAllClients(wss, {
      type: 'task',
      data: task
    });
  });

  // Escuchar progreso
  orquestadorEvents.on('progress_update', (progress: number) => {
    orquestadorState.currentProgress = progress;
    broadcastToAllClients(wss, {
      type: 'progress',
      data: { progress }
    });
  });
}

function broadcastToAllClients(wss: WebSocketServer, message: any) {
  const messageStr = JSON.stringify(message);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

// Funciones para actualizar estado desde otros módulos
export function updateOrquestadorState(newState: Partial<OrquestadorState>) {
  orquestadorState = { ...orquestadorState, ...newState };
  orquestadorEvents.emit('state_change', orquestadorState);
}

export function addLog(level: LogEntry['level'], message: string) {
  const log: LogEntry = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    level,
    message
  };
  orquestadorEvents.emit('log_add', log);
}

export function updateTask(task: Task) {
  orquestadorEvents.emit('task_update', task);
}

export function updateProgress(progress: number) {
  orquestadorEvents.emit('progress_update', progress);
}

