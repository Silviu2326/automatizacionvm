#!/bin/bash

# Script para configurar firewall y abrir puertos necesarios
echo "🔥 Configurando firewall para Orquestador..."

# Instalar ufw si no está instalado
sudo apt update
sudo apt install -y ufw

# Configurar reglas básicas
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Permitir SSH (importante para no perder acceso)
sudo ufw allow ssh

# Permitir puerto de la API
sudo ufw allow 3001/tcp

# Permitir puerto HTTP si usas nginx
sudo ufw allow 80/tcp

# Permitir puerto HTTPS si usas SSL
sudo ufw allow 443/tcp

# Habilitar firewall
sudo ufw --force enable

# Mostrar estado
sudo ufw status

echo "✅ Firewall configurado correctamente"
echo "📡 Puertos abiertos:"
echo "   - SSH (22)"
echo "   - API (3001)"
echo "   - HTTP (80)"
echo "   - HTTPS (443)"


