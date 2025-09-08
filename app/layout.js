import "./globals.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-layout">
        <div className="main-container">
          <Navbar />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
