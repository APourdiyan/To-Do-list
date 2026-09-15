import React, { useState } from 'react';
import { Task, Goal } from '../../types';
import { useStore, store } from '../../store/useStore';
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
  Layers,
} from 'lucide-react';

interface CourseTaskSeriesCardProps {
  courseTitle: string;
  goal?: Goal;
  tasks: Task[];
}

export const CourseTaskSeriesCard: React.FC<CourseTaskSeriesCardProps> = ({
  courseTitle,
  goal,
  tasks,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const today = getTodayJalali();

  // مرتب‌سازی جلسات بر اساس تاریخ و شناسه
  const sortedTasks = [...tasks].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const completedTasks = sortedTasks.filter((t) => !!t.completedAt);
  const pendingTasks = sortedTasks.filter((t) => !t.completedAt);
  const totalCount = sortedTasks.length;
  const completedCount = completedTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // جلسه بعدی که باید انجام شود (اولین تسک انجام‌نشده)
  const nextActiveTask = pendingTasks[0] || sortedTasks[sortedTasks.length - 1];

  const handleToggleTask = (task: Task) => {
    store.toggleTaskCompleted(task.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden transition-all">
      {/* سربرگ کارت زنجیره دوره */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-50/70 via-stone-50 to-white border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs shrink-0">
            <GraduationCap size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-stone-900">
                {courseTitle}
              </h3>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/60">
                برنامه آموزشی دوره‌ای
              </span>
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              {toPersianDigits(completedCount)} از {toPersianDigits(totalCount)} جلسه تکمیل شده ({toPersianDigits(progressPercent)}٪)
            </p>
          </div>
        </div>

        {/* نوار کوچک پیشرفت و دکمه آکاردئون */}
        <div className="flex items-center gap-3">
          <div className="w-24 sm:w-32 bg-stone-200 rounded-full h-2 overflow-hidden hidden sm:block">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 hover:text-stone-950 bg-white hover:bg-stone-100 border border-stone-200 rounded-xl transition-all cursor-pointer shadow-2xs"
          >
            <span>{isExpanded ? 'بستن جلسات' : `مشاهده تمام جلسات (${toPersianDigits(sortedTasks.length)})`}</span>
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
        </div>
      </div>

      {/* جلسه فعال فعلی (قابل تیک زدن سریع بدون نیاز به باز کردن کل لیست) */}
      {nextActiveTask && (
        <div className="p-3.5 sm:p-4 bg-white flex items-center justify-between gap-3 border-b border-stone-100/70">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => handleToggleTask(nextActiveTask)}
              className="shrink-0 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer"
              title={nextActiveTask.completedAt ? 'علامت به عنوان انجام‌نشده' : 'علامت به عنوان انجام‌شده'}
            >
              {nextActiveTask.completedAt ? (
                <CheckCircle2 size={22} className="text-emerald-600" />
              ) : (
                <Circle size={22} className="text-stone-300 hover:text-amber-500" />
              )}
            </button>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                  جلسه فعال بعدی
                </span>
                <span
                  className={`text-xs sm:text-sm font-bold truncate ${
                    nextActiveTask.completedAt ? 'line-through text-stone-400' : 'text-stone-900'
                  }`}
                >
                  {nextActiveTask.title}
                </span>
              </div>
            </div>
          </div>

          {/* نشانگر تاریخ جلسه */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60 shrink-0">
            <Calendar size={13} className="text-stone-400" />
            <span>{formatJalaliDate(nextActiveTask.dueDate, { showMonthName: true })}</span>
          </div>
        </div>
      )}

      {/* لیست آکاردئونی تمامی جلسات آینده و گذشته */}
      {isExpanded && (
        <div className="p-3 sm:p-4 bg-[#fcfbf8] space-y-2">
          <div className="text-[11px] font-bold text-stone-500 px-1 mb-1">
            برنامه زمانی روزهای دوره ({toPersianDigits(sortedTasks.length)} جلسه):
          </div>

          <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
            {sortedTasks.map((t) => {
              const isDone = !!t.completedAt;
              const isToday = t.dueDate === today.dateStr;

              return (
                <div
                  key={t.id}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-stone-50/80 border-stone-200 text-stone-400'
                      : isToday
                      ? 'bg-amber-50/80 border-amber-300 text-stone-900 shadow-2xs font-bold'
                      : 'bg-white border-stone-200/80 text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleTask(t)}
                      className="shrink-0 text-stone-400 hover:text-emerald-600 transition-colors cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      ) : (
                        <Circle size={18} className="text-stone-300" />
                      )}
                    </button>

                    <span
                      className={`text-xs truncate ${
                        isDone ? 'line-through text-stone-400' : 'font-medium text-stone-900'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {formatJalaliDate(t.dueDate, { showMonthName: true })}
                    </span>

                    <button
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
