// src/app/layout.tsx (o app/layout.jsx, según tu proyecto)
import "./globals.css";
import React from "react";
import PropTypes from "prop-types";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/features/auth/context";
import MuiRegistry from "@/components/MuiRegistry"; 
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata = {
  title: "Sistema de Asistencia",
  description: "Panel de administración y control de asistencia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-blue-200`}
      >
        {/* ✅ MUI Registry se encarga del manejo de estilos (SSR + cliente) */}
        <MuiRegistry>
          {/* ✅ Contexto de autenticación disponible en toda la app */}
          <AuthProvider>
            {children}
          </AuthProvider>

          {/* ✅ Contenedor global de notificaciones */}
          <ToastContainer />
        </MuiRegistry>
      </body>
    </html>
  );
}

  RootLayout.propTypes = {
    children: PropTypes.node,
  };
