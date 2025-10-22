# 🔄 Nueva Opción: Elegir Ejemplo de Página Notion

## 📋 **Descripción**

Se ha agregado una nueva opción en el menú principal del `inicio_rapido.py` para elegir fácilmente entre los diferentes ejemplos de páginas de Notion.

## 🎯 **Nueva Opción en el Menú**

```
7. 🔄 Elegir ejemplo de página Notion
```

## 🚀 **Cómo Usar**

### **Paso 1: Ejecutar el script**
```bash
python inicio_rapido.py
```

### **Paso 2: Seleccionar la nueva opción**
- Selecciona opción **7** (🔄 Elegir ejemplo de página Notion)

### **Paso 3: Elegir un ejemplo**
Se mostrarán los 5 ejemplos disponibles:
```
📝 Ejemplos disponibles:

1. Plan de Marketing Q1 2024
   📄 Página: Plan de Marketing Q1 2024
   🔗 Principal: https://notion.so/mi-workspace/abc123def456
   📋 Detalles: Crear una página con secciones para objetivos, estrategias...

2. Sprint Planning - Semana 15
   📄 Página: Sprint Planning - Semana 15
   🔗 Principal: https://notion.so/mi-workspace/proyecto-xyz
   📋 Detalles: Página de planificación de sprint con user stories...

3. Análisis de Competencia 2024
   📄 Página: Análisis de Competencia 2024
   🔗 Principal: https://notion.so/mi-workspace/investigacion
   📋 Detalles: Documento de análisis competitivo con perfiles...

4. Onboarding Nuevos Empleados
   📄 Página: Onboarding Nuevos Empleados
   🔗 Principal: https://notion.so/mi-workspace/recursos-humanos
   📋 Detalles: Guía completa de onboarding con checklist...

5. Roadmap de Producto 2024
   📄 Página: Roadmap de Producto 2024
   🔗 Principal: https://notion.so/mi-workspace/producto
   📋 Detalles: Roadmap detallado con features por trimestre...
```

### **Paso 4: Seleccionar ejemplo**
- Ingresa el número del ejemplo que quieras (1-5)
- El sistema actualizará automáticamente `notion_placeholders.json`

## 📁 **Archivos Involucrados**

### **Archivos de entrada:**
- **`ejemplos_paginas_notion.json`**: Contiene los 5 ejemplos disponibles

### **Archivo de salida:**
- **`notion_placeholders.json`**: Se actualiza con el ejemplo seleccionado

## 🔄 **Flujo Completo de Trabajo**

1. **Configurar cantidad de chats** (opción 5) → Seleccionar "1 chat"
2. **Elegir ejemplo de página** (opción 7) → Seleccionar ejemplo (1-5)
3. **Configurar plantillas** (opción 6) → Seleccionar "Creación de Páginas en Notion"
4. **Calibrar coordenadas** (opción 1) → Configurar posición del chat
5. **Ejecutar orquestador** (opción 3) → Enviar prompt a Cursor

## 💡 **Ventajas de la Nueva Opción**

- ✅ **Fácil selección**: Menú visual con todos los ejemplos
- ✅ **Actualización automática**: No necesitas editar archivos manualmente
- ✅ **Integración completa**: Se integra perfectamente con el flujo existente
- ✅ **Múltiples opciones**: 5 ejemplos diferentes para diferentes casos de uso
- ✅ **Validación**: Verifica que los archivos existan antes de proceder

## 🎯 **Ejemplos Disponibles**

1. **📈 Marketing**: Plan estratégico con objetivos y métricas
2. **🚀 Desarrollo**: Sprint planning con user stories
3. **🔍 Investigación**: Análisis competitivo con SWOT
4. **👥 RRHH**: Onboarding con checklist y capacitaciones
5. **🗺️ Producto**: Roadmap con features y timeline

## 🚀 **Uso Rápido**

```bash
# Ejecutar script
python inicio_rapido.py

# Seleccionar opciones en orden:
# 5 → 1 (1 chat)
# 7 → [número de ejemplo] (1-5)
# 6 → 1 (Creación de Páginas en Notion)
# 1 (Calibración)
# 3 (Ejecutar orquestador)
```

¡Ahora es súper fácil cambiar entre diferentes ejemplos de páginas! 🎉






