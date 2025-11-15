"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import "../../styles/ecommers.css";
import "../../styles/carrito.css";

export default function CarritoPage() {
  const { usuario, logout } = useAuth() as any;
  const [carrito, setCarrito] = useState<any[]>([]);
  const [cantidades, setCantidades] = useState<{ [key: number]: number }>({});
  const [shippingMethod, setShippingMethod] = useState<string>("pickup");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("carrito");
      const stored = raw ? JSON.parse(raw) : [];
      setCarrito(stored);

      // Inicializar cantidades
      const initialQuantities: { [key: number]: number } = {};
      stored.forEach((item: any, i: number) => {
        initialQuantities[i] = item.cantidad || 1;
      });
      setCantidades(initialQuantities);
    } catch (e) {
      console.error("Error leyendo carrito:", e);
      setCarrito([]);
    }
  }, []);

  const removeItem = (index: number) => {
    const copy = [...carrito];
    copy.splice(index, 1);
    setCarrito(copy);

    const newCantidades = { ...cantidades };
    delete newCantidades[index];
    setCantidades(newCantidades);

    localStorage.setItem("carrito", JSON.stringify(copy));
  };

  const clearCart = () => {
    setCarrito([]);
    setCantidades({});
    localStorage.removeItem("carrito");
  };

  const updateQuantity = (index: number, cantidad: number) => {
    if (cantidad < 1) return;
    setCantidades({ ...cantidades, [index]: cantidad });

    const copy = [...carrito];
    copy[index].cantidad = cantidad;
    localStorage.setItem("carrito", JSON.stringify(copy));
  };

  const handleLogout = () => {
    try {
      logout();
    } catch (e) {
      console.error(e);
    }
  };

  const subtotal = carrito.reduce((sum, item, i) => {
    const cantidad = cantidades[i] || 1;
    return sum + Number(item.precio || 0) * cantidad;
  }, 0);

  const shippingCost = shippingMethod === "pickup" ? 0 : 40000;
  const total = subtotal + shippingCost;

  return (
    <div className="carrito-page">
      {/* Header del carrito */}
      <div className="carrito-header">
        <h1>MI Carrito</h1>
        <Link href="/ecommers" className="continue-link">
          ← Continuar comprando
        </Link>
      </div>

      {carrito.length === 0 ? (
        <div className="empty-cart">
          <p>No hay productos en el carrito.</p>
          <Link href="/ecommers" className="back-link">
            Ir a la tienda
          </Link>
        </div>
      ) : (
        <div className="carrito-container">
          {/* Tabla de productos */}
          <div className="carrito-items">
            <table className="cart-table">
              <thead>
                <tr>
                  <th>PRODUCTO</th>
                  <th>PRECIO</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrito.map((item, i) => {
                  const cantidad = cantidades[i] || 1;
                  const itemTotal = Number(item.precio || 0) * cantidad;

                  return (
                    <tr key={i} className="cart-item-row">
                      <td className="product-cell">
                        <div className="product-info-cart">
                          <img
                            src={item.imagen || "/img/default.jpg"}
                            alt={item.nombre}
                            className="product-img-cart"
                          />
                          <div>
                            <div className="product-name">{item.nombre}</div>
                            <div className="product-details">
                              {item.sku || "N/A"}
                            </div>
                            {item.variantes && (
                              <div className="product-variants">
                                {item.variantes}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="price-cell">
                        <span className="price-label">+</span> $
                        {Number(item.precio).toFixed(2)}
                      </td>
                      <td className="qty-cell">
                        <div className="qty-control">
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(i, cantidad - 1)}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={cantidad}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val)) updateQuantity(i, val);
                            }}
                            className="qty-input"
                          />
                          <button
                            className="qty-btn"
                            onClick={() => updateQuantity(i, cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="total-cell">${itemTotal.toFixed(2)}</td>
                      <td className="remove-cell">
                        <button
                          className="remove-btn"
                          onClick={() => removeItem(i)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Panel derecho: Resumen y opciones de envío */}
          <div className="carrito-sidebar">
            {/* Opciones de envío */}
            <div className="shipping-section">
              <h3>Elige el modo de envío:</h3>

              <div className="shipping-option">
                <input
                  type="radio"
                  id="pickup"
                  name="shipping"
                  value="pickup"
                  checked={shippingMethod === "pickup"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <label htmlFor="pickup">
                  <span className="shipping-title">
                    Recoger en tienda (en 30 minutos)
                  </span>
                  <span className="shipping-badge">GRATIS</span>
                </label>
              </div>

              <div className="shipping-option">
                <input
                  type="radio"
                  id="delivery"
                  name="shipping"
                  value="delivery"
                  checked={shippingMethod === "delivery"}
                  onChange={(e) => setShippingMethod(e.target.value)}
                />
                <label htmlFor="delivery">
                  <span className="shipping-title">
                    Entrega a domicilio (en menos de 2 días)
                  </span>
                  
                  <span className="shipping-cost">$40000.00</span>
                </label>
              </div>
            </div>

            {/* Resumen de precios */}
            <div className="price-summary">
              <div className="summary-row">
                <span>SUBTOTAL TTC</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>ENVIO</span>
                <span>
                  {shippingCost === 0 ? "free" : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="summary-row total-row">
                <span>TOTAL</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="carrito-actions">
              <button
                className="checkout-btn"
                onClick={() => {
                  if (!usuario) {
                    window.location.href = "/ecommers/login";
                    return;
                  }
                  // Guardar el carrito en localStorage con cantidades actualizadas
                  const carritoActualizado = carrito.map((item, i) => ({
                    ...item,
                    cantidad: cantidades[i] || 1,
                  }));
                  localStorage.setItem("carrito", JSON.stringify(carritoActualizado));
                  // Redirigir a la página de pago
                  window.location.href = "/ecommers/pago";
                }}
              >
                Verificar
                <span className="checkout-amount">${total.toFixed(2)} €</span>
              </button>
              <button className="clear-cart-btn" onClick={clearCart}>
                Limpiar carrito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Perfil del usuario - Opcional al inicio o escondido */}
      {usuario && (
        <div className="user-profile-footer">
          <p>
            Usuario: <strong>{usuario.nombre}</strong>
          </p>
          <button className="logout-btn-small" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
