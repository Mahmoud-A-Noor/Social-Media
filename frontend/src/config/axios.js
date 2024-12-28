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

const MAX_RETRIES = 3;
axiosInstance.interceptors.response.use(
    (response) => {
        // If the response is successful, simply return it
        return response;
    },
    async (error) => {
        // Check if the error is a network error
        const isNetworkError = !error.response && error.message === 'Network Error';
        const config = error.config;

        if (!config._retryCount) {
            config._retryCount = 0;
        }

        if (isNetworkError && config._retryCount < MAX_RETRIES) {
            config._retryCount += 1;

            // Retry the request
            return axiosInstance(config);
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;