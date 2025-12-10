// src/db/attendance.js
import { getDbInstance } from './config.js';

class AttendanceService {
  constructor() {}

  async getAttendances() {
    const db = await getDbInstance();
    try {
      // 1. Obtener todas las fechas con asistencia
      const dateRecords = await db.all('SELECT DISTINCT date, dayOfWeek FROM attendances ORDER BY date DESC');
      
      const attendances = [];

      for (const record of dateRecords) {
        const date = record.date;
        const dayOfWeek = record.dayOfWeek;
        
        // 2. Obtener todos los registros de estudiantes para esa fecha
        const studentRecords = await db.all(
          `SELECT 
             id, student_id, status, full_name, code, recorded_at 
           FROM attendances 
           WHERE date = ?`,
          [date]
        );

        // 3. Calcular totales y formatear (similar a Firebase)
        const totalPresent = studentRecords.filter(r => r.status === 'presente').length;
        const totalAbsent = studentRecords.filter(r => r.status === 'ausente').length;
        const totalLate = studentRecords.filter(r => r.status === 'tardanza').length;
        
        const records = studentRecords.reduce((acc, r) => {
          acc[r.student_id] = {
            studentId: r.student_id,
            status: r.status,
            full_name: r.full_name,
            code: r.code,
            createdAt: r.recorded_at // Usamos el campo grabado en la tabla
          };
          return acc;
        }, {});

        // Suponemos que el createdAt general es el del primer registro para simplicidad
        const createdAt = studentRecords[0]?.recorded_at || date;

        attendances.push({
          id: date, // Usamos la fecha como ID para la vista de historial
          date: date,
          dayOfWeek,
          records,
          totalPresent,
          totalAbsent,
          totalLate,
          createdAt
        });
      }

      return attendances;

    } catch (error) {
      console.error("Error fetching attendances: ", error);
      return [];
    }
  }

  async addAttendance(attendance, userId) {
    const db = await getDbInstance();
    try {
      const { date, students } = attendance;
      
      // Determinar el día de la semana (similar a la lógica original de Firebase)
      const dateObj = new Date(date);
      const dayOfWeek = dateObj.toLocaleDateString("es-ES", { weekday: "long" });

      // Inicia una transacción para asegurar que todos los registros se inserten o ninguno
      await db.run('BEGIN TRANSACTION');

      for (const student of students) {
        const { id, estado, full_name, code } = student;
        
        // Intentar insertar o reemplazar (UPSERT) el registro de asistencia
        await db.run(
          `INSERT OR REPLACE INTO attendances 
           (student_id, date, status, full_name, code, recorded_by_user_id, recorded_at, dayOfWeek)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            id, 
            date, 
            estado.toLowerCase(), 
            full_name, 
            code, 
            userId, // Clave de auditoría: Quién registró la asistencia
            new Date().toISOString(),
            dayOfWeek
          ]
        );
      }

      await db.run('COMMIT');

      return {
        response: true,
        message: "Asistencia registrada",
      };
    } catch (e) {
      await db.run('ROLLBACK');
      console.error("Error adding document: ", e);
      return {
        response: false,
        message: "Error al registrar la asistencia",
      };
    }
  }
}

const attendanceService = new AttendanceService();
export default attendanceService;