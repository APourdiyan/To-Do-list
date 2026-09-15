import React, { useState, useMemo } from 'react';
import { store, useStore } from '../../store/useStore';
import { getTodayJalali, formatJalaliDate, toPersianDigits } from '../../lib/date/jalali';
import {
  calculatePaceByDailyMinutes,
  calculatePaceByTargetDate,
  RestDaysPattern,
} from '../../lib/coursePace';
import { PersianDatePicker } from '../common/PersianDatePicker';
import {
  X,
  GraduationCap,
  Clock,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Sliders,
  CalendarDays,
  Flame,
  Info,
} from 'lucide-react';

interface CoursePacePlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoursePacePlannerModal: React.FC<CoursePacePlannerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const today = getTodayJalali();

  // فیلدهای ورودی فرم
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [totalHours, setTotalHours] = useState<number>(20);
  const [startDate, setStartDate] = useState(today.dateStr);
  const [pattern, setPattern] = useState<RestDaysPattern>('all_days');
  const [color, setColor] = useState('#2b534b');

  // حالت محاسبه: بر اساس دقایق روزانه یا بر اساس تاریخ پایان
  const [calcMode, setCalcMode] = useState<'by_daily_minutes' | 'by_deadline'>('by_daily_minutes');
  const [dailyMinutes, setDailyMinutes] = useState<number>(30);
  const [targetEndDate, setTargetEndDate] = useState<string>(
    `${today.jy}/${String(today.jm + 1 > 12 ? 1 : today.jm + 1).padStart(2, '0')}/${String(today.jd).padStart(2, '0')}`
  );

  // گزینه زمان‌بندی اختیاری کارهای تقویمی
  const [autoScheduleTasks, setAutoScheduleTasks] = useState(true);

  // محاسبه پیش‌نمایش در حالت ۱: بر اساس وقت روزانه
  const paceByDaily = useMemo(() => {
    return calculatePaceByDailyMinutes(
      Math.max(1, totalHours),
      Math.max(5, dailyMinutes),
      startDate,
      pattern
    );
  }, [totalHours, dailyMinutes, startDate, pattern]);

  // محاسبه پیش‌نمایش در حالت ۲: بر اساس تاریخ پایان
  const paceByDeadline = useMemo(() => {
    return calculatePaceByTargetDate(
      Math.max(1, totalHours),
      startDate,
      targetEndDate,
      pattern
    );
  }, [totalHours, startDate, targetEndDate, pattern]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    const finalDailyMinutes =
      calcMode === 'by_daily_minutes'
        ? dailyMinutes
        : paceByDeadline.neededMinutesPerDay;

    store.addCourseGoal({
      title: cleanTitle,
      description: description.trim(),
      totalHours,
      dailyMinutes: finalDailyMinutes,
      startDate,
      restDaysPattern: pattern,
      scheduleTasks: autoScheduleTasks,
      color,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-[#fbfaf6] border border-stone-300 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* هدر مدال */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>برنامه‌ریز هوشمند دوره و مهارت</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  آهنگ پیشروی (Pace Planner)
                </span>
              </h3>
              <p className="text-[11px] text-stone-400">
                ساعت دوره را وارد کن؛ دفترچه زمان‌بندی روزانه را برایت محاسبه و می‌چیند.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه فرم */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* عنوان دوره */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <span>عنوان مهارت یا دوره</span>
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثلاً: دوره جامع مکالمه زبان انگلیسی، آموزش جامع React، یا کتاب صوتی اثر مرکب"
              className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400 focus:ring-1 focus:ring-stone-400"
            />
          </div>

          {/* حجم کل دوره به ساعت و تاریخ شروع */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Clock size={13} className="text-stone-500" />
                <span>کل زمان دوره (به ساعت)</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={totalHours}
                  onChange={(e) => setTotalHours(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 font-mono focus:outline-hidden focus:border-stone-400"
                />
                <span className="absolute left-3 top-2.5 text-xs text-stone-400 font-medium">
                  ساعت ({toPersianDigits(totalHours * 60)} دقیقه)
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Calendar size={13} className="text-stone-500" />
                <span>تاریخ شروع مطالعه</span>
              </label>
              <PersianDatePicker
                value={startDate}
                onChange={setStartDate}
                placeholder="تاریخ شروع"
              />
            </div>
          </div>

          {/* الگوی روزهای مطالعه در هفته */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <CalendarDays size={13} className="text-stone-500" />
              <span>روزهای یادگیری در هفته</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPattern('all_days')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                  pattern === 'all_days'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">همه روزها</div>
                  <div className={`text-[10px] ${pattern === 'all_days' ? 'text-stone-300' : 'text-stone-400'}`}>
                    ۷ روز در هفته (پیوسته)
                  </div>
                </div>
                {pattern === 'all_days' && <CheckCircle2 size={14} className="text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setPattern('no_fridays')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                  pattern === 'no_fridays'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">غیر از جمعه‌ها</div>
                  <div className={`text-[10px] ${pattern === 'no_fridays' ? 'text-stone-300' : 'text-stone-400'}`}>
                    ۶ روز در هفته (جمعه استراحت)
                  </div>
                </div>
                {pattern === 'no_fridays' && <CheckCircle2 size={14} className="text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setPattern('even_days')}
                className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                  pattern === 'even_days'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="text-xs font-bold">روزهای زوج تقویم</div>
                  <div className={`text-[10px] ${pattern === 'even_days' ? 'text-stone-300' : 'text-stone-400'}`}>
                    شنبه، دوشنبه، چهارشنبه
                  </div>
                </div>
                {pattern === 'even_days' && <CheckCircle2 size={14} className="text-amber-400" />}
              </button>
            </div>
          </div>

          {/* تب‌های انتخاب نوع محاسبه (بر اساس وقت روزانه یا ددلاین) */}
          <div className="space-y-3 bg-white border border-stone-200 rounded-2xl p-4">
            <div className="flex border-b border-stone-200 pb-3 gap-2">
              <button
                type="button"
                onClick={() => setCalcMode('by_daily_minutes')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  calcMode === 'by_daily_minutes'
                    ? 'bg-stone-100 text-stone-900 border border-stone-300 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sliders size={13} />
                <span>حالت ۱: بر اساس وقت روزانه‌ام</span>
              </button>

              <button
                type="button"
                onClick={() => setCalcMode('by_deadline')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  calcMode === 'by_deadline'
                    ? 'bg-stone-100 text-stone-900 border border-stone-300 shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <TargetIcon size={13} />
                <span>حالت ۲: بر اساس تاریخ پایان هدف</span>
              </button>
            </div>

            {/* محتوای حالت ۱: وقت روزانه */}
            {calcMode === 'by_daily_minutes' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-stone-600">میزان وقتی که روزانه اختصاص می‌دهی:</span>
                  <span className="text-xs font-mono font-bold text-stone-900 bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    {toPersianDigits(dailyMinutes)} دقیقه در روز
                  </span>
                </div>

                {/* دکمه‌های سریع دقایق روزانه */}
                <div className="grid grid-cols-5 gap-1.5">
                  {[15, 30, 45, 60, 90].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDailyMinutes(m)}
                      className={`py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        dailyMinutes === m
                          ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {toPersianDigits(m)} دقیقه
                    </button>
                  ))}
                </div>

                {/* کارت هوشمند پیش‌نمایش خروجی محاسبات */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <Sparkles size={14} className="text-amber-600 shrink-0" />
                    <span>خروجی برنامه‌ریزی هوشمند:</span>
                  </div>
                  <p className="text-xs text-stone-800 leading-relaxed">
                    اگر <strong className="text-stone-950">روزی فقط {toPersianDigits(dailyMinutes)} دقیقه</strong> برای این دوره وقت بگذاری، در <strong className="text-amber-900 font-bold">{toPersianDigits(paceByDaily.totalSessions)} روز</strong> مطالعه تمام می‌شود.
                  </p>
                  <div className="text-[11px] text-stone-600 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 border-t border-amber-200/60 font-mono">
                    <span>تاریخ پایان تخمینی: {formatJalaliDate(paceByDaily.estimatedEndDate, { showWeekday: true })}</span>
                    <span>تعداد جلسات: {toPersianDigits(paceByDaily.totalSessions)} جلسه</span>
                  </div>
                </div>
              </div>
            )}

            {/* محتوای حالت ۲: ددلاین */}
            {calcMode === 'by_deadline' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-stone-600">می‌خواهی دوره دقیقاً تا چه تاریخی تمام شود؟</label>
                  <PersianDatePicker
                    value={targetEndDate}
                    onChange={setTargetEndDate}
                    placeholder="انتخاب تاریخ پایان هدف"
                  />
                </div>

                {/* کارت هوشمند پیش‌نمایش خروجی محاسبات بر اساس ددلاین */}
                <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                    <Sparkles size={14} className="text-amber-600 shrink-0" />
                    <span>محاسبه تعهد روزانه مورد نیاز:</span>
                  </div>
                  {paceByDeadline.isFeasible ? (
                    <>
                      <p className="text-xs text-stone-800 leading-relaxed">
                        برای اتمام دوره ۲۰ ساعته تا تاریخ فوق در طی <strong className="text-stone-950">{toPersianDigits(paceByDeadline.availableStudyDays)} روز مطالعه</strong>، نیاز است <strong className="text-amber-900 font-bold">روزی {toPersianDigits(paceByDeadline.neededMinutesPerDay)} دقیقه</strong> وقت بگذاری.
                      </p>
                      <div className="text-[11px] text-stone-500 pt-1 border-t border-amber-200/60">
                        آهنگ مطالعه واقع‌گرایانه و دست‌یافتنی است.
                      </div>
                    </>
                  ) : (
                    <p className="text-xs text-rose-700 leading-relaxed">
                      مهلت انتخابی بسیار فشرده است (روزی بیش از ۶ ساعت وقت لازم است). لطفاً تاریخ دورتری را انتخاب کنید.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* گزینه اختیاری زمان‌بندی در گاه‌شمار */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 space-y-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={autoScheduleTasks}
                onChange={(e) => setAutoScheduleTasks(e.target.checked)}
                className="mt-0.5 rounded text-amber-500 focus:ring-amber-400 w-4 h-4 cursor-pointer"
              />
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-stone-900">
                  چیدن خودکار برنامه در گاه‌شمار و کارهای روزانه (اختیاری)
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {autoScheduleTasks
                    ? 'جلسات مطالعه در تاریخ‌های تعیین‌شده به عنوان کار روزانه در تقویم قرار می‌گیرند.'
                    : 'جلسات در تقویم پخش نمی‌شوند؛ دوره به عنوان یک مهارت مستقل با دکمه ثبت سریع جلسه ذخیره می‌شود.'}
                </p>
              </div>
            </label>
          </div>

        </form>

        {/* فوتر مدال */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            انصراف
          </button>

          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              title.trim()
                ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-xs cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={15} />
            <span>ثبت و برنامه‌ریزی دوره</span>
          </button>
        </div>
      </div>
    </div>
  );
};

function TargetIcon(props: { size?: number; className?: string }) {
  return (
    <svg
      width={props.size || 16}
      height={props.size || 16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
