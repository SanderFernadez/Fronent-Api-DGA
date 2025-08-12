# 🚀 DGA - Panel Administrativo Frontend

## 📋 Descripción del Proyecto

Panel administrativo desarrollado en **Vue.js 3** con **TypeScript** para la gestión de productos y ventas. Esta aplicación consume la API REST desarrollada en .NET 8 y proporciona una interfaz moderna y responsiva para administrar clientes, productos y ventas.

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Vue.js 3** - Framework progresivo de JavaScript
- **TypeScript** - Tipado estático para JavaScript
- **Vue Router** - Enrutamiento oficial de Vue.js
- **Axios** - Cliente HTTP para consumir APIs
- **Vite** - Build tool moderno y rápido
- **CSS3** - Estilos personalizados con diseño responsivo

### Características
- ✅ **Composition API** - API de composición de Vue 3
- ✅ **Diseño Responsivo** - Compatible con móviles y escritorio
- ✅ **Validaciones en Tiempo Real** - Formularios con validación visual
- ✅ **Interfaz Moderna** - UI limpia y profesional
- ✅ **Manejo de Errores** - Gestión robusta de errores de API
- ✅ **TypeScript** - Tipado estático para mejor desarrollo

## 🏗️ Arquitectura del Proyecto

```
src/
├── services/           # Servicios para consumir la API
│   ├── api.ts         # Configuración de Axios
│   ├── clientService.ts    # Servicios de clientes
│   ├── productService.ts   # Servicios de productos
│   └── saleService.ts      # Servicios de ventas
├── views/             # Componentes de vista principales
│   ├── Dashboard.vue  # Panel principal con estadísticas
│   ├── Clients.vue    # Gestión de clientes
│   ├── Products.vue   # Gestión de productos
│   └── Sales.vue      # Gestión de ventas
├── router/            # Configuración de rutas
│   └── index.ts       # Definición de rutas
├── App.vue            # Componente principal
└── main.ts            # Punto de entrada
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Node.js** (versión 16 o superior)
- **npm** o **yarn**
- **API Backend** ejecutándose en `https://localhost:7067`

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd apifrontend-dga
   ```

2. **Instalar dependencias**
   ```bash
npm install
```

3. **Configurar la API**
   - Asegúrate de que la API backend esté ejecutándose en `https://localhost:7067`
   - Si la URL de la API es diferente, modifica `src/services/api.ts`

4. **Ejecutar en modo desarrollo**
   ```bash
npm run dev
```

5. **Abrir en el navegador**
   - La aplicación estará disponible en `http://localhost:5173`

## 📱 Funcionalidades

### 🏠 Dashboard
- **Estadísticas Generales**: Resumen de clientes, productos, ventas y productos con bajo stock
- **Acciones Rápidas**: Enlaces directos a las principales funciones
- **Estado del Sistema**: Verificación de conectividad con la API
- **Últimas Ventas**: Lista de las ventas más recientes
- **Productos con Bajo Stock**: Alertas de productos que necesitan reposición

### 👥 Gestión de Clientes
- **Lista de Clientes**: Vista tabular con información completa
- **Crear Cliente**: Formulario para registrar nuevos clientes
- **Editar Cliente**: Modificar información de clientes existentes
- **Eliminar Cliente**: Eliminación segura con confirmación
- **Búsqueda**: Filtrado por nombre de cliente
- **Validaciones**: Verificación de email y campos obligatorios

### 📦 Gestión de Productos
- **Lista de Productos**: Vista con información detallada y estado de stock
- **Crear Producto**: Formulario completo para nuevos productos
- **Editar Producto**: Modificación de información de productos
- **Eliminar Producto**: Eliminación con confirmación
- **Búsqueda**: Filtrado por nombre de producto
- **Filtro de Bajo Stock**: Vista especializada para productos con stock crítico
- **Indicadores Visuales**: Estados de stock con colores diferenciados

### 💰 Gestión de Ventas
- **Historial de Ventas**: Lista completa de todas las ventas
- **Nueva Venta**: Formulario avanzado para registrar ventas
- **Selección de Cliente**: Dropdown con clientes disponibles
- **Agregar Productos**: Selección múltiple de productos con cantidades
- **Cálculo Automático**: Total calculado automáticamente
- **Filtros por Fecha**: Búsqueda de ventas por rango de fechas
- **Detalles de Venta**: Vista detallada de cada venta
- **Eliminar Venta**: Eliminación con confirmación

## 🔧 Configuración de la API

### URL de la API
La aplicación está configurada para consumir la API en:
```
https://localhost:7067/api
```

### Endpoints Utilizados
- **Clientes**: `/clients`
- **Productos**: `/products`
- **Ventas**: `/sales`
- **Health Check**: `/health`

### Estructura de Respuestas
La aplicación espera respuestas en el formato:
```json
{
  "success": true,
  "data": {},
  "message": "Mensaje descriptivo",
  "errors": [],
  "statusCode": 200,
  "timestamp": "2025-08-12T18:21:10.8326138Z"
}
```

## 🎨 Diseño y UX

### Características de Diseño
- **Diseño Responsivo**: Adaptable a dispositivos móviles y escritorio
- **Navegación Intuitiva**: Menú lateral y breadcrumbs
- **Formularios Validados**: Validación en tiempo real con feedback visual
- **Modales Interactivos**: Formularios en ventanas modales
- **Tablas Ordenables**: Información organizada en tablas
- **Indicadores Visuales**: Estados con colores diferenciados

### Paleta de Colores
- **Primario**: Azul (#3b82f6)
- **Secundario**: Gris (#6b7280)
- **Éxito**: Verde (#10b981)
- **Peligro**: Rojo (#ef4444)
- **Advertencia**: Naranja (#f59e0b)

## 📊 Validaciones

### Clientes
- **Nombre**: Obligatorio
- **Email**: Formato válido y obligatorio
- **Teléfono**: Obligatorio

### Productos
- **Nombre**: Obligatorio
- **Descripción**: Obligatoria
- **Precio**: Mayor a 0
- **Stock**: No negativo

### Ventas
- **Cliente**: Obligatorio
- **Fecha**: Obligatoria
- **Productos**: Al menos uno
- **Cantidades**: Mayor a 0

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Construye para producción
npm run preview      # Previsualiza la build de producción

# Linting
npm run lint         # Ejecuta el linter
npm run lint:fix     # Corrige errores de linting automáticamente
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de CORS**
   - Verifica que la API esté configurada para permitir peticiones desde `http://localhost:5173`
   - Asegúrate de que la API esté ejecutándose

2. **Error de Conexión**
   - Verifica que la URL de la API sea correcta en `src/services/api.ts`
   - Comprueba que el puerto 7067 esté disponible

3. **Errores de TypeScript**
   - Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
   - Verifica que estés usando Node.js 16 o superior

## 📝 Notas de Desarrollo

### Convenciones de Código
- **Comentarios en Español**: Todos los comentarios están en español
- **Nombres Descriptivos**: Variables y funciones con nombres claros
- **Separación de Responsabilidades**: Código organizado en servicios y componentes
- **TypeScript**: Uso de tipos para mejor mantenibilidad

### Mejores Prácticas
- **Composition API**: Uso de la API de composición de Vue 3
- **Reactive State**: Estado reactivo con `ref()` y `computed()`
- **Error Handling**: Manejo robusto de errores en todas las operaciones
- **Loading States**: Indicadores de carga para mejor UX

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como parte del proyecto DGA - Sistema de Gestión de Productos y Ventas.

---

**¡Listo para usar! 🎉**
