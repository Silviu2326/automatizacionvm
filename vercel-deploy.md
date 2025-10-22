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

En el dashboard de Vercel, añade estas variables:

```
VITE_API_URL=http://tu-vm-ip:3001
VITE_WS_URL=ws://tu-vm-ip:3001
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

### Error: "Failed to fetch"
- Verifica que la VM esté ejecutándose
- Comprueba que el puerto 3001 esté abierto
- Revisa las variables de entorno

### Error: "WebSocket connection failed"
- Verifica VITE_WS_URL
- Comprueba que el WebSocket esté habilitado en la VM

### Error: "Build failed"
- Verifica que todas las dependencias estén en package.json
- Revisa que no haya imports del backend en el frontend


