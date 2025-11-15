import { NextRequest, NextResponse } from "next/server";

// Simulamos una base de datos en memoria (en producción usarías una BD real)
const usuariosDB: Map<string, any> = new Map();

export async function PUT(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return NextResponse.json(
        { msg: "No autorizado - Token requerido" },
        { status: 401 }
      );
    }

    const { nombre, email, telefono, direccion } = await request.json();

    // Validaciones básicas
    if (!nombre || !email) {
      return NextResponse.json(
        { msg: "Nombre y email son requeridos" },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { msg: "Email inválido" },
        { status: 400 }
      );
    }

    // En una aplicación real, aquí verificarías el token y obtendrías el userId
    // Por ahora usamos el token como ID de usuario
    const userId = token;

    // Actualizar usuario en la "base de datos"
    const usuarioActualizado = {
      id: userId,
      nombre,
      email,
      telefono: telefono || "",
      direccion: direccion || "",
      updatedAt: new Date().toISOString(),
    };

    usuariosDB.set(userId, usuarioActualizado);

    return NextResponse.json(
      {
        msg: "Perfil actualizado exitosamente",
        usuario: usuarioActualizado,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { msg: "Error al actualizar perfil" },
      { status: 500 }
    );
  }
}

// GET para obtener el perfil del usuario
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { msg: "No autorizado - Token requerido" },
        { status: 401 }
      );
    }

    const usuario = usuariosDB.get(token);

    if (!usuario) {
      return NextResponse.json(
        { msg: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario, { status: 200 });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { msg: "Error al obtener perfil" },
      { status: 500 }
    );
  }
}
