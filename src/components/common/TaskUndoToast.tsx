import React, { useEffect } from 'react';
import { useStore, store } from '../../store/useStore';
import { RotateCcw, X, Trash2 } from 'lucide-react';

export const TaskUndoToast: React.FC = () => {
  const { lastDeletedTask } = useStore();

  useEffect(() => {
    if (!lastDeletedTask) return;

    // بستن خودکار پس از ۶ ثانیه در صورت عدم اقدام
    const timer = setTimeout(() => {
      store.clearLastDeletedTask();
    }, 6000);

    return () => clearTimeout(timer);
  }, [lastDeletedTask]);

  if (!lastDeletedTask) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 left-4 sm:left-auto sm:right-6 max-w-md sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
      dir="rtl"
    >
      <div className="bg-stone-900/95 backdrop-blur-md text-stone-100 rounded-2xl p-3.5 shadow-2xl border border-stone-700/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30">
            <Trash2 size={16} />
          </div>
          <div className="min-w-0 text-xs">
            <span className="text-stone-400 block text-[10px]">کار حذف شد</span>
            <p className="font-semibold text-white truncate max-w-[170px] sm:max-w-[200px]">
              {lastDeletedTask.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => store.restoreLastDeletedTask()}
            className="min-h-[38px] px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer"
            aria-label="بازگردانی کار حذف‌شده"
          >
            <RotateCcw size={13} className="stroke-[2.5]" />
            <span>بازگردانی</span>
          </button>

          <button
            type="button"
            onClick={() => store.clearLastDeletedTask()}
            className="min-w-[36px] min-h-[36px] p-1.5 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            aria-label="بستن اعلان"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};
