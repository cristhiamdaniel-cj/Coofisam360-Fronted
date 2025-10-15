"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestEjecucionPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.get('http://localhost:8060/api/v1/finanzas/ejecucion-presupuestal/?anio=2025&mes=8&limit=3', {
        headers: {
          'Authorization': 'Token ff6c34cf9e07b35bd5a26f65cdb356ed00ce7c47',
          'Content-Type': 'application/json',
        },
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test de API - Ejecución Presupuestal</h1>
      
      <button
        onClick={testAPI}
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Probando...' : 'Probar API'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          <h2 className="font-semibold">Error:</h2>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          <h2 className="font-semibold">Resultado:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}


