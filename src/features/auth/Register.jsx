"use client";
import React, { useState } from "react";
import { Card } from "@mui/material";
import { useAuth } from "./context";
// Importar el nuevo servicio de autenticación de la base de datos relacional
import { authService } from "@/db/auth"; 

const Register = () => {
  // Asumiendo que el contexto (useAuth) aún se usa para la sesión local.
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Llamar al nuevo servicio que hashea la contraseña y registra en la tabla 'users'
      const newUser = await authService.registerUser(
        email, 
        password, 
        "",         // full_name (opcional, dejamos vacío)
        "student"   // Rol por defecto: "student"
      );

      if (newUser) {
        // 2. Si el registro es exitoso, actualiza el estado de la sesión local.
        setUser(newUser);
        alert("✅ Registro exitoso. Se ha iniciado sesión como estudiante.");
      } 
      
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      alert(`❌ Error al registrar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: "auto",
        marginTop: 10,
        padding: 3,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        backgroundColor: "#fff",
      }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="border-[1px] border-gray-500 rounded px-3 py-2"
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border-[1px] border-gray-500 rounded px-3 py-2"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Registrando...' : 'Register'}
        </button>
      </form>
    </Card>
  );
};

export default Register;