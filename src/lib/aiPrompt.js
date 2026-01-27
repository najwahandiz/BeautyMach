/**
 * aiPrompt.js
 * 
 * Contains functions to build AI prompts for skincare recommendations.
 * The AI will analyze quiz results and select the best products
 * from the available product catalog.
 */

import { mapSkinTypeToFrench, mapConcernsToFrench } from '../utils/analyzeQuizResult';

/**
 * Build the AI prompt for skincare recommendations
 * 
 * @param {Object} quizResult - The analyzed quiz result
 * @param {string} quizResult.skinType - User's skin type (dry/oily/combination/sensitive/normal)
 * @param {Array} quizResult.concerns - Array of skin concerns
 * @param {string} quizResult.ageRange - User's age range
 * @param {Array} products - Array of available products from the database
 * @returns {string} The complete AI prompt
 */
export function buildRecommendationPrompt(quizResult, products) {
  const { skinType, concerns, ageRange } = quizResult;
  
  // Convert to French for better product matching
  const skinTypeFr = mapSkinTypeToFrench(skinType);
  const concernsFr = mapConcernsToFrench(concerns);

  // Filter products to only include relevant categories
  const relevantProducts = products.filter(p => 
    ['Nettoyant', 'Sérum', 'Hydratant', 'Crème', 'Solaire', 'cleanser', 'serum', 'moisturizer', 'sunscreen', 'cleansers', 'serums', 'moisturizers'].some(
      cat => p.subcategory?.toLowerCase().includes(cat.toLowerCase()) || 
             p.category?.toLowerCase().includes(cat.toLowerCase())
    )
  );

  // Format products for the prompt
  const productsText = relevantProducts.map(p => `
    - ID: ${p.id}
    - Name: ${p.name}
    - Category: ${p.category} / ${p.subcategory}
    - Skin Type: ${p.skinType}
    - Concerns: ${p.concerns}
    - Ingredients: ${p.ingredients}
    - Description: ${p.description}
    - Price: $${p.price}
  `).join('\n');

  // Build the complete prompt
  const prompt = `
You are an expert skincare consultant. Based on the user's skin analysis and the available products, 
create a personalized skincare routine.

=== USER SKIN PROFILE ===
- Skin Type: ${skinType} (${skinTypeFr})
- Main Concerns: ${concerns.join(', ')} (${concernsFr.join(', ')})
- Age Range: ${ageRange}

=== AVAILABLE PRODUCTS ===
${productsText}

=== YOUR TASK ===
Select the BEST products from the list above to create a complete skincare routine.
You MUST only recommend products from the provided list - do NOT invent products.

Create a routine with:
1. CLEANSER - A gentle cleanser suitable for the skin type
2. SERUM - A treatment serum addressing the main concerns
3. MOISTURIZER - A hydrating cream suitable for the skin type
4. SUNSCREEN - A protective SPF product

For each product, explain WHY you chose it based on:
- How the ingredients address the user's concerns
- Skin type compatibility
- Product description relevance

=== RESPONSE FORMAT (JSON ONLY) ===
Respond ONLY with valid JSON in this exact format:
{
  "routine": {
    "cleanser": {
      "productId": "product ID from list",
      "name": "product name",
      "reason": "1-2 sentences explaining why this product is perfect for the user"
    },
    "serum": {
      "productId": "product ID from list",
      "name": "product name",
      "reason": "1-2 sentences explaining why this product is perfect for the user"
    },
    "moisturizer": {
      "productId": "product ID from list",
      "name": "product name",
      "reason": "1-2 sentences explaining why this product is perfect for the user"
    },
    "sunscreen": {
      "productId": "product ID from list",
      "name": "product name",
      "reason": "1-2 sentences explaining why this product is perfect for the user"
    }
  },
  "summary": "A friendly 2-3 sentence summary of the routine and why it's perfect for this user's skin"
}

If a category has no suitable product, use null for that slot and explain in summary.
`;

  return prompt;
}

/**
 * Build a simpler prompt for APIs with shorter context limits
 * 
 * @param {Object} quizResult - The analyzed quiz result
 * @param {Array} products - Array of available products
 * @returns {string} Shorter AI prompt
 */
export function buildSimplePrompt(quizResult, products) {
  const { skinType, concerns } = quizResult;
  
  // Get only product names and categories
  const productList = products.map(p => 
    `${p.id}: ${p.name} (${p.subcategory}, for ${p.skinType} skin)`
  ).join('\n');

  return `
Skin type: ${skinType}
Concerns: ${concerns.join(', ')}

Products available:
${productList}

Select best: cleanser, serum, moisturizer, sunscreen.
Return JSON: {"routine": {"cleanser": {"productId": "", "name": "", "reason": ""}, ...}, "summary": ""}
`;
}

/**
 * Get the system message for the AI
 * This sets the AI's behavior and expertise
 * 
 * @returns {string} System message
 */
export function getSystemMessage() {
  return `You are an expert skincare consultant with deep knowledge of ingredients, 
skin types, and skincare routines. You provide personalized recommendations 
based on scientific understanding of how ingredients work for different skin concerns.
Always be friendly, professional, and explain your recommendations clearly.
You MUST only recommend products from the provided product list.`;
}

