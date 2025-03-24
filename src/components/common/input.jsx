import {
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Input component that wraps Material UI TextField with additional styling options
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.label - Input label
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.fullWidth - Whether input takes full width
 * @param {string} props.variant - Input variant: 'outlined', 'filled', 'standard'
 * @param {boolean} props.required - Whether input is required
 * @param {boolean} props.disabled - Whether input is disabled
 * @param {string} props.error - Error message
 * @param {React.ReactNode} props.startAdornment - Start adornment (icon/text at start)
 * @param {React.ReactNode} props.endAdornment - End adornment (icon/text at end)
 * @param {string} props.className - Additional Tailwind classes
 * @param {number} props.maxRows - Maximum number of rows for multiline input
 * @param {boolean} props.multiline - Whether input is multiline
 * @param {string} props.helperText - Helper text below input
 */
const Input = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  fullWidth = true,
  variant = "outlined",
  required = false,
  disabled = false,
  error = "",
  startAdornment,
  endAdornment,
  className = "",
  maxRows,
  multiline = false,
  helperText = "",
  ...props
}) => {
  return (
    <FormControl fullWidth={fullWidth} className={className}>
      <TextField
        id={id}
        label={label}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        variant={variant}
        required={required}
        disabled={disabled}
        error={!!error}
        fullWidth={fullWidth}
        multiline={multiline}
        maxRows={maxRows}
        InputProps={{
          startAdornment: startAdornment ? (
            <InputAdornment position="start">{startAdornment}</InputAdornment>
          ) : null,
          endAdornment: endAdornment ? (
            <InputAdornment position="end">{endAdornment}</InputAdornment>
          ) : null,
        }}
        {...props}
      />
      {(error || helperText) && (
        <FormHelperText error={!!error}>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

Input.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  startAdornment: PropTypes.node,
  endAdornment: PropTypes.node,
  className: PropTypes.string,
  maxRows: PropTypes.number,
  multiline: PropTypes.bool,
  helperText: PropTypes.string,
};

export default Input;
