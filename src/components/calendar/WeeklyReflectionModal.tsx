import React from 'react';
import { useStore } from '../../store/useStore';
import {
  getTodayJalali,
  toPersianDigits,
  getPersianSeasonName,
  addDaysJalali,
} from '../../lib/date/jalali';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import { Modal } from '../common/Modal';
import {
  CheckCircle2,
  TrendingUp,
  Compass,
  Wallet,
  Scale,
  BrainCircuit,
} from 'lucide-react';

interface WeeklyReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WeeklyReflectionModal: React.FC<WeeklyReflectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const tasks = useStore((s) => s.tasks);
  const checklistLogs = useStore((s) => s.checklistLogs);
  const checklistItems = useStore((s) => s.checklistItems);
  const dailyExpenses = useStore((s) => s.dailyExpenses);
  const dailyAccountings = useStore((s) => s.dailyAccountings);

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
    <Modal
      id="weekly-reflection-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title="کارنامه بازتاب هفتگی و ماهانه"
      subtitle={`ارزیابی انضباط فردی و پیشرفت در مسیرهای زندگی (${getPersianSeasonName(today.jm)} ${toPersianDigits(today.jy)})`}
    >
      <div className="p-4 sm:p-6 space-y-5">
        {/* کارت خلاصه ۴ شاخص هفتگی */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* شاخص ۱: کارها */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
              <CheckCircle2 size={14} className="text-amber-600" aria-hidden="true" />
              تحقق کارها
            </span>
            <div className="text-lg font-black text-stone-900 font-mono">
              {toPersianDigits(weekTaskPercent)}٪
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              {toPersianDigits(weekCompletedTasks.length)} از {toPersianDigits(weekTasks.length)} اقدام
            </span>
          </div>

          {/* شاخص ۲: پیوستگی چک‌لیست ۶ حوزه */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-700" aria-hidden="true" />
              پیوستگی عادات
            </span>
            <div className="text-lg font-black text-stone-900 font-mono">
              {toPersianDigits(habitConsistency)}٪
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              در ۶ حوزه زندگی
            </span>
          </div>

          {/* شاخص ۳: روزهای محاسبه نفس */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
              <Scale size={14} className="text-stone-700" aria-hidden="true" />
              مراقبه و محاسبه
            </span>
            <div className="text-lg font-black text-stone-900 font-mono">
              {toPersianDigits(accountedDaysCount)} از ۷
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              روزهای با ثبت شبانه
            </span>
          </div>

          {/* شاخص ۴: کل مخارج هفته */}
          <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
            <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
              <Wallet size={14} className="text-amber-700" aria-hidden="true" />
              هزینه‌های هفته
            </span>
            <div className="text-sm font-black text-stone-900 font-mono truncate">
              {toPersianDigits(weekTotalExpense.toLocaleString())}
            </div>
            <span className="text-[10px] text-stone-500 font-medium">تومان</span>
          </div>
        </div>

        {/* تعادل در ۶ ستون بنیادین زیست فردی */}
        <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <Compass size={15} className="text-stone-700" aria-hidden="true" />
              <span>توزیع تمرکز در ۶ ستون زندگی</span>
            </h3>
            <span className="text-[10px] text-stone-600 font-bold bg-white px-2 py-0.5 rounded border border-stone-200">
              هفته جاری
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {SIX_LIFE_DOMAINS.map((domain) => {
              const domainTasks = weekTasks.filter((t) => t.groupId === domain.id);
              const domainDone = domainTasks.filter((t) => t.completedAt).length;

              return (
                <div
                  key={domain.id}
                  className="p-3 rounded-xl border border-stone-200 bg-white space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                    <span>{domain.title}</span>
                    <span className="text-[10px] text-stone-600 font-mono">
                      {toPersianDigits(domainDone)}/{toPersianDigits(domainTasks.length)}
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-valuenow={domainTasks.length > 0 ? Math.round((domainDone / domainTasks.length) * 100) : 0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`میزان انجام کارهای حوزه ${domain.title}`}
                    className="w-full bg-stone-200 rounded-full h-2 overflow-hidden"
                  >
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
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-xs space-y-1.5 text-stone-900 leading-relaxed font-medium">
          <div className="font-bold flex items-center gap-1.5 text-amber-950">
            <BrainCircuit size={16} className="text-amber-700" aria-hidden="true" />
            <span>اصل اساسی برنامه‌ریزی: تداوم قطره‌ای برتر از تلاش‌های مقطعی است</span>
          </div>
          <p className="text-stone-700 text-[11px] leading-relaxed">
            «اگر در یک یا دو روز از برنامه عقب افتادی، هرگز دچار خودسرزنشی نشو. دفتر زندگی برای این است که هر صبح دوباره متولد شوی، اولویت‌های اصلی را مشخص کنی و بدون بار ذهنی گام‌های کوچک و استوار برداری.»
          </p>
        </div>
      </div>

      {/* پانویس */}
      <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-end">
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 px-5 py-2 bg-stone-900 text-stone-100 hover:bg-stone-800 active:bg-black rounded-xl text-xs font-bold transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
        >
          بستن کارنامه
        </button>
      </div>
    </Modal>
  );
};
