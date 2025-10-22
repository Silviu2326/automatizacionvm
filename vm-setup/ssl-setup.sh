#!/bin/bash

# Script para configurar SSL con Let's Encrypt
echo "🔒 Configurando SSL para Orquestador..."

# Instalar certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Configurar dominio (cambiar por tu dominio real)
DOMAIN="tu-dominio.com"
EMAIL="tu-email@ejemplo.com"

# Obtener certificado SSL
sudo certbot --nginx -d $DOMAIN --email $EMAIL --agree-tos --non-interactive

# Configurar renovación automática
sudo crontab -l | { cat; echo "0 12 * * * /usr/bin/certbot renew --quiet"; } | sudo crontab -

echo "✅ SSL configurado correctamente"
echo "🔒 Certificado válido para: $DOMAIN"
echo "🔄 Renovación automática configurada"


