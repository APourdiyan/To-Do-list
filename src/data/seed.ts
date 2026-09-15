import { DomainGroup, Goal, Plan, Task, Event, DailyJournalEntry } from '../types';
import { getTodayJalali, addDaysJalali } from '../lib/date/jalali';

export const DEFAULT_DOMAIN_GROUPS: DomainGroup[] = [
  { id: 'work', title: 'کار و حرفه', icon: 'Briefcase', color: '#2b534b' }, // سبزه تیره متین
  { id: 'uni', title: 'دانشگاه و آموزش', icon: 'GraduationCap', color: '#8c4e2d' }, // خاکی ترراکوتا
  { id: 'personal', title: 'شخصی و سلامت', icon: 'Heart', color: '#3a5a78' }, // آبی سرمه‌ای
  { id: 'study', title: 'مطالعه و کتاب', icon: 'BookOpen', color: '#684a75' }, // بنفش خاکی
];

export function getInitialSeedData(): {
  goals: Goal[];
  plans: Plan[];
  tasks: Task[];
  events: Event[];
  dailyEntries: Record<string, DailyJournalEntry>;
} {
  const { dateStr: today, jy } = getTodayJalali();

  // اهداف زمان‌بندی‌شده
  const goals: Goal[] = [
    {
      id: 'g-1',
      title: 'تبدیل شدن به توسعه‌دهنده ارشد و معمار وب',
      description: 'دستیابی به تسلط فنی عمیق، معماری نرم‌افزارهای پایدار، و توانمندی طراحی محصول سطح اول',
      level: 'long',
      startDate: `${jy}/01/01`,
      endDate: `${jy + 1}/12/29`,
      progress: 45,
      status: 'active',
      color: '#2b534b',
      createdAt: `${jy}/01/01`,
      updatedAt: today,
    },
    {
      id: 'g-2',
      title: 'تسلط بر توسعه مدرن فرانت‌اند و معماری کلاینت',
      description: 'فراگیری عمیق الگوهای طراحی React، تایپ‌اسکریپت پیشرفته و عملکرد بهینه وب',
      level: 'medium',
      parentGoalId: 'g-1',
      startDate: `${jy}/04/01`,
      endDate: `${jy}/09/30`,
      progress: 68,
      status: 'active',
      color: '#3a5a78',
      createdAt: `${jy}/04/01`,
      updatedAt: today,
    },
    {
      id: 'g-course-lang',
      title: 'دوره جامع ۲۰ ساعته مکالمه زبان انگلیسی',
      description: 'فراگیری مهارت گفت‌وگو با تعهد روزانه ۳۰ دقیقه مطالعه متمرکز',
      level: 'medium',
      startDate: today,
      endDate: `${jy}/08/15`,
      progress: 25,
      status: 'active',
      color: '#b45309',
      courseDetails: {
        totalHours: 20,
        completedMinutes: 300,
        dailyCommitmentMinutes: 30,
        estimatedDays: 40,
        restDaysPattern: 'all_days',
        scheduledTasksCreated: true,
      },
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 'g-3',
      title: 'یادگیری عمیق JavaScript و React در ۶ هفته',
      description: 'تمرکز بر بسته‌بندی پروژه‌ها، مدیریت حالت بهینه، و ساخت تجربه کاربری RTL ممتاز',
      level: 'short',
      parentGoalId: 'g-2',
      startDate: addDaysJalali(today, -20),
      endDate: addDaysJalali(today, 22),
      progress: 60,
      status: 'active',
      color: '#8c4e2d',
      createdAt: addDaysJalali(today, -20),
      updatedAt: today,
    },
    {
      id: 'g-4',
      title: 'حفظ نشاط بدنی و پیوستگی ورزشی هفتگی',
      description: 'حداقل ۳ روز در هفته ورزش هوازی، خواب منظم و تغذیه آگاهانه',
      level: 'medium',
      startDate: `${jy}/01/01`,
      endDate: `${jy}/12/29`,
      progress: 75,
      status: 'active',
      color: '#2b534b',
      createdAt: `${jy}/01/01`,
      updatedAt: today,
    },
  ];

  // برنامه‌ها و پروژه‌های واسط
  const plans: Plan[] = [
    {
      id: 'p-1',
      title: 'ساخت پروژه سامانه برنامه‌ریزی فردی (دفتر زندگی من)',
      goalId: 'g-3',
      startDate: addDaysJalali(today, -15),
      endDate: addDaysJalali(today, 10),
      status: 'active',
      createdAt: addDaysJalali(today, -15),
      updatedAt: today,
    },
    {
      id: 'p-2',
      title: 'آمادگی جامع برای امتحانات میان‌ترم و پروژه‌های دانشگاه',
      goalId: 'g-1',
      startDate: addDaysJalali(today, -5),
      endDate: addDaysJalali(today, 25),
      status: 'active',
      createdAt: addDaysJalali(today, -5),
      updatedAt: today,
    },
  ];

  // وظایف معنادار و پیوندخورده
  const tasks: Task[] = [
    {
      id: 't-1',
      title: 'مطالعه JavaScript و مرور الگوهای Async/Await',
      notes: 'فصل کار با حافظه و حلقه‌های Event Loop به همراه پیاده‌سازی تست‌های عملی',
      groupId: 'work',
      planId: 'p-1',
      goalId: 'g-3',
      dueDate: today,
      dueTime: '۰۹:۳۰',
      priority: 'high',
      subtasks: [
        { id: 'st-1', title: 'خلاصه‌نویسی مبحث Microtasks', completed: true },
        { id: 'st-2', title: 'پیاده‌سازی ۳ تابع بازگشتی تستی', completed: false },
        { id: 'st-3', title: 'بررسی بنچمارک عملکردی در مرورگر', completed: false },
      ],
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-2',
      title: 'توسعه ساختار داده‌ها و شبکه تقویم شمسی',
      notes: 'پیاده‌سازی دقیق روزهای ماه، روزهای جمعه و تعطیلات رسمی بدون وابستگی‌های اضافی',
      groupId: 'work',
      planId: 'p-1',
      goalId: 'g-3',
      dueDate: today,
      dueTime: '۱۱:۰۰',
      priority: 'high',
      completedAt: `${today} 11:45`,
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-3',
      title: 'حل تمرین شماره ۳ درس ساختمان داده‌ها',
      notes: 'مسائل مربوط به گراف، درخت‌های متوازن AVL و پیچیدگی الگوریتم‌ها',
      groupId: 'uni',
      planId: 'p-2',
      dueDate: today,
      dueTime: '۱۵:۰۰',
      priority: 'medium',
      subtasks: [
        { id: 'st-4', title: 'تمرین شماره ۱ (درخت پوشای کمینه)', completed: true },
        { id: 'st-5', title: 'تمرین شماره ۲ (پیمایش عمیق و سطحی)', completed: false },
      ],
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-4',
      title: 'ورزش و پیاده‌روی عصرگاهی ۴۰ دقیقه',
      notes: 'تنفس عمیق، دوری از صفحات نمایش، بازیابی انرژی فکری',
      groupId: 'personal',
      goalId: 'g-4',
      dueDate: today,
      dueTime: '۱۸:۳۰',
      priority: 'medium',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-5',
      title: 'مطالعه ۳۰ صفحه از کتاب «طراحی برای دنیای واقعی»',
      notes: 'فصل مرتبط با ملاحظات بومی‌سازی و ارگونومی شناختی',
      groupId: 'study',
      dueDate: today,
      dueTime: '۲۱:۱۵',
      priority: 'low',
      createdAt: today,
      updatedAt: today,
    },
    // کارهای فردا و روزهای بعد
    {
      id: 't-6',
      title: 'طراحی رابط کاربری بخش مسیرها و اهداف',
      notes: 'ساختار سه‌لایه افق‌ها با زمان‌بندی شفاف',
      groupId: 'work',
      planId: 'p-1',
      goalId: 'g-3',
      dueDate: addDaysJalali(today, 1),
      dueTime: '۱۰:۰۰',
      priority: 'high',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-7',
      title: 'بررسی تحویل پروژه آز سیستم‌عامل',
      groupId: 'uni',
      dueDate: addDaysJalali(today, 2),
      priority: 'medium',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 't-8',
      title: 'پیگیری سرویس دوره‌ای لپ‌تاپ و پشتیبان‌گیری از داده‌ها',
      groupId: 'personal',
      dueDate: addDaysJalali(today, 4),
      priority: 'low',
      createdAt: today,
      updatedAt: today,
    },
  ];

  // رویدادهای شخصی و مناسبتی
  const events: Event[] = [
    {
      id: 'e-1',
      title: 'جلسه بررسی اسپرینت معماری محصول',
      type: 'appointment',
      date: today,
      startTime: '۱۴:۰۰',
      endTime: '۱۵:۰۰',
      description: 'مرور مدل مفهومی و تقویم خورشیدی با تیم',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 'e-2',
      title: 'تحویل پیش‌نویس پروژه پایگاه داده',
      type: 'exam',
      date: addDaysJalali(today, 3),
      startTime: '۱۶:۳۰',
      endTime: '۱۸:۰۰',
      description: 'آپلود داکیومنت در سامانه دانشگاه',
      createdAt: today,
      updatedAt: today,
    },
    {
      id: 'e-3',
      title: 'زادروز دوست صمیمی (سهراب)',
      type: 'birthday',
      date: addDaysJalali(today, 6),
      description: 'تهیه هدیه کتاب و دیدار حضوری',
      createdAt: today,
      updatedAt: today,
    },
  ];

  const dailyEntries: Record<string, DailyJournalEntry> = {
    [today]: {
      date: today,
      focus: 'تمرکز بر وضوح اهداف هفته و پیشبرد کارهای کلیدی با آرامش',
      note: 'یادداشت صبحگاهی: امروز اولویت اصلی با معماری ساختار پروژه و تسک‌های موعد نزدیک است. بعدازظهر نیم ساعت مطالعه کتاب.',
      mood: 'focused',
      updatedAt: today,
    },
  };

  return { goals, plans, tasks, events, dailyEntries };
}
