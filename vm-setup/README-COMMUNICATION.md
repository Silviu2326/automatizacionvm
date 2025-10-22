# 🔗 Comunicación Vercel ↔ VM

## 📋 Configuración de Red

### 1. **Configuración de la VM**

```bash
# 1. Configurar firewall
chmod +x firewall-setup.sh
./firewall-setup.sh

# 2. Configurar nginx (opcional, para SSL)
sudo cp nginx.conf /etc/nginx/sites-available/orquestador
sudo ln -s /etc/nginx/sites-available/orquestador /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 3. Configurar SSL (opcional)
chmod +x ssl-setup.sh
./ssl-setup.sh

# 4. Probar conectividad
chmod +x network-test.sh
./network-test.sh
```

### 2. **Variables de Entorno en Vercel**

En el dashboard de Vercel, configurar:

```
VITE_API_URL=http://tu-vm-ip:3001
VITE_WS_URL=ws://tu-vm-ip:3001
```

### 3. **Configuración de CORS**

El servidor ya está configurado para aceptar conexiones desde:
- `https://*.vercel.app`
- `https://tu-app.vercel.app`
- `http://localhost:5173` (desarrollo)

## 🔧 Troubleshooting

### Error: "CORS policy"
```bash
# Verificar configuración CORS
curl -H "Origin: https://tu-app.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://tu-vm-ip:3001/api/health
```

### Error: "Connection refused"
```bash
# Verificar que el servidor esté ejecutándose
pm2 status
pm2 logs orquestador-api

# Verificar puerto
netstat -tuln | grep 3001
```

### Error: "WebSocket connection failed"
```bash
# Probar WebSocket
wscat -c ws://tu-vm-ip:3001

# Verificar firewall
sudo ufw status
```

## 📊 Monitoreo

```bash
# Ejecutar monitoreo
./monitoring-setup.sh
./monitor.sh

# Ver logs en tiempo real
pm2 logs orquestador-api --lines 100
tail -f orquestador-prompts/orquestador.log
```

## 🔒 Seguridad

### Configuración recomendada:

1. **Firewall**: Solo puertos necesarios abiertos
2. **SSL**: Certificado Let's Encrypt
3. **Autenticación**: Implementar si es necesario
4. **Rate Limiting**: Limitar requests por IP

### Comandos de seguridad:

```bash
# Verificar puertos abiertos
sudo netstat -tuln

# Verificar conexiones activas
sudo ss -tuln

# Verificar logs de acceso
sudo tail -f /var/log/nginx/access.log
```

## 📱 Pruebas desde Móvil

1. **Abrir Vercel**: `https://tu-app.vercel.app`
2. **Verificar conexión**: Indicador de estado en la app
3. **Probar funcionalidades**: Iniciar/detener orquestador
4. **Verificar logs**: Monitoreo en tiempo real

## 🚀 Optimizaciones

### Para mejor rendimiento:

1. **CDN**: Usar Cloudflare para la VM
2. **Compresión**: Habilitar gzip en nginx
3. **Caché**: Configurar headers de caché
4. **Keep-Alive**: Configurar conexiones persistentes

### Configuración nginx optimizada:

```nginx
# Añadir a nginx.conf
gzip on;
gzip_types text/plain application/json application/javascript text/css;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 1m;
    proxy_cache_use_stale error timeout updating;
}
```


