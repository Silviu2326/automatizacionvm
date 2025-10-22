#!/bin/bash

# Script para configurar monitoreo del sistema
echo "📊 Configurando monitoreo del sistema..."

# Instalar herramientas de monitoreo
sudo apt update
sudo apt install -y htop iotop nethogs

# Crear script de monitoreo
cat > monitor.sh << 'EOF'
#!/bin/bash

echo "=== MONITOREO DEL ORQUESTADOR ==="
echo "Fecha: $(date)"
echo ""

# Estado del proceso
echo "🔍 Estado del proceso:"
if pgrep -f "orquestador_prompts_v2.py" > /dev/null; then
    echo "✅ Orquestador Python ejecutándose"
    echo "PID: $(pgrep -f 'orquestador_prompts_v2.py')"
else
    echo "❌ Orquestador Python no está ejecutándose"
fi

if pgrep -f "server.js" > /dev/null; then
    echo "✅ Servidor Node.js ejecutándose"
    echo "PID: $(pgrep -f 'server.js')"
else
    echo "❌ Servidor Node.js no está ejecutándose"
fi

echo ""

# Uso de recursos
echo "💻 Uso de recursos:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')"
echo "RAM: $(free -h | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
echo "Disco: $(df -h / | awk 'NR==2{print $5}')"

echo ""

# Conexiones de red
echo "🌐 Conexiones de red:"
netstat -tuln | grep :3001

echo ""

# Logs recientes
echo "📝 Logs recientes:"
if [ -f "orquestador-prompts/orquestador.log" ]; then
    tail -5 orquestador-prompts/orquestador.log
else
    echo "No hay logs disponibles"
fi

echo ""
echo "=== FIN DEL MONITOREO ==="
EOF

chmod +x monitor.sh

# Crear cron job para monitoreo cada 5 minutos
(crontab -l 2>/dev/null; echo "*/5 * * * * /home/$USER/vm-setup/monitor.sh >> /home/$USER/vm-setup/monitoring.log 2>&1") | crontab -

echo "✅ Monitoreo configurado"
echo "📊 Ejecutar: ./monitor.sh"
echo "📝 Logs: tail -f monitoring.log"


