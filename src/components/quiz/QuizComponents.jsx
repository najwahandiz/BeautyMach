/**
 * Reusable Quiz Components
 * - ProgressBar: Shows quiz progress
 * - QuestionCard: Displays each answer option
 * - QuizButton: Styled button for navigation
 */

/* ============ Progress Bar ============ */
export function ProgressBar({ currentStep, totalSteps }) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8">
      {/* Step indicator text */}
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-[#9E3B3B]">
          {Math.round(progress)}% Complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#9E3B3B] to-[#ea7b7b] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ============ Question Card (Answer Option) ============ */
export function QuestionCard({ option, isSelected, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`
        w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all duration-300
        ${isSelected
          ? 'border-[#9E3B3B] bg-[#9E3B3B]/5 shadow-md'
          : 'border-gray-200 bg-white hover:border-[#ea7b7b] hover:shadow-sm'
        }
      `}
    >
      <div className="flex items-center gap-4">
        {/* Radio circle indicator */}
        <div
          className={`
            w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
            ${isSelected
              ? 'border-[#9E3B3B] bg-[#9E3B3B]'
              : 'border-gray-300'
            }
          `}
        >
          {isSelected && (
            <div className="w-2 h-2 bg-white rounded-full" />
          )}
        </div>

        {/* Option text */}
        <span className={`font-medium ${isSelected ? 'text-[#9E3B3B]' : 'text-gray-700'}`}>
          {option}
        </span>
      </div>
    </button>
  );
}

/* ============ Quiz Navigation Button ============ */
export function QuizButton({ children, onClick, disabled, variant = 'primary' }) {
  const baseStyles = "px-8 py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#9E3B3B] text-white hover:bg-[#7d2f2f] shadow-lg shadow-[#9E3B3B]/20 disabled:hover:bg-[#9E3B3B]",
    secondary: "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}

/* ============ Result Card ============ */
export function ResultCard({ title, description, icon }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

