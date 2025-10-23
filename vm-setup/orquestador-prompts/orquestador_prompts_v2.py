#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Orquestador de Prompts v2.0
Sistema automatizado para enviar prompts a Cursor usando detección de imagen
"""

import json
import time
import os
import sys
import configparser
from pathlib import Path
import pyautogui
import cv2
import numpy as np
from PIL import Image

# Configurar codificación para Windows
if sys.platform.startswith('win'):
    import codecs
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.detach())
    sys.stderr = codecs.getwriter('utf-8')(sys.stderr.detach())

# Configuración de PyAutoGUI
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.5

class OrquestadorPrompts:
    def __init__(self):
        self.config_path = "config.ini"
        self.config = None
        self.cursor_config = None
        self.status_file = "status.json"
        self.load_config()
        
    def load_config(self):
        """Cargar configuración desde config.ini"""
        try:
            self.config = configparser.ConfigParser()
            self.config.read(self.config_path, encoding='utf-8')
            print(f"Configuración cargada desde {self.config_path}")
            
            # Cargar configuración de Cursor
            cursor_config_path = "config_cursor.json"
            if os.path.exists(cursor_config_path):
                with open(cursor_config_path, 'r', encoding='utf-8') as f:
                    self.cursor_config = json.load(f)
                print(f"Configuración de Cursor cargada desde {cursor_config_path}")
            else:
                print(f"No se encontró {cursor_config_path}")
                
        except Exception as e:
            print(f"Error cargando configuración: {e}")
            sys.exit(1)
    
    def update_status(self, **kwargs):
        """Actualizar estado del orquestador"""
        try:
            status = {
                'isRunning': kwargs.get('isRunning', False),
                'currentStep': kwargs.get('currentStep', 0),
                'totalSteps': kwargs.get('totalSteps', 0),
                'currentModule': kwargs.get('currentModule', ''),
                'status': kwargs.get('status', 'idle'),
                'logs': kwargs.get('logs', []),
                'startTime': kwargs.get('startTime'),
                'estimatedTime': kwargs.get('estimatedTime', 0),
                'lastUpdate': time.time()
            }
            
            with open(self.status_file, 'w', encoding='utf-8') as f:
                json.dump(status, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            print(f"ERROR: Error actualizando estado: {e}")
    
    def add_log(self, message):
        """Agregar mensaje al log"""
        try:
            # Cargar estado actual
            if os.path.exists(self.status_file):
                with open(self.status_file, 'r', encoding='utf-8') as f:
                    status = json.load(f)
            else:
                status = {'logs': []}
            
            # Agregar nuevo log
            timestamp = time.strftime('%H:%M:%S')
            log_entry = f"[{timestamp}] {message}"
            status['logs'].append(log_entry)
            
            # Mantener solo los últimos 50 logs
            if len(status['logs']) > 50:
                status['logs'] = status['logs'][-50:]
            
            # Guardar estado actualizado
            with open(self.status_file, 'w', encoding='utf-8') as f:
                json.dump(status, f, indent=2, ensure_ascii=False)
                
        except Exception as e:
            print(f"ERROR: Error agregando log: {e}")
    
    def detect_image_on_screen(self, image_path, tolerance=0.8):
        """Detectar imagen en pantalla usando OpenCV"""
        try:
            print(f"🔍 Buscando imagen: {image_path}")
            
            # Cargar imagen de referencia
            if not os.path.exists(image_path):
                print(f"ERROR: Imagen no encontrada: {image_path}")
                return None
                
            template = cv2.imread(image_path)
            if template is None:
                print(f"ERROR: No se pudo cargar la imagen: {image_path}")
                return None
                
            # Capturar pantalla
            screenshot = pyautogui.screenshot()
            screenshot_cv = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
            
            # Buscar la imagen
            result = cv2.matchTemplate(screenshot_cv, template, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            
            print(f"📊 Coincidencia encontrada: {max_val:.2f} (tolerancia: {tolerance})")
            
            if max_val >= tolerance:
                # Calcular centro de la imagen detectada
                h, w = template.shape[:2]
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                
                print(f"✅ Imagen detectada en: ({center_x}, {center_y})")
                return (center_x, center_y)
            else:
                print(f"ERROR: Imagen no detectada (coincidencia: {max_val:.2f})")
                return None
                
        except Exception as e:
            print(f"ERROR: Error en detección de imagen: {e}")
            return None
    
    def click_on_image(self, image_path, tolerance=0.8):
        """Hacer clic en una imagen detectada en pantalla"""
        try:
            # Buscar la imagen
            position = self.detect_image_on_screen(image_path, tolerance)
            
            if position:
                x, y = position
                print(f"🖱️ Haciendo clic en: ({x}, {y})")
                pyautogui.click(x, y)
                return True
            else:
                print(f"ERROR: No se pudo encontrar la imagen: {image_path}")
                return False
                
        except Exception as e:
            print(f"ERROR: Error haciendo clic en imagen: {e}")
            return False
    
    def type_text(self, text, delay=0.1):
        """Escribir texto con delay entre caracteres"""
        try:
            print(f"⌨️ Escribiendo: {text[:50]}...")
            # Usar pyperclip para copiar y pegar el texto completo
            import pyperclip
            pyperclip.copy(text)
            pyautogui.hotkey('ctrl', 'v')
            print("✅ Texto escrito exitosamente")
            return True
        except Exception as e:
            print(f"ERROR: Error escribiendo texto: {e}")
            return False
    
    def execute_workflow_step(self, step_config):
        """Ejecutar un paso del workflow"""
        try:
            print(f"🔍 Configuración del paso: {step_config}")
            step_name = step_config.get('nombre', 'Paso desconocido')
            step_file = step_config.get('archivo', '')
            step_mode = step_config.get('modo', '')
            step_time = int(step_config.get('tiempo', 30))
            step_active = str(step_config.get('activo', 'true')).lower() == 'true'
            
            print(f"\n🚀 Ejecutando: {step_name}")
            print(f"📁 Archivo: {step_file}")
            print(f"🔄 Modo: {step_mode}")
            print(f"⏱️ Tiempo: {step_time}s")
            print(f"🟢 Activo: {step_active}")
            
            if not step_active:
                print(f"⏭️ Paso {step_name} está desactivado, saltando...")
                return True
            
            # Obtener configuración de Cursor
            if not self.cursor_config:
                print("ERROR: No hay configuración de Cursor disponible")
                return False
            
            cursor_config = self.cursor_config.get('cursor_interface', {})
            image_path = cursor_config.get('imagen_deteccion', '')
            tolerance = cursor_config.get('tolerancia_imagen', 0.8)
            wait_detection = cursor_config.get('tiempo_espera_deteccion', 5)
            wait_click = cursor_config.get('tiempo_espera_click', 1)
            write_delay = cursor_config.get('tiempo_escritura', 0.1)
            
            print(f"🔍 Buscando imagen: {image_path}")
            print(f"⏱️ Esperando {wait_detection}s para detección...")
            time.sleep(wait_detection)
            
            # Buscar y hacer clic en la imagen
            if self.click_on_image(image_path, tolerance):
                print(f"✅ Clic exitoso en imagen")
                time.sleep(wait_click)
                
                # Escribir el prompt
                prompt_config = self.cursor_config.get('configuracion_prompts', {})
                prefix = prompt_config.get('prefijo', '')
                suffix = prompt_config.get('sufijo', '')
                
                # Guardar información del módulo actual
                if 'modulo_info' in step_config:
                    self.current_modulo_info = step_config['modulo_info']
                
                # Generar prompt basado en el modo
                prompt = self.generate_prompt(step_mode, step_file, prefix, suffix)
                
                if prompt:
                    print(f"✍️ Escribiendo prompt...")
                    self.add_log(f"Escribiendo prompt para {step_name}")
                    self.type_text(prompt, write_delay)
                    
                    # Presionar Enter para enviar el prompt
                    print(f"📤 Enviando prompt (presionando Enter)...")
                    self.add_log(f"Enviando prompt (presionando Enter)")
                    pyautogui.press('enter')
                    time.sleep(1)  # Esperar un momento después de enviar
                    
                    # Esperar el tiempo configurado
                    print(f"⏱️ Esperando {step_time}s...")
                    self.add_log(f"Esperando {step_time}s para procesamiento...")
                    time.sleep(step_time)
                    
                    print(f"✅ Paso {step_name} completado exitosamente")
                    self.add_log(f"Paso {step_name} completado exitosamente")
                    return True
                else:
                    print(f"ERROR: No se pudo generar el prompt para {step_name}")
                    return False
            else:
                print(f"ERROR: No se pudo encontrar la imagen para {step_name}")
                return False
                
        except Exception as e:
            print(f"ERROR: Error ejecutando paso {step_name}: {e}")
            return False
    
    def generate_prompt(self, mode, json_file, prefix="", suffix=""):
        """Generar prompt basado en el modo y archivo JSON"""
        try:
            # Cargar archivo JSON si existe
            if os.path.exists(json_file):
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"📄 Datos cargados desde {json_file}")
            else:
                print(f"⚠️ Archivo JSON no encontrado: {json_file}")
                data = {}
            
            # Generar prompt según el modo - TODO EN UNA LÍNEA
            if mode == 'json_notion':
                prompt = f"{prefix}Procesa este JSON para Notion: {json.dumps(data, indent=2)}{suffix}"
            elif mode == 'md-to-module':
                # Cargar plantilla MD
                plantilla_path = os.path.join(os.path.dirname(__file__), 'plantilla.md')
                print(f"🔍 Buscando plantilla en: {plantilla_path}")
                if os.path.exists(plantilla_path):
                    with open(plantilla_path, 'r', encoding='utf-8') as f:
                        plantilla = f.read()
                    print(f"📄 Plantilla cargada: {len(plantilla)} caracteres")
                    
                    # Reemplazar variables en la plantilla
                    # Si hay información específica del módulo, usarla
                    if hasattr(self, 'current_modulo_info') and self.current_modulo_info:
                        modulo_info = self.current_modulo_info
                        plantilla = plantilla.replace('{{modulo}}', modulo_info.get('modulo', 'Modulo'))
                        plantilla = plantilla.replace('{{archivo_md}}', modulo_info.get('archivo_md', 'archivo.md'))
                        print(f"🔄 Variables reemplazadas: {modulo_info.get('modulo')} -> {modulo_info.get('archivo_md')}")
                    elif 'modulos' in data and len(data['modulos']) > 0:
                        modulo_info = data['modulos'][0]  # Usar el primer módulo
                        plantilla = plantilla.replace('{{modulo}}', modulo_info.get('modulo', 'Modulo'))
                        plantilla = plantilla.replace('{{archivo_md}}', modulo_info.get('archivo_md', 'archivo.md'))
                        print(f"🔄 Variables reemplazadas: {modulo_info.get('modulo')} -> {modulo_info.get('archivo_md')}")
                    
                    prompt = f"{prefix}{plantilla}{suffix}"
                    print(f"📝 Prompt generado con plantilla: {prompt[:100]}...")
                else:
                    print(f"⚠️ Plantilla no encontrada en: {plantilla_path}")
                    prompt = f"{prefix}Convierte este MD a módulo: {json.dumps(data, indent=2)}{suffix}"
            elif mode == 'stylize-module':
                # Cargar prompt específico para stylize-module
                prompt_file = os.path.join(os.path.dirname(__file__), 'prompts_stylize_module.json')
                print(f"🎨 Modo stylize-module detectado")
                print(f"🔍 Buscando prompt en: {prompt_file}")
                
                if os.path.exists(prompt_file):
                    with open(prompt_file, 'r', encoding='utf-8') as f:
                        prompt_config = json.load(f)
                    print(f"📄 Configuración de prompt cargada: {len(prompt_config)} elementos")
                    
                    # Obtener el prompt base
                    base_prompt = prompt_config.get('prompt', 'Aplica estilos al módulo')
                    print(f"📝 Prompt base: {base_prompt[:100]}...")
                    
                    # Reemplazar variables en el prompt
                    if hasattr(self, 'current_modulo_info') and self.current_modulo_info:
                        modulo_info = self.current_modulo_info
                        modulo_name = modulo_info.get('modulo', 'Modulo')
                        archivo_estilos = modulo_info.get('archivoestilos', 'guiaestilos.md')
                        
                        # Reemplazar variables en el prompt
                        styled_prompt = base_prompt.replace('{{modulo}}', modulo_name)
                        styled_prompt = styled_prompt.replace('{{archivoestilos}}', archivo_estilos)
                        
                        print(f"🔄 Variables reemplazadas: {modulo_name} -> {archivo_estilos}")
                        prompt = f"{prefix}{styled_prompt}{suffix}"
                        print(f"📝 Prompt stylize generado: {prompt[:100]}...")
                    else:
                        print(f"⚠️ No hay información de módulo disponible")
                        prompt = f"{prefix}{base_prompt}{suffix}"
                else:
                    print(f"⚠️ Archivo de prompt stylize no encontrado: {prompt_file}")
                    # Fallback: prompt genérico para stylize
                    if hasattr(self, 'current_modulo_info') and self.current_modulo_info:
                        modulo_info = self.current_modulo_info
                        modulo_name = modulo_info.get('modulo', 'Modulo')
                        archivo_estilos = modulo_info.get('archivoestilos', 'guiaestilos.md')
                        prompt = f"{prefix}Aplica la guía de estilos del archivo {archivo_estilos} al módulo @src\\features\\{modulo_name}. Revisa el archivo de estilos y aplica consistentemente el diseño, colores, tipografías y componentes UI especificados en la guía.{suffix}"
                    else:
                        prompt = f"{prefix}Aplica estilos consistentes al módulo basándote en la guía de estilos proporcionada.{suffix}"
            else:
                prompt = f"{prefix}Procesa este archivo: {json.dumps(data, indent=2)}{suffix}"
            
            # Asegurar que el prompt sea un bloque completo
            prompt = prompt.replace('\n', ' ').replace('\r', ' ')
            print(f"📝 Prompt generado (completo): {prompt[:100]}...")
            
            return prompt
            
        except Exception as e:
            print(f"ERROR: Error generando prompt: {e}")
            return None
    
    def run_workflow(self):
        """Ejecutar el workflow completo"""
        try:
            print("🚀 Iniciando Orquestador de Prompts v2.0")
            print("=" * 50)
            
            # Inicializar estado
            self.update_status(
                isRunning=True,
                status='running',
                startTime=time.time(),
                logs=[]
            )
            self.add_log("Orquestador iniciado")
            
            # Verificar configuración
            if not self.config:
                print("ERROR: No hay configuración disponible")
                return False
            
            print(f"🔍 Tipo de self.config: {type(self.config)}")
            print(f"🔍 Secciones disponibles: {self.config.sections()}")
            
            # Obtener pasos de trabajo
            print("🔍 Obteniendo sección PASOS_TRABAJO...")
            try:
                # ConfigParser devuelve un diccionario de la sección
                pasos_trabajo = dict(self.config['PASOS_TRABAJO'])
                print(f"📋 Pasos de trabajo encontrados: {pasos_trabajo}")
                print(f"📋 Tipo de pasos_trabajo: {type(pasos_trabajo)}")
                
                print("🔍 Obteniendo numero_pasos...")
                num_pasos = int(pasos_trabajo.get('numero_pasos', 0))
                print(f"📊 Número de pasos: {num_pasos}")
            except Exception as e:
                print(f"ERROR en sección PASOS_TRABAJO: {e}")
                print(f"Tipo de error: {type(e)}")
                raise
            
            if num_pasos == 0:
                print("ERROR: No hay pasos de trabajo configurados")
                return False
            
            print(f"📋 Ejecutando {num_pasos} pasos de trabajo...")
            
            # Obtener archivo JSON del primer paso
            archivo_json = pasos_trabajo.get('paso_1_archivo', '')
            if archivo_json and os.path.exists(archivo_json):
                print(f"📄 Cargando módulos desde: {archivo_json}")
                with open(archivo_json, 'r', encoding='utf-8') as f:
                    json_data = json.load(f)
                
                modulos = json_data.get('modulos', [])
                print(f"📋 Encontrados {len(modulos)} módulos para procesar")
                
                # Procesar cada módulo
                for i, modulo in enumerate(modulos, 1):
                    modulo_name = modulo.get('modulo', 'Sin nombre')
                    print(f"🔍 Procesando módulo {i}: {modulo_name}")
                    
                    # Calcular tiempo estimado
                    tiempo_por_modulo = int(pasos_trabajo.get('paso_1_tiempo', '30'))
                    tiempo_total = len(modulos) * tiempo_por_modulo
                    tiempo_transcurrido = (i - 1) * tiempo_por_modulo
                    tiempo_restante = tiempo_total - tiempo_transcurrido
                    
                    # Actualizar estado
                    self.update_status(
                        isRunning=True,
                        currentStep=i,
                        totalSteps=len(modulos),
                        currentModule=modulo_name,
                        status='running',
                        estimatedTime=tiempo_restante
                    )
                    self.add_log(f"Procesando módulo {i}: {modulo_name} (Tiempo restante: {tiempo_restante}s)")
                    
                    paso_config = {
                        'nombre': f"Módulo {i}: {modulo_name}",
                        'archivo': archivo_json,
                        'modo': pasos_trabajo.get('paso_1_modo', 'md-to-module'),
                        'tiempo': pasos_trabajo.get('paso_1_tiempo', '30'),
                        'activo': 'true',
                        'modulo_info': modulo  # Información específica del módulo
                    }
                    
                    success = self.execute_workflow_step(paso_config)
                    if not success:
                        print(f"ERROR en módulo {i}, continuando...")
                        self.add_log(f"ERROR en módulo {i}")
                    else:
                        self.add_log(f"Módulo {i} completado exitosamente")
                    
                    # Si no es el último módulo, crear nueva conversación
                    if i < len(modulos):
                        print(f"🔄 Creando nueva conversación para el siguiente módulo...")
                        self.add_log("Creando nueva conversación")
                        time.sleep(2)  # Esperar un momento
                        pyautogui.hotkey('ctrl', 'n')  # Crear nueva conversación
                        time.sleep(2)  # Esperar a que se abra la nueva conversación
            else:
                print("ERROR: No se encontró archivo JSON o no existe")
                return False
            
            print("✅ Workflow completado")
            self.add_log("Workflow completado exitosamente")
            self.update_status(
                isRunning=False,
                status='completed',
                currentStep=0,
                currentModule=''
            )
            return True
            
        except Exception as e:
            print(f"ERROR ejecutando workflow: {e}")
            self.add_log(f"ERROR ejecutando workflow: {e}")
            self.update_status(
                isRunning=False,
                status='error',
                currentStep=0,
                currentModule=''
            )
            return False

def main():
    """Función principal"""
    try:
        print("Iniciando Orquestador de Prompts v2.0")
        print("Directorio de trabajo:", os.getcwd())
        
        # Crear instancia del orquestador
        orquestador = OrquestadorPrompts()
        
        # Ejecutar workflow
        success = orquestador.run_workflow()
        
        if success:
            print("Orquestador completado exitosamente")
            sys.exit(0)
        else:
            print("Orquestador falló")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\nOrquestador interrumpido por el usuario")
        sys.exit(0)
    except Exception as e:
        print(f"Error fatal: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
