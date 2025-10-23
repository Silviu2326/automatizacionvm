# Presupuestos y Consentimientos a Firmar
*Exportado el 2025-10-23 00:12:40*
---

## Resumen del Modulo

El modulo de Presupuestos y Consentimientos a Firmar del Portal del Paciente es un sistema integral que permite la gestion digital de presupuestos medicos, aceptacion de tratamientos, firma electronica de consentimientos especificos y cumplimiento con normativas RGPD.

## Funcionalidades Principales

### Gestion de Presupuestos

- Generacion automatica de presupuestos
- Visualizacion interactiva de opciones
- Comparacion de tratamientos
- Aceptacion digital de presupuestos
- Modificaciones en tiempo real
- Historial de versiones
### Firma de Consentimientos

- Consentimientos especificos por tratamiento
- Firma electronica segura
- Cumplimiento RGPD automatico
- Plantillas personalizables
- Validacion de identidad
- Registro de evidencias
### Gestion de Estados

- Estados de presupuesto en tiempo real
- Estados de consentimiento por documento
- Trazabilidad completa
## Flujos de Proceso

### Flujo de Presupuesto

1. Profesional crea presupuesto
1. Sistema genera opciones de tratamiento
1. Calculo automatico de costos
1. Envio al paciente por email/SMS
1. Paciente visualiza presupuesto
1. Paciente acepta/rechaza/modifica
1. Notificacion al profesional
1. Activacion del tratamiento
## Componentes React

### Componentes de Presupuestos

- BudgetGenerator - Generador automatico de presupuestos
- BudgetViewer - Visualizador interactivo de presupuestos
- BudgetApproval - Proceso de aceptacion de presupuesto
- BudgetHistory - Historial de presupuestos del paciente
### Componentes de Consentimientos

- ConsentTemplateSelector - Selector de plantillas de consentimiento
- ConsentViewer - Visualizador de consentimientos
- DigitalSignature - Componente de firma digital
## APIs de Firma/Aceptacion

### API de Presupuestos

- POST /api/budgets/create - Crear nuevo presupuesto
- GET /api/budgets/:id - Obtener presupuesto especifico
- PUT /api/budgets/:id/approve - Aprobar presupuesto
### API de Consentimientos

- POST /api/consents/create - Crear nuevo consentimiento
- POST /api/consents/:id/sign - Firmar consentimiento
- GET /api/consents/:id/status - Obtener estado del consentimiento
## Beneficios del Sistema

### Para los Pacientes

- Transparencia en costos y tratamientos
- Facilidad de aceptacion digital
- Comprension clara de procedimientos
- Acceso 24/7 a documentos
- Seguridad en la firma digital
- Trazabilidad completa
### Para los Profesionales

- Automatizacion de presupuestos
- Reduccion de tiempo administrativo
