import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { QUIZZES, SUBJECTS } from "../data/algerianBacData";
import { Quiz, QuizQuestion, StreamId, UserProfile } from "../types";

interface QuizzesSectionProps {
  currentStream: StreamId;
  userProfile: UserProfile;
  onSaveQuizScore: (quizId: string, score: number, total: number) => void;
}

export const QuizzesSection: React.FC<QuizzesSectionProps> = ({
  currentStream,
  userProfile,
  onSaveQuizScore,
}) => {
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(300);
  const [isCompleted, setIsCompleted] = useState(false);

  // Available quizzes for stream
  const availableQuizzes = QUIZZES.filter((q) => q.streamIds.includes(currentStream));

  // Timer effect
  useEffect(() => {
    if (!activeQuiz || isCompleted) return;

    if (secondsRemaining <= 0) {
      finishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeQuiz, isCompleted, secondsRemaining]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setSecondsRemaining(quiz.durationSeconds);
    setIsCompleted(false);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optionIdx,
    }));
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    setIsCompleted(true);

    // Calculate score
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    // Score scaled to 20
    const finalScore = Math.round((correctCount / activeQuiz.questions.length) * 20);
    onSaveQuizScore(activeQuiz.id, finalScore, 20);

    // Fire celebratory confetti if high score
    if (finalScore >= 14) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe ignore
      }
    }
  };

  // Format timer seconds
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // If a quiz is active and completed, show result view
  if (activeQuiz && isCompleted) {
    const totalQuestions = activeQuiz.questions.length;
    let correctCount = 0;
    const wrongQuestions: { question: QuizQuestion; userAnswer: number; qIdx: number }[] = [];

    activeQuiz.questions.forEach((q, idx) => {
      const userAns = selectedAnswers[idx];
      if (userAns === q.correctIndex) {
        correctCount++;
      } else {
        wrongQuestions.push({ question: q, userAnswer: userAns, qIdx: idx });
      }
    });

    const wrongCount = totalQuestions - correctCount;
    const scoreOutOf20 = Math.round((correctCount / totalQuestions) * 20);
    const successPercentage = Math.round((correctCount / totalQuestions) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-in zoom-in-95 duration-200">
        {/* Results Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center space-y-5">
          <div className="inline-flex p-3.5 rounded-full bg-emerald-100 text-emerald-700 shadow-inner">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-slate-600 block mb-1">
              نتيجة اختبار: {activeQuiz.title}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Cairo']">
              {scoreOutOf20} / 20
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 mt-1 font-semibold">
              {scoreOutOf20 >= 16
                ? "ممتاز جداً! أداء رائع يؤهلك لعلامة كاملة في البكالوريا 🏆"
                : scoreOutOf20 >= 10
                ? "جيد جداً! راجع الأسئلة التي أخطأت فيها لترسيخ المفاهيم 👍"
                : "لا بأس! كل خطأ فرصة للتعلم قبل يوم الامتحان الرسمي، أعد الاختبار وستتحسن 💪"}
            </p>
          </div>

          {/* Detailed Statistics Metrics */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-2">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-emerald-800 font-bold block mb-0.5">الإجابات الصحيحة</span>
              <span className="text-xl font-extrabold text-emerald-700">{correctCount}</span>
            </div>
            <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-rose-800 font-bold block mb-0.5">الإجابات الخاطئة</span>
              <span className="text-xl font-extrabold text-rose-700">{wrongCount}</span>
            </div>
            <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-3 text-center">
              <span className="text-xs text-blue-800 font-bold block mb-0.5">نسبة النجاح</span>
              <span className="text-xl font-extrabold text-blue-700">{successPercentage}%</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={() => startQuiz(activeQuiz)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>
            <button
              onClick={() => setActiveQuiz(null)}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
            >
              العودة لقائمة الاختبارات
            </button>
          </div>
        </div>

        {/* Detailed Review of Missed Questions with Explanations */}
        {wrongQuestions.length > 0 ? (
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              الأسئلة التي أخطأت فيها مع الشرح والتصحيح:
            </h3>

            <div className="space-y-4">
              {wrongQuestions.map(({ question, userAnswer, qIdx }, i) => (
                <div
                  key={qIdx}
                  className="bg-rose-50/40 border border-rose-200 rounded-2xl p-5 space-y-3 text-xs sm:text-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-slate-900">
                      السؤال {qIdx + 1}: {question.question}
                    </h4>
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-bold shrink-0">
                      إجابة غير صحيحة
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="text-slate-600">
                      إجابتك:{" "}
                      <span className="font-bold text-rose-700 line-through">
                        {userAnswer !== undefined ? question.options[userAnswer] : "لم تجب"}
                      </span>
                    </p>
                    <p className="text-slate-800">
                      الإجابة النموذجية الصحيحة:{" "}
                      <span className="font-extrabold text-emerald-700">
                        {question.options[question.correctIndex]}
                      </span>
                    </p>
                  </div>

                  {/* Explanation box */}
                  <div className="bg-white/90 p-3 rounded-xl border border-rose-200/60 text-xs text-slate-700 leading-relaxed font-medium">
                    <strong className="text-emerald-800 block mb-1">
                      💡 شرح القاعدة والتعليل البيداغوجي:
                    </strong>
                    {question.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center text-emerald-950 font-bold text-sm">
            🎉 لا توجد أي إجابات خاطئة! لقد أجبت على جميع الأسئلة بصورة نموذجية وصحيحة تماماً.
          </div>
        )}
      </div>
    );
  }

  // If a quiz is active and currently being taken
  if (activeQuiz && !isCompleted) {
    const question = activeQuiz.questions[currentQuestionIdx];
    const userSelected = selectedAnswers[currentQuestionIdx];
    const isLast = currentQuestionIdx === activeQuiz.questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
        {/* Quiz Top status */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 font-['Cairo']">
              {activeQuiz.title}
            </h2>
            <span className="text-xs text-slate-600">
              السؤال {currentQuestionIdx + 1} من {activeQuiz.questions.length}
            </span>
          </div>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-extrabold ${
              secondsRemaining < 60
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : "bg-slate-100 text-slate-800"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {activeQuiz.questions.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full flex-1 transition-all ${
                idx === currentQuestionIdx
                  ? "bg-emerald-600"
                  : selectedAnswers[idx] !== undefined
                  ? "bg-emerald-300"
                  : "bg-slate-200"
              }`}
            ></div>
          ))}
        </div>

        {/* Active Question Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 font-['Cairo'] leading-relaxed">
            {question.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((opt, optIdx) => {
              const isSelected = userSelected === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full text-right p-4 rounded-2xl text-xs sm:text-sm font-semibold transition-all border flex items-center justify-between ${
                    isSelected
                      ? "bg-emerald-50 border-emerald-600 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs"
                      : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800"
                  }`}
                >
                  <span className="leading-relaxed">{opt}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mr-3 ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Step buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIdx === 0}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {isLast ? (
              <button
                onClick={finishQuiz}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs"
              >
                إنهاء الاختبار وعرض النتيجة
              </button>
            ) : (
              <button
                onClick={() =>
                  setCurrentQuestionIdx((prev) =>
                    Math.min(activeQuiz.questions.length - 1, prev + 1)
                  )
                }
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1 transition-all"
              >
                <span>السؤال التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quizzes List overview
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            الاختبارات القصيرة والتفاعلية (QCM)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            اختبارات سريعة لتثبيت القوانين والمفاهيم واكتشاف الثغرات المعرفية
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl w-fit">
          نقاط فورية وشرح للأخطاء
        </span>
      </div>

      {/* Available Quizzes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableQuizzes.map((quiz) => {
          const subject = SUBJECTS.find((s) => s.id === quiz.subjectId);
          const previousScore = userProfile.quizScores[quiz.id];

          return (
            <div
              key={quiz.id}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
                    {subject?.name}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-600">
                    <Clock className="w-3.5 h-3.5" />
                    {Math.round(quiz.durationSeconds / 60)} دقائق
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5">
                  {quiz.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {quiz.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {previousScore ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      آخر نتيجة: {previousScore.score}/20
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-600">
                      {quiz.questions.length} أسئلة قصيرة
                    </span>
                  )}
                </div>

                <button
                  onClick={() => startQuiz(quiz)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>{previousScore ? "إعادة الاختبار" : "بدء الاختبار الآن"}</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
