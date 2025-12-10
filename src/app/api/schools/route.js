// src/app/api/schools/route.js
import schoolsService from "@/db/schools"; // CÓDIGO SOLO DE SERVIDOR
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const schools = await schoolsService.getSchools();
    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("API Schools GET Error:", error);
    return NextResponse.json({ error: "Error fetching schools." }, { status: 500 });
  }
}