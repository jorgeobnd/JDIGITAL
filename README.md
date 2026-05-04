# JDIGITAL - Sistema de Gestión de Inventario

Sistema completo de gestión de inventario para PYMES de tecnología. Desarrollado con Next.js 16, React 19, TypeScript y Tailwind CSS.

## Características Principales

### Sprint 1: Autenticación y Seguridad
- ✅ **Login**: Formulario con validaciones en tiempo real
- ✅ **Recuperación de Contraseña**: Proceso de 2 pasos con validación de seguridad
- ✅ **Dashboard Principal**: KPIs con información del inventario
- ✅ **Sesión**: Sistema de sesión con sessionStorage

### Sprint 2: Gestión de Catálogo
- ✅ **Listado de Productos**: Tabla con paginación, búsqueda y filtros
- ✅ **Crear/Editar Productos**: Formulario con validaciones
- ✅ **Gestión de Categorías**: CRUD completo
- ✅ **Gestión de Proveedores**: CRUD completo
- ✅ **Indicadores Visuales**: Stock bajo resaltado en rojo

### Sprint 3: Movimientos e Inventario
- ✅ **Registro de Movimientos**: Forma dinámica según tipo (Entrada, Salida, Ajuste, Devolución)
- ✅ **Carrito de Compras**: Agregar múltiples productos antes de registrar
- ✅ **Historial de Movimientos**: Tabla filtrable por fecha y tipo
- ✅ **Kardex/Auditoría**: Consulta completa del historial de un producto
- ✅ **Control de Stock**: Validación de cantidad disponible

### Sprint 4: Reportes y Configuración
- ✅ **Dashboard de Reportes**: KPIs y gráficos (barras, pastel)
- ✅ **Top 5 Productos**: Tabla de productos más vendidos
- ✅ **Configuración de Empresa**: Datos, logo y preferencias
- ✅ **Exportación**: Estructura lista para PDF/Excel

## Tecnologías Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS 4.2
- **UI Components**: shadcn/ui
- **Gráficos**: Recharts
- **Iconos**: lucide-react
- **Formularios**: react-hook-form + zod

## Credenciales de Prueba

```
Admin:
Email: admin@jdigital.com
Contraseña: Admin123!

Vendedor:
Email: vendedor1@jdigital.com
Contraseña: Vendedor123!
```

## Estructura del Proyecto

```
app/
├── page.tsx                    # Redirección a login
├── login/
│   └── page.tsx               # Página de inicio de sesión
├── forgot-password/
│   └── page.tsx               # Recuperación de contraseña
└── dashboard/
    ├── page.tsx               # Dashboard principal
    ├── productos/
    │   └── page.tsx           # Gestión de productos
    ├── catalogo/
    │   └── page.tsx           # Categorías y proveedores
    ├── movimientos/
    │   └── page.tsx           # Registro y historial de movimientos
    ├── kardex/
    │   └── page.tsx           # Auditoría por producto
    ├── reportes/
    │   └── page.tsx           # Reportes y análisis
    └── configuracion/
        └── page.tsx           # Configuración de empresa

components/
├── Sidebar.tsx                # Navegación lateral
├── DashboardHeader.tsx        # Encabezado del dashboard
└── ui/                        # Componentes shadcn

lib/
└── mockData.ts               # Datos simulados para demostración
```

## Datos Mock Disponibles

### Usuarios
- Admin y 2 vendedores con roles diferenciados

### Productos (6 items)
- Laptops, celulares, accesorios y monitores
- Información completa: SKU, precios, stock, categoría

### Categorías (4)
- Laptops, Celulares, Accesorios, Monitores

### Proveedores (3)
- Intelice, Delsa, Bribus

### Movimientos (3 registros iniciales)
- Ejemplos de entradas y salidas

## Funcionalidades Implementadas

### Validaciones en Tiempo Real
- Formato de email
- Seguridad de contraseña con indicador
- Coincidencia de contraseñas
- Precio de venta > precio de compra
- Cantidad no supera stock disponible
- Motivo de ajuste mínimo 10 caracteres

### Filtros y Búsqueda
- Búsqueda por nombre o SKU
- Filtros por categoría y estado
- Filtros por rango de fechas
- Paginación de 10 items

### Gráficos
- Gráfico de barras: Ventas y compras últimos 6 meses
- Gráfico de pastel: Distribución por categoría
- Tablas dinámicas con datos calculados

### Interfaz Responsiva
- Diseño mobile-first
- Sidebar colapsable en móvil
- Tablas con scroll horizontal

## Instalación y Uso

### Clonar o descargar el proyecto:
```bash
git clone <tu-repo>
cd jdigital
```

### Instalar dependencias:
```bash
pnpm install
```

### Ejecutar en desarrollo:
```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Compilar para producción:
```bash
pnpm build
pnpm start
```

## Flujo de Uso Típico

1. **Login**: Inicia sesión con las credenciales de prueba
2. **Dashboard**: Visualiza KPIs y alertas de stock bajo
3. **Productos**: Consulta, crea o edita el catálogo
4. **Movimientos**: Registra entradas, salidas y ajustes
5. **Kardex**: Audita el historial de cualquier producto
6. **Reportes**: Analiza ventas y distribución del inventario
7. **Configuración**: Personaliza datos de tu empresa

## Notas Importantes

- Los datos se almacenan en memoria (sessionStorage/state)
- Para producción, conectar a base de datos real (Supabase, PostgreSQL, etc.)
- Las funciones de exportación PDF/Excel requieren librerías adicionales
- El sistema usa datos mock para demostración sin necesidad de backend

## Próximas Mejoras Recomendadas

1. Conectar a base de datos real
2. Implementar autenticación con JWT
3. Agregar notificaciones en tiempo real
4. Exportación a PDF/Excel
5. Códigos de barras/QR para productos
6. Integración con proveedores
7. Historial de precios
8. Predicción de demanda con IA

## Estructura de Datos

### Product
```typescript
{
  id: string;
  sku: string;              // Código único
  name: string;
  category: string;
  stock: number;
  minStock: number;         // Nivel de alerta
  buyPrice: number;
  sellPrice: number;
  status: 'active' | 'inactive';
}
```

### Movement
```typescript
{
  id: string;
  date: Date;
  type: 'entrada' | 'salida' | 'ajuste' | 'devolucion';
  productId: string;
  quantity: number;
  userId: string;
  notes?: string;
}
```

## Soporte

Para soporte o reportar bugs, contacta al equipo de desarrollo.

---

**Versión**: 1.0
**Estado**: Completado - Prototipo Funcional
**Última actualización**: Marzo 2026
