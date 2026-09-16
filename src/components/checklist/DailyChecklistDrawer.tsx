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
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  HeartHandshake,
  Briefcase,
  BookOpen,
  GraduationCap,
  Dumbbell,
  Compass,
  FolderEdit,
  Tag,
  Palette,
  CheckCheck,
} from 'lucide-react';
import { DailyChecklistCategory, DailyChecklistItem } from '../../types';

interface DailyChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  HeartHandshake: <HeartHandshake size={16} />,
  Briefcase: <Briefcase size={16} />,
  BookOpen: <BookOpen size={16} />,
  GraduationCap: <GraduationCap size={16} />,
  Dumbbell: <Dumbbell size={16} />,
  Compass: <Compass size={16} />,
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
  const { checklistCategories, checklistItems, checklistLogs, selectedDate } = useStore();
  const today = getTodayJalali();
  const currentDate = selectedDate || today.dateStr;
  const completedItemIds = checklistLogs[currentDate] || [];

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

  const handleSaveCategoryTitle = (catId: string) => {
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
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-xs transition-opacity select-none">
      {/* زمینه برای بستن */}
      <div className="flex-1" onClick={onClose} />

      {/* پنل کشویی (Drawer) */}
      <div
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden border-r border-stone-200"
        dir="rtl"
      >
        {/* سربرگ کشو */}
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-[#fdfcf9] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                چک‌لیست روزانه و روتین‌ها
              </h2>
              <span className="text-[10px] font-bold bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full">
                کارهای روزانه ثابت
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">{formattedDate}</p>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsManagingCategories(!isManagingCategories)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                isManagingCategories
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
              title="تغییر دسته‌بندی‌ها و عناوین"
            >
              <FolderEdit size={14} />
              <span>{isManagingCategories ? 'اتمام ویرایش دسته‌ها' : 'ویرایش دسته‌بندی‌ها'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
              title="بستن"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* جعبه مدیریت دسته‌بندی‌ها در صورت فعال بودن */}
        {isManagingCategories && (
          <div className="p-4 bg-amber-50/70 border-b border-amber-200/80 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <FolderEdit size={16} className="text-amber-800" />
                <span>مدیریت دسته‌بندی‌های چک‌لیست:</span>
              </div>
              <button
                type="button"
                onClick={() => store.resetDailyChecklistToDefault()}
                className="text-[11px] text-amber-900 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} />
                <span>بازنشانی به ۶ حوزه پیش‌فرض</span>
              </button>
            </div>

            <p className="text-[11px] text-amber-900/90 leading-relaxed">
              می‌توانید عنوان هر دسته را تغییر داده یا دسته‌بندی جدیدی بسازید. عناوین آیتم‌ها را نیز در پایین با زدن روی علامت مداد ویرایش کنید.
            </p>

            {/* لیست دسته‌ها برای تغییر نام یا حذف */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {checklistCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-stone-200 text-xs shadow-2xs"
                >
                  {editingCatId === cat.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingCatTitle}
                        onChange={(e) => setEditingCatTitle(e.target.value)}
                        className="flex-1 px-2.5 py-1 text-xs border border-stone-300 rounded-lg focus:outline-hidden focus:border-stone-800"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveCategoryTitle(cat.id)}
                        className="px-2 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold"
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCatId(null)}
                        className="p-1 text-stone-400 hover:text-stone-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: cat.color }}
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
                          className="p-1 text-stone-400 hover:text-stone-900 rounded transition-colors"
                          title="تغییر نام دسته"
                        >
                          <Edit2 size={13} />
                        </button>
                        {checklistCategories.length > 1 && (
                          <button
                            type="button"
                            onClick={() => store.deleteDailyChecklistCategory(cat.id)}
                            className="p-1 text-stone-300 hover:text-rose-600 rounded transition-colors"
                            title="حذف این دسته"
                          >
                            <Trash2 size={13} />
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
              <form onSubmit={handleCreateCategory} className="pt-2 border-t border-amber-200 flex flex-col gap-2">
                <input
                  type="text"
                  value={newCatTitle}
                  onChange={(e) => setNewCatTitle(e.target.value)}
                  placeholder="نام دسته‌بندی جدید (مثلاً: خانواده، مطالعه تخصصی...)"
                  className="w-full text-xs px-2.5 py-1.5 bg-white rounded-xl border border-stone-300 focus:outline-hidden"
                  autoFocus
                />
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {COLOR_PRESETS.map((p) => (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => setNewCatColor(p.color)}
                        className={`w-5 h-5 rounded-full border transition-all ${
                          newCatColor === p.color ? 'ring-2 ring-stone-900 scale-110' : 'opacity-80'
                        }`}
                        style={{ backgroundColor: p.color }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="submit"
                      className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold"
                    >
                      افزودن دسته
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(false)}
                      className="p-1 text-stone-500 hover:text-stone-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingNewCat(true)}
                className="w-full py-1.5 bg-white border border-stone-300 hover:bg-stone-50 rounded-xl text-xs font-bold text-stone-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={13} />
                <span>ایجاد دسته‌بندی جدید</span>
              </button>
            )}
          </div>
        )}

        {/* نوار پیشرفت کل چک‌لیست روز */}
        <div className="p-4 bg-stone-50 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-stone-700">موارد انجام‌شده امروز:</span>
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

        {/* لیست دسته‌بندی‌شده کارهای روزانه */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {checklistCategories.map((cat) => {
            const domainItems = checklistItems.filter((it) => it.domainId === cat.id);
            const domainCompleted = domainItems.filter((it) =>
              completedItemIds.includes(it.id)
            ).length;

            const iconNode = cat.iconName && CATEGORY_ICONS[cat.iconName] ? CATEGORY_ICONS[cat.iconName] : <Compass size={16} />;

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
                  <span className="text-[10px] font-bold font-mono bg-white/80 text-stone-700 px-2 py-0.5 rounded-full border border-stone-200">
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
                          className="p-2.5 rounded-xl border border-stone-300 bg-white space-y-2 shadow-xs animate-in fade-in"
                        >
                          <input
                            type="text"
                            value={editItemTitle}
                            onChange={(e) => setEditItemTitle(e.target.value)}
                            placeholder="عنوان روتین روزانه..."
                            className="w-full text-xs font-semibold px-2.5 py-1.5 bg-stone-50 rounded-lg border border-stone-200 focus:outline-hidden focus:bg-white"
                            autoFocus
                          />
                          <input
                            type="text"
                            value={editItemDesc}
                            onChange={(e) => setEditItemDesc(e.target.value)}
                            placeholder="توضیح اختیاری..."
                            className="w-full text-[11px] px-2.5 py-1 bg-stone-50 rounded-lg border border-stone-200 focus:outline-hidden focus:bg-white"
                          />
                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => handleSaveItemEdit(item.id)}
                              className="px-3 py-1 bg-stone-900 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check size={12} />
                              <span>ذخیره تغییرات</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItemId(null)}
                              className="px-2 py-1 text-stone-500 hover:text-stone-800 text-xs cursor-pointer"
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
                            : 'bg-white/70 hover:bg-white border-stone-200/50 hover:border-stone-300 text-stone-700'
                        }`}
                      >
                        <div
                          onClick={() => store.toggleDailyChecklistItem(currentDate, item.id)}
                          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                        >
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

                        {/* دکمه‌های ویرایش عنوان و حذف */}
                        <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={() => handleStartEditItem(item)}
                            className="p-1 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors cursor-pointer"
                            title="ویرایش عنوان این کار"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => store.deleteDailyChecklistItem(item.id)}
                            className="p-1 text-stone-300 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                            title="حذف"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* فرم افزودن آیتم به این دسته */}
                {addingDomain === cat.id ? (
                  <div className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddItem(cat.id)}
                      placeholder="عنوان کار ثابت روزانه..."
                      autoFocus
                      className="flex-1 text-xs px-2.5 py-1.5 bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddItem(cat.id)}
                      className="px-3 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl cursor-pointer"
                    >
                      ثبت
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddingDomain(null)}
                      className="p-1.5 text-stone-400 hover:text-stone-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingDomain(cat.id);
                      setNewTitle('');
                    }}
                    className="w-full mt-2 py-1.5 px-2 text-[11px] font-bold text-stone-600 hover:text-stone-900 hover:bg-white/80 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer border border-dashed border-stone-200"
                  >
                    <Plus size={13} />
                    <span>افزودن کار روزانه به {cat.title.replace(/^\d+\.\s*/, '')}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* راهنمای محل کارهای روزانه و تایید */}
        <div className="p-3.5 border-t border-stone-100 bg-[#fdfcf9] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-stone-500">
              این کارهای روزانه هر روز به صورت خودکار تکرار می‌شوند.
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 rounded-xl cursor-pointer hover:bg-amber-300 transition-colors"
            >
              بستن و ذخیره
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
