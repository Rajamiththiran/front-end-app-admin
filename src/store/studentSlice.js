// src/store/studentSlice.js
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
export const fetchStudentList = createAsyncThunk(
  "students/fetchList",
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiService.student.getAllStudents(params);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "students/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.student.getStudentById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createStudent = createAsyncThunk(
  "students/create",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await apiService.student.createStudent(studentData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await apiService.student.updateStudent(studentData);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.student.deleteStudent(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const activateStudent = createAsyncThunk(
  "students/activate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.student.activateStudent(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deactivateStudent = createAsyncThunk(
  "students/deactivate",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.student.deactivateStudent(id);
      return { id, response };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Student slice
const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {
    resetStudentList: (state) => {
      state.list = initialState.list;
    },
    resetCurrentStudent: (state) => {
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
    // Fetch Student List
    builder
      .addCase(fetchStudentList.pending, (state) => {
        state.list.status = "loading";
        state.list.error = null;
      })
      .addCase(fetchStudentList.fulfilled, (state, action) => {
        state.list.status = "succeeded";
        state.list.items = action.payload.data;
        state.list.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.totalCount,
        };
      })
      .addCase(fetchStudentList.rejected, (state, action) => {
        state.list.status = "failed";
        state.list.error = action.payload;
      });

    // Fetch Student by ID
    builder
      .addCase(fetchStudentById.pending, (state) => {
        state.current.status = "loading";
        state.current.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.current.status = "succeeded";
        state.current.item = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.current.status = "failed";
        state.current.error = action.payload;
      });

    // Create Student
    builder
      .addCase(createStudent.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(createStudent.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Update Student
    builder
      .addCase(updateStudent.pending, (state) => {
        state.form.status = "loading";
        state.form.error = null;
        state.form.success = false;
      })
      .addCase(updateStudent.fulfilled, (state) => {
        state.form.status = "succeeded";
        state.form.success = true;
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.form.status = "failed";
        state.form.error = action.payload;
        state.form.success = false;
      });

    // Delete Student
    builder
      .addCase(deleteStudent.pending, (state) => {
        state.delete.status = "loading";
        state.delete.error = null;
        state.delete.success = false;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.delete.status = "succeeded";
        state.delete.success = true;
        // Remove student from list if present
        state.list.items = state.list.items.filter(
          (student) => student.id !== action.payload.id
        );
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.delete.status = "failed";
        state.delete.error = action.payload;
        state.delete.success = false;
      });

    // Activate Student
    builder
      .addCase(activateStudent.pending, (state) => {
        state.activate.status = "loading";
        state.activate.error = null;
        state.activate.success = false;
      })
      .addCase(activateStudent.fulfilled, (state, action) => {
        state.activate.status = "succeeded";
        state.activate.success = true;
        // Update student status in list if present
        state.list.items = state.list.items.map((student) =>
          student.id === action.payload.id
            ? { ...student, is_active: true }
            : student
        );
        // Update current student if it's the same one
        if (state.current.item && state.current.item.id === action.payload.id) {
          state.current.item = { ...state.current.item, is_active: true };
        }
      })
      .addCase(activateStudent.rejected, (state, action) => {
        state.activate.status = "failed";
        state.activate.error = action.payload;
        state.activate.success = false;
      });

    // Deactivate Student
    builder
      .addCase(deactivateStudent.pending, (state) => {
        state.deactivate.status = "loading";
        state.deactivate.error = null;
        state.deactivate.success = false;
      })
      .addCase(deactivateStudent.fulfilled, (state, action) => {
        state.deactivate.status = "succeeded";
        state.deactivate.success = true;
        // Update student status in list if present
        state.list.items = state.list.items.map((student) =>
          student.id === action.payload.id
            ? { ...student, is_active: false }
            : student
        );
        // Update current student if it's the same one
        if (state.current.item && state.current.item.id === action.payload.id) {
          state.current.item = { ...state.current.item, is_active: false };
        }
      })
      .addCase(deactivateStudent.rejected, (state, action) => {
        state.deactivate.status = "failed";
        state.deactivate.error = action.payload;
        state.deactivate.success = false;
      });
  },
});

// Export actions and reducer
export const {
  resetStudentList,
  resetCurrentStudent,
  resetFormStatus,
  resetDeleteStatus,
  resetActivationStatus,
  setListFilters,
  setListPagination,
} = studentSlice.actions;

export default studentSlice.reducer;
