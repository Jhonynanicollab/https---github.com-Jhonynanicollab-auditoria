import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./config.js";

class StudentService {
  constructor() {
    this.collection = collection(db, "students");
  }
  async getAllStudents() {
    try {
      const querySnapshot = await getDocs(this.collection);
      const students = [];
      querySnapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });
      return students;
    } catch (e) {
      console.error("Error getting documents: ", e);
      return [];
    }
  }
  async addStudent(student) {
    try {
      const docRef = await addDoc(this.collection, student);
      console.log("Document written with ID: ", docRef.id);
      return {
        response: true,
        message: "Estudiante agregado correctamente",
        newStudent: { id: docRef.id, ...student },
      };
    } catch (e) {
      console.error("Error adding document: ", e);
      return {
        response: false,
        message: "Error al agregar estudiante",
      };
    }
  }

  async updateStudent(id, student) {
    try {
      const docRef = doc(this.collection, id);
      await setDoc(docRef, student);
      console.log("Document updated with ID: ", id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
}

const studentService = new StudentService();
export default studentService;
