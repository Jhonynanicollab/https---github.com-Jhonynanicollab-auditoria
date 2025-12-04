"use client";
import React, { useState } from "react";
import QRScanner from "../../../features/attendance/QRScanner";
import attendanceService from "../../../firebase/attendance";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Alert,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonIcon from "@mui/icons-material/Person";

export default function ScanPage() {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  async function handleResult(data) {
    setResult(data);
    setMessage(null);
  }

  async function confirmAttendance() {
    if (!result) return;
    // assumimos que el QR contiene el código del estudiante
    const student = {
      id: result,
      full_name: result,
      code: result,
      estado: "Presente",
    };
    try {
      const res = await attendanceService.addAttendance({
        students: [student],
      });
      setMessage(res?.message ?? "Asistencia intentada");
      setSuccess(true);
    } catch (e) {
      console.error(e);
      setMessage("Error registrando asistencia");
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          <QrCodeScannerIcon
            sx={{ mr: 1, verticalAlign: "middle", fontSize: 36, color: "blue" }}
          />
          <Typography
            variant="h4"
            component="span"
            fontWeight="bold"
            gutterBottom
            color="blue"
          >
            Registro de Asistencia
          </Typography>
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Escanea el código QR para marcar tu asistencia
        </Typography>
      </Box>

      <Grid spacing={3}>
        {/* Scanner Section */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent sx={{ p: 3 }}>
              {!success ? (
                <QRScanner onResult={handleResult} resetKey={resetKey} />
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    background:
                      "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)",
                    borderRadius: 2,
                    textAlign: "center",
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: 80, color: "success.main", mb: 2 }}
                  />
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="success.dark"
                    gutterBottom
                  >
                    ¡Asistencia Registrada!
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    gutterBottom
                  >
                    Se registró correctamente la asistencia
                  </Typography>
                  <Chip
                    icon={<PersonIcon />}
                    label={`Código: ${result}`}
                    color="success"
                    sx={{ mt: 2, fontSize: 16, py: 2.5, px: 1 }}
                  />
                </Paper>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Control Panel */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            marginTop: { xs: 3, md: 0 },
            border: "1px solid red",
          }}
        >
          <Card elevation={3} sx={{ width: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Panel de Control
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Código Detectado:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "grey.100",
                    borderRadius: 1,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    {result ?? "—"}
                  </Typography>
                </Paper>
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={confirmAttendance}
                  disabled={!result || success}
                  startIcon={<CheckCircleIcon />}
                >
                  Confirmar Asistencia
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  size="large"
                  fullWidth
                  onClick={() => {
                    setResult(null);
                    setMessage(null);
                    setSuccess(false);
                    setResetKey((k) => k + 1);
                  }}
                  startIcon={<RestartAltIcon />}
                >
                  Volver a Escanear
                </Button>
              </Stack>

              {message && (
                <Alert
                  severity={success ? "success" : "error"}
                  sx={{ mt: 2 }}
                  icon={success ? <CheckCircleIcon /> : undefined}
                >
                  {message}
                </Alert>
              )}

              {!success && !result && (
                <Box
                  sx={{ mt: 3, p: 2, bgcolor: "info.lighter", borderRadius: 1 }}
                >
                  <Typography variant="caption" color="text.secondary">
                    💡 <strong>Instrucciones:</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    1. Permite el acceso a la cámara
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    2. Coloca el QR dentro del recuadro
                  </Typography>
                  <Typography
                    variant="caption"
                    display="block"
                    color="text.secondary"
                  >
                    3. Espera a que se detecte automáticamente
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
