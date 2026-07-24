import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";

// NOTE: every API response is wrapped as { success, message, data, meta? } by the backend
// (see backend/src/utils/apiResponse.js) — so the actual payload is response.data.data, not
// response.data. Thunks below unwrap that consistently.

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data: envelope } = await authService.login(payload);
      const { accessToken, refreshToken, user } = envelope.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      return user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data: envelope } = await authService.register(payload);
      return envelope.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data: envelope } = await authService.getProfile();
      return envelope.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to load profile");
    }
  }
);

// Revokes this device's refresh token server-side, then clears local session state.
// Best-effort: even if the network call fails, the local session is still cleared so the
// user is never stuck "logged in" on a device that can't reach the API.
export const logoutUser = createAsyncThunk("auth/logout", async (_, { dispatch }) => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    await authService.logout(refreshToken);
  } catch {
    // ignore — we still clear local state below via the `logout` reducer
  } finally {
    dispatch(logout());
  }
});

const initialState = {
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous, local-only clear (no server call) — used when we already know the session
    // shouldn't be kept (e.g. wrong portal for the account's role) or as the final step of
    // logoutUser above.
    logout: (state) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      state.user = null;
      state.isAuthenticated = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchProfile.rejected, (state) => {
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
