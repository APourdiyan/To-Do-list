import React from 'react';
import { useStore } from '../../store/useStore';
import {
  getTodayJalali,
  formatJalaliDate,
  toPersianDigits,
  getPersianSeasonName,
  getPersianMonthName,
  addDaysJalali,
  calcDaysDifference,
} from '../../lib/date/jalali';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import {
  X,
  Sparkles,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Compass,
  Award,
  Wallet,
  Scale,
  BrainCircuit,
  ArrowRight,
} from 'lucide-react';

interface WeeklyReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReflectionModal: React.FC<WeeklyReflectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { tasks, goals, checklistLogs, checklistItems, dailyExpenses, dailyAccountings } = useStore();
  const today = getTodayJalali();

  if (!isOpen) return null;

  // بازه ۷ روز گذشته برای تحلیل هفته
  const last7Days: string[] = [];
  for (let i = 0; i < 7; i++) {
    last7Days.push(addDaysJalali(today.dateStr, -i));
  }

  // کارهای انجام‌شده در ۷ روز گذشته
  const weekTasks = tasks.filter((t) => last7Days.includes(t.dueDate));
  const weekCompletedTasks = weekTasks.filter((t) => !!t.completedAt);
  const weekTaskPercent =
    weekTasks.length > 0
      ? Math.round((weekCompletedTasks.length / weekTasks.length) * 100)
      : 0;

  // آمار عادات ۶ حوزه در این هفته
  let totalHabitChecks = 0;
  last7Days.forEach((dStr) => {
    totalHabitChecks += (checklistLogs[dStr] || []).length;
  });
  const maxPossibleHabits = last7Days.length * (checklistItems.length || 1);
  const habitConsistency = Math.round((totalHabitChecks / maxPossibleHabits) * 100);

  // مجموع مخارج ۷ روز گذشته
  const weekExpenses = dailyExpenses.filter((e) => last7Days.includes(e.date));
  const weekTotalExpense = weekExpenses.reduce((sum, e) => sum + e.amount, 0);

  // تعداد روزهای با محاسبه ثبت‌شده
  const accountedDaysCount = last7Days.filter((dStr) => !!dailyAccountings[dStr]).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-[#fbfaf6] rounded-3xl max-w-xl w-full border border-stone-200/90 shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* سربرگ کارنامه بازتاب */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-900 flex items-center justify-center font-bold">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                کارنامه بازتاب هفتگی و ماهانه
              </h2>
              <p className="text-xs text-stone-500">
                ارزیابی انضباط فردی و پیشرفت در مسیرهای زندگی ({getPersianSeasonName(today.jm)} {toPersianDigits(today.jy)})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* محتوای تحلیلی کارنامه */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* کارت خلاصه ۴ شاخص هفتگی */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* شاخص ۱: کارها */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <CheckCircle2 size={13} className="text-amber-600" />
                تحقق کارها
              </span>
              <div className="text-lg font-black text-stone-900 font-mono">
                {toPersianDigits(weekTaskPercent)}٪
              </div>
              <span className="text-[10px] text-stone-400">
                {toPersianDigits(weekCompletedTasks.length)} از {toPersianDigits(weekTasks.length)} اقدام
              </span>
            </div>

            {/* شاخص ۲: پیوستگی چک‌لیست ۶ حوزه */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <TrendingUp size={13} className="text-emerald-600" />
                پیوستگی عادات
              </span>
              <div className="text-lg font-black text-stone-900 font-mono">
                {toPersianDigits(habitConsistency)}٪
              </div>
              <span className="text-[10px] text-stone-400">
                در ۶ حوزه زندگی
              </span>
            </div>

            {/* شاخص ۳: روزهای محاسبه نفس */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Scale size={13} className="text-stone-700" />
                مراقبه و محاسبه
              </span>
              <div className="text-lg font-black text-stone-900 font-mono">
                {toPersianDigits(accountedDaysCount)} از ۷
              </div>
              <span className="text-[10px] text-stone-400">
                روزهای با ثبت شبانه
              </span>
            </div>

            {/* شاخص ۴: کل مخارج هفته */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
              <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                <Wallet size={13} className="text-amber-700" />
                هزینه‌های هفته
              </span>
              <div className="text-sm font-black text-stone-900 font-mono truncate">
                {toPersianDigits(weekTotalExpense.toLocaleString())}
              </div>
              <span className="text-[10px] text-stone-400">تومان</span>
            </div>
          </div>

          {/* تعادل در ۶ ستون بنیادین زیست فردی */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <Compass size={14} className="text-stone-700" />
                <span>توزیع تمرکز در ۶ ستون زندگی</span>
              </h3>
              <span className="text-[10px] text-stone-500 font-medium">هفته جاری</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SIX_LIFE_DOMAINS.map((domain) => {
                const domainTasks = weekTasks.filter((t) => t.groupId === domain.id);
                const domainDone = domainTasks.filter((t) => t.completedAt).length;

                return (
                  <div
                    key={domain.id}
                    className="p-2.5 rounded-xl border border-stone-100 bg-stone-50/50 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                      <span>{domain.title}</span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        {toPersianDigits(domainDone)}/{toPersianDigits(domainTasks.length)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${domainTasks.length > 0 ? (domainDone / domainTasks.length) * 100 : 0}%`,
                          backgroundColor: domain.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* راهنمای بینش و تأمل برای شروع هفته یا روز جدید */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs space-y-1.5 text-stone-800 leading-relaxed">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <BrainCircuit size={14} className="text-amber-700" />
              <span>اصل اساسی برنامه‌ریزی: تداوم قطره‌ای برتر از تلاش‌های مقطعی است</span>
            </div>
            <p className="text-stone-700 text-[11px]">
              «اگر در یک یا دو روز از برنامه عقب افتادی، هرگز دچار خودسرزنشی نشو. دفتر زندگی برای این است که هر صبح دوباره متولد شوی، اولویت‌های اصلی را مشخص کنی و بدون بار ذهنی گام‌های کوچک و استوار برداری.»
            </p>
          </div>

        </div>

        {/* پانویس */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            بستن کارنامه
          </button>
        </div>
      </div>
    </div>
  );
};
