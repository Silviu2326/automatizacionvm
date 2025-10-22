/**
 * Rutas de configuración del orquestador
 * Maneja la configuración de chats, tiempos de espera, etc.
 */

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import ini from 'ini';
import { updateOrquestadorState, addLog } from '../websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ruta base del orquestador
const ORQUESTADOR_PATH = path.join(__dirname, '../../../orquestador-prompts');
const CONFIG_FILE = path.join(ORQUESTADOR_PATH, 'config.ini');

// Obtener configuración actual
router.get('/', async (req, res) => {
  try {
    const config = await loadConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    console.error('Error cargando configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error cargando configuración',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Actualizar configuración
router.put('/', async (req, res) => {
  try {
    const { chatCount, waitTime, coordinates, templates } = req.body;
    
    // Validar datos
    if (chatCount && (chatCount < 1 || chatCount > 6)) {
      return res.status(400).json({
        success: false,
        error: 'La cantidad de chats debe estar entre 1 y 6'
      });
    }

    if (waitTime && (waitTime < 5 || waitTime > 1200)) {
      return res.status(400).json({
        success: false,
        error: 'El tiempo de espera debe estar entre 5 y 1200 segundos'
      });
    }

    // Actualizar configuración
    await updateConfig({
      chatCount,
      waitTime,
      coordinates,
      templates
    });

    addLog('info', `Configuración actualizada: ${chatCount} chats, ${waitTime}s espera`);
    
    res.json({
      success: true,
      message: 'Configuración actualizada correctamente'
    });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando configuración',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Reiniciar configuración a valores por defecto
router.post('/reset', async (req, res) => {
  try {
    const defaultConfig = {
      chatCount: 1,
      waitTime: 30,
      coordinates: {
        chat1: { x: 800, y: 800 }
      },
      templates: {
        chat1: {
          type: 'Notion_Creator',
          file: '@prompts_notion_creator'
        }
      }
    };

    await updateConfig(defaultConfig);
    
    addLog('info', 'Configuración reiniciada a valores por defecto');
    
    res.json({
      success: true,
      message: 'Configuración reiniciada correctamente',
      data: defaultConfig
    });
  } catch (error) {
    console.error('Error reiniciando configuración:', error);
    res.status(500).json({
      success: false,
      error: 'Error reiniciando configuración',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Verificar estado del orquestador
router.get('/status', async (req, res) => {
  try {
    const configExists = await fs.access(CONFIG_FILE).then(() => true).catch(() => false);
    const orquestadorExists = await fs.access(ORQUESTADOR_PATH).then(() => true).catch(() => false);
    
    res.json({
      success: true,
      data: {
        configExists,
        orquestadorExists,
        orquestadorPath: ORQUESTADOR_PATH,
        configPath: CONFIG_FILE
      }
    });
  } catch (error) {
    console.error('Error verificando estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error verificando estado',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Funciones auxiliares
async function loadConfig() {
  try {
    const configContent = await fs.readFile(CONFIG_FILE, 'utf-8');
    const config = ini.parse(configContent);
    
    return {
      chatCount: parseInt(config.GENERAL?.cantidad_chats || '1'),
      waitTime: parseInt(config.GENERAL?.tiempo_espera_segundos || '30'),
      coordinates: parseCoordinates(config.COORDENADAS || {}),
      templates: parseTemplates(config.PLANTILLAS || {})
    };
  } catch (error) {
    // Si no existe el archivo, devolver configuración por defecto
    return {
      chatCount: 1,
      waitTime: 30,
      coordinates: {
        chat1: { x: 800, y: 800 }
      },
      templates: {
        chat1: {
          type: 'Notion_Creator',
          file: '@prompts_notion_creator'
        }
      }
    };
  }
}

async function updateConfig(newConfig: any) {
  const configData: any = {
    GENERAL: {
      cantidad_chats: newConfig.chatCount || 1,
      tiempo_espera_segundos: newConfig.waitTime || 30
    }
  };
  
  // Sección COORDENADAS
  if (newConfig.coordinates) {
    configData.COORDENADAS = {};
    Object.entries(newConfig.coordinates).forEach(([key, coord]: [string, any]) => {
      if (coord && typeof coord.x === 'number' && typeof coord.y === 'number') {
        const chatNum = key.replace('chat', '');
        configData.COORDENADAS[`chat_${chatNum}_x`] = coord.x;
        configData.COORDENADAS[`chat_${chatNum}_y`] = coord.y;
      }
    });
  }
  
  // Sección PLANTILLAS
  if (newConfig.templates) {
    configData.PLANTILLAS = {};
    Object.entries(newConfig.templates).forEach(([key, template]: [string, any]) => {
      if (template && template.type && template.file) {
        const chatNum = key.replace('chat', '');
        configData.PLANTILLAS[`chat_${chatNum}_tipo`] = template.type;
        configData.PLANTILLAS[`chat_${chatNum}_archivo`] = template.file;
      }
    });
  }
  
  // Sección PASOS_TRABAJO
  if (newConfig.workflowSteps && newConfig.workflowSteps.length > 0) {
    configData.PASOS_TRABAJO = {
      numero_pasos: newConfig.workflowSteps.length
    };
    
    newConfig.workflowSteps.forEach((step: any, index: number) => {
      const stepNum = index + 1;
      configData.PASOS_TRABAJO[`paso_${stepNum}_nombre`] = step.name || `Paso ${stepNum}`;
      configData.PASOS_TRABAJO[`paso_${stepNum}_archivo`] = step.jsonFile || '';
      configData.PASOS_TRABAJO[`paso_${stepNum}_modo`] = step.dataFlowMode || 'json_notion';
      configData.PASOS_TRABAJO[`paso_${stepNum}_tiempo`] = step.waitTime || 30;
      configData.PASOS_TRABAJO[`paso_${stepNum}_activo`] = step.enabled ? 'true' : 'false';
    });
  }
  
  // Asegurar que el directorio existe
  await fs.mkdir(ORQUESTADOR_PATH, { recursive: true });
  
  // Convertir a formato INI y escribir archivo
  const configContent = ini.stringify(configData);
  await fs.writeFile(CONFIG_FILE, configContent, 'utf-8');
}

function parseCoordinates(coordsSection: any) {
  const coordinates: any = {};
  
  Object.entries(coordsSection).forEach(([key, value]) => {
    if (key.startsWith('chat_') && key.endsWith('_x')) {
      const chatNum = key.replace('chat_', '').replace('_x', '');
      if (!coordinates[`chat${chatNum}`]) {
        coordinates[`chat${chatNum}`] = {};
      }
      coordinates[`chat${chatNum}`].x = parseInt(value as string);
    } else if (key.startsWith('chat_') && key.endsWith('_y')) {
      const chatNum = key.replace('chat_', '').replace('_y', '');
      if (!coordinates[`chat${chatNum}`]) {
        coordinates[`chat${chatNum}`] = {};
      }
      coordinates[`chat${chatNum}`].y = parseInt(value as string);
    }
  });
  
  return coordinates;
}

function parseTemplates(templatesSection: any) {
  const templates: any = {};
  
  Object.entries(templatesSection).forEach(([key, value]) => {
    if (key.startsWith('chat_') && key.endsWith('_tipo')) {
      const chatNum = key.replace('chat_', '').replace('_tipo', '');
      if (!templates[`chat${chatNum}`]) {
        templates[`chat${chatNum}`] = {};
      }
      templates[`chat${chatNum}`].type = value;
    } else if (key.startsWith('chat_') && key.endsWith('_archivo')) {
      const chatNum = key.replace('chat_', '').replace('_archivo', '');
      if (!templates[`chat${chatNum}`]) {
        templates[`chat${chatNum}`] = {};
      }
      templates[`chat${chatNum}`].file = value;
    }
  });
  
  return templates;
}

export default router;
