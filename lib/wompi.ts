// lib/wompi.ts
export const WOMPI_CONFIG = {
  // Sandbox (pruebas)
  sandbox: {
    publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY_SANDBOX,
    privateKey: process.env.WOMPI_PRIVATE_KEY_SANDBOX,
    apiUrl: "https://sandbox.wompi.co/v1",
  },
  // Producción
  production: {
    publicKey: process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY_PROD,
    privateKey: process.env.WOMPI_PRIVATE_KEY_PROD,
    apiUrl: "https://production.wompi.co/v1",
  },
};

// Determinar el ambiente actual
export const WOMPI_ENV = process.env.NODE_ENV === "production" ? "production" : "sandbox";
export const WOMPI_API_URL = WOMPI_CONFIG[WOMPI_ENV].apiUrl;
export const WOMPI_PUBLIC_KEY = WOMPI_CONFIG[WOMPI_ENV].publicKey;
export const WOMPI_PRIVATE_KEY = WOMPI_CONFIG[WOMPI_ENV].privateKey;
