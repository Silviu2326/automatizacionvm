# 💰 KPIs Económicos
*Exportado el 2025-10-23 00:13:10*
---

# 💰 KPIs Económicos - Analítica, BI & Data

Sistema integral de indicadores clave de rendimiento económicos para el software dental, incluyendo margen por tratamiento, ARPU, LTV, CAC, cash-flow y otros KPIs críticos para la gestión financiera y rentabilidad de la clínica dental.

## 📈 Definiciones de KPIs Económicos

- Margen por Tratamiento: Diferencia entre ingresos y costos directos por tratamiento
- ARPU (Average Revenue Per User): Ingresos promedio por paciente
- LTV (Lifetime Value): Valor de vida del cliente
- CAC (Customer Acquisition Cost): Costo de adquisición de cliente
- Cash-Flow: Flujo de caja operativo mensual
## 🧮 Fórmulas de Cálculo

```javascript
// Fórmulas de KPIs Económicos

// 1. Margen por Tratamiento
const calcularMargenTratamiento = (ingresos, costosDirectos) => {
  return ingresos - costosDirectos;
};

// 2. ARPU (Average Revenue Per User)
const calcularARPU = (ingresosTotales, numeroPacientes) => {
  return ingresosTotales / numeroPacientes;
};

// 3. LTV (Lifetime Value)
const calcularLTV = (arpu, tasaRetencion, tasaDescuento) => {
  return (arpu * tasaRetencion) / (1 + tasaDescuento - tasaRetencion);
};

// 4. CAC (Customer Acquisition Cost)
const calcularCAC = (costosAdquisicion, nuevosClientes) => {
  return costosAdquisicion / nuevosClientes;
};
```

```javascript
// 5. Cash-Flow
const calcularCashFlow = (ingresos, gastos) => {
  return ingresos - gastos;
};

// 6. ROI (Return on Investment)
const calcularROI = (beneficio, inversion) => {
  return (beneficio / inversion) * 100;
};

// 7. Margen Bruto
const calcularMargenBruto = (ingresos, costosVentas) => {
  return ((ingresos - costosVentas) / ingresos) * 100;
};

// 8. Rentabilidad por Tratamiento
const calcularRentabilidadTratamiento = (margen, costosFijos) => {
  return margen - costosFijos;
};
```

## 📊 Visualizaciones

- Gráficos de líneas para evolución temporal de KPIs
- Gráficos de barras para comparativas por período
- Gráficos de área para cash-flow acumulado
- Gráficos de donut para distribución de ingresos
- Dashboards interactivos con filtros dinámicos
## 📋 Matrices de KPIs Económicos

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Series

- Series temporales diarias para cash-flow
- Series mensuales para ARPU y LTV
- Series trimestrales para análisis de tendencias
- Series anuales para comparativas históricas
- Configuración de alertas por umbrales
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para KPIs Económicos

const KPIsEconomicosDashboard = () => {
  return (
    <div className="kpis-economicos-dashboard">
      <h2>Dashboard de KPIs Económicos</h2>
      <KPIsEconomicosCards />
      <GraficosEconomicos />
      <FiltrosEconomicos />
    </div>
  );
};

const KPIsEconomicosCards = () => {
  const [kpis, setKpis] = useState([]);
  
  return (
    <div className="kpis-economicos-cards">
      {kpis.map(kpi => (
        <KPIEconomicoCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
};
```

```javascript
const GraficosEconomicos = () => {
  const [datos, setDatos] = useState({});
  
  return (
    <div className="graficos-economicos">
      <LineChart 
        title="Evolución de ARPU"
        data={datos.arpu}
        color="#3B82F6"
      />
      <AreaChart 
        title="Cash-Flow Acumulado"
        data={datos.cashFlow}
        color="#10B981"
      />
      <BarChart 
        title="LTV vs CAC"
        data={datos.ltvCac}
        color="#F59E0B"
      />
      <DonutChart 
        title="Distribución de Ingresos"
        data={datos.distribucionIngresos}
      />
    </div>
  );
};
```

```javascript
const KPIEconomicoCard = ({ kpi }) => {
  const { nombre, valor, meta, tendencia, color } = kpi;
  
  return (
    <div className="kpi-economico-card" style={{ borderLeft: `4px solid ${color}` }}>
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

## 🔌 APIs de KPIs Económicos

```javascript
// APIs para gestión de KPIs Económicos

// Obtener ARPU
const getARPU = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/arpu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener LTV
const getLTV = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/ltv', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener CAC
const getCAC = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/cac', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};
```

```javascript
// Obtener Cash-Flow
const getCashFlow = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/cash-flow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener margen por tratamiento
const getMargenTratamiento = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/margen-tratamiento', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener ROI
const getROI = async (filtros) => {
  const response = await fetch('/api/kpis-economicos/roi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};
```

```javascript
// Exportar reporte económico
const exportarReporteEconomico = async (filtros, formato) => {
  const response = await fetch('/api/kpis-economicos/exportar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filtros, formato })
  });
  return response.blob();
};

// Obtener alertas económicas
const getAlertasEconomicas = async () => {
  const response = await fetch('/api/kpis-economicos/alertas');
  return response.json();
};

// Configurar metas económicas
const configurarMetasEconomicas = async (kpiId, meta) => {
  const response = await fetch(`/api/kpis-economicos/metas/${kpiId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meta })
  });
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para KPIs Económicos

// Frontend (React)
/src
  /components
    /KPIsEconomicos
      - KPIsEconomicosDashboard.jsx
      - KPIsEconomicosCards.jsx
      - KPIEconomicoCard.jsx
      - GraficosEconomicos.jsx
      - FiltrosEconomicos.jsx
      - ComparativaEconomica.jsx
  /pages
    - KPIsEconomicosPage.jsx
    - ReportesEconomicosPage.jsx
    - ConfiguracionEconomicaPage.jsx
  /services
    - kpisEconomicosService.js
    - reportesEconomicosService.js
    - alertasEconomicasService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /kpis-economicos
    - kpisEconomicosRoutes.js
  /reportes-economicos
    - reportesEconomicosRoutes.js
  /alertas-economicas
    - alertasEconomicasRoutes.js
/controllers
  - kpisEconomicosController.js
  - reportesEconomicosController.js
  - alertasEconomicasController.js
/middleware
  - kpisEconomicosMiddleware.js
  - validacionEconomicaMiddleware.js
/models
  - KPIEconomico.js
  - MetricaEconomica.js
  - AlertaEconomica.js
  - ConfiguracionEconomica.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - kpis_economicos
// - metricas_economicas
// - alertas_economicas
// - configuraciones_economicas

// Esquemas principales:
const KPIEconomicoSchema = {
  nombre: String,
  descripcion: String,
  formula: String,
  valor: Number,
  meta: Number,
  unidad: String, // '€', '%', 'número'
  categoria: String, // 'ingresos', 'costos', 'rentabilidad'
  activo: Boolean,
  fechaCalculo: Date
};
```

```javascript
const MetricaEconomicaSchema = {
  kpiId: ObjectId,
  valor: Number,
  fecha: Date,
  periodo: String, // 'diario', 'semanal', 'mensual'
  filtros: Object,
  calculado: Boolean,
  fuente: String
};

const AlertaEconomicaSchema = {
  kpiId: ObjectId,
  tipo: String, // 'umbral', 'tendencia', 'anomalia'
  severidad: String, // 'baja', 'media', 'alta', 'critica'
  mensaje: String,
  activa: Boolean,
  fechaCreacion: Date,
  fechaResolucion: Date
};
```

## 📋 Funcionalidades Principales

- Cálculo automático de KPIs económicos en tiempo real
- Visualización interactiva con gráficos especializados
- Análisis de rentabilidad por tratamiento
- Seguimiento de cash-flow y liquidez
- Alertas automáticas por umbrales económicos
- Reportes financieros automatizados
## 🎯 Tipos de KPIs Económicos

- KPIs de ingresos y facturación
- KPIs de costos y gastos
- KPIs de rentabilidad y margen
- KPIs de liquidez y cash-flow
## 🔒 Beneficios del Sistema

- Visibilidad completa de la rentabilidad
- Optimización de precios y márgenes
- Mejora de la gestión financiera
- Toma de decisiones basada en datos financieros
- Aumento de la rentabilidad del negocio
## 🚀 Implementación

1. Configuración inicial de KPIs económicos base
1. Implementación de algoritmos de cálculo financiero
1. Configuración de alertas económicas
1. Capacitación del equipo en análisis financiero
1. Configuración de reportes automáticos
---

*Sistema integral de KPIs económicos diseñado para proporcionar visibilidad completa de la rentabilidad y salud financiera de la clínica dental, facilitando la toma de decisiones estratégicas y la optimización continua de la gestión económica.*

