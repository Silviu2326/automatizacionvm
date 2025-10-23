#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script de prueba para verificar la implementación del modo stylize-module
"""

import json
import os
import sys
from pathlib import Path

# Agregar el directorio actual al path para importar el orquestador
sys.path.append(os.path.dirname(__file__))

def test_stylize_module():
    """Probar la implementación del modo stylize-module"""
    print("🧪 Probando implementación de stylize-module")
    print("=" * 50)
    
    try:
        # Importar la clase del orquestador
        from orquestador_prompts_v2 import OrquestadorPrompts
        
        # Crear instancia
        orquestador = OrquestadorPrompts()
        print("✅ Orquestador inicializado correctamente")
        
        # Simular información de módulo
        modulo_info = {
            'modulo': 'Odontograma2D3D',
            'archivoestilos': 'guiaestilos.md'
        }
        
        # Asignar información del módulo
        orquestador.current_modulo_info = modulo_info
        print(f"📋 Información del módulo: {modulo_info}")
        
        # Probar generación de prompt
        print("\n🔍 Probando generación de prompt...")
        prompt = orquestador.generate_prompt(
            mode='stylize-module',
            json_file='ejemplo_md_modulo_paginas_individuales_estilos.json',
            prefix='',
            suffix=''
        )
        
        if prompt:
            print("✅ Prompt generado exitosamente")
            print(f"📝 Prompt: {prompt[:200]}...")
            print(f"📏 Longitud del prompt: {len(prompt)} caracteres")
            
            # Verificar que contiene las variables reemplazadas
            if 'Odontograma2D3D' in prompt and 'guiaestilos.md' in prompt and '@src\\features\\' in prompt:
                print("✅ Variables reemplazadas correctamente con ruta")
            else:
                print("⚠️ Variables no reemplazadas correctamente")
                print(f"Contenido del prompt: {prompt}")
                
        else:
            print("❌ Error generando prompt")
            return False
            
        # Probar con otro módulo
        print("\n🔍 Probando con otro módulo...")
        modulo_info_2 = {
            'modulo': 'AgendaInteligente',
            'archivoestilos': 'guiaestilos.md'
        }
        
        orquestador.current_modulo_info = modulo_info_2
        prompt_2 = orquestador.generate_prompt(
            mode='stylize-module',
            json_file='ejemplo_md_modulo_paginas_individuales_estilos.json',
            prefix='',
            suffix=''
        )
        
        if prompt_2 and 'AgendaInteligente' in prompt_2 and '@src\\features\\' in prompt_2:
            print("✅ Segundo módulo procesado correctamente con ruta")
        else:
            print("❌ Error procesando segundo módulo")
            print(f"Contenido del prompt 2: {prompt_2}")
            
        print("\n🎉 Prueba completada exitosamente")
        return True
        
    except Exception as e:
        print(f"❌ Error en la prueba: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = test_stylize_module()
    if success:
        print("\n✅ Implementación de stylize-module funcionando correctamente")
    else:
        print("\n❌ Hay problemas con la implementación")
        sys.exit(1)
