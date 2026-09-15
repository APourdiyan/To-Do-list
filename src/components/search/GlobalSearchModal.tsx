import React, { useState, useEffect, useRef } from 'react';
import { useStore, store } from '../../store/useStore';
import { normalizePersianText, formatJalaliDate } from '../../lib/date/jalali';
import {
  Search,
  X,
  CheckSquare,
  Compass,
  Calendar,
  ArrowLeft,
  Clock,
  Sparkles,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const { searchModalOpen, tasks, goals, events } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const handleClose = () => {
    store.setSearchModalOpen(false);
  };

  const normalizedQuery = normalizePersianText(query);

  // جستجو در کارها
  const matchedTasks = normalizedQuery
    ? tasks.filter((t) => {
        const titleNorm = normalizePersianText(t.title);
        const notesNorm = normalizePersianText(t.notes || '');
        return titleNorm.includes(normalizedQuery) || notesNorm.includes(normalizedQuery);
      })
    : [];

  // جستجو در اهداف
  const matchedGoals = normalizedQuery
    ? goals.filter((g) => {
        const titleNorm = normalizePersianText(g.title);
        const descNorm = normalizePersianText(g.description || '');
        return titleNorm.includes(normalizedQuery) || descNorm.includes(normalizedQuery);
      })
    : [];

  // جستجو در رویدادها
  const matchedEvents = normalizedQuery
    ? events.filter((e) => {
        const titleNorm = normalizePersianText(e.title);
        const descNorm = normalizePersianText(e.description || '');
        return titleNorm.includes(normalizedQuery) || descNorm.includes(normalizedQuery);
      })
    : [];

  const totalMatches =
    matchedTasks.length + matchedGoals.length + matchedEvents.length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:pt-16 bg-stone-900/50 backdrop-blur-xs"
      dir="rtl"
      onClick={handleClose}
    >
      <div
        className="bg-white border border-stone-200 rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* کادر ورودی جستجو */}
        <div className="p-4 border-b border-stone-100 flex items-center gap-3">
          <Search size={18} className="text-stone-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در تمام کارها، مسیرها، اهداف و رویدادها..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder-stone-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 rounded"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="text-[10px] bg-stone-100 border border-stone-200 text-stone-500 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        {/* نتایج یا وضعیت خالی */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="text-center py-8 text-stone-400 text-xs space-y-1">
              <div>عبارت مورد نظر خود را تایپ کنید</div>
              <div className="text-[11px] text-stone-400">
                جستجو در عناوین، توضیحات، یادداشت‌ها و تاریخ‌ها
              </div>
            </div>
          ) : totalMatches === 0 ? (
            <div className="text-center py-8 text-stone-500 text-xs space-y-1">
              <div className="font-semibold text-stone-700">نتیجه‌ای یافت نشد</div>
              <div className="text-[11px] text-stone-400">
                موردی منطبق با «{query}» پیدا نشد.
              </div>
            </div>
          ) : (
            <>
              {/* کارهای منطبق */}
              {matchedTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <CheckSquare size={13} />
                    <span>کارها ({matchedTasks.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedTasks.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          store.setSelectedDate(t.dueDate);
                          store.setActiveTab('tasks');
                          handleClose();
                        }}
                        className="p-2.5 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs"
                      >
                        <div className="truncate pl-2">
                          <div className={`font-semibold ${t.completedAt ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {t.title}
                          </div>
                          {t.notes && (
                            <div className="text-[11px] text-stone-500 truncate mt-0.5">
                              {t.notes}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 shrink-0 font-medium">
                          {formatJalaliDate(t.dueDate, { showYear: false })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* مسیرها و اهداف منطبق */}
              {matchedGoals.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <Compass size={13} />
                    <span>مسیرها و اهداف ({matchedGoals.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedGoals.map((g) => (
                      <div
                        key={g.id}
                        onClick={() => {
                          store.setActiveTab('goals');
                          handleClose();
                        }}
                        className="p-2.5 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{g.title}</div>
                          {g.description && (
                            <div className="text-[11px] text-stone-500 truncate mt-0.5">
                              {g.description}
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          {g.level === 'long'
                            ? 'بلندمدت'
                            : g.level === 'medium'
                            ? 'میان‌مدت'
                            : 'کوتاه‌مدت'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* رویدادهای منطبق */}
              {matchedEvents.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <div className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>رویدادها ({matchedEvents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {matchedEvents.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          store.setSelectedDate(e.date);
                          store.setActiveTab('calendar');
                          handleClose();
                        }}
                        className="p-2.5 rounded-xl border border-stone-100 hover:border-stone-300 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-semibold text-stone-900">{e.title}</div>
                          {e.description && (
                            <div className="text-[11px] text-stone-500 truncate mt-0.5">
                              {e.description}
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] text-stone-400 shrink-0 font-medium">
                          {formatJalaliDate(e.date, { showYear: false })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
