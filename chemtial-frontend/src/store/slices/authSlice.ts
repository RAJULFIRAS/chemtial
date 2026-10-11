import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiClient } from "../../services/api";
import { User } from "../../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const loadAuthState = (): Partial<AuthState> => {
  try {
    const serializedState = localStorage.getItem("authState");
    if (serializedState === null) {
      return {};
    }
    return JSON.parse(serializedState);
  } catch {
    return {};
  }
};

const savedState = loadAuthState();

const initialState: AuthState = {
  user: savedState.user || null,
  isAuthenticated: savedState.isAuthenticated || false,
  isLoading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: { name: string; email: string; password: string }) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data.data;
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authState");
    },
    clearError: (state) => {
      state.error = null;
    },
    restoreAuth: (state) => {
      const saved = loadAuthState();
      if (saved.user && saved.isAuthenticated) {
        state.user = saved.user as User;
        state.isAuthenticated = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem(
          "authState",
          JSON.stringify({
            user: action.payload.user,
            isAuthenticated: true,
          }),
        );
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registrasi gagal";
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;

        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem(
          "authState",
          JSON.stringify({
            user: action.payload.user,
            isAuthenticated: true,
          }),
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login gagal";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError, restoreAuth } = authSlice.actions;
export default authSlice.reducer;
