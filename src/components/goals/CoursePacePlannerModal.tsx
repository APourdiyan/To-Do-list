import React, { useState, useMemo } from 'react';
import { store } from '../../store/useStore';
import { getTodayJalali, formatJalaliDate, toPersianDigits } from '../../lib/date/jalali';
import {
  calculatePaceByDailyMinutes,
  calculatePaceByTargetDate,
  RestDaysPattern,
} from '../../lib/coursePace';
import { PersianDatePicker } from '../common/PersianDatePicker';
import { Modal } from '../common/Modal';
import {
  Clock,
  Calendar,
  Sparkles,
  CheckCircle2,
  Sliders,
  CalendarDays,
  Target,
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
  const [color] = useState('#2b534b');

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
    <Modal
      id="course-pace-planner-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="برنامه‌ریز هوشمند دوره و مهارت"
      subtitle="ساعت کل دوره را وارد کن؛ دفترچه زمان‌بندی روزانه را برایت محاسبه و می‌چیند"
    >
      {/* بدنه فرم */}
      <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
        
        {/* عنوان دوره */}
        <div className="space-y-1.5">
          <label htmlFor="course-title-input" className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <span>عنوان مهارت یا دوره</span>
            <span className="text-rose-500">*</span>
          </label>
          <input
            id="course-title-input"
            type="text"
            required
            maxLength={150}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: دوره جامع مکالمه زبان انگلیسی، آموزش جامع React، یا کتاب صوتی اثر مرکب"
            className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-800/70 font-medium"
          />
        </div>

        {/* حجم کل دوره به ساعت و تاریخ شروع */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="course-total-hours" className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Clock size={14} className="text-stone-500" aria-hidden="true" />
              <span>کل زمان دوره (به ساعت)</span>
            </label>
            <div className="relative">
              <input
                id="course-total-hours"
                type="number"
                min="1"
                max="1000"
                required
                value={totalHours}
                onChange={(e) => setTotalHours(Math.max(1, Number(e.target.value)))}
                className="w-full bg-white border border-stone-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              />
              <span className="absolute left-3 top-3 text-xs text-stone-500 font-medium">
                ساعت ({toPersianDigits(totalHours * 60)} دقیقه)
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Calendar size={14} className="text-stone-500" aria-hidden="true" />
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
          <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
            <CalendarDays size={14} className="text-stone-500" aria-hidden="true" />
            <span>روزهای یادگیری در هفته</span>
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPattern('all_days')}
              className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-12 ${
                pattern === 'all_days'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">همه روزها</div>
                <div className={`text-[10px] ${pattern === 'all_days' ? 'text-stone-300' : 'text-stone-500'}`}>
                  ۷ روز در هفته (پیوسته)
                </div>
              </div>
              {pattern === 'all_days' && <CheckCircle2 size={16} className="text-amber-400" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setPattern('no_fridays')}
              className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-12 ${
                pattern === 'no_fridays'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">غیر از جمعه‌ها</div>
                <div className={`text-[10px] ${pattern === 'no_fridays' ? 'text-stone-300' : 'text-stone-500'}`}>
                  ۶ روز در هفته (جمعه استراحت)
                </div>
              </div>
              {pattern === 'no_fridays' && <CheckCircle2 size={16} className="text-amber-400" aria-hidden="true" />}
            </button>

            <button
              type="button"
              onClick={() => setPattern('even_days')}
              className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-12 ${
                pattern === 'even_days'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-800 border-stone-300 hover:bg-stone-50'
              }`}
            >
              <div>
                <div className="text-xs font-bold">روزهای زوج تقویم</div>
                <div className={`text-[10px] ${pattern === 'even_days' ? 'text-stone-300' : 'text-stone-500'}`}>
                  شنبه، دوشنبه، چهارشنبه
                </div>
              </div>
              {pattern === 'even_days' && <CheckCircle2 size={16} className="text-amber-400" aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* تب‌های انتخاب نوع محاسبه (بر اساس وقت روزانه یا ددلاین) */}
        <div className="space-y-3 bg-stone-50 border border-stone-200 rounded-2xl p-4">
          <div className="flex border-b border-stone-200 pb-3 gap-2">
            <button
              type="button"
              onClick={() => setCalcMode('by_daily_minutes')}
              className={`min-h-11 flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                calcMode === 'by_daily_minutes'
                  ? 'bg-white text-stone-900 border border-stone-300 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sliders size={14} aria-hidden="true" />
              <span>حالت ۱: بر اساس وقت روزانه‌ام</span>
            </button>

            <button
              type="button"
              onClick={() => setCalcMode('by_deadline')}
              className={`min-h-11 flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                calcMode === 'by_deadline'
                  ? 'bg-white text-stone-900 border border-stone-300 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Target size={14} aria-hidden="true" />
              <span>حالت ۲: بر اساس تاریخ پایان هدف</span>
            </button>
          </div>

          {/* محتوای حالت ۱: وقت روزانه */}
          {calcMode === 'by_daily_minutes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-stone-700">میزان وقتی که روزانه اختصاص می‌دهی:</span>
                <span className="text-xs font-mono font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded">
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
                    className={`min-h-10 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                      dailyMinutes === m
                        ? 'bg-amber-400 text-stone-950 border-amber-400 font-black'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {toPersianDigits(m)} دقیقه
                  </button>
                ))}
              </div>

              {/* کارت هوشمند پیش‌نمایش خروجی محاسبات */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-2 mt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Sparkles size={15} className="text-amber-600 shrink-0" aria-hidden="true" />
                  <span>خروجی برنامه‌ریزی هوشمند:</span>
                </div>
                <p className="text-xs text-stone-800 leading-relaxed font-medium">
                  اگر <strong className="text-stone-950">روزی فقط {toPersianDigits(dailyMinutes)} دقیقه</strong> برای این دوره وقت بگذاری، در <strong className="text-amber-900 font-bold">{toPersianDigits(paceByDaily.totalSessions)} روز</strong> مطالعه تمام می‌شود.
                </p>
                <div className="text-[11px] text-stone-700 flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 border-t border-amber-200/70 font-medium">
                  <span>تاریخ پایان تخمینی: {formatJalaliDate(paceByDaily.estimatedEndDate, { showWeekday: true })}</span>
                  <span>•</span>
                  <span>تعداد جلسات: {toPersianDigits(paceByDaily.totalSessions)} جلسه</span>
                </div>
              </div>
            </div>
          )}

          {/* محتوای حالت ۲: ددلاین */}
          {calcMode === 'by_deadline' && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700 block">
                  می‌خواهی دوره دقیقاً تا چه تاریخی تمام شود؟
                </label>
                <PersianDatePicker
                  value={targetEndDate}
                  onChange={setTargetEndDate}
                  placeholder="انتخاب تاریخ پایان هدف"
                />
              </div>

              {/* کارت هوشمند پیش‌نمایش خروجی محاسبات بر اساس ددلاین */}
              <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                  <Sparkles size={15} className="text-amber-600 shrink-0" aria-hidden="true" />
                  <span>محاسبه تعهد روزانه مورد نیاز:</span>
                </div>
                {paceByDeadline.isFeasible ? (
                  <>
                    <p className="text-xs text-stone-800 leading-relaxed font-medium">
                      برای اتمام دوره ۲۰ ساعته تا تاریخ فوق در طی <strong className="text-stone-950">{toPersianDigits(paceByDeadline.availableStudyDays)} روز مطالعه</strong>، نیاز است <strong className="text-amber-900 font-bold">روزی {toPersianDigits(paceByDeadline.neededMinutesPerDay)} دقیقه</strong> وقت بگذاری.
                    </p>
                    <div className="text-[11px] text-stone-600 pt-1 border-t border-amber-200/70 font-medium">
                      آهنگ مطالعه واقع‌گرایانه و دست‌یافتنی است.
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-rose-800 leading-relaxed font-bold">
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
              className="mt-1 rounded text-stone-900 focus:ring-stone-800 w-4 h-4 cursor-pointer"
            />
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-stone-900">
                چیدن خودکار برنامه در گاه‌شمار و کارهای روزانه (اختیاری)
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed font-medium">
                {autoScheduleTasks
                  ? 'جلسات مطالعه در تاریخ‌های تعیین‌شده به عنوان کار روزانه در تقویم قرار می‌گیرند.'
                  : 'جلسات در تقویم پخش نمی‌شوند؛ دوره به عنوان یک مهارت مستقل با دکمه ثبت سریع جلسه ذخیره می‌شود.'}
              </p>
            </div>
          </label>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800"
          >
            انصراف
          </button>

          <button
            type="submit"
            disabled={!title.trim()}
            className={`min-h-11 px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              title.trim()
                ? 'bg-stone-900 hover:bg-stone-800 active:bg-black text-white shadow-xs cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={16} aria-hidden="true" />
            <span>ثبت و برنامه‌ریزی دوره</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
