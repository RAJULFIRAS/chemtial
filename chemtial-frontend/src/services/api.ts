import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

const processQueue = (token: string | null): void => {
  pendingQueue.forEach((cb) => {
    if (token) cb(token);
  });
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authState");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingQueue.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        processQueue(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("authState");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    let errorMessage = "Terjadi kesalahan";

    if (error.response) {
      const { status, data } = error.response;
      const responseData = data as any;

      if (responseData?.error?.details) {
        const details = responseData.error.details;
        const messages = Object.values(details).flat();
        if (messages.length > 0) errorMessage = messages.join(", ");
      } else if (responseData?.error?.message) {
        errorMessage = responseData.error.message;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === "string") {
        errorMessage = responseData;
      } else {
        const statusMessages: Record<number, string> = {
          400: "Data yang dikirim tidak valid",
          403: "Anda tidak memiliki akses",
          404: "Data tidak ditemukan",
          409: "Data sudah ada",
          429: "Terlalu banyak permintaan, coba lagi nanti",
          500: "Terjadi kesalahan pada server",
        };
        errorMessage =
          statusMessages[status] || `Terjadi kesalahan (${status})`;
      }

      if (import.meta.env.DEV) {
        console.error("API Error:", {
          status,
          message: errorMessage,
          url: error.config?.url,
        });
      }
    } else if (error.request) {
      errorMessage =
        "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.";
    } else {
      errorMessage = error.message || "Terjadi kesalahan";
    }

    const customError = new Error(errorMessage) as any;
    customError.originalError = error;
    customError.isApiError = true;

    return Promise.reject(customError);
  },
);

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Terjadi kesalahan yang tidak diketahui";
};

export default apiClient;
