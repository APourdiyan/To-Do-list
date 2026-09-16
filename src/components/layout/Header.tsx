import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { getTodayJalali, formatJalaliDate, getGregorianEquivalent } from '../../lib/date/jalali';
import {
  Sun,
  Calendar as CalendarIcon,
  Compass,
  CheckSquare,
  Plus,
  Search,
  RotateCcw,
  BookMarked,
  Settings,
  BookOpen,
  LayoutGrid,
  User,
  BookCheck,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AndroidSettingsSheet } from './AndroidSettingsSheet';

export const Header: React.FC = () => {
  const activeTab = useStore((s) => s.activeTab);
  const settings = useStore((s) => s.settings);

  const today = getTodayJalali();
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsSheetOpen, setSettingsSheetOpen] = useState(false);

  const formattedToday = formatJalaliDate(today.dateStr, {
    showWeekday: true,
    showMonthName: true,
    showYear: true,
  });

  const gregorianToday = getGregorianEquivalent(today.dateStr);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'today', label: 'امروز', icon: <Sun size={17} aria-hidden="true" /> },
    { id: 'calendar', label: 'گاه‌شمار', icon: <CalendarIcon size={17} aria-hidden="true" /> },
    { id: 'goals', label: 'مسیرها', icon: <Compass size={17} aria-hidden="true" /> },
    { id: 'tasks', label: 'کارها', icon: <CheckSquare size={17} aria-hidden="true" /> },
  ];

  const handleOpenSettings = () => {
    // در موبایل/تبلت از شیت کشویی اندرویدی استفاده می‌کنیم
    if (window.innerWidth < 768) {
      setSettingsSheetOpen(true);
    } else {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <>
      {/* هدر دسکتاپ و تبلت (در موبایل کاملاً حذف شده تا فضا حداکثری باشد، از md به بالا با چیدمان بدون همپوشانی) */}
      <header
        id="app-desktop-header"
        className="hidden md:block sticky top-0 z-30 bg-[#fbfaf6]/95 backdrop-blur-md border-b border-stone-200/80 px-4 lg:px-6 py-2 transition-all select-none"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 lg:gap-4">
          
          {/* سمت راست: هویت بصری و نشان دفتر زندگی */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs border border-stone-800 shrink-0">
              <BookMarked size={18} className="text-amber-300" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm lg:text-base font-extrabold text-stone-900 tracking-tight leading-none">
                  دفتر زندگی من
                </h1>
                <span className="text-[9px] font-bold bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200/70 hidden lg:inline-block">
                  برنامه‌ریزی روزانه
                </span>
              </div>
              <p className="text-[10px] text-stone-500 font-normal mt-0.5 hidden xl:block">
                برنامه‌ریزی شخصی، تقویم و کارها
              </p>
            </div>
          </div>

          {/* میانه: نوار ناوبری اصلی (تبلت و دسکتاپ) */}
          <nav
            aria-label="بخش‌های اصلی برنامه"
            className="flex items-center p-1 bg-stone-200/70 rounded-xl border border-stone-300/60 shadow-xs shrink-0"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => store.setActiveTab(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`min-h-10 flex items-center gap-1.5 px-3 lg:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/60'
                  }`}
                >
                  <span className={isActive ? 'text-amber-300' : 'text-stone-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* سمت چپ: ابزارهای تکمیلی با بهینه‌سازی تبلت (hidden xl:inline روی برچسب‌های متنی) */}
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
            
            {/* نمایش تاریخ روز در دسکتاپ بزرگ */}
            <div className="text-left hidden 2xl:block border-l border-stone-200 pl-3 ml-1">
              <div className="text-xs font-bold text-stone-800">
                {formattedToday}
              </div>
              {settings.showGregorian && gregorianToday && (
                <div className="text-[10px] text-stone-500 font-mono">
                  {gregorianToday}
                </div>
              )}
            </div>

            {/* کلید چک‌لیست کارهای روزانه */}
            <button
              type="button"
              onClick={() => store.setChecklistDrawerOpen(true)}
              className="min-w-11 min-h-11 px-2.5 py-1.5 text-xs font-bold text-stone-800 hover:text-stone-950 bg-amber-50 hover:bg-amber-100 border border-amber-200/90 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label="مشاهده و تیک زدن کارهای روزانه و روتین‌ها"
              title="مشاهده و تیک زدن کارهای روزانه و روتین‌ها"
            >
              <BookCheck size={16} className="text-amber-700" aria-hidden="true" />
              <span className="hidden xl:inline">کارهای روزانه</span>
            </button>

            {/* کلید پروفایل کاربری و ذخیره ابری */}
            <button
              type="button"
              onClick={() => store.setProfileModalOpen(true)}
              className="min-w-11 min-h-11 px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label="پروفایل، همگام‌سازی ابری و انتقال به گوشی جدید"
              title="پروفایل، همگام‌سازی ابری و انتقال به گوشی جدید"
            >
              <User size={16} className="text-stone-700" aria-hidden="true" />
              <span className="hidden xl:inline">پروفایل</span>
            </button>

            {/* کلید راهنمای استفاده از دفتر */}
            <button
              type="button"
              onClick={() => store.setPhilosophyModalOpen(true)}
              className="min-w-11 min-h-11 px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label="راهنمای وضوح ذهنی و استفاده از دفتر"
              title="راهنمای وضوح ذهنی و استفاده از دفتر"
            >
              <BookOpen size={16} className="text-amber-700" aria-hidden="true" />
              <span className="hidden xl:inline">راهنما</span>
            </button>

            {/* کلید جستجوی سراسری */}
            <button
              type="button"
              onClick={() => store.setSearchModalOpen(true)}
              className="min-w-11 min-h-11 px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label="جستجوی سریع در تمام دفتر"
              title="جستجوی سریع در تمام دفتر (کلید /)"
            >
              <Search size={15} className="text-stone-600" aria-hidden="true" />
              <span className="hidden xl:inline">جستجو</span>
              <kbd className="hidden 2xl:inline-block text-[10px] bg-stone-200 text-stone-600 px-1 py-0.2 rounded font-mono">
                /
              </kbd>
            </button>

            {/* کلید افزودن سریع در دسکتاپ و تبلت */}
            <button
              type="button"
              onClick={() => store.setQuickAddModalOpen(true)}
              className="min-h-11 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label="افزودن کار، رویداد یا هدف جدید"
              title="افزودن کار، رویداد یا هدف جدید"
            >
              <Plus size={16} className="stroke-[2.5]" aria-hidden="true" />
              <span className="hidden lg:inline">افزودن</span>
            </button>

            {/* منوی تنظیمات */}
            <div className="relative">
              <button
                type="button"
                onClick={handleOpenSettings}
                className="min-w-11 min-h-11 p-2 text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
                aria-label="تنظیمات و گزینه‌ها"
                aria-expanded={menuOpen}
                title="تنظیمات و گزینه‌ها"
              >
                <Settings size={17} aria-hidden="true" />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    role="menu"
                    aria-label="منوی تنظیمات"
                    className="absolute left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-right"
                  >
                    <div className="px-3.5 py-1.5 border-b border-stone-100">
                      <div className="text-xs font-bold text-stone-800">
                        دفتر زندگی من
                      </div>
                      <div className="text-[10px] text-stone-500">
                        نسخه وب و اندروید
                      </div>
                    </div>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        store.updateSettings({
                          lifeDomainsMode: !settings.lifeDomainsMode,
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-stone-100"
                    >
                      <span className="flex items-center gap-1.5">
                        <LayoutGrid size={14} className="text-amber-700" aria-hidden="true" />
                        <span>نمای دسته‌بندی‌شده کارها</span>
                      </span>
                      <span className={`text-[11px] font-bold ${settings.lifeDomainsMode ? 'text-amber-900' : 'text-stone-500'}`}>
                        {settings.lifeDomainsMode ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        store.updateSettings({
                          showGregorian: !settings.showGregorian,
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-stone-100"
                    >
                      <span>نمایش تاریخ میلادی در تقویم</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {settings.showGregorian ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        store.updateSettings({
                          showHolidays: !settings.showHolidays,
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-stone-100"
                    >
                      <span>نمایش مناسبت‌های تقویم</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {settings.showHolidays ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        store.updateSettings({
                          hideGuideBanner: !settings.hideGuideBanner,
                        });
                      }}
                      className="w-full px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer focus:outline-none focus:bg-stone-100"
                    >
                      <span>راهنمای شروع روز</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {!settings.hideGuideBanner ? 'فعال' : 'پنهان'}
                      </span>
                    </button>

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setMenuOpen(false);
                        store.setPhilosophyModalOpen(true);
                      }}
                      className="w-full px-3 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-stone-100"
                    >
                      <BookOpen size={14} className="text-amber-700" aria-hidden="true" />
                      <span>راهنمای جامع کار با دفتر</span>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        if (
                          window.confirm(
                            'آیا مایلید داده‌های نمونه اولیه مجدداً بارگذاری شوند؟'
                          )
                        ) {
                          store.resetToDemoData();
                          setMenuOpen(false);
                        }
                      }}
                      className="w-full px-3 py-2.5 text-xs text-amber-900 hover:bg-amber-50 flex items-center gap-2 cursor-pointer focus:outline-none focus:bg-amber-100/50"
                    >
                      <RotateCcw size={14} className="text-amber-700" aria-hidden="true" />
                      <span>بارگذاری مجدد داده‌های نمونه</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* شیت تنظیمات اختصاصی اندروید */}
      <AndroidSettingsSheet
        isOpen={settingsSheetOpen}
        onClose={() => setSettingsSheetOpen(false)}
      />
    </>
  );
};
