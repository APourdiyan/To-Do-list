import { HolidayOccasion } from '../types';

/**
 * فهرست مناسبت‌ها و تعطیلات شاخص گاه‌شماری خورشیدی ایران
 * کلید تاریخ بر اساس 'MM/DD'
 */
export const IRANIAN_HOLIDAYS_AND_OCCASIONS: HolidayOccasion[] = [
  // فروردین
  { id: 'h-0101', date: '01/01', title: 'جشن نوروز / آغاز سال نو', isHoliday: true, description: 'آغاز سال نو خورشیدی' },
  { id: 'h-0102', date: '01/02', title: 'عید نوروز', isHoliday: true },
  { id: 'h-0103', date: '01/03', title: 'عید نوروز', isHoliday: true },
  { id: 'h-0104', date: '01/04', title: 'عید نوروز', isHoliday: true },
  { id: 'h-0112', date: '01/12', title: 'روز جمهوری اسلامی ایران', isHoliday: true },
  { id: 'h-0113', date: '01/13', title: 'روز طبیعت (سیزده‌بدر)', isHoliday: true, description: 'پاسداشت طبیعت پاک' },
  { id: 'o-0118', date: '01/18', title: 'روز سلامت و بهداشت', isHoliday: false },
  { id: 'o-0125', date: '01/25', title: 'روز بزرگداشت عطار نیشابوری', isHoliday: false },
  { id: 'o-0129', date: '01/29', title: 'روز ارتش جمهوری اسلامی', isHoliday: false },

  // اردیبهشت
  { id: 'o-0201', date: '02/01', title: 'روز بزرگداشت سعدی', isHoliday: false, description: 'آغاز اردیبهشت، یادمان شیخ اجل سعدی شیرازی' },
  { id: 'o-0203', date: '02/03', title: 'روز بزرگداشت شیخ بهایی / روز معمار', isHoliday: false },
  { id: 'o-0210', date: '02/10', title: 'روز ملی خلیج فارس', isHoliday: false },
  { id: 'o-0215', date: '02/15', title: 'جشن بهاربد / روز شیراز', isHoliday: false },
  { id: 'o-0225', date: '02/25', title: 'روز بزرگداشت فردوسی و پاسداشت زبان فارسی', isHoliday: false },
  { id: 'o-0228', date: '02/28', title: 'روز بزرگداشت خیام نیشابوری', isHoliday: false },

  // خرداد
  { id: 'o-0301', date: '03/01', title: 'روز بهره‌وری و بهینه‌سازی مصرف', isHoliday: false },
  { id: 'h-0314', date: '03/14', title: 'رحلت امام خمینی', isHoliday: true },
  { id: 'h-0315', date: '03/15', title: 'قیام ۱۵ خرداد', isHoliday: true },
  { id: 'o-0320', date: '03/20', title: 'روز صنایع دستی', isHoliday: false },

  // تیر
  { id: 'o-0401', date: '04/01', title: 'جشن آب‌پاشونک / روز اصناف', isHoliday: false },
  { id: 'o-0410', date: '04/10', title: 'روز صنعت و معدن', isHoliday: false },
  { id: 'o-0414', date: '04/14', title: 'روز قلم', isHoliday: false, description: 'پاسداشت نویسندگان و صاحبان اندیشه' },
  { id: 'o-0425', date: '04/25', title: 'روز بهزیستی و تامین اجتماعی', isHoliday: false },

  // مرداد
  { id: 'o-0506', date: '05/06', title: 'روز ترویج آموزش‌های فنی و حرفه‌ای', isHoliday: false },
  { id: 'o-0508', date: '05/08', title: 'روز بزرگداشت شیخ شهاب‌الدین سهروردی (شیخ اشراق)', isHoliday: false },
  { id: 'o-0517', date: '05/17', title: 'روز خبرنگار', isHoliday: false },
  { id: 'o-0528', date: '05/28', title: 'سالروز کودتای ۲۸ مرداد', isHoliday: false },

  // شهریور
  { id: 'o-0601', date: '06/01', title: 'روز پزشک / بزرگداشت ابوعلی سینا', isHoliday: false },
  { id: 'o-0605', date: '06/05', title: 'روز داروساز / بزرگداشت زکریای رازی', isHoliday: false },
  { id: 'o-0613', date: '06/13', title: 'روز بزرگداشت ابوریحان بیرونی', isHoliday: false },
  { id: 'o-0621', date: '06/21', title: 'روز ملی سینما', isHoliday: false },
  { id: 'o-0627', date: '06/27', title: 'روز شعر و ادب فارسی / بزرگداشت استاد شهریار', isHoliday: false },

  // مهر
  { id: 'o-0701', date: '07/01', title: 'آغاز سال تحصیلی جدید و بازگشایی مدارس و دانشگاه‌ها', isHoliday: false },
  { id: 'o-0708', date: '07/08', title: 'روز بزرگداشت مولوی (مولانا)', isHoliday: false },
  { id: 'o-0714', date: '07/14', title: 'روز دامپزشکی', isHoliday: false },
  { id: 'o-0720', date: '07/20', title: 'روز بزرگداشت حافظ شیرازی', isHoliday: false, description: 'یادمان لسان‌الغیب' },
  { id: 'o-0726', date: '07/26', title: 'روز تربیت بدنی و ورزش', isHoliday: false },

  // آبان
  { id: 'o-0801', date: '08/01', title: 'روز آمار و برنامه‌ریزی', isHoliday: false },
  { id: 'o-0807', date: '08/07', title: 'روز کوروش بزرگ (گرامیداشت منشور حقوق بشر)', isHoliday: false },
  { id: 'o-0810', date: '08/10', title: 'جشن آبانگان', isHoliday: false },
  { id: 'o-0824', date: '08/24', title: 'روز کتاب، کتابخوانی و کتابدار', isHoliday: false },

  // آذر
  { id: 'o-0913', date: '09/13', title: 'روز بیمه', isHoliday: false },
  { id: 'o-0916', date: '09/16', title: 'روز دانشجو', isHoliday: false, description: 'گرامیداشت پویایی و خردورزی دانشجویان' },
  { id: 'o-0925', date: '09/25', title: 'روز پژوهش', isHoliday: false },
  { id: 'o-0930', date: '09/30', title: 'جشن شب یلدا (چله)', isHoliday: false, description: 'بلندترین شب سال و پاسداشت کهن ایرانی' },

  // دی
  { id: 'o-1001', date: '10/01', title: 'جشن خرم‌روز / آغاز زمستان', isHoliday: false },
  { id: 'o-1005', date: '10/05', title: 'روز ایمنی در برابر زلزله و بلایای طبیعی', isHoliday: false },
  { id: 'o-1014', date: '10/14', title: 'جشن سیرسور', isHoliday: false },

  // بهمن
  { id: 'h-1122', date: '11/22', title: 'سالروز پیروزی انقلاب اسلامی', isHoliday: true },
  { id: 'o-1129', date: '11/29', title: 'جشن سپندارمذگان (روز مهر و زمین بانوان)', isHoliday: false },

  // اسفند
  { id: 'o-1205', date: '12/05', title: 'روز بزرگداشت خواجه نصیرالدین طوسی / روز مهندس', isHoliday: false },
  { id: 'o-1215', date: '12/15', title: 'روز درختکاری', isHoliday: false },
  { id: 'h-1229', date: '12/29', title: 'روز ملی شدن صنعت نفت ایران', isHoliday: true },
];

/**
 * دریافت مناسبت یا تعطیلی بر اساس تاریخ کامل یا ماه و روز
 */
export function getOccasionForDate(dateStr: string): HolidayOccasion | undefined {
  if (!dateStr) return undefined;
  // اگر ورودی YYYY/MM/DD باشد، بخش MM/DD را استخراج می‌کنیم
  const parts = dateStr.replace(/-/g, '/').split('/');
  const mmDd = parts.length === 3 ? `${parts[1]}/${parts[2]}` : dateStr;
  return IRANIAN_HOLIDAYS_AND_OCCASIONS.find((o) => o.date === mmDd);
}
