// src/components/complaints/complaintStat.jsx
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

/**
 * Complaint statistic card component for displaying complaint metrics
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number|string} props.value - Main statistic value
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.iconBgColor - Background color for icon (Tailwind class)
 * @param {string} props.secondaryText - Label for secondary statistic
 * @param {number|string} props.secondaryValue - Value for secondary statistic
 * @param {string} props.trend - Trend indicator: 'up', 'down', or null
 * @param {number} props.trendValue - Percentage value for trend
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
const ComplaintStat = ({
  title,
  value,
  icon,
  iconBgColor = "bg-blue-500",
  secondaryText,
  secondaryValue,
  trend,
  trendValue,
  loading = false,
  onClick,
  className = "",
}) => {
  // Determine trend color and icon
  const getTrendInfo = () => {
    if (!trend) return null;

    const isUp = trend === "up";
    const color = isUp ? "text-green-600" : "text-red-600";
    const bgColor = isUp ? "bg-green-100" : "bg-red-100";
    const sign = isUp ? "+" : "-";

    return { color, bgColor, sign };
  };

  const trendInfo = getTrendInfo();

  return (
    <Paper
      elevation={1}
      className={`p-4 h-full transition-all duration-300 ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${className}`}
      onClick={onClick}
    >
      <Box className="flex items-center mb-3">
        {icon && (
          <Box className={`rounded-full p-2 mr-3 ${iconBgColor} text-white`}>
            {icon}
          </Box>
        )}
        <Typography variant="h6" className="font-semibold">
          {title}
        </Typography>
      </Box>

      <Typography variant="h3" className="font-bold mb-2">
        {loading ? <CircularProgress size={24} /> : value}
      </Typography>

      <Box className="flex justify-between items-center">
        {secondaryText && (
          <Typography variant="body2" color="textSecondary">
            {secondaryText}:{" "}
            <span className="font-semibold">
              {loading ? "-" : secondaryValue}
            </span>
          </Typography>
        )}

        {trendInfo && !loading && (
          <Box
            className={`rounded-full px-2 py-0.5 ${trendInfo.bgColor} flex items-center`}
          >
            <Typography
              variant="caption"
              className={`font-medium ${trendInfo.color}`}
            >
              {trendInfo.sign}
              {Math.abs(trendValue)}%
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

ComplaintStat.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node,
  iconBgColor: PropTypes.string,
  secondaryText: PropTypes.string,
  secondaryValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  trend: PropTypes.oneOf(["up", "down", null]),
  trendValue: PropTypes.number,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default ComplaintStat;
