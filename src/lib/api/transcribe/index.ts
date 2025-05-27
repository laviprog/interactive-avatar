// api/index.ts
import { baseApiUrlTranscribe } from '@/lib/api/utils';
import { getTranscriberToken } from '@/lib/api/transcribe/auth';
import axios from 'axios';

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

type FailedRequestQueueItem = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
};

let isRefreshing = false;
let failedRequestsQueue: FailedRequestQueueItem[] = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then(() =>
            api({
              ...originalRequest,
              params: originalRequest.params,
              data: originalRequest.data,
            })
          )
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await getTranscriberToken();

        if (newToken) {
          localStorage.setItem('token-transcribe', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          const response = await api(originalRequest);

          failedRequestsQueue.forEach((pending) => pending.resolve(response));

          return response;
        } else {
          throw new Error('Failed to refresh token');
        }
      } catch (refreshError) {
        localStorage.removeItem('token-transcribe');
        localStorage.removeItem('refresh-transcriber');

        failedRequestsQueue.forEach((pending) => pending.reject(refreshError));

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        failedRequestsQueue = [];
      }
    }

    return Promise.reject(error);
  }
);

export default api;
