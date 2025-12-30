// src/features/admin/TableStudents.jsx
"use client";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  TextField,
  MenuItem,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import EditSquareIcon from "@mui/icons-material/EditSquare";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@mui/material/styles";

// Modales y notificaciones
import ModalAddStudent from "./ModalAddStudent";
import ModalDeleteStudent from "@/features/students/ModalDeleteStudent";
import { toast } from "react-toastify";

// Mapeo de días para mostrar como texto
const daysMap = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

// --- Header con buscador, filtros y botón ---
const TableHeaderStudents = ({
  onSearch,
  onFilterFaculty,
  onAdd,
  filterFaculty,
  faculties, // ahora viene por props
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      sx={{ mb: 2 }}
      alignItems="center"
      justifyContent="space-between"
    >
      <TextField
        label="Buscar por nombre o código"
        variant="outlined"
        size="small"
        onChange={(e) => onSearch(e.target.value)}
        sx={{ flex: 1, width: "100%" }}
      />
      <TextField
        select
        label="Filtrar por facultad"
        variant="outlined"
        size="small"
        onChange={(e) => onFilterFaculty(e.target.value)}
        sx={{ minWidth: 200 }}
        value={filterFaculty}
      >
        <MenuItem value="">Todas</MenuItem>
        {(faculties || []).map((fac) => (
          <MenuItem key={fac.id} value={fac.name}>
            {fac.name}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAdd}
        sx={{ bgcolor: "#145cfc" }}
      >
        Nuevo Estudiante
      </Button>
    </Stack>
  );
};

// 🔹 Este componente recibe los datos iniciales desde el padre
// y una función refetchStudents para volver a llamar a la API.
const TableStudents = ({ initialStudentsData, refetchStudents }) => {
  const [search, setSearch] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [studentsData, setStudentsData] = useState(initialStudentsData || []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // 🆕 estados para catálogos
  const [facultiesData, setFacultiesData] = useState([]);
  const [schoolsData, setSchoolsData] = useState([]);

  // Sincronizar el estado interno con los datos del padre (API)
  useEffect(() => {
    setStudentsData(initialStudentsData || []);
  }, [initialStudentsData]);

  // 🆕 Cargar catálogos desde la API
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [facResponse, schoolResponse] = await Promise.all([
          fetch("/api/faculties"),
          fetch("/api/schools"),
        ]);

        const facs = await facResponse.json();
        const scs = await schoolResponse.json();

        setFacultiesData(facs);
        setSchoolsData(scs);
      } catch (e) {
        console.error("Error fetching catalogs:", e);
        // si quieres, aquí podrías usar toast.error(...)
      }
    };

    fetchCatalogs();
  }, []);

  const handleOpenModalEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const handleOpenModalDelete = (student) => {
    setStudentToDelete(student);
    setModalDeleteOpen(true);
  };

  // 🔁 Refactor: usar fetch API para crear/actualizar estudiante
  const handleSubmitStudent = async (student) => {
    const isEditing = !!editingStudent;
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `/api/students/${student.id}` : "/api/students";

    try {
      const response = await fetch(url, {
        method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer ADMIN_TOKEN_SIMULADO"
        },
        body: JSON.stringify(student),
      });

      if (!response.ok) {
        throw new Error(
          `Error ${isEditing ? "actualizando" : "agregando"} estudiante.`
        );
      }

      // Volver a pedir los datos al servidor
      await refetchStudents();

      setEditingStudent(null);
      setModalOpen(false);
      toast.success(
        `Estudiante ${isEditing ? "actualizado" : "agregado"} correctamente`
      );
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error de servidor al guardar.");
    }
  };

  // 🗑️ Refactor: usar fetch API para eliminar estudiante
  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;

    try {
      const response = await fetch(`/api/students/${studentToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer ADMIN_TOKEN_SIMULADO"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar estudiante.");
      }

      // Volver a pedir los datos al servidor
      await refetchStudents();

      toast.success("Estudiante eliminado correctamente");
    } catch (e) {
      console.error(e);
      toast.error(e.message || "Error al eliminar estudiante.");
    }

    setModalDeleteOpen(false);
    setStudentToDelete(null);
  };

  // Filtrado dinámico
  const filteredStudents = studentsData.filter(
    (s) =>
      (s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.code.includes(search)) &&
      (filterFaculty === "" || s.faculty === filterFaculty)
  );

  return (
    <div>
      <TableHeaderStudents
        onSearch={setSearch}
        onFilterFaculty={setFilterFaculty}
        onAdd={() => {
          setModalOpen(true);
          setEditingStudent(null);
        }}
        filterFaculty={filterFaculty}
        faculties={facultiesData} // 🔹 ahora el header recibe el catálogo
      />

      {/* Vista tipo tabla (desktop) */}
      {!isMobile ? (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 3, boxShadow: 3 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="tabla de estudiantes">
            <TableHead sx={{ bgcolor: "#f4f7fe" }}>
              <TableRow>
                <TableCell>
                  <b>Código</b>
                </TableCell>
                <TableCell>
                  <b>Nombre</b>
                </TableCell>
                <TableCell>
                  <b>Numero</b>
                </TableCell>
                <TableCell>
                  <b>Facultad</b>
                </TableCell>
                <TableCell>
                  <b>Escuela</b>
                </TableCell>
                <TableCell>
                  <b>Días</b>
                </TableCell>
                <TableCell align="center">
                  <b>Acciones</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} hover>
                  <TableCell>{student.code}</TableCell>
                  <TableCell>{student.full_name}</TableCell>
                  <TableCell>{student.number}</TableCell>
                  <TableCell>{student.faculty}</TableCell>
                  <TableCell>{student.school}</TableCell>
                  <TableCell>
                    {student.selectedDays
                      .map((d) => daysMap[d])
                      .join(", ")}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleOpenModalEdit(student)}
                      >
                        <EditSquareIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleOpenModalDelete(student)}
                      >
                        <DeleteIcon sx={{ fontSize: 18, mr: 0.5 }} />
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        // Vista tipo card (mobile)
        <Stack spacing={2}>
          {filteredStudents.map((student) => (
            <Card key={student.id} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {student.full_name} ({student.code})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {student.faculty} - {student.school}
                </Typography>
                <Typography variant="body2">📞 {student.number}</Typography>
                <Typography variant="body2">
                  Días:{" "}
                  {student.selectedDays.map((d) => daysMap[d]).join(", ")}
                </Typography>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button
                    variant="outlined"
                    size="small"
                    color="primary"
                    onClick={() => handleOpenModalEdit(student)}
                  >
                    <EditSquareIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    onClick={() => handleOpenModalDelete(student)}
                  >
                    <DeleteIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* 🔹 Pasamos catálogos al modal */}
      <ModalAddStudent
        open={modalOpen}
        handleClose={() => {
          setModalOpen(false);
          setEditingStudent(null);
        }}
        handleSave={handleSubmitStudent}
        initialData={editingStudent}
        faculties={facultiesData}
        schools={schoolsData}
      />

      <ModalDeleteStudent
        open={modalDeleteOpen}
        handleClose={() => setModalDeleteOpen(false)}
        handleDelete={handleDeleteStudent}
        studentName={studentToDelete?.full_name}
      />
    </div>
  );
};

// ✅ PropTypes actualizados a las nuevas props reales
TableStudents.propTypes = {
  initialStudentsData: PropTypes.array.isRequired,
  refetchStudents: PropTypes.func.isRequired,
};

TableHeaderStudents.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilterFaculty: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  filterFaculty: PropTypes.string.isRequired,
  faculties: PropTypes.array.isRequired,
};

export default TableStudents;
