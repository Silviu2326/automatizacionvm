#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script para cambiar fácilmente entre ejemplos de páginas de Notion.
"""

import json
import os

def mostrar_ejemplos():
    """Muestra los ejemplos disponibles."""
    print("📝 EJEMPLOS DE PÁGINAS PARA NOTION")
    print("="*50)
    print()
    
    try:
        with open('ejemplos_paginas_notion.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        for ejemplo in data['ejemplos']:
            print(f"{ejemplo['id']}. {ejemplo['paginaacrear']}")
            print(f"   📄 Página: {ejemplo['paginaacrear']}")
            print(f"   🔗 Principal: {ejemplo['paginaprincipal']}")
            print(f"   📋 Detalles: {ejemplo['detalles'][:80]}...")
            print()
        
        return data['ejemplos']
        
    except FileNotFoundError:
        print("❌ No se encontró ejemplos_paginas_notion.json")
        return []
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

def aplicar_ejemplo(numero, ejemplos):
    """Aplica un ejemplo específico a notion_placeholders.json"""
    if 1 <= numero <= len(ejemplos):
        ejemplo = ejemplos[numero - 1]
        
        # Crear el objeto para notion_placeholders.json
        placeholders = {
            "paginaacrear": ejemplo['paginaacrear'],
            "paginaprincipal": ejemplo['paginaprincipal'],
            "detalles": ejemplo['detalles']
        }
        
        # Guardar en notion_placeholders.json
        with open('notion_placeholders.json', 'w', encoding='utf-8') as f:
            json.dump(placeholders, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Ejemplo {numero} aplicado:")
        print(f"   📄 Página: {ejemplo['paginaacrear']}")
        print(f"   🔗 Principal: {ejemplo['paginaprincipal']}")
        print(f"   📋 Detalles: {ejemplo['detalles']}")
        
        return True
    else:
        print("❌ Número de ejemplo inválido")
        return False

def main():
    """Función principal."""
    print("🔄 CAMBIAR EJEMPLO DE PÁGINA NOTION")
    print("="*40)
    print()
    
    ejemplos = mostrar_ejemplos()
    
    if not ejemplos:
        return
    
    try:
        numero = int(input(f"Selecciona un ejemplo (1-{len(ejemplos)}): "))
        
        if aplicar_ejemplo(numero, ejemplos):
            print("\n💡 Ahora puedes ejecutar el orquestador con este ejemplo")
            print("   python inicio_rapido.py")
        else:
            print("❌ No se pudo aplicar el ejemplo")
            
    except ValueError:
        print("❌ Ingresa un número válido")
    except KeyboardInterrupt:
        print("\n👋 Operación cancelada")

if __name__ == "__main__":
    main()






