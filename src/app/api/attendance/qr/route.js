// src/app/api/attendance/qr/route.js
// CÓDIGO SOLO DE SERVIDOR
import attendanceService from "@/db/attendance"; 
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { studentId, studentData } = await request.json();
    
    // Preparar el registro de asistencia
    const attendanceRecord = {
      // Usamos YYYY-MM-DD como formato de fecha
      date: new Date().toISOString().substring(0, 10), 
      students: [{
          id: studentId, 
          estado: "Presente", 
          full_name: studentData.full_name || studentId,
          code: studentData.code || studentId
      }],
    };

    // CLAVE DE AUDITORÍA: Usamos el ID del estudiante para el campo userId.
    // Esto traza que el propio estudiante (o su dispositivo) hizo el registro.
    const result = await attendanceService.addAttendance(attendanceRecord, studentId); 
    
    if (result.response) {
      return NextResponse.json({ success: true, message: "Asistencia registrada con éxito." }, { status: 201 });
    } else {
      return NextResponse.json({ success: false, message: result.message || "Error al registrar asistencia." }, { status: 400 });
    }
  } catch (error) {
    console.error("API QR Attendance POST Error:", error);
    return NextResponse.json({ success: false, message: "Error interno al procesar el QR." }, { status: 500 });
  }
}