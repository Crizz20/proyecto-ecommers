// app/context/AuthContext.jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  console.log("AuthProvider: montado (client)");
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
  try {
    const stored = localStorage.getItem("usuario");

    if (stored && stored !== "undefined" && stored !== "null") {
      setUsuario(JSON.parse(stored));
    } else {
      localStorage.removeItem("usuario"); // Limpia datos corruptos
    }
  } catch (e) {
    console.error("AuthContext: error parseando usuario:", e);
    localStorage.removeItem("usuario"); // Limpia si hay error
  }
}, []);


  const login = (userData) => {
    try { localStorage.setItem("usuario", JSON.stringify(userData)); } 
    catch (e) { console.error(e); }
    setUsuario(userData);
  };

  const logout = () => {
    try { 
      localStorage.removeItem("usuario");
      localStorage.removeItem("token");
    } catch (e) { console.error(e); }
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// export nombrado REQUIRED: useAuth debe existir exactamente así
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Registro detallado para depuración
    const stack = new Error().stack;
    console.error("useAuth usado fuera de AuthProvider. Stack de llamada:\n", stack);
    // DEV: devolver stub para evitar que la app crashee y permitir que veas la traza
    return {
      usuario: null,
      login: (...args) => console.warn("login() stub llamado", ...args),
      logout: () => console.warn("logout() stub llamado"),
    };
  }
  return context;
}