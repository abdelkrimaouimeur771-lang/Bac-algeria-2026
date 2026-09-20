import React, { useState } from "react";
import {
  Settings,
  Plus,
  BookOpen,
  FileText,
  CreditCard,
  Bell,
  Sparkles,
  Check,
  DollarSign,
  ShieldCheck,
  X,
  Layers,
} from "lucide-react";
import { STREAMS, SUBJECTS } from "../data/algerianBacData";
import { Lesson, BacExam, NotificationItem } from "../types";

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCustomLesson: (lesson: Lesson) => void;
  onBroadcastNotification: (notif: NotificationItem) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onAddCustomLesson,
  onBroadcastNotification,
}) => {
  const [activeTab, setActiveTab] = useState<"lessons" | "bacs" | "premium" | "broadcast">("lessons");

  // Add Lesson Form State
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonSubject, setLessonSubject] = useState("math");
  const [lessonUnit, setLessonUnit] = useState("الوحدة الأولى");
  const [lessonSummary, setLessonSummary] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [isBacImportant, setIsBacImportant] = useState(true);
  const [lessonSaved, setLessonSaved] = useState(false);

  // Broadcast Notification State
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const [notifType, setNotifType] = useState<"reminder" | "achievement" | "tip" | "bac_update">("tip");
  const [notifSent, setNotifSent] = useState(false);

  // Premium Management State
  const [premiumPriceMonthly, setPremiumPriceMonthly] = useState(800); // DZD
  const [premiumPriceYearly, setPremiumPriceYearly] = useState(4500); // DZD
  const [baridiMobAccount, setBaridiMobAccount] = useState("00799999002345678912");

  if (!isOpen) return null;

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !lessonSummary.trim()) return;

    const newLesson: Lesson = {
      id: "custom_lesson_" + Date.now(),
      subjectId: lessonSubject,
      streamIds: ["sciences", "math", "tech_math", "gestion", "lettres", "langues"],
      unitId: "unit_custom",
      unitName: lessonUnit,
      title: lessonTitle.trim(),
      summary: lessonSummary.trim(),
      fullContent: lessonContent || lessonSummary,
      durationMinutes: 45,
      isImportantForBac: isBacImportant,
      keyPoints: [
        "مفهوم أساسي محرر بواسطة المشرف التربوي",
        "تطبيق مباشر متوافق مع المنهج الوزاري",
      ],
      formulas: [],
    };

    onAddCustomLesson(newLesson);
    setLessonSaved(true);
    setTimeout(() => {
      setLessonSaved(false);
      setLessonTitle("");
      setLessonSummary("");
      setLessonContent("");
    }, 2000);
  };

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMessage.trim()) return;

    const newNotif: NotificationItem = {
      id: "notif_admin_" + Date.now(),
      title: notifTitle.trim(),
      message: notifMessage.trim(),
      time: "الآن",
      read: false,
      type: notifType,
    };

    onBroadcastNotification(newNotif);
    setNotifSent(true);
    setTimeout(() => {
      setNotifSent(false);
      setNotifTitle("");
      setNotifMessage("");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-['Cairo']">
                لوحة تحكم المشرف التربوي (BAC DZ Hub Admin)
              </h2>
              <p className="text-[11px] text-slate-300">
                إدارة المحتوى، إضافة الدروس، ضبط نظام الاشتراكات Premium، وتحديثات البكالوريا
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "lessons"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>إضافة وتعديل الدروس</span>
          </button>

          <button
            onClick={() => setActiveTab("premium")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "premium"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>نظام الاشتراك BAC DZ Premium</span>
          </button>

          <button
            onClick={() => setActiveTab("broadcast")}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
              activeTab === "broadcast"
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-xl"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>بث إشعارات وتنبيهات للطلاب</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* 1. Add Lesson Form */}
          {activeTab === "lessons" && (
            <form onSubmit={handleSaveLesson} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  إضافة درس أو ملخص جديد إلى المنهاج:
                </span>
                {lessonSaved && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                    تمت إضافة الدرس بنجاح!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    عنوان الدرس:
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonTitle}
                    onChange={(e) => setLessonTitle(e.target.value)}
                    placeholder="مثلاً: النهايات وحالات عدم التعيين..."
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    المادة:
                  </label>
                  <select
                    value={lessonSubject}
                    onChange={(e) => setLessonSubject(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    اسم الوحدة الدراسية:
                  </label>
                  <input
                    type="text"
                    value={lessonUnit}
                    onChange={(e) => setLessonUnit(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBacImportant}
                      onChange={(e) => setIsBacImportant(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span>تمييز كـ "مهم جداً في البكالوريا 🔥"</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  الملخص السريع للدرس:
                </label>
                <textarea
                  rows={3}
                  required
                  value={lessonSummary}
                  onChange={(e) => setLessonSummary(e.target.value)}
                  placeholder="اكتب ملخصاً مركزاً للقوانين والمفاهيم..."
                  className="w-full bg-slate-50 rounded-xl p-3 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  نص الدرس المفصل (يدعم التنسيق):
                </label>
                <textarea
                  rows={4}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="المحتوى الكامل للدرس والأمثلة التوضيحية..."
                  className="w-full bg-slate-50 rounded-xl p-3 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>نشر الدرس في التطبيق فوراً</span>
                </button>
              </div>
            </form>
          )}

          {/* 2. Premium Subscription Module Management */}
          {activeTab === "premium" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1">
                <div className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>نظام الاشتراك BAC DZ Premium (قابل للتفعيل المستقبلي):</span>
                </div>
                <p className="leading-relaxed">
                  يتيح هذا القسم إدارة باقات الاشتراك للطلاب الراغبين في حصص زوم مباشرة مع أساتذة البكالوريا، تصحيح شخصي للمقالات الفلسفية والمسائل، ومواضيع تجريبية حصرية.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-3">
                  <span className="text-xs font-bold text-slate-800 block">
                    الباقة الشهرية (Monthly Plan):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={premiumPriceMonthly}
                      onChange={(e) => setPremiumPriceMonthly(Number(e.target.value))}
                      className="bg-white rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800 font-bold w-32"
                    />
                    <span className="text-xs font-bold text-slate-700">دج / شهر (DZD)</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    تشمل الوصول لجميع الفيديوهات وتصحيحات التمارين الذكية.
                  </p>
                </div>

                <div className="border border-emerald-200 rounded-2xl p-4 bg-emerald-50/50 space-y-3">
                  <span className="text-xs font-bold text-emerald-900 block">
                    الباقة السنوية الشاملة (Full Bac Year):
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={premiumPriceYearly}
                      onChange={(e) => setPremiumPriceYearly(Number(e.target.value))}
                      className="bg-white rounded-xl px-3 py-2 text-xs border border-emerald-300 text-slate-800 font-bold w-32"
                    />
                    <span className="text-xs font-bold text-slate-700">دج / سنة البكالوريا (DZD)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800">
                    تشمل متابعة أسبوعية، تصحيح أوراق امتحانات، ومراجعة ليلة البكالوريا.
                  </p>
                </div>
              </div>

              {/* Payment Methods in Algeria */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  طرق الدفع الجزائرية المعتمدة (بريدي موب والبطاقة الذهبية):
                </h4>
                <div>
                  <label className="text-[11px] text-slate-600 block mb-1">
                    رقم حساب RIP / بريدي موب BaridiMob لاستقبال الاشتراكات:
                  </label>
                  <input
                    type="text"
                    value={baridiMobAccount}
                    onChange={(e) => setBaridiMobAccount(e.target.value)}
                    className="w-full bg-slate-50 font-mono rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert("تم حفظ إعدادات باقات الاشتراك بنجاح!")}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  حفظ إعدادات الباقات
                </button>
              </div>
            </div>
          )}

          {/* 3. Broadcast Notification */}
          {activeTab === "broadcast" && (
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  إرسال تنبيه أو نصيحة دراسية فورية لجميع الطلاب:
                </span>
                {notifSent && (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full">
                    <Check className="w-3.5 h-3.5" />
                    تم إرسال الإشعار بنجاح لجميع المستخدمين!
                  </span>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  عنوان الإشعار:
                </label>
                <input
                  type="text"
                  required
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="مثلاً: إضافة مواضيع جديدة مع الحلول..."
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  نوع الإشعار:
                </label>
                <select
                  value={notifType}
                  onChange={(e) => setNotifType(e.target.value as any)}
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                >
                  <option value="tip">نصيحة دراسية منهجية 💡</option>
                  <option value="bac_update">تحديث مواضيع البكالوريا 🇩🇿</option>
                  <option value="reminder">تذكير بالمراجعة ⏰</option>
                  <option value="achievement">تحفيز وإنجاز 🔥</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  نص الرسالة:
                </label>
                <textarea
                  rows={3}
                  required
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  placeholder="اكتب التوجيه التربوي أو الإعلان..."
                  className="w-full bg-slate-50 rounded-xl p-3 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Bell className="w-4 h-4" />
                  <span>بث الإشعار للطلاب</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
