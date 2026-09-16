import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { TaskItem } from '../tasks/TaskItem';
import { toPersianDigits, getTodayJalali } from '../../lib/date/jalali';
import { Task, Priority, DomainGroup } from '../../types';
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
  Settings2,
  Heart,
  Dumbbell,
  Code,
  DollarSign,
  Users,
  Palette,
  Music,
  Home,
} from 'lucide-react';

const renderDomainIcon = (iconName: string, size = 18) => {
  switch (iconName) {
    case 'Briefcase':
      return <Briefcase size={size} />;
    case 'GraduationCap':
      return <GraduationCap size={size} />;
    case 'BookOpen':
      return <BookOpen size={size} />;
    case 'Activity':
      return <Activity size={size} />;
    case 'Dumbbell':
      return <Dumbbell size={size} />;
    case 'Heart':
      return <Heart size={size} />;
    case 'Sparkles':
      return <Sparkles size={size} />;
    case 'Coffee':
      return <Coffee size={size} />;
    case 'Code':
      return <Code size={size} />;
    case 'DollarSign':
      return <DollarSign size={size} />;
    case 'Users':
      return <Users size={size} />;
    case 'Palette':
      return <Palette size={size} />;
    case 'Music':
      return <Music size={size} />;
    case 'Home':
      return <Home size={size} />;
    default:
      return <LayoutGrid size={size} />;
  }
};

interface DomainCardProps {
  domain: DomainGroup;
  tasks: Task[];
  onAddTask: (title: string, priority: Priority) => void;
}

const DomainCard: React.FC<DomainCardProps> = ({ domain, tasks, onAddTask }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [quickTitle, setQuickTitle] = useState('');
  const [quickPriority, setQuickPriority] = useState<Priority>('medium');
  const [showCompleted, setShowCompleted] = useState(false);

  const pendingTasks = tasks.filter((t) => !t.completedAt);
  const completedTasks = tasks.filter((t) => !!t.completedAt);
  const highPriorityTasks = pendingTasks.filter((t) => t.priority === 'urgent' || t.priority === 'high');
  const regularTasks = pendingTasks.filter((t) => t.priority !== 'urgent' && t.priority !== 'high');

  const completionRate =
    tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

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
      <div className="p-4 border-b border-stone-100 bg-stone-50/40 space-y-2">
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
              {renderDomainIcon(domain.icon, 16)}
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-extrabold text-stone-900 tracking-tight leading-tight truncate">
                {domain.title}
              </h4>
              {domain.subtitle && (
                <p className="text-[11px] text-stone-500 truncate mt-0.5">
                  {domain.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* کلید ثبت کار سریع در این حوزه */}
          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer shrink-0"
            title="افزودن اقدام به این بعد"
          >
            <Plus size={16} />
          </button>
        </div>

        {/* نوار پیشرفت انجام کارهای این حوزه */}
        <div className="space-y-1 pt-1">
          <div className="flex items-center justify-between text-[10px] font-medium text-stone-500">
            <span>
              {toPersianDigits(completedTasks.length)} از {toPersianDigits(tasks.length)} انجام شد
            </span>
            <span className="font-mono">{toPersianDigits(completionRate)}٪</span>
          </div>
          <div className="w-full h-1.5 bg-stone-200/80 rounded-full overflow-hidden">
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

      {/* محتوای کارهای حوزه */}
      <div className="p-3.5 sm:p-4 space-y-3 flex-1 flex flex-col">
        {/* فرم ثبت اقدام سریع در حوزه */}
        {isAdding && (
          <form
            onSubmit={handleQuickAdd}
            className="bg-amber-50/70 border border-amber-300/80 rounded-xl p-2.5 space-y-2 animate-in fade-in duration-150"
          >
            <input
              type="text"
              autoFocus
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder={`اقدام جدید برای ${domain.title}...`}
              className="w-full text-xs bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <div className="flex items-center justify-between gap-1.5 pt-1">
              <select
                value={quickPriority}
                onChange={(e) => setQuickPriority(e.target.value as Priority)}
                className="text-[11px] bg-white border border-stone-200 rounded-lg px-2 py-1 text-stone-700"
              >
                <option value="low">اولویت عادی</option>
                <option value="medium">اولویت متوسط</option>
                <option value="high">اولویت بالا 🔥</option>
                <option value="urgent">فوری و حیاتی ⚡</option>
              </select>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-2 py-1 text-[11px] text-stone-500 hover:text-stone-800 cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-[11px] rounded-lg shadow-2xs transition-colors cursor-pointer"
                >
                  ثبت
                </button>
              </div>
            </div>
          </form>
        )}

        {/* لیست کارهای با اولویت بالا */}
        {highPriorityTasks.length > 0 && (
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold text-rose-800 flex items-center gap-1 bg-rose-50/70 px-2 py-0.5 rounded-md w-fit">
              <Flame size={11} className="fill-rose-600 text-rose-600" />
              <span>فوری / بااهمیت</span>
            </div>
            <div className="space-y-1.5">
              {highPriorityTasks.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </div>
        )}

        {/* لیست کارهای در دست اقدام عادی */}
        {regularTasks.length > 0 && (
          <div className="space-y-1.5">
            {highPriorityTasks.length > 0 && (
              <div className="text-[10px] font-bold text-stone-500 flex items-center gap-1 pt-1">
                <ListTodo size={11} />
                <span>سایر اقدامات</span>
              </div>
            )}
            <div className="space-y-1.5">
              {regularTasks.map((t) => (
                <TaskItem key={t.id} task={t} />
              ))}
            </div>
          </div>
        )}

        {/* پیام خالی بودن */}
        {tasks.length === 0 && !isAdding ? (
          <div className="py-6 text-center text-stone-400 text-xs space-y-1.5 my-auto">
            <p>کاری برای این بعد ثبت نشده است</p>
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer"
            >
              + افزودن اقدام اولیه
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
  const { tasks, domainGroups, selectedDate } = useStore();
  const today = getTodayJalali();
  const activeDate = selectedDate || today.dateStr;

  // فیلتر کارهای روز فعال
  const todayTasks = tasks.filter((t) => t.dueDate === activeDate);

  const handleAddTaskForDomain = (domainId: string, title: string, priority: Priority) => {
    store.addTask({
      title,
      groupId: domainId,
      dueDate: activeDate,
      priority,
      subtasks: [],
    });
  };

  return (
    <section className="space-y-4 sm:space-y-5" dir="rtl">
      {/* سربرگ معرفی حالت ابعاد زندگی با دکمه شخصی‌سازی */}
      <div className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
            <LayoutGrid size={15} className="text-amber-700" />
            <span>ساماندهی بر مبنای ابعاد و حوزه‌های زندگی (اختیاری)</span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
            تمرکز متوازن بر ابعاد اختصاصی زندگی شما ({toPersianDigits(domainGroups.length)} حوزه فعال)
          </h3>
          <p className="text-xs text-stone-500 max-w-xl leading-relaxed">
            این ساختار کاملاً اختیاری و قابل شخصی‌سازی است. می‌توانید حوزه‌های متناسب با کار، زندگی و اهداف خود را بسازید یا ویرایش کنید.
          </p>
        </div>

        {/* کلیدهای شخصی‌سازی و اقدام جدید */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => store.setManageDomainsModalOpen(true)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-stone-200 transition-colors cursor-pointer"
            title="افزودن، ویرایش یا تغییر ابعاد زندگی"
          >
            <Settings2 size={14} className="text-amber-700" />
            <span>شخصی‌سازی ابعاد</span>
          </button>

          <button
            type="button"
            onClick={() => store.setQuickAddModalOpen(true, 'task')}
            className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>اقدام جدید</span>
          </button>
        </div>
      </div>

      {/* شبکه کارت‌های ابعاد زندگی تعریف‌شده توسط کاربر */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {domainGroups.map((group) => {
          // کارهای متعلق به این حوزه
          const domainTasks = todayTasks.filter((t) => {
            if (t.groupId === group.id) return true;
            // نگاشت کارهای با شناسه‌های تطبیقی
            if (group.id === 'career' && t.groupId === 'work') return true;
            if (group.id === 'work' && t.groupId === 'career') return true;
            if (group.id === 'study' && (t.groupId === 'uni' || t.groupId === 'study')) return true;
            if (group.id === 'growth' && t.groupId === 'skills') return true;
            if (group.id === 'daily' && t.groupId === 'personal') return true;
            return false;
          });

          return (
            <DomainCard
              key={group.id}
              domain={group}
              tasks={domainTasks}
              onAddTask={(title, priority) => handleAddTaskForDomain(group.id, title, priority)}
            />
          );
        })}
      </div>
    </section>
  );
};
