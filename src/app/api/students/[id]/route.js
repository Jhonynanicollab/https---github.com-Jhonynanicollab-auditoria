// src/app/api/students/[id]/route.js
// CÓDIGO SOLO DE SERVIDOR
import { NextResponse } from "next/server";
import studentService from "@/db/students";

// ⚠️ IMPORTANTE: Esta función simula la verificación del rol de Administrador.
// En una app real, el rol se obtendría de un token (JWT) en el header de la petición.
async function verifyAdminRole(request) {
  // En un entorno real, aquí se leería una cookie o un header Authorization
  // y se validaría un JWT para obtener el rol e ID del usuario.

  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Sin token → lo tratamos como invitado (no autorizado)
    return { role: "guest" };
  }

  // Aquí iría la lógica real de decodificar el token:
  // const token = authHeader.replace("Bearer ", "");
  // const payload = verifyJwt(token);
  // return { role: payload.role, userId: payload.id };

  // Para esta demo asumimos que si trae un Bearer token, es admin:
  return { role: "admin", userId: 1 };
}

// DELETE /api/students/[id]
export async function DELETE(request, context) {
  // ⬅️ CORRECCIÓN: params es una promesa → hay que hacer await
  const { id } = await context.params;

  // 1. Verificar rol antes de tocar la BD
  const { role, userId } = await verifyAdminRole(request);

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Acceso Denegado. Se requiere rol de Administrador." },
      { status: 403 }
    );
  }

  // 2. Lógica original de borrado (solo si es admin)
  try {
    const result = await studentService.deleteStudent(id, userId);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.message || "Deletion failed." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API Students DELETE Error:", error);
    return NextResponse.json(
      { error: "Server error during deletion." },
      { status: 500 }
    );
  }
}

// PUT /api/students/[id] (Actualizar estudiante)
export async function PUT(request, context) {
  // ⬅️ CORRECCIÓN IGUAL AQUÍ
  const { id } = await context.params;

  // 1. Verificar rol antes de actualizar
  const { role, userId } = await verifyAdminRole(request);

  if (role !== "admin") {
    return NextResponse.json(
      { error: "Acceso Denegado. Se requiere rol de Administrador." },
      { status: 403 }
    );
  }

  // 2. Lógica original de actualización (solo si es admin)
  try {
    const studentData = await request.json();

    await studentService.updateStudent(id, studentData, userId);

    return NextResponse.json(
      { success: true, updatedStudent: { id, ...studentData } },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Students PUT Error:", error);
    return NextResponse.json(
      { error: "Server error during update." },
      { status: 500 }
    );
  }
}
