import React from "react";
import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from "@mui/material";
import { AccessTime, Cancel, CheckCircle } from "@mui/icons-material";
const daysMap = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const TableStudentsDesktop = ({ filteredStudents, handleEstado }) => {
  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Codigo</b>
            </TableCell>
            <TableCell>
              <b>Nombre</b>
            </TableCell>
            <TableCell>
              <b>Estado</b>
            </TableCell>
            <TableCell align="center">
              <b>Acciones</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredStudents?.map((s) => (
            <TableRow key={s.id}>
              <TableCell>{s.code}</TableCell>
              <TableCell>{s.full_name}</TableCell>
              <TableCell>
                {s.selectedDays.map((d) => daysMap[d]).join(", ")}
              </TableCell>
              <TableCell>
                <Chip
                  label={s.estado ?? "Pendiente"}
                  color={
                    s.estado === "Presente"
                      ? "success"
                      : s.estado === "Ausente"
                      ? "error"
                      : s.estado === "Tardanza"
                      ? "warning"
                      : "default"
                  }
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="success"
                  onClick={() => handleEstado(s.id, "Presente")}
                  sx={{
                    backgroundColor: s.estado === "Presente" ? "green" : "",
                    color: s.estado === "Presente" ? "white" : "green",
                    "&:hover": {
                      backgroundColor: "green",
                      color: "white",
                    },
                    marginRight: 1,
                    border: "1px solid green",
                    padding: 0.7,
                    borderRadius: 3,
                  }}
                >
                  <CheckCircle />
                </IconButton>
                <IconButton
                  color="warning"
                  onClick={() => handleEstado(s.id, "Tardanza")}
                  sx={{
                    backgroundColor: s.estado === "Tardanza" ? "orange" : "",
                    color: s.estado === "Tardanza" ? "white" : "orange",
                    "&:hover": {
                      backgroundColor: "orange",
                      color: "white",
                    },
                    marginRight: 1,
                    border: "1px solid orange",
                    padding: 0.7,
                    borderRadius: 3,
                  }}
                >
                  <AccessTime />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => handleEstado(s.id, "Ausente")}
                  sx={{
                    backgroundColor: s.estado === "Ausente" ? "red" : "",
                    color: s.estado === "Ausente" ? "white" : "red",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                    },
                    marginRight: 1,
                    border: "1px solid red",
                    padding: 0.7,
                    borderRadius: 3,
                  }}
                >
                  <Cancel />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableStudentsDesktop;
