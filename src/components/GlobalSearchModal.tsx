import React, { useState, useMemo } from "react";
import { Search, BookOpen, CheckSquare, FileText, HelpCircle, X, ChevronLeft } from "lucide-react";
import { LESSONS, EXERCISES, BAC_EXAMS, QUIZZES, SUBJECTS } from "../data/algerianBacData";
import { StreamId } from "../types";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStream: StreamId;
  onSelectLesson: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  currentStream,
  onSelectLesson,
  onNavigate,
}) => {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) return null;

    const q = query.toLowerCase();

    // Lessons
    const matchedLessons = LESSONS.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.summary.toLowerCase().includes(q) ||
        l.keyPoints.some((kp) => kp.toLowerCase().includes(q))
    );

    // Exercises
    const matchedExercises = EXERCISES.filter(
      (ex) => ex.title.toLowerCase().includes(q) || ex.question.toLowerCase().includes(q)
    );

    // Bac Exams
    const matchedBacs = BAC_EXAMS.filter(
      (b) =>
        b.session.toLowerCase().includes(q) ||
        b.year.toString().includes(q) ||
        b.topic1.title.toLowerCase().includes(q)
    );

    // Quizzes
    const matchedQuizzes = QUIZZES.filter(
      (quiz) => quiz.title.toLowerCase().includes(q) || quiz.description.toLowerCase().includes(q)
    );

    return {
      lessons: matchedLessons,
      exercises: matchedExercises,
      bacs: matchedBacs,
      quizzes: matchedQuizzes,
      total:
        matchedLessons.length +
        matchedExercises.length +
        matchedBacs.length +
        matchedQuizzes.length,
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95">
        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-emerald-600 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في جميع الدروس، التمارين، مواضيع البكالوريا، أو القوانين..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-hidden text-slate-800 placeholder:text-slate-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            إغلاق (Esc)
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-slate-100">
          {!results ? (
            <div className="py-8 text-center text-xs text-slate-500 space-y-2">
              <p>اكتب حرفين على الأقل للبحث السريع في المنصة</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-[11px] text-slate-400">اقتراحات شائعة:</span>
                {["المتتاليات", "الدوال الأسية", "الناقلية", "الحرب الباردة", "الاستقصاء"].map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setQuery(s)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs transition-colors"
                    >
                      {s}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : results.total === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              لم نعثر على نتائج مطابقة لـ "{query}"
            </div>
          ) : (
            <div className="space-y-4">
              {/* Lessons Results */}
              {results.lessons.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    الدروس والملخصات ({results.lessons.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.lessons.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onSelectLesson(l.id);
                          onNavigate("lessons");
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-right"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{l.title}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{l.summary}</span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exercises Results */}
              {results.exercises.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                    التمارين والحلول ({results.exercises.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        onClick={() => {
                          onNavigate("exercises");
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-right"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{ex.title}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{ex.question}</span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bac Exams Results */}
              {results.bacs.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-600" />
                    مواضيع البكالوريا ({results.bacs.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.bacs.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => {
                          onNavigate("bac_archive");
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-right"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">
                            بكالوريا دورة {b.year} — {b.session}
                          </span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {b.topic1.title}
                          </span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quizzes Results */}
              {results.quizzes.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    الاختبارات ({results.quizzes.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.quizzes.map((q) => (
                      <div
                        key={q.id}
                        onClick={() => {
                          onNavigate("quizzes");
                          onClose();
                        }}
                        className="p-2.5 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between transition-colors text-right"
                      >
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">{q.title}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{q.description}</span>
                        </div>
                        <ChevronLeft className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
