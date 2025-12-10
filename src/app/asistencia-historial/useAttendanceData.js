// src/app/asistencia-historial/useAttendanceData.js
import { useState, useEffect } from "react";
// ELIMINAR: import attendanceService from "@/db/attendance"; // Eliminado para solucionar error 'fs'

export const useAttendanceData = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        setError(null);

        // AHORA LLAMA AL ROUTE HANDLER
        const response = await fetch('/api/attendance/history');
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Fallo al cargar el historial de asistencia.');
        }

        const data = await response.json();
        setAttendances(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  return { attendances, loading, error };
};