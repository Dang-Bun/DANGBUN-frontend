import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.39.35.242:8080',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
