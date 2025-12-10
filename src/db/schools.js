// src/db/schools.js
import { getDbInstance } from './config.js';

class SchoolsService {
  constructor() {}
  
  async getSchools() {
    const db = await getDbInstance();
    try {
      const schools = await db.all('SELECT * FROM schools');
      return schools;
    } catch (e) {
      console.error("Error getting schools: ", e);
      return [];
    }
  }
}

const schoolsService = new SchoolsService();
export default schoolsService;