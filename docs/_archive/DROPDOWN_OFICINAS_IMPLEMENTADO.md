# ✅ DROPDOWN DE OFICINAS IMPLEMENTADO

## 🎯 Implementación de Selector de Oficinas

Se ha implementado exitosamente un **dropdown de oficinas** en el modo "Agregar Fila" para la tabla de Categorías de Oficinas, permitiendo al usuario seleccionar una oficina de una lista y completar automáticamente tanto el código como el nombre.

## 🔧 Cambios Implementados

### **1. Backend - Endpoint de Oficinas Disponibles:**

**Nueva función en `api_views.py`:**
```python
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def oficinas_disponibles(request):
    """
    Obtiene la lista de oficinas disponibles para selección en dropdowns
    """
    try:
        with connections['default'].cursor() as c:
            c.execute("""
                SELECT DISTINCT 
                    codigo::text AS codigo,
                    nombre::text AS nombre
                FROM finanzas.org_oficina
                WHERE codigo IS NOT NULL 
                  AND nombre IS NOT NULL
                  AND codigo != ''
                  AND nombre != ''
                ORDER BY codigo::int, nombre
            """)
            cols = [col[0] for col in c.description]
            oficinas = [dict(zip(cols, row)) for row in c.fetchall()]
        
        return Response({
            'oficinas': oficinas,
            'count': len(oficinas)
        })
    except Exception as e:
        return Response({'error': str(e)}, status=500)
```

**Endpoint disponible:**
- `GET /api/v1/finanzas/oficinas-disponibles/`
- **Autenticación**: Requerida (Token)
- **Respuesta**: Lista de oficinas con código y nombre

### **2. Frontend - Servicio de Oficinas:**

**Función en `categoriesQuota.js`:**
```javascript
export async function getOficinasDisponibles() {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";
    const response = await fetch(`${API_BASE_URL}/api/v1/finanzas/oficinas-disponibles/`, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.oficinas || [];
  } catch (error) {
    console.error("Error al obtener oficinas disponibles:", error);
    throw error;
  }
}
```

### **3. Frontend - Componente Actualizado:**

**Estado para oficinas disponibles:**
```javascript
const [oficinasDisponibles, setOficinasDisponibles] = useState([]);
```

**Carga de oficinas al inicializar:**
```javascript
useEffect(() => {
  loadData();
  loadOficinasDisponibles(); // ✅ Nueva función
}, []);

async function loadOficinasDisponibles() {
  try {
    const oficinas = await getOficinasDisponibles();
    setOficinasDisponibles(oficinas);
  } catch (error) {
    console.error("Error cargando oficinas disponibles:", error);
  }
}
```

**Función para manejar selección de oficina:**
```javascript
const handleOficinaChange = (rowId, oficinaCodigo) => {
  const oficina = oficinasDisponibles.find(o => o.codigo === oficinaCodigo);
  if (oficina) {
    handleChange(rowId, "codigo", oficina.codigo);
    handleChange(rowId, "nombre", oficina.nombre);
  }
};
```

### **4. Renderizado del Dropdown:**

**Campo Código (Dropdown):**
```javascript
<td>
  {isEditing ? (
    <select
      value={row.codigo}
      onChange={e => handleOficinaChange(row.id, e.target.value)}
      className="px-2 py-1 w-full border"
    >
      <option value="">Seleccionar oficina</option>
      {oficinasDisponibles.map(oficina => (
        <option key={oficina.codigo} value={oficina.codigo}>
          {oficina.codigo} - {oficina.nombre}
        </option>
      ))}
    </select>
  ) : (
    row.codigo
  )}
</td>
```

**Campo Nombre (Solo Lectura):**
```javascript
<td>
  {isEditing ? (
    <input
      type="text"
      value={row.nombre}
      readOnly
      className="px-2 py-1 w-full border bg-gray-100"
      placeholder="Se llena automáticamente"
    />
  ) : (
    row.nombre
  )}
</td>
```

## 🎨 Experiencia de Usuario

### **Modo "Agregar Fila":**

1. **Usuario hace clic en "Agregar Fila"**
2. **Se crea nueva fila con dropdown de oficinas**
3. **Usuario selecciona oficina del dropdown:**
   - Formato: `"Código - Nombre"` (ej: "1 - Garzón")
   - Lista ordenada por código numérico
4. **Se completa automáticamente:**
   - ✅ **Código**: Se llena con el código de la oficina
   - ✅ **Nombre**: Se llena con el nombre de la oficina
5. **Usuario completa otros campos editables**
6. **Usuario guarda la fila**

### **Modo Normal (Solo Lectura):**
- **Código**: Muestra el código de la oficina
- **Nombre**: Muestra el nombre de la oficina

### **Modo "Editar Fila" (PUT):**
- **Código**: Dropdown de oficinas (permite cambiar)
- **Nombre**: Campo de solo lectura (se actualiza automáticamente)

## 📊 Estructura de Datos

### **Respuesta del Backend:**
```json
{
  "oficinas": [
    {
      "codigo": "1",
      "nombre": "Garzón"
    },
    {
      "codigo": "2", 
      "nombre": "Pitalito"
    }
  ],
  "count": 2
}
```

### **Estado en Frontend:**
```javascript
oficinasDisponibles = [
  { codigo: "1", nombre: "Garzón" },
  { codigo: "2", nombre: "Pitalito" },
  // ... más oficinas
]
```

## ✅ Beneficios Implementados

### **1. Usabilidad Mejorada:**
- ✅ **Selección fácil**: Dropdown con todas las oficinas disponibles
- ✅ **Autocompletado**: Código y nombre se llenan automáticamente
- ✅ **Validación**: Solo oficinas válidas disponibles para selección
- ✅ **Orden lógico**: Oficinas ordenadas por código numérico

### **2. Prevención de Errores:**
- ✅ **Sin códigos inválidos**: Solo oficinas existentes en la base de datos
- ✅ **Consistencia**: Código y nombre siempre coinciden
- ✅ **Validación automática**: No se pueden ingresar datos incorrectos

### **3. Experiencia Intuitiva:**
- ✅ **Formato claro**: "Código - Nombre" en el dropdown
- ✅ **Feedback visual**: Campo nombre se marca como solo lectura
- ✅ **Placeholder informativo**: "Se llena automáticamente"

## 🔄 Flujo de Trabajo Actualizado

### **1. Agregar Nueva Fila:**
1. Usuario hace clic en "Agregar Fila"
2. Se carga lista de oficinas disponibles
3. Usuario selecciona oficina del dropdown
4. Se completa automáticamente código y nombre
5. Usuario completa otros campos (año, mes, etc.)
6. Usuario guarda la fila

### **2. Editar Fila Existente:**
1. Usuario hace clic en "Editar"
2. Dropdown muestra oficina actual seleccionada
3. Usuario puede cambiar a otra oficina
4. Nombre se actualiza automáticamente
5. Usuario guarda cambios

## 🚀 Estado Final

- ✅ **Backend**: Endpoint `/api/v1/finanzas/oficinas-disponibles/` implementado
- ✅ **Frontend**: Dropdown de oficinas en modo "Agregar Fila"
- ✅ **Autocompletado**: Código y nombre se llenan automáticamente
- ✅ **Validación**: Solo oficinas válidas disponibles
- ✅ **UX**: Experiencia intuitiva y sin errores

**Fecha de implementación**: 18 de octubre de 2025
**Estado**: ✅ DROPDOWN DE OFICINAS IMPLEMENTADO EXITOSAMENTE

## 📝 Notas Técnicas

- **Fuente de datos**: `finanzas.org_oficina` (tabla maestra de oficinas)
- **Ordenamiento**: Por código numérico ascendente
- **Filtrado**: Solo oficinas con código y nombre válidos
- **Autenticación**: Token requerido para acceder al endpoint
- **Error handling**: Manejo de errores en carga de oficinas
- **Performance**: Carga una sola vez al inicializar el componente
