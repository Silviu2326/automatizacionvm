# Guía de Estilos del Sistema Dental

## 🎨 Paleta de Colores

### Colores Primarios
- **Azul Médico**: `#2563eb` - Para elementos principales y navegación
- **Verde Salud**: `#059669` - Para acciones positivas y confirmaciones
- **Rojo Alerta**: `#dc2626` - Para alertas y errores críticos
- **Amarillo Precaución**: `#d97706` - Para advertencias

### Colores Secundarios
- **Gris Claro**: `#f8fafc` - Fondos de secciones
- **Gris Medio**: `#64748b` - Texto secundario
- **Gris Oscuro**: `#1e293b` - Texto principal

## 📝 Tipografía

### Fuentes
- **Principal**: Inter, system-ui, sans-serif
- **Monospace**: 'Fira Code', 'Courier New', monospace

### Tamaños
- **H1**: 2.5rem (40px) - Títulos principales
- **H2**: 2rem (32px) - Subtítulos
- **H3**: 1.5rem (24px) - Encabezados de sección
- **Body**: 1rem (16px) - Texto normal
- **Small**: 0.875rem (14px) - Texto secundario

## 🧩 Componentes

### Botones
```css
.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}
```

### Cards
```css
.card {
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}
```

### Formularios
```css
.form-input {
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #2563eb;
  outline: none;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}
```

## 📱 Layout y Espaciado

### Grid System
- **Container**: max-width: 1200px
- **Gutters**: 1rem (16px)
- **Breakpoints**: sm: 640px, md: 768px, lg: 1024px, xl: 1280px

### Espaciado
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

## 🎯 Estados y Feedback

### Estados de Botones
- **Default**: Azul médico
- **Hover**: Azul más oscuro + elevación
- **Active**: Azul más oscuro + sin elevación
- **Disabled**: Gris + cursor not-allowed

### Estados de Formularios
- **Valid**: Borde verde + ícono de check
- **Invalid**: Borde rojo + ícono de error
- **Loading**: Spinner + texto "Procesando..."

## 🏥 Específico para Salud

### Colores Médicos
- **Éxito**: Verde salud (#059669)
- **Advertencia**: Amarillo precaución (#d97706)
- **Error**: Rojo alerta (#dc2626)
- **Info**: Azul médico (#2563eb)

### Iconografía
- Usar iconos de Heroicons o Lucide
- Tamaño estándar: 1.25rem (20px)
- Color: Gris medio (#64748b)

## 📊 Tablas y Datos

### Tablas
```css
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.table th {
  background: #f8fafc;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #1e293b;
}

.table td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}
```

## 🎨 Animaciones

### Transiciones
- **Fast**: 0.15s ease-in-out
- **Normal**: 0.2s ease-in-out
- **Slow**: 0.3s ease-in-out

### Hover Effects
- **Cards**: Elevación sutil + sombra
- **Buttons**: Cambio de color + elevación
- **Links**: Subrayado + cambio de color
