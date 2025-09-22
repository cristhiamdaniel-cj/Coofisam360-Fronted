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
      const res = await fetch(`${base}/api/v1/auth/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Credenciales inválidas");
      }

      const data = await res.json();
      // guardamos token y username
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("username", username);

      // <-- IMPORTANT: avisamos al contexto que hay usuario
      setUser({ name: username });

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
