# 🚀 Orquestador de Prompts - VM Setup

Este directorio contiene todo lo necesario para instalar el orquestador de prompts en una máquina virtual.

## 📋 Requisitos de la VM

- **Sistema Operativo**: Ubuntu 20.04+ o similar
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **CPU**: 2 cores mínimo
- **Almacenamiento**: 10GB libres
- **Red**: Acceso a internet y puerto 3001 abierto

## 🛠️ Instalación Automática

```bash
# 1. Clonar o copiar este directorio a la VM
# 2. Ejecutar el script de instalación
chmod +x install.sh
./install.sh
```

## 📝 Configuración Manual

### 1. Variables de Entorno

Edita el archivo `.env`:

```bash
# URL del frontend en Vercel
FRONTEND_URL=https://tu-app.vercel.app

# Variables de Notion (opcional)
NOTION_TOKEN=tu_token_aqui
NOTION_PARENT_ID_OR_URL=tu_parent_id_aqui
```

### 2. Copiar Orquestador

Copia la carpeta `orquestador-prompts` desde tu proyecto local a la VM:

```bash
# Desde tu máquina local
scp -r orquestador-prompts/ usuario@vm-ip:/ruta/del/proyecto/
```

### 3. Iniciar Servicios

```bash
# Iniciar con PM2 (recomendado para producción)
npm run pm2:start

# O iniciar manualmente
npm start
```

## 🔧 Comandos Útiles

```bash
# Ver estado de PM2
pm2 status

# Ver logs
pm2 logs orquestador-api

# Reiniciar servicio
npm run pm2:restart

# Detener servicio
npm run pm2:stop

# Ver logs del orquestador
tail -f orquestador-prompts/orquestador.log
```

## 🌐 Endpoints de la API

- `GET /api/health` - Estado del servidor
- `POST /api/start` - Iniciar orquestador
- `POST /api/stop` - Detener orquestador
- `GET /api/status` - Estado del orquestador
- `GET /api/logs` - Logs del orquestador
- `GET /api/config` - Configuración
- `POST /api/config` - Actualizar configuración

## 🔒 Seguridad

1. **Firewall**: Abre solo el puerto 3001
2. **HTTPS**: Configura un proxy reverso con nginx
3. **Autenticación**: Implementa autenticación en la API si es necesario

## 📱 Acceso Móvil

El frontend en Vercel se conectará a esta VM usando la IP pública y puerto 3001.

## 🐛 Troubleshooting

### Error: "Module not found"
```bash
npm install
```

### Error: "Permission denied"
```bash
chmod +x server.js
```

### Error: "Port already in use"
```bash
pm2 stop orquestador-api
```

### Ver logs detallados
```bash
pm2 logs orquestador-api --lines 100
```


