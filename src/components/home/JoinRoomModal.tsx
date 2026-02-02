import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";
import { joinRoom } from "@/services/rooms";

export default function JoinRoomModal({
  visible,
  onClose,
  onJoined,
}: {
  visible: boolean;
  onClose: () => void;
  onJoined?: (room: { id: string; title: string }) => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const join = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;

    setLoading(true);
    setResult(null);

    try {
      const room = await joinRoom(normalized);
      setResult(`✅ Sala encontrada: ${room.title}`);
      onJoined?.({ id: room.id, title: room.title });
    } catch (e: any) {
      // 401: no token / 403: sala inactiva / 404: código inválido
      const status = e?.response?.status;
      if (status === 401) setResult("❌ Sesión expirada. Inicia sesión de nuevo.");
      else if (status === 403) setResult("⚠️ La sala está inactiva.");
      else setResult("❌ Sala no encontrada. Código inválido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#0F172A",
            borderRadius: 16,
            padding: 24,
          }}
        >
          {!result ? (
            <>
              <Text style={{ color: "#E5E7EB", marginBottom: 8 }}>
                Código de sala
              </Text>

              <TextInput
                value={code}
                onChangeText={(t) => setCode(t.toUpperCase())}
                autoCapitalize="characters"
                autoCorrect={false}
                placeholder="Ej: A1B2C3"
                placeholderTextColor="#64748B"
                style={{
                  backgroundColor: "#020617",
                  borderRadius: 10,
                  padding: 12,
                  color: "#E5E7EB",
                  marginBottom: 16,
                }}
              />

              <Pressable
                onPress={join}
                disabled={!code.trim() || loading}
                style={{
                  backgroundColor: !code.trim() || loading ? "#334155" : "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700", color: "#020617" }}>
                  {loading ? "Buscando..." : "Unirme"}
                </Text>
              </Pressable>

              <Pressable onPress={onClose} style={{ marginTop: 12 }}>
                <Text style={{ color: "#94A3B8", textAlign: "center" }}>
                  Cancelar
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={{ color: "#E5E7EB", marginBottom: 16 }}>
                {result}
              </Text>

              <Pressable
                onPress={() => {
                  setCode("");
                  setResult(null);
                  onClose();
                }}
                style={{
                  backgroundColor: "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700", color: "#020617" }}>
                  Entendido
                </Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
