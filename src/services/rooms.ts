import { api } from "./api";

export type MobileRoom = {
  id: string;
  title: string;
  description?: string | null;
  accessCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export const joinRoom = async (accessCode: string) => {
  const res = await api.post<MobileRoom>("/rooms/join", { accessCode });
  return res.data;
};

export const listMyRooms = async () => {
  const res = await api.get<MobileRoom[]>("/rooms/me");
  return res.data;
};

export const getRoom = async (id: string) => {
  const res = await api.get<MobileRoom>(`/rooms/${id}`);
  return res.data;
};
