import React, { useState, useMemo } from 'react';
import { Task, Goal } from '../../types';
import { store } from '../../store/useStore';
import {
  formatJalaliDate,
  toPersianDigits,
  getTodayJalali,
} from '../../lib/date/jalali';
import {
  GraduationCap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Calendar,
  Clock,
  Trash2,
  ListOrdered,
  Search,
  Check,
} from 'lucide-react';

interface CourseTaskSeriesCardProps {
  courseTitle: string;
  goal?: Goal;
  tasks: Task[];
  contextLabel?: string;
  initialExpanded?: boolean;
}

export const CourseTaskSeriesCard: React.FC<CourseTaskSeriesCardProps> = ({
  courseTitle,
  goal,
  tasks,
  contextLabel,
  initialExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const [searchQuery, setSearchQuery] = useState('');
  const today = getTodayJalali();

  // مرتب‌سازی جلسات بر اساس تاریخ و شماره جلسه
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [tasks]);

  const completedTasks = useMemo(() => sortedTasks.filter((t) => !!t.completedAt), [sortedTasks]);
  const pendingTasks = useMemo(() => sortedTasks.filter((t) => !t.completedAt), [sortedTasks]);

  const totalCount = sortedTasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // جلسه بعدی که باید انجام شود (اولین تسک انجام‌نشده)
  const nextActiveTask = pendingTasks[0];

  const handleToggleTask = (task: Task) => {
    store.toggleTaskCompleted(task.id);
  };

  // فیلتر جستجو در جلسات در صورت زیاد بودن
  const displayTasks = useMemo(() => {
    if (!searchQuery.trim()) return sortedTasks;
    return sortedTasks.filter((t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedTasks, searchQuery]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all duration-200 hover:border-amber-300/80">
      {/* ردیف اصلی کارت دوره‌ای (طراحی فشرده در حالت بسته برای اشغال حداقل فضا) */}
      <div className="p-3 sm:p-3.5 bg-gradient-to-r from-amber-50/50 via-stone-50/40 to-white flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* اطلاعات عنوان دوره و جلسه فعال */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-2xs shrink-0">
            <GraduationCap size={16} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 truncate">
                {courseTitle}
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200/60 shrink-0">
                {contextLabel || 'بسته جلسات دوره'}
              </span>
              <span className="text-[10px] font-medium text-stone-500 font-mono shrink-0">
                ({toPersianDigits(completedCount)}/{toPersianDigits(totalCount)})
              </span>
            </div>

            {/* پیش‌نمایش جلسه فعال بعدی */}
            {nextActiveTask ? (
              <div className="flex items-center gap-1.5 text-[11px] text-stone-600 mt-0.5 truncate">
                <span className="text-amber-800 font-bold">جلسه بعدی:</span>
                <span className="truncate">{nextActiveTask.title}</span>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-1.5 py-0.2 rounded shrink-0">
                  {formatJalaliDate(nextActiveTask.dueDate, { showMonthName: true })}
                </span>
              </div>
            ) : (
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                <Check size={12} />
                <span>تمام جلسات این بخش تکمیل شده است 🎉</span>
              </div>
            )}
          </div>
        </div>

        {/* اکشن‌های سریع و دکمه بازکردن زیرفهرست */}
        <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-100">
          {/* دکمه ثبت سریع انجام جلسه جاری بدون نیاز به باز کردن لیست */}
          {nextActiveTask && (
            <button
              type="button"
              onClick={() => handleToggleTask(nextActiveTask)}
              className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-2xs shrink-0"
              title={`ثبت انجام سریع: ${nextActiveTask.title}`}
            >
              <CheckCircle2 size={13} />
              <span>انجام جلسه جاری</span>
            </button>
          )}

          {/* نوار کوچک پیشرفت */}
          <div className="w-16 sm:w-20 bg-stone-200/80 rounded-full h-1.5 overflow-hidden hidden md:block">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* دکمه زیرفهرست جلسات */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer border ${
              isExpanded
                ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-2xs'
                : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
            }`}
          >
            <ListOrdered size={13} />
            <span>
              {isExpanded
                ? 'بستن زیرفهرست'
                : `زیرفهرست جلسات (${toPersianDigits(sortedTasks.length)})`}
            </span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* زیرفهرست کشویی جلسات (Collapsible Sub-list) */}
      {isExpanded && (
        <div className="p-3 sm:p-4 bg-stone-50/50 border-t border-stone-100 space-y-2.5 animate-in slide-in-from-top-1 duration-150">
          {/* جستجو و خلاصه در صورت زیاد بودن جلسات */}
          {sortedTasks.length > 5 && (
            <div className="flex items-center justify-between gap-2 pb-1">
              <div className="relative flex-1 max-w-xs">
                <Search size={13} className="absolute right-2.5 top-2.5 text-stone-400" />
                <input
                  type="text"
                  placeholder="جستجو در جلسات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pr-7 pl-2.5 py-1.5 bg-white border border-stone-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <span className="text-[11px] text-stone-500 font-medium">
                {toPersianDigits(displayTasks.length)} جلسه نمایش داده شده
              </span>
            </div>
          )}

          {/* لیست جلسات با اسکرول کنترل‌شده برای جلوگیری از اشغال صفحه */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
            {displayTasks.map((t) => {
              const isDone = !!t.completedAt;
              const isToday = t.dueDate === today.dateStr;

              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-stone-100/60 border-stone-200 text-stone-400'
                      : isToday
                      ? 'bg-amber-50/90 border-amber-300 text-stone-900 shadow-2xs font-bold'
                      : 'bg-white border-stone-200/80 text-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(t)}
                      className="shrink-0 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer"
                      title={isDone ? 'علامت به عنوان انجام‌نشده' : 'علامت به عنوان انجام‌شده'}
                    >
                      {isDone ? (
                        <CheckCircle2 size={17} className="text-emerald-600" />
                      ) : (
                        <Circle size={17} className="text-stone-300 hover:text-amber-500" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1 flex items-center gap-1.5 flex-wrap">
                      {isToday && (
                        <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                          امروز
                        </span>
                      )}
                      <span
                        className={`text-xs truncate ${
                          isDone ? 'line-through text-stone-400' : 'font-medium text-stone-900'
                        }`}
                      >
                        {t.title}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 mr-2">
                    <span className="text-[10px] font-mono text-stone-500 bg-stone-100/90 px-2 py-0.5 rounded">
                      {formatJalaliDate(t.dueDate, { showMonthName: true })}
                    </span>

                    <button
                      type="button"
                      onClick={() => store.deleteTask(t.id)}
                      className="text-stone-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="حذف این جلسه"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
