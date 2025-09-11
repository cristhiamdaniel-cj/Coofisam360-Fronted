import "./globals.css";
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import BackButton from "./componentes/back-button";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-layout">
        <div className="main-container">
          <Navbar />
          <BackButton />
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
