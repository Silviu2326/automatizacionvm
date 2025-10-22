#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calibrador ultra-simplificado para 1 chat del Orquestador de Prompts.
"""

import pyautogui
import cv2
import numpy as np
import configparser
import os
from datetime import datetime

def calibrar_1_chat():
    """Calibrador ultra-simplificado para 1 chat."""
    print("🎯 Calibrador Ultra-Simplificado - 1 Chat")
    print("=" * 50)
    
    try:
        # Capturar pantalla
        print("\n📸 Capturando pantalla...")
        screenshot = pyautogui.screenshot()
        img = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
        
        # Mostrar imagen
        cv2.namedWindow('Calibrador - Haz clic en el input del chat', cv2.WINDOW_NORMAL)
        cv2.imshow('Calibrador - Haz clic en el input del chat', img)
        
        print("\n🖱️  INSTRUCCIONES:")
        print("   1. Haz clic en el input del chat de Cursor")
        print("   2. Presiona CUALQUIER tecla para continuar")
        print("   3. Presiona 'q' para cancelar")
        
        # Esperar tecla
        key = cv2.waitKey(0) & 0xFF
        
        if key == ord('q'):
            print("❌ Calibración cancelada")
            cv2.destroyAllWindows()
            return None
        
        # Obtener coordenada del mouse
        print("\n📍 Obteniendo coordenada del mouse...")
        x, y = pyautogui.position()
        print(f"   📍 Coordenada: ({x}, {y})")
        
        # Guardar configuración
        print("\n💾 Guardando configuración...")
        config = configparser.ConfigParser()
        
        # Leer config existente
        if os.path.exists("config.ini"):
            config.read("config.ini", encoding='utf-8')
        
        # Asegurar secciones
        if not config.has_section('GENERAL'):
            config.add_section('GENERAL')
        if not config.has_section('COORDENADAS'):
            config.add_section('COORDENADAS')
        
        # Configurar 1 chat
        config.set('GENERAL', 'cantidad_chats', '1')
        config.set('COORDENADAS', 'chat_1_x', str(x))
        config.set('COORDENADAS', 'chat_1_y', str(y))
        
        # Crear backup
        if os.path.exists("config.ini"):
            backup_path = f"config_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.ini"
            with open(backup_path, 'w', encoding='utf-8') as f:
                config.write(f)
            print(f"   💾 Backup guardado en: {backup_path}")
        
        # Guardar nuevo config
        with open("config.ini", 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"   ✅ Configuración guardada en: config.ini")
        
        # Mostrar resumen
        print("\n" + "="*50)
        print("📋 RESUMEN DE CALIBRACIÓN")
        print("="*50)
        print(f"📍 Coordenada: ({x}, {y})")
        print("✅ Calibración completada!")
        print("💡 Ahora puedes ejecutar el orquestador automático")
        
        cv2.destroyAllWindows()
        return (x, y)
        
    except KeyboardInterrupt:
        print("\n❌ Calibración cancelada por el usuario")
        cv2.destroyAllWindows()
        return None
    except Exception as e:
        print(f"\n❌ Error durante la calibración: {e}")
        cv2.destroyAllWindows()
        return None


if __name__ == "__main__":
    calibrar_1_chat()






