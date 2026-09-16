import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getMonthGrid,
  getTodayJalali,
  formatJalaliDate,
  formatWeekday,
  PERSIAN_WEEKDAYS,
  PERSIAN_MONTH_NAMES,
  toPersianDigits,
  getGregorianEquivalent,
  calcDaysDifference,
  gregorianToJalali,
  addDaysJalali,
  isValidJalaliDate,
  getPersianSeasonName,
} from '../../lib/date/jalali';
import { getOccasionForDate } from '../../data/holidays';
import { TaskItem } from '../../components/tasks/TaskItem';
import { PersianDatePicker } from '../../components/common/PersianDatePicker';
import { Priority } from '../../types';
import {
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
  ArrowLeftRight,
  Calculator,
  Compass,
  Sun,
  Flame,
  CornerDownLeft,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { tasks, events, goals, selectedDate, domainGroups } = useStore();
  const today = getTodayJalali();

  // ماه و سال نمایش داده شده در تقویم
  const [currentJy, setCurrentJy] = useState(today.jy);
  const [currentJm, setCurrentJm] = useState(today.jm);

  // نمای ماه یا روز
  const [viewMode, setViewMode] = useState<'month' | 'day'>('month');

  // تب ابزارهای تقویم: ماشین حساب فاصله‌سنج و مبدل تاریخ
  const [toolTab, setToolTab] = useState<'none' | 'diff' | 'convert'>('none');

  // ورودی سریع کار برای روز انتخاب‌شده
  const [quickTaskTitle, setQuickTaskTitle] = useState('');
  const [quickTaskPriority, setQuickTaskPriority] = useState<Priority>('medium');

  // متغیرهای فاصله‌سنج تاریخ
  const [diffDate1, setDiffDate1] = useState(selectedDate || today.dateStr);
  const [diffDate2, setDiffDate2] = useState(addDaysJalali(selectedDate || today.dateStr, 30));

  // متغیرهای مبدل تقویم
  const [convJalali, setConvJalali] = useState(selectedDate || today.dateStr);
  const [convGregorian, setConvGregorian] = useState(
    new Date().toISOString().split('T')[0]
  );

  const monthGrid = getMonthGrid(currentJy, currentJm);

  // ناوبری ماه‌ها
  const handlePrevMonth = () => {
    if (currentJm === 1) {
      setCurrentJm(12);
      setCurrentJy(currentJy - 1);
    } else {
      setCurrentJm(currentJm - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentJm === 12) {
      setCurrentJm(1);
      setCurrentJy(currentJy + 1);
    } else {
      setCurrentJm(currentJm + 1);
    }
  };

  const handleReturnToday = () => {
    setCurrentJy(today.jy);
    setCurrentJm(today.jm);
    store.setSelectedDate(today.dateStr);
  };

  // داده‌های روز انتخاب‌شده
  const activeSelectedDate = selectedDate || today.dateStr;
  const selectedOccasion = getOccasionForDate(activeSelectedDate);
  const selectedDayTasks = tasks.filter((t) => t.dueDate === activeSelectedDate);
  const selectedDayEvents = events.filter((e) => e.date === activeSelectedDate);

  // اهدافی که در این ماه فعال هستند
  const monthStartStr = `${currentJy}/${String(currentJm).padStart(2, '0')}/01`;
  const monthEndStr = `${currentJy}/${String(currentJm).padStart(2, '0')}/31`;
  const activeMonthGoals = goals.filter((g) => {
    return g.status === 'active' && g.startDate <= monthEndStr && g.endDate >= monthStartStr;
  });

  // محاسبه فاصله بین دو تاریخ
  const dayDifference =
    isValidJalaliDate(diffDate1) && isValidJalaliDate(diffDate2)
      ? calcDaysDifference(diffDate1, diffDate2)
      : null;

  // ثبت کار سریع در روز انتخاب‌شده
  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    store.addTask({
      title: quickTaskTitle.trim(),
      groupId: domainGroups[0]?.id || 'work',
      dueDate: activeSelectedDate,
      priority: quickTaskPriority,
      subtasks: [],
    });

    setQuickTaskTitle('');
    setQuickTaskPriority('medium');
  };

  // تنظیمات پیش‌فرض ابزار فاصله‌سنج
  const setDiffPreset = (type: 'end-of-month' | 'end-of-year' | 'nowruz') => {
    setDiffDate1(today.dateStr);
    if (type === 'end-of-month') {
      const maxDays = currentJm <= 6 ? 31 : currentJm <= 11 ? 30 : 29;
      setDiffDate2(`${currentJy}/${String(currentJm).padStart(2, '0')}/${maxDays}`);
    } else if (type === 'end-of-year') {
      setDiffDate2(`${today.jy}/12/29`);
    } else if (type === 'nowruz') {
      setDiffDate2(`${today.jy + 1}/01/01`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5" dir="rtl">
      
      {/* نوار کنترل تقویم: تغییر ماه، جهش سال، بازگشت به امروز، ابزارهای تبدیل و فاصله */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs">
        
        {/* راست: ناوبری ماه و جهش سریع سال و ماه */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* فلش‌های قبلی و بعدی */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              title="ماه قبل"
            >
              <ChevronRight size={17} />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-stone-600 hover:text-stone-950 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
              title="ماه بعد"
            >
              <ChevronLeft size={17} />
            </button>
          </div>

          {/* منوی انتخابی سریع ماه و سال (Quick Jump) */}
          <div className="flex items-center gap-1.5">
            <select
              value={currentJm}
              onChange={(e) => setCurrentJm(Number(e.target.value))}
              className="bg-stone-50 border border-stone-200 text-stone-900 font-bold text-sm sm:text-base rounded-xl px-2.5 py-1.5 hover:border-stone-400 focus:outline-hidden cursor-pointer"
            >
              {PERSIAN_MONTH_NAMES.map((name, idx) => (
                <option key={name} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>

            <select
              value={currentJy}
              onChange={(e) => setCurrentJy(Number(e.target.value))}
              className="bg-stone-50 border border-stone-200 text-stone-700 font-bold font-mono text-xs sm:text-sm rounded-xl px-2.5 py-1.5 hover:border-stone-400 focus:outline-hidden cursor-pointer"
            >
              {[today.jy - 2, today.jy - 1, today.jy, today.jy + 1, today.jy + 2].map((y) => (
                <option key={y} value={y}>
                  {toPersianDigits(y)}
                </option>
              ))}
            </select>

            <span className="text-[11px] text-stone-500 hidden md:inline-block pr-1">
              فصل {getPersianSeasonName(currentJm)}
            </span>
          </div>

          <button
            onClick={handleReturnToday}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
              currentJy === today.jy && currentJm === today.jm && selectedDate === today.dateStr
                ? 'bg-amber-100 text-amber-950 border-amber-300'
                : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
            }`}
          >
            <RotateCcw size={12} />
            <span>امروز</span>
          </button>
        </div>

        {/* چپ: ابزارهای تقویم و انتخاب نما */}
        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* سوئیچ نمای ماه / نمای روز */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'month'
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              نمای ماهانه
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'day'
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              جزئیات روز
            </button>
          </div>

          {/* کلیدهای ابزار تقویم */}
          <button
            onClick={() => setToolTab(toolTab === 'diff' ? 'none' : 'diff')}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              toolTab === 'diff'
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-2xs'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
            title="محاسبه دقیق فاصله بین دو تاریخ"
          >
            <Calculator size={14} />
            <span>فاصله‌سنج</span>
          </button>

          <button
            onClick={() => setToolTab(toolTab === 'convert' ? 'none' : 'convert')}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              toolTab === 'convert'
                ? 'bg-amber-100 border-amber-300 text-amber-950 font-bold shadow-2xs'
                : 'border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
            title="تبدیل دوسویه تاریخ خورشیدی و میلادی"
          >
            <ArrowLeftRight size={14} />
            <span>مبدل تقویم</span>
          </button>
        </div>
      </div>

      {/* بخش ابزار بازشو: فاصله‌سنج تاریخ */}
      {toolTab === 'diff' && (
        <div className="bg-amber-50/50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 space-y-3.5 transition-all">
          <div className="flex items-center justify-between border-b border-amber-200/70 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-amber-950 flex items-center gap-2">
              <Calculator size={15} />
              <span>محاسبه‌گر دقیق فاصله زمانی بین دو تاریخ</span>
            </h3>
            <button
              onClick={() => setToolTab('none')}
              className="text-xs text-amber-900 hover:text-amber-950 font-semibold cursor-pointer"
            >
              بستن
            </button>
          </div>

          {/* دکمه‌های آماده محاسباتی */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-stone-500 text-[11px]">محاسبه سریع:</span>
            <button
              onClick={() => setDiffPreset('end-of-month')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-stone-800 hover:bg-amber-100 transition-colors"
            >
              تا پایان همین ماه
            </button>
            <button
              onClick={() => setDiffPreset('end-of-year')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-stone-800 hover:bg-amber-100 transition-colors"
            >
              تا پایان سال ({toPersianDigits(today.jy)})
            </button>
            <button
              onClick={() => setDiffPreset('nowruz')}
              className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-stone-800 hover:bg-amber-100 transition-colors"
            >
              تا نوروز {toPersianDigits(today.jy + 1)}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <PersianDatePicker
              label="تاریخ مبدأ"
              value={diffDate1}
              onChange={setDiffDate1}
              showQuickChips={false}
            />
            <PersianDatePicker
              label="تاریخ مقصد"
              value={diffDate2}
              onChange={setDiffDate2}
              showQuickChips={false}
            />
          </div>

          {dayDifference !== null && (
            <div className="bg-white border border-amber-200/90 rounded-xl p-3.5 max-w-xl flex items-center justify-between shadow-2xs">
              <div>
                <div className="text-[11px] text-stone-500">فاصله زمانی خالص:</div>
                <div className="text-base sm:text-lg font-extrabold text-amber-950 mt-0.5">
                  {toPersianDigits(Math.abs(dayDifference))} روز
                  <span className="text-xs font-normal text-stone-500 mr-2">
                    (معادل {toPersianDigits((Math.abs(dayDifference) / 7).toFixed(1))} هفته یا {toPersianDigits((Math.abs(dayDifference) / 30.4).toFixed(1))} ماه)
                  </span>
                </div>
              </div>
              <div className="text-xs text-stone-600 font-medium">
                {dayDifference > 0
                  ? 'مقصد در آینده است'
                  : dayDifference < 0
                  ? 'مقصد در گذشته است'
                  : 'هر دو تاریخ یکسان هستند'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* بخش ابزار بازشو: مبدل تقویم شمسی و میلادی */}
      {toolTab === 'convert' && (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 sm:p-5 space-y-3.5 transition-all">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
              <ArrowLeftRight size={15} />
              <span>مبدل دوسویه گاه‌شماری هجری شمسی و میلادی</span>
            </h3>
            <button
              onClick={() => setToolTab('none')}
              className="text-xs text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
            >
              بستن
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {/* شمسی به میلادی */}
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2.5">
              <div className="text-xs font-bold text-stone-800">
                خورشیدی ← میلادی
              </div>
              <PersianDatePicker
                label="انتخاب تاریخ خورشیدی"
                value={convJalali}
                onChange={setConvJalali}
                showQuickChips={false}
              />
              {isValidJalaliDate(convJalali) && (
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-700">
                  برابر با:{' '}
                  <span className="font-mono font-bold text-stone-950">
                    {getGregorianEquivalent(convJalali)}
                  </span>
                </div>
              )}
            </div>

            {/* میلادی به شمسی */}
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2.5">
              <div className="text-xs font-bold text-stone-800">
                میلادی ← خورشیدی
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  تاریخ میلادی (تقویم جهانی)
                </label>
                <input
                  type="date"
                  value={convGregorian}
                  onChange={(e) => setConvGregorian(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 text-stone-800 focus:outline-hidden"
                />
              </div>
              {convGregorian && (
                <div className="pt-2 border-t border-stone-100 text-xs text-stone-700">
                  {(() => {
                    const [gy, gm, gd] = convGregorian.split('-').map(Number);
                    if (gy && gm && gd) {
                      const res = gregorianToJalali(gy, gm, gd);
                      return (
                        <>
                          برابر با:{' '}
                          <span className="font-bold text-stone-950">
                            {formatJalaliDate(res.dateStr, { showWeekday: true })}
                          </span>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* بخش نوار اهداف فعال این ماه (اگر وجود داشته باشد) */}
      {activeMonthGoals.length > 0 && (
        <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 overflow-x-auto text-xs">
          <div className="flex items-center gap-1.5 font-bold text-stone-800 shrink-0">
            <Compass size={14} className="text-amber-700" />
            <span>اهداف فعال این ماه:</span>
          </div>
          <div className="flex items-center gap-2 flex-nowrap">
            {activeMonthGoals.map((g) => (
              <span
                key={g.id}
                onClick={() => store.setActiveTab('goals')}
                className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 font-medium text-stone-800 whitespace-nowrap shadow-3xs flex items-center gap-1.5 cursor-pointer hover:border-stone-400 transition-colors"
                title="مشاهده در صفحه اهداف"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: g.color || '#2b534b' }}
                />
                <span className="font-semibold">{g.title}</span>
                <span className="text-[10px] text-stone-500 font-mono">
                  ({toPersianDigits(g.progress)}٪)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* محتوای اصلی تقویم: جدول ماه و پنل متصل روز */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ستون تقویم ماهانه (۸ ستون در دسکتاپ) */}
        <div className="lg:col-span-8 bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-5 shadow-xs space-y-3">
          
          {/* سرستون روزهای هفته (شنبه تا جمعه) با رنگ متمایز جمعه */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pb-2 border-b border-stone-200">
            {PERSIAN_WEEKDAYS.map((dayName, idx) => (
              <div
                key={dayName}
                className={`text-xs font-bold py-1 ${
                  idx === 6 ? 'text-rose-700 bg-rose-50/40 rounded-md' : 'text-stone-700'
                }`}
              >
                <span className="hidden sm:inline">{dayName}</span>
                <span className="sm:hidden">{dayName[0]}</span>
              </div>
            ))}
          </div>

          {/* شبکه روزهای ماه */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthGrid.map((cell) => {
              const occasion = getOccasionForDate(cell.dateStr);
              const isSelected = cell.dateStr === activeSelectedDate;
              const cellTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
              const cellEvents = events.filter((e) => e.date === cell.dateStr);
              const pendingTasks = cellTasks.filter((t) => !t.completedAt);
              const hasHighPriority = pendingTasks.some((t) => t.priority === 'high');

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => store.setSelectedDate(cell.dateStr)}
                  className={`min-h-[75px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-xl border text-right transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isSelected
                      ? 'border-stone-900 ring-2 ring-stone-900/15 bg-amber-50/40 shadow-xs'
                      : cell.isToday
                      ? 'border-amber-400 bg-amber-50/30'
                      : cell.isFriday || occasion?.isHoliday
                      ? 'border-rose-100 bg-rose-50/30 hover:border-rose-300'
                      : cell.isCurrentMonth
                      ? 'border-stone-200/70 hover:border-stone-400 bg-white'
                      : 'border-transparent bg-stone-50/40 text-stone-300 opacity-50'
                  }`}
                >
                  {/* بالای سلول: شماره روز + نشانگر مناسبت / امروز */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold inline-flex items-center justify-center w-6 h-6 rounded-lg ${
                        cell.isToday
                          ? 'bg-amber-400 text-stone-950 font-extrabold shadow-2xs'
                          : isSelected
                          ? 'bg-stone-900 text-stone-100'
                          : cell.isFriday || occasion?.isHoliday
                          ? 'text-rose-700 font-bold'
                          : cell.isCurrentMonth
                          ? 'text-stone-800'
                          : 'text-stone-400'
                      }`}
                    >
                      {toPersianDigits(cell.jd)}
                    </span>

                    {/* نشانگر مناسبت */}
                    {occasion && (
                      <span
                        className={`w-2 h-2 rounded-full ${
                          occasion.isHoliday ? 'bg-rose-600' : 'bg-amber-500'
                        }`}
                        title={occasion.title}
                      />
                    )}
                  </div>

                  {/* میانه سلول: نام مناسبت در نمایشگرهای بزرگ‌تر */}
                  {occasion && cell.isCurrentMonth && (
                    <div
                      className={`text-[9px] truncate font-semibold mt-1 hidden sm:block ${
                        occasion.isHoliday ? 'text-rose-700' : 'text-amber-900'
                      }`}
                      title={occasion.title}
                    >
                      {occasion.title}
                    </div>
                  )}

                  {/* پایین سلول: نشانگر وظایف و رویدادها */}
                  <div className="flex items-center gap-1 mt-auto pt-1 flex-wrap">
                    {pendingTasks.length > 0 && (
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md flex items-center gap-0.5 ${
                          hasHighPriority
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                        }`}
                      >
                        {hasHighPriority && <Flame size={9} className="fill-rose-600 text-rose-600" />}
                        <span>{toPersianDigits(pendingTasks.length)} کار</span>
                      </span>
                    )}

                    {cellEvents.length > 0 && (
                      <span className="text-[9px] font-semibold px-1 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        {toPersianDigits(cellEvents.length)} رویداد
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* راهنمای رنگ‌های گاه‌شمار */}
          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-500" />
              <span>امروز</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>تعطیل رسمی / جمعه</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>مناسبت ملی یا فرهنگی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900" />
              <span>روز انتخاب‌شده</span>
            </div>
          </div>
        </div>

        {/* ستون جزئیات روز انتخاب‌شده (۴ ستون در دسکتاپ) */}
        <div className="lg:col-span-4 bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 sticky top-20">
          
          {/* سربرگ روز انتخاب‌شده */}
          <div className="border-b border-stone-100 pb-3 space-y-1">
            <div className="text-[11px] font-medium text-stone-500 flex items-center justify-between">
              <span>روز انتخاب‌شده در گاه‌شمار</span>
              <span className="font-mono text-stone-400">
                {getGregorianEquivalent(activeSelectedDate)}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-stone-900">
              {formatWeekday(activeSelectedDate)}، {formatJalaliDate(activeSelectedDate, { showWeekday: false })}
            </h3>

            {/* مناسبت روز */}
            {selectedOccasion && (
              <div
                className={`mt-1.5 p-2 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  selectedOccasion.isHoliday
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <Sun size={14} className="shrink-0" />
                <span className="truncate">{selectedOccasion.title}</span>
                {selectedOccasion.isHoliday && (
                  <span className="text-[9px] bg-rose-200 text-rose-950 px-1 py-0.2 rounded mr-auto shrink-0">
                    تعطیل رسمی
                  </span>
                )}
              </div>
            )}
          </div>

          {/* فیلد ورودی سریع کار مستقیم برای این روز */}
          <form onSubmit={handleAddQuickTask} className="space-y-1.5">
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                placeholder="افزودن کار سریع برای این روز..."
                className="flex-1 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:ring-1 focus:ring-stone-800 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={!quickTaskTitle.trim()}
                className="px-2.5 py-1.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-40 text-stone-100 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                title="ثبت کار برای این روز"
              >
                <Plus size={13} />
                <span>ثبت</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-stone-500 px-1">
              <label className="flex items-center gap-1 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={quickTaskPriority === 'high'}
                  onChange={(e) => setQuickTaskPriority(e.target.checked ? 'high' : 'medium')}
                  className="rounded text-rose-600 focus:ring-0"
                />
                <span className={quickTaskPriority === 'high' ? 'font-bold text-rose-700' : ''}>
                  اولویت فوری امروز
                </span>
              </label>

              <button
                type="button"
                onClick={() => store.setQuickAddModalOpen(true, 'task')}
                className="text-stone-600 hover:text-stone-900 underline"
              >
                فرم تفصیلی
              </button>
            </div>
          </form>

          {/* دکمه‌های سریع برای رویداد یا مشاهده روز جاری */}
          <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
            <button
              onClick={() => store.setQuickAddModalOpen(true, 'event')}
              className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-stone-200 cursor-pointer"
            >
              <Clock size={12} />
              <span>ثبت قرار زمانی</span>
            </button>

            {activeSelectedDate === today.dateStr && (
              <button
                onClick={() => store.setActiveTab('today')}
                className="flex-1 bg-amber-100 hover:bg-amber-200 text-amber-950 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors border border-amber-300 cursor-pointer"
              >
                <Compass size={12} />
                <span>دفترچه امروز</span>
              </button>
            )}
          </div>

          {/* رویدادهای این روز */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>قرارهای زمانی و رویدادها</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {toPersianDigits(selectedDayEvents.length)} مورد
              </span>
            </div>

            {selectedDayEvents.length === 0 ? (
              <div className="text-[11px] text-stone-400 bg-stone-50 rounded-lg p-2 text-center border border-dashed border-stone-200">
                هیچ رویدادی برای این روز ثبت نشده است
              </div>
            ) : (
              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {selectedDayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">{evt.title}</div>
                      {evt.startTime && (
                        <div className="text-[10px] text-amber-900 font-mono flex items-center gap-1">
                          <Clock size={10} />
                          <span>{evt.startTime}{evt.endTime ? ` تا ${evt.endTime}` : ''}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => store.deleteEvent(evt.id)}
                      className="text-stone-400 hover:text-rose-600 text-xs p-1"
                      title="حذف رویداد"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* وظایف این روز (فشرده، با امکان تیک زدن و کلیک برای جزئیات) */}
          <div className="space-y-2 pt-2 border-t border-stone-100">
            <div className="text-xs font-bold text-stone-800 flex items-center justify-between">
              <span>کارهای این روز</span>
              <span className="text-[10px] text-stone-400 font-normal">
                {toPersianDigits(selectedDayTasks.length)} مورد
              </span>
            </div>

            {selectedDayTasks.length === 0 ? (
              <div className="text-[11px] text-stone-400 bg-stone-50 rounded-lg p-3 text-center border border-dashed border-stone-200">
                کاری برای این تاریخ برنامه‌ریزی نشده است
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-0.5">
                {selectedDayTasks.map((t) => (
                  <TaskItem key={t.id} task={t} compact />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
