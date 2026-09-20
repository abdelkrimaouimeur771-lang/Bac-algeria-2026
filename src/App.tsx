import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Navigation } from "./components/BottomNav";
import { HomeSection } from "./components/HomeSection";
import { LessonsSection } from "./components/LessonsSection";
import { ExercisesSection } from "./components/ExercisesSection";
import { BacArchiveSection } from "./components/BacArchiveSection";
import { QuizzesSection } from "./components/QuizzesSection";
import { AiAssistantSection } from "./components/AiAssistantSection";
import { StudyPlannerSection } from "./components/StudyPlannerSection";
import { ProgressSection } from "./components/ProgressSection";
import { FavoritesSection } from "./components/FavoritesSection";
import { ProfileSection } from "./components/ProfileSection";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { AdminPanelModal } from "./components/AdminPanelModal";
import {
  loadUserProfile,
  saveUserProfile,
  loadPlannerTasks,
  savePlannerTasks,
  loadTimetable,
  loadNotifications,
  saveNotifications,
  DEFAULT_PROFILE,
} from "./utils/storage";
import { StreamId, UserProfile, PlannerTask, NotificationItem, Lesson } from "./types";
import { LESSONS } from "./data/algerianBacData";
import { CheckCircle2, Bookmark, Download, Sparkles } from "lucide-react";

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [currentStream, setCurrentStream] = useState<StreamId>(userProfile.stream || "sciences");
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | undefined>(undefined);
  const [selectedLessonId, setSelectedLessonId] = useState<string | undefined>(undefined);

  const [tasks, setTasks] = useState<PlannerTask[]>(() => loadPlannerTasks());
  const [timetable] = useState(() => loadTimetable());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadNotifications()
  );

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync profile changes to localStorage
  useEffect(() => {
    saveUserProfile(userProfile);
  }, [userProfile]);

  // Sync planner tasks to localStorage
  useEffect(() => {
    savePlannerTasks(tasks);
  }, [tasks]);

  // Sync notifications to localStorage
  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // Show quick toast notification
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Switch Stream
  const handleSelectStream = (streamId: StreamId) => {
    setCurrentStream(streamId);
    setUserProfile((prev) => ({ ...prev, stream: streamId }));
    showToast(`تم تبديل الشعبة بنجاح إلى شعبتك المختارة`);
  };

  // Toggle favorite
  const handleToggleFavorite = (type: "lessons" | "exercises" | "bacExams" | "quizzes", id: string) => {
    setUserProfile((prev) => {
      const currentList = prev.favorites[type] || [];
      const isFav = currentList.includes(id);
      const updatedList = isFav
        ? currentList.filter((item) => item !== id)
        : [...currentList, id];

      showToast(isFav ? "تمت الإزالة من المفضلة" : "تمت الإضافة إلى قائمة المفضلة ⭐");

      return {
        ...prev,
        favorites: {
          ...prev.favorites,
          [type]: updatedList,
        },
      };
    });
  };

  // Toggle offline save
  const handleToggleOffline = (id: string) => {
    setUserProfile((prev) => {
      const isSaved = prev.offlineSavedItems.includes(id);
      const updated = isSaved
        ? prev.offlineSavedItems.filter((item) => item !== id)
        : [...prev.offlineSavedItems, id];

      showToast(
        isSaved
          ? "تمت إزالة المحتوى من الذاكرة دون اتصال"
          : "تم حفظ المحتوى بنجاح للقراءة دون الحاجة إلى إنترنت 📥"
      );

      return {
        ...prev,
        offlineSavedItems: updated,
      };
    });
  };

  // Toggle completed lesson
  const handleToggleCompletedLesson = (lessonId: string) => {
    setUserProfile((prev) => {
      const isDone = prev.completedLessons.includes(lessonId);
      const updated = isDone
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];

      showToast(isDone ? "تم إلغاء تحديد الدرس" : "أحسنت! تمت مراجعة الدرس واحتسابها في تقدمك ✓");

      return {
        ...prev,
        completedLessons: updated,
      };
    });
  };

  // Toggle completed exercise
  const handleToggleCompletedExercise = (exerciseId: string) => {
    setUserProfile((prev) => {
      const isDone = prev.completedExercises.includes(exerciseId);
      const updated = isDone
        ? prev.completedExercises.filter((id) => id !== exerciseId)
        : [...prev.completedExercises, exerciseId];

      showToast(isDone ? "تم إلغاء تحديد التمرين" : "ممتاز! تم حل التمرين واحتسابه في سجلك ✓");

      return {
        ...prev,
        completedExercises: updated,
      };
    });
  };

  // Save Quiz Score
  const handleSaveQuizScore = (quizId: string, score: number, total: number) => {
    setUserProfile((prev) => ({
      ...prev,
      quizScores: {
        ...prev.quizScores,
        [quizId]: {
          score,
          total,
          date: new Date().toISOString().split("T")[0],
        },
      },
    }));
    showToast(`تم حفظ نتيجتك: ${score}/20 في سجل التقدم!`);
  };

  // Log study time
  const handleLogStudyMinutes = (minutes: number) => {
    setUserProfile((prev) => ({
      ...prev,
      totalStudyMinutes: prev.totalStudyMinutes + minutes,
    }));
    showToast(`تم توثيق ${minutes} دقيقة مذاكرة بنجاح! واصل الاجتهاد 📚`);
  };

  // Add custom task
  const handleAddTask = (task: PlannerTask) => {
    setTasks((prev) => [task, ...prev]);
    showToast("تمت إضافة مهمة المراجعة إلى مخطط اليوم");
  };

  // Toggle task
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  // Delete task
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    showToast("تم حذف المهمة");
  };

  // Mark notification read
  const handleMarkNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  // Broadcast new notification from admin
  const handleBroadcastNotification = (notif: NotificationItem) => {
    setNotifications((prev) => [notif, ...prev]);
    showToast("تم بث التنبيه لجميع الطلاب!");
  };

  // Add Custom Lesson from admin
  const handleAddCustomLesson = (lesson: Lesson) => {
    LESSONS.unshift(lesson);
    showToast(`تم نشر درس: "${lesson.title}" في المنهاج!`);
  };

  // Reset Progress
  const handleResetProgress = () => {
    if (confirm("هل أنت متأكد من رغبتك في تصفير سجل الدروس والتمارين المحلولة؟")) {
      setUserProfile((prev) => ({
        ...prev,
        completedLessons: [],
        completedExercises: [],
        quizScores: {},
        totalStudyMinutes: 0,
        studyStreakDays: 1,
      }));
      showToast("تم تصفير سجل التقدم بنجاح");
    }
  };

  const totalFavorites =
    userProfile.favorites.lessons.length +
    userProfile.favorites.exercises.length +
    userProfile.favorites.bacExams.length +
    userProfile.favorites.quizzes.length;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-['Cairo',sans-serif] flex flex-col antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-300">
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 text-xs font-bold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Main Navbar */}
      <Navbar
        currentStream={currentStream}
        onSelectStream={handleSelectStream}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        streakDays={userProfile.studyStreakDays}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
      />

      {/* Desktop Navigation Tabs Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab !== "lessons") setSelectedLessonId(undefined);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        favoritesCount={totalFavorites}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-12">
        {activeTab === "home" && (
          <HomeSection
            userProfile={userProfile}
            currentStream={currentStream}
            onSelectStream={handleSelectStream}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectSubject={(subjId) => {
              setSelectedSubjectId(subjId);
              setSelectedLessonId(undefined);
            }}
            onSelectLesson={(lessonId) => {
              setSelectedLessonId(lessonId);
              setActiveTab("lessons");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "lessons" && (
          <LessonsSection
            currentStream={currentStream}
            selectedSubjectId={selectedSubjectId}
            onSubjectChange={(id) => {
              setSelectedSubjectId(id);
              setSelectedLessonId(undefined);
            }}
            userProfile={userProfile}
            onToggleFavorite={(id) => handleToggleFavorite("lessons", id)}
            onToggleOffline={handleToggleOffline}
            onToggleCompleted={handleToggleCompletedLesson}
            selectedLessonId={selectedLessonId}
            onSelectLesson={setSelectedLessonId}
          />
        )}

        {activeTab === "exercises" && (
          <ExercisesSection
            currentStream={currentStream}
            userProfile={userProfile}
            onToggleCompleted={handleToggleCompletedExercise}
            onToggleFavorite={(id) => handleToggleFavorite("exercises", id)}
          />
        )}

        {activeTab === "bac_archive" && (
          <BacArchiveSection
            currentStream={currentStream}
            userProfile={userProfile}
            onToggleFavorite={(id) => handleToggleFavorite("bacExams", id)}
            onToggleOffline={handleToggleOffline}
          />
        )}

        {activeTab === "quizzes" && (
          <QuizzesSection
            currentStream={currentStream}
            userProfile={userProfile}
            onSaveQuizScore={handleSaveQuizScore}
          />
        )}

        {activeTab === "ai_assistant" && (
          <AiAssistantSection currentStream={currentStream} />
        )}

        {activeTab === "planner" && (
          <StudyPlannerSection
            currentStream={currentStream}
            userProfile={userProfile}
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            timetable={timetable}
          />
        )}

        {activeTab === "progress" && (
          <ProgressSection
            userProfile={userProfile}
            currentStream={currentStream}
            onLogStudyMinutes={handleLogStudyMinutes}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "favorites" && (
          <FavoritesSection
            userProfile={userProfile}
            onRemoveFavorite={(type, id) => handleToggleFavorite(type, id)}
            onSelectLesson={(id) => {
              setSelectedLessonId(id);
              setActiveTab("lessons");
            }}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "profile" && (
          <ProfileSection
            userProfile={userProfile}
            currentStream={currentStream}
            onUpdateProfile={(updated) =>
              setUserProfile((prev) => ({ ...prev, ...updated }))
            }
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        currentStream={currentStream}
        onSelectLesson={(id) => {
          setSelectedLessonId(id);
          setActiveTab("lessons");
        }}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onAddCustomLesson={handleAddCustomLesson}
        onBroadcastNotification={handleBroadcastNotification}
      />

      {/* Footer */}
      <footer className="hidden lg:block bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            © 2025/2026 <strong>BAC DZ Hub</strong> — المنصة التربوية المتكاملة لطلاب البكالوريا في الجزائر 🇩🇿
          </p>
          <p className="text-[11px] text-slate-600">
            مواضيع البكالوريا الرسمية وسلالم التنقيط محفوظة للديوان الوطني للامتحانات والمسابقات (ONEC)
          </p>
        </div>
      </footer>
    </div>
  );
}
