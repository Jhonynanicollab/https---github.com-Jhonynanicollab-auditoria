"use client";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import jsQR from "jsqr";
import {
  Box,
  Paper,
  Typography,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import VideocamIcon from "@mui/icons-material/Videocam";

export default function QRScanner({ onResult, resetKey }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const streamRef = useRef(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  // enumerate cameras on mount
  useEffect(() => {
    async function getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter((d) => d.kind === "videoinput");
        setCameras(videoDevices);
        if (videoDevices.length > 0 && !selectedCamera) {
          // default to first camera or environment-facing if available
          const envCamera = videoDevices.find((d) =>
            d.label.toLowerCase().includes("back")
          );
          setSelectedCamera(envCamera?.deviceId || videoDevices[0].deviceId);
        }
      } catch (e) {
        console.error("Error enumerating devices:", e);
      }
    }
    getCameras();
  }, [selectedCamera]);

  useEffect(() => {
    let animationId;
    let stream;

    async function startCamera() {
      setError(null);
      try {
        const constraints = {
          audio: false,
          video: selectedCamera
            ? { deviceId: { exact: selectedCamera } }
            : { facingMode: { ideal: "environment" } },
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setScanning(true);
        tick();
      } catch (e) {
        console.error(e);
        setError(
          "No se pudo acceder a la cámara. Revisa permisos o dispositivo."
        );
      }
    }

    function tick() {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationId = requestAnimationFrame(tick);
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      const code = jsQR(imageData.data, width, height);
      if (code) {
        // stop scanning
        setScanning(false);
        if (onResult) onResult(code.data);
      } else {
        animationId = requestAnimationFrame(tick);
      }
    }

    startCamera();

    return () => {
      setScanning(false);
      if (animationId) cancelAnimationFrame(animationId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [onResult, selectedCamera]);

  // restart when resetKey changes
  useEffect(() => {
    // if resetKey changes, re-mount behaviour: stop current video and restart
    if (resetKey == null) return;
    const video = videoRef.current;
    if (video && video.srcObject) {
      const s = video.srcObject;
      if (s.getTracks) s.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    }
    // a tiny delay to allow cleanup then start
    const t = setTimeout(() => {
      // trigger effect by calling start via creating a new stream
      // we simply let the main effect handle starting on mount - force remount by changing key in parent
    }, 200);
    return () => clearTimeout(t);
  }, [resetKey]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Camera Selector */}
      {cameras.length > 1 && (
        <FormControl fullWidth sx={{ maxWidth: 640 }}>
          <InputLabel id="camera-select-label">
            <VideocamIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Seleccionar Cámara
          </InputLabel>
          <Select
            labelId="camera-select-label"
            value={selectedCamera}
            label="Seleccionar Cámara"
            onChange={(e) => setSelectedCamera(e.target.value)}
          >
            {cameras.map((camera, index) => (
              <MenuItem key={camera.deviceId} value={camera.deviceId}>
                {camera.label || `Cámara ${index + 1}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 640,
          minHeight: 480,
          aspectRatio: "4/3",
          background: "#000",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <video
          ref={videoRef}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
          playsInline
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* overlay parts to darken outside the center box */}
        <Box sx={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <Box sx={{ position: "absolute", inset: 0 }}>
            {/* top */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "20%",
                background: "rgba(0,0,0,0.5)",
              }}
            />
            {/* bottom */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "20%",
                background: "rgba(0,0,0,0.5)",
              }}
            />
            {/* left */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                top: "20%",
                bottom: "20%",
                width: "15%",
                background: "rgba(0,0,0,0.5)",
              }}
            />
            {/* right */}
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: "20%",
                bottom: "20%",
                width: "15%",
                background: "rgba(0,0,0,0.5)",
              }}
            />
            {/* center box border */}
            <Box
              sx={{
                position: "absolute",
                left: "15%",
                right: "15%",
                top: "20%",
                bottom: "20%",
                border: "3px solid",
                borderColor: "primary.main",
                borderRadius: 2,
                boxShadow: "0 0 20px rgba(25, 118, 210, 0.5)",
              }}
            >
              {/* scanning line animation */}
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "50%",
                  height: 3,
                  background:
                    "linear-gradient(90deg, transparent, #1976d2, transparent)",
                  animation: scanning ? "scan 2s ease-in-out infinite" : "none",
                  "@keyframes scan": {
                    "0%, 100%": { top: "20%" },
                    "50%": { top: "80%" },
                  },
                }}
              />
            </Box>

            {/* instruction text */}
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 16,
                textAlign: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  fontWeight: 600,
                  textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <QrCodeScannerIcon />
                Coloca el código QR dentro del recuadro
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* loading indicator when starting */}
        {!scanning && !error && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
      </Paper>

      {error && (
        <Alert severity="error" sx={{ width: "100%", maxWidth: 640 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

QRScanner.propTypes = {
  onResult: PropTypes.func,
  resetKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
