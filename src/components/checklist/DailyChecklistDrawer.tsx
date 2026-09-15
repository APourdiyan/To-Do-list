import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getTodayJalali,
  formatJalaliDate,
  toPersianDigits,
} from '../../lib/date/jalali';
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  HeartHandshake,
  Briefcase,
  BookOpen,
  GraduationCap,
  Dumbbell,
  Compass,
  ArrowRight,
} from 'lucide-react';

interface DailyChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DOMAIN_CONFIG: Record<
  string,
  { title: string; color: string; bgLight: string; icon: React.ReactNode }
> = {
  spiritual: {
    title: '۱. برنامه معنوی',
    color: 'text-emerald-800 border-emerald-300',
    bgLight: 'bg-emerald-50/70',
    icon: <HeartHandshake size={16} className="text-emerald-700" />,
  },
  career: {
    title: '۲. برنامه تخصصی و شغلی',
    color: 'text-blue-800 border-blue-300',
    bgLight: 'bg-blue-50/70',
    icon: <Briefcase size={16} className="text-blue-700" />,
  },
  study: {
    title: '۳. برنامه مطالعاتی',
    color: 'text-amber-900 border-amber-300',
    bgLight: 'bg-amber-50/70',
    icon: <BookOpen size={16} className="text-amber-800" />,
  },
  skills: {
    title: '۴. برنامه مهارت‌های فردی',
    color: 'text-purple-800 border-purple-300',
    bgLight: 'bg-purple-50/70',
    icon: <GraduationCap size={16} className="text-purple-700" />,
  },
  exercise: {
    title: '۵. برنامه ورزشی و تندرستی',
    color: 'text-rose-800 border-rose-300',
    bgLight: 'bg-rose-50/70',
    icon: <Dumbbell size={16} className="text-rose-700" />,
  },
  general: {
    title: '۶. کارهای آزاد و روزمره',
    color: 'text-stone-800 border-stone-300',
    bgLight: 'bg-stone-100/80',
    icon: <Compass size={16} className="text-stone-700" />,
  },
};

export const DailyChecklistDrawer: React.FC<DailyChecklistDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const { checklistItems, checklistLogs, selectedDate } = useStore();
  const today = getTodayJalali();
  const currentDate = selectedDate || today.dateStr;

  const completedItemIds = checklistLogs[currentDate] || [];

  // فرم افزودن آیتم جدید
  const [addingDomain, setAddingDomain] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  if (!isOpen) return null;

  const totalCount = checklistItems.length;
  const completedCount = completedItemIds.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const formattedDate = formatJalaliDate(currentDate, {
    showWeekday: true,
    showMonthName: true,
    showYear: true,
  });

  const handleAddItem = (domainId: string) => {
    if (!newTitle.trim()) return;
    store.addDailyChecklistItem({
      domainId,
      title: newTitle.trim(),
    });
    setNewTitle('');
    setAddingDomain(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs transition-opacity select-none">
      {/* زمینه برای بستن */}
      <div className="flex-1" onClick={onClose} />

      {/* پنل کشویی (Drawer) */}
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col overflow-hidden border-r border-stone-200"
        dir="rtl"
      >
        {/* سربرگ کشو */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#fdfcf9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                چک‌لیست ۶ حوزه بنیادین
              </h2>
              <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                وظایف روزانه
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{formattedDate}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="بستن"
          >
            <X size={20} />
          </button>
        </div>

        {/* نوار پیشرفت کل چک‌لیست روز */}
        <div className="p-4 bg-stone-50 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-stone-700">تعهدات انجام‌شده امروز:</span>
            <span className="text-amber-900 font-mono">
              {toPersianDigits(completedCount)} از {toPersianDigits(totalCount)} (
              {toPersianDigits(progressPercent)}٪)
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* لیست دسته‌بندی‌شده ۶ حوزه بنیادین */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {Object.entries(DOMAIN_CONFIG).map(([domainId, conf]) => {
            const domainItems = checklistItems.filter((it) => it.domainId === domainId);
            const domainCompleted = domainItems.filter((it) =>
              completedItemIds.includes(it.id)
            ).length;

            return (
              <div
                key={domainId}
                className={`rounded-2xl border ${conf.bgLight} border-stone-200/80 p-3.5 transition-all shadow-2xs`}
              >
                {/* عنوان حوزه */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white shadow-xs">
                      {conf.icon}
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      {conf.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-white/80 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
                    {toPersianDigits(domainCompleted)}/{toPersianDigits(domainItems.length)}
                  </span>
                </div>

                {/* آیتم‌های حوزه */}
                <div className="space-y-1.5">
                  {domainItems.map((item) => {
                    const isDone = completedItemIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => store.toggleDailyChecklistItem(currentDate, item.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer select-none ${
                          isDone
                            ? 'bg-white/90 border-emerald-200 text-stone-900 shadow-2xs'
                            : 'bg-white/60 hover:bg-white border-transparent text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <button
                            type="button"
                            className="shrink-0 text-stone-400 focus:outline-none"
                          >
                            {isDone ? (
                              <CheckCircle2 size={18} className="text-emerald-600" />
                            ) : (
                              <Circle size={18} className="text-stone-300" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-xs font-semibold block truncate ${
                                isDone ? 'line-through text-stone-400' : 'text-stone-900'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-[10px] text-stone-400 block truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            store.deleteDailyChecklistItem(item.id);
                          }}
                          className="text-stone-300 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* فرم افزودن آیتم به این حوزه */}
                {addingDomain === domainId ? (
                  <div className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(domainId)}
                      placeholder="عنوان وظیفه ثابت روزانه..."
                      autoFocus
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      onClick={() => handleAddItem(domainId)}
                      className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl cursor-pointer"
                    >
                      ثبت
                    </button>
                    <button
                      onClick={() => setAddingDomain(null)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingDomain(domainId);
                      setNewTitle('');
                    }}
                    className="w-full mt-2 py-1.5 px-2 text-[11px] font-bold text-stone-600 hover:text-stone-900 hover:bg-white/80 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-dashed border-stone-200"
                  >
                    <Plus size={13} />
                    <span>افزودن کار روزانه به {conf.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* پاورقی کشو */}
        <div className="p-4 border-t border-stone-100 bg-[#fdfcf9] flex items-center justify-between text-xs text-stone-500">
          <span>این چک‌لیست هر روز به صورت خودکار تکرار می‌شود.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 rounded-xl cursor-pointer hover:bg-amber-300"
          >
            تأیید
          </button>
        </div>
      </div>
    </div>
  );
};
