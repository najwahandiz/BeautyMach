/**
 * ResultsScreen
 *
 * Shows quiz results: skin type, AI summary, and recommended products.
 * Each product has Add to Cart. Also has Retake Quiz and Shop buttons.
 */

import { useNavigate } from 'react-router-dom';
import { Sparkles, RotateCcw, ChevronRight } from 'lucide-react';
import { getAIProvider } from '../../services/aiRecommendation';
import { skinTypeInfo, routineSteps } from '../../data/skinQuizData';
import RecommendedProductCard from './RecommendedProductCard';

export default function ResultsScreen({
  quizResult,
  recommendations,
  productsData,
  dispatch,
  onRestart
}) {
  const navigate = useNavigate();
  const skinInfo = skinTypeInfo[quizResult.skinType];
  const skinTypeBorderClass = skinInfo?.color?.replace('text-', 'border-')?.split(' ')[2] || 'border-gray-200';

  // Find product by ID from Redux store
  const getProductById = (id) => productsData?.find((p) => p.id === id) || null;

  return (
    <div className="animate-fadeIn">
      {/* Skin Type Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          <div className={`text-7xl sm:text-8xl p-4 bg-white rounded-3xl shadow-xl border-2 ${skinTypeBorderClass}`}>
            {skinInfo?.emoji}
          </div>
        </div>

        <p className="text-gray-500 uppercase tracking-wider text-sm mb-2">Your skin type is</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          {skinInfo?.title}
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
            <p className="text-gray-700 leading-relaxed text-lg">{recommendations.summary}</p>
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

            const product = getProductById(rec.productId);

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

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:border-[#9E3B3B] hover:text-[#9E3B3B] transition-all duration-300"
        >
          <RotateCcw size={18} />
          Retake Quiz
        </button>

        <button
          onClick={() => navigate('/catalogue')}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#9E3B3B] to-[#b54949] text-white font-semibold rounded-xl shadow-lg shadow-[#9E3B3B]/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          Shop Products
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
