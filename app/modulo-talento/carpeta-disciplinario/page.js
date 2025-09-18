import "../../styles/global.css";
import Image from "next/image";
import Link from "next/link";

export default function FinancieroDashboard() {
  return (
    <main className="container-financiero flex-col p-12">
      <h1 className="text-3xl font-semibold uppercase titulo-modulo">
        Formularios
      </h1>

      <div className="separator-modulo"></div>
      <div className="dashboard-financiero">
        <Link
          href="/modulo-talento/carpeta-disciplinario/tabla-control-disciplinario"
          className="modulo-button"
        >
          <div className="logo">
            <Image
              src="/indicadores.svg" // Path relative to /public
              className="module-image"
              alt="Company Logo"
              width={200} // required
              height={50} // required
              priority // loads immediately
            />
          </div>
          Control Disciplinario
        </Link>
      </div>
    </main>
  );
}
