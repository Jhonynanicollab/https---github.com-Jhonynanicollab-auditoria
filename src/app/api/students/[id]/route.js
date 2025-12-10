// src/app/api/students/[id]/route.js
// CÓDIGO SOLO DE SERVIDOR
import studentService from "@/db/students"; 
import { NextResponse } from 'next/server';

// DELETE /api/students/[id]
export async function DELETE(request, context) { // <-- 1. Cambiar { params } a context
  // CORRECCIÓN: Acceder a params.id a través del objeto context
  const id = context.params.id; 
  try {
    const userId = 1; // ID de administrador simulado para el Log de Auditoría
    const result = await studentService.deleteStudent(id, userId);

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.message || 'Deletion failed.' }, { status: 400 });
    }
  } catch (error) {
    console.error("API Students DELETE Error:", error);
    return NextResponse.json({ error: "Server error during deletion." }, { status: 500 });
  }
}

// PUT /api/students/[id] (Actualizar estudiante)
export async function PUT(request, context) { // <-- 2. Cambiar { params } a context
  // CORRECCIÓN: Acceder a params.id a través del objeto context
  const id = context.params.id; 
  try {
    const studentData = await request.json();
    const userId = 1; // ID de administrador simulado para el Log de Auditoría

    await studentService.updateStudent(id, studentData, userId);

    return NextResponse.json({ success: true, updatedStudent: { id, ...studentData } }, { status: 200 });
  } catch (error) {
    console.error("API Students PUT Error:", error);
    return NextResponse.json({ error: "Server error during update." }, { status: 500 });
  }
}