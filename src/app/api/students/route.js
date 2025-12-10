// src/app/api/students/route.js
import studentService from "@/db/students"; // CÓDIGO SOLO DE SERVIDOR
import { NextResponse } from 'next/server';

// GET /api/students
// Usado por admin/page.jsx para obtener la lista
export async function GET() {
  try {
    const students = await studentService.getAllStudents();
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("API Students GET Error:", error);
    return NextResponse.json({ error: "Error fetching students from DB." }, { status: 500 });
  }
}

// POST /api/students (Crear nuevo estudiante)
// Usado por TableStudents.jsx -> handleSubmitStudent
export async function POST(request) {
    try {
        const studentData = await request.json();
        const userId = 1; // ID de administrador simulado para el Log de Auditoría
        
        const result = await studentService.addStudent(studentData, userId);
        
        if (result.response) {
            return NextResponse.json(result.newStudent, { status: 201 });
        } else {
            return NextResponse.json({ error: result.message || "Failed to add student." }, { status: 400 });
        }
    } catch (error) {
        console.error("API Students POST Error:", error);
        return NextResponse.json({ error: "Server error during creation." }, { status: 500 });
    }
}