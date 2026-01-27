/**
 * analyzeQuizResult.js
 * 
 * Helper functions to format and analyze quiz results
 * before sending to the AI recommendation system.
 */

/**
 * Format quiz answers into a structured result object
 * 
 * @param {Array} answers - Array of selected answer indices
 * @param {Array} questions - Array of quiz questions
 * @returns {Object} Formatted quiz result
 */
export function formatQuizResult(answers, questions) {
  // Map answer indices to actual text
  const answerTexts = answers.map((answerIndex, questionIndex) => {
    if (answerIndex === null) return null;
    return questions[questionIndex].options[answerIndex];
  });

  return {
    skinFeeling: answerTexts[0],      // How skin feels after washing
    skinConcerns: answerTexts[1],     // Main skin concerns
    oilinessLevel: answerTexts[2],    // Oiliness during day
    sensitivity: answerTexts[3],      // Sensitivity to ingredients
    ageRange: answerTexts[4]          // Age range
  };
}

/**
 * Analyze quiz answers to determine skin type and concerns
 * 
 * @param {Array} answers - Array of selected answer indices
 * @returns {Object} Analysis result with skinType, concerns, and ageRange
 */
export function analyzeAnswers(answers) {
  // Initialize scores for each skin type
  let scores = {
    dry: 0,
    oily: 0,
    combination: 0,
    sensitive: 0,
    normal: 0
  };

  // Analyze answer 1: Skin feeling after washing
  // Options: [0] Tight and dry, [1] Comfortable, [2] Slightly oily T-zone, [3] Very oily
  if (answers[0] === 0) scores.dry += 2;
  if (answers[0] === 1) scores.normal += 2;
  if (answers[0] === 2) scores.combination += 2;
  if (answers[0] === 3) scores.oily += 2;

  // Analyze answer 2: Skin concerns
  // Options: [0] Acne, [1] Redness, [2] Dryness, [3] Sensitivity, [4] None
  if (answers[1] === 0) scores.oily += 1;
  if (answers[1] === 1) scores.sensitive += 2;
  if (answers[1] === 2) scores.dry += 2;
  if (answers[1] === 3) scores.sensitive += 2;
  if (answers[1] === 4) scores.normal += 1;

  // Analyze answer 3: Oiliness during day
  // Options: [0] Not oily, [1] T-zone only, [2] Moderately oily, [3] Very oily
  if (answers[2] === 0) scores.dry += 1;
  if (answers[2] === 1) scores.combination += 2;
  if (answers[2] === 2) scores.oily += 1;
  if (answers[2] === 3) scores.oily += 2;

  // Analyze answer 4: Sensitivity
  // Options: [0] Yes reacts, [1] Sometimes, [2] Rarely, [3] Never
  if (answers[3] === 0) scores.sensitive += 2;
  if (answers[3] === 1) scores.sensitive += 1;

  // Determine skin type (highest score wins)
  const skinType = Object.keys(scores).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );

  // Map concerns based on answer 2
  const concernsMap = {
    0: ["acne", "breakouts"],
    1: ["redness", "irritation"],
    2: ["dryness", "dehydration"],
    3: ["sensitivity", "reactivity"],
    4: []
  };
  const concerns = concernsMap[answers[1]] || [];

  // Add extra concerns based on other answers
  if (answers[0] === 0) concerns.push("tightness");
  if (answers[2] >= 2) concerns.push("excess oil");
  if (answers[3] <= 1) concerns.push("sensitivity");

  // Map age range based on answer 5
  const ageRangeMap = {
    0: "under-18",
    1: "18-25",
    2: "26-35",
    3: "36-45",
    4: "46+"
  };
  const ageRange = ageRangeMap[answers[4]] || "unknown";

  return {
    skinType,
    concerns: [...new Set(concerns)], // Remove duplicates
    ageRange,
    scores // Include scores for debugging
  };
}

/**
 * Map skin type to French equivalent for product matching
 * 
 * @param {string} skinType - English skin type
 * @returns {string} French skin type
 */
export function mapSkinTypeToFrench(skinType) {
  const mapping = {
    dry: "Sèche",
    oily: "Grasse",
    combination: "Mixte",
    sensitive: "Sensible",
    normal: "Normale"
  };
  return mapping[skinType] || skinType;
}

/**
 * Map concerns to French equivalents for product matching
 * 
 * @param {Array} concerns - Array of English concern strings
 * @returns {Array} Array of French concern strings
 */
export function mapConcernsToFrench(concerns) {
  const mapping = {
    "acne": "Acné",
    "breakouts": "Imperfections",
    "redness": "Rougeurs",
    "irritation": "Irritation",
    "dryness": "Sécheresse",
    "dehydration": "Déshydratation",
    "sensitivity": "Sensibilité",
    "reactivity": "Réactivité",
    "tightness": "Tiraillements",
    "excess oil": "Excès de sébum"
  };
  return concerns.map(c => mapping[c] || c);
}

