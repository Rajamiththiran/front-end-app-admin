// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import complaintReducer from "./complaintSlice";
import staffReducer from "./staffSlice";
import studentReducer from "./studentSlice";

/**
 * Configure and create the Redux store with all reducers
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
    complaints: complaintReducer,
    staff: staffReducer,
    students: studentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific action types
        ignoredActions: ["auth/login/fulfilled", "auth/verifyOtp/fulfilled"],
      },
    }),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export default store;
