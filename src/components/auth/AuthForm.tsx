import { View, Text, TextInput, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { loginUser, registerUser } from "../../services/api";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Formulario de autenticación
 * - Valida campos
 * - Maneja loading
 * - Guarda usuario en contexto global
 */
export const AuthForm = ({ mode }: { mode: "login" | "signup" }) => {
  const { setUser } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset completo al cambiar login/signup
  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setError("");
  }, [mode]);

  const validate = () => {
    if (mode === "signup" && username.trim() === "") {
      return "El usuario es obligatorio";
    }

    if (email.trim() === "") {
      return "El correo es obligatorio";
    }

    if (!emailRegex.test(email)) {
      return "El correo no tiene un formato válido";
    }

    if (password.trim() === "") {
      return "La contraseña es obligatoria";
    }

    if (password.length < 8 || password.length > 16) {
      return "La contraseña debe tener entre 8 y 16 caracteres";
    }

    return null;
  };

  const submit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (mode === "signup") {
        await registerUser({
          name: username,
          email,
          password,
        });

        // Guardar usuario recién creado
        setUser({
          name: username,
          email,
        });
      } else {
        const res = await loginUser({
          email, // 🔒 solo correo
          password,
        });

        setUser({
          name: res.user.name,
          email: res.user.email,
        });
      }

      router.replace("/home");
    } catch {
      setError(
        mode === "login"
          ? "Correo o contraseña incorrectos"
          : "No se pudo crear la cuenta"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      {/* Usuario */}
      {mode === "signup" && (
        <>
          <Text style={labelStyle}>Usuario</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            style={inputStyle}
          />
        </>
      )}

      {/* Correo */}
      <Text style={labelStyle}>Correo</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={inputStyle}
      />

      {/* Contraseña */}
      <Text style={labelStyle}>Contraseña</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={inputStyle}
        />
        <Pressable
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 12, top: 14 }}
        >
          <Text style={{ color: "#38BDF8" }}>
            {showPassword ? "Ocultar" : "Ver"}
          </Text>
        </Pressable>
      </View>

      {/* Error */}
      {error !== "" && (
        <Text style={{ color: "#F87171", marginVertical: 12 }}>
          {error}
        </Text>
      )}

      {/* Botón */}
      <Pressable
        onPress={submit}
        disabled={loading}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "#0EA5E9" : "#38BDF8",
          padding: 14,
          borderRadius: 12,
          marginTop: 12,
          opacity: loading ? 0.7 : 1,
        })}
      >
        <Text
          style={{
            textAlign: "center",
            fontWeight: "700",
            color: "#020617",
          }}
        >
          {loading
            ? "Procesando..."
            : mode === "login"
            ? "Entrar"
            : "Crear cuenta"}
        </Text>
      </Pressable>
    </View>
  );
};

const labelStyle = {
  color: "#CBD5F5",
  marginBottom: 4,
};

const inputStyle = {
  borderWidth: 1,
  borderColor: "#1E293B",
  backgroundColor: "#020617",
  borderRadius: 10,
  padding: 12,
  marginBottom: 14,
  color: "#E5E7EB",
};
