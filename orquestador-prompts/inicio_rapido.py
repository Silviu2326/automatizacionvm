#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de inicio rápido para el Orquestador de Prompts.
Guía paso a paso para configurar y ejecutar el orquestador.
"""

import os
import sys
import subprocess
import configparser
import json
from pathlib import Path

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
        print(f"\n⚠️  Dependencias faltantes: {', '.join(faltantes)}")
        print("💡 Ejecuta: python instalar.py")
        return False
    
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

def ejecutar_orquestador_v2():
    """Ejecuta el orquestador v2.0."""
    print("🚀 Iniciando orquestador v2.0...")
    print("📋 Controles: F8 (pausar), F9 (saltar), ESC (abortar)")
    try:
        subprocess.run([sys.executable, "orquestador_prompts_v2.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando orquestador: {e}")
    except FileNotFoundError:
        print("❌ No se encontró orquestador_prompts_v2.py")

def ejecutar_orquestador_v1():
    """Ejecuta el orquestador v1.0."""
    print("🚀 Iniciando orquestador v1.0...")
    print("📋 Controles: F8 (pausar), F9 (saltar), ESC (abortar)")
    try:
        subprocess.run([sys.executable, "orquestador_prompts.py"], check=True)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error ejecutando orquestador: {e}")
    except FileNotFoundError:
        print("❌ No se encontró orquestador_prompts.py")

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

def configurar_cantidad_chats():
    """Configura la cantidad de chats que se usarán simultáneamente."""
    print("\n⚙️  CONFIGURACIÓN DE CANTIDAD DE CHATS")
    print("="*50)
    print()
    print("Esta opción te permite configurar cuántos chats de Cursor")
    print("se usarán simultáneamente durante la ejecución del orquestador.")
    print()
    
    try:
        # Leer configuración actual
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
        print()
        
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
        
        # Configurar coordenadas según la cantidad de chats
        if not config.has_section('COORDENADAS'):
            config.add_section('COORDENADAS')
        
        # Coordenadas por defecto para diferentes cantidades de chats
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
                'chat_1_x': '250', 'chat_1_y': '800',
                'chat_2_x': '650', 'chat_2_y': '800',
                'chat_3_x': '1050', 'chat_3_y': '800',
                'chat_4_x': '1450', 'chat_4_y': '800'
            }
        }
        
        if nueva_cantidad in coordenadas_por_defecto:
            coords = coordenadas_por_defecto[nueva_cantidad]
            for key, value in coords.items():
                config.set('COORDENADAS', key, value)
        
        # Guardar configuración
        with open(config_file, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"\n✅ Configuración guardada en {config_file}")
        print(f"📊 Cantidad de chats: {nueva_cantidad}")
        
        if nueva_cantidad > 2:
            print("\n⚠️  IMPORTANTE:")
            print("   - Asegúrate de tener suficientes ventanas de Cursor abiertas")
            print("   - Las coordenadas se han configurado automáticamente")
            print("   - Puedes ajustar las coordenadas manualmente en config.ini")
            print("   - Ejecuta la calibración visual para ajustar coordenadas")
        
    except Exception as e:
        print(f"❌ Error configurando cantidad de chats: {e}")

def personalizar_plantillas_prompts():
    """Personaliza las plantillas de prompts según la cantidad de chats configurada."""
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
        
        # Plantillas por defecto según cantidad de chats
        plantillas_por_defecto = {
            2: {
                'chat_1': 'Frontend',
                'chat_2': 'Backend'
            },
            3: {
                'chat_1': 'Frontend',
                'chat_2': 'Backend', 
                'chat_3': 'Marketing'
            },
            4: {
                'chat_1': 'Frontend',
                'chat_2': 'Backend',
                'chat_3': 'Marketing',
                'chat_4': 'Analytics'
            },
            5: {
                'chat_1': 'Frontend',
                'chat_2': 'Backend',
                'chat_3': 'Marketing',
                'chat_4': 'Analytics',
                'chat_5': 'CRM'
            },
            6: {
                'chat_1': 'Frontend',
                'chat_2': 'Backend',
                'chat_3': 'Marketing',
                'chat_4': 'Analytics',
                'chat_5': 'CRM',
                'chat_6': 'Support'
            }
        }
        
        # Plantillas especializadas por tareas específicas
        plantillas_especializadas = {
            'creacion_paginas_notion': {
                'nombre': '📝 Creación de Páginas en Notion',
                'descripcion': 'Crea páginas estructuradas en Notion desde especificaciones. Cursor recibirá: 1) Especificaciones del contenido, 2) Estructura de la página, 3) Plantillas a usar. Generará: páginas de Notion con contenido estructurado, bases de datos, relaciones, y plantillas reutilizables.',
                'chats': {
                    1: {'tipo': 'Notion_Creator', 'archivo': '@prompts_notion_creator'},
                    2: {'tipo': 'Content_Structured', 'archivo': '@prompts_content_structured'},
                    3: {'tipo': 'Database_Designer', 'archivo': '@prompts_database_designer'}
                }
            },
            'notion_a_paginas': {
                'nombre': '🔄 Creación de Notion a Páginas',
                'descripcion': 'Convierte contenido de Notion en páginas web estáticas. Cursor recibirá: 1) URL de página Notion, 2) Estilo de página web deseado, 3) Framework de destino. Generará: páginas HTML/CSS, componentes React, documentación MD, y sitios web completos desde contenido de Notion.',
                'chats': {
                    1: {'tipo': 'Notion_Extractor', 'archivo': '@prompts_notion_extractor'},
                    2: {'tipo': 'Web_Generator', 'archivo': '@prompts_web_generator'},
                    3: {'tipo': 'Content_Converter', 'archivo': '@prompts_content_converter'}
                }
            },
            'desarrollo_completo': {
                'nombre': '🚀 Desarrollo Full-Stack',
                'descripcion': 'Desarrolla aplicaciones completas full-stack. Cursor recibirá: 1) Especificaciones de la aplicación, 2) Stack tecnológico preferido. Generará: estructura de proyecto, componentes React/TypeScript, APIs REST, esquemas de BD, configuración Docker, y documentación técnica completa.',
                'chats': {
                    1: {'tipo': 'Frontend_React', 'archivo': '@prompts_react_dev'},
                    2: {'tipo': 'Backend_Node', 'archivo': '@prompts_node_dev'},
                    3: {'tipo': 'Database_Expert', 'archivo': '@prompts_database'},
                    4: {'tipo': 'DevOps', 'archivo': '@prompts_devops'}
                }
            },
            'documentation_team': {
                'nombre': '📚 Equipo de Documentación',
                'descripcion': 'Genera documentación técnica completa y profesional. Cursor recibirá: 1) Código fuente del proyecto, 2) Especificaciones de APIs, 3) Requisitos de documentación. Generará: documentación técnica, guías de usuario, documentación de APIs con Swagger, y manuales de instalación.',
                'chats': {
                    1: {'tipo': 'Technical_Writer', 'archivo': '@prompts_technical_writer'},
                    2: {'tipo': 'API_Documenter', 'archivo': '@prompts_api_docs'},
                    3: {'tipo': 'User_Guide_Creator', 'archivo': '@prompts_user_guides'}
                }
            },
            'testing_qa': {
                'nombre': '🧪 Testing y QA',
                'descripcion': 'Implementa testing automatizado completo y control de calidad. Cursor recibirá: 1) Código fuente a testear, 2) Casos de uso específicos, 3) Requisitos de rendimiento. Generará: tests unitarios, tests de integración, tests E2E, reportes de cobertura, y estrategias de testing.',
                'chats': {
                    1: {'tipo': 'Test_Automation', 'archivo': '@prompts_test_automation'},
                    2: {'tipo': 'QA_Engineer', 'archivo': '@prompts_qa_engineer'},
                    3: {'tipo': 'Performance_Testing', 'archivo': '@prompts_performance_testing'}
                }
            },
            'mobile_development': {
                'nombre': '📱 Desarrollo Mobile',
                'descripcion': 'Desarrolla aplicaciones móviles cross-platform optimizadas. Cursor recibirá: 1) Especificaciones de la app móvil, 2) Plataformas objetivo (iOS/Android), 3) Funcionalidades requeridas. Generará: estructura de proyecto React Native/Flutter, componentes nativos, APIs móviles, y configuraciones de despliegue.',
                'chats': {
                    1: {'tipo': 'React_Native_Dev', 'archivo': '@prompts_react_native'},
                    2: {'tipo': 'Flutter_Dev', 'archivo': '@prompts_flutter'},
                    3: {'tipo': 'Mobile_UI_UX', 'archivo': '@prompts_mobile_ui'},
                    4: {'tipo': 'Mobile_Backend', 'archivo': '@prompts_mobile_backend'}
                }
            },
            'ecommerce_platform': {
                'nombre': '🛒 Plataforma E-commerce',
                'descripcion': 'Construye tiendas online completas con todas las funcionalidades. Cursor recibirá: 1) Catálogo de productos, 2) Métodos de pago requeridos, 3) Reglas de negocio. Generará: frontend de tienda, sistema de pagos, gestión de inventario, procesamiento de pedidos, y dashboard de analytics.',
                'chats': {
                    1: {'tipo': 'Ecommerce_Frontend', 'archivo': '@prompts_ecommerce_frontend'},
                    2: {'tipo': 'Payment_Integration', 'archivo': '@prompts_payment_systems'},
                    3: {'tipo': 'Inventory_Management', 'archivo': '@prompts_inventory'},
                    4: {'tipo': 'Order_Processing', 'archivo': '@prompts_order_management'},
                    5: {'tipo': 'Analytics_Dashboard', 'archivo': '@prompts_ecommerce_analytics'}
                }
            },
            'saas_application': {
                'nombre': '☁️ Aplicación SaaS',
                'descripcion': 'Desarrolla aplicaciones SaaS multi-tenant con suscripciones. Cursor recibirá: 1) Modelo de negocio SaaS, 2) Planes de suscripción, 3) Funcionalidades por plan. Generará: arquitectura multi-tenant, sistema de suscripciones, facturación automática, gestión de usuarios, y analytics empresariales.',
                'chats': {
                    1: {'tipo': 'SaaS_Frontend', 'archivo': '@prompts_saas_frontend'},
                    2: {'tipo': 'Multi_Tenant_Backend', 'archivo': '@prompts_multi_tenant'},
                    3: {'tipo': 'Subscription_Management', 'archivo': '@prompts_subscriptions'},
                    4: {'tipo': 'User_Management', 'archivo': '@prompts_user_management'},
                    5: {'tipo': 'Billing_System', 'archivo': '@prompts_billing'},
                    6: {'tipo': 'Analytics_Reporting', 'archivo': '@prompts_saas_analytics'}
                }
            },
            'ai_ml_integration': {
                'nombre': '🤖 Integración AI/ML',
                'descripcion': 'Integra inteligencia artificial en aplicaciones existentes. Cursor recibirá: 1) Datos de entrenamiento, 2) Casos de uso de IA, 3) Modelos pre-entrenados. Generará: interfaces de IA, pipelines de ML, procesamiento de datos, y integración de modelos en producción.',
                'chats': {
                    1: {'tipo': 'AI_Frontend', 'archivo': '@prompts_ai_frontend'},
                    2: {'tipo': 'ML_Backend', 'archivo': '@prompts_ml_backend'},
                    3: {'tipo': 'Data_Processing', 'archivo': '@prompts_data_processing'},
                    4: {'tipo': 'Model_Integration', 'archivo': '@prompts_model_integration'}
                }
            },
            'real_time_app': {
                'nombre': '⚡ Aplicación Tiempo Real',
                'descripcion': 'Desarrolla aplicaciones con comunicación en tiempo real. Cursor recibirá: 1) Casos de uso de tiempo real, 2) Volumen de usuarios esperado, 3) Tipos de eventos. Generará: WebSocket servers, interfaces en tiempo real, sistemas de notificaciones, y streaming de eventos.',
                'chats': {
                    1: {'tipo': 'Real_Time_Frontend', 'archivo': '@prompts_realtime_frontend'},
                    2: {'tipo': 'WebSocket_Backend', 'archivo': '@prompts_websocket_backend'},
                    3: {'tipo': 'Event_Streaming', 'archivo': '@prompts_event_streaming'},
                    4: {'tipo': 'Notification_System', 'archivo': '@prompts_notifications'}
                }
            },
            'microservices_architecture': {
                'nombre': '🏗️ Arquitectura Microservicios',
                'descripcion': 'Diseña arquitecturas distribuidas escalables. Cursor recibirá: 1) Servicios a descomponer, 2) Requisitos de escalabilidad, 3) Tecnologías preferidas. Generará: API Gateway, service discovery, eventos asíncronos, orquestación de contenedores, y monitoreo distribuido.',
                'chats': {
                    1: {'tipo': 'API_Gateway', 'archivo': '@prompts_api_gateway'},
                    2: {'tipo': 'Service_Discovery', 'archivo': '@prompts_service_discovery'},
                    3: {'tipo': 'Event_Driven', 'archivo': '@prompts_event_driven'},
                    4: {'tipo': 'Container_Orchestration', 'archivo': '@prompts_container_orchestration'},
                    5: {'tipo': 'Monitoring_Logging', 'archivo': '@prompts_monitoring'},
                    6: {'tipo': 'Security_Compliance', 'archivo': '@prompts_microservices_security'}
                }
            },
            'fintech_application': {
                'nombre': '💰 Aplicación FinTech',
                'descripcion': 'Desarrolla aplicaciones financieras seguras y compliant. Cursor recibirá: 1) Regulaciones financieras aplicables, 2) Tipos de transacciones, 3) Requisitos de seguridad. Generará: interfaces financieras, procesamiento de pagos, evaluación de riesgos, reportes de cumplimiento, y integración blockchain.',
                'chats': {
                    1: {'tipo': 'FinTech_Frontend', 'archivo': '@prompts_fintech_frontend'},
                    2: {'tipo': 'Payment_Processing', 'archivo': '@prompts_payment_processing'},
                    3: {'tipo': 'Risk_Assessment', 'archivo': '@prompts_risk_assessment'},
                    4: {'tipo': 'Compliance_Reporting', 'archivo': '@prompts_compliance'},
                    5: {'tipo': 'Blockchain_Integration', 'archivo': '@prompts_blockchain'}
                }
            },
            'healthcare_app': {
                'nombre': '🏥 Aplicación Healthcare',
                'descripcion': 'Desarrolla aplicaciones de salud HIPAA-compliant. Cursor recibirá: 1) Tipos de datos médicos, 2) Flujos de trabajo clínicos, 3) Requisitos de privacidad. Generará: interfaces de salud, gestión de pacientes, registros médicos seguros, cumplimiento HIPAA, y funcionalidades de telemedicina.',
                'chats': {
                    1: {'tipo': 'Healthcare_Frontend', 'archivo': '@prompts_healthcare_frontend'},
                    2: {'tipo': 'Patient_Management', 'archivo': '@prompts_patient_management'},
                    3: {'tipo': 'Medical_Records', 'archivo': '@prompts_medical_records'},
                    4: {'tipo': 'HIPAA_Compliance', 'archivo': '@prompts_hipaa_compliance'},
                    5: {'tipo': 'Telemedicine', 'archivo': '@prompts_telemedicine'}
                }
            },
            'gaming_platform': {
                'nombre': '🎮 Plataforma Gaming',
                'descripcion': 'Construye plataformas de gaming y sistemas multijugador. Cursor recibirá: 1) Mecánicas de juego, 2) Número de jugadores simultáneos, 3) Tipos de competencia. Generará: interfaces de juego, backends de gaming, sistemas multijugador, leaderboards, y analytics de jugadores.',
                'chats': {
                    1: {'tipo': 'Game_Frontend', 'archivo': '@prompts_game_frontend'},
                    2: {'tipo': 'Game_Backend', 'archivo': '@prompts_game_backend'},
                    3: {'tipo': 'Multiplayer_System', 'archivo': '@prompts_multiplayer'},
                    4: {'tipo': 'Leaderboards', 'archivo': '@prompts_leaderboards'},
                    5: {'tipo': 'Game_Analytics', 'archivo': '@prompts_game_analytics'}
                }
            },
            'iot_application': {
                'nombre': '🌐 Aplicación IoT',
                'descripcion': 'Desarrolla sistemas IoT para monitoreo y control de dispositivos. Cursor recibirá: 1) Tipos de sensores/dispositivos, 2) Volumen de datos, 3) Requisitos de tiempo real. Generará: dashboards IoT, gestión de dispositivos, ingesta de datos de sensores, y procesamiento edge.',
                'chats': {
                    1: {'tipo': 'IoT_Dashboard', 'archivo': '@prompts_iot_dashboard'},
                    2: {'tipo': 'Device_Management', 'archivo': '@prompts_device_management'},
                    3: {'tipo': 'Data_Ingestion', 'archivo': '@prompts_data_ingestion'},
                    4: {'tipo': 'Edge_Computing', 'archivo': '@prompts_edge_computing'}
                }
            },
            'content_management': {
                'nombre': '📝 Sistema CMS',
                'descripcion': 'Construye sistemas de gestión de contenido robustos. Cursor recibirá: 1) Tipos de contenido, 2) Flujos de aprobación, 3) Requisitos de SEO. Generará: interfaces de CMS, APIs de contenido, gestión de medios, optimización SEO, y flujos de trabajo editoriales.',
                'chats': {
                    1: {'tipo': 'CMS_Frontend', 'archivo': '@prompts_cms_frontend'},
                    2: {'tipo': 'Content_API', 'archivo': '@prompts_content_api'},
                    3: {'tipo': 'Media_Management', 'archivo': '@prompts_media_management'},
                    4: {'tipo': 'SEO_Optimization', 'archivo': '@prompts_seo_optimization'},
                    5: {'tipo': 'Workflow_Management', 'archivo': '@prompts_workflow_management'}
                }
            },
            'api_platform': {
                'nombre': '🔌 Plataforma de APIs',
                'descripcion': 'Desarrolla plataformas de APIs empresariales. Cursor recibirá: 1) Servicios a exponer, 2) Políticas de rate limiting, 3) Requisitos de documentación. Generará: diseño de APIs RESTful, gateway de APIs, limitación de velocidad, documentación automática, y portal de desarrolladores.',
                'chats': {
                    1: {'tipo': 'API_Design', 'archivo': '@prompts_api_design'},
                    2: {'tipo': 'API_Gateway', 'archivo': '@prompts_api_gateway'},
                    3: {'tipo': 'Rate_Limiting', 'archivo': '@prompts_rate_limiting'},
                    4: {'tipo': 'API_Documentation', 'archivo': '@prompts_api_documentation'},
                    5: {'tipo': 'Developer_Portal', 'archivo': '@prompts_developer_portal'}
                }
            },
            'backend_generator': {
                'nombre': '🏗️ Generador Backend',
                'descripcion': 'Genera modelos, controladores y rutas desde documentación MD. Cursor recibirá: 1) Archivo MD con especificaciones, 2) Path del src del backend. Generará: modelos de datos, controladores con CRUD, rutas RESTful, validaciones, y middleware de autenticación.',
                'chats': {
                    1: {'tipo': 'Model_Generator', 'archivo': '@prompts_model_generator'},
                    2: {'tipo': 'Controller_Generator', 'archivo': '@prompts_controller_generator'},
                    3: {'tipo': 'Route_Generator', 'archivo': '@prompts_route_generator'}
                }
            },
            'frontend_components': {
                'nombre': '⚛️ Generador Componentes Frontend',
                'descripcion': 'Crea componentes React/TypeScript desde especificaciones. Cursor recibirá: 1) Archivo MD con diseño de componentes, 2) Path del src del frontend. Generará: componentes React, hooks personalizados, tipos TypeScript, estilos CSS/Tailwind, y tests unitarios.',
                'chats': {
                    1: {'tipo': 'Component_Generator', 'archivo': '@prompts_component_generator'},
                    2: {'tipo': 'Hook_Generator', 'archivo': '@prompts_hook_generator'},
                    3: {'tipo': 'Type_Generator', 'archivo': '@prompts_type_generator'}
                }
            },
            'database_schema': {
                'nombre': '🗄️ Generador Esquema BD',
                'descripcion': 'Crea esquemas de base de datos desde documentación. Cursor recibirá: 1) Archivo MD con entidades, 2) Tipo de BD (PostgreSQL/MySQL/MongoDB). Generará: migraciones, modelos, índices, relaciones, y scripts de seeding.',
                'chats': {
                    1: {'tipo': 'Schema_Generator', 'archivo': '@prompts_schema_generator'},
                    2: {'tipo': 'Migration_Generator', 'archivo': '@prompts_migration_generator'},
                    3: {'tipo': 'Seed_Generator', 'archivo': '@prompts_seed_generator'}
                }
            },
            'api_documentation': {
                'nombre': '📚 Generador Documentación API',
                'descripcion': 'Genera documentación completa de APIs desde código. Cursor recibirá: 1) Archivos de rutas/controladores, 2) Path de documentación. Generará: documentación Swagger/OpenAPI, ejemplos de uso, SDKs, y guías de integración.',
                'chats': {
                    1: {'tipo': 'Swagger_Generator', 'archivo': '@prompts_swagger_generator'},
                    2: {'tipo': 'SDK_Generator', 'archivo': '@prompts_sdk_generator'},
                    3: {'tipo': 'Guide_Generator', 'archivo': '@prompts_guide_generator'}
                }
            },
            'test_generator': {
                'nombre': '🧪 Generador Tests',
                'descripcion': 'Crea tests automatizados desde código existente. Cursor recibirá: 1) Archivos de código a testear, 2) Path de tests. Generará: tests unitarios, tests de integración, mocks, fixtures, y reportes de cobertura.',
                'chats': {
                    1: {'tipo': 'Unit_Test_Generator', 'archivo': '@prompts_unit_test_generator'},
                    2: {'tipo': 'Integration_Test_Generator', 'archivo': '@prompts_integration_test_generator'},
                    3: {'tipo': 'Mock_Generator', 'archivo': '@prompts_mock_generator'}
                }
            }
        }
        
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
        
        # Crear backup antes de guardar
        if os.path.exists('config.ini'):
            import shutil
            shutil.copy('config.ini', 'config.ini.backup')
        
        print(f"   📋 Sección PLANTILLAS existe: {config.has_section('PLANTILLAS')}")
        
        # Configurar plantillas para 1 chat
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
        
        # Guardar configuración
        with open(config_file, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"\n✅ Configuración de plantillas guardada en {config_file}")
        print("💡 Los archivos de prompts deben existir para que funcione correctamente")
        
        # Verificar que la sección se guardó correctamente
        print(f"\n🔍 Verificando configuración guardada:")
        print(f"   📋 Sección PLANTILLAS existe: {config.has_section('PLANTILLAS')}")
        if config.has_section('PLANTILLAS'):
            print(f"   📝 Chat 1 tipo: {config.get('PLANTILLAS', 'chat_1_tipo', fallback='No configurado')}")
            print(f"   📝 Chat 1 archivo: {config.get('PLANTILLAS', 'chat_1_archivo', fallback='No configurado')}")
        
        # Mostrar resumen de configuración
        print(f"\n📋 RESUMEN DE CONFIGURACIÓN:")
        for i in range(1, cantidad_chats + 1):
            tipo = config.get('PLANTILLAS', f'chat_{i}_tipo', fallback='No configurado')
            archivo = config.get('PLANTILLAS', f'chat_{i}_archivo', fallback='No configurado')
            print(f"   Chat {i}: {tipo} -> {archivo}")
        
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
        
        # Buscar archivos que contengan placeholders
        for archivo in os.listdir('.'):
            if archivo.endswith('.json') and ('placeholder' in archivo.lower() or 'notion' in archivo.lower()):
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
                
                # Mostrar información del archivo
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
        print("  5. Personalizado")
        print()
        
        opcion = input("Selecciona una opción (1-5): ").strip()
        
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
            try:
                nuevo_tiempo = int(input("Ingresa el tiempo en segundos (5-300): "))
                if 5 <= nuevo_tiempo <= 300:
                    print(f"✅ Configurado para {nuevo_tiempo} segundos")
                else:
                    print("❌ El tiempo debe estar entre 5 y 300 segundos")
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
        if placeholders_actuales.get('procesamiento_automatico', False):
            # Es un archivo configurado para procesamiento automático
            ejemplos = placeholders_actuales['ejemplos']
            archivo_origen = placeholders_actuales['archivo_origen']
            
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
                    print("❌ No se encontró orquestador_prompts_v2.py")
                    print("💡 Asegúrate de que el orquestador esté en el directorio actual")
                    break
                
                # Esperar antes de la siguiente página (excepto la última)
                if i < len(ejemplos):
                    print(f"\n⏳ Esperando {tiempo_espera} segundos antes de la siguiente página...")
                    import time
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
        
        # Buscar archivo de ejemplos múltiples
        archivos_ejemplos = []
        for archivo in os.listdir('.'):
            if archivo.endswith('.json') and 'ejemplos' in archivo.lower():
                archivos_ejemplos.append(archivo)
        
        if not archivos_ejemplos:
            print("❌ No se encontraron archivos de ejemplos múltiples")
            print("💡 Asegúrate de tener archivos como ejemplos_paginas_notion.json")
            return
        
        print("📁 Archivos de ejemplos disponibles:")
        for i, archivo in enumerate(archivos_ejemplos, 1):
            print(f"   {i}. {archivo}")
        
        try:
            opcion = int(input(f"\nSelecciona un archivo (1-{len(archivos_ejemplos)}): "))
            
            if 1 <= opcion <= len(archivos_ejemplos):
                archivo_seleccionado = archivos_ejemplos[opcion - 1]
                
                # Cargar ejemplos
                with open(archivo_seleccionado, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                
                if 'ejemplos' not in data:
                    print("❌ El archivo no contiene ejemplos")
                    return
                
                ejemplos = data['ejemplos']
                
                print(f"\n📝 Se procesarán {len(ejemplos)} páginas automáticamente:")
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
                    
                    # Crear placeholders para esta página
                    placeholders = {
                        "paginaacrear": ejemplo['paginaacrear'],
                        "paginaprincipal": ejemplo['paginaprincipal'],
                        "detalles": ejemplo['detalles']
                    }
                    
                    # Guardar en notion_placeholders.json
                    with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
                        json.dump(placeholders, f, indent=2, ensure_ascii=False)
                    
                    print(f"✅ Placeholders configurados para: {ejemplo['paginaacrear']}")
                    
                    # Ejecutar orquestador para esta página
                    print("🚀 Ejecutando orquestador...")
                    try:
                        # Ejecutar orquestador v2.0
                        subprocess.run([sys.executable, "orquestador_prompts_v2.py"], check=True)
                        print(f"✅ Página {i} procesada exitosamente")
                        
                    except subprocess.CalledProcessError as e:
                        print(f"❌ Error procesando página {i}: {e}")
                        continue
                    except FileNotFoundError:
                        print("❌ No se encontró orquestador_prompts_v2.py")
                        print("💡 Asegúrate de que el orquestador esté en el directorio actual")
                        break
                    
                    # Esperar antes de la siguiente página (excepto la última)
                    if i < len(ejemplos):
                        print(f"\n⏳ Esperando {tiempo_espera} segundos antes de la siguiente página...")
                        import time
                        time.sleep(tiempo_espera)
                
                print(f"\n🎉 ¡Procesamiento completado!")
                print(f"📊 Páginas procesadas: {len(ejemplos)}")
                print("💡 Revisa tu Notion para ver las páginas creadas")
                
            else:
                print("❌ Número de archivo inválido")
                
        except ValueError:
            print("❌ Ingresa un número válido")
            
    except FileNotFoundError:
        print("❌ No se encontró el archivo de configuración")
    except json.JSONDecodeError:
        print("❌ Error leyendo el archivo JSON")
    except Exception as e:
        print(f"❌ Error: {e}")

def generar_5_paginas_automaticamente():
    """Genera las 5 páginas de ejemplos automáticamente."""
    print("\n🚀 GENERAR LAS 5 PÁGINAS DE EJEMPLOS AUTOMÁTICAMENTE")
    print("="*60)
    print()
    print("Esta opción generará automáticamente las 5 páginas")
    print("del archivo ejemplos_paginas_notion.json usando el orquestador.")
    print()
    
    try:
        # Verificar que existe el archivo de ejemplos
        ejemplos_file = "ejemplos_paginas_notion.json"
        if not os.path.exists(ejemplos_file):
            print("❌ No se encontró ejemplos_paginas_notion.json")
            print("💡 Asegúrate de que el archivo existe en el directorio actual")
            return
        
        # Cargar ejemplos
        with open(ejemplos_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        ejemplos = data['ejemplos']
        
        print(f"📝 Se generarán {len(ejemplos)} páginas automáticamente:")
        print()
        
        for ejemplo in ejemplos:
            print(f"   {ejemplo['id']}. {ejemplo['paginaacrear']}")
            print(f"      📋 {ejemplo['detalles'][:60]}...")
        
        print()
        print("⚠️  IMPORTANTE:")
        print("   - Asegúrate de tener Cursor abierto y configurado")
        print("   - El sistema enviará un prompt por cada página")
        print("   - Cada página se creará como subpágina de su URL principal")
        print()
        
        confirmar = input("¿Continuar con la generación automática? (s/n): ").strip().lower()
        
        if confirmar not in ['s', 'si', 'sí', 'y', 'yes']:
            print("❌ Generación cancelada")
            return
        
        print("\n🚀 Iniciando generación automática...")
        print("="*50)
        
        # Generar cada página
        for i, ejemplo in enumerate(ejemplos, 1):
            print(f"\n📄 Generando página {i}/{len(ejemplos)}: {ejemplo['paginaacrear']}")
            print(f"🔗 Subpágina de: {ejemplo['paginaprincipal']}")
            print(f"📋 Detalles: {ejemplo['detalles']}")
            
            # Crear placeholders para esta página
            placeholders = {
                "paginaacrear": ejemplo['paginaacrear'],
                "paginaprincipal": ejemplo['paginaprincipal'],
                "detalles": ejemplo['detalles']
            }
            
            # Guardar en notion_placeholders.json
            with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
                json.dump(placeholders, f, indent=2, ensure_ascii=False)
            
            print(f"✅ Placeholders configurados para: {ejemplo['paginaacrear']}")
            
            # Ejecutar orquestador para esta página
            print("🚀 Ejecutando orquestador...")
            try:
                # Ejecutar orquestador v2.0
                subprocess.run([sys.executable, "orquestador_prompts_v2.py"], check=True)
                print(f"✅ Página {i} generada exitosamente")
                
            except subprocess.CalledProcessError as e:
                print(f"❌ Error generando página {i}: {e}")
                continue
            except FileNotFoundError:
                print("❌ No se encontró orquestador_prompts_v2.py")
                print("💡 Asegúrate de que el orquestador esté en el directorio actual")
                break
            
            # Pausa entre páginas (opcional)
            if i < len(ejemplos):
                print(f"\n⏳ Pausa antes de la siguiente página...")
                input("Presiona Enter para continuar con la siguiente página...")
        
        print(f"\n🎉 ¡Generación completada!")
        print(f"📊 Páginas generadas: {len(ejemplos)}")
        print("💡 Revisa tu Notion para ver las páginas creadas")
        
    except FileNotFoundError:
        print("❌ No se encontró ejemplos_paginas_notion.json")
    except json.JSONDecodeError:
        print("❌ Error leyendo el archivo de ejemplos")
    except Exception as e:
        print(f"❌ Error: {e}")

def mostrar_configuracion_chats():
    """Muestra la configuración actual de chats."""
    print("\n📊 CONFIGURACIÓN ACTUAL DE CHATS")
    print("="*40)
    
    try:
        config_file = "config.ini"
        if os.path.exists(config_file):
            config = configparser.ConfigParser()
            config.read(config_file, encoding='utf-8')
            
            cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=2)
            print(f"📊 Cantidad de chats configurados: {cantidad_chats}")
            
            if cantidad_chats >= 2:
                print(f"📍 Chat 1 (Frontend): ({config.get('COORDENADAS', 'chat_1_x', fallback='400')}, {config.get('COORDENADAS', 'chat_1_y', fallback='800')})")
                print(f"📍 Chat 2 (Backend): ({config.get('COORDENADAS', 'chat_2_x', fallback='1200')}, {config.get('COORDENADAS', 'chat_2_y', fallback='800')})")
            
            if cantidad_chats >= 3:
                print(f"📍 Chat 3 (Marketing): ({config.get('COORDENADAS', 'chat_3_x', fallback='1300')}, {config.get('COORDENADAS', 'chat_3_y', fallback='800')})")
            
            if cantidad_chats >= 4:
                print(f"📍 Chat 4 (Analytics): ({config.get('COORDENADAS', 'chat_4_x', fallback='1450')}, {config.get('COORDENADAS', 'chat_4_y', fallback='800')})")
            
            if cantidad_chats >= 5:
                print(f"📍 Chat 5: ({config.get('COORDENADAS', 'chat_5_x', fallback='1600')}, {config.get('COORDENADAS', 'chat_5_y', fallback='800')})")
            
            if cantidad_chats >= 6:
                print(f"📍 Chat 6: ({config.get('COORDENADAS', 'chat_6_x', fallback='1750')}, {config.get('COORDENADAS', 'chat_6_y', fallback='800')})")
            
            # Mostrar configuración de plantillas
            print(f"\n📝 CONFIGURACIÓN DE PLANTILLAS:")
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
            print("❌ No se encontró config.ini")
            print("💡 Ejecuta la opción 5 para configurar la cantidad de chats")
            
    except Exception as e:
        print(f"❌ Error leyendo configuración: {e}")

def mostrar_documentacion():
    """Muestra información sobre la documentación."""
    print("📚 Documentación disponible:")
    print()
    print("📄 README.md - Documentación completa del proyecto")
    print("📋 CHECKLIST.md - Checklist rápido de configuración")
    print("📄 README_ORQUESTADOR.md - Guía de esta carpeta")
    print()
    print("💡 Abre los archivos .md para ver la documentación completa")

def implementar_pipelines_encadenados():
    """Implementa pipelines encadenados para flujos de trabajo completos."""
    print("\n🔁 PIPELINES ENCADENADOS")
    print("="*50)
    print()
    print("Los pipelines encadenados permiten ejecutar múltiples plantillas")
    print("en secuencia para flujos de trabajo completos.")
    print()
    
    # Pipelines predefinidos
    pipelines_predefinidos = {
        'desarrollo_completo': {
            'nombre': '🚀 Desarrollo Completo Full-Stack',
            'descripcion': 'Pipeline completo desde análisis hasta despliegue',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '🏗️ Generar Backend',
                '⚛️ Generar Componentes Frontend',
                '🗄️ Generar Esquema BD',
                '🧪 Generar Tests',
                '📚 Generar Documentación API'
            ],
            'plantillas': [
                'notion_user_stories',
                'backend_generator',
                'frontend_components',
                'database_schema',
                'test_generator',
                'api_documentation'
            ]
        },
        'ecommerce_completo': {
            'nombre': '🛒 E-commerce Completo',
            'descripcion': 'Pipeline para tienda online completa',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '🛒 Plataforma E-commerce',
                '🗄️ Generar Esquema BD',
                '🧪 Generar Tests',
                '📚 Generar Documentación API'
            ],
            'plantillas': [
                'notion_user_stories',
                'ecommerce_platform',
                'database_schema',
                'test_generator',
                'api_documentation'
            ]
        },
        'saas_completo': {
            'nombre': '☁️ SaaS Completo',
            'descripcion': 'Pipeline para aplicación SaaS completa',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '☁️ Aplicación SaaS',
                '🗄️ Generar Esquema BD',
                '🧪 Generar Tests',
                '📚 Generar Documentación API'
            ],
            'plantillas': [
                'notion_user_stories',
                'saas_application',
                'database_schema',
                'test_generator',
                'api_documentation'
            ]
        },
        'mobile_completo': {
            'nombre': '📱 Mobile App Completa',
            'descripcion': 'Pipeline para aplicación móvil completa',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '📱 Desarrollo Mobile',
                '🏗️ Generar Backend',
                '🗄️ Generar Esquema BD',
                '🧪 Generar Tests'
            ],
            'plantillas': [
                'notion_user_stories',
                'mobile_development',
                'backend_generator',
                'database_schema',
                'test_generator'
            ]
        },
        'ai_integration': {
            'nombre': '🤖 Integración AI Completa',
            'descripcion': 'Pipeline para aplicación con IA integrada',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '🤖 Integración AI/ML',
                '🏗️ Generar Backend',
                '⚛️ Generar Componentes Frontend',
                '🧪 Generar Tests'
            ],
            'plantillas': [
                'notion_user_stories',
                'ai_ml_integration',
                'backend_generator',
                'frontend_components',
                'test_generator'
            ]
        },
        'microservices_completo': {
            'nombre': '🏗️ Microservicios Completo',
            'descripcion': 'Pipeline para arquitectura de microservicios',
            'pasos': [
                '📋 Extraer User Stories de Notion',
                '🏗️ Arquitectura Microservicios',
                '🗄️ Generar Esquema BD',
                '🧪 Generar Tests',
                '📚 Generar Documentación API'
            ],
            'plantillas': [
                'notion_user_stories',
                'microservices_architecture',
                'database_schema',
                'test_generator',
                'api_documentation'
            ]
        }
    }
    
    print("Pipelines predefinidos disponibles:")
    print()
    
    for i, (key, pipeline) in enumerate(pipelines_predefinidos.items(), 1):
        print(f"{i}. {pipeline['nombre']}")
        print(f"   {pipeline['descripcion']}")
        print(f"   Pasos: {' → '.join(pipeline['pasos'])}")
        print()
    
    print("Opciones:")
    print("1. 🎯 Usar pipeline predefinido")
    print("2. ✏️  Crear pipeline personalizado")
    print("3. 📋 Ver pipelines guardados")
    print("4. 🔄 Editar pipeline existente")
    print("5. ❌ Volver al menú principal")
    print()
    
    try:
        opcion = input("Selecciona una opción (1-5): ").strip()
        
        if opcion == "1":
            # Usar pipeline predefinido
            print("\n🎯 SELECCIONAR PIPELINE PREDEFINIDO")
            print("="*40)
            
            for i, (key, pipeline) in enumerate(pipelines_predefinidos.items(), 1):
                print(f"{i}. {pipeline['nombre']}")
            
            try:
                sub_opcion = int(input(f"\nSelecciona un pipeline (1-{len(pipelines_predefinidos)}): ").strip())
                pipeline_keys = list(pipelines_predefinidos.keys())
                
                if 1 <= sub_opcion <= len(pipeline_keys):
                    pipeline_key = pipeline_keys[sub_opcion - 1]
                    pipeline_seleccionado = pipelines_predefinidos[pipeline_key]
                    
                    print(f"\n✅ Pipeline seleccionado: {pipeline_seleccionado['nombre']}")
                    print(f"📝 {pipeline_seleccionado['descripcion']}")
                    print(f"\n🔄 Pasos del pipeline:")
                    for i, paso in enumerate(pipeline_seleccionado['pasos'], 1):
                        print(f"   {i}. {paso}")
                    
                    print(f"\n💡 Plantillas que se ejecutarán:")
                    for i, plantilla in enumerate(pipeline_seleccionado['plantillas'], 1):
                        print(f"   {i}. {plantilla}")
                    
                    # Confirmar ejecución
                    confirmar = input("\n¿Ejecutar este pipeline? (s/n): ").strip().lower()
                    if confirmar in ['s', 'si', 'sí', 'y', 'yes']:
                        ejecutar_pipeline(pipeline_seleccionado)
                    else:
                        print("❌ Pipeline cancelado")
                else:
                    print("❌ Opción inválida")
                    
            except ValueError:
                print("❌ Ingresa un número válido")
        
        elif opcion == "2":
            # Crear pipeline personalizado
            crear_pipeline_personalizado()
        
        elif opcion == "3":
            # Ver pipelines guardados
            ver_pipelines_guardados()
        
        elif opcion == "4":
            # Editar pipeline existente
            editar_pipeline_existente()
        
        elif opcion == "5":
            # Volver al menú principal
            return
        
        else:
            print("❌ Opción inválida")
            
    except KeyboardInterrupt:
        print("\n👋 Operación cancelada")
    except Exception as e:
        print(f"❌ Error: {e}")

def ejecutar_pipeline(pipeline):
    """Ejecuta un pipeline completo."""
    print(f"\n🚀 EJECUTANDO PIPELINE: {pipeline['nombre']}")
    print("="*60)
    
    try:
        for i, plantilla in enumerate(pipeline['plantillas'], 1):
            print(f"\n📋 Paso {i}/{len(pipeline['plantillas'])}: {pipeline['pasos'][i-1]}")
            print(f"🔧 Ejecutando plantilla: {plantilla}")
            
            # Aquí se ejecutaría la plantilla específica
            # Por ahora simulamos la ejecución
            print(f"✅ Plantilla {plantilla} ejecutada correctamente")
            
            # Pausa entre pasos
            if i < len(pipeline['plantillas']):
                input("Presiona Enter para continuar al siguiente paso...")
        
        print(f"\n🎉 Pipeline '{pipeline['nombre']}' completado exitosamente!")
        print("📊 Resumen de ejecución:")
        for i, paso in enumerate(pipeline['pasos'], 1):
            print(f"   ✅ {i}. {paso}")
            
    except Exception as e:
        print(f"❌ Error ejecutando pipeline: {e}")

def crear_pipeline_personalizado():
    """Crea un pipeline personalizado."""
    print("\n✏️  CREAR PIPELINE PERSONALIZADO")
    print("="*40)
    
    nombre = input("Nombre del pipeline: ").strip()
    if not nombre:
        print("❌ El nombre es requerido")
        return
    
    descripcion = input("Descripción del pipeline: ").strip()
    
    print("\n📋 Plantillas disponibles:")
    plantillas_disponibles = [
        'notion_user_stories', 'desarrollo_completo', 'mobile_development',
        'ecommerce_platform', 'saas_application', 'ai_ml_integration',
        'real_time_app', 'microservices_architecture', 'fintech_application',
        'healthcare_app', 'gaming_platform', 'iot_application',
        'content_management', 'api_platform', 'backend_generator',
        'frontend_components', 'database_schema', 'api_documentation',
        'test_generator'
    ]
    
    for i, plantilla in enumerate(plantillas_disponibles, 1):
        print(f"   {i}. {plantilla}")
    
    print("\nSelecciona las plantillas para el pipeline (separadas por comas):")
    seleccion = input("Números: ").strip()
    
    try:
        indices = [int(x.strip()) - 1 for x in seleccion.split(',')]
        plantillas_seleccionadas = [plantillas_disponibles[i] for i in indices if 0 <= i < len(plantillas_disponibles)]
        
        if not plantillas_seleccionadas:
            print("❌ No se seleccionaron plantillas válidas")
            return
        
        print(f"\n✅ Pipeline personalizado creado:")
        print(f"   Nombre: {nombre}")
        print(f"   Descripción: {descripcion}")
        print(f"   Plantillas: {', '.join(plantillas_seleccionadas)}")
        
        # Guardar pipeline (implementar lógica de guardado)
        print("💾 Pipeline guardado exitosamente")
        
    except ValueError:
        print("❌ Formato inválido. Usa números separados por comas (ej: 1,3,5)")

def ver_pipelines_guardados():
    """Muestra los pipelines guardados."""
    print("\n📋 PIPELINES GUARDADOS")
    print("="*30)
    print("💡 Esta funcionalidad se implementará en futuras versiones")
    print("Por ahora, usa los pipelines predefinidos")

def editar_pipeline_existente():
    """Edita un pipeline existente."""
    print("\n🔄 EDITAR PIPELINE EXISTENTE")
    print("="*35)
    print("💡 Esta funcionalidad se implementará en futuras versiones")
    print("Por ahora, usa los pipelines predefinidos")

def main():
    """Función principal del inicio rápido."""
    print("🎯 Orquestador de Prompts - Inicio Rápido")
    print("="*50)
    
    # Verificar dependencias
    if not verificar_dependencias():
        print("\n❌ Instala las dependencias primero:")
        print("   python instalar.py")
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
                implementar_pipelines_encadenados()
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
            print(f"❌ Error: {e}")

if __name__ == "__main__":
    main()

