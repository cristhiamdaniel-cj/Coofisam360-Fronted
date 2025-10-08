"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import "./globals.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import BackButton from "./componentes/back-button";
import { AuthProvider } from "./lib/authContext";

import "./globals.css";
import { Grand_Hotel, Urbanist } from "next/font/google";

const grandHotel = Grand_Hotel({
  weight: "400", // Only 400 is available
  subsets: ["latin"],
  display: "swap",
  variable: "--font-grand-hotel",
});

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-urbanist",
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const isLoginRoute = pathname === "/login";

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token && !isLoginRoute) {
      router.replace("/login");
    }
  }, [pathname, isLoginRoute, router]);

  return (
    // Evita warnings de hidratación causados por extensiones (p.ej. data-lt-installed)
    <html
      lang="es"
      className={`${grandHotel.variable} ${urbanist.variable}`}
      suppressHydrationWarning
    >
      <body className="main-layout">
        <AuthProvider>
          {isLoginRoute ? (
            <div className="login-container">{children}</div>
          ) : (
            <>
              <div className="main-container">
                <Navbar />
                <BackButton />
                {children}
              </div>
              <Footer />
            </>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
