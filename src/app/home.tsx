import { View, Text, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import JoinRoomModal from "@/components/home/JoinRoomModal";
import { useAuth } from "@/context/AuthContext";
import RoomCard from "@/components/home/RoomCard";
import { listMyRooms, type MobileRoom } from "@/services/rooms";
import { router } from "expo-router";

export default function HomeScreen() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const [rooms, setRooms] = useState<MobileRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);

  const loadRooms = async () => {
    try {
      setLoadingRooms(true);
      const data = await listMyRooms();
      setRooms(data);
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

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
          <Text style={{ fontWeight: "700", color: "#020617" }}>
            Unirme a una sala
          </Text>
        </Pressable>
      </View>

      {/* Contenido */}
      <Text style={{ marginTop: 24, color: "#94A3B8", fontWeight: "700" }}>
        Mis salas
      </Text>

      {loadingRooms ? (
        <Text style={{ marginTop: 12, color: "#94A3B8" }}>Cargando salas...</Text>
      ) : (
        <FlatList
          style={{ marginTop: 12 }}
          data={rooms}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onPress={() => router.push(`/rooms/${item.id}`)}
            />
          )}
          ListEmptyComponent={
            <Text style={{ marginTop: 12, color: "#94A3B8" }}>
              Aún no estás en ninguna sala.
            </Text>
          }
        />
      )}

      {/* Modal */}
      <JoinRoomModal
        visible={open}
        onClose={() => setOpen(false)}
        onJoined={() => {
          setOpen(false);
          loadRooms(); 
        }}
      />
    </View>
  );
}
