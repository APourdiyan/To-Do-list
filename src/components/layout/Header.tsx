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
  Sparkles,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { ActiveTab } from '../../types';
import { AndroidSettingsSheet } from './AndroidSettingsSheet';

export const Header: React.FC = () => {
  const { activeTab, settings } = useStore();
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
    { id: 'today', label: 'امروز', icon: <Sun size={17} /> },
    { id: 'calendar', label: 'گاه‌شمار', icon: <CalendarIcon size={17} /> },
    { id: 'goals', label: 'مسیرها', icon: <Compass size={17} /> },
    { id: 'tasks', label: 'کارها', icon: <CheckSquare size={17} /> },
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
      {/* هدر دسکتاپ (در موبایل و اندروید طبق درخواست کاربر کاملاً حذف شده تا فضا حداکثری و بدون مزاحمت باشد) */}
      <header className="hidden md:block sticky top-0 z-30 bg-[#fbfaf6]/95 backdrop-blur-md border-b border-stone-200/80 px-3 sm:px-6 py-2 sm:py-2.5 transition-all select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* سمت راست: هویت بصری و نشان دفتر زندگی */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-xl bg-stone-900 text-stone-100 flex items-center justify-center shadow-xs border border-stone-800 shrink-0">
              <BookMarked size={18} className="text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight leading-none">
                  دفتر زندگی من
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200/60">
                  نسخه اندروید
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 hidden sm:block font-normal mt-0.5">
                زندگی‌ات را روی تقویم ببین
              </p>
            </div>
          </div>

          {/* میانه: نوار ناوبری اصلی دسکتاپ */}
          <nav className="hidden md:flex items-center p-1 bg-stone-200/60 rounded-xl border border-stone-300/60 shadow-xs">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => store.setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all select-none cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-stone-100 shadow-xs'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-200/50'
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

          {/* سمت چپ: ابزارهای جستجو، تاریخ روز و دکمه اقدام سریع */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* نمایش تاریخ روز در دسکتاپ */}
            <div className="text-left hidden lg:block border-l border-stone-200 pl-3 ml-1">
              <div className="text-xs font-bold text-stone-800">
                {formattedToday}
              </div>
              {settings.showGregorian && gregorianToday && (
                <div className="text-[10px] text-stone-400 font-mono">
                  {gregorianToday}
                </div>
              )}
            </div>

            {/* کلید راهنمای استفاده از دفتر */}
            <button
              onClick={() => store.setPhilosophyModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer"
              title="راهنمای وضوح ذهنی و استفاده از دفتر"
            >
              <BookOpen size={14} className="text-amber-700" />
              <span className="hidden sm:inline">راهنما</span>
            </button>

            {/* کلید جستجوی سراسری */}
            <button
              onClick={() => store.setSearchModalOpen(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/70 border border-stone-200/80 rounded-xl transition-colors cursor-pointer"
              title="جستجوی سریع در تمام دفتر (کلید /)"
            >
              <Search size={14} className="text-stone-600" />
              <span className="hidden sm:inline">جستجو</span>
              <kbd className="hidden sm:inline-block text-[10px] bg-stone-200 text-stone-600 px-1 py-0.2 rounded font-mono">
                /
              </kbd>
            </button>

            {/* کلید افزودن در دسکتاپ */}
            <button
              onClick={() => store.setQuickAddModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="افزودن کار، رویداد یا هدف جدید"
            >
              <Plus size={15} className="stroke-[2.5]" />
              <span>افزودن</span>
            </button>

            {/* منوی تنظیمات (در موبایل شیت باز می‌شود و در دسکتاپ دراپ‌داون) */}
            <div className="relative">
              <button
                onClick={handleOpenSettings}
                className="p-2 text-stone-600 hover:text-stone-900 active:bg-stone-200 bg-stone-100 hover:bg-stone-200/80 border border-stone-200/90 rounded-xl transition-colors cursor-pointer"
                title="تنظیمات و گزینه‌ها"
              >
                <Settings size={16} />
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-58 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 text-right">
                    <div className="px-3.5 py-1.5 border-b border-stone-100">
                      <div className="text-xs font-bold text-stone-800">
                        دفتر زندگی من
                      </div>
                      <div className="text-[10px] text-stone-400">
                        نسخه اندروید و وب
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        store.updateSettings({
                          lifeDomainsMode: !settings.lifeDomainsMode,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <LayoutGrid size={13} className="text-amber-700" />
                        <span>ساختار ۶ حوزه بنیادین زندگی</span>
                      </span>
                      <span className={`text-[11px] font-bold ${settings.lifeDomainsMode ? 'text-amber-900' : 'text-stone-400'}`}>
                        {settings.lifeDomainsMode ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        store.updateSettings({
                          showGregorian: !settings.showGregorian,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>نمایش تاریخ میلادی ثانویه</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {settings.showGregorian ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        store.updateSettings({
                          showHolidays: !settings.showHolidays,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>نمایش مناسبت‌های تقویم</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {settings.showHolidays ? 'فعال' : 'غیرفعال'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        store.updateSettings({
                          hideGuideBanner: !settings.hideGuideBanner,
                        });
                      }}
                      className="w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center justify-between cursor-pointer"
                    >
                      <span>راهنمای ۳ گام شروع روز</span>
                      <span className="text-[11px] font-semibold text-stone-500">
                        {!settings.hideGuideBanner ? 'فعال' : 'پنهان'}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        store.setPhilosophyModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 cursor-pointer"
                    >
                      <BookOpen size={13} className="text-amber-700" />
                      <span>راهنمای جامع کار با دفتر</span>
                    </button>

                    <div className="my-1 border-t border-stone-100" />

                    <button
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
                      className="w-full px-3 py-2 text-xs text-amber-900 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw size={13} className="text-amber-700" />
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
