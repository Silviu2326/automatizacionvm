# Horarios & Turnos
*Exportado el 2025-10-23 00:12:48*
---

## Resumen del Modulo

El modulo de Horarios & Turnos del Portal del Paciente es un sistema integral que gestiona la planificacion de recursos humanos, turnos de trabajo, vacaciones, sustituciones, bloqueo de agenda y asignacion por profesional/sillon.

## Funcionalidades Principales

### Gestion de Recursos Humanos

- Planificacion de horarios por profesional
- Asignacion de sillones y equipos
- Gestion de turnos rotativos
- Control de horas trabajadas
- Seguimiento de productividad
- Reportes de rendimiento
### Gestion de Vacaciones

- Solicitud de vacaciones
- Aprobacion automatica/manual
- Planificacion de coberturas
- Sustituciones automaticas
- Control de dias disponibles
- Integracion con nominas
### Gestion de Sustituciones

- Asignacion automatica de sustitutos
- Notificacion a profesionales
## Flujos de Planificacion

### Flujo de Solicitud de Vacaciones

1. Profesional solicita vacaciones
1. Sistema valida disponibilidad
1. Verificacion de restricciones
1. Aprobacion automatica/manual
1. Planificacion de coberturas
1. Notificacion a equipo
1. Bloqueo de agenda
1. Registro en sistema
## Componentes React

### Componentes de Horarios

- ScheduleManager - Gestor de horarios por profesional
- ShiftPlanner - Planificador de turnos
- SillonAssigner - Asignador de sillones
### Componentes de Vacaciones

- VacationRequest - Solicitud de vacaciones
- VacationCalendar - Calendario de vacaciones
- CoveragePlanner - Planificador de coberturas
### Componentes de Sustituciones

## APIs de Turnos

### API de Horarios

- GET /api/schedules/professional/:id - Obtener horarios de profesional
- POST /api/schedules - Crear horario
- PUT /api/schedules/:id - Actualizar horario
### API de Vacaciones

- POST /api/vacations/request - Solicitar vacaciones
- GET /api/vacations/professional/:id - Obtener vacaciones de profesional
- PUT /api/vacations/:id/approve - Aprobar vacaciones
### API de Sustituciones

## Beneficios del Sistema

### Para los Profesionales

- Planificacion eficiente de horarios
- Gestion automatizada de vacaciones
- Reduccion de conflictos de horarios
- Mejor equilibrio trabajo-vida
- Transparencia en asignaciones
- Productividad optimizada
### Para la Clinica

- Optimizacion de recursos humanos
