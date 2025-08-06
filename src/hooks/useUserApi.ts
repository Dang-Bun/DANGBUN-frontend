import api from '../apis/axios';

export const useUserApi = {
  signup: () => {},
  password: () => {},
  logout: () => {},
  login: (data: { email: string; password: string }) =>
    api.post('users/login', data),
  emailcode: () => {},
  me: () => {},
};
