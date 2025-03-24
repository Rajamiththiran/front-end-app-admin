import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useState } from "react";

/**
 * Header component for the admin dashboard
 * @param {Object} props - Component props
 * @param {function} props.onMenuToggle - Function to toggle sidebar
 * @param {function} props.onLogout - Function to handle logout
 */
const Header = ({ onMenuToggle, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    if (onLogout) onLogout();
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchValue);
    // Handle search logic here
  };

  return (
    <AppBar position="fixed" color="primary" className="z-10">
      <Toolbar>
        {/* Menu toggle button for sidebar */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={onMenuToggle}
          className="lg:hidden mr-2"
        >
          <MenuIcon />
        </IconButton>

        {/* Logo/Brand */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          className="mr-4 hidden sm:block"
        >
          Admin Dashboard
        </Typography>

        {/* Search bar */}
        <Box
          component="form"
          onSubmit={handleSearchSubmit}
          className="bg-blue-600 rounded px-2 py-1 flex items-center flex-grow ml-0 lg:ml-4 max-w-md mr-4"
        >
          <SearchIcon className="text-white mr-2" />
          <InputBase
            placeholder="Search…"
            value={searchValue}
            onChange={handleSearchChange}
            className="text-white w-full"
            inputProps={{ "aria-label": "search" }}
          />
        </Box>

        <Box className="flex-grow" />

        {/* Notification icon */}
        <Tooltip title="Notifications">
          <IconButton
            color="inherit"
            onClick={handleNotificationMenuOpen}
            className="ml-1"
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User profile */}
        <Tooltip title="Account">
          <IconButton
            color="inherit"
            onClick={handleProfileMenuOpen}
            className="ml-1"
          >
            <Avatar className="h-8 w-8 bg-blue-700">
              <AccountCircleIcon />
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Profile dropdown menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            className: "mt-2",
          }}
        >
          <Box className="px-4 py-2">
            <Typography variant="subtitle1" className="font-semibold">
              Admin User
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              admin@example.com
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose}>
            <AccountCircleIcon className="mr-2" fontSize="small" />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose}>
            <SettingsIcon className="mr-2" fontSize="small" />
            Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <LogoutIcon className="mr-2" fontSize="small" />
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications dropdown menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationMenuClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            className: "mt-2 w-80",
          }}
        >
          <Typography variant="subtitle1" className="px-4 py-2 font-semibold">
            Notifications
          </Typography>
          <Divider />
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box className="py-1">
              <Typography variant="body2" className="font-semibold">
                New complaint assigned
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                A new complaint has been created by student John Doe
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Box className="py-1">
              <Typography variant="body2" className="font-semibold">
                Staff account created
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                New staff member Kumar was added to the system
              </Typography>
            </Box>
          </MenuItem>
          <Divider />
          <Box className="p-2 text-center">
            <Typography
              variant="body2"
              color="primary"
              className="cursor-pointer"
            >
              View all notifications
            </Typography>
          </Box>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

Header.propTypes = {
  onMenuToggle: PropTypes.func.isRequired,
  onLogout: PropTypes.func,
};

export default Header;
