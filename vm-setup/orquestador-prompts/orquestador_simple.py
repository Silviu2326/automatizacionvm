#!/usr/bin/env python3
"""
Orquestador de Prompts - Versión Simple
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
import pyperclip

# Configuración de PyAutoGUI
pyautogui.FAILSAFE = True
pyautogui.PAUSE = 0.5

class OrquestadorPrompts:
    def __init__(self):
        self.config_path = "config.ini"
        self.config = None
        self.cursor_config = None
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
    
    def detect_image_on_screen(self, image_path, tolerance=0.8):
        """Detectar imagen en pantalla usando OpenCV"""
        try:
            print(f"Buscando imagen: {image_path}")
            
            # Cargar imagen de referencia
            if not os.path.exists(image_path):
                print(f"Imagen no encontrada: {image_path}")
                return None
                
            template = cv2.imread(image_path)
            if template is None:
                print(f"No se pudo cargar la imagen: {image_path}")
                return None
                
            # Capturar pantalla
            screenshot = pyautogui.screenshot()
            screenshot_cv = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
            
            # Buscar la imagen
            result = cv2.matchTemplate(screenshot_cv, template, cv2.TM_CCOEFF_NORMED)
            min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(result)
            
            print(f"Coincidencia encontrada: {max_val:.2f} (tolerancia: {tolerance})")
            
            if max_val >= tolerance:
                # Calcular centro de la imagen detectada
                h, w = template.shape[:2]
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                
                print(f"Imagen detectada en: ({center_x}, {center_y})")
                return (center_x, center_y)
            else:
                print(f"Imagen no detectada (coincidencia: {max_val:.2f})")
                return None
                
        except Exception as e:
            print(f"Error en detección de imagen: {e}")
            return None
    
    def click_on_image(self, image_path, tolerance=0.8):
        """Hacer clic en una imagen detectada en pantalla"""
        try:
            # Buscar la imagen
            position = self.detect_image_on_screen(image_path, tolerance)
            
            if position:
                x, y = position
                print(f"Haciendo clic en: ({x}, {y})")
                pyautogui.click(x, y)
                return True
            else:
                print(f"No se pudo encontrar la imagen: {image_path}")
                return False
                
        except Exception as e:
            print(f"Error haciendo clic en imagen: {e}")
            return False
    
    def type_text(self, text, delay=0.1):
        """Escribir texto usando pyperclip"""
        try:
            print(f"Escribiendo: {text[:50]}...")
            # Usar pyperclip para copiar y pegar el texto completo
            pyperclip.copy(text)
            pyautogui.hotkey('ctrl', 'v')
            time.sleep(0.5)  # Esperar un poco para que se pegue
            pyautogui.press('enter')  # Presionar Enter para enviar
            print("Texto escrito y enviado exitosamente")
            return True
        except Exception as e:
            print(f"Error escribiendo texto: {e}")
            return False
    
    def execute_workflow_step(self, step_config):
        """Ejecutar un paso del workflow"""
        try:
            print(f"Configuración del paso: {step_config}")
            step_name = step_config.get('nombre', 'Paso desconocido')
            step_file = step_config.get('archivo', '')
            step_mode = step_config.get('modo', '')
            step_time = int(step_config.get('tiempo', 30))
            step_active = str(step_config.get('activo', 'true')).lower() == 'true'
            
            print(f"Ejecutando: {step_name}")
            print(f"Archivo: {step_file}")
            print(f"Modo: {step_mode}")
            print(f"Tiempo: {step_time}s")
            print(f"Activo: {step_active}")
            
            if not step_active:
                print(f"Paso {step_name} está desactivado, saltando...")
                return True
            
            # Cargar archivo JSON para determinar cuántos prompts hay
            if os.path.exists(step_file):
                with open(step_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"Datos cargados desde {step_file}")
                
                # Determinar número de prompts basado en el modo
                if step_mode == 'json_notion' and 'modulos' in data:
                    num_prompts = len(data['modulos'])
                    print(f"PROGRESO: Encontrados {num_prompts} prompts en {step_name}")
                else:
                    num_prompts = 1
                    print(f"PROGRESO: 1 prompt en {step_name}")
            else:
                print(f"Archivo JSON no encontrado: {step_file}")
                num_prompts = 1
            
            # Obtener configuración de Cursor
            if not self.cursor_config:
                print("No hay configuración de Cursor disponible")
                return False
            
            cursor_config = self.cursor_config.get('cursor_interface', {})
            image_path = cursor_config.get('imagen_deteccion', '')
            tolerance = cursor_config.get('tolerancia_imagen', 0.8)
            wait_detection = cursor_config.get('tiempo_espera_deteccion', 5)
            wait_click = cursor_config.get('tiempo_espera_click', 1)
            write_delay = cursor_config.get('tiempo_escritura', 0.1)
            
            # Obtener configuración de prompts
            prompt_config = self.cursor_config.get('configuracion_prompts', {})
            prefix = prompt_config.get('prefijo', '')
            suffix = prompt_config.get('sufijo', '')
            
            print(f"Buscando imagen: {image_path}")
            print(f"Esperando {wait_detection}s para detección...")
            time.sleep(wait_detection)
            
            # Buscar y hacer clic en la imagen
            if self.click_on_image(image_path, tolerance):
                print(f"Clic exitoso en imagen")
                time.sleep(wait_click)
                
                # Ejecutar cada prompt individual
                for i in range(num_prompts):
                    prompt_num = i + 1
                    print(f"PROGRESO: Ejecutando prompt {prompt_num}/{num_prompts} de {step_name}")
                    
                    # Generar prompt individual
                    prompt = self.generate_individual_prompt(step_mode, data, i, prefix, suffix)
                    
                    if prompt:
                        print(f"Escribiendo prompt {prompt_num}...")
                        self.type_text(prompt, write_delay)
                        
                        # Esperar el tiempo configurado
                        print(f"Esperando {step_time}s para prompt {prompt_num}...")
                        time.sleep(step_time)
                        
                        print(f"PROGRESO: Prompt {prompt_num}/{num_prompts} completado")
                    else:
                        print(f"No se pudo generar el prompt {prompt_num}")
                        return False
                
                print(f"Paso {step_name} completado exitosamente ({num_prompts} prompts)")
                return True
            else:
                print(f"No se pudo encontrar la imagen para {step_name}")
                return False
                
        except Exception as e:
            print(f"Error ejecutando paso {step_name}: {e}")
            return False
    
    def generate_individual_prompt(self, mode, data, prompt_index, prefix="", suffix=""):
        """Generar prompt individual basado en el modo y datos"""
        try:
            # Generar prompt según el modo para un elemento específico
            if mode == 'json_notion' and 'modulos' in data:
                # Para modo json_notion, tomar un módulo específico
                if prompt_index < len(data['modulos']):
                    modulo = data['modulos'][prompt_index]
                    prompt = f"{prefix}Procesa este módulo para Notion: {json.dumps(modulo, indent=2)}{suffix}"
                else:
                    return None
            elif mode == 'md_modulo' and 'modulos' in data:
                # Para modo md_modulo, tomar un módulo específico
                if prompt_index < len(data['modulos']):
                    modulo = data['modulos'][prompt_index]
                    prompt = f"{prefix}Convierte este MD a módulo: {json.dumps(modulo, indent=2)}{suffix}"
                else:
                    return None
            else:
                # Para otros modos, usar todos los datos
                prompt = f"{prefix}Procesa este archivo: {json.dumps(data, indent=2)}{suffix}"
            
            # Asegurar que el prompt sea un bloque completo
            prompt = prompt.replace('\n', ' ').replace('\r', ' ')
            print(f"Prompt {prompt_index + 1} generado: {prompt[:100]}...")
            
            return prompt
            
        except Exception as e:
            print(f"Error generando prompt individual: {e}")
            return None
    
    def run_workflow(self):
        """Ejecutar el workflow completo"""
        try:
            print("Iniciando Orquestador de Prompts v2.0")
            print("=" * 50)
            
            # Verificar configuración
            if not self.config:
                print("No hay configuración disponible")
                return False
            
            print(f"Tipo de self.config: {type(self.config)}")
            print(f"Secciones disponibles: {self.config.sections()}")
            
            # Obtener pasos de trabajo
            print("Obteniendo sección PASOS_TRABAJO...")
            try:
                # ConfigParser devuelve un diccionario de la sección
                pasos_trabajo = dict(self.config['PASOS_TRABAJO'])
                print(f"Pasos de trabajo encontrados: {pasos_trabajo}")
                print(f"Tipo de pasos_trabajo: {type(pasos_trabajo)}")
                
                print("Obteniendo numero_pasos...")
                num_pasos = int(pasos_trabajo.get('numero_pasos', 0))
                print(f"Número de pasos: {num_pasos}")
            except Exception as e:
                print(f"Error en sección PASOS_TRABAJO: {e}")
                print(f"Tipo de error: {type(e)}")
                raise
            
            if num_pasos == 0:
                print("No hay pasos de trabajo configurados")
                return False
            
            print(f"Ejecutando {num_pasos} pasos de trabajo...")
            
            # Ejecutar cada paso
            for i in range(1, num_pasos + 1):
                paso_key = f'paso_{i}'
                print(f"Procesando paso {i}, clave: {paso_key}")
                print(f"Valores encontrados:")
                print(f"  - nombre: {pasos_trabajo.get(f'{paso_key}_nombre', f'Paso {i}')}")
                print(f"  - archivo: {pasos_trabajo.get(f'{paso_key}_archivo', '')}")
                print(f"  - modo: {pasos_trabajo.get(f'{paso_key}_modo', '')}")
                print(f"  - tiempo: {pasos_trabajo.get(f'{paso_key}_tiempo', '30')}")
                print(f"  - activo: {pasos_trabajo.get(f'{paso_key}_activo', 'true')}")
                
                paso_config = {
                    'nombre': pasos_trabajo.get(f'{paso_key}_nombre', f'Paso {i}'),
                    'archivo': pasos_trabajo.get(f'{paso_key}_archivo', ''),
                    'modo': pasos_trabajo.get(f'{paso_key}_modo', ''),
                    'tiempo': pasos_trabajo.get(f'{paso_key}_tiempo', '30'),
                    'activo': pasos_trabajo.get(f'{paso_key}_activo', 'true')
                }
                
                success = self.execute_workflow_step(paso_config)
                if not success:
                    print(f"Error en paso {i}, continuando...")
            
            print("Workflow completado")
            return True
            
        except Exception as e:
            print(f"Error ejecutando workflow: {e}")
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
