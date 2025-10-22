# 📝 Plantilla de Creación de Páginas en Notion

## 🎯 **Descripción**

Esta plantilla está diseñada para crear páginas en Notion usando la API, con un prompt específico que incluye 3 placeholders que se reemplazan dinámicamente.

## 🔧 **Prompt Principal**

```
Crea usando la api de notion esta pagina (paginaacrear) como subpagina de esta pagina (paginaprincipal) ademas ten en cuenta esto (detalles)
```

## 📋 **Placeholders Requeridos**

### 1. **`(paginaacrear)`**
- **Descripción**: Nombre o título de la página que se va a crear
- **Ejemplo**: "Mi Nueva Página"
- **Tipo**: String
- **Requerido**: ✅ Sí

### 2. **`(paginaprincipal)`**
- **Descripción**: ID o URL de la página principal donde se creará la subpágina
- **Ejemplo**: "https://notion.so/mi-workspace/abc123def456"
- **Tipo**: String (URL o ID de página)
- **Requerido**: ✅ Sí

### 3. **`(detalles)`**
- **Descripción**: Información adicional, especificaciones o contenido para la página
- **Ejemplo**: "Esta página debe contener información sobre el proyecto X con secciones para objetivos, tareas y fechas"
- **Tipo**: String
- **Requerido**: ✅ Sí

## 🚀 **Cómo Usar**

1. **Ejecutar el orquestador**:
   ```bash
   python inicio_rapido.py
   ```

2. **Seleccionar opción 6**: "Personalizar plantillas de prompts"

3. **Seleccionar opción 1**: "📝 Creación de Páginas en Notion"

4. **El sistema configurará automáticamente**:
   - Chat 1: Notion_Creator → `@prompts_notion_creator`
   - Chat 2: Content_Structured → `@prompts_content_structured`
   - Chat 3: Database_Designer → `@prompts_database_designer`

## 📁 **Archivos de Prompts**

- **`prompts_notion_creator.json`**: Contiene el prompt principal con los 3 placeholders
- **`prompts_content_structured.json`**: Para estructurar el contenido de la página
- **`prompts_database_designer.json`**: Para crear bases de datos si es necesario

## 🔄 **Flujo de Trabajo**

1. **Chat 1** recibe el prompt con los placeholders reemplazados
2. **Chat 2** estructura el contenido de la página
3. **Chat 3** crea bases de datos si es necesario

## 💡 **Ejemplo de Uso**

**Input**:
- `paginaacrear`: "Plan de Marketing Q1 2024"
- `paginaprincipal`: "https://notion.so/mi-workspace/abc123def456"
- `detalles`: "Crear una página con secciones para objetivos, estrategias, presupuesto y métricas de seguimiento"

**Prompt resultante**:
```
Crea usando la api de notion esta pagina (Plan de Marketing Q1 2024) como subpagina de esta pagina (https://notion.so/mi-workspace/abc123def456) ademas ten en cuenta esto (Crear una página con secciones para objetivos, estrategias, presupuesto y métricas de seguimiento)
```

## ⚙️ **Configuración Técnica**

- **API**: Notion API v1
- **Método**: POST /v1/pages
- **Autenticación**: Bearer Token
- **Lenguajes soportados**: Python, JavaScript, Node.js

## 📊 **Archivos de Configuración**

- **`notion_placeholders.json`**: Configuración de los 3 placeholders
- **`PLANTILLA_NOTION_PLACEHOLDERS.md`**: Esta documentación

¡La plantilla está lista para crear páginas en Notion de forma automatizada! 🎉






