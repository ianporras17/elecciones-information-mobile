import { Modal, View, Text, TextInput, Pressable } from "react-native";
import { useState } from "react";

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

  const join = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setResult(code === "VALIDO" ? "Sala encontrada" : "Sala no encontrada");
    }, 2000);
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
                onChangeText={setCode}
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
                disabled={!code || loading}
                style={{
                  backgroundColor: "#38BDF8",
                  padding: 14,
                  borderRadius: 12,
                }}
              >
                <Text style={{ textAlign: "center", fontWeight: "700" }}>
                  {loading ? "Buscando..." : "Unirme"}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              <Text style={{ color: "#E5E7EB", marginBottom: 16 }}>
                {result}
              </Text>
              <Pressable onPress={onClose}>
                <Text style={{ color: "#38BDF8", textAlign: "center" }}>
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
