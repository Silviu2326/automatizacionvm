#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Orquestador específico para 1 chat de Notion.
Envía prompts a un solo chat configurado para Notion.
"""

import pyautogui
import time
import json
import configparser
import os
from datetime import datetime

def cargar_configuracion():
    """Carga la configuración del sistema."""
    config = configparser.ConfigParser()
    config.read('config.ini', encoding='utf-8')
    return config

def cargar_placeholders():
    """Carga los placeholders desde notion_placeholders.json."""
    try:
        with open('notion_placeholders.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print("❌ No se encontró notion_placeholders.json")
        return None
    except json.JSONDecodeError:
        print("❌ Error leyendo notion_placeholders.json")
        return None

def cargar_prompts_notion():
    """Carga los prompts desde el archivo de Notion."""
    try:
        with open('prompts_notion_creator.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('prompts', [])
    except FileNotFoundError:
        print("❌ No se encontró prompts_notion_creator.json")
        return []
    except json.JSONDecodeError:
        print("❌ Error leyendo prompts_notion_creator.json")
        return []

def reemplazar_placeholders(prompt_text, placeholders):
    """Reemplaza los placeholders en el prompt."""
    texto_final = prompt_text
    
    # Reemplazar placeholders específicos
    if 'paginaacrear' in placeholders:
        texto_final = texto_final.replace('(paginaacrear)', placeholders['paginaacrear'])
    
    if 'paginaprincipal' in placeholders:
        texto_final = texto_final.replace('(paginaprincipal)', placeholders['paginaprincipal'])
    
    if 'detalles' in placeholders:
        texto_final = texto_final.replace('(detalles)', placeholders['detalles'])
    
    return texto_final

def enviar_prompt_a_chat(prompt_text, coordenadas):
    """Envía el prompt al chat configurado."""
    try:
        # Hacer clic en el chat
        pyautogui.click(coordenadas[0], coordenadas[1])
        time.sleep(0.5)
        
        # Limpiar el input
        pyautogui.hotkey('ctrl', 'a')
        time.sleep(0.2)
        pyautogui.press('delete')
        time.sleep(0.2)
        
        # Escribir el prompt
        pyautogui.write(prompt_text)
        time.sleep(0.5)
        
        # Enviar con Enter
        pyautogui.press('enter')
        
        print(f"✅ Prompt enviado al chat: {prompt_text[:50]}...")
        return True
        
    except Exception as e:
        print(f"❌ Error enviando prompt: {e}")
        return False

def ejecutar_orquestador_1_chat():
    """Ejecuta el orquestador para 1 chat de Notion."""
    print("🚀 Orquestador 1 Chat - Notion")
    print("="*50)
    
    # Cargar configuración
    config = cargar_configuracion()
    if not config:
        return
    
    # Verificar configuración de 1 chat
    cantidad_chats = config.getint('GENERAL', 'cantidad_chats', fallback=0)
    if cantidad_chats != 1:
        print("❌ El sistema no está configurado para 1 chat")
        print("💡 Usa la opción 5 para configurar 1 chat")
        return
    
    # Cargar coordenadas del chat
    chat_x = config.getint('COORDENADAS', 'chat_1_x', fallback=0)
    chat_y = config.getint('COORDENADAS', 'chat_1_y', fallback=0)
    
    if chat_x == 0 or chat_y == 0:
        print("❌ No se encontraron coordenadas del chat")
        print("💡 Usa la opción 1 para calibrar el chat")
        return
    
    print(f"📍 Coordenadas del chat: ({chat_x}, {chat_y})")
    
    # Cargar placeholders
    placeholders = cargar_placeholders()
    if not placeholders:
        return
    
    print(f"📄 Página a crear: {placeholders.get('paginaacrear', 'No especificada')}")
    print(f"🔗 Página principal: {placeholders.get('paginaprincipal', 'No especificada')}")
    
    # Cargar prompts de Notion
    prompts = cargar_prompts_notion()
    if not prompts:
        print("❌ No se encontraron prompts de Notion")
        return
    
    print(f"📝 Prompts disponibles: {len(prompts)}")
    
    # Procesar cada prompt
    for i, prompt_data in enumerate(prompts, 1):
        prompt_text = prompt_data.get('prompt', '')
        prompt_nombre = prompt_data.get('nombre', f'Prompt {i}')
        
        print(f"\n📤 Procesando prompt {i}/{len(prompts)}: {prompt_nombre}")
        
        # Reemplazar placeholders
        prompt_final = reemplazar_placeholders(prompt_text, placeholders)
        
        print(f"📝 Prompt final: {prompt_final[:100]}...")
        
        # Enviar al chat
        if enviar_prompt_a_chat(prompt_final, (chat_x, chat_y)):
            print(f"✅ Prompt {i} enviado exitosamente")
        else:
            print(f"❌ Error enviando prompt {i}")
            break
        
        # Esperar entre prompts (excepto el último)
        if i < len(prompts):
            tiempo_espera = config.getint('GENERAL', 'tiempo_espera_segundos', fallback=30)
            print(f"⏳ Esperando {tiempo_espera} segundos antes del siguiente prompt...")
            time.sleep(tiempo_espera)
    
    print(f"\n🎉 ¡Orquestador completado!")
    print(f"📊 Prompts procesados: {len(prompts)}")
    print("💡 Revisa tu Notion para ver la página creada")

if __name__ == "__main__":
    ejecutar_orquestador_1_chat()






