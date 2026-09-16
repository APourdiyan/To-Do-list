import { DomainGroup } from '../types';

export interface DomainPreset {
  id: string;
  name: string;
  description: string;
  domains: DomainGroup[];
}

export const DOMAIN_PRESETS: DomainPreset[] = [
  {
    id: 'four_pillars',
    name: 'چارچوب متوازن ۴ حوزه (پیشنهادی)',
    description: 'تمرکز متعادل روی کار، آموزش، سلامت و زندگی فردی',
    domains: [
      { id: 'work', title: 'کار و حرفه', subtitle: 'پروژه‌ها، وظایف شغلی و مالی', icon: 'Briefcase', color: '#0284c7' },
      { id: 'uni', title: 'یادگیری و آموزش', subtitle: 'دوره‌ها، مهارت‌ها و کتاب‌ها', icon: 'GraduationCap', color: '#7c3aed' },
      { id: 'health', title: 'سلامت و ورزش', subtitle: 'تندرستی، تمرین و تغذیه', icon: 'Activity', color: '#16a34a' },
      { id: 'personal', title: 'زندگی شخصی و خانواده', subtitle: 'امور منزل، روابط و کارهای روزمره', icon: 'Heart', color: '#e11d48' },
    ],
  },
  {
    id: 'six_pillars',
    name: 'دسته‌بندی جامع ۶ بخشی',
    description: 'کامل‌ترین تفکیک حوزه‌ها برای مدیریت هم‌زمان ابعاد مختلف زندگی',
    domains: [
      { id: 'spiritual', title: 'ذهن و آرامش', subtitle: 'آرامش ذهن، یادداشت و تجدید تمرکز', icon: 'Sparkles', color: '#0d9488' },
      { id: 'career', title: 'کار و حرفه', subtitle: 'پروژه‌ها و کارهای شغلی', icon: 'Briefcase', color: '#0284c7' },
      { id: 'study', title: 'مطالعه و یادگیری', subtitle: 'کتاب‌ها، مقالات و دانش تخصصی', icon: 'BookOpen', color: '#7c3aed' },
      { id: 'growth', title: 'مهارت‌ها و رشد فردی', subtitle: 'زبان، نرم‌افزار و مهارت‌های جدید', icon: 'GraduationCap', color: '#b45309' },
      { id: 'fitness', title: 'ورزش و تندرستی', subtitle: 'سلامت جسم و تحرک روزانه', icon: 'Activity', color: '#16a34a' },
      { id: 'daily', title: 'امور روزمره و شخصی', subtitle: 'کارهای منزل، خریدها و پیگیری‌ها', icon: 'Coffee', color: '#e11d48' },
    ],
  },
  {
    id: 'minimal_three',
    name: 'چارچوب ساده ۳ بخشی',
    description: 'ساده‌ترین حالت برای پرهیز از شلوغی ذهنی',
    domains: [
      { id: 'work', title: 'کار و حرفه', subtitle: 'اولویت‌های کاری و مالی', icon: 'Briefcase', color: '#0284c7' },
      { id: 'learning', title: 'یادگیری و مطالعه', subtitle: 'مطالعه و مهارت‌های نو', icon: 'BookOpen', color: '#b45309' },
      { id: 'life', title: 'زندگی و سلامت', subtitle: 'ورزش، استراحت و خانواده', icon: 'Heart', color: '#16a34a' },
    ],
  },
];
