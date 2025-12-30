// cron-server.js
const cron = require('node-cron');
const { createBackup } = require('./src/db/backup-task');

console.log('⏳ Servicio de Backups Automáticos Iniciado...');
console.log('📅 Programación: Cada minuto (para demostración)');

// Programación de Cron
// Para demo: '* * * * *' (se ejecuta cada minuto)
// Para producción (diario a las 11pm): '0 23 * * *'
cron.schedule('* * * * *', () => {
  console.log('⏰ Ejecutando tarea programada...');
  createBackup();
});