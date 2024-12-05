import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Interceptor for adding access token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercept responses to handle token refresh logic
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and we haven't already tried refreshing the token
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.info("trying to refresh tokens...")
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axiosInstance.post('/auth/refresh-token', { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Save new tokens to localStorage
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);

                // Set the new token in the Authorization header and retry the request
                axiosInstance.defaults.headers['Authorization'] = `Bearer ${accessToken}`;
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return axiosInstance(originalRequest); // Retry original request
            } catch (err) {
                // If refresh fails, logout the user
                console.error("Refresh token failed:", err);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login'; // Redirect to login page
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;