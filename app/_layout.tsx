import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: "Bienvenida", headerShown: false }}
      />
      <Stack.Screen name="diagnosis" options={{ title: "Diagnóstico PCOS" }} />
    </Stack>
  );
}
