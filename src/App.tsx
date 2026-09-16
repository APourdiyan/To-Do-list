import React, { useEffect, useRef } from 'react';
import { useStore, store } from './store/useStore';
import { Header } from './components/layout/Header';
import { TodayView } from './features/today/TodayView';
import { CalendarView } from './features/calendar/CalendarView';
import { GoalsView } from './features/goals/GoalsView';
import { TasksView } from './features/tasks/TasksView';
import { QuickAddModal } from './components/quick-add/QuickAddModal';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { JournalPhilosophyModal } from './components/common/JournalPhilosophyModal';
import { AndroidBottomNav } from './components/layout/AndroidBottomNav';
import { DailyChecklistDrawer } from './components/checklist/DailyChecklistDrawer';
import { DailyAccountingModal } from './components/accounting/DailyAccountingModal';
import { ManageDomainsModal } from './components/domains/ManageDomainsModal';
import { UserProfileModal } from './components/profile/UserProfileModal';
import { AlarmBannerToast } from './components/common/AlarmBannerToast';
import { useAlarmWatcher } from './lib/alarm/useAlarmWatcher';

export default function App() {
  const {
    activeTab,
    searchModalOpen,
    quickAddModalOpen,
    philosophyModalOpen,
    checklistDrawerOpen,
    accountingModalOpen,
    manageDomainsModalOpen,
    profileModalOpen,
  } = useStore();

  const { activeAlert, dismissAlert } = useAlarmWatcher();

  // پایش ژست لمسی سوایپ به راست (Swipe Right) در صفحات موبایل برای باز کردن چک‌لیست روزانه
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = endX - touchStartRef.current.x;
    const diffY = endY - touchStartRef.current.y;

    // تشخیص کشیدن انگشت به راست (بیش از ۷۵ پیکسل با انحراف عمودی کمتر از ۶۰ پیکسل)
    // در صورتی که مدالی باز نباشد
    if (
      diffX > 75 &&
      Math.abs(diffY) < 60 &&
      !quickAddModalOpen &&
      !searchModalOpen &&
      !accountingModalOpen &&
      !checklistDrawerOpen
    ) {
      store.setChecklistDrawerOpen(true);
    }
    touchStartRef.current = null;
  };

  // کلیدهای میانبر سراسری صفحه کلید
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // اگر کاربر داخل یک فیلد ورودی متن نباشد
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      // کلید / برای جستجو
      if (e.key === '/' && !isInput && !searchModalOpen && !quickAddModalOpen && !philosophyModalOpen) {
        e.preventDefault();
        store.setSearchModalOpen(true);
      }

      // کلید Ctrl+K یا Cmd+K یا + برای افزودن سریع
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') ||
        (e.key === '+' && !isInput && !searchModalOpen && !quickAddModalOpen && !philosophyModalOpen)
      ) {
        e.preventDefault();
        store.setQuickAddModalOpen(true);
      }

      // کلید Esc برای بستن مدال‌ها
      if (e.key === 'Escape') {
        if (searchModalOpen) store.setSearchModalOpen(false);
        if (quickAddModalOpen) store.setQuickAddModalOpen(false);
        if (philosophyModalOpen) store.setPhilosophyModalOpen(false);
        if (checklistDrawerOpen) store.setChecklistDrawerOpen(false);
        if (accountingModalOpen) store.setAccountingModalOpen(false);
        if (manageDomainsModalOpen) store.setManageDomainsModalOpen(false);
        if (profileModalOpen) store.setProfileModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchModalOpen, quickAddModalOpen, philosophyModalOpen, checklistDrawerOpen, accountingModalOpen, manageDomainsModalOpen, profileModalOpen]);

  return (
    <div
      className="min-h-screen bg-[#fbfaf6] text-stone-900 flex flex-col antialiased selection:bg-stone-800 selection:text-white"
      dir="rtl"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* اعلان زنگ آلارم زنده */}
      <AlarmBannerToast alert={activeAlert} onDismiss={dismissAlert} />

      {/* سربرگ (فقط در دسکتاپ md:block و در موبایل/اندروید طبق درخواست کاملاً حذف شده است) */}
      <Header />

      {/* محتوای فعال صفحه */}
      <main className="flex-1 pb-24 md:pb-12">
        {activeTab === 'today' && <TodayView />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'goals' && <GoalsView />}
        {activeTab === 'tasks' && <TasksView />}
      </main>

      {/* منوی زیرین اندروید (Android Bottom Navigation با دسترسی به تنظیمات و افزودن سریع) */}
      <AndroidBottomNav />

      {/* کشوی چک‌لیست ۶ حوزه (با پشتیبانی از سوایپ به راست یا دکمه صفحه اصلی) */}
      <DailyChecklistDrawer
        isOpen={checklistDrawerOpen}
        onClose={() => store.setChecklistDrawerOpen(false)}
      />

      {/* مدال محاسبه روزانه اعمال و هزینه‌ها */}
      <DailyAccountingModal
        isOpen={accountingModalOpen}
        onClose={() => store.setAccountingModalOpen(false)}
      />

      {/* مدال پروفایل کاربری و پشتیبان‌گیری ابری */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => store.setProfileModalOpen(false)}
      />

      {/* مدال‌های سراسری */}
      <QuickAddModal />
      <GlobalSearchModal />
      <ManageDomainsModal />
      <JournalPhilosophyModal
        isOpen={philosophyModalOpen}
        onClose={() => store.setPhilosophyModalOpen(false)}
      />
    </div>
  );
}
