// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs, Redirect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../src/constants/theme";
import { useData } from "../../src/contexts/DataContext";

export default function TabLayout() {
  const { isLoading, allQuestions } = useData();

  if (isLoading) {
    // Optionally return a loading indicator here if needed for the entire tab layout
    // For now, individual screens will handle their loading states.
  }

  // If no questions and not loading (e.g., initial load failed or empty sheet),
  // redirect or show a message. For now, we allow navigation.
  // A better UX might redirect to a "Setup" or "Error" screen.

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        headerShown: true, // You can customize this per tab
        tabBarStyle: {
          backgroundColor: Colors.cardBackground,
          borderTopColor: Colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index" // This will map to app/(tabs)/index.tsx
        options={{
          title: "Categories",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-list" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="study" // This will map to app/(tabs)/study.tsx
        options={{
          title: "Study",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cards-outline" color={color} size={size} />
          ),
          // If no category is selected, maybe redirect to 'index' or disable this tab?
          // For now, the study screen will handle the "no category selected" state.
        }}
      />
      <Tabs.Screen
        name="all-questions" // This will map to app/(tabs)/all-questions.tsx
        options={{
          title: "All Questions",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="format-list-bulleted-square" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
