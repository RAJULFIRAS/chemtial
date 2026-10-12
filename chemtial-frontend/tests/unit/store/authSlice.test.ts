import { describe, it, expect, vi, beforeEach } from "vitest";
import authReducer, {
  logout,
  clearError,
  loginUser,
  registerUser,
  restoreAuth,
} from "../../../src/store/slices/authSlice";

vi.mock("../../../src/services/api", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

describe("authSlice", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("returns initial state", () => {
    const state = authReducer(undefined, { type: "unknown" });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("logout clears user & tokens", () => {
    localStorage.setItem("accessToken", "x");
    localStorage.setItem("refreshToken", "y");
    localStorage.setItem("authState", "{}");
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
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(localStorage.getItem("authState")).toBeNull();
  });

  it("clearError resets error", () => {
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
    expect(state.error).toBeNull();
  });

  it("loginUser fulfilled persists user & tokens", () => {
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
    expect(localStorage.getItem("refreshToken")).toBe("rt");
  });

  it("loginUser rejected sets error", () => {
    const state = authReducer(undefined, {
      type: loginUser.rejected.type,
      error: { message: "Invalid credentials" },
    });
    expect(state.error).toBe("Invalid credentials");
    expect(state.isAuthenticated).toBe(false);
  });

  it("registerUser pending sets isLoading", () => {
    const state = authReducer(undefined, { type: registerUser.pending.type });
    expect(state.isLoading).toBe(true);
  });

  it("registerUser fulfilled persists user", () => {
    const state = authReducer(undefined, {
      type: registerUser.fulfilled.type,
      payload: {
        accessToken: "at",
        refreshToken: "rt",
        user: { id: "2", name: "New", email: "new@x.com", role: "user" },
      },
    });
    expect(state.user?.email).toBe("new@x.com");
    expect(state.isAuthenticated).toBe(true);
  });

  it("registerUser rejected sets error", () => {
    const state = authReducer(undefined, {
      type: registerUser.rejected.type,
      error: { message: "Email taken" },
    });
    expect(state.error).toBe("Email taken");
    expect(state.isAuthenticated).toBe(false);
  });

  it("restoreAuth loads from localStorage", () => {
    localStorage.setItem(
      "authState",
      JSON.stringify({
        user: { id: "1", name: "U", email: "u@x.com" },
        isAuthenticated: true,
      }),
    );
    const state = authReducer(undefined, restoreAuth());
    expect(state.user?.email).toBe("u@x.com");
    expect(state.isAuthenticated).toBe(true);
  });

  it("restoreAuth no-ops when localStorage empty", () => {
    const state = authReducer(undefined, restoreAuth());
    expect(state.user).toBeNull();
  });
});
