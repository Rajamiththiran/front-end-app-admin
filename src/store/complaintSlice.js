// src/store/complaintSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../services/api";
import { PAGINATION } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";

// Initial state
const initialState = {
  adminList: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    pagination: {
      page: 1,
      limit: PAGINATION.DEFAULT_LIMIT,
      total: 0,
    },
    filters: {
      search: "",
      status: "",
      student_id: null,
      assigned_staff_id: null,
    },
  },
  studentList: {
    items: [],
    status: "idle",
    error: null,
    pagination: {
      page: 1,
      limit: PAGINATION.DEFAULT_LIMIT,
      total: 0,
    },
    filters: {
      status: "",
    },
  },
  staffList: {
    items: [],
    status: "idle",
    error: null,
    pagination: {
      page: 1,
      limit: PAGINATION.DEFAULT_LIMIT,
      total: 0,
    },
    filters: {
      search: "",
      status: "",
    },
  },
  current: {
    item: null,
    status: "idle",
    error: null,
  },
  availableStaff: {
    items: [],
    status: "idle",
    error: null,
  },
  stats: {
    data: null,
    status: "idle",
    error: null,
  },
  form: {
    status: "idle",
    error: null,
    success: false,
  },
  assign: {
    status: "idle",
    error: null,
    success: false,
  },
  drop: {
    status: "idle",
    error: null,
    success: false,
  },
  evaluate: {
    status: "idle",
    error: null,
    success: false,
    result: null,
  },
  update: {
    status: "idle",
    error: null,
    success: false,
  },
  complete: {
    status: "idle",
    error: null,
    success: false,
  },
  delete: {
    status: "idle",
    error: null,
    success: false,
  },
};

// Async thunks for Admin
export const fetchAdminComplaints = createAsyncThunk(
  "complaints/fetchAdminList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getAllComplaints(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchComplaintById = createAsyncThunk(
  "complaints/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getComplaintById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchAvailableStaff = createAsyncThunk(
  "complaints/fetchAvailableStaff",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getAvailableStaff();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const assignComplaint = createAsyncThunk(
  "complaints/assign",
  async ({ complaint_id, staff_id, note }, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.assignComplaint(
        complaint_id,
        staff_id,
        note
      );
      return { complaint_id, staff_id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const dropComplaint = createAsyncThunk(
  "complaints/drop",
  async ({ complaint_id, reason }, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.dropComplaint(
        complaint_id,
        reason
      );
      return { complaint_id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchComplaintStats = createAsyncThunk(
  "complaints/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getComplaintStats();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunks for Staff
export const fetchStaffComplaints = createAsyncThunk(
  "complaints/fetchStaffList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getStaffComplaints(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStaffComplaintById = createAsyncThunk(
  "complaints/fetchStaffComplaintById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getStaffComplaintById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const evaluateComplaint = createAsyncThunk(
  "complaints/evaluate",
  async (complaint_id, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.evaluateComplaint(
        complaint_id
      );
      return { complaint_id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateComplaintProgress = createAsyncThunk(
  "complaints/updateProgress",
  async ({ complaint_id, notes }, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.updateComplaintProgress(
        complaint_id,
        notes
      );
      return { complaint_id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const completeComplaint = createAsyncThunk(
  "complaints/complete",
  async ({ complaint_id, responseText }, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.completeComplaint(
        complaint_id,
        responseText
      );
      return { complaint_id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStaffComplaintStats = createAsyncThunk(
  "complaints/fetchStaffStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getStaffComplaintStats();
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Async thunks for Student
export const fetchStudentComplaints = createAsyncThunk(
  "complaints/fetchStudentList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getStudentComplaints(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStudentComplaintById = createAsyncThunk(
  "complaints/fetchStudentComplaintById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.getStudentComplaintById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createComplaint = createAsyncThunk(
  "complaints/create",
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.createComplaint(
        complaintData
      );
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateComplaint = createAsyncThunk(
  "complaints/update",
  async (complaintData, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.updateComplaint(
        complaintData
      );
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaints/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.complaint.deleteComplaint(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Complaint slice
const complaintSlice = createSlice({
  name: "complaints",
  initialState,
  reducers: {
    resetAdminComplaintList: (state) => {
      state.adminList = initialState.adminList;
    },
    resetStaffComplaintList: (state) => {
      state.staffList = initialState.staffList;
    },
    resetStudentComplaintList: (state) => {
      state.studentList = initialState.studentList;
    },
    resetCurrentComplaint: (state) => {
      state.current = initialState.current;
    },
    resetFormStatus: (state) => {
      state.form = initialState.form;
    },
    resetAssignStatus: (state) => {
      state.assign = initialState.assign;
    },
    resetDropStatus: (state) => {
      state.drop = initialState.drop;
    },
    resetEvaluateStatus: (state) => {
      state.evaluate = initialState.evaluate;
    },
    resetUpdateStatus: (state) => {
      state.update = initialState.update;
    },
    resetCompleteStatus: (state) => {
      state.complete = initialState.complete;
    },
    resetDeleteStatus: (state) => {
      state.delete = initialState.delete;
    },
    setAdminListFilters: (state, action) => {
      state.adminList.filters = {
        ...state.adminList.filters,
        ...action.payload,
      };
    },
    setStaffListFilters: (state, action) => {
      state.staffList.filters = {
        ...state.staffList.filters,
        ...action.payload,
      };
    },
    setStudentListFilters: (state, action) => {
      state.studentList.filters = {
        ...state.studentList.filters,
        ...action.payload,
      };
    },
    setAdminListPagination: (state, action) => {
      state.adminList.pagination = {
        ...state.adminList.pagination,
        ...action.payload,
      };
    },
    setStaffListPagination: (state, action) => {
      state.staffList.pagination = {
        ...state.staffList.pagination,
        ...action.payload,
      };
    },
    setStudentListPagination: (state, action) => {
      state.studentList.pagination = {
        ...state.studentList.pagination,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Admin complaints list
    builder
      .addCase(fetchAdminComplaints.pending, (state) => {
        state.adminList.status = "loading";
        state.adminList.error = null;
      })
      .addCase(fetchAdminComplaints.fulfilled, (state, action) => {
        state.adminList.status = "succeeded";
        state.adminList.items = action.payload.data;
        state.adminList.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.totalCount,
        };
      })
      .addCase(fetchAdminComplaints.rejected, (state, action) => {
        state.adminList.status = "failed";
        state.adminList.error = action.payload;
      });

    // Student complaints list
    builder
      .addCase(fetchStudentComplaints.pending, (state) => {
        state.studentList.status = "loading";
        state.studentList.error = null;
      })
      .addCase(fetchStudentComplaints.fulfilled, (state, action) => {
        state.studentList.status = "succeeded";
        state.studentList.items = action.payload.data;
        state.studentList.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.totalCount,
        };
      })
      .addCase(fetchStudentComplaints.rejected, (state, action) => {
        state.studentList.status = "failed";
        state.studentList.error = action.payload;
      });

    // Staff complaints list
    builder
      .addCase(fetchStaffComplaints.pending, (state) => {
        state.staffList.status = "loading";
        state.staffList.error = null;
      })
      .addCase(fetchStaffComplaints.fulfilled, (state, action) => {
        state.staffList.status = "succeeded";
        state.staffList.items = action.payload.data;
        state.staffList.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.totalCount,
        };
      })
      .addCase(fetchStaffComplaints.rejected, (state, action) => {
        state.staffList.status = "failed";
        state.staffList.error = action.payload;
      });

    // Fetch complaint by ID (admin)
    builder
      .addCase(fetchComplaintById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchComplaintById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.item = action.payload;
      })
      .addCase(fetchComplaintById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      });

    // Fetch complaint by ID (staff)
    builder
      .addCase(fetchStaffComplaintById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchStaffComplaintById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.item = action.payload;
      })
      .addCase(fetchStaffComplaintById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      });

    // Fetch complaint by ID (student)
    builder
      .addCase(fetchStudentComplaintById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchStudentComplaintById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.item = action.payload;
      })
      .addCase(fetchStudentComplaintById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      });

    // Fetch available staff for assignment
    builder
      .addCase(fetchAvailableStaff.pending, (state) => {
        state.availableStaff.status = "loading";
        state.availableStaff.error = null;
      })
      .addCase(fetchAvailableStaff.fulfilled, (state, action) => {
        state.availableStaff.status = "succeeded";
        state.availableStaff.items = action.payload;
      })
      .addCase(fetchAvailableStaff.rejected, (state, action) => {
        state.availableStaff.status = "failed";
        state.availableStaff.error = action.payload;
      });

    // Assign complaint
    builder
      .addCase(assignComplaint.pending, (state) => {
        state.assign.status = "loading";
        state.assign.error = null;
        state.assign.success = false;
      })
      .addCase(assignComplaint.fulfilled, (state, action) => {
        state.assign.status = "succeeded";
        state.assign.success = true;
        // Update complaint status in admin list if present
        state.adminList.items = state.adminList.items.map((complaint) =>
          complaint.id === action.payload.complaint_id
            ? {
                ...complaint,
                status: "ASSIGNED",
                assigned_staff_id: action.payload.staff_id,
              }
            : complaint
        );
        // Update current complaint if it's the same one
        if (
          state.current.item &&
          state.current.item.id === action.payload.complaint_id
        ) {
          state.current.item = {
            ...state.current.item,
            status: "ASSIGNED",
            assigned_staff_id: action.payload.staff_id,
          };
        }
      })
      .addCase(assignComplaint.rejected, (state, action) => {
        state.assign.status = "failed";
        state.assign.error = action.payload;
        state.assign.success = false;
      });

    // Drop complaint
    builder
      .addCase(dropComplaint.pending, (state) => {
        state.drop.status = "loading";
        state.drop.error = null;
        state.drop.success = false;
      })
      .addCase(dropComplaint.fulfilled, (state, action) => {
        state.drop.status = "succeeded";
        state.drop.success = true;
        // Update complaint status in admin list if present
        state.adminList.items = state.adminList.items.map((complaint) =>
          complaint.id === action.payload.complaint_id
            ? { ...complaint, status: "DROPPED" }
            : complaint
        );
        // Update current complaint if it's the same one
        if (
          state.current.item &&
          state.current.item.id === action.payload.complaint_id
        ) {
          state.current.item = { ...state.current.item, status: "DROPPED" };
        }
      })
      .addCase(dropComplaint.rejected, (state, action) => {
        state.drop.status = "failed";
        state.drop.error = action.payload;
        state.drop.success = false;
      });

    // Fetch complaint stats
    builder
      .addCase(fetchComplaintStats.pending, (state) => {
        state.stats.status = "loading";
        state.stats.error = null;
      })
      .addCase(fetchComplaintStats.fulfilled, (state, action) => {
        state.stats.status = "succeeded";
        state.stats.data = action.payload;
      })
      .addCase(fetchComplaintStats.rejected, (state, action) => {
        state.stats.status = "failed";
        state.stats.error = action.payload;
      });

    // Fetch staff complaint stats
    builder
      .addCase(fetchStaffComplaintStats.pending, (state) => {
        state.stats.status = "loading";
        state.stats.error = null;
      })
      .addCase(fetchStaffComplaintStats.fulfilled, (state, action) => {
        state.stats.status = "succeeded";
        state.stats.data = action.payload;
      })
      .addCase(fetchStaffComplaintStats.rejected, (state, action) => {
        state.stats.status = "failed";
        state.stats.error = action.payload;
      });

    // Evaluate complaint
    builder
      .addCase(evaluateComplaint.pending, (state) => {
        state.evaluate.status = "loading";
        state.evaluate.error = null;
        state.evaluate.success = false;
        state.evaluate.result = null;
      })
      .addCase(evaluateComplaint.fulfilled, (state, action) => {
        state.evaluate.status = "succeeded";
        state.evaluate.success = true;
        state.evaluate.result = action.payload.response;
        // Update complaint status in staff list if present
        state.staffList.items = state.staffList.items.map((complaint) =>
          complaint.id === action.payload.complaint_id
            ? { ...complaint, status: "IN_PROGRESS" }
            : complaint
        );
        // Update current complaint if it's the same one
        if (
          state.current.item &&
          state.current.item.id === action.payload.complaint_id
        ) {
          state.current.item = {
            ...state.current.item,
            status: "IN_PROGRESS",
          };
        }
      })
      .addCase(evaluateComplaint.rejected, (state, action) => {
        state.evaluate.status = "failed";
        state.evaluate.error = action.payload;
        state.evaluate.success = false;
      });

    // Update complaint progress
    builder
      .addCase(updateComplaintProgress.pending, (state) => {
        state.update.status = "loading";
        state.update.error = null;
        state.update.success = false;
      })
      .addCase(updateComplaintProgress.fulfilled, (state, action) => {
        state.update.status = "succeeded";
        state.update.success = true;
        // Update complaint in staff list if present
        state.staffList.items = state.staffList.items.map((complaint) =>
          complaint.id === action.payload.complaint_id
            ? { ...complaint, status: "IN_PROGRESS" }
            : complaint
        );
        // Update current complaint if it's the same one
        if (
          state.current.item &&
          state.current.item.id === action.payload.complaint_id
        ) {
          state.current.item = {
            ...state.current.item,
            status: "IN_PROGRESS",
          };
        }
      })
      .addCase(updateComplaintProgress.rejected, (state, action) => {
        state.update.status = "failed";
        state.update.error = action.payload;
        state.update.success = false;
      });

    // Complete complaint
    builder
      .addCase(completeComplaint.pending, (state) => {
        state.complete.status = "loading";
        state.complete.error = null;
        state.complete.success = false;
      })
      .addCase(completeComplaint.fulfilled, (state, action) => {
        state.complete.status = "succeeded";
        state.complete.success = true;
        // Update complaint status in staff list if present
        state.staffList.items = state.staffList.items.map((complaint) =>
          complaint.id === action.payload.complaint_id
            ? { ...complaint, status: "COMPLETED" }
            : complaint
        );
        // Update current complaint if it's the same one
        if (
          state.current.item &&
          state.current.item.id === action.payload.complaint_id
        ) {
          state.current.item = {
            ...state.current.item,
            status: "COMPLETED",
          };
        }
      })
      .addCase(completeComplaint.rejected, (state, action) => {
        state.complete.status = "failed";
        state.complete.error = action.payload;
        state.complete.success = false;
      });

    // Create complaint
    builder
      .addCase(createComplaint.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(createComplaint.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(createComplaint.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Update complaint
    builder
      .addCase(updateComplaint.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(updateComplaint.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(updateComplaint.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Delete complaint
    builder
      .addCase(deleteComplaint.pending, (state) => {
        state.delete.status = "loading";
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(deleteComplaint.fulfilled, (state, action) => {
        state.delete.status = "succeeded";
        state.delete.success = true;
        // Remove complaint from student list if present
        state.studentList.items = state.studentList.items.filter(
          (complaint) => complaint.id !== action.payload.id
        );
      })
      .addCase(deleteComplaint.rejected, (state, action) => {
        state.delete.status = "failed";
        state.delete.error = action.payload;
        state.delete.success = false;
      });
  },
});

// Export actions and reducer
export const {
  resetAdminComplaintList,
  resetStaffComplaintList,
  resetStudentComplaintList,
  resetCurrentComplaint,
  resetFormStatus,
  resetAssignStatus,
  resetDropStatus,
  resetEvaluateStatus,
  resetUpdateStatus,
  resetCompleteStatus,
  resetDeleteStatus,
  setAdminListFilters,
  setStaffListFilters,
  setStudentListFilters,
  setAdminListPagination,
  setStaffListPagination,
  setStudentListPagination,
} = complaintSlice.actions;

export default complaintSlice.reducer;
