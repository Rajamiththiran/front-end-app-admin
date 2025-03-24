import CloseIcon from "@mui/icons-material/Close";
import {
  AlertTitle,
  IconButton,
  Alert as MuiAlert,
  Snackbar,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Alert component that wraps Material UI Alert with additional styling options
 * @param {Object} props - Component props
 * @param {string} props.severity - Alert severity: 'error', 'warning', 'info', 'success'
 * @param {string} props.title - Alert title
 * @param {React.ReactNode} props.children - Alert content
 * @param {boolean} props.showIcon - Whether to show severity icon
 * @param {boolean} props.showCloseButton - Whether to show close button
 * @param {function} props.onClose - Close handler
 * @param {string} props.className - Additional Tailwind classes
 * @param {boolean} props.isSnackbar - Whether to display as snackbar
 * @param {boolean} props.open - Whether snackbar is open (only used if isSnackbar is true)
 * @param {Object} props.snackbarProps - Additional props for Snackbar component
 * @param {number} props.autoHideDuration - Auto hide duration for snackbar in milliseconds
 * @param {string} props.variant - Alert variant: 'standard', 'filled', 'outlined'
 */
const Alert = ({
  severity = "info",
  title,
  children,
  showIcon = true,
  showCloseButton = false,
  onClose,
  className = "",
  isSnackbar = false,
  open = false,
  snackbarProps = {},
  autoHideDuration = 6000,
  variant = "standard",
  ...props
}) => {
  const alertContent = (
    <MuiAlert
      severity={severity}
      variant={variant}
      icon={showIcon ? undefined : false}
      className={`rounded ${className}`}
      action={
        showCloseButton && onClose ? (
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : null
      }
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );

  if (isSnackbar) {
    return (
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={onClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        {...snackbarProps}
      >
        {alertContent}
      </Snackbar>
    );
  }

  return alertContent;
};

Alert.propTypes = {
  severity: PropTypes.oneOf(["error", "warning", "info", "success"]),
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  showIcon: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  onClose: PropTypes.func,
  className: PropTypes.string,
  isSnackbar: PropTypes.bool,
  open: PropTypes.bool,
  snackbarProps: PropTypes.object,
  autoHideDuration: PropTypes.number,
  variant: PropTypes.oneOf(["standard", "filled", "outlined"]),
};

export default Alert;
