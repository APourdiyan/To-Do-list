import React from 'react';
import {
  X,
  BookOpen,
  Sun,
  Calendar,
  Compass,
  CheckSquare,
  Sparkles,
  ArrowLeft,
  Target,
  PenLine,
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      dir="rtl"
    >
      <div className="bg-[#fbfaf6] border border-stone-300 w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* هدر مدال */}
        <div className="bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
              <BookOpen size={17} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                دفتر زندگی من چطور کار می‌کند؟
              </h3>
              <p className="text-[11px] text-amber-200">
                راهنمای وضوح ذهنی و استفاده شخصی بدون سردرگمی
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* بدنه و توضیحات بخش‌ها */}
        <div className="p-6 overflow-y-auto space-y-6 text-stone-800 text-xs sm:text-sm leading-relaxed">
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 text-stone-700 space-y-1.5">
            <div className="font-bold text-amber-950 flex items-center gap-2">
              <Sparkles size={15} className="text-amber-600" />
              <span>فلسفه دفتر شخصی شما</span>
            </div>
            <p className="text-xs text-stone-600">
              اینجا یک برنامه سازمانی پیچیده یا پر از اصطلاحات شلوغ نیست؛ یک دفترچه یادداشت مدرن و
              آرام است که زمان شما را بر پایه تقویم هجری شمسی و کارهای ملموس روزانه مرتب می‌کند.
            </p>
          </div>

          <div className="space-y-4">
            {/* ۱. زبانه امروز */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="p-1 rounded-md bg-amber-100 text-amber-900">
                  <Sun size={15} />
                </span>
                <span>۱. صفحه «امروز» — کانون اصلی و زنده روز شما</span>
              </div>
              <p className="text-xs text-stone-600 pr-7">
                هر روز صبح که دفترت را باز می‌کنی، تمام تمرکزت اینجاست:
              </p>
              <ul className="text-xs text-stone-600 space-y-1.5 list-disc pr-11">
                <li>
                  <strong className="text-stone-800">نیت و تمرکز روز:</strong> در یک جمله مشخص
                  کن امروز مهم‌ترین هدفت چیست تا ذهنت پخش نشود.
                </li>
                <li>
                  <strong className="text-stone-800">اقدامات مستقیم:</strong> کارهای امروزت را
                  در همان کادر بنویس و در طول روز با تیک زدن خط بزن.
                </li>
                <li>
                  <strong className="text-stone-800">حاشیه و یادداشت:</strong> افکار متفرقه، شماره
                  تلفن یا گزارش کوتاه شبانه را در دفترچه حاشیه بنویس.
                </li>
              </ul>
            </div>

            {/* ۲. زبانه گاه‌شمار */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="p-1 rounded-md bg-stone-100 text-stone-800">
                  <Calendar size={15} />
                </span>
                <span>۲. صفحه «گاه‌شمار» — افق ماهانه و ابزارهای زمان خورشیدی</span>
              </div>
              <p className="text-xs text-stone-600 pr-7">
                دیدن شبکه تقویم از شنبه تا جمعه، آگاهی از تعطیلات رسمی و مناسبت‌ها، ابزار
                «فاصله‌سنج دقیق بین دو تاریخ شمسی» و مبدل تقویم شمسی به میلادی.
              </p>
            </div>

            {/* ۳. زبانه مسیرها */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="p-1 rounded-md bg-stone-100 text-stone-800">
                  <Compass size={15} />
                </span>
                <span>۳. صفحه «مسیرها» — پیوند کارهای خرد با آرزوهای بزرگ</span>
              </div>
              <p className="text-xs text-stone-600 pr-7">
                کارهای روزمره اگر به هدفی وصل نباشند خسته‌کننده می‌شوند. در این بخش افق‌های
                بلندمدت (چندساله)، فصلی یا کوتاه‌مدت را ثبت کن تا کارهایت باانگیزه انجام شوند.
              </p>
            </div>

            {/* ۴. زبانه کارها */}
            <div className="border border-stone-200 rounded-xl p-4 bg-white space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <span className="p-1 rounded-md bg-stone-100 text-stone-800">
                  <CheckSquare size={15} />
                </span>
                <span>۴. صفحه «کارها» — آرشیو، دسته‌بندی و انتقال زمان</span>
              </div>
              <p className="text-xs text-stone-600 pr-7">
                مشاهده تمام وظایف به تفکیک حوزه‌ها (کار، دانشگاه، شخصی، مطالعه)، فیلتر کارهای
                انجام‌نشده، و انتقال کارها به فردا یا هفته آینده با یک کلیک.
              </p>
            </div>

            {/* ۵. ساختار ۶ حوزه بنیادین زندگی */}
            <div className="border border-amber-300 rounded-xl p-4 bg-amber-50/50 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <span className="p-1 rounded-md bg-amber-200 text-amber-900">
                  <LayoutGrid size={15} />
                </span>
                <span>۵. نظم «۶ حوزه بنیادین زندگی» (اختیاری)</span>
              </div>
              <p className="text-xs text-stone-700 pr-7 leading-relaxed">
                اگر مایلید تمام زندگی‌تان در چند ستون اصیل و متوازن طبقه‌بندی شود، می‌توانید از بالای فهرست کارهای امروز یا منوی تنظیمات، حالت <strong>«ساختار ۶ حوزه»</strong> را فعال کنید:
                <br />
                <span className="inline-block mt-1 text-stone-800">
                  ۱. برنامه معنوی · ۲. برنامه تخصصی و شغل · ۳. برنامه مطالعاتی · ۴. مهارت‌های فردی · ۵. برنامه ورزشی · ۶. کارهای آزاد (روزمره)
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* فوتر مدال */}
        <div className="bg-stone-100 border-t border-stone-200 px-6 py-3.5 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            با کلید میانبر <kbd className="bg-stone-200 px-1.5 py-0.5 rounded text-stone-700">Ctrl+K</kbd> در هر لحظه کار یا رویداد ثبت کن.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-colors"
          >
            متوجه شدم، رفتن به دفتر
          </button>
        </div>
      </div>
    </div>
  );
};
