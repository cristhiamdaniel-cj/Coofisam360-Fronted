"use client";
import { useEffect, useState } from "react";

export default function TestAuth() {
  const [token, setToken] = useState(null);
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    try {
      const authToken = localStorage.getItem('authToken');
      setToken(authToken);
      console.log("Token encontrado:", authToken);
    } catch (error) {
      console.error("Error al acceder a localStorage:", error);
      setTestResult("Error: localStorage no disponible");
    }
  }, []);

  const testAPI = async () => {
    try {
      const response = await fetch('http://localhost:8060/api/v1/finanzas/presupuesto/?anio=2025&mes=1&limit=3', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`Éxito: ${data.presupuesto?.length || 0} registros encontrados`);
      } else {
        setTestResult(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de Autenticación</h1>
      
      <div className="mb-4">
        <p><strong>Token encontrado:</strong> {token ? "Sí" : "No"}</p>
        <p><strong>Token:</strong> {token || "No disponible"}</p>
      </div>
      
      <button 
        onClick={testAPI}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Probar API
      </button>
      
      {testResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Resultado:</strong> {testResult}</p>
        </div>
      )}
    </div>
  );
}


