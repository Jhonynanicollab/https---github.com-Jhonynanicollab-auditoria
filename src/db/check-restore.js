// src/db/check-restore.js
const fs = require('fs');
const path = require('path');

const DB_DIR = __dirname;
const DB_FILE = path.join(DB_DIR, 'asistencia.db');
const BACKUPS_DIR = path.join(DB_DIR, 'backups');

function autoRestore() {
    // 1. Verificar si la base de datos YA existe
    if (fs.existsSync(DB_FILE)) {
        console.log('✅ [CHECK] La base de datos existe. Iniciando sistema normalmente...');
        return;
    }

    console.warn('⚠️ [ALERTA] No se encontró asistencia.db. Buscando backups para restauración automática...');

    // 2. Verificar si hay backups disponibles
    if (!fs.existsSync(BACKUPS_DIR)) {
        console.error('❌ [ERROR] No hay carpeta de backups. Iniciando con base de datos VACÍA.');
        return;
    }

    const files = fs.readdirSync(BACKUPS_DIR)
        .filter(f => f.startsWith("asistencia_backup_") && f.endsWith(".db"))
        .map(f => ({
            name: f,
            time: fs.statSync(path.join(BACKUPS_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // Ordenar del más nuevo al más viejo

    if (files.length === 0) {
        console.error('❌ [ERROR] La carpeta de backups está vacía. Iniciando con base de datos VACÍA.');
        return;
    }

    // 3. Restaurar el backup más reciente
    const latestBackup = files[0].name;
    const backupPath = path.join(BACKUPS_DIR, latestBackup);

    try {
        fs.copyFileSync(backupPath, DB_FILE);
        console.log(`♻️ [AUTO-RESTAURACIÓN] ¡ÉXITO! Sistema recuperado desde: ${latestBackup}`);
    } catch (error) {
        console.error('❌ [FATAL] Falló la auto-restauración:', error);
    }
}

autoRestore();