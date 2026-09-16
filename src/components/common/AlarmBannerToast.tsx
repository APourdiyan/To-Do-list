import React from 'react';
import { ActiveAlarmAlert } from '../../lib/alarm/useAlarmWatcher';
import { store } from '../../store/useStore';
import { BellRing, Check, X } from 'lucide-react';

interface AlarmBannerToastProps {
  alert: ActiveAlarmAlert | null;
  onDismiss: () => void;
}

export const AlarmBannerToast: React.FC<AlarmBannerToastProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  const handleComplete = () => {
    store.toggleTaskCompleted(alert.id);
    onDismiss();
  };

  return (
    <div
      className="fixed top-4 inset-x-4 max-w-md mx-auto z-50 animate-in slide-in-from-top-4 duration-200"
      dir="rtl"
    >
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-4 shadow-2xl border border-amber-400/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center shrink-0 shadow-xs animate-bounce">
            <BellRing size={20} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-amber-300">یادآوری کار</span>
              {alert.dueTime && (
                <span className="text-[10px] text-stone-400 font-mono">({alert.dueTime})</span>
              )}
            </div>
            <h4 className="text-xs sm:text-sm font-bold truncate text-white mt-0.5">
              {alert.title}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleComplete}
            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
            title="انجام شد"
          >
            <Check size={14} />
            <span className="hidden sm:inline">انجام شد</span>
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="p-1.5 text-stone-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            title="بستن"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
