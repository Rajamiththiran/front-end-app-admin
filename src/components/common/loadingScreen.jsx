import { Box, CircularProgress } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <CircularProgress size={48} />
    </Box>
  );
};

export default LoadingScreen;
