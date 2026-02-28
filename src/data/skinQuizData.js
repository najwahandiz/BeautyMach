/**
 * skinQuizData.js
 *
 * All quiz-related constants for the Skin Quiz.
 * Keeps data separate from component logic for easier maintenance.
 */

/* ============ Quiz Questions ============ */
export const quizQuestions = [
  {
    id: 1,
    question: "How does your skin feel after washing?",
    options: [
      "Tight and dry",
      "Comfortable and balanced",
      "Slightly oily in T-zone",
      "Very oily and shiny all over"
    ]
  },
  {
    id: 2,
    question: "Do you experience any of these skin concerns?",
    options: [
      "Acne and breakouts",
      "Redness and irritation",
      "Dryness and flakiness",
      "Sensitivity to products",
      "None of the above"
    ]
  },
  {
    id: 3,
    question: "How oily does your skin get during the day?",
    options: [
      "Not oily at all",
      "Slightly oily in T-zone only",
      "Moderately oily all over",
      "Very oily, need to blot often"
    ]
  },
  {
    id: 4,
    question: "Are you sensitive to fragrances or active ingredients?",
    options: [
      "Yes, my skin reacts easily",
      "Sometimes, with certain products",
      "Rarely",
      "No, never had issues"
    ]
  },
  {
    id: 5,
    question: "What is your age range?",
    options: [
      "Under 18",
      "18 – 25",
      "26 – 35",
      "36 – 45",
      "46+"
    ]
  }
];

/* ============ Skin Type Display Info ============ */
export const skinTypeInfo = {
  dry: {
    title: "Dry Skin",
    emoji: "🏜️",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    gradient: "from-amber-500 to-orange-500"
  },
  oily: {
    title: "Oily Skin",
    emoji: "✨",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    gradient: "from-emerald-500 to-teal-500"
  },
  combination: {
    title: "Combination Skin",
    emoji: "⚖️",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    gradient: "from-blue-500 to-indigo-500"
  },
  sensitive: {
    title: "Sensitive Skin",
    emoji: "🌸",
    color: "bg-pink-50 text-pink-700 border-pink-200",
    gradient: "from-pink-500 to-rose-500"
  },
  normal: {
    title: "Normal Skin",
    emoji: "🌟",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    gradient: "from-purple-500 to-violet-500"
  }
};

/* ============ Routine Step Labels (Cleanser, Serum, etc.) ============ */
export const routineSteps = {
  cleanser: {
    label: "Cleanser",
    icon: "🧴",
    step: 1,
    description: "Start your routine"
  },
  serum: {
    label: "Serum",
    icon: "💧",
    step: 2,
    description: "Target your concerns"
  },
  moisturizer: {
    label: "Moisturizer",
    icon: "🧴",
    step: 3,
    description: "Lock in hydration"
  },
  sunscreen: {
    label: "Sunscreen",
    icon: "☀️",
    step: 4,
    description: "Protect your skin"
  }
};
