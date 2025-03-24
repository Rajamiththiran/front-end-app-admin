import BarChartIcon from "@mui/icons-material/BarChart";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar component for the admin dashboard
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the sidebar is open
 * @param {function} props.onClose - Function to close the sidebar
 * @param {number} props.width - Width of the sidebar
 */
const Sidebar = ({ open, onClose, width = 280 }) => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const [openSubmenu, setOpenSubmenu] = useState({
    students: false,
    staff: false,
    complaints: false,
  });

  // Navigation items configuration
  const menuItems = [
    {
      path: "/dashboard",
      icon: <DashboardIcon />,
      text: "Dashboard",
    },
    {
      id: "students",
      icon: <SchoolIcon />,
      text: "Students",
      submenu: [
        {
          path: "/students",
          icon: <ListAltIcon fontSize="small" />,
          text: "All Students",
        },
        {
          path: "/students/add",
          icon: <PersonAddIcon fontSize="small" />,
          text: "Add Student",
        },
      ],
    },
    {
      id: "staff",
      icon: <PeopleIcon />,
      text: "Staff",
      submenu: [
        {
          path: "/staff",
          icon: <ListAltIcon fontSize="small" />,
          text: "All Staff",
        },
        {
          path: "/staff/add",
          icon: <PersonAddIcon fontSize="small" />,
          text: "Add Staff",
        },
      ],
    },
    {
      id: "complaints",
      icon: <ReportProblemIcon />,
      text: "Complaints",
      submenu: [
        {
          path: "/complaints",
          icon: <ListAltIcon fontSize="small" />,
          text: "All Complaints",
        },
        {
          path: "/complaints/analytics",
          icon: <BarChartIcon fontSize="small" />,
          text: "Analytics",
        },
      ],
    },
    {
      path: "/settings",
      icon: <SettingsIcon />,
      text: "Settings",
    },
  ];

  // Toggle submenu open/close
  const handleSubmenuToggle = (id) => {
    setOpenSubmenu({
      ...openSubmenu,
      [id]: !openSubmenu[id],
    });
  };

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if any submenu item is active
  const isSubmenuActive = (submenu) => {
    return submenu.some((item) => isActive(item.path));
  };

  // Content of the sidebar
  const sidebarContent = (
    <Box className="h-full flex flex-col">
      {/* Logo/Brand section */}
      <Box className="p-4 flex items-center">
        <Typography variant="h6" className="font-bold text-primary">
          Admin Panel
        </Typography>
      </Box>

      <Divider />

      {/* Navigation menu */}
      <List component="nav" className="flex-grow p-2">
        {menuItems.map((item) =>
          item.submenu ? (
            <Box key={item.id}>
              <ListItemButton
                onClick={() => handleSubmenuToggle(item.id)}
                className={`rounded-lg mb-1 ${
                  openSubmenu[item.id] || isSubmenuActive(item.submenu)
                    ? "bg-blue-50"
                    : "hover:bg-gray-100"
                }`}
              >
                <ListItemIcon className="min-w-[40px]">
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {openSubmenu[item.id] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>

              <Collapse in={openSubmenu[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.submenu.map((subitem) => (
                    <ListItemButton
                      key={subitem.path}
                      component={Link}
                      to={subitem.path}
                      className={`pl-8 rounded-lg ml-2 ${
                        isActive(subitem.path)
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={isMobile ? onClose : undefined}
                    >
                      <ListItemIcon className="min-w-[40px]">
                        {subitem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={subitem.text}
                        primaryTypographyProps={{
                          variant: "body2",
                          className: isActive(subitem.path)
                            ? "font-medium"
                            : "",
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </Box>
          ) : (
            <ListItem key={item.path} disablePadding className="mb-1">
              <ListItemButton
                component={Link}
                to={item.path}
                className={`rounded-lg ${
                  isActive(item.path) ? "bg-blue-100" : "hover:bg-gray-100"
                }`}
                onClick={isMobile ? onClose : undefined}
              >
                <ListItemIcon className="min-w-[40px]">
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    className: isActive(item.path) ? "font-medium" : "",
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>

      <Divider />

      {/* Footer section */}
      <Box className="p-4">
        <Typography variant="body2" className="text-gray-500 text-center">
          v1.0.0
        </Typography>
      </Box>
    </Box>
  );

  // Render the sidebar as a permanent drawer on desktop and temporary on mobile
  return isMobile ? (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile
      }}
      sx={{
        "& .MuiDrawer-paper": { width: width, boxSizing: "border-box" },
      }}
    >
      {sidebarContent}
    </Drawer>
  ) : (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": { width: width, boxSizing: "border-box" },
      }}
    >
      {sidebarContent}
    </Drawer>
  );
};

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  width: PropTypes.number,
};

export default Sidebar;
