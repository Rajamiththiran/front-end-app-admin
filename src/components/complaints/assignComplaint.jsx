// src/components/complaints/assignComplaint.jsx
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  assignComplaint,
  fetchAvailableStaff,
  resetAssignStatus,
} from "../../store/complaintSlice";
import Alert from "../common/alert";

/**
 * Component for assigning a complaint to a staff member
 * @param {Object} props - Component props
 * @param {Object} props.complaint - Complaint data
 * @param {Function} props.onSuccess - Function to call on successful assignment
 * @param {Function} props.onCancel - Function to call when assignment is cancelled
 */
const AssignComplaint = ({ complaint, onSuccess, onCancel }) => {
  const dispatch = useDispatch();

  // Redux state
  const {
    availableStaff: {
      items: staffList,
      status: staffStatus,
      error: staffError,
    },
    assign: {
      status: assignStatus,
      error: assignError,
      success: assignSuccess,
    },
  } = useSelector((state) => state.complaints);

  // Local state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Fetch available staff when component mounts
  useEffect(() => {
    dispatch(fetchAvailableStaff());

    // Cleanup when component unmounts
    return () => {
      dispatch(resetAssignStatus());
    };
  }, [dispatch]);

  // Handle successful assignment
  useEffect(() => {
    if (assignSuccess && submitted) {
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [assignSuccess, submitted, onSuccess]);

  // Filter staff list based on search query
  const filteredStaffList = searchQuery.trim()
    ? staffList.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : staffList;

  // Handle staff selection
  const handleSelectStaff = (staff) => {
    setSelectedStaff(staff);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle note input change
  const handleNoteChange = (e) => {
    setNote(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedStaff) {
      return;
    }

    setSubmitted(true);
    dispatch(
      assignComplaint({
        complaint_id: complaint.id,
        staff_id: selectedStaff.id,
        note: note.trim(),
      })
    );
  };

  return (
    <Box>
      {/* Error alert */}
      {assignError && (
        <Alert severity="error" className="mb-4">
          {assignError}
        </Alert>
      )}

      {/* Staff search and selection form */}
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Complaint information */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-medium mb-1">
              Complaint Information
            </Typography>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              ID: #{complaint.id}
            </Typography>
            <Typography variant="body2" className="font-medium">
              {complaint.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Submitted by: {complaint.students?.name || "Unknown Student"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          {/* Staff search */}
          <Grid item xs={12}>
            <Typography variant="h6" className="font-medium mb-2">
              Select Staff Member
            </Typography>

            <TextField
              fullWidth
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={assignStatus === "loading"}
              className="mb-3"
            />

            {/* Staff list */}
            <Box
              className="border rounded max-h-60 overflow-y-auto mb-4"
              sx={{ minHeight: "200px" }}
            >
              {staffStatus === "loading" ? (
                <Box className="flex justify-center items-center h-40">
                  <CircularProgress />
                </Box>
              ) : staffError ? (
                <Box className="text-center p-4">
                  <Typography variant="body2" color="error">
                    {staffError}
                  </Typography>
                </Box>
              ) : filteredStaffList.length === 0 ? (
                <Box className="text-center p-4">
                  <Typography variant="body2" color="textSecondary">
                    {searchQuery.trim()
                      ? "No staff members found matching your search"
                      : "No staff members available for assignment"}
                  </Typography>
                </Box>
              ) : (
                <List component="nav" disablePadding>
                  {filteredStaffList.map((staff) => (
                    <ListItem
                      key={staff.id}
                      disablePadding
                      secondaryAction={
                        selectedStaff?.id === staff.id && (
                          <Typography
                            variant="caption"
                            className="mr-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                          >
                            Selected
                          </Typography>
                        )
                      }
                    >
                      <ListItemButton
                        selected={selectedStaff?.id === staff.id}
                        onClick={() => handleSelectStaff(staff)}
                        disabled={assignStatus === "loading"}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={staff.image_url}
                            alt={staff.name}
                            className="bg-blue-100"
                          >
                            <PersonIcon className="text-blue-600" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={staff.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="textSecondary"
                              >
                                {staff.department || "No Department"}
                              </Typography>
                              {staff.specialization && (
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="textSecondary"
                                >
                                  {" • "}
                                  {staff.specialization}
                                </Typography>
                              )}
                            </>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Grid>

          {/* Assignment note */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField
                label="Assignment Note (Optional)"
                value={note}
                onChange={handleNoteChange}
                multiline
                rows={3}
                placeholder="Add a note for the assigned staff member..."
                disabled={assignStatus === "loading"}
              />
              <FormHelperText>
                Provide any additional information that might help the staff
                member handle this complaint.
              </FormHelperText>
            </FormControl>
          </Grid>

          {/* Form actions */}
          <Grid item xs={12} className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outlined"
              color="inherit"
              onClick={onCancel}
              disabled={assignStatus === "loading"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={
                assignStatus === "loading" ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <SendIcon />
                )
              }
              disabled={
                !selectedStaff || assignStatus === "loading" || submitted
              }
            >
              {assignStatus === "loading" ? "Assigning..." : "Assign Complaint"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};

AssignComplaint.propTypes = {
  complaint: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func,
};

export default AssignComplaint;
