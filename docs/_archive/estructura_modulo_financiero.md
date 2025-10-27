# Estructura del Módulo Financiero - Coofisam360

## Resumen General

El módulo financiero de Coofisam360 está ubicado en `/app/modulo-financiero/` y contiene 5 tablas principales que corresponden a los 5 módulos mostrados en la imagen:

1. **Indicadores Financieros** (`tabla-indicadores`)
2. **Cupos de Crédito** (`tabla-cupos`) 
3. **Categorías de Oficinas** (`tabla-categorias`)
4. **Ejecución Presupuestal** (`tabla-presupuesto` y `tabla-ejecucion-presupuestal`)
5. **Análisis Explicativo** (`tabla-analisis`)

## 1. Indicadores Financieros

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-indicadores/page.js`
- **Servicio**: `/app/services/modulo-financiero/financialService.js`
- **API Endpoint**: `/api/v1/indicadores/comparativa/`
- **Tabla BD**: `finanzas.indicadores_comparativa`

### Estructura de la Tabla
```javascript
{
  id: String,                    // Identificador único
  indicador: String,             // Nombre del indicador
  anio: Number,                  // Año
  mes: Number,                   // Mes (1-12)
  periodo: String,               // Formato YYYY-MM
  fecha: String,                 // Fecha formateada
  alcance: String,               // Descripción/alcance del indicador
  mes2a: Number,                 // Mismo mes 2 años atrás (%)
  mes1a: Number,                 // Mismo mes año anterior (%)
  diciembre1a: Number,           // Diciembre año anterior (%)
  mesActual: Number,             // Mes año actual (%)
  analisis: String               // Análisis del indicador
}
```

### Campos Editables
- `analisis`: Campo de texto para análisis del indicador

### Funcionalidades
- ✅ Búsqueda por indicador y alcance
- ✅ Filtros por año y mes
- ✅ Edición inline de análisis
- ✅ Descarga a Excel
- ✅ Guardado automático

---

## 2. Cupos de Crédito

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-cupos/page.js`
- **Servicio**: `/app/services/modulo-financiero/creditQuota.js`
- **API Endpoint**: `/api/v1/finanzas/cupos-credito/`
- **Tabla BD**: `finanzas.cupos_credito`

### Estructura de la Tabla
```javascript
{
  id: Number,                    // ID único
  fechaRenovado: String,         // Fecha de renovación (DD/MM/YYYY)
  cuenta: String,                // Número de cuenta
  entidadFinanciera: String,     // Nombre del banco/entidad
  cupoAsignado: Number,          // Cupo asignado ($)
  cupoEjecutado: Number,         // Cupo ejecutado ($)
  disponible: Number,            // Cupo disponible ($)
  garantia: String,              // Tipo de garantía
  porcentajeUtilizacion: Number, // % de utilización
  plazo: String,                 // Plazo en meses
  tasa: String                   // Tasa de interés
}
```

### Campos Editables
- `fechaRenovado`: Selector de fecha
- `cupoAsignado`: Campo numérico
- `garantia`: Campo de texto
- `plazo`: Campo de texto
- `tasa`: Campo de texto

### Funcionalidades
- ✅ Búsqueda por cuenta y entidad financiera
- ✅ Agregar nuevas filas
- ✅ Edición inline
- ✅ Eliminación con doble confirmación
- ✅ Descarga a Excel
- ✅ Validación de campos requeridos

---

## 3. Categorías de Oficinas

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-categorias/page.js`
- **Servicio**: `/app/services/modulo-financiero/categoriesQuota.js`
- **API Endpoint**: `/api/v1/finanzas/oficinas/`
- **Tabla BD**: `finanzas.oficinas`

### Estructura de la Tabla
```javascript
{
  id: String,                    // ID único
  codigo: String,                // Código de oficina
  nombre: String,                // Nombre de la oficina
  fecha: String,                 // Fecha de apertura (DD/MM/YYYY)
  ctaPuc14: String,              // Cartera de Crédito PUC 14 (formateado)
  ctaPuc21: String,              // Depósitos PUC 21 (formateado)
  asociados: Number,             // Número de asociados
  entidades: Number,             // Entidades financieras
  poblacion: Number,             // Población
  anio: Number,                  // Año del registro
  mes: Number                    // Mes del registro
}
```

### Campos Editables
- `entidades`: Campo numérico
- `poblacion`: Campo numérico

### Funcionalidades
- ✅ Búsqueda por código y nombre
- ✅ Filtros por año y mes
- ✅ Agregar nuevas filas
- ✅ Edición inline
- ✅ Eliminación con doble confirmación
- ✅ Descarga a Excel
- ✅ Ordenamiento por código

---

## 4. Ejecución Presupuestal

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-ejecucion-presupuestal/page.js`
- **Servicio**: `/app/services/modulo-financiero/ejecucionPresupuestal.js`
- **API Endpoint**: `/api/v1/finanzas/ejecucion-presupuestal/`
- **Tabla BD**: `finanzas.ejecucion_presupuestal`

### Estructura de la Tabla
```javascript
{
  id: String,                    // ID único
  anio: Number,                  // Año
  mes: Number,                   // Mes (1-12)
  codigo_puc6: String,           // Código PUC de 6 dígitos
  nombre_rubro: String,          // Nombre del rubro
  proyectado: Number,            // Valor proyectado
  historico: Number,             // Valor histórico
  diff_abs: Number,              // Diferencia absoluta (calculada)
  diff_pct: Number,              // Diferencia porcentual (calculada)
  periodo: String,               // Período (YYYY-MM)
  created_at: String             // Fecha de creación
}
```

### Campos Editables
- `anio`: Selector numérico (2020-2030)
- `mes`: Selector de mes
- `codigo_puc6`: Campo de texto (6 dígitos, solo números)
- `nombre_rubro`: Campo de texto
- `proyectado`: Campo numérico
- `historico`: Campo numérico

### Funcionalidades
- ✅ Búsqueda por código PUC y nombre del rubro
- ✅ Filtros por año y mes
- ✅ Agregar nuevas filas
- ✅ Edición inline
- ✅ Eliminación con doble confirmación
- ✅ Descarga a Excel
- ✅ Validación de código PUC (6 dígitos)
- ✅ Cálculo automático de diferencias

---

## 5. Análisis Explicativo

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-analisis/page.js`
- **Servicio**: `/app/services/modulo-financiero/analisisExplicativo.js`
- **API Endpoint**: `/api/v1/analisis/explicativo/`
- **Tabla BD**: `finanzas.analisis_explicativo`

### Estructura de la Tabla
```javascript
{
  id: Number,                    // ID único
  anio: Number,                  // Año
  mes: String,                   // Mes (nombre completo)
  categoria: String,             // Categoría/panel
  subcategoria: String,          // Subcategoría/título
  descripcion: String            // Texto del análisis explicativo
}
```

### Campos Editables
- `anio`: Selector de año (2025-2035)
- `mes`: Selector de mes (Enero-Diciembre)
- `categoria`: Selector de panel (Activos, Pasivos, Patrimonio, Ingresos, Gastos, Costos)
- `subcategoria`: Selector de título (Comportamiento de los Activos, etc.)
- `descripcion`: Textarea para análisis detallado

### Opciones de Categorías
- **Activos**: Comportamiento de los Activos, Comportamiento de la Cartera de Crédito
- **Pasivos**: Obligaciones Financieras, Comportamento del Pasivo
- **Patrimonio**: Comportamiento de Excedentes
- **Ingresos**: Análisis de Ingresos
- **Gastos**: Análisis de Gastos
- **Costos**: Análisis de Costos

### Funcionalidades
- ✅ Búsqueda por categoría, subcategoría y descripción
- ✅ Filtros por año y mes
- ✅ Agregar nuevas filas
- ✅ Edición inline
- ✅ Eliminación con doble confirmación
- ✅ Descarga a Excel
- ✅ Validación de campos requeridos

---

## 6. Presupuesto (Tabla Adicional)

### Ubicación
- **Componente**: `/app/modulo-financiero/tabla-presupuesto/page.js`
- **Servicio**: `/app/services/modulo-financiero/presupuesto.js`
- **API Endpoint**: `/api/v1/finanzas/presupuesto/`
- **Tabla BD**: `finanzas.presupuesto`

### Estructura de la Tabla
```javascript
{
  codigo: String,                // Código PUC
  nombre: String,                // Denominación
  valorAnterior: Number,         // Valor anterior (proyectado)
  valorActual: Number,           // Valor actual (histórico)
  // Campos calculados:
  diferencia: Number,            // Diferencia absoluta
  porcentaje: Number             // Diferencia porcentual
}
```

### Funcionalidades
- ✅ Datos estáticos (hardcodeados)
- ✅ Cálculo automático de diferencias
- ✅ Descarga a Excel
- ✅ Búsqueda por código y denominación

---

## Formularios del Módulo Principal

### Ubicación
- **Componente**: `/app/modulo-financiero/page.js`

### Funcionalidades del Dashboard Principal
1. **Cargar Balance**: Upload de archivos Excel/CSV
2. **Explorar**: Navegador de archivos con árbol de directorios
3. **Ejecutar**: Procesamiento ETL con logs en tiempo real
   - Parámetros: `Año`, `Mes`, switches para poblar `public.saldos_agencia` y `finanzas.op_saldo_mensual`.
   - Antes de iniciar, selecciona: `Año` y `Archivo` a procesar (lista de archivos disponibles bajo `Aanoo_<AÑO>`). El mes se infiere automáticamente del nombre del archivo. Al finalizar el ETL (SSE), el backend ejecuta automáticamente la población de tablas base para el período indicado (usando `staging.saldos_agencia` o, en su defecto, derivando PUC 14/21 desde `finanzas.oficinas`) y consolida `finanzas.op_saldo_mensual` via `sp_apply_saldos_mes`.
   - Opcional: existe un endpoint directo `POST /api/v1/finanzas/etl/populate/` para población manual, pero no es necesario en la operación normal.

### Estructura de Archivos
```
modulo-financiero/
├── page.js                          # Dashboard principal (Cargar/Explorar/Ejecutar + Población derivadas)
├── layout.js                        # Layout del módulo
├── tabla-indicadores/
│   └── page.js                      # Tabla de indicadores
├── tabla-cupos/
│   └── page.js                      # Tabla de cupos de crédito
├── tabla-categorias/
│   └── page.js                      # Tabla de categorías de oficinas
├── tabla-presupuesto/
│   └── page.js                      # Tabla de presupuesto
├── tabla-ejecucion-presupuestal/
│   └── page.js                      # Tabla de ejecución presupuestal
└── tabla-analisis/
    └── page.js                      # Tabla de análisis explicativo
```

## Servicios y APIs

### Estructura de Servicios
```
services/modulo-financiero/
├── financialService.js              # Servicio principal
├── creditQuota.js                   # Servicio de cupos de crédito
├── categoriesQuota.js               # Servicio de categorías
├── indicatorsQuota.js               # Servicio de indicadores
├── ejecucionPresupuestal.js         # Servicio de ejecución presupuestal
├── analisisExplicativo.js           # Servicio de análisis explicativo
└── presupuesto.js                   # Servicio de presupuesto
```

### Endpoints de API
- `/api/v1/indicadores/comparativa/` - Indicadores financieros
- `/api/v1/finanzas/cupos-credito/` - Cupos de crédito
- `/api/v1/finanzas/oficinas/` - Categorías de oficinas
- `/api/v1/finanzas/ejecucion-presupuestal/` - Ejecución presupuestal
- `/api/v1/analisis/explicativo/` - Análisis explicativo
- `/api/v1/finanzas/presupuesto/` - Presupuesto
- `/api/v1/finanzas/upload/` - Upload de archivos
- `/api/v1/finanzas/tree/` - Explorador de archivos
- `/api/v1/finanzas/download/` - Descarga de archivos

## Mapeo de Tablas de Base de Datos

### Esquema: `finanzas`

| Módulo Frontend | Tabla BD | Esquema | Descripción |
|----------------|----------|---------|-------------|
| **Indicadores Financieros** | `indicadores_comparativa` | `finanzas` | Comparativas mensuales de indicadores financieros |
| **Cupos de Crédito** | `cupos_credito` | `finanzas` | Líneas de crédito bancarias y su utilización |
| **Categorías de Oficinas** | `oficinas` | `finanzas` | Información de oficinas y sucursales |
| **Ejecución Presupuestal** | `ejecucion_presupuestal` | `finanzas` | Control presupuestario por código PUC |
| **Análisis Explicativo** | `analisis_explicativo` | `finanzas` | Análisis detallados por categorías financieras |
| **Presupuesto** | `presupuesto` | `finanzas` | Datos presupuestarios históricos y proyectados |

### Campos Clave por Tabla

#### `finanzas.indicadores_comparativa`
- `id`, `nombre_indicador`, `anio`, `mes`, `periodo`
- `valor_indicador`, `dic_anterior`, `mes_1a`, `mes_2a`
- `analisis`, `created_at`, `updated_at`

#### `finanzas.cupos_credito`
- `id`, `entidad_financiera`, `cuenta`, `fecha_renovado`
- `cupo_asignado`, `cupo_ejecutado`, `disponible`
- `garantia`, `porcentaje_utilizacion`, `plazo`, `tasa`

#### `finanzas.oficinas`
- `id`, `codigo`, `nombre`, `fecha_apertura`
- `cta_puc_14`, `cta_puc_21`, `asociados`
- `entidades_financieras`, `poblacion`, `anio`, `mes`

#### `finanzas.ejecucion_presupuestal`
- `id`, `anio`, `mes`, `codigo_puc6`, `nombre_rubro`
- `proyectado`, `historico`, `diff_abs`, `diff_pct`
- `periodo`, `created_at`

#### `finanzas.analisis_explicativo`
- `id`, `anio`, `mes`, `categoria`, `subcategoria`
- `descripcion`, `created_at`, `updated_at`

#### `finanzas.presupuesto`
- `codigo`, `nombre`, `valor_anterior`, `valor_actual`
- `diferencia`, `porcentaje` (calculados)

## Características Comunes

### Funcionalidades Estándar
- ✅ **Búsqueda**: Filtrado en tiempo real
- ✅ **Filtros**: Por año, mes, categoría
- ✅ **Edición**: Inline editing con validación
- ✅ **CRUD**: Create, Read, Update, Delete
- ✅ **Exportación**: Descarga a Excel
- ✅ **Validación**: Campos requeridos y formatos
- ✅ **Confirmación**: Doble confirmación para eliminación
- ✅ **Estados**: Loading, error, success
- ✅ **Responsive**: Diseño adaptable

### Patrones de Diseño
- **Componentes**: React functional components con hooks
- **Estado**: useState para estado local
- **Efectos**: useEffect para carga de datos
- **Servicios**: Separación de lógica de negocio
- **Validación**: Client-side validation
- **Formato**: Números con separadores de miles
- **Fechas**: Formato DD/MM/YYYY

### Estilos
- **CSS**: Clases personalizadas con Tailwind
- **Temas**: Colores rojos corporativos (#780000, #b81121)
- **Layout**: Tablas responsivas con scroll horizontal
- **Iconos**: React Icons (FaRegSave, FiDownload, etc.)

---

*Documento generado automáticamente basado en el análisis del código fuente del módulo financiero de Coofisam360.*
