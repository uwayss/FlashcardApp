// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { DataProvider } from "../src/contexts/DataContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DataProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </DataProvider>
    </GestureHandlerRootView>
  );
}
