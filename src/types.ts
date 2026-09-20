export type StreamId =
  | "sciences"
  | "math"
  | "tech_math"
  | "gestion"
  | "lettres"
  | "langues";

export interface StreamInfo {
  id: StreamId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
  coefficient: Record<StreamId, number>; // المعامل لكل شعبة
  unitsCount: number;
  totalLessons: number;
}

export interface Lesson {
  id: string;
  subjectId: string;
  unitId: string;
  unitName: string;
  title: string;
  durationMinutes: number;
  streamIds: StreamId[];
  summary: string;
  keyPoints: string[];
  formulas?: string[];
  fullContent: string;
  isImportantForBac: boolean;
  isPremium?: boolean;
}

export interface Exercise {
  id: string;
  subjectId: string;
  lessonId: string;
  title: string;
  difficulty: "easy" | "medium" | "hard" | "bac";
  streamIds: StreamId[];
  question: string;
  hints?: string[];
  solution: string;
  gradingScale: { step: string; points: number }[];
  commonMistakes: string[];
}

export interface BacExam {
  id: string;
  year: number;
  streamId: StreamId;
  subjectId: string;
  session: string; // "الدورة العادية"
  topic1: {
    title: string;
    exercises: { title: string; content: string; points: number }[];
    solution: string;
    gradingGuide: string;
  };
  topic2: {
    title: string;
    exercises: { title: string; content: string; points: number }[];
    solution: string;
    gradingGuide: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  subjectId: string;
  streamIds: StreamId[];
  title: string;
  description: string;
  durationSeconds: number;
  questions: QuizQuestion[];
}

export interface PlannerTask {
  id: string;
  title: string;
  subjectId: string;
  date: string;
  timeSlot?: string;
  durationMinutes: number;
  completed: boolean;
  priority: "high" | "medium" | "low";
}

export interface TimetableEntry {
  id: string;
  dayOfWeek: number; // 0: Sunday (الأحد) to 6: Saturday (السبت)
  startTime: string;
  endTime: string;
  subjectId: string;
  note: string;
}

export interface UserProfile {
  name: string;
  wilaya: string;
  school: string;
  stream: StreamId;
  targetAverage: number; // e.g., 17.5
  studyHoursGoalPerDay: number;
  completedLessons: string[]; // Lesson IDs
  completedExercises: string[]; // Exercise IDs
  quizScores: Record<string, { score: number; total: number; date: string }>;
  favorites: {
    lessons: string[];
    exercises: string[];
    bacExams: string[];
    quizzes: string[];
  };
  offlineSavedItems: string[];
  studyStreakDays: number;
  totalStudyMinutes: number;
  notificationSettings: {
    studyReminders: boolean;
    dailyGoals: boolean;
    quizReminders: boolean;
    motivationalQuotes: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "reminder" | "achievement" | "tip" | "bac_update";
}
