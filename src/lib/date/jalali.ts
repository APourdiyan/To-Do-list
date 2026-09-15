import {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
  isLeapJalaaliYear,
} from 'jalaali-js';

export {
  toJalaali,
  toGregorian,
  jalaaliMonthLength,
  isLeapJalaaliYear,
};

export const PERSIAN_MONTH_NAMES = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

export const PERSIAN_WEEKDAYS_SHORT = [
  'ش',
  'ی',
  'د',
  'س',
  'چ',
  'پ',
  'ج',
];

export const PERSIAN_SEASONS = ['بهار', 'تابستان', 'پاییز', 'زمستان'];

/**
 * تبدیل اعداد انگلیسی به اعداد فارسی
 */
export function toPersianDigits(input: string | number | null | undefined): string {
  if (input === null || input === undefined) return '';
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * تبدیل اعداد فارسی یا عربی به اعداد انگلیسی
 */
export function toEnglishDigits(input: string): string {
  if (!input) return '';
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  const arabicDigits = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
  let res = input;
  for (let i = 0; i < 10; i++) {
    res = res.replace(persianDigits[i], String(i)).replace(arabicDigits[i], String(i));
  }
  return res;
}

/**
 * نرمال‌سازی متن فارسی برای جستجوی بهتر (یکپارچه‌سازی ی و ک)
 */
export function normalizePersianText(text: string): string {
  if (!text) return '';
  return text
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F\u0670]/g, '') // حذف اعراب
    .trim()
    .toLowerCase();
}

/**
 * دریافت تاریخ امروز به صورت آبجکت و رشته هجری شمسی
 */
export function getTodayJalali(): { jy: number; jm: number; jd: number; dateStr: string } {
  const now = new Date();
  const j = toJalaali(now);
  const jmStr = String(j.jm).padStart(2, '0');
  const jdStr = String(j.jd).padStart(2, '0');
  return {
    jy: j.jy,
    jm: j.jm,
    jd: j.jd,
    dateStr: `${j.jy}/${jmStr}/${jdStr}`,
  };
}

/**
 * تبدیل تاریخ شمسی به میلادی
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number; date: Date } {
  const g = toGregorian(jy, jm, jd);
  const date = new Date(g.gy, g.gm - 1, g.gd);
  return { ...g, date };
}

/**
 * تبدیل تاریخ میلادی به شمسی
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): { jy: number; jm: number; jd: number; dateStr: string } {
  const j = toJalaali(gy, gm, gd);
  const jmStr = String(j.jm).padStart(2, '0');
  const jdStr = String(j.jd).padStart(2, '0');
  return {
    ...j,
    dateStr: `${j.jy}/${jmStr}/${jdStr}`,
  };
}

/**
 * تجزیه رشته تاریخ شمسی 'YYYY/MM/DD' یا 'YYYY-MM-DD'
 */
export function parseJalaliDate(dateStr: string): { jy: number; jm: number; jd: number } | null {
  if (!dateStr) return null;
  const cleaned = toEnglishDigits(dateStr).trim().replace(/-/g, '/');
  const parts = cleaned.split('/');
  if (parts.length !== 3) return null;
  const jy = parseInt(parts[0], 10);
  const jm = parseInt(parts[1], 10);
  const jd = parseInt(parts[2], 10);
  if (isNaN(jy) || isNaN(jm) || isNaN(jd)) return null;
  if (jm < 1 || jm > 12) return null;
  const maxDays = jalaaliMonthLength(jy, jm);
  if (jd < 1 || jd > maxDays) return null;
  return { jy, jm, jd };
}

/**
 * اعتبارسنجی تاریخ شمسی
 */
export function isValidJalaliDate(dateStr: string): boolean {
  return parseJalaliDate(dateStr) !== null;
}

/**
 * دریافت نام ماه شمسی (۱ تا ۱۲)
 */
export function getPersianMonthName(jm: number): string {
  if (jm < 1 || jm > 12) return '';
  return PERSIAN_MONTH_NAMES[jm - 1];
}

/**
 * دریافت نام فصل
 */
export function getPersianSeasonName(jm: number): string {
  if (jm >= 1 && jm <= 3) return PERSIAN_SEASONS[0];
  if (jm >= 4 && jm <= 6) return PERSIAN_SEASONS[1];
  if (jm >= 7 && jm <= 9) return PERSIAN_SEASONS[2];
  return PERSIAN_SEASONS[3];
}

/**
 * شاخص روز هفته برای تاریخ شمسی
 * در گاه‌شماری ایرانی: شنبه = 0، یکشنبه = 1، ... جمعه = 6
 */
export function getWeekdayIndex(dateStr: string): number {
  const p = parseJalaliDate(dateStr);
  if (!p) return 0;
  const { date } = jalaliToGregorian(p.jy, p.jm, p.jd);
  // getDay(): 0 = یکشنبه (Sunday), 1 = دوشنبه (Monday), ... 6 = شنبه (Saturday)
  const gDay = date.getDay();
  // تبدیل به سیستم ایرانی: شنبه = 0
  const jalaliDayIndex = (gDay + 1) % 7;
  return jalaliDayIndex;
}

/**
 * دریافت نام روز هفته (مثلا «یکشنبه»)
 */
export function formatWeekday(dateStr: string): string {
  const idx = getWeekdayIndex(dateStr);
  return PERSIAN_WEEKDAYS[idx];
}

/**
 * فرمت تاریخ شمسی با نوشتار خوانا
 * مثال: «۲۲ شهریور ۱۴۰۵»
 */
export function formatJalaliDate(
  dateStr: string,
  options: {
    showWeekday?: boolean;
    showYear?: boolean;
    showMonthName?: boolean;
  } = { showWeekday: false, showYear: true, showMonthName: true }
): string {
  const p = parseJalaliDate(dateStr);
  if (!p) return dateStr;

  const monthName = options.showMonthName !== false ? getPersianMonthName(p.jm) : toPersianDigits(p.jm);
  const dayStr = toPersianDigits(p.jd);
  const yearStr = options.showYear !== false ? toPersianDigits(p.jy) : '';
  const weekdayStr = options.showWeekday ? `${formatWeekday(dateStr)} ` : '';

  if (options.showMonthName !== false) {
    if (options.showYear !== false) {
      return `${weekdayStr}${dayStr} ${monthName} ${yearStr}`.trim();
    }
    return `${weekdayStr}${dayStr} ${monthName}`.trim();
  }

  return `${weekdayStr}${toPersianDigits(p.jy)}/${toPersianDigits(String(p.jm).padStart(2, '0'))}/${toPersianDigits(String(p.jd).padStart(2, '0'))}`.trim();
}

/**
 * افزودن روز به تاریخ شمسی
 */
export function addDaysJalali(dateStr: string, daysToAdd: number): string {
  const p = parseJalaliDate(dateStr);
  if (!p) return dateStr;
  const { date } = jalaliToGregorian(p.jy, p.jm, p.jd);
  date.setDate(date.getDate() + daysToAdd);
  const j = toJalaali(date);
  const jmStr = String(j.jm).padStart(2, '0');
  const jdStr = String(j.jd).padStart(2, '0');
  return `${j.jy}/${jmStr}/${jdStr}`;
}

/**
 * محاسبه فاصله بین دو تاریخ شمسی (به روز)
 */
export function calcDaysDifference(startDateStr: string, endDateStr: string): number {
  const p1 = parseJalaliDate(startDateStr);
  const p2 = parseJalaliDate(endDateStr);
  if (!p1 || !p2) return 0;
  const d1 = jalaliToGregorian(p1.jy, p1.jm, p1.jd).date;
  const d2 = jalaliToGregorian(p2.jy, p2.jm, p2.jd).date;
  const diffTime = d2.getTime() - d1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * تبدیل تاریخ شمسی به تاریخ میلادی فرمت‌شده برای نمایش ثانویه
 */
export function getGregorianEquivalent(dateStr: string): string {
  const p = parseJalaliDate(dateStr);
  if (!p) return '';
  const g = jalaliToGregorian(p.jy, p.jm, p.jd);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${g.gd} ${months[g.gm - 1]} ${g.gy}`;
}

/**
 * سلول تقویم ماهانه
 */
export interface CalendarCell {
  jy: number;
  jm: number;
  jd: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFriday: boolean;
  weekdayIndex: number;
}

/**
 * تولید شبکه روزهای ماه برای تقویم
 */
export function getMonthGrid(jy: number, jm: number): CalendarCell[] {
  const today = getTodayJalali();
  const daysInMonth = jalaaliMonthLength(jy, jm);
  
  // روز اول ماه چه روزی از هفته است؟ (شنبه = 0)
  const firstDayStr = `${jy}/${String(jm).padStart(2, '0')}/01`;
  const firstDayWeekday = getWeekdayIndex(firstDayStr);

  const cells: CalendarCell[] = [];

  // روزهای پیشین ماه قبل برای تکمیل ردیف اول
  if (firstDayWeekday > 0) {
    const prevJm = jm === 1 ? 12 : jm - 1;
    const prevJy = jm === 1 ? jy - 1 : jy;
    const daysInPrevMonth = jalaaliMonthLength(prevJy, prevJm);
    
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const dateStr = `${prevJy}/${String(prevJm).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
      const weekdayIndex = getWeekdayIndex(dateStr);
      cells.push({
        jy: prevJy,
        jm: prevJm,
        jd: day,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === today.dateStr,
        isFriday: weekdayIndex === 6,
        weekdayIndex,
      });
    }
  }

  // روزهای ماه جاری
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${jy}/${String(jm).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
    const weekdayIndex = getWeekdayIndex(dateStr);
    cells.push({
      jy,
      jm,
      jd: d,
      dateStr,
      isCurrentMonth: true,
      isToday: dateStr === today.dateStr,
      isFriday: weekdayIndex === 6,
      weekdayIndex,
    });
  }

  // تکمیل ردیف پایانی با روزهای ماه بعد
  const remainingCells = 7 - (cells.length % 7);
  if (remainingCells < 7) {
    const nextJm = jm === 12 ? 1 : jm + 1;
    const nextJy = jm === 12 ? jy + 1 : jy;
    for (let d = 1; d <= remainingCells; d++) {
      const dateStr = `${nextJy}/${String(nextJm).padStart(2, '0')}/${String(d).padStart(2, '0')}`;
      const weekdayIndex = getWeekdayIndex(dateStr);
      cells.push({
        jy: nextJy,
        jm: nextJm,
        jd: d,
        dateStr,
        isCurrentMonth: false,
        isToday: dateStr === today.dateStr,
        isFriday: weekdayIndex === 6,
        weekdayIndex,
      });
    }
  }

  return cells;
}

/**
 * دریافت ۷ روز هفته جاری (از شنبه تا جمعه) برای یک تاریخ شمسی
 */
export function getWeekDays(dateStr: string): CalendarCell[] {
  const today = getTodayJalali();
  const weekdayIdx = getWeekdayIndex(dateStr);
  // شنبه این هفته
  const saturdayDateStr = addDaysJalali(dateStr, -weekdayIdx);

  const weekCells: CalendarCell[] = [];
  for (let i = 0; i < 7; i++) {
    const dStr = addDaysJalali(saturdayDateStr, i);
    const p = parseJalaliDate(dStr);
    if (!p) continue;
    weekCells.push({
      jy: p.jy,
      jm: p.jm,
      jd: p.jd,
      dateStr: dStr,
      isCurrentMonth: true,
      isToday: dStr === today.dateStr,
      isFriday: i === 6,
      weekdayIndex: i,
    });
  }
  return weekCells;
}
