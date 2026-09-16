/**
 * انواع داده‌های سامانه دفتر زندگی من
 * RTL-native Persian Personal Planning OS
 */

export type GoalSeason = 'spring' | 'summer' | 'autumn' | 'winter';
export type GoalLevel = 'annual' | 'seasonal' | 'long' | 'medium' | 'short';
export type GoalStatus = 'active' | 'completed' | 'paused';

export interface SkillCourseDetails {
  totalHours: number;           // حجم کل دوره به ساعت (مثلاً 20)
  completedMinutes: number;     // دقایق سپری‌شده (مثلاً 120)
  dailyCommitmentMinutes: number; // تعهد روزانه به دقیقه (مثلاً 30)
  estimatedDays: number;        // تعداد روزهای تخمینی مطالعه
  restDaysPattern: 'all_days' | 'no_fridays' | 'even_days'; // الگوی روزهای هفتگی
  scheduledTasksCreated: boolean; // آیا تسک‌های تقویمی چیده شده‌اند
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  level: GoalLevel;
  season?: GoalSeason; // برای اهداف فصلی (بهار، تابستان، پاییز، زمستان)
  parentGoalId?: string;
  startDate: string; // فرمت 'YYYY/MM/DD' به هجری شمسی
  endDate: string;   // فرمت 'YYYY/MM/DD' به هجری شمسی
  progress: number;  // 0 - 100
  status: GoalStatus;
  color?: string;
  courseDetails?: SkillCourseDetails; // تنظیمات و داده‌های دوره‌های مهارتی و ساعتی
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  title: string;
  goalId?: string;
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'planned';
  createdAt: string;
  updatedAt: string;
}

export type Priority = 'low' | 'medium' | 'high';
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  groupId: string; // شناسه حوزه (کار، دانشگاه، شخصی)
  parentTaskId?: string;
  planId?: string;
  goalId?: string;
  dueDate: string; // فرمت 'YYYY/MM/DD' به هجری شمسی
  dueTime?: string; // فرمت 'HH:MM'
  hasAlarm?: boolean; // فعال بودن زنگ یا یادآوری
  alarmMinutesBefore?: number; // چند دقیقه قبل (۰ = سر وقت، ۱۵، ۳۰)
  alarmSound?: boolean; // پخش آلارم صوتی
  priority: Priority;
  completedAt?: string; // تاریخ و زمان تکمیل
  recurrence?: Recurrence;
  subtasks?: SubTask[];
  createdAt: string;
  updatedAt: string;
}

export type EventType =
  | 'personal'
  | 'holiday'
  | 'occasion'
  | 'appointment'
  | 'exam'
  | 'birthday'
  | 'anniversary'
  | 'other';

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string; // 'YYYY/MM/DD' به هجری شمسی
  startTime?: string;
  endTime?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainGroup {
  id: string;
  title: string;
  icon: string;
  color: string;
  subtitle?: string;
  description?: string;
}

export interface HolidayOccasion {
  id: string;
  date: string; // 'MM/DD' یا 'YYYY/MM/DD'
  title: string;
  isHoliday: boolean; // آیا تعطیل رسمی است؟
  description?: string;
}

export type MoodType = 'calm' | 'focused' | 'energetic' | 'reflective' | 'tired';

export interface DailyJournalEntry {
  date: string; // 'YYYY/MM/DD' هجری شمسی
  focus?: string; // تمرکز یا نیت اصلی روز
  note?: string;  // یادداشت آزاد یا تخلیه ذهن
  mood?: MoodType;
  updatedAt?: string;
}

// محاسبه اعمال روزانه (محاسبة النفس و ارزیابی شخصی)
export interface DailyAccounting {
  date: string; // 'YYYY/MM/DD'
  goodDeeds: string[]; // کارهای شایسته و توفیقات روز (+)
  badDeeds: string[]; // موارد نیازمند اصلاح و جبران (-)
  reflectionNote?: string; // پیام و نتیجه‌گیری امروز برای فردا
  satisfactionScore?: number; // نمره رضایت ۱ تا ۱۰
  updatedAt?: string;
}

// محاسبه خرید و مخارج روزانه
export type ExpenseCategory =
  | 'food'        // خوراک و مواد غذایی
  | 'transport'   // حمل‌ونقل و بنزین
  | 'home'        // خانه و ملزومات
  | 'education'   // آموزش و کتاب
  | 'health'      // سلامت و درمان
  | 'shopping'    // خرید شخصی و پوشاک
  | 'bills'       // قبوض و اقساط
  | 'other';      // متفرقه

export interface DailyExpense {
  id: string;
  date: string; // 'YYYY/MM/DD'
  title: string;
  amount: number; // مبلغ به تومان
  category: ExpenseCategory;
  createdAt: string;
}

// دسته‌بندی قابل ویرایش برای چک‌لیست روزانه
export interface DailyChecklistCategory {
  id: string;
  title: string;
  color: string;
  bgLight: string;
  iconName?: string;
}

// آیتم چک‌لیست ثابت روزانه
export interface DailyChecklistItem {
  id: string;
  domainId: string; // شناسه دسته‌بندی
  title: string;
  description?: string;
}

// ثبت وضعیت تیک‌های چک‌لیست برای هر تاریخ
export interface DailyChecklistLog {
  date: string; // 'YYYY/MM/DD'
  completedItemIds: string[];
}

// پروفایل شخصی کاربر و همگام‌سازی ابری برای انتقال به گوشی جدید
export interface UserProfile {
  id: string;
  name: string;
  phoneOrEmail: string;
  pinOrPassword?: string;
  avatar?: string;
  syncKey: string; // کلید اختصاصی انتقال به گوشی جدید (مثلاً DZ-92841)
  createdAt: string;
  lastBackupAt?: string;
  autoSyncCloud?: boolean;
}

export interface UserSettings {
  showGregorian: boolean;
  showHolidays: boolean;
  theme: 'paper' | 'neutral';
  dailyQuote?: boolean;
  hideGuideBanner?: boolean; // پنهان کردن راهنمای شروع سریع
  lifeDomainsMode?: boolean; // حالت ۶ حوزه بنیادین زندگی (معنوی، شغلی، مطالعاتی، مهارتی، ورزشی، روزمره)
}

export type ActiveTab = 'today' | 'calendar' | 'goals' | 'tasks';
