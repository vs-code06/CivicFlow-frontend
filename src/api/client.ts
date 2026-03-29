import axios from 'axios';

// Create an axios instance with default config
const client = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api',
    withCredentials: true, // Important for cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling 401 token expiration (optional for now, but good practice)
// Response interceptor for handling 401 token expiration (optional for now, but good practice)
/*
client.interceptors.response.use(
    (response: any) => response,
    async (error: any) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                await client.post('/auth/refresh');
                // Retry original request
                return client(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or clear state
                window.location.href = '/login'; // Or handle via context
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
*/

export default client;
