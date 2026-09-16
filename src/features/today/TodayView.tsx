import React, { useState, useMemo } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getTodayJalali,
  formatJalaliDate,
  formatWeekday,
  getPersianSeasonName,
  getGregorianEquivalent,
  toPersianDigits,
  addDaysJalali,
  calcDaysDifference,
} from '../../lib/date/jalali';
import { getOccasionForDate } from '../../data/holidays';
import { TaskItem } from '../../components/tasks/TaskItem';
import { CourseTaskSeriesCard } from '../../components/tasks/CourseTaskSeriesCard';
import { Task } from '../../types';
import { InlinePersianMonthCalendar } from '../../components/calendar/InlinePersianMonthCalendar';
import { TodayGuideBanner } from '../../components/today/TodayGuideBanner';
import { TodayFocusBar } from '../../components/today/TodayFocusBar';
import { TodayInlineTaskInput } from '../../components/today/TodayInlineTaskInput';
import { TodayJournalPad } from '../../components/today/TodayJournalPad';
import { TodaySixDomainsView } from '../../components/today/TodaySixDomainsView';
import { EmptyState } from '../../components/common/EmptyState';
import {
  Sun,
  Sparkles,
  Calendar,
  Clock,
  Compass,
  CheckCircle2,
  Plus,
  ArrowLeft,
  Flame,
  CalendarDays,
  Bookmark,
  Award,
  BookOpen,
  ListTodo,
  GraduationCap,
  LayoutGrid,
  List,
  Settings2,
  BookCheck,
} from 'lucide-react';

export const TodayView: React.FC = () => {
  const {
    tasks,
    goals,
    events,
    domainGroups,
    settings,
    selectedDate,
    checklistItems,
    checklistLogs,
  } = useStore();
  const today = getTodayJalali();
  const activeDate = selectedDate || today.dateStr;
  const occasion = getOccasionForDate(activeDate);
  const weekdayName = formatWeekday(activeDate);
  const seasonName = getPersianSeasonName(today.jm);

  // حالت باز بودن جزئیات یک هدف در صفحه اصلی (کلیک برای جزئیات)
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  // کارهای روز انتخاب‌شده
  const todayTasks = tasks.filter((t) => t.dueDate === activeDate);
  const completedTodayTasks = todayTasks.filter((t) => !!t.completedAt);
  const pendingTodayTasks = todayTasks.filter((t) => !t.completedAt);

  // تفکیک کارهای دوره‌ای از کارهای عادی روزانه جهت جلوگیری از شلوغی و اشغال فضا
  const { regularTodayTasks, todayCourseGroups } = useMemo(() => {
    const courseMap = new Map<string, { title: string; goalId?: string; tasks: Task[] }>();
    const regular: Task[] = [];

    pendingTodayTasks.forEach((task) => {
      const match = task.title.match(/جلسه\s+\d+\s+از\s+دوره\s+«?(.*?)»?(\s+\(|$)/);
      const matchedCourseTitle = match ? match[1].trim() : null;

      if (task.goalId) {
        const goal = goals.find((g) => g.id === task.goalId);
        if (goal?.courseDetails || matchedCourseTitle) {
          const groupKey = `goal-${task.goalId}`;
          const title = goal?.title || matchedCourseTitle || 'دوره آموزشی';
          if (!courseMap.has(groupKey)) {
            courseMap.set(groupKey, { title, goalId: task.goalId, tasks: [] });
          }
          courseMap.get(groupKey)!.tasks.push(task);
          return;
        }
      } else if (matchedCourseTitle) {
        const groupKey = `title-${matchedCourseTitle}`;
        if (!courseMap.has(groupKey)) {
          courseMap.set(groupKey, { title: matchedCourseTitle, tasks: [] });
        }
        courseMap.get(groupKey)!.tasks.push(task);
        return;
      }
      regular.push(task);
    });

    const groups: { key: string; title: string; goalId?: string; tasks: Task[] }[] = [];
    courseMap.forEach((val, key) => {
      groups.push({ key, ...val });
    });

    return { regularTodayTasks: regular, todayCourseGroups: groups };
  }, [pendingTodayTasks, goals]);

  // تفکیک کارهای دارای اولویت بالا برای وضوح تصمیم‌گیری
  const highPriorityTasks = regularTodayTasks.filter((t) => t.priority === 'high' || t.priority === 'urgent');
  const regularPriorityTasks = regularTodayTasks.filter((t) => t.priority !== 'high' && t.priority !== 'urgent');

  // رویدادهای روز
  const todayEvents = events.filter((e) => e.date === activeDate);

  // اهداف فعال در این بازه زمانی
  const activeGoals = goals.filter((g) => {
    return (
      g.status === 'active' &&
      g.startDate <= activeDate &&
      g.endDate >= activeDate
    );
  });

  // رویدادها یا ددلاین‌های ۲ تا ۳ روز آینده
  const next3Days = [1, 2, 3].map((d) => addDaysJalali(activeDate, d));
  const upcomingEvents = events.filter((e) => next3Days.includes(e.date));
  const upcomingTasks = tasks.filter(
    (t) => next3Days.includes(t.dueDate) && !t.completedAt
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6" dir="rtl">
      {/* ساختار دو ستونه ارگونومیک دسکتاپ (مشابه Things 3 و TickTick) و تک‌ستونه روان موبایل */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ستون کناری: تقویم ماهانه/هفتگی و نیت روزانه (در دسکتاپ چسبان و همیشه در دید) */}
        <div className="lg:col-span-5 lg:sticky lg:top-18 space-y-4">
          <InlinePersianMonthCalendar />
          <TodayFocusBar />
        </div>

        {/* ستون اصلی: بنر راهنما، رویدادها، اقدامات روز، اهداف فعال و افق پیش‌رو */}
        <div className="lg:col-span-7 space-y-5">
          {/* بنر راهنمای شفافیت و شروع روز (قابل بستن توسط کاربر) */}
          <TodayGuideBanner onOpenPhilosophyModal={() => store.setPhilosophyModalOpen(true)} />

          {/* دسترسی مستقیم به کارهای روزانه و روتین‌ها */}
          <div className="bg-gradient-to-l from-amber-500/10 via-amber-100/30 to-white border border-amber-200/90 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-2xs">
                <BookCheck size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs sm:text-sm font-black text-stone-900">
                    کارهای روزانه و روتین‌های من
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-200/80 text-amber-950 px-2 py-0.5 rounded-full font-mono">
                    {toPersianDigits((checklistLogs[activeDate] || []).length)} از {toPersianDigits(checklistItems.length)} انجام شده
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  دسته‌بندی‌ها و عناوین قابل ویرایش • برای علامت‌زدن یا ویرایش ضربه بزنید
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                type="button"
                onClick={() => store.setChecklistDrawerOpen(true)}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 active:bg-black text-stone-100 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <span>باز کردن کارهای روزانه</span>
                <ArrowLeft size={14} />
              </button>
            </div>
          </div>

          {/* ۴. قرارهای زمانی و رویدادهای امروز (اگر ثبت شده باشد) */}
          {todayEvents.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
                <Clock size={16} className="text-amber-700" />
                <span>قرارهای زمانی و رویدادهای امروز</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {todayEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-stone-900">
                        {evt.title}
                      </div>
                      {evt.description && (
                        <div className="text-xs text-stone-600">
                          {evt.description}
                        </div>
                      )}
                      {evt.startTime && (
                        <div className="text-[11px] text-amber-900 font-mono font-medium flex items-center gap-1 mt-1">
                          <Clock size={11} />
                          <span>
                            ساعت {evt.startTime}
                            {evt.endTime ? ` تا ${evt.endTime}` : ''}
                          </span>
                        </div>
                      )}
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white/80 text-amber-900 border border-amber-200">
                      {evt.type === 'appointment'
                        ? 'قرار کاری'
                        : evt.type === 'exam'
                        ? 'امتحان / آزمون'
                        : evt.type === 'birthday'
                        ? 'زادروز'
                        : 'رویداد'}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ۵. کارهای روز انتخاب‌شده (تقویم‌محور و متصل به تاریخ فعال) */}
      <section className="space-y-4">
        {/* بنر آگاهی‌بخش در صورتی که کاربری تاریخی غیر از امروز را انتخاب کرده باشد */}
        {activeDate !== today.dateStr && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs text-amber-950 shadow-2xs">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-amber-700 shrink-0" />
              <span>
                در حال مشاهده برنامه و اقدامات <strong>{formatJalaliDate(activeDate, { showWeekday: true, showMonthName: true })}</strong>
              </span>
            </div>
            <button
              onClick={() => store.setSelectedDate(today.dateStr)}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 transition-colors cursor-pointer shrink-0"
            >
              بازگشت به امروز
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/70 pb-2.5">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-stone-800" />
            <h3 className="text-base font-bold text-stone-900">
              {activeDate === today.dateStr
                ? settings.lifeDomainsMode
                  ? `حوزه‌های زندگی (${toPersianDigits(domainGroups.length)} حوزه فعال)`
                  : 'کارهای امروز'
                : `کارهای روز ${formatJalaliDate(activeDate, { showWeekday: true, showMonthName: true })}`}
            </h3>
            <span className="text-xs font-normal text-stone-500 font-mono">
              ({toPersianDigits(todayTasks.length)} مورد)
            </span>
          </div>

          {/* سوئیچر اختیاری بین حالت استاندارد و ابعاد زندگی */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200/80 text-xs">
              <button
                type="button"
                onClick={() => store.updateSettings({ lifeDomainsMode: false })}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  !settings.lifeDomainsMode
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="نمایش پیوسته کارها"
              >
                <List size={13} />
                <span>لیست استاندارد</span>
              </button>

              <button
                type="button"
                onClick={() => store.updateSettings({ lifeDomainsMode: true })}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  settings.lifeDomainsMode
                    ? 'bg-stone-900 text-stone-100 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="دسته‌بندی موضوعی کارها"
              >
                <LayoutGrid size={13} />
                <span>دسته‌بندی موضوعی</span>
              </button>
            </div>

            {settings.lifeDomainsMode && (
              <button
                type="button"
                onClick={() => store.setManageDomainsModalOpen(true)}
                className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 bg-stone-100 hover:bg-stone-200/70 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
                title="شخصی‌سازی دسته‌ها"
              >
                <Settings2 size={13} className="text-amber-700" />
                <span className="hidden sm:inline">شخصی‌سازی دسته‌ها</span>
              </button>
            )}

            <button
              onClick={() => store.setQuickAddModalOpen(true, 'task')}
              className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 bg-stone-100 hover:bg-stone-200/70 px-2.5 py-1 rounded-lg border border-stone-200 transition-colors cursor-pointer"
            >
              <Plus size={13} />
              <span className="hidden sm:inline">افزودن با جزئیات</span>
            </button>
          </div>
        </div>

        {/* یادآوری تفاوت کارها با چک‌لیست عادات */}
        <div className="text-[11px] text-stone-500 bg-stone-100/60 border border-stone-200/60 px-3 py-1.5 rounded-xl flex items-center justify-between gap-2">
          <span>
            💡 برای عادات و کارهای تکرارشونده، از <strong>چک‌لیست روزانه</strong> استفاده کنید.
          </span>
          <button
            onClick={() => store.setChecklistDrawerOpen(true)}
            className="text-emerald-700 font-bold hover:underline shrink-0"
          >
            مشاهده چک‌لیست
          </button>
        </div>

        {/* نمایش متناسب با حالت انتخابی: یا ۶ حوزه زندگی یا لیست استاندارد کارهای امروز */}
        {settings.lifeDomainsMode ? (
          <TodaySixDomainsView />
        ) : (
          <>
            {/* فیلد درون‌صفحه‌ای سریع برای نوشتن مستقیم در دفتر بدون مدال */}
            <TodayInlineTaskInput />

            {todayTasks.length === 0 ? (
              <EmptyState
                id="empty-today-tasks"
                icon={Sun}
                title={
                  activeDate === today.dateStr
                    ? 'امروز هنوز کاری ثبت نشده است'
                    : `برای روز ${formatJalaliDate(activeDate)} کاری ثبت نشده است`
                }
                description="از کادر بالا مستقیماً یک کار بنویسید یا با دکمه زیر اقدام جدیدی ثبت کنید."
                action={{
                  label: 'افزودن کار برای این روز',
                  onClick: () => store.setQuickAddModalOpen(true, 'task'),
                }}
              />
            ) : (
              <div className="space-y-4">
                
                {/* الف) اولویت‌های کلیدی و فوری امروز */}
                {highPriorityTasks.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 bg-rose-50/70 border border-rose-200/60 px-3 py-1.5 rounded-xl w-fit">
                      <Flame size={13} className="fill-rose-600 text-rose-600" />
                      <span>کارهای با اولویت بالا</span>
                    </div>
                    <div className="space-y-2.5">
                      {highPriorityTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}

                {/* ب) جلسات دوره‌ای و آموزشی امروز با تجمیع هوشمند و زیرفهرست */}
                {todayCourseGroups.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-200/60 px-3 py-1.5 rounded-xl w-fit">
                      <GraduationCap size={13} className="text-amber-800" />
                      <span>دوره‌های آموزشی امروز ({toPersianDigits(todayCourseGroups.length)} دوره)</span>
                    </div>
                    <div className="space-y-2">
                      {todayCourseGroups.map((group) => {
                        const goal = goals.find((g) => g.id === group.goalId);
                        return (
                          <CourseTaskSeriesCard
                            key={group.key}
                            courseTitle={group.title}
                            goal={goal}
                            tasks={group.tasks}
                            contextLabel="جلسه امروز دوره"
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ج) سایر کارهای امروز */}
                {regularPriorityTasks.length > 0 && (
                  <div className="space-y-2">
                    {(highPriorityTasks.length > 0 || todayCourseGroups.length > 0) && (
                      <div className="text-xs font-bold text-stone-600 flex items-center gap-1 pt-1">
                        <ListTodo size={13} />
                        <span>سایر کارهای امروز</span>
                      </div>
                    )}
                    <div className="space-y-2.5">
                      {regularPriorityTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}

                {/* د) کارهای انجام‌شده امروز */}
                {completedTodayTasks.length > 0 && (
                  <div className="pt-3 border-t border-stone-200/60 space-y-2">
                    <div className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                      <CheckCircle2 size={13} className="text-emerald-700" />
                      <span>
                        کارهای انجام‌شده ({toPersianDigits(completedTodayTasks.length)})
                      </span>
                    </div>
                    <div className="space-y-2 opacity-85">
                      {completedTodayTasks.map((task) => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* ۶. دفترچه یادداشت، تأمل و تخلیه ذهن امروز (Daily Margin & Scratchpad) */}
      <TodayJournalPad />

      {/* ۷. اهداف فعال در صفحه اصلی */}
      {activeGoals.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
              <Compass size={14} className="text-stone-700" />
              <span>اهداف فعال</span>
              <span className="text-[10px] text-stone-400 font-normal">
                (کلیک برای جزئیات بیشتر)
              </span>
            </h3>
            <button
              onClick={() => store.setActiveTab('goals')}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium flex items-center gap-1"
            >
              <span>مشاهده همه اهداف</span>
              <ArrowLeft size={11} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {activeGoals.map((goal) => {
              const daysRemaining = calcDaysDifference(today.dateStr, goal.endDate);
              const isExpanded = expandedGoalId === goal.id;

              return (
                <div
                  key={goal.id}
                  onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                  className={`bg-white border rounded-xl p-3 shadow-2xs hover:border-stone-300 transition-all cursor-pointer select-none space-y-2 ${
                    isExpanded ? 'ring-2 ring-stone-900/10 border-stone-400' : 'border-stone-200/85'
                  }`}
                >
                  {/* طبقه بالا: عنوان شاخص و جادار هدف */}
                  <div className="border-b border-stone-100 pb-1.5">
                    <span className="text-xs sm:text-[13px] font-bold text-stone-900 leading-snug block break-words">
                      {goal.title}
                    </span>
                  </div>

                  {/* طبقه پایین: برچسب‌ها و نوار پیشرفت */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5">
                    {goal.courseDetails ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <GraduationCap size={11} className="text-amber-700" />
                        <span>دوره {toPersianDigits(goal.courseDetails.totalHours)} س</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-stone-100 text-stone-600 border border-stone-200">
                        {goal.level === 'long' ? 'بلندمدت' : goal.level === 'medium' ? 'میان‌مدت' : 'کوتاه‌مدت'}
                      </span>
                    )}

                    <span className="text-[10px] font-bold text-stone-800 font-mono">
                      {toPersianDigits(goal.progress)}٪ پیشرفت
                    </span>
                  </div>

                  {/* نوار پیشرفت فشرده + درصد */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-stone-500">
                      <span>پیشرفت</span>
                      <span className="font-bold text-stone-800">{toPersianDigits(goal.progress)}٪</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${goal.progress}%`,
                          backgroundColor: goal.color || '#2b534b',
                        }}
                      />
                    </div>
                  </div>

                  {/* تاریخ موعد و روزهای باقیمانده */}
                  <div className="text-[10px] text-stone-400 flex items-center justify-between pt-0.5">
                    <span className="flex items-center gap-1 font-mono">
                      <Calendar size={10} />
                      <span>تا {formatJalaliDate(goal.endDate, { showYear: false })}</span>
                    </span>
                    <span className="text-stone-600 font-medium">
                      {daysRemaining > 0 ? `${toPersianDigits(daysRemaining)} روز مانده` : 'موعد فرارسیده'}
                    </span>
                  </div>

                  {/* جزئیات بازشو در صورت کلیک */}
                  {isExpanded && (
                    <div
                      className="pt-2 border-t border-stone-100 space-y-2 text-xs animate-in fade-in"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {goal.description && (
                        <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2 rounded-lg">
                          {goal.description}
                        </p>
                      )}

                      {goal.courseDetails && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-2 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-stone-600">
                            <span>تعهد: روزی {toPersianDigits(goal.courseDetails.dailyCommitmentMinutes)} دقیقه</span>
                            <span className="font-mono text-stone-800">
                              {toPersianDigits((Math.round(goal.courseDetails.completedMinutes / 6) / 10).toFixed(1))} از {toPersianDigits(goal.courseDetails.totalHours)} ساعت
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => store.logCourseSession(goal.id, goal.courseDetails!.dailyCommitmentMinutes)}
                            className="w-full py-1 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 rounded-lg font-bold text-[10px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus size={11} className="stroke-[2.5]" />
                            <span>ثبت {toPersianDigits(goal.courseDetails.dailyCommitmentMinutes)} دقیقه مطالعه امروز</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ۸. نگاهی آرام به روزهای پیش رو (Upcoming Horizon) */}
      {(upcomingTasks.length > 0 || upcomingEvents.length > 0) && (
        <section className="bg-stone-50 border border-stone-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <CalendarDays size={15} className="text-stone-500" />
              <span>رویدادها و برنامه‌های ۲ تا ۳ روز آینده</span>
            </h4>
            <button
              onClick={() => store.setActiveTab('calendar')}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              مشاهده تقویم کامل
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="bg-white border border-stone-200 rounded-lg p-3 text-xs flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold text-stone-800">{evt.title}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {formatJalaliDate(evt.date, { showWeekday: true, showYear: false })}
                  </div>
                </div>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                  رویداد
                </span>
              </div>
            ))}

            {upcomingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="bg-white border border-stone-200 rounded-lg p-3 text-xs flex items-center justify-between"
              >
                <div className="truncate pl-2">
                  <div className="font-medium text-stone-800 truncate">
                    {task.title}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">
                    {formatJalaliDate(task.dueDate, { showWeekday: true, showYear: false })}
                  </div>
                </div>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded shrink-0">
                  وظیفه
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

        </div>
      </div>
    </div>
  );
};
