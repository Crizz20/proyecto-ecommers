"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "../../../styles/ecommers.css";

// Página del detalle de producto
export default function ProductoDetalle() {
  const params = useParams();
  const router = useRouter();
  const [producto, setProducto] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!params?.id) return;
      
      try {
        // solicitamos el producto al endpoint de la API
        const res = await fetch(`/api/productos/${params.id}`);
        if (!res.ok) {
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProducto(data);
        // si el producto trae imagen, la usamos como seleccionada
        setSelectedImage(data.imagen || "/placeholder.svg");
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar el producto:", error);
        setLoading(false);
      }
    };
    fetchProducto();
  }, [params?.id]);

  // Al cambiar de producto o al cargar los datos, aseguramos que la vista
  // esté en la parte superior del contenido (evita aterrizar en la parte baja)
  useEffect(() => {
    if (!loading) {
      try {
        window.scrollTo({ top: 0, behavior: "auto" });
      } catch (e) {
        /* noop en entornos donde window no esté disponible */
      }
    }
  }, [loading, params?.id]);

  const handleAgregar = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${producto.nombre} agregado al carrito`);
  };

  const handleComprarAhora = () => {
    // agregar al carrito y redirigir al carrito para finalizar compra
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    router.push("/ecommers/carrito");
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!producto) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="producto-detalle" role="main">
      <div className="producto-detalle-grid">
        {/* columna izquierda: imagen principal + thumbnails */}
        <aside className="producto-imagen-column">
          <div className="producto-imagen-container">
            <img
              src={selectedImage || producto.imagen || "/placeholder.svg"}
              alt={producto.nombre}
              className="producto-imagen-principal"
            />
          </div>

          <div className="producto-thumbs" aria-hidden={false}>
            {/* si en un futuro el producto trae varias imágenes, mapearlas aquí */}
            {/* por ahora mostramos una miniatura (la misma imagen) */}
            <button
              className={`thumb ${selectedImage === (producto.imagen || "/placeholder.svg") ? 'active' : ''}`}
              onClick={() => setSelectedImage(producto.imagen || "/placeholder.svg")}
              aria-label={`Seleccionar imagen principal de ${producto.nombre}`}
            >
              <img src={producto.imagen || "/placeholder.svg"} alt={`miniatura ${producto.nombre}`} />
            </button>
          </div>
        </aside>

        {/* columna derecha: información del producto */}
        <section className="producto-info-detalle">
          
          <h1 className="producto-titulo">{producto.nombre}</h1>

          <div className="producto-meta">
            <div className="producto-rating">
              <div className="stars" aria-hidden>★★★★☆</div>
              <span className="reviews-count">4421 reseñas</span>
            </div>

            
          </div>

          <div className="producto-precio">${Number(producto.precio).toLocaleString()}</div>

          <div className="producto-descripcion">{producto.descripcion}</div>

          <div className="producto-atributos">
            <div className="producto-stock">Stock disponible: {producto.stock} unidades</div>
            <div className="producto-categoria">Categoría: {producto.categoria_nombre || '—'}</div>
          </div>

          <div className="producto-acciones">
            <button onClick={handleComprarAhora} className="btn-comprar" aria-label="Comprar ahora">
              Comprar ahora
            </button>
            <button onClick={handleAgregar} className="btn-agregar" aria-label="Agregar al carrito">
              Agregar al carrito
            </button>
          </div>

          <div className="producto-envio">
            <div className="envio-info">
              <span className="envio-titulo">Envío a domicilio</span>
              <span className="envio-precio">$10</span>
            </div>
            <div className="envio-tiempo">Despachado en 5-7 días hábiles</div>
          </div>
        </section>
      </div>
    </div>
  );
}