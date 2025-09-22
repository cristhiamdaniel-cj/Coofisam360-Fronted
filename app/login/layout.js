import Footer from "../componentes/footer";
import "../styles/global.css";
import Image from "next/image";

export default function LoginLayout({ children }) {
  return (
    <>
      <div className="login-layout">
        <div className="logo-login">
          <Image
            src="/logo-coofisam.png" // Path relative to /public
            className="logo-image-login"
            alt="Company Logo"
            width={600} // required
            height={300} // required
            priority // loads immediately
          />
        </div>
        <div className="login-banner"></div>
        {children}
      </div>
      <Footer />
    </>
  );
}
