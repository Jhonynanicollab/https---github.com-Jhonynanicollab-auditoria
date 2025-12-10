// src/features/auth/Login.jsx
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
// Se elimina la importación directa a la capa DB para evitar errores en el browser

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      // 1. LLAMAR A LA NUEVA API ROUTE (Lógica de Cliente/Browser)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        const { role } = data.user;

        // 2. Redirección basada en el rol devuelto por la API
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "student") {
          router.push("/asistencia/scan");
        } else {
          setError("Rol de usuario desconocido.");
        }
      } else {
        setError(data.error || "Credenciales inválidas. Intenta de nuevo.");
      }
    } catch (e) {
      console.error("Error durante el login:", e.message);
      setError("Credenciales inválidas. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={2}
      style={{
        padding: "32px",
        margin: "40px auto",
        borderRadius: "16px",
        // 🔁 backdropFilter se quita de aquí para evitar conflictos SSR/hidratación
        // backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
      }}
      // y se mueve a sx para que MUI lo maneje correctamente
      sx={{
        width: { xs: "90%", sm: "400px" },
        backdropFilter: "blur(5px)",
      }}
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
            <CircularProgress size={24} color="inherit" />
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
          <strong>Credenciales de prueba (DB):</strong>
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          👨‍💼 Admin: admin@correo.com / 123456
        </Typography>
        <Typography variant="caption" display="block" color="text.secondary">
          (Asegúrate de que estas credenciales existan en la tabla `users` con
          el rol correcto y la contraseña hasheada).
        </Typography>
      </Box>
    </Paper>
  );
};

export default Login;
