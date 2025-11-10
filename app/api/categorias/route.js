import pool from "../../../lib/db";

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM categorias ORDER BY nombre ASC");
    return Response.json(result.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return Response.json(
      { error: "Error al obtener categorías" },
      { status: 500 }
    );
  }
}
