import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_SERVER = 'server_url';

const DEFAULT_SERVER_URL = 'http://localhost:8081';

// 获取服务器地址
export const getServerUrl = async (): Promise<string> => {
  return (await AsyncStorage.getItem(STORAGE_KEY_SERVER)) || DEFAULT_SERVER_URL;
};

// 设置服务器地址
export const setServerUrl = async (url: string): Promise<void> => {
  // 移除末尾斜杠
  const cleanUrl = url.replace(/\/+$/, '');
  await AsyncStorage.setItem(STORAGE_KEY_SERVER, cleanUrl);
  // 重新创建 client
  await createApiClient(cleanUrl);
};

// 检查是否已配置服务器
export const isServerConfigured = async (): Promise<boolean> => {
  const url = await AsyncStorage.getItem(STORAGE_KEY_SERVER);
  return !!url;
};

let apiClientInstance: AxiosInstance | null = null;

// 创建/重建 API 客户端
export const createApiClient = async (baseUrl?: string): Promise<AxiosInstance> => {
  const url = baseUrl || (await getServerUrl());
  
  apiClientInstance = axios.create({
    baseURL: url,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器 - 添加 Token
  apiClientInstance.interceptors.request.use(
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
  apiClientInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as any;
      if (error.response?.status === 401 && !originalRequest._retry) {
        try {
          await refreshToken();
          const token = await AsyncStorage.getItem('access_token');
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            originalRequest._retry = true;
            return apiClientInstance!(originalRequest);
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  return apiClientInstance;
};

// 获取 API 客户端（确保已初始化）
export const getApiClient = async (): Promise<AxiosInstance> => {
  if (!apiClientInstance) {
    await createApiClient();
  }
  return apiClientInstance!;
};

// 刷新 Token
const refreshToken = async () => {
  const client = await getApiClient();
  try {
    const response = await client.post('/api/v1/auth/refresh');
    const { access_token, expires_at } = response.data;
    await AsyncStorage.setItem('access_token', access_token);
    await AsyncStorage.setItem('expires_at', String(Date.now() + expires_at * 1000));
  } catch (error) {
    throw error;
  }
};

// 向后兼容的默认导出（会在 App 启动时被 lazy init 替换）
export const apiClient: AxiosInstance = axios.create({ baseURL: DEFAULT_SERVER_URL });

export default apiClient;
