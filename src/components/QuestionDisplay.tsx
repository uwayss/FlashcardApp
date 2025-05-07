// src/components/QuestionDisplay.tsx
import React from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { Question } from "../types";
import { StyledText } from "./ui/StyledText";
import { Colors, Spacing, FontSize } from "../constants/theme";

interface QuestionDisplayProps {
  question: Question;
  isAnswerSide: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, isAnswerSide }) => {
  const renderContent = () => {
    if (isAnswerSide) {
      return (
        <StyledText style={styles.answerText} fontSize="xl">
          {question.answerText}
        </StyledText>
      );
    }

    switch (question.type) {
      case "definition":
        return (
          <>
            <StyledText style={styles.questionLabel} variant="caption">
              Define:
            </StyledText>
            <StyledText style={styles.questionText} fontSize="xl">
              {question.questionText}
            </StyledText>
          </>
        );
      case "fill-in-the-blank":
        const parts = question.questionText.split("___");
        return (
          <View style={styles.fillInTheBlankContainer}>
            <StyledText style={styles.questionTextPart} fontSize="lg">
              {parts[0]}
            </StyledText>
            <View style={styles.blankSpace} />
            <StyledText style={styles.questionTextPart} fontSize="lg">
              {parts[1]}
            </StyledText>
          </View>
        );
      case "true/false":
        return (
          <>
            <StyledText style={styles.questionLabel} variant="caption">
              True or False:
            </StyledText>
            <StyledText style={styles.questionText} fontSize="xl">
              {question.questionText}
            </StyledText>
          </>
        );
      case "short-answer":
        return (
          <>
            <StyledText style={styles.questionText} fontSize="xl">
              {question.questionText}
            </StyledText>
          </>
        );
      default:
        return <StyledText style={styles.questionText}>{question.questionText}</StyledText>;
    }
  };

  return <View style={styles.container}>{renderContent()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.lg,
  },
  questionLabel: {
    marginBottom: Spacing.sm,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  questionText: {
    textAlign: "center",
    fontWeight: "500",
  },
  answerText: {
    textAlign: "center",
    fontWeight: "bold",
    color: Colors.primary,
  },
  fillInTheBlankContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  questionTextPart: {
    textAlign: "center",
    marginHorizontal: Spacing.xs,
  },
  blankSpace: {
    borderBottomWidth: 2,
    borderColor: Colors.textSecondary,
    width: 100, // Adjust as needed
    height: FontSize.lg, // To align with text
    marginHorizontal: Spacing.xs,
    marginBottom: Spacing.xs, // Align with text baseline
  },
});
