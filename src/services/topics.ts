import { api } from "./api";

export type MobileExternalResource = {
  id: string;
  type: "LINK" | "VIDEO" | "DOCUMENT";
  title: string;
  url: string;
  description?: string | null;
  order: number;
};

export type MobileTopic = {
  id: string;
  roomId: string;
  title: string;
  content?: string | null;
  order: number;
  resources: MobileExternalResource[];
};

export const listTopicsByRoom = async (roomId: string) => {
  const res = await api.get<MobileTopic[]>(`/rooms/${roomId}/topics`);
  return res.data;
};
