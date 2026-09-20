import React, { useState } from "react";
import {
  GraduationCap,
  Flame,
  Bell,
  Search,
  Settings,
  ChevronDown,
  CheckCheck,
  Award,
  Sparkles,
  Wifi,
  WifiOff,
} from "lucide-react";
import { STREAMS } from "../data/algerianBacData";
import { StreamId, NotificationItem } from "../types";

interface NavbarProps {
  currentStream: StreamId;
  onSelectStream: (streamId: StreamId) => void;
  onOpenSearch: () => void;
  onOpenAdmin: () => void;
  onNavigate: (section: string) => void;
  streakDays: number;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStream,
  onSelectStream,
  onOpenSearch,
  onOpenAdmin,
  onNavigate,
  streakDays,
  notifications,
  onMarkNotificationRead,
}) => {
  const [showStreamMenu, setShowStreamMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [isOnline] = useState(navigator.onLine);

  const activeStream = STREAMS.find((s) => s.id === currentStream) || STREAMS[0];
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate("home")}
              className="flex items-center gap-2.5 text-right group transition-transform active:scale-95"
              id="app-logo-btn"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
                <GraduationCap className="w-6 h-6 transform -rotate-6 group-hover:rotate-0 transition-transform" />
                <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white ring-1 ring-white">
                  ★
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-slate-900 font-['Cairo']">
                    BAC <span className="text-emerald-600">DZ</span> Hub
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                    2025/2026
                  </span>
                </div>
                <span className="text-[11px] text-slate-700 font-medium hidden xs:block">
                  بوابة البكالوريا الجزائرية الشاملة
                </span>
              </div>
            </button>

            {/* Stream Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowStreamMenu(!showStreamMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-bold text-slate-700 transition-colors"
                id="stream-selector-btn"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="max-w-[120px] sm:max-w-[180px] truncate">
                  {activeStream.shortName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showStreamMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowStreamMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-600">
                      اختر الشعبة لعرض المواد والمعاملات:
                    </div>
                    {STREAMS.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onSelectStream(st.id);
                          setShowStreamMenu(false);
                        }}
                        className={`w-full text-right px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentStream === st.id
                            ? "bg-emerald-50 text-emerald-700 font-bold"
                            : "text-slate-700"
                        }`}
                      >
                        <span>{st.name}</span>
                        {currentStream === st.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online/Offline indicator */}
            <div
              title={isOnline ? "متصل بالإنترنت" : "وضع عدم الاتصال (المحتوى المحفوظ يعمل)"}
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600"
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span>متصل</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600" />
                  <span>محلي</span>
                </>
              )}
            </div>

            {/* Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold shadow-2xs"
              title="سلسلة المراجعة اليومية المتتالية"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span>{streakDays} أيام</span>
            </div>

            {/* Global Search Button */}
            <button
              onClick={onOpenSearch}
              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
              title="بحث شامل في الدروس والتمارين وحوليات البكالوريا"
              id="navbar-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                id="navbar-notif-btn"
                title="التنبيهات والإشعارات"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifMenu(false)}
                  />
                  <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-slate-200 py-2.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-emerald-600" />
                        التنبيهات والإشعارات
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {unreadCount} جديد
                        </span>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-600">
                          لا توجد إشعارات جديدة حالياً
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => onMarkNotificationRead(notif.id)}
                            className={`p-3 text-right hover:bg-slate-50 cursor-pointer transition-colors ${
                              !notif.read ? "bg-emerald-50/40" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold text-slate-800">
                                {notif.title}
                              </span>
                              <span className="text-[10px] text-slate-600 whitespace-nowrap">
                                {notif.time}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                              {notif.message}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="px-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <button
                        onClick={() => onNavigate("planner")}
                        className="text-emerald-700 hover:underline font-semibold"
                      >
                        ضبط التذكيرات في المخطط
                      </button>
                      <button
                        onClick={() => {
                          notifications.forEach((n) => onMarkNotificationRead(n.id));
                        }}
                        className="text-slate-600 hover:text-slate-700 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3.5 h-3.5" />
                        تحديد الكل كمقروء
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Admin Management Panel trigger */}
            <button
              onClick={onOpenAdmin}
              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              title="لوحة الإشراف وإضافة المحتوى والنظام المستقبلي"
              id="navbar-admin-btn"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
