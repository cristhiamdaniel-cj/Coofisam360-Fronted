/**
 *********************************************
 *   Servicio: Análisis Explicativo            *
 *********************************************
 * CRUD de textos explicativos por panel/título
 */
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8060";

// Función para obtener el token de autenticación
function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("authToken");
  }
  return null;
}

// Configuración de axios con token de autenticación
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* -------------------------------------
 *  Listar análisis explicativo
 * ------------------------------------- */
export async function listAnalisisExplicativo(params = {}) {
  try {
    const response = await api.get("/analisis/explicativo/", { params });
    return response.data.items || [];
  } catch (error) {
    console.error("Error al listar análisis explicativo:", error);
    throw error;
  }
}

/* -------------------------------------
 *  Guardar análisis explicativo        
 * ------------------------------------- */
export async function saveAnalisisExplicativo(data) {
  try {
    const response = await api.post("/analisis/explicativo/", data);
    return response.data;
  } catch (error) {
    console.error("Error al guardar análisis explicativo:", error);
    throw error;
  }
}

/* -------------------------------------
 *  Actualizar análisis explicativo     
 * ------------------------------------- */
export async function updateAnalisisExplicativo(id, data) {
  try {
    const response = await api.put(`/analisis/explicativo/${id}/`, data);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar análisis explicativo:", error);
    throw error;
  }
}

/* -------------------------------------
 *  Eliminar análisis explicativo       
 * ------------------------------------- */
export async function deleteAnalisisExplicativo(id) {
  try {
    const response = await api.delete(`/analisis/explicativo/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error al eliminar análisis explicativo:", error);
    throw error;
  }
}
