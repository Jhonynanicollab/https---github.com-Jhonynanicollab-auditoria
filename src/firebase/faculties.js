import { collection, getDocs } from "firebase/firestore";
import { db } from "./config.js";

class FacultiesService {
  constructor() {
    this.collection = collection(db, "faculties");
  }
  async getFaculties() {
    try {
      const querySnapshot = await getDocs(this.collection);
      const faculties = [];
      querySnapshot.forEach((doc) => {
        faculties.push({ id: doc.id, ...doc.data() });
      });
      return faculties;
    } catch (e) {
      console.error("Error getting documents: ", e);
      return [];
    }
  }
}

const facultiesService = new FacultiesService();
export default facultiesService;
