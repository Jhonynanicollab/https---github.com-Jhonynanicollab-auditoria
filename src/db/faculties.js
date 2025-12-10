// src/db/faculties.js
import { getDbInstance } from './config.js';

class FacultiesService {
  constructor() {}
  
  async getFaculties() {
    const db = await getDbInstance();
    try {
      const faculties = await db.all('SELECT * FROM faculties');
      return faculties;
    } catch (e) {
      console.error("Error getting faculties: ", e);
      return [];
    }
  }
}

const facultiesService = new FacultiesService();
export default facultiesService;