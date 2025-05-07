// src/components/Flashcard.tsx
import React, { useState, useEffect } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Question } from "../types";
import { QuestionDisplay } from "./QuestionDisplay";
import { Colors, Spacing, BorderRadius } from "../constants/theme";
import { StyledText } from "./ui/StyledText";

interface FlashcardProps {
  question: Question | null;
  onFlip?: (isFlipped: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Flashcard: React.FC<FlashcardProps> = ({ question, onFlip }) => {
  const rotate = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
    rotate.value = 0;
  }, [question, rotate]);

  const handlePress = () => {
    const newFlippedState = !isFlipped;
    rotate.value = withTiming(newFlippedState ? 180 : 0, { duration: 500 });
    setIsFlipped(newFlippedState);
    onFlip?.(newFlippedState);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotate.value, [0, 180], [0, 180], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]),
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotate.value, [0, 180], [180, 360], Extrapolate.CLAMP);
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]),
    };
  });

  if (!question) {
    return (
      <View style={[styles.cardContainer, styles.emptyCard]}>
        <StyledText>Soru seçilmedi.</StyledText>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <AnimatedPressable
        style={[styles.cardContainer, styles.cardFace, frontAnimatedStyle]}
        onPress={handlePress}
      >
        <QuestionDisplay question={question} isAnswerSide={false} />
      </AnimatedPressable>
      <AnimatedPressable
        style={[styles.cardContainer, styles.cardFace, styles.cardBack, backAnimatedStyle]}
        onPress={handlePress}
      >
        <QuestionDisplay question={question} isAnswerSide={true} />
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: "90%",
    aspectRatio: 1.6,
    maxWidth: 500,
    alignSelf: "center",
    marginVertical: Spacing.lg,
  },
  cardContainer:
    Platform.OS === "web"
      ? {
          boxShadow: `0 2px 2.62px rgba(0,0,0,0.23)`,
          flex: 1,
          backgroundColor: Colors.cardBackground,
          borderRadius: BorderRadius.lg,
          justifyContent: "center",
          alignItems: "center",
          padding: Spacing.md,
        }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
          flex: 1,
          backgroundColor: Colors.cardBackground,
          borderRadius: BorderRadius.lg,
          justifyContent: "center",
          alignItems: "center",
          padding: Spacing.md,
        },
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
  },
  cardBack: {},
  emptyCard: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
