import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dangbun.o-r.kr',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
