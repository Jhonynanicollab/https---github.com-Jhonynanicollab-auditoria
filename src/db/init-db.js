// src/db/init-db.js
import { getDbInstance } from './config.js';
import { faculties, schools, students } from './seed.js'; // Importamos la data original
import bcrypt from 'bcryptjs';

// --------------------------------------------------------
// 1. Definición del Esquema SQL
// --------------------------------------------------------
const CREATE_TABLES_SQL = `
-- Eliminar tablas si existen (útil para desarrollo)
DROP TABLE IF EXISTS attendances;
DROP TABLE IF EXISTS student_audit_log;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS schools;
DROP TABLE IF EXISTS faculties;
DROP TABLE IF EXISTS users;

-- Tabla de Usuarios (Controles de Acceso)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK(role IN ('admin', 'student')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de Catálogo
CREATE TABLE faculties (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE schools (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    faculty_id VARCHAR(50) NOT NULL,
    FOREIGN KEY (faculty_id) REFERENCES faculties(id)
);

-- Tabla de Estudiantes
CREATE TABLE students (
    id VARCHAR(50) PRIMARY KEY, 
    code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    number VARCHAR(20),
    faculty VARCHAR(255),
    school VARCHAR(255),  
    selected_days VARCHAR(50) DEFAULT '[]', 
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Registros de Asistencia (Transactional)
CREATE TABLE attendances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    dayOfWeek VARCHAR(20),
    status VARCHAR(20) NOT NULL CHECK(status IN ('presente', 'ausente', 'tardanza')),
    full_name VARCHAR(255),
    code VARCHAR(50),
    recorded_by_user_id INTEGER, 
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (recorded_by_user_id) REFERENCES users(id),
    UNIQUE (student_id, date)
);

-- Tabla de Auditoría (Control de Cambios)
CREATE TABLE student_audit_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(50) NOT NULL,
    operation_type VARCHAR(10) NOT NULL CHECK(operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
    description TEXT, 
    changed_by_user_id INTEGER, 
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (changed_by_user_id) REFERENCES users(id)
);
`;

// --------------------------------------------------------
// 2. Función de Inicialización y Seeding
// --------------------------------------------------------
async function initializeDatabase() {
    const db = await getDbInstance();
    
    console.log("-----------------------------------------");
    console.log("🚀 Iniciando la creación de tablas...");
    await db.exec(CREATE_TABLES_SQL);
    console.log("✅ Tablas creadas exitosamente.");
    
    // --- Seed de Usuarios (Hashed Password) ---
    console.log("➡️ Sembrando Usuarios...");
    const adminPasswordHash = await bcrypt.hash('123456', 10);
    await db.run(
        `INSERT INTO users (email, password_hash, full_name, role) 
         VALUES (?, ?, ?, ?)`,
        ['admin@correo.com', adminPasswordHash, 'Admin Principal', 'admin']
    );
    await db.run(
        `INSERT INTO users (email, password_hash, full_name, role) 
         VALUES (?, ?, ?, ?)`,
        ['estudiante@correo.com', adminPasswordHash, 'Estudiante de Prueba', 'student']
    );
    const adminUser = await db.get(`SELECT id FROM users WHERE email='admin@correo.com'`);
    console.log(`- Administrador Creado (ID: ${adminUser.id})`);


    // --- Seed de Catálogos (Facultades y Escuelas) ---
    console.log("➡️ Sembrando Catálogos...");
    for (const fac of faculties) {
        await db.run(`INSERT INTO faculties (id, name) VALUES (?, ?)`, [fac.id, fac.name]);
    }
    for (const sch of schools) {
        await db.run(`INSERT INTO schools (id, name, faculty_id) VALUES (?, ?, ?)`, [sch.id, sch.name, sch.facultyId]);
    }
    console.log(`- ${faculties.length} Facultades y ${schools.length} Escuelas sembradas.`);


    // --- Seed de Estudiantes ---
    console.log("➡️ Sembrando Estudiantes (Migración de seed.js)...");
    for (const stu of students) {
        // En SQLite, JSON.stringify los días.
        const selectedDaysJson = JSON.stringify(stu.selectedDays); 
        await db.run(
            `INSERT INTO students 
             (id, code, full_name, email, faculty, school, selected_days, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [stu.id, stu.code, stu.full_name, stu.email, stu.faculty, stu.school, selectedDaysJson, stu.status, stu.createdAt]
        );
    }
    console.log(`- ${students.length} Estudiantes sembrados.`);

    console.log("-----------------------------------------");
    console.log("🎉 Inicialización de DB completa y lista para auditoría.");
}

initializeDatabase();