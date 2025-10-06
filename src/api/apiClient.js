import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Handle token expiration and network errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth';
    }
    
    // Add better error messages for common network issues
    if (!error.response) {
      error.message = 'Network error: Unable to connect to server';
    } else if (error.response.status >= 500) {
      error.message = 'Server error: Please try again later';
    }
    
    return Promise.reject(error);
  }
);

// Health check function to test API connectivity
export const healthCheck = async () => {
  try {
    const baseUrl = API_URL.replace('/api/v1', '');
    const response = await axios.get(baseUrl);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default apiClient;