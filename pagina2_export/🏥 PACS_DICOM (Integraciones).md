# 🏥 PACS/DICOM (Integraciones)
*Exportado el 2025-10-23 00:13:22*
---

# 🏥 PACS/DICOM (Integraciones) - Imagen & Laboratorio

Sistema de integración PACS/DICOM para el software dental que incluye visor de imágenes, almacenamiento DICOM, consultas C-FIND/C-MOVE, seguridad y flujos de intercambio. Soporta RX, CBCT y otros estudios de imagen dental con matrices de endpoints DICOM y configuraciones de PACS/AE Titles.

## 📸 Tipos de Estudios Soportados

- Radiografías Periapicales (RX): Imágenes intraorales de alta resolución
- CBCT (Cone Beam CT): Tomografías 3D para implantes y cirugía
- Radiografías Panorámicas: Vista completa de la arcada dental
- Radiografías Bitewing: Para diagnóstico de caries interproximales
- Fotografías Clínicas: Imágenes intraorales y extraorales
## 🔄 Flujos de Intercambio DICOM

1. C-STORE: Almacenamiento de imágenes DICOM en el PACS
1. C-FIND: Búsqueda y consulta de estudios en el PACS
1. C-MOVE: Transferencia de imágenes entre sistemas
1. C-GET: Obtención directa de imágenes
1. C-ECHO: Verificación de conectividad entre sistemas
## 📊 Matrices de Endpoints DICOM

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de PACS/AE Titles

- AE Title Principal: DENTALPACS (192.168.1.100:104)
- AE Title Workstation: RXSTATION (192.168.1.101:104)
- AE Title CBCT: CBCTSCAN (192.168.1.102:104)
- AE Title Backup: BACKUPPACS (192.168.1.103:104)
- Configuración de Timeout: 30 segundos
## 🔒 Seguridad DICOM

- Autenticación: Verificación de AE Titles y IPs
- Cifrado: TLS/SSL para transferencias seguras
- Logs de Acceso: Registro de todas las operaciones DICOM
- Control de Acceso: Permisos por usuario y rol
- Anonimización: Protección de datos del paciente
## ⚛️ Componentes React Previstos

```javascript
// Componentes principales de React para PACS/DICOM

const PACSViewer = () => {
  return (
    <div className="pacs-viewer">
      <h2>Visor PACS/DICOM</h2>
      <ListaEstudios />
      <VisorImagenes />
      <HerramientasMedicion />
      <PanelMetadatos />
    </div>
  );
};

const ListaEstudios = () => {
  const [estudios, setEstudios] = useState([]);
  const [filtros, setFiltros] = useState({});
  
  return (
    <div className="lista-estudios">
      <h3>Estudios DICOM</h3>
      <FiltrosEstudios filtros={filtros} onChange={setFiltros} />
      {estudios.map(estudio => (
        <EstudioCard key={estudio.id} estudio={estudio} />
      ))}
    </div>
  );
};
```

```javascript
const VisorImagenes = () => {
  const [imagenActual, setImagenActual] = useState(null);
  const [herramientas, setHerramientas] = useState({
    zoom: 1,
    pan: { x: 0, y: 0 },
    windowLevel: { window: 400, level: 40 },
    rotacion: 0
  });
  
  return (
    <div className="visor-imagenes">
      <div className="imagen-container">
        <img 
          src={imagenActual?.url} 
          alt={imagenActual?.descripcion}
          style={{
            transform: `scale(${herramientas.zoom}) rotate(${herramientas.rotacion}deg)`,
            transformOrigin: 'center'
          }}
        />
      </div>
      <ControlesVisor herramientas={herramientas} onChange={setHerramientas} />
    </div>
  );
};

const HerramientasMedicion = () => {
  const [mediciones, setMediciones] = useState([]);
  const [herramientaActiva, setHerramientaActiva] = useState('seleccion');
  
  return (
    <div className="herramientas-medicion">
      <h4>Herramientas de Medición</h4>
      <div className="herramientas-botones">
        <button 
          className={herramientaActiva === 'distancia' ? 'activo' : ''}
          onClick={() => setHerramientaActiva('distancia')}
        >
          Distancia
        </button>
        <button 
          className={herramientaActiva === 'angulo' ? 'activo' : ''}
          onClick={() => setHerramientaActiva('angulo')}
        >
          Ángulo
        </button>
        <button 
          className={herramientaActiva === 'area' ? 'activo' : ''}
          onClick={() => setHerramientaActiva('area')}
        >
          Área
        </button>
      </div>
    </div>
  );
};
```

```javascript
const PanelMetadatos = () => {
  const [metadatos, setMetadatos] = useState({});
  
  return (
    <div className="panel-metadatos">
      <h4>Metadatos DICOM</h4>
      <div className="metadatos-grid">
        <div className="metadato-item">
          <label>Paciente:</label>
          <span>{metadatos.patientName}</span>
        </div>
        <div className="metadato-item">
          <label>Fecha Estudio:</label>
          <span>{metadatos.studyDate}</span>
        </div>
        <div className="metadato-item">
          <label>Modalidad:</label>
          <span>{metadatos.modality}</span>
        </div>
        <div className="metadato-item">
          <label>Descripción:</label>
          <span>{metadatos.studyDescription}</span>
        </div>
      </div>
    </div>
  );
};

const ConfiguracionPACS = () => {
  const [configuracion, setConfiguracion] = useState({
    aeTitle: '',
    ip: '',
    puerto: 104,
    timeout: 30
  });
  
  return (
    <div className="configuracion-pacs">
      <h3>Configuración PACS</h3>
      <input 
        type="text" 
        placeholder="AE Title"
        value={configuracion.aeTitle}
        onChange={(e) => setConfiguracion({...configuracion, aeTitle: e.target.value})}
      />
      <input 
        type="text" 
        placeholder="IP Address"
        value={configuracion.ip}
        onChange={(e) => setConfiguracion({...configuracion, ip: e.target.value})}
      />
      <input 
        type="number" 
        placeholder="Puerto"
        value={configuracion.puerto}
        onChange={(e) => setConfiguracion({...configuracion, puerto: e.target.value})}
      />
      <button onClick={() => guardarConfiguracion(configuracion)}>Guardar</button>
    </div>
  );
};
```

## 🔌 Endpoints de Backend

```javascript
// Endpoints para integración PACS/DICOM

// Obtener estudios
const getEstudios = async (filtros) => {
  const response = await fetch('/api/dicom/estudios', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Obtener imágenes de un estudio
const getImagenesEstudio = async (estudioId) => {
  const response = await fetch(`/api/dicom/estudios/${estudioId}/imagenes`);
  return response.json();
};

// Descargar imagen DICOM
const descargarImagen = async (imagenId) => {
  const response = await fetch(`/api/dicom/imagenes/${imagenId}/descargar`);
  return response.blob();
};

// Subir imagen DICOM
const subirImagen = async (archivo, metadatos) => {
  const formData = new FormData();
  formData.append('archivo', archivo);
  formData.append('metadatos', JSON.stringify(metadatos));
  
  const response = await fetch('/api/dicom/imagenes/subir', {
    method: 'POST',
    body: formData
  });
  return response.json();
};
```

```javascript
// Consultas C-FIND
const buscarEstudios = async (criterios) => {
  const response = await fetch('/api/dicom/c-find', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(criterios)
  });
  return response.json();
};

// Transferencias C-MOVE
const transferirEstudio = async (estudioId, destino) => {
  const response = await fetch(`/api/dicom/estudios/${estudioId}/transferir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ destino })
  });
  return response.json();
};

// Verificar conectividad C-ECHO
const verificarConectividad = async (pacsConfig) => {
  const response = await fetch('/api/dicom/c-echo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pacsConfig)
  });
  return response.json();
};

// Obtener metadatos DICOM
const getMetadatosDICOM = async (imagenId) => {
  const response = await fetch(`/api/dicom/imagenes/${imagenId}/metadatos`);
  return response.json();
};
```

```javascript
// Configuración de PACS
const getConfiguracionPACS = async () => {
  const response = await fetch('/api/dicom/configuracion');
  return response.json();
};

const actualizarConfiguracionPACS = async (configuracion) => {
  const response = await fetch('/api/dicom/configuracion', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configuracion)
  });
  return response.json();
};

// Logs de operaciones DICOM
const getLogsDICOM = async (filtros) => {
  const response = await fetch('/api/dicom/logs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filtros)
  });
  return response.json();
};

// Estadísticas de uso
const getEstadisticasDICOM = async () => {
  const response = await fetch('/api/dicom/estadisticas');
  return response.json();
};
```

## 🏗️ Estructura MERN

```javascript
// Estructura del proyecto MERN para PACS/DICOM

// Frontend (React)
/src
  /components
    /PACS
      - PACSViewer.jsx
      - ListaEstudios.jsx
      - EstudioCard.jsx
      - VisorImagenes.jsx
      - HerramientasMedicion.jsx
      - PanelMetadatos.jsx
      - ConfiguracionPACS.jsx
      - FiltrosEstudios.jsx
      - ControlesVisor.jsx
  /pages
    - PACSViewerPage.jsx
    - ConfiguracionPACSPage.jsx
    - LogsDICOMPage.jsx
  /services
    - dicomService.js
    - pacsService.js
    - imagenService.js
```

```javascript
// Backend (Node.js + Express)
/routes
  /dicom
    - dicomRoutes.js
  /pacs
    - pacsRoutes.js
  /imagenes
    - imagenesRoutes.js
/controllers
  - dicomController.js
  - pacsController.js
  - imagenesController.js
/middleware
  - dicomMiddleware.js
  - seguridadDICOMMiddleware.js
  - validacionDICOMMiddleware.js
/models
  - EstudioDICOM.js
  - ImagenDICOM.js
  - ConfiguracionPACS.js
  - LogDICOM.js
  - MetadatosDICOM.js
```

```javascript
// Base de datos (MongoDB)
// Colecciones:
// - estudios_dicom
// - imagenes_dicom
// - configuracion_pacs
// - logs_dicom
// - metadatos_dicom

// Esquemas principales:
const EstudioDICOMSchema = {
  studyInstanceUID: String,
  patientName: String,
  patientID: String,
  studyDate: Date,
  studyTime: String,
  modality: String,
  studyDescription: String,
  numberOfStudyRelatedInstances: Number,
  pacsId: ObjectId,
  fechaCreacion: Date,
  fechaModificacion: Date
};
```

```javascript
const ImagenDICOMSchema = {
  sopInstanceUID: String,
  studyInstanceUID: String,
  seriesInstanceUID: String,
  patientName: String,
  patientID: String,
  modality: String,
  bodyPartExamined: String,
  imageType: String,
  filePath: String,
  fileSize: Number,
  fechaCreacion: Date,
  fechaModificacion: Date
};

const ConfiguracionPACSSchema = {
  nombre: String,
  aeTitle: String,
  ip: String,
  puerto: Number,
  timeout: Number,
  servicios: [String], // ['C-STORE', 'C-FIND', 'C-MOVE']
  activo: Boolean,
  fechaCreacion: Date
};
```

## 📋 Funcionalidades Principales

- Visor DICOM completo con herramientas de medición
- Integración completa con PACS
- Consultas C-FIND y transferencias C-MOVE
- Almacenamiento seguro de imágenes DICOM
- Configuración flexible de endpoints DICOM
- Logs y auditoría de operaciones DICOM
## 🎯 Tipos de Estudios Específicos

- RX Periapicales: Diagnóstico de lesiones periapicales
- CBCT: Planificación de implantes y cirugía
- Panorámicas: Vista general de la arcada
- Bitewing: Diagnóstico de caries interproximales
- Fotografías: Documentación clínica
## 🔒 Beneficios del Sistema

- Integración completa con equipos de imagen
- Almacenamiento centralizado y seguro
- Acceso rápido a estudios de imagen
- Herramientas avanzadas de análisis
- Cumplimiento de estándares DICOM
## 🚀 Implementación

1. Configuración inicial del servidor DICOM
1. Integración con equipos de imagen
1. Configuración de endpoints PACS
1. Implementación del visor DICOM
1. Configuración de seguridad y auditoría
---

*Sistema de integración PACS/DICOM completo para el software dental que proporciona visor de imágenes, almacenamiento seguro, consultas C-FIND/C-MOVE y flujos de intercambio optimizados, cumpliendo con estándares DICOM y garantizando la seguridad de los datos de imagen dental.*

