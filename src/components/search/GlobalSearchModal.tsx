import React, { useState, useEffect, useRef } from 'react';
import { useStore, store } from '../../store/useStore';
import { normalizePersianText, formatJalaliDate, toPersianDigits } from '../../lib/date/jalali';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';
import {
  Search,
  X,
  CheckSquare,
  Compass,
  Calendar,
} from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const searchModalOpen = useStore((s) => s.searchModalOpen);
  const tasks = useStore((s) => s.tasks);
  const goals = useStore((s) => s.goals);
  const events = useStore((s) => s.events);

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const handleClose = () => {
    store.setSearchModalOpen(false);
  };

  const normalizedQuery = normalizePersianText(query.trim());

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
    <Modal
      id="global-search-modal"
      isOpen={searchModalOpen}
      onClose={handleClose}
      maxWidth="xl"
      headerContent={
        <div className="flex-1 flex items-center gap-2.5">
          <Search size={18} className="text-stone-500 shrink-0" aria-hidden="true" />
          <label htmlFor="global-search-input" className="sr-only">
            جستجو در تمام دفتر
          </label>
          <input
            id="global-search-input"
            ref={inputRef}
            type="text"
            maxLength={100}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجو در تمام کارها، مسیرها، اهداف و رویدادها..."
            className="flex-1 text-sm bg-transparent border-none focus:outline-none text-stone-900 placeholder-stone-400 font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="min-w-8 min-h-8 flex items-center justify-center text-stone-500 hover:text-stone-800 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800"
              aria-label="پاک کردن متن جستجو"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-stone-100 border border-stone-200 text-stone-600 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>
      }
    >
      <div className="p-4 sm:p-5 space-y-4">
        {!query.trim() ? (
          <div className="text-center py-10 text-stone-600 text-xs space-y-1">
            <p className="font-bold text-stone-800">عبارت مورد نظر خود را تایپ کنید</p>
            <p className="text-[11px] text-stone-500">
              جستجوی یکپارچه در عنوان کارها، توضیحات، یادداشت‌ها و تقویم
            </p>
          </div>
        ) : totalMatches === 0 ? (
          <EmptyState
            title="نتیجه‌ای یافت نشد"
            description={`هیچ کار، هدف یا رویدادی منطبق با «${query}» در دفتر پیدا نشد.`}
          />
        ) : (
          <>
            {/* کارهای منطبق */}
            {matchedTasks.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <CheckSquare size={15} className="text-stone-700" aria-hidden="true" />
                  <span>کارها ({toPersianDigits(matchedTasks.length)})</span>
                </div>
                <div className="space-y-1.5">
                  {matchedTasks.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        store.setSelectedDate(t.dueDate);
                        store.setActiveTab('tasks');
                        handleClose();
                      }}
                      className="w-full text-right p-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-11"
                    >
                      <div className="truncate pl-2">
                        <div className={`font-bold ${t.completedAt ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                          {t.title}
                        </div>
                        {t.notes && (
                          <div className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
                            {t.notes}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 shrink-0 font-medium">
                        {formatJalaliDate(t.dueDate, { showYear: false })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* مسیرها و اهداف منطبق */}
            {matchedGoals.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Compass size={15} className="text-stone-700" aria-hidden="true" />
                  <span>مسیرها و اهداف ({toPersianDigits(matchedGoals.length)})</span>
                </div>
                <div className="space-y-1.5">
                  {matchedGoals.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        store.setActiveTab('goals');
                        handleClose();
                      }}
                      className="w-full text-right p-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-11"
                    >
                      <div>
                        <div className="font-bold text-stone-900">{g.title}</div>
                        {g.description && (
                          <div className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
                            {g.description}
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-bold">
                        {g.level === 'long'
                          ? 'بلندمدت'
                          : g.level === 'medium'
                          ? 'میان‌مدت'
                          : 'کوتاه‌مدت'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* رویدادهای منطبق */}
            {matchedEvents.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Calendar size={15} className="text-stone-700" aria-hidden="true" />
                  <span>رویدادها ({toPersianDigits(matchedEvents.length)})</span>
                </div>
                <div className="space-y-1.5">
                  {matchedEvents.map((e) => (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => {
                        store.setSelectedDate(e.date);
                        store.setActiveTab('calendar');
                        handleClose();
                      }}
                      className="w-full text-right p-3 rounded-xl border border-stone-200 hover:border-stone-400 hover:bg-stone-50/80 cursor-pointer transition-all flex items-center justify-between text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/70 min-h-11"
                    >
                      <div>
                        <div className="font-bold text-stone-900">{e.title}</div>
                        {e.description && (
                          <div className="text-[11px] text-stone-600 truncate mt-0.5 font-medium">
                            {e.description}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-stone-500 shrink-0 font-medium">
                        {formatJalaliDate(e.date, { showYear: false })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
