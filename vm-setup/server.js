#!/usr/bin/env node
/**
 * Servidor API para Orquestador de Prompts - VM
 * Versión simplificada para despliegue en VM
 */

import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';
import corsConfig from './cors-config.js';

// Cargar variables de entorno
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Configuración CORS
app.use(cors(corsConfig));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// WebSocket para comunicación en tiempo real
const wss = new WebSocketServer({ server });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 Cliente WebSocket conectado');
  clients.add(ws);
  
  ws.on('close', () => {
    console.log('🔌 Cliente WebSocket desconectado');
    clients.delete(ws);
  });
});

// Función para broadcast a todos los clientes
function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Estado del orquestador
let orquestadorProcess = null;
let isRunning = false;

// Rutas API
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Orquestador VM API',
    isRunning,
    pid: orquestadorProcess?.pid || null
  });
});

// Iniciar orquestador
app.post('/api/start', (req, res) => {
  console.log('🚀 POST /api/start - Iniciando orquestador');
  
  if (isRunning) {
    console.log('⚠️ Orquestador ya está ejecutándose');
    return res.json({ success: false, message: 'Orquestador ya está ejecutándose' });
  }

  try {
    // Verificar si hay configuración guardada
    const configPath = path.join(__dirname, 'orquestador-prompts', 'config.ini');
    if (!fs.existsSync(configPath)) {
      console.log('❌ No hay configuración guardada');
      return res.status(400).json({ 
        success: false, 
        message: 'No hay configuración guardada. Configura el sistema primero.' 
      });
    }
    
    console.log('✅ Configuración encontrada, iniciando orquestador...');
    
    const orquestadorPath = path.join(__dirname, 'orquestador-prompts');
    const scriptPath = path.join(orquestadorPath, 'orquestador_prompts_v2.py');
    
    if (!fs.existsSync(scriptPath)) {
      console.log('❌ Script del orquestador no encontrado');
      return res.status(404).json({ 
        success: false, 
        message: 'Script del orquestador no encontrado' 
      });
    }

    console.log('🐍 Ejecutando script Python:', scriptPath);
    orquestadorProcess = spawn('python', [scriptPath], {
      cwd: orquestadorPath,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    orquestadorProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('📝 Orquestador:', output);
      broadcast({ type: 'log', message: output });
    });

    orquestadorProcess.stderr.on('data', (data) => {
      const error = data.toString();
      console.error('❌ Orquestador Error:', error);
      broadcast({ type: 'error', message: error });
    });

    orquestadorProcess.on('close', (code) => {
      console.log(`🏁 Orquestador terminado con código ${code}`);
      isRunning = false;
      orquestadorProcess = null;
      broadcast({ type: 'status', isRunning: false });
    });

    isRunning = true;
    broadcast({ type: 'status', isRunning: true });
    
    console.log('✅ Orquestador iniciado exitosamente, PID:', orquestadorProcess.pid);
    res.json({ success: true, message: 'Orquestador iniciado con configuración guardada', pid: orquestadorProcess.pid });
  } catch (error) {
    console.error('❌ Error iniciando orquestador:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Detener orquestador
app.post('/api/stop', (req, res) => {
  if (!isRunning || !orquestadorProcess) {
    return res.json({ success: false, message: 'Orquestador no está ejecutándose' });
  }

  try {
    orquestadorProcess.kill('SIGTERM');
    isRunning = false;
    orquestadorProcess = null;
    broadcast({ type: 'status', isRunning: false });
    
    res.json({ success: true, message: 'Orquestador detenido' });
  } catch (error) {
    console.error('Error deteniendo orquestador:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Estado del orquestador
app.get('/api/status', (req, res) => {
  res.json({
    isRunning,
    pid: orquestadorProcess?.pid || null,
    uptime: isRunning ? process.uptime() : 0
  });
});

// Obtener configuración guardada
app.get('/api/config/saved', (req, res) => {
  console.log('📋 GET /api/config/saved - Obteniendo configuración guardada');
  const configPath = path.join(__dirname, 'orquestador-prompts', 'config.ini');
  
  try {
    if (!fs.existsSync(configPath)) {
      console.log('⚠️ No hay configuración guardada');
      return res.json({ 
        success: true, 
        hasConfig: false, 
        message: 'No hay configuración guardada' 
      });
    }
    
    const configContent = fs.readFileSync(configPath, 'utf8');
    console.log('✅ Configuración guardada encontrada');
    console.log('📄 Contenido:', configContent.substring(0, 100) + '...');
    
    // Parsear el archivo INI para extraer información
    const lines = configContent.split('\n');
    const config = {
      general: {},
      coordinates: {},
      templates: {},
      pasos_trabajo: {}
    };
    
    let currentSection = '';
    lines.forEach(line => {
      line = line.trim();
      if (line.startsWith('[') && line.endsWith(']')) {
        currentSection = line.slice(1, -1).toLowerCase();
        console.log('📂 Procesando sección:', currentSection);
        // Asegurar que la sección existe
        if (!config[currentSection]) {
          config[currentSection] = {};
          console.log('✅ Sección creada:', currentSection);
        }
      } else if (line.includes('=') && currentSection && config[currentSection]) {
        const [key, value] = line.split('=');
        const cleanKey = key.trim();
        const cleanValue = value.trim();
        console.log('🔧 Asignando:', cleanKey, '=', cleanValue, 'en sección:', currentSection);
        config[currentSection][cleanKey] = cleanValue;
      }
    });
    
    console.log('📊 Configuración parseada:', JSON.stringify(config, null, 2));
    
    res.json({
      success: true,
      hasConfig: true,
      config: configContent,
      parsed: config,
      message: 'Configuración guardada encontrada'
    });
    console.log('📤 Configuración enviada al cliente');
  } catch (error) {
    console.error('❌ Error leyendo configuración guardada:', error);
    res.status(500).json({
      success: false,
      error: 'Error leyendo configuración',
      message: error.message
    });
  }
});

// Obtener logs
app.get('/api/logs', (req, res) => {
  const logPath = path.join(__dirname, 'orquestador-prompts', 'orquestador.log');
  
  if (!fs.existsSync(logPath)) {
    return res.json({ logs: [] });
  }

  try {
    const logs = fs.readFileSync(logPath, 'utf8');
    const logLines = logs.split('\n').filter(line => line.trim());
    res.json({ logs: logLines.slice(-100) }); // Últimas 100 líneas
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo logs' });
  }
});

// Configuración
app.get('/api/config', (req, res) => {
  console.log('📋 GET /api/config - Solicitando configuración');
  const configPath = path.join(__dirname, 'orquestador-prompts', 'config.ini');
  console.log('📁 Ruta de configuración:', configPath);
  
  if (!fs.existsSync(configPath)) {
    console.log('⚠️ Archivo de configuración no existe, creando por defecto');
    // Crear configuración por defecto si no existe
    const defaultConfig = `[GENERAL]
cantidad_chats=1
tiempo_espera_segundos=600

[COORDENADAS]
chat_izq_x=3179
chat_izq_y=912
chat_der_x=3948
chat_der_y=1305
chat_1_x=1751
chat_1_y=1253
chat_2_x=1200
chat_2_y=800

[PLANTILLAS]
chat_1_tipo=Notion_Creator
chat_1_archivo=@prompts_notion_creator
`;
    
    try {
      fs.writeFileSync(configPath, defaultConfig);
    } catch (error) {
      return res.status(500).json({ error: 'Error creando configuración por defecto' });
    }
  }

  try {
    const config = fs.readFileSync(configPath, 'utf8');
    console.log('✅ Configuración leída exitosamente');
    console.log('📄 Contenido de configuración:', config.substring(0, 100) + '...');
    res.json({ 
      success: true, 
      data: {
        config,
        chatCount: 1,
        waitTime: 600,
        coordinates: {
          chat_izq: { x: 3179, y: 912 },
          chat_der: { x: 3948, y: 1305 },
          chat_1: { x: 1751, y: 1253 },
          chat_2: { x: 1200, y: 800 }
        },
        templates: {
          chat_1: { type: 'Notion_Creator', file: '@prompts_notion_creator' }
        }
      }
    });
    console.log('📤 Respuesta enviada al cliente');
  } catch (error) {
    console.error('❌ Error leyendo configuración:', error);
    res.status(500).json({ error: 'Error leyendo configuración' });
  }
});

// Actualizar configuración
app.post('/api/config', (req, res) => {
  console.log('💾 POST /api/config - Guardando configuración');
  console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const { config } = req.body;
  const configPath = path.join(__dirname, 'orquestador-prompts', 'config.ini');
  console.log('📁 Ruta de guardado:', configPath);
  
  try {
    fs.writeFileSync(configPath, config);
    console.log('✅ Configuración guardada exitosamente');
    console.log('📄 Contenido guardado:', config.substring(0, 100) + '...');
    res.json({ success: true, message: 'Configuración actualizada' });
    console.log('📤 Respuesta de éxito enviada');
  } catch (error) {
    console.error('❌ Error guardando configuración:', error);
    res.status(500).json({ error: 'Error guardando configuración' });
  }
});

// Actualizar configuración (PUT para compatibilidad con frontend)
app.put('/api/config', (req, res) => {
  console.log('💾 PUT /api/config - Guardando configuración (PUT)');
  console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
  console.log('📥 Tipo de req.body:', typeof req.body);
  console.log('📥 Claves de req.body:', Object.keys(req.body || {}));
  
  const { chatCount, waitTime, coordinates, templates, workflowSteps } = req.body;
  console.log('📥 chatCount:', chatCount);
  console.log('📥 waitTime:', waitTime);
  console.log('📥 coordinates:', coordinates);
  console.log('📥 templates:', templates);
  console.log('📥 workflowSteps:', workflowSteps);
  
  // Construir el contenido del archivo INI
  let configContent = `[GENERAL]\n`;
  configContent += `cantidad_chats=${chatCount || 1}\n`;
  configContent += `tiempo_espera_segundos=${waitTime || 600}\n\n`;
  
  configContent += `[COORDENADAS]\n`;
  if (coordinates) {
    configContent += `chat_izq_x=${coordinates.chat_izq?.x || 3179}\n`;
    configContent += `chat_izq_y=${coordinates.chat_izq?.y || 912}\n`;
    configContent += `chat_der_x=${coordinates.chat_der?.x || 3948}\n`;
    configContent += `chat_der_y=${coordinates.chat_der?.y || 1305}\n`;
    configContent += `chat_1_x=${coordinates.chat_1?.x || 1751}\n`;
    configContent += `chat_1_y=${coordinates.chat_1?.y || 1253}\n`;
    configContent += `chat_2_x=${coordinates.chat_2?.x || 1200}\n`;
    configContent += `chat_2_y=${coordinates.chat_2?.y || 800}\n\n`;
  }
  
  configContent += `[PLANTILLAS]\n`;
  if (templates && templates.chat_1) {
    configContent += `chat_1_tipo=${templates.chat_1.type || 'Notion_Creator'}\n`;
    configContent += `chat_1_archivo=${templates.chat_1.file || '@prompts_notion_creator'}\n`;
  }
  
  // Agregar sección de pasos de trabajo
  if (workflowSteps && workflowSteps.length > 0) {
    configContent += `\n[PASOS_TRABAJO]\n`;
    configContent += `numero_pasos=${workflowSteps.length}\n`;
    workflowSteps.forEach((step, index) => {
      configContent += `paso_${index + 1}_nombre=${step.name || `Paso ${index + 1}`}\n`;
      configContent += `paso_${index + 1}_archivo=${step.jsonFile || ''}\n`;
      configContent += `paso_${index + 1}_modo=${step.dataFlowMode || 'json_notion'}\n`;
      configContent += `paso_${index + 1}_tiempo=${step.waitTime || 30}\n`;
      configContent += `paso_${index + 1}_activo=${step.enabled ? 'true' : 'false'}\n`;
    });
  }
  
  console.log('📄 Contenido INI generado:', configContent);
  
  const configPath = path.join(__dirname, 'orquestador-prompts', 'config.ini');
  console.log('📁 Ruta de guardado:', configPath);
  
  try {
    fs.writeFileSync(configPath, configContent);
    console.log('✅ Configuración guardada exitosamente (PUT)');
    console.log('📄 Contenido guardado:', configContent.substring(0, 100) + '...');
    res.json({ success: true, message: 'Configuración actualizada' });
    console.log('📤 Respuesta de éxito enviada (PUT)');
  } catch (error) {
    console.error('❌ Error guardando configuración (PUT):', error);
    res.status(500).json({ 
      success: false,
      error: 'Error guardando configuración',
      message: error.message 
    });
  }
});

// Endpoint para archivos
app.get('/api/files', (req, res) => {
  console.log('📁 GET /api/files - Solicitando lista de archivos');
  const orquestadorPath = path.join(__dirname, 'orquestador-prompts');
  console.log('📂 Ruta de archivos:', orquestadorPath);
  
  if (!fs.existsSync(orquestadorPath)) {
    console.log('⚠️ Directorio orquestador-prompts no existe');
    return res.json({ success: true, data: [] });
  }

  try {
    const allFiles = fs.readdirSync(orquestadorPath);
    console.log('📋 Archivos encontrados en directorio:', allFiles);
    
    const files = allFiles
      .filter(file => file.endsWith('.json') || file.endsWith('.txt') || file.endsWith('.md'))
      .map(file => {
        const filePath = path.join(orquestadorPath, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          path: filePath
        };
      });
    
    console.log('📄 Archivos filtrados:', files.map(f => f.name));
    res.json({ success: true, data: files });
    console.log('📤 Lista de archivos enviada al cliente');
  } catch (error) {
    console.error('❌ Error leyendo archivos:', error);
    res.status(500).json({ error: 'Error leyendo archivos' });
  }
});

// Endpoint para obtener prompts por modo
app.get('/api/prompts/:modo', (req, res) => {
  const modo = req.params.modo;
  const promptFile = path.join(__dirname, 'orquestador-prompts', `prompts_${modo}.json`);
  
  if (!fs.existsSync(promptFile)) {
    return res.status(404).json({ error: `Prompt para modo '${modo}' no encontrado` });
  }

  try {
    const promptData = JSON.parse(fs.readFileSync(promptFile, 'utf8'));
    res.json({ success: true, data: promptData });
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo prompt' });
  }
});

// Endpoint para obtener todos los modos disponibles
app.get('/api/modos', (req, res) => {
  const modosFile = path.join(__dirname, 'orquestador-prompts', 'modos_prompts.json');
  
  if (!fs.existsSync(modosFile)) {
    return res.status(404).json({ error: 'Archivo de modos no encontrado' });
  }

  try {
    const modosData = JSON.parse(fs.readFileSync(modosFile, 'utf8'));
    res.json({ success: true, data: modosData });
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo modos' });
  }
});

// Endpoint para obtener configuración de Cursor
app.get('/api/cursor-config', (req, res) => {
  const cursorConfigFile = path.join(__dirname, 'orquestador-prompts', 'config_cursor.json');
  
  if (!fs.existsSync(cursorConfigFile)) {
    return res.status(404).json({ error: 'Configuración de Cursor no encontrada' });
  }

  try {
    const cursorConfig = JSON.parse(fs.readFileSync(cursorConfigFile, 'utf8'));
    res.json({ success: true, data: cursorConfig });
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo configuración de Cursor' });
  }
});

// Endpoint para ejecutar prompt en Cursor
app.post('/api/execute-prompt', async (req, res) => {
  const { prompt, modo, archivo_json } = req.body;
  
  try {
    // Leer el archivo JSON para determinar si tiene múltiples módulos
    let modulos = [];
    let tiempoTotal = 0;
    
    if (archivo_json) {
      const archivoPath = path.join(__dirname, 'orquestador-prompts', archivo_json);
      
      if (fs.existsSync(archivoPath)) {
        const contenido = JSON.parse(fs.readFileSync(archivoPath, 'utf8'));
        
        // Verificar si es un archivo con múltiples módulos
        if (contenido.modulos && Array.isArray(contenido.modulos)) {
          modulos = contenido.modulos;
          tiempoTotal = modulos.length * 300; // 5 minutos por módulo
        } else if (contenido.modulo && contenido.archivo_md) {
          // Es un módulo individual
          modulos = [contenido];
          tiempoTotal = 300; // 5 minutos
        }
      }
    }
    
    const resultado = {
      success: true,
      message: `Configuración procesada correctamente`,
      modo: modo,
      modulos: modulos,
      tiempoTotal: tiempoTotal,
      tiempoTotalMinutos: Math.round(tiempoTotal / 60),
      timestamp: new Date().toISOString()
    };
    
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Error procesando configuración',
      message: error.message 
    });
  }
});

// Endpoint para calcular tiempo de ejecución
app.post('/api/calculate-time', (req, res) => {
  console.log('⏱️ POST /api/calculate-time - Calculando tiempo de ejecución');
  console.log('📥 Datos recibidos:', JSON.stringify(req.body, null, 2));
  
  const { archivo_json, tiempo_por_paso } = req.body;
  
  try {
    let tiempoTotal = 0;
    let numeroModulos = 1;
    
    if (archivo_json) {
      const archivoPath = path.join(__dirname, 'orquestador-prompts', archivo_json);
      console.log('📁 Ruta del archivo:', archivoPath);
      
      if (fs.existsSync(archivoPath)) {
        console.log('✅ Archivo encontrado, leyendo contenido...');
        const contenido = JSON.parse(fs.readFileSync(archivoPath, 'utf8'));
        console.log('📄 Contenido del archivo:', JSON.stringify(contenido, null, 2));
        
        if (contenido.modulos && Array.isArray(contenido.modulos)) {
          numeroModulos = contenido.modulos.length;
          console.log('🔢 Múltiples módulos detectados:', numeroModulos);
        } else {
          console.log('🔢 Módulo individual detectado');
        }
      } else {
        console.log('⚠️ Archivo no encontrado:', archivoPath);
      }
    }
    
    tiempoTotal = numeroModulos * (tiempo_por_paso || 300);
    console.log('⏰ Cálculo:');
    console.log('  - Número de módulos:', numeroModulos);
    console.log('  - Tiempo por paso:', tiempo_por_paso || 300);
    console.log('  - Tiempo total:', tiempoTotal);
    
    const resultado = {
      success: true,
      numeroModulos: numeroModulos,
      tiempoPorPaso: tiempo_por_paso || 300,
      tiempoTotal: tiempoTotal,
      tiempoTotalMinutos: Math.round(tiempoTotal / 60),
      tiempoTotalHoras: Math.round(tiempoTotal / 3600 * 10) / 10
    };
    
    console.log('📊 Resultado calculado:', JSON.stringify(resultado, null, 2));
    res.json(resultado);
    console.log('📤 Respuesta de tiempo enviada al cliente');
  } catch (error) {
    console.error('❌ Error calculando tiempo:', error);
    res.status(500).json({
      success: false,
      error: 'Error calculando tiempo',
      message: error.message
    });
  }
});

// Endpoint para obtener estado del orquestador
app.get('/api/status', (req, res) => {
  console.log('📊 GET /api/status - Solicitando estado del orquestador');
  
  try {
    // Leer estado desde archivo si existe
    const statusFile = path.join(__dirname, 'orquestador-prompts', 'status.json');
    let status = {
      isRunning: false,
      currentStep: 0,
      totalSteps: 0,
      currentModule: '',
      status: 'idle',
      logs: [],
      startTime: null,
      estimatedTime: 0
    };
    
    if (fs.existsSync(statusFile)) {
      const statusData = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
      status = { ...status, ...statusData };
    }
    
    res.json(status);
  } catch (error) {
    console.error('❌ Error obteniendo estado:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error obteniendo estado del orquestador' 
    });
  }
});

// Servir archivos del orquestador
app.use('/orquestador', express.static(path.join(__dirname, 'orquestador-prompts')));

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor API ejecutándose en puerto ${PORT}`);
  console.log(`📡 WebSocket disponible en ws://0.0.0.0:${PORT}`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'Configurar FRONTEND_URL'}`);
  console.log(`📁 Orquestador: ${path.join(__dirname, 'orquestador-prompts')}`);
});

export default app;
