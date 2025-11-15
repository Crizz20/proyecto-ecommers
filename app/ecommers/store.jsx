"use client";
import { useAuth } from "../context/AuthContext";
import ProductStore from "../components/ProductStore";

export default function StorePage() {
  const { usuario } = useAuth();

  return (
    <ProductStore 
      isAuthenticated={!!usuario}
      usuario={usuario}
      heroTitle="Nuevos Productos Esenciales"
      heroText="Cómodos, modernos y versátiles."
    />
  );
}
