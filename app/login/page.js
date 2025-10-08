"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/authContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_BASE || "";
  const { setUser } = useAuth();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      // Paso 1: pedir token
      const res = await fetch(`${base}/api/v1/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      console.log("Token response:", data);

      if (!res.ok) {
        console.error("Login error:", data);
        alert(data.detail || "Error al iniciar sesión");
        return;
      }

      const token = data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);

      // Paso 2: pedir info del usuario con el token
      const meRes = await fetch(`${base}/api/v1/me/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`, // 👈 importante
        },
      });

      const meData = await meRes.json();
      console.log("User info:", meData);

      if (!meRes.ok) {
        console.error("Error al obtener datos de usuario:", meData);
        alert("No se pudieron cargar los datos del usuario");
        return;
      }
      // guardamos en localStorage
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", meData.username);
      localStorage.setItem("responsable", meData.responsable);
      localStorage.setItem("acceso", JSON.stringify(meData.acceso_estructura));

      // Paso 3: guardar usuario en el contexto
      setUser({
        username: meData.username,
        responsable: meData.responsable,
        acceso: meData.acceso_estructura,
      });

      router.push("/"); // redirect to home
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-container flex flex-col items-center justify-center min-h-screen mr-32">
      <h1 className="text-8xl login-title font-grand-hotel">
        Bienvenido a <br />
      </h1>
      <h1 className="font-urbanist text-6xl login-title mb-8 font-bold">
        Coofisam
      </h1>
      <form onSubmit={onSubmit} className="px-16 py-8 login-form">
        <h2 className="text-xl mb-4">Ingrese con su usuario y contraseña</h2>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Usuario"
          className="border mb-2 block w-full"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          className="border mb-2 block w-full"
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          type="submit"
          className="login-button mt-8 text-white px-4 py-2 cursor-pointer"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
