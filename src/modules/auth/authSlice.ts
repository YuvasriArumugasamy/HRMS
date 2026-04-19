import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/core/api/api";

interface User {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    credentials: { email: string; password: string; appCode: string },
    { rejectWithValue }
  ) => {
    try {
      const { email, password, appCode } = credentials;
      
      console.log("Attempting Login with:", { 
        url: authApi.defaults.baseURL + "/login",
        AppCode: appCode,
        email: email
      });

      console.log("Full Request URL:", authApi.defaults.baseURL + "/login");
      console.log("Request Payload:", { email, password, AppCode: appCode });

      const response = await authApi.post("auth/login", {
        email,
        password,
        AppCode: appCode,
      });

      console.log("Login Response Received:", response.data);

      // Handle various response structures
      const responseData = response.data;
      
      // If the API returns { success: false, message: "..." }
      if (responseData.success === false) {
        return rejectWithValue(responseData.message || "Login failed");
      }

      // Extract result from data property or top level
      // Support patterns: { success: true, data: { token, ... } } OR { token, ... }
      const res = responseData.data || responseData;

      if (!res.token) {
        console.warn("Login success but no token found in:", res);
        return rejectWithValue("Invalid response from server: Missing token");
      }

      return {
        token: res.token,
        user: {
          userId: res.userId,
          email: res.email,
          role: res.role,
          ...res,
        },
      };
    } catch (error: any) {
      console.error("Login Error Full Details:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.data?.message || 
        "Login failed. Please check your credentials and try again.";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.post("/logout");
      return null;
    } catch (error: any) {
      return rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Login failed. Please try again.";
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setError, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
