// src/db/config.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';

// Helper para obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Definimos la ruta a la base de datos (se creará si no existe)
const dbPath = path.join(__dirname, 'asistencia.db'); 

let dbInstance = null;

export async function getDbInstance() {
  if (dbInstance) {
    return dbInstance;
  }
  
  // Abrir la base de datos y configurarla para usar promesas
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // PRUEBA DE CONEXIÓN E INICIALIZACIÓN (Opcional, pero útil)
  try {
    await dbInstance.exec(`
      -- Insertar datos iniciales si la tabla 'users' está vacía
      -- Esto es clave para las credenciales de prueba.
      INSERT INTO users (email, password_hash, full_name, role) 
      SELECT 'admin@correo.com', '$2a$10$i.P/t.Q0wZ8Y.M0hJ8Vp8O', 'Administrador', 'admin' -- La contraseña es '123456' hasheada con bcrypt (simulación)
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@correo.com');
    `);
    console.log("✅ Conexión a la base de datos establecida y usuarios iniciales verificados.");
  } catch (error) {
    console.error("Error al inicializar la base de datos:", error);
  }

  return dbInstance;
}