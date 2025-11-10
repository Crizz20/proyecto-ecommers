"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ecommers.css";

export default function CarritoPage() {
  // useAuth puede devolver un stub; anotar como any para TS en esta página cliente
  const { usuario, logout } = useAuth() as any;
  const [carrito, setCarrito] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("carrito");
      const stored = raw ? JSON.parse(raw) : [];
      setCarrito(stored);
    } catch (e) {
      console.error("Error leyendo carrito:", e);
      setCarrito([]);
    }
  }, []);

  const removeItem = (index: number) => {
    const copy = [...carrito];
    copy.splice(index, 1);
    setCarrito(copy);
    localStorage.setItem("carrito", JSON.stringify(copy));
  };

  const clearCart = () => {
    setCarrito([]);
    localStorage.removeItem("carrito");
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  const total = carrito.reduce((sum, item) => sum + Number(item.precio || 0), 0);

  return (
    <div className="store-container">
      <h2 style={{ color: "#58a6ff" }}>Mi perfil</h2>

      {usuario ? (
        <div style={{ marginBottom: "1rem" }}>
          <p>Nombre: <strong style={{ color: "#f7f7f7" }}>{usuario.nombre}</strong></p>
          <p>Email: <strong style={{ color: "#f7f7f7" }}>{usuario.email || "-"}</strong></p>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </div>
      ) : (
        <div>
          <p>No estás autenticado.</p>
          <Link href="/ecommers/login">Iniciar sesión</Link>
        </div>
      )}

      <section style={{ marginTop: "1.5rem" }}>
        <h3 style={{ color: "#58a6ff" }}>Mi carrito</h3>
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito. <Link href="/ecommers">Ir a la tienda</Link></p>
        ) : (
          <>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {carrito.map((item, i) => (
                <li key={i} style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.75rem" }}>
                  <img src={item.imagen || "/img/default.jpg"} alt={item.nombre} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#f7f7f7", fontWeight: 600 }}>{item.nombre}</div>
                    <div style={{ color: "#58a6ff" }}>${Number(item.precio).toLocaleString()}</div>
                  </div>
                  <button className="logout-btn" onClick={() => removeItem(i)}>Eliminar</button>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "0.75rem" }}>
              <strong>Total: </strong><span style={{ color: "#58a6ff" }}>${Number(total).toLocaleString()}</span>
            </div>
            <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.75rem" }}>
              <button className="add-btn" onClick={() => alert("Proceder a pago (simulado)")}>Pagar</button>
              <button className="logout-btn" onClick={clearCart}>Vaciar carrito</button>
            </div>
          </>
        )}
      </section>

      <footer className="footer" style={{ marginTop: "2rem" }}>
        <p>© {new Date().getFullYear()} ECOMMERS — Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
