import pool from "../../../lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { carritoId, productoId, cantidad } = await req.json();

  const result = await pool.query(
    "INSERT INTO carrito_items (carrito_id, producto_id, cantidad) VALUES ($1, $2, $3) RETURNING *",
    [carritoId, productoId, cantidad]
  );

  return NextResponse.json(result.rows[0]);
}
