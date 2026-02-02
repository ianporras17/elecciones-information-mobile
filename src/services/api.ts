import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Interceptor: agrega Authorization Bearer automáticamente
 */
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ===== AUTH ===== */

export const loginUser = async (payload: {
  identifier: string; 
  password: string;
}) => {
  const res = await api.post("/auth/login", payload);
  return res.data; // { access_token, user }
};

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
