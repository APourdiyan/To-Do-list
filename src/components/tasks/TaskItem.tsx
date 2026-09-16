import React, { useState } from 'react';
import { Task } from '../../types';
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
  BellRing,
  BellOff,
  Pencil,
} from 'lucide-react';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
  compact?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = React.memo(({ task, compact = false }) => {
  const domainGroups = useStore((s) => s.domainGroups);
  const goals = useStore((s) => s.goals);
  const plans = useStore((s) => s.plans);

  const [expanded, setExpanded] = useState(false);
  const [newSubTaskText, setNewSubTaskText] = useState('');
  const [rescheduleMenuOpen, setRescheduleMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showGoalTooltip, setShowGoalTooltip] = useState(false);

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

  const handleSaveTitle = () => {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== task.title) {
      store.updateTask(task.id, { title: trimmed });
    } else {
      setEditedTitle(task.title);
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(task.title);
      setIsEditingTitle(false);
    }
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
    <article
      id={`task-item-${task.id}`}
      role="listitem"
      className={`group rounded-2xl border transition-all duration-150 ${
        isCompleted
          ? 'bg-stone-50/75 border-stone-200/70 opacity-85'
          : 'bg-white border-stone-200/90 hover:border-stone-300 shadow-2xs hover:shadow-xs'
      } overflow-hidden`}
      dir="rtl"
    >
      {/* ردیف اصلی وظیفه */}
      <div
        onClick={() => {
          if (!isEditingTitle) {
            setExpanded(!expanded);
          }
        }}
        className="p-3 sm:px-4 sm:py-3 cursor-pointer select-none space-y-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white rounded-2xl"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (!isEditingTitle && e.target === e.currentTarget) {
              e.preventDefault();
              setExpanded(!expanded);
            }
          }
        }}
      >
        {/* طبقه بالا: چک‌باکس با تاچ‌تارگت ارگونومیک (۴۴×۴۴) + عنوان + دکمه‌های کنترلی */}
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            {/* دکمه چک‌باکس با تاچ‌تارگت ارگونومیک (حداقل ۴۴×۴۴ پیکسل) */}
            <button
              id={`task-checkbox-${task.id}`}
              type="button"
              role="checkbox"
              aria-checked={isCompleted}
              aria-label={
                isCompleted
                  ? `تغییر وضعیت «${task.title}» به انجام‌نشده`
                  : `تکمیل کار: «${task.title}»`
              }
              onClick={handleToggle}
              className="min-w-11 min-h-11 -m-1.5 flex items-center justify-center rounded-xl shrink-0 transition-all duration-150 active:scale-90 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
            >
              <span
                className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                  isCompleted
                    ? 'bg-emerald-700 border-emerald-700 text-white shadow-xs scale-100'
                    : 'border-stone-300 hover:border-emerald-600 hover:bg-emerald-50/60 bg-stone-50'
                }`}
              >
                {isCompleted && (
                  <Check
                    size={14}
                    className="stroke-[3] animate-in zoom-in-50 duration-150"
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>

            <div className="flex-1 min-w-0 pt-0.5">
              {isEditingTitle ? (
                <div
                  className="flex items-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <label htmlFor={`edit-task-input-${task.id}`} className="sr-only">
                    ویرایش عنوان وظیفه
                  </label>
                  <input
                    id={`edit-task-input-${task.id}`}
                    type="text"
                    value={editedTitle}
                    autoFocus
                    maxLength={200}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleTitleKeyDown}
                    className="w-full px-2.5 py-1 text-sm bg-white border-2 border-stone-800 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800/70 shadow-2xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={handleSaveTitle}
                    className="min-h-11 min-w-11 px-3 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-bold shrink-0 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                    aria-label="ذخیره عنوان جدید"
                  >
                    ذخیره
                  </button>
                </div>
              ) : (
                <span
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setIsEditingTitle(true);
                  }}
                  title="برای ویرایش سریع عنوان دوبار کلیک کنید"
                  className={`text-sm sm:text-[14px] font-semibold leading-relaxed block break-words transition-colors select-text ${
                    isCompleted
                      ? 'line-through text-stone-400 font-normal'
                      : 'text-stone-900 group-hover:text-black'
                  }`}
                >
                  {task.title}
                </span>
              )}
            </div>
          </div>

          {/* اکشن‌های سمت چپ: ویرایش، انتقال تاریخ، حذف و آکاردئون با پدینگ لمسی ۴۴×۴۴ */}
          <div
            className="flex items-center gap-0.5 shrink-0 text-stone-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* دکمه ویرایش عنوان */}
            <button
              id={`task-edit-btn-${task.id}`}
              type="button"
              onClick={() => {
                setEditedTitle(task.title);
                setIsEditingTitle(!isEditingTitle);
              }}
              className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label={`ویرایش عنوان کار: ${task.title}`}
              title="ویرایش عنوان"
            >
              <Pencil size={15} aria-hidden="true" />
            </button>

            {/* منوی انتقال تاریخ */}
            <div className="relative">
              <button
                id={`task-reschedule-btn-${task.id}`}
                type="button"
                onClick={() => setRescheduleMenuOpen(!rescheduleMenuOpen)}
                className="min-w-11 min-h-11 flex items-center justify-center rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
                aria-label={`تغییر تاریخ موعد کار: ${task.title}`}
                title="تغییر تاریخ موعد"
              >
                <CalendarDays size={15} aria-hidden="true" />
              </button>

              {rescheduleMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setRescheduleMenuOpen(false)}
                  />
                  <div className="absolute left-0 mt-1 w-36 bg-white rounded-2xl shadow-xl border border-stone-200 py-1.5 z-40 text-right text-xs">
                    <button
                      type="button"
                      onClick={() => handleReschedule(today)}
                      className="w-full text-right px-3.5 py-2.5 hover:bg-stone-50 text-stone-800 font-medium focus:outline-none focus:bg-stone-100"
                    >
                      امروز
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReschedule(addDaysJalali(today, 1))}
                      className="w-full text-right px-3.5 py-2.5 hover:bg-stone-50 text-stone-800 font-medium focus:outline-none focus:bg-stone-100"
                    >
                      فردا
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReschedule(addDaysJalali(today, 7))}
                      className="w-full text-right px-3.5 py-2.5 hover:bg-stone-50 text-stone-800 font-medium focus:outline-none focus:bg-stone-100"
                    >
                      هفته آینده
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* دکمه حذف با تاچ‌تارگت ارگونومیک و پشتیبانی از Undo */}
            <button
              id={`task-delete-btn-${task.id}`}
              type="button"
              onClick={() => store.deleteTask(task.id)}
              className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-1 focus:ring-offset-white"
              aria-label={`حذف کار: ${task.title}`}
              title="حذف کار (با امکان بازگردانی ۵ ثانیه‌ای)"
            >
              <Trash2 size={15} aria-hidden="true" />
            </button>

            {/* نشانگر باز/بسته کردن آکاردئون */}
            <button
              id={`task-expand-btn-${task.id}`}
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              aria-label={
                expanded
                  ? `بستن جزئیات کار: ${task.title}`
                  : `مشاهده جزئیات کامل کار: ${task.title}`
              }
              aria-expanded={expanded}
              title="نمایش یا پنهان‌سازی جزئیات"
            >
              {expanded ? (
                <ChevronUp size={16} aria-hidden="true" />
              ) : (
                <ChevronDown size={16} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* طبقه پایین متادیتا — الگوی Progressive Disclosure:
            در موبایل به طور پیش‌فرض فقط ۲ نشان اصلی (اولویت مهم + تاریخ سررسید) دیده می‌شوند تا شلوغی بصری کاهش یابد.
            سایر نشان‌ها در دسکتاپ (md:) همیشه یا در موبایل پس از باز شدن (expanded) در دسترس‌اند. */}
        <div className="flex flex-wrap items-center justify-between gap-2 pr-8 pt-0.5 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* ۱. نشان اولویت مهم (نشان اصلی - همیشه مرئی) */}
            {task.priority === 'high' && !isCompleted && (
              <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                <Flame size={11} className="fill-rose-600 text-rose-600" aria-hidden="true" />
                <span>اولویت مهم</span>
              </span>
            )}

            {/* ۲. تاریخ موعد (نشان اصلی - همیشه مرئی) */}
            <span className="flex items-center gap-1 text-[10px] font-mono text-stone-600 font-medium">
              <Calendar size={11} className="text-stone-500" aria-hidden="true" />
              <span>
                {task.dueDate === today
                  ? 'امروز'
                  : formatJalaliDate(task.dueDate, { showYear: false })}
              </span>
            </span>

            {/* نشان‌های ثانویه: در دسکتاپ (md:) در حالت بسته دیده می‌شوند، در موبایل پنهان تا از شلوغی پرهیز شود */}
            {/* ۳. ساعت موعد */}
            {task.dueTime && (
              <span className="hidden md:flex items-center gap-0.5 text-[10px] font-mono text-amber-950 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                <Clock size={11} aria-hidden="true" />
                <span>{task.dueTime}</span>
              </span>
            )}

            {/* ۴. برچسب حوزه/دسته */}
            {group && (
              <span
                className="hidden md:inline-flex px-2 py-0.5 rounded text-[10px] font-medium border"
                style={{
                  backgroundColor: `${group.color}12`,
                  borderColor: `${group.color}35`,
                  color: group.color,
                }}
              >
                {group.title}
              </span>
            )}

            {/* ۵. نشان آلارم فعال */}
            {task.hasAlarm && (
              <span className="hidden md:flex items-center gap-1 text-[10px] font-mono text-amber-950 bg-amber-100/90 px-1.5 py-0.5 rounded-md border border-amber-300 shadow-2xs">
                <BellRing size={11} className="text-amber-700 animate-pulse" aria-hidden="true" />
                <span>
                  آلارم {task.alarmMinutesBefore ? `(${toPersianDigits(task.alarmMinutesBefore)}د قبل)` : 'فعال'}
                </span>
              </span>
            )}

            {/* ۶. تعداد زیروظایف */}
            {totalSubtasksCount > 0 && (
              <span className="hidden md:inline-flex text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                {toPersianDigits(completedSubtasksCount)} از {toPersianDigits(totalSubtasksCount)} گام
              </span>
            )}

            {/* ۷. نشان وجود یادداشت */}
            {task.notes && !expanded && (
              <span
                className="hidden md:flex text-[10px] text-stone-500 items-center gap-0.5 bg-stone-100/90 px-1.5 py-0.5 rounded border border-stone-200/60"
                title="دارای یادداشت"
              >
                <FileText size={11} aria-hidden="true" />
                <span>یادداشت</span>
              </span>
            )}
          </div>

          {/* نشان هدف متصل: در دسکتاپ با متن کامل؛ در موبایل با آیکون قطب‌نما و تولتیپ تپ */}
          {goal && (
            <div className="relative flex items-center">
              {/* در موبایل: آیکون هدف با دکمه و تاچ‌تارگت برای نمایش نام هدف */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGoalTooltip(!showGoalTooltip);
                }}
                className="md:hidden flex items-center gap-1 text-[10px] text-stone-600 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-200/80"
                aria-label={`هدف متصل: ${goal.title}`}
              >
                <Compass size={11} className="text-amber-700 shrink-0" aria-hidden="true" />
                <span className="font-medium text-amber-900">مسیر</span>
              </button>

              {showGoalTooltip && (
                <div
                  className="md:hidden absolute bottom-full left-0 mb-1 z-30 px-2.5 py-1.5 bg-stone-900 text-stone-100 text-[11px] rounded-xl shadow-xl whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-amber-300 font-bold block text-[10px]">هدف متصل:</span>
                  <span>{goal.title}</span>
                </div>
              )}

              {/* در دسکتاپ: نمایش متنی شفاف */}
              <span className="hidden md:flex items-center gap-1 text-[10px] text-stone-500 truncate max-w-[170px]">
                <Compass size={11} className="text-amber-700 shrink-0" aria-hidden="true" />
                <span className="truncate">{goal.title}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* بخش آکاردئون گسترش‌یافته در صورت کلیک */}
      {expanded && (
        <div className="px-4 py-3 bg-stone-50/90 border-t border-stone-200/80 space-y-3 text-xs animate-in fade-in duration-150">
          {/* ردیف متادیتاهای تکمیلی در حالت باز (مخصوصاً برای موبایل که در حالت بسته پنهان بودند) */}
          <div className="flex flex-wrap items-center gap-2 pb-1 border-b border-stone-200/60">
            {group && (
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium border"
                style={{
                  backgroundColor: `${group.color}15`,
                  borderColor: `${group.color}40`,
                  color: group.color,
                }}
              >
                حوزه: {group.title}
              </span>
            )}

            {task.dueTime && (
              <span className="flex items-center gap-1 text-[10px] font-mono text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                <Clock size={11} className="text-stone-500" aria-hidden="true" />
                <span>ساعت: {task.dueTime}</span>
              </span>
            )}

            {totalSubtasksCount > 0 && (
              <span className="text-[10px] font-bold text-stone-700 bg-white px-2 py-0.5 rounded border border-stone-200">
                پیشرفت گام‌ها: {toPersianDigits(completedSubtasksCount)} از {toPersianDigits(totalSubtasksCount)}
              </span>
            )}
          </div>

          {/* توضیحات کامل */}
          {task.notes && (
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-stone-600 block">یادداشت و جزئیات:</span>
              <p className="text-stone-800 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200/80 text-xs">
                {task.notes}
              </p>
            </div>
          )}

          {/* اتصال به هدف یا طرح بالادستی */}
          {(goal || plan) && (
            <div className="flex items-center gap-1.5 text-[11px] text-stone-700">
              <Compass size={14} className="text-amber-700 shrink-0" aria-hidden="true" />
              <span>متصل به هدف بالادستی:</span>
              <span className="font-bold text-stone-900 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                {goal?.title || plan?.title}
              </span>
            </div>
          )}

          {/* تنظیمات آلارم و ساعت انجام این کار */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-stone-200/80">
            <div className="flex items-center gap-2">
              <div
                className={`p-2 rounded-xl ${
                  task.hasAlarm ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-500'
                }`}
              >
                {task.hasAlarm ? (
                  <BellRing size={16} aria-hidden="true" />
                ) : (
                  <BellOff size={16} aria-hidden="true" />
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 block">
                  {task.hasAlarm ? 'آلارم و یادآوری فعال است' : 'آلارم غیرفعال است'}
                </span>
                <span className="text-[11px] text-stone-600 font-mono">
                  {task.dueTime ? `ساعت انجام: ${task.dueTime}` : 'بدون ساعت مشخص'}
                  {task.hasAlarm && task.alarmMinutesBefore
                    ? ` • ${toPersianDigits(task.alarmMinutesBefore)} دقیقه قبل`
                    : ''}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const willEnable = !task.hasAlarm;
                store.updateTask(task.id, {
                  hasAlarm: willEnable,
                  dueTime: willEnable && !task.dueTime ? '۱۰:۰۰' : task.dueTime,
                });
              }}
              className={`min-h-11 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                task.hasAlarm
                  ? 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100'
                  : 'bg-stone-50 text-stone-800 border-stone-300 hover:bg-stone-100'
              }`}
            >
              {task.hasAlarm ? 'غیرفعال‌سازی زنگ' : 'فعال‌سازی زنگ آلارم'}
            </button>
          </div>

          {/* زیروظایف */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-stone-700 block">
              گام‌های اجرایی (زیروظایف):
            </span>
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
                        className="rounded text-stone-900 focus:ring-stone-800 w-4 h-4 cursor-pointer"
                        aria-label={`تکمیل گام: ${st.title}`}
                      />
                      <span
                        className={`truncate ${
                          st.completed ? 'line-through text-stone-400' : 'text-stone-800 font-medium'
                        }`}
                      >
                        {st.title}
                      </span>
                    </label>

                    {/* دکمه حذف زیروظیفه:
                        در موبایل همیشه دیده می‌شود (opacity-100) و در دسکتاپ با hover پدیدار می‌گردد.
                        دارای تاچ‌تارگت استاندارد ۴۴×۴۴ */}
                    <button
                      type="button"
                      onClick={() => store.deleteSubTask(task.id, st.id)}
                      className="opacity-100 sm:opacity-0 sm:group-hover/st:opacity-100 text-stone-400 hover:text-rose-600 min-w-11 min-h-11 flex items-center justify-center rounded-xl transition-opacity focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
                      aria-label={`حذف گام: ${st.title}`}
                      title="حذف گام (با امکان بازگردانی)"
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* فرم ثبت زیروظیفه جدید با label استاندارد sr-only */}
            <form onSubmit={handleAddSubTask} className="flex items-center gap-1.5">
              <label htmlFor={`subtask-input-${task.id}`} className="sr-only">
                افزودن گام جدید به کار
              </label>
              <input
                id={`subtask-input-${task.id}`}
                type="text"
                value={newSubTaskText}
                maxLength={200}
                onChange={(e) => setNewSubTaskText(e.target.value)}
                placeholder="افزودن گام جدید به این کار..."
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs placeholder:text-stone-500 text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
              />
              <button
                type="submit"
                disabled={!newSubTaskText.trim()}
                className="min-h-11 px-3.5 bg-stone-900 hover:bg-black text-stone-100 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors flex items-center justify-center gap-1 cursor-pointer shrink-0 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                aria-label="افزودن گام جدید"
              >
                <Plus size={14} aria-hidden="true" />
                <span>افزودن</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </article>
  );
});
