// src/app/api/auth/login/route.js
// NO USES "use client", esto debe ser código de servidor puro
import { authService } from "@/db/auth";
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Faltan credenciales" }, { status: 400 });
    }

    // Llama al servicio de DB que usa SQLite
    const user = await authService.loginUser(email, password);

    // En una aplicación real, aquí se establecería una cookie o token de sesión.
    // Por ahora, solo devolvemos el rol.
    const { role, id } = user; 
    
    return NextResponse.json({ 
      success: true, 
      user: { id, email, role } 
    });

  } catch (error) {
    console.error("API Login Error:", error.message);
    return NextResponse.json({ error: "Credenciales inválidas o error de servidor." }, { status: 401 });
  }
}