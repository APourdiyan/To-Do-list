import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getMonthGrid,
  getWeekDays,
  getTodayJalali,
  formatJalaliDate,
  PERSIAN_WEEKDAYS,
  toPersianDigits,
  getPersianSeasonName,
  getPersianMonthName,
  jalaaliMonthLength,
  addDaysJalali,
} from '../../lib/date/jalali';
import { getOccasionForDate } from '../../data/holidays';
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sparkles,
  Wallet,
  BookCheck,
  RotateCcw,
  CalendarRange,
  Rows3,
  CalendarDays,
} from 'lucide-react';
import { WeeklyReflectionModal } from './WeeklyReflectionModal';

export const InlinePersianMonthCalendar: React.FC = () => {
  const {
    tasks,
    selectedDate,
    dailyExpenses,
    dailyAccountings,
    checklistLogs,
    checklistItems,
  } = useStore();
  const today = getTodayJalali();

  const [currentJy, setCurrentJy] = useState(today.jy);
  const [currentJm, setCurrentJm] = useState(today.jm);
  // حالت نمایش: ماهانه یا نواری هفتگی (به‌ویژه برای صرفه‌جویی در فضای دیداری موبایل)
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [reflectionModalOpen, setReflectionModalOpen] = useState(false);

  const activeSelectedDate = selectedDate || today.dateStr;
  const monthCells = getMonthGrid(currentJy, currentJm);
  const weekCells = getWeekDays(activeSelectedDate);
  const monthName = getPersianMonthName(currentJm);
  const daysInMonth = jalaaliMonthLength(currentJy, currentJm);

  // مناسبت روز انتخاب‌شده
  const activeOccasion = getOccasionForDate(activeSelectedDate);
  const formattedSelected = formatJalaliDate(activeSelectedDate, {
    showWeekday: true,
    showMonthName: true,
    showYear: true,
  });

  // آمار کارهای روز انتخابی
  const dayTasks = tasks.filter((t) => t.dueDate === activeSelectedDate);
  const completedDayTasks = dayTasks.filter((t) => t.completedAt);
  const dayPercent =
    dayTasks.length > 0
      ? Math.round((completedDayTasks.length / dayTasks.length) * 100)
      : 0;

  // آمار چک‌لیست ۶ حوزه امروز
  const todayCompletedHabits = checklistLogs[activeSelectedDate] || [];
  const checklistPercent =
    checklistItems.length > 0
      ? Math.round((todayCompletedHabits.length / checklistItems.length) * 100)
      : 0;

  // مخارج امروز
  const todayExpenses = dailyExpenses.filter((e) => e.date === activeSelectedDate);
  const todayTotalExpense = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handlePrev = () => {
    if (viewMode === 'month') {
      if (currentJm === 1) {
        setCurrentJm(12);
        setCurrentJy(currentJy - 1);
      } else {
        setCurrentJm(currentJm - 1);
      }
    } else {
      // در حالت هفتگی: ۷ روز قبل
      const prevWeekDate = addDaysJalali(activeSelectedDate, -7);
      store.setSelectedDate(prevWeekDate);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      if (currentJm === 12) {
        setCurrentJm(1);
        setCurrentJy(currentJy + 1);
      } else {
        setCurrentJm(currentJm + 1);
      }
    } else {
      // در حالت هفتگی: ۷ روز بعد
      const nextWeekDate = addDaysJalali(activeSelectedDate, 7);
      store.setSelectedDate(nextWeekDate);
    }
  };

  const handleReturnToday = () => {
    setCurrentJy(today.jy);
    setCurrentJm(today.jm);
    store.setSelectedDate(today.dateStr);
  };

  // روزهایی که باید نمایش داده شوند (یا کل ماه یا نواری ۷ روزه هفته جاری)
  const displayCells = viewMode === 'month' ? monthCells : weekCells;

  return (
    <>
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden transition-all">
        {/* سربرگ گاه‌شمار با کنترل فشرده‌سازی و ناوبری */}
        <div className="p-3 sm:p-5 border-b border-stone-100 bg-[#fdfcf9]">
          <div className="flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            {/* سمت راست: عنوان ماه/سال و فصل */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-900 flex items-center justify-center font-bold shrink-0">
                <CalendarIcon size={16} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-sm sm:text-base font-black text-stone-900">
                    {monthName} {toPersianDigits(currentJy)}
                  </h2>
                  <span className="text-[10px] font-semibold bg-stone-200/70 text-stone-600 px-1.5 py-0.5 rounded-md">
                    {getPersianSeasonName(currentJm)}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 font-normal">
                  {viewMode === 'month'
                    ? `${toPersianDigits(daysInMonth)} روز · گاه‌شمار خورشیدی`
                    : 'نمای نواری هفته جاری (تمرکز سریع بر اقدامات)'}
                </p>
              </div>
            </div>

            {/* سمت چپ: دکمه‌های تعویض نما (هفتگی/ماهانه) و جابجایی بین روزها */}
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {/* سوئیچ وضعیت ماهانه / نواری هفتگی */}
              <div className="flex items-center bg-stone-100/90 p-0.5 rounded-xl border border-stone-200/70 text-[11px]">
                <button
                  type="button"
                  onClick={() => setViewMode('month')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === 'month'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="نمایش کامل ۳۰ روز ماه"
                >
                  <CalendarRange size={13} />
                  <span className="hidden sm:inline">ماهانه</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('week')}
                  className={`px-2 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    viewMode === 'week'
                      ? 'bg-white text-stone-900 shadow-2xs'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                  title="نمایش نواری ۷ روز هفته (خلوت و مناسب موبایل)"
                >
                  <Rows3 size={13} />
                  <span>هفتگی</span>
                </button>
              </div>

              {/* کلیدهای ناوبری زمان */}
              <div className="flex items-center bg-stone-100/90 p-0.5 rounded-xl border border-stone-200/70">
                <button
                  onClick={handlePrev}
                  className="p-1 text-stone-600 hover:text-stone-950 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title={viewMode === 'month' ? 'ماه قبل' : 'هفته قبل'}
                >
                  <ChevronRight size={16} />
                </button>
                {activeSelectedDate !== today.dateStr && (
                  <button
                    onClick={handleReturnToday}
                    className="px-2 py-0.5 text-[11px] font-bold text-amber-950 bg-amber-400/80 hover:bg-amber-400 rounded-lg transition-colors cursor-pointer"
                    title="بازگشت به امروز"
                  >
                    امروز
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="p-1 text-stone-600 hover:text-stone-950 hover:bg-white rounded-lg transition-colors cursor-pointer"
                  title={viewMode === 'month' ? 'ماه بعد' : 'هفته بعد'}
                >
                  <ChevronLeft size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* سطر روزهای هفته */}
          <div className="grid grid-cols-7 gap-1 mt-3 text-center">
            {PERSIAN_WEEKDAYS.map((wd, i) => {
              const isFriday = i === 6;
              return (
                <div
                  key={wd}
                  className={`text-[10px] sm:text-[11px] font-bold py-1 ${
                    isFriday ? 'text-amber-800' : 'text-stone-500'
                  }`}
                >
                  {wd.slice(0, 1)}
                </div>
              );
            })}
          </div>

          {/* شبکه یا نوار روزها همراه با هیت‌مپ پیشرفت و مناسبت */}
          <div className="grid grid-cols-7 gap-1 mt-1 text-center">
            {displayCells.map((cell) => {
              const isToday = cell.dateStr === today.dateStr;
              const isSelected = cell.dateStr === activeSelectedDate;
              
              const dayTasksAll = tasks.filter((t) => t.dueDate === cell.dateStr);
              const dayPendingCount = dayTasksAll.filter((t) => !t.completedAt).length;
              const dayCompletedAll = dayTasksAll.length > 0 && dayPendingCount === 0;
              
              const hasChecklistDone = (checklistLogs[cell.dateStr] || []).length > 0;
              const hasAccountingDone = !!dailyAccountings[cell.dateStr];
              const cellOccasion = getOccasionForDate(cell.dateStr);
              const isHoliday = cell.isFriday || cellOccasion?.isHoliday;

              return (
                <button
                  key={cell.dateStr}
                  onClick={() => store.setSelectedDate(cell.dateStr)}
                  className={`relative h-8 sm:h-9.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none text-xs font-semibold ${
                    !cell.isCurrentMonth
                      ? 'text-stone-300 hover:text-stone-600 hover:bg-stone-50'
                      : isSelected
                      ? 'bg-stone-900 text-stone-50 shadow-xs font-bold scale-[1.03]'
                      : isToday
                      ? 'bg-amber-100/90 text-amber-950 border border-amber-300/90 font-bold'
                      : isHoliday
                      ? 'text-amber-900 hover:bg-amber-50/80'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                  title={`${cell.jd} ${monthName} ${cellOccasion?.title ? ` - ${cellOccasion.title}` : ''}`}
                >
                  <span>{toPersianDigits(cell.jd)}</span>

                  {/* نشانگر هیت‌مپ و نقاط وضعیت (کارهای باز / انجام‌شده / مناسبت) */}
                  <div className="flex items-center gap-0.5 mt-0.5 h-1.5">
                    {/* کار باز معوق یا جاری */}
                    {dayPendingCount > 0 && cell.isCurrentMonth && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-amber-400' : 'bg-amber-600'
                        }`}
                        title={`${toPersianDigits(dayPendingCount)} اقدام باقیمانده`}
                      />
                    )}
                    {/* کارهای روز کاملاً تکمیل شده */}
                    {dayCompletedAll && cell.isCurrentMonth && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          isSelected ? 'bg-emerald-300' : 'bg-emerald-500'
                        }`}
                        title="تمام کارهای این روز تکمیل شد"
                      />
                    )}
                    {/* مناسبت یا تعطیلی */}
                    {cellOccasion && cell.isCurrentMonth && (
                      <span
                        className={`w-1 h-1 rounded-full ${
                          cellOccasion.isHoliday ? 'bg-rose-500' : 'bg-stone-400'
                        }`}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* نوار اطلاعات کلیدی و دسترسی‌های متصل به روز انتخاب‌شده */}
        <div className="p-3 sm:p-4 bg-gradient-to-b from-stone-50/70 to-white space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            {/* عنوان روز انتخاب شده */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-stone-900">
                {formattedSelected}
              </span>
              {activeSelectedDate === today.dateStr ? (
                <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-md">
                  امروز
                </span>
              ) : (
                <button
                  onClick={handleReturnToday}
                  className="text-[10px] font-bold bg-stone-200/80 hover:bg-stone-300 text-stone-800 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw size={10} />
                  <span>بازگشت به امروز</span>
                </button>
              )}

              {activeOccasion && (
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                    activeOccasion.isHoliday
                      ? 'bg-rose-100/80 text-rose-800'
                      : 'bg-amber-100/70 text-amber-900'
                  }`}
                >
                  {activeOccasion.title} {activeOccasion.isHoliday && '(تعطیل)'}
                </span>
              )}
            </div>

            {/* دکمه‌های عملیاتی روز: چک‌لیست ۶ حوزه + محاسبه اعمال + کارنامه بازتاب */}
            <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
              <button
                onClick={() => store.setChecklistDrawerOpen(true)}
                className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-950 border border-emerald-300/80 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                title="ثبت عادات روزانه در ۶ ستون بنیادین"
              >
                <BookCheck size={13} className="text-emerald-700" />
                <span>چک‌لیست ۶ حوزه</span>
                {checklistItems.length > 0 && (
                  <span className="text-[9px] bg-emerald-200/80 text-emerald-900 px-1 py-0.2 rounded-md font-mono">
                    {toPersianDigits(todayCompletedHabits.length)}/{toPersianDigits(checklistItems.length)}
                  </span>
                )}
              </button>

              <button
                onClick={() => store.setAccountingModalOpen(true)}
                className="flex-1 sm:flex-initial px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 border border-amber-300/80 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                title="محاسبه روزانه اعمال و ثبت هزینه‌ها"
              >
                <Wallet size={13} className="text-amber-700" />
                <span>محاسبه و مخارج</span>
              </button>

              <button
                onClick={() => setReflectionModalOpen(true)}
                className="px-2.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                title="کارنامه بازتاب هفتگی و ماهانه"
              >
                <Sparkles size={13} className="text-stone-700" />
                <span className="hidden sm:inline">بازتاب</span>
              </button>
            </div>
          </div>

          {/* نوار وضعیت درصد پیشرفت کارهای روز انتخابی */}
          <div className="bg-white rounded-xl border border-stone-200/70 px-3 py-2 flex items-center justify-between text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-amber-600" />
              <span>اقدامات این روز:</span>
              <span className="font-bold font-mono text-stone-900">
                {toPersianDigits(completedDayTasks.length)} از {toPersianDigits(dayTasks.length)} انجام شد
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-16 sm:w-28 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${dayPercent}%` }}
                />
              </div>
              <span className="font-bold font-mono text-stone-800 text-[10px]">
                {toPersianDigits(dayPercent)}٪
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* مدال کارنامه و بازتاب هفتگی و ماهانه */}
      <WeeklyReflectionModal
        isOpen={reflectionModalOpen}
        onClose={() => setReflectionModalOpen(false)}
      />
    </>
  );
};
