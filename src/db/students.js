// src/db/students.js
import { getDbInstance } from './config.js'; 
import { encrypt, decrypt } from '../lib/crypto.js'; // ✅ Seguridad de datos sensibles

class StudentService {
  constructor() {}

  // ============================
  // OBTENER TODOS LOS ESTUDIANTES
  // ============================
  async getAllStudents() {
    const db = await getDbInstance();
    try {
      const students = await db.all('SELECT * FROM students');

      // 🔐 Desencriptar datos sensibles antes de enviar al frontend
      return students.map(s => ({
        ...s,
        email: decrypt(s.email),
        number: decrypt(s.number),
        selectedDays: JSON.parse(s.selected_days || '[]')
      }));
    } catch (e) {
      console.error("Error obteniendo estudiantes: ", e);
      return [];
    }
  }

  // ============================
  // AGREGAR ESTUDIANTE
  // ============================
  async addStudent(student, userId) {
    const db = await getDbInstance();
    try {
      const { code, full_name, email, number, faculty, school, selectedDays } = student;
      const selected_days_json = JSON.stringify(selectedDays);

      // 🔐 Encriptar antes de guardar
      const encryptedEmail = encrypt(email);
      const encryptedNumber = encrypt(number);

      await db.run(
        `INSERT INTO students 
        (id, code, full_name, email, number, faculty, school, selected_days, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          `stu-${code}`,
          code,
          full_name,
          encryptedEmail,
          encryptedNumber,
          faculty,
          school,
          selected_days_json
        ]
      );

      // 🧾 Auditoría
      try {
        const description = `Estudiante ${full_name} agregado (Código: ${code}).`;
        await this.#logAudit(`stu-${code}`, 'INSERT', description, userId);
      } catch (logErr) {
        console.error("Audit log error (create):", logErr);
      }

      return {
        response: true,
        message: "Estudiante agregado correctamente",
        newStudent: { id: `stu-${code}`, ...student }
      };
    } catch (e) {
      console.error("Error agregando estudiante: ", e);
      return {
        response: false,
        message: "Error al agregar estudiante"
      };
    }
  }

  // ============================
  // ACTUALIZAR ESTUDIANTE
  // ============================
  async updateStudent(id, student, userId) {
    const db = await getDbInstance();
    try {
      const { code, full_name, email, number, faculty, school, selectedDays } = student;
      const selected_days_json = JSON.stringify(selectedDays);

      // 🔐 Encriptar nuevamente al actualizar
      const encryptedEmail = encrypt(email);
      const encryptedNumber = encrypt(number);

      await db.run(
        `UPDATE students 
         SET code = ?, 
             full_name = ?, 
             email = ?, 
             number = ?, 
             faculty = ?, 
             school = ?, 
             selected_days = ?
         WHERE id = ?`,
        [
          code,
          full_name,
          encryptedEmail,
          encryptedNumber,
          faculty,
          school,
          selected_days_json,
          id
        ]
      );

      console.log("Student updated with ID:", id);

      try {
        await this.#logAudit(id, 'UPDATE', `Student updated: ${id}`, userId);
      } catch (logErr) {
        console.error("Audit log error (update):", logErr);
      }

      return { 
        success: true, 
        message: "Estudiante actualizado correctamente",
        updatedStudent: { id, ...student }
      };
    } catch (e) {
      console.error("Error actualizando estudiante: ", e);
      return {
        success: false,
        message: "Error al actualizar estudiante",
        error: e.message
      };
    }
  }

  // ============================
  // ELIMINAR ESTUDIANTE
  // ============================
  async deleteStudent(id, userId) {
    const db = await getDbInstance();
    try {
      await db.run('DELETE FROM students WHERE id = ?', [id]);
      console.log("Student deleted with ID:", id);

      try {
        await this.#logAudit(id, 'DELETE', `Student deleted: ${id}`, userId);
      } catch (logErr) {
        console.error("Audit log error (delete):", logErr);
      }

      return { success: true, id };
    } catch (e) {
      console.error("Error deleting student:", e);
      return { success: false, message: e.message };
    }
  }

  // ============================
  // AUDITORÍA (MÉTODO PRIVADO)
  // ============================
  async #logAudit(studentId, operation, description, userId) {
    const db = await getDbInstance();

    // ✅ Garantizar usuario válido (admin por defecto)
    const finalUserId = userId > 0 ? userId : 1;

    try {
      await db.run(
        `INSERT INTO student_audit_log
         (student_id, operation_type, description, changed_by_user_id)
         VALUES (?, ?, ?, ?)`,
        [studentId, operation, description, finalUserId]
      );

      console.log(`[AUDIT LOGGED] ${operation} | Student: ${studentId} | User: ${finalUserId}`);
    } catch (e) {
      console.error("Error FATAL al registrar auditoría:", e);
    }
  }
}

const studentService = new StudentService();
export default studentService;
