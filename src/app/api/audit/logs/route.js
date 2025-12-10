// src/app/api/audit/logs/route.js
// CÓDIGO SOLO DE SERVIDOR (NO requiere 'use client')
import { NextResponse } from "next/server";
import auditService from "@/db/audit";

// ⚠️ Simulación de verificación de rol de Administrador.
// En una app real, esto debería leer un JWT/cookie y validar el rol.
async function verifyAdminRole(request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    // Sin token → lo tratamos como invitado
    return { role: "guest" };
  }

  // Aquí iría la lógica real de decodificar el token con su rol e ID:
  // const token = authHeader.replace("Bearer ", "");
  // const payload = verifyJwt(token);
  // return { role: payload.role, userId: payload.id };

  // Para esta demo, asumimos que si trae un Bearer token es admin:
  return { role: "admin", userId: 1 };
}

export async function GET(request) {
  // 1️⃣ Verificar rol antes de devolver logs sensibles
  const { role } = await verifyAdminRole(request);

  if (role !== "admin") {
    return NextResponse.json(
      {
        error:
          "Acceso Denegado. Esta información es confidencial y requiere rol de Administrador.",
      },
      { status: 403 }
    );
  }

  // 2️⃣ Lógica original: solo se ejecuta si es admin
  try {
    const logs = await auditService.getAllStudentAuditLogs();
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("API Audit Logs GET Error:", error);
    return NextResponse.json(
      { error: "Error de servidor al obtener los logs." },
      { status: 500 }
    );
  }
}
