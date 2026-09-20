import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckSquare,
  FileText,
  HelpCircle,
  Bot,
  Calendar,
  ChevronLeft,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Bookmark,
  Share2,
  Award,
} from "lucide-react";
import { STREAMS, SUBJECTS, LESSONS, EXERCISES, BAC_EXAMS, MOTIVATIONAL_QUOTES } from "../data/algerianBacData";
import { StreamId, UserProfile } from "../types";

interface HomeSectionProps {
  userProfile: UserProfile;
  currentStream: StreamId;
  onSelectStream: (streamId: StreamId) => void;
  onNavigate: (tab: string) => void;
  onSelectSubject: (subjectId: string) => void;
  onSelectLesson: (lessonId: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  userProfile,
  currentStream,
  onSelectStream,
  onNavigate,
  onSelectSubject,
  onSelectLesson,
}) => {
  // Baccalaureate Countdown to June 2026 (Exam month in Algeria)
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Typical Algerian Bac starts around early June
    const targetDate = new Date("2026-06-07T08:30:00");
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeStream = STREAMS.find((s) => s.id === currentStream) || STREAMS[0];

  // Subjects for the current stream (where coefficient > 0)
  const streamSubjects = SUBJECTS.filter(
    (subj) => (subj.coefficient[currentStream] || 0) > 0
  ).sort((a, b) => (b.coefficient[currentStream] || 0) - (a.coefficient[currentStream] || 0));

  // Calculate student overall progress percentage
  const totalRelevantLessons = LESSONS.filter((l) =>
    l.streamIds.includes(currentStream)
  ).length || 1;
  const completedCount = userProfile.completedLessons.length;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / totalRelevantLessons) * 100)
  );

  // Random tip or quote of the day
  const randomTip = MOTIVATIONAL_QUOTES[0];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Welcome & Bac Countdown */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-emerald-900/30">
        <div className="absolute top-0 left-0 -mt-8 -ml-8 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mb-8 -mr-8 w-64 h-64 rounded-full bg-teal-500/10 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>طريقك نحو شهادة البكالوريا بامتياز 🇩🇿</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-['Cairo'] tracking-tight">
              أهلاً بك، {userProfile.name} 👋
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              كل ما تحتاجه للمراجعة في مكان واحد: دروس مفصلة، ملخصات مركزة، تمارين نموذجية، حوليات البكالوريا السابقة مع التصحيح الوزاري، ورفيق ذكاء اصطناعي يشرح لك أي فكرة.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs text-slate-300 font-medium">الشعبة الحالية:</span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-xs text-white text-xs font-bold border border-white/15">
                {activeStream.name}
              </span>
              <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                المعدل المستهدف: {userProfile.targetAverage}/20
              </span>
            </div>
          </div>

          {/* Countdown Clock to Baccalaureate */}
          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-center shadow-inner">
            <div className="text-[11px] font-bold text-emerald-300 mb-2 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>العد التنازلي لبكالوريا 2026:</span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/60 rounded-xl p-2 min-w-[54px]">
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">يوم</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-2 min-w-[54px]">
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  {timeLeft.hours}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">ساعة</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-2 min-w-[54px]">
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  {timeLeft.minutes}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">دقيقة</span>
              </div>
              <div className="bg-slate-900/60 rounded-xl p-2 min-w-[54px]">
                <span className="text-lg sm:text-xl font-extrabold text-white block">
                  {timeLeft.seconds}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">ثانية</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stream Selector Pills */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            الشعب التعليمية المتاحة (انقر للتغيير):
          </span>
          <span className="text-[11px] text-slate-600">
            تتغير المواد والمعاملات تلقائياً
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {STREAMS.map((stream) => {
            const isSelected = stream.id === currentStream;
            return (
              <button
                key={stream.id}
                onClick={() => onSelectStream(stream.id)}
                className={`px-3 py-2.5 rounded-xl text-xs font-bold text-center transition-all border ${
                  isSelected
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-700/20"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {stream.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress & Quick Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Revision progress card */}
        <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                نسبة تقدمك في مراجعة الدروس
              </span>
              <span className="text-sm font-extrabold text-emerald-600">
                {progressPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 mt-2">
              <span>{completedCount} درس مراجع من أصل {totalRelevantLessons}</span>
              <span>تبقى {Math.max(0, totalRelevantLessons - completedCount)} درس</span>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-600">
              تابع تفاصيل نتائجك والمواد التي تحتاج دعماً:
            </span>
            <button
              onClick={() => onNavigate("progress")}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              عرض تقدمي الشامل
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Quick stat 1: Exercises Solved */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">التمارين المحلولة</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="my-2">
            <span className="text-2xl font-black text-slate-900 font-['Cairo']">
              {userProfile.completedExercises.length}
            </span>
            <span className="text-xs text-slate-600 mr-1">تمرين نموذجي</span>
          </div>
          <button
            onClick={() => onNavigate("exercises")}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
          >
            حل تمارين إضافية
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Quick stat 2: AI Study Partner */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 shadow-xs border border-emerald-200 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
              <Bot className="w-4 h-4 text-emerald-600" />
              مساعد الذكاء الاصطناعي
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold">
              نشط
            </span>
          </div>
          <p className="text-xs text-emerald-800 my-2 leading-relaxed">
            اطرح أي سؤال أو اطلب تلخيص أي درس في المنهاج الجزائري.
          </p>
          <button
            onClick={() => onNavigate("ai_assistant")}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
          >
            فتح المحادثة الفورية
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Primary Educational Sections Grid (Quick Access) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            أقسام المنصة التعليمية
          </h2>
          <span className="text-xs text-slate-600">اختر القسم لبدء المذاكرة</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onNavigate("lessons")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">الدروس والملخصات</h3>
            <p className="text-[11px] text-slate-600 mt-1">مرتبة حسب الوحدات</p>
          </button>

          <button
            onClick={() => onNavigate("exercises")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">تمارين وحلول</h3>
            <p className="text-[11px] text-slate-600 mt-1">حلول وسلم تنقيط</p>
          </button>

          <button
            onClick={() => onNavigate("bac_archive")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">مواضيع البكالوريا</h3>
            <p className="text-[11px] text-slate-600 mt-1">مع التصحيح الوزاري</p>
          </button>

          <button
            onClick={() => onNavigate("quizzes")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">اختبارات تفاعلية</h3>
            <p className="text-[11px] text-slate-600 mt-1">قياس مستواك ونقاطك</p>
          </button>

          <button
            onClick={() => onNavigate("ai_assistant")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">مساعد الذكاء AI</h3>
            <p className="text-[11px] text-slate-600 mt-1">شرح وتلخيص فوري</p>
          </button>

          <button
            onClick={() => onNavigate("planner")}
            className="bg-white hover:bg-emerald-50/50 p-4 rounded-2xl border border-slate-200 text-right transition-all group hover:border-emerald-300 hover:shadow-md"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">مخطط المراجعة</h3>
            <p className="text-[11px] text-slate-600 mt-1">تنظيم الوقت والمهام</p>
          </button>
        </div>
      </div>

      {/* Subjects for Current Stream with Official Coefficients */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo']">
              المواد الدراسية لـ {activeStream.shortName}
            </h2>
            <p className="text-xs text-slate-600">
              مرتبة حسب الأهمية والمعامل الوزاري المعتمد
            </p>
          </div>
          <button
            onClick={() => onNavigate("lessons")}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            عرض جميع المواد
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {streamSubjects.map((subject) => {
            const coef = subject.coefficient[currentStream];
            const subjectLessons = LESSONS.filter(
              (l) => l.subjectId === subject.id && l.streamIds.includes(currentStream)
            );
            const reviewedInSubj = subjectLessons.filter((l) =>
              userProfile.completedLessons.includes(l.id)
            ).length;
            const progress = subjectLessons.length
              ? Math.round((reviewedInSubj / subjectLessons.length) * 100)
              : 0;

            return (
              <div
                key={subject.id}
                onClick={() => {
                  onSelectSubject(subject.id);
                  onNavigate("lessons");
                }}
                className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs ${subject.color}`}>
                        {subject.name.substring(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {subject.name}
                        </h3>
                        <span className="text-[11px] text-slate-600">
                          {subject.unitsCount} وحدات • {subject.totalLessons} درساً
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-extrabold" title="معامل المادة في البكالوريا">
                      المعامل: {coef}
                    </span>
                  </div>

                  {/* Progress bar per subject */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1">
                      <span>التقدم في المادة</span>
                      <span className="font-bold text-slate-700">{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold group-hover:translate-x-[-2px] transition-transform">
                  <span>تصفح الدروس والملخصات</span>
                  <ChevronLeft className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Latest Lessons & Summaries */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              آخر الدروس والملخصات المقررة
            </h2>
            <p className="text-xs text-slate-600">
              دروس أساسية مطابقة للبرنامج الوزاري مع ملخصات سريعة
            </p>
          </div>
          <button
            onClick={() => onNavigate("lessons")}
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            المزيد من الدروس
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LESSONS.filter((l) => l.streamIds.includes(currentStream))
            .slice(0, 4)
            .map((lesson) => {
              const subject = SUBJECTS.find((s) => s.id === lesson.subjectId);
              const isDone = userProfile.completedLessons.includes(lesson.id);

              return (
                <div
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson.id)}
                  className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                        {subject?.name}
                      </span>
                      {lesson.isImportantForBac && (
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 text-[10px] font-extrabold border border-rose-200/60">
                          مهم جداً في البكالوريا 🔥
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mb-1.5 line-clamp-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {lesson.summary}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-600 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.durationMinutes} دقيقة مراجعة
                    </span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      {isDone ? "مكتمل (إعادة القراءة)" : "قراءة الدرس والملخص"}
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Motivational Daily Tip */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200/80 shadow-xs flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-900 block">
            نصيحة اليوم لطالب البكالوريا:
          </span>
          <p className="text-xs sm:text-sm text-amber-950 font-medium leading-relaxed">
            "{randomTip.quote}"
          </p>
          <span className="text-[11px] text-amber-800 block font-semibold">
            — {randomTip.author}
          </span>
        </div>
      </div>
    </div>
  );
};
