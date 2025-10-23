# 🛡️ Gestión de Roles Imagen
*Exportado el 2025-10-23 00:11:57*
---

# 🛡️ Gestión de Roles Imagen (ERP Dental)

Documentación del módulo de roles para Dentistas, Radiología y Auxiliares en diagnóstico por imagen.

## 🔁 Diagrama de Flujo de Roles de Imagen

```mermaid
graph TD
  Admin --> DefinirPerfiles[Definir perfiles Imagen]
  DefinirPerfiles --> ConfigPermisos[Configurar permisos (RX/CBCT/PACS)]
  ConfigPermisos --> AsignarUsuarios[Asignar usuarios]
  AsignarUsuarios --> ControlAcceso[Control de acceso a estudios]
  ControlAcceso --> Auditoria[Auditoría y revisiones]
```

## 🧮 Matriz de Permisos por Especialidad

<!-- Bloque no procesado: table -->

## ⚙️ Configuraciones de Accesos

- Permisos por modalidad (RX, CBCT, Fotografía)
- Restricciones de exportación/compartición
- Auditoría de acceso y edición
## 🧩 Componentes React (MERN)

```typescript
// RolesImagenManager.tsx
export function RolesImagenManager() { /* ... */ }
// PermisosDentistas.tsx
export function PermisosDentistas() { /* ... */ }
// PermisosRadiologia.tsx
export function PermisosRadiologia() { /* ... */ }
// PermisosAuxiliares.tsx
export function PermisosAuxiliares() { /* ... */ }
// AccesosImagen.tsx
export function AccesosImagen() { /* ... */ }
```

## 🌐 APIs Requeridas

```json
{
  "GET /api/imagen/roles": "Listar roles",
  "POST /api/imagen/roles": "Crear/editar roles",
  "GET /api/imagen/permisos": "Listar permisos por rol",
  "POST /api/imagen/permisos/asignar": "Asignar permisos a usuarios",
  "GET /api/imagen/auditoria": "Eventos de auditoría"
}
```

## 📁 Estructura de Carpetas (MERN)

```bash
diagnostico-imagen/
  gestion-roles-imagen/
    page.tsx
    api/
      roles.ts
      permisos.ts
      auditoria.ts
    components/
      RolesImagenManager.tsx
      PermisosDentistas.tsx
      PermisosRadiologia.tsx
      PermisosAuxiliares.tsx
      AccesosImagen.tsx
```

## ⚙️ Documentación de Procesos

1. Definir perfiles por especialidad
1. Configurar permisos por modalidad/acción
1. Asignación de usuarios y auditoría
> **Nota:** Documentación del módulo de roles para diagnóstico por imagen.

