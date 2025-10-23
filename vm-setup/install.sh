#!/bin/bash

# Script de instalación para VM - Orquestador de Prompts
echo "🚀 Instalando Orquestador de Prompts en VM..."

# Actualizar sistema
echo "📦 Actualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 18
echo "📦 Instalando Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar Python 3 y dependencias
echo "🐍 Instalando Python 3 y dependencias..."
sudo apt install -y python3 python3-pip python3-venv

# Instalar dependencias del sistema para pyautogui
echo "🖥️ Instalando dependencias del sistema..."
sudo apt install -y python3-tk python3-dev libx11-dev libxext-dev libxrender-dev libxtst-dev libxi-dev libxrandr-dev libxss-dev libxinerama-dev libxcursor-dev libxcomposite-dev libxdamage-dev libxfixes-dev libxfont-dev libxft-dev libxmu-dev libxpm-dev libxrandr-dev libxrender-dev libxt-dev libxv-dev libxxf86vm-dev

# Instalar PM2 globalmente
echo "⚙️ Instalando PM2..."
sudo npm install -g pm2

# Crear directorio de logs
echo "📁 Creando directorios..."
mkdir -p logs
mkdir -p orquestador-prompts

# Instalar dependencias Python
echo "🐍 Instalando dependencias Python..."
pip3 install -r requirements.txt

# Instalar dependencias Node.js
echo "📦 Instalando dependencias Node.js..."
npm install

# Configurar variables de entorno
echo "⚙️ Configurando variables de entorno..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Archivo .env creado. Por favor, edita las variables de entorno."
fi

# Crear servicio systemd para PM2
echo "🔧 Configurando servicio systemd..."
sudo pm2 startup systemd -u $USER --hp $HOME

# Dar permisos de ejecución
chmod +x server.js

echo "✅ Instalación completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus configuraciones"
echo "2. Copia la carpeta orquestador-prompts desde tu proyecto"
echo "3. Ejecuta: npm run pm2:start"
echo "4. Verifica el estado: pm2 status"
echo ""
echo "🌐 El servidor estará disponible en: http://tu-vm-ip:3001"
echo "📱 Configura FRONTEND_URL en .env con tu URL de Vercel"





