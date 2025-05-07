// src/contexts/DataContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { Question } from "../types";
import { fetchQuestions } from "../api/googleSheets";
import { shuffleArray } from "../utils/shuffle";

interface DataContextState {
  allQuestions: Question[];
  categories: string[];
  selectedCategory: string | null;
  questionsForCategory: Question[];
  currentQuestion: Question | null;
  currentQuestionIndex: number; // 0-based index
  isLoading: boolean;
  error: Error | null;
  selectCategory: (category: string | null) => void;
  setCurrentQuestionById: (questionId: string) => void;
  navigateToQuestionIndex: (index: number) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  reshuffleQuestions: () => void;
  reloadQuestions: () => Promise<void>;
}

const DataContext = createContext<DataContextState | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questionsForCategory, setQuestionsForCategory] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedQuestions = await fetchQuestions();
      setAllQuestions(fetchedQuestions);
    } catch (e) {
      setError(e as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const categories = useMemo(() => {
    const categorySet = new Set(allQuestions.map(q => q.category));
    return Array.from(categorySet).sort();
  }, [allQuestions]);

  const selectCategory = useCallback(
    (category: string | null) => {
      setSelectedCategory(category);
      setCurrentQuestionIndex(0); // Reset index when category changes
      if (category) {
        const filtered = allQuestions.filter(q => q.category === category);
        setQuestionsForCategory(shuffleArray(filtered));
      } else {
        // If category is null (e.g. "All" or no selection), shuffle all questions
        setQuestionsForCategory(shuffleArray([...allQuestions]));
      }
    },
    [allQuestions],
  );

  const reshuffleQuestions = useCallback(() => {
    if (selectedCategory) {
      const filtered = allQuestions.filter(q => q.category === selectedCategory);
      setQuestionsForCategory(shuffleArray(filtered));
    } else {
      setQuestionsForCategory(shuffleArray([...allQuestions]));
    }
    setCurrentQuestionIndex(0);
  }, [allQuestions, selectedCategory]);

  const currentQuestion = useMemo(() => {
    return questionsForCategory[currentQuestionIndex] || null;
  }, [questionsForCategory, currentQuestionIndex]);

  const navigateToQuestionIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < questionsForCategory.length) {
        setCurrentQuestionIndex(index);
      }
    },
    [questionsForCategory.length],
  );

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      return nextIndex < questionsForCategory.length ? nextIndex : prevIndex; // Stay on last if at end
    });
  }, [questionsForCategory.length]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex(prevIndex => {
      const nextIndex = prevIndex - 1;
      return nextIndex >= 0 ? nextIndex : prevIndex; // Stay on first if at beginning
    });
  }, []);

  const setCurrentQuestionById = useCallback(
    (questionId: string) => {
      const categoryOfQuestion = allQuestions.find(q => q.id === questionId)?.category;
      if (categoryOfQuestion && categoryOfQuestion !== selectedCategory) {
        // If the question is from a different category, switch to it
        // This ensures questionsForCategory is correctly populated
        selectCategory(categoryOfQuestion);
        // selectCategory is async with setStates, so we need to find index in new questionsForCategory
        // This might require a slight refactor or an effect to set index after category change.
        // For now, we assume `selectCategory` then allows navigation, or it's from the same category.
        const newQuestions = allQuestions.filter(q => q.category === categoryOfQuestion);
        const newShuffledQuestions = shuffleArray(newQuestions); // or preserve existing shuffle if preferred
        setQuestionsForCategory(newShuffledQuestions);

        const indexInNewCategory = newShuffledQuestions.findIndex(q => q.id === questionId);
        if (indexInNewCategory !== -1) {
          setCurrentQuestionIndex(indexInNewCategory);
        }
      } else {
        // Question is in the current category or no category selected (all questions mode)
        const index = questionsForCategory.findIndex(q => q.id === questionId);
        if (index !== -1) {
          setCurrentQuestionIndex(index);
        }
      }
    },
    [allQuestions, questionsForCategory, selectCategory, selectedCategory],
  );

  const value: DataContextState = {
    allQuestions,
    categories,
    selectedCategory,
    questionsForCategory,
    currentQuestion,
    currentQuestionIndex,
    isLoading,
    error,
    selectCategory,
    setCurrentQuestionById,
    navigateToQuestionIndex,
    goToNextQuestion,
    goToPreviousQuestion,
    reshuffleQuestions,
    reloadQuestions: loadQuestions,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextState => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
