// lib/auth.js

export function getCurrentUser() {
  const token = localStorage.getItem("authToken");
  if (!token) return null;

  try {
    // Ejemplo: decodificar JWT simple
  } catch (error) {
    console.error("Token inválido", error);
    return null;
  }
}

export function logout() {
  localStorage.removeItem("authToken");
}
