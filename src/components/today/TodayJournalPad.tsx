import React, { useState, useEffect, useRef } from 'react';
import { useStore, store } from '../../store/useStore';
import { getTodayJalali, formatJalaliDate } from '../../lib/date/jalali';
import { PenLine, Check, Save, Sparkles, BookOpen } from 'lucide-react';

export const TodayJournalPad: React.FC = () => {
  const { dailyEntries } = useStore();
  const today = getTodayJalali();
  const entry = dailyEntries[today.dateStr] || { date: today.dateStr };

  const [text, setText] = useState(entry.note || '');
  const [savedStatus, setSavedStatus] = useState<'idle' | 'saved'>('idle');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setText(entry.note || '');
  }, [entry.note]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setSavedStatus('idle');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      store.setDailyNote(today.dateStr, val);
      setSavedStatus('saved');
      setTimeout(() => setSavedStatus('idle'), 2500);
    }, 600);
  };

  const handleManualSave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    store.setDailyNote(today.dateStr, text);
    setSavedStatus('saved');
    setTimeout(() => setSavedStatus('idle'), 2500);
  };

  return (
    <section className="bg-white border border-stone-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-3" dir="rtl">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
            <PenLine size={16} />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
              <span>یادداشت روزانه</span>
              <span className="text-[10px] font-normal text-stone-400">
                (نکات، ایده‌ها و یادداشت‌های امروز)
              </span>
            </h3>
            <p className="text-[11px] text-stone-500">
              فضایی برای نوشتن نکات، ایده‌ها و خلاصه اتفاقات روز.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {savedStatus === 'saved' && (
            <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
              <Check size={12} className="stroke-[2.5]" />
              <span>ذخیره شد</span>
            </span>
          )}
          <button
            type="button"
            onClick={handleManualSave}
            className="min-h-11 px-3.5 py-2 text-xs font-bold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
            title="ذخیره یادداشت"
            aria-label="ذخیره دستی یادداشت"
          >
            <Save size={14} aria-hidden="true" />
            <span>ذخیره</span>
          </button>
        </div>
      </div>

      {/* بافت کاغذ خط‌دار یادداشت (Ruled Paper Texture Effect) */}
      <div className="relative rounded-xl border border-stone-200 bg-[#fefdfb] p-1 overflow-hidden focus-within:ring-2 focus-within:ring-stone-800/70 focus-within:border-stone-400">
        <textarea
          value={text}
          onChange={handleChange}
          rows={4}
          aria-label="متن یادداشت روزانه"
          placeholder="نکات، آموخته‌ها، خلاصه جلسات یا یادداشت‌های امروز را اینجا بنویسید..."
          className="w-full bg-transparent p-3 text-xs sm:text-sm leading-relaxed text-stone-900 placeholder:text-stone-500 focus:outline-none resize-y min-h-[100px]"
          style={{
            backgroundImage:
              'linear-gradient(transparent, transparent 27px, #f0ede6 28px)',
            backgroundSize: '100% 28px',
            lineHeight: '28px',
          }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
        <span>یادداشت تاریخ: {formatJalaliDate(today.dateStr, { showYear: false })}</span>
        <span>ذخیره‌سازی خودکار در مرورگر</span>
      </div>
    </section>
  );
};
