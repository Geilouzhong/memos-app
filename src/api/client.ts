import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 配置 API 基础地址
const API_BASE_URL = 'http://localhost:8081'; // 替换为你的 Memos 服务器地址

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误和 Token 刷新
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Token 过期，尝试刷新
    if (error.response?.status === 401 && !originalRequest._retry) {
      try {
        await refreshToken();
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          originalRequest._retry = true;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新失败，跳转到登录页
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// 刷新 Token
const refreshToken = async () => {
  try {
    const response = await apiClient.post('/api/v1/auth/refresh');
    const { access_token, expires_at } = response.data;
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('expires_at', String(expires_at));
    await AsyncStorage.setItem('expires_at', String(Date.now() + expires_at * 1000));
  } catch (error) {
    throw error;
  }
};

export default apiClient;
