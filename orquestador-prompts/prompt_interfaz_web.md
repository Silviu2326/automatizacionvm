# PROMPT: Interfaz Web para Orquestador de Prompts

## Contexto
Necesito crear una interfaz web moderna y funcional para el sistema "Orquestador de Prompts" que actualmente funciona por consola. La aplicación debe permitir ejecutar el orquestador desde una máquina virtual y monitorear el progreso en tiempo real desde el navegador.

## Especificaciones Técnicas

### Stack Tecnológico
- **Backend**: Flask (Python) con WebSockets para tiempo real
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla o Vue.js)
- **Base de datos**: SQLite para logs y estado
- **Comunicación**: WebSockets para actualizaciones en tiempo real
- **Deployment**: Docker para fácil despliegue en VM

### Arquitectura de la Aplicación

#### 1. Dashboard Principal
```
┌─────────────────────────────────────────────────────────────┐
│ 🎯 ORQUESTADOR DE PROMPTS - DASHBOARD                      │
├─────────────────────────────────────────────────────────────┤
│ Estado del Sistema: 🟢 Activo | 🔴 Inactivo | 🟡 Procesando │
│ Chats Configurados: 2 | Tiempo de Espera: 30s             │
├─────────────────────────────────────────────────────────────┤
│ [Configurar] [Ejecutar] [Ver Logs] [Parar]                  │
└─────────────────────────────────────────────────────────────┘
```

#### 2. Panel de Configuración
- **Cantidad de Chats**: Slider 1-6 con preview visual
- **Archivo JSON**: Upload con drag & drop
- **Tiempo de Espera**: Input numérico con presets
- **Coordenadas**: Mapa visual para configurar posiciones
- **Plantillas**: Selector de prompts por chat

#### 3. Monitor de Ejecución
- **Barra de Progreso**: Porcentaje y tiempo estimado
- **Lista de Tareas**: Estado de cada página (Pendiente/Procesando/Completado/Error)
- **Log en Tiempo Real**: Stream de mensajes con filtros
- **Métricas**: Páginas procesadas, errores, tiempo total

#### 4. Gestión de Archivos
- **Explorador JSON**: Tree view de archivos disponibles
- **Preview de Contenido**: Visualización de ejemplos antes de ejecutar
- **Historial**: Ejecuciones anteriores con resultados

## Funcionalidades Principales

### 1. Configuración Visual
```html
<!-- Ejemplo de interfaz de configuración -->
<div class="config-panel">
  <h3>⚙️ Configuración del Sistema</h3>
  
  <div class="config-group">
    <label>Cantidad de Chats</label>
    <input type="range" min="1" max="6" value="2" id="chat-count">
    <span id="chat-preview">2 chats configurados</span>
  </div>
  
  <div class="config-group">
    <label>Archivo JSON</label>
    <div class="file-drop-zone" id="json-upload">
      <p>Arrastra tu archivo JSON aquí</p>
      <input type="file" accept=".json" hidden>
    </div>
  </div>
  
  <div class="config-group">
    <label>Tiempo de Espera</label>
    <select id="wait-time">
      <option value="10">10 segundos (Rápido)</option>
      <option value="30" selected>30 segundos (Normal)</option>
      <option value="60">60 segundos (Lento)</option>
    </select>
  </div>
</div>
```

### 2. Monitor de Progreso
```html
<!-- Ejemplo de monitor de progreso -->
<div class="progress-monitor">
  <div class="progress-header">
    <h3>📊 Progreso de Ejecución</h3>
    <div class="status-indicators">
      <span class="status-active">🟢 Activo</span>
      <span class="pages-processed">Páginas: 15/42</span>
      <span class="time-elapsed">Tiempo: 12:34</span>
    </div>
  </div>
  
  <div class="progress-bar">
    <div class="progress-fill" style="width: 35.7%"></div>
  </div>
  
  <div class="task-list">
    <div class="task-item completed">
      <span class="task-icon">✅</span>
      <span class="task-name">Agenda Inteligente</span>
      <span class="task-time">2:15</span>
    </div>
    <div class="task-item processing">
      <span class="task-icon">🔄</span>
      <span class="task-name">Recepción & Check-in</span>
      <span class="task-time">0:45</span>
    </div>
    <div class="task-item pending">
      <span class="task-icon">⏳</span>
      <span class="task-name">Recordatorios & Confirmaciones</span>
      <span class="task-time">-</span>
    </div>
  </div>
</div>
```

### 3. Log en Tiempo Real
```html
<!-- Ejemplo de log en tiempo real -->
<div class="log-container">
  <div class="log-header">
    <h3>📝 Log de Ejecución</h3>
    <div class="log-controls">
      <button class="btn-clear">Limpiar</button>
      <button class="btn-pause">Pausar</button>
      <select class="log-filter">
        <option value="all">Todos</option>
        <option value="info">Info</option>
        <option value="warning">Advertencias</option>
        <option value="error">Errores</option>
      </select>
    </div>
  </div>
  
  <div class="log-content" id="log-stream">
    <div class="log-entry info">
      <span class="log-time">14:32:15</span>
      <span class="log-level">INFO</span>
      <span class="log-message">Iniciando procesamiento de página 1/42</span>
    </div>
    <div class="log-entry success">
      <span class="log-time">14:32:18</span>
      <span class="log-level">SUCCESS</span>
      <span class="log-message">Página "Agenda Inteligente" procesada exitosamente</span>
    </div>
    <div class="log-entry warning">
      <span class="log-time">14:32:45</span>
      <span class="log-level">WARNING</span>
      <span class="log-message">Esperando 30 segundos antes de la siguiente página</span>
    </div>
  </div>
</div>
```

## Estilos CSS Requeridos

### 1. Tema Moderno
```css
:root {
  --primary-color: #2563eb;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --bg-color: #f8fafc;
  --card-bg: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}
```

### 2. Componentes Interactivos
```css
.btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--success-color));
  transition: width 0.3s ease;
}
```

## Funcionalidades JavaScript

### 1. WebSocket Connection
```javascript
class OrquestadorWebSocket {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }
  
  connect() {
    this.socket = new WebSocket('ws://localhost:5000/ws');
    
    this.socket.onopen = () => {
      console.log('Conectado al servidor');
      this.reconnectAttempts = 0;
    };
    
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleMessage(data);
    };
    
    this.socket.onclose = () => {
      console.log('Conexión cerrada');
      this.reconnect();
    };
  }
  
  handleMessage(data) {
    switch(data.type) {
      case 'progress':
        this.updateProgress(data.payload);
        break;
      case 'log':
        this.addLogEntry(data.payload);
        break;
      case 'status':
        this.updateStatus(data.payload);
        break;
    }
  }
  
  updateProgress(progress) {
    const progressBar = document.querySelector('.progress-fill');
    const percentage = (progress.current / progress.total) * 100;
    progressBar.style.width = `${percentage}%`;
    
    document.querySelector('.pages-processed').textContent = 
      `Páginas: ${progress.current}/${progress.total}`;
  }
}
```

### 2. File Upload con Drag & Drop
```javascript
class FileUploader {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.container.classList.add('drag-over');
    });
    
    this.container.addEventListener('dragleave', () => {
      this.container.classList.remove('drag-over');
    });
    
    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      this.container.classList.remove('drag-over');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.handleFile(files[0]);
      }
    });
  }
  
  handleFile(file) {
    if (file.type !== 'application/json') {
      this.showError('Solo se permiten archivos JSON');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        this.previewJson(jsonData);
      } catch (error) {
        this.showError('Archivo JSON inválido');
      }
    };
    reader.readAsText(file);
  }
}
```

## Backend Flask

### 1. Estructura de la Aplicación
```python
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit
import json
import subprocess
import threading
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*")

class OrquestadorManager:
    def __init__(self):
        self.is_running = False
        self.current_progress = 0
        self.total_pages = 0
        self.current_page = None
        
    def start_orquestador(self, config):
        if self.is_running:
            return {"error": "Ya hay una ejecución en curso"}
            
        self.is_running = True
        self.total_pages = config.get('total_pages', 0)
        self.current_progress = 0
        
        # Ejecutar en hilo separado
        thread = threading.Thread(target=self._run_orquestador, args=(config,))
        thread.start()
        
        return {"success": "Orquestador iniciado"}
    
    def _run_orquestador(self, config):
        try:
            # Aquí iría la lógica del orquestador original
            for i in range(self.total_pages):
                self.current_progress = i + 1
                self.current_page = f"Página {i + 1}"
                
                # Emitir progreso via WebSocket
                socketio.emit('progress', {
                    'current': self.current_progress,
                    'total': self.total_pages,
                    'page': self.current_page
                })
                
                # Simular procesamiento
                time.sleep(2)
                
        except Exception as e:
            socketio.emit('error', {'message': str(e)})
        finally:
            self.is_running = False
            socketio.emit('completed', {'message': 'Procesamiento completado'})

manager = OrquestadorManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/start', methods=['POST'])
def start_orquestador():
    config = request.json
    result = manager.start_orquestador(config)
    return jsonify(result)

@socketio.on('connect')
def handle_connect():
    print('Cliente conectado')
    emit('status', {'connected': True})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
```

## Template HTML Base

### 1. Estructura Principal
```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Orquestador de Prompts - Dashboard</title>
    <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.1/socket.io.js"></script>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="dashboard-header">
            <h1>🎯 Orquestador de Prompts</h1>
            <div class="status-indicator" id="status-indicator">
                <span class="status-dot"></span>
                <span class="status-text">Desconectado</span>
            </div>
        </header>
        
        <!-- Main Content -->
        <main class="dashboard-content">
            <!-- Configuration Panel -->
            <section class="config-panel card">
                <h2>⚙️ Configuración</h2>
                <!-- Contenido de configuración -->
            </section>
            
            <!-- Progress Monitor -->
            <section class="progress-panel card">
                <h2>📊 Progreso</h2>
                <!-- Contenido de progreso -->
            </section>
            
            <!-- Log Panel -->
            <section class="log-panel card">
                <h2>📝 Log de Ejecución</h2>
                <!-- Contenido de log -->
            </section>
        </main>
    </div>
    
    <script src="{{ url_for('static', filename='js/app.js') }}"></script>
</body>
</html>
```

## Características Especiales

### 1. Responsive Design
- Adaptable a móviles y tablets
- Grid layout que se reorganiza según el tamaño de pantalla
- Componentes que se apilan verticalmente en pantallas pequeñas

### 2. Tiempo Real
- WebSockets para actualizaciones instantáneas
- Reconexión automática si se pierde la conexión
- Indicadores visuales de estado de conexión

### 3. Persistencia
- Guardar configuraciones en localStorage
- Historial de ejecuciones en base de datos
- Exportar logs y métricas

### 4. Seguridad
- Validación de archivos JSON
- Sanitización de inputs
- Rate limiting para APIs
- Autenticación básica opcional

## Deployment en VM

### 1. Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

### 2. Docker Compose
```yaml
version: '3.8'
services:
  orquestador-web:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./data:/app/data
    environment:
      - FLASK_ENV=production
```

### 3. Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name tu-vm-ip;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

## Métricas y Monitoreo

### 1. Dashboard de Métricas
- Páginas procesadas por minuto
- Tiempo promedio por página
- Tasa de errores
- Uso de recursos del sistema

### 2. Alertas
- Notificaciones cuando se complete el procesamiento
- Alertas de errores críticos
- Avisos de configuración incorrecta

### 3. Exportación
- Descargar logs en formato CSV/JSON
- Generar reportes de ejecución
- Exportar configuraciones

---

**Nota**: Este prompt proporciona una especificación completa para crear una interfaz web moderna y funcional para el orquestador. La implementación debe seguir estas especificaciones para garantizar una experiencia de usuario óptima y funcionalidad completa.





