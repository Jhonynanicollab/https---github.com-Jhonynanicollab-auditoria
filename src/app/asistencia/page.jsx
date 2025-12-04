"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  AccessTime,
  Groups,
  ArrowBack,
  Search,
} from "@mui/icons-material";
import StackStudents from "./StackStudents";
import TableStudentsDesktop from "./TableStudentsDesktop";
import studentService from "@/firebase/students";
import { useRouter } from "next/navigation";
import attendanceService from "@/firebase/attendance";
import { toast } from "react-toastify";
// Materias ejemplo
const optionsFilter = ["Obligatorio", "Todos"];

const days = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
const AttendanceScreen = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [indexDay, setIndexDay] = useState(new Date().getDay()); // 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie, 6=Sáb
  const validateCompleteAttendance = (students) => {
    return students.every((s) => s.estado !== "Pendiente");
  };
  const handleSaveAttendance = async () => {
    if (!validateCompleteAttendance(students)) {
      alert("Por favor, complete la asistencia de todos los estudiantes.");
      return;
    }
    // Lógica para guardar la
    setIsLoading(true);
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
    const attendanceData = {
      date: peruDate,
      students: students.map((s) => ({
        id: s.id,
        estado: s.estado,
        full_name: s.full_name,
        code: s.code,
      })),
    };
    toast.success("Asistencia guardada correctamente");
    await attendanceService.addAttendance(attendanceData);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Simula loading
  };

  const handleEstado = (id, estado) => {
    const newStatesStudents = students.map((s) =>
      s.id === id ? { ...s, estado } : s
    );
    setStudents(newStatesStudents);
    // Actualizar estado en localStorage
    localStorage.setItem("students", JSON.stringify(newStatesStudents));
  };
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await studentService.getAllStudents();
      // Filtrar estudiantes que tienen clases el día actual
      const filtered = data.filter((s) => s.selectedDays.includes(indexDay));
      filtered.forEach((s) => (s.estado = "Pendiente"));
      const storedStudents = localStorage.getItem("students");
      if (storedStudents) {
        const parsedStudents = JSON.parse(storedStudents);
        // Actualizar estados desde localStorage
        filtered.forEach((s) => {
          const storedStudent = parsedStudents.find((st) => st.id === s.id);
          if (storedStudent) {
            s.estado = storedStudent.estado;
          }
        });
      }
      setStudents(filtered);
    };
    fetchStudents();
  }, []);

  // Contadores
  const presentes = students.filter((s) => s.estado === "Presente").length;
  const ausentes = students.filter((s) => s.estado === "Ausente").length;
  const tardanzas = students.filter((s) => s.estado === "Tardanza").length;
  const pendientes = students.filter((s) => s.estado === "Pendiente").length;
  // Filtro por búsqueda
  const filteredStudents = students.filter(
    (s) =>
      s.full_name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.includes(search.toLowerCase())
  );
  return (
    <Box p={3} sx={{ backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "center" }}
        gap={2}
        mb={3}
        sx={{ backgroundColor: "white", p: 2, borderRadius: 2, boxShadow: 1 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            startIcon={<ArrowBack />}
            variant="text"
            sx={{ textTransform: "none" }}
            onClick={() => router.push("/admin")}
          >
            Volver
          </Button>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Llamado de Lista ({new Date().toLocaleDateString("es-ES")})
          </Typography>
        </Box>

        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
          <TextField
            size="small"
            placeholder="Buscar por código, nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: "gray" }} />,
            }}
            sx={{ minWidth: { xs: "100%", sm: 220, md: 340 } }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveAttendance}
          >
            Guardar Asistencia
          </Button>
        </Box>
      </Box>

      {/* Indicadores */}
      <Grid
        container
        spacing={2}
        mb={3}
        sx={{
          width: "100%",
        }}
        justifyContent="center"
        alignItems="stretch"
        display={{ sm: "flex" }}
      >
        <Grid
          item
          xs={6}
          sm={3}
          sx={{
            minWidth: { xs: 110, md: 250 },
            flexGrow: 1,
          }}
        >
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <CheckCircle color="success" fontSize="large" />
              <Typography variant="body1">Presentes</Typography>
              <Typography variant="h5" fontWeight="bold">
                {presentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={6}
          sm={3}
          sx={{ minWidth: { xs: 110, md: 250 }, flexGrow: 1 }}
        >
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Cancel color="error" fontSize="large" />
              <Typography variant="body1">Ausentes</Typography>
              <Typography variant="h5" fontWeight="bold">
                {ausentes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ minWidth: { xs: 110, md: 250 }, flexGrow: 1 }}
        >
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <AccessTime color="warning" fontSize="large" />
              <Typography variant="body1">Tardanzas</Typography>
              <Typography variant="h5" fontWeight="bold">
                {tardanzas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ minWidth: { xs: 110, md: 250 }, flexGrow: 1 }}
        >
          <Card sx={{ borderRadius: 2 }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Groups color="primary" fontSize="large" />
              <Typography variant="body1">Pendientes</Typography>
              <Typography variant="h5" fontWeight="bold">
                {pendientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de estudiantes */}
      <Card sx={{ borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2} fontWeight="bold">
            Lista de Estudiantes
          </Typography>
          {!isMobile ? (
            <TableStudentsDesktop
              filteredStudents={filteredStudents}
              handleEstado={handleEstado}
            />
          ) : (
            <StackStudents
              filteredStudents={filteredStudents}
              handleEstado={handleEstado}
            />
          )}
        </CardContent>
      </Card>

      {/* loader */}
      {isLoading && (
        <Box
          sx={{
            textAlign: "center",
            py: 2,
            position: "fixed",
            inset: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default AttendanceScreen;
