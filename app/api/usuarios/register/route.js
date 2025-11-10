import pool from "../../../../lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { nombre, correo, contrasena } = await req.json();

  const hashedPassword = await bcrypt.hash(contrasena, 10);

  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo",
      [nombre, correo, hashedPassword]
    );
    return NextResponse.json({ msg: "Usuario registrado correctamente", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ msg: "Error al registrar el usuario" }, { status: 500 });
  }
}
