import React, { useState, useRef } from 'react';
import { store, useStore } from '../../store/useStore';
import { getTodayJalali, addDaysJalali } from '../../lib/date/jalali';
import { Plus, Calendar, Flame, Layers, AlertCircle, Check } from 'lucide-react';
import { Priority } from '../../types';

interface InlineTaskCreatorProps {
  defaultGroupId?: string;
  onTaskCreated?: () => void;
}

export const InlineTaskCreator: React.FC<InlineTaskCreatorProps> = ({ defaultGroupId, onTaskCreated }) => {
  const { domainGroups } = useStore();
  const today = getTodayJalali().dateStr;
  const tomorrow = addDaysJalali(today, 1);

  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState<string>(today);
  const [priority, setPriority] = useState<Priority>('medium');
  const [groupId, setGroupId] = useState<string>(defaultGroupId || domainGroups[0]?.id || 'general');
  const [hasError, setHasError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setHasError(true);
      inputRef.current?.focus();
      return;
    }

    setHasError(false);

    store.addTask({
      title: cleanTitle,
      dueDate: dueDate || undefined,
      priority,
      groupId: groupId || undefined,
    });

    // پاکسازی و حفظ فوکوس برای ورود سریع تسک بعدی
    setTitle('');
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);

    inputRef.current?.focus();
    onTaskCreated?.();
  };

  return (
    <form
      role="form"
      aria-label="افزودن سریع کار"
      onSubmit={handleSubmit}
      className={`bg-white border rounded-2xl p-3 sm:p-3.5 shadow-2xs transition-all duration-200 ${
        hasError
          ? 'border-rose-300 ring-2 ring-rose-100'
          : 'border-stone-200/90 hover:border-stone-300 focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100'
      }`}
      dir="rtl"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {/* اینپوت اصلی با دسترسی‌پذیری کامل */}
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (hasError) setHasError(false);
            }}
            placeholder="چه کاری در برنامه داری؟ بنویس و اینتر بزن..."
            aria-label="عنوان کار جدید"
            aria-required="true"
            className="w-full bg-stone-50/70 border border-stone-200/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-amber-400 transition-colors"
          />
          {justAdded && (
            <span className="absolute left-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 animate-in fade-in zoom-in-90 duration-150">
              <Check size={12} className="stroke-[3]" />
              <span>ثبت شد</span>
            </span>
          )}
        </div>

        {/* دکمه‌های گزینه‌های سریع و ثبت */}
        <div className="flex items-center justify-between sm:justify-end gap-1.5 flex-wrap">
          {/* انتخاب سریع تاریخ */}
          <div className="flex items-center bg-stone-100/90 p-0.5 rounded-xl border border-stone-200/60 text-[11px]">
            <button
              type="button"
              onClick={() => setDueDate(today)}
              className={`min-h-[30px] px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                dueDate === today
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              امروز
            </button>
            <button
              type="button"
              onClick={() => setDueDate(tomorrow)}
              className={`min-h-[30px] px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                dueDate === tomorrow
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              فردا
            </button>
            <button
              type="button"
              onClick={() => setDueDate('')}
              className={`min-h-[30px] px-2 rounded-lg font-medium transition-colors cursor-pointer ${
                !dueDate
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              بدون تاریخ
            </button>
          </div>

          {/* اولویت سریع */}
          <button
            type="button"
            onClick={() => setPriority(priority === 'high' ? 'medium' : 'high')}
            className={`min-h-[34px] px-2.5 rounded-xl border text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              priority === 'high'
                ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
                : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
            }`}
            aria-label={priority === 'high' ? 'اولویت مهم فعال است' : 'اولویت عادی'}
            title="تغییر اولویت به مهم / عادی"
          >
            <Flame size={12} className={priority === 'high' ? 'text-rose-600 fill-rose-600' : 'text-stone-400'} />
            <span className="hidden sm:inline">{priority === 'high' ? 'مهم' : 'عادی'}</span>
          </button>

          {/* دکمه ثبت کار با تاچ‌تارگت استاندارد */}
          <button
            type="submit"
            className="min-h-[34px] min-w-[34px] px-3 bg-amber-400 hover:bg-amber-300 active:scale-95 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-2xs cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:outline-hidden"
            aria-label="ثبت کار جدید"
          >
            <Plus size={14} className="stroke-[2.5]" />
            <span>ثبت</span>
          </button>
        </div>
      </div>

      {hasError && (
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-rose-600 font-medium animate-in fade-in">
          <AlertCircle size={12} />
          <span>لطفاً عنوان کار را وارد نمایید.</span>
        </div>
      )}
    </form>
  );
};
