/**
 * Skin Type Quiz Page
 * 
 * A multi-step quiz that determines user's skin type and provides
 * AI-powered personalized skincare recommendations.
 * 
 * KEY BEHAVIOR:
 * - If user already completed quiz → show saved results automatically
 * - If not → start fresh quiz
 * - Restart button clears results and allows retaking
 * 
 * Features:
 * - Step-by-step questions
 * - Progress indicator
 * - Skin type analysis
 * - AI-powered product recommendations
 * - Add to Cart functionality
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../features/products/productsThunks';
import { saveQuizResultThunk, saveRecommendationsThunk, clearQuizDataThunk } from '../../features/user/userThunks';
import { selectIsLoggedIn, selectQuizResult, selectRecommendations } from '../../features/user/userSlice';
import { addToCart, openCart } from '../../features/cart/cartSlice';
import { selectIsInCart } from '../../features/cart/cartSelectors';
import { ProgressBar, QuestionCard, QuizButton } from '../../components/quiz/QuizComponents';
import { analyzeAnswers } from '../../utils/analyzeQuizResult';
import { getRecommendations, getAIProvider } from '../../services/aiRecommendation';
import { 
  Sparkles, ArrowLeft, ArrowRight, RotateCcw, Loader2, 
  ShoppingBag, User, Check, ChevronRight, Star, Droplets 
} from 'lucide-react';
import { useToast } from '../../components/Toast';

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
  dry: { title: "Dry Skin", emoji: "🏜️", color: "bg-amber-50 text-amber-700 border-amber-200", gradient: "from-amber-500 to-orange-500" },
  oily: { title: "Oily Skin", emoji: "✨", color: "bg-emerald-50 text-emerald-700 border-emerald-200", gradient: "from-emerald-500 to-teal-500" },
  combination: { title: "Combination Skin", emoji: "⚖️", color: "bg-blue-50 text-blue-700 border-blue-200", gradient: "from-blue-500 to-indigo-500" },
  sensitive: { title: "Sensitive Skin", emoji: "🌸", color: "bg-pink-50 text-pink-700 border-pink-200", gradient: "from-pink-500 to-rose-500" },
  normal: { title: "Normal Skin", emoji: "🌟", color: "bg-purple-50 text-purple-700 border-purple-200", gradient: "from-purple-500 to-violet-500" }
};

/* ============ Routine Step Labels ============ */
const routineSteps = {
  cleanser: { label: "Cleanser", icon: "🧴", step: 1, description: "Start your routine" },
  serum: { label: "Serum", icon: "💧", step: 2, description: "Target your concerns" },
  moisturizer: { label: "Moisturizer", icon: "🧴", step: 3, description: "Lock in hydration" },
  sunscreen: { label: "Sunscreen", icon: "☀️", step: 4, description: "Protect your skin" }
};

/* ============ Product Card Component with Add to Cart ============ */
function RecommendedProductCard({ stepKey, stepInfo, recommendation, product, dispatch }) {
  const { showToast } = useToast();
  const isInCart = useSelector(state => selectIsInCart(state, product?.id));
  
  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({
        id: product.id,
        name: product.name || recommendation.name,
        price: product.price || 0,
        imageUrl: product.imageUrl || product.image || '',
        category: stepKey
      }));
      showToast(`${product.name || recommendation.name} added to cart!`, 'success');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-[#9E3B3B]/10 transition-all duration-500">
      {/* Step Header */}
      <div className="bg-gradient-to-r from-[#9E3B3B]/5 to-[#ea7b7b]/5 px-5 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] text-white flex items-center justify-center text-sm font-bold shadow-lg">
            {stepInfo.step}
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{stepInfo.description}</p>
            <p className="font-semibold text-gray-800 flex items-center gap-2">
              <span>{stepInfo.icon}</span>
              {stepInfo.label}
            </p>
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Product Image */}
          {product?.imageUrl || product?.image ? (
            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <img 
                src={product.imageUrl || product.image} 
                alt={recommendation.name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#9E3B3B]/10 to-[#ea7b7b]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-8 h-8 text-[#9E3B3B]/40" />
            </div>
          )}

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-lg mb-1 truncate group-hover:text-[#9E3B3B] transition-colors">
              {recommendation.name}
            </h3>
            <p className="text-sm text-gray-500 line-clamp-2 mb-3 leading-relaxed">
              {recommendation.reason}
            </p>
          </div>
        </div>

        {/* Price & Add to Cart */}
        {product && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-2xl font-bold text-[#9E3B3B]">
                ${product.price?.toFixed(2) || '0.00'}
              </p>
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={isInCart}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                isInCart 
                  ? 'bg-emerald-100 text-emerald-700 cursor-default' 
                  : 'bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white hover:shadow-lg hover:shadow-[#9E3B3B]/30 hover:scale-105'
              }`}
            >
              {isInCart ? (
                <>
                  <Check size={16} />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ Main Quiz Component ============ */
export default function SkinQuiz() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { productsData } = useSelector((state) => state.products);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  
  // Get saved data from Redux (persisted in localStorage)
  const savedQuizResult = useSelector(selectQuizResult);
  const savedRecommendations = useSelector(selectRecommendations);

  // Quiz state
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
  
  // Results state (local for new quiz, falls back to saved)
  const [quizResult, setQuizResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // View mode: 'intro', 'quiz', 'results'
  const [viewMode, setViewMode] = useState('intro');

  const totalSteps = quizQuestions.length;
  const hasAnswer = currentStep >= 0 && currentStep < totalSteps && answers[currentStep] !== null;

  // Check if user already has saved results
  useEffect(() => {
    if (isLoggedIn && savedQuizResult && savedRecommendations) {
      // User already completed quiz - show results directly
      setQuizResult(savedQuizResult);
      setRecommendations(savedRecommendations);
      setViewMode('results');
    }
  }, [isLoggedIn, savedQuizResult, savedRecommendations]);

  // Fetch products on mount
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
        
        // Ensure we have products
        let products = productsData;
        
        if (!products || products.length === 0) {
          console.log('⚠️ No products in store, fetching fresh...');
          const fetchResult = await dispatch(fetchProducts());
          products = fetchResult.payload || [];
        }
        
        if (!products || products.length === 0) {
          setError('Unable to load products. Please check your internet connection and try again.');
          setIsLoading(false);
          return;
        }
        
        // Get AI recommendations
        console.log('📦 Sending products to AI:', products.length);
        const recs = await getRecommendations(result, products);
        setRecommendations(recs);
        
        // Save recommendations to user profile (if logged in)
        if (isLoggedIn) {
          dispatch(saveRecommendationsThunk(recs));
        }
        
        // Show results
        setViewMode('results');
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
      setViewMode('intro');
      setCurrentStep(-1);
    }
  };

  /* --- Restart quiz (clear everything) --- */
  const handleRestart = () => {
    // Clear Redux state (and localStorage)
    if (isLoggedIn) {
      dispatch(clearQuizDataThunk());
    }
    
    // Reset local state
    setCurrentStep(-1);
    setAnswers(Array(quizQuestions.length).fill(null));
    setQuizResult(null);
    setRecommendations(null);
    setError(null);
    setViewMode('intro');
  };

  /* --- Start quiz --- */
  const handleStart = () => {
    setViewMode('quiz');
    setCurrentStep(0);
  };

  // Find full product details from recommendations
  const getProductDetails = (productId) => {
    return productsData?.find(p => p.id === productId) || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#fffaf5] to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">

        {/* ============ INTRO SCREEN ============ */}
        {viewMode === 'intro' && (
          <div className="text-center animate-fadeIn">
            {/* Hero Section */}
            <div className="mb-10">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-2xl shadow-[#9E3B3B]/30 rotate-3">
                  <Sparkles size={42} className="text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Star size={16} className="text-[#9E3B3B] fill-current" />
                </div>
              </div>
              
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                Discover Your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#9E3B3B] to-[#ea7b7b]">
                  Perfect Routine
                </span>
              </h1>
              <p className="text-gray-500 text-lg max-w-md mx-auto leading-relaxed">
                Take our expert-designed quiz and get AI-powered skincare recommendations tailored just for you.
              </p>
            </div>

            {/* Features Card */}
            <div className="bg-white rounded-3xl p-8 mb-10 shadow-xl shadow-gray-100/50 border border-gray-100">
              <h3 className="font-semibold text-gray-800 mb-6 text-lg">What you'll discover</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
                    <Droplets size={24} className="text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold">Your Skin Type</p>
                  <p className="text-sm text-gray-500 mt-1">Dry, oily, combination & more</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold">AI Analysis</p>
                  <p className="text-sm text-gray-500 mt-1">Powered by smart technology</p>
                </div>
                <div className="p-5 bg-gradient-to-br from-[#9E3B3B]/5 to-[#ea7b7b]/5 rounded-2xl border border-[#9E3B3B]/10 hover:scale-105 transition-transform">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-white" />
                  </div>
                  <p className="text-gray-700 font-semibold">Custom Routine</p>
                  <p className="text-sm text-gray-500 mt-1">Products picked for you</p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button 
              onClick={handleStart}
              className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-bold rounded-2xl shadow-xl shadow-[#9E3B3B]/30 hover:shadow-2xl hover:shadow-[#9E3B3B]/40 hover:scale-105 transition-all duration-300 text-lg"
            >
              Start Your Journey
              <ArrowRight size={22} />
            </button>
            <p className="text-gray-400 text-sm mt-5">✨ Only 5 questions • Takes 2 minutes</p>
          </div>
        )}

        {/* ============ QUESTION SCREENS ============ */}
        {viewMode === 'quiz' && currentStep >= 0 && currentStep < totalSteps && !isLoading && (
          <div className="animate-fadeIn">
            <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />

            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/50 border border-gray-100 mb-6">
              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 bg-[#9E3B3B]/10 text-[#9E3B3B] rounded-full text-sm font-medium mb-4">
                  Question {currentStep + 1} of {totalSteps}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {quizQuestions[currentStep].question}
                </h2>
              </div>

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
          <div className="text-center py-20 animate-fadeIn">
            <div className="relative inline-block mb-8">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] flex items-center justify-center shadow-2xl shadow-[#9E3B3B]/30">
                <Loader2 size={42} className="text-white animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#9E3B3B] to-[#ea7b7b] animate-ping opacity-20"></div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Analyzing Your Skin...
            </h2>
            <p className="text-gray-500 text-lg">
              Our AI is creating your personalized routine
            </p>
            <div className="flex justify-center gap-2 mt-8">
              <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
              <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
              <div className="w-3 h-3 bg-[#9E3B3B] rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
            </div>
          </div>
        )}

        {/* ============ ERROR SCREEN ============ */}
        {error && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-6xl mb-6">😕</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
              Oops! Something went wrong
            </h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">{error}</p>
            <QuizButton onClick={handleRestart}>
              <RotateCcw size={18} className="inline mr-2" />
              Try Again
            </QuizButton>
          </div>
        )}

        {/* ============ RESULTS SCREEN ============ */}
        {viewMode === 'results' && quizResult && recommendations && !isLoading && !error && (
          <div className="animate-fadeIn">
            {/* Skin Type Header */}
            <div className="text-center mb-10">
              <div className="relative inline-block mb-6">
                <div className={`text-7xl sm:text-8xl p-4 bg-white rounded-3xl shadow-xl border-2 ${skinTypeInfo[quizResult.skinType]?.color.replace('text-', 'border-').split(' ')[2]}`}>
                  {skinTypeInfo[quizResult.skinType]?.emoji}
                </div>
              </div>
              
              <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">Your skin type is</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                {skinTypeInfo[quizResult.skinType]?.title}
              </h1>
              
              {/* Concerns */}
              {quizResult.concerns && quizResult.concerns.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-6">
                  {quizResult.concerns.map((concern, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white border border-[#9E3B3B]/20 rounded-full text-sm font-medium text-gray-700 shadow-sm"
                    >
                      {concern}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* AI Summary */}
            <div className="bg-gradient-to-r from-[#9E3B3B]/10 via-white to-[#ea7b7b]/10 rounded-3xl p-6 mb-10 border border-[#9E3B3B]/20 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-md flex-shrink-0">
                  <Sparkles size={24} className="text-[#9E3B3B]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#9E3B3B] mb-1 uppercase tracking-wider">
                    AI Analysis · {getAIProvider()}
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {recommendations.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Routine */}
            <div className="mb-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
                  Your Personalized Routine
                </h2>
                <p className="text-gray-500 mt-2">Products selected specifically for your skin</p>
              </div>

              <div className="grid gap-5">
                {Object.entries(routineSteps).map(([key, stepInfo]) => {
                  const rec = recommendations.routine[key];
                  if (!rec) return null;

                  const product = getProductDetails(rec.productId);

                  return (
                    <RecommendedProductCard
                      key={key}
                      stepKey={key}
                      stepInfo={stepInfo}
                      recommendation={rec}
                      product={product}
                      dispatch={dispatch}
                    />
                  );
                })}
              </div>
            </div>

            {/* Save Notice */}
            {isLoggedIn && (
              <div className="text-center mb-8 p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-center gap-2 text-emerald-700">
                  <Check size={20} />
                  <span className="font-medium">Your results have been saved to your profile!</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleRestart}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all duration-300"
              >
                <RotateCcw size={18} />
                Retake Quiz
              </button>

              <button 
                onClick={() => navigate('/profile')}
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg shadow-[#9E3B3B]/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <User size={18} />
                View Profile
                <ChevronRight size={18} />
              </button>
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
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
