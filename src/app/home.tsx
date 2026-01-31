import { View, Text, Pressable } from "react-native";
import { useState } from "react";
import JoinRoomModal from "@/components/home/JoinRoomModal";
import { useAuth } from "@/context/AuthContext";

/**
 * Pantalla principal
 * Muestra usuario autenticado y acciones principales
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: "#020617" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#E5E7EB", fontSize: 16, fontWeight: "600" }}>
          👤 {user?.name ?? "Usuario"}
        </Text>

        <Pressable
          onPress={() => setOpen(true)}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#0EA5E9" : "#38BDF8",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
          })}
        >
          <Text style={{ fontWeight: "600", color: "#020617" }}>
            Unirme a una sala
          </Text>
        </Pressable>
      </View>

      {/* Contenido */}
      <Text style={{ marginTop: 32, color: "#94A3B8" }}>
        Mis salas
      </Text>

      {/* Modal */}
      <JoinRoomModal visible={open} onClose={() => setOpen(false)} />
    </View>
  );
}
