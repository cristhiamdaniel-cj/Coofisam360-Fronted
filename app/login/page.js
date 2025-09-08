"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const base = process.env.NEXT_PUBLIC_API_BASE || "";

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
      localStorage.setItem("authToken", data.token);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="login-container flex items-center justify-center">
      <div className="login-card border">
        <div className="login-header px-8 py-4">
          <div className="login-logo">
            {/* Coloca el archivo en frontend/public/logo-coofisam.png */}
          </div>
          <h2 className="login-title">Bienvenido</h2>
        </div>
        <p className="login-subtitle p-4">Inicia sesión para continuar</p>
        <div className="p-12">
          <form onSubmit={onSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="username" className="mr-6">
                Usuario
              </label>
              <input
                id="username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Usuario"
                className="border"
              />
            </div>
            <div className="form-field">
              <label htmlFor="password" className="mr-6">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border"
              />
            </div>
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}
            <div className="login-actions">
              <button type="submit" className="action-button">
                Ingresar
              </button>
            </div>
          </form>
        </div>
        <div className="login-meta">
          Backend: <code>{base || "(mismo origen)"}</code>
        </div>
      </div>
    </div>
  );
}
