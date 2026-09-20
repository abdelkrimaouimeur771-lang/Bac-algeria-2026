import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  Download,
  CheckCircle,
  Share2,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  FileText,
  Clock,
  ArrowRight,
  Filter,
  Flame,
  Copy,
  Check,
} from "lucide-react";
import { LESSONS, SUBJECTS } from "../data/algerianBacData";
import { Lesson, StreamId, UserProfile } from "../types";

interface LessonsSectionProps {
  currentStream: StreamId;
  selectedSubjectId?: string;
  onSubjectChange: (id: string) => void;
  userProfile: UserProfile;
  onToggleFavorite: (lessonId: string) => void;
  onToggleOffline: (lessonId: string) => void;
  onToggleCompleted: (lessonId: string) => void;
  selectedLessonId?: string;
  onSelectLesson: (lessonId?: string) => void;
}

export const LessonsSection: React.FC<LessonsSectionProps> = ({
  currentStream,
  selectedSubjectId,
  onSubjectChange,
  userProfile,
  onToggleFavorite,
  onToggleOffline,
  onToggleCompleted,
  selectedLessonId,
  onSelectLesson,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUnit, setActiveUnit] = useState<string>("all");
  const [activeViewMode, setActiveViewMode] = useState<"summary" | "full">("full");
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Available subjects for this stream
  const availableSubjects = useMemo(() => {
    return SUBJECTS.filter((s) => (s.coefficient[currentStream] || 0) > 0);
  }, [currentStream]);

  // Set default subject if none selected
  const activeSubjectId = selectedSubjectId || availableSubjects[0]?.id || "math";
  const activeSubject = SUBJECTS.find((s) => s.id === activeSubjectId) || availableSubjects[0];

  // Lessons for current subject & stream
  const subjectLessons = useMemo(() => {
    return LESSONS.filter(
      (l) => l.subjectId === activeSubjectId && l.streamIds.includes(currentStream)
    );
  }, [activeSubjectId, currentStream]);

  // Extract units for filtering
  const units = useMemo(() => {
    const map = new Map<string, string>();
    subjectLessons.forEach((l) => {
      map.set(l.unitId, l.unitName);
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [subjectLessons]);

  // Filter lessons by search query and unit
  const filteredLessons = useMemo(() => {
    return subjectLessons.filter((l) => {
      const matchesSearch =
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.keyPoints.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesUnit = activeUnit === "all" || l.unitId === activeUnit;
      return matchesSearch && matchesUnit;
    });
  }, [subjectLessons, searchQuery, activeUnit]);

  // Active open lesson
  const currentLesson = useMemo(() => {
    return LESSONS.find((l) => l.id === selectedLessonId);
  }, [selectedLessonId]);

  const handleCopySummary = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  // If a lesson is selected, show the reader view
  if (currentLesson) {
    const isFavorite = userProfile.favorites.lessons.includes(currentLesson.id);
    const isOffline = userProfile.offlineSavedItems.includes(currentLesson.id);
    const isCompleted = userProfile.completedLessons.includes(currentLesson.id);

    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Top bar with back button & actions */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onSelectLesson(undefined)}
            className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/70 px-3 py-2 rounded-xl transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لقائمة دروس {activeSubject?.name}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Mark as completed */}
            <button
              onClick={() => onToggleCompleted(currentLesson.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                isCompleted
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isCompleted ? "تمت المراجعة ✓" : "تحديد كمكتمل"}</span>
            </button>

            {/* Save Offline */}
            <button
              onClick={() => onToggleOffline(currentLesson.id)}
              className={`p-2 rounded-xl border transition-all ${
                isOffline
                  ? "bg-teal-50 border-teal-300 text-teal-700"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              title={isOffline ? "محفوظ للقراءة بدون إنترنت" : "حفظ للقراءة دون اتصال"}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Favorite */}
            <button
              onClick={() => onToggleFavorite(currentLesson.id)}
              className={`p-2 rounded-xl border transition-all ${
                isFavorite
                  ? "bg-rose-50 border-rose-300 text-rose-600"
                  : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
              }`}
              title={isFavorite ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-rose-500" : ""}`} />
            </button>
          </div>
        </div>

        {/* Lesson Header Banner */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-md bg-white/10 text-emerald-300 text-xs font-bold">
              {currentLesson.unitName}
            </span>
            {currentLesson.isImportantForBac && (
              <span className="px-3 py-1 rounded-md bg-rose-500/30 text-rose-200 border border-rose-400/30 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                سؤال متكرر في البكالوريا
              </span>
            )}
            {isOffline && (
              <span className="px-2.5 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[11px] font-medium">
                متاح للقراءة أوفلاين
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black font-['Cairo'] leading-tight mb-2">
            {currentLesson.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-300 pt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              المدة المقترحة: {currentLesson.durationMinutes} دقيقة
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              المادة: {activeSubject?.name}
            </span>
          </div>

          {/* View Mode Toggle: Summary vs Full Lesson */}
          <div className="mt-6 flex items-center gap-2 p-1 bg-black/30 backdrop-blur-xs rounded-xl w-fit border border-white/10">
            <button
              onClick={() => setActiveViewMode("full")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === "full"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              قراءة الدرس الكامل
            </button>
            <button
              onClick={() => setActiveViewMode("summary")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeViewMode === "summary"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              الملخص والنقاط المفتاحية
            </button>
          </div>
        </div>

        {/* Content View */}
        {activeViewMode === "summary" ? (
          <div className="space-y-4">
            {/* Quick summary card */}
            <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  الملخص السريع للدرس
                </h2>
                <button
                  onClick={() => handleCopySummary(currentLesson.summary + "\n\n" + currentLesson.keyPoints.join("\n"))}
                  className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold hover:underline"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ الملخص</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                {currentLesson.summary}
              </p>

              {/* Key formulas if any */}
              {currentLesson.formulas && currentLesson.formulas.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-800">
                    القوانين والعلاقات الرياضية الواجب حفظها:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentLesson.formulas.map((formula, idx) => (
                      <div
                        key={idx}
                        className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 text-xs font-mono font-bold text-emerald-900 text-center"
                        dir="ltr"
                      >
                        {formula}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Essential key points */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-bold text-slate-800">
                  أهم النقاط والمفاهيم الأساسية:
                </h3>
                <ul className="space-y-2">
                  {currentLesson.keyPoints.map((pt, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Full Lesson Content View */
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
            <div className="prose prose-slate max-w-none text-right">
              {currentLesson.fullContent.split("\n\n").map((block, idx) => {
                if (block.startsWith("### ")) {
                  return (
                    <h3
                      key={idx}
                      className="text-base sm:text-lg font-bold text-emerald-950 mt-6 mb-3 pb-2 border-b border-emerald-100"
                    >
                      {block.replace("### ", "")}
                    </h3>
                  );
                } else if (block.startsWith("1. ") || block.startsWith("- ")) {
                  return (
                    <div
                      key={idx}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 my-3 text-xs sm:text-sm leading-relaxed whitespace-pre-line text-slate-800"
                    >
                      {block}
                    </div>
                  );
                } else {
                  return (
                    <p
                      key={idx}
                      className="text-xs sm:text-sm text-slate-700 leading-relaxed my-2 whitespace-pre-line"
                    >
                      {block}
                    </p>
                  );
                }
              })}
            </div>

            {/* Bottom complete action */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-600">
                هل فهمت جميع جوانب هذا الدرس؟ يمكنك اختبار معلوماتك الآن.
              </span>
              <button
                onClick={() => onToggleCompleted(currentLesson.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isCompleted
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-900 text-white hover:bg-emerald-700"
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>{isCompleted ? "تمت المراجعة بنجاح ✓" : "تأكيد مراجعة الدرس"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Subject and Lessons List View
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Subject Tabs Header */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            الدروس والملخصات المقررة
          </h1>
          <span className="text-xs text-slate-600">
            شعبة: {SUBJECTS.find((s) => s.id === activeSubjectId)?.name}
          </span>
        </div>

        {/* Subjects horizontal pill scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {availableSubjects.map((subject) => {
            const isSelected = subject.id === activeSubjectId;
            const coef = subject.coefficient[currentStream];
            return (
              <button
                key={subject.id}
                onClick={() => {
                  onSubjectChange(subject.id);
                  setActiveUnit("all");
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isSelected
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                <span>{subject.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  معامل {coef}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن درس أو قانون أو مفهوم..."
            className="w-full bg-slate-50 rounded-xl pr-9 pl-4 py-2 text-xs border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Units filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-600 shrink-0">الوحدة:</span>
          <button
            onClick={() => setActiveUnit("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
              activeUnit === "all"
                ? "bg-slate-800 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            }`}
          >
            جميع الوحدات
          </button>
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => setActiveUnit(u.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shrink-0 ${
                activeUnit === u.id
                  ? "bg-slate-800 text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {u.name}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      {filteredLessons.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">لا توجد نتائج مطابقة لبحثك</h3>
          <p className="text-xs text-slate-600 max-w-sm mx-auto">
            جرب كلمات بحث أخرى، أو اختر وحدة مختلفة من القائمة بالأعلى.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredLessons.map((lesson) => {
            const isFavorite = userProfile.favorites.lessons.includes(lesson.id);
            const isCompleted = userProfile.completedLessons.includes(lesson.id);
            const isOffline = userProfile.offlineSavedItems.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {lesson.unitName}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {lesson.isImportantForBac && (
                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          مهم في البكالوريا 🔥
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(lesson.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="حفظ في المفضلة"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${isFavorite ? "text-rose-500 fill-rose-500" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  <h3
                    onClick={() => onSelectLesson(lesson.id)}
                    className="text-sm sm:text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors mb-2"
                  >
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {lesson.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.durationMinutes} دقيقة
                    </span>
                    {isOffline && (
                      <span className="text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-md font-semibold">
                        أوفلاين
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleCompleted(lesson.id)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition-all ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isCompleted ? "تمت المراجعة ✓" : "تحديد كمكتمل"}
                    </button>
                    <button
                      onClick={() => onSelectLesson(lesson.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>قراءة</span>
                      <ChevronLeft className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
