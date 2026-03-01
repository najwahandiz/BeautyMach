/**
 * Service for AI-powered skincare recommendations.
 * Supports Google Gemini AI with smart matching fallback.
 */

import { buildRecommendationPrompt, getSystemMessage } from '../lib/aiPrompt';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';


export async function getRecommendations(quizResult, products) {
  console.log('🔍 Getting recommendations for:', quizResult);
  console.log('📦 Available products:', products?.length || 0);

  if (!quizResult) throw new Error('Quiz result is required');

  try {
    return GEMINI_API_KEY 
      ? await callGemini(quizResult, products)
      : generateSmartRecommendations(quizResult, products);
  } catch (error) {
    console.error('❌ AI failed, falling back:', error.message);
    return handleFallback(quizResult, products);
  }
}

export function isAIAvailable() {
  return !!GEMINI_API_KEY;
}

export function getAIProvider() {
  return GEMINI_API_KEY ? 'Google Gemini' : 'Smart Matching';
}

// ============================================================
// GEMINI IMPLEMENTATION

async function callGemini(quizResult, products) {
  if (!products?.length) throw new Error('No products available');

  const prompt = buildRecommendationPrompt(quizResult, products);
  console.log('📝 Calling Gemini API...');

  const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${getSystemMessage()}\n\n${prompt}` }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2048,
        response_mime_type: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${response.status} - ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!content) throw new Error('Empty response from Gemini');
  
  return parseAIResponse(content);
}

function parseAIResponse(content) {
  if (!content || typeof content !== 'string') {
    throw new Error('Empty or invalid AI response');
  }

  let jsonStr = content.trim();

  // Extract from markdown code block
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  } else {
    // Extract JSON object
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
  }

  if (!jsonStr.startsWith('{')) {
    throw new Error('No JSON found in AI response');
  }

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse AI response:', jsonStr.substring(0, 200) + '...');
    throw new Error('Could not parse AI response as JSON');
  }
}

// ============================================================
// FALLBACK HANDLER
// ============================================================
async function handleFallback(quizResult, products) {
  try {
    return generateSmartRecommendations(quizResult, products);
  } catch (error) {
    console.error('❌ Smart matching failed:', error);
    return {
      routine: { cleanser: null, serum: null, moisturizer: null, sunscreen: null },
      summary: `We encountered an issue generating recommendations. Please try again or browse our catalog directly.`
    };
  }
}

function generateSmartRecommendations(quizResult, products) {
  const skinType = quizResult?.skinType || 'normal';
  const concerns = quizResult?.concerns || [];
  
  console.log('🎯 Smart Matching for:', { skinType, concerns, productCount: products?.length || 0 });
  
  if (!products?.length) {
    return {
      routine: { cleanser: null, serum: null, moisturizer: null, sunscreen: null },
      summary: `We couldn't find products to recommend. Please check that products are loaded in the catalog.`
    };
  }
  
  const scoreProduct = (product) => {
    let score = 0;
    
    // Skin type match
    const productSkinType = (product.skinType || '').toLowerCase();
    if (productSkinType.includes(skinType) || productSkinType.includes('all') || productSkinType.includes('tout')) {
      score += 10;
    }
    
    // Concern matches
    const productConcerns = (product.concerns || '').toLowerCase();
    concerns.forEach(concern => {
      if (productConcerns.includes(concern.toLowerCase())) score += 5;
    });
    
    // Good ingredients
    let ingredientsText = '';
    if (Array.isArray(product.ingredients)) {
      ingredientsText = product.ingredients.join(' ').toLowerCase();
    } else if (typeof product.ingredients === 'string') {
      ingredientsText = product.ingredients.toLowerCase();
    }
    
    const goodIngredients = ['hyaluronic', 'niacinamide', 'vitamin c', 'aloe', 'ceramide', 'salicylic', 'retinol'];
    goodIngredients.forEach(ingredient => {
      if (ingredientsText.includes(ingredient)) score += 2;
    });
    
    return score;
  };

  const findBestProduct = (categories) => {
    const matching = products.filter(product => {
      const cat = (product.subcategory || product.category || '').toLowerCase();
      return categories.some(c => cat.includes(c.toLowerCase()));
    });
    
    if (matching.length === 0) return null;
    matching.sort((a, b) => scoreProduct(b) - scoreProduct(a));
    return matching[0];
  };

  const cleanser = findBestProduct(['nettoyant', 'cleanser', 'cleansers', 'gel', 'mousse']);
  const serum = findBestProduct(['sérum', 'serum', 'serums']);
  const moisturizer = findBestProduct(['hydratant', 'crème', 'moisturizer', 'moisturizers', 'cream']);
  const sunscreen = findBestProduct(['solaire', 'sunscreen', 'spf', 'sun']);

  const skinTypeDescriptions = {
    dry: "hydrating ingredients to nourish and moisturize your dry skin",
    oily: "lightweight formulas that control oil without over-drying",
    combination: "balanced formulas that address both oily and dry areas",
    sensitive: "gentle, soothing ingredients that won't irritate your skin",
    normal: "maintaining your skin's natural balance and protection"
  };
  
  const skinDescription = skinTypeDescriptions[skinType] || "supporting your skin's health";

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