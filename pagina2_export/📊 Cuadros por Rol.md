# 📊 Cuadros por Rol
*Exportado el 2025-10-23 00:13:12*
---

# 📊 Cuadros por Rol - Analítica, BI & Data

Sistema de cuadros de mando personalizados por rol de usuario en el software dental, incluyendo layouts específicos para propietario, clínica, especialista y marketing, con permisos granulares y métricas clave adaptadas a cada perfil.

## 👑 Propietario

- Vista ejecutiva completa con KPIs financieros
- Métricas de rentabilidad y crecimiento
- Análisis de rendimiento por clínica
- Proyecciones y forecasting
- Acceso completo a todos los módulos
## 🏥 Clínica

- Dashboard operativo con ocupación y citas
- Métricas de productividad del equipo
- Seguimiento de pacientes y tratamientos
- Gestión de agenda y recursos
- Reportes de calidad y satisfacción
## 🦷 Especialista

- Dashboard clínico personalizado por especialidad
- Métricas de rendimiento clínico individual
- Seguimiento de casos y tratamientos
- Análisis de resultados clínicos
- Gestión de agenda personal
## 📢 Marketing

- Dashboard de marketing con métricas de adquisición
- Análisis de canales de captación
- Seguimiento de campañas y ROI
- Métricas de satisfacción y retención
- Análisis de segmentación de pacientes
## 🔐 Permisos por Rol

<!-- Bloque no procesado: table -->

## 📊 Métricas Clave por Rol

<!-- Bloque no procesado: table -->

## 🔄 Flujos de Acceso

1. Autenticación y verificación de rol
1. Carga de permisos específicos del rol
1. Configuración de dashboard personalizado
1. Carga de métricas y widgets autorizados
1. Aplicación de filtros por rol y permisos
1. Renderizado de interfaz personalizada
## 📋 Matrices de Vistas

<!-- Bloque no procesado: table -->

## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Cuadros por Rol

const DashboardPorRol = ({ rol, usuario }) => {
  const [dashboard, setDashboard] = useState(null);
  
  useEffect(() => {
    cargarDashboard(rol, usuario.id);
  }, [rol, usuario.id]);
  
  return (
    <div className="dashboard-por-rol">
      <HeaderRol rol={rol} usuario={usuario} />
      <WidgetsContainer widgets={dashboard?.widgets} />
      <FiltrosRol rol={rol} />
    </div>
  );
};

const HeaderRol = ({ rol, usuario }) => {
  return (
    <div className="header-rol">
      <h1>Dashboard {rol.nombre}</h1>
      <span className="usuario">Bienvenido, {usuario.nombre}</span>
    </div>
  );
};
```

```javascript
const WidgetsContainer = ({ widgets }) => {
  return (
    <div className="widgets-container">
      {widgets?.map(widget => (
        <WidgetCard key={widget.id} widget={widget} />
      ))}
    </div>
  );
};

const WidgetCard = ({ widget }) => {
  const { tipo, datos, configuracion } = widget;
  
  return (
    <div className={`widget-card ${tipo}`}>
      <WidgetHeader widget={widget} />
      <WidgetContent widget={widget} />
      <WidgetActions widget={widget} />
    </div>
  );
};

const FiltrosRol = ({ rol }) => {
  const [filtros, setFiltros] = useState({});
  
  return (
    <div className="filtros-rol">
      <select 
        value={filtros.periodo}
        onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
      >
        <option value="hoy">Hoy</option>
        <option value="semana">Esta Semana</option>
        <option value="mes">Este Mes</option>
      </select>
    </div>
  );
};
```

```javascript
const DashboardPropietario = () => {
  return (
    <div className="dashboard-propietario">
      <KPIFinancieroCard />
      <GraficoRentabilidad />
      <TablaClinicas />
      <ProyeccionesCard />
    </div>
  );
};

const DashboardClinica = () => {
  return (
    <div className="dashboard-clinica">
      <OcupacionCard />
      <CitasHoy />
      <ProductividadEquipo />
      <SatisfaccionPacientes />
    </div>
  );
};

const DashboardEspecialista = () => {
  return (
    <div className="dashboard-especialista">
      <CasosActivos />
      <RendimientoClinico />
      <AgendaPersonal />
      <ResultadosTratamientos />
    </div>
  );
};
```

## 🔌 APIs de Cuadros por Rol

```javascript
// APIs para gestión de Cuadros por Rol

// Obtener dashboard por rol
const getDashboardByRol = async (rolId, usuarioId) => {
  const response = await fetch(`/api/dashboards/rol/${rolId}/usuario/${usuarioId}`);
  return response.json();
};

// Obtener widgets por rol
const getWidgetsByRol = async (rolId) => {
  const response = await fetch(`/api/dashboards/rol/${rolId}/widgets`);
  return response.json();
};

// Obtener métricas por rol
const getMetricasByRol = async (rolId, filtros) => {
  const response = await fetch(`/api/dashboards/rol/${rolId}/metricas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};
```

```javascript
// Personalizar dashboard
const personalizarDashboard = async (usuarioId, configuracion) => {
  const response = await fetch(`/api/dashboards/usuario/${usuarioId}/personalizar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracion)
  });
  return response.json();
};

// Obtener permisos por rol
const getPermisosByRol = async (rolId) => {
  const response = await fetch(`/api/roles/${rolId}/permisos`);
  return response.json();
};

// Validar acceso a vista
const validarAccesoVista = async (usuarioId, vistaId) => {
  const response = await fetch(`/api/permisos/validar/${usuarioId}/${vistaId}`);
  return response.json();
};
```

```javascript
// Exportar dashboard
const exportarDashboard = async (usuarioId, formato) => {
  const response = await fetch(`/api/dashboards/usuario/${usuarioId}/exportar/${formato}`);
  return response.blob();
};

// Obtener configuración de widgets
const getConfiguracionWidgets = async (rolId) => {
  const response = await fetch(`/api/dashboards/rol/${rolId}/configuracion`);
  return response.json();
};

// Actualizar configuración de widgets
const actualizarConfiguracionWidgets = async (rolId, configuracion) => {
  const response = await fetch(`/api/dashboards/rol/${rolId}/configuracion`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracion)
  });
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Cuadros por Rol

// Frontend (React)
/src
  /components
    /Dashboards
      - DashboardPorRol.jsx
      - DashboardPropietario.jsx
      - DashboardClinica.jsx
      - DashboardEspecialista.jsx
      - DashboardMarketing.jsx
      - WidgetCard.jsx
      - FiltrosRol.jsx
  /pages
    - DashboardPage.jsx
    - ConfiguracionDashboardPage.jsx
  /services
    - dashboardService.js
    - permisosService.js
    - widgetsService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /dashboards
    - dashboardsRoutes.js
  /roles
    - rolesRoutes.js
  /permisos
    - permisosRoutes.js
/controllers
  - dashboardsController.js
  - rolesController.js
  - permisosController.js
/middleware
  - authMiddleware.js
  - permisosMiddleware.js
/models
  - Dashboard.js
  - Rol.js
  - Permiso.js
  - Widget.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - dashboards
// - roles
// - permisos
// - widgets

// Esquemas principales:
const DashboardSchema = {
  nombre: String,
  rolId: ObjectId,
  usuarioId: ObjectId,
  widgets: [ObjectId],
  configuracion: Object,
  activo: Boolean,
  fechaCreacion: Date
};
```

```javascript
const RolSchema = {
  nombre: String,
  descripcion: String,
  permisos: [ObjectId],
  widgets: [ObjectId],
  configuracion: Object,
  activo: Boolean,
  fechaCreacion: Date
};

const WidgetSchema = {
  nombre: String,
  tipo: String, // 'kpi', 'grafico', 'tabla', 'lista'
  configuracion: Object,
  datos: Object,
  permisos: [ObjectId],
  activo: Boolean
};
```

## 📋 Funcionalidades Principales

- Dashboards personalizados por rol de usuario
- Sistema de permisos granular por módulo
- Widgets configurables y arrastrables
- Filtros dinámicos por rol y contexto
- Personalización de vistas por usuario
- Exportación de reportes personalizados
## 🎯 Tipos de Roles

- Propietario: Vista ejecutiva completa
- Clínica: Vista operativa y de gestión
- Especialista: Vista clínica personalizada
- Marketing: Vista de adquisición y retención
## 🔒 Beneficios del Sistema

- Experiencia de usuario personalizada
- Seguridad y control de acceso granular
- Eficiencia en la toma de decisiones
- Reducción de complejidad visual
- Mejora de la productividad por rol
## 🚀 Implementación

1. Configuración inicial de roles y permisos
1. Desarrollo de dashboards por rol
1. Implementación de sistema de widgets
1. Configuración de personalización de usuarios
1. Capacitación del equipo en uso de dashboards
---

*Sistema de cuadros de mando personalizados por rol diseñado para proporcionar a cada usuario la información más relevante para su función, mejorando la eficiencia operativa y la toma de decisiones en el software dental.*

