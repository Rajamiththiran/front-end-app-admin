import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Modal component that wraps Material UI Dialog with additional styling options
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether modal is open
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.actions - Action buttons for modal footer
 * @param {string} props.size - Modal size: 'xs', 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.fullWidth - Whether modal takes full width
 * @param {string} props.className - Additional Tailwind classes
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  size = "md",
  fullWidth = true,
  className = "",
  ...props
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={size}
      fullWidth={fullWidth}
      className={className}
      {...props}
    >
      {title && (
        <>
          <DialogTitle className="flex justify-between items-center pr-2">
            <Typography variant="h6">{title}</Typography>
            {onClose && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                size="small"
                className="text-gray-500 hover:text-gray-700"
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <Divider />
        </>
      )}
      <DialogContent className="pt-6">
        <Box className="min-h-[100px]">{children}</Box>
      </DialogContent>
      {actions && (
        <>
          <Divider />
          <DialogActions className="p-4">{actions}</DialogActions>
        </>
      )}
    </Dialog>
  );
};

Modal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  actions: PropTypes.node,
  size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;
