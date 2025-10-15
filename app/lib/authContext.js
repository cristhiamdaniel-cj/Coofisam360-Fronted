import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    
    if (token) {
      // Obtener información actualizada del usuario desde el backend
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      fetch(`${base}/api/v1/me/`, {
        headers: {
          "Authorization": `Token ${token}`,
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.username) {
          setUser({
            username: data.username,
            responsable: data.responsable,
            acceso: data.acceso_estructura || [],
          });
          // Actualizar localStorage con la información actualizada
          localStorage.setItem("username", data.username);
          localStorage.setItem("responsable", data.responsable);
          localStorage.setItem("acceso", JSON.stringify(data.acceso_estructura || []));
        }
      })
      .catch(error => {
        console.error("Error al obtener información del usuario:", error);
        // Fallback a localStorage si hay error
        const username = localStorage.getItem("username");
        const responsable = localStorage.getItem("responsable");
        const acceso = localStorage.getItem("acceso");
        
        if (username) {
          setUser({
            username,
            responsable,
            acceso: acceso ? JSON.parse(acceso) : [],
          });
        }
      });
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("responsable");
    localStorage.removeItem("acceso");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
