import {
  CardActions,
  CardContent,
  CardHeader,
  Card as MuiCard,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Custom Card component that wraps Material UI Card with additional styling options
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.titleIcon - Icon to display next to title
 * @param {React.ReactNode} props.action - Action component in header
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.footer - Card footer content
 * @param {string} props.className - Additional Tailwind classes
 * @param {boolean} props.elevation - Card elevation (shadow)
 */
const Card = ({
  title,
  titleIcon,
  action,
  children,
  footer,
  className = "",
  elevation = 1,
  ...props
}) => {
  return (
    <MuiCard
      elevation={elevation}
      className={`rounded-lg overflow-hidden ${className}`}
      {...props}
    >
      {title && (
        <CardHeader
          title={
            <div className="flex items-center">
              {titleIcon && <span className="mr-2">{titleIcon}</span>}
              <Typography variant="h6">{title}</Typography>
            </div>
          }
          action={action}
          className="border-b"
        />
      )}
      <CardContent>{children}</CardContent>
      {footer && (
        <CardActions className="border-t px-4 py-3">{footer}</CardActions>
      )}
    </MuiCard>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  titleIcon: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  className: PropTypes.string,
  elevation: PropTypes.number,
};

export default Card;
