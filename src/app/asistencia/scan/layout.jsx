import { Box } from "@mui/material";
import React from "react";

const layout = ({ children }) => {
  return (
    <Box sx={{ backgroundColor: "#f7f9fc", minHeight: "100vh" }}>
      {children}
    </Box>
  );
};

export default layout;
