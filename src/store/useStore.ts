import { useSyncExternalStore } from 'react';
import {
  ActiveTab,
  DomainGroup,
  Event,
  Goal,
  Plan,
  Task,
  UserSettings,
  DailyJournalEntry,
  MoodType,
  DailyAccounting,
  DailyExpense,
  DailyChecklistItem,
} from '../types';
import { DEFAULT_DOMAIN_GROUPS, getInitialSeedData } from '../data/seed';
import { getTodayJalali } from '../lib/date/jalali';
import { calculatePaceByDailyMinutes, RestDaysPattern } from '../lib/coursePace';

const STORAGE_KEY = 'daftar-zendegi:v1';

export const DEFAULT_CHECKLIST_ITEMS: DailyChecklistItem[] = [
  { id: 'ch-1', domainId: 'spiritual', title: 'نماز اول وقت و حضور قلب', description: 'توجه و آرامش در عبادت' },
  { id: 'ch-2', domainId: 'spiritual', title: '۱۰ دقیقه خلوت، تدبر یا ذکر روز', description: 'تغذیه روح و سکوت ذهنی' },
  { id: 'ch-3', domainId: 'career', title: 'بلوک تمرکز و کار عمیق (۹۰ دقیقه)', description: 'بدون شبکه‌های اجتماعی و نوتیفیکیشن' },
  { id: 'ch-4', domainId: 'study', title: 'مطالعه روزانه (حداقل ۲۰ دقیقه کتاب یا مقاله)', description: 'افزایش بینش و آگاهی' },
  { id: 'ch-5', domainId: 'skills', title: 'تمرین مهارت فردی یا زبان (۳۰ دقیقه)', description: 'استمرار روزانه در یادگیری' },
  { id: 'ch-6', domainId: 'exercise', title: 'تحرک بدنی و ورزش یا پیاده‌روی (۳۰ دقیقه)', description: 'سلامت جسم و شادابی انرژی' },
  { id: 'ch-7', domainId: 'general', title: 'محاسبه اعمال و نظم فردی پایان روز', description: 'مرور عملکرد و حسابرسی صادقانه' },
];

export interface StoreState {
  goals: Goal[];
  plans: Plan[];
  tasks: Task[];
  events: Event[];
  domainGroups: DomainGroup[];
  dailyEntries: Record<string, DailyJournalEntry>;
  dailyAccountings: Record<string, DailyAccounting>;
  dailyExpenses: DailyExpense[];
  checklistItems: DailyChecklistItem[];
  checklistLogs: Record<string, string[]>; // تاریخ -> شناسه‌های آیتم‌های تکمیل‌شده
  settings: UserSettings;
  activeTab: ActiveTab;
  selectedDate: string;
  searchModalOpen: boolean;
  quickAddModalOpen: boolean;
  philosophyModalOpen: boolean;
  checklistDrawerOpen: boolean; // کشوی چک‌لیست ۶ حوزه
  accountingModalOpen: boolean; // مدال محاسبه اعمال و مخارج
  quickAddDefaultType: 'task' | 'event' | 'goal';
}

function loadInitialState(): StoreState {
  const today = getTodayJalali();
  const defaultSettings: UserSettings = {
    showGregorian: true,
    showHolidays: true,
    theme: 'paper',
    dailyQuote: true,
    hideGuideBanner: true,
    lifeDomainsMode: true,
  };

  const defaultAccounting: DailyAccounting = {
    date: today.dateStr,
    goodDeeds: ['شروع به‌موقع روز و پایبندی به برنامه', 'کمک و گره‌گشایی از کار همکار'],
    badDeeds: ['تعلل کوتاه در شروع کار عمیق'],
    satisfactionScore: 8,
    reflectionNote: 'فردا با تمرکز روی اولویت‌های اصلی آغاز می‌کنم.',
  };

  const defaultExpenses: DailyExpense[] = [
    { id: 'exp-1', date: today.dateStr, title: 'خرید میوه و مایحتاج روزانه', amount: 145000, category: 'food', createdAt: today.dateStr },
    { id: 'exp-2', date: today.dateStr, title: 'هزینه رفت و آمد شهری', amount: 28000, category: 'transport', createdAt: today.dateStr },
  ];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        goals: parsed.goals || [],
        plans: parsed.plans || [],
        tasks: parsed.tasks || [],
        events: parsed.events || [],
        domainGroups: parsed.domainGroups || DEFAULT_DOMAIN_GROUPS,
        dailyEntries: parsed.dailyEntries || {},
        dailyAccountings: parsed.dailyAccountings || { [today.dateStr]: defaultAccounting },
        dailyExpenses: parsed.dailyExpenses || defaultExpenses,
        checklistItems: parsed.checklistItems || DEFAULT_CHECKLIST_ITEMS,
        checklistLogs: parsed.checklistLogs || { [today.dateStr]: ['ch-1', 'ch-3'] },
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
        activeTab: 'today',
        selectedDate: today.dateStr,
        searchModalOpen: false,
        quickAddModalOpen: false,
        philosophyModalOpen: false,
        checklistDrawerOpen: false,
        accountingModalOpen: false,
        quickAddDefaultType: 'task',
      };
    }
  } catch (e) {
    console.warn('Failed to parse saved state, loading seed data', e);
  }

  const seed = getInitialSeedData();
  return {
    goals: seed.goals,
    plans: seed.plans,
    tasks: seed.tasks,
    events: seed.events,
    domainGroups: DEFAULT_DOMAIN_GROUPS,
    dailyEntries: seed.dailyEntries,
    dailyAccountings: { [today.dateStr]: defaultAccounting },
    dailyExpenses: defaultExpenses,
    checklistItems: DEFAULT_CHECKLIST_ITEMS,
    checklistLogs: { [today.dateStr]: ['ch-1', 'ch-3'] },
    settings: defaultSettings,
    activeTab: 'today',
    selectedDate: today.dateStr,
    searchModalOpen: false,
    quickAddModalOpen: false,
    philosophyModalOpen: false,
    checklistDrawerOpen: false,
    accountingModalOpen: false,
    quickAddDefaultType: 'task',
  };
}

let currentState: StoreState = loadInitialState();
const listeners = new Set<() => void>();

function notify() {
  // ذخیره پایدار در localStorage
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        goals: currentState.goals,
        plans: currentState.plans,
        tasks: currentState.tasks,
        events: currentState.events,
        domainGroups: currentState.domainGroups,
        dailyEntries: currentState.dailyEntries,
        dailyAccountings: currentState.dailyAccountings,
        dailyExpenses: currentState.dailyExpenses,
        checklistItems: currentState.checklistItems,
        checklistLogs: currentState.checklistLogs,
        settings: currentState.settings,
      })
    );
  } catch (e) {
    console.error('Failed to persist to localStorage', e);
  }

  listeners.forEach((listener) => listener());
}

function updateState(partial: Partial<StoreState> | ((prev: StoreState) => Partial<StoreState>)) {
  const next = typeof partial === 'function' ? partial(currentState) : partial;
  currentState = { ...currentState, ...next };
  notify();
}

export const store = {
  getSnapshot(): StoreState {
    return currentState;
  },

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Actions
  setActiveTab(tab: ActiveTab) {
    updateState({ activeTab: tab });
  },

  setSelectedDate(dateStr: string) {
    updateState({ selectedDate: dateStr });
  },

  setSearchModalOpen(open: boolean) {
    updateState({ searchModalOpen: open });
  },

  setQuickAddModalOpen(open: boolean, defaultType: 'task' | 'event' | 'goal' = 'task') {
    updateState({ quickAddModalOpen: open, quickAddDefaultType: defaultType });
  },

  setPhilosophyModalOpen(open: boolean) {
    updateState({ philosophyModalOpen: open });
  },

  // Tasks actions
  addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = getTodayJalali().dateStr;
    const newTask: Task = {
      ...taskData,
      id: 't-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      createdAt: now,
      updatedAt: now,
    };
    updateState((prev) => ({ tasks: [newTask, ...prev.tasks] }));
    return newTask;
  },

  updateTask(taskId: string, updates: Partial<Task>) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      tasks: prev.tasks.map((t) => (t.id === taskId ? { ...t, ...updates, updatedAt: now } : t)),
    }));
  },

  deleteTask(taskId: string) {
    updateState((prev) => ({
      tasks: prev.tasks.filter((t) => t.id !== taskId),
    }));
  },

  toggleTaskCompleted(taskId: string) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const isCompleted = !!t.completedAt;
        return {
          ...t,
          completedAt: isCompleted ? undefined : `${now} ${new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}`,
          updatedAt: now,
        };
      }),
    }));
  },

  rescheduleTask(taskId: string, newDueDate: string) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, dueDate: newDueDate, updatedAt: now } : t
      ),
    }));
  },

  addSubTask(taskId: string, title: string) {
    const subId = 'st-' + Date.now();
    updateState((prev) => ({
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const subtasks = t.subtasks ? [...t.subtasks, { id: subId, title, completed: false }] : [{ id: subId, title, completed: false }];
        return { ...t, subtasks };
      }),
    }));
  },

  toggleSubTask(taskId: string, subtaskId: string) {
    updateState((prev) => ({
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        const subtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...t, subtasks };
      }),
    }));
  },

  deleteSubTask(taskId: string, subtaskId: string) {
    updateState((prev) => ({
      tasks: prev.tasks.map((t) => {
        if (t.id !== taskId || !t.subtasks) return t;
        const subtasks = t.subtasks.filter((st) => st.id !== subtaskId);
        return { ...t, subtasks };
      }),
    }));
  },

  // Goals actions
  addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = getTodayJalali().dateStr;
    const newGoal: Goal = {
      ...goalData,
      id: 'g-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    updateState((prev) => ({ goals: [...prev.goals, newGoal] }));
    return newGoal;
  },

  updateGoal(goalId: string, updates: Partial<Goal>) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      goals: prev.goals.map((g) => (g.id === goalId ? { ...g, ...updates, updatedAt: now } : g)),
    }));
  },

  deleteGoal(goalId: string) {
    updateState((prev) => ({
      goals: prev.goals.filter((g) => g.id !== goalId),
      // حذف ارجاعات این هدف در وظایف و برنامه‌ها
      tasks: prev.tasks.map((t) => (t.goalId === goalId ? { ...t, goalId: undefined } : t)),
      plans: prev.plans.map((p) => (p.goalId === goalId ? { ...p, goalId: undefined } : p)),
    }));
  },

  // افزودن دوره یا مهارت با گام‌بندی زمانی (Pace Planner)
  addCourseGoal(params: {
    title: string;
    description?: string;
    totalHours: number;
    dailyMinutes: number;
    startDate: string;
    restDaysPattern?: RestDaysPattern;
    scheduleTasks?: boolean;
    color?: string;
  }) {
    const pattern = params.restDaysPattern || 'all_days';
    const pace = calculatePaceByDailyMinutes(
      params.totalHours,
      params.dailyMinutes,
      params.startDate,
      pattern
    );

    const now = getTodayJalali().dateStr;
    const newGoalId = 'g-course-' + Date.now();

    const newGoal: Goal = {
      id: newGoalId,
      title: params.title.trim(),
      description: params.description?.trim() || `دوره ${params.totalHours} ساعته با تعهد روزی ${params.dailyMinutes} دقیقه`,
      level: 'medium',
      startDate: params.startDate,
      endDate: pace.estimatedEndDate,
      progress: 0,
      status: 'active',
      color: params.color || '#2b534b',
      courseDetails: {
        totalHours: params.totalHours,
        completedMinutes: 0,
        dailyCommitmentMinutes: params.dailyMinutes,
        estimatedDays: pace.totalSessions,
        restDaysPattern: pattern,
        scheduledTasksCreated: !!params.scheduleTasks,
      },
      createdAt: now,
      updatedAt: now,
    };

    let generatedTasks: Task[] = [];
    if (params.scheduleTasks) {
      // ایجاد تسک‌های جلسات زمان‌بندی‌شده (تا سقف ۶۰ جلسه اولیه برای جلوگیری از بار سنگین)
      const sessionsToCreate = pace.sessionsSchedule.slice(0, 60);
      generatedTasks = sessionsToCreate.map((session) => ({
        id: `t-c-${newGoalId}-${session.sessionNumber}`,
        title: `جلسه ${session.sessionNumber} از دوره «${params.title}» (${session.minutes} دقیقه)`,
        dueDate: session.dateStr,
        groupId: 'education',
        goalId: newGoalId,
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
      }));
    }

    updateState((prev) => ({
      goals: [newGoal, ...prev.goals],
      tasks: [...generatedTasks, ...prev.tasks],
    }));

    return newGoal;
  },

  // ثبت پیشرفت مطالعه یک دوره مهارتی (مثلاً: ۳۰ دقیقه خواندم)
  logCourseSession(goalId: string, minutes: number, dateStr?: string) {
    const today = getTodayJalali();
    const targetDate = dateStr || today.dateStr;
    const now = today.dateStr;

    let targetGoalTitle = '';

    updateState((prev) => {
      const updatedGoals = prev.goals.map((g) => {
        if (g.id !== goalId || !g.courseDetails) return g;
        targetGoalTitle = g.title;
        const totalMinutes = g.courseDetails.totalHours * 60;
        const newCompleted = Math.min(totalMinutes, g.courseDetails.completedMinutes + minutes);
        const newProgress = totalMinutes > 0 ? Math.min(100, Math.round((newCompleted / totalMinutes) * 100)) : 100;
        const newStatus = newProgress >= 100 ? 'completed' : g.status;

        return {
          ...g,
          progress: newProgress,
          status: newStatus,
          courseDetails: {
            ...g.courseDetails,
            completedMinutes: newCompleted,
          },
          updatedAt: now,
        };
      });

      // ثبت یک تسک تکمیل‌شده در کارنامه امروز به عنوان ثبت افتخار پیشرفت
      const logTask: Task = {
        id: 't-log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        title: `مطالعه و تمرین: ${targetGoalTitle || 'دوره مهارتی'} (${minutes} دقیقه)`,
        dueDate: targetDate,
        groupId: 'education',
        goalId: goalId,
        priority: 'medium',
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      return {
        goals: updatedGoals,
        tasks: [logTask, ...prev.tasks],
      };
    });
  },

  // تولید تسک‌های تقویمی برای دوره‌ای که تسک‌هایش هنوز ایجاد نشده
  scheduleCourseTasks(goalId: string) {
    const today = getTodayJalali();
    const now = today.dateStr;

    updateState((prev) => {
      const goal = prev.goals.find((g) => g.id === goalId);
      if (!goal || !goal.courseDetails || goal.courseDetails.scheduledTasksCreated) {
        return prev;
      }

      const remainingMinutes = (goal.courseDetails.totalHours * 60) - goal.courseDetails.completedMinutes;
      if (remainingMinutes <= 0) return prev;

      const remainingHours = remainingMinutes / 60;
      const pace = calculatePaceByDailyMinutes(
        remainingHours,
        goal.courseDetails.dailyCommitmentMinutes,
        today.dateStr,
        goal.courseDetails.restDaysPattern
      );

      const sessionsToCreate = pace.sessionsSchedule.slice(0, 60);
      const generatedTasks: Task[] = sessionsToCreate.map((session) => ({
        id: `t-c-${goal.id}-${session.sessionNumber}-${Date.now().toString(36)}`,
        title: `جلسه ${session.sessionNumber} از دوره «${goal.title}» (${session.minutes} دقیقه)`,
        dueDate: session.dateStr,
        groupId: 'education',
        goalId: goal.id,
        priority: 'medium',
        createdAt: now,
        updatedAt: now,
      }));

      const updatedGoals = prev.goals.map((g) =>
        g.id === goalId
          ? {
              ...g,
              courseDetails: {
                ...g.courseDetails!,
                scheduledTasksCreated: true,
              },
            }
          : g
      );

      return {
        goals: updatedGoals,
        tasks: [...generatedTasks, ...prev.tasks],
      };
    });
  },

  // Plans actions
  addPlan(planData: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = getTodayJalali().dateStr;
    const newPlan: Plan = {
      ...planData,
      id: 'p-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    updateState((prev) => ({ plans: [...prev.plans, newPlan] }));
    return newPlan;
  },

  updatePlan(planId: string, updates: Partial<Plan>) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      plans: prev.plans.map((p) => (p.id === planId ? { ...p, ...updates, updatedAt: now } : p)),
    }));
  },

  deletePlan(planId: string) {
    updateState((prev) => ({
      plans: prev.plans.filter((p) => p.id !== planId),
      tasks: prev.tasks.map((t) => (t.planId === planId ? { ...t, planId: undefined } : t)),
    }));
  },

  // Events actions
  addEvent(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = getTodayJalali().dateStr;
    const newEvent: Event = {
      ...eventData,
      id: 'e-' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    updateState((prev) => ({ events: [...prev.events, newEvent] }));
    return newEvent;
  },

  updateEvent(eventId: string, updates: Partial<Event>) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => ({
      events: prev.events.map((e) => (e.id === eventId ? { ...e, ...updates, updatedAt: now } : e)),
    }));
  },

  deleteEvent(eventId: string) {
    updateState((prev) => ({
      events: prev.events.filter((e) => e.id !== eventId),
    }));
  },

  // Daily Journal Actions
  setDailyFocus(date: string, focus: string) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing = prev.dailyEntries[date] || { date };
      return {
        dailyEntries: {
          ...prev.dailyEntries,
          [date]: { ...existing, focus, updatedAt: now },
        },
      };
    });
  },

  setDailyNote(date: string, note: string) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing = prev.dailyEntries[date] || { date };
      return {
        dailyEntries: {
          ...prev.dailyEntries,
          [date]: { ...existing, note, updatedAt: now },
        },
      };
    });
  },

  setDailyMood(date: string, mood: MoodType | undefined) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing = prev.dailyEntries[date] || { date };
      return {
        dailyEntries: {
          ...prev.dailyEntries,
          [date]: { ...existing, mood, updatedAt: now },
        },
      };
    });
  },

  // Drawer & Modal Actions
  setChecklistDrawerOpen(open: boolean) {
    updateState({ checklistDrawerOpen: open });
  },

  setAccountingModalOpen(open: boolean) {
    updateState({ accountingModalOpen: open });
  },

  // Daily Self-Accounting (محاسبه اعمال)
  updateDailyAccounting(date: string, updates: Partial<DailyAccounting>) {
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing: DailyAccounting = prev.dailyAccountings[date] || {
        date,
        goodDeeds: [],
        badDeeds: [],
        satisfactionScore: 7,
      };
      return {
        dailyAccountings: {
          ...prev.dailyAccountings,
          [date]: { ...existing, ...updates, updatedAt: now },
        },
      };
    });
  },

  addGoodDeed(date: string, text: string) {
    if (!text.trim()) return;
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing: DailyAccounting = prev.dailyAccountings[date] || {
        date,
        goodDeeds: [],
        badDeeds: [],
        satisfactionScore: 7,
      };
      return {
        dailyAccountings: {
          ...prev.dailyAccountings,
          [date]: {
            ...existing,
            goodDeeds: [...existing.goodDeeds, text.trim()],
            updatedAt: now,
          },
        },
      };
    });
  },

  removeGoodDeed(date: string, index: number) {
    updateState((prev) => {
      const existing = prev.dailyAccountings[date];
      if (!existing) return {};
      return {
        dailyAccountings: {
          ...prev.dailyAccountings,
          [date]: {
            ...existing,
            goodDeeds: existing.goodDeeds.filter((_, i) => i !== index),
          },
        },
      };
    });
  },

  addBadDeed(date: string, text: string) {
    if (!text.trim()) return;
    const now = getTodayJalali().dateStr;
    updateState((prev) => {
      const existing: DailyAccounting = prev.dailyAccountings[date] || {
        date,
        goodDeeds: [],
        badDeeds: [],
        satisfactionScore: 7,
      };
      return {
        dailyAccountings: {
          ...prev.dailyAccountings,
          [date]: {
            ...existing,
            badDeeds: [...existing.badDeeds, text.trim()],
            updatedAt: now,
          },
        },
      };
    });
  },

  removeBadDeed(date: string, index: number) {
    updateState((prev) => {
      const existing = prev.dailyAccountings[date];
      if (!existing) return {};
      return {
        dailyAccountings: {
          ...prev.dailyAccountings,
          [date]: {
            ...existing,
            badDeeds: existing.badDeeds.filter((_, i) => i !== index),
          },
        },
      };
    });
  },

  // Daily Expenses (محاسبه مخارج)
  addDailyExpense(expenseData: Omit<DailyExpense, 'id' | 'createdAt'>) {
    const now = getTodayJalali().dateStr;
    const newExpense: DailyExpense = {
      ...expenseData,
      id: 'exp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      createdAt: now,
    };
    updateState((prev) => ({
      dailyExpenses: [newExpense, ...prev.dailyExpenses],
    }));
    return newExpense;
  },

  deleteDailyExpense(id: string) {
    updateState((prev) => ({
      dailyExpenses: prev.dailyExpenses.filter((e) => e.id !== id),
    }));
  },

  // 6-Domain Daily Checklist (چک‌لیست ۶ حوزه بنیادین)
  toggleDailyChecklistItem(date: string, itemId: string) {
    updateState((prev) => {
      const currentList = prev.checklistLogs[date] || [];
      const exists = currentList.includes(itemId);
      const nextList = exists
        ? currentList.filter((id) => id !== itemId)
        : [...currentList, itemId];
      return {
        checklistLogs: {
          ...prev.checklistLogs,
          [date]: nextList,
        },
      };
    });
  },

  addDailyChecklistItem(item: Omit<DailyChecklistItem, 'id'>) {
    const newItem: DailyChecklistItem = {
      ...item,
      id: 'ch-' + Date.now(),
    };
    updateState((prev) => ({
      checklistItems: [...prev.checklistItems, newItem],
    }));
    return newItem;
  },

  deleteDailyChecklistItem(itemId: string) {
    updateState((prev) => ({
      checklistItems: prev.checklistItems.filter((i) => i.id !== itemId),
    }));
  },

  // Settings
  updateSettings(updates: Partial<UserSettings>) {
    updateState((prev) => ({
      settings: { ...prev.settings, ...updates },
    }));
  },

  // Reset to seed demo data
  resetToDemoData() {
    const seed = getInitialSeedData();
    const today = getTodayJalali();
    updateState({
      goals: seed.goals,
      plans: seed.plans,
      tasks: seed.tasks,
      events: seed.events,
      domainGroups: DEFAULT_DOMAIN_GROUPS,
      dailyEntries: seed.dailyEntries,
      selectedDate: today.dateStr,
    });
  },
};

export function useStore(): StoreState {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
