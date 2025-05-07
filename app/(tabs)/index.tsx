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
import { useRouter, Stack } from "expo-router";
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
    if (!selectedCategory) {
      selectCategory(null);
    }
  }, [selectedCategory, selectCategory]);

  const handleSelectCategory = (category: string | null) => {
    selectCategory(category);
    router.push("/(tabs)/study");
  };

  if (isLoading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StyledText style={{ marginTop: Spacing.md }}>Sorular yükleniyor...</StyledText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StyledText variant="error" style={{ marginBottom: Spacing.md }}>
          Sorular yüklenirken hata oluştu: {error.message}
        </StyledText>
        <StyledButton title="Tekrar Dene" onPress={reloadQuestions} />
      </View>
    );
  }

  if (!isLoading && categories.length === 0) {
    return (
      <View style={styles.centered}>
        <StyledText style={{ textAlign: "center", marginBottom: Spacing.md }}>
          Soru bulunamadı. Google E-Tablonuzun doğru şekilde kurulduğundan ve yayınlandığından emin
          olun.
        </StyledText>
        <StyledButton title="Soruları Yeniden Yükle" onPress={reloadQuestions} />
      </View>
    );
  }

  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <>
      <Stack.Screen options={{ title: "Ders Seçin" }} />
      <ScrollView style={styles.container}>
        <StyledText variant="title" style={styles.title}>
          Bir Ders Seçin
        </StyledText>

        <TouchableOpacity
          style={[styles.categoryItem, !selectedCategory && styles.selectedCategoryItem]}
          onPress={() => handleSelectCategory(null)}
        >
          <StyledText
            style={[styles.categoryText, !selectedCategory && styles.selectedCategoryText]}
          >
            Tüm Sorular ({questionsForCategory.length} kart)
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
          ListFooterComponent={<ItemSeparator />}
        />
        <View style={styles.buttonContainer}>
          <StyledButton
            title="Mevcut Desteyi Karıştır"
            onPress={() => {
              reshuffleQuestions();
              if (selectedCategory || questionsForCategory.length > 0) {
                router.push("/(tabs)/study");
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
