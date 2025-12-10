// src/app/api/students/code/[code]/route.js
// CÓDIGO SOLO DE SERVIDOR

import { getDbInstance } from "@/db/config"; 
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { code } = await params;
  if (!code) {
      return NextResponse.json({ error: "Code parameter missing" }, { status: 400 });
  }

  try {
    const db = await getDbInstance();
    // Buscar por el campo 'code' o 'id' (el QR puede contener cualquiera)
    const student = await db.get('SELECT id, code, full_name, email FROM students WHERE code = ? OR id = ?', [code, `stu-${code}`]);

    if (!student) {
      return NextResponse.json({ error: "Estudiante no encontrado en la base de datos." }, { status: 404 });
    }
    
    return NextResponse.json({ student: student }, { status: 200 });

  } catch (error) {
    console.error("API Student Search Error:", error);
    return NextResponse.json({ error: "Error de servidor al buscar estudiante." }, { status: 500 });
  }
}