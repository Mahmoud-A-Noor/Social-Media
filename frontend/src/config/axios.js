import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Install this package to decode JWTs: `npm install jwt-decode`

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Utility to check token expiration
const isTokenExpired = (token) => {
    try {
        const { exp } = jwtDecode(token);
        return Date.now() >= exp * 1000; // Convert `exp` from seconds to milliseconds
    } catch (error) {
        console.error("Invalid token:", error);
        return true; // Treat invalid tokens as expired
    }
};

// Flag to avoid infinite loops
let isRefreshing = false;
let refreshQueue = []; // To queue requests while refreshing the token

// Refresh token function
const refreshTokens = async () => {
    if (isRefreshing) {
        // Wait for the ongoing token refresh to complete
        return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
        });
    }

    isRefreshing = true;

    try {
        console.log("Refreshing token...");
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
        });
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Resolve all queued requests with the new token
        refreshQueue.forEach((callback) => callback.resolve(accessToken));
        refreshQueue = [];

        return accessToken;
    } catch (error) {
        console.error("Token refresh failed:", error);

        // Reject all queued requests
        refreshQueue.forEach((callback) => callback.reject(error));
        refreshQueue = [];

        // remove tokens and redirect user to login page
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login'; // Redirect to login page

        throw error;
    } finally {
        isRefreshing = false;
    }
};

// Interceptor for adding access token to headers
axiosInstance.interceptors.request.use(
    async (config) => {
        // Skip token check for refresh-token endpoint
        if (config.url.includes('/auth/refresh-token')) return config;

        let token = localStorage.getItem('accessToken');

        if (token && isTokenExpired(token)) {
            try {
                token = await refreshTokens();
            } catch (error) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(error);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Intercept responses to handle general errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default axiosInstance;