import { Box, Toolbar, useMediaQuery, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Footer from "./footer";
import Header from "./header";
import Sidebar from "./sidebar";

/**
 * Main layout component for the admin dashboard
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to render inside the layout
 */
const DashboardLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const SIDEBAR_WIDTH = 280;

  // Toggle sidebar open/close
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on mobile
  const handleSidebarClose = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    // Handle logout logic here - clear tokens, redirect to login, etc.
    console.log("Logging out...");
  };

  return (
    <Box className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        width={SIDEBAR_WIDTH}
      />

      {/* Main content area */}
      <Box
        component="main"
        className="flex flex-col flex-grow overflow-hidden"
        sx={{
          width: { lg: `calc(100% - ${sidebarOpen ? SIDEBAR_WIDTH : 0}px)` },
          ml: { lg: sidebarOpen ? `${SIDEBAR_WIDTH}px` : 0 },
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {/* Header */}
        <Header onMenuToggle={handleSidebarToggle} onLogout={handleLogout} />

        {/* Content with padding for fixed header */}
        <Box className="flex-grow overflow-auto">
          <Toolbar /> {/* Empty toolbar for spacing below fixed header */}
          {/* Main content */}
          <Box className="p-6">{children}</Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;
