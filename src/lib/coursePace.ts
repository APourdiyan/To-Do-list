import {
  addDaysJalali,
  calcDaysDifference,
  parseJalaliDate,
  jalaliToGregorian,
} from './date/jalali';

export type RestDaysPattern = 'all_days' | 'no_fridays' | 'even_days';

/**
 * آیا تاریخ داده‌شده بر اساس الگوی انتخابی، روز مطالعه است یا روز استراحت؟
 * در تقویم ایرانی:
 * شنبه: ۰
 * یکشنبه: ۱
 * دوشنبه: ۲
 * سه‌شنبه: ۳
 * چهارشنبه: ۴
 * پنج‌شنبه: ۵
 * جمعه: ۶
 */
export function isStudyDay(dateStr: string, pattern: RestDaysPattern): boolean {
  const p = parseJalaliDate(dateStr);
  if (!p) return true;
  const { date } = jalaliToGregorian(p.jy, p.jm, p.jd);
  const jsDay = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  // تبدیل به ایندکس شمسی (شنبه = 0)
  const jalaliDayIndex = (jsDay + 1) % 7;

  if (pattern === 'all_days') {
    return true;
  }
  if (pattern === 'no_fridays') {
    return jalaliDayIndex !== 6; // غیر از جمعه
  }
  if (pattern === 'even_days') {
    // روزهای زوج تقویم آموزشی ایران: شنبه (۰)، دوشنبه (۲)، چهارشنبه (۴)
    return jalaliDayIndex === 0 || jalaliDayIndex === 2 || jalaliDayIndex === 4;
  }
  return true;
}

export interface PaceCalculationResult {
  totalMinutes: number;
  totalSessions: number;
  dailyMinutes: number;
  studyDaysCount: number;
  calendarDaysSpan: number;
  estimatedEndDate: string;
  sessionsSchedule: Array<{ sessionNumber: number; dateStr: string; minutes: number }>;
}

/**
 * محاسبه تاریخ پایان و جلسات بر اساس دقایق مطالعه روزانه
 */
export function calculatePaceByDailyMinutes(
  totalHours: number,
  dailyMinutes: number,
  startDateStr: string,
  pattern: RestDaysPattern = 'all_days'
): PaceCalculationResult {
  const safeDaily = Math.max(5, dailyMinutes);
  const totalMinutes = Math.round(totalHours * 60);
  const totalSessions = Math.ceil(totalMinutes / safeDaily);

  const sessionsSchedule: Array<{ sessionNumber: number; dateStr: string; minutes: number }> = [];
  let currentDate = startDateStr;
  let sessionsScheduled = 0;
  let daysIterated = 0;
  const MAX_SEARCH_DAYS = 3650; // حداکثر تا ۱۰ سال

  while (sessionsScheduled < totalSessions && daysIterated < MAX_SEARCH_DAYS) {
    if (isStudyDay(currentDate, pattern)) {
      sessionsScheduled++;
      sessionsSchedule.push({
        sessionNumber: sessionsScheduled,
        dateStr: currentDate,
        minutes: safeDaily,
      });
    }

    if (sessionsScheduled < totalSessions) {
      currentDate = addDaysJalali(currentDate, 1);
      daysIterated++;
    }
  }

  const estimatedEndDate = sessionsSchedule.length > 0
    ? sessionsSchedule[sessionsSchedule.length - 1].dateStr
    : startDateStr;

  const calendarDaysSpan = calcDaysDifference(startDateStr, estimatedEndDate) + 1;

  return {
    totalMinutes,
    totalSessions,
    dailyMinutes: safeDaily,
    studyDaysCount: totalSessions,
    calendarDaysSpan,
    estimatedEndDate,
    sessionsSchedule,
  };
}

/**
 * محاسبه دقایق مطالعه مورد نیاز برای رسیدن به تاریخ پایان مشخص
 */
export function calculatePaceByTargetDate(
  totalHours: number,
  startDateStr: string,
  targetEndDateStr: string,
  pattern: RestDaysPattern = 'all_days'
): {
  neededMinutesPerDay: number;
  availableStudyDays: number;
  totalMinutes: number;
  isFeasible: boolean;
} {
  const totalMinutes = Math.round(totalHours * 60);
  const totalDays = calcDaysDifference(startDateStr, targetEndDateStr);

  if (totalDays < 0) {
    return {
      neededMinutesPerDay: totalMinutes,
      availableStudyDays: 1,
      totalMinutes,
      isFeasible: false,
    };
  }

  let availableStudyDays = 0;
  for (let i = 0; i <= totalDays; i++) {
    const cur = addDaysJalali(startDateStr, i);
    if (isStudyDay(cur, pattern)) {
      availableStudyDays++;
    }
  }

  const safeStudyDays = Math.max(1, availableStudyDays);
  const neededMinutesPerDay = Math.ceil(totalMinutes / safeStudyDays);

  return {
    neededMinutesPerDay,
    availableStudyDays: safeStudyDays,
    totalMinutes,
    isFeasible: neededMinutesPerDay <= 360, // کمتر از ۶ ساعت در روز
  };
}
