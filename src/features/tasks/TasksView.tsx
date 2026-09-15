import React, { useState, useMemo } from 'react';
import { useStore, store } from '../../store/useStore';
import { Priority, Task } from '../../types';
import { TaskItem } from '../../components/tasks/TaskItem';
import { CourseTaskSeriesCard } from '../../components/tasks/CourseTaskSeriesCard';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import {
  getTodayJalali,
  addDaysJalali,
  calcDaysDifference,
  toPersianDigits,
  formatJalaliDate,
} from '../../lib/date/jalali';
import {
  CheckSquare,
  Plus,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  GraduationCap,
  AlertCircle,
  Clock,
  Flame,
  CalendarDays,
  Inbox,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

type TaskFilterType = 'smart' | 'today' | 'overdue' | 'high_priority' | 'week' | 'completed' | 'all';

export const TasksView: React.FC = () => {
  const { tasks, goals, domainGroups, settings } = useStore();
  const today = getTodayJalali();

  const availableDomains = settings.lifeDomainsMode ? SIX_LIFE_DOMAINS : domainGroups;

  const [activeFilter, setActiveFilter] = useState<TaskFilterType>('smart');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // محاسبات آماری وظایف
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => !t.completedAt);
  const completedTasks = tasks.filter((t) => !!t.completedAt);
  
  // کارهای معوقه (تاریخ سررسید قبل از امروز و هنوز باز)
  const overdueTasks = pendingTasks.filter((t) => {
    if (!t.dueDate) return false;
    return calcDaysDifference(today.dateStr, t.dueDate) < 0;
  });

  // کارهای امروز
  const todayTasksList = pendingTasks.filter((t) => t.dueDate === today.dateStr);

  // کارهای اولویت بالا
  const highPriorityCount = pendingTasks.filter((t) => t.priority === 'high').length;

  // فیلتر کردن وظایف بر مبنای تنظیمات و کادر جستجو
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // فیلتر جستجو
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchNotes = task.notes?.toLowerCase().includes(q);
        if (!matchTitle && !matchNotes) return false;
      }

      // فیلتر حوزه
      if (selectedGroupId !== 'all' && task.groupId !== selectedGroupId) {
        return false;
      }

      const isCompleted = !!task.completedAt;

      if (activeFilter === 'today') {
        return task.dueDate === today.dateStr && !isCompleted;
      }
      if (activeFilter === 'overdue') {
        if (!task.dueDate || isCompleted) return false;
        return calcDaysDifference(today.dateStr, task.dueDate) < 0;
      }
      if (activeFilter === 'high_priority') {
        return task.priority === 'high' && !isCompleted;
      }
      if (activeFilter === 'week') {
        if (!task.dueDate || isCompleted) return false;
        const diff = calcDaysDifference(today.dateStr, task.dueDate);
        return diff >= 0 && diff <= 7;
      }
      if (activeFilter === 'completed') {
        return isCompleted;
      }
      if (activeFilter === 'all') {
        return true;
      }

      // حالت هوشمند (smart): فقط کارهای انجام‌نشده را بر اساس زمان‌بندی نشان می‌دهد
      return !isCompleted;
    });
  }, [tasks, searchQuery, selectedGroupId, activeFilter, today.dateStr]);

  // دسته‌بندی زمانی در نمای هوشمند (Smart Time Buckets)
  const timeBuckets = useMemo(() => {
    const overdue: Task[] = [];
    const todayTasks: Task[] = [];
    const thisWeekTasks: Task[] = [];
    const upcomingTasks: Task[] = [];
    const noDateTasks: Task[] = [];

    filteredTasks.forEach((task) => {
      if (!task.dueDate) {
        noDateTasks.push(task);
        return;
      }
      const diff = calcDaysDifference(today.dateStr, task.dueDate);
      if (diff < 0) {
        overdue.push(task);
      } else if (diff === 0) {
        todayTasks.push(task);
      } else if (diff <= 7) {
        thisWeekTasks.push(task);
      } else {
        upcomingTasks.push(task);
      }
    });

    return { overdue, todayTasks, thisWeekTasks, upcomingTasks, noDateTasks };
  }, [filteredTasks, today.dateStr]);

  // تجمیع کارهای تکراری دوره‌ها
  const groupCourseTasks = (taskList: Task[]) => {
    const courseMap = new Map<string, { title: string; goalId?: string; tasks: Task[] }>();
    const regular: Task[] = [];

    taskList.forEach((task) => {
      const match = task.title.match(/جلسه\s+\d+\s+از\s+دوره\s+«?(.*?)»?(\s+\(|$)/);
      const matchedCourseTitle = match ? match[1].trim() : null;

      if (task.goalId) {
        const goal = goals.find((g) => g.id === task.goalId);
        const groupKey = `goal-${task.goalId}`;
        const title = goal?.title || matchedCourseTitle || 'دوره آموزشی';

        if (!courseMap.has(groupKey)) {
          courseMap.set(groupKey, { title, goalId: task.goalId, tasks: [] });
        }
        courseMap.get(groupKey)!.tasks.push(task);
      } else if (matchedCourseTitle) {
        const groupKey = `title-${matchedCourseTitle}`;
        if (!courseMap.has(groupKey)) {
          courseMap.set(groupKey, { title: matchedCourseTitle, tasks: [] });
        }
        courseMap.get(groupKey)!.tasks.push(task);
      } else {
        regular.push(task);
      }
    });

    const multiCourseGroups: { key: string; title: string; goalId?: string; tasks: Task[] }[] = [];
    courseMap.forEach((val, key) => {
      if (val.tasks.length > 1) {
        multiCourseGroups.push({ key, ...val });
      } else {
        regular.push(...val.tasks);
      }
    });

    return { regularTasks: regular, courseGroups: multiCourseGroups };
  };

  // انتقال سریع تمام کارهای معوقه به امروز با یک کلیک
  const handleRescheduleAllOverdueToToday = () => {
    overdueTasks.forEach((t) => {
      store.rescheduleTask(t.id, today.dateStr);
    });
  };

  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-7 space-y-5" dir="rtl">
      
      {/* ۱. سربرگ شفافیت اقدامات */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3.5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
              <CheckSquare size={20} className="text-stone-800" />
              <span>مدیریت کارها و وظایف</span>
            </h2>
            <span className="text-[11px] font-bold bg-stone-200/70 text-stone-700 px-2 py-0.5 rounded-md font-mono">
              {toPersianDigits(pendingTasks.length)} اقدام جاری
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            ساماندهی اقدامات عملیاتی؛ تفکیک شده بر اساس زمان‌بندی هوشمند، اولویت‌ها و حوزه‌های زندگی.
          </p>
        </div>

        <button
          onClick={() => store.setQuickAddModalOpen(true, 'task')}
          className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          <span>افزودن کار جدید</span>
        </button>
      </div>

      {/* ۲. نوار وضوح ذهنی و راهنمای تفکیک کارها از عادات */}
      <div className="bg-[#fdfcf9] border border-stone-200/80 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-stone-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <CheckCircle2 size={15} className="text-emerald-700" />
            <span>پیشرفت کل:</span>
            <span className="font-mono text-stone-900">{toPersianDigits(completionRate)}٪</span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-stone-500 text-[11px]">
            {toPersianDigits(completedTasks.length)} انجام‌شده / {toPersianDigits(totalTasks)} کل ثبت‌شده
          </span>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
          <span>💡 <strong>نکته کاربردی:</strong> روتین‌های ثابت روزانه را در</span>
          <button
            onClick={() => store.setChecklistDrawerOpen(true)}
            className="text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            چک‌لیست ۶ حوزه
          </button>
          <span>ثبت کنید تا لیست کارها خلوت و هدفمند بماند.</span>
        </div>
      </div>

      {/* ۳. فیلترهای زمانی و اولویتی */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* فیلترهای حالت نمایش */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'smart', label: 'دسته‌بندی هوشمند', badge: null },
              { id: 'today', label: 'امروز', badge: todayTasksList.length },
              { id: 'overdue', label: 'معوقه‌ها', badge: overdueTasks.length, alert: true },
              { id: 'high_priority', label: 'فوری و مهم 🔥', badge: highPriorityCount },
              { id: 'week', label: 'هفته جاری', badge: null },
              { id: 'completed', label: 'انجام‌شده', badge: completedTasks.length },
              { id: 'all', label: 'همه', badge: totalTasks },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as TaskFilterType)}
                className={`text-xs px-2.5 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border flex items-center gap-1 cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-xs'
                    : f.alert && f.badge && f.badge > 0
                    ? 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100/70'
                    : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <span>{f.label}</span>
                {f.badge !== null && f.badge > 0 && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                      activeFilter === f.id
                        ? 'bg-stone-700 text-white'
                        : f.alert
                        ? 'bg-rose-600 text-white'
                        : 'bg-stone-200 text-stone-800'
                    }`}
                  >
                    {toPersianDigits(f.badge)}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* کادر فیلتر متنی سریع */}
          <input
            type="text"
            placeholder="جستجو در کارها..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-amber-400 w-full sm:w-44"
          />
        </div>

        {/* فیلتر حوزه‌ها (۶ حوزه بنیادین) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedGroupId('all')}
            className={`px-2.5 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap cursor-pointer ${
              selectedGroupId === 'all'
                ? 'bg-stone-200 text-stone-900 border-stone-300 font-bold'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            تمام حوزه‌ها
          </button>
          {availableDomains.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`px-2 py-1 rounded-lg border font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedGroupId === g.id
                  ? 'border-stone-400 font-bold'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
              style={{
                backgroundColor: selectedGroupId === g.id ? `${g.color}15` : undefined,
                color: selectedGroupId === g.id ? g.color : undefined,
                borderColor: selectedGroupId === g.id ? g.color : undefined,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.color }} />
              <span>{g.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ۴. نمایش وظایف بر اساس دسته‌بندی زمانی یا فیلتر انتخابی */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-300 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 mx-auto flex items-center justify-center">
            <CheckSquare size={24} />
          </div>
          <div className="text-sm font-bold text-stone-800">
            {searchQuery ? 'کاری منطبق بر جستجوی شما یافت نشد' : 'در این بخش کاری وجود ندارد'}
          </div>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            ذهن خود را سبک نگه دارید؛ هر اقدام جدیدی دارید ثبت کنید.
          </p>
          <button
            onClick={() => store.setQuickAddModalOpen(true, 'task')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>افزودن کار جدید</span>
          </button>
        </div>
      ) : activeFilter === 'smart' ? (
        /* نمای هوشمند با سطل‌های زمانی منظم (Smart Buckets) */
        <div className="space-y-6">
          
          {/* الف) کارهای معوقه (Overdue) - نیازمند تعیین تکلیف فوری */}
          {timeBuckets.overdue.length > 0 && (
            <div className="space-y-2.5">
              <div className="bg-rose-50 border border-rose-200/80 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs text-rose-900">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle size={16} className="text-rose-600 shrink-0" />
                  <span>
                    اقدامات معوقه ({toPersianDigits(timeBuckets.overdue.length)} کار عقب‌افتاده)
                  </span>
                </div>
                <button
                  onClick={handleRescheduleAllOverdueToToday}
                  className="px-2.5 py-1 bg-white hover:bg-rose-100/80 text-rose-900 border border-rose-300 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  title="انتقال تاریخ سررسید تمام معوقه‌ها به امروز"
                >
                  <RotateCcw size={11} />
                  <span>انتقال همه به امروز</span>
                </button>
              </div>

              <div className="space-y-2">
                {timeBuckets.overdue.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* ب) کارهای امروز (Today) */}
          {timeBuckets.todayTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-black text-stone-900 bg-amber-100/60 border border-amber-200/70 px-3 py-1.5 rounded-xl w-fit">
                <Clock size={14} className="text-amber-700" />
                <span>برنامه امروز ({toPersianDigits(timeBuckets.todayTasks.length)} اقدام)</span>
              </div>
              <div className="space-y-2">
                {timeBuckets.todayTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* ج) کارهای فردا و این هفته (This Week) */}
          {timeBuckets.thisWeekTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-700 border-b border-stone-200/80 pb-1 pt-2">
                <CalendarDays size={14} className="text-stone-600" />
                <span>به‌زودی در این هفته ({toPersianDigits(timeBuckets.thisWeekTasks.length)} اقدام)</span>
              </div>
              <div className="space-y-2">
                {timeBuckets.thisWeekTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* د) کارهای آینده (Upcoming) */}
          {timeBuckets.upcomingTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600 border-b border-stone-200/80 pb-1 pt-2">
                <Calendar size={14} className="text-stone-500" />
                <span>برنامه‌های آینده و هفته‌های بعد ({toPersianDigits(timeBuckets.upcomingTasks.length)})</span>
              </div>
              <div className="space-y-2">
                {timeBuckets.upcomingTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

          {/* ه) بدون تاریخ / صندوق ورودی (Inbox) */}
          {timeBuckets.noDateTasks.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-500 border-b border-stone-200/80 pb-1 pt-2">
                <Inbox size={14} className="text-stone-400" />
                <span>صندوق ورودی بدون تاریخ مشخص ({toPersianDigits(timeBuckets.noDateTasks.length)})</span>
              </div>
              <div className="space-y-2">
                {timeBuckets.noDateTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </div>
            </div>
          )}

        </div>
      ) : (
        /* لیست فیلترشده با تجمیع کارت‌های دوره‌ای */
        <div className="space-y-3">
          {(() => {
            const { regularTasks, courseGroups } = groupCourseTasks(filteredTasks);
            return (
              <>
                {courseGroups.map((group) => {
                  const goal = goals.find((g) => g.id === group.goalId);
                  return (
                    <CourseTaskSeriesCard
                      key={group.key}
                      courseTitle={group.title}
                      goal={goal}
                      tasks={group.tasks}
                    />
                  );
                })}

                {regularTasks.map((task) => (
                  <TaskItem key={task.id} task={task} />
                ))}
              </>
            );
          })()}
        </div>
      )}

    </div>
  );
};
