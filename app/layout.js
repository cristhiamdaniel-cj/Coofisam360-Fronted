import "./globals.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-layout">
        <main className="main-container">
          <Navbar />
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
