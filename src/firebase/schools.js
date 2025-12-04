import { collection, getDocs } from "firebase/firestore";
import { db } from "./config.js";

class SchoolsService {
  constructor() {
    this.collection = collection(db, "schools");
  }
  async getSchools() {
    try {
      const querySnapshot = await getDocs(this.collection);
      const schools = [];
      querySnapshot.forEach((doc) => {
        schools.push({ id: doc.id, ...doc.data() });
      });
      return schools;
    } catch (e) {
      console.error("Error getting documents: ", e);
      return [];
    }
  }
}

const schoolsService = new SchoolsService();
export default schoolsService;
