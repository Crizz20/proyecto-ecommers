import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../lib/config.js";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { correo, contrasena } = await req.json();

    const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);

    if (result.rows.length === 0) {
      return NextResponse.json({ msg: "Usuario no encontrado" }, { status: 404 });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return NextResponse.json({ msg: "Contraseña incorrecta" }, { status: 401 });
    }

    // Generar token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

    // Devolver también datos relevantes del usuario (sin la contraseña)
    const usuario = {
      id: user.id,
      nombre: user.nombre || user.nombre_usuario || user.nombre_completo || user.correo || "Usuario",
      email: user.correo || user.email || null,
    };

    return NextResponse.json({ msg: "Inicio de sesión exitoso", token, usuario });
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json({ msg: "Error en el servidor" }, { status: 500 });
  }
}
