import axios from "axios";
import { showAuthErrorNotification } from "@/utils/notificationHelper";

const authAxios = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

authAxios.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

authAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            sessionStorage.removeItem("authToken");
            showAuthErrorNotification();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

const publicAxios = axios.create({ baseURL: process.env.REACT_APP_BACKEND_URL });

export { authAxios, publicAxios };
