// src/api/googleSheets.ts
import Papa from "papaparse";
import { Question, RawQuestionData, QuestionType } from "../types";

const GOOGLE_SHEET_CSV_URL = process.env.EXPO_PUBLIC_GOOGLE_SHEET_CSV_URL;

const VALID_QUESTION_TYPES: Set<QuestionType> = new Set<QuestionType>([
  "tanim",
  "bosluk",
  "dogru/yanlis",
  "kisa-cevap",
]);

export const fetchQuestions = async (): Promise<Question[]> => {
  if (!GOOGLE_SHEET_CSV_URL) {
    throw new Error(
      "EXPO_PUBLIC_GOOGLE_SHEET_CSV_URL is not defined in your .env file. Please follow the instructions in the README.md to set it up.",
    );
  }
  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`CSV getirme başarısız: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise<Question[]>((resolve, reject) => {
      Papa.parse<RawQuestionData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("CSV Ayrıştırma hataları:", results.errors);
          }
          
          const questions: Question[] = results.data
            .map((row, index) => {
              // Using new Turkish headers for validation
              if (!row.Kategori || !row.Tür || !row.Soru || !row.Cevap) {
                console.warn(`Geçersiz satır ${index + 2} atlanıyor:`, row);
                return null;
              }
              
              // Assuming "Tür" column contains the Turkish type keys
              const typeFromSheet = row.Tür.trim().toLowerCase() as QuestionType;

              if (!VALID_QUESTION_TYPES.has(typeFromSheet)) {
                console.warn(`Satır ${index + 2} geçersiz tür "${row.Tür}" ile atlanıyor:`, row);
                return null;
              }
              return {
                id: `q-${index}-${Date.now()}`,
                category: row.Kategori.trim(), // Using data from "Kategori" column
                type: typeFromSheet,
                questionText: row.Soru.trim(),   // Using data from "Soru" column
                answerText: row.Cevap.trim(),    // Using data from "Cevap" column
              };
            })
            .filter((q): q is Question => q !== null);
          resolve(questions);
        },
        error: (error: Error) => {
          console.error("PapaParse hatası:", error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Soruları getirme veya ayrıştırma hatası:", error);
    throw error;
  }
};