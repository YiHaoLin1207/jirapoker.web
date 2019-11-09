import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';

// const axiosNtlm = axios.create({
//   baseURL: process.env.VUE_APP_HOST_BACKEND_URL,
//   timeout: 5000,
//   headers: {
//     'Content-Type': 'application/json',
//     'withCredentials': 'true'
//     }
// });

axios.interceptors.request.use( (config: AxiosRequestConfig) => {
  config.baseURL = process.env.VUE_APP_HOST_BACKEND_URL;
  config.withCredentials  = true;
  config.headers = {
    'Content-Type': 'application/json',
  };
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const axiosNtlm = axios;
