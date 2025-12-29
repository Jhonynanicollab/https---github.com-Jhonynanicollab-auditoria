// src/db/restore-db.js
// Script para restaurar asistencia.db desde un backup

const fs = require("fs");
const path = require("path");

// Carpeta de la base de datos y de los backups
const dbDir = __dirname;                          // src/db
const backupsDir = path.join(dbDir, "backups");   // src/db/backups
const dbFile = path.join(dbDir, "asistencia.db"); // archivo principal

// Obtener el nombre de archivo pasado como argumento:
// npm run restore-db -- asistencia_backup_2025-12-12T03-53-31-639Z.db
const backupNameArg = process.argv[2];

/**
 * Si no se pasa argumento, elegir el backup más reciente de la carpeta /backups
 */
function getLatestBackup() {
  const files = fs.readdirSync(backupsDir)
    .filter(f => f.startsWith("asistencia_backup_") && f.endsWith(".db"))
    .map(f => ({
      name: f,
      // Extra: usar fecha de modificación para ordenar
      mtime: fs.statSync(path.join(backupsDir, f)).mtime
    }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length === 0) {
    throw new Error("No se encontraron backups en src/db/backups.");
  }

  return files[0].name;
}

async function main() {
  console.log("=== RESTAURACIÓN DE BASE DE DATOS ===");

  // 1. Elegir backup
  let backupName = backupNameArg;
  if (!backupName) {
    backupName = getLatestBackup();
    console.log(`No se indicó archivo. Se usará el backup más reciente: ${backupName}`);
  }

  const backupPath = path.join(backupsDir, backupName);

  if (!fs.existsSync(backupPath)) {
    throw new Error(`El archivo de backup no existe: ${backupPath}`);
  }

  // 2. Hacer copia de seguridad del archivo actual (por si acaso)
  if (fs.existsSync(dbFile)) {
    const now = new Date().toISOString().replace(/[:.]/g, "-");
    const dbBackupLocal = path.join(backupsDir, `asistencia_before_restore_${now}.db`);
    fs.copyFileSync(dbFile, dbBackupLocal);
    console.log(`Se guardó copia de seguridad del archivo actual en: ${dbBackupLocal}`);
  }

  // 3. Copiar el backup elegido sobre asistencia.db
  fs.copyFileSync(backupPath, dbFile);
  console.log(`Base de datos restaurada desde: ${backupPath}`);
  console.log(`Archivo destino: ${dbFile}`);

  console.log("\nIMPORTANTE:");
  console.log("- Reinicia el servidor (npm run dev) para que la app use la BD restaurada.");
  console.log("- Verifica que los datos históricos (students, attendances, etc.) se hayan recuperado.");

  console.log("\nRestauración completada ✅");
}

main().catch(err => {
  console.error("❌ Error durante la restauración:", err.message);
  process.exit(1);
});
