#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Orquestador de Prompts - Inicio Rápido (Versión Limpia)
Sistema simplificado para 1 chat de Notion.
"""

import os
import sys
import json
import configparser
import subprocess
import time

def verificar_dependencias():
    """Verifica que las dependencias estén instaladas."""
    print("🔍 Verificando dependencias...")
    
    dependencias = ['pyautogui', 'cv2', 'keyboard', 'numpy']
    faltantes = []
    
    for dep in dependencias:
        try:
            if dep == 'cv2':
                import cv2
            else:
                __import__(dep)
            print(f"   ✅ {dep}")
        except ImportError:
            print(f"   ❌ {dep} - FALTANTE")
            faltantes.append(dep)
    
    if faltantes:
        print(f"\n❌ Dependencias faltantes: {', '.join(faltantes)}")
        print("💡 Instala con: pip install " + " ".join(faltantes))
        return False
    
    print("✅ Todas las dependencias están instaladas")
    return True

def mostrar_menu():
    """Muestra el menú principal."""
    print("\n" + "="*60)
    print("🎯 ORQUESTADOR DE PROMPTS - INICIO RÁPIDO")
    print("="*60)
    print()
    print("Selecciona una opción:")
    print()
    print("1. 🔧 Calibración visual (Recomendado)")
    print("2. 🎨 Generar plantillas")
    print("3. 🚀 Ejecutar orquestador v2.0")
    print("4. 🚀 Ejecutar orquestador v1.0")
    print("5. ⚙️  Configurar cantidad de chats")
    print("6. 📝 Personalizar plantillas de prompts")
    print("7. 🔄 Elegir archivo JSON de placeholders")
    print("8. ⏱️  Configurar tiempo de espera entre mensajes")
    print("9. 🚀 Ejecutar orquestador automático (todas las páginas del JSON)")
    print("10. 📊 Ver configuración actual")
    print("11. 📋 Ver checklist de configuración")
    print("12. 🔁 Implementar pipelines encadenados")
    print("13. 📚 Ver documentación")
    print("14. ❌ Salir")
    print()

def ejecutar_calibracion():
    """Ejecuta el calibrador visual."""
    print("🔧 Iniciando calibrador visual...")
    
    try:
        # Verificar configuración de chats
        config_file = "config.ini"
        if os.path.exists(config_file):
            config = configparser.ConfigParser()
            config.read(config_file, encoding='utf-8')
            cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=2)
        else:
            cantidad_chats = 2
        
        # Elegir calibrador según cantidad de chats
        if cantidad_chats == 1:
            print("📱 Usando calibrador ultra-simplificado para 1 chat...")
            subprocess.run([sys.executable, "calibrar_1_chat_simple.py"], check=True)
        else:
            print("📱 Usando calibrador para múltiples chats...")
            subprocess.run([sys.executable, "calibrar_regiones.py"], check=True)
        
        print("✅ Calibración completada")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en calibración: {e}")
    except FileNotFoundError:
        print("❌ No se encontró el archivo de calibración")

def configurar_cantidad_chats():
    """Configura la cantidad de chats."""
    print("\n⚙️  CONFIGURAR CANTIDAD DE CHATS")
    print("="*50)
    
    try:
        config_file = "config.ini"
        config = configparser.ConfigParser()
        
        if os.path.exists(config_file):
            config.read(config_file, encoding='utf-8')
            chats_actuales = config.getint('GENERAL', 'cantidad_chats', fallback=2)
        else:
            chats_actuales = 2
            print("⚠️  No se encontró config.ini, usando valores por defecto")
        
        print(f"Cantidad actual de chats: {chats_actuales}")
        print()
        print("Opciones disponibles:")
        print("  1. 1 chat (Solo Notion) - Recomendado para tus plantillas")
        print("  2. 2 chats (Frontend + Backend)")
        print("  3. 3 chats (Frontend + Backend + Marketing)")
        print("  4. 4 chats (Frontend + Backend + Marketing + Analytics)")
        print("  5. Personalizado")
        
        opcion = input("Selecciona una opción (1-5): ").strip()
        
        if opcion == "1":
            nueva_cantidad = 1
            print("✅ Configurado para 1 chat (Solo Notion)")
        elif opcion == "2":
            nueva_cantidad = 2
            print("✅ Configurado para 2 chats (Frontend + Backend)")
        elif opcion == "3":
            nueva_cantidad = 3
            print("✅ Configurado para 3 chats (Frontend + Backend + Marketing)")
        elif opcion == "4":
            nueva_cantidad = 4
            print("✅ Configurado para 4 chats (Frontend + Backend + Marketing + Analytics)")
        elif opcion == "5":
            try:
                nueva_cantidad = int(input("Ingresa la cantidad de chats (1-6): "))
                if 1 <= nueva_cantidad <= 6:
                    print(f"✅ Configurado para {nueva_cantidad} chats")
                else:
                    print("❌ La cantidad debe estar entre 1 y 6")
                    return
            except ValueError:
                print("❌ Ingresa un número válido")
                return
        else:
            print("❌ Opción inválida")
            return
        
        # Actualizar configuración
        if not config.has_section('GENERAL'):
            config.add_section('GENERAL')
        
        config.set('GENERAL', 'cantidad_chats', str(nueva_cantidad))
        
        # Configurar coordenadas por defecto
        if not config.has_section('COORDENADAS'):
            config.add_section('COORDENADAS')
        
        coordenadas_por_defecto = {
            1: {
                'chat_1_x': '800', 'chat_1_y': '800'
            },
            2: {
                'chat_1_x': '400', 'chat_1_y': '800',
                'chat_2_x': '1200', 'chat_2_y': '800'
            },
            3: {
                'chat_1_x': '300', 'chat_1_y': '800',
                'chat_2_x': '800', 'chat_2_y': '800',
                'chat_3_x': '1300', 'chat_3_y': '800'
            },
            4: {
                'chat_1_x': '200', 'chat_1_y': '800',
                'chat_2_x': '600', 'chat_2_y': '800',
                'chat_3_x': '1000', 'chat_3_y': '800',
                'chat_4_x': '1400', 'chat_4_y': '800'
            }
        }
        
        if nueva_cantidad in coordenadas_por_defecto:
            for key, value in coordenadas_por_defecto[nueva_cantidad].items():
                config.set('COORDENADAS', key, value)
        
        # Guardar configuración
        with open(config_file, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"\n✅ Configuración guardada en {config_file}")
        print(f"📊 Cantidad de chats: {nueva_cantidad}")
        
    except Exception as e:
        print(f"❌ Error configurando chats: {e}")

def personalizar_plantillas_prompts():
    """Personaliza las plantillas de prompts."""
    print("\n📝 PERSONALIZACIÓN DE PLANTILLAS DE PROMPTS")
    print("="*60)
    print()
    print("Esta opción te permite configurar qué prompts se enviarán")
    print("a cada chat según la cantidad configurada.")
    print()
    
    try:
        # Leer configuración actual
        config_file = "config.ini"
        config = configparser.ConfigParser()
        
        if os.path.exists(config_file):
            config.read(config_file, encoding='utf-8')
            cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=2)
        else:
            cantidad_chats = 2
            print("⚠️  No se encontró config.ini, usando 2 chats por defecto")
            print("💡 Configura primero la cantidad de chats con la opción 5")
            return
        
        # Asegurar que existe la sección PLANTILLAS desde el inicio
        if not config.has_section('PLANTILLAS'):
            config.add_section('PLANTILLAS')
            print("   🔧 Creando sección PLANTILLAS...")
        
        print(f"📊 Cantidad de chats configurados: {cantidad_chats}")
        print()
        
        # Opciones para 1 chat
        if cantidad_chats == 1:
            print("Opciones de personalización:")
            print("1. 📝 Creación de Páginas en Notion (1 chat)")
            print("2. 🔄 Creación de Notion a Páginas (1 chat)")
            print()
            
            opcion = input("Selecciona una opción (1-2): ").strip()
            
            if opcion == "1":
                # Creación de Páginas en Notion - Solo 1 chat
                print(f"\n✅ Configurando: 📝 Creación de Páginas en Notion")
                print(f"📝 Envía el prompt específico a un solo chat")
                print()
                
                # Configurar solo el chat 1
                config.set('PLANTILLAS', 'chat_1_tipo', 'Notion_Creator')
                config.set('PLANTILLAS', 'chat_1_archivo', '@prompts_notion_creator')
                
                print("   Chat 1: Notion_Creator -> @prompts_notion_creator")
                print("\n💡 Archivo de prompts necesario:")
                print("   - @prompts_notion_creator")
                
            elif opcion == "2":
                # Creación de Notion a Páginas - Solo 1 chat
                print(f"\n✅ Configurando: 🔄 Creación de Notion a Páginas")
                print(f"📝 Envía el prompt específico a un solo chat")
                print()
                
                # Configurar solo el chat 1
                config.set('PLANTILLAS', 'chat_1_tipo', 'Notion_Extractor')
                config.set('PLANTILLAS', 'chat_1_archivo', '@prompts_notion_extractor')
                
                print("   Chat 1: Notion_Extractor -> @prompts_notion_extractor")
                print("\n💡 Archivo de prompts necesario:")
                print("   - @prompts_notion_extractor")
            
            else:
                print("❌ Opción no válida")
                return
        
        # Guardar configuración
        with open(config_file, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"\n✅ Configuración de plantillas guardada en {config_file}")
        print("💡 Los archivos de prompts deben existir para que funcione correctamente")
        
    except Exception as e:
        print(f"❌ Error configurando plantillas: {e}")

def elegir_ejemplo_notion():
    """Permite elegir un archivo JSON de placeholders para usar."""
    print("\n🔄 ELEGIR ARCHIVO JSON DE PLACEHOLDERS")
    print("="*50)
    print()
    print("Esta opción te permite seleccionar un archivo JSON")
    print("que contiene los placeholders para la plantilla de Notion.")
    print()
    
    try:
        # Buscar archivos JSON de placeholders disponibles
        archivos_json = []
        for archivo in os.listdir('.'):
            if archivo.endswith('.json') and ('placeholder' in archivo.lower() or 'notion' in archivo.lower() or 'ejemplo' in archivo.lower()):
                archivos_json.append(archivo)
        
        if not archivos_json:
            print("❌ No se encontraron archivos JSON de placeholders")
            print("💡 Asegúrate de tener archivos como:")
            print("   - notion_placeholders.json")
            print("   - ejemplos_paginas_notion.json")
            return
        
        print("📁 Archivos JSON disponibles:")
        print()
        
        for i, archivo in enumerate(archivos_json, 1):
            print(f"{i}. {archivo}")
            
            # Mostrar contenido del archivo
            try:
                with open(archivo, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if 'paginaacrear' in data:
                    print(f"   📄 Página: {data.get('paginaacrear', 'N/A')}")
                    print(f"   🔗 Principal: {data.get('paginaprincipal', 'N/A')}")
                    print(f"   📋 Detalles: {data.get('detalles', 'N/A')[:60]}...")
                elif 'ejemplos' in data:
                    print(f"   📊 Ejemplos: {len(data['ejemplos'])} disponibles")
                    print(f"   📋 Categorías: {', '.join(data.get('configuracion', {}).get('categorias', []))}")
                else:
                    print(f"   📊 Entradas: {len(data)} elementos")
                
            except json.JSONDecodeError:
                print(f"   ❌ Error leyendo {archivo}")
            except Exception as e:
                print(f"   ⚠️  {str(e)[:50]}...")
            
            print()
        
        try:
            opcion = int(input(f"Selecciona un archivo (1-{len(archivos_json)}): "))
            
            if 1 <= opcion <= len(archivos_json):
                archivo_seleccionado = archivos_json[opcion - 1]
                
                print(f"\n✅ Archivo seleccionado: {archivo_seleccionado}")
                
                # Si es ejemplos_paginas_notion.json, configurar para procesamiento automático
                if archivo_seleccionado == "ejemplos_paginas_notion.json":
                    with open(archivo_seleccionado, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    ejemplos = data['ejemplos']
                    print(f"\n📝 Archivo de ejemplos múltiples detectado: {archivo_seleccionado}")
                    print(f"📊 Total de ejemplos: {len(ejemplos)}")
                    print()
                    
                    for ejemplo in ejemplos:
                        print(f"   {ejemplo['id']}. {ejemplo['paginaacrear']}")
                        print(f"      📋 {ejemplo['detalles'][:60]}...")
                    
                    print()
                    print("✅ Configurado para procesamiento automático")
                    print("💡 Usa la opción 9 para ejecutar el orquestador automático")
                    print("   que procesará TODOS los ejemplos automáticamente")
                    
                    # Crear un archivo especial que indique que es para procesamiento automático
                    config_automatico = {
                        "archivo_origen": archivo_seleccionado,
                        "procesamiento_automatico": True,
                        "total_ejemplos": len(ejemplos),
                        "ejemplos": ejemplos
                    }
                    
                    # Guardar configuración automática
                    with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
                        json.dump(config_automatico, f, indent=2, ensure_ascii=False)
                    
                    print(f"\n✅ Configuración automática guardada en notion_placeholders.json")
                    print("💡 Ahora puedes usar la opción 9 para procesar todas las páginas")
                
                else:
                    # Para otros archivos JSON, copiar directamente
                    with open(archivo_seleccionado, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    # Guardar como notion_placeholders.json
                    with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
                        json.dump(data, f, indent=2, ensure_ascii=False)
                    
                    print(f"\n✅ Archivo {archivo_seleccionado} copiado a notion_placeholders.json")
                
                print("\n💡 Ahora puedes ejecutar el orquestador con estos placeholders")
                print("   Selecciona la opción 3 para ejecutar el orquestador")
                
            else:
                print("❌ Número de archivo inválido")
                
        except ValueError:
            print("❌ Ingresa un número válido")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def configurar_tiempo_espera():
    """Configura el tiempo de espera entre mensajes."""
    print("\n⏱️  CONFIGURAR TIEMPO DE ESPERA ENTRE MENSAJES")
    print("="*60)
    print()
    print("Esta opción te permite configurar cuánto tiempo esperar")
    print("entre el envío de cada mensaje cuando se procesan múltiples páginas.")
    print()
    
    try:
        # Leer configuración actual
        config_file = "config.ini"
        config = configparser.ConfigParser()
        
        if os.path.exists(config_file):
            config.read(config_file, encoding='utf-8')
            tiempo_actual = config.getint('GENERAL', 'tiempo_espera_segundos', fallback=30)
        else:
            tiempo_actual = 30
            print("⚠️  No se encontró config.ini, usando 30 segundos por defecto")
        
        print(f"⏱️  Tiempo actual de espera: {tiempo_actual} segundos")
        print()
        print("Opciones de tiempo de espera:")
        print("  1. 10 segundos (Rápido)")
        print("  2. 30 segundos (Normal)")
        print("  3. 60 segundos (Lento)")
        print("  4. 120 segundos (Muy lento)")
        print("  5. 20 minutos (Máximo)")
        print("  6. Personalizado")
        print()
        
        opcion = input("Selecciona una opción (1-6): ").strip()
        
        if opcion == "1":
            nuevo_tiempo = 10
            print("✅ Configurado para 10 segundos (Rápido)")
        elif opcion == "2":
            nuevo_tiempo = 30
            print("✅ Configurado para 30 segundos (Normal)")
        elif opcion == "3":
            nuevo_tiempo = 60
            print("✅ Configurado para 60 segundos (Lento)")
        elif opcion == "4":
            nuevo_tiempo = 120
            print("✅ Configurado para 120 segundos (Muy lento)")
        elif opcion == "5":
            nuevo_tiempo = 1200
            print("✅ Configurado para 1200 segundos (20 minutos)")
        elif opcion == "6":
            try:
                nuevo_tiempo = int(input("Ingresa el tiempo en segundos (5-1200): "))
                if 5 <= nuevo_tiempo <= 1200:
                    print(f"✅ Configurado para {nuevo_tiempo} segundos")
                else:
                    print("❌ El tiempo debe estar entre 5 y 1200 segundos (20 minutos)")
                    return
            except ValueError:
                print("❌ Ingresa un número válido")
                return
        else:
            print("❌ Opción inválida")
            return
        
        # Actualizar configuración
        if not config.has_section('GENERAL'):
            config.add_section('GENERAL')
        
        config.set('GENERAL', 'tiempo_espera_segundos', str(nuevo_tiempo))
        
        # Guardar configuración
        with open(config_file, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"\n✅ Tiempo de espera guardado: {nuevo_tiempo} segundos")
        print("💡 Este tiempo se usará entre cada mensaje cuando se procesen múltiples páginas")
        
    except Exception as e:
        print(f"❌ Error configurando tiempo de espera: {e}")

def ejecutar_orquestador_automatico():
    """Ejecuta el orquestador automático para todas las páginas del JSON."""
    print("\n🚀 EJECUTAR ORQUESTADOR AUTOMÁTICO")
    print("="*50)
    print()
    print("Esta opción procesará automáticamente TODAS las páginas")
    print("del archivo JSON seleccionado con el tiempo de espera configurado.")
    print()
    
    try:
        # Verificar configuración
        config_file = "config.ini"
        if not os.path.exists(config_file):
            print("❌ No se encontró config.ini")
            print("💡 Configura primero el sistema con las opciones 5, 6 y 7")
            return
        
        config = configparser.ConfigParser()
        config.read(config_file, encoding='utf-8')
        
        # Verificar configuración necesaria
        cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=0)
        tiempo_espera = config.getint('GENERAL', 'tiempo_espera_segundos', fallback=30)
        
        if cantidad_chats == 0:
            print("❌ No hay chats configurados")
            print("💡 Usa la opción 5 para configurar la cantidad de chats")
            return
        
        # Verificar que existe notion_placeholders.json
        if not os.path.exists('notion_placeholders.json'):
            print("❌ No se encontró notion_placeholders.json")
            print("💡 Usa la opción 7 para seleccionar un archivo JSON")
            return
        
        # Cargar placeholders actuales
        with open('notion_placeholders.json', 'r', encoding='utf-8') as f:
            placeholders_actuales = json.load(f)
        
        # Verificar si está configurado para procesamiento automático
        if placeholders_actuales.get('procesamiento_automatico', False) or 'ejemplos' in placeholders_actuales:
            # Es un archivo configurado para procesamiento automático
            ejemplos = placeholders_actuales['ejemplos']
            archivo_origen = placeholders_actuales.get('archivo_origen', 'ejemplos_paginas_notion_2.json')
            
            print(f"📝 Procesamiento automático configurado")
            print(f"📁 Archivo origen: {archivo_origen}")
            print(f"📊 Total de ejemplos: {len(ejemplos)}")
            print()
            
            print(f"📝 Se procesarán {len(ejemplos)} páginas automáticamente:")
            print()
            
            for ejemplo in ejemplos:
                print(f"   {ejemplo['id']}. {ejemplo['paginaacrear']}")
                print(f"      📋 {ejemplo['detalles'][:60]}...")
            
            print()
            print(f"⏱️  Tiempo de espera entre mensajes: {tiempo_espera} segundos")
            print()
            print("⚠️  IMPORTANTE:")
            print("   - Asegúrate de tener Cursor abierto y configurado")
            print("   - El sistema enviará un prompt por cada página")
            print("   - Cada página se creará como subpágina de su URL principal")
            print()
            
            confirmar = input("¿Continuar con el procesamiento automático? (s/n): ").strip().lower()
            
            if confirmar not in ['s', 'si', 'sí', 'y', 'yes']:
                print("❌ Procesamiento cancelado")
                return
            
            print("\n🚀 Iniciando procesamiento automático...")
            print("="*50)
            
            # Procesar cada página
            for i, ejemplo in enumerate(ejemplos, 1):
                print(f"\n📄 Procesando página {i}/{len(ejemplos)}: {ejemplo['paginaacrear']}")
                print(f"🔗 Subpágina de: {ejemplo['paginaprincipal']}")
                print(f"📋 Detalles: {ejemplo['detalles']}")
                
                # Crear placeholders para esta página específica
                placeholders_actual = {
                    "paginaacrear": ejemplo['paginaacrear'],
                    "paginaprincipal": ejemplo['paginaprincipal'],
                    "detalles": ejemplo['detalles']
                }
                
                # Guardar en notion_placeholders.json (solo para esta página)
                with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
                    json.dump(placeholders_actual, f, indent=2, ensure_ascii=False)
                
                print(f"✅ Placeholders configurados para: {ejemplo['paginaacrear']}")
                
                # Ejecutar orquestador para esta página
                print("🚀 Ejecutando orquestador 1 chat...")
                try:
                    # Ejecutar orquestador específico para 1 chat de Notion
                    subprocess.run([sys.executable, "orquestador_1_chat_notion.py"], check=True)
                    print(f"✅ Página {i} procesada exitosamente")
                    
                except subprocess.CalledProcessError as e:
                    print(f"❌ Error procesando página {i}: {e}")
                    continue
                except FileNotFoundError:
                    print("❌ No se encontró orquestador_1_chat_notion.py")
                    print("💡 Asegúrate de que el orquestador esté en el directorio actual")
                    break
                
                # Esperar antes de la siguiente página (excepto la última)
                if i < len(ejemplos):
                    print(f"\n⏳ Esperando {tiempo_espera} segundos antes de la siguiente página...")
                    time.sleep(tiempo_espera)
            
            print(f"\n🎉 ¡Procesamiento completado!")
            print(f"📊 Páginas procesadas: {len(ejemplos)}")
            print("💡 Revisa tu Notion para ver las páginas creadas")
            return
        
        # Verificar si es un archivo de placeholders directo (1 página)
        elif 'paginaacrear' in placeholders_actuales:
            print("📄 Archivo de placeholders directo detectado")
            print(f"   📄 Página: {placeholders_actuales['paginaacrear']}")
            print(f"   🔗 Principal: {placeholders_actuales['paginaprincipal']}")
            print()
            print("⚠️  Este archivo contiene solo 1 página")
            print("💡 Para procesar múltiples páginas, usa un archivo como ejemplos_paginas_notion.json")
            return
        
        else:
            print("❌ Configuración no reconocida")
            print("💡 Usa la opción 7 para configurar un archivo JSON válido")
            
    except FileNotFoundError:
        print("❌ No se encontró el archivo de configuración")
    except json.JSONDecodeError:
        print("❌ Error leyendo el archivo JSON")
    except Exception as e:
        print(f"❌ Error: {e}")

def ejecutar_orquestador_v2():
    """Ejecuta el orquestador v2.0."""
    print("🚀 Ejecutando orquestador v2.0...")
    try:
        subprocess.run([sys.executable, "orquestador_prompts_v2.py"], check=True)
        print("✅ Orquestador v2.0 completado")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando orquestador v2.0: {e}")
    except FileNotFoundError:
        print("❌ No se encontró orquestador_prompts_v2.py")

def ejecutar_orquestador_v1():
    """Ejecuta el orquestador v1.0."""
    print("🚀 Ejecutando orquestador v1.0...")
    try:
        subprocess.run([sys.executable, "orquestador_prompts_v1.py"], check=True)
        print("✅ Orquestador v1.0 completado")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando orquestador v1.0: {e}")
    except FileNotFoundError:
        print("❌ No se encontró orquestador_prompts_v1.py")

def generar_plantillas():
    """Genera las plantillas de detección."""
    print("🎨 Generando plantillas...")
    try:
        subprocess.run([sys.executable, "generar_plantillas.py"], check=True)
        print("✅ Plantillas generadas")
    except subprocess.CalledProcessError as e:
        print(f"❌ Error generando plantillas: {e}")
    except FileNotFoundError:
        print("❌ No se encontró generar_plantillas.py")

def mostrar_configuracion_chats():
    """Muestra la configuración actual de chats."""
    print("\n📊 CONFIGURACIÓN ACTUAL DE CHATS")
    print("="*50)
    
    try:
        config_file = "config.ini"
        if os.path.exists(config_file):
            config = configparser.ConfigParser()
            config.read(config_file, encoding='utf-8')
            
            cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=0)
            print(f"📊 Cantidad de chats: {cantidad_chats}")
            
            if cantidad_chats > 0:
                print(f"\n📍 Coordenadas configuradas:")
                for i in range(1, cantidad_chats + 1):
                    x = config.getint('COORDENADAS', f'chat_{i}_x', fallback=0)
                    y = config.getint('COORDENADAS', f'chat_{i}_y', fallback=0)
                    print(f"   Chat {i}: ({x}, {y})")
                
                print(f"\n📝 Plantillas configuradas:")
                if config.has_section('PLANTILLAS'):
                    for i in range(1, cantidad_chats + 1):
                        tipo = config.get('PLANTILLAS', f'chat_{i}_tipo', fallback='No configurado')
                        archivo = config.get('PLANTILLAS', f'chat_{i}_archivo', fallback='No configurado')
                        print(f"   Chat {i}: {tipo} -> {archivo}")
                else:
                    print("   No hay plantillas configuradas")
                    print("   💡 Usa la opción 6 para configurar plantillas")
                
                print(f"\n💡 Para cambiar la configuración, usa las opciones 5 y 6 del menú principal")
            else:
                print("❌ No hay chats configurados")
                print("💡 Ejecuta la opción 5 para configurar la cantidad de chats")
        else:
            print("❌ No se encontró config.ini")
            print("💡 Ejecuta la opción 5 para configurar la cantidad de chats")
            
    except Exception as e:
        print(f"❌ Error leyendo configuración: {e}")

def mostrar_checklist():
    """Muestra el checklist de configuración."""
    print("📋 Abriendo checklist...")
    try:
        if os.path.exists("CHECKLIST.md"):
            print("📄 Checklist disponible en: CHECKLIST.md")
            print("💡 Abre el archivo para ver el checklist completo")
        else:
            print("❌ No se encontró CHECKLIST.md")
    except Exception as e:
        print(f"❌ Error: {e}")

def mostrar_documentacion():
    """Muestra la documentación disponible."""
    print("📚 Documentación disponible:")
    print("   - CALIBRADOR_1_CHAT.md")
    print("   - FLUJO_AUTOMATICO_COMPLETO.md")
    print("   - DIFERENCIA_OPCIONES_7_Y_8.md")
    print("   - GENERACION_AUTOMATICA_5_PAGINAS.md")
    print("💡 Abre estos archivos para ver la documentación completa")

def main():
    """Función principal del programa."""
    print("🎯 Orquestador de Prompts - Inicio Rápido")
    print("="*50)
    
    # Verificar dependencias
    if not verificar_dependencias():
        return
    
    while True:
        mostrar_menu()
        
        try:
            opcion = input("Ingresa tu opción (1-14): ").strip()
            
            if opcion == "1":
                ejecutar_calibracion()
            elif opcion == "2":
                generar_plantillas()
            elif opcion == "3":
                ejecutar_orquestador_v2()
            elif opcion == "4":
                ejecutar_orquestador_v1()
            elif opcion == "5":
                configurar_cantidad_chats()
            elif opcion == "6":
                personalizar_plantillas_prompts()
            elif opcion == "7":
                elegir_ejemplo_notion()
            elif opcion == "8":
                configurar_tiempo_espera()
            elif opcion == "9":
                ejecutar_orquestador_automatico()
            elif opcion == "10":
                mostrar_configuracion_chats()
            elif opcion == "11":
                mostrar_checklist()
            elif opcion == "12":
                print("🔁 Implementar pipelines encadenados - En desarrollo")
            elif opcion == "13":
                mostrar_documentacion()
            elif opcion == "14":
                print("👋 ¡Hasta luego!")
                break
            else:
                print("❌ Opción inválida. Intenta de nuevo.")
            
            input("\nPresiona Enter para continuar...")
            
        except KeyboardInterrupt:
            print("\n👋 ¡Hasta luego!")
            break
        except Exception as e:
            print(f"❌ Error inesperado: {e}")
            input("\nPresiona Enter para continuar...")

if __name__ == "__main__":
    main()
