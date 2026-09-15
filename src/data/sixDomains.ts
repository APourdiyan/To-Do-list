import { DomainGroup } from '../types';

/**
 * ۶ حوزه بنیادین زندگی
 * الگوی ساختاریافته برای ساماندهی جامع تمام امور زندگی
 */
export const SIX_LIFE_DOMAINS: (DomainGroup & { subtitle: string; iconKey: string; bgTone: string })[] = [
  {
    id: 'spiritual',
    title: 'برنامه معنوی',
    subtitle: 'آرامش درون، تأمل، نیایش و مراقبه',
    icon: 'Sparkles',
    iconKey: 'spiritual',
    color: '#0d9488', // سبزآبی فیروزه‌ای عمیق (Teal)
    bgTone: 'from-teal-500/10 to-teal-500/5',
  },
  {
    id: 'career',
    title: 'برنامه تخصصی و شغل',
    subtitle: 'پروژه‌ها، مسئولیت‌های شغلی و اهداف مالی',
    icon: 'Briefcase',
    iconKey: 'career',
    color: '#0284c7', // آبی سیر عمیق (Sky/Ocean)
    bgTone: 'from-sky-500/10 to-sky-500/5',
  },
  {
    id: 'study',
    title: 'برنامه مطالعاتی',
    subtitle: 'کتاب‌خوانی، پژوهش و یادگیری دانشگاهی',
    icon: 'BookOpen',
    iconKey: 'study',
    color: '#7c3aed', // بنفش نجیب (Violet/Amethyst)
    bgTone: 'from-violet-500/10 to-violet-500/5',
  },
  {
    id: 'growth',
    title: 'برنامه مهارت‌های فردی',
    subtitle: 'زبان‌آموزی، فن بیان، عادات و توسعه شخصی',
    icon: 'GraduationCap',
    iconKey: 'growth',
    color: '#b45309', // کهربایی گرم / خاکی (Amber/Bronze)
    bgTone: 'from-amber-500/10 to-amber-500/5',
  },
  {
    id: 'fitness',
    title: 'برنامه ورزشی',
    subtitle: 'تمرین بدنی، سلامت جسم و تغذیه سالم',
    icon: 'Activity',
    iconKey: 'fitness',
    color: '#16a34a', // سبز طراوت و انرژی (Emerald)
    bgTone: 'from-emerald-500/10 to-emerald-500/5',
  },
  {
    id: 'daily',
    title: 'کارهای آزاد و روزمره',
    subtitle: 'امور منزل، خریدها، کارهای اداری و شخصی',
    icon: 'Coffee',
    iconKey: 'daily',
    color: '#e11d48', // گلگون متین (Rose)
    bgTone: 'from-rose-500/10 to-rose-500/5',
  },
];
