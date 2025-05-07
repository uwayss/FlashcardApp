// src/components/ui/StyledButton.tsx
import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { StyledText } from "./StyledText";
import { Colors, Spacing, BorderRadius } from "../../constants/theme";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface StyledButtonProps {
  title: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const StyledButton: React.FC<StyledButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle: customTextStyle,
  iconLeft,
  iconRight,
}) => {
  const buttonStyles: ViewStyle[] = [styles.base];
  const textStyles: TextStyle[] = [styles.textBase];

  switch (variant) {
    case "primary":
      buttonStyles.push(styles.primary);
      textStyles.push(styles.primaryText);
      break;
    case "secondary":
      buttonStyles.push(styles.secondary);
      textStyles.push(styles.secondaryText);
      break;
    case "outline":
      buttonStyles.push(styles.outline);
      textStyles.push(styles.outlineText);
      break;
    case "ghost":
      buttonStyles.push(styles.ghost);
      textStyles.push(styles.ghostText);
      break;
  }

  if (disabled || loading) {
    buttonStyles.push(styles.disabled);
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[...buttonStyles, style]}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "secondary" ? Colors.textLight : Colors.primary
          }
        />
      ) : (
        <>
          {iconLeft}
          <StyledText style={[...textStyles, customTextStyle]}>{title}</StyledText>
          {iconRight}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    minHeight: 48,
  },
  textBase: {
    fontWeight: "600",
    textAlign: "center",
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  primaryText: {
    color: Colors.textLight,
  },
  secondary: {
    backgroundColor: Colors.secondary,
  },
  secondaryText: {
    color: Colors.textLight,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  outlineText: {
    color: Colors.primary,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
});
