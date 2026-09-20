import React, { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Flame,
  BookOpen,
  CheckSquare,
  Plus,
  Zap,
} from "lucide-react";
import { LESSONS, EXERCISES, SUBJECTS } from "../data/algerianBacData";
import { StreamId, UserProfile } from "../types";

interface ProgressSectionProps {
  userProfile: UserProfile;
  currentStream: StreamId;
  onLogStudyMinutes: (minutes: number) => void;
  onNavigate: (tab: string) => void;
}

export const ProgressSection: React.FC<ProgressSectionProps> = ({
  userProfile,
  currentStream,
  onLogStudyMinutes,
  onNavigate,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [loggedMinutesInput, setLoggedMinutesInput] = useState(60);

  // Relevant lessons and exercises for stream
  const relevantLessons = LESSONS.filter((l) => l.streamIds.includes(currentStream));
  const relevantExercises = EXERCISES.filter((ex) => ex.streamIds.includes(currentStream));

  const totalLessons = relevantLessons.length || 1;
  const completedLessonsCount = userProfile.completedLessons.length;
  const lessonProgressPercent = Math.min(
    100,
    Math.round((completedLessonsCount / totalLessons) * 100)
  );

  const totalExercises = relevantExercises.length || 1;
  const solvedExercisesCount = userProfile.completedExercises.length;
  const exerciseProgressPercent = Math.min(
    100,
    Math.round((solvedExercisesCount / totalExercises) * 100)
  );

  // Quiz performance
  const quizScoresList = Object.values(userProfile.quizScores);
  const averageQuizScore =
    quizScoresList.length > 0
      ? (
          quizScoresList.reduce((acc, q) => acc + q.score, 0) / quizScoresList.length
        ).toFixed(1)
      : "0";

  // Study hours
  const totalHours = (userProfile.totalStudyMinutes / 60).toFixed(1);

  // Smart Subject Diagnostic: Which subjects need more review?
  const streamSubjects = SUBJECTS.filter((s) => (s.coefficient[currentStream] || 0) > 0);
  const subjectsDiagnostics = streamSubjects.map((s) => {
    const sLessons = relevantLessons.filter((l) => l.subjectId === s.id);
    const sDone = sLessons.filter((l) => userProfile.completedLessons.includes(l.id)).length;
    const completionPct = sLessons.length ? Math.round((sDone / sLessons.length) * 100) : 0;
    const coef = s.coefficient[currentStream] || 1;
    return {
      subject: s,
      completionPct,
      coef,
      needsAttention: completionPct < 50 && coef >= 4,
    };
  }).sort((a, b) => a.completionPct - b.completionPct);

  // Achievements
  const achievements = [
    {
      title: "بداية موفقة",
      desc: "إتمام أول درس في البكالوريا",
      unlocked: completedLessonsCount >= 1,
      icon: "🌱",
    },
    {
      title: "منضبط الأسبوع",
      desc: "الحفاظ على سلسلة مراجعة لأكثر من 5 أيام",
      unlocked: userProfile.studyStreakDays >= 5,
      icon: "🔥",
    },
    {
      title: "محلل التمارين",
      desc: "حل تمرينين نموذجيين على الأقل",
      unlocked: solvedExercisesCount >= 2,
      icon: "📐",
    },
    {
      title: "نجم البكالوريا",
      desc: "إحراز 16/20 أو أكثر في أي اختبار قصير",
      unlocked: quizScoresList.some((q) => q.score >= 16),
      icon: "⭐",
    },
  ];

  const handleLogTime = (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedMinutesInput > 0) {
      onLogStudyMinutes(Number(loggedMinutesInput));
      setShowLogModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Overview Top Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            لوحة تقدم الطالب والتشخيص الدراسي
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            تتبع دقيق لمعدل إنجازك في الدروس، التمارين، وساعات المذاكرة الفعلية
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>تسجيل جلسة مذاكرة جديدة</span>
        </button>
      </div>

      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Lessons % */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">نسبة الدروس المراجعة</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-['Cairo']">
              {lessonProgressPercent}%
            </span>
            <span className="text-xs text-slate-600 mr-1 block">
              {completedLessonsCount} من {totalLessons} درس
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${lessonProgressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 2: Exercises Solved */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">التمارين المحلولة</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-['Cairo']">
              {solvedExercisesCount}
            </span>
            <span className="text-xs text-slate-600 mr-1 block">
              من أصل {totalExercises} تمرين نموذجي
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${exerciseProgressPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Metric 3: Quiz Average */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">متوسط نتائج الاختبارات</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-['Cairo']">
              {averageQuizScore}
            </span>
            <span className="text-xs text-slate-600 mr-1 block">من أصل 20 نقطة</span>
          </div>
          <span className="text-[11px] text-amber-700 font-bold">
            {quizScoresList.length} اختبار تم اجتيازه
          </span>
        </div>

        {/* Metric 4: Study Hours & Streak */}
        <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">ساعات المذاكرة الموثقة</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-3xl font-black text-slate-900 font-['Cairo']">
              {totalHours}
            </span>
            <span className="text-xs text-slate-600 mr-1 block">ساعة مراجعة فعلية</span>
          </div>
          <span className="text-[11px] text-orange-700 font-bold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            سلسلة {userProfile.studyStreakDays} أيام متواصلة
          </span>
        </div>
      </div>

      {/* Smart Diagnostic Box: المواد التي تحتاج إلى مراجعة أكثر */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              التشخيص الذكي: المواد التي تحتاج إلى تركيز ومراجعة أكثر
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              نظام تحليل يأخذ في الاعتبار معامل المادة في البكالوريا ونسبة تقدمك الحالية فيها
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {subjectsDiagnostics.map(({ subject, completionPct, coef, needsAttention }) => (
            <div
              key={subject.id}
              className={`p-4 rounded-2xl border transition-all ${
                needsAttention
                  ? "bg-rose-50/50 border-rose-200"
                  : "bg-slate-50/60 border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    {subject.name}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-slate-200 text-slate-800">
                    معامل {coef}
                  </span>
                  {needsAttention && (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-rose-200 text-rose-800 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      أولوية قصوى
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700">{completionPct}%</span>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all ${
                    needsAttention ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                  style={{ width: `${completionPct}%` }}
                ></div>
              </div>

              <p className="text-[11px] text-slate-600 leading-relaxed">
                {needsAttention
                  ? "المادة ذات معامل عالٍ ونسبة المراجعة منخفضة. ننصح بجدولة جلستي مراجعة لها هذا الأسبوع."
                  : "تقدمك متوازن في هذه المادة، واصل حل التمارين النموذجية لتثبيت العلامة."}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements Section */}
      <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-600" />
          الأوسمة والإنجازات التحفيزية 🇩🇿
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center space-y-2 transition-all ${
                ach.unlocked
                  ? "bg-emerald-50/60 border-emerald-300 shadow-2xs"
                  : "bg-slate-50 border-slate-200 opacity-60 grayscale"
              }`}
            >
              <div className="text-3xl">{ach.icon}</div>
              <h4 className="text-xs font-extrabold text-slate-900">{ach.title}</h4>
              <p className="text-[10px] text-slate-600 leading-relaxed">{ach.desc}</p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                  ach.unlocked
                    ? "bg-emerald-200 text-emerald-900"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {ach.unlocked ? "مكتمل ✓" : "قيد الإنجاز"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Log Study Session Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Cairo']">
                تسجيل ساعات المذاكرة
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLogTime} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  المدة التي ذاكرتها بالدقائق:
                </label>
                <input
                  type="number"
                  min={10}
                  step={5}
                  value={loggedMinutesInput}
                  onChange={(e) => setLoggedMinutesInput(Number(e.target.value))}
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
                <div className="flex items-center gap-2 mt-2">
                  {[30, 45, 60, 90, 120].map((mins) => (
                    <button
                      type="button"
                      key={mins}
                      onClick={() => setLoggedMinutesInput(mins)}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-bold text-slate-700"
                    >
                      {mins} د
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  إضافة لسجل تقدمي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
