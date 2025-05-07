// src/types/index.ts
export type QuestionType =
  | "definition"
  | "fill-in-the-blank"
  | "true/false"
  | "short-answer";

export interface Question {
  id: string;
  category: string;
  type: QuestionType;
  questionText: string;
  answerText: string;
}

export interface RawQuestionData {
  Category: string;
  Type: string;
  Question: string;
  Answer: string;
}