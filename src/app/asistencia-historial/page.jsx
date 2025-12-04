"use client";

import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  alpha,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PersonIcon from "@mui/icons-material/Person";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useAttendanceData } from "./useAttendanceData";
import Link from "next/link";

const StatusChip = ({ status, count }) => {
  const theme = useTheme();

  const statusConfig = {
    presente: {
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      icon: "✅",
    },
    ausente: {
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      icon: "❌",
    },
    tardanza: {
      color: theme.palette.warning.main,
      bgColor: alpha(theme.palette.warning.main, 0.1),
      icon: "⏰",
    },
  };

  const config = statusConfig[status] || statusConfig.ausente;

  return (
    <Chip
      label={`${config.icon} ${count}`}
      sx={{
        color: config.color,
        backgroundColor: config.bgColor,
        fontWeight: 600,
        px: 1,
      }}
      size="small"
    />
  );
};

const StudentRow = ({ record }) => {
  const theme = useTheme();

  const statusColor = {
    presente: theme.palette.success.main,
    ausente: theme.palette.error.main,
    tardanza: theme.palette.warning.main,
  };
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: alpha(
          statusColor[record.status] || theme.palette.grey[300],
          0.08
        ),
        transition: "all 0.2s ease",
        "&:hover": {
          backgroundColor: alpha(
            statusColor[record.status] || theme.palette.grey[300],
            0.12
          ),
          transform: "translateY(-1px)",
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 36,
            height: 36,
            borderRadius: "50%",
            backgroundColor:
              alpha(statusColor[record?.status], 0.1) ??
              theme.palette.grey[300],
            color: statusColor[record?.status] ?? theme.palette.grey[600],
          }}
        >
          <PersonIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={500}>
            {record.full_name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Código: {record.code}
          </Typography>
        </Box>
      </Stack>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{
          color: statusColor[record.status],
          textTransform: "capitalize",
        }}
      >
        {record.status}
      </Typography>
    </Stack>
  );
};

const AttendanceHistory = () => {
  const theme = useTheme();
  const { attendances, loading, error } = useAttendanceData();
  const [expanded, setExpanded] = useState(null);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="70vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Cargando historial...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error" variant="outlined">
          Error al cargar el historial: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        background: "#FFFFFF",
        minHeight: "100vh",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "white",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 60,
              height: 60,
              borderRadius: 3,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
            }}
          >
            <EventAvailableIcon fontSize="large" />
          </Box>
          <Box>
            <Typography variant="h3" fontWeight="bold" gutterBottom>
              Historial de Asistencia
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Revisa el registro completo de asistencia de los estudiantes
            </Typography>
            <Link href="/admin" style={{ textDecoration: "none" }}>
              <Typography variant="body1" color="primary.main">
                Ir al panel de administración
              </Typography>
            </Link>
          </Box>
        </Stack>

        {attendances.length === 0 ? (
          <Alert severity="info" variant="outlined" sx={{ borderRadius: 3 }}>
            No hay registros de asistencia disponibles.
          </Alert>
        ) : (
          <Box>
            {attendances.map((attendance) => (
              <Accordion
                key={attendance.id}
                expanded={expanded === attendance.id}
                onChange={handleChange(attendance.id)}
                sx={{
                  borderRadius: 3,
                  mb: 2,
                  boxShadow: "0 5px 15px rgba(0,0,0,0.12)",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:before": { display: "none" },
                  "&:hover": {
                    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        backgroundColor:
                          expanded === attendance.id
                            ? alpha(theme.palette.primary.main, 0.1)
                            : "transparent",
                        color:
                          expanded === attendance.id
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        transition: "all 0.2s ease",
                      }}
                    >
                      <ExpandMoreIcon />
                    </Box>
                  }
                  sx={{
                    py: 2.5,
                    px: 3,
                    backgroundColor:
                      expanded === attendance.id
                        ? alpha(theme.palette.primary.main, 0.03)
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ width: "100%" }}
                    gap={2}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                          color: theme.palette.primary.main,
                        }}
                      >
                        <ScheduleIcon />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight="600">
                          {attendance.date}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {attendance.dayOfWeek}
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <StatusChip
                        status="presente"
                        count={attendance.totalPresent}
                      />
                      <StatusChip
                        status="ausente"
                        count={attendance.totalAbsent}
                      />
                      <StatusChip status="tarde" count={attendance.totalLate} />
                    </Stack>
                  </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 3, pb: 3 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: 2,
                        backgroundColor: alpha(theme.palette.grey[300], 0.3),
                        width: "fit-content",
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Registrado:{" "}
                        {new Date(attendance.createdAt).toLocaleString(
                          "es-PE",
                          {
                            timeZone: "America/Lima",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1 }} />

                    <Box>
                      <Typography variant="subtitle1" fontWeight="600" mb={2}>
                        Estudiantes ({Object.values(attendance.records).length})
                      </Typography>
                      <Stack spacing={1.5}>
                        {Object.values(attendance.records).map((record) => (
                          <StudentRow key={record.studentId} record={record} />
                        ))}
                      </Stack>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default AttendanceHistory;
