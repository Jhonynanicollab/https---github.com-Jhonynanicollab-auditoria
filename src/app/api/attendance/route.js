// src/app/api/attendance/route.js
// CÓDIGO SOLO DE SERVIDOR
import attendanceService from "@/db/attendance"; 
import { NextResponse } from 'next/server';

// POST /api/attendance (Guardar asistencia)
export async function POST(request) {
  try {
    const attendanceData = await request.json();
    const { attendance, userId } = attendanceData; // Recibimos la data y el ID del admin

    const result = await attendanceService.addAttendance(attendance, userId);
    
    if (result.response) {
      return NextResponse.json({ success: true, message: result.message }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.message || "Error al registrar asistencia." }, { status: 400 });
    }
  } catch (error) {
    console.error("API Attendance POST Error:", error);
    return NextResponse.json({ error: "Error interno al guardar la asistencia." }, { status: 500 });
  }
}