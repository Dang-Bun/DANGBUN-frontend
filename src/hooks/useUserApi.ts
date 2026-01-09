import api from '../apis/axios';

export const useUserApi = {
  signup: () => {},
  password: () => {},
  logout: () => {},
  login: (data: { email: string; password: string }) =>
    api.post('users/login', data),
  kakaoLogin: (data: {
    code?: string;
    error?: string;
    error_description?: string;
    state?: string;
  }) => api.post('users/login/kakao', data),

  emailcode: () => {},
  me: () => {},
};
