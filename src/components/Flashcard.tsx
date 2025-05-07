// src/components/Flashcard.tsx
import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, View, Platform } from "react-native";
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

interface FlashcardProps {
  question: Question | null;
  onFlip?: (isFlipped: boolean) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Flashcard: React.FC<FlashcardProps> = ({ question, onFlip }) => {
  const rotate = useSharedValue(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    // Reset flip state when question changes
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
      opacity: interpolate(rotate.value, [0, 90, 180], [1, 0, 0]), // Fade out front
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(
      rotate.value,
      [0, 180],
      [180, 360], // Start back from 180deg to 360deg
      Extrapolate.CLAMP,
    );
    return {
      transform: [{ perspective: 1000 }, { rotateY: `${rotateY}deg` }],
      opacity: interpolate(rotate.value, [0, 90, 180], [0, 0, 1]), // Fade in back
    };
  });

  if (!question) {
    return (
      <View style={[styles.cardContainer, styles.emptyCard]}>
        <StyledText>No question selected.</StyledText>
      </View>
    );
  }

  // On Web, the backface-visibility can be tricky with opacity fades.
  // A simpler approach might be needed if this doesn't look good,
  // or we can conditionally render rather than just opacity.
  // For now, this shared logic is generally okay.

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

// Import StyledText for the empty card message
import { StyledText } from "./ui/StyledText";

const styles = StyleSheet.create({
  outerContainer: {
    width: "90%",
    aspectRatio: 1.6, // Common card aspect ratio
    maxWidth: 500,
    alignSelf: "center",
    marginVertical: Spacing.lg,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: Colors.cardBackground,
    borderRadius: BorderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardFace: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden", // Important for flip animation
  },
  cardBack: {
    // No specific styles needed here unless you want a different background for the back
  },
  emptyCard: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
