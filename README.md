Coofisam360 Frontend (Next.js 15 + React 19)

Resumen operativo y de arquitectura para producción. Este README unifica la información clave de funcionamiento y deja fuera correcciones o historiales de trabajo.

Sistema basado en Next.js (App Router) que consume un backend vía API REST autenticada con Token.

Requisitos
- Node 18+ (recomendado 18 LTS o 20 LTS)
- npm 9+
- Backend accesible vía `NEXT_PUBLIC_API_BASE` (por defecto http://localhost:8060)

Variables de entorno (`.env.local`)
- `NEXT_PUBLIC_API_BASE=http://localhost:8060` URL base del backend
- Opcional: otros valores públicos que requiera el backend

Scripts
- `npm run dev` inicia en modo desarrollo en `http://localhost:8061`
- `npm run build` genera el build de producción
- `npm run start` arranca el build en producción en `http://localhost:8061`

Autenticación
- El login del backend entrega un token; el frontend lo guarda como `authToken` en `localStorage`.
- Las peticiones usan el header `Authorization: Token <token>` (ver `app/services/api.js`).
- El contexto de usuario se carga desde `/api/v1/me/` y habilita los módulos visibles en el navbar.

Estructura principal
- `app/` App Router de Next.js (páginas y layouts)
- `app/services/` capa de acceso a APIs por dominio
- `app/componentes/` componentes compartidos (ej. navbar)
- `public/` estáticos

Módulos visibles en el Navbar
- Financiera (`/modulo-financiero`)
- Talento y Cultura (`/modulo-talento`)
- Cartera, Crédito, Comercial, Gestión Documental, Ingeniería, Jurídico, Cumplimiento (pueden estar vacíos o en progreso)

Módulo Financiero (resumen funcional)
1) Tabla Indicadores (`/modulo-financiero/tabla-indicadores`)
   - CRUD contra `/api/v1/indicadores/comparativa/`
   - Funciones: listar, guardar/actualizar, eliminar e inventario de indicadores disponibles
   - Servicio: `app/services/modulo-financiero/financialService.js`
2) Categorías Oficinas (`/modulo-financiero/tabla-categorias`)
   - CRUD contra `/api/v1/finanzas/oficinas/`
   - Servicio: `financialService.js` + adaptadores en `categoriesQuota.js`
   - Soporta prellenado desde el período anterior (misma oficina)
3) Cupos de Crédito (`/modulo-financiero/tabla-cupos`)
   - CRUD contra `/api/v1/finanzas/cupos-credito/`
   - Servicio: `financialService.js` + adaptadores en `creditQuota.js`
4) Presupuesto app (`/modulo-financiero/tabla-presupuesto`)
   - CRUD contra `/api/v1/finanzas/presupuesto-app/`
   - Carga de archivos simples (Código, Denominación, Proyectado)
   - Servicio: `app/services/modulo-financiero/presupuesto.js`
   - Endpoints auxiliares: listar/ejecutar/descargar/eliminar archivos
5) Ejecución Presupuestal (`/modulo-financiero/tabla-ejecucion-presupuestal`)
   - CRUD y carga de archivos contra `/api/v1/finanzas/ejecucion-presupuestal/`
   - Servicio: `app/services/modulo-financiero/ejecucionPresupuestal.js`

Capa de servicios
- `app/services/api.js` unifica fetch con timeout, querystring y headers
- Cada archivo en `app/services/modulo-financiero/` agrupa funciones de un dominio

Cómo correr local
1) Crear `.env.local` con `NEXT_PUBLIC_API_BASE`
2) `npm ci` (o `npm install`)
3) `npm run dev` y abrir `http://localhost:8061`

Build de producción
1) `npm run build`
2) `npm run start`

Notas de limpieza actual
- Se eliminaron funciones no utilizadas en servicios del módulo financiero para reducir ruido:
  - `getCreditQuota` (wrapper) y `getCredit` (servicio base)
  - APIs de presupuesto no usadas por el UI actual: `listPresupuesto`, `listPresupuestoCompleto`, `savePresupuesto`, `savePresupuestoCompleto`, `deletePresupuesto`, `getCuentasDisponibles`
  - Archivo obsoleto `app/services/modulo-financiero/indicatorsQuota.js`

Próximos pasos (Docker)
- Añadir `Dockerfile` multi-stage (builder + runtime)
- Construir imagen del frontend y luego integrar con backend en `docker-compose.yml`
- Este README ya concentra la info necesaria para esa etapa.
