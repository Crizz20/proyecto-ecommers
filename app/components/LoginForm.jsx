"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import InputCustom from "./common/input";
import { useAuth } from "../context/AuthContext";

function LoginContent() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const reset = searchParams.get("reset");
    if (reset === "success") {
      setResetMessage(
        "✅ Tu contraseña fue restablecida correctamente. Inicia sesión con tu nueva contraseña."
      );
      setTimeout(() => setResetMessage(""), 5000);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await fetch("/api/usuarios/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        correo: formData.email,
        contrasena: formData.password,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      login(data.usuario);
      alert(data.msg || "Inicio de sesión exitoso");
      router.push("/ecommers");
    } else {
      alert(data.msg || "Credenciales incorrectas");
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Opción para continuar sin iniciar sesión */}
      <div className="auth-continue-section">
        <h3>¿Prefieres continuar sin iniciar sesión?</h3>
        <Link href="/ecommers" className="continue-shopping-link">
          ← Continuar comprando
        </Link>
      </div>

      {/* Formulario de login */}
      <div className="form-wrapper">
        <div className="form-container">
          <p className="title">Welcome back</p>
          {resetMessage && (
            <div className="mb-4 text-green-700 bg-green-100 p-2 rounded-lg text-center text-sm">
              {resetMessage}
            </div>
          )}
          <form className="form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              className="input"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <InputCustom
              isPassword={true}
              name="password"
              type="password"
              className="input"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className="page-link">
              <span
                className="page-link-label cursor-pointer text-blue-500 hover:underline"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </span>
            </p>
            <button type="submit" className="form-btn">
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>
          <p className="sign-up-label">
            Don't have an account?
            <a href="/ecommers/signup" className="sign-up-link">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}

export default function LoginForm() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <LoginContent />
    </Suspense>
  );
}
