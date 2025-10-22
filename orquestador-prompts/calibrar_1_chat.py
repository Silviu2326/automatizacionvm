#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calibrador simplificado para 1 chat del Orquestador de Prompts.
"""

import pyautogui
import cv2
import numpy as np
import configparser
import os
from datetime import datetime
from typing import Tuple, Optional

class Calibrador1Chat:
    """Calibrador simplificado para 1 chat."""
    
    def __init__(self):
        self.coordenadas = {}
        self.config_path = "config.ini"
        
        # Configurar pyautogui
        pyautogui.FAILSAFE = True
        
        print("🎯 Calibrador de 1 Chat - Orquestador de Prompts")
        print("=" * 60)
    
    def _mouse_callback(self, event, x, y, flags, param):
        """Callback para capturar clicks del mouse."""
        if event == cv2.EVENT_LBUTTONDOWN:
            self.coordenadas['chat_1'] = (x, y)
            print(f"   📍 Coordenada capturada: ({x}, {y})")
            print(f"   💡 Ahora presiona 's' para guardar o 'q' para cancelar")
            
            # Dibujar punto
            cv2.circle(self.screenshot, (x, y), 5, (0, 255, 0), -1)
            cv2.imshow('Calibrador - 1 Chat', self.screenshot)
    
    def _capturar_coordenada(self) -> Optional[Tuple[int, int]]:
        """Captura la coordenada del chat único."""
        print(f"\n🖱️  Chat único - Haz clic en el input del chat")
        print("   Haz clic en la posición deseada")
        print("   Presiona 's' para guardar, 'q' para cancelar")
        
        # Capturar pantalla
        screenshot = pyautogui.screenshot()
        self.screenshot = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
        
        # Crear ventana
        cv2.namedWindow('Calibrador - 1 Chat', cv2.WINDOW_NORMAL)
        cv2.setMouseCallback('Calibrador - 1 Chat', self._mouse_callback)
        cv2.imshow('Calibrador - 1 Chat', self.screenshot)
        
        while True:
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord('s'):
                if 'chat_1' in self.coordenadas:
                    # Guardar coordenada
                    coord = self.coordenadas['chat_1']
                    print(f"   ✅ Coordenada guardada: {coord}")
                    break
                else:
                    print("   ⚠️  Primero haz clic en el input del chat")
            elif key == ord('q'):
                # Cancelar
                print(f"   ❌ Calibración cancelada")
                return None
        
        cv2.destroyAllWindows()
        return self.coordenadas.get('chat_1')
    
    def _generar_config(self):
        """Genera la configuración actualizada."""
        print("\n📝 Generando configuración...")
        
        # Leer config existente
        config = configparser.ConfigParser()
        if os.path.exists(self.config_path):
            config.read(self.config_path, encoding='utf-8')
        
        # Asegurar secciones
        if not config.has_section('GENERAL'):
            config.add_section('GENERAL')
        if not config.has_section('COORDENADAS'):
            config.add_section('COORDENADAS')
        
        # Configurar 1 chat
        config.set('GENERAL', 'cantidad_chats', '1')
        
        # Guardar coordenadas
        if 'chat_1' in self.coordenadas:
            coord = self.coordenadas['chat_1']
            config.set('COORDENADAS', 'chat_1_x', str(coord[0]))
            config.set('COORDENADAS', 'chat_1_y', str(coord[1]))
        
        # Crear backup
        if os.path.exists(self.config_path):
            backup_path = f"config_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.ini"
            with open(backup_path, 'w', encoding='utf-8') as f:
                config.write(f)
            print(f"   💾 Backup guardado en: {backup_path}")
        
        # Guardar nuevo config
        with open(self.config_path, 'w', encoding='utf-8') as f:
            config.write(f)
        
        print(f"   ✅ Configuración guardada en: {self.config_path}")
    
    def _mostrar_resumen(self):
        """Muestra un resumen de la calibración."""
        print("\n" + "="*60)
        print("📋 RESUMEN DE CALIBRACIÓN - 1 CHAT")
        print("="*60)
        
        print("\n📍 Coordenada capturada:")
        if 'chat_1' in self.coordenadas:
            coord = self.coordenadas['chat_1']
            print(f"   Chat 1: {coord}")
        
        print("\n✅ Calibración completada!")
        print("💡 Ahora puedes ejecutar el orquestador automático")
    
    def ejecutar_calibracion(self):
        """Ejecuta el proceso de calibración para 1 chat."""
        try:
            print("\n🎯 CALIBRACIÓN PARA 1 CHAT")
            print("   Configuraremos las coordenadas del chat único")
            
            # Capturar coordenada del chat
            coord = self._capturar_coordenada()
            
            if not coord:
                print("❌ Calibración cancelada")
                return
            
            # Generar configuración
            self._generar_config()
            
            # Mostrar resumen
            self._mostrar_resumen()
            
        except KeyboardInterrupt:
            print("\n❌ Calibración cancelada por el usuario")
        except Exception as e:
            print(f"\n❌ Error durante la calibración: {e}")
        finally:
            cv2.destroyAllWindows()


def main():
    """Función principal del calibrador."""
    calibrador = Calibrador1Chat()
    calibrador.ejecutar_calibracion()


if __name__ == "__main__":
    main()
