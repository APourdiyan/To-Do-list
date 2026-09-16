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
  User,
} from 'lucide-react';
import { AndroidSettingsSheet } from './AndroidSettingsSheet';

export const AndroidBottomNav: React.FC = () => {
  const activeTab = useStore((s) => s.activeTab);
  const tasks = useStore((s) => s.tasks);

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
          id="mobile-more-menu-backdrop"
          className="md:hidden fixed inset-0 z-40 bg-stone-900/50 backdrop-blur-xs flex flex-col justify-end p-4 pb-20 animate-in fade-in duration-150"
          onClick={() => setMoreMenuOpen(false)}
        >
          <div
            id="mobile-more-menu-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="ابزارها و بخش‌های تکمیلی دفتر زندگی"
            className="bg-white rounded-3xl p-4 shadow-2xl border border-stone-200/90 space-y-2 max-w-sm mx-auto w-full animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="text-xs font-black text-stone-900 px-2 py-1 flex items-center justify-between border-b border-stone-100 pb-2">
              <span>ابزارها و بخش‌های تکمیلی</span>
              <span className="text-[10px] text-stone-500 font-normal">دفتر زندگی</span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* کلید مسیرها و اهداف */}
              <button
                type="button"
                onClick={() => {
                  store.setActiveTab('goals');
                  setMoreMenuOpen(false);
                }}
                className={`min-h-12 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                  activeTab === 'goals'
                    ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-xs'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                }`}
              >
                <Compass size={20} className={activeTab === 'goals' ? 'text-stone-950' : 'text-amber-800'} aria-hidden="true" />
                <span>اهداف و افق‌ها</span>
              </button>

              {/* کلید چک‌لیست حوزه‌ها */}
              <button
                type="button"
                onClick={() => {
                  store.setChecklistDrawerOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="min-h-12 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <BookCheck size={20} className="text-emerald-700" aria-hidden="true" />
                <span>چک‌لیست ۶ حوزه</span>
              </button>

              {/* کلید محاسبه روزانه اعمال و هزینه‌ها */}
              <button
                type="button"
                onClick={() => {
                  store.setAccountingModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="min-h-12 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <Scale size={20} className="text-stone-800" aria-hidden="true" />
                <span>محاسبه و ارزیابی</span>
              </button>

              {/* کلید پروفایل و پشتیبان‌گیری ابری */}
              <button
                type="button"
                onClick={() => {
                  store.setProfileModalOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="min-h-12 p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <User size={20} className="text-stone-800" aria-hidden="true" />
                <span>پروفایل و ذخیره ابری</span>
              </button>

              {/* کلید تنظیمات */}
              <button
                type="button"
                onClick={() => {
                  setSettingsSheetOpen(true);
                  setMoreMenuOpen(false);
                }}
                className="col-span-2 min-h-12 p-3 rounded-2xl flex items-center justify-center gap-2 border text-xs font-bold bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <Settings size={18} className="text-stone-700" aria-hidden="true" />
                <span>تنظیمات دفتر</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* نوار ناوبری پایینی اندروید */}
      <nav
        id="android-bottom-nav"
        aria-label="ناوبری اصلی موبایل"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-2 pt-1 pb-[max(env(safe-area-inset-bottom,0px),0.5rem)] select-none"
        dir="rtl"
      >
        <div className="grid grid-cols-5 items-center max-w-md mx-auto relative h-14">
          
          {/* ستون ۱: امروز */}
          <button
            type="button"
            onClick={() => store.setActiveTab('today')}
            aria-label="صفحه برنامه امروز"
            aria-current={activeTab === 'today' ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer min-w-11 focus:outline-none"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'today'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sun size={18} className="stroke-[2.2]" aria-hidden="true" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'today' ? 'font-black text-stone-950' : 'font-medium text-stone-600'
              }`}
            >
              امروز
            </span>
          </button>

          {/* ستون ۲: کارها (با نشانگر عددی کارهای فعال) */}
          <button
            type="button"
            onClick={() => store.setActiveTab('tasks')}
            aria-label={`فهرست تمام کارها ${todayPendingTasksCount > 0 ? `(${todayPendingTasksCount} کار مانده)` : ''}`}
            aria-current={activeTab === 'tasks' ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center relative transition-transform active:scale-90 cursor-pointer min-w-11 focus:outline-none"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all relative ${
                activeTab === 'tasks'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckSquare size={18} className="stroke-[2.2]" aria-hidden="true" />
              {todayPendingTasksCount > 0 && activeTab !== 'tasks' && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                  {toPersianDigits(todayPendingTasksCount)}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'tasks' ? 'font-black text-stone-950' : 'font-medium text-stone-600'
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
              aria-label="افزودن سریع کار، رویداد یا یادداشت"
              className="w-12 h-12 rounded-2xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 shadow-md border-2 border-white flex items-center justify-center transition-all active:scale-90 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              title="افزودن اقدام، رویداد یا یادداشت"
            >
              <Plus
                size={24}
                className="stroke-[2.7] text-stone-950 group-hover:rotate-90 transition-transform duration-200"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* ستون ۴: گاه‌شمار تقویمی */}
          <button
            type="button"
            onClick={() => store.setActiveTab('calendar')}
            aria-label="تقویم و گاه‌شمار"
            aria-current={activeTab === 'calendar' ? 'page' : undefined}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer min-w-11 focus:outline-none"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'calendar'
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CalendarIcon size={18} className="stroke-[2.2]" aria-hidden="true" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'calendar' ? 'font-black text-stone-950' : 'font-medium text-stone-600'
              }`}
            >
              گاه‌شمار
            </span>
          </button>

          {/* ستون ۵: ابزارها / اهداف و تنظیمات */}
          <button
            type="button"
            onClick={() => setMoreMenuOpen(true)}
            aria-label="منوی ابزارها و بخش‌های تکمیلی"
            aria-expanded={moreMenuOpen}
            className="flex flex-col items-center justify-center gap-1 h-full py-1 text-center transition-transform active:scale-90 cursor-pointer min-w-11 focus:outline-none"
          >
            <div
              className={`w-10 h-7 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'goals' || moreMenuOpen
                  ? 'bg-amber-400 text-stone-950 font-black shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <SlidersHorizontal size={18} className="stroke-[2.2]" aria-hidden="true" />
            </div>
            <span
              className={`text-[10px] leading-none tracking-tight ${
                activeTab === 'goals' ? 'font-black text-stone-950' : 'font-medium text-stone-600'
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
