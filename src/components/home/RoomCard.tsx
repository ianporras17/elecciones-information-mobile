import { View, Text, Pressable } from "react-native";
import type { MobileRoom } from "@/services/rooms";

export default function RoomCard({
  room,
  onPress,
}: {
  room: MobileRoom;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#0B1220" : "#0F172A",
        borderWidth: 1,
        borderColor: "#1E293B",
        padding: 14,
        borderRadius: 14,
      })}
    >
      <Text style={{ color: "#E5E7EB", fontSize: 16, fontWeight: "800" }}>
        {room.title}
      </Text>

      <Text style={{ color: "#94A3B8", marginTop: 6 }}>
        {room.description?.trim() ? room.description : "Sin descripción"}
      </Text>

      <View
        style={{
          marginTop: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#CBD5E1", fontWeight: "700" }}>
          Código: <Text style={{ color: "#38BDF8" }}>{room.accessCode}</Text>
        </Text>

        <Text style={{ color: room.isActive ? "#22C55E" : "#F59E0B", fontWeight: "700" }}>
          {room.isActive ? "ACTIVA" : "INACTIVA"}
        </Text>
      </View>

      <View style={{ marginTop: 12 }}>
        <View
          style={{
            backgroundColor: "#38BDF8",
            paddingVertical: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ textAlign: "center", fontWeight: "800", color: "#020617" }}>
            Ver sala
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
