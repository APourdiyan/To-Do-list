import React, { useState, useEffect } from 'react';
import { getTodayJalali, isValidJalaliDate, formatJalaliDate, addDaysJalali, toPersianDigits, toEnglishDigits } from '../../lib/date/jalali';
import { Calendar as CalendarIcon, Check } from 'lucide-react';

interface PersianDatePickerProps {
  value: string; // 'YYYY/MM/DD'
  onChange: (val: string) => void;
  label?: string;
  showQuickChips?: boolean;
  required?: boolean;
}

export const PersianDatePicker: React.FC<PersianDatePickerProps> = ({
  value,
  onChange,
  label,
  showQuickChips = true,
  required = false,
}) => {
  const today = getTodayJalali().dateStr;
  const [inputValue, setInputValue] = useState(value || today);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value) {
      setInputValue(value);
      setIsValid(isValidJalaliDate(value));
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const eng = toEnglishDigits(raw);
    if (isValidJalaliDate(eng)) {
      setIsValid(true);
      onChange(eng);
    } else {
      setIsValid(false);
    }
  };

  const setChipDate = (dateStr: string) => {
    setInputValue(dateStr);
    setIsValid(true);
    onChange(dateStr);
  };

  const formattedPreview = isValidJalaliDate(toEnglishDigits(inputValue))
    ? formatJalaliDate(toEnglishDigits(inputValue), { showWeekday: true, showYear: true })
    : null;

  return (
    <div className="flex flex-col gap-1.5 w-full text-right" dir="rtl">
      {label && (
        <label className="text-xs font-semibold text-stone-700 flex items-center gap-1">
          <CalendarIcon size={13} className="text-stone-500" />
          {label} {required && <span className="text-amber-700">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={toPersianDigits(inputValue)}
          onChange={handleInputChange}
          placeholder="مثال: ۱۴۰۵/۰۷/۱۵"
          dir="ltr"
          className={`w-full px-3 py-2 text-right text-sm rounded-lg border transition-colors bg-white/80 focus:bg-white focus:outline-none focus:ring-1 ${
            isValid
              ? 'border-stone-300 focus:border-stone-700 focus:ring-stone-600 text-stone-800'
              : 'border-red-400 focus:border-red-600 focus:ring-red-400 text-red-700'
          }`}
        />
        {isValid && (
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <Check size={14} className="text-emerald-700" />
          </span>
        )}
      </div>

      {formattedPreview ? (
        <div className="text-[11px] text-stone-500 font-medium select-none pr-0.5">
          {formattedPreview}
        </div>
      ) : (
        <div className="text-[11px] text-red-600 font-medium select-none pr-0.5">
          فرمت نامعتبر است (الگو: سال/ماه/روز)
        </div>
      )}

      {showQuickChips && (
        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
          <button
            type="button"
            onClick={() => setChipDate(today)}
            className={`text-xs px-2 py-0.5 rounded border transition-colors ${
              inputValue === today
                ? 'bg-stone-800 text-stone-100 border-stone-800'
                : 'bg-stone-100/90 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            امروز
          </button>
          <button
            type="button"
            onClick={() => setChipDate(addDaysJalali(today, 1))}
            className={`text-xs px-2 py-0.5 rounded border transition-colors ${
              inputValue === addDaysJalali(today, 1)
                ? 'bg-stone-800 text-stone-100 border-stone-800'
                : 'bg-stone-100/90 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            فردا
          </button>
          <button
            type="button"
            onClick={() => setChipDate(addDaysJalali(today, 7))}
            className="text-xs px-2 py-0.5 rounded border bg-stone-100/90 text-stone-700 border-stone-200 hover:bg-stone-200 transition-colors"
          >
            هفته آینده
          </button>
        </div>
      )}
    </div>
  );
};
