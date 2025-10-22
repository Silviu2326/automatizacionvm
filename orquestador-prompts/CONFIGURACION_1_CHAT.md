# 🎯 Configuración Simplificada - 1 Chat Único

## 📋 **Descripción**

Configuración simplificada para enviar mensajes solo a **un chat único** de Cursor. Perfecto para las plantillas de Notion.

## 🚀 **Cómo Configurar**

### **Paso 1: Configurar Cantidad de Chats**
```bash
python inicio_rapido.py
```
1. Selecciona opción **5** (Configurar cantidad de chats)
2. Selecciona opción **1** (1 chat - Solo Notion)

### **Paso 2: Configurar Plantillas**
1. Selecciona opción **6** (Personalizar plantillas de prompts)
2. Elige una opción:
   - **Opción 1**: 📝 Creación de Páginas en Notion (1 chat)
   - **Opción 2**: 🔄 Creación de Notion a Páginas (1 chat)

### **Paso 3: Calibrar Coordenadas**
1. Selecciona opción **1** (Calibración visual)
2. Configura las coordenadas del chat único

### **Paso 4: Ejecutar**
1. Selecciona opción **3** (Ejecutar orquestador v2.0)

## 📝 **Plantillas Disponibles**

### **1. 📝 Creación de Páginas en Notion**
- **Chat único**: Notion_Creator
- **Archivo**: `@prompts_notion_creator`
- **Prompt**: "Crea usando la api de notion esta pagina (paginaacrear) como subpagina de esta pagina (paginaprincipal) ademas ten en cuenta esto (detalles)"

### **2. 🔄 Creación de Notion a Páginas**
- **Chat único**: Notion_Extractor
- **Archivo**: `@prompts_notion_extractor`
- **Función**: Convierte contenido de Notion a páginas web

## 🔧 **Configuración Resultante**

### **config.ini**
```ini
[GENERAL]
cantidad_chats = 1

[COORDENADAS]
chat_1_x = 800
chat_1_y = 800

[PLANTILLAS]
chat_1_tipo = Notion_Creator
chat_1_archivo = @prompts_notion_creator
```

## 📁 **Archivos Necesarios**

- **`prompts_notion_creator.json`**: Prompt específico con placeholders
- **`notion_placeholders.json`**: Los 3 placeholders
- **`config.ini`**: Configuración del sistema

## 🎯 **Ventajas de 1 Chat**

- ✅ **Más simple**: Solo un chat para configurar
- ✅ **Más rápido**: No hay coordinación entre múltiples chats
- ✅ **Menos errores**: Menos puntos de falla
- ✅ **Fácil de usar**: Configuración directa
- ✅ **Perfecto para Notion**: Ideal para tus plantillas específicas

## 🚀 **Flujo de Trabajo**

1. **Configurar**: 1 chat, coordenadas, plantilla
2. **Ejecutar**: El orquestador envía el prompt al chat único
3. **Resultado**: Cursor procesa el prompt y crea la página en Notion

¡Configuración súper simple y directa! 🎉






