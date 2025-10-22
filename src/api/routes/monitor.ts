/**
 * Rutas de monitoreo del orquestador
 * Maneja el estado, progreso y control del orquestador Python
 */

import express from 'express';
import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { updateOrquestadorState, addLog, updateTask, updateProgress } from '../websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Estado del proceso del orquestador
let orquestadorProcess: ChildProcess | null = null;
let isRunning = false;
let isPaused = false;

// Obtener estado actual
router.get('/state', (req, res) => {
  res.json({
    success: true,
    data: {
      isRunning,
      isPaused,
      processId: orquestadorProcess?.pid || null
    }
  });
});

// Iniciar orquestador
router.post('/start', async (req, res) => {
  try {
    if (isRunning) {
      return res.status(400).json({
        success: false,
        error: 'El orquestador ya está ejecutándose'
      });
    }

    const { mode = 'automatic' } = req.body;
    
    addLog('info', 'Iniciando orquestador...');
    
    // Determinar qué script ejecutar
    const scriptPath = mode === 'automatic' 
      ? path.join(__dirname, '../../../orquestador-prompts/inicio_rapido_limpio.py')
      : path.join(__dirname, '../../../orquestador-prompts/orquestador_1_chat_notion.py');

    // Ejecutar orquestador
    orquestadorProcess = spawn('python', [scriptPath], {
      cwd: path.join(__dirname, '../../../orquestador-prompts'),
      stdio: ['pipe', 'pipe', 'pipe']
    });

    isRunning = true;
    isPaused = false;

    // Configurar listeners del proceso
    setupProcessListeners(orquestadorProcess);

    updateOrquestadorState({
      isRunning: true,
      isPaused: false,
      status: 'running',
      startTime: new Date().toISOString()
    });

    res.json({
      success: true,
      message: 'Orquestador iniciado correctamente',
      data: {
        processId: orquestadorProcess.pid,
        mode
      }
    });

  } catch (error) {
    console.error('Error iniciando orquestador:', error);
    addLog('error', `Error iniciando orquestador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error iniciando orquestador',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Pausar/Reanudar orquestador
router.post('/pause', (req, res) => {
  try {
    if (!isRunning) {
      return res.status(400).json({
        success: false,
        error: 'El orquestador no está ejecutándose'
      });
    }

    if (orquestadorProcess) {
      if (isPaused) {
        // Reanudar
        orquestadorProcess.kill('SIGCONT');
        isPaused = false;
        addLog('info', 'Orquestador reanudado');
        updateOrquestadorState({
          isPaused: false,
          status: 'running'
        });
      } else {
        // Pausar
        orquestadorProcess.kill('SIGSTOP');
        isPaused = true;
        addLog('info', 'Orquestador pausado');
        updateOrquestadorState({
          isPaused: true,
          status: 'paused'
        });
      }
    }

    res.json({
      success: true,
      message: isPaused ? 'Orquestador pausado' : 'Orquestador reanudado',
      data: {
        isPaused
      }
    });

  } catch (error) {
    console.error('Error pausando/reanudando orquestador:', error);
    addLog('error', `Error pausando orquestador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error pausando orquestador',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Detener orquestador
router.post('/stop', (req, res) => {
  try {
    if (!isRunning) {
      return res.status(400).json({
        success: false,
        error: 'El orquestador no está ejecutándose'
      });
    }

    if (orquestadorProcess) {
      orquestadorProcess.kill('SIGTERM');
      orquestadorProcess = null;
    }

    isRunning = false;
    isPaused = false;

    addLog('info', 'Orquestador detenido');
    updateOrquestadorState({
      isRunning: false,
      isPaused: false,
      status: 'idle',
      currentProgress: 0,
      currentPage: ''
    });

    res.json({
      success: true,
      message: 'Orquestador detenido correctamente'
    });

  } catch (error) {
    console.error('Error deteniendo orquestador:', error);
    addLog('error', `Error deteniendo orquestador: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error deteniendo orquestador',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Obtener logs
router.get('/logs', (req, res) => {
  res.json({
    success: true,
    data: {
      logs: [], // Los logs se manejan via WebSocket
      message: 'Los logs se envían en tiempo real via WebSocket'
    }
  });
});

// Obtener tareas
router.get('/tasks', (req, res) => {
  res.json({
    success: true,
    data: {
      tasks: [], // Las tareas se manejan via WebSocket
      message: 'Las tareas se envían en tiempo real via WebSocket'
    }
  });
});

// Función para configurar listeners del proceso
function setupProcessListeners(process: ChildProcess) {
  // Salida estándar (logs del orquestador)
  process.stdout?.on('data', (data: Buffer) => {
    const output = data.toString().trim();
    if (output) {
      console.log('Orquestador stdout:', output);
      
      // Parsear output para detectar progreso
      if (output.includes('Procesando página')) {
        const match = output.match(/Procesando página (\d+)\/(\d+): (.+)/);
        if (match) {
          const [, current, total, pageName] = match;
          const progress = (parseInt(current) / parseInt(total)) * 100;
          
          updateProgress(progress);
          updateOrquestadorState({
            currentProgress: progress,
            totalPages: parseInt(total),
            currentPage: pageName
          });
          
          addLog('info', `Procesando: ${pageName} (${current}/${total})`);
        }
      } else if (output.includes('✅') || output.includes('Completado')) {
        addLog('success', output);
      } else if (output.includes('❌') || output.includes('Error')) {
        addLog('error', output);
      } else {
        addLog('info', output);
      }
    }
  });

  // Error estándar
  process.stderr?.on('data', (data: Buffer) => {
    const error = data.toString().trim();
    if (error) {
      console.error('Orquestador stderr:', error);
      addLog('error', error);
    }
  });

  // Evento de cierre del proceso
  process.on('close', (code: number | null, signal: string | null) => {
    console.log(`Orquestador terminado con código ${code}, señal ${signal}`);
    
    isRunning = false;
    isPaused = false;
    orquestadorProcess = null;

    if (code === 0) {
      addLog('success', 'Orquestador completado exitosamente');
      updateOrquestadorState({
        isRunning: false,
        isPaused: false,
        status: 'completed',
        currentProgress: 100
      });
    } else {
      addLog('error', `Orquestador terminado con error (código: ${code})`);
      updateOrquestadorState({
        isRunning: false,
        isPaused: false,
        status: 'error'
      });
    }
  });

  // Evento de error del proceso
  process.on('error', (error: Error) => {
    console.error('Error en proceso orquestador:', error);
    addLog('error', `Error en proceso: ${error.message}`);
    
    isRunning = false;
    isPaused = false;
    orquestadorProcess = null;
    
    updateOrquestadorState({
      isRunning: false,
      isPaused: false,
      status: 'error'
    });
  });
}

export default router;

