// app/(tabs)/all-questions.tsx
import React, { useMemo } from "react";
import { View, StyleSheet, SectionList, TouchableOpacity, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { useData } from "../../src/contexts/DataContext";
import { StyledText } from "../../src/components/ui/StyledText";
import { StyledButton } from "../../src/components/ui/StyledButton";
import { Question } from "../../src/types";
import { Colors, Spacing, FontSize } from "../../src/constants/theme";

export default function AllQuestionsScreen() {
  const { allQuestions, categories, isLoading, error, reloadQuestions, setCurrentQuestionById } =
    useData();
  const router = useRouter();

  const sections = useMemo(() => {
    if (!allQuestions || allQuestions.length === 0) return [];
    return categories
      .map(category => ({
        title: category,
        data: allQuestions.filter(q => q.category === category),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allQuestions, categories]);

  const handleQuestionPress = (question: Question) => {
    setCurrentQuestionById(question.id);
    router.push("/(tabs)/study");
  };

  if (isLoading && allQuestions.length === 0) {
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

  if (!isLoading && allQuestions.length === 0) {
    return (
      <View style={styles.centered}>
        <StyledText style={{ textAlign: "center", marginBottom: Spacing.md }}>
          Soru bulunamadı. Google E-Tablonuza birkaç soru ekleyin!
        </StyledText>
        <StyledButton title="Soruları Yeniden Yükle" onPress={reloadQuestions} />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: "Tüm Sorular" }} />
      <View style={styles.container}>
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.questionItem} onPress={() => handleQuestionPress(item)}>
              <StyledText style={styles.questionText}>{item.questionText}</StyledText>
              <StyledText style={styles.questionType} variant="caption">
                Tür: {item.type}
              </StyledText>
            </TouchableOpacity>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <StyledText style={styles.sectionHeader}>{title}</StyledText>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListFooterComponent={<View style={{ height: Spacing.xl }} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  sectionHeader: {
    fontSize: FontSize.lg,
    fontWeight: "bold",
    backgroundColor: Colors.background,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    color: Colors.primary,
  },
  questionItem: {
    backgroundColor: Colors.cardBackground,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  questionText: {
    fontSize: FontSize.md,
    marginBottom: Spacing.xs,
  },
  questionType: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing.lg,
  },
});
