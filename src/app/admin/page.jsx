"use client";
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PeopleIcon from "@mui/icons-material/People";
import DescriptionIcon from "@mui/icons-material/Description";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import BarChartIcon from "@mui/icons-material/BarChart";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TableStudents from "@/features/admin/TableStudents";
import { useRouter } from "next/navigation";
import studentService from "../../firebase/students";
const Page = () => {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const dataStudents = {
    totalStudents: students.length,
    activeStudents: students.filter((student) => student.active).length,
    promedioAsistencia: students.length
      ? students.reduce((acc, student) => acc + student.asistencia, 0) /
        students.length
      : 0,
    inasistencias: students.filter((student) => !student.asistencia).length,
  };
  useEffect(() => {
    const fetchStudents = async () => {
      const students = await studentService.getAllStudents();
      setStudents(students);
      console.log(students);
    };
    fetchStudents();
  }, []);
  return (
    <Box sx={{ bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      {/* Header */}
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 1.5,
          borderRadius: 0,
          borderBottom: "1px solid #ddd",
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <PeopleIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
          <Typography variant="h6" fontWeight="bold" color="#3f51b5">
            Panel de Administración
          </Typography>
        </Box>
        <Button variant="contained" color="primary" size="small">
          Salir
        </Button>
      </Paper>

      {/* Opciones principales */}
      <Grid
        container
        spacing={2}
        sx={{ px: { xs: 2, md: 6 }, py: 3 }}
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 3,
              borderRadius: 2,
              cursor: "pointer",
              border: "1px solid #eee",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                borderColor: "#3f51b5",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
              width: "100%",
            }}
            onClick={() => router.push("/asistencia")}
          >
            <EditDocumentIcon sx={{ fontSize: 50, color: "#578bfc" }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Llamado de lista
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Gestiona y realiza el llamado de lista de los estudiantes.
              </Typography>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              gap: 2,
              p: 3,
              borderRadius: 2,
              cursor: "pointer",
              border: "1px solid #eee",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                borderColor: "#3f51b5",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              },
              width: "100%",
            }}
            onClick={() => router.push("/asistencia-historial")}
          >
            <DescriptionIcon sx={{ fontSize: 50, color: "#588" }} />
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Historial de asistencias
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver registros detallados de asistencias pasadas.
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      <Divider />

      <Grid
        container
        spacing={2}
        sx={{ px: { xs: 4, md: 14 }, py: 3 }}
        justifyContent={"center"}
        alignItems="stretch"
      >
        {[
          {
            label: "Total de Estudiantes",
            value: dataStudents.totalStudents,
            color: "#3f51b5",
            icon: <PeopleIcon sx={{ fontSize: 48, color: "#3f51b5" }} />,
          },
          {
            label: "Estudiantes Activos",
            value: dataStudents.activeStudents,
            color: "orange",
            icon: <PeopleIcon sx={{ fontSize: 48, color: "orange" }} />,
          },
          {
            label: "Promedio de Asistencia",
            value: `${dataStudents.promedioAsistencia}%`,
            color: "green",
            icon: <BarChartIcon sx={{ fontSize: 48, color: "green" }} />,
          },
          {
            label: "Total de Inasistencias",
            value: dataStudents.inasistencias,
            color: "red",
            icon: <TrendingUpIcon sx={{ fontSize: 48, color: "red" }} />,
          },
        ].map((item, i) => (
          <Grid key={i} item xs={12} sm={6} md={3}>
            <Card
              sx={{
                width: "100%", // 🔑 ocupa toda la columna
                minWidth: "320px",
                p: 3,
                borderRadius: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ overflow: "hidden" }}>
                {" "}
                {/* 🔑 controla texto largo */}
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  color="text.secondary"
                  noWrap
                >
                  {item.label}
                </Typography>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  sx={{ color: item.color }}
                  noWrap
                >
                  {item.value}
                </Typography>
              </Box>
              {item.icon}
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ px: { xs: 2, md: 6 }, py: 3 }}>
        <TableStudents />
      </Box>
    </Box>
  );
};

export default Page;
