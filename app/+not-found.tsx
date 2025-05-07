// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { StyledText } from "../src/components/ui/StyledText";
import { Colors, Spacing } from "../src/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Hay Aksi!" }} />
      <View style={styles.container}>
        <StyledText variant="title">Sayfa Bulunamadı</StyledText>
        <StyledText style={styles.message}>Bu sayfa mevcut değil. Ana ekrana dönün.</StyledText>
        <Link href="/(tabs)" style={styles.link}>
          <StyledText style={styles.linkText}>Ana Ekrana Git</StyledText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  message: {
    marginVertical: Spacing.md,
    textAlign: "center",
  },
  link: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
});
