import { collection, addDoc, setDoc, doc, getDocs } from "firebase/firestore";
import { db } from "./config.js";

class AttendanceService {
  constructor() {
    this.collection = collection(db, "attendances");
  }
  async getAttendances() {
    try {
      const querySnapshot = await getDocs(this.collection);
      const attendances = [];
      querySnapshot.forEach((doc) => {
        attendances.push({ id: doc.id, ...doc.data() });
      });
      return attendances;
    } catch (error) {
      console.error("Error fetching attendances: ", error);
      return [];
    }
  }
  async addAttendance(attendance) {
    try {
      const formattedData = await this.formatAttendanceData(attendance);
      const attendanceRef = doc(db, "attendances", formattedData.date);

      await setDoc(attendanceRef, formattedData);
      console.log("Document written with date: ", formattedData.date);
      return {
        response: true,
        message: "Asistencia registrada",
      };
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  async updateAttendance(id, attendance) {
    try {
      const docRef = doc(this.collection, id);
      await setDoc(docRef, attendance);
      console.log("Document updated with ID: ", id);
    } catch (e) {
      console.error("Error updating document: ", e);
    }
  }
  async formatAttendanceData(attendance) {
    const { students } = attendance;
    const today = new Date();
    const peruDate = new Intl.DateTimeFormat("es-PE", {
      timeZone: "America/Lima",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .format(today)
      .split("/")
      .reverse()
      .join("-");
    const totalPresent = students.filter((s) => s.estado === "Presente").length;
    const totalAbsent = students.filter((s) => s.estado === "Ausente").length;
    const totalLate = students.filter((s) => s.estado === "Tardanza").length;
    const dayOfWeek = today.toLocaleDateString("es-ES", { weekday: "long" });
    return {
      date: peruDate,
      dayOfWeek,
      records: students.reduce((acc, s) => {
        acc[s.id] = {
          studentId: s.id,
          status: s.estado.toLowerCase(),
          full_name: s.full_name,
          code: s.code,
        };
        return acc;
      }, {}),
      totalPresent,
      totalAbsent,
      totalLate,
      createdAt: today.toISOString(),
    };
  }
}

const attendanceService = new AttendanceService();
export default attendanceService;
