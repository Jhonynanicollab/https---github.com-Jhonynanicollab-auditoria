// src/db/audit.js
import { getDbInstance } from './config.js';

class AuditService {
    constructor() {}

    async getAllStudentAuditLogs() {
        const db = await getDbInstance();
        try {
            // Unir el log con la tabla de usuarios para mostrar quién realizó la acción
            const logs = await db.all(`
                SELECT 
                    sal.log_id,
                    sal.student_id,
                    sal.operation_type,
                    sal.description,
                    sal.changed_at,
                    u.email AS changed_by_email,
                    u.full_name AS changed_by_name,
                    sal.changed_by_user_id
                FROM student_audit_log sal
                LEFT JOIN users u ON sal.changed_by_user_id = u.id
                ORDER BY sal.changed_at DESC
            `);
            return logs;
        } catch (e) {
            console.error("Error fetching audit logs: ", e);
            return [];
        }
    }
}

const auditService = new AuditService();
export default auditService;