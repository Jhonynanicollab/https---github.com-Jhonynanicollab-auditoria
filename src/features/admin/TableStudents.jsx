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
import studentService from "@/firebase/students";
import ModalAddStudent from "./ModalAddStudent";
import { faculties } from "@/firebase/seed";
import { toast } from "react-toastify";
// Mapeo de días para mostrar como texto
const daysMap = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
// --- Header con buscador, filtros y botón ---
const TableHeaderStudents = ({
  onSearch,
  onFilterFaculty,
  onAdd,
  filterFaculty,
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
        {faculties.map((fac) => (
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

const TableStudents = () => {
  const [search, setSearch] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [studentsData, setStudentsData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  useEffect(() => {
    const fetchStudents = async () => {
      const data = await studentService.getAllStudents();
      setStudentsData(data);
    };
    fetchStudents();
  }, []);
  const handleOpenModalEdit = (student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };
  const handleSubmitStudent = async (student) => {
    if (editingStudent) {
      // Actualizar estudiante existente
      const updatedStudents = studentsData.map((s) =>
        s.id === student.id ? student : s
      );
      setStudentsData(updatedStudents);
      await studentService.updateStudent(student.id, student);
      setEditingStudent(null);
      toast.success("Estudiante actualizado correctamente");
    } else {
      // Agregar nuevo estudiante
      const { newStudent } = await studentService.addStudent(student);
      console.log(" newStudent", newStudent);
      setStudentsData([...studentsData, newStudent]);
      toast.success("Estudiante agregado correctamente");
    }
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
        onAdd={() => setModalOpen(true)}
        filterFaculty={filterFaculty}
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
                    {student.selectedDays.map((d) => daysMap[d]).join(", ")}
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
                      <Button variant="outlined" size="small" color="error">
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
                  Días: {student.selectedDays.map((d) => daysMap[d]).join(", ")}
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
                  <Button variant="outlined" size="small" color="error">
                    <DeleteIcon sx={{ fontSize: 18, mr: 0.5 }} />
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <ModalAddStudent
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSave={handleSubmitStudent}
        initialData={editingStudent}
      />
    </div>
  );
};

// prop types could be added here for better type checking
TableStudents.propTypes = {
  students: PropTypes.array.isRequired,
  filteredStudents: PropTypes.array.isRequired,
  handleOpenModalEdit: PropTypes.func.isRequired,
  handleSubmitStudent: PropTypes.func.isRequired,
  modalOpen: PropTypes.bool.isRequired,
  setModalOpen: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  editingStudent: PropTypes.object,
};

TableHeaderStudents.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilterFaculty: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  filterFaculty: PropTypes.string.isRequired,
};

export default TableStudents;
