# 📊 KPIs Operativos
*Exportado el 2025-10-23 00:13:07*
---

# 📊 KPIs Operativos - Analítica, BI & Data

Sistema integral de indicadores clave de rendimiento operativos para el software dental, incluyendo ocupación, no-show, ticket medio, aceptación y otros KPIs críticos para la gestión eficiente de la clínica dental.

## 📈 Definiciones de KPIs

- Ocupación: Porcentaje de tiempo de sillón utilizado vs tiempo disponible
- No-Show: Porcentaje de citas no asistidas sin cancelación previa
- Ticket Medio: Valor promedio de facturación por paciente atendido
- Aceptación: Porcentaje de presupuestos aceptados por los pacientes
- Tiempo de Espera: Tiempo promedio de espera de pacientes
## 🧮 Fórmulas de Cálculo

```javascript
// Fórmulas de KPIs Operativos

// 1. Ocupación
const calcularOcupacion = (tiempoUtilizado, tiempoDisponible) => {
  return (tiempoUtilizado / tiempoDisponible) * 100;
};

// 2. No-Show
const calcularNoShow = (citasNoAsistidas, totalCitas) => {
  return (citasNoAsistidas / totalCitas) * 100;
};

// 3. Ticket Medio
const calcularTicketMedio = (facturacionTotal, pacientesAtendidos) => {
  return facturacionTotal / pacientesAtendidos;
};

// 4. Aceptación
const calcularAceptacion = (presupuestosAceptados, totalPresupuestos) => {
  return (presupuestosAceptados / totalPresupuestos) * 100;
};
```

```javascript
// 5. Tiempo de Espera
const calcularTiempoEspera = (tiempoEsperaTotal, numeroPacientes) => {
  return tiempoEsperaTotal / numeroPacientes;
};

// 6. Productividad por Hora
const calcularProductividadHora = (facturacionTotal, horasTrabajadas) => {
  return facturacionTotal / horasTrabajadas;
};

// 7. Tasa de Cancelación
const calcularTasaCancelacion = (citasCanceladas, totalCitas) => {
  return (citasCanceladas / totalCitas) * 100;
};

// 8. Satisfacción del Paciente
const calcularSatisfaccion = (puntuacionTotal, numeroEvaluaciones) => {
  return puntuacionTotal / numeroEvaluaciones;
};
```

## 🗄️ Fuentes de Datos

- Sistema de citas y agenda
- Módulo de facturación y cobros
- Historia clínica y tratamientos
- Sistema de presupuestos y aceptaciones
- Encuestas de satisfacción
## 📊 Cuadros de Mando

<!-- Bloque no procesado: table -->

## 📋 Matrices de KPIs

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Filtros

- Filtros por período (diario, semanal, mensual, anual)
- Filtros por profesional o sillón
- Filtros por tipo de tratamiento
- Filtros por segmento de pacientes
- Filtros por canal de adquisición
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para KPIs Operativos

const KPIsDashboard = () => {
  return (
    <div className="kpis-dashboard">
      <h2>Dashboard de KPIs Operativos</h2>
      <KPIsCards />
      <KPIsCharts />
      <FiltrosKPIs />
    </div>
  );
};

const KPIsCards = () => {
  const [kpis, setKpis] = useState([]);
  
  return (
    <div className="kpis-cards">
      {kpis.map(kpi => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
};
```

```javascript
const KPIsCharts = () => {
  const [datos, setDatos] = useState({});
  
  return (
    <div className="kpis-charts">
      <LineChart 
        title="Evolución de Ocupación"
        data={datos.ocupacion}
        color="#3B82F6"
      />
      <BarChart 
        title="No-Show por Mes"
        data={datos.noShow}
        color="#EF4444"
      />
      <AreaChart 
        title="Ticket Medio"
        data={datos.ticketMedio}
        color="#10B981"
      />
    </div>
  );
};

const FiltrosKPIs = () => {
  const [filtros, setFiltros] = useState({
    periodo: 'mensual',
    profesional: '',
    tratamiento: '',
    segmento: ''
  });
  
  return (
    <div className="filtros-kpis">
      <select 
        value={filtros.periodo}
        onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
      >
        <option value="diario">Diario</option>
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </select>
    </div>
  );
};
```

```javascript
const KPICard = ({ kpi }) => {
  const { nombre, valor, meta, tendencia, color } = kpi;
  
  return (
    <div className="kpi-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="kpi-header">
        <h3>{nombre}</h3>
        <span className={`tendencia ${tendencia > 0 ? 'positiva' : 'negativa'}`}>
          {tendencia > 0 ? '↗️' : '↘️'} {Math.abs(tendencia)}%
        </span>
      </div>
      <div className="kpi-valor">
        <span className="valor-actual">{valor}</span>
        <span className="meta">Meta: {meta}</span>
      </div>
      <div className="kpi-progreso">
        <ProgressBar 
          valor={valor} 
          meta={meta} 
          color={color}
        />
      </div>
    </div>
  );
};
```

## 🔌 APIs de Datos

```javascript
// APIs para gestión de KPIs Operativos

// Obtener KPIs por período
const getKPIsByPeriodo = async (periodo, filtros) => {
  const response = await fetch(`/api/kpis/periodo/${periodo}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener ocupación
const getOcupacion = async (filtros) => {
  const response = await fetch('/api/kpis/ocupacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener no-show
const getNoShow = async (filtros) => {
  const response = await fetch('/api/kpis/no-show', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};
```

```javascript
// Obtener ticket medio
const getTicketMedio = async (filtros) => {
  const response = await fetch('/api/kpis/ticket-medio', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener aceptación
const getAceptacion = async (filtros) => {
  const response = await fetch('/api/kpis/aceptacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener comparativa de KPIs
const getComparativaKPIs = async (periodo1, periodo2) => {
  const response = await fetch(`/api/kpis/comparativa/${periodo1}/${periodo2}`);
  return response.json();
};
```

```javascript
// Exportar reporte de KPIs
const exportarReporteKPIs = async (filtros, formato) => {
  const response = await fetch('/api/kpis/exportar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filtros, formato })
  });
  return response.blob();
};

// Obtener alertas de KPIs
const getAlertasKPIs = async () => {
  const response = await fetch('/api/kpis/alertas');
  return response.json();
};

// Configurar metas de KPIs
const configurarMetasKPIs = async (kpiId, meta) => {
  const response = await fetch(`/api/kpis/${kpiId}/meta`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta })
  });
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para KPIs Operativos

// Frontend (React)
/src
  /components
    /KPIs
      - KPIsDashboard.jsx
      - KPIsCards.jsx
      - KPICard.jsx
      - KPIsCharts.jsx
      - FiltrosKPIs.jsx
      - ComparativaKPIs.jsx
  /pages
    - KPIsPage.jsx
    - ReportesKPIsPage.jsx
    - ConfiguracionKPIsPage.jsx
  /services
    - kpisService.js
    - reportesService.js
    - alertasService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /kpis
    - kpisRoutes.js
  /reportes
    - reportesRoutes.js
  /alertas
    - alertasRoutes.js
/controllers
  - kpisController.js
  - reportesController.js
  - alertasController.js
/middleware
  - kpisMiddleware.js
  - validacionMiddleware.js
/models
  - KPI.js
  - MetricaKPI.js
  - AlertaKPI.js
  - ConfiguracionKPI.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - kpis
// - metricas_kpi
// - alertas_kpi
// - configuraciones_kpi

// Esquemas principales:
const KPISchema = {
  nombre: String,
  descripcion: String,
  formula: String,
  fuenteDatos: String,
  unidad: String,
  meta: Number,
  activo: Boolean,
  categoria: String, // 'operativo', 'financiero', 'calidad'
  fechaCreacion: Date
};
```

```javascript
const MetricaKPISchema = {
  kpiId: ObjectId,
  valor: Number,
  fecha: Date,
  periodo: String, // 'diario', 'semanal', 'mensual'
  filtros: Object,
  calculado: Boolean,
  fuente: String
};

const AlertaKPISchema = {
  kpiId: ObjectId,
  tipo: String, // 'meta', 'tendencia', 'anomalia'
  severidad: String, // 'baja', 'media', 'alta', 'critica'
  mensaje: String,
  activa: Boolean,
  fechaCreacion: Date,
  fechaResolucion: Date
};
```

## 📋 Funcionalidades Principales

- Cálculo automático de KPIs en tiempo real
- Visualización interactiva con gráficos y dashboards
- Filtros avanzados por múltiples criterios
- Comparativas históricas y tendencias
- Alertas automáticas por desviaciones
- Exportación de reportes en múltiples formatos
## 🎯 Tipos de KPIs Operativos

- KPIs de ocupación y utilización
- KPIs de asistencia y no-show
- KPIs financieros y de facturación
- KPIs de satisfacción del paciente
## 🔒 Beneficios del Sistema

- Visibilidad completa del rendimiento operativo
- Identificación proactiva de problemas
- Optimización de recursos y procesos
- Toma de decisiones basada en datos
- Mejora continua del rendimiento
## 🚀 Implementación

1. Configuración inicial de KPIs base
1. Implementación de algoritmos de cálculo
1. Configuración de alertas automáticas
1. Capacitación del equipo en interpretación de KPIs
1. Configuración de reportes automáticos
---

*Sistema integral de KPIs operativos diseñado para proporcionar visibilidad completa del rendimiento de la clínica dental, facilitando la toma de decisiones basada en datos y la optimización continua de procesos operativos.*

