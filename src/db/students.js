// src/db/students.js
import { getDbInstance } from './config.js'; 
// Importar funciones para hashear (e.g., bcrypt) si se quiere implementar el registro de usuarios real.

class StudentService {
  constructor() {}

  async getAllStudents() {
    const db = await getDbInstance();
    try {
      // Consulta todos los estudiantes.
      const students = await db.all('SELECT * FROM students');
      // En una aplicación real, se debería hidratar 'selected_days' de JSON string a Array
      return students.map(s => ({
          ...s,
          selectedDays: JSON.parse(s.selected_days || '[]')
      }));
    } catch (e) {
      console.error("Error obteniendo estudiantes: ", e);
      return [];
    }
  }

  async addStudent(student, userId) {
    const db = await getDbInstance();
    try {
      // Prepara los datos para la inserción
      const { code, full_name, email, number, faculty, school, selectedDays } = student;
      const selected_days_json = JSON.stringify(selectedDays);
      
      const res = await db.run(
        `INSERT INTO students (id, code, full_name, email, number, faculty, school, selected_days, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          `stu-${code}`, // Generamos un ID basado en el código
          code, 
          full_name, 
          email, 
          number, 
          faculty, 
          school, 
          selected_days_json
        ]
      );
      
      // Registrar auditoría de creación (userId opcional — si no se pasa, el método usa 1)
      try {
        // CORRECCIÓN CLAVE: Asegurar que se pase 'INSERT' en mayúsculas
        const description = `Estudiante ${student.full_name} agregado (Código: ${student.code}).`;
        await this.#logAudit(`stu-${code}`, 'INSERT', description, userId);
      } catch (logErr) {
        // El método #logAudit ya hace su propio manejo de errores, pero capturamos por seguridad
        console.error("Audit log error (create):", logErr);
      }

      return {
        response: true,
        message: "Estudiante agregado correctamente",
        newStudent: { id: `stu-${code}`, ...student }, // Devolvemos el objeto completo
      };
    } catch (e) {
      console.error("Error agregando estudiante: ", e);
      return {
        response: false,
        message: "Error al agregar estudiante",
      };
    }
  }

  async deleteStudent(id) {
    const db = await getDbInstance();
    try {
      // Sentencia SQL para eliminar el estudiante por ID
      await db.run('DELETE FROM students WHERE id = ?', [id]);
      console.log("Student deleted with ID: ", id);
      try {
        await this.#logAudit(id, 'DELETE', `Student deleted: ${id}`, undefined);
      } catch (logErr) {
        console.error("Audit log error (delete):", logErr);
      }

      return { success: true, id };
    } catch (e) {
      console.error("Error deleting student: ", e);
      // En caso de error (e.g., si tiene asistencias asociadas), notificar.
      return { success: false, message: e.message };
    }
  }

  async updateStudent(id, student) {
    const db = await getDbInstance();
    try {
      const { code, full_name, email, number, faculty, school, selectedDays } = student;
      const selected_days_json = JSON.stringify(selectedDays);

      await db.run(
        `UPDATE students 
         SET code = ?, full_name = ?, email = ?, number = ?, faculty = ?, school = ?, selected_days = ?
         WHERE id = ?`,
        [code, full_name, email, number, faculty, school, selected_days_json, id]
      );
      console.log("Document updated with ID: ", id);
      try {
        await this.#logAudit(id, 'UPDATE', `Student updated: ${id}`, undefined);
      } catch (logErr) {
        console.error("Audit log error (update):", logErr);
      }
    } catch (e) {
      console.error("Error actualizando documento: ", e);
    }
  }

  // MÉTODO PRIVADO PARA REGISTRAR AUDITORÍA
  async #logAudit(studentId, operation, description, userId) {
    const db = await getDbInstance();
    
    // CORRECCIÓN CLAVE: Aseguramos que userId sea siempre 1 si es undefined, null o 0.
    const finalUserId = userId > 0 ? userId : 1; 

    try {
      await db.run(
        `INSERT INTO student_audit_log 
         (student_id, operation_type, description, changed_by_user_id)
         VALUES (?, ?, ?, ?)`,
        [studentId, operation, description, finalUserId]
      );
      // Agregamos un log de consola para confirmar que la traza se ejecutó:
      console.log(`[AUDIT LOGGED] Op: ${operation} by User ID: ${finalUserId}`);
    } catch (e) {
      // Es CRÍTICO mostrar este error.
      console.error("Error FATAL al registrar auditoría (Log No Guardado):", e);
    }
  }
}

const studentService = new StudentService();
export default studentService;