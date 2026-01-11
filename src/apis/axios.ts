import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dangbun.o-r.kr/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const noAuthPaths = [
      '/users/signup/email-code',
      '/users/signup',
      '/users/login',
      '/users/login/kakao',
    ];
    const url = config.url || '';

    if (!noAuthPaths.some((path) => url.includes(path))) {
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
