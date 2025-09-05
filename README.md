# FlashcardApp

A simple, customizable flashcard application built with React Native and Expo. It fetches questions and answers from a public Google Sheet, allowing you to create and study your own flashcard decks with ease.

## Features

*   **Dynamic Content:** Fetches flashcard data directly from a public Google Sheet.
*   **Categorization:** Organizes flashcards into categories for focused study sessions.
*   **Multiple Question Types:** Supports different question formats like definitions, fill-in-the-blanks, true/false, and short answers.
*   **Shuffling:** Randomizes the order of flashcards for effective learning.
*   **Cross-Platform:** Runs on Android, iOS, and the web, thanks to React Native and Expo.
*   **Localization:** Supports different languages (currently configured for Turkish).
*   **Error Handling:** Provides clear feedback when there are issues with fetching or parsing data.

## Getting Started

### Prerequisites

*   Node.js and npm (or yarn)
*   Expo CLI: `npm install -g expo-cli`

### Setting up Your Data Source

1.  **Create a Google Sheet:** Make a new Google Sheet.
2.  **Format the Sheet:** The first row of your sheet must be the header row with the following column names (in any order):
    *   `Kategori`: The category of the question.
    *   `Tür`: The type of question. Supported types are: `tanim`, `bosluk`, `dogru/yanlis`, `kisa-cevap`.
    *   `Soru`: The question text.
    *   `Cevap`: The answer text.
3.  **Publish the Sheet:**
    *   Go to `File > Share > Publish to web`.
    *   In the "Link" section, select the sheet you want to publish.
    *   In the "Embed" section, select "Comma-separated values (.csv)".
    *   Click "Publish".
4.  **Get the CSV URL:** Copy the generated URL.
5.  **Configure the App:**
    *   Create a new file named `.env` in the root of the project. You can do this by copying the example file: `cp .env.example .env`
    *   Open the `.env` file and set the `EXPO_PUBLIC_GOOGLE_SHEET_CSV_URL` to the URL you copied in the previous step.

## How to Run

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd flashcardapp
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the app:**
    *   **For Android:** `npm run android`
    *   **For iOS:** `npm run ios`
    *   **For Web:** `npm run web`

## Project Structure

```
flashcardapp/
├── app/                # Expo router screens
│   ├── (tabs)/         # Tab-based navigation screens
│   │   ├── _layout.tsx
│   │   ├── all-questions.tsx
│   │   ├── index.tsx   # Category selection screen
│   │   └── study.tsx   # Flashcard study screen
│   ├── _layout.tsx
│   └── ...
├── assets/             # Static assets (fonts, images)
├── components/         # Reusable UI components (legacy)
├── src/                # Core application logic
│   ├── api/            # API-related code (e.g., Google Sheets fetching)
│   ├── components/     # Modern, reusable UI components
│   ├── constants/      # Theme and style constants
│   ├── contexts/       # React contexts for state management
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── package.json        # Project metadata and dependencies
└── tsconfig.json       # TypeScript configuration
```

## Main Dependencies

*   [React Native](https://reactnative.dev/): A framework for building native apps with React.
*   [Expo](https://expo.dev/): A platform for making universal React applications.
*   [Expo Router](https://expo.github.io/router/): A file-based router for React Native and web applications.
*   [Papa Parse](https://www.papaparse.com/): A powerful, in-browser CSV parser.
*   [React Navigation](https://reactnavigation.org/): Routing and navigation for Expo and React Native apps.
*   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript.
