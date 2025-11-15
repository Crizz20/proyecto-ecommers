// app/api/pagos/procesar/route.ts
import { NextRequest, NextResponse } from "next/server";
import { WOMPI_API_URL, WOMPI_PRIVATE_KEY } from "../../../../lib/wompi";

export async function POST(request: NextRequest) {
  try {
    const { monto, moneda, descripcion, token, email, telefono, nombre } =
      await request.json();

    // Validaciones básicas
    if (!monto || !token || !email) {
      return NextResponse.json(
        { msg: "Faltan datos requeridos" },
        { status: 400 }
      );
    }

    // El monto debe estar en centavos (ej: 100000 = $1.000)
    const montoEnCentavos = Math.round(monto * 100);

    // Crear referencia única
    const referencia = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;

    // Realizar transacción con Wompi
    const response = await fetch(`${WOMPI_API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WOMPI_PRIVATE_KEY}`,
      },
      body: JSON.stringify({
        amount_in_cents: montoEnCentavos,
        currency: moneda || "COP",
        customer_email: email,
        payment_method: {
          type: "CARD",
          token: token,
        },
        reference: referencia,
        description: descripcion || "Compra en ECOMMERS",
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/ecommers/pago-confirmacion`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          msg: data.error_message || "Error al procesar el pago",
          error: data,
        },
        { status: response.status }
      );
    }

    // Pago exitoso
    return NextResponse.json(
      {
        msg: "Pago procesado exitosamente",
        transactionId: data.data.id,
        referencia: referencia,
        estado: data.data.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error procesando pago:", error);
    return NextResponse.json(
      { msg: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
