import axios, { type AxiosInstance } from "axios";

let store: any;

export const injectStore = (_store: any) => {
  store = _store;
};

const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = store?.getState()?.auth?.token;
    // Only add auth token if it exists and it's not a login request
    if (token && !config.url?.includes("login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Only handle 401 for non-login endpoints
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

export const api = createAxiosInstance(
  import.meta.env.VITE_API_URL || "http://3.109.163.184/hrms-api"
);

export const authApi = createAxiosInstance(
  import.meta.env.VITE_API_CENTRAL_URL || "http://3.109.163.184/central-api",
);

export default api;
