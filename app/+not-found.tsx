// app/+not-found.tsx
import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { StyledText } from "../src/components/ui/StyledText";
import { Colors, Spacing } from "../src/constants/theme";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <StyledText variant="title">Screen Not Found</StyledText>
        <StyledText style={styles.message}>
          This screen doesn't exist. Go back to the home screen.
        </StyledText>
        <Link href="/(tabs)" style={styles.link}>
          <StyledText style={styles.linkText}>Go to Home Screen</StyledText>
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
