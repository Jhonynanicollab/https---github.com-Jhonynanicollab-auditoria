// src/app/api/attendance/history/route.js
// CÓDIGO SOLO DE SERVIDOR
import attendanceService from "@/db/attendance"; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Llama al servicio de DB que usa SQLite (server-side)
    const attendances = await attendanceService.getAttendances();
    return NextResponse.json(attendances, { status: 200 });
  } catch (error) {
    console.error("API Attendance History GET Error:", error);
    return NextResponse.json({ error: "Error de servidor al obtener el historial de asistencia." }, { status: 500 });
  }
}