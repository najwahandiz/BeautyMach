/**
 * SkinQuiz - Route entry page & main container
 *
 * Handles all logic: Redux, state, effects, navigation.
 * Renders UI-only subcomponents based on viewMode.
 *
 * Views: intro | quiz | loading | results | error
 */

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../features/products/productsThunks';
import {
  saveQuizResultThunk,
  saveRecommendationsThunk,
  clearQuizDataThunk
} from '../../features/user/userThunks';
import { selectQuizResult, selectRecommendations } from '../../features/user/userSlice';
import { analyzeAnswers } from '../../utils/analyzeQuizResult';
import { getRecommendations } from '../../services/aiRecommendation';
import { quizQuestions } from '../../data/skinQuizData';

import IntroScreen from '../../components/quiz/IntroScreen';
import QuizScreen from '../../components/quiz/QuizScreen';
import ResultsScreen from '../../components/quiz/ResultsScreen';
import LoadingScreen from '../../components/quiz/LoadingScreen';
import ErrorScreen from '../../components/quiz/ErrorScreen';

export default function SkinQuiz() {
  // Redux
  const dispatch = useDispatch();
  const { productsData } = useSelector((state) => state.products);
  const savedQuizResult = useSelector(selectQuizResult);
  const savedRecommendations = useSelector(selectRecommendations);

  // Local State
  const [viewMode, setViewMode] = useState('intro');
  const [currentStep, setCurrentStep] = useState(-1);
  const [answers, setAnswers] = useState(Array(quizQuestions.length).fill(null));
  const [quizResult, setQuizResult] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = quizQuestions.length;

  // Effects
  useEffect(() => {
    if (savedQuizResult && savedRecommendations) {
      setQuizResult(savedQuizResult);
      setRecommendations(savedRecommendations);
      setViewMode('results');
    }
  }, [savedQuizResult, savedRecommendations]);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handlers
  const handleStart = () => {
    setViewMode('quiz');
    setCurrentStep(0);
  };

  const handleSelectAnswer = (optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else if (currentStep === 0) {
      setViewMode('intro');
      setCurrentStep(-1);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = analyzeAnswers(answers);
      setQuizResult(result);
      dispatch(saveQuizResultThunk(result));

      let products = productsData;
      if (!products || products.length === 0) {
        const fetchResult = await dispatch(fetchProducts());
        products = fetchResult.payload || [];
      }

      if (!products || products.length === 0) {
        setError('Unable to load products. Please check your internet connection and try again.');
        setIsLoading(false);
        return;
      }

      const recs = await getRecommendations(result, products);
      setRecommendations(recs);
      dispatch(saveRecommendationsThunk(recs));

      setViewMode('results');
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    dispatch(clearQuizDataThunk());
    setCurrentStep(-1);
    setAnswers(Array(quizQuestions.length).fill(null));
    setQuizResult(null);
    setRecommendations(null);
    setError(null);
    setViewMode('intro');
  };

  // Decide which screen to show (one at a time)
  const showIntro = viewMode === 'intro';
  const showQuiz = viewMode === 'quiz' && currentStep >= 0 && currentStep < totalSteps && !isLoading;
  const showResults = viewMode === 'results' && quizResult && recommendations && !isLoading && !error;

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-b from-white via-[#fffaf5] to-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
        {showIntro && <IntroScreen onStart={handleStart} />}
        {showQuiz && (
          <QuizScreen
            currentStep={currentStep}
            answers={answers}
            totalSteps={totalSteps}
            onSelectAnswer={handleSelectAnswer}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {isLoading && <LoadingScreen />}
        {error && <ErrorScreen error={error} onRetry={handleRestart} />}
        {showResults && (
          <ResultsScreen
            quizResult={quizResult}
            recommendations={recommendations}
            productsData={productsData}
            dispatch={dispatch}
            onRestart={handleRestart}
          />
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}
