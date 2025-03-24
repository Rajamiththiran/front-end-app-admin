// src/pages/settings/settings.jsx
import NotificationsIcon from "@mui/icons-material/Notifications";
import PaletteIcon from "@mui/icons-material/Palette";
import PersonIcon from "@mui/icons-material/Person";
import SaveIcon from "@mui/icons-material/Save";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Select,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

import Alert from "../../components/common/alert";
import Card from "../../components/common/card";
import DashboardLayout from "../../components/layout/dashboardlayout";
import { useTheme } from "../../context/themeContext";
import useAuth from "../../hooks/useAuth";
import { THEMES } from "../../utils/constants";

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Settings Page Component
const Settings = () => {
  const { user, requireAuth } = useAuth();
  const { themeMode, setTheme } = useTheme();

  // State for active tab
  const [activeTab, setActiveTab] = useState(0);

  // State for profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });

  // State for notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    newComplaint: true,
    complaintUpdates: true,
    staffUpdates: false,
    studentUpdates: false,
    systemUpdates: true,
  });

  // State for appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: themeMode,
    fontSize: "medium",
    compactMode: false,
  });

  // State for password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // State for showing/hiding password
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // State for form submission status
  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  // Ensure user is authenticated
  useEffect(() => {
    requireAuth();
  }, [requireAuth]);

  // Initialize profile form with user data
  useEffect(() => {
    if (user) {
      setProfileSettings({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile_no || "",
        address: user.address_1 || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        postalCode: user.postal_code || "",
      });
    }
  }, [user]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle profile form change
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification settings change
  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle appearance settings change
  const handleAppearanceChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = e.target.type === "checkbox" ? checked : value;

    setAppearanceSettings((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Update theme context if theme is changed
    if (name === "theme") {
      setTheme(value);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Call API to update profile
      // await apiService.updateAdminProfile(profileSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to update profile",
      });
    }
  };

  // Handle notification settings submission
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Call API to update notification settings
      // await apiService.updateNotificationSettings(notificationSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to update notification settings",
      });
    }
  };

  // Handle appearance settings submission
  const handleAppearanceSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Call API to update appearance settings
      // await apiService.updateAppearanceSettings(appearanceSettings);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to update appearance settings",
      });
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormStatus({
        loading: false,
        success: false,
        error: "New password and confirm password do not match",
      });
      return;
    }

    setFormStatus({ loading: true, success: false, error: null });

    try {
      // Call API to update password
      // await apiService.updatePassword(passwordData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFormStatus({
        loading: false,
        success: true,
        error: null,
      });

      // Clear password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setFormStatus((prev) => ({ ...prev, success: false }));
      }, 3000);
    } catch (error) {
      setFormStatus({
        loading: false,
        success: false,
        error: error.message || "Failed to update password",
      });
    }
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl">
        {/* Page Header */}
        <Box className="mb-6">
          <Typography variant="h4" component="h1" className="font-bold mb-2">
            Settings
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your account settings and preferences
          </Typography>
        </Box>

        {/* Status Messages */}
        {formStatus.success && (
          <Alert
            severity="success"
            className="mb-4"
            showCloseButton
            onClose={() =>
              setFormStatus((prev) => ({ ...prev, success: false }))
            }
          >
            Settings saved successfully!
          </Alert>
        )}

        {formStatus.error && (
          <Alert
            severity="error"
            className="mb-4"
            showCloseButton
            onClose={() => setFormStatus((prev) => ({ ...prev, error: null }))}
          >
            {formStatus.error}
          </Alert>
        )}

        {/* Settings Tabs */}
        <Paper className="mb-6">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="settings tabs"
          >
            <Tab icon={<PersonIcon />} label="Profile" id="settings-tab-0" />
            <Tab
              icon={<NotificationsIcon />}
              label="Notifications"
              id="settings-tab-1"
            />
            <Tab
              icon={<PaletteIcon />}
              label="Appearance"
              id="settings-tab-2"
            />
            <Tab icon={<SecurityIcon />} label="Security" id="settings-tab-3" />
          </Tabs>
        </Paper>

        {/* Profile Settings */}
        <TabPanel value={activeTab} index={0}>
          <Card title="Profile Information">
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={profileSettings.name}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={profileSettings.email}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                    disabled // Email cannot be changed
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Mobile Number"
                    name="mobile"
                    value={profileSettings.mobile}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider className="my-2" />
                  <Typography variant="h6" className="mb-3 mt-4">
                    Address Information
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Address"
                    name="address"
                    value={profileSettings.address}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="City"
                    name="city"
                    value={profileSettings.city}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="State/Province"
                    name="state"
                    value={profileSettings.state}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Country"
                    name="country"
                    value={profileSettings.country}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    label="Postal Code"
                    name="postalCode"
                    value={profileSettings.postalCode}
                    onChange={handleProfileChange}
                    fullWidth
                  />
                </Grid>

                <Grid item xs={12} className="flex justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </TabPanel>

        {/* Notification Settings */}
        <TabPanel value={activeTab} index={1}>
          <Card title="Notification Preferences">
            <form onSubmit={handleNotificationSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" className="mb-3">
                    Notification Channels
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onChange={handleNotificationChange}
                        name="emailNotifications"
                        color="primary"
                      />
                    }
                    label="Email Notifications"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={notificationSettings.pushNotifications}
                        onChange={handleNotificationChange}
                        name="pushNotifications"
                        color="primary"
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider className="my-2" />
                  <Typography variant="h6" className="mb-3 mt-4">
                    Notification Types
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.newComplaint}
                            onChange={handleNotificationChange}
                            name="newComplaint"
                            color="primary"
                          />
                        }
                        label="New Complaints"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.complaintUpdates}
                            onChange={handleNotificationChange}
                            name="complaintUpdates"
                            color="primary"
                          />
                        }
                        label="Complaint Status Updates"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.staffUpdates}
                            onChange={handleNotificationChange}
                            name="staffUpdates"
                            color="primary"
                          />
                        }
                        label="Staff Updates"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.studentUpdates}
                            onChange={handleNotificationChange}
                            name="studentUpdates"
                            color="primary"
                          />
                        }
                        label="Student Updates"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={notificationSettings.systemUpdates}
                            onChange={handleNotificationChange}
                            name="systemUpdates"
                            color="primary"
                          />
                        }
                        label="System Updates"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} className="flex justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </TabPanel>

        {/* Appearance Settings */}
        <TabPanel value={activeTab} index={2}>
          <Card title="Appearance Settings">
            <form onSubmit={handleAppearanceSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1" className="mb-2">
                    Theme
                  </Typography>
                  <Select
                    name="theme"
                    value={appearanceSettings.theme}
                    onChange={handleAppearanceChange}
                    fullWidth
                  >
                    <MenuItem value={THEMES.LIGHT}>Light</MenuItem>
                    <MenuItem value={THEMES.DARK}>Dark</MenuItem>
                    <MenuItem value={THEMES.SYSTEM}>System Default</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle1" className="mb-2">
                    Font Size
                  </Typography>
                  <Select
                    name="fontSize"
                    value={appearanceSettings.fontSize}
                    onChange={handleAppearanceChange}
                    fullWidth
                  >
                    <MenuItem value="small">Small</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="large">Large</MenuItem>
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={appearanceSettings.compactMode}
                        onChange={handleAppearanceChange}
                        name="compactMode"
                        color="primary"
                      />
                    }
                    label="Compact Mode (Reduce spacing)"
                  />
                </Grid>

                <Grid item xs={12} className="flex justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? "Saving..." : "Save Changes"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>
        </TabPanel>

        {/* Security Settings */}
        <TabPanel value={activeTab} index={3}>
          <Card title="Change Password">
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Current Password"
                    name="currentPassword"
                    type={showPassword.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("current")}
                            edge="end"
                          >
                            {showPassword.current ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="New Password"
                    name="newPassword"
                    type={showPassword.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("new")}
                            edge="end"
                          >
                            {showPassword.new ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPassword.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility("confirm")}
                            edge="end"
                          >
                            {showPassword.confirm ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="caption" color="textSecondary">
                    Password must be at least 8 characters long and include at
                    least one uppercase letter, one lowercase letter, one
                    number, and one special character.
                  </Typography>
                </Grid>

                <Grid item xs={12} className="flex justify-end">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? "Updating..." : "Update Password"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Card>

          <Box className="mt-6">
            <Card title="Account Security">
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" className="mb-2">
                    Last Login
                  </Typography>
                  <Typography variant="body2">
                    {user?.last_login_at
                      ? new Date(user.last_login_at).toLocaleString()
                      : "No recent login recorded"}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      // Handle logout from all devices functionality
                      alert(
                        "This functionality will log you out from all devices."
                      );
                    }}
                  >
                    Logout from all devices
                  </Button>
                </Grid>
              </Grid>
            </Card>
          </Box>
        </TabPanel>
      </Container>
    </DashboardLayout>
  );
};

export default Settings;
