import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { getTodayJalali } from '../../lib/date/jalali';
import { Priority } from '../../types';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import { Plus, Flame, Tag, Check } from 'lucide-react';

export const TodayInlineTaskInput: React.FC = () => {
  const { domainGroups, settings, selectedDate } = useStore();
  const today = getTodayJalali();
  const targetDate = selectedDate || today.dateStr;
  const isToday = targetDate === today.dateStr;

  const availableDomains = settings.lifeDomainsMode ? SIX_LIFE_DOMAINS : domainGroups;
  const [title, setTitle] = useState('');
  const [groupId, setGroupId] = useState(availableDomains[0]?.id || 'work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) return;

    store.addTask({
      title: cleanTitle,
      groupId,
      dueDate: targetDate,
      priority,
    });

    setTitle('');
    // نگه داشتن فوکوس برای ثبت کارهای بعدی به سبک دفترچه
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-2xl border transition-all bg-white p-3 sm:p-3.5 ${
        isFocused
          ? 'border-amber-400/80 shadow-sm ring-2 ring-amber-400/20'
          : 'border-stone-200/90 shadow-2xs hover:border-stone-300'
      }`}
      dir="rtl"
    >
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-600 flex items-center justify-center shrink-0">
          <Plus size={16} className="stroke-[2.5]" />
        </div>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="عنوان کار جدید برای ثبت سریع"
          placeholder={
            isToday
              ? 'کار جدیدی برای امروز در ذهنت هست؟ بنویس و اینتر بزن...'
              : `اقدام جدیدی برای این روز (${targetDate}) بنویس و ثبت کن...`
          }
          className="flex-1 bg-transparent border-none text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-400 focus:outline-hidden"
        />

        <button
          type="submit"
          disabled={!title.trim()}
          className={`min-h-11 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
            title.trim()
              ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-xs cursor-pointer'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'
          }`}
        >
          <span>{isToday ? 'ثبت در امروز' : 'ثبت در این روز'}</span>
        </button>
      </div>

      {/* نوارهای تکمیلی سریع: انتخاب دسته و اولویت هنگام فوکوس یا وجود متن */}
      {(isFocused || title.trim().length > 0) && (
        <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* انتخاب حوزه */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-stone-600 flex items-center gap-1">
              <Tag size={12} aria-hidden="true" />
              <span>حوزه:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {availableDomains.map((g) => {
                const isSelected = groupId === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGroupId(g.id)}
                    aria-pressed={isSelected}
                    className={`min-h-9 text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                      isSelected
                        ? 'bg-stone-900 text-stone-100 border-stone-900 font-bold'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: g.color }}
                      aria-hidden="true"
                    />
                    <span>{g.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* تعیین اولویت */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPriority(priority === 'high' ? 'medium' : 'high')}
              aria-pressed={priority === 'high'}
              className={`min-h-9 text-xs px-3 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                priority === 'high'
                  ? 'bg-rose-50 text-rose-900 border-rose-300 font-bold'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="تعیین به عنوان اولویت فوری/مهم"
            >
              <Flame
                size={14}
                className={priority === 'high' ? 'text-rose-600 fill-rose-600' : 'text-stone-400'}
                aria-hidden="true"
              />
              <span>اولویت مهم امروز</span>
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
