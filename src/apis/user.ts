import api from './axios';

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
