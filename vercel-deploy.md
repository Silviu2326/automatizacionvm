# 🚀 Despliegue en Vercel - Orquestador Frontend

## 📋 Pasos para desplegar en Vercel

### 1. Preparar el proyecto

```bash
# Crear carpeta para el frontend
mkdir orquestador-frontend
cd orquestador-frontend

# Copiar archivos necesarios
cp -r src/ ./
cp -r public/ ./
cp package-vercel.json package.json
cp vercel.json ./
cp vite.config.ts ./
cp tailwind.config.js ./
cp postcss.config.js ./
cp tsconfig*.json ./
cp index.html ./
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

**⚠️ IMPORTANTE**: NO configures las variables en `vercel.json`. Deben configurarse en el dashboard de Vercel.

#### Pasos para configurar variables en Vercel:

1. **Ve al dashboard de Vercel**: https://vercel.com/dashboard
2. **Selecciona tu proyecto**
3. **Ve a Settings → Environment Variables**
4. **Agrega cada variable**:
   - `VITE_API_URL`: `http://tu-vm-ip:3001` (reemplaza `tu-vm-ip` con la IP real)
   - `VITE_WS_URL`: `ws://tu-vm-ip:3001` (reemplaza `tu-vm-ip` con la IP real)
   - `VITE_NOTION_TOKEN`: `tu_token_aqui` (opcional)
   - `VITE_NOTION_PARENT_ID`: `tu_parent_id_aqui` (opcional)
5. **Asegúrate de que estén habilitadas para**: Production, Preview y Development
6. **Guarda los cambios**

#### Ejemplo de configuración:
```
VITE_API_URL=http://192.168.1.100:3001
VITE_WS_URL=ws://192.168.1.100:3001
```

### 4. Desplegar en Vercel

```bash
# Opción 1: CLI de Vercel
npm install -g vercel
vercel

# Opción 2: GitHub (recomendado)
# 1. Subir a GitHub
# 2. Conectar repositorio en Vercel
# 3. Configurar variables de entorno
# 4. Deploy automático
```

## 🔧 Configuración adicional

### Variables de entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Añade:
   - `VITE_API_URL`: `http://tu-vm-ip:3001`
   - `VITE_WS_URL`: `ws://tu-vm-ip:3001`

### Dominio personalizado (opcional):

1. Settings → Domains
2. Añade tu dominio personalizado
3. Configura DNS según instrucciones

## 📱 Acceso móvil

Una vez desplegado, tu app estará disponible en:
- **URL**: `https://tu-app.vercel.app`
- **Móvil**: Accesible desde cualquier dispositivo
- **API**: Se conecta a tu VM automáticamente

## 🐛 Troubleshooting

### Error: "Environment Variable VITE_API_URL references Secret which does not exist"
**Solución**: 
1. Ve a Settings → Environment Variables en Vercel
2. Asegúrate de que `VITE_API_URL` esté configurada como Variable (no como Secret)
3. Si aparece como Secret, elimínala y créala de nuevo como Variable
4. Verifica que el valor sea correcto (ej: `http://192.168.1.100:3001`)

### Error: "Failed to fetch"
- Verifica que la VM esté ejecutándose
- Comprueba que el puerto 3001 esté abierto
- Revisa las variables de entorno en Vercel dashboard
- Asegúrate de que la IP de la VM sea accesible desde internet

### Error: "WebSocket connection failed"
- Verifica VITE_WS_URL en Vercel dashboard
- Comprueba que el WebSocket esté habilitado en la VM
- Asegúrate de que la URL use `ws://` (no `wss://` a menos que tengas SSL)

### Error: "Build failed"
- Verifica que todas las dependencias estén en package.json
- Revisa que no haya imports del backend en el frontend
- Comprueba que las variables de entorno estén configuradas correctamente


