// src/app/api/audit/logs/route.js
// CÓDIGO SOLO DE SERVIDOR (NO requiere 'use client')
import auditService from "@/db/audit"; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Llama al servicio de DB que usa SQLite
    const logs = await auditService.getAllStudentAuditLogs();
    
    // 2. Devuelve los datos en formato JSON al frontend
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error("API Audit Logs GET Error:", error);
    return NextResponse.json({ error: "Error de servidor al obtener los logs." }, { status: 500 });
  }
}