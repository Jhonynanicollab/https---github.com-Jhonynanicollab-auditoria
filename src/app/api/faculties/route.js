// src/app/api/faculties/route.js
import facultiesService from "@/db/faculties"; // CÓDIGO SOLO DE SERVIDOR
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const faculties = await facultiesService.getFaculties();
    return NextResponse.json(faculties, { status: 200 });
  } catch (error) {
    console.error("API Faculties GET Error:", error);
    return NextResponse.json({ error: "Error fetching faculties." }, { status: 500 });
  }
}