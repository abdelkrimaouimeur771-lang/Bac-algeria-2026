import React, { useState, useMemo } from "react";
import {
  FileText,
  Calendar,
  GraduationCap,
  Download,
  Bookmark,
  Printer,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  ChevronLeft,
  ExternalLink,
  Award,
} from "lucide-react";
import { BAC_EXAMS, STREAMS, SUBJECTS } from "../data/algerianBacData";
import { BacExam, StreamId, UserProfile } from "../types";

interface BacArchiveSectionProps {
  currentStream: StreamId;
  userProfile: UserProfile;
  onToggleFavorite: (bacId: string) => void;
  onToggleOffline: (bacId: string) => void;
}

export const BacArchiveSection: React.FC<BacArchiveSectionProps> = ({
  currentStream,
  userProfile,
  onToggleFavorite,
  onToggleOffline,
}) => {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedStream, setSelectedStream] = useState<StreamId>(currentStream);
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [activeTopicTab, setActiveTopicTab] = useState<"topic1" | "topic2">("topic1");
  const [showCorrection, setShowCorrection] = useState(false);
  const [copiedDownloadAlert, setCopiedDownloadAlert] = useState(false);

  const years = [2024, 2023, 2022, 2021, 2020];

  // Subjects for the selected stream
  const availableSubjects = useMemo(() => {
    return SUBJECTS.filter((s) => (s.coefficient[selectedStream] || 0) > 0);
  }, [selectedStream]);

  // Find matching exam
  const filteredExams = useMemo(() => {
    return BAC_EXAMS.filter((exam) => {
      const matchesYear = exam.year === selectedYear;
      const matchesStream = exam.streamId === selectedStream;
      const matchesSubject = selectedSubject === "all" || exam.subjectId === selectedSubject;
      return matchesYear && matchesStream && matchesSubject;
    });
  }, [selectedYear, selectedStream, selectedSubject]);

  const activeExam = filteredExams[0] || BAC_EXAMS[0];

  const handlePrintOrDownload = () => {
    window.print();
    setCopiedDownloadAlert(true);
    setTimeout(() => setCopiedDownloadAlert(false), 3000);
  };

  const isFavorite = userProfile.favorites.bacExams.includes(activeExam?.id);
  const isOffline = userProfile.offlineSavedItems.includes(activeExam?.id);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Filter Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              أرشيف مواضيع البكالوريا السابقة مع التصحيح
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              مواضيع رسمية (الموضوع الأول والثاني) مع سلالم التنقيط النموذجية المعتمدة
            </p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200/60 w-fit">
            الديوان الوطني للامتحانات والمسابقات (ONEC) 🇩🇿
          </span>
        </div>

        {/* 3 Selectors: Year, Stream, Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Year */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              اختر دورة البكالوريا (السنة):
            </label>
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {years.map((yr) => (
                <button
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedYear === yr
                      ? "bg-emerald-700 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Stream */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              اختر الشعبة:
            </label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value as StreamId)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            >
              {STREAMS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              اختر المادة:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            >
              <option value="all">جميع المواد المتاحة</option>
              {availableSubjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} (معامل {sub.coefficient[selectedStream]})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Exam Container */}
      {activeExam ? (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200 overflow-hidden">
          {/* Exam Header banner */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/20">
                    امتحان شهادة البكالوريا
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white text-xs font-bold">
                    {activeExam.session}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-['Cairo']">
                  {SUBJECTS.find((s) => s.id === activeExam.subjectId)?.name || "المادة"} —{" "}
                  {STREAMS.find((s) => s.id === activeExam.streamId)?.name}
                </h2>
              </div>

              {/* Actions: Save offline, Favorite, Print/PDF */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleOffline(activeExam.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isOffline
                      ? "bg-teal-500/20 border-teal-400 text-teal-300"
                      : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                  }`}
                  title={isOffline ? "محفوظ في الذاكرة المحلية" : "حفظ الموضوع للاستخدام بدون إنترنت"}
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onToggleFavorite(activeExam.id)}
                  className={`p-2.5 rounded-xl border transition-colors ${
                    isFavorite
                      ? "bg-rose-500/20 border-rose-400 text-rose-300"
                      : "bg-white/10 border-white/20 text-slate-300 hover:bg-white/20"
                  }`}
                  title="حفظ في المفضلة"
                >
                  <Bookmark className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
                </button>

                <button
                  onClick={handlePrintOrDownload}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة / حفظ PDF</span>
                </button>
              </div>
            </div>

            {/* Algerian Bac Dual-Topic Selector (الموضوع الأول / الموضوع الثاني) */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 p-1 bg-black/30 backdrop-blur-xs rounded-2xl border border-white/10">
                <button
                  onClick={() => setActiveTopicTab("topic1")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTopicTab === "topic1"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  الموضوع الأول (Sujet 1)
                </button>
                <button
                  onClick={() => setActiveTopicTab("topic2")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTopicTab === "topic2"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  الموضوع الثاني (Sujet 2)
                </button>
              </div>

              <button
                onClick={() => setShowCorrection(!showCorrection)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  showCorrection
                    ? "bg-amber-400 text-amber-950 font-extrabold"
                    : "bg-white/10 text-emerald-300 hover:bg-white/20 border border-emerald-400/30"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{showCorrection ? "إخفاء التصحيح النموذجي" : "عرض التصحيح وسلّم التنقيط"}</span>
              </button>
            </div>
          </div>

          {/* Exam Topic Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Topic title banner */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-extrabold text-slate-800 font-['Cairo']">
                {activeTopicTab === "topic1" ? activeExam.topic1.title : activeExam.topic2.title}
              </span>
              <span className="text-xs text-slate-600 font-bold bg-white px-3 py-1 rounded-xl border border-slate-200">
                المدة الرسمية: 3 ساعات ونصف
              </span>
            </div>

            {/* Exercises in the active topic */}
            <div className="space-y-4">
              {(activeTopicTab === "topic1" ? activeExam.topic1 : activeExam.topic2).exercises.map(
                (exercise, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-colors bg-white shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 font-['Cairo']">
                        {exercise.title}
                      </h4>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-black">
                        ({exercise.points} نقاط)
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                      {exercise.content}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* Model Solution & Official Scoring Rubric */}
            {showCorrection && (
              <div className="mt-8 pt-6 border-t-2 border-dashed border-emerald-200 space-y-4 animate-in fade-in">
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm pb-2 border-b border-emerald-200">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <span>
                      التصحيح النموذجي وسلّم التنقيط الوزاري (
                      {activeTopicTab === "topic1" ? "الموضوع الأول" : "الموضوع الثاني"})
                    </span>
                  </div>

                  <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                    {activeTopicTab === "topic1"
                      ? activeExam.topic1.solution
                      : activeExam.topic2.solution}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 leading-relaxed">
                  <strong className="text-slate-900 block mb-1">
                    توجيهات المفتشية العامة للبيداغوجيا وسلم التنقيط:
                  </strong>
                  {activeTopicTab === "topic1"
                    ? activeExam.topic1.gradingGuide
                    : activeExam.topic2.gradingGuide}
                </div>
              </div>
            )}

            {/* Mandatory Intellectual Property & Copyright Notice */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-start gap-3 bg-slate-50 p-4 rounded-2xl text-[11px] text-slate-600 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800 block mb-0.5">
                  إشعار حقوق النشر والملكية الفكرية للمحتوى التعليمي:
                </strong>
                جميع مواضيع الامتحانات الرسمية وسلالم التنقيط ملك للديوان الوطني للامتحانات والمسابقات (ONEC) ووزارة التربية الوطنية الجزائرية. يُقدم هذا المحتوى في منصة BAC DZ Hub لأغراض تعليمية وتربوية غير ربحية لدعم ومساعدة تلاميذ البكالوريا في المراجعة والتحضير الجيد.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">لا توجد مواضيع مسجلة لهذه الشعبة والمادة</h3>
          <p className="text-xs text-slate-600">اختر شعبة أو مادة أخرى من القوائم بالأعلى.</p>
        </div>
      )}
    </div>
  );
};
