import { UserProfile, PlannerTask, TimetableEntry, NotificationItem } from "../types";

const PROFILE_KEY = "bac_dz_user_profile";
const TASKS_KEY = "bac_dz_planner_tasks";
const TIMETABLE_KEY = "bac_dz_timetable";
const NOTIFICATIONS_KEY = "bac_dz_notifications";

export const DEFAULT_PROFILE: UserProfile = {
  name: "أمين بوعلام",
  wilaya: "الجزائر العاصمة (16)",
  school: "ثانوية الأمير عبد القادر",
  stream: "sciences",
  targetAverage: 17.5,
  studyHoursGoalPerDay: 4,
  completedLessons: ["math_exp_func"],
  completedExercises: ["ex_physics_01"],
  quizScores: {
    quiz_math_analysis: { score: 16, total: 20, date: "2026-09-18" },
  },
  favorites: {
    lessons: ["math_exp_func", "physics_reaction_speed"],
    exercises: ["ex_math_01"],
    bacExams: ["bac_2024_sci_math"],
    quizzes: ["quiz_math_analysis"],
  },
  offlineSavedItems: ["math_exp_func", "bac_2024_sci_math"],
  studyStreakDays: 6,
  totalStudyMinutes: 780,
  notificationSettings: {
    studyReminders: true,
    dailyGoals: true,
    quizReminders: true,
    motivationalQuotes: true,
  },
};

export const DEFAULT_TASKS: PlannerTask[] = [
  {
    id: "task_1",
    title: "حل مسألة الدالة الأسية في الرياضيات",
    subjectId: "math",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "17:00 - 18:30",
    durationMinutes: 90,
    completed: true,
    priority: "high",
  },
  {
    id: "task_2",
    title: "مراجعة وحفظ تواريخ وأحداث الحرب الباردة",
    subjectId: "history_geo",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "19:00 - 20:00",
    durationMinutes: 60,
    completed: false,
    priority: "medium",
  },
  {
    id: "task_3",
    title: "حل تمرين المتابعة الزمنية بالناقلية (فيزياء)",
    subjectId: "physics",
    date: new Date().toISOString().split("T")[0],
    timeSlot: "20:30 - 21:30",
    durationMinutes: 60,
    completed: false,
    priority: "high",
  },
];

export const DEFAULT_TIMETABLE: TimetableEntry[] = [
  { id: "tt_1", dayOfWeek: 0, startTime: "17:30", endTime: "19:30", subjectId: "math", note: "حل مسائل وتطبيقات" },
  { id: "tt_2", dayOfWeek: 1, startTime: "18:00", endTime: "19:30", subjectId: "physics", note: "ملخص الوحدة والوحدات الكهربائية" },
  { id: "tt_3", dayOfWeek: 2, startTime: "17:30", endTime: "19:00", subjectId: "science", note: "رسومات تخطيطية للاستدلال العلمي" },
  { id: "tt_4", dayOfWeek: 3, startTime: "18:00", endTime: "19:30", subjectId: "philosophy", note: "حفظ مواقف وحجج الفلاسفة" },
  { id: "tt_5", dayOfWeek: 4, startTime: "16:00", endTime: "18:00", subjectId: "arabic", note: "تطبيقات إعراب الجمل والصور البيانية" },
  { id: "tt_6", dayOfWeek: 5, startTime: "09:00", endTime: "12:00", subjectId: "math", note: "حل موضوع بكالوريا دورة سابقة كاملاً" },
  { id: "tt_7", dayOfWeek: 6, startTime: "09:00", endTime: "12:00", subjectId: "physics", note: "حل موضوع بكالوريا فيزياء" },
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "تذكير بموعد المراجعة المسائية",
    message: "حان وقت جلسة الفيزياء (المتابعة الزمنية) وفق مخططك الدراسي.",
    time: "منذ 25 دقيقة",
    read: false,
    type: "reminder",
  },
  {
    id: "notif_2",
    title: "إنجاز رائع! 🔥",
    message: "أكملت 6 أيام متتالية من المراجعة الجادة في BAC DZ Hub. واصل التألق!",
    time: "منذ ساعتين",
    read: false,
    type: "achievement",
  },
  {
    id: "notif_3",
    title: "نصيحة البكالوريا لليوم",
    message: "في الرياضيات: لا تنسَ كتابة 'f مستمرة ورتيبة تماماً' عند تطبيق مبرهنة القيم المتوسطة.",
    time: "اليوم 08:00",
    read: true,
    type: "tip",
  },
  {
    id: "notif_4",
    title: "تحديث مواضيع البكالوريا",
    message: "تم توفير الحلول المفصلة وسلم التنقيط لبكالوريا 2024 لجميع الشعب.",
    time: "أمس",
    read: true,
    type: "bac_update",
  },
];

export function loadUserProfile(): UserProfile {
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    if (data) return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
  } catch (e) {
    console.error("Failed to load user profile", e);
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save user profile", e);
  }
}

export function loadPlannerTasks(): PlannerTask[] {
  try {
    const data = localStorage.getItem(TASKS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load planner tasks", e);
  }
  return DEFAULT_TASKS;
}

export function savePlannerTasks(tasks: PlannerTask[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save planner tasks", e);
  }
}

export function loadTimetable(): TimetableEntry[] {
  try {
    const data = localStorage.getItem(TIMETABLE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load timetable", e);
  }
  return DEFAULT_TIMETABLE;
}

export function saveTimetable(entries: TimetableEntry[]): void {
  try {
    localStorage.setItem(TIMETABLE_KEY, JSON.stringify(entries));
  } catch (e) {
    console.error("Failed to save timetable", e);
  }
}

export function loadNotifications(): NotificationItem[] {
  try {
    const data = localStorage.getItem(NOTIFICATIONS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error("Failed to load notifications", e);
  }
  return DEFAULT_NOTIFICATIONS;
}

export function saveNotifications(items: NotificationItem[]): void {
  try {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save notifications", e);
  }
}
