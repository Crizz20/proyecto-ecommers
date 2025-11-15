// components/Navbar.jsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { usuario, logout } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error("Error en logout:", e);
    }
    setIsUserMenuOpen(false);
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
              <div 
                className="user-menu-trigger"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="avatar" aria-hidden="true">{avatarInitial}</div>
                <span className="username">{nombreUsuario}</span>
              </div>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-dropdown-avatar">{avatarInitial}</div>
                    <div>
                      <p className="user-dropdown-name">{usuario.nombre}</p>
                      <p className="user-dropdown-email">{usuario.email}</p>
                    </div>
                  </div>
                  
                  <div className="user-dropdown-divider"></div>
                  
                  <div className="user-dropdown-menu">
                    <Link 
                      href="/ecommers/perfil" 
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      👤 Mi Perfil
                    </Link>
                    <Link 
                      href="/ecommers/carrito" 
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      🛒 Mi Carrito
                    </Link>
                    <Link 
                      href="/ecommers/pedidos" 
                      className="user-dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      📦 Mis Pedidos
                    </Link>
                  </div>
                  
                  <div className="user-dropdown-divider"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="user-dropdown-logout"
                    aria-label="Cerrar sesión"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
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
