Debes crear el módulo {{modulo}} a partir del documento Markdown @{{archivo_md}}
Estructura de carpetas (crear si no existen):

src/features/{{modulo}}/
    components/
    pages/
            {{modulo}}Page.tsx

    api/


Integración en la app (obligatoria):

Edita @src/App.tsx para registrar ruta al módulo
edita el @src/components/Sidebar.tsx para registrarlo 