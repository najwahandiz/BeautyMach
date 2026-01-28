/**
 * aiRecommendation.js
 * 
 * Service for AI-powered skincare recommendations.
 * 
 * ============================================================
 * HOW THIS SYSTEM WORKS:
 * ============================================================
 * 
 * 1. QUIZ ANALYSIS (Rule-based)
 *    - User answers 5 questions about their skin
 *    - analyzeQuizResult.js uses a SCORING SYSTEM to determine skin type
 *    - This is NOT AI - it's simple logic with points
 * 
 * 2. PRODUCT RECOMMENDATIONS (AI or Smart Matching)
 *    - If VITE_GEMINI_API_KEY exists → Use Google Gemini AI
 *    - If no API key OR Gemini fails → Use Smart Matching (local logic)
 * 
 * 3. SMART MATCHING (Fallback - No AI needed)
 *    - Scores each product based on skin type & concerns
 *    - Picks the best product for each routine step
 *    - Works 100% offline, no API key required
 * 
 * ============================================================
 * SETUP:
 * ============================================================
 * 
 * To use Google Gemini:
 * 1. Create a .env file in your project root
 * 2. Add: VITE_GEMINI_API_KEY=your-api-key-here
 * 3. Get your key from: https://makersuite.google.com/app/apikey
 * 
 * No API key? No problem! Smart matching works automatically.
 * 
 */

import { buildRecommendationPrompt, getSystemMessage } from '../lib/aiPrompt';

// ============================================================
// CONFIGURATION
// ============================================================

// Get Gemini API key from environment variables
// Vite requires VITE_ prefix for client-side env variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Google Gemini API endpoint
// Using gemini-1.0-pro (stable and widely available)
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent';

// ============================================================
// MAIN FUNCTION - Entry point for recommendations
// ============================================================

/**
 * Get personalized skincare recommendations
 * 
 * This is the MAIN function that components call.
 * It decides whether to use Gemini AI or Smart Matching.
 * 
 * @param {Object} quizResult - The analyzed quiz result
 *   @param {string} quizResult.skinType - User's skin type (dry/oily/combination/sensitive/normal)
 *   @param {Array} quizResult.concerns - Array of skin concerns
 *   @param {string} quizResult.ageRange - User's age range
 * 
 * @param {Array} products - Array of available products from the database
 * 
 * @returns {Promise<Object>} Recommendation object with routine and summary
 */
export async function getRecommendations(quizResult, products) {
  // Log for debugging (helpful during development)
  console.log('🔍 Getting recommendations for:', quizResult);
  console.log('📦 Available products:', products?.length || 0);

  // Validate inputs
  if (!quizResult) {
    console.error('❌ No quiz result provided');
    throw new Error('Quiz result is required');
  }

  try {
    // ========== DECISION: Use Gemini or Smart Matching? ==========
    
    if (GEMINI_API_KEY) {
      // API key exists → Try Gemini AI
      console.log('🤖 Gemini API key found, using AI recommendations...');
      return await callGemini(quizResult, products);
    } else {
      // No API key → Use Smart Matching
      console.log('📝 No API key configured, using smart matching...');
      return generateSmartRecommendations(quizResult, products);
    }

  } catch (error) {
    // ========== ERROR HANDLING: Fallback to Smart Matching ==========
    // If Gemini fails for any reason, we still give the user recommendations
    console.error('❌ AI recommendation failed:', error.message);
    console.error('Full error:', error);
    console.log('🔄 Falling back to smart matching...');
    
    try {
      return generateSmartRecommendations(quizResult, products);
    } catch (fallbackError) {
      console.error('❌ Smart matching also failed:', fallbackError);
      // Return a basic response instead of throwing
      return {
        routine: {
          cleanser: null,
          serum: null,
          moisturizer: null,
          sunscreen: null
        },
        summary: `We encountered an issue generating recommendations. Please try again or browse our catalog directly.`
      };
    }
  }
}

// ============================================================
// GEMINI AI IMPLEMENTATION
// ============================================================

/**
 * Call Google Gemini API for AI-powered recommendations
 * 
 * Gemini reads our prompt (user skin profile + available products)
 * and returns personalized recommendations with explanations.
 * 
 * @param {Object} quizResult - Quiz analysis result
 * @param {Array} products - Available products
 * @returns {Promise<Object>} AI recommendations
 */
async function callGemini(quizResult, products) {
  // Check if we have products to recommend
  if (!products || products.length === 0) {
    console.warn('⚠️ No products for Gemini, falling back to smart matching');
    throw new Error('No products available');
  }

  // Step 1: Build the prompt (instructions for the AI)
  const prompt = buildRecommendationPrompt(quizResult, products);
  console.log('📝 Gemini prompt built, calling API...');
  
  // Step 2: Call Gemini API
  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ 
          text: `${getSystemMessage()}\n\n${prompt}` 
        }]
      }],
      // Generation settings for better results
      generationConfig: {
        temperature: 0.7,      // Creativity level (0-1)
        maxOutputTokens: 1000  // Max response length
      }
    })
  });

  // Step 3: Check for errors
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
  }

  // Step 4: Parse the response
  const data = await response.json();
  
  // Extract the text content from Gemini's response
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) {
    throw new Error('Empty response from Gemini');
  }

  // Step 5: Parse JSON from the AI response
  return parseAIResponse(content);
}

// ============================================================
// RESPONSE PARSER
// ============================================================

/**
 * Parse AI response and extract JSON
 * 
 * The AI returns text that contains JSON. We need to extract it.
 * 
 * @param {string} content - Raw AI response text
 * @returns {Object} Parsed recommendation object
 */
function parseAIResponse(content) {
  try {
    // Find JSON object in the response (between { and })
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('No JSON found in AI response');
  } catch (error) {
    console.error('Failed to parse AI response:', content);
    throw new Error('Could not parse AI response as JSON');
  }
}

// ============================================================
// SMART MATCHING (FALLBACK - NO AI NEEDED)
// ============================================================

/**
 * Generate recommendations using smart product matching
 * 
 * This function works WITHOUT any API key.
 * It uses logic-based matching to find the best products.
 * 
 * HOW IT WORKS:
 * 1. For each product, calculate a "relevance score"
 * 2. Score is based on: skin type match + concern match + good ingredients
 * 3. Pick the highest-scoring product for each routine step
 * 
 * @param {Object} quizResult - Quiz analysis result
 * @param {Array} products - Available products
 * @returns {Object} Recommendation object
 */
function generateSmartRecommendations(quizResult, products) {
  // Defensive: ensure quizResult has required fields
  const skinType = quizResult?.skinType || 'normal';
  const concerns = quizResult?.concerns || [];
  
  // Log for debugging
  console.log('🎯 Smart Matching for:', { skinType, concerns, productCount: products?.length || 0 });
  
  // If no products, return empty routine with helpful message
  if (!products || products.length === 0) {
    console.warn('⚠️ No products available for smart matching');
    return {
      routine: {
        cleanser: null,
        serum: null,
        moisturizer: null,
        sunscreen: null
      },
      summary: `We couldn't find products to recommend. Please check that products are loaded in the catalog.`
    };
  }
  
  // ========== SCORING FUNCTION ==========
  // Calculate how well a product matches the user's skin
  const scoreProduct = (product) => {
    let score = 0;
    
    // Check skin type match (+10 points)
    const productSkinType = (product.skinType || '').toLowerCase();
    if (productSkinType.includes(skinType) || 
        productSkinType.includes('all') || 
        productSkinType.includes('tout')) {
      score += 10;
    }
    
    // Check concern matches (+5 points each)
    const productConcerns = (product.concerns || '').toLowerCase();
    concerns.forEach(concern => {
      if (productConcerns.includes(concern.toLowerCase())) {
        score += 5;
      }
    });
    
    // Bonus for proven effective ingredients (+2 points each)
    // Handle ingredients as string OR array
    let ingredientsText = '';
    if (Array.isArray(product.ingredients)) {
      ingredientsText = product.ingredients.join(' ').toLowerCase();
    } else if (typeof product.ingredients === 'string') {
      ingredientsText = product.ingredients.toLowerCase();
    }
    
    const goodIngredients = [
      'hyaluronic',   // Hydration
      'niacinamide',  // Oil control, pores
      'vitamin c',    // Brightening
      'aloe',         // Soothing
      'ceramide',     // Barrier repair
      'salicylic',    // Acne
      'retinol'       // Anti-aging
    ];
    goodIngredients.forEach(ingredient => {
      if (ingredientsText.includes(ingredient)) {
        score += 2;
      }
    });
    
    return score;
  };

  // ========== FIND BEST PRODUCT FOR CATEGORY ==========
  const findBestProduct = (categories) => {
    // Filter products by category
    const matching = products.filter(product => {
      const cat = (product.subcategory || product.category || '').toLowerCase();
      return categories.some(c => cat.includes(c.toLowerCase()));
    });
    
    // No products found for this category
    if (matching.length === 0) return null;
    
    // Sort by score and return the best one
    matching.sort((a, b) => scoreProduct(b) - scoreProduct(a));
    return matching[0];
  };

  // ========== BUILD THE ROUTINE ==========
  // Find the best product for each step
  const cleanser = findBestProduct(['nettoyant', 'cleanser', 'cleansers', 'gel', 'mousse']);
  const serum = findBestProduct(['sérum', 'serum', 'serums']);
  const moisturizer = findBestProduct(['hydratant', 'crème', 'moisturizer', 'moisturizers', 'cream']);
  const sunscreen = findBestProduct(['solaire', 'sunscreen', 'spf', 'sun']);

  // ========== GENERATE PERSONALIZED REASONS ==========
  const skinTypeDescriptions = {
    dry: "hydrating ingredients to nourish and moisturize your dry skin",
    oily: "lightweight formulas that control oil without over-drying",
    combination: "balanced formulas that address both oily and dry areas",
    sensitive: "gentle, soothing ingredients that won't irritate your skin",
    normal: "maintaining your skin's natural balance and protection"
  };
  
  const skinDescription = skinTypeDescriptions[skinType] || "supporting your skin's health";

  // ========== BUILD RESPONSE OBJECT ==========
  return {
    routine: {
      cleanser: cleanser ? {
        productId: cleanser.id,
        name: cleanser.name,
        reason: `This gentle cleanser is perfect for ${skinType} skin, featuring ${skinDescription}.`
      } : null,
      
      serum: serum ? {
        productId: serum.id,
        name: serum.name,
        reason: `This serum targets your concerns with active ingredients for ${skinDescription}.`
      } : null,
      
      moisturizer: moisturizer ? {
        productId: moisturizer.id,
        name: moisturizer.name,
        reason: `This moisturizer provides the perfect level of hydration for ${skinType} skin.`
      } : null,
      
      sunscreen: sunscreen ? {
        productId: sunscreen.id,
        name: sunscreen.name,
        reason: `Daily sun protection is essential. This formula is perfect for ${skinType} skin.`
      } : null
    },
    
    summary: `Based on your ${skinType} skin type${concerns.length > 0 ? ` and concerns about ${concerns.join(' and ')}` : ''}, we've selected products that focus on ${skinDescription}. This routine will help address your specific needs while keeping your skin healthy and balanced.`
  };
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if AI (Gemini) is available
 * 
 * @returns {boolean} True if Gemini API key is configured
 */
export function isAIAvailable() {
  return !!GEMINI_API_KEY;
}

/**
 * Get the current recommendation provider name
 * 
 * Used to show the user what's generating their recommendations
 * 
 * @returns {string} Provider name
 */
export function getAIProvider() {
  if (GEMINI_API_KEY) {
    return 'Google Gemini';
  }
  return 'Smart Matching';
}
