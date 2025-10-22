import json
from pathlib import Path

base = Path(__file__).parent
file_a = base / 'ejemplos_paginas_notion_dental_11_15.json'
file_b = base / 'ejemplos_paginas_notion_dental_16_21.json'
out    = base / 'ejemplos_paginas_notion_dental_11_21.json'

with open(file_a, 'r', encoding='utf-8') as fa:
    a = json.load(fa)
with open(file_b, 'r', encoding='utf-8') as fb:
    b = json.load(fb)

items = []
for src in (a.get('ejemplos', []), b.get('ejemplos', [])):
    for it in src:
        items.append({
            'paginaacrear': it['paginaacrear'],
            'paginaprincipal': it['paginaprincipal'],
            'detalles': it['detalles'],
        })

for idx, it in enumerate(items, start=1):
    it['id'] = idx

categorias = []
for lst in (a.get('configuracion', {}).get('categorias', []), b.get('configuracion', {}).get('categorias', [])):
    for c in lst:
        if c not in categorias:
            categorias.append(c)

out_json = {
    'ejemplos': items,
    'configuracion': {
        'total_ejemplos': len(items),
        'categorias': categorias,
        'uso': 'Subpáginas ERP Dental (IDs 11-21) - Unificación de 11_15 y 16_21 para implementación MERN',
    }
}

with open(out, 'w', encoding='utf-8') as fo:
    json.dump(out_json, fo, ensure_ascii=False, indent=2)

print(f'Escrito {out} con {len(items)} ejemplos y {len(categorias)} categorías')





