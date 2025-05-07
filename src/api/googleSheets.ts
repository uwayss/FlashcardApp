// src/api/googleSheets.ts
import Papa from "papaparse";
import { Question, RawQuestionData, QuestionType } from "../types";

// !!! REPLACE THIS WITH YOUR ACTUAL GOOGLE SHEET CSV URL !!!
const GOOGLE_SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTd65YJo69HnyC10MV1O0sU89CC7n6vR4eLD99OIJvp7srVXVhtl5uh3lfZ8W9Ciwp7aCrSodaLLHuk/pub?gid=0&single=true&output=csv";

const VALID_QUESTION_TYPES: Set<string> = new Set<QuestionType>([
  "definition",
  "fill-in-the-blank",
  "true/false",
  "short-answer",
]);

export const fetchQuestions = async (): Promise<Question[]> => {
  // if (GOOGLE_SHEET_CSV_URL === "YOUR_GOOGLE_SHEET_PUBLISHED_CSV_URL") {
  //   console.warn(
  //     "Please replace YOUR_GOOGLE_SHEET_PUBLISHED_CSV_URL in src/api/googleSheets.ts",
  //   );
  //   // Return sample data or throw error for easy debugging if URL not set
  //   return [
  //     {
  //       id: "sample-1",
  //       category: "Sample",
  //       type: "definition",
  //       questionText: "What is a sample question?",
  //       answerText: "This is a placeholder because the Google Sheet URL is not set.",
  //     },
  //   ];
  // }

  try {
    const response = await fetch(GOOGLE_SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV: ${response.statusText}`);
    }
    const csvText = await response.text();

    return new Promise<Question[]>((resolve, reject) => {
      Papa.parse<RawQuestionData>(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.error("CSV Parsing errors:", results.errors);
            // Handle specific errors or reject
          }
          
          const questions: Question[] = results.data
            .map((row, index) => {
              // Basic validation
              if (!row.Category || !row.Type || !row.Question || !row.Answer) {
                console.warn(`Skipping invalid row ${index + 2}:`, row); // +2 for header and 0-indexing
                return null;
              }
              if (!VALID_QUESTION_TYPES.has(row.Type.toLowerCase())) {
                console.warn(`Skipping row ${index + 2} with invalid type "${row.Type}":`, row);
                return null;
              }
              return {
                id: `q-${index}-${Date.now()}`, // Simple unique ID
                category: row.Category.trim(),
                type: row.Type.toLowerCase() as QuestionType,
                questionText: row.Question.trim(),
                answerText: row.Answer.trim(),
              };
            })
            .filter((q): q is Question => q !== null);
          resolve(questions);
        },
        error: (error: Error) => {
          console.error("PapaParse error:", error);
          reject(error);
        },
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing questions:", error);
    throw error; // Re-throw to be caught by DataContext
  }
};