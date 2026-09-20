import React from "react";
import {
  Home,
  BookOpen,
  CheckSquare,
  FileText,
  HelpCircle,
  Bot,
  Calendar,
  BarChart3,
  Bookmark,
  User,
} from "lucide-react";

interface NavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  favoritesCount: number;
}

export const Navigation: React.FC<NavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
}) => {
  const primaryNavItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "lessons", label: "الدروس", icon: BookOpen },
    { id: "exercises", label: "التمارين", icon: CheckSquare },
    { id: "bac_archive", label: "مواضيع البكالوريا", icon: FileText },
    { id: "quizzes", label: "الاختبارات", icon: HelpCircle },
    { id: "ai_assistant", label: "مساعد AI", icon: Bot, isHighlighted: true },
    { id: "planner", label: "مخطط المراجعة", icon: Calendar },
    { id: "progress", label: "تقدمي", icon: BarChart3 },
    { id: "favorites", label: "المفضلة", icon: Bookmark, badge: favoritesCount },
    { id: "profile", label: "حسابي", icon: User },
  ];

  // Mobile navigation uses top 5 most important tabs, with a "More" or horizontal scroll
  const mobileNavItems = [
    { id: "home", label: "الرئيسية", icon: Home },
    { id: "lessons", label: "الدروس", icon: BookOpen },
    { id: "exercises", label: "التمارين", icon: CheckSquare },
    { id: "bac_archive", label: "البكالوريا", icon: FileText },
    { id: "ai_assistant", label: "مساعد AI", icon: Bot, isHighlighted: true },
    { id: "quizzes", label: "الاختبارات", icon: HelpCircle },
    { id: "planner", label: "المخطط", icon: Calendar },
    { id: "progress", label: "تقدمي", icon: BarChart3 },
    { id: "favorites", label: "المفضلة", icon: Bookmark, badge: favoritesCount },
    { id: "profile", label: "حسابي", icon: User },
  ];

  return (
    <>
      {/* Desktop Navigation Bar (Secondary bar below header) */}
      <nav className="hidden lg:block bg-white border-b border-slate-200 sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2 gap-1 scrollbar-none">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  id={`desktop-tab-${item.id}`}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap relative ${
                    isActive
                      ? item.isHighlighted
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-600/30"
                      : item.isHighlighted
                      ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive && item.isHighlighted ? "text-white" : ""}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.isHighlighted && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg">
        <div className="flex items-center justify-around overflow-x-auto gap-1">
          {mobileNavItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                id={`mobile-tab-${item.id}`}
                className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative flex-1 min-w-[58px] ${
                  isActive
                    ? item.isHighlighted
                      ? "text-emerald-700 font-extrabold"
                      : "text-emerald-700 font-bold"
                    : "text-slate-600 hover:text-slate-800 font-medium"
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive
                      ? item.isHighlighted
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-emerald-100 text-emerald-800"
                      : item.isHighlighted
                      ? "bg-emerald-50 text-emerald-600"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-3 bg-amber-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Dropdown for the rest of sections on Mobile */}
          <button
            onClick={() => {
              // Cycle through or open profile/planner
              if (activeTab === "planner") onTabChange("progress");
              else if (activeTab === "progress") onTabChange("favorites");
              else if (activeTab === "favorites") onTabChange("profile");
              else onTabChange("planner");
            }}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative flex-1 min-w-[58px] ${
              ["planner", "progress", "favorites", "profile", "quizzes"].includes(activeTab)
                ? "text-emerald-700 font-bold"
                : "text-slate-600"
            }`}
          >
            <div className={`p-1.5 rounded-xl ${["planner", "progress", "favorites", "profile", "quizzes"].includes(activeTab) ? "bg-emerald-100 text-emerald-800" : ""}`}>
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5 whitespace-nowrap">
              {activeTab === "planner"
                ? "المخطط"
                : activeTab === "progress"
                ? "تقدمي"
                : activeTab === "favorites"
                ? "المفضلة"
                : activeTab === "profile"
                ? "حسابي"
                : "المزيد"}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};
