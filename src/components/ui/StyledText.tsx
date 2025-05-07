// src/components/ui/StyledText.tsx
import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { Colors, FontSize } from "../../constants/theme";

type StyledTextProps = TextProps & {
  variant?: "body" | "title" | "caption" | "label" | "error";
  color?: keyof typeof Colors;
  fontSize?: keyof typeof FontSize;
  fontWeight?: "normal" | "bold" | "500" | "600" | "700";
};

export const StyledText: React.FC<StyledTextProps> = ({
  variant = "body",
  color = "text",
  fontSize,
  fontWeight,
  style,
  ...props
}) => {
  const textStyle = [
    styles.base,
    styles[variant],
    { color: Colors[color] },
    fontSize && { fontSize: FontSize[fontSize] },
    fontWeight && { fontWeight },
    style,
  ];

  return <Text style={textStyle} {...props} />;
};

const styles = StyleSheet.create({
  base: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  body: {},
  title: {
    fontSize: FontSize.title,
    fontWeight: "bold",
  },
  caption: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: FontSize.lg,
    fontWeight: "600",
  },
  error: {
    color: Colors.error,
    fontSize: FontSize.sm,
  },
});
