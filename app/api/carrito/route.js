import pool from "../../../lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../lib/config.js";


export async function GET(req) {
  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ msg: "Token no proporcionado" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); 
    const userId = decoded.id;

    const result = await pool.query("SELECT * FROM carritos WHERE usuario_id = $1", [userId]);

    if (result.rows.length === 0) {
      const insertResult = await pool.query(
        "INSERT INTO carritos (usuario_id) VALUES ($1) RETURNING id",
        [userId]
      );
      return NextResponse.json({ carritoId: insertResult.rows[0].id });
    }

    return NextResponse.json(result.rows[0]);
  } catch (err) {
    console.error("Error al verificar token:", err);
    return NextResponse.json({ msg: "Token inválido o expirado" }, { status: 403 });
  }
}