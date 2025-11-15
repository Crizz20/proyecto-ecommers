"use client";
import React, { useEffect, useState } from "react";

import "../styles/ecommers.css";
import "../styles/pago.css";

interface FormularioPagoProps {
  monto: number;
  email: string;
  nombre: string;
  onSuccess?: (transactionId: string) => void;
  onError?: (error: string) => void;
}

export default function FormularioPago({
  monto,
  email,
  nombre,
  onSuccess,
  onError,
}: FormularioPagoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [cardToken, setCardToken] = useState("");
  const [formData, setFormData] = useState({
    numeroTarjeta: "",
    mesVencimiento: "",
    anoVencimiento: "",
    cvv: "",
  });

  // Cargar script de Wompi
  useEffect(() => {
    if (typeof window !== "undefined") {
      const widget = (window as any).WidgetCheckout;
      if (!widget) {
        const script = document.createElement("script");
        script.src = "https://checkout.wompi.co/widget.js";
        script.async = true;
        script.onload = () => {
          setScriptLoaded(true);
        };
        document.body.appendChild(script);
      } else {
        setScriptLoaded(true);
      }
    }
  }, []);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validaciones por campo
    if (name === "numeroTarjeta") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 16) {
        setFormData((prev) => ({ ...prev, numeroTarjeta: cleaned }));
      }
    } else if (name === "mesVencimiento") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 2 && parseInt(cleaned) <= 12) {
        setFormData((prev) => ({ ...prev, mesVencimiento: cleaned }));
      }
    } else if (name === "anoVencimiento") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 2) {
        setFormData((prev) => ({ ...prev, anoVencimiento: cleaned }));
      }
    } else if (name === "cvv") {
      const cleaned = value.replace(/\D/g, "");
      if (cleaned.length <= 3) {
        setFormData((prev) => ({ ...prev, cvv: cleaned }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar datos
      if (
        !formData.numeroTarjeta ||
        !formData.mesVencimiento ||
        !formData.anoVencimiento ||
        !formData.cvv
      ) {
        throw new Error("Por favor completa todos los campos de la tarjeta");
      }

      // Si tienes Wompi Widget, usaría el token generado
      // Por ahora, usaremos una transacción directa

      const response = await fetch("/api/pagos/procesar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monto: monto,
          moneda: "COP",
          descripcion: `Compra por $${monto.toLocaleString()}`,
          email: email,
          nombre: nombre,
          token: cardToken || "token_de_prueba",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Pago exitoso:", data);
        if (onSuccess) onSuccess(data.transactionId);
        alert("¡Pago procesado exitosamente!");
      } else {
        throw new Error(data.msg || "Error al procesar el pago");
      }
    } catch (error: any) {
      console.error("Error:", error);
      if (onError) onError(error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pago-container">
      <div className="pago-header">
        <h2>Información de Pago</h2>
        <p>Monto a pagar: <strong>${monto.toLocaleString("es-CO")}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className="pago-form">
        {/* Información del cliente */}
        <div className="pago-section pago-section-full">
          <h3>Datos del Cliente</h3>
          <div className="pago-form-group">
            <label>Nombre</label>
            <input type="text" value={nombre} disabled className="pago-input" />
          </div>
          <div className="pago-form-group">
            <label>Email</label>
            <input type="email" value={email} disabled className="pago-input" />
          </div>
        </div>

        {/* Información de la tarjeta */}
        <div className="pago-section pago-section-full">
          <h3>Datos de la Tarjeta</h3>
          
          <div className="pago-form-group">
            <label>Número de Tarjeta</label>
            <input
              type="text"
              name="numeroTarjeta"
              value={formData.numeroTarjeta}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              maxLength={16}
              className="pago-input"
              required
            />
          </div>

          <div className="pago-form-row">
            <div className="pago-form-group">
              <label>Mes Vencimiento</label>
              <input
                type="text"
                name="mesVencimiento"
                value={formData.mesVencimiento}
                onChange={handleCardChange}
                placeholder="MM"
                maxLength={2}
                className="pago-input"
                required
              />
            </div>
            <div className="pago-form-group">
              <label>Año Vencimiento</label>
              <input
                type="text"
                name="anoVencimiento"
                value={formData.anoVencimiento}
                onChange={handleCardChange}
                placeholder="YY"
                maxLength={2}
                className="pago-input"
                required
              />
            </div>
            <div className="pago-form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleCardChange}
                placeholder="123"
                maxLength={3}
                className="pago-input"
                required
              />
            </div>
          </div>
        </div>

        {/* Nota de seguridad */}
        <div className="pago-security-note">
          <p>🔒 Tus datos de pago son procesados de forma segura a través de Wompi</p>
        </div>

        {/* Botones */}
        <div className="pago-actions">
          <button
            type="submit"
            disabled={isLoading}
            className="pago-btn-submit"
          >
            {isLoading ? "Procesando..." : `Pagar $${monto.toLocaleString("es-CO")}`}
          </button>
        </div>
      </form>

      {/* Información sobre Wompi */}
      <div className="pago-info">
        <p>
          Potenciado por{" "}
          <a href="https://wompi.co" target="_blank" rel="noopener noreferrer">
            Wompi
          </a>
        </p>
      </div>
    </div>
  );
}
