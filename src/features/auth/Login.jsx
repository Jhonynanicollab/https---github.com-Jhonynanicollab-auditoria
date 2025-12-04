"use client";
import React, { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Box,
  Divider,
} from "@mui/material";
import { useRouter } from "next/navigation";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  // Función simulada de login
  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      // Verificar credenciales de admin
      if (email === "admin@correo.com" && password === "123456") {
        setSuccess(true);
        router.push("/admin");
      }
      // Verificar credenciales de estudiante (cualquier email que contenga "estudiante" o "student")
      else if (
        (email.toLowerCase().includes("estudiante") ||
          email.toLowerCase().includes("student") ||
          email.match(/^stu\d+@/i)) && // Formato STU12345@correo.com
        password === "123456"
      ) {
        setSuccess(true);
        router.push("/asistencia/scan");
      } else {
        setError("Credenciales inválidas. Intenta de nuevo.");
      }
    }, 1500); // Simula un delay de servidor
  };

  return (
    <Paper
      elevation={2}
      style={{
        padding: "32px",
        margin: "40px auto",
        borderRadius: "16px",
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
      sx={{ width: { xs: "90%", sm: "400px" } }}
    >
      <Typography
        variant="h5"
        component="h2"
        gutterBottom
        align="center"
        fontWeight="bold"
        style={{ color: "#1d388e" }}
      >
        Sistema de Asistencia
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">¡Login exitoso!</Alert>}

      <form onSubmit={handleLogin} style={{ marginTop: "16px" }}>
        <TextField
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          style={{
            marginTop: "16px",
            padding: "10px",
            backgroundColor: "#145cfc",
            fontWeight: "bold",
          }}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="info" />
          ) : (
            "Iniciar Sesión"
          )}
        </Button>
      </form>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ bgcolor: "#f5f5f5", p: 2, borderRadius: 1 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          gutterBottom
        >
          <strong>Credenciales de prueba:</strong>
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          👨‍💼 Admin: admin@correo.com / 123456
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          👨‍🎓 Estudiante: estudiante@correo.com / 123456
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
