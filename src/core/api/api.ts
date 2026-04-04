import axios, { type AxiosInstance } from "axios";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = store?.getState()?.auth?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        if (error.config && !error.config.url?.includes("login")) {
          if (store) {
            store.dispatch({ type: "auth/logout" });
          }
          if (!window.location.hash.includes("/login")) {
            window.location.hash = "/login";
          }
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const api = createAxiosInstance(import.meta.env.VITE_API_URL || "");

export const authApi = createAxiosInstance(
  import.meta.env.VITE_API_CENTRAL_URL || "http://localhost:3000/auth",
);

export default api;
