import { api } from "./api";

export type TournamentMatchDTO = {
  id: string;
  round: number;
  order: number;
  optionA: { id: string; name: string; proposal: string };
  optionB: { id: string; name: string; proposal: string };
  winnerId?: string | null;
};

export const startTournament = async (roomId: string, topicId: string) => {
  const res = await api.post("/tournaments/start", { roomId, topicId });
  return res.data as { tournament: any; match: TournamentMatchDTO | null };
};

export const decideMatch = async (matchId: string, winnerId: string) => {
  const res = await api.post("/tournaments/decision", { matchId, winnerId });
  return res.data as { tournament: any; match: TournamentMatchDTO | null; winner?: any };
};