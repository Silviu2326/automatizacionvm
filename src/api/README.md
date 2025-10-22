# 🚀 API del Orquestador de Prompts

Este es el servidor API que conecta el frontend React con el orquestador Python.

## 📋 Características

- **Configuración**: Gestión de configuración del orquestador
- **Monitoreo**: Control y monitoreo del orquestador en tiempo real
- **Archivos**: Gestión de archivos JSON
- **WebSocket**: Comunicación en tiempo real
- **CORS**: Configurado para desarrollo

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Instalar dependencias del servidor API
npm install express cors ws multer configparser child_process
npm install -D @types/express @types/cors @types/ws @types/multer tsx concurrently
```

## 🚀 Uso

### Desarrollo
```bash
# Ejecutar solo el servidor API
npm run dev:api

# Ejecutar frontend y API juntos
npm run dev:full
```

### Producción
```bash
# Construir y ejecutar
npm run build
npm run dev:api
```

## 📡 Endpoints

### Configuración (`/api/config`)
- `GET /` - Obtener configuración actual
- `PUT /` - Actualizar configuración
- `POST /reset` - Reiniciar configuración
- `GET /status` - Estado del sistema

### Monitoreo (`/api/monitor`)
- `GET /state` - Estado del orquestador
- `POST /start` - Iniciar orquestador
- `POST /pause` - Pausar/Reanudar orquestador
- `POST /stop` - Detener orquestador
- `GET /logs` - Obtener logs
- `GET /tasks` - Obtener tareas

### Archivos (`/api/files`)
- `GET /` - Listar archivos JSON
- `POST /upload` - Subir archivo
- `GET /download/:filename` - Descargar archivo
- `GET /content/:filename` - Leer contenido
- `DELETE /:filename` - Eliminar archivo
- `POST /create-example` - Crear archivo de ejemplo
- `POST /validate/:filename` - Validar archivo

### Salud (`/api/health`)
- `GET /` - Estado del servidor

## 🔌 WebSocket

El servidor incluye un WebSocket en `/ws` para comunicación en tiempo real:

### Mensajes del Cliente
```json
{
  "type": "ping"
}
```

### Mensajes del Servidor
```json
{
  "type": "state",
  "data": { ... }
}
{
  "type": "log",
  "data": { ... }
}
{
  "type": "task",
  "data": { ... }
}
{
  "type": "progress",
  "data": { "progress": 50 }
}
```

## 🏗️ Arquitectura

```
Frontend React
     ↓ HTTP/WebSocket
API Server (Node.js/Express)
     ↓ spawn/child_process
Orquestador Python
```

## 📁 Estructura

```
src/api/
├── server.ts          # Servidor principal
├── websocket.ts       # WebSocket server
├── config.ts          # Configuración
├── routes/
│   ├── config.ts      # Rutas de configuración
│   ├── monitor.ts     # Rutas de monitoreo
│   └── files.ts       # Rutas de archivos
└── README.md          # Esta documentación
```

## 🔧 Configuración

### Variables de Entorno

```bash
API_PORT=3001                    # Puerto del servidor API
FRONTEND_URL=http://localhost:5173 # URL del frontend
ORQUESTADOR_PATH=../../orquestador-prompts # Ruta del orquestador
```

### Configuración por Defecto

- **Puerto**: 3001
- **Frontend**: http://localhost:5173
- **Orquestador**: `../../orquestador-prompts`
- **CORS**: Habilitado para desarrollo
- **Límite de archivos**: 50MB

## 🐛 Debugging

### Logs del Servidor
```bash
# Ver logs en tiempo real
npm run dev:api
```

### WebSocket Debugging
```javascript
// En el navegador
const ws = new WebSocket('ws://localhost:3001/ws');
ws.onmessage = (event) => console.log(JSON.parse(event.data));
```

## 🔒 Seguridad

- **CORS**: Configurado para desarrollo
- **Validación**: Archivos JSON únicamente
- **Límites**: Tamaño máximo de 50MB
- **Sanitización**: Nombres de archivos validados

## 📊 Monitoreo

### Estado del Orquestador
```json
{
  "isRunning": false,
  "isPaused": false,
  "currentProgress": 0,
  "totalPages": 0,
  "currentPage": "",
  "startTime": null,
  "elapsedTime": "00:00:00",
  "status": "idle"
}
```

### Logs
```json
{
  "id": "1234567890",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "level": "info",
  "message": "Orquestador iniciado"
}
```

## 🚨 Troubleshooting

### Error: Puerto en uso
```bash
# Cambiar puerto
API_PORT=3002 npm run dev:api
```

### Error: Orquestador no encontrado
```bash
# Verificar ruta
ls -la orquestador-prompts/
```

### Error: WebSocket no conecta
```bash
# Verificar CORS
# Verificar puerto
# Verificar firewall
```

## 📝 Notas

- El servidor está diseñado para desarrollo
- Para producción, configurar CORS apropiadamente
- El orquestador Python debe estar en la ruta especificada
- Los archivos se almacenan en el directorio del orquestador

