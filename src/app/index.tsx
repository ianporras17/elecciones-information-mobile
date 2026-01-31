import { View, Text, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { router } from "expo-router";

export default function WelcomeScreen() {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState(".");

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1.1,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de puntos
    const dotsInterval = setInterval(() => {
      setDots((d) => (d.length === 3 ? "." : d + "."));
    }, 500);

    const timer = setTimeout(() => {
      router.replace("/auth");
    }, 6000);

    return () => {
      clearInterval(dotsInterval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0F172A",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.Text
        style={{
          fontSize: 36,
          fontWeight: "800",
          color: "#38BDF8",
          transform: [{ scale }],
          opacity,
        }}
      >
        DecideHub
      </Animated.Text>

      <Text style={{ marginTop: 16, color: "#E5E7EB" }}>
        Cargando{dots}
      </Text>

      <Text
        style={{
          marginTop: 32,
          textAlign: "center",
          paddingHorizontal: 40,
          color: "#94A3B8",
        }}
      >
        Tu voz importa. Decidir también es participar.
      </Text>
    </View>
  );
}
