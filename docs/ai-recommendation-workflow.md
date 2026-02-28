# 🤖 AI Recommendation System - Complete Documentation

> **For Beginners:** This document explains how the AI-powered skincare recommendation system works in BeautyMatch. Read it step by step like a story!

---

## ⚠️ Important: Two Systems, Not One!

```
┌─────────────────────────────────────────────────────────────────┐
│        THE RECOMMENDATION SYSTEM HAS TWO PARTS                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  PART 1: QUIZ ANALYSIS (Rule-Based - NOT AI)                    │
│  ├── Uses a SCORING SYSTEM to determine skin type               │
│  ├── Simple logic: each answer adds points                      │
│  └── File: analyzeQuizResult.js                                 │
│                                                                  │
│  PART 2: PRODUCT RECOMMENDATIONS (AI or Smart Matching)         │
│  ├── If VITE_GEMINI_API_KEY exists → Use Google Gemini          │
│  ├── If no API key OR Gemini fails → Use Smart Matching         │
│  └── File: aiRecommendation.js                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Table of Contents

1. [Global Overview](#1️⃣-global-overview)
2. [Skin Quiz Flow](#2️⃣-skin-quiz-flow)
3. [Data Flow Explanation](#3️⃣-data-flow-explanation)
4. [AI Recommendation Logic](#4️⃣-ai-recommendation-logic)
5. [File-by-File Explanation](#5️⃣-file-by-file-explanation)
6. [State Management](#6️⃣-state-management)
7. [Error Handling](#7️⃣-error-handling)
8. [Simple Summary](#8️⃣-simple-summary)

---

## 1️⃣ Global Overview

### What is this feature?

The AI Recommendation System is a **personalized skincare advisor**. It's like having a skin expert in your pocket!

### What problem does it solve?

**Problem:** People don't know which skincare products are right for their skin type.

**Solution:** Our system:
1. Asks 5 simple questions about your skin
2. Analyzes your answers to determine your skin type
3. Uses AI to recommend the perfect products from our catalog
4. Creates a complete skincare routine just for you!

### The User Experience

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER JOURNEY                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 User clicks "Skin Quiz"                                     │
│        ↓                                                        │
│  📝 Answers 5 questions about their skin                        │
│        ↓                                                        │
│  🔍 System analyzes answers → finds skin type                   │
│        ↓                                                        │
│  🤖 AI creates personalized product recommendations             │
│        ↓                                                        │
│  ✨ User sees their perfect skincare routine!                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Skin Quiz Flow

### Where does the quiz live?

📁 **File:** `src/pages/User/SkinQuiz.jsx`

This is the main quiz page that users interact with.

### How answers are collected

The quiz uses React's `useState` hook to store answers:

```javascript
// Array to store all 5 answers (initialized with null)
const [answers, setAnswers] = useState([null, null, null, null, null]);

// When user clicks an option, we update the array
const handleSelectAnswer = (optionIndex) => {
  const newAnswers = [...answers];      // Copy the array
  newAnswers[currentStep] = optionIndex; // Update current question's answer
  setAnswers(newAnswers);                // Save the new array
};
```

**Example:**
- User answers question 1 with option 2
- Answers array becomes: `[2, null, null, null, null]`
- User answers question 2 with option 0
- Answers array becomes: `[2, 0, null, null, null]`

### The Quiz Questions

```javascript
const quizQuestions = [
  {
    id: 1,
    question: "How does your skin feel after washing?",
    options: [
      "Tight and dry",           // Index 0 → suggests DRY skin
      "Comfortable and balanced", // Index 1 → suggests NORMAL skin
      "Slightly oily in T-zone",  // Index 2 → suggests COMBINATION skin
      "Very oily and shiny"       // Index 3 → suggests OILY skin
    ]
  },
  // ... 4 more questions
];
```

### Quiz Result Object

After analyzing answers, we get this structure:

```javascript
const quizResult = {
  skinType: "oily",           // Main skin type detected
  concerns: [                 // Skin problems identified
    "acne", 
    "breakouts", 
    "excess oil"
  ],
  ageRange: "26-35",          // User's age range
  scores: {                   // How the skin type was determined
    dry: 0,
    oily: 5,                  // Highest score wins!
    combination: 2,
    sensitive: 1,
    normal: 0
  }
};
```

### How Skin Type is Detected

The `analyzeAnswers` function uses a **scoring system**:

```
┌───────────────────────────────────────────────────────────────┐
│                   SKIN TYPE SCORING SYSTEM                     │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  Each answer adds points to different skin types:              │
│                                                                │
│  Question 1: "Skin feels after washing"                        │
│  ├── "Tight and dry"     → +2 points to DRY                   │
│  ├── "Comfortable"       → +2 points to NORMAL                │
│  ├── "Slightly oily"     → +2 points to COMBINATION           │
│  └── "Very oily"         → +2 points to OILY                  │
│                                                                │
│  Question 2: "Skin concerns"                                   │
│  ├── "Acne"              → +1 point to OILY                   │
│  ├── "Redness"           → +2 points to SENSITIVE             │
│  └── etc...                                                   │
│                                                                │
│  RESULT: Skin type with HIGHEST SCORE wins!                   │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Data Flow Explanation

### The Complete Journey of Data

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DATA FLOW DIAGRAM                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────┐                                     │
│   USER CLICKS          │  SkinQuiz   │                                      │
│   ANSWER OPTION   →    │   .jsx      │                                      │
│                         └──────┬──────┘                                     │
│                                │                                            │
│                                │ answers = [0, 2, 1, 3, 2]                  │
│                                ↓                                            │
│                         ┌──────────────────┐                                │
│                         │ analyzeQuizResult │                               │
│                         │      .js          │                               │
│                         └────────┬─────────┘                                │
│                                  │                                          │
│                                  │ quizResult = {                           │
│                                  │   skinType: "oily",                      │
│                                  │   concerns: ["acne"],                    │
│                                  │   ageRange: "26-35"                      │
│                                  │ }                                        │
│                                  ↓                                          │
│                         ┌─────────────────┐                                 │
│                         │   aiPrompt.js   │  + products data                │
│                         └────────┬────────┘                                 │
│                                  │                                          │
│                                  │ Complete AI prompt                       │
│                                  │ (skin info + products)                   │
│                                  ↓                                          │
│                         ┌───────────────────────┐                           │
│                         │  aiRecommendation.js  │                           │
│                         │                       │                           │
│                         │  ┌─────────────────┐  │                           │
│                         │  │  OpenAI API     │  │                           │
│                         │  │  - OR -         │  │                           │
│                         │  │  Gemini API     │  │                           │
│                         │  │  - OR -         │  │                           │
│                         │  │  Smart Matching │  │                           │
│                         │  └─────────────────┘  │                           │
│                         └───────────┬───────────┘                           │
│                                     │                                       │
│                                     │ recommendations = {                   │
│                                     │   routine: {                          │
│                                     │     cleanser: {...},                  │
│                                     │     serum: {...},                     │
│                                     │     moisturizer: {...},               │
│                                     │     sunscreen: {...}                  │
│                                     │   },                                  │
│                                     │   summary: "..."                      │
│                                     │ }                                     │
│                                     ↓                                       │
│                         ┌─────────────────┐                                 │
│                         │    SkinQuiz     │                                 │
│                         │  RESULTS PAGE   │ ← USER SEES RECOMMENDATIONS     │
│                         └─────────────────┘                                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Breakdown

| Step | What Happens | File |
|------|--------------|------|
| 1 | User answers quiz questions | `SkinQuiz.jsx` |
| 2 | Answers are stored in array | `SkinQuiz.jsx` (useState) |
| 3 | User clicks "Get My Routine" | `SkinQuiz.jsx` |
| 4 | Answers are analyzed | `analyzeQuizResult.js` |
| 5 | Skin type & concerns detected | `analyzeQuizResult.js` |
| 6 | AI prompt is built | `aiPrompt.js` |
| 7 | Products data is fetched | Redux store |
| 8 | AI generates recommendations | `aiRecommendation.js` |
| 9 | Results displayed to user | `SkinQuiz.jsx` |
| 10 | Results saved to profile | `userThunks.js` → `userAPI.js` |

---

## 4️⃣ AI Recommendation Logic

### The Decision Flow (Gemini or Smart Matching)

```
┌─────────────────────────────────────────────────────────────────┐
│              RECOMMENDATION DECISION FLOW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  getRecommendations(quizResult, products)                       │
│        │                                                        │
│        ▼                                                        │
│  ┌─────────────────────────────────┐                            │
│  │ Does VITE_GEMINI_API_KEY exist? │                            │
│  └─────────────────────────────────┘                            │
│        │                                                        │
│        ├── YES ──▶ Call Google Gemini API                       │
│        │               │                                        │
│        │               ├── Success → Return AI recommendations  │
│        │               │                                        │
│        │               └── Error → Fall back to Smart Matching  │
│        │                                                        │
│        └── NO ───▶ Use Smart Matching (no API needed)           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Two Recommendation Methods

| Method | When Used | How It Works |
|--------|-----------|--------------|
| **Google Gemini** | `VITE_GEMINI_API_KEY` is set | AI reads prompt, selects products with personalized explanations |
| **Smart Matching** | No API key OR Gemini fails | Scores products by skin type/concerns match (100% local) |

### How the AI Prompt is Built (for Gemini)

The `aiPrompt.js` file creates detailed instructions for Gemini:

```javascript
// The prompt has 4 main sections:

// 1. USER PROFILE
`=== USER SKIN PROFILE ===
- Skin Type: oily
- Main Concerns: acne, breakouts
- Age Range: 26-35`

// 2. AVAILABLE PRODUCTS (from our database)
`=== AVAILABLE PRODUCTS ===
- ID: 1
- Name: Gentle Foaming Cleanser
- Category: Cleansers
- Skin Type: Oily
- Ingredients: Salicylic Acid, Tea Tree
- Price: $24.99`

// 3. THE TASK
`=== YOUR TASK ===
Select the BEST products to create a routine with:
1. CLEANSER
2. SERUM
3. MOISTURIZER
4. SUNSCREEN`

// 4. EXPECTED FORMAT
`Return JSON like this:
{
  "routine": {
    "cleanser": { "productId": "...", "name": "...", "reason": "..." }
  },
  "summary": "..."
}`
```

### What Information Goes to the AI?

```
┌─────────────────────────────────────────────────────────────────┐
│                  INFORMATION SENT TO AI                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  FROM QUIZ RESULT:                                              │
│  ├── Skin type (oily, dry, combination, sensitive, normal)      │
│  ├── Concerns (acne, redness, dryness, sensitivity)             │
│  └── Age range                                                  │
│                                                                  │
│  FROM PRODUCT DATABASE:                                         │
│  ├── Product ID                                                 │
│  ├── Product name                                               │
│  ├── Category (cleanser, serum, etc.)                          │
│  ├── Target skin type                                          │
│  ├── Target concerns                                           │
│  ├── Ingredients list                                          │
│  ├── Description                                               │
│  └── Price                                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### How Smart Matching Works (Fallback - No AI Needed)

When no API key is available OR if Gemini fails, Smart Matching kicks in:

```
┌─────────────────────────────────────────────────────────────────┐
│              SMART MATCHING SCORING SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  For each product, calculate a RELEVANCE SCORE:                 │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ SKIN TYPE MATCH                           +10 points    │    │
│  │ (product.skinType includes user's skinType)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ CONCERN MATCH (each)                      +5 points     │    │
│  │ (product.concerns includes user's concern)              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ GOOD INGREDIENTS (each)                   +2 points     │    │
│  │ (hyaluronic, niacinamide, vitamin c, aloe, etc.)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  RESULT: Product with HIGHEST SCORE wins for each step          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Example Scoring:**
```javascript
// Product: "Niacinamide Serum for Oily Skin"
// User: skinType = "oily", concerns = ["acne", "excess oil"]

let score = 0;
score += 10;  // Skin type "oily" matches ✓
score += 5;   // "acne" concern matches ✓  
score += 5;   // "excess oil" concern matches ✓
score += 2;   // Contains "niacinamide" ✓

// Total score: 22 points → This product wins!
```

### The Complete Routine Structure

```javascript
const recommendations = {
  // The 4-step skincare routine
  routine: {
    cleanser: {
      productId: "product-123",
      name: "Gentle Foaming Cleanser",
      reason: "This cleanser contains Salicylic Acid which helps control oil and prevent acne."
    },
    serum: {
      productId: "product-456",
      name: "Niacinamide Serum",
      reason: "Niacinamide reduces oil production and minimizes pores - perfect for oily skin."
    },
    moisturizer: {
      productId: "product-789",
      name: "Oil-Free Hydrating Gel",
      reason: "Lightweight gel formula hydrates without adding extra oil to your skin."
    },
    sunscreen: {
      productId: "product-012",
      name: "Matte Finish SPF 50",
      reason: "This sunscreen has a matte finish that won't make oily skin look shiny."
    }
  },
  
  // Summary for the user
  summary: "Based on your oily skin with acne concerns, we've selected lightweight, 
            oil-controlling products that will help reduce breakouts while keeping 
            your skin hydrated and protected."
};
```

---

## 5️⃣ File-by-File Explanation

### Overview

```
src/
├── pages/
│   └── User/
│       └── SkinQuiz.jsx              ← Route entry: Redux, state, effects, handlers
├── components/
│   └── quiz/
│       ├── QuizComponents.jsx        ← ProgressBar, QuestionCard, QuizButton
│       └── SkinQuiz/                 ← UI-only subcomponents
│           ├── IntroScreen.jsx
│           ├── QuizScreen.jsx
│           ├── LoadingScreen.jsx
│           ├── ErrorScreen.jsx
│           ├── ResultsScreen.jsx
│           └── RecommendedProductCard.jsx
├── data/
│   └── skinQuizData.js               ← quizQuestions, skinTypeInfo, routineSteps
├── utils/
│   └── analyzeQuizResult.js          ← Analyzes quiz answers
├── lib/
│   └── aiPrompt.js                   ← Builds AI instructions
├── services/
│   └── aiRecommendation.js           ← Calls AI or smart matching
└── features/
    └── user/
        ├── userSlice.js              ← Redux state definition
        ├── userThunks.js             ← Async actions (save/load)
        └── userAPI.js                ← localStorage operations
```

---

### 📄 SkinQuiz.jsx

**Location:** `src/pages/User/SkinQuiz.jsx`

**Role:** Route entry page and main container. Holds all logic; renders UI-only subcomponents.

**What it does:**
- Handles Redux (dispatch, selectors for products, quiz result, recommendations)
- Manages local state (viewMode, currentStep, answers, quizResult, recommendations, isLoading, error)
- Runs effects (restore saved results, fetch products)
- Defines handlers (handleStart, handleSelectAnswer, handleBack, handleNext, handleRestart)
- Renders IntroScreen, QuizScreen, LoadingScreen, ErrorScreen, ResultsScreen based on viewMode

**Architecture:**
- **SkinQuiz.jsx** = container (logic only)
- **SkinQuiz/** subcomponents = presentational (receive props, no Redux/effects)

**Key states:**
```javascript
const [viewMode, setViewMode] = useState('intro');    // intro | quiz | results
const [currentStep, setCurrentStep] = useState(-1);   // Which question we're on
const [answers, setAnswers] = useState([...]);        // User's answers
const [quizResult, setQuizResult] = useState(null);   // Analysis result
const [recommendations, setRecommendations] = useState(null); // AI recommendations
const [isLoading, setIsLoading] = useState(false);    // Loading indicator
const [error, setError] = useState(null);             // Error message
```

---

### 📄 analyzeQuizResult.js

**Location:** `src/utils/analyzeQuizResult.js`

**Role:** Takes raw answer numbers and figures out the skin type.

**What it does:**
- Uses a scoring system to determine skin type
- Identifies skin concerns from answers
- Determines age range
- Returns a structured result object

**Data it receives:**
```javascript
// Input: Array of selected option indices
const answers = [0, 2, 1, 3, 2];
// Answer 0 = first answer to question 1
// Answer 2 = third answer to question 2
// etc.
```

**Data it returns:**
```javascript
// Output: Structured quiz result
{
  skinType: "oily",
  concerns: ["acne", "excess oil"],
  ageRange: "26-35",
  scores: { dry: 0, oily: 5, combination: 2, sensitive: 1, normal: 0 }
}
```

**Key function:**
```javascript
export function analyzeAnswers(answers) {
  // Initialize scores for each skin type
  let scores = { dry: 0, oily: 0, combination: 0, sensitive: 0, normal: 0 };
  
  // Add points based on each answer
  if (answers[0] === 0) scores.dry += 2;      // "Tight and dry"
  if (answers[0] === 3) scores.oily += 2;     // "Very oily"
  // ... more scoring logic
  
  // Winner is skin type with highest score
  const skinType = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
  
  return { skinType, concerns, ageRange, scores };
}
```

---

### 📄 aiPrompt.js

**Location:** `src/lib/aiPrompt.js`

**Role:** Creates the instruction text that tells the AI what to do.

**What it does:**
- Formats user's skin profile into text
- Formats all available products into text
- Writes clear instructions for the AI
- Specifies the exact JSON format expected

**Data it receives:**
- Quiz result object (skin type, concerns, age)
- Products array (from database)

**Data it returns:**
- A long string (the prompt) that the AI will read

**Key function:**
```javascript
export function buildRecommendationPrompt(quizResult, products) {
  const { skinType, concerns, ageRange } = quizResult;
  
  // Format products into readable text
  const productsText = products.map(p => `
    - ID: ${p.id}
    - Name: ${p.name}
    - Skin Type: ${p.skinType}
    - Ingredients: ${p.ingredients}
  `).join('\n');
  
  // Build the complete prompt
  return `
    You are a skincare expert...
    
    USER PROFILE:
    - Skin Type: ${skinType}
    - Concerns: ${concerns.join(', ')}
    
    AVAILABLE PRODUCTS:
    ${productsText}
    
    Select the best products and return JSON...
  `;
}
```

---

### 📄 aiRecommendation.js

**Location:** `src/services/aiRecommendation.js`

**Role:** The "brain" - decides whether to use Gemini AI or Smart Matching.

**What it does:**
- Checks if `VITE_GEMINI_API_KEY` exists
- If yes → Calls Google Gemini API
- If no → Uses Smart Matching (100% local, no API needed)
- Always has a fallback if Gemini fails

**Data it receives:**
- Quiz result object (skin type, concerns, age)
- Products array (from our database)

**Data it returns:**
- Recommendations object with routine and summary

**The Decision Flow:**
```javascript
export async function getRecommendations(quizResult, products) {
  try {
    // Check if Gemini API key is configured
    if (GEMINI_API_KEY) {
      console.log('🤖 Using Google Gemini AI...');
      return await callGemini(quizResult, products);
    }
    
    // No API key → Use smart matching
    console.log('📝 No API key, using smart matching...');
    return generateSmartRecommendations(quizResult, products);
    
  } catch (error) {
    // Gemini failed → Fall back to smart matching
    console.log('🔄 Gemini failed, falling back to smart matching...');
    return generateSmartRecommendations(quizResult, products);
  }
}
```

**Key Points:**
- Only ONE AI provider: Google Gemini
- Smart Matching is the fallback (always works)
- User always gets recommendations, even if AI fails

---

### 📄 userSlice.js

**Location:** `src/features/user/userSlice.js`

**Role:** Defines the structure of user data in Redux.

**What it stores:**
```javascript
const userState = {
  isLoggedIn: false,        // Is user logged in?
  profile: {                // Basic user info
    name: "Sarah",
    email: "sarah@email.com"
  },
  quizResult: {             // Saved quiz results
    skinType: "oily",
    concerns: ["acne"],
    ageRange: "26-35"
  },
  recommendations: {        // Saved AI recommendations
    routine: {...},
    summary: "..."
  },
  loading: false,           // Is something loading?
  error: null               // Any error message
};
```

**Key exports:**
```javascript
// Selectors - to read data from state
export const selectIsLoggedIn = (state) => state.user.isLoggedIn;
export const selectQuizResult = (state) => state.user.quizResult;
export const selectRecommendations = (state) => state.user.recommendations;

// Usage in components:
const isLoggedIn = useSelector(selectIsLoggedIn);
const quizResult = useSelector(selectQuizResult);
```

---

### 📄 userThunks.js

**Location:** `src/features/user/userThunks.js`

**Role:** Handles async operations (saving/loading data).

**Key functions:**
```javascript
// Save quiz result to localStorage
export const saveQuizResultThunk = createAsyncThunk(
  'user/saveQuizResult',
  async (quizResult) => {
    updateUser({ quizResult });  // Save to localStorage
    return quizResult;
  }
);

// Save AI recommendations to localStorage
export const saveRecommendationsThunk = createAsyncThunk(
  'user/saveRecommendations',
  async (recommendations) => {
    updateUser({ recommendations });
    return recommendations;
  }
);

// Load user data when app starts
export const loadUserFromStorage = createAsyncThunk(
  'user/loadFromStorage',
  async () => {
    return loadUser();  // Read from localStorage
  }
);
```

---

### 📄 userAPI.js

**Location:** `src/features/user/userAPI.js`

**Role:** The lowest level - actually talks to localStorage.

**Why it exists:** Separates localStorage operations from business logic.

**Key functions:**
```javascript
const STORAGE_KEY = 'beautymatch_user';

// Save all user data
export function saveUser(userData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
}

// Load all user data
export function loadUser() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

// Update specific fields
export function updateUser(updates) {
  const existing = loadUser() || {};
  const updated = { ...existing, ...updates };
  saveUser(updated);
}

// Clear all data (logout)
export function clearUser() {
  localStorage.removeItem(STORAGE_KEY);
}
```

---

### 📄 QuizComponents.jsx & SkinQuiz subcomponents

**Location:** `src/components/quiz/`

**QuizComponents.jsx** — Reusable UI pieces for the quiz:
```javascript
<ProgressBar currentStep={3} totalSteps={5} />
<QuestionCard option="Tight and dry" isSelected={true} onSelect={() => handleAnswer(0)} />
<QuizButton variant="primary">Next</QuizButton>
<QuizButton variant="secondary">Back</QuizButton>
```

**SkinQuiz/** — UI-only subcomponents (no logic, receive props from SkinQuiz.jsx):
- **IntroScreen** — Intro text, features, Start button
- **QuizScreen** — Question, options, Back/Next (uses QuizComponents)
- **LoadingScreen** — Spinner and "Analyzing Your Skin..." message
- **ErrorScreen** — Error message + Try Again button
- **ResultsScreen** — Skin type, AI summary, routine cards (uses RecommendedProductCard)
- **RecommendedProductCard** — One product with Add to Cart

---

### 📄 skinQuizData.js

**Location:** `src/data/skinQuizData.js`

**Role:** Static data for the quiz. Separates content from logic.

**Exports:**
- **quizQuestions** — Array of 5 questions with id, question, options
- **skinTypeInfo** — Display info per skin type (title, emoji, color, gradient)
- **routineSteps** — Labels for cleanser, serum, moisturizer, sunscreen (label, icon, step, description)

---

## 6️⃣ State Management

### Where is data stored?

```
┌─────────────────────────────────────────────────────────────────┐
│                      DATA STORAGE LOCATIONS                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    REACT STATE (useState)                 │   │
│  │                                                           │   │
│  │  Location: Inside SkinQuiz.jsx component                  │   │
│  │                                                           │   │
│  │  What's stored:                                           │   │
│  │  ├── viewMode (intro, quiz, results)                     │   │
│  │  ├── currentStep (which question)                        │   │
│  │  ├── answers (user's selections)                         │   │
│  │  ├── isLoading (loading state)                           │   │
│  │  └── error (error messages)                              │   │
│  │                                                           │   │
│  │  ⚠️ This data is TEMPORARY - lost on page refresh        │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           │ After quiz completes                │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    REDUX STORE                            │   │
│  │                                                           │   │
│  │  Location: Global app state                              │   │
│  │                                                           │   │
│  │  What's stored:                                           │   │
│  │  ├── quizResult (skin analysis)                          │   │
│  │  ├── recommendations (AI suggestions)                    │   │
│  │  └── user profile                                        │   │
│  │                                                           │   │
│  │  ⚠️ This data is SEMI-PERMANENT - stays during session   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                           │                                      │
│                           │ Synced automatically                │
│                           ↓                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    LOCALSTORAGE                           │   │
│  │                                                           │   │
│  │  Location: Browser storage                               │   │
│  │                                                           │   │
│  │  What's stored:                                           │   │
│  │  └── Everything from Redux (as JSON)                     │   │
│  │                                                           │   │
│  │  ✅ This data PERSISTS - survives page refresh & close   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Why use both local state and Redux?

| Type | Use For | Why? |
|------|---------|------|
| **useState** | Temporary UI state (current step, loading) | Fast, simple, component-specific |
| **Redux** | Important data (quiz result, recommendations) | Shared across components, easy to persist |
| **localStorage** | Permanent storage | Survives page refresh, closing browser |

### Data Persistence Flow

```javascript
// 1. User completes quiz - data is in component state
const result = analyzeAnswers(answers);

// 2. Save to Redux (makes it available everywhere)
dispatch(saveQuizResultThunk(result));

// 3. Thunk automatically saves to localStorage (userAPI.js)
// Now data survives page refresh!

// 4. On app start, data is loaded back
// In App.jsx:
useEffect(() => {
  dispatch(loadUserFromStorage());
}, []);
```

---

## 7️⃣ Error Handling

### What happens if AI fails?

```javascript
// In aiRecommendation.js
try {
  // Try to call AI
  return await callOpenAI(quizResult, products);
} catch (error) {
  console.error('AI failed:', error);
  
  // Fall back to smart matching (works without AI!)
  return generateSmartRecommendations(quizResult, products);
}
```

**The user never sees an error** - they just get smart matching instead of AI!

### What happens if quiz is incomplete?

```javascript
// In SkinQuiz.jsx
// Button is disabled until answer is selected
<QuizButton 
  onClick={handleNext} 
  disabled={!hasAnswer}  // Can't continue without answering
>
  Next
</QuizButton>
```

### What happens if products don't load?

```javascript
// In SkinQuiz.jsx
// We check if products exist before calling AI
if (!products || products.length === 0) {
  console.log('No products, fetching...');
  const fetchResult = await dispatch(fetchProducts());
  products = fetchResult.payload || [];
}
```

### How the UI reacts to errors

```
┌────────────────────────────────────────┐
│           ERROR HANDLING UI             │
├────────────────────────────────────────┤
│                                         │
│  LOADING STATE:                         │
│  ┌─────────────────────────────────┐   │
│  │     🔄 Analyzing Your Skin...   │   │
│  │     Our AI is creating your     │   │
│  │     personalized routine        │   │
│  │         ● ● ●                   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ERROR STATE:                           │
│  ┌─────────────────────────────────┐   │
│  │     😕 Oops! Something went     │   │
│  │        wrong                    │   │
│  │                                 │   │
│  │     Failed to generate          │   │
│  │     recommendations.            │   │
│  │                                 │   │
│  │     [🔄 Try Again]              │   │
│  └─────────────────────────────────┘   │
│                                         │
└────────────────────────────────────────┘
```

---

## 8️⃣ Simple Summary

### In Plain Words

> **The AI Recommendation System is like a smart friend who knows about skincare.**
>
> First, you tell it about your skin by answering 5 easy questions (like "Is your skin oily or dry?"). 
>
> Then, the system looks at your answers and figures out what type of skin you have. It also notes any problems you mentioned, like acne or dryness.
>
> Next, it looks at all the products in our store and picks the 4 best ones for you: a cleanser, a serum, a moisturizer, and a sunscreen.
>
> If we have an AI (like ChatGPT) available, it uses that to make really smart choices. If not, we use our own matching system that looks at what ingredients work best for your skin type.
>
> Finally, everything is saved to your profile so you can see your results anytime, even after closing the browser!

### The 30-Second Version

```
User answers quiz  →  System detects skin type  →  AI picks products  →  User sees routine
     ↓                        ↓                         ↓                      ↓
[5 questions]         [oily/dry/etc]            [cleanser, serum,      [saved to profile]
                                                 moisturizer, SPF]
```

### Key Takeaways for Developers

1. **Separation of Concerns**: Each file does ONE thing well
2. **Fallbacks**: AI → Smart Matching → Error Message
3. **Persistence**: localStorage keeps data safe
4. **User Experience**: Loading states, error states, smooth flow

---

## 📎 Quick Reference

### Files at a Glance

| File | Purpose |
|------|---------|
| `SkinQuiz.jsx` | Route entry; Redux, state, effects, handlers; renders subcomponents |
| `SkinQuiz/IntroScreen.jsx` | Intro + Start button |
| `SkinQuiz/QuizScreen.jsx` | Questions, answers, Back/Next |
| `SkinQuiz/LoadingScreen.jsx` | Loading state |
| `SkinQuiz/ErrorScreen.jsx` | Error + Try Again |
| `SkinQuiz/ResultsScreen.jsx` | Skin type, AI summary, routine |
| `SkinQuiz/RecommendedProductCard.jsx` | Product card with Add to Cart |
| `skinQuizData.js` | quizQuestions, skinTypeInfo, routineSteps |
| `analyzeQuizResult.js` | Analyze answers → skin type |
| `aiPrompt.js` | Build AI instructions |
| `aiRecommendation.js` | Call AI or smart match |
| `userSlice.js` | Redux state structure |
| `userThunks.js` | Async save/load operations |
| `userAPI.js` | localStorage operations |
| `QuizComponents.jsx` | ProgressBar, QuestionCard, QuizButton |

### How to Add a New Question

1. Add question to `quizQuestions` array in `src/data/skinQuizData.js`
2. Update scoring logic in `analyzeQuizResult.js`
3. Update the `Array(quizQuestions.length)` in SkinQuiz.jsx if needed
4. The rest adapts automatically.

### How to Enable Google Gemini AI

1. Create a `.env` file in project root
2. Add `VITE_GEMINI_API_KEY=your-api-key-here`
3. Get your key from: https://makersuite.google.com/app/apikey
4. Restart the dev server

**No API key?** No problem! Smart Matching works automatically and provides good recommendations using local logic.

---

*Documentation created for BeautyMatch - AI-Powered Skincare Recommendations*

*Last updated: 2026*

