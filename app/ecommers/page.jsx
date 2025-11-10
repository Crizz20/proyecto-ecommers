"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import "../styles/ecommers.css";

export default function EcommersStorePage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const resProductos = await fetch("/api/productos");
        const productosData = await resProductos.json();
        setProductos(productosData);

        const resCategorias = await fetch("/api/categorias");
        const categoriasData = await resCategorias.json();
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };
    fetchDatos();
  }, []);

  useEffect(() => {
    const filtrados = productos.filter((producto) => {
      const coincideCategoria = categoriaSeleccionada
        ? producto.categoria_id === parseInt(categoriaSeleccionada)
        : true;
      const coincideFiltro = producto.nombre
        .toLowerCase()
        .includes(filtro.toLowerCase());
      return coincideCategoria && coincideFiltro;
    });
    setProductosFiltrados(filtrados);
  }, [productos, filtro, categoriaSeleccionada]);

  const handleAgregar = (producto) => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Nuevos Productos</h1>
          <p className="hero-text">Ven y compra lo que necesitas.</p>
          <a href="#productos" className="hero-button">
            Ver productos
          </a>
        </div>
      </section>

      {/* SECCIÓN PRINCIPAL */}
      <main className="store-container">
        <div className="filters">
          <select
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>
                {categoria.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Buscar productos..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="filter-input"
          />
        </div>

        {productosFiltrados.length === 0 ? (
          <p className="no-results">No se encontraron productos.</p>
        ) : (
          <div id="productos" className="productos-grid">
            {productosFiltrados.map((p) => (
              <div key={p.id} className="product-card">
                <Link href={`/ecommers/producto/${p.id}`} className="product-card-link">
                  <div className="image-container">
                    <img
                      src={p.imagen || "/placeholder.svg"}
                      alt={p.nombre}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h2 className="product-name">{p.nombre}</h2>
                    <p className="product-price">${Number(p.precio).toLocaleString()}</p>
                  </div>
                </Link>
                <button onClick={() => handleAgregar(p)} className="add-btn">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
