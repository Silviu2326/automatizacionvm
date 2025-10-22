# 🎯 Orquestador de Prompts - Interfaz Web

## Descripción
Interfaz web moderna para el Orquestador de Prompts, construida con **React + TypeScript + Tailwind CSS + Vite**.

## 🚀 Características

### ✨ **Dashboard Principal**
- **Estado en tiempo real** del orquestador
- **Métricas visuales** (páginas procesadas, tiempo transcurrido, progreso)
- **Panel de control** con botones de inicio/pausa/detener
- **Barra de progreso** animada

### ⚙️ **Configuración Visual**
- **Cantidad de chats** (1-6) con slider y preview
- **Upload de archivos JSON** con drag & drop
- **Tiempo de espera** con presets y personalización
- **Coordenadas de chats** configurables

### 📊 **Monitor de Progreso**
- **Lista de tareas** con estados visuales
- **Log en tiempo real** con filtros y exportación
- **Métricas de rendimiento** (completadas, errores, duración)

### 🎨 **Diseño Moderno**
- **Responsive design** para móviles y desktop
- **Tema consistente** con colores y tipografías
- **Animaciones suaves** y transiciones
- **Iconos Lucide React** para mejor UX

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Icons**: Lucide React
- **Components**: Shadcn/ui

## 📁 Estructura del Proyecto

```
src/features/orquestador/
├── components/
│   ├── OrquestadorDashboard.tsx  # Dashboard principal
│   ├── Progress.tsx             # Barra de progreso
│   ├── LogViewer.tsx           # Visor de logs
│   ├── TaskList.tsx            # Lista de tareas
│   └── ConfigPanel.tsx         # Panel de configuración
└── index.ts                    # Exports
```

## 🚀 Instalación y Uso

### 1. **Instalar dependencias**
```bash
npm install
```

### 2. **Ejecutar en desarrollo**
```bash
npm run dev
```

### 3. **Build para producción**
```bash
npm run build
```

### 4. **Preview de producción**
```bash
npm run preview
```

## 🎯 Funcionalidades Implementadas

### ✅ **Dashboard Completo**
- Estado del sistema en tiempo real
- Métricas visuales con iconos
- Panel de control intuitivo
- Progreso animado

### ✅ **Configuración Avanzada**
- Slider para cantidad de chats
- Upload de archivos con drag & drop
- Configuración de tiempo de espera
- Coordenadas personalizables

### ✅ **Monitor de Ejecución**
- Lista de tareas con estados
- Log streaming con filtros
- Exportación de logs
- Métricas de rendimiento

### ✅ **Diseño Responsive**
- Adaptable a móviles
- Grid layout flexible
- Componentes optimizados

## 🔧 Configuración

### **Variables de Entorno**
```env
VITE_API_URL=http://localhost:5000
VITE_WS_URL=ws://localhost:5000
```

### **Personalización**
- Colores en `tailwind.config.js`
- Componentes en `src/components/ui/`
- Estilos globales en `src/index.css`

## 📱 Responsive Design

### **Desktop (1024px+)**
- Grid de 2 columnas para tareas y logs
- Sidebar de configuración
- Métricas en cards horizontales

### **Tablet (768px-1023px)**
- Grid de 1 columna
- Cards apilados verticalmente
- Configuración en modal

### **Mobile (<768px)**
- Layout vertical
- Componentes optimizados para touch
- Navegación simplificada

## 🎨 Componentes UI

### **Cards**
- `Card` - Contenedor base con sombras
- `Badge` - Etiquetas de estado
- `Button` - Botones con variantes

### **Formularios**
- `Input` - Campos de entrada
- `Progress` - Barras de progreso
- Drag & Drop para archivos

### **Iconos**
- Lucide React para consistencia
- Iconos contextuales por estado
- Animaciones con CSS

## 🔄 Estado y Datos

### **Estado Local**
- React hooks para estado del dashboard
- Simulación de WebSocket
- Persistencia en localStorage

### **Tipos TypeScript**
```typescript
interface OrquestadorState {
  isRunning: boolean;
  currentProgress: number;
  totalPages: number;
  status: 'idle' | 'running' | 'completed';
}
```

## 🚀 Deployment

### **Docker**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### **Vercel/Netlify**
```bash
npm run build
# Deploy dist/ folder
```

## 🔮 Próximas Mejoras

### **Backend Integration**
- [ ] WebSocket real para tiempo real
- [ ] API REST para configuración
- [ ] Base de datos para persistencia

### **Funcionalidades**
- [ ] Historial de ejecuciones
- [ ] Notificaciones push
- [ ] Exportación de reportes
- [ ] Temas oscuro/claro

### **Performance**
- [ ] Lazy loading de componentes
- [ ] Virtualización de listas largas
- [ ] Optimización de re-renders

## 📞 Soporte

Para dudas o problemas:
1. Revisar la documentación
2. Verificar la consola del navegador
3. Comprobar la configuración de red
4. Contactar al equipo de desarrollo

---

**¡Disfruta del Orquestador de Prompts con interfaz web! 🎉**







