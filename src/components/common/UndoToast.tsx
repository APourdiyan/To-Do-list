import React, { useEffect, useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { RotateCcw, X, Trash2 } from 'lucide-react';

const DURATION_MS = 5000;

export const UndoToast: React.FC = () => {
  const pendingDelete = useStore((s) => s.pendingDelete);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!pendingDelete) {
      setProgress(100);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / DURATION_MS) * 100);
      setProgress(remaining);

      if (elapsed >= DURATION_MS) {
        clearInterval(interval);
        store.clearPendingDelete();
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, [pendingDelete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && pendingDelete) {
        store.clearPendingDelete();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && pendingDelete) {
        e.preventDefault();
        store.restorePendingDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pendingDelete]);

  if (!pendingDelete) return null;

  const typeLabels: Record<string, string> = {
    task: 'کار',
    subtask: 'زیروظیفه',
    goal: 'هدف',
    plan: 'برنامه',
  };

  const itemTypeLabel = typeLabels[pendingDelete.type] || 'مورد';

  return (
    <aside
      id="global-undo-toast"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 max-w-md sm:w-96 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200"
      dir="rtl"
    >
      <div className="relative overflow-hidden bg-stone-900/95 backdrop-blur-md text-stone-100 rounded-2xl p-3.5 shadow-2xl border border-stone-700/60 flex items-center justify-between gap-3">
        {/* Progress bar countdown */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400/80 transition-all duration-75"
          style={{ width: `${progress}%` }}
          aria-hidden="true"
        />

        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/30"
            aria-hidden="true"
          >
            <Trash2 size={16} />
          </div>
          <div className="min-w-0 text-xs">
            <span className="text-stone-400 block text-[10px]">
              {itemTypeLabel} حذف شد
            </span>
            <p className="font-semibold text-white truncate max-w-[150px] sm:max-w-[190px]">
              {pendingDelete.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="undo-toast-restore-btn"
            type="button"
            onClick={() => store.restorePendingDelete()}
            className="min-h-11 min-w-11 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-300"
            aria-label={`بازگردانی ${itemTypeLabel} حذف‌شده: ${pendingDelete.title}`}
          >
            <RotateCcw size={14} className="stroke-[2.5]" aria-hidden="true" />
            <span>بازگردانی</span>
          </button>

          <button
            id="undo-toast-dismiss-btn"
            type="button"
            onClick={() => store.clearPendingDelete()}
            className="min-w-11 min-h-11 p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-400"
            aria-label="بستن اعلان و حذف قطعی"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
