import api from './axios'; // 너가 설정한 axios 인스턴스

export const signupUser = async ({
  email,
  password,
  name,
  certCode,
}: {
  email: string;
  password: string;
  name: string;
  certCode: string;
}) => {
  return await api.post('/users/signup', {
    email,
    password,
    name,
    certCode,
  });
};
