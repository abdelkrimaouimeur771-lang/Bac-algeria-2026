import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Award,
  Bell,
  Check,
  Save,
  RotateCcw,
  Sparkles,
  MapPin,
  School,
  Clock,
  Flame,
} from "lucide-react";
import { STREAMS } from "../data/algerianBacData";
import { StreamId, UserProfile } from "../types";

interface ProfileSectionProps {
  userProfile: UserProfile;
  currentStream: StreamId;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onResetProgress: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userProfile,
  currentStream,
  onUpdateProfile,
  onResetProgress,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [wilaya, setWilaya] = useState(userProfile.wilaya);
  const [school, setSchool] = useState(userProfile.school);
  const [targetAverage, setTargetAverage] = useState(userProfile.targetAverage);
  const [studyHoursGoal, setStudyHoursGoal] = useState(userProfile.studyHoursGoalPerDay);
  const [notificationSettings, setNotificationSettings] = useState(
    userProfile.notificationSettings
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // 58 Algerian Wilayas
  const algerianWilayas = [
    "01 - أدرار",
    "02 - الشلف",
    "03 - الأغواط",
    "04 - أم البواقي",
    "05 - باتنة",
    "06 - بجاية",
    "07 - بسكرة",
    "08 - بشار",
    "09 - البليدة",
    "10 - البويرة",
    "11 - تمنراست",
    "12 - تبسة",
    "13 - تلمسان",
    "14 - تيارت",
    "15 - تيزي وزو",
    "16 - الجزائر العاصمة",
    "17 - الجلفة",
    "18 - جيجل",
    "19 - سطيف",
    "20 - سعيدة",
    "21 - سكيكدة",
    "22 - سيدي بلعباس",
    "23 - عنابة",
    "24 - قالمة",
    "25 - قسنطينة",
    "26 - المدية",
    "27 - مستغانم",
    "28 - المسيلة",
    "29 - معسكر",
    "30 - ورقلة",
    "31 - وهران",
    "32 - البيض",
    "33 - إليزي",
    "34 - برج بوعريريج",
    "35 - بومرداس",
    "36 - الطارف",
    "37 - تندوف",
    "38 - تسمسيلت",
    "39 - الوادي",
    "40 - خنشلة",
    "41 - سوق أهراس",
    "42 - تيبازة",
    "43 - ميلة",
    "44 - عين الدفلى",
    "45 - النعامة",
    "46 - عين تموشنت",
    "47 - غرداية",
    "48 - غليزان",
    "49 - المغير",
    "50 - المنيعة",
    "51 - أولاد جلال",
    "52 - برج باجي مختار",
    "53 - بني عباس",
    "54 - تيميمون",
    "55 - تقرت",
    "56 - جانت",
    "57 - عين صالح",
    "58 - عين قزام",
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      wilaya,
      school,
      targetAverage: Number(targetAverage),
      studyHoursGoalPerDay: Number(studyHoursGoal),
      notificationSettings,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-right">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border-2 border-white/20 shadow-md">
            <User className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black font-['Cairo']">{userProfile.name}</h1>
            <p className="text-xs text-emerald-200">
              طالب بكالوريا دورة جوان 2026 🇩🇿 • {STREAMS.find((s) => s.id === currentStream)?.name}
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {userProfile.wilaya}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <School className="w-3.5 h-3.5 text-emerald-400" />
                {userProfile.school}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900 font-['Cairo']">
            معلومات الطالب والأهداف الدراسية
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-full animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              تم حفظ التعديلات بنجاح!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الاسم واللقب:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Wilaya */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">الولاية (الجزائر):</label>
            <select
              value={wilaya}
              onChange={(e) => setWilaya(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            >
              {algerianWilayas.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* High School */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">اسم الثانوية:</label>
            <input
              type="text"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
            />
          </div>

          {/* Target Average in Bac */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              المعدل المستهدف في البكالوريا (من 20):
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="10"
                max="20"
                value={targetAverage}
                onChange={(e) => setTargetAverage(Number(e.target.value))}
                className="w-full bg-slate-50 rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
              />
              <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-600">/ 20</span>
            </div>
            <span className="text-[10px] text-slate-600 mt-1 block">
              {targetAverage >= 18
                ? "تقدير: ممتاز (تخصصات الطب والمدارس العليا الوطنية)"
                : targetAverage >= 16
                ? "تقدير: جيد جداً"
                : targetAverage >= 14
                ? "تقدير: جيد"
                : "تقدير: قريب من الجيد"}
            </span>
          </div>

          {/* Daily study hours goal */}
          <div className="sm:col-span-2">
            <label className="text-xs font-bold text-slate-700 block mb-1">
              ساعات المراجعة المستهدفة يومياً (خارج أوقات الثانوية):
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={studyHoursGoal}
                onChange={(e) => setStudyHoursGoal(Number(e.target.value))}
                className="flex-1 accent-emerald-600"
              />
              <span className="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {studyHoursGoal} ساعات يومياً
              </span>
            </div>
          </div>
        </div>

        {/* Notifications & Reminders */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-emerald-600" />
            إعدادات التنبيهات والإشعارات الذكية:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={notificationSettings.studyReminders}
                onChange={(e) =>
                  setNotificationSettings((s) => ({ ...s, studyReminders: e.target.checked }))
                }
                className="rounded-md text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">تذكير بمواعيد المراجعة المسائية</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={notificationSettings.dailyGoals}
                onChange={(e) =>
                  setNotificationSettings((s) => ({ ...s, dailyGoals: e.target.checked }))
                }
                className="rounded-md text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">متابعة الأهداف والمهام اليومية</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={notificationSettings.quizReminders}
                onChange={(e) =>
                  setNotificationSettings((s) => ({ ...s, quizReminders: e.target.checked }))
                }
                className="rounded-md text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">تذكير بالاختبارات القصيرة الأسبوعية</span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                checked={notificationSettings.motivationalQuotes}
                onChange={(e) =>
                  setNotificationSettings((s) => ({ ...s, motivationalQuotes: e.target.checked }))
                }
                className="rounded-md text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-slate-800">رسائل تحفيزية ونصائح دراسية</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onResetProgress}
            className="text-xs text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 p-2 hover:bg-rose-50 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>تصفير سجل التقدم الدراسي</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>حفظ بيانات الحساب</span>
          </button>
        </div>
      </form>
    </div>
  );
};
