import api from "../../api";

// Helper para convertir mes a número
function monthToNumber(mes) {
  const monthMap = {
    'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4,
    'MAYO': 5, 'JUNIO': 6, 'JULIO': 7, 'AGOSTO': 8,
    'SEPTIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
  };
  return monthMap[mes?.toUpperCase()] || 8; // Default a agosto si no se encuentra
}

/* ===================COSTO  BENEFICIO===================== */
export async function listCostoBeneficio(params = {}) {
  const { data } = await api.get("/api/v1/talento/capacitacion-mensual/", {
    params,
  });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getCostoBeneficio(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/capacitacion-mensual/", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveCostoBeneficio(payload) {
  console.log(">>> saveCostoBeneficio - Payload recibido:", payload);
  
  try {
    // El endpoint solo acepta POST para crear/actualizar
    console.log(">>> Enviando datos con POST");
    const { data } = await api.post(
      "/api/v1/talento/capacitacion-mensual/",
      payload
    );
    return data;
  } catch (error) {
    console.error(">>> Error en saveCostoBeneficio:", error);
    console.error(">>> Error response:", error.response?.data);
    console.error(">>> Error status:", error.response?.status);
    
    // Si es un error de duplicado, intentar con PATCH para actualizar
    const errorData = error.response?.data || '';
    const isDuplicateError = error.response?.status === 500 && 
      (typeof errorData === 'string' && errorData.includes("duplicate key value violates unique constraint"));
    
    if (isDuplicateError) {
      console.log(">>> Detectado error de duplicado, intentando actualizar con PATCH");
      try {
        // Construir la clave primaria compuesta para la actualización
        const mesNumero = monthToNumber(payload.mes);
        const updatePayload = {
          ...payload,
          // Agregar campos de identificación para la actualización
          periodo: `${payload.anio}-${String(mesNumero).padStart(2, '0')}-01`,
          grupo: 1 // Valor por defecto
        };
        
        console.log(">>> Payload para PATCH:", updatePayload);
        
        // Usar PUT con la clave primaria compuesta en la URL
        const periodoStr = `${payload.anio}-${String(mesNumero).padStart(2, '0')}-01`;
        const modalidadStr = payload.modalidad?.toUpperCase() || 'VIRTUAL';
        const grupoStr = '1';
        
        const { data } = await api.put(
          `/api/v1/talento/capacitacion-mensual/${periodoStr}/${modalidadStr}/${grupoStr}/`,
          updatePayload
        );
        return data;
      } catch (patchError) {
        console.error(">>> Error en PATCH también:", patchError);
        throw patchError;
      }
    }
    
    throw error;
  }
}

/* ===================FORMACIÓN Y PARTICIPACIÓN===================== */
export async function listFormaciones(params = {}) {
  const { data } = await api.get("/api/v1/talento/formacion-participacion/", {
    params,
  });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getFormacion(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/formacion-participacion/", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveFormacion(payload) {
  // El endpoint solo acepta POST para crear/actualizar
  const { data } = await api.post(
    "/api/v1/talento/formacion-participacion/",
    payload
  );
  return data;
}

/* ===================SATISFACCIÓN DEL APRENDIZAJE=================== */
export async function listSatisfaccionAprendizaje(params = {}) {
  const { data } = await api.get("/api/v1/talento/satisfaccion-aprendizaje/", {
    params,
  });
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getSatisfaccionAprendizaje(id, params = {}) {
  const { data } = await api.get("/api/v1/talento/satisfaccion-aprendizaje/", {
    params: { ...(params || {}), id },
  });
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveSatisfaccionAprendizaje(payload) {
  // El endpoint solo acepta POST para crear/actualizar
  const { data } = await api.post(
    "/api/v1/talento/satisfaccion-aprendizaje/",
    payload
  );
  return data;
}

/* =============TRANSFERENCIA DEL CONOCIMIENTO================ */
export async function listTransferenciaConocimiento(params = {}) {
  const { data } = await api.get(
    "/api/v1/talento/transferencia-conocimiento/",
    { params }
  );
  // Alternativa:
  // const { data } = await api.get("/api/v1/talento//", { params });
  return data?.items ?? data;
}

export async function getTransferenciaConocimiento(id, params = {}) {
  const { data } = await api.get(
    "/api/v1/talento/transferencia-conocimiento/",
    {
      params: { ...(params || {}), id },
    }
  );
  // Alternativa:
  // const { data } = await api.get(`/api/v1/talento//${id}/`, { params });
  const items = data?.items ?? [];
  return items[0] || null;
}

export async function saveTransferenciaConocimiento(payload) {
  // El endpoint solo acepta POST para crear/actualizar
  const { data } = await api.post(
    "/api/v1/talento/transferencia-conocimiento/",
    payload
  );
  return data;
}
