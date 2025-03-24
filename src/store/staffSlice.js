// src/store/staffSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../services/api";
import { PAGINATION } from "../utils/constants";
import { getErrorMessage } from "../utils/helpers";

// Initial state
const initialState = {
  list: {
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
      is_active: -1,
    },
  },
  current: {
    item: null,
    status: "idle",
    error: null,
  },
  form: {
    status: "idle",
    error: null,
    success: false,
  },
  delete: {
    status: "idle",
    error: null,
    success: false,
  },
  activate: {
    status: "idle",
    error: null,
    success: false,
  },
  deactivate: {
    status: "idle",
    error: null,
    success: false,
  },
};

// Async thunks
export const fetchStaffList = createAsyncThunk(
  "staff/fetchList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.getAllStaff(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStaffById = createAsyncThunk(
  "staff/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.getStaffById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createStaff = createAsyncThunk(
  "staff/create",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.createStaff(staffData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/update",
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.updateStaff(staffData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.deleteStaff(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const activateStaff = createAsyncThunk(
  "staff/activate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.activateStaff(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deactivateStaff = createAsyncThunk(
  "staff/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.staff.deactivateStaff(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Staff slice
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    resetStaffList: (state) => {
      state.list = initialState.list;
    },
    resetCurrentStaff: (state) => {
      state.current = initialState.current;
    },
    resetFormStatus: (state) => {
      state.form = initialState.form;
    },
    resetDeleteStatus: (state) => {
      state.delete = initialState.delete;
    },
    resetActivationStatus: (state) => {
      state.activate = initialState.activate;
      state.deactivate = initialState.deactivate;
    },
    setListFilters: (state, action) => {
      state.list.filters = {
        ...state.list.filters,
        ...action.payload,
      };
    },
    setListPagination: (state, action) => {
      state.list.pagination = {
        ...state.list.pagination,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Staff List
    builder
      .addCase(fetchStaffList.pending, (state) => {
        state.list.status = "loading";
        state.list.error = null;
      })
      .addCase(fetchStaffList.fulfilled, (state, action) => {
        state.list.status = "succeeded";
        state.list.items = action.payload.data;
        state.list.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.totalCount,
        };
      })
      .addCase(fetchStaffList.rejected, (state, action) => {
        state.list.status = "failed";
        state.list.error = action.payload;
      });

    // Fetch Staff by ID
    builder
      .addCase(fetchStaffById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.item = action.payload;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      });

    // Create Staff
    builder
      .addCase(createStaff.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(createStaff.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(createStaff.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Update Staff
    builder
      .addCase(updateStaff.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(updateStaff.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Delete Staff
    builder
      .addCase(deleteStaff.pending, (state) => {
        state.delete.status = "loading";
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.delete.status = "succeeded";
        state.delete.success = true;
        // Remove staff from list if present
        state.list.items = state.list.items.filter(
          (staff) => staff.id !== action.payload.id
        );
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.delete.status = "failed";
        state.delete.error = action.payload;
        state.delete.success = false;
      });

    // Activate Staff
    builder
      .addCase(activateStaff.pending, (state) => {
        state.activate.status = "loading";
        state.activate.error = null;
        state.activate.success = false;
      })
      .addCase(activateStaff.fulfilled, (state, action) => {
        state.activate.status = "succeeded";
        state.activate.success = true;
        // Update staff status in list if present
        state.list.items = state.list.items.map((staff) =>
          staff.id === action.payload.id ? { ...staff, is_active: true } : staff
        );
        // Update current staff if it's the same one
        if (state.current.item && state.current.item.id === action.payload.id) {
          state.current.item = { ...state.current.item, is_active: true };
        }
      })
      .addCase(activateStaff.rejected, (state, action) => {
        state.activate.status = "failed";
        state.activate.error = action.payload;
        state.activate.success = false;
      });

    // Deactivate Staff
    builder
      .addCase(deactivateStaff.pending, (state) => {
        state.deactivate.status = "loading";
        state.deactivate.error = null;
        state.deactivate.success = false;
      })
      .addCase(deactivateStaff.fulfilled, (state, action) => {
        state.deactivate.status = "succeeded";
        state.deactivate.success = true;
        // Update staff status in list if present
        state.list.items = state.list.items.map((staff) =>
          staff.id === action.payload.id
            ? { ...staff, is_active: false }
            : staff
        );
        // Update current staff if it's the same one
        if (state.current.item && state.current.item.id === action.payload.id) {
          state.current.item = { ...state.current.item, is_active: false };
        }
      })
      .addCase(deactivateStaff.rejected, (state, action) => {
        state.deactivate.status = "failed";
        state.deactivate.error = action.payload;
        state.deactivate.success = false;
      });
  },
});

// Export actions and reducer
export const {
  resetStaffList,
  resetCurrentStaff,
  resetFormStatus,
  resetDeleteStatus,
  resetActivationStatus,
  setListFilters,
  setListPagination,
} = staffSlice.actions;

export default staffSlice.reducer;
