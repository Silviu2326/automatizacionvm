#!/bin/bash

# Script para probar la conectividad de red
echo "🌐 Probando conectividad de red..."

# Obtener IP pública
echo "📍 IP pública:"
curl -s ifconfig.me
echo ""

# Obtener IP local
echo "📍 IP local:"
hostname -I
echo ""

# Probar puerto 3001
echo "🔌 Probando puerto 3001..."
if nc -z localhost 3001; then
    echo "✅ Puerto 3001 está abierto localmente"
else
    echo "❌ Puerto 3001 no está disponible"
fi

# Probar conexión externa
echo "🌍 Probando conexión externa..."
if curl -s --connect-timeout 5 http://localhost:3001/api/health > /dev/null; then
    echo "✅ API responde correctamente"
else
    echo "❌ API no responde"
fi

# Probar WebSocket
echo "🔌 Probando WebSocket..."
if nc -z localhost 3001; then
    echo "✅ WebSocket disponible"
else
    echo "❌ WebSocket no disponible"
fi

echo ""
echo "📋 Para probar desde Vercel:"
echo "   curl http://tu-vm-ip:3001/api/health"
echo "   wscat -c ws://tu-vm-ip:3001"


