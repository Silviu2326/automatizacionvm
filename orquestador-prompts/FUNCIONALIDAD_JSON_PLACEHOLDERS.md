# 🔄 Funcionalidad: Elegir Archivo JSON de Placeholders

## 📋 **Descripción**

La opción "7. 🔄 Elegir archivo JSON de placeholders" permite seleccionar entre diferentes archivos JSON que contienen placeholders para la plantilla de Notion.

## 🎯 **Cómo Funciona**

### **Búsqueda Automática**
El sistema busca automáticamente archivos JSON que contengan:
- `placeholder` en el nombre del archivo
- `notion` en el nombre del archivo

### **Archivos Detectados**
```
📁 Archivos JSON disponibles:

1. notion_placeholders.json
   📄 Página: Plan de Marketing Q1 2024
   🔗 Principal: https://notion.so/mi-workspace/abc123def456
   📋 Detalles: Crear una página con secciones para objetivos...

2. ejemplos_paginas_notion.json
   📊 Ejemplos: 5 disponibles
   📋 Categorías: Marketing, Desarrollo, Investigación, RRHH, Producto

3. placeholders_marketing.json
   📄 Página: Campaña de Marketing Digital Q1
   🔗 Principal: https://notion.so/mi-workspace/marketing-2024
   📋 Detalles: Crear una página completa para la campaña...

4. placeholders_desarrollo.json
   📄 Página: Sprint 15 - Desarrollo Backend
   🔗 Principal: https://notion.so/mi-workspace/desarrollo-api
   📋 Detalles: Página de planificación del sprint 15...

5. placeholders_rrhh.json
   📄 Página: Proceso de Selección 2024
   🔗 Principal: https://notion.so/mi-workspace/recursos-humanos
   📋 Detalles: Documento completo del proceso...
```

## 🚀 **Tipos de Archivos Soportados**

### **1. Archivos de Placeholders Directos**
```json
{
  "paginaacrear": "Nombre de la página",
  "paginaprincipal": "URL de la página principal",
  "detalles": "Detalles y especificaciones"
}
```

### **2. Archivos de Ejemplos (ejemplos_paginas_notion.json)**
```json
{
  "ejemplos": [
    {
      "id": 1,
      "paginaacrear": "Ejemplo 1",
      "paginaprincipal": "URL 1",
      "detalles": "Detalles 1"
    }
  ]
}
```

## 🔄 **Flujo de Trabajo**

### **Para archivos directos:**
1. Selecciona el archivo JSON
2. Se copia directamente a `notion_placeholders.json`
3. Listo para usar

### **Para ejemplos_paginas_notion.json:**
1. Selecciona `ejemplos_paginas_notion.json`
2. Se muestran los 5 ejemplos disponibles
3. Selecciona un ejemplo específico
4. Se crea `notion_placeholders.json` con el ejemplo seleccionado

## 📁 **Archivos Incluidos**

### **Archivos de ejemplo incluidos:**
- **`notion_placeholders.json`**: Archivo actual con placeholders
- **`ejemplos_paginas_notion.json`**: 5 ejemplos diferentes
- **`placeholders_marketing.json`**: Ejemplo de marketing
- **`placeholders_desarrollo.json`**: Ejemplo de desarrollo
- **`placeholders_rrhh.json`**: Ejemplo de recursos humanos

## 💡 **Ventajas**

- ✅ **Detección automática**: Encuentra todos los archivos JSON relevantes
- ✅ **Vista previa**: Muestra contenido de cada archivo
- ✅ **Flexibilidad**: Soporta diferentes formatos de JSON
- ✅ **Sub-selección**: Para archivos con múltiples ejemplos
- ✅ **Validación**: Verifica que los archivos sean JSON válidos

## 🎯 **Casos de Uso**

### **Caso 1: Usar archivo directo**
```
1. Selecciona "placeholders_marketing.json"
2. Se copia a notion_placeholders.json
3. Ejecuta orquestador
```

### **Caso 2: Usar ejemplo específico**
```
1. Selecciona "ejemplos_paginas_notion.json"
2. Selecciona ejemplo "3. Análisis de Competencia 2024"
3. Se crea notion_placeholders.json con ese ejemplo
4. Ejecuta orquestador
```

## 🚀 **Uso Rápido**

```bash
python inicio_rapido.py
# Selecciona opción 7
# Elige el archivo JSON que quieras usar
# El sistema actualiza notion_placeholders.json automáticamente
```

¡Ahora puedes elegir entre múltiples archivos JSON de placeholders! 🎉






