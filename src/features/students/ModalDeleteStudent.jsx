// src/features/students/ModalDeleteStudent.jsx
import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const ModalDeleteStudent = ({ open, handleClose, handleDelete, studentName }) => {
  const [loading, setLoading] = useState(false);

  const onConfirmDelete = async () => {
    setLoading(true);
    // Ejecuta la función principal de eliminación (handleDelete)
    await handleDelete();
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" color="error" mb={2}>
          Confirmar Eliminación
        </Typography>

        <Typography variant="body1" mb={3}>
          ¿Está seguro de que desea eliminar al estudiante 
          <Typography component="span" fontWeight="bold" sx={{ color: 'error.main', ml: 0.5 }}>
            {studentName || 'seleccionado'}
          </Typography>?
          Esta acción es irreversible.
        </Typography>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button variant="outlined" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={onConfirmDelete}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Eliminar'}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

ModalDeleteStudent.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  studentName: PropTypes.string,
};

export default ModalDeleteStudent;