import React from 'react';
import { Modal } from './Modal';
import {
  Sun,
  Calendar,
  Compass,
  CheckSquare,
  Sparkles,
  LayoutGrid,
} from 'lucide-react';

interface JournalPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JournalPhilosophyModal: React.FC<JournalPhilosophyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      id="journal-philosophy-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title="دفتر زندگی من چطور کار می‌کند؟"
      subtitle="راهنمای وضوح ذهنی و استفاده شخصی بدون سردرگمی"
    >
      <div className="p-5 sm:p-6 space-y-6 text-stone-900 text-xs sm:text-sm leading-relaxed">
        <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 text-stone-800 space-y-1.5 font-medium">
          <div className="font-bold text-amber-950 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-600" aria-hidden="true" />
            <span>فلسفه دفتر شخصی شما</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            اینجا یک برنامه سازمانی پیچیده یا پر از اصطلاحات شلوغ نیست؛ یک دفترچه یادداشت مدرن و
            آرام است که زمان شما را بر پایه تقویم هجری شمسی و کارهای ملموس روزانه مرتب می‌کند.
          </p>
        </div>

        <div className="space-y-4">
          {/* ۱. زبانه امروز */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="p-1 rounded-md bg-amber-100 text-amber-900">
                <Sun size={16} aria-hidden="true" />
              </span>
              <span>۱. صفحه «امروز» — کانون اصلی و زنده روز شما</span>
            </div>
            <p className="text-xs text-stone-700 pr-7 font-medium">
              هر روز صبح که دفترت را باز می‌کنی، تمام تمرکزت اینجاست:
            </p>
            <ul className="text-xs text-stone-700 space-y-1.5 list-disc pr-11 font-medium">
              <li>
                <strong className="text-stone-900">نیت و تمرکز روز:</strong> در یک جمله مشخص
                کن امروز مهم‌ترین هدفت چیست تا ذهنت پخش نشود.
              </li>
              <li>
                <strong className="text-stone-900">اقدامات مستقیم:</strong> کارهای امروزت را
                در همان کادر بنویس و در طول روز با تیک زدن خط بزن.
              </li>
              <li>
                <strong className="text-stone-900">حاشیه و یادداشت:</strong> افکار متفرقه، شماره
                تلفن یا گزارش کوتاه شبانه را در دفترچه حاشیه بنویس.
              </li>
            </ul>
          </div>

          {/* ۲. زبانه گاه‌شمار */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="p-1 rounded-md bg-stone-200 text-stone-800">
                <Calendar size={16} aria-hidden="true" />
              </span>
              <span>۲. صفحه «گاه‌شمار» — افق ماهانه و ابزارهای زمان خورشیدی</span>
            </div>
            <p className="text-xs text-stone-700 pr-7 font-medium">
              دیدن شبکه تقویم از شنبه تا جمعه، آگاهی از تعطیلات رسمی و مناسبت‌ها، ابزار
              «فاصله‌سنج دقیق بین دو تاریخ شمسی» و مبدل تقویم شمسی به میلادی.
            </p>
          </div>

          {/* ۳. زبانه مسیرها */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="p-1 rounded-md bg-stone-200 text-stone-800">
                <Compass size={16} aria-hidden="true" />
              </span>
              <span>۳. صفحه «مسیرها» — پیوند کارهای خرد با آرزوهای بزرگ</span>
            </div>
            <p className="text-xs text-stone-700 pr-7 font-medium">
              کارهای روزمره اگر به هدفی وصل نباشند خسته‌کننده می‌شوند. در این بخش افق‌های
              بلندمدت (چندساله)، فصلی یا کوتاه‌مدت را ثبت کن تا کارهایت باانگیزه انجام شوند.
            </p>
          </div>

          {/* ۴. زبانه کارها */}
          <div className="border border-stone-200 rounded-2xl p-4 bg-stone-50/50 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <span className="p-1 rounded-md bg-stone-200 text-stone-800">
                <CheckSquare size={16} aria-hidden="true" />
              </span>
              <span>۴. صفحه «کارها» — آرشیو، دسته‌بندی و انتقال زمان</span>
            </div>
            <p className="text-xs text-stone-700 pr-7 font-medium">
              مشاهده تمام وظایف به تفکیک حوزه‌ها (کار، دانشگاه، شخصی، مطالعه)، فیلتر کارهای
              انجام‌نشده، و انتقال کارها به فردا یا هفته آینده با یک کلیک.
            </p>
          </div>

          {/* ۵. ساختار ۶ حوزه بنیادین زندگی */}
          <div className="border border-amber-300 rounded-2xl p-4 bg-amber-50/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-950">
              <span className="p-1 rounded-md bg-amber-200 text-amber-900">
                <LayoutGrid size={16} aria-hidden="true" />
              </span>
              <span>۵. نظم «۶ حوزه بنیادین زندگی» (اختیاری)</span>
            </div>
            <p className="text-xs text-stone-800 pr-7 leading-relaxed font-medium">
              اگر مایلید تمام زندگی‌تان در چند ستون اصیل و متوازن طبقه‌بندی شود، می‌توانید از بالای فهرست کارهای امروز یا منوی تنظیمات، حالت <strong>«ساختار ۶ حوزه»</strong> را فعال کنید:
              <br />
              <span className="inline-block mt-1 text-stone-900 font-bold">
                ۱. برنامه معنوی · ۲. برنامه تخصصی و شغل · ۳. برنامه مطالعاتی · ۴. مهارت‌های فردی · ۵. برنامه ورزشی · ۶. کارهای آزاد (روزمره)
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* فوتر مدال */}
      <div className="bg-stone-50 border-t border-stone-200 px-5 sm:px-6 py-3.5 flex items-center justify-between">
        <span className="text-[11px] text-stone-600 font-medium">
          با کلید میانبر <kbd className="bg-stone-200 border border-stone-300 px-1.5 py-0.5 rounded text-stone-800 font-mono">Ctrl+K</kbd> در هر لحظه کار یا رویداد ثبت کن.
        </span>
        <button
          type="button"
          onClick={onClose}
          className="min-h-11 px-5 py-2 bg-stone-900 hover:bg-stone-800 active:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
        >
          متوجه شدم، رفتن به دفتر
        </button>
      </div>
    </Modal>
  );
};
