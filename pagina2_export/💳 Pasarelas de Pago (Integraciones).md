# 💳 Pasarelas de Pago (Integraciones)
*Exportado el 2025-10-23 00:13:25*
---

# 💳 Pasarelas de Pago (Integraciones) - Facturación & Cobros

Sistema de integración de pasarelas de pago para el software dental que incluye links de pago, TPV virtual, cumplimiento PCI DSS, webhooks y flujos de cobro/reembolso. Soporta múltiples proveedores de pago con configuraciones específicas, matrices de proveedores y endpoints seguros para transacciones.

## 🏦 Tipos de Integración

- Links de Pago: Enlaces seguros para pagos online
- TPV Virtual: Terminal de punto de venta integrado
- PCI DSS: Cumplimiento de estándares de seguridad
- Webhooks: Notificaciones automáticas de transacciones
- API Directa: Integración directa con proveedores
## 🔄 Flujos de Cobro/Reembolso

1. Iniciación de Pago: Creación de transacción y enlace
1. Procesamiento: Validación y autorización del pago
1. Confirmación: Notificación de pago exitoso
1. Conciliación: Registro en sistema contable
1. Reembolso: Procesamiento de devoluciones
1. Reportes: Generación de informes de transacciones
## 📊 Matrices de Proveedores

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Claves/Webhooks

- API Keys: Claves de autenticación para cada proveedor
- Webhook URLs: Endpoints para notificaciones automáticas
- Certificados SSL: Seguridad en las comunicaciones
- Configuración PCI: Cumplimiento de estándares de seguridad
- Timeouts: Configuración de tiempos de espera
## 🔒 Seguridad PCI DSS

- Cifrado de Datos: Protección de información sensible
- Autenticación: Verificación de identidad de usuarios
- Monitoreo: Seguimiento de accesos y transacciones
- Auditoría: Registro de todas las operaciones
- Certificaciones: Validación de cumplimiento PCI
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para Pasarelas de Pago

const PasarelasPagoDashboard = () => {
  return (
    <div className="pasarelas-dashboard">
      <h2>Pasarelas de Pago</h2>
      <SelectorProveedor />
      <ListaTransacciones />
      <ConfiguracionPagos />
      <WebhooksConfig />
    </div>
  );
};

const SelectorProveedor = () => {
  const [proveedor, setProveedor] = useState('stripe');
  
  return (
    <div className="selector-proveedor">
      <h3>Seleccionar Proveedor</h3>
      <select value={proveedor} onChange={(e) => setProveedor(e.target.value)}>
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
        <option value="redsys">Redsys</option>
        <option value="mercadopago">Mercado Pago</option>
      </select>
    </div>
  );
};
```

```javascript
const ListaTransacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [filtros, setFiltros] = useState({});
  
  return (
    <div className="lista-transacciones">
      <h3>Transacciones</h3>
      <FiltrosTransacciones filtros={filtros} onChange={setFiltros} />
      {transacciones.map(transaccion => (
        <TransaccionCard key={transaccion.id} transaccion={transaccion} />
      ))}
    </div>
  );
};

const TransaccionCard = ({ transaccion }) => {
  const { id, monto, estado, fecha, metodo, proveedor } = transaccion;
  
  return (
    <div className={`transaccion-card ${estado}`}>
      <h4>Transacción #{id}</h4>
      <p><strong>Monto:</strong> €{monto}</p>
      <p><strong>Estado:</strong> {estado}</p>
      <p><strong>Fecha:</strong> {fecha}</p>
      <p><strong>Método:</strong> {metodo}</p>
      <p><strong>Proveedor:</strong> {proveedor}</p>
      <div className="transaccion-acciones">
        <button onClick={() => verDetalles(id)}>Ver Detalles</button>
        {estado === 'completada' && (
          <button onClick={() => procesarReembolso(id)}>Reembolsar</button>
        )}
      </div>
    </div>
  );
};
```

```javascript
const ConfiguracionPagos = () => {
  const [configuracion, setConfiguracion] = useState({
    proveedor: 'stripe',
    apiKey: '',
    secretKey: '',
    webhookSecret: '',
    modo: 'sandbox', // 'sandbox' o 'production'
    moneda: 'EUR',
    timeout: 30
  });
  
  return (
    <div className="configuracion-pagos">
      <h3>Configuración de Pagos</h3>
      <select 
        value={configuracion.proveedor}
        onChange={(e) => setConfiguracion({...configuracion, proveedor: e.target.value})}
      >
        <option value="stripe">Stripe</option>
        <option value="paypal">PayPal</option>
        <option value="redsys">Redsys</option>
        <option value="mercadopago">Mercado Pago</option>
      </select>
      <input 
        type="text" 
        placeholder="API Key"
        value={configuracion.apiKey}
        onChange={(e) => setConfiguracion({...configuracion, apiKey: e.target.value})}
      />
      <input 
        type="password" 
        placeholder="Secret Key"
        value={configuracion.secretKey}
        onChange={(e) => setConfiguracion({...configuracion, secretKey: e.target.value})}
      />
      <button onClick={() => guardarConfiguracion(configuracion)}>Guardar</button>
    </div>
  );
};
```

```javascript
const WebhooksConfig = () => {
  const [webhooks, setWebhooks] = useState([]);
  
  return (
    <div className="webhooks-config">
      <h3>Configuración de Webhooks</h3>
      {webhooks.map(webhook => (
        <WebhookCard key={webhook.id} webhook={webhook} />
      ))}
      <button onClick={() => agregarWebhook()}>Agregar Webhook</button>
    </div>
  );
};

const WebhookCard = ({ webhook }) => {
  const { url, eventos, activo, ultimaEjecucion } = webhook;
  
  return (
    <div className={`webhook-card ${activo ? 'activo' : 'inactivo'}`}>
      <h4>Webhook</h4>
      <p><strong>URL:</strong> {url}</p>
      <p><strong>Eventos:</strong> {eventos.join(', ')}</p>
      <p><strong>Última ejecución:</strong> {ultimaEjecucion}</p>
      <div className="webhook-acciones">
        <button onClick={() => probarWebhook(webhook.id)}>Probar</button>
        <button onClick={() => editarWebhook(webhook.id)}>Editar</button>
      </div>
    </div>
  );
};

const ProcesadorPagos = () => {
  const [pago, setPago] = useState({
    monto: 0,
    descripcion: '',
    metodo: 'tarjeta',
    proveedor: 'stripe'
  });
  
  return (
    <div className="procesador-pagos">
      <h3>Procesar Pago</h3>
      <input 
        type="number" 
        placeholder="Monto"
        value={pago.monto}
        onChange={(e) => setPago({...pago, monto: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="Descripción"
        value={pago.descripcion}
        onChange={(e) => setPago({...pago, descripcion: e.target.value})}
      />
      <button onClick={() => procesarPago(pago)}>Procesar Pago</button>
    </div>
  );
};
```

## 🔌 Endpoints de Backend

```javascript
// Endpoints para Pasarelas de Pago

// Crear pago
const crearPago = async (pagoData) => {
  const response = await fetch('/api/pagos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pagoData)
  });
  return response.json();
};

// Obtener transacciones
const getTransacciones = async (filtros) => {
  const response = await fetch('/api/pagos/transacciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Procesar pago
const procesarPago = async (pagoId, datosPago) => {
  const response = await fetch(`/api/pagos/${pagoId}/procesar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosPago)
  });
  return response.json();
};
```

```javascript
// Reembolsar pago
const reembolsarPago = async (pagoId, monto) => {
  const response = await fetch(`/api/pagos/${pagoId}/reembolsar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monto })
  });
  return response.json();
};

// Obtener estado de pago
const getEstadoPago = async (pagoId) => {
  const response = await fetch(`/api/pagos/${pagoId}/estado`);
  return response.json();
};

// Configurar webhook
const configurarWebhook = async (webhookData) => {
  const response = await fetch('/api/webhooks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(webhookData)
  });
  return response.json();
};

// Probar webhook
const probarWebhook = async (webhookId) => {
  const response = await fetch(`/api/webhooks/${webhookId}/probar`, {
    method: 'POST'
  });
  return response.json();
};
```

```javascript
// Obtener configuración de proveedor
const getConfiguracionProveedor = async (proveedor) => {
  const response = await fetch(`/api/proveedores/${proveedor}/configuracion`);
  return response.json();
};

// Actualizar configuración
const actualizarConfiguracion = async (proveedor, configuracion) => {
  const response = await fetch(`/api/proveedores/${proveedor}/configuracion`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracion)
  });
  return response.json();
};

// Obtener logs de transacciones
const getLogsTransacciones = async (filtros) => {
  const response = await fetch('/api/pagos/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener estadísticas de pagos
const getEstadisticasPagos = async (periodo) => {
  const response = await fetch(`/api/pagos/estadisticas/${periodo}`);
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para Pasarelas de Pago

// Frontend (React)
/src
  /components
    /PasarelasPago
      - PasarelasPagoDashboard.jsx
      - SelectorProveedor.jsx
      - ListaTransacciones.jsx
      - TransaccionCard.jsx
      - ConfiguracionPagos.jsx
      - WebhooksConfig.jsx
      - WebhookCard.jsx
      - ProcesadorPagos.jsx
      - FiltrosTransacciones.jsx
  /pages
    - PasarelasPagoPage.jsx
    - ConfiguracionPagosPage.jsx
    - TransaccionesPage.jsx
    - WebhooksPage.jsx
  /services
    - pagosService.js
    - webhooksService.js
    - proveedoresService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /pagos
    - pagosRoutes.js
  /webhooks
    - webhooksRoutes.js
  /proveedores
    - proveedoresRoutes.js
  /transacciones
    - transaccionesRoutes.js
/controllers
  - pagosController.js
  - webhooksController.js
  - proveedoresController.js
  - transaccionesController.js
/middleware
  - pciMiddleware.js
  - webhookMiddleware.js
  - validacionPagoMiddleware.js
/models
  - Pago.js
  - Transaccion.js
  - Webhook.js
  - Proveedor.js
  - LogTransaccion.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - pagos
// - transacciones
// - webhooks
// - proveedores
// - logs_transacciones

// Esquemas principales:
const PagoSchema = {
  monto: Number,
  moneda: String,
  descripcion: String,
  estado: String, // 'pendiente', 'procesando', 'completada', 'fallida', 'reembolsada'
  metodo: String, // 'tarjeta', 'paypal', 'sepa', 'bizum'
  proveedor: String, // 'stripe', 'paypal', 'redsys', 'mercadopago'
  transaccionId: String,
  clienteId: ObjectId,
  facturaId: ObjectId,
  fechaCreacion: Date,
  fechaProcesamiento: Date,
  datosPago: Object,
  webhookData: Object
};
```

```javascript
const TransaccionSchema = {
  pagoId: ObjectId,
  proveedor: String,
  transaccionId: String,
  estado: String,
  monto: Number,
  moneda: String,
  metodo: String,
  fechaTransaccion: Date,
  datosRespuesta: Object,
  codigoRespuesta: String,
  mensajeRespuesta: String,
  referencia: String
};

const WebhookSchema = {
  url: String,
  eventos: [String], // ['payment.completed', 'payment.failed', 'refund.created']
  proveedor: String,
  secret: String,
  activo: Boolean,
  ultimaEjecucion: Date,
  totalEjecuciones: Number,
  errores: Number
};
```

## 📋 Funcionalidades Principales

- Integración con múltiples proveedores de pago
- Procesamiento seguro de transacciones
- Gestión de reembolsos y devoluciones
- Webhooks para notificaciones automáticas
- Cumplimiento PCI DSS
- Reportes y estadísticas de transacciones
## 🎯 Tipos de Pago Soportados

- Tarjetas de Crédito/Débito: Visa, Mastercard, American Express
- PayPal: Cuentas PayPal y tarjetas vinculadas
- SEPA: Transferencias bancarias europeas
- Bizum: Pagos móviles en España
- Apple Pay/Google Pay: Pagos móviles
## 🔒 Beneficios del Sistema

- Múltiples opciones de pago para pacientes
- Procesamiento seguro y rápido
- Cumplimiento de estándares de seguridad
- Integración con sistemas contables
- Reducción de impagos y morosidad
## 🚀 Implementación

1. Configuración inicial de proveedores
1. Implementación de seguridad PCI DSS
1. Configuración de webhooks
1. Integración con sistema contable
1. Capacitación del equipo en pagos
---

*Sistema de integración de pasarelas de pago completo para el software dental que proporciona múltiples opciones de pago, procesamiento seguro, cumplimiento PCI DSS y flujos de cobro/reembolso optimizados, mejorando la experiencia del paciente y reduciendo la morosidad en la clínica dental.*

