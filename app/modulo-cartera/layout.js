import "../styles/global.css";

export default function FinancieroLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-layout">{children}</body>
    </html>
  );
}
