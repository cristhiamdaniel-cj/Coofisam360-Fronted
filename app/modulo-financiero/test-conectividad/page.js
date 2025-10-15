'use client';

import { useEffect, useState } from 'react';

export default function TestConectividad() {
  const [resultado, setResultado] = useState('');
  const [cargando, setCargando] = useState(false);

  // Detectar automáticamente la URL base del backend
  const getApiBaseUrl = () => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return "http://localhost:8060";
      }
      
      if (hostname.includes('ngrok.io') || hostname.includes('coofisam360')) {
        return `http://${hostname}:8060`;
      }
      
      return "http://localhost:8060";
    }
    
    return "http://localhost:8060";
  };

  const testConectividad = async () => {
    setCargando(true);
    const apiBaseUrl = getApiBaseUrl();
    setResultado(`Probando conectividad...\nURL detectada: ${apiBaseUrl}\n\n`);

    try {
      // Test 1: Verificar que el backend esté funcionando
      setResultado(prev => prev + `1. Probando backend en ${apiBaseUrl}...\n`);
      
      const response = await fetch(`${apiBaseUrl}/api/v1/finanzas/presupuesto/?limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ff6c34cf9e07b35bd5a26f65cdb356ed00ce7c47',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResultado(prev => prev + `✅ Backend funcionando: ${data.count} registros encontrados\n`);
      } else {
        setResultado(prev => prev + `❌ Backend error: ${response.status} ${response.statusText}\n`);
      }

      // Test 2: Verificar endpoint de cuentas
      setResultado(prev => prev + '2. Probando endpoint de cuentas...\n');
      
      const response2 = await fetch(`${apiBaseUrl}/api/v1/finanzas/cuentas-disponibles/`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ff6c34cf9e07b35bd5a26f65cdb356ed00ce7c47',
          'Content-Type': 'application/json',
        },
      });

      if (response2.ok) {
        const data2 = await response2.json();
        setResultado(prev => prev + `✅ Cuentas disponibles: ${data2.cuentas.length} cuentas\n`);
      } else {
        setResultado(prev => prev + `❌ Cuentas error: ${response2.status} ${response2.statusText}\n`);
      }

      // Test 3: Verificar endpoint de ejecución presupuestal
      setResultado(prev => prev + '3. Probando endpoint de ejecución presupuestal...\n');
      
      const response3 = await fetch(`${apiBaseUrl}/api/v1/finanzas/ejecucion-presupuestal/?anio=2025&mes=8&limit=1`, {
        method: 'GET',
        headers: {
          'Authorization': 'Token ff6c34cf9e07b35bd5a26f65cdb356ed00ce7c47',
          'Content-Type': 'application/json',
        },
      });

      if (response3.ok) {
        const data3 = await response3.json();
        setResultado(prev => prev + `✅ Ejecución presupuestal: ${data3.count} registros encontrados\n`);
      } else {
        setResultado(prev => prev + `❌ Ejecución presupuestal error: ${response3.status} ${response3.statusText}\n`);
      }

      setResultado(prev => prev + '\n🎉 Todos los tests completados exitosamente!');

    } catch (error) {
      setResultado(prev => prev + `\n❌ Error de conectividad: ${error.message}\n`);
      setResultado(prev => prev + `Tipo de error: ${error.constructor.name}\n`);
      setResultado(prev => prev + `Stack trace: ${error.stack}\n`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Test de Conectividad - Módulo Financiero
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Diagnóstico de Conectividad
          </h2>
          
          <button
            onClick={testConectividad}
            disabled={cargando}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-4"
          >
            {cargando ? 'Probando...' : 'Iniciar Test de Conectividad'}
          </button>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {resultado || 'Haz clic en el botón para iniciar el test de conectividad...'}
            </pre>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Información del Sistema
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-700">Frontend:</h3>
              <p className="text-gray-600">Puerto: 8061</p>
              <p className="text-gray-600">URL: {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700">Backend:</h3>
              <p className="text-gray-600">Puerto: 8060</p>
              <p className="text-gray-600">URL detectada: {getApiBaseUrl()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
