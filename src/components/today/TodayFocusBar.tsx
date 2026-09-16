import React, { useState, useEffect } from 'react';
import { useStore, store } from '../../store/useStore';
import { getTodayJalali } from '../../lib/date/jalali';
import { MoodType } from '../../types';
import {
  Sparkles,
  Smile,
  Zap,
  Coffee,
  Moon,
  Feather,
  Check,
  Edit2,
  X,
  Plus,
} from 'lucide-react';

const MOODS: { id: MoodType; label: string; icon: React.ReactNode; activeColor: string }[] = [
  { id: 'focused', label: 'متمرکز', icon: <Sparkles size={12} />, activeColor: 'bg-emerald-900 text-emerald-100 border-emerald-800' },
  { id: 'calm', label: 'آرام', icon: <Feather size={12} />, activeColor: 'bg-teal-900 text-teal-100 border-teal-800' },
  { id: 'energetic', label: 'پرانرژی', icon: <Zap size={12} />, activeColor: 'bg-amber-900 text-amber-100 border-amber-800' },
  { id: 'reflective', label: 'در حال فکر', icon: <Coffee size={12} />, activeColor: 'bg-stone-800 text-stone-200 border-stone-700' },
  { id: 'tired', label: 'خسته یا کم‌انرژی', icon: <Moon size={12} />, activeColor: 'bg-stone-700 text-stone-100 border-stone-600' },
];

export const TodayFocusBar: React.FC = () => {
  const { dailyEntries } = useStore();
  const today = getTodayJalali();
  const entry = dailyEntries[today.dateStr] || { date: today.dateStr };

  const [isEditing, setIsEditing] = useState(false);
  const [focusInput, setFocusInput] = useState(entry.focus || '');

  useEffect(() => {
    setFocusInput(entry.focus || '');
  }, [entry.focus]);

  const handleSave = () => {
    store.setDailyFocus(today.dateStr, focusInput.trim());
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      setFocusInput(entry.focus || '');
      setIsEditing(false);
    }
  };

  const handleSelectMood = (moodId: MoodType) => {
    const nextMood = entry.mood === moodId ? undefined : moodId;
    store.setDailyMood(today.dateStr, nextMood);
  };

  return (
    <div
      className="bg-white border border-stone-200/90 rounded-2xl p-3 sm:p-4 shadow-2xs space-y-3"
      dir="rtl"
    >
      {/* سطر اصلی نیت/تمرکز امروز: مینیمال و آرام */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 rounded-lg bg-amber-100/90 text-amber-800 flex items-center justify-center shrink-0">
            <Sparkles size={13} className="stroke-[2.5]" />
          </div>

          <span className="text-xs font-bold text-stone-800 shrink-0">
            تمرکز امروز:
          </span>

          {/* متن نیت به صورت تک‌خطی آرام و زیبا */}
          {!isEditing && (
            <div
              onClick={() => setIsEditing(true)}
              className="flex-1 min-w-0 cursor-pointer group"
            >
              {entry.focus ? (
                <span className="text-xs sm:text-[13px] font-medium text-stone-900 group-hover:text-amber-900 transition-colors truncate block">
                  « {entry.focus} »
                </span>
              ) : (
                <span className="text-xs text-stone-400 group-hover:text-stone-600 transition-colors flex items-center gap-1">
                  <span>ثبت یک جمله کوتاه برای جهت‌گیری امروز...</span>
                  <Plus size={12} className="text-stone-400" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* دکمه ویرایش یا ثبت در صورت عدم ویرایش */}
        {!isEditing && (
          <div className="flex items-center gap-1 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="min-h-11 px-3 py-1.5 text-xs text-stone-700 hover:text-stone-950 flex items-center gap-1.5 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              aria-label={entry.focus ? 'ویرایش تمرکز امروز' : 'افزودن تمرکز امروز'}
            >
              <Edit2 size={13} aria-hidden="true" />
              <span>{entry.focus ? 'ویرایش' : 'افزودن'}</span>
            </button>
          </div>
        )}
      </div>

      {/* حالت ادیت جمع‌وجور */}
      {isEditing && (
        <div className="flex items-center gap-2 pt-1">
          <input
            type="text"
            value={focusInput}
            onChange={(e) => setFocusInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="عنوان تمرکز و جهت‌گیری امروز"
            placeholder="مثال: اولویت با تحویل پروژه و پیاده‌روی عصرگاهی..."
            autoFocus
            className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 focus:border-stone-800 rounded-xl text-xs sm:text-sm font-medium text-stone-900 placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:bg-white transition-all"
          />
          <button
            type="button"
            onClick={handleSave}
            className="min-h-11 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-stone-100 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
          >
            <Check size={14} aria-hidden="true" />
            <span>ثبت</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setFocusInput(entry.focus || '');
              setIsEditing(false);
            }}
            className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-100 text-xs transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
            title="انصراف"
            aria-label="انصراف از ویرایش"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      {/* سطر پیوسته حال‌وهوای روز به صورت برچسب‌های فشرده و مرتب */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
        <span className="text-stone-600 font-bold shrink-0">حال‌وهوا:</span>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {MOODS.map((m) => {
            const isSelected = entry.mood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleSelectMood(m.id)}
                aria-pressed={isSelected}
                aria-label={`حال و هوای ${m.label}`}
                className={`min-h-9 px-3 py-1 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 select-none cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                  isSelected
                    ? `${m.activeColor} shadow-3xs font-bold`
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-950'
                }`}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
