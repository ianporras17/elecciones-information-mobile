import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { decideMatch, startTournament, type TournamentMatchDTO } from "@/services/tournaments";
import { getTopicById } from "@/services/topics";

type TopicResource = {
  id: string;
  type: string;
  title: string;
  url: string;
  description?: string | null;
};

export default function TournamentScreen() {
  const { roomId, topicId } = useLocalSearchParams<{ roomId: string; topicId: string }>();

  const [match, setMatch] = useState<TournamentMatchDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<{ id: string; name?: string; proposal?: string } | null>(null);
  const [error, setError] = useState<string>("");

  // ✅ Recursos del topic (siempre visibles)
  const [resources, setResources] = useState<TopicResource[]>([]);
  const [showResources, setShowResources] = useState(true);

  const boot = async () => {
    if (!roomId || !topicId) return;
    setLoading(true);
    setError("");

    try {
      // cargar topic + recursos (siempre)
      const topic = await getTopicById(topicId);
      setResources(topic.resources ?? []);

      // iniciar torneo
      const res = await startTournament(roomId, topicId);
      setMatch(res.match);
      setWinner(null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo iniciar el torneo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    boot();
  }, [roomId, topicId]);

  const pick = async (winnerId: string) => {
    if (!match) return;
    setLoading(true);
    setError("");
    try {
      const res = await decideMatch(match.id, winnerId);
      if (res.winner) setWinner(res.winner);
      setMatch(res.match);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "No se pudo registrar la decisión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <View style={{ padding: 24, paddingBottom: 10 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#38BDF8", fontWeight: "900" }}>← Volver</Text>
        </Pressable>

        <Text style={{ color: "#E5E7EB", fontSize: 18, fontWeight: "900", marginTop: 10 }}>
          Torneo por tema
        </Text>

        {error ? <Text style={{ color: "#F87171", marginTop: 8 }}>{error}</Text> : null}
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 0, gap: 14 }}>
        {/* ✅ Recursos siempre visibles */}
        <View style={{ backgroundColor: "#0F172A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E293B" }}>
          <Pressable onPress={() => setShowResources((v) => !v)}>
            <Text style={{ color: "#E5E7EB", fontWeight: "900" }}>
              Recursos del tema {showResources ? "▾" : "▸"}
            </Text>
          </Pressable>

          {showResources && (
            <>
              {resources.length === 0 ? (
                <Text style={{ color: "#94A3B8", marginTop: 10 }}>No hay recursos para este tema.</Text>
              ) : (
                <View style={{ marginTop: 10, gap: 8 }}>
                  {resources.map((r) => (
                    <Pressable
                      key={r.id}
                      onPress={() => Linking.openURL(r.url)}
                      style={{
                        backgroundColor: "#020617",
                        borderWidth: 1,
                        borderColor: "#1E293B",
                        borderRadius: 12,
                        padding: 12,
                      }}
                    >
                      <Text style={{ color: "#38BDF8", fontWeight: "900" }}>
                        {r.type}: {r.title}
                      </Text>
                      <Text style={{ color: "#94A3B8", marginTop: 4 }}>{r.url}</Text>
                      {r.description ? (
                        <Text style={{ color: "#94A3B8", marginTop: 6 }}>{r.description}</Text>
                      ) : null}
                    </Pressable>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Torneo */}
        {loading ? (
          <Text style={{ color: "#94A3B8" }}>Cargando...</Text>
        ) : winner ? (
          <View style={{ backgroundColor: "#0F172A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E293B" }}>
            <Text style={{ color: "#22C55E", fontWeight: "900", fontSize: 16 }}>
              ✅ Torneo completado
            </Text>

            <Text style={{ color: "#E5E7EB", marginTop: 8, fontWeight: "900" }}>
              Ganador: {winner.name ?? "—"}
            </Text>

            {winner.proposal?.trim() ? (
              <Text style={{ color: "#94A3B8", marginTop: 8 }}>
                {winner.proposal}
              </Text>
            ) : null}

            <Pressable
              onPress={() => router.back()}
              style={{ backgroundColor: "#38BDF8", padding: 14, borderRadius: 12, marginTop: 14 }}
            >
              <Text style={{ textAlign: "center", fontWeight: "900", color: "#020617" }}>
                Volver a la sala
              </Text>
            </Pressable>
          </View>
        ) : !match ? (
          <Text style={{ color: "#94A3B8" }}>No hay match pendiente.</Text>
        ) : (
          <View style={{ gap: 12 }}>
            <Text style={{ color: "#94A3B8" }}>
              Ronda {match.round} · Match {match.order + 1}
            </Text>

            <View style={{ backgroundColor: "#0F172A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E293B" }}>
              <Text style={{ color: "#E5E7EB", fontWeight: "900" }}>{match.optionA.name}</Text>
              <Text style={{ color: "#94A3B8", marginTop: 6 }}>
                {match.optionA.proposal?.trim() ? match.optionA.proposal : "Sin propuesta"}
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => pick(match.optionA.id)}
                style={{
                  backgroundColor: "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                  marginTop: 12,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "900", color: "#020617" }}>
                  Elegir {match.optionA.name}
                </Text>
              </Pressable>
            </View>

            <View style={{ backgroundColor: "#0F172A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E293B" }}>
              <Text style={{ color: "#E5E7EB", fontWeight: "900" }}>{match.optionB.name}</Text>
              <Text style={{ color: "#94A3B8", marginTop: 6 }}>
                {match.optionB.proposal?.trim() ? match.optionB.proposal : "Sin propuesta"}
              </Text>

              <Pressable
                disabled={loading}
                onPress={() => pick(match.optionB.id)}
                style={{
                  backgroundColor: "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                  marginTop: 12,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "900", color: "#020617" }}>
                  Elegir {match.optionB.name}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
