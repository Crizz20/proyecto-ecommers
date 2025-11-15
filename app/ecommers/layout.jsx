"use client";

// app/ecommers/layout.jsx
import { AuthProvider } from "../context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "../components/Navbar";

export default function EcommersLayout({ children }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="page-wrapper">
        {/* Solo mostramos el Navbar si NO estamos en login/signup */}
        {pathname !== "/ecommers/login" && pathname !== "/ecommers/signup" && <Navbar />}
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} ByteMarket — Todos los derechos reservados</p>
        </footer>
      </div>
    </AuthProvider>
  );
}
