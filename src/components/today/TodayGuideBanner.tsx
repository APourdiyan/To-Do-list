import React from 'react';
import { useStore, store } from '../../store/useStore';
import { Sparkles, CheckCircle2, Compass, PenLine, X, BookOpen } from 'lucide-react';

interface TodayGuideBannerProps {
  onOpenPhilosophyModal?: () => void;
}

export const TodayGuideBanner: React.FC<TodayGuideBannerProps> = ({ onOpenPhilosophyModal }) => {
  const { settings } = useStore();

  if (settings.hideGuideBanner) {
    return null;
  }

  const handleDismiss = () => {
    store.updateSettings({ hideGuideBanner: true });
  };

  return (
    <div
      className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 relative transition-all"
      dir="rtl"
    >
      <button
        onClick={handleDismiss}
        className="absolute left-3 top-3 p-1 rounded-lg text-amber-700/60 hover:text-amber-900 hover:bg-amber-100/60 transition-colors"
        title="بستن این راهنما (در تنظیمات قابل فعال‌سازی مجدد است)"
      >
        <X size={15} />
      </button>

      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md bg-amber-200/70 text-amber-900 flex items-center justify-center shrink-0">
          <BookOpen size={14} />
        </div>
        <h4 className="text-xs sm:text-sm font-bold text-stone-900">
          آئین ساده دفتر شخصی: ۳ گام شفاف برای شروع امروز
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-stone-700">
        <div className="bg-white/80 border border-amber-100/80 rounded-xl p-3 space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">
              ۱
            </span>
            <span>نیت و تمرکز روز</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            یک جمله بنویس که امروز انرژی و فکرت دقیقاً روی چه هدف یا کاری متمرکز است.
          </p>
        </div>

        <div className="bg-white/80 border border-amber-100/80 rounded-xl p-3 space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">
              ۲
            </span>
            <span>اقدامات مهم امروز</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            کارهای امروزت را مستقیم در کادر پایین بنویس و با انجام هرکدام خط بزن.
          </p>
        </div>

        <div className="bg-white/80 border border-amber-100/80 rounded-xl p-3 space-y-1">
          <div className="font-bold text-amber-900 flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px]">
              ۳
            </span>
            <span>حاشیه و یادداشت آزاد</span>
          </div>
          <p className="text-stone-600 leading-relaxed text-[11px]">
            افکار، ایده‌ها و حس‌وحالت را در دفترچه پایین روزانه تخلیه و ثبت کن.
          </p>
        </div>
      </div>

      {onOpenPhilosophyModal && (
        <div className="mt-3 pt-2.5 border-t border-amber-200/50 flex items-center justify-between text-[11px]">
          <span className="text-stone-500">
            برای درک کامل سازوکار بخش‌های گاه‌شمار و اهداف:
          </span>
          <button
            onClick={onOpenPhilosophyModal}
            className="font-bold text-amber-900 hover:text-amber-950 underline underline-offset-4"
          >
            مطالعه راهنمای کامل دفتر زندگی
          </button>
        </div>
      )}
    </div>
  );
};
