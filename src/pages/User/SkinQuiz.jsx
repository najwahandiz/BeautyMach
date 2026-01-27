/**
 * Skin Type Quiz Page
 * 
 * A multi-step quiz that determines user's skin type and provides
 * AI-powered personalized skincare recommendations.
 * 
 * Features:
 * - Step-by-step questions
 * - Progress indicator
 * - Skin type analysis
 * - AI-powered product recommendations
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../features/products/productsThunks';
import { saveQuizResultThunk, saveRecommendationsThunk } from '../../features/user/userThunks';
import { selectIsLoggedIn } from '../../features/user/userSlice';
import { ProgressBar, QuestionCard, QuizButton } from '../../components/quiz/QuizComponents';
import { analyzeAnswers } from '../../utils/analyzeQuizResult';
import { getRecommendations, getAIProvider } from '../../services/aiRecommendation';
import { Sparkles, ArrowLeft, ArrowRight, RotateCcw, Loader2, ShoppingBag, User } from 'lucide-react';

/* ============ Quiz Questions Data ============ */
const quizQuestions = [
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

/* ============ Skin Type Info Data ============ */
const skinTypeInfo = {
  dry: { title: "Dry Skin", emoji: "🏜️", color: "bg-amber-50 text-amber-700" },
  oily: { title: "Oily Skin", emoji: "✨", color: "bg-green-50 text-green-700" },
  combination: { title: "Combination Skin", emoji: "⚖️", color: "bg-blue-50 text-blue-700" },
  sensitive: { title: "Sensitive Skin", emoji: "🌸", color: "bg-pink-50 text-pink-700" },
  normal: { title: "Normal Skin", emoji: "🌟", color: "bg-purple-50 text-purple-700" }
};

/* ============ Routine Step Labels ============ */
const routineSteps = {
  cleanser: { label: "Cleanser", icon: "🧴", step: 1 },
  serum: { label: "Serum", icon: "💧", step: 2 },
  moisturizer: { label: "Moisturizer", icon: "🧴", step: 3 },
  sunscreen: { label: "Sunscreen", icon: "☀️", step: 4 }
};

/* ============ Main Quiz Component ============ */
export default function SkinQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsData } = useSelector((state) => state.products);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  // Quiz state
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
  
  // Results state
  const [quizResult, setQuizResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = quizQuestions.length;
  const hasAnswer = currentStep >= 0 && currentStep < totalSteps && answers[currentStep] !== null;

  // Fetch products on mount - always fetch to ensure fresh data
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  /* --- Handle answer selection --- */
  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIndex;
    setAnswers(newAnswers);
  };

  /* --- Navigate to next step --- */
  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last question - analyze and get recommendations
      setIsLoading(true);
      setError(null);
      
      try {
        // Analyze quiz answers
        const result = analyzeAnswers(answers);
        setQuizResult(result);
        
        // Save quiz result to user profile (if logged in)
        if (isLoggedIn) {
          dispatch(saveQuizResultThunk(result));
        }
        
        // Ensure we have products - fetch if needed
        let products = productsData;
        
        if (!products || products.length === 0) {
          console.log('⚠️ No products in store, fetching fresh...');
          // Fetch products and wait for result
          const fetchResult = await dispatch(fetchProducts());
          // Get products from the fetch result
          products = fetchResult.payload || [];
          console.log('✅ Fetched products:', products.length);
        }
        
        // Get AI recommendations with the products
        console.log('📦 Sending products to AI:', products.length);
        const recs = await getRecommendations(result, products);
        setRecommendations(recs);
        
        // Save recommendations to user profile (if logged in)
        if (isLoggedIn) {
          dispatch(saveRecommendationsThunk(recs));
        }
        
        // Move to results screen
        setCurrentStep(totalSteps);
      } catch (err) {
        console.error('Error getting recommendations:', err);
        setError('Failed to generate recommendations. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  /* --- Navigate back --- */
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setCurrentStep(-1);
    }
  };

  /* --- Restart quiz --- */
  const handleRestart = () => {
    setCurrentStep(-1);
    setAnswers(Array(quizQuestions.length).fill(null));
    setQuizResult(null);
    setRecommendations(null);
    setError(null);
  };

  /* --- Start quiz --- */
  const handleStart = () => {
    setCurrentStep(0);
  };

  // Find full product details from recommendations
  const getProductDetails = (productId) => {
    return productsData?.find(p => p.id === productId) || null;
  };

  return (
    <div className="min-h-screen ">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">

        {/* ============ INTRO SCREEN ============ */}
        {currentStep === -1 && (
          <div className="text-center animate-fadeIn">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-lg shadow-[#9E3B3B]/20">
                <Sparkles size={36} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-4">
                Discover Your Skin Type
              </h1>
              <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
                Take our quick 5-question quiz to get personalized skincare recommendations powered by AI.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 mb-8 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">What you'll discover:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-[#fffaf5] rounded-2xl">
                  <div className="text-2xl mb-2">🔍</div>
                  <p className="text-gray-700 font-medium">Your skin type</p>
                </div>
                <div className="p-4 bg-[#fffaf5] rounded-2xl">
                  <div className="text-2xl mb-2">🤖</div>
                  <p className="text-gray-700 font-medium">AI recommendations</p>
                </div>
                <div className="p-4 bg-[#fffaf5] rounded-2xl">
                  <div className="text-2xl mb-2">✨</div>
                  <p className="text-gray-700 font-medium">Perfect routine</p>
                </div>
              </div>
            </div>

            <QuizButton onClick={handleStart}>
              Start Quiz
              <ArrowRight size={18} className="inline ml-2" />
            </QuizButton>
            <p className="text-gray-400 text-sm mt-4">Takes only 2 minutes</p>
          </div>
        )}

        {/* ============ QUESTION SCREENS ============ */}
        {currentStep >= 0 && currentStep < totalSteps && !isLoading && (
          <div className="animate-fadeIn">
            <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-6 leading-snug">
                {quizQuestions[currentStep].question}
              </h2>

              <div className="space-y-3">
                {quizQuestions[currentStep].options.map((option, index) => (
                  <QuestionCard
                    key={index}
                    option={option}
                    isSelected={answers[currentStep] === index}
                    onSelect={() => handleSelectAnswer(index)}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <QuizButton variant="secondary" onClick={handleBack}>
                <ArrowLeft size={18} className="inline mr-2" />
                Back
              </QuizButton>

              <QuizButton onClick={handleNext} disabled={!hasAnswer}>
                {currentStep === totalSteps - 1 ? 'Get My Routine' : 'Next'}
                <ArrowRight size={18} className="inline ml-2" />
              </QuizButton>
            </div>
          </div>
        )}

        {/* ============ LOADING SCREEN ============ */}
        {isLoading && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
              <Loader2 size={36} className="text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Analyzing Your Skin...
            </h2>
            <p className="text-gray-500">
              Our AI is creating your personalized routine
            </p>
            <div className="flex justify-center gap-1 mt-6">
              <div className="w-2 h-2 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-2 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-2 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}

        {/* ============ ERROR SCREEN ============ */}
        {error && (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-5xl mb-4">😕</div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <QuizButton onClick={handleRestart}>
              <RotateCcw size={18} className="inline mr-2" />
              Try Again
            </QuizButton>
          </div>
        )}

        {/* ============ RESULTS SCREEN ============ */}
        {currentStep === totalSteps && quizResult && recommendations && !isLoading && !error && (
          <div className="animate-fadeIn">
            {/* Skin Type Header */}
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">
                {skinTypeInfo[quizResult.skinType]?.emoji}
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
                Your Skin Type
              </h1>
              <span className={`inline-block px-4 py-2 rounded-full text-lg font-bold ${skinTypeInfo[quizResult.skinType]?.color}`}>
                {skinTypeInfo[quizResult.skinType]?.title}
              </span>
            </div>

            {/* Concerns */}
            {quizResult.concerns.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {quizResult.concerns.map((concern, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600"
                  >
                    {concern}
                  </span>
                ))}
              </div>
            )}

            {/* AI Summary */}
            <div className="bg-gradient-to-r from-[#9E3B3B]/10 to-[#ea7b7b]/10 rounded-2xl p-5 mb-8 border border-[#9E3B3B]/20">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Sparkles size={20} className="text-[#9E3B3B]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#9E3B3B] mb-1">
                    Powered by {getAIProvider()}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {recommendations.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Routine */}
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 text-center">
              Your Personalized Routine
            </h2>

            <div className="space-y-4 mb-8">
              {Object.entries(routineSteps).map(([key, { label, icon, step }]) => {
                const rec = recommendations.routine[key];
                if (!rec) return null;

                const product = getProductDetails(rec.productId);

                return (
                  <div
                    key={key}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      {/* Step number */}
                      <div className="w-10 h-10 rounded-full bg-[#9E3B3B] text-white flex items-center justify-center font-bold flex-shrink-0">
                        {step}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{icon}</span>
                          <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {label}
                          </span>
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2">{rec.name}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed mb-3">
                          {rec.reason}
                        </p>
                        
                        {/* Product price if available */}
                        {product && (
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-[#9E3B3B]">
                              ${product.price?.toFixed(2)}
                            </span>
                            <button className="flex items-center gap-2 px-4 py-2 bg-[#9E3B3B]/10 text-[#9E3B3B] rounded-lg text-sm font-medium hover:bg-[#9E3B3B]/20 transition-colors">
                              <ShoppingBag size={16} />
                              Add to Cart
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save to Profile Notice */}
            {isLoggedIn && (
              <div className="text-center mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <p className="text-emerald-700 text-sm">
                  ✓ Your results have been saved to your profile!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <QuizButton variant="secondary" onClick={handleRestart}>
                <RotateCcw size={18} className="inline mr-2" />
                Retake Quiz
              </QuizButton>

              {isLoggedIn ? (
                <QuizButton onClick={() => navigate('/profile')}>
                  <User size={18} className="inline mr-2" />
                  View Profile
                </QuizButton>
              ) : (
                <QuizButton onClick={() => navigate('/profile')}>
                  Save Results
                  <ArrowRight size={18} className="inline ml-2" />
                </QuizButton>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
