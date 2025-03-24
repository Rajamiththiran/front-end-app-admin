// src/store/authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../services/api";
import { getErrorMessage } from "../utils/helpers";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  role: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  // For OTP flow
  otpSent: false,
  otpSending: false,
  otpError: null,
  verifying: false,
  verifyError: null,
  email: null,
};

// Async thunks
export const sendAdminOtp = createAsyncThunk(
  "auth/sendAdminOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.adminSendOtp(email);
      return { response, email };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyAdminOtp = createAsyncThunk(
  "auth/verifyAdminOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.adminVerifyOtp(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const sendStaffOtp = createAsyncThunk(
  "auth/sendStaffOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.staffSendOtp(email);
      return { response, email };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyStaffOtp = createAsyncThunk(
  "auth/verifyStaffOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.staffVerifyOtp(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const sendStudentOtp = createAsyncThunk(
  "auth/sendStudentOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.studentSendOtp(email);
      return { response, email };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const verifyStudentOtp = createAsyncThunk(
  "auth/verifyStudentOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.studentVerifyOtp(email, otp);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  apiService.auth.logout();
  return null;
});

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: () => {
      return {
        ...initialState,
      };
    },
    resetOtpState: (state) => {
      state.otpSent = false;
      state.otpSending = false;
      state.otpError = null;
      state.verifying = false;
      state.verifyError = null;
      state.email = null;
    },
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role;
    },
  },
  extraReducers: (builder) => {
    // Send Admin OTP
    builder
      .addCase(sendAdminOtp.pending, (state) => {
        state.otpSending = true;
        state.otpError = null;
      })
      .addCase(sendAdminOtp.fulfilled, (state, action) => {
        state.otpSending = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(sendAdminOtp.rejected, (state, action) => {
        state.otpSending = false;
        state.otpError = action.payload;
      });

    // Verify Admin OTP
    builder
      .addCase(verifyAdminOtp.pending, (state) => {
        state.verifying = true;
        state.verifyError = null;
      })
      .addCase(verifyAdminOtp.fulfilled, (state, action) => {
        state.verifying = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.status = "succeeded";
        // Clear OTP state
        state.otpSent = false;
        state.email = null;
      })
      .addCase(verifyAdminOtp.rejected, (state, action) => {
        state.verifying = false;
        state.verifyError = action.payload;
      });

    // Send Staff OTP
    builder
      .addCase(sendStaffOtp.pending, (state) => {
        state.otpSending = true;
        state.otpError = null;
      })
      .addCase(sendStaffOtp.fulfilled, (state, action) => {
        state.otpSending = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(sendStaffOtp.rejected, (state, action) => {
        state.otpSending = false;
        state.otpError = action.payload;
      });

    // Verify Staff OTP
    builder
      .addCase(verifyStaffOtp.pending, (state) => {
        state.verifying = true;
        state.verifyError = null;
      })
      .addCase(verifyStaffOtp.fulfilled, (state, action) => {
        state.verifying = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.status = "succeeded";
        // Clear OTP state
        state.otpSent = false;
        state.email = null;
      })
      .addCase(verifyStaffOtp.rejected, (state, action) => {
        state.verifying = false;
        state.verifyError = action.payload;
      });

    // Send Student OTP
    builder
      .addCase(sendStudentOtp.pending, (state) => {
        state.otpSending = true;
        state.otpError = null;
      })
      .addCase(sendStudentOtp.fulfilled, (state, action) => {
        state.otpSending = false;
        state.otpSent = true;
        state.email = action.payload.email;
      })
      .addCase(sendStudentOtp.rejected, (state, action) => {
        state.otpSending = false;
        state.otpError = action.payload;
      });

    // Verify Student OTP
    builder
      .addCase(verifyStudentOtp.pending, (state) => {
        state.verifying = true;
        state.verifyError = null;
      })
      .addCase(verifyStudentOtp.fulfilled, (state, action) => {
        state.verifying = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.token = action.payload.token;
        state.role = action.payload.role;
        state.status = "succeeded";
        // Clear OTP state
        state.otpSent = false;
        state.email = null;
      })
      .addCase(verifyStudentOtp.rejected, (state, action) => {
        state.verifying = false;
        state.verifyError = action.payload;
      });

    // Logout
    builder.addCase(logout.fulfilled, () => {
      return initialState;
    });
  },
});

// Export actions and reducer
export const { resetAuth, resetOtpState, setAuthState } = authSlice.actions;

export default authSlice.reducer;
