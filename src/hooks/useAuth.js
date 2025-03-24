// src/hooks/useAuth.js
import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/authContext";
import {
  resetOtpState,
  sendAdminOtp,
  verifyAdminOtp,
} from "../store/authSlice";
import { ROUTES } from "../utils/constants";

/**
 * Custom hook for authentication functionality
 * Extends useContext(AuthContext) with navigation and convenience methods
 *
 * @returns {Object} Auth context plus additional methods
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Use a try-catch block to handle potential Redux context issues
  let authState;
  try {
    authState = useSelector((state) => state.auth);
  } catch (error) {
    console.error(
      "Redux Provider not found. Falling back to default auth state.",
      error
    );
    authState = {
      isAuthenticated: false,
      loading: false,
      otpSent: false,
      otpEmail: null,
      otpSending: false,
      verifying: false,
      error: null,
    };
  }

  // Try to get AuthContext, but provide a fallback
  const authContext = useContext(AuthContext) || {
    logout: () => {
      console.warn("No logout method provided");
      navigate(ROUTES.LOGIN, { replace: true });
    },
  };

  // Extended methods
  const loginWithOtp = async (email, otp) => {
    try {
      const response = await dispatch(verifyAdminOtp({ email, otp })).unwrap();
      if (response) {
        navigate(ROUTES.DASHBOARD, { replace: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error("OTP Verification failed:", error);
      return false;
    }
  };

  const initiateLogin = async (email) => {
    try {
      const response = await dispatch(sendAdminOtp(email)).unwrap();
      return !!response;
    } catch (error) {
      console.error("Sending OTP failed:", error);
      return false;
    }
  };

  const logoutUser = () => {
    authContext.logout();
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const redirectToLogin = () => {
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const requireAuth = () => {
    // Don't do anything while loading
    if (authState.loading) {
      return;
    }

    // If not authenticated after loading completes, redirect
    if (!authState.isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  const clearError = () => {
    // Implement error clearing logic if needed
    // This might involve dispatching an action to clear errors
  };

  return {
    ...authContext,
    ...authState,
    loginWithOtp,
    initiateLogin,
    logoutUser,
    redirectToLogin,
    requireAuth,
    clearError,
    resetOtpState: () => dispatch(resetOtpState()),
  };
};

export default useAuth;
