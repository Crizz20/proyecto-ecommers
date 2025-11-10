import pool from "../../../lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const categoria = searchParams.get("categoria");

  let query = `
    SELECT productos.*, categorias.nombre AS categoria_nombre
    FROM productos
    JOIN categorias ON productos.categoria_id = categorias.id
  `;
  const values = [];

  if (categoria) {
    query += " WHERE categoria_id = $1";
    values.push(categoria);
  }

  const result = await pool.query(query, values);
  return Response.json(result.rows);
}

