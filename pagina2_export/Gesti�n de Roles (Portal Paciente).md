# Gesti�n de Roles (Portal Paciente)
*Exportado el 2025-10-23 00:12:47*
---

## Resumen del Modulo

El modulo de Gestion de Roles del Portal del Paciente es un sistema integral que implementa RBAC (Role-Based Access Control) para gestionar el acceso de pacientes en modo auto-servicio y personal de recepcion.

## Funcionalidades Principales

### Gestion de Roles RBAC

- Roles predefinidos (Paciente, Recepcion, Admin)
- Permisos granulares por accion
- Jerarquia de roles y herencia
- Asignacion dinamica de roles
- Revocacion automatica de permisos
- Auditoria completa de accesos
### Autenticacion y Autorizacion

- Autenticacion multifactor (MFA) opcional
- Tokens JWT seguros
- Sesiones con timeout automatico
- Validacion de identidad
- Biometria facial/dactilar
- Recuperacion de contrasenas
### Auditoria y Seguridad

- Log completo de accesos
- Trazabilidad de acciones
## Flujos de Acceso

### Flujo de Autenticacion

1. Usuario ingresa credenciales
1. Validacion de usuario/contrasena
1. Verificacion de cuenta activa
1. Aplicacion de politicas de seguridad
1. Generacion de token JWT
1. Configuracion de sesion
1. Redireccion a dashboard
1. Registro de acceso en auditoria
## Componentes React

### Componentes de Gestion de Roles

- RoleManager - Gestor de roles de usuario
- PermissionMatrix - Matriz de permisos por rol
- UserRoleSelector - Selector de roles para usuario
### Componentes de Autenticacion

- LoginForm - Formulario de login
- MFAVerification - Verificacion MFA
- PasswordManager - Gestion de contrasenas
### Componentes de Seguridad

## APIs de Roles

### API de Gestion de Roles

- GET /api/roles - Obtener todos los roles
- POST /api/roles - Crear nuevo rol
- PUT /api/roles/:id - Actualizar rol
### API de Gestion de Usuarios

- GET /api/users/:id/roles - Obtener roles de usuario
- POST /api/users/:id/roles - Asignar rol a usuario
- DELETE /api/users/:id/roles/:roleId - Revocar rol de usuario
### API de Autenticacion

## Beneficios del Sistema

### Para los Pacientes

- Acceso seguro y personalizado
- Control de datos personales
- Transparencia en permisos
- Proteccion de informacion sensible
- Facilidad de uso
- Confianza en el sistema
### Para los Profesionales

- Gestion eficiente de accesos
