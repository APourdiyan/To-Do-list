import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import { TaskItem } from '../tasks/TaskItem';
import { toPersianDigits, getTodayJalali } from '../../lib/date/jalali';
import { Task, Priority } from '../../types';
import {
  Sparkles,
  Briefcase,
  BookOpen,
  GraduationCap,
  Activity,
  Coffee,
  Plus,
  CheckCircle2,
  ListTodo,
  Flame,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DomainCardProps {
  domain: typeof SIX_LIFE_DOMAINS[0];
  tasks: Task[];
  onAddTask: (title: string, priority: Priority) => void;
}

const getDomainIcon = (key: string, size = 18) => {
  switch (key) {
    case 'spiritual':
      return <Sparkles size={size} />;
    case 'career':
      return <Briefcase size={size} />;
    case 'study':
      return <BookOpen size={size} />;
    case 'growth':
      return <GraduationCap size={size} />;
    case 'fitness':
      return <Activity size={size} />;
    case 'daily':
    default:
      return <Coffee size={size} />;
  }
};

const DomainCard: React.FC<DomainCardProps> = ({ domain, tasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('medium');
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completedAt);
  const completedTasks = tasks.filter((t) => !!t.completedAt);
  const completionRate =
    tasks.length > 0
      ? Math.round((completedTasks.length / tasks.length) * 100)
      : 0;

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask(quickTitle.trim(), quickPriority);
    setQuickTitle('');
    setQuickPriority('medium');
    setIsAdding(false);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs hover:shadow-xs hover:border-stone-300 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
      dir="rtl"
    >
      {/* سربرگ حوزه با خط رنگی و عنوان شاخص */}
      <div className="p-4 sm:p-4.5 border-b border-stone-100 bg-stone-50/40 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* آیکون و عنوان حوزه */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-3xs"
              style={{
                backgroundColor: `${domain.color}18`,
                color: domain.color,
              }}
            >
              {getDomainIcon(domain.iconKey, 16)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight leading-tight truncate">
                {domain.title}
              </h4>
              <p className="text-[11px] text-stone-500 truncate mt-0.5">
                {domain.subtitle}
              </p>
            </div>
          </div>

          {/* کلید ثبت کار سریع در این حوزه */}
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="w-7 h-7 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200/70 border border-stone-200/80 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
            title={`افزودن کار جدید در ${domain.title}`}
          >
            <Plus size={14} className="stroke-[2.5]" />
          </button>
        </div>

        {/* نوار وضعیت پیشرفت کارهای این حوزه */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] text-stone-500">
            <span>
              {toPersianDigits(completedTasks.length)} از {toPersianDigits(tasks.length)} اقدام امروز
            </span>
            <span className="font-bold font-mono text-stone-700">
              {toPersianDigits(completionRate)}٪
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${completionRate}%`,
                backgroundColor: domain.color,
              }}
            />
          </div>
        </div>
      </div>

      {/* محتوای کارها */}
      <div className="p-3 sm:p-3.5 space-y-2.5 flex-1 min-h-[140px] flex flex-col justify-start">
        {/* فرم ثبت سریع کار درون‌کارتی */}
        {isAdding && (
          <form
            onSubmit={handleQuickAdd}
            className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 animate-in fade-in duration-150"
          >
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder={`یک اقدام مشخص برای ${domain.title}...`}
              autoFocus
              className="w-full px-2.5 py-1.5 bg-white border border-stone-300 focus:border-stone-800 rounded-lg text-xs font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
            />
            <div className="flex items-center justify-between gap-1.5 pt-0.5 text-[11px]">
              <label className="flex items-center gap-1 text-stone-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={quickPriority === 'high'}
                  onChange={(e) => setQuickPriority(e.target.checked ? 'high' : 'medium')}
                  className="rounded text-rose-600 focus:ring-0 w-3 h-3"
                />
                <span className={quickPriority === 'high' ? 'font-bold text-rose-700' : ''}>
                  اولویت مهم
                </span>
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setQuickTitle('');
                  }}
                  className="px-2 py-1 text-stone-500 hover:text-stone-800 rounded text-[11px]"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={!quickTitle.trim()}
                  className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-lg text-[11px] font-bold disabled:opacity-40"
                >
                  ثبت
                </button>
              </div>
            </div>
          </form>
        )}

        {/* لیست کارهای فعال */}
        {pendingTasks.length > 0 ? (
          <div className="space-y-2">
            {pendingTasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        ) : !isAdding ? (
          <div className="flex-1 flex flex-col items-center justify-center py-5 text-stone-400 text-center">
            <span className="text-xs font-medium">اقدام فعالی در این حوزه نیست</span>
            <button
              onClick={() => setIsAdding(true)}
              className="text-[11px] text-amber-800 hover:underline mt-1 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={11} />
              <span>افزودن اقدام</span>
            </button>
          </div>
        ) : null}

        {/* بخش کارهای انجام شده */}
        {completedTasks.length > 0 && (
          <div className="pt-2 border-t border-stone-100 mt-auto">
            <button
              type="button"
              onClick={() => setShowCompleted(!showCompleted)}
              className="text-[11px] font-medium text-stone-500 hover:text-stone-800 flex items-center justify-between w-full py-1 cursor-pointer"
            >
              <span className="flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-700" />
                <span>انجام‌شده ({toPersianDigits(completedTasks.length)})</span>
              </span>
              {showCompleted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {showCompleted && (
              <div className="space-y-1.5 pt-1.5 opacity-80 animate-in fade-in duration-150">
                {completedTasks.map((t) => (
                  <TaskItem key={t.id} task={t} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export const TodaySixDomainsView: React.FC = () => {
  const { tasks } = useStore();
  const today = getTodayJalali();

  // فیلتر کارهای امروز
  const todayTasks = tasks.filter((t) => t.dueDate === today.dateStr);

  const handleAddTaskForDomain = (domainId: string, title: string, priority: Priority) => {
    store.addTask({
      title,
      groupId: domainId,
      dueDate: today.dateStr,
      priority,
      subtasks: [],
    });
  };

  // محاسبه آمار کلی ۶ حوزه
  const totalTasks = todayTasks.length;
  const completedCount = todayTasks.filter((t) => !!t.completedAt).length;

  return (
    <section className="space-y-4 sm:space-y-5" dir="rtl">
      {/* سربرگ معرفی حالت ۶ حوزه زندگی */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <LayoutGrid size={15} className="text-amber-700" />
            <span>نظم ۶ حوزه بنیادین زندگی</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
            سازماندهی متوازن تمام ابعاد روز در ۶ ستون معین
          </h3>
          <p className="text-xs text-stone-500">
            هر کار و وظیفه جایگاه مشخصی دارد؛ از تمرین و مطالعه تا شغل، معنویت، رشد فردی و کارهای روزمره.
          </p>
        </div>

        {/* کلید تغییر حالت یا افزودن کار کلی */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            onClick={() => store.setQuickAddModalOpen(true, 'task')}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>اقدام جدید</span>
          </button>
        </div>
      </div>

      {/* شبکه ماتریسی ۶ حوزه */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {SIX_LIFE_DOMAINS.map((domain) => {
          // کارهای متعلق به این حوزه (بر اساس تطبیق شناسه یا دسته‌بندی معادل)
          const domainTasks = todayTasks.filter((t) => {
            if (t.groupId === domain.id) return true;
            // نگاشت کارهای با شناسه‌های قدیمی پیش‌فرض
            if (domain.id === 'career' && t.groupId === 'work') return true;
            if (domain.id === 'study' && (t.groupId === 'uni' || t.groupId === 'study')) return true;
            if (domain.id === 'daily' && t.groupId === 'personal') return true;
            return false;
          });

          return (
            <DomainCard
              key={domain.id}
              domain={domain}
              tasks={domainTasks}
              onAddTask={(title, priority) => handleAddTaskForDomain(domain.id, title, priority)}
            />
          );
        })}
      </div>
    </section>
  );
};
