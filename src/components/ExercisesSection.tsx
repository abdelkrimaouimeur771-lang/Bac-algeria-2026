import React, { useState, useMemo } from "react";
import {
  CheckSquare,
  Search,
  Filter,
  Eye,
  EyeOff,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronDown,
  Bookmark,
  Award,
  PenTool,
  Save,
  Check,
} from "lucide-react";
import { EXERCISES, SUBJECTS, LESSONS } from "../data/algerianBacData";
import { Exercise, StreamId, UserProfile } from "../types";

interface ExercisesSectionProps {
  currentStream: StreamId;
  userProfile: UserProfile;
  onToggleCompleted: (exerciseId: string) => void;
  onToggleFavorite: (exerciseId: string) => void;
}

export const ExercisesSection: React.FC<ExercisesSectionProps> = ({
  currentStream,
  userProfile,
  onToggleCompleted,
  onToggleFavorite,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [studentNotes, setStudentNotes] = useState<Record<string, string>>({});
  const [savedNoteNotification, setSavedNoteNotification] = useState<string | null>(null);

  // Available subjects for this stream
  const availableSubjects = useMemo(() => {
    return SUBJECTS.filter((s) => (s.coefficient[currentStream] || 0) > 0);
  }, [currentStream]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return EXERCISES.filter((ex) => {
      const matchesStream = ex.streamIds.includes(currentStream);
      const matchesSubject = selectedSubject === "all" || ex.subjectId === selectedSubject;
      const matchesDifficulty =
        selectedDifficulty === "all" || ex.difficulty === selectedDifficulty;
      const matchesSearch =
        ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStream && matchesSubject && matchesDifficulty && matchesSearch;
    });
  }, [currentStream, selectedSubject, selectedDifficulty, searchQuery]);

  const toggleSolution = (id: string) => {
    setRevealedSolutions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleHints = (id: string) => {
    setRevealedHints((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveStudentNote = (exId: string) => {
    setSavedNoteNotification(exId);
    setTimeout(() => setSavedNoteNotification(null), 2000);
  };

  const getDifficultyBadge = (diff: Exercise["difficulty"]) => {
    switch (diff) {
      case "easy":
        return <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">مستوى سهل ⭐</span>;
      case "medium":
        return <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold">مستوى متوسط ⭐⭐</span>;
      case "hard":
        return <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">مستوى متقدم ⭐⭐⭐</span>;
      case "bac":
        return <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200">نمط بكالوريا رسمي 🇩🇿</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              بنك التمارين والحلول النموذجية
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              تمارين منتقاة بعناية مع سلم تنقيط وزاري وشرح دقيق للأخطاء الشائعة
            </p>
          </div>
          <div className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/80 w-fit">
            حللت <strong className="text-emerald-700">{userProfile.completedExercises.length}</strong> من أصل{" "}
            <strong>{filteredExercises.length}</strong> تمرين
          </div>
        </div>

        {/* Filter controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Subject selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">المادة الدراسية:</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            >
              <option value="all">جميع المواد</option>
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">مستوى الصعوبة:</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            >
              <option value="all">جميع المستويات</option>
              <option value="easy">سهل ⭐</option>
              <option value="medium">متوسط ⭐⭐</option>
              <option value="hard">متقدم ⭐⭐⭐</option>
              <option value="bac">نمط بكالوريا رسمي 🇩🇿</option>
            </select>
          </div>

          {/* Search bar */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">البحث في التمارين:</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالاسم أو الفكرة..."
                className="w-full bg-slate-50 rounded-xl pr-8 pl-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      {filteredExercises.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">لا توجد تمارين تطابق هذه المعايير</h3>
          <p className="text-xs text-slate-600">جرب تغيير المادة أو مستوى الصعوبة لعرض التمارين المتاحة.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredExercises.map((exercise) => {
            const subject = SUBJECTS.find((s) => s.id === exercise.subjectId);
            const lesson = LESSONS.find((l) => l.id === exercise.lessonId);
            const isSolved = userProfile.completedExercises.includes(exercise.id);
            const isFavorite = userProfile.favorites.exercises.includes(exercise.id);
            const isSolutionOpen = !!revealedSolutions[exercise.id];
            const isHintsOpen = !!revealedHints[exercise.id];

            return (
              <div
                key={exercise.id}
                className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden hover:border-emerald-300 transition-all"
              >
                {/* Exercise Header */}
                <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold">
                      {subject?.name}
                    </span>
                    {getDifficultyBadge(exercise.difficulty)}
                    {lesson && (
                      <span className="text-[11px] text-slate-600">
                        الدرس: {lesson.title}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleFavorite(exercise.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isFavorite
                          ? "bg-rose-50 border-rose-200 text-rose-600"
                          : "bg-white border-slate-200 text-slate-400 hover:text-rose-500"
                      }`}
                      title="حفظ في المفضلة"
                    >
                      <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
                    </button>

                    <button
                      onClick={() => onToggleCompleted(exercise.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isSolved
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isSolved ? "تم الحل بنجاح ✓" : "تحديد كمحلول"}</span>
                    </button>
                  </div>
                </div>

                {/* Exercise Content */}
                <div className="p-5 sm:p-6 space-y-4">
                  <h3 className="text-base font-bold text-slate-900 font-['Cairo']">
                    {exercise.title}
                  </h3>

                  {/* Question body */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium font-sans">
                    {exercise.question}
                  </div>

                  {/* Hints Accordion if available */}
                  {exercise.hints && exercise.hints.length > 0 && (
                    <div>
                      <button
                        onClick={() => toggleHints(exercise.id)}
                        className="flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 transition-colors"
                      >
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>{isHintsOpen ? "إخفاء التلميحات المساعدة" : "عرض تلميحات مساعدة للحل (Hint)"}</span>
                      </button>

                      {isHintsOpen && (
                        <div className="mt-2 bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1 text-xs text-amber-900 animate-in fade-in">
                          {exercise.hints.map((h, i) => (
                            <p key={i} className="flex items-start gap-2">
                              <span>•</span>
                              <span>{h}</span>
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Student Scratchpad / Note area */}
                  <div className="pt-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                      <PenTool className="w-3.5 h-3.5 text-emerald-600" />
                      مسودة محاولة الطالب (اكتب خطواتك هنا قبل الكشف عن الحل):
                    </label>
                    <div className="relative">
                      <textarea
                        rows={2}
                        value={studentNotes[exercise.id] || ""}
                        onChange={(e) =>
                          setStudentNotes((prev) => ({ ...prev, [exercise.id]: e.target.value }))
                        }
                        placeholder="جرّب كتابة القوانين أو النتيجة التي توصلت إليها..."
                        className="w-full bg-slate-50 rounded-xl p-3 text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 placeholder:text-slate-400"
                      />
                      {studentNotes[exercise.id] && (
                        <button
                          onClick={() => handleSaveStudentNote(exercise.id)}
                          className="absolute left-2.5 bottom-2.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs hover:bg-emerald-700 transition-colors"
                        >
                          {savedNoteNotification === exercise.id ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>حُفظت المحاولة!</span>
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              <span>حفظ المسودة</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Reveal Solution Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => toggleSolution(exercise.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        isSolutionOpen
                          ? "bg-slate-800 text-white"
                          : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                      }`}
                    >
                      {isSolutionOpen ? (
                        <>
                          <EyeOff className="w-4 h-4" />
                          <span>إخفاء الحل النموذجي</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>عرض الإجابة والحل النموذجي المفصل</span>
                        </>
                      )}
                    </button>

                    <span className="text-[11px] text-slate-600 hidden sm:inline">
                      مع سلم التنقيط وشرح الأخطاء
                    </span>
                  </div>

                  {/* Revealed Solution Box */}
                  {isSolutionOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4 animate-in fade-in">
                      {/* Solution Text */}
                      <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-5 text-xs sm:text-sm text-slate-800 space-y-3 leading-relaxed">
                        <div className="flex items-center gap-2 text-emerald-900 font-extrabold pb-2 border-b border-emerald-200/60">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>الحل المفصل المطابق لمعايير البكالوريا:</span>
                        </div>
                        <div className="whitespace-pre-line">{exercise.solution}</div>
                      </div>

                      {/* Grading Scale */}
                      {exercise.gradingScale && exercise.gradingScale.length > 0 && (
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                          <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
                            <Award className="w-4 h-4 text-emerald-600" />
                            سلم التنقيط الوزاري المعتمد للتمرين:
                          </h4>
                          <div className="divide-y divide-slate-200/60 text-xs">
                            {exercise.gradingScale.map((grade, idx) => (
                              <div key={idx} className="py-2 flex items-center justify-between gap-4">
                                <span className="text-slate-700 leading-relaxed">{grade.step}</span>
                                <span className="font-extrabold text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded-md whitespace-nowrap">
                                  +{grade.points} ن
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Common Mistakes Breakdown (Crucial requirement from prompt) */}
                      {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
                        <div className="bg-rose-50/80 border border-rose-200 rounded-2xl p-4 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-900">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>شرح الأخطاء الشائعة وطرق تجنب الوقوع فيها في البكالوريا:</span>
                          </div>
                          <ul className="space-y-1.5 text-xs text-rose-950 font-medium">
                            {exercise.commonMistakes.map((mistake, idx) => (
                              <li key={idx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-rose-600 font-bold shrink-0">⚠</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
