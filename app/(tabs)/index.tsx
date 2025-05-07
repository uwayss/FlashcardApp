// app/(tabs)/index.tsx
import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Link, useRouter, Stack } from "expo-router";
import { useData } from "../../src/contexts/DataContext";
import { StyledText } from "../../src/components/ui/StyledText";
import { StyledButton } from "../../src/components/ui/StyledButton";
import { Colors, Spacing, BorderRadius, FontSize } from "../../src/constants/theme";

export default function CategoriesScreen() {
  const {
    categories,
    selectCategory,
    isLoading,
    error,
    reloadQuestions,
    selectedCategory,
    questionsForCategory,
    reshuffleQuestions,
  } = useData();
  const router = useRouter();

  useEffect(() => {
    // If a category is already selected, and it has questions, pre-fill or navigate.
    // For now, we just show the list.
    // User has to explicitly select "All" or a category.
    if (!selectedCategory) {
      selectCategory(null); // Select "All Questions" by default or on initial load
    }
  }, []); // Run once on mount

  const handleSelectCategory = (category: string | null) => {
    selectCategory(category);
    router.push("/study"); // Navigate to study screen after selecting a category
  };

  if (isLoading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StyledText style={{ marginTop: Spacing.md }}>Loading questions...</StyledText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StyledText variant="error" style={{ marginBottom: Spacing.md }}>
          Error loading questions: {error.message}
        </StyledText>
        <StyledButton title="Retry" onPress={reloadQuestions} />
      </View>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <StyledText style={{ textAlign: "center", marginBottom: Spacing.md }}>
          No questions found. Make sure your Google Sheet is set up correctly and published.
        </StyledText>
        <StyledButton title="Reload Questions" onPress={reloadQuestions} />
      </View>
    );
  }

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <>
      <Stack.Screen options={{ title: "Select a Category" }} />
      <ScrollView style={styles.container}>
        <StyledText variant="title" style={styles.title}>
          Choose a Category
        </StyledText>

        <TouchableOpacity
          style={[styles.categoryItem, !selectedCategory && styles.selectedCategoryItem]}
          onPress={() => handleSelectCategory(null)} // null for "All Questions"
        >
          <StyledText
            style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}
          >
            All Questions ({questionsForCategory.length} cards)
          </StyledText>
        </TouchableOpacity>
        <ItemSeparator />

        <FlatList
          data={categories}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item && styles.selectedCategoryItem,
              ]}
              onPress={() => handleSelectCategory(item)}
            >
              <StyledText
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </StyledText>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={ItemSeparator}
          ListFooterComponent={<ItemSeparator />} // Add separator after last item as well
        />
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Reshuffle Current Deck"
            onPress={() => {
              reshuffleQuestions();
              if (selectedCategory || questionsForCategory.length > 0) {
                router.push("/study");
              }
            }}
            variant="outline"
            disabled={questionsForCategory.length === 0}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  title: {
    marginVertical: Spacing.lg,
    textAlign: "center",
  },
  categoryItem: {
    backgroundColor: Colors.cardBackground,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryItem: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: FontSize.lg,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: Colors.textLight,
    fontWeight: "bold",
  },
  separator: {
    height: Spacing.sm,
  },
  buttonContainer: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
});
