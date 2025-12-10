"use client";
import React, { useState } from "react";
import QRScanner from "../../../features/attendance/QRScanner";
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
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import PersonIcon from "@mui/icons-material/Person";
import { toast } from "react-toastify";

export default function ScanPage() {
  const [result, setResult] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  async function handleResult(data) {
    setResult(data);
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/students/code/${data}`);
      const resultData = await response.json();

      if (!response.ok || !resultData.student) {
        throw new Error(resultData.error || 'Estudiante no encontrado en la DB.');
      }

      setStudentDetails(resultData.student);
      setMessage(`Estudiante encontrado: ${resultData.student.full_name}`);
    } catch (e) {
      setResult(null);
      setStudentDetails(null);
      setMessage(`Error: ${e.message}`);
      toast.error(`QR No Válido: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  async function confirmAttendance() {
    if (!result || !studentDetails) return;
    setLoading(true);

    try {
      const response = await fetch('/api/attendance/qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: studentDetails.id,
          studentData: studentDetails,
        }),
      });

      const res = await response.json();

      if (!response.ok || !res.success) {
        throw new Error(res.message || 'Error registrando asistencia.');
      }

      setMessage(res.message);
      setSuccess(true);
      toast.success(res.message);
    } catch (e) {
      console.error(e);
      setMessage(e.message);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  const displayStudentName = studentDetails?.full_name || result;

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
                loading ? (
                  <Box sx={{ height: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CircularProgress size={60} />
                  </Box>
                ) : (
                  <QRScanner onResult={handleResult} resetKey={resetKey} />
                )
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
                    Se registró correctamente la asistencia para:
                  </Typography>
                  <Chip
                    icon={<PersonIcon />}
                    label={displayStudentName}
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
                  Estudiante/Código Detectado:
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
                    {displayStudentName ?? "—"}
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
                  disabled={!studentDetails || success || loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
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
                    setStudentDetails(null);
                    setMessage(null);
                    setSuccess(false);
                    setResetKey((k) => k + 1);
                  }}
                  disabled={loading}
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
