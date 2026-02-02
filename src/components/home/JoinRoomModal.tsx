import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";

export default function JoinRoomModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // limpiar estado al cerrar
  useEffect(() => {
    if (!visible) {
      setCode("");
      setResult(null);
      setLoading(false);
    }
  }, [visible]);

  const join = () => {
    if (!code) return;

    setLoading(true);

    // Simulación backend
    setTimeout(() => {
      setLoading(false);
      setResult(code === "VALIDO" ? "Sala encontrada" : "Sala no encontrada");
    }, 1500);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      {/* Fondo */}
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {/* Card */}
        <Pressable
          onPress={() => {}}
          style={{
            backgroundColor: "#0F172A",
            borderRadius: 18,
            padding: 24,
          }}
        >
          {/* ❌ Botón cerrar */}
          <Pressable
            onPress={onClose}
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              padding: 6,
            }}
          >
            <Text style={{ color: "#94A3B8", fontSize: 18 }}>✕</Text>
          </Pressable>

          {!result ? (
            <>
              <Text
                style={{
                  color: "#E5E7EB",
                  fontSize: 16,
                  fontWeight: "600",
                  marginBottom: 12,
                }}
              >
                Unirme a una sala
              </Text>

              <Text style={{ color: "#CBD5F5", marginBottom: 6 }}>
                Código de sala
              </Text>

              <TextInput
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                placeholder="Ej: ABC123"
                placeholderTextColor="#64748B"
                style={{
                  backgroundColor: "#020617",
                  borderRadius: 12,
                  padding: 14,
                  color: "#E5E7EB",
                  marginBottom: 18,
                  borderWidth: 1,
                  borderColor: "#1E293B",
                }}
              />

              <Pressable
                onPress={join}
                disabled={!code || loading}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "#0EA5E9" : "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                  opacity: !code || loading ? 0.6 : 1,
                })}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "700",
                    color: "#020617",
                  }}
                >
                  {loading ? "Buscando..." : "Unirme"}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text
                style={{
                  color: "#E5E7EB",
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                {result}
              </Text>

              <Pressable
                onPress={onClose}
                style={{
                  alignSelf: "center",
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                }}
              >
                <Text style={{ color: "#38BDF8", fontWeight: "600" }}>
                  Cerrar
                </Text>
              </Pressable>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
