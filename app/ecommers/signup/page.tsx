"use client";
import React from "react";
import InputCustom from "../../../components/common/input";
import "../../styles/auth.css";



export default function SignUpPage() {
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Accedemos a los valores de los inputs de manera segura
    const nombre = (e.target as HTMLFormElement).name.valueOf;
    const correo = (e.target as HTMLFormElement).email.value;
    const contrasena = (e.target as HTMLFormElement).password.value;

    const res = await fetch("/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, contrasena }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg || "Usuario registrado correctamente");
      window.location.href = "/ecommers/login"; // Vuelve a la página de login
    } else {
      alert(data.msg || "Error al registrarse");
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <p className="title">Create your account</p>
        <form className="form" onSubmit={handleRegister}>
          <input type="text" name="name" placeholder="Name" className="input" />
          <input type="email" name="email" placeholder="Email" className="input" />
          <InputCustom
            isPassword={true}
            name="password"
            className="input"
            placeholder="Password"
          />
          <button className="form-btn" type="submit">Sign up</button>
        </form>
        <p className="sign-up-label">
          Already have an account?{" "}
          <a href="/ecommers/login" className="sign-up-link">Log in</a>
        </p>
      </div>
    </div>
  );
}

