"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import FormularioPago from "../../components/FormularioPago";
import "../../styles/ecommers.css";
import "../../styles/pago.css";

export default function PagoPage() {
  const { usuario } = useAuth() as any;
  const router = useRouter();
  const [carrito, setCarrito] = React.useState<any[]>([]);
  const [total, setTotal] = React.useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Dar tiempo a que AuthContext cargue desde localStorage
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!usuario) {
      router.push("/ecommers/login");
      return;
    }

    // Cargar carrito
    const carritoData = JSON.parse(localStorage.getItem("carrito") || "[]");
    setCarrito(carritoData);

    // Calcular total
    const subtotal = carritoData.reduce((sum: number, item: any) => {
      return sum + Number(item.precio || 0) * (item.cantidad || 1);
    }, 0);
    setTotal(subtotal);
    setIsLoading(false);
  }, [usuario, router, isCheckingAuth]);

  const handlePaymentSuccess = (transactionId: string) => {
    console.log("Pago exitoso:", transactionId);
    // Limpiar carrito
    localStorage.removeItem("carrito");
    // Redirigir a confirmación
    router.push(`/ecommers/pago-confirmacion?transactionId=${transactionId}`);
  };

  const handlePaymentError = (error: string) => {
    console.error("Error en pago:", error);
  };

  if (isCheckingAuth || !usuario) {
    return <div>Cargando...</div>;
  }

  if (isLoading) {
    return <div>Preparando pago...</div>;
  }

  return (
    <div className="pago-page">
      <FormularioPago
        monto={total}
        email={usuario.email}
        nombre={usuario.nombre}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
}
