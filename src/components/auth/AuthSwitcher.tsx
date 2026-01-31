import { View, Text, TouchableOpacity } from "react-native";

export const AuthSwitcher = ({
  mode,
  onChange,
}: {
  mode: "login" | "signup";
  onChange: (mode: "login" | "signup") => void;
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {["login", "signup"].map((m) => {
        const active = mode === m;

        return (
          <TouchableOpacity
            key={m}
            onPress={() => onChange(m as "login" | "signup")}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 16,
              marginHorizontal: 8,
              borderRadius: 20,
              backgroundColor: active ? "#38BDF8" : "transparent",
            }}
          >
            <Text
              style={{
                color: active ? "#020617" : "#94A3B8",
                fontWeight: "600",
              }}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
