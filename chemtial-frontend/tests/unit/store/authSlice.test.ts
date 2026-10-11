import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  logout,
  clearError,
  loginUser,
} from "../../../src/store/slices/authSlice";

vi.mock("../../../src/services/api", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

import { apiClient } from "../../../src/services/api";

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should return initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("logout should clear user and storage", () => {
    localStorage.setItem("accessToken", "x");
    localStorage.setItem("refreshToken", "y");
    const state = authReducer(
      {
        user: { id: "1", name: "U", email: "u@x.com" },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
      logout(),
    );
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("clearError should reset error", () => {
    const state = authReducer(
      {
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: "some error",
      },
      clearError(),
    );
    expect(state.error).toBeNull();
  });

  it("loginUser pending sets isLoading", () => {
    const state = authReducer(undefined, { type: loginUser.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it("loginUser fulfilled sets user and tokens", () => {
    const state = authReducer(undefined, {
      type: loginUser.fulfilled.type,
      payload: {
        accessToken: "at",
        refreshToken: "rt",
        user: { id: "1", name: "U", email: "u@x.com", role: "user" },
      },
    });
    expect(state.user?.email).toBe("u@x.com");
    expect(state.isAuthenticated).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("at");
  });

  it("loginUser rejected sets error", () => {
    const state = authReducer(undefined, {
      type: loginUser.rejected.type,
      error: { message: "Invalid credentials" },
    });
    expect(state.error).toBe("Invalid credentials");
    expect(state.isAuthenticated).toBe(false);
  });
});
