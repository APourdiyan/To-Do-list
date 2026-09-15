import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { getTodayJalali, toPersianDigits } from '../../lib/date/jalali';
import {
  Sun,
  Calendar as CalendarIcon,
  Compass,
  CheckSquare,
  Plus,
  SlidersHorizontal,
  Settings,
  Scale,
  BookCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AndroidSettingsSheet } from './AndroidSettingsSheet';

export const AndroidBottomNav: React.FC = () => {
  const { activeTab, tasks, checklistItems, checklistLogs } = useStore();
  const today = getTodayJalali();
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // تعداد کارهای انجام‌نشده امروز برای نمایش بج
  const todayPendingTasksCount = tasks.filter(
    (t) => t.dueDate === today.dateStr && !t.completedAt
  ).length;

  return (
    <>
      {/* منوی شناور جانبی سریع برای «بیشتر / ابزارها» در صورت تمایل کاربر */}
      {moreMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-stone-900/40 backdrop-blur-xs flex flex-col justify-end p-4 pb-20 animate-fade-in"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-4 shadow-2xl border border-stone-200/90 space-y-2 max-w-sm mx-auto w-full"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-xs font-black text-stone-900 px-2 py-1 flex items-center justify-between border-b border-stone-100 pb-2">
              <span>ابزارها و بخش‌های تکمیلی</span>
              <span className="text-[10px] text-stone-400 font-normal">دفتر زندگی</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* کلید مسیرها و اهداف */}
              <button
                onClick={() => {
                  store.setActiveTab('goals');
                  setMoreMenuOpen(false);
                }}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'goals'
                    ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Compass size={20} className={activeTab === 'goals' ? 'text-stone-950' : 'text-stone-600'} />
                <span>اهداف و مسیرها</span>
              </button>

              {/* کلید چک‌لیست ۶ حوزه */}
              <button
                onClick={() => {
                  store.setChecklistDrawerOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 transition-all cursor-pointer"
              >
                <BookCheck size={20} className="text-emerald-700" />
                <span>چک‌لیست ۶ حوزه</span>
              </button>

              {/* کلید محاسبه اعمال و مخارج */}
              <button
                onClick={() => {
                  store.setAccountingModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 transition-all cursor-pointer"
              >
                <Scale size={20} className="text-amber-700" />
                <span>محاسبه و مخارج</span>
              </button>

              {/* کلید تنظیمات */}
              <button
                onClick={() => {
                  setSettingsSheetOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="p-3 rounded-2xl flex flex-col items-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200 transition-all cursor-pointer"
              >
                <Settings size={20} className="text-stone-700" />
                <span>تنظیمات دفتر</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نوار ناوبری پایینی کاملاً متقارن (۵ ستون هندسی دقیق) */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] select-none"
        dir="rtl"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto relative h-14">
          
          {/* ستون ۱: امروز */}
          <button
            type="button"
            onClick={() => store.setActiveTab('today')}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'today'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sun size={18} className="stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'today' ? 'font-black text-stone-950' : 'font-medium text-stone-500'
              }`}
            >
              امروز
            </span>
          </button>

          {/* ستون ۲: کارها (با نشانگر عددی کارهای فعال) */}
          <button
            type="button"
            onClick={() => store.setActiveTab('tasks')}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center relative transition-transform active:scale-90 cursor-pointer"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all relative ${
                activeTab === 'tasks'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <CheckSquare size={18} className="stroke-[2.2]" />
              {todayPendingTasksCount > 0 && activeTab !== 'tasks' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                  {toPersianDigits(todayPendingTasksCount)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'tasks' ? 'font-black text-stone-950' : 'font-medium text-stone-500'
              }`}
            >
              کارها
            </span>
          </button>

          {/* ستون ۳ (مرکز دقیق): دکمه طلایی افزودن سریع (+) */}
          <div className="flex items-center justify-center h-full">
            <button
              type="button"
              onClick={() => store.setQuickAddModalOpen(true)}
              className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 shadow-md border-2 border-white flex items-center justify-center transition-all active:scale-90 cursor-pointer group"
              title="افزودن اقدام، رویداد یا یادداشت"
            >
              <Plus
                size={24}
                className="stroke-[2.7] text-stone-950 group-hover:rotate-90 transition-transform duration-200"
              />
            </button>
          </div>

          {/* ستون ۴: گاه‌شمار تقویمی */}
          <button
            type="button"
            onClick={() => store.setActiveTab('calendar')}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'calendar'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <CalendarIcon size={18} className="stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'calendar' ? 'font-black text-stone-950' : 'font-medium text-stone-500'
              }`}
            >
              گاه‌شمار
            </span>
          </button>

          {/* ستون ۵: ابزارها / اهداف و تنظیمات */}
          <button
            type="button"
            onClick={() => setMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'goals' || moreMenuOpen
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <SlidersHorizontal size={18} className="stroke-[2.2]" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'goals' ? 'font-black text-stone-950' : 'font-medium text-stone-500'
              }`}
            >
              افق‌ها و ابزار
            </span>
          </button>

        </div>
      </nav>

      {/* شیت تنظیمات اختصاصی اندروید */}
      <AndroidSettingsSheet
        isOpen={settingsSheetOpen}
        onClose={() => setSettingsSheetOpen(false)}
      />
    </>
  );
};
