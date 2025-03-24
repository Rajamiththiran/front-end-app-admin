import { Box, Divider, Link, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Footer component for the admin dashboard
 * @param {Object} props - Component props
 * @param {string} props.className - Additional Tailwind classes
 */
const Footer = ({ className = "" }) => {
  const currentYear = new Date().getFullYear();

  return (
    <Box className={`py-4 px-6 ${className}`}>
      <Divider className="mb-4" />

      <Box className="flex flex-col md:flex-row justify-between items-center">
        <Box className="mb-2 md:mb-0 text-center md:text-left">
          <Typography variant="body2" color="textSecondary">
            &copy; {currentYear} Complaint Management System. All rights
            reserved.
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Built with ❤️ using Fastify, React, and Material UI
          </Typography>
        </Box>

        <Box className="flex gap-4">
          <Link
            href="#"
            underline="hover"
            color="textSecondary"
            variant="body2"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            underline="hover"
            color="textSecondary"
            variant="body2"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            underline="hover"
            color="textSecondary"
            variant="body2"
          >
            Help & Support
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

Footer.propTypes = {
  className: PropTypes.string,
};

export default Footer;
