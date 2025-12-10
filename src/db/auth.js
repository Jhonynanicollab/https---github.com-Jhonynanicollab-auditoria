// src/db/auth.js
import { getDbInstance } from './config.js';
import bcrypt from 'bcryptjs';

class AuthService {
  constructor() {}

  async registerUser(email, password, fullName = "", role = "student") {
    const db = await getDbInstance();
    try {
      // 1. Hashear la contraseña (CRÍTICO para la auditoría de seguridad)
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // 2. Insertar el nuevo usuario
      const res = await db.run(
        `INSERT INTO users (email, password_hash, full_name, role, is_active) 
         VALUES (?, ?, ?, ?, ?)`,
        [email, password_hash, fullName, role, 1]
      );

      // En SQLite, res.lastID contiene el ID del usuario recién creado
      return { id: res.lastID, email, full_name: fullName, role };

    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        throw new Error("El email ya está registrado.");
      }
      console.error("Error registrando usuario: ", error);
      throw new Error("Error interno al registrar el usuario.");
    }
  }

  async loginUser(email, password) {
    const db = await getDbInstance();
    try {
      // 1. Buscar el usuario por email
      const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
      
      if (!user || !user.is_active) {
        throw new Error("Credenciales inválidas.");
      }

      // 2. Comparar la contraseña hasheada (CRÍTICO para la auditoría de seguridad)
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (!isMatch) {
        // En un sistema real, aquí registrarías el intento fallido en un log de auditoría
        throw new Error("Credenciales inválidas.");
      }
      
      // 3. Retornar el objeto de usuario (sin el hash)
      const { password_hash, ...safeUser } = user;
      return safeUser;

    } catch (error) {
      throw error;
    }
  }

  // Método auxiliar para el Login simulado en Login.jsx
  async getUserByEmail(email) {
    const db = await getDbInstance();
    const user = await db.get('SELECT id, email, full_name, role FROM users WHERE email = ? AND is_active = 1', [email]);
    return user;
  }
}

export const authService = new AuthService();