import React, { useState, useMemo } from 'react';
import { useStore, store } from '../../store/useStore';
import { Goal, GoalLevel, GoalSeason } from '../../types';
import {
  formatJalaliDate,
  calcDaysDifference,
  getTodayJalali,
  toPersianDigits,
  PERSIAN_MONTH_NAMES,
  getPersianSeasonName,
  parseJalaliDate,
} from '../../lib/date/jalali';
import { PersianDatePicker } from '../../components/common/PersianDatePicker';
import { CoursePacePlannerModal } from '../../components/goals/CoursePacePlannerModal';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Compass,
  Plus,
  Target,
  Layers,
  Calendar,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CalendarRange,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  CheckSquare,
  Sun,
  Flame,
  Snowflake,
  Trees,
} from 'lucide-react';

const SEASONS_CONFIG: Record<
  GoalSeason,
  { name: string; icon: string; months: number[]; color: string; desc: string }
> = {
  spring: {
    name: 'بهار',
    icon: '🌱',
    months: [1, 2, 3],
    color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
    desc: 'فروردین · اردیبهشت · خرداد',
  },
  summer: {
    name: 'تابستان',
    icon: '☀️',
    months: [4, 5, 6],
    color: 'border-amber-200 bg-amber-50/50 text-amber-900',
    desc: 'تیر · مرداد · شهریور',
  },
  autumn: {
    name: 'پاییز',
    icon: '🍂',
    months: [7, 8, 9],
    color: 'border-orange-200 bg-orange-50/50 text-orange-900',
    desc: 'مهر · آبان · آذر',
  },
  winter: {
    name: 'زمستان',
    icon: '❄️',
    months: [10, 11, 12],
    color: 'border-blue-200 bg-blue-50/50 text-blue-900',
    desc: 'دی · بهمن · اسفند',
  },
};

export const GoalsView: React.FC = () => {
  const { goals, tasks } = useStore();
  const today = getTodayJalali();

  // دو دسته اصلی هدف‌گذاری طبق درخواست: سالانه و فصلی
  const [mainCategory, setMainCategory] = useState<'seasonal' | 'annual'>('seasonal');

  // فصل انتخابی در تب فصلی
  const [selectedSeason, setSelectedSeason] = useState<GoalSeason>(() => {
    if (today.jm <= 3) return 'spring';
    if (today.jm <= 6) return 'summer';
    if (today.jm <= 9) return 'autumn';
    return 'winter';
  });

  // سال انتخابی
  const [selectedYear, setSelectedYear] = useState<number>(today.jy);

  // وضعیت باز بودن آکاردئون آبشاری هر ماه (برای جلوگیری از شلوغی صفحه)
  // به صورت پیش‌فرض فقط ماه جاری باز است
  const [openMonths, setOpenMonths] = useState<Record<number, boolean>>({
    [today.jm]: true,
  });

  // مدال‌ها
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCoursePlannerOpen, setIsCoursePlannerOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  // فیلدهای فرم افزودن/ویرایش
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formLevel, setFormLevel] = useState<GoalLevel>('seasonal');
  const [formSeason, setFormSeason] = useState<GoalSeason>(selectedSeason);
  const [formStartDate, setFormStartDate] = useState(today.dateStr);
  const [formEndDate, setFormEndDate] = useState(`${today.jy}/12/29`);
  const [formProgress, setFormProgress] = useState(0);
  const [formParentId, setFormParentId] = useState<string>('');

  // جابجایی حالت باز بودن ماه در آکاردئون آبشاری
  const toggleMonthAccordion = (monthNumber: number) => {
    setOpenMonths((prev) => ({
      ...prev,
      [monthNumber]: !prev[monthNumber],
    }));
  };

  const handleExpandAllMonths = () => {
    const allOpen: Record<number, boolean> = {};
    for (let m = 1; m <= 12; m++) allOpen[m] = true;
    setOpenMonths(allOpen);
  };

  const handleCollapseAllMonths = () => {
    setOpenMonths({});
  };

  // ۱. اهداف سالانه (Annual Goals)
  const annualGoals = useMemo(() => {
    return goals.filter((g) => {
      if (g.level === 'annual' || g.level === 'long') return true;
      const start = parseJalaliDate(g.startDate);
      const end = parseJalaliDate(g.endDate);
      if (!start || !end) return false;
      return end.jy > start.jy || end.jm - start.jm >= 6;
    });
  }, [goals]);

  // ۲. محاسبه گروه‌های ماهانه برای فصل انتخابی (یا تمام ماه‌ها)
  const seasonMonthsList = SEASONS_CONFIG[selectedSeason].months;

  const seasonalMonthsData = useMemo(() => {
    return seasonMonthsList.map((m) => {
      const monthGoals = goals.filter((g) => {
        // اگر هدف سطح فصلی با همین فصل باشد
        if (g.season === selectedSeason && g.level === 'seasonal') {
          // اگر تاریخ ماه هدف منطبق باشد
          const end = parseJalaliDate(g.endDate);
          if (end && end.jm === m) return true;
        }

        const start = parseJalaliDate(g.startDate);
        const end = parseJalaliDate(g.endDate);
        if (!start || !end) return false;

        // اگر پایان هدف در این ماه باشد
        if (end.jy === selectedYear && end.jm === m) return true;

        // یا اگر بازه زمانی هدف این ماه را در بر می‌گیرد
        const monthStartNum = selectedYear * 100 + m;
        const goalStartNum = start.jy * 100 + start.jm;
        const goalEndNum = end.jy * 100 + end.jm;
        return monthStartNum >= goalStartNum && monthStartNum <= goalEndNum;
      });

      const avgProgress =
        monthGoals.length > 0
          ? Math.round(
              monthGoals.reduce((sum, g) => sum + g.progress, 0) / monthGoals.length
            )
          : 0;

      return {
        monthNumber: m,
        monthName: PERSIAN_MONTH_NAMES[m - 1],
        isCurrentMonth: selectedYear === today.jy && today.jm === m,
        goals: monthGoals,
        averageProgress: avgProgress,
      };
    });
  }, [goals, selectedSeason, selectedYear, seasonMonthsList, today]);

  // باز کردن مدال برای ایجاد هدف جدید
  const handleOpenCreate = (targetMonth?: number, level: GoalLevel = 'seasonal') => {
    setEditingGoal(null);
    setFormTitle('');
    setFormDescription('');
    setFormLevel(level);
    setFormSeason(selectedSeason);

    if (level === 'annual') {
      setFormStartDate(`${selectedYear}/01/01`);
      setFormEndDate(`${selectedYear}/12/29`);
    } else if (targetMonth) {
      const mStr = String(targetMonth).padStart(2, '0');
      setFormStartDate(`${selectedYear}/${mStr}/01`);
      setFormEndDate(`${selectedYear}/${mStr}/30`);
    } else {
      const mFirst = String(seasonMonthsList[0]).padStart(2, '0');
      const mLast = String(seasonMonthsList[2]).padStart(2, '0');
      setFormStartDate(`${selectedYear}/${mFirst}/01`);
      setFormEndDate(`${selectedYear}/${mLast}/30`);
    }

    setFormProgress(0);
    setFormParentId('');
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormDescription(goal.description || '');
    setFormLevel(goal.level);
    setFormSeason(goal.season || selectedSeason);
    setFormStartDate(goal.startDate);
    setFormEndDate(goal.endDate);
    setFormProgress(goal.progress);
    setFormParentId(goal.parentGoalId || '');
    setIsCreateModalOpen(true);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingGoal) {
      store.updateGoal(editingGoal.id, {
        title: formTitle.trim(),
        description: formDescription.trim(),
        level: formLevel,
        season: formLevel === 'seasonal' ? formSeason : undefined,
        startDate: formStartDate,
        endDate: formEndDate,
        progress: formProgress,
        parentGoalId: formParentId || undefined,
      });
    } else {
      store.addGoal({
        title: formTitle.trim(),
        description: formDescription.trim(),
        level: formLevel,
        season: formLevel === 'seasonal' ? formSeason : undefined,
        startDate: formStartDate,
        endDate: formEndDate,
        progress: formProgress,
        status: 'active',
        parentGoalId: formParentId || undefined,
      });
    }

    setIsCreateModalOpen(false);
  };

  // کارت یک هدف
  const renderGoalCard = (goal: Goal) => {
    const parent = goals.find((g) => g.id === goal.parentGoalId);
    const relatedTasks = tasks.filter((t) => t.goalId === goal.id);
    const completedTasks = relatedTasks.filter((t) => !!t.completedAt);
    const daysDiff = calcDaysDifference(today.dateStr, goal.endDate);

    return (
      <div
        key={goal.id}
        className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs hover:shadow-xs transition-all space-y-3"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            {parent && (
              <div className="text-[10px] text-stone-500 flex items-center gap-1">
                <span className="text-stone-400">وابسته به:</span>
                <span className="font-semibold text-stone-700 truncate">{parent.title}</span>
              </div>
            )}
            <h4 className="text-sm font-extrabold text-stone-900 leading-snug break-words">
              {goal.title}
            </h4>
            {goal.description && (
              <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                {goal.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => handleOpenEdit(goal)}
              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="ویرایش"
            >
              <Edit3 size={14} />
            </button>
            <button
              onClick={() => store.deleteGoal(goal.id)}
              className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              title="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* برچسب‌های اطلاعاتی */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
            {goal.level === 'annual' || goal.level === 'long'
              ? 'هدف سالانه'
              : goal.level === 'seasonal'
              ? 'هدف فصلی'
              : 'هدف ماهانه'}
          </span>

          {goal.courseDetails && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <GraduationCap size={11} />
              <span>دوره آموزشی {toPersianDigits(goal.courseDetails.totalHours)} ساعته</span>
            </span>
          )}
        </div>

        {/* نوار پیشرفت */}
        <div className="space-y-1 pt-1 border-t border-stone-100">
          <div className="flex justify-between text-[11px]">
            <span className="text-stone-500 flex items-center gap-1">
              <TrendingUp size={12} />
              <span>پیشرفت هدف</span>
            </span>
            <span className="font-bold text-stone-900 font-mono">
              {toPersianDigits(goal.progress)}٪
            </span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            />
          </div>
        </div>

        {/* بازه تقویمی و روزهای باقیمانده */}
        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-0.5">
          <span className="font-mono">
            تا {formatJalaliDate(goal.endDate, { showMonthName: true, showYear: false })}
          </span>
          <span className={daysDiff < 7 ? 'text-amber-800 font-bold' : 'text-stone-600'}>
            {daysDiff > 0 ? `${toPersianDigits(daysDiff)} روز مانده` : 'موعد سررسید'}
          </span>
        </div>

        {/* خلاصه کارهای متصل */}
        {relatedTasks.length > 0 && (
          <div className="bg-stone-50 rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px] text-stone-600 border border-stone-200/60">
            <div className="flex items-center gap-1">
              <CheckSquare size={12} className="text-stone-400" />
              <span>
                {toPersianDigits(completedTasks.length)} از {toPersianDigits(relatedTasks.length)} کار انجام شد
              </span>
            </div>
            <button
              onClick={() => store.setActiveTab('tasks')}
              className="text-stone-800 hover:text-stone-950 font-bold cursor-pointer"
            >
              مشاهده کارها
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6" dir="rtl">
      {/* سربرگ بخش اهداف */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 flex items-center gap-2.5">
            <Compass size={24} className="text-stone-800" />
            <span>اهداف و دوره‌های آموزشی</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            دسته‌بندی اهداف بر اساس دوره‌های زمانی سالانه، فصلی و ماهانه.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setIsCoursePlannerOpen(true)}
            className="bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            title="برنامه‌ریزی دوره‌های ساعتی"
          >
            <GraduationCap size={15} className="text-amber-400" />
            <span>برنامه‌ریزی دوره جدید</span>
          </button>

          <button
            onClick={() => handleOpenCreate(undefined, mainCategory)}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={15} className="stroke-[2.5]" />
            <span>
              {mainCategory === 'annual' ? 'تعریف هدف سالانه' : 'تعریف هدف فصلی'}
            </span>
          </button>
        </div>
      </div>

      {/* دو تب اصلی هدف‌گذاری: سالانه و فصلی */}
      <div className="flex items-center justify-between gap-3 border-b border-stone-200 pb-2 flex-wrap">
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-2xl border border-stone-200">
          <button
            onClick={() => setMainCategory('seasonal')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainCategory === 'seasonal'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <CalendarRange size={15} />
            <span>اهداف فصلی و ماهانه</span>
          </button>

          <button
            onClick={() => setMainCategory('annual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              mainCategory === 'annual'
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            <Target size={15} />
            <span>اهداف سالانه ({toPersianDigits(annualGoals.length)})</span>
          </button>
        </div>

        {/* کنترل‌های سال */}
        <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
          <span>سال:</span>
          <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl px-2 py-1">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="p-0.5 hover:text-stone-900 cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
            <span className="font-mono text-stone-900 px-1 font-bold">
              {toPersianDigits(selectedYear)}
            </span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="p-0.5 hover:text-stone-900 cursor-pointer"
            >
              <ChevronLeft size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ۱. نمایش اهداف سالانه */}
      {mainCategory === 'annual' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50/80 to-stone-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Target size={18} className="text-amber-700" />
                <span>اهداف کلان سال {toPersianDigits(selectedYear)} خورشیدی</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                مهم‌ترین مقاصدی که می‌خواهید تا پایان این سال محقق شوند.
              </p>
            </div>

            <button
              onClick={() => handleOpenCreate(undefined, 'annual')}
              className="px-3.5 py-1.5 text-xs font-bold bg-amber-400 text-stone-950 rounded-xl shadow-2xs hover:bg-amber-300 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>افزودن هدف سالانه</span>
            </button>
          </div>

          {annualGoals.length === 0 ? (
            <EmptyState
              id="empty-annual-goals"
              icon={Target}
              title="هنوز هدف سالانه‌ای برای این سال ثبت نشده است"
              description="اهداف سالانه قطب‌نمای حرکت شما در طول فصول مختلف هستند."
              action={{
                label: 'تعریف اولین هدف سالانه',
                onClick: () => handleOpenCreate(undefined, 'annual'),
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {annualGoals.map((goal) => renderGoalCard(goal))}
            </div>
          )}
        </div>
      )}

      {/* ۲. نمایش اهداف فصلی با ماه‌های آبشاری (Seasonal & Cascading Months) */}
      {mainCategory === 'seasonal' && (
        <div className="space-y-6">
          {/* ناوبری ۴ فصل: بهار، تابستان، پاییز، زمستان */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(Object.entries(SEASONS_CONFIG) as [GoalSeason, typeof SEASONS_CONFIG[GoalSeason]][]).map(
              ([sKey, conf]) => {
                const isSelected = selectedSeason === sKey;
                const isCurrentSeason =
                  (sKey === 'spring' && today.jm <= 3) ||
                  (sKey === 'summer' && today.jm >= 4 && today.jm <= 6) ||
                  (sKey === 'autumn' && today.jm >= 7 && today.jm <= 9) ||
                  (sKey === 'winter' && today.jm >= 10);

                return (
                  <button
                    key={sKey}
                    onClick={() => setSelectedSeason(sKey)}
                    className={`p-3 rounded-2xl border text-right transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-stone-900 text-stone-50 border-stone-900 shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base">{conf.icon}</span>
                      {isCurrentSeason && (
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-amber-400 text-stone-950' : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          فصل جاری
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black">{conf.name}</div>
                    <div
                      className={`text-[10px] mt-0.5 truncate ${
                        isSelected ? 'text-stone-300' : 'text-stone-500'
                      }`}
                    >
                      {conf.desc}
                    </div>
                  </button>
                );
              }
            )}
          </div>

          {/* نوار بالایی ماه‌های آبشاری فصل */}
          <div className="flex items-center justify-between text-xs text-stone-600 px-1">
            <span className="font-bold text-stone-800">
              ماه‌های فصل {SEASONS_CONFIG[selectedSeason].name} (کلیک بر روی هر ماه برای باز/بسته شدن آبشاری):
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExpandAllMonths}
                className="text-[11px] font-bold text-stone-700 hover:text-stone-950 underline cursor-pointer"
              >
                باز کردن همه
              </button>
              <span>·</span>
              <button
                onClick={handleCollapseAllMonths}
                className="text-[11px] font-bold text-stone-700 hover:text-stone-950 underline cursor-pointer"
              >
                بستن همه
              </button>
            </div>
          </div>

          {/* لیست ۳ ماهه فصل به صورت آبشاری / آکاردئونی (Collapsible Accordion) */}
          <div className="space-y-3">
            {seasonalMonthsData.map((mGroup) => {
              const isOpen = !!openMonths[mGroup.monthNumber];
              const goalCount = mGroup.goals.length;

              return (
                <div
                  key={mGroup.monthNumber}
                  className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
                >
                  {/* نوار سربرگ ماه (آبشاری - کلیک برای باز و بسته شدن) */}
                  <div
                    onClick={() => toggleMonthAccordion(mGroup.monthNumber)}
                    className={`p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                      isOpen
                        ? 'bg-[#fcfbf9] border-b border-stone-100'
                        : 'bg-white hover:bg-stone-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-stone-900 flex items-center justify-center font-bold text-xs shrink-0">
                        {toPersianDigits(mGroup.monthNumber)}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-stone-900">
                          ماه {mGroup.monthName} {toPersianDigits(selectedYear)}
                        </span>
                        {mGroup.isCurrentMonth && (
                          <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-md">
                            ماه جاری
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded-md">
                        {toPersianDigits(goalCount)} هدف
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {goalCount > 0 && (
                        <div className="hidden sm:flex items-center gap-2 text-xs">
                          <span className="text-stone-500 text-[11px]">پیشرفت:</span>
                          <span className="font-mono font-bold text-amber-900">
                            {toPersianDigits(mGroup.averageProgress)}٪
                          </span>
                        </div>
                      )}

                      <div className="p-1 text-stone-400 hover:text-stone-700">
                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* محتوای بازشونده ماه (آبشاری) */}
                  {isOpen && (
                    <div className="p-4 sm:p-5 bg-stone-50/40 space-y-4">
                      {/* دکمه افزودن هدف جدید به این ماه */}
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleOpenCreate(mGroup.monthNumber, 'seasonal')}
                          className="px-3 py-1.5 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                        >
                          <Plus size={13} />
                          <span>افزودن هدف برای {mGroup.monthName}</span>
                        </button>
                      </div>

                      {goalCount === 0 ? (
                        <EmptyState
                          id={`empty-month-goals-${mGroup.monthNumber}`}
                          icon={Target}
                          title={`هنوز هدفی برای ماه ${mGroup.monthName} ثبت نشده است`}
                          description="می‌توانید برای این ماه هدف جدیدی تعیین کرده و آن را به اقدامات خرد تبدیل کنید."
                          action={{
                            label: `ثبت اولین هدف ${mGroup.monthName}`,
                            onClick: () => handleOpenCreate(mGroup.monthNumber, 'seasonal'),
                          }}
                        />
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                          {mGroup.goals.map((goal) => renderGoalCard(goal))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* مدال افزودن / ویرایش هدف */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 space-y-4 shadow-2xl border border-stone-200 text-right">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-extrabold text-stone-900 flex items-center gap-2">
                <Target size={18} className="text-amber-600" />
                <span>{editingGoal ? 'ویرایش هدف' : 'تعریف هدف جدید'}</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  عنوان هدف یا مقصد *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: تسلط بر مباحث طراحی یا مطالعه ۳ جلد کتاب تخصصی"
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900"
                />
              </div>

              {/* انتخاب سطح: سالانه یا فصلی */}
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  نوع و دسته هدف
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormLevel('annual')}
                    className={`text-xs py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                      formLevel === 'annual' || formLevel === 'long'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    هدف سالانه (کل سال)
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormLevel('seasonal')}
                    className={`text-xs py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                      formLevel === 'seasonal' || formLevel === 'medium'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    هدف فصلی
                  </button>
                </div>
              </div>

              {/* اگر فصلی است، انتخاب فصل */}
              {formLevel === 'seasonal' && (
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    فصل مربوطه:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(['spring', 'summer', 'autumn', 'winter'] as GoalSeason[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormSeason(s)}
                        className={`text-xs py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                          formSeason === s
                            ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-2xs'
                            : 'bg-white text-stone-600 border-stone-200'
                        }`}
                      >
                        {SEASONS_CONFIG[s].name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PersianDatePicker
                  label="تاریخ آغاز"
                  value={formStartDate}
                  onChange={setFormStartDate}
                  showQuickChips={false}
                />
                <PersianDatePicker
                  label="تاریخ پایان (سررسید)"
                  value={formEndDate}
                  onChange={setFormEndDate}
                  showQuickChips={false}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  توضیحات و یادداشت همراه (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="انگیزه و گام‌های کلیدی این هدف..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-900 resize-none"
                />
              </div>

              {/* درصد پیشرفت */}
              <div>
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1">
                  <span>میزان پیشرفت فعلی:</span>
                  <span className="font-mono text-amber-800">{toPersianDigits(formProgress)}٪</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formProgress}
                  onChange={(e) => setFormProgress(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs cursor-pointer"
                >
                  ذخیره هدف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* مدال طراح دوره */}
      <CoursePacePlannerModal
        isOpen={isCoursePlannerOpen}
        onClose={() => setIsCoursePlannerOpen(false)}
      />
    </div>
  );
};
