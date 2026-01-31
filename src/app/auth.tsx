import { View, KeyboardAvoidingView, Platform, Text } from "react-native";
import { useState } from "react";
import { AuthSwitcher } from "@/components/auth/AuthSwitcher";
import { AuthForm } from "@/components/auth/AuthForm";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#020617" }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: "#0F172A",
            borderRadius: 16,
            padding: 24,
            shadowColor: "#000",
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#E5E7EB",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            {mode === "login" ? "Bienvenido de nuevo" : "Crear cuenta"}
          </Text>

          <AuthSwitcher mode={mode} onChange={setMode} />
          <AuthForm mode={mode} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
