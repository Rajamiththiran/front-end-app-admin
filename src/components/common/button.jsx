import { Button as MuiButton } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Button component that wraps Material UI Button with additional styling options
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant: 'contained', 'outlined', 'text'
 * @param {string} props.color - Button color: 'primary', 'secondary', 'success', 'error', 'info', 'warning'
 * @param {string} props.size - Button size: 'small', 'medium', 'large'
 * @param {boolean} props.fullWidth - Whether button takes full width
 * @param {string} props.className - Additional Tailwind classes
 * @param {function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.startIcon - Icon to show at start of button
 * @param {React.ReactNode} props.endIcon - Icon to show at end of button
 * @param {React.ReactNode} props.children - Button content
 */
const Button = ({
  variant = "contained",
  color = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  onClick,
  disabled = false,
  startIcon,
  endIcon,
  children,
  ...props
}) => {
  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      className={`shadow-sm ${className}`}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(["contained", "outlined", "text"]),
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "error",
    "info",
    "warning",
  ]),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default Button;
