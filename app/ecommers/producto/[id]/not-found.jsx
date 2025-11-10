"use client";

export default function ProductNotFound() {
  return (
    <div className="error-container">
      <h1>Producto no encontrado</h1>
      <p>Lo sentimos, el producto que buscas no existe o ha sido removido.</p>
      <a href="/ecommers" className="btn-volver">
        Volver a la tienda
      </a>
    </div>
  );
}