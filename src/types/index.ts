// src/types/index.ts
export type QuestionType =
  | "tanim"
  | "bosluk"
  | "dogru/yanlis"
  | "kisa-cevap";

export interface Question {
  id: string;
  category: string; // Internal model property, can stay 'category'
  type: QuestionType;
  questionText: string;
  answerText: string;
}

export interface RawQuestionData {
  Kategori: string; // Corresponds to "Kategori" header in Google Sheet
  Tür: string;      // Corresponds to "Tür" header in Google Sheet
  Soru: string;     // Corresponds to "Soru" header in Google Sheet
  Cevap: string;    // Corresponds to "Cevap" header in Google Sheet
}