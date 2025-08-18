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

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 403 에러 처리
    if (error.response?.status === 403) {
      console.error('403 Forbidden Error:', error.response.data);
      // 토큰이 만료되었을 가능성이 높으므로 토큰 제거
      localStorage.removeItem('accessToken');
    }
    return Promise.reject(error);
  }
);

export default api;
