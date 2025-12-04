"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function QRDisplayPage() {
  const [studentCode, setStudentCode] = useState("");
  const [displayCode, setDisplayCode] = useState("");

  // Generate a random code on mount (for demo purposes)
  useEffect(() => {
    const randomCode = `STU${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`;
    setStudentCode(randomCode);
    setDisplayCode(randomCode);
  }, []);

  const handleGenerate = () => {
    if (studentCode.trim()) {
      setDisplayCode(studentCode.trim());
    }
  };

  const handleRandomCode = () => {
    const randomCode = `STU${Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, "0")}`;
    setStudentCode(randomCode);
    setDisplayCode(randomCode);
  };

  return (
    <Container
      sx={{
        py: 6,
        backgroundColor: "#f7f9fc",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <QrCode2Icon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
        <Typography
          variant="h4"
          component="h1"
          fontWeight="bold"
          gutterBottom
          className="text-blue-500"
        >
          Código QR de Asistencia
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Escanea este código para registrar tu asistencia
        </Typography>
      </Box>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
        }}
      >
        {displayCode && (
          <>
            <Box
              sx={{
                p: 3,
                bgcolor: "white",
                borderRadius: 2,
                border: "2px solid",
                borderColor: "grey.300",
              }}
            >
              <QRCodeSVG
                value={displayCode}
                size={256}
                level="H"
                includeMargin={true}
              />
            </Box>

            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {displayCode}
            </Typography>
          </>
        )}

        <Stack spacing={2} sx={{ width: "100%", mt: 2 }}>
          <TextField
            fullWidth
            label="Código del Estudiante"
            variant="outlined"
            value={studentCode}
            onChange={(e) => setStudentCode(e.target.value)}
            placeholder="Ej: STU12345"
          />

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerate}
              disabled={!studentCode.trim()}
            >
              Generar QR
            </Button>
            <Button
              variant="outlined"
              onClick={handleRandomCode}
              startIcon={<RefreshIcon />}
            >
              Aleatorio
            </Button>
          </Stack>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
          Este código QR puede ser escaneado desde la pantalla de registro de
          asistencia
        </Typography>
      </Paper>
    </Container>
  );
}
