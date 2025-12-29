// src/db/config.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Helper para obtener el directorio actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Definimos la ruta a la base de datos (se creará si no existe)
const dbPath = path.join(__dirname, 'asistencia.db');
// Definimos la ruta para los backups de la base de datos
const backupDir = path.join(__dirname, 'backups');

// SQL para la autocreación de la tabla crítica 'users'
// Esta es la solución al fallo CRÍTICO de DRP (ISO 8.13)
const CRITICAL_SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      full_name VARCHAR(255),
      role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'student')),
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

let dbInstance = null;

// Función para crear directorio de backups si no existe
function ensureBackupDirExists() {
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    console.log(`📁 Directorio de backups creado: ${backupDir}`);
  }
}

// Función para crear un backup automático de la base de datos
export function createDatabaseBackup() {
  try {
    ensureBackupDirExists();
    
    if (!fs.existsSync(dbPath)) {
      console.warn("⚠️ La base de datos no existe aún. No se puede crear backup.");
      return null;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(backupDir, `asistencia_backup_${timestamp}.db`);
    
    fs.copyFileSync(dbPath, backupPath);
    console.log(`✅ Backup de base de datos creado: ${backupPath}`);
    
    return backupPath;
  } catch (error) {
    console.error("❌ Error al crear backup de la base de datos:", error);
    return null;
  }
}

// Función para restaurar un backup de la base de datos
export function restoreDatabaseBackup(backupPath) {
  try {
    if (!fs.existsSync(backupPath)) {
      throw new Error(`El archivo de backup no existe: ${backupPath}`);
    }

    // Cerrar la conexión actual si existe
    if (dbInstance) {
      dbInstance.close();
      dbInstance = null;
    }

    // Crear backup del estado actual antes de restaurar
    if (fs.existsSync(dbPath)) {
      const currentBackup = path.join(backupDir, `asistencia_pre_restore_${Date.now()}.db`);
      fs.copyFileSync(dbPath, currentBackup);
      console.log(`✅ Backup preventivo creado: ${currentBackup}`);
    }

    // Restaurar el backup
    fs.copyFileSync(backupPath, dbPath);
    console.log(`✅ Base de datos restaurada desde: ${backupPath}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error al restaurar backup de la base de datos:", error);
    return false;
  }
}

// Función para listar los backups disponibles
export function listDatabaseBackups() {
  try {
    ensureBackupDirExists();
    
    const files = fs.readdirSync(backupDir)
      .filter(file => file.startsWith('asistencia_backup_') && file.endsWith('.db'))
      .map(file => ({
        name: file,
        path: path.join(backupDir, file),
        size: fs.statSync(path.join(backupDir, file)).size,
        created: fs.statSync(path.join(backupDir, file)).birthtime
      }))
      .sort((a, b) => b.created - a.created);

    return files;
  } catch (error) {
    console.error("❌ Error al listar backups:", error);
    return [];
  }
}

export async function getDbInstance() {
  if (dbInstance) {
    return dbInstance;
  }
  
  // Abrir la base de datos y configurarla para usar promesas
  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // 1. PASO DE RECUPERACIÓN ESTRUCTURAL (Nueva Implementación)
  try {
    // Ejecutamos CREATE TABLE IF NOT EXISTS para la tabla crítica (users).
    // Si la DB es nueva o el archivo se perdió, esta sentencia garantiza que 
    // la estructura mínima se cree ANTES de intentar cualquier operación.
    await dbInstance.exec(CRITICAL_SCHEMA_SQL); 
    
    // 2. PRUEBA DE CONEXIÓN E INICIALIZACIÓN (Insertar usuario si no existe)
    await dbInstance.exec(`
      -- Insertar datos iniciales si la tabla 'users' está vacía
      INSERT INTO users (email, password_hash, full_name, role) 
      SELECT 'admin@correo.com', '$2a$10$i.P/t.Q0wZ8Y.M0hJ8Vp8O', 'Administrador', 'admin' 
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@correo.com');
    `);
    console.log("✅ Conexión a la base de datos establecida y usuarios iniciales verificados.");
    
    // 3. CREAR BACKUP AUTOMÁTICO EN CONEXIÓN EXITOSA
    createDatabaseBackup();
  } catch (error) {
    // Si la DB está tan corrupta que incluso el CREATE TABLE falla, se lanza un error.
    console.error("❌ Error FATAL al inicializar la base de datos:", error);
    // En un entorno real, aquí se detendría el servicio.
  }

  return dbInstance;
}