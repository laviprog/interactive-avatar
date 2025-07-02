import { baseApiUrlTranscribe } from '@/lib/api/utils';
import axios from 'axios';
import { getTranscriberToken } from '@/lib/api/transcribe/auth';

const api = axios.create({
  baseURL: baseApiUrlTranscribe(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token-transcribe');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await getTranscriberToken();
      if (newToken) {
        localStorage.setItem('token-transcribe', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
