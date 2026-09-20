import React, { useState } from "react";
import {
  Bookmark,
  BookOpen,
  CheckSquare,
  FileText,
  HelpCircle,
  Trash2,
  ChevronLeft,
  DownloadCloud,
} from "lucide-react";
import { LESSONS, EXERCISES, BAC_EXAMS, QUIZZES, SUBJECTS } from "../data/algerianBacData";
import { UserProfile } from "../types";

interface FavoritesSectionProps {
  userProfile: UserProfile;
  onRemoveFavorite: (type: "lessons" | "exercises" | "bacExams" | "quizzes", id: string) => void;
  onSelectLesson: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  userProfile,
  onRemoveFavorite,
  onSelectLesson,
  onNavigate,
}) => {
  const [activeFavTab, setActiveFavTab] = useState<"lessons" | "exercises" | "bacExams" | "quizzes">("lessons");

  const favLessons = LESSONS.filter((l) => userProfile.favorites.lessons.includes(l.id));
  const favExercises = EXERCISES.filter((ex) => userProfile.favorites.exercises.includes(ex.id));
  const favBacs = BAC_EXAMS.filter((b) => userProfile.favorites.bacExams.includes(b.id));
  const favQuizzes = QUIZZES.filter((q) => userProfile.favorites.quizzes.includes(q.id));

  const totalFavs =
    favLessons.length + favExercises.length + favBacs.length + favQuizzes.length;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-rose-500 fill-rose-500" />
              المحتوى المحفوظ في المفضلة ({totalFavs})
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              وصول سريع للملخصات والتمارين المهمة التي ترغب بمراجعتها لاحقاً
            </p>
          </div>
          <span className="text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-fit">
            محتوى محفوظ محلياً
          </span>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveFavTab("lessons")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              activeFavTab === "lessons"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>الدروس والملخصات ({favLessons.length})</span>
          </button>

          <button
            onClick={() => setActiveFavTab("exercises")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              activeFavTab === "exercises"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>التمارين ({favExercises.length})</span>
          </button>

          <button
            onClick={() => setActiveFavTab("bacExams")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              activeFavTab === "bacExams"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>مواضيع البكالوريا ({favBacs.length})</span>
          </button>

          <button
            onClick={() => setActiveFavTab("quizzes")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shrink-0 ${
              activeFavTab === "quizzes"
                ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الاختبارات ({favQuizzes.length})</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Lessons */}
      {activeFavTab === "lessons" && (
        <div className="space-y-3">
          {favLessons.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد دروس محفوظة في المفضلة حالياً</h3>
              <p className="text-xs text-slate-600">يمكنك النقر على أيقونة الإشارة المرجعية داخل أي درس لإضافته هنا.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {favLessons.map((l) => {
                const subject = SUBJECTS.find((s) => s.id === l.subjectId);
                return (
                  <div
                    key={l.id}
                    className="bg-white rounded-2xl p-4 border border-slate-200 hover:border-emerald-300 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {subject?.name}
                        </span>
                        <button
                          onClick={() => onRemoveFavorite("lessons", l.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          title="إزالة من المفضلة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-1">{l.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{l.summary}</p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-600">{l.unitName}</span>
                      <button
                        onClick={() => {
                          onSelectLesson(l.id);
                          onNavigate("lessons");
                        }}
                        className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>فتح وقراءة الدرس</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Exercises */}
      {activeFavTab === "exercises" && (
        <div className="space-y-3">
          {favExercises.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد تمارين محفوظة في المفضلة</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {favExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{ex.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1 mt-1">{ex.question}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate("exercises")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                    >
                      عرض التمرين
                    </button>
                    <button
                      onClick={() => onRemoveFavorite("exercises", ex.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="إزالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Bac Exams */}
      {activeFavTab === "bacExams" && (
        <div className="space-y-3">
          {favBacs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد مواضيع بكالوريا محفوظة</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {favBacs.map((bac) => (
                <div
                  key={bac.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      بكالوريا دورة {bac.year} — {bac.session}
                    </h4>
                    <span className="text-xs text-slate-600">
                      الموضوع الأول والثاني مع التصحيح النموذجي
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate("bac_archive")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                    >
                      فتح الموضوع
                    </button>
                    <button
                      onClick={() => onRemoveFavorite("bacExams", bac.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="إزالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Quizzes */}
      {activeFavTab === "quizzes" && (
        <div className="space-y-3">
          {favQuizzes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-2">
              <HelpCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">لا توجد اختبارات محفوظة في المفضلة</h3>
            </div>
          ) : (
            <div className="space-y-3">
              {favQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between gap-4"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{quiz.title}</h4>
                    <p className="text-xs text-slate-600">{quiz.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate("quizzes")}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100"
                    >
                      بدء الاختبار
                    </button>
                    <button
                      onClick={() => onRemoveFavorite("quizzes", quiz.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                      title="إزالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
