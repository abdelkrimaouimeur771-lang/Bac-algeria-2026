import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  CheckSquare,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Trash2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { PlannerTask, TimetableEntry, StreamId, UserProfile } from "../types";
import { SUBJECTS } from "../data/algerianBacData";

interface StudyPlannerSectionProps {
  currentStream: StreamId;
  userProfile: UserProfile;
  tasks: PlannerTask[];
  onAddTask: (task: PlannerTask) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  timetable: TimetableEntry[];
}

export const StudyPlannerSection: React.FC<StudyPlannerSectionProps> = ({
  currentStream,
  userProfile,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  timetable,
}) => {
  const [activePlannerTab, setActivePlannerTab] = useState<"tasks" | "timetable" | "pomodoro">("tasks");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskSubject, setNewTaskSubject] = useState("math");
  const [newTaskDuration, setNewTaskDuration] = useState(60);
  const [newTaskTimeSlot, setNewTaskTimeSlot] = useState("18:00 - 19:00");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("high");

  // Pomodoro Focus Timer state
  const [pomodoroMode, setPomodoroMode] = useState<"focus" | "break">("focus");
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  const daysOfWeekNames = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // Pomodoro tick effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
      if (pomodoroMode === "focus") {
        setCompletedSessions((c) => c + 1);
        setPomodoroMode("break");
        setPomodoroSeconds(5 * 60);
      } else {
        setPomodoroMode("focus");
        setPomodoroSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds, pomodoroMode]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const task: PlannerTask = {
      id: "task_" + Date.now(),
      title: newTaskTitle.trim(),
      subjectId: newTaskSubject,
      date: new Date().toISOString().split("T")[0],
      timeSlot: newTaskTimeSlot,
      durationMinutes: Number(newTaskDuration),
      completed: false,
      priority: newTaskPriority,
    };

    onAddTask(task);
    setNewTaskTitle("");
    setShowAddTaskModal(false);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const availableSubjects = SUBJECTS.filter(
    (s) => (s.coefficient[currentStream] || 0) > 0
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Tabs */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 font-['Cairo'] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              مخطط المراجعة وتنظيم وقت البكالوريا
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              مهام يومية، جدول أسبوعي مدروس حسب المعاملات، ومؤقت تركيز بومودورو
            </p>
          </div>

          <button
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مهمة مراجعة جديدة</span>
          </button>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActivePlannerTab("tasks")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePlannerTab === "tasks"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            قائمة مهام اليوم ({tasks.filter((t) => !t.completed).length} متبقية)
          </button>
          <button
            onClick={() => setActivePlannerTab("timetable")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activePlannerTab === "timetable"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الجدول الأسبوعي المقترح
          </button>
          <button
            onClick={() => setActivePlannerTab("pomodoro")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activePlannerTab === "pomodoro"
                ? "bg-white text-emerald-800 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            <span>مؤقت التركيز (Pomodoro)</span>
          </button>
        </div>
      </div>

      {/* Tab Content 1: Tasks Checklist */}
      {activePlannerTab === "tasks" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-extrabold text-slate-900 font-['Cairo']">
                مهام المراجعة لليوم (
                {new Date().toLocaleDateString("ar-DZ", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
                )
              </h2>
              <span className="text-xs text-slate-600">
                أنجزت {tasks.filter((t) => t.completed).length} من أصل {tasks.length} مهام
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="text-center py-10 text-slate-600 space-y-2">
                <p className="text-xs">لا توجد مهام مضافة حالياً لهذا اليوم.</p>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="text-xs text-emerald-700 font-bold hover:underline"
                >
                  أضف مهمتك الأولى الآن!
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const subject = SUBJECTS.find((s) => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        task.completed
                          ? "bg-emerald-50/40 border-emerald-200/80 text-slate-600"
                          : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onToggleTask(task.id)}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                            task.completed
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 hover:border-emerald-600 bg-white"
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs sm:text-sm font-bold ${
                                task.completed
                                  ? "line-through text-slate-600"
                                  : "text-slate-900"
                              }`}
                            >
                              {task.title}
                            </span>
                            {task.priority === "high" && (
                              <span className="px-1.5 py-0.2 rounded-md bg-rose-100 text-rose-700 text-[10px] font-extrabold">
                                أولوية قصوى
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-600 mt-1">
                            <span className="font-semibold text-emerald-800">
                              {subject?.name}
                            </span>
                            <span>•</span>
                            <span>{task.timeSlot}</span>
                            <span>•</span>
                            <span>{task.durationMinutes} دقيقة</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors"
                        title="حذف المهمة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 2: Timetable */}
      {activePlannerTab === "timetable" && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 font-['Cairo']">
                الجدول الأسبوعي المتوازن لطلاب شعبة البكالوريا
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                موزع وفق معاملات المواد مع تركيز عطلة نهاية الأسبوع للمسائل الشاملة
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              توازن بين الحفظ والفهم
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {timetable.map((entry) => {
              const subject = SUBJECTS.find((s) => s.id === entry.subjectId);
              const dayName = daysOfWeekNames[entry.dayOfWeek];
              return (
                <div
                  key={entry.id}
                  className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 font-['Cairo']">
                      {dayName}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                      {entry.startTime} - {entry.endTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        subject?.color || "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {subject?.name}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {entry.note}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content 3: Pomodoro Focus Timer */}
      {activePlannerTab === "pomodoro" && (
        <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 text-center space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block">
              تقنية بومودورو للمذاكرة الفعالة (25 دقيقة تركيز / 5 دقائق استراحة)
            </span>
            <h2 className="text-lg font-black text-slate-900 font-['Cairo'] pt-2">
              {pomodoroMode === "focus" ? "جلسة تركيز ومذاكرة مكثفة 🧠" : "وقت الاستراحة والراحة ☕"}
            </h2>
          </div>

          {/* Big timer display */}
          <div className="relative w-56 h-56 mx-auto rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-xl ring-8 ring-emerald-500/10">
            <span className="text-5xl font-black font-mono tracking-tight">
              {formatTimer(pomodoroSeconds)}
            </span>
            <span className="text-xs text-emerald-300 mt-2 font-semibold">
              {pomodoroMode === "focus" ? "مذاكرة مستمرة" : "استراحة قصيرة"}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20"
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>إيقاف مؤقت</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>بدء جلسة التركيز</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setPomodoroSeconds(pomodoroMode === "focus" ? 25 * 60 : 5 * 60);
              }}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="إعادة ضبط المؤقت"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>جلسات التركيز المكتملة اليوم: <strong>{completedSessions}</strong></span>
            <span>الهدف اليومي: <strong>6 جلسات (3 ساعات)</strong></span>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 font-['Cairo']">
                إضافة مهمة مراجعة جديدة
              </h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  عنوان المهمة (مثلاً: حل 3 تمارين في المتتاليات):
                </label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="اكتب هدف جلسة المراجعة..."
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  المادة:
                </label>
                <select
                  value={newTaskSubject}
                  onChange={(e) => setNewTaskSubject(e.target.value)}
                  className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    الوقت المقترح:
                  </label>
                  <input
                    type="text"
                    value={newTaskTimeSlot}
                    onChange={(e) => setNewTaskTimeSlot(e.target.value)}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    المدة بالدقائق:
                  </label>
                  <input
                    type="number"
                    value={newTaskDuration}
                    onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                    className="w-full bg-slate-50 rounded-xl px-3 py-2 text-xs border border-slate-200 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  الأولوية:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["low", "medium", "high"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setNewTaskPriority(p)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        newTaskPriority === p
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      {p === "low" ? "عادية" : p === "medium" ? "متوسطة" : "قصوى 🔥"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs"
                >
                  إضافة المهمة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
