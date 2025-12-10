// src/app/admin/audit-log/page.jsx
"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import Link from 'next/link';
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// ELIMINAR ESTA IMPORTACIÓN QUE CAUSA EL ERROR 'fs':
// import auditService from "@/db/audit"; 

const getChipProps = (type) => {
  switch (type) {
    case 'UPDATE':
      return { label: 'MODIFICACIÓN', color: 'warning', variant: 'outlined' };
    case 'DELETE':
      return { label: 'ELIMINACIÓN', color: 'error', variant: 'contained' };
    case 'INSERT':
      return { label: 'CREACIÓN', color: 'success', variant: 'outlined' };
    default:
      return { label: type, color: 'default', variant: 'outlined' };
  }
};

const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // REEMPLAZO: Usar fetch API para llamar al nuevo Route Handler
        const response = await fetch('/api/audit/logs');
        
        if (!response.ok) {
           throw new Error('Failed to fetch logs from API');
        }
        
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        // Mensaje de error ajustado para indicar un problema de servidor/red
        setError("Error al cargar los logs de auditoría. Verifique el Route Handler: /api/audit/logs"); 
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f7fe", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Link href="/admin" passHref>
          <Button startIcon={<ArrowBackIcon />} variant="outlined">
            Volver al Panel
          </Button>
        </Link>
        <SecurityIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
        <Typography variant="h5" fontWeight="bold" color="#d32f2f">
          Log de Auditoría de Base de Datos
        </Typography>
      </Stack>

      <Typography variant="body1" color="text.secondary" mb={2}>
        Registro inmutable de todas las acciones críticas (INSERT, UPDATE, DELETE) sobre la tabla de estudiantes.
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "#fbebeb" }}>
            <TableRow>
              <TableCell>Fecha/Hora</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>ID Estudiante</TableCell>
              <TableCell>Realizado Por</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay registros de auditoría.
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.log_id} hover>
                  <TableCell>
                    {new Date(log.changed_at).toLocaleString('es-ES')}
                  </TableCell>
                  <TableCell>
                    <Chip {...getChipProps(log.operation_type)} size="small" />
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>{log.description}</TableCell>
                  <TableCell>{log.student_id}</TableCell>
                  <TableCell>
                    {log.changed_by_name || log.changed_by_email} (ID: {log.changed_by_user_id})
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AuditLogPage;