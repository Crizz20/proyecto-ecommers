// components/Navbar.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../app/context/AuthContext"; // ruta relativa

export default function Navbar() {
  // useAuth devuelve un stub si no hay provider, así que es seguro usarlo
  const { usuario, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // llamar a logout del contexto (ya limpia localStorage)
    try {
      logout();
    } catch (e) {
      console.error("Error en logout:", e);
    }
    // navegar a la página de login
    router.push("/ecommers/login");
  };

  const nombreUsuario = usuario?.nombre || null;
  const avatarInitial = nombreUsuario ? nombreUsuario.charAt(0).toUpperCase() : "N";

  return (
    <nav className="navbar" role="navigation" aria-label="Barra principal">
      <div className="nav-content">
        <Link href="/ecommers" className="logo"> ByteMarket </Link>

        <div className="menu-desktop">
          <Link href="/ecommers">Inicio</Link>
          <Link href="/ecommers/carrito">Carrito</Link>

          {nombreUsuario ? (
            <div className="user-menu" aria-live="polite">
              <div className="avatar" aria-hidden="true">{avatarInitial}</div>
              <span className="username">{nombreUsuario}</span>
              <button
                onClick={handleLogout}
                className="logout-btn"
                aria-label="Cerrar sesión"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <Link href="/ecommers/login">Login</Link>
              <Link href="/ecommers/signup">Registro</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
