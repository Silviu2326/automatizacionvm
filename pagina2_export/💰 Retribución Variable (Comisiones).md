# 💰 Retribución Variable (Comisiones)
*Exportado el 2025-10-23 00:12:51*
---

# 💰 Retribución Variable (Comisiones) - RR.HH., Turnos & Productividad

Sistema integral de gestión de retribución variable y comisiones para profesionales dentales, incluyendo reglas de cálculo, validaciones y liquidación automática.

## 📊 Reglas de Comisiones por Acto/Producción

- Comisiones por tipo de tratamiento
- Porcentajes variables según complejidad
- Comisiones por volumen de producción
- Bonificaciones por objetivos cumplidos
## ✅ Validaciones y Liquidación

- Validación automática de tratamientos
- Verificación de calidad del servicio
- Liquidación automática por períodos
- Reportes de comisiones generadas
## 🔄 Flujos de Cálculo

1. Registro del acto médico realizado
1. Aplicación de reglas de comisión correspondientes
1. Cálculo automático del monto de comisión
1. Validación de criterios de calidad
1. Acumulación en período de liquidación
1. Generación de reporte de liquidación
## 📊 Matrices de Reglas

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Liquidación

- Liquidación mensual automática
- Períodos de corte configurables
- Validación de criterios antes de liquidar
- Reportes detallados por profesional
- Integración con sistema de nóminas
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Comisiones

const ComisionesDashboard = () => {
  return (
    <div className="comisiones-dashboard">
      <h2>Dashboard de Comisiones</h2>
      <ComisionesResumen />
      <ReglasComision />
      <LiquidacionPeriodo />
    </div>
  );
};

const ComisionesResumen = () => {
  const [comisiones, setComisiones] = useState([]);
  
  return (
    <div className="comisiones-resumen">
      <MetricCard 
        title="Comisiones del Mes" 
        value={comisiones.mesActual} 
        target={comisiones.metaMes}
      />
      <MetricCard 
        title="Tratamientos Realizados" 
        value={comisiones.tratamientos} 
        target={comisiones.metaTratamientos}
      />
      <MetricCard 
        title="Bonificaciones" 
        value={comisiones.bonificaciones} 
        target={0}
      />
    </div>
  );
};
```

```javascript
const ReglasComision = () => {
  const [reglas, setReglas] = useState([]);
  
  return (
    <div className="reglas-comision">
      <h3>Reglas de Comisión Activas</h3>
      {reglas.map(regla => (
        <ReglaCard key={regla.id} regla={regla} />
      ))}
    </div>
  );
};

const LiquidacionPeriodo = () => {
  const [liquidacion, setLiquidacion] = useState(null);
  
  return (
    <div className="liquidacion-periodo">
      <h3>Liquidación del Período</h3>
      <LiquidacionDetalle liquidacion={liquidacion} />
      <BotonLiquidar />
    </div>
  );
};
```

```javascript
const CalculadoraComision = ({ tratamiento, profesional }) => {
  const [resultado, setResultado] = useState(null);
  
  const calcularComision = () => {
    const comision = tratamiento.valor * tratamiento.porcentajeComision;
    const bonificacion = calcularBonificacion(tratamiento, profesional);
    setResultado({
      comisionBase: comision,
      bonificacion: bonificacion,
      total: comision + bonificacion
    });
  };
  
  return (
    <div className="calculadora-comision">
      <h3>Calculadora de Comisión</h3>
      <FormularioTratamiento onSubmit={calcularComision} />
      {resultado && <ResultadoComision resultado={resultado} />}
    </div>
  );
};
```

## 🔌 APIs de Comisiones

```javascript
// APIs para gestión de comisiones

// Calcular comisión por tratamiento
const calcularComision = async (tratamientoId, profesionalId) => {
  const response = await fetch(`/api/comisiones/calcular`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tratamientoId, profesionalId })
  });
  return response.json();
};

// Obtener comisiones por período
const getComisionesByPeriodo = async (periodo) => {
  const response = await fetch(`/api/comisiones/periodo/${periodo}`);
  return response.json();
};
```

```javascript
// Obtener reglas de comisión activas
const getReglasComision = async () => {
  const response = await fetch('/api/comisiones/reglas');
  return response.json();
};

// Procesar liquidación de período
const procesarLiquidacion = async (periodo) => {
  const response = await fetch(`/api/comisiones/liquidacion/${periodo}`, {
    method: 'POST'
  });
  return response.json();
};

// Validar criterios de comisión
const validarCriteriosComision = async (tratamientoId, profesionalId) => {
  const response = await fetch(`/api/comisiones/validar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tratamientoId, profesionalId })
  });
  return response.json();
};
```

```javascript
// Obtener reporte de comisiones
const getReporteComisiones = async (filtros) => {
  const response = await fetch('/api/comisiones/reporte', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Actualizar reglas de comisión
const actualizarReglaComision = async (reglaId, datos) => {
  const response = await fetch(`/api/comisiones/reglas/${reglaId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Comisiones

// Frontend (React)
/src
  /components
    /Comisiones
      - ComisionesDashboard.jsx
      - ComisionesResumen.jsx
      - ReglasComision.jsx
      - LiquidacionPeriodo.jsx
      - CalculadoraComision.jsx
      - ReporteComisiones.jsx
    /Tratamientos
      - TratamientoCard.jsx
      - TratamientoForm.jsx
  /pages
    - ComisionesPage.jsx
    - LiquidacionPage.jsx
  /services
    - comisionesService.js
    - liquidacionService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /comisiones
    - comisionesRoutes.js
  /liquidacion
    - liquidacionRoutes.js
  /reglas
    - reglasRoutes.js
/controllers
  - comisionesController.js
  - liquidacionController.js
  - reglasController.js
/models
  - Comision.js
  - ReglaComision.js
  - Liquidacion.js
  - Tratamiento.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - comisiones
// - reglas_comision
// - liquidaciones
// - tratamientos
// - profesionales

// Esquemas principales:
const ComisionSchema = {
  profesionalId: ObjectId,
  tratamientoId: ObjectId,
  fecha: Date,
  valorTratamiento: Number,
  porcentajeComision: Number,
  comisionBase: Number,
  bonificacion: Number,
  comisionTotal: Number,
  estado: String, // 'pendiente', 'liquidada', 'anulada'
  periodo: String,
  liquidacionId: ObjectId
};
```

```javascript
const ReglaComisionSchema = {
  tipoTratamiento: String,
  porcentajeBase: Number,
  bonificacionVolumen: {
    cantidadMinima: Number,
    porcentajeExtra: Number
  },
  criteriosEspeciales: [String],
  activa: Boolean,
  fechaInicio: Date,
  fechaFin: Date
};

const LiquidacionSchema = {
  periodo: String,
  fechaInicio: Date,
  fechaFin: Date,
  profesionalId: ObjectId,
  comisiones: [ObjectId],
  totalComisiones: Number,
  totalBonificaciones: Number,
  totalLiquidacion: Number,
  estado: String, // 'pendiente', 'procesada', 'pagada'
  fechaLiquidacion: Date
};
```

## 📋 Funcionalidades Principales

- Cálculo automático de comisiones por tratamiento
- Aplicación de reglas de bonificación por volumen
- Validación automática de criterios de calidad
- Liquidación automática por períodos
- Reportes detallados de comisiones
- Integración con sistema de nóminas
## 🎯 Tipos de Comisiones

- Comisiones por tratamiento individual
- Bonificaciones por volumen mensual
- Comisiones por objetivos cumplidos
- Bonificaciones por calidad del servicio
## 💰 Beneficios del Sistema

- Motivación del equipo mediante incentivos
- Transparencia en el cálculo de comisiones
- Automatización del proceso de liquidación
- Reducción de errores en cálculos
- Mejora en la productividad del equipo
## 🚀 Implementación

1. Configuración inicial de reglas de comisión
1. Implementación de APIs de cálculo
1. Desarrollo de componentes React
1. Configuración de liquidación automática
1. Integración con sistema de nóminas
---

*Sistema integral de retribución variable diseñado para motivar al equipo dental mediante comisiones justas y transparentes, mejorando la productividad y calidad del servicio.*

