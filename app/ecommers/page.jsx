"use client";
import ProductStore from "../components/ProductStore";

export default function EcommersStorePage() {
  return (
    <ProductStore 
      isAuthenticated={false}
      heroTitle="Nuevos Productos"
      heroText="Ven y compra lo que necesitas."
    />
  );
}
