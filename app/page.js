"use client";

import { useAuth } from "./lib/authContext";

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="main-layout p-12">
      <h1 className="font-bold text-red-700 text-[35px]">
        Bienvenido(a) {user && user.responsable ? user.responsable : ""}
      </h1>
    </div>
  );
}
