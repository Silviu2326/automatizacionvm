# 🔐 Gestión de Roles (Automatizaciones)
*Exportado el 2025-10-23 00:13:20*
---

# 🔐 Gestión de Roles (Automatizaciones) - Automatizaciones & Reglas

Sistema de gestión de roles y permisos específico para automatizaciones y reglas del software dental. Incluye RBAC (Role-Based Access Control) sobre reglas y ejecuciones, matrices de permisos, flujos de aprobación y control de acceso granular para garantizar la seguridad y el control adecuado de las automatizaciones en la clínica dental.

## 👥 Roles y Permisos

- Administrador de Automatizaciones: Control total sobre reglas y workflows
- Gestor de Reglas: Creación y modificación de reglas específicas
- Ejecutor de Tareas: Ejecución manual de tareas automáticas
- Monitor de Sistema: Visualización de logs y métricas
- Aprobador: Aprobación de cambios críticos en automatizaciones
## 🔒 RBAC sobre Reglas y Ejecuciones

- Control de Acceso a Reglas: Permisos de lectura, escritura, ejecución
- Control de Ejecuciones: Permisos para ejecutar, pausar, reanudar tareas
- Control de Configuración: Permisos para modificar configuraciones del sistema
- Control de Logs: Permisos para acceder a logs y auditoría
- Control de Aprobaciones: Permisos para aprobar cambios críticos
## 📊 Matrices de Permisos

<!-- Bloque no procesado: table -->

## 🔄 Flujos de Aprobación

1. Solicitud de Cambio: Usuario solicita modificación de regla crítica
1. Revisión Técnica: Evaluación del impacto y viabilidad
1. Aprobación Gerencial: Validación por parte del aprobador
1. Implementación: Aplicación del cambio aprobado
1. Verificación: Confirmación del funcionamiento correcto
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Gestión de Roles

const GestionRolesDashboard = () => {
  return (
    <div className="gestion-roles-dashboard">
      <h2>Gestión de Roles y Permisos</h2>
      <ListaRoles />
      <EditorRoles />
      <MatrizPermisos />
      <FlujosAprobacion />
    </div>
  );
};

const ListaRoles = () => {
  const [roles, setRoles] = useState([]);
  
  return (
    <div className="lista-roles">
      <h3>Roles Configurados</h3>
      {roles.map(rol => (
        <RolCard key={rol.id} rol={rol} />
      ))}
    </div>
  );
};

const RolCard = ({ rol }) => {
  const { nombre, descripcion, permisos, usuarios } = rol;
  
  return (
    <div className="rol-card">
      <h4>{nombre}</h4>
      <p>{descripcion}</p>
      <div className="rol-permisos">
        <span>Permisos: {permisos.length}</span>
        <span>Usuarios: {usuarios.length}</span>
      </div>
      <div className="rol-acciones">
        <button onClick={() => editarRol(rol.id)}>Editar</button>
        <button onClick={() => verPermisos(rol.id)}>Ver Permisos</button>
      </div>
    </div>
  );
};
```

```javascript
const EditorRoles = () => {
  const [rol, setRol] = useState({
    nombre: '',
    descripcion: '',
    permisos: [],
    activo: true
  });
  
  return (
    <div className="editor-roles">
      <h3>Crear/Editar Rol</h3>
      <input 
        type="text" 
        placeholder="Nombre del rol"
        value={rol.nombre}
        onChange={(e) => setRol({...rol, nombre: e.target.value})}
      />
      <textarea 
        placeholder="Descripción del rol"
        value={rol.descripcion}
        onChange={(e) => setRol({...rol, descripcion: e.target.value})}
      />
      <SelectorPermisos permisos={rol.permisos} />
      <button onClick={() => guardarRol(rol)}>Guardar Rol</button>
    </div>
  );
};
```

```javascript
const SelectorPermisos = ({ permisos, onChange }) => {
  const categoriasPermisos = {
    'Reglas': ['crear_reglas', 'modificar_reglas', 'eliminar_reglas', 'ver_reglas'],
    'Ejecuciones': ['ejecutar_tareas', 'pausar_tareas', 'reanudar_tareas', 'cancelar_tareas'],
    'Configuración': ['modificar_config', 'ver_config', 'exportar_config'],
    'Logs': ['ver_logs', 'exportar_logs', 'limpiar_logs'],
    'Aprobaciones': ['aprobar_cambios', 'rechazar_cambios', 'ver_solicitudes']
  };
  
  return (
    <div className="selector-permisos">
      <h4>Permisos del Rol</h4>
      {Object.entries(categoriasPermisos).map(([categoria, permisosCategoria]) => (
        <div key={categoria} className="categoria-permisos">
          <h5>{categoria}</h5>
          {permisosCategoria.map(permiso => (
            <label key={permiso} className="permiso-item">
              <input 
                type="checkbox" 
                checked={permisos.includes(permiso)}
                onChange={(e) => {
                  if (e.target.checked) {
                    onChange([...permisos, permiso]);
                  } else {
                    onChange(permisos.filter(p => p !== permiso));
                  }
                }}
              />
              {permiso.replace('_', ' ').toUpperCase()}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
};
```

```javascript
const MatrizPermisos = () => {
  const [matriz, setMatriz] = useState({});
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  
  return (
    <div className="matriz-permisos">
      <h3>Matriz de Permisos</h3>
      <table className="matriz-table">
        <thead>
          <tr>
            <th>Rol</th>
            {permisos.map(permiso => (
              <th key={permiso}>{permiso}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map(rol => (
            <tr key={rol.id}>
              <td>{rol.nombre}</td>
              {permisos.map(permiso => (
                <td key={permiso}>
                  <input 
                    type="checkbox" 
                    checked={matriz[rol.id]?.[permiso] || false}
                    onChange={(e) => actualizarPermiso(rol.id, permiso, e.target.checked)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FlujosAprobacion = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  
  return (
    <div className="flujos-aprobacion">
      <h3>Flujos de Aprobación</h3>
      <div className="solicitudes-pendientes">
        <h4>Solicitudes Pendientes</h4>
        {solicitudes.map(solicitud => (
          <SolicitudCard key={solicitud.id} solicitud={solicitud} />
        ))}
      </div>
    </div>
  );
};
```

```javascript
const SolicitudCard = ({ solicitud }) => {
  const { id, tipo, descripcion, solicitante, fecha, estado } = solicitud;
  
  return (
    <div className={`solicitud-card ${estado}`}>
      <h5>{tipo}</h5>
      <p>{descripcion}</p>
      <div className="solicitud-info">
        <span>Solicitante: {solicitante}</span>
        <span>Fecha: {fecha}</span>
        <span className={`estado ${estado}`}>{estado}</span>
      </div>
      <div className="solicitud-acciones">
        <button onClick={() => aprobarSolicitud(id)}>Aprobar</button>
        <button onClick={() => rechazarSolicitud(id)}>Rechazar</button>
        <button onClick={() => verDetalles(id)}>Ver Detalles</button>
      </div>
    </div>
  );
};

const AsignacionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  
  return (
    <div className="asignacion-usuarios">
      <h3>Asignación de Usuarios a Roles</h3>
      <div className="usuarios-lista">
        {usuarios.map(usuario => (
          <UsuarioCard key={usuario.id} usuario={usuario} roles={roles} />
        ))}
      </div>
    </div>
  );
};
```

## 🔌 APIs de Permisos

```javascript
// APIs para gestión de Roles y Permisos

// Obtener roles
const getRoles = async (filtros) => {
  const response = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Crear rol
const crearRol = async (rolData) => {
  const response = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rolData)
  });
  return response.json();
};

// Actualizar rol
const actualizarRol = async (rolId, rolData) => {
  const response = await fetch(`/api/roles/${rolId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rolData)
  });
  return response.json();
};
```

```javascript
// Asignar permisos a rol
const asignarPermisos = async (rolId, permisos) => {
  const response = await fetch(`/api/roles/${rolId}/permisos`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permisos })
  });
  return response.json();
};

// Asignar usuario a rol
const asignarUsuarioRol = async (usuarioId, rolId) => {
  const response = await fetch(`/api/usuarios/${usuarioId}/roles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rolId })
  });
  return response.json();
};

// Verificar permisos de usuario
const verificarPermisos = async (usuarioId, permiso) => {
  const response = await fetch(`/api/usuarios/${usuarioId}/permisos/${permiso}`);
  return response.json();
};
```

```javascript
// Obtener matriz de permisos
const getMatrizPermisos = async () => {
  const response = await fetch('/api/roles/matriz-permisos');
  return response.json();
};

// Obtener solicitudes de aprobación
const getSolicitudesAprobacion = async (filtros) => {
  const response = await fetch('/api/aprobaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Aprobar solicitud
const aprobarSolicitud = async (solicitudId, comentarios) => {
  const response = await fetch(`/api/aprobaciones/${solicitudId}/aprobar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comentarios })
  });
  return response.json();
};

// Rechazar solicitud
const rechazarSolicitud = async (solicitudId, motivo) => {
  const response = await fetch(`/api/aprobaciones/${solicitudId}/rechazar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo })
  });
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Gestión de Roles

// Frontend (React)
/src
  /components
    /GestionRoles
      - GestionRolesDashboard.jsx
      - ListaRoles.jsx
      - RolCard.jsx
      - EditorRoles.jsx
      - SelectorPermisos.jsx
      - MatrizPermisos.jsx
      - FlujosAprobacion.jsx
      - SolicitudCard.jsx
      - AsignacionUsuarios.jsx
  /pages
    - GestionRolesPage.jsx
    - EditorRolPage.jsx
    - MatrizPermisosPage.jsx
    - AprobacionesPage.jsx
  /services
    - rolesService.js
    - permisosService.js
    - aprobacionesService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /roles
    - rolesRoutes.js
  /permisos
    - permisosRoutes.js
  /aprobaciones
    - aprobacionesRoutes.js
  /usuarios
    - usuariosRoutes.js
/controllers
  - rolesController.js
  - permisosController.js
  - aprobacionesController.js
  - usuariosController.js
/middleware
  - authMiddleware.js
  - permisosMiddleware.js
  - validacionRolMiddleware.js
/models
  - Rol.js
  - Permiso.js
  - UsuarioRol.js
  - SolicitudAprobacion.js
  - LogAcceso.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - roles
// - permisos
// - usuarios_roles
// - solicitudes_aprobacion
// - logs_acceso

// Esquemas principales:
const RolSchema = {
  nombre: String,
  descripcion: String,
  permisos: [String], // Array de IDs de permisos
  activo: Boolean,
  fechaCreacion: Date,
  fechaModificacion: Date,
  creadoPor: ObjectId
};

const PermisoSchema = {
  nombre: String,
  descripcion: String,
  categoria: String, // 'reglas', 'ejecuciones', 'configuracion', 'logs', 'aprobaciones'
  recurso: String, // Recurso al que aplica el permiso
  accion: String, // Acción permitida
  activo: Boolean
};
```

```javascript
const UsuarioRolSchema = {
  usuarioId: ObjectId,
  rolId: ObjectId,
  fechaAsignacion: Date,
  asignadoPor: ObjectId,
  activo: Boolean
};

const SolicitudAprobacionSchema = {
  tipo: String, // 'cambio_regla', 'nuevo_rol', 'modificacion_permisos'
  descripcion: String,
  datos: Object, // Datos específicos de la solicitud
  solicitante: ObjectId,
  estado: String, // 'pendiente', 'aprobada', 'rechazada'
  fechaSolicitud: Date,
  fechaAprobacion: Date,
  aprobadoPor: ObjectId,
  comentarios: String
};
```

## 📋 Funcionalidades Principales

- Gestión completa de roles y permisos
- Matriz visual de permisos por rol
- Flujos de aprobación para cambios críticos
- Asignación de usuarios a roles
- Auditoría de accesos y cambios
- Control granular de permisos por recurso
## 🎯 Tipos de Permisos Específicos

- Reglas: Crear, modificar, eliminar, ver, ejecutar
- Tareas: Ejecutar, pausar, reanudar, cancelar, programar
- Configuración: Modificar, ver, exportar, importar
- Logs: Ver, exportar, limpiar, filtrar
- Aprobaciones: Aprobar, rechazar, ver solicitudes
## 🔒 Beneficios del Sistema

- Seguridad granular en automatizaciones
- Control de acceso basado en roles
- Trazabilidad de cambios y accesos
- Flujos de aprobación para cambios críticos
- Flexibilidad en la asignación de permisos
## 🚀 Implementación

1. Configuración inicial de roles base
1. Implementación del sistema RBAC
1. Configuración de flujos de aprobación
1. Asignación de usuarios a roles
1. Configuración de auditoría y logs
---

*Sistema de gestión de roles y permisos específico para automatizaciones y reglas del software dental, garantizando la seguridad, el control de acceso granular y la trazabilidad completa de todas las operaciones relacionadas con automatizaciones en la clínica dental.*

