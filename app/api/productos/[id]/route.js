import pool from '../../../../lib/db';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    // En algunas versiones del App Router `params` puede ser una promesa.
    // Aseguramos que esté resuelta antes de acceder a sus propiedades.
    const resolvedParams = await params;
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json(
        { error: 'ID de producto no proporcionado' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT 
        p.id,
        p.nombre,
        p.descripcion,
        p.precio,
        p.imagen,
        p.stock,
        c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el producto' },
      { status: 500 }
    );
  }
}