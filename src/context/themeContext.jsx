// src/context/themeContext.jsx
import {
  createTheme,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";
import React, { createContext, useContext, useEffect, useState } from "react";
import { STORAGE_KEYS, THEMES } from "../utils/constants";

// Create context
const ThemeContext = createContext();

// Theme configuration
const getThemeOptions = (mode) => ({
  palette: {
    mode,
    primary: {
      main: "#1976d2",
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
      contrastText: "#ffffff",
    },
    success: {
      main: "#22c55e",
      light: "#4ade80",
      dark: "#16a34a",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    info: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#2563eb",
    },
    background: {
      default: mode === "light" ? "#f9fafb" : "#111827",
      paper: mode === "light" ? "#ffffff" : "#1f2937",
    },
    text: {
      primary: mode === "light" ? "#111827" : "#f9fafb",
      secondary: mode === "light" ? "#4b5563" : "#9ca3af",
    },
  },
  typography: {
    fontFamily: [
      "Roboto",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: mode === "light" ? "#1565c0" : "#2563eb",
          },
        },
        containedSecondary: {
          "&:hover": {
            backgroundColor: mode === "light" ? "#b91c1c" : "#dc2626",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === "light"
              ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 3px 0 rgb(0 0 0 / 0.25), 0 1px 2px -1px rgb(0 0 0 / 0.2)",
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow:
            mode === "light"
              ? "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)"
              : "0 1px 3px 0 rgb(0 0 0 / 0.25), 0 1px 2px -1px rgb(0 0 0 / 0.2)",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${mode === "light" ? "#f3f4f6" : "#374151"}`,
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === "light" ? "#f9fafb" : "#1f2937",
        },
      },
    },
  },
});

// Theme Provider component
export const ThemeProvider = ({ children }) => {
  // Default to system preference, fallback to light
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    if (
      savedTheme &&
      [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM].includes(savedTheme)
    ) {
      return savedTheme;
    }

    return THEMES.SYSTEM;
  });

  // Determine actual mode (light/dark) based on theme setting
  const [actualMode, setActualMode] = useState(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);

    if (savedTheme === THEMES.LIGHT) return "light";
    if (savedTheme === THEMES.DARK) return "dark";

    // System preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  // Create MUI theme
  const theme = React.useMemo(
    () => createTheme(getThemeOptions(actualMode)),
    [actualMode]
  );

  // Handle system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      if (themeMode === THEMES.SYSTEM) {
        setActualMode(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeMode]);

  // Update theme mode and store preference
  const setTheme = (newThemeMode) => {
    setThemeMode(newThemeMode);
    localStorage.setItem(STORAGE_KEYS.THEME, newThemeMode);

    if (newThemeMode === THEMES.LIGHT) {
      setActualMode("light");
    } else if (newThemeMode === THEMES.DARK) {
      setActualMode("dark");
    } else {
      // System preference
      setActualMode(
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      );
    }
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    if (actualMode === "light") {
      setTheme(THEMES.DARK);
    } else {
      setTheme(THEMES.LIGHT);
    }
  };

  // Exposed values and methods
  const value = {
    theme,
    themeMode,
    actualMode,
    isDark: actualMode === "dark",
    isLight: actualMode === "light",
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
