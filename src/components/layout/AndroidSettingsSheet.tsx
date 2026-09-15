import React from 'react';
import { useStore, store } from '../../store/useStore';
import {
  LayoutGrid,
  Calendar,
  BookOpen,
  RotateCcw,
  X,
  Sparkles,
  Smartphone,
  Check,
} from 'lucide-react';

interface AndroidSettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidSettingsSheet: React.FC<AndroidSettingsSheetProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4 animate-in fade-in duration-200" dir="rtl">
      {/* پس‌زمینه تاریک */}
      <div
        className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* پنل شیت اندرویدی */}
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl border border-stone-200/90 shadow-2xl p-5 pb-8 sm:pb-6 z-10 space-y-4 max-h-[85vh] overflow-y-auto">
        {/* دستگیره شیت اندروید (Grabber Bar) */}
        <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto sm:hidden" />

        {/* سربرگ شیت */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
              <Smartphone size={17} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">
                تنظیمات و ترجیحات
              </h3>
              <p className="text-[11px] text-stone-500">
                شخصی‌سازی نمای دفتر و رفتار برنامه
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* فهرست تنظیمات لمسی به سبک اندروید */}
        <div className="space-y-2">
          {/* گزینه ۱: ساختار ۶ حوزه زندگی */}
          <div
            onClick={() =>
              store.updateSettings({
                lifeDomainsMode: !settings.lifeDomainsMode,
              })
            }
            className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/90 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                <LayoutGrid size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  ساماندهی ۶ حوزه بنیادین زندگی
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  تفکیک متوازن کارهای روز در ۶ ستون معین (شغل، معنویت، مطالعه...)
                </div>
              </div>
            </div>

            {/* سوئیچ اندرویدی */}
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                settings.lifeDomainsMode ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform" />
            </div>
          </div>

          {/* گزینه ۲: تقویم و تاریخ میلادی */}
          <div
            onClick={() =>
              store.updateSettings({
                showGregorian: !settings.showGregorian,
              })
            }
            className="flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/90 hover:bg-stone-50 active:bg-stone-100 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
                <Calendar size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  نمایش تاریخ میلادی در کنار شمسی
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  مشاهده معادل میلادی تاریخ روز در سربرگ تقویم
                </div>
              </div>
            </div>

            {/* سوئیچ اندرویدی */}
            <div
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 shrink-0 ${
                settings.showGregorian ? 'bg-amber-500 justify-end' : 'bg-stone-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs transition-transform" />
            </div>
          </div>

          {/* گزینه ۳: راهنمای شیوه کار دفتر زندگی */}
          <button
            type="button"
            onClick={() => {
              onClose();
              store.setPhilosophyModalOpen(true);
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/90 hover:bg-stone-50 active:bg-stone-100 transition-colors text-right cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center shrink-0">
                <BookOpen size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-stone-900">
                  راهنمای اصول و شیوه کار دفتر
                </div>
                <div className="text-[11px] text-stone-500 leading-tight">
                  قوانین وضوح ذهن، نیت‌گذاری، ثبت دوره‌ها و تخلیه ذهن
                </div>
              </div>
            </div>
          </button>

          {/* گزینه ۴: بارگذاری مجدد داده‌های نمونه */}
          <button
            type="button"
            onClick={() => {
              if (
                window.confirm(
                  'آیا مایلید داده‌های نمونه اولیه مجدداً بارگذاری شوند؟'
                )
              ) {
                store.resetToDemoData();
                onClose();
              }
            }}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-stone-200/90 hover:bg-amber-50/60 active:bg-amber-100/70 transition-colors text-right cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
                <RotateCcw size={18} />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs sm:text-sm font-bold text-amber-950">
                  بارگذاری مجدد داده‌های نمونه
                </div>
                <div className="text-[11px] text-amber-800/80 leading-tight">
                  تکمیل دفتر با برنامه‌ها، اهداف و کتاب‌های از پیش آماده
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* دکمه تأیید و بستن */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-3 bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-white rounded-2xl font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
        >
          تأیید و بازگشت
        </button>
      </div>
    </div>
  );
};
