import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SchoolIcon from "@mui/icons-material/School";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";

/**
 * Activity feed component for dashboard
 * @param {Object} props - Component props
 * @param {Array} props.activities - Array of activity items
 * @param {boolean} props.loading - Whether the feed is in loading state
 * @param {string} props.title - Feed title
 * @param {string} props.emptyMessage - Message to display when there are no activities
 * @param {function} props.onViewAll - Handler for "View All" button click
 * @param {string} props.viewAllLink - Link for "View All" button
 * @param {number} props.maxItems - Maximum number of items to display
 * @param {boolean} props.showTime - Whether to show activity time
 */
const ActivityFeed = ({
  activities = [],
  loading = false,
  title = "Recent Activities",
  emptyMessage = "No recent activities",
  onViewAll,
  viewAllLink,
  maxItems = 5,
  showTime = true,
}) => {
  // Get icon by activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "complaint":
        return <ReportProblemIcon />;
      case "complaint_resolved":
        return <CheckCircleIcon />;
      case "complaint_dropped":
        return <BlockIcon />;
      case "student":
        return <SchoolIcon />;
      case "staff":
        return <PersonIcon />;
      case "event":
        return <EventIcon />;
      default:
        return <NotificationsIcon />;
    }
  };

  // Get background color by activity type
  const getActivityColor = (type) => {
    switch (type) {
      case "complaint":
        return "bg-amber-100 text-amber-600";
      case "complaint_resolved":
        return "bg-green-100 text-green-600";
      case "complaint_dropped":
        return "bg-red-100 text-red-600";
      case "student":
        return "bg-blue-100 text-blue-600";
      case "staff":
        return "bg-purple-100 text-purple-600";
      case "event":
        return "bg-teal-100 text-teal-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;

    // Convert to seconds, minutes, hours, days
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) {
      return "just now";
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  // Limit items to display
  const displayedActivities = maxItems
    ? activities.slice(0, maxItems)
    : activities;

  return (
    <Card className="h-full">
      <CardHeader
        title={
          <Typography variant="h6" className="font-semibold">
            {title}
          </Typography>
        }
        action={
          <IconButton aria-label="settings">
            <MoreHorizIcon />
          </IconButton>
        }
      />
      <Divider />
      <CardContent className="p-0">
        {loading ? (
          <Box className="flex justify-center items-center py-8">
            <CircularProgress />
          </Box>
        ) : activities.length === 0 ? (
          <Box className="flex flex-col items-center justify-center py-8 text-center px-4">
            <NotificationsIcon
              className="text-gray-400 mb-2"
              style={{ fontSize: 40 }}
            />
            <Typography variant="body1" color="textSecondary">
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
          <Box>
            {displayedActivities.map((activity, index) => (
              <React.Fragment key={activity.id}>
                <Box className="px-4 py-3 flex items-start">
                  <Avatar
                    className={`${getActivityColor(
                      activity.type
                    )} w-10 h-10 rounded-full mr-3 flex items-center justify-center`}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>

                  <Box className="flex-grow">
                    <Box className="flex justify-between items-start">
                      <Box>
                        <Typography variant="body2" className="font-medium">
                          {activity.title || activity.message}
                        </Typography>

                        {activity.description && (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            className="mt-0.5"
                          >
                            {activity.description}
                          </Typography>
                        )}
                      </Box>

                      {activity.status && (
                        <Chip
                          label={activity.status}
                          size="small"
                          color={
                            activity.status === "COMPLETED"
                              ? "success"
                              : activity.status === "PENDING"
                              ? "warning"
                              : activity.status === "ASSIGNED"
                              ? "info"
                              : activity.status === "IN_PROGRESS"
                              ? "primary"
                              : "default"
                          }
                          className="ml-2"
                        />
                      )}
                    </Box>

                    <Box className="flex justify-between items-center mt-1">
                      {showTime && (
                        <Typography variant="caption" color="textSecondary">
                          {formatRelativeTime(
                            activity.time || activity.created_at
                          )}
                        </Typography>
                      )}

                      {activity.link && (
                        <Button
                          component={Link}
                          to={activity.link}
                          size="small"
                          variant="text"
                          color="primary"
                          endIcon={<NavigateNextIcon />}
                          className="text-xs"
                        >
                          View
                        </Button>
                      )}
                    </Box>
                  </Box>
                </Box>
                {index < displayedActivities.length - 1 && <Divider />}
              </React.Fragment>
            ))}

            {(activities.length > maxItems || viewAllLink || onViewAll) && (
              <>
                <Divider />
                <Box className="p-2 flex justify-center">
                  <Button
                    component={viewAllLink ? Link : "button"}
                    to={viewAllLink}
                    onClick={onViewAll}
                    color="primary"
                    endIcon={<NavigateNextIcon />}
                    className="text-sm"
                  >
                    View All Activities
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

ActivityFeed.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.string.isRequired,
      title: PropTypes.string,
      message: PropTypes.string,
      description: PropTypes.string,
      time: PropTypes.string,
      created_at: PropTypes.string,
      status: PropTypes.string,
      link: PropTypes.string,
    })
  ),
  loading: PropTypes.bool,
  title: PropTypes.string,
  emptyMessage: PropTypes.string,
  onViewAll: PropTypes.func,
  viewAllLink: PropTypes.string,
  maxItems: PropTypes.number,
  showTime: PropTypes.bool,
};

export default ActivityFeed;
