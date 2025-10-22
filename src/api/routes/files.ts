/**
 * Rutas de gestión de archivos
 * Maneja la subida, descarga y gestión de archivos JSON del orquestador
 */

import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { addLog } from '../websocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configurar multer para subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../../orquestador-prompts');
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Mantener el nombre original del archivo
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB límite
  },
  fileFilter: (req, file, cb) => {
    // Solo permitir archivos JSON
    if (file.mimetype === 'application/json' || file.originalname.endsWith('.json')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos JSON'));
    }
  }
});

// Ruta base del orquestador
const ORQUESTADOR_PATH = path.join(__dirname, '../../../orquestador-prompts');

// Listar archivos JSON disponibles
router.get('/', async (req, res) => {
  try {
    const files = await fs.readdir(ORQUESTADOR_PATH);
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    
    const fileDetails = await Promise.all(
      jsonFiles.map(async (filename) => {
        const filePath = path.join(ORQUESTADOR_PATH, filename);
        const stats = await fs.stat(filePath);
        
        return {
          name: filename,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          path: filePath
        };
      })
    );

    res.json({
      success: true,
      data: fileDetails
    });
  } catch (error) {
    console.error('Error listando archivos:', error);
    res.status(500).json({
      success: false,
      error: 'Error listando archivos',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Subir archivo JSON
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No se proporcionó archivo'
      });
    }

    const { filename, path: filePath, size } = req.file;
    
    addLog('info', `Archivo subido: ${filename} (${(size / 1024).toFixed(1)} KB)`);
    
    res.json({
      success: true,
      message: 'Archivo subido correctamente',
      data: {
        filename,
        size,
        path: filePath
      }
    });
  } catch (error) {
    console.error('Error subiendo archivo:', error);
    addLog('error', `Error subiendo archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error subiendo archivo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Descargar archivo JSON
router.get('/download/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(ORQUESTADOR_PATH, filename);
    
    // Verificar que el archivo existe
    await fs.access(filePath);
    
    // Verificar que es un archivo JSON
    if (!filename.endsWith('.json')) {
      return res.status(400).json({
        success: false,
        error: 'Solo se pueden descargar archivos JSON'
      });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    console.error('Error descargando archivo:', error);
    res.status(404).json({
      success: false,
      error: 'Archivo no encontrado',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Leer contenido de archivo JSON
router.get('/content/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(ORQUESTADOR_PATH, filename);
    
    // Verificar que el archivo existe
    await fs.access(filePath);
    
    // Leer contenido del archivo
    const content = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(content);
    
    res.json({
      success: true,
      data: {
        filename,
        content: jsonData,
        size: content.length
      }
    });
  } catch (error) {
    console.error('Error leyendo archivo:', error);
    res.status(500).json({
      success: false,
      error: 'Error leyendo archivo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Eliminar archivo JSON
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(ORQUESTADOR_PATH, filename);
    
    // Verificar que el archivo existe
    await fs.access(filePath);
    
    // Eliminar archivo
    await fs.unlink(filePath);
    
    addLog('info', `Archivo eliminado: ${filename}`);
    
    res.json({
      success: true,
      message: 'Archivo eliminado correctamente'
    });
  } catch (error) {
    console.error('Error eliminando archivo:', error);
    addLog('error', `Error eliminando archivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error eliminando archivo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Crear archivo JSON de ejemplo
router.post('/create-example', async (req, res) => {
  try {
    const { filename = 'ejemplo_paginas_notion.json', content } = req.body;
    
    const exampleContent = content || {
      "configuracion": {
        "categorias": ["Dental", "Software", "Operación"],
        "total_paginas": 5
      },
      "ejemplos": [
        {
          "id": "1",
          "paginaacrear": "Agenda Inteligente",
          "paginaprincipal": "https://www.notion.so/software-dental-29106f76bed48087b33dc97232100566",
          "detalles": "Sistema de gestión de citas y agenda para clínicas dentales"
        },
        {
          "id": "2", 
          "paginaacrear": "Recepción & Check-in",
          "paginaprincipal": "https://www.notion.so/software-dental-29106f76bed48087b33dc97232100566",
          "detalles": "Módulo de recepción y check-in de pacientes"
        }
      ]
    };
    
    const filePath = path.join(ORQUESTADOR_PATH, filename);
    await fs.writeFile(filePath, JSON.stringify(exampleContent, null, 2), 'utf-8');
    
    addLog('info', `Archivo de ejemplo creado: ${filename}`);
    
    res.json({
      success: true,
      message: 'Archivo de ejemplo creado correctamente',
      data: {
        filename,
        path: filePath
      }
    });
  } catch (error) {
    console.error('Error creando archivo de ejemplo:', error);
    addLog('error', `Error creando archivo de ejemplo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    
    res.status(500).json({
      success: false,
      error: 'Error creando archivo de ejemplo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Validar archivo JSON
router.post('/validate/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(ORQUESTADOR_PATH, filename);
    
    // Leer y parsear archivo
    const content = await fs.readFile(filePath, 'utf-8');
    const jsonData = JSON.parse(content);
    
    // Validar estructura básica
    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
      structure: {
        hasExamples: 'ejemplos' in jsonData,
        hasConfiguration: 'configuracion' in jsonData,
        exampleCount: jsonData.ejemplos ? jsonData.ejemplos.length : 0
      }
    };
    
    // Verificar estructura requerida
    if (!jsonData.ejemplos || !Array.isArray(jsonData.ejemplos)) {
      validation.isValid = false;
      validation.errors.push('El archivo debe contener un array "ejemplos"');
    }
    
    if (jsonData.ejemplos && jsonData.ejemplos.length === 0) {
      validation.warnings.push('El array "ejemplos" está vacío');
    }
    
    // Verificar estructura de cada ejemplo
    if (jsonData.ejemplos) {
      jsonData.ejemplos.forEach((ejemplo: any, index: number) => {
        if (!ejemplo.paginaacrear) {
          validation.errors.push(`Ejemplo ${index + 1}: falta "paginaacrear"`);
        }
        if (!ejemplo.paginaprincipal) {
          validation.errors.push(`Ejemplo ${index + 1}: falta "paginaprincipal"`);
        }
        if (!ejemplo.detalles) {
          validation.warnings.push(`Ejemplo ${index + 1}: falta "detalles"`);
        }
      });
    }
    
    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    console.error('Error validando archivo:', error);
    res.status(500).json({
      success: false,
      error: 'Error validando archivo',
      message: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

export default router;

