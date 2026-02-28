/**
 * QuizScreen
 *
 * Shows the current quiz question and answer options.
 * Displays progress bar and Back/Next buttons.
 */

import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ProgressBar, QuestionCard, QuizButton } from './QuizComponents';
import { quizQuestions } from '../../data/skinQuizData';

export default function QuizScreen({
  currentStep,
  answers,
  totalSteps,
  onSelectAnswer,
  onBack,
  onNext
}) {
  const question = quizQuestions[currentStep];
  const hasAnswer = answers[currentStep] !== null;
  const isLastQuestion = currentStep === totalSteps - 1;

  return (
    <div className="animate-fadeIn">
      <ProgressBar currentStep={currentStep + 1} totalSteps={totalSteps} />

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-gray-100/50 border border-gray-100 mb-6">
        <div className="text-center mb-6">
          <span className="inline-block px-3 py-1 bg-[#9E3B3B]/10 text-[#9E3B3B] rounded-full text-sm font-medium mb-4">
            Question {currentStep + 1} of {totalSteps}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Playfair Display, serif' }}>
            {question.question}
          </h2>
        </div>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <QuestionCard
              key={index}
              option={option}
              isSelected={answers[currentStep] === index}
              onSelect={() => onSelectAnswer(index)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <QuizButton variant="secondary" onClick={onBack}>
          <ArrowLeft size={18} className="inline mr-2" />
          Back
        </QuizButton>

        <QuizButton onClick={onNext} disabled={!hasAnswer}>
          {isLastQuestion ? 'Get My Routine' : 'Next'}
          <ArrowRight size={18} className="inline ml-2" />
        </QuizButton>
      </div>
    </div>
  );
}
