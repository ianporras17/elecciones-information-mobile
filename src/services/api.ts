import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

/* LOGIN */

export const loginUser = async (payload: {
  identifier: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

/* REGISTER */

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};
