# 👥 Gestión de Roles (Analítica)
*Exportado el 2025-10-23 00:13:14*
---

# 👥 Gestión de Roles (Analítica) - Analítica, BI & Data

Sistema de gestión de roles específico para el módulo de analítica y Business Intelligence del software dental, incluyendo RBAC por dataset/vista, control granular de permisos para Gerencia, Finanzas, Marketing y Jefes de área, con flujos de publicación y seguridad avanzada.

## 🎯 Roles Analíticos

- Gerencia: Acceso completo a dashboards ejecutivos y KPIs estratégicos
- Finanzas: Acceso a métricas financieras, presupuestos y análisis de rentabilidad
- Marketing: Acceso a métricas de adquisición, retención y campañas
- Jefes de Área: Acceso a métricas operativas y de rendimiento de su área
## 🔐 RBAC por Dataset/Vista

- Control granular por dataset específico
- Permisos por vista y dashboard
- Filtros automáticos por rol y contexto
- Herencia de permisos por jerarquía organizacional
- Permisos temporales y por proyecto
## 📊 Matrices de Permisos

<!-- Bloque no procesado: table -->

## 🔄 Flujos de Publicación

1. Creación de dashboard o reporte por analista
1. Configuración de permisos por rol y dataset
1. Revisión y aprobación por supervisor de área
1. Validación de seguridad y cumplimiento
1. Publicación con notificación a usuarios autorizados
1. Monitoreo de uso y feedback de usuarios
## 📋 Niveles de Acceso

<!-- Bloque no procesado: table -->

## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Gestión de Roles Analítica

const RolesAnalyticsDashboard = () => {
  return (
    <div className="roles-analytics-dashboard">
      <h2>Gestión de Roles Analítica</h2>
      <SelectorRol />
      <MatrizPermisos />
      <FlujosPublicacion />
    </div>
  );
};

const SelectorRol = () => {
  const [rol, setRol] = useState('gerencia');
  
  return (
    <div className="selector-rol">
      <h3>Seleccionar Rol</h3>
      <select 
        value={rol}
        onChange={(e) => setRol(e.target.value)}
      >
        <option value="gerencia">Gerencia</option>
        <option value="finanzas">Finanzas</option>
        <option value="marketing">Marketing</option>
        <option value="jefes-area">Jefes de Área</option>
      </select>
    </div>
  );
};
```

```javascript
const MatrizPermisos = () => {
  const [permisos, setPermisos] = useState([]);
  
  return (
    <div className="matriz-permisos">
      <h3>Matriz de Permisos</h3>
      <table className="permisos-table">
        <thead>
          <tr>
            <th>Dataset/Vista</th>
            <th>Crear</th>
            <th>Leer</th>
            <th>Actualizar</th>
            <th>Eliminar</th>
            <th>Publicar</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map(permiso => (
            <PermisoRow key={permiso.id} permiso={permiso} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FlujosPublicacion = () => {
  const [flujos, setFlujos] = useState([]);
  
  return (
    <div className="flujos-publicacion">
      <h3>Flujos de Publicación</h3>
      {flujos.map(flujo => (
        <FlujoCard key={flujo.id} flujo={flujo} />
      ))}
    </div>
  );
};
```

```javascript
const PermisoRow = ({ permiso }) => {
  const { dataset, permisos } = permiso;
  
  return (
    <tr className="permiso-row">
      <td>{dataset}</td>
      <td><Checkbox checked={permisos.crear} /></td>
      <td><Checkbox checked={permisos.leer} /></td>
      <td><Checkbox checked={permisos.actualizar} /></td>
      <td><Checkbox checked={permisos.eliminar} /></td>
      <td><Checkbox checked={permisos.publicar} /></td>
    </tr>
  );
};

const FlujoCard = ({ flujo }) => {
  const { nombre, estado, pasos } = flujo;
  
  return (
    <div className="flujo-card">
      <h4>{nombre}</h4>
      <span className={`estado ${estado}`}>{estado}</span>
      <div className="pasos">
        {pasos.map((paso, index) => (
          <PasoItem key={index} paso={paso} />
        ))}
      </div>
    </div>
  );
};
```

## 🔌 APIs de Permisos

```javascript
// APIs para gestión de permisos analíticos

// Obtener permisos por rol
const getPermisosByRol = async (rolId) => {
  const response = await fetch(`/api/roles-analytics/${rolId}/permisos`);
  return response.json();
};

// Actualizar permisos de rol
const actualizarPermisosRol = async (rolId, permisos) => {
  const response = await fetch(`/api/roles-analytics/${rolId}/permisos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(permisos)
  });
  return response.json();
};

// Validar acceso a dataset
const validarAccesoDataset = async (usuarioId, datasetId) => {
  const response = await fetch(`/api/permisos/validar/${usuarioId}/${datasetId}`);
  return response.json();
};
```

```javascript
// Gestionar flujo de publicación
const iniciarFlujoPublicacion = async (dashboardId, configuracion) => {
  const response = await fetch(`/api/publicacion/iniciar/${dashboardId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracion)
  });
  return response.json();
};

// Aprobar publicación
const aprobarPublicacion = async (flujoId, comentarios) => {
  const response = await fetch(`/api/publicacion/${flujoId}/aprobar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comentarios })
  });
  return response.json();
};

// Obtener flujos de publicación
const getFlujosPublicacion = async (filtros) => {
  const response = await fetch('/api/publicacion/flujos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};
```

```javascript
// Configurar herencia de permisos
const configurarHerenciaPermisos = async (rolPadre, rolHijo) => {
  const response = await fetch('/api/permisos/herencia', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rolPadre, rolHijo })
  });
  return response.json();
};

// Obtener matriz de permisos
const getMatrizPermisos = async () => {
  const response = await fetch('/api/permisos/matriz');
  return response.json();
};

// Exportar configuración de permisos
const exportarConfiguracionPermisos = async (formato) => {
  const response = await fetch(`/api/permisos/exportar/${formato}`);
  return response.blob();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Gestión de Roles Analítica

// Frontend (React)
/src
  /components
    /RolesAnalytics
      - RolesAnalyticsDashboard.jsx
      - SelectorRol.jsx
      - MatrizPermisos.jsx
      - PermisoRow.jsx
      - FlujosPublicacion.jsx
      - FlujoCard.jsx
      - ConfiguracionPermisos.jsx
  /pages
    - RolesAnalyticsPage.jsx
    - PermisosPage.jsx
    - FlujosPublicacionPage.jsx
  /services
    - rolesAnalyticsService.js
    - permisosService.js
    - flujosPublicacionService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /roles-analytics
    - rolesAnalyticsRoutes.js
  /permisos
    - permisosRoutes.js
  /publicacion
    - publicacionRoutes.js
/controllers
  - rolesAnalyticsController.js
  - permisosController.js
  - publicacionController.js
/middleware
  - authMiddleware.js
  - permisosMiddleware.js
/models
  - RolAnalytics.js
  - Permiso.js
  - FlujoPublicacion.js
  - ConfiguracionPermisos.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - roles_analytics
// - permisos
// - flujos_publicacion
// - configuraciones_permisos

// Esquemas principales:
const RolAnalyticsSchema = {
  nombre: String,
  descripcion: String,
  nivel: String, // 'estrategico', 'financiero', 'marketing', 'operativo'
  permisos: [ObjectId],
  datasets: [ObjectId],
  vistas: [ObjectId],
  herencia: ObjectId,
  activo: Boolean,
  fechaCreacion: Date
};
```

```javascript
const PermisoSchema = {
  rolId: ObjectId,
  datasetId: ObjectId,
  vistaId: ObjectId,
  crear: Boolean,
  leer: Boolean,
  actualizar: Boolean,
  eliminar: Boolean,
  publicar: Boolean,
  exportar: Boolean,
  compartir: Boolean,
  comentar: Boolean,
  activo: Boolean,
  fechaAsignacion: Date
};

const FlujoPublicacionSchema = {
  dashboardId: ObjectId,
  creadorId: ObjectId,
  estado: String, // 'borrador', 'revision', 'aprobado', 'publicado'
  pasos: [Object],
  aprobadores: [ObjectId],
  fechaCreacion: Date,
  fechaPublicacion: Date
};
```

## 📋 Funcionalidades Principales

- Control granular de permisos por dataset y vista
- Flujos de publicación con aprobaciones
- Herencia de permisos por jerarquía
- Matrices de permisos configurables
- Auditoría completa de accesos y cambios
- Notificaciones automáticas de cambios
## 🎯 Tipos de Roles Analíticos

- Gerencia: Acceso estratégico completo
- Finanzas: Acceso a métricas financieras
- Marketing: Acceso a métricas de marketing
- Jefes de Área: Acceso operativo por área
## 🔒 Beneficios del Sistema

- Seguridad granular por dataset y vista
- Control de acceso basado en roles organizacionales
- Flujos de aprobación automatizados
- Auditoría completa de accesos y cambios
- Cumplimiento normativo y gobernanza
## 🚀 Implementación

1. Configuración inicial de roles analíticos
1. Implementación de matrices de permisos
1. Configuración de flujos de publicación
1. Capacitación del equipo en gestión de permisos
1. Configuración de auditoría y monitoreo
---

*Sistema de gestión de roles específico para analítica y BI diseñado para proporcionar control granular de acceso por dataset y vista, facilitando la gobernanza de datos y el cumplimiento normativo en el software dental.*

