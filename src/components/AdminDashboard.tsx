import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Database,
  ArrowLeft,
  Sparkles,
  Layers,
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Award,
  BookOpen,
  Loader2,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Category, Difficulty, Question } from '../types/quiz';
import { CATEGORIES, DIFFICULTIES } from '../data/questions';
import {
  fetchAllQuestionsFromFirestore,
  addQuestionToFirestore,
  updateQuestionInFirestore,
  deleteQuestionFromFirestore,
  seedQuestionsToFirestore,
} from '../services/questionService';
import { PRIMARY_ADMIN_EMAIL } from '../services/userService';
import { QuestionFormModal } from './QuestionFormModal';
import { sound } from '../utils/audio';

interface AdminDashboardProps {
  onBackToHome: () => void;
  onStartQuizWithCategory?: (category: Category) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToHome,
  onStartQuizWithCategory,
}) => {
  const { user, userProfile, isAdmin, loading: authLoading, signInWithGoogle } = useAuth();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);

  // Delete confirmation modal state
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedProgress, setSeedProgress] = useState<string | null>(null);

  // Fetch questions from Firestore
  const loadQuestions = useCallback(async () => {
    setLoadingQuestions(true);
    setErrorMessage(null);
    try {
      const data = await fetchAllQuestionsFromFirestore();
      setQuestions(data);
    } catch (err: unknown) {
      console.error('Failed to load questions from Firestore:', err);
      setErrorMessage('Could not load questions from Firestore. Please verify Firestore connectivity.');
    } finally {
      setLoadingQuestions(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadQuestions();
    }
  }, [isAdmin, loadQuestions]);

  // Handle Add / Edit
  const handleOpenAdd = () => {
    sound.playSelect();
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    sound.playSelect();
    setEditingQuestion(q);
    setIsModalOpen(true);
  };

  const handleSaveQuestion = async (data: Omit<Question, 'id'>) => {
    if (editingQuestion) {
      await updateQuestionInFirestore(editingQuestion.id, data, user?.uid);
      setSuccessMessage('Question updated successfully in Firestore.');
    } else {
      await addQuestionToFirestore(data, user?.uid);
      setSuccessMessage('New question added to Firestore successfully.');
    }
    await loadQuestions();
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    setIsDeleting(true);
    try {
      await deleteQuestionFromFirestore(questionToDelete.id);
      sound.playIncorrect();
      setSuccessMessage(`Question "${questionToDelete.question.slice(0, 30)}..." deleted from Firestore.`);
      setQuestionToDelete(null);
      await loadQuestions();
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      console.error('Delete error:', err);
      setErrorMessage('Could not delete question. Check administrator permissions.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Seed
  const handleSeedQuestions = async () => {
    if (isSeeding) return;
    sound.playSelect();
    setIsSeeding(true);
    setSeedProgress('Starting batch upload of question bank into Firestore...');
    try {
      const res = await seedQuestionsToFirestore(user?.uid, (curr, total) => {
        setSeedProgress(`Uploading questions: ${curr} of ${total} written...`);
      });
      sound.playCorrect();
      setSuccessMessage(
        `Successfully seeded ${res.seeded} questions into Firestore! (${res.skipped} questions already existed).`
      );
      await loadQuestions();
    } catch (err: unknown) {
      console.error('Seeding error:', err);
      setErrorMessage('Failed to seed questions. Ensure your account has admin write permissions.');
    } finally {
      setIsSeeding(false);
      setSeedProgress(null);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  // Filtered and searched questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Category filter
      if (selectedCategory !== 'All' && q.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && q.difficulty !== selectedDifficulty) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const inQuestion = q.question.toLowerCase().includes(query);
        const inOptions = q.options.some((opt) => opt.toLowerCase().includes(query));
        const inExplanation = (q.explanation || '').toLowerCase().includes(query);
        return inQuestion || inOptions || inExplanation;
      }
      return true;
    });
  }, [questions, selectedCategory, selectedDifficulty, searchQuery]);

  // If still checking authentication
  if (authLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 text-amber-400 animate-spin mb-4" />
        <p className="text-slate-300 font-medium">Verifying administrator credentials...</p>
      </div>
    );
  }

  // Requirement 9 & 10: Access Guard for Admin Dashboard
  if (!user || !isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 animate-fadeIn text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-rose-500/40 shadow-2xl backdrop-blur-md">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white mb-3">
            Access Denied: Administrator Area
          </h2>

          <p className="text-slate-300 text-sm leading-relaxed mb-6">
            {user
              ? `The signed-in account (${user.email}) does not have administrative permissions to manage quiz questions.`
              : 'You must sign in with an authorized Google Administrator account to access the Question Management dashboard.'}
          </p>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-400 space-y-2 mb-6">
            <p className="font-semibold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>How Administrator Access Works:</span>
            </p>
            <p>
              • Designated administrator accounts (such as <code className="text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded">{PRIMARY_ADMIN_EMAIL}</code>) have full authorization to add, edit, and delete questions stored in Firestore.
            </p>
            <p>
              • Standard players can play quizzes and view public leaderboards, but cannot modify quiz questions.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {!user ? (
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                Sign In with Google Admin Account
              </button>
            ) : null}

            <button
              type="button"
              onClick={onBackToHome}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Quiz Game</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-fadeIn">
      {/* Top Banner Navigation & Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playSelect();
              onBackToHome();
            }}
            className="p-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-2 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden xs:inline">Back to Game</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Admin Portal
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {user.email}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
              Question Management
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Seed Question Bank Button */}
          <button
            type="button"
            onClick={handleSeedQuestions}
            disabled={isSeeding}
            title="Batch-upload initial curated questions to Firestore if database is empty"
            className="px-3.5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
            ) : (
              <Database className="w-4 h-4 text-amber-400" />
            )}
            <span>{isSeeding ? 'Seeding Firestore...' : 'Seed Question Bank'}</span>
          </button>

          {/* Add Question Button */}
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-2 animate-fadeIn">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {seedProgress && (
        <div className="mt-4 p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-2 animate-fadeIn">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
          <span>{seedProgress}</span>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-6">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Questions in Firestore
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-white tabular-nums">
            {questions.length}
          </div>
          <span className="text-[11px] text-slate-500">Live in cloud database</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Categories Covered
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-amber-400 tabular-nums">
            {CATEGORIES.length}
          </div>
          <span className="text-[11px] text-slate-500">GK, Sci, Hist, Geo, Tech, Sports</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Filtered Match
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-cyan-400 tabular-nums">
            {filteredQuestions.length}
          </div>
          <span className="text-[11px] text-slate-500">Visible in table below</span>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/20">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            Difficulty Levels
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-400 tabular-nums">
            3
          </div>
          <span className="text-[11px] text-slate-500">Easy, Medium, Hard</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/90 border border-slate-800 mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-lg">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by text, answer choices, or explanation..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2.5">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Difficulty Filter */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="appearance-none pl-3.5 pr-8 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadQuestions}
            disabled={loadingQuestions}
            title="Refresh questions from Firestore"
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${loadingQuestions ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Questions List */}
      {loadingQuestions ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Fetching questions from Firestore...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400">
          <Database className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display text-lg font-bold text-white mb-1">
            No Questions Found
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
            {questions.length === 0
              ? 'Your Firestore database currently has no stored questions. Click "Seed Question Bank" to populate the 90+ verified questions or "Add Question" to create one.'
              : 'No questions matched your current search or filter criteria. Try adjusting the category, difficulty, or search keyword.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {questions.length === 0 ? (
              <button
                type="button"
                onClick={handleSeedQuestions}
                disabled={isSeeding}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Seed Question Bank
              </button>
            ) : null}
            <button
              type="button"
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Add Question
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuestions.map((q, index) => {
            const difficultyBadgeStyles =
              q.difficulty === 'Easy'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : q.difficulty === 'Medium'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

            return (
              <div
                key={q.id || index}
                className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700/80 transition-all shadow-lg shadow-black/20"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 tabular-nums">
                      #{index + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {q.category}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${difficultyBadgeStyles}`}
                    >
                      {q.difficulty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(q)}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                      title="Edit Question"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        sound.playSelect();
                        setQuestionToDelete(q);
                      }}
                      className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                      title="Delete Question"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Delete</span>
                    </button>
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="font-display text-base sm:text-lg font-bold text-white mb-3 leading-snug">
                  {q.question}
                </h3>

                {/* Four Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctAnswerIndex;
                    const letter = ['A', 'B', 'C', 'D'][optIdx];
                    return (
                      <div
                        key={optIdx}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs ${
                          isCorrect
                            ? 'bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 font-semibold'
                            : 'bg-slate-950/70 border border-slate-800 text-slate-300'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500 text-slate-950'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="truncate flex-1">{opt}</span>
                        {isCorrect && (
                          <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5 shrink-0">
                            <CheckCircle2 className="w-3 h-3" />
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-2">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-300">Explanation: </strong>
                      {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {questionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="font-display text-lg font-bold text-white mb-2">
              Delete Quiz Question?
            </h3>

            <p className="text-xs text-slate-300 mb-3">
              Are you sure you want to permanently delete this question from Firestore? This action cannot be undone.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 italic mb-5 line-clamp-3">
              "{questionToDelete.question}"
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setQuestionToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 cursor-pointer flex items-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Question</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Question Form Modal */}
      <QuestionFormModal
        isOpen={isModalOpen}
        questionToEdit={editingQuestion}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuestion}
      />
    </div>
  );
};
