import { CssBaseline } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { AuthProvider } from "./context/authContext";
import { ThemeProvider } from "./context/themeContext";
import AppRoutes from "./routes/appRoutes";

function App() {
  // Always call useSelector unconditionally
  const authError = useSelector((state) => state.auth.error);

  // Use useEffect for side effects and error logging
  useEffect(() => {
    if (authError) {
      console.error("Global Auth Error:", authError);
    }
  }, [authError]);

  return (
    <>
      <CssBaseline />
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
