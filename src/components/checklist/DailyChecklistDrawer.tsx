import React, { useState, useEffect, useRef } from 'react';
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
  Edit2,
  Check,
  RotateCcw,
  HeartHandshake,
  Briefcase,
  BookOpen,
  GraduationCap,
  Dumbbell,
  Compass,
  FolderEdit,
} from 'lucide-react';
import { DailyChecklistItem } from '../../types';

interface DailyChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  HeartHandshake: <HeartHandshake size={16} aria-hidden="true" />,
  Briefcase: <Briefcase size={16} aria-hidden="true" />,
  BookOpen: <BookOpen size={16} aria-hidden="true" />,
  GraduationCap: <GraduationCap size={16} aria-hidden="true" />,
  Dumbbell: <Dumbbell size={16} aria-hidden="true" />,
  Compass: <Compass size={16} aria-hidden="true" />,
};

const COLOR_PRESETS = [
  { name: 'زمردی', color: '#047857', bg: 'bg-emerald-50/80' },
  { name: 'آبی', color: '#1d4ed8', bg: 'bg-blue-50/80' },
  { name: 'کهربایی', color: '#b45309', bg: 'bg-amber-50/80' },
  { name: 'بنفش', color: '#7e22ce', bg: 'bg-purple-50/80' },
  { name: 'یاقوتی', color: '#be123c', bg: 'bg-rose-50/80' },
  { name: 'دودی', color: '#44403c', bg: 'bg-stone-100/80' },
  { name: 'فیروزه‌ای', color: '#0f766e', bg: 'bg-teal-50/80' },
  { name: 'نیلی', color: '#4338ca', bg: 'bg-indigo-50/80' },
];

export const DailyChecklistDrawer: React.FC<DailyChecklistDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  const checklistCategories = useStore((s) => s.checklistCategories);
  const checklistItems = useStore((s) => s.checklistItems);
  const checklistLogs = useStore((s) => s.checklistLogs);
  const selectedDate = useStore((s) => s.selectedDate);

  const today = getTodayJalali();
  const currentDate = selectedDate || today.dateStr;
  const completedItemIds = checklistLogs[currentDate] || [];

  const drawerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // وضعیت حالت ویرایش دسته‌بندی‌ها
  const [isManagingCategories, setIsManagingCategories] = useState(false);

  // فرم افزودن آیتم جدید به یک دسته‌بندی
  const [addingDomain, setAddingDomain] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  // ویرایش سریع عنوان یک آیتم
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemTitle, setEditItemTitle] = useState('');
  const [editItemDesc, setEditItemDesc] = useState('');

  // فرم افزودن دسته جدید
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PRESETS[0].color);

  // ویرایش عنوان یک دسته‌بندی
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatTitle, setEditingCatTitle] = useState('');

  // مدیریت فوکوس و کلید Escape
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // فوکوس بر روی اولین عنصر قابل دسترسی
    const timer = setTimeout(() => {
      if (drawerRef.current) {
        const firstFocusable = drawerRef.current.querySelector<HTMLElement>(
          'button, input, select, textarea'
        );
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

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

  const handleSaveItemEdit = (itemId: string) => {
    if (!editItemTitle.trim()) return;
    store.updateDailyChecklistItem(itemId, {
      title: editItemTitle.trim(),
      description: editItemDesc.trim() || undefined,
    });
    setEditingItemId(null);
  };

  const handleStartEditItem = (item: DailyChecklistItem) => {
    setEditingItemId(item.id);
    setEditItemTitle(item.title);
    setEditItemDesc(item.description || '');
  };

  const handleSaveCatEdit = (catId: string) => {
    if (!editingCatTitle.trim()) return;
    store.updateDailyChecklistCategory(catId, {
      title: editingCatTitle.trim(),
    });
    setEditingCatId(null);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;
    const matchedPreset = COLOR_PRESETS.find((p) => p.color === newCatColor) || COLOR_PRESETS[0];
    store.addDailyChecklistCategory({
      title: newCatTitle.trim(),
      color: matchedPreset.color,
      bgLight: matchedPreset.bg,
      iconName: 'Compass',
    });
    setNewCatTitle('');
    setIsAddingNewCat(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checklist-drawer-title"
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs transition-opacity select-none"
    >
      {/* زمینه برای بستن */}
      <div
        className="flex-1"
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      {/* پنل کشویی (Drawer) */}
      <div
        ref={drawerRef}
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden border-r border-stone-200"
        dir="rtl"
      >
        {/* سربرگ کشو */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#fdfcf9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 id="checklist-drawer-title" className="text-base sm:text-lg font-extrabold text-stone-900">
                چک‌لیست روزانه و روتین‌ها
              </h2>
              <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                کارهای روزانه ثابت
              </span>
            </div>
            <p className="text-xs text-stone-600 font-medium mt-0.5">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsManagingCategories(!isManagingCategories)}
              className={`min-h-11 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                isManagingCategories
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="تغییر دسته‌بندی‌ها و عناوین"
              aria-label={isManagingCategories ? 'اتمام ویرایش دسته‌ها' : 'ویرایش دسته‌بندی‌ها'}
            >
              <FolderEdit size={16} aria-hidden="true" />
              <span>{isManagingCategories ? 'اتمام ویرایش' : 'ویرایش دسته‌ها'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              aria-label="بستن چک‌لیست"
              title="بستن"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* جعبه مدیریت دسته‌بندی‌ها در صورت فعال بودن */}
        {isManagingCategories && (
          <div className="p-4 bg-amber-50/80 border-b border-amber-200/90 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <FolderEdit size={16} className="text-amber-800" aria-hidden="true" />
                <span>مدیریت دسته‌بندی‌های چک‌لیست:</span>
              </div>
              <button
                type="button"
                onClick={() => store.resetDailyChecklistToDefault()}
                className="text-[11px] text-amber-950 font-bold hover:underline flex items-center gap-1 cursor-pointer min-h-11 py-2 px-1 focus:outline-none focus:ring-2 focus:ring-amber-900/60 rounded"
              >
                <RotateCcw size={13} aria-hidden="true" />
                <span>بازنشانی به ۶ حوزه پیش‌فرض</span>
              </button>
            </div>

            <p className="text-xs text-amber-950 leading-relaxed font-medium">
              می‌توانید عنوان هر دسته را تغییر داده یا دسته‌بندی جدیدی بسازید. عناوین آیتم‌ها را نیز در پایین با زدن روی علامت مداد ویرایش کنید.
            </p>

            {/* لیست دسته‌ها برای تغییر نام یا حذف */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {checklistCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs"
                >
                  {editingCatId === cat.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingCatTitle}
                        onChange={(e) => setEditingCatTitle(e.target.value)}
                        className="flex-1 text-xs px-2 py-1.5 bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveCatEdit(cat.id)}
                        className="min-h-11 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        aria-label="ذخیره عنوان دسته"
                      >
                        <Check size={14} aria-hidden="true" />
                        <span>ذخیره</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="min-h-11 px-2.5 py-1.5 text-stone-600 hover:text-stone-900 text-xs"
                      >
                        انصراف
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
                          aria-hidden="true"
                        />
                        <span className="font-bold text-stone-900 truncate">{cat.title}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCatId(cat.id);
                            setEditingCatTitle(cat.title);
                          }}
                          className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-900 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                          title="تغییر نام دسته"
                          aria-label={`تغییر نام دسته ${cat.title}`}
                        >
                          <Edit2 size={15} aria-hidden="true" />
                        </button>
                        {checklistCategories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => store.deleteDailyChecklistCategory(cat.id)}
                            className="min-w-11 min-h-11 flex items-center justify-center text-stone-400 hover:text-rose-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-rose-600/70"
                            title="حذف این دسته"
                            aria-label={`حذف دسته ${cat.title}`}
                          >
                            <Trash2 size={15} aria-hidden="true" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* فرم افزودن دسته جدید */}
            {isAddingNewCat ? (
              <form onSubmit={handleCreateCategory} className="pt-2 border-t border-amber-200 flex flex-col gap-2.5">
                <input
                  type="text"
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  placeholder="نام دسته‌بندی جدید (مثلاً: خانواده، مطالعه تخصصی...)"
                  className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setNewCatColor(p.color)}
                        aria-label={`رنگ ${p.name}`}
                        className={`w-6 h-6 rounded-full border transition-all ${
                          newCatColor === p.color ? 'ring-2 ring-stone-900 scale-110' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: p.color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="submit"
                      className="min-h-11 px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                    >
                      افزودن دسته
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(false)}
                      className="min-w-11 min-h-11 flex items-center justify-center text-stone-600 hover:text-stone-900"
                      aria-label="لغو افزودن دسته"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingNewCat(true)}
                className="w-full min-h-11 py-2 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <Plus size={15} aria-hidden="true" />
                <span>ایجاد دسته‌بندی جدید</span>
              </button>
            )}
          </div>
        )}

        {/* نوار پیشرفت کل چک‌لیست روز */}
        <div className="p-4 bg-stone-50 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-stone-800">موارد انجام‌شده امروز:</span>
            <span className="text-amber-900 font-mono font-black">
              {toPersianDigits(completedCount)} از {toPersianDigits(totalCount)} (
              {toPersianDigits(progressPercent)}٪)
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="درصد تکمیل چک‌لیست امروز"
            className="w-full bg-stone-200 rounded-full h-2.5 overflow-hidden"
          >
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* لیست دسته‌بندی‌شده کارهای روزانه */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {checklistCategories.map((cat) => {
            const domainItems = checklistItems.filter((it) => it.domainId === cat.id);
            const domainCompleted = domainItems.filter((it) =>
              completedItemIds.includes(it.id)
            ).length;

            const iconNode = cat.iconName && CATEGORY_ICONS[cat.iconName] ? CATEGORY_ICONS[cat.iconName] : <Compass size={16} aria-hidden="true" />;

            return (
              <div
                key={cat.id}
                className={`rounded-2xl border ${cat.bgLight || 'bg-stone-50'} border-stone-200/80 p-3.5 transition-all shadow-2xs`}
              >
                {/* عنوان دسته */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="p-1.5 rounded-lg bg-white shadow-xs"
                      style={{ color: cat.color }}
                    >
                      {iconNode}
                    </div>
                    <span className="text-xs font-black text-stone-900">
                      {cat.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold font-mono bg-white text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
                    {toPersianDigits(domainCompleted)}/{toPersianDigits(domainItems.length)}
                  </span>
                </div>

                {/* آیتم‌های دسته */}
                <div className="space-y-1.5">
                  {domainItems.map((item) => {
                    const isDone = completedItemIds.includes(item.id);
                    const isEditing = editingItemId === item.id;

                    if (isEditing) {
                      return (
                        <div
                          key={item.id}
                          className="p-3 rounded-xl border border-stone-300 bg-white space-y-2.5 shadow-xs animate-in fade-in"
                        >
                          <input
                            type="text"
                            value={editItemTitle}
                            onChange={(e) => setEditItemTitle(e.target.value)}
                            placeholder="عنوان روتین روزانه..."
                            className="w-full text-xs font-semibold px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editItemDesc}
                            onChange={(e) => setEditItemDesc(e.target.value)}
                            placeholder="توضیح اختیاری..."
                            className="w-full text-[11px] px-3 py-1.5 bg-stone-50 rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                          />
                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveItemEdit(item.id)}
                              className="min-h-11 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                            >
                              <Check size={14} aria-hidden="true" />
                              <span>ذخیره تغییرات</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(null)}
                              className="min-h-11 px-3 py-2 text-stone-600 hover:text-stone-900 text-xs cursor-pointer"
                            >
                              انصراف
                            </button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all select-none group ${
                          isDone
                            ? 'bg-white/95 border-emerald-200 text-stone-900 shadow-2xs'
                            : 'bg-white/80 hover:bg-white border-stone-200 hover:border-stone-300 text-stone-800'
                        }`}
                      >
                        <div
                          role="checkbox"
                          aria-checked={isDone}
                          tabIndex={0}
                          aria-label={`${item.title} - ${isDone ? 'انجام شده' : 'انجام نشده'}`}
                          onKeyDown={(e) => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault();
                              store.toggleDailyChecklistItem(currentDate, item.id);
                            }
                          }}
                          onClick={() => store.toggleDailyChecklistItem(currentDate, item.id)}
                          className="flex items-center gap-2.5 flex-1 min-w-0 min-h-11 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 rounded-lg p-1"
                        >
                          <span className="shrink-0 text-stone-400">
                            {isDone ? (
                              <CheckCircle2 size={20} className="text-emerald-700" aria-hidden="true" />
                            ) : (
                              <Circle size={20} className="text-stone-400" aria-hidden="true" />
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <span
                              className={`text-xs font-semibold block truncate ${
                                isDone ? 'line-through text-stone-500' : 'text-stone-900'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-[10px] text-stone-500 block truncate">
                                {item.description}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* دکمه‌های ویرایش عنوان و حذف */}
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEditItem(item)}
                            className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                            title="ویرایش عنوان این کار"
                            aria-label={`ویرایش عنوان ${item.title}`}
                          >
                            <Edit2 size={14} aria-hidden="true" />
                          </button>
                          <button
                            type="button"
                            onClick={() => store.deleteDailyChecklistItem(item.id)}
                            className="min-w-11 min-h-11 flex items-center justify-center text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-600/70"
                            title="حذف"
                            aria-label={`حذف ${item.title}`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* فرم افزودن آیتم به این دسته */}
                {addingDomain === cat.id ? (
                  <div className="mt-2.5 flex gap-2">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(cat.id)}
                      placeholder="عنوان کار ثابت روزانه..."
                      autoFocus
                      className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(cat.id)}
                      className="min-h-11 px-4 py-2 text-xs font-bold bg-stone-900 text-white rounded-xl cursor-pointer hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                    >
                      ثبت
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingDomain(null)}
                      className="min-w-11 min-h-11 flex items-center justify-center text-stone-500 hover:text-stone-800 cursor-pointer"
                      aria-label="انصراف از افزودن کار"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingDomain(cat.id);
                      setNewTitle('');
                    }}
                    className="w-full min-h-11 mt-2 py-2 px-3 text-xs font-bold text-stone-700 hover:text-stone-950 hover:bg-white/90 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-dashed border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                  >
                    <Plus size={15} aria-hidden="true" />
                    <span>افزودن کار روزانه به {cat.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* راهنمای محل کارهای روزانه و تایید */}
        <div className="p-4 border-t border-stone-200 bg-[#fdfcf9] space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-stone-600 font-medium">
              این کارهای روزانه هر روز به صورت خودکار تکرار می‌شوند.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-5 py-2 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 rounded-xl cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-stone-800/70"
            >
              بستن و بازگشت
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
