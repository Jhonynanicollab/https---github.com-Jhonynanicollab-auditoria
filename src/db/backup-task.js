// src/db/backup-task.js
const fs = require('fs');
const path = require('path');

// Ajusta las rutas según tu estructura
const DB_PATH = path.join(__dirname, 'asistencia.db');
const BACKUP_DIR = path.join(__dirname, 'backups');

function createBackup() {
    // 1. Asegurar que la carpeta existe
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    // 2. Generar nombre con fecha exacta
    const now = new Date();
    // Formato: asistencia_backup_YYYY-MM-DDTHH-mm-ss.db
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const backupName = `asistencia_backup_${timestamp}.db`;
    const destPath = path.join(BACKUP_DIR, backupName);

    try {
        // 3. Copiar archivo
        if (fs.existsSync(DB_PATH)) {
            fs.copyFileSync(DB_PATH, destPath);
            console.log(`[BACKUP] ✅ Copia de seguridad creada exitosamente: ${backupName}`);
        } else {
            console.error(`[BACKUP] ❌ Error: No se encontró la base de datos en ${DB_PATH}`);
        }
    } catch (error) {
        console.error(`[BACKUP] ❌ Error al crear copia de seguridad:`, error);
    }
}

// Permitir ejecutarlo directamente o importarlo
if (require.main === module) {
    createBackup();
}

module.exports = { createBackup };