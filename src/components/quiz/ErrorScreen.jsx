/**
 * ErrorScreen
 *
 * Shown when something goes wrong (e.g. API error, no products).
 * Has a "Try Again" button to restart the quiz.
 */

import { RotateCcw } from 'lucide-react';
import { QuizButton } from './QuizComponents';

export default function ErrorScreen({ error, onRetry }) {
  return (
    <div className="text-center py-20 animate-fadeIn">
      <div className="text-6xl mb-6">😕</div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
        Oops! Something went wrong
      </h2>
      <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">{error}</p>
      <QuizButton onClick={onRetry}>
        <RotateCcw size={18} className="inline mr-2" />
        Try Again
      </QuizButton>
    </div>
  );
}
