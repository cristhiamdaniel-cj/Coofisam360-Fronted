import "../styles/global.css";
import Navbar from "../componentes/navbar";

export default function FinancieroLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-layout">{children}</body>
    </html>
  );
}
