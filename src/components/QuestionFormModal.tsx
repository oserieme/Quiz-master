import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Save,
  Loader2,
} from 'lucide-react';
import { Category, Difficulty, Question } from '../types/quiz';
import { CATEGORIES, DIFFICULTIES } from '../data/questions';
import { validateQuestion } from '../services/questionService';
import { sound } from '../utils/audio';

interface QuestionFormModalProps {
  isOpen: boolean;
  questionToEdit?: Question | null;
  onClose: () => void;
  onSave: (data: Omit<Question, 'id'>) => Promise<void>;
}

export const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isOpen,
  questionToEdit,
  onClose,
  onSave,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState<Category>('General Knowledge');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');
  const [options, setOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (questionToEdit) {
      setQuestionText(questionToEdit.question || '');
      setCategory(questionToEdit.category || 'General Knowledge');
      setDifficulty(questionToEdit.difficulty || 'Medium');
      const opts = questionToEdit.options || [];
      setOptions([
        opts[0] || '',
        opts[1] || '',
        opts[2] || '',
        opts[3] || '',
      ]);
      setCorrectAnswerIndex(
        typeof questionToEdit.correctAnswerIndex === 'number'
          ? questionToEdit.correctAnswerIndex
          : 0
      );
      setExplanation(questionToEdit.explanation || '');
    } else {
      // Reset defaults for new question
      setQuestionText('');
      setCategory('General Knowledge');
      setDifficulty('Medium');
      setOptions(['', '', '', '']);
      setCorrectAnswerIndex(0);
      setExplanation('');
    }
    setErrors({});
    setSubmitError(null);
  }, [questionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleOptionChange = (index: number, value: string) => {
    const updated: [string, string, string, string] = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const formData = {
      question: questionText,
      options,
      correctAnswerIndex,
      category,
      difficulty,
      explanation,
    };

    const validation = validateQuestion(formData);
    if (!validation.isValid) {
      sound.playIncorrect();
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      await onSave({
        question: questionText.trim(),
        options: options.map((opt) => opt.trim()),
        correctAnswerIndex,
        correctAnswer: options[correctAnswerIndex].trim(),
        category,
        difficulty,
        explanation: explanation.trim(),
      });
      sound.playCorrect();
      onClose();
    } catch (err: unknown) {
      console.error('Failed to save question:', err);
      sound.playIncorrect();
      const message =
        err instanceof Error ? err.message : 'Failed to save question to Firestore. Check permissions.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 sm:p-8 max-h-[90vh] overflow-y-auto text-slate-100 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-display text-xl font-bold text-white">
                {questionToEdit ? 'Edit Quiz Question' : 'Add New Quiz Question'}
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {questionToEdit
                ? 'Update question text, options, or metadata stored in Firestore.'
                : 'Create a question that will be saved to Firestore and served to players.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitError && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 flex items-center gap-2.5 text-xs text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{submitError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Question Prompt */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Question Prompt <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="e.g. Which planet in our solar system has the most moons?"
              className={`w-full px-4 py-3 rounded-2xl bg-slate-950/90 border text-white text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.question
                  ? 'border-rose-500 focus:ring-rose-500/30'
                  : 'border-slate-800 focus:border-amber-400 focus:ring-amber-400/20'
              }`}
            />
            {errors.question && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.question}
              </p>
            )}
          </div>

          {/* Category & Difficulty Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-400 mt-1">{errors.category}</p>
              )}
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Difficulty <span className="text-rose-400">*</span>
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
              >
                {DIFFICULTIES.map((diff) => (
                  <option key={diff} value={diff}>
                    {diff}
                  </option>
                ))}
              </select>
              {errors.difficulty && (
                <p className="text-xs text-rose-400 mt-1">{errors.difficulty}</p>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Four Answer Options & Correct Choice <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-amber-400 font-medium">
                Click radio button to mark correct answer
              </span>
            </div>

            <div className="space-y-2.5">
              {options.map((opt, idx) => {
                const label = optionLabels[idx];
                const isCorrect = correctAnswerIndex === idx;

                return (
                  <div
                    key={label}
                    onClick={() => setCorrectAnswerIndex(idx)}
                    className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCorrect
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Radio Button */}
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={isCorrect}
                      onChange={() => setCorrectAnswerIndex(idx)}
                      className="w-4 h-4 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer accent-emerald-500 shrink-0"
                    />

                    {/* Option Badge */}
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCorrect
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {label}
                    </span>

                    {/* Text Input */}
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder={`Enter answer option ${label}`}
                      className="flex-1 bg-transparent border-0 text-sm text-white placeholder-slate-500 focus:outline-none"
                    />

                    {isCorrect && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0 pr-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Correct
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {errors.options && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.options}
              </p>
            )}
            {errors.correctAnswerIndex && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.correctAnswerIndex}
              </p>
            )}
          </div>

          {/* Educational Explanation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Explanation for Correct Answer{' '}
              <span className="text-slate-500 font-normal lowercase">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="e.g. Saturn currently leads our solar system with 146 officially recognized moons."
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Revealed to the player after they submit their answer or when the round expires.
            </p>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Firestore...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{questionToEdit ? 'Save Changes' : 'Create Question'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
