import { View, Text, Pressable, ScrollView, Linking } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { getRoom, type MobileRoom } from "@/services/rooms";
import { listTopicsByRoom, type MobileTopic } from "@/services/topics";

export default function RoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [room, setRoom] = useState<MobileRoom | null>(null);
  const [topics, setTopics] = useState<MobileTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const r = await getRoom(id);
      setRoom(r);

      const t = await listTopicsByRoom(id);
      setTopics(t);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  return (
    <View style={{ flex: 1, backgroundColor: "#020617" }}>
      <View style={{ padding: 24, paddingBottom: 12 }}>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: "#38BDF8", fontWeight: "800" }}>← Volver</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 12, gap: 14 }}>
        {loading || !room ? (
          <Text style={{ color: "#94A3B8" }}>Cargando sala...</Text>
        ) : (
          <>
            {/* Info sala */}
            <View style={{ backgroundColor: "#0F172A", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "#1E293B" }}>
              <Text style={{ color: "#E5E7EB", fontSize: 18, fontWeight: "900" }}>
                {room.title}
              </Text>

              <Text style={{ color: "#94A3B8", marginTop: 6 }}>
                {room.description?.trim() ? room.description : "Sin descripción"}
              </Text>

              <Text style={{ color: "#CBD5E1", marginTop: 10, fontWeight: "700" }}>
                Código: <Text style={{ color: "#38BDF8" }}>{room.accessCode}</Text>
              </Text>

              <Text style={{ color: room.isActive ? "#22C55E" : "#F59E0B", marginTop: 6, fontWeight: "800" }}>
                {room.isActive ? "ACTIVA" : "INACTIVA"}
              </Text>
            </View>

            {/* Topics */}
            <Text style={{ color: "#E5E7EB", fontSize: 16, fontWeight: "800" }}>
              Topics
            </Text>

            {topics.length === 0 ? (
              <Text style={{ color: "#94A3B8" }}>No hay topics todavía.</Text>
            ) : (
              topics.map((t) => (
                <View
                  key={t.id}
                  style={{
                    backgroundColor: "#0F172A",
                    borderRadius: 16,
                    padding: 16,
                    borderWidth: 1,
                    borderColor: "#1E293B",
                    gap: 8,
                  }}
                >
                  <Text style={{ color: "#E5E7EB", fontWeight: "900" }}>
                    {t.order}. {t.title}
                  </Text>

                  {t.content ? (
                    <Text style={{ color: "#94A3B8" }}>{t.content}</Text>
                  ) : null}

                  {/* Botón Torneo */}
                  <Pressable
                    onPress={() => router.push(`/tournament?roomId=${room.id}&topicId=${t.id}`)}
                    style={({ pressed }) => ({
                      backgroundColor: pressed ? "#0EA5E9" : "#38BDF8",
                      padding: 12,
                      borderRadius: 12,
                      marginTop: 10,
                      opacity: room.isActive ? 1 : 0.6,
                    })}
                    disabled={!room.isActive}
                  >
                    <Text style={{ textAlign: "center", fontWeight: "900", color: "#020617" }}>
                      Torneo de este tema
                    </Text>
                  </Pressable>

                  {/* Resources */}
                  {t.resources?.length ? (
                    <View style={{ gap: 6, marginTop: 6 }}>
                      <Text style={{ color: "#CBD5E1", fontWeight: "800" }}>
                        Recursos
                      </Text>

                      {t.resources.map((r) => (
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
                          <Text style={{ color: "#38BDF8", fontWeight: "800" }}>
                            {r.type}: {r.title}
                          </Text>
                          <Text style={{ color: "#94A3B8", marginTop: 2 }}>
                            {r.url}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  ) : (
                    <Text style={{ color: "#94A3B8" }}>Sin recursos.</Text>
                  )}
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
