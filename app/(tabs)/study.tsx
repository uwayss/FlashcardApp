// app/(tabs)/study.tsx
import React from "react";
import { View, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import { Stack, useRouter, Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useData } from "../../src/contexts/DataContext";
import { Flashcard } from "../../src/components/Flashcard";
import { StyledButton } from "../../src/components/ui/StyledButton";
import { StyledText } from "../../src/components/ui/StyledText";
import { Colors, Spacing, FontSize } from "../../src/constants/theme";

export default function StudyScreen() {
  const {
    currentQuestion,
    currentQuestionIndex,
    questionsForCategory,
    goToNextQuestion,
    goToPreviousQuestion,
    isLoading,
    selectedCategory,
    error,
    reloadQuestions,
    reshuffleQuestions,
  } = useData();
  const router = useRouter();

  const totalQuestions = questionsForCategory.length;

  if (isLoading && !currentQuestion) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StyledText style={{ marginTop: Spacing.md }}>Kart yükleniyor...</StyledText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <StyledText variant="error" style={{ marginBottom: Spacing.md }}>
          Hata: {error.message}
        </StyledText>
        <StyledButton title="Tekrar Yükle" onPress={reloadQuestions} />
        <Link href="/(tabs)">
          <StyledText style={styles.linkText}>Derslere Git</StyledText>
        </Link>
      </View>
    );
  }

  if (!selectedCategory && totalQuestions === 0 && !isLoading) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.infoText}>
          Lütfen önce bir ders seçin veya "Tüm Sorular"ın yüklendiğinden emin olun.
        </StyledText>
        <StyledButton
          title="Derslere Git"
          onPress={() => router.push("/(tabs)")}
          style={{ marginTop: Spacing.md }}
        />
        <StyledButton
          title="Tüm Soruları Yenile"
          onPress={reloadQuestions}
          variant="outline"
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  if (totalQuestions === 0 && !isLoading) {
    return (
      <View style={styles.centered}>
        <StyledText style={styles.infoText}>
          Şunun için soru bulunamadı:{" "}
          {selectedCategory ? `"${selectedCategory}"` : "seçili kriterler"}.
        </StyledText>
        <StyledButton
          title="Başka Ders Seç"
          onPress={() => router.push("/(tabs)")}
          style={{ marginTop: Spacing.md }}
        />
        <StyledButton
          title="Desteyi Karıştır"
          onPress={() => {
            reshuffleQuestions();
          }}
          variant="outline"
          style={{ marginTop: Spacing.md }}
        />
      </View>
    );
  }

  const screenTitle = selectedCategory ? `Çalış: ${selectedCategory}` : "Çalış: Tüm Sorular";

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {currentQuestion ? (
            <Flashcard question={currentQuestion} />
          ) : (
            <View style={styles.centered}>
              <StyledText>Deste bitti veya soru yüklenmedi.</StyledText>
            </View>
          )}

          {totalQuestions > 0 && (
            <StyledText style={styles.progressText}>
              {currentQuestionIndex + 1}. Kart / {totalQuestions} Toplam
            </StyledText>
          )}

          <View style={styles.navigationButtons}>
            <StyledButton
              title="Önceki"
              onPress={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0 || totalQuestions === 0}
              iconLeft={
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={20}
                  color={Colors.textLight}
                  style={{ marginRight: Spacing.sm }}
                />
              }
              style={styles.navButton}
            />
            <StyledButton
              title="Sonraki"
              onPress={goToNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1 || totalQuestions === 0}
              iconRight={
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={20}
                  color={Colors.textLight}
                  style={{ marginLeft: Spacing.sm }}
                />
              }
              style={styles.navButton}
            />
          </View>
          <StyledButton
            title="Bu Desteyi Karıştır"
            onPress={reshuffleQuestions}
            variant="outline"
            style={{ marginTop: Spacing.lg }}
            disabled={totalQuestions === 0}
          />
          <Link href="/(tabs)" asChild>
            <StyledButton title="Ders Değiştir" variant="ghost" style={{ marginTop: Spacing.sm }} />
          </Link>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.md,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  infoText: {
    textAlign: "center",
    marginBottom: Spacing.lg,
    fontSize: FontSize.lg,
  },
  progressText: {
    marginVertical: Spacing.md,
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 500,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  navButton: {
    flex: 1,
    marginHorizontal: Spacing.sm,
  },
  linkText: {
    color: Colors.primary,
    marginTop: Spacing.md,
    padding: Spacing.sm,
  },
});
