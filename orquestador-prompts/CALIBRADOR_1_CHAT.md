# 🎯 Calibrador Simplificado para 1 Chat

## 📋 **Descripción**

El calibrador simplificado está diseñado específicamente para configurar **1 chat único** del orquestador. Es mucho más simple y directo que el calibrador para múltiples chats.

## 🚀 **Cómo Funciona**

### **Proceso simplificado:**
1. **Captura pantalla** automáticamente
2. **Haz clic** en el input del chat de Cursor
3. **Presiona 's'** para guardar la coordenada
4. **Configuración automática** en `config.ini`

## 🎯 **Instrucciones de Uso**

### **Paso 1: Ejecutar calibración**
```bash
python inicio_rapido.py
# Opción 1 (Calibración visual)
```

### **Paso 2: Calibrar coordenada**
```
🖱️  Chat único - Haz clic en el input del chat
   Haz clic en la posición deseada
   Presiona 's' para guardar, 'q' para cancelar
```

### **Paso 3: Guardar coordenada**
- **Haz clic** en el input del chat de Cursor
- **Presiona 's'** para guardar
- **Presiona 'q'** para cancelar

## 🔧 **Diferencias con el Calibrador Múltiple**

| Aspecto | Calibrador 1 Chat | Calibrador Múltiple |
|---------|-------------------|-------------------|
| **Coordenadas** | 1 coordenada | 2+ coordenadas |
| **Regiones** | No necesarias | Múltiples regiones |
| **Tiempo** | 30 segundos | 2-3 minutos |
| **Complejidad** | Muy simple | Complejo |
| **Uso** | 1 chat | 2+ chats |

## 📝 **Configuración Generada**

### **config.ini:**
```ini
[GENERAL]
cantidad_chats = 1

[COORDENADAS]
chat_1_x = 800
chat_1_y = 600
```

## 🎯 **Flujo Completo Recomendado**

```
1. Opción 5 → 1 (1 chat)
2. Opción 1 (Calibración visual) → Usa calibrador simplificado
3. Opción 6 → 1 (Creación de Páginas en Notion)
4. Opción 7 → ejemplos_paginas_notion.json → [elegir ejemplo]
5. Opción 8 → [elegir tiempo de espera]
6. Opción 9 (Ejecutar orquestador automático)
```

## 💡 **Ventajas del Calibrador Simplificado**

- ✅ **Súper rápido**: Solo 1 coordenada
- ✅ **Muy simple**: Un solo clic
- ✅ **Automático**: Configura `config.ini` automáticamente
- ✅ **Específico**: Diseñado para 1 chat
- ✅ **Eficiente**: No necesitas regiones de detección

## 🚀 **Uso Directo**

Si quieres usar el calibrador directamente:

```bash
python calibrar_1_chat.py
```

## ⚠️ **Requisitos**

- **Cursor abierto** y visible
- **Input del chat** accesible
- **Python** con dependencias instaladas
- **OpenCV** para la captura de pantalla

## 🎉 **Resultado**

Después de la calibración:
- ✅ **1 coordenada** configurada
- ✅ **config.ini** actualizado
- ✅ **Listo** para ejecutar orquestador automático
- ✅ **Sistema optimizado** para 1 chat

¡Ahora la calibración es súper simple para 1 chat! 🎯






