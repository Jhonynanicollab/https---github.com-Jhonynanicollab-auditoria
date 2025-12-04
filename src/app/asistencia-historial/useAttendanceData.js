// hooks/useAttendanceData.js
import { useState, useEffect } from "react";
import attendanceService from "@/firebase/attendance";

export const useAttendanceData = () => {
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttendances = async () => {
      try {
        setLoading(true);
        const data = await attendanceService.getAttendances();
        setAttendances(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendances();
  }, []);

  return { attendances, loading, error };
};
