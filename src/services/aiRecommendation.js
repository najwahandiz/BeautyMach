/**
 * aiRecommendation.js
 * 
 * Service to handle AI-powered skincare recommendations.
 * Supports multiple AI providers: OpenAI, Google Gemini, or mock data.
 * 
 * HOW TO USE:
 * 1. Create a .env file in your project root
 * 2. Add your API key: VITE_OPENAI_API_KEY=your-key-here
 * 3. Or use: VITE_GEMINI_API_KEY=your-key-here
 * 4. If no API key is set, mock data will be used automatically
 */

import { buildRecommendationPrompt, getSystemMessage } from '../lib/aiPrompt';

// ============ CONFIGURATION ============

// Get API keys from environment variables (Vite uses VITE_ prefix)
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// API endpoints
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// ============ MAIN FUNCTION ============

/**
 * Get AI-powered skincare recommendations
 * 
 * @param {Object} quizResult - The analyzed quiz result
 * @param {Array} products - Array of available products from the database
 * @returns {Promise<Object>} The recommendation object
 */
export async function getRecommendations(quizResult, products) {
  console.log('🔍 Getting recommendations for:', quizResult);
  console.log('📦 Available products:', products.length);

  try {
    // Try real AI if API key is configured
    if (OPENAI_API_KEY) {
      console.log('🤖 Using OpenAI API...');
      return await callOpenAI(quizResult, products);
    }
    
    if (GEMINI_API_KEY) {
      console.log('🤖 Using Google Gemini API...');
      return await callGemini(quizResult, products);
    }

    // Fallback to smart mock recommendations
    console.log('📝 No API key found, using smart matching...');
    return generateSmartRecommendations(quizResult, products);

  } catch (error) {
    console.error('❌ AI recommendation error:', error);
    // Fallback to mock on error
    return generateSmartRecommendations(quizResult, products);
  }
}

// ============ OPENAI IMPLEMENTATION ============

/**
 * Call OpenAI API for recommendations
 */
async function callOpenAI(quizResult, products) {
  const prompt = buildRecommendationPrompt(quizResult, products);
  
  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage() },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  // Parse JSON from response
  return parseAIResponse(content);
}

// ============ GEMINI IMPLEMENTATION ============

/**
 * Call Google Gemini API for recommendations
 */
async function callGemini(quizResult, products) {
  const prompt = buildRecommendationPrompt(quizResult, products);
  
  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${getSystemMessage()}\n\n${prompt}` }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const content = data.candidates[0].content.parts[0].text;
  
  return parseAIResponse(content);
}

// ============ RESPONSE PARSER ============

/**
 * Parse AI response and extract JSON
 */
function parseAIResponse(content) {
  try {
    // Try to find JSON in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (error) {
    console.error('Failed to parse AI response:', error);
    throw error;
  }
}

// ============ SMART MATCHING (NO AI FALLBACK) ============

/**
 * Generate recommendations using smart product matching
 * This works without any API key - uses logic-based matching
 * 
 * @param {Object} quizResult - Quiz analysis result
 * @param {Array} products - Available products
 * @returns {Object} Recommendation object
 */
function generateSmartRecommendations(quizResult, products) {
  const { skinType, concerns } = quizResult;
  
  // Helper function to score product relevance
  const scoreProduct = (product) => {
    let score = 0;
    
    // Match skin type
    const productSkinType = product.skinType?.toLowerCase() || '';
    if (productSkinType.includes(skinType) || 
        productSkinType.includes('all') || 
        productSkinType.includes('tout')) {
      score += 10;
    }
    
    // Match concerns
    const productConcerns = product.concerns?.toLowerCase() || '';
    concerns.forEach(concern => {
      if (productConcerns.includes(concern.toLowerCase())) {
        score += 5;
      }
    });
    
    // Bonus for products with good ingredients
    const ingredients = product.ingredients?.toLowerCase() || '';
    const goodIngredients = ['hyaluronic', 'niacinamide', 'vitamin c', 'aloe', 'ceramide'];
    goodIngredients.forEach(ing => {
      if (ingredients.includes(ing)) score += 2;
    });
    
    return score;
  };

  // Find best product for each category
  const findBestProduct = (categories) => {
    const matching = products.filter(p => {
      const cat = (p.subcategory || p.category || '').toLowerCase();
      return categories.some(c => cat.includes(c.toLowerCase()));
    });
    
    if (matching.length === 0) return null;
    
    // Sort by relevance score
    matching.sort((a, b) => scoreProduct(b) - scoreProduct(a));
    return matching[0];
  };

  // Find products for each routine step
  const cleanser = findBestProduct(['nettoyant', 'cleanser', 'cleansers']);
  const serum = findBestProduct(['sérum', 'serum', 'serums']);
  const moisturizer = findBestProduct(['hydratant', 'crème', 'moisturizer', 'moisturizers', 'cream']);
  const sunscreen = findBestProduct(['solaire', 'sunscreen', 'spf', 'sun']);

  // Generate reasons based on skin type
  const skinTypeReasons = {
    dry: "hydrating ingredients to nourish and moisturize your dry skin",
    oily: "lightweight formulas that control oil without over-drying",
    combination: "balanced formulas that address both oily and dry areas",
    sensitive: "gentle, soothing ingredients that won't irritate your skin",
    normal: "maintaining your skin's natural balance and protection"
  };

  const reason = skinTypeReasons[skinType] || "supporting your skin's health";

  // Build the response
  return {
    routine: {
      cleanser: cleanser ? {
        productId: cleanser.id,
        name: cleanser.name,
        reason: `This gentle cleanser is perfect for ${skinType} skin, featuring ${reason}.`
      } : null,
      serum: serum ? {
        productId: serum.id,
        name: serum.name,
        reason: `This serum targets your concerns with active ingredients for ${reason}.`
      } : null,
      moisturizer: moisturizer ? {
        productId: moisturizer.id,
        name: moisturizer.name,
        reason: `This moisturizer provides the perfect level of hydration for ${skinType} skin.`
      } : null,
      sunscreen: sunscreen ? {
        productId: sunscreen.id,
        name: sunscreen.name,
        reason: `Daily sun protection is essential, and this formula is perfect for ${skinType} skin.`
      } : null
    },
    summary: `Based on your ${skinType} skin type and concerns about ${concerns.join(' and ')}, 
    we've selected products that focus on ${reason}. This routine will help address your specific 
    needs while keeping your skin healthy and balanced.`
  };
}

// ============ UTILITY FUNCTIONS ============

/**
 * Check if AI is available (API key configured)
 * @returns {boolean}
 */
export function isAIAvailable() {
  return !!(OPENAI_API_KEY || GEMINI_API_KEY);
}

/**
 * Get the current AI provider name
 * @returns {string}
 */
export function getAIProvider() {
  if (OPENAI_API_KEY) return 'OpenAI';
  if (GEMINI_API_KEY) return 'Google Gemini';
  return 'Smart Matching';
}

