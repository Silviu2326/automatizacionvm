# ⚙️ Reglas (si X entonces Y)
*Exportado el 2025-10-23 00:13:16*
---

# ⚙️ Reglas (si X entonces Y) - Automatizaciones & Reglas

Sistema de automatización basado en reglas condicionales para el software dental, incluyendo ejemplos específicos como no-show recontacto, implante revisión, y otras reglas de negocio que automatizan procesos y mejoran la eficiencia operativa de la clínica dental.

## 📋 Ejemplos de Reglas

- No-Show Recontacto: Si paciente no asiste a cita → Enviar SMS de recontacto automático
- Implante Revisión: Si se coloca implante → Programar revisión automática en 7 días
- Recordatorio Cita: Si cita es mañana → Enviar recordatorio por WhatsApp
- Facturación Vencida: Si factura vence en 3 días → Enviar recordatorio de pago
- Cumpleaños Paciente: Si es cumpleaños → Enviar felicitación automática
## 🔄 Flujos de Reglas

1. Detección de evento o condición
1. Evaluación de condiciones de la regla
1. Ejecución de acciones automáticas
1. Registro de ejecución y resultados
1. Notificación a usuarios relevantes
## 📊 Matrices de Reglas

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Condiciones/Acciones

- Condiciones simples: Campo = Valor
- Condiciones compuestas: Múltiples condiciones con AND/OR
- Condiciones temporales: Basadas en fechas y horarios
- Acciones inmediatas: Ejecución al detectar condición
- Acciones programadas: Ejecución en horarios específicos
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Reglas

const ReglasDashboard = () => {
  return (
    <div className="reglas-dashboard">
      <h2>Gestión de Reglas Automáticas</h2>
      <ListaReglas />
      <EditorReglas />
      <LogEjecuciones />
    </div>
  );
};

const ListaReglas = () => {
  const [reglas, setReglas] = useState([]);
  
  return (
    <div className="lista-reglas">
      <h3>Reglas Configuradas</h3>
      {reglas.map(regla => (
        <ReglaCard key={regla.id} regla={regla} />
      ))}
    </div>
  );
};
```

```javascript
const EditorReglas = () => {
  const [regla, setRegla] = useState({
    nombre: '',
    condicion: '',
    accion: '',
    activa: true
  });
  
  return (
    <div className="editor-reglas">
      <h3>Crear/Editar Regla</h3>
      <input 
        type="text" 
        placeholder="Nombre de la regla"
        value={regla.nombre}
        onChange={(e) => setRegla({...regla, nombre: e.target.value})}
      />
      <CondicionBuilder condicion={regla.condicion} />
      <AccionBuilder accion={regla.accion} />
      <button onClick={() => guardarRegla(regla)}>Guardar Regla</button>
    </div>
  );
};

const ReglaCard = ({ regla }) => {
  const { nombre, condicion, accion, activa, ejecuciones } = regla;
  
  return (
    <div className={`regla-card ${activa ? 'activa' : 'inactiva'}`}>
      <h4>{nombre}</h4>
      <p><strong>Si:</strong> {condicion}</p>
      <p><strong>Entonces:</strong> {accion}</p>
      <div className="regla-stats">
        <span>Ejecuciones: {ejecuciones}</span>
        <span className={`estado ${activa ? 'activa' : 'inactiva'}`}>
          {activa ? 'Activa' : 'Inactiva'}
        </span>
      </div>
    </div>
  );
};
```

```javascript
const CondicionBuilder = ({ condicion, onChange }) => {
  return (
    <div className="condicion-builder">
      <h4>Condición (Si...)</h4>
      <select>
        <option value="cita">Cita</option>
        <option value="paciente">Paciente</option>
        <option value="factura">Factura</option>
        <option value="tratamiento">Tratamiento</option>
      </select>
      <select>
        <option value="igual">es igual a</option>
        <option value="diferente">es diferente a</option>
        <option value="mayor">es mayor que</option>
        <option value="menor">es menor que</option>
      </select>
      <input type="text" placeholder="Valor" />
    </div>
  );
};

const AccionBuilder = ({ accion, onChange }) => {
  return (
    <div className="accion-builder">
      <h4>Acción (Entonces...)</h4>
      <select>
        <option value="enviar_sms">Enviar SMS</option>
        <option value="enviar_email">Enviar Email</option>
        <option value="crear_cita">Crear Cita</option>
        <option value="enviar_whatsapp">Enviar WhatsApp</option>
        <option value="crear_tarea">Crear Tarea</option>
      </select>
      <textarea placeholder="Mensaje o detalles de la acción" />
    </div>
  );
};
```

## 🔌 APIs de Reglas

```javascript
// APIs para gestión de Reglas

// Obtener reglas
const getReglas = async (filtros) => {
  const response = await fetch('/api/reglas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Crear regla
const crearRegla = async (reglaData) => {
  const response = await fetch('/api/reglas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reglaData)
  });
  return response.json();
};

// Actualizar regla
const actualizarRegla = async (reglaId, reglaData) => {
  const response = await fetch(`/api/reglas/${reglaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reglaData)
  });
  return response.json();
};
```

```javascript
// Ejecutar regla manualmente
const ejecutarRegla = async (reglaId, contexto) => {
  const response = await fetch(`/api/reglas/${reglaId}/ejecutar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contexto)
  });
  return response.json();
};

// Obtener log de ejecuciones
const getLogEjecuciones = async (filtros) => {
  const response = await fetch('/api/reglas/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Activar/Desactivar regla
const toggleRegla = async (reglaId, activa) => {
  const response = await fetch(`/api/reglas/${reglaId}/toggle`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activa })
  });
  return response.json();
};
```

```javascript
// Obtener estadísticas de reglas
const getEstadisticasReglas = async () => {
  const response = await fetch('/api/reglas/estadisticas');
  return response.json();
};

// Probar regla
const probarRegla = async (reglaId, datosPrueba) => {
  const response = await fetch(`/api/reglas/${reglaId}/probar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosPrueba)
  });
  return response.json();
};

// Exportar reglas
const exportarReglas = async (formato) => {
  const response = await fetch(`/api/reglas/exportar/${formato}`);
  return response.blob();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Reglas

// Frontend (React)
/src
  /components
    /Reglas
      - ReglasDashboard.jsx
      - ListaReglas.jsx
      - ReglaCard.jsx
      - EditorReglas.jsx
      - CondicionBuilder.jsx
      - AccionBuilder.jsx
      - LogEjecuciones.jsx
  /pages
    - ReglasPage.jsx
    - EditorReglaPage.jsx
    - LogEjecucionesPage.jsx
  /services
    - reglasService.js
    - ejecucionesService.js
    - estadisticasService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /reglas
    - reglasRoutes.js
  /ejecuciones
    - ejecucionesRoutes.js
  /automatizaciones
    - automatizacionesRoutes.js
/controllers
  - reglasController.js
  - ejecucionesController.js
  - automatizacionesController.js
/middleware
  - reglasMiddleware.js
  - validacionMiddleware.js
/models
  - Regla.js
  - EjecucionRegla.js
  - Automatizacion.js
  - ConfiguracionRegla.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - reglas
// - ejecuciones_reglas
// - automatizaciones
// - configuraciones_reglas

// Esquemas principales:
const ReglaSchema = {
  nombre: String,
  descripcion: String,
  condicion: Object, // { campo, operador, valor }
  accion: Object, // { tipo, parametros }
  activa: Boolean,
  prioridad: Number,
  categoria: String, // 'citas', 'facturacion', 'pacientes', 'tratamientos'
  fechaCreacion: Date,
  fechaModificacion: Date
};
```

```javascript
const EjecucionReglaSchema = {
  reglaId: ObjectId,
  contexto: Object, // Datos que activaron la regla
  resultado: String, // 'exitoso', 'fallido', 'omitido'
  mensaje: String,
  fechaEjecucion: Date,
  duracion: Number, // en milisegundos
  errores: [String]
};

const AutomatizacionSchema = {
  nombre: String,
  reglas: [ObjectId],
  activa: Boolean,
  horario: String, // 'inmediata', 'diaria', 'semanal'
  configuracion: Object,
  fechaCreacion: Date
};
```

## 📋 Funcionalidades Principales

- Editor visual de reglas con constructor de condiciones
- Ejecución automática y manual de reglas
- Log completo de ejecuciones y resultados
- Estadísticas y métricas de rendimiento
- Pruebas de reglas con datos de ejemplo
- Importación y exportación de configuraciones
## 🎯 Tipos de Reglas

- Reglas de Citas: No-show, recordatorios, reprogramaciones
- Reglas de Facturación: Vencimientos, recordatorios, descuentos
- Reglas de Pacientes: Cumpleaños, seguimiento, reactivación
- Reglas de Tratamientos: Revisiones, seguimiento, recordatorios
## 🔒 Beneficios del Sistema

- Automatización de procesos repetitivos
- Reducción de errores humanos
- Mejora de la experiencia del paciente
- Aumento de la eficiencia operativa
- Personalización de flujos de trabajo
## 🚀 Implementación

1. Configuración inicial de reglas base
1. Implementación del motor de reglas
1. Configuración de integraciones (SMS, Email, WhatsApp)
1. Capacitación del equipo en creación de reglas
1. Configuración de monitoreo y alertas
---

*Sistema de automatización basado en reglas condicionales diseñado para optimizar los procesos de la clínica dental, reduciendo tareas manuales y mejorando la experiencia tanto del personal como de los pacientes.*

