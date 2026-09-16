import React from 'react';
import { useStore, store } from '../../store/useStore';
import { AlertTriangle, X } from 'lucide-react';

export const StorageWarningBanner: React.FC = () => {
  const storageError = useStore((s) => s.storageError);

  if (!storageError) return null;

  return (
    <div
      id="storage-warning-banner"
      role="alert"
      aria-live="assertive"
      className="fixed top-3 left-4 right-4 sm:left-auto sm:right-6 max-w-lg z-50 animate-in fade-in slide-in-from-top-4 duration-200"
      dir="rtl"
    >
      <div className="bg-amber-950/95 border border-amber-500/60 text-amber-100 rounded-2xl p-3.5 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/40"
            aria-hidden="true"
          >
            <AlertTriangle size={18} />
          </div>
          <div className="min-w-0 text-xs leading-relaxed">
            <span className="font-bold text-amber-200 block text-xs">خطا در ذخیره‌سازی محلی</span>
            <p className="text-amber-100/90 text-[11px] truncate sm:whitespace-normal">
              {storageError}
            </p>
          </div>
        </div>

        <button
          id="storage-warning-dismiss-btn"
          type="button"
          onClick={() => store.dismissStorageError()}
          className="min-w-11 min-h-11 p-2 text-amber-300 hover:text-white hover:bg-amber-900/60 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="بستن هشدار خطای ذخیره‌سازی"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
