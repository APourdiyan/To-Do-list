import React, { useState } from 'react';
import { Task, DomainGroup } from '../../types';
import { store, useStore } from '../../store/useStore';
import {
  formatJalaliDate,
  addDaysJalali,
  getTodayJalali,
  toPersianDigits,
} from '../../lib/date/jalali';
import {
  Check,
  Calendar,
  Clock,
  ChevronDown,
  ChevronUp,
  Trash2,
  CalendarDays,
  Plus,
  Compass,
  FileText,
  Flame,
} from 'lucide-react';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  compact?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, compact = false }) => {
  const { domainGroups, goals, plans } = useStore();
  const [expanded, setExpanded] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');
  const [rescheduleMenuOpen, setRescheduleMenuOpen] = useState(false);

  const group =
    domainGroups.find((g) => g.id === task.groupId) ||
    SIX_LIFE_DOMAINS.find((d) => d.id === task.groupId);
  const goal = goals.find((g) => g.id === task.goalId);
  const plan = plans.find((p) => p.id === task.planId);
  const isCompleted = !!task.completedAt;
  const today = getTodayJalali().dateStr;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    store.toggleTaskCompleted(task.id);
  };

  const handleReschedule = (newDate: string) => {
    store.rescheduleTask(task.id, newDate);
    setRescheduleMenuOpen(false);
  };

  const handleAddSubTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTaskText.trim()) return;
    store.addSubTask(task.id, newSubTaskText.trim());
    setNewSubTaskText('');
  };

  const completedSubtasksCount = task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasksCount = task.subtasks?.length || 0;

  return (
    <div
      className={`group rounded-xl border transition-all duration-150 ${
        isCompleted
          ? 'bg-stone-50/70 border-stone-200/60 opacity-80'
          : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-xs'
      } overflow-hidden`}
      dir="rtl"
    >
      {/* ردیف اصلی وظیفه به صورت دو طبقه منظم و خوش‌خوان */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-3 sm:px-3.5 sm:py-2.5 cursor-pointer select-none space-y-1.5"
      >
        {/* طبقه بالا: چک‌باکس + عنوان برجسته و جادار + دکمه‌های کنترلی سریع */}
        <div className="flex items-start justify-between gap-3">
          {/* عنوان وظیفه با فونت خوانا و فضای کافی برای متون طولانی */}
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <button
              type="button"
              onClick={handleToggle}
              className={`w-5 h-5 mt-0.5 rounded-md shrink-0 flex items-center justify-center border transition-all ${
                isCompleted
                  ? 'bg-emerald-700 border-emerald-700 text-white shadow-2xs'
                  : 'border-stone-300 hover:border-stone-600 bg-stone-50 hover:bg-white'
              }`}
              title={isCompleted ? 'علامت‌گذاری به عنوان انجام‌نشده' : 'علامت‌گذاری به عنوان انجام‌شده'}
            >
              {isCompleted && <Check size={12} className="stroke-[3]" />}
            </button>

            <div className="flex-1 min-w-0">
              <span
                className={`text-sm sm:text-[14px] font-semibold leading-relaxed block break-words transition-colors ${
                  isCompleted
                    ? 'line-through text-stone-400 font-normal'
                    : 'text-stone-900 group-hover:text-black'
                }`}
              >
                {task.title}
              </span>
            </div>
          </div>

          {/* اکشن‌های سمت چپ: بازشو و حذف */}
          <div
            className="flex items-center gap-1 shrink-0 text-stone-400"
            onClick={(e) => e.stopPropagation()}
          >
            {/* منوی انتقال تاریخ */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setRescheduleMenuOpen(!rescheduleMenuOpen)}
                className="p-1.5 rounded-md text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                title="تغییر تاریخ موعد"
              >
                <CalendarDays size={13} />
              </button>

              {rescheduleMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setRescheduleMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-40 text-right text-xs">
                    <button
                      type="button"
                      onClick={() => handleReschedule(today)}
                      className="w-full text-right px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      امروز
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReschedule(addDaysJalali(today, 1))}
                      className="w-full text-right px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      فردا
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReschedule(addDaysJalali(today, 7))}
                      className="w-full text-right px-3 py-1.5 hover:bg-stone-50 text-stone-700 font-medium"
                    >
                      هفته آینده
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* حذف */}
            <button
              type="button"
              onClick={() => store.deleteTask(task.id)}
              className="p-1.5 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
              title="حذف کار"
            >
              <Trash2 size={13} />
            </button>

            {/* نشانگر باز/بسته */}
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        {/* طبقه پایین: مابقی جزئیات (برچسب حوزه، اولویت، تاریخ، ساعت، تعداد زیروظایف و پیش‌نمایش توضیح) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pr-7 pt-0.5 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* نشان اولویت مهم */}
            {task.priority === 'high' && !isCompleted && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                <Flame size={10} className="fill-rose-600 text-rose-600" />
                <span>اولویت مهم</span>
              </span>
            )}

            {/* برچسب حوزه/دسته */}
            {group && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium border"
                style={{
                  backgroundColor: `${group.color}12`,
                  borderColor: `${group.color}35`,
                  color: group.color,
                }}
              >
                {group.title}
              </span>
            )}

            {/* تاریخ موعد */}
            <span className="flex items-center gap-1 text-[10px] font-mono text-stone-400">
              <Calendar size={10} />
              <span>
                {task.dueDate === today
                  ? 'امروز'
                  : formatJalaliDate(task.dueDate, { showYear: false })}
              </span>
            </span>

            {/* ساعت موعد */}
            {task.dueTime && (
              <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                <Clock size={10} />
                <span>{task.dueTime}</span>
              </span>
            )}

            {/* تعداد زیروظایف */}
            {totalSubtasksCount > 0 && (
              <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                {toPersianDigits(completedSubtasksCount)} از {toPersianDigits(totalSubtasksCount)} گام
              </span>
            )}

            {/* نشان وجود یادداشت */}
            {task.notes && !expanded && (
              <span
                className="text-[10px] text-stone-400 flex items-center gap-0.5 bg-stone-100/90 px-1.5 py-0.5 rounded border border-stone-200/60"
                title="دارای یادداشت"
              >
                <FileText size={10} />
                <span>یادداشت</span>
              </span>
            )}
          </div>

          {/* نشان هدف متصل شده در طبقه پایین */}
          {goal && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-stone-400 truncate max-w-[150px]">
              <Compass size={10} className="text-amber-700 shrink-0" />
              <span className="truncate">{goal.title}</span>
            </span>
          )}
        </div>
      </div>

      {/* بخش گسترش‌پذیر در صورت کلیک: توضیحات تفصیلی، زیروظایف و فرم افزودن گام */}
      {expanded && (
        <div className="px-4 py-3 bg-stone-50/90 border-t border-stone-100 space-y-3 text-xs animate-in fade-in duration-150">
          {/* توضیحات کامل */}
          {task.notes && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-stone-500">یادداشت و جزئیات:</span>
              <p className="text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/80 text-xs">
                {task.notes}
              </p>
            </div>
          )}

          {/* اتصال به هدف یا طرح بالادستی */}
          {(goal || plan) && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
              <Compass size={13} className="text-amber-700" />
              <span>متصل به هدف بالادستی:</span>
              <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                {goal?.title || plan?.title}
              </span>
            </div>
          )}

          {/* زیروظایف */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-600 block">گام‌های اجرایی (زیروظایف):</span>
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="space-y-1.5 bg-white p-2.5 rounded-xl border border-stone-200/80">
                {task.subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 text-xs py-0.5 group/st"
                  >
                    <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => store.toggleSubTask(task.id, st.id)}
                        className="rounded text-stone-900 focus:ring-0 w-3.5 h-3.5"
                      />
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-stone-400' : 'text-stone-700'
                        }`}
                      >
                        {st.title}
                      </span>
                    </label>

                    <button
                      type="button"
                      onClick={() => store.deleteSubTask(task.id, st.id)}
                      className="opacity-0 group-hover/st:opacity-100 text-stone-300 hover:text-rose-600 p-0.5 transition-opacity"
                      title="حذف گام"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* فرم ثبت زیروظیفه جدید */}
            <form onSubmit={handleAddSubTask} className="flex items-center gap-1.5">
              <input
                type="text"
                value={newSubTaskText}
                onChange={(e) => setNewSubTaskText(e.target.value)}
                placeholder="افزودن گام جدید به این کار..."
                className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400"
              />
              <button
                type="submit"
                disabled={!newSubTaskText.trim()}
                className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-stone-100 rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus size={12} />
                <span>افزودن</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
