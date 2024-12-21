
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://219.217.199.161:8080/api', // 设置基础 URL
});

// 添加请求拦截器
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token; // 添加 JWT
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;