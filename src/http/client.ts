import axios from "axios";
import { useAuthStore } from "../store";
import { AUTH_SERVICE } from "./api";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// refresh token endpoint to avoid circular depedency
const refreshToken = async () => {
  await axios.post(
    `${import.meta.env.VITE_BACKEND_API_URL}${AUTH_SERVICE}/auth/refresh`,
    {},
    {
      withCredentials: true,
    }
  );
};

// api response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._isRetry) {
      try {
        originalRequest._isRetry = true;
        const headers = { ...originalRequest.headers };
        await refreshToken();
        return api.request({ ...originalRequest, headers });
      } catch (error) {
        console.log("Token refresh error", error);
        // clear zustand state
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
