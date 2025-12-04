"use client";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { faculties, schools } from "@/firebase/seed";
import studentService from "@/firebase/students";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const diasSemana = ["Lun", "Mar", "Mié", "Jue", "Vie"];

const emptyForm = {
  code: "",
  full_name: "",
  email: "",
  number: "",
  facultyId: "",
  faculty: "",
  schoolId: "",
  school: "",
  selectedDays: [],
};

const ModalAddStudent = ({
  open,
  handleClose,
  handleSave,
  initialData = null,
}) => {
  const [formData, setFormData] = useState(
    initialData ? { ...emptyForm, ...initialData } : { ...emptyForm }
  );
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setFormData(
      initialData ? { ...emptyForm, ...initialData } : { ...emptyForm }
    );
  }, [initialData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    const facObj = faculties.find((f) => f.id === facultyId);
    setFormData((prev) => ({
      ...prev,
      facultyId,
      faculty: facObj ? facObj.name : "",
      // limpiar escuela si cambia facultad
      schoolId: "",
      school: "",
    }));
  };

  const handleSchoolChange = (e) => {
    const schoolId = e.target.value;
    const escObj = schools.find((s) => s.id === schoolId);
    setFormData((prev) => ({
      ...prev,
      schoolId,
      school: escObj ? escObj.name : "",
    }));
  };

  const toggleDay = (idx) => {
    setFormData((prev) => {
      const exists = prev.selectedDays.includes(idx);
      return {
        ...prev,
        selectedDays: exists
          ? prev.selectedDays.filter((d) => d !== idx)
          : [...prev.selectedDays, idx],
      };
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    // validación mínima: code y full_name
    if (!formData.code?.trim() || !formData.full_name?.trim()) {
      // puedes reemplazar por Snackbar / helperText
      alert("Código y Nombre son obligatorios.");
      setIsLoading(false);
      return;
    }
    setTimeout(() => {}, 3000); // por si acaso

    await handleSave({ ...formData });
    handleClose();
    setFormData({ ...emptyForm });
    setIsLoading(false);
  };
  console.log(formData);
  return (
    <Modal open={open} onClose={handleClose} sx={{ color: "black" }}>
      <Box
        sx={{
          ...style,
          width: isMobile ? "90%" : 520,
        }}
      >
        <Typography variant="h6" mb={2}>
          {initialData ? "Editar Estudiante" : "Agregar Estudiante"}
        </Typography>

        {/* Código */}
        <TextField
          fullWidth
          label="Código"
          name="code"
          value={formData.code}
          onChange={handleChange}
          margin="normal"
        />

        {/* Nombre */}
        <TextField
          fullWidth
          label="Nombre"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          margin="normal"
        />

        {/* Email */}
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          margin="normal"
        />

        {/* Número */}
        <TextField
          fullWidth
          label="Número"
          name="number"
          value={formData.number}
          onChange={handleChange}
          margin="normal"
        />

        {/* Facultad (select) */}
        <TextField
          select
          fullWidth
          label="Facultad"
          name="facultyId"
          value={formData.facultyId}
          onChange={handleFacultyChange}
          margin="normal"
        >
          <MenuItem value="">
            <em>Seleccione una facultad</em>
          </MenuItem>
          {faculties.map((fac) => (
            <MenuItem key={fac.id} value={fac.id}>
              {fac.name}
            </MenuItem>
          ))}
        </TextField>

        {/* Escuela (select dependiente) */}
        <TextField
          select
          fullWidth
          label="Escuela"
          name="schoolId"
          value={formData.schoolId}
          onChange={handleSchoolChange}
          margin="normal"
          disabled={!formData.facultyId}
        >
          <MenuItem value="">
            <em>Seleccione una escuela</em>
          </MenuItem>
          {formData.facultyId &&
            schools
              .filter((esc) => esc.facultyId === formData.facultyId)
              .map((esc) => (
                <MenuItem key={esc.id} value={esc.id}>
                  {esc.name}
                </MenuItem>
              ))}
        </TextField>

        {/* Días (checkboxes) */}
        <Box mt={2}>
          <Typography variant="body1" gutterBottom>
            Días
          </Typography>
          <FormGroup row>
            {diasSemana.map((dia, idx) => (
              <FormControlLabel
                key={dia}
                control={
                  <Checkbox
                    checked={formData.selectedDays.includes(idx + 1)}
                    onChange={() => toggleDay(idx + 1)}
                  />
                }
                label={`${dia}`}
              />
            ))}
          </FormGroup>
        </Box>

        {/* Botones */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 3 }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              handleClose();
              setFormData({ ...emptyForm });
            }}
          >
            Cancelar
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            {isLoading ? (
              <span>
                <CircularProgress size={24} color="white" />
              </span>
            ) : (
              "Guardar"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ModalAddStudent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default ModalAddStudent;
