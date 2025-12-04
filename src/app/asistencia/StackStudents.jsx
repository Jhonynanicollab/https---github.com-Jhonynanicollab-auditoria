import { AccessTime, Cancel, CheckCircle } from "@mui/icons-material";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

const StackStudents = ({ filteredStudents, handleEstado }) => {
  return (
    <Stack spacing={2} sx={{ display: { xs: "flex", md: "none" } }}>
      {filteredStudents?.map((s) => (
        <Card key={s.id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            {/* Nombre + código */}
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              {s.full_name} ({s.code})
            </Typography>

            {/* Estado actual */}
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
              sx={{ mb: 1 }}
            />

            {/* Botones de acción */}
            <Stack direction="row" spacing={1}>
              <IconButton
                onClick={() => handleEstado(s.id, "Presente")}
                sx={{
                  backgroundColor: s.estado === "Presente" ? "green" : "",
                  color: s.estado === "Presente" ? "white" : "green",
                  border: "1px solid green",
                  flex: 1,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "green",
                    color: "white",
                  },
                }}
                color="success"
              >
                <CheckCircle />
              </IconButton>
              <IconButton
                onClick={() => handleEstado(s.id, "Tardanza")}
                sx={{
                  backgroundColor: s.estado === "Tardanza" ? "orange" : "",
                  color: s.estado === "Tardanza" ? "white" : "orange",
                  border: "1px solid orange",
                  flex: 1,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "orange", color: "white" },
                }}
                color="warning"
              >
                <AccessTime />
              </IconButton>
              <IconButton
                onClick={() => handleEstado(s.id, "Ausente")}
                sx={{
                  backgroundColor: s.estado === "Ausente" ? "red" : "",
                  color: s.estado === "Ausente" ? "white" : "red",
                  border: "1px solid red",
                  flex: 1,
                  borderRadius: 2,
                  "&:hover": { backgroundColor: "red", color: "white" },
                }}
                color="error"
              >
                <Cancel />
              </IconButton>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default StackStudents;
