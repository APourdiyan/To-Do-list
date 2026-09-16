import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { DomainGroup } from '../../types';
import { DOMAIN_PRESETS } from '../../data/domainPresets';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
  Briefcase,
  GraduationCap,
  Heart,
  Activity,
  BookOpen,
  Coffee,
  Code,
  Music,
  Palette,
  DollarSign,
  Dumbbell,
  Home,
  Users,
  LayoutGrid,
  CheckCircle2,
  Layers,
} from 'lucide-react';

const ICON_OPTIONS = [
  { key: 'Briefcase', label: 'کار و حرفه', icon: Briefcase },
  { key: 'GraduationCap', label: 'آموزش و تحصیل', icon: GraduationCap },
  { key: 'BookOpen', label: 'مطالعه و کتاب', icon: BookOpen },
  { key: 'Activity', label: 'ورزش و تحرک', icon: Activity },
  { key: 'Dumbbell', label: 'تناسب اندام', icon: Dumbbell },
  { key: 'Heart', label: 'شخصی و سلامت', icon: Heart },
  { key: 'Sparkles', label: 'معنویت و رشد', icon: Sparkles },
  { key: 'Coffee', label: 'روزمره و استراحت', icon: Coffee },
  { key: 'Code', label: 'توسعه و فناوری', icon: Code },
  { key: 'DollarSign', label: 'مالی و سرمایه', icon: DollarSign },
  { key: 'Users', label: 'خانواده و روابط', icon: Users },
  { key: 'Palette', label: 'هنر و خلاقیت', icon: Palette },
  { key: 'Music', label: 'موسیقی و نوا', icon: Music },
  { key: 'Home', label: 'منزل و خانه', icon: Home },
];

const COLOR_PALETTE = [
  { hex: '#0284c7', label: 'آبی اقیانوسی' },
  { hex: '#0d9488', label: 'سبزآبی فیروزه‌ای' },
  { hex: '#16a34a', label: 'سبز زمردی' },
  { hex: '#7c3aed', label: 'بنفش آمتیست' },
  { hex: '#b45309', label: 'کهربایی برنز' },
  { hex: '#e11d48', label: 'رز متین' },
  { hex: '#d97706', label: 'زعفرانی گرم' },
  { hex: '#4f46e5', label: 'نیلی کبالت' },
  { hex: '#475569', label: 'خاکستری سنگی' },
];

export const ManageDomainsModal: React.FC = () => {
  const { domainGroups, manageDomainsModalOpen, settings } = useStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formColor, setFormColor] = useState(COLOR_PALETTE[0].hex);
  const [formIcon, setFormIcon] = useState('Briefcase');

  if (!manageDomainsModalOpen) return null;

  const handleClose = () => {
    store.setManageDomainsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormTitle('');
    setFormSubtitle('');
    setFormColor(COLOR_PALETTE[0].hex);
    setFormIcon('Briefcase');
  };

  const startEdit = (domain: DomainGroup) => {
    setEditingId(domain.id);
    setIsAdding(false);
    setFormTitle(domain.title);
    setFormSubtitle(domain.subtitle || '');
    setFormColor(domain.color);
    setFormIcon(domain.icon);
  };

  const startAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingId) {
      store.updateDomainGroup(editingId, {
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        color: formColor,
        icon: formIcon,
      });
    } else {
      store.addDomainGroup({
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || undefined,
        color: formColor,
        icon: formIcon,
      });
    }
    resetForm();
  };

  const handleDelete = (id: string, title: string) => {
    if (domainGroups.length <= 1) {
      alert('حداقل باید یک حوزه یا بعد در برنامه تعریف شده باشد.');
      return;
    }
    if (confirm(`آیا از حذف بعد «${title}» مطمئن هستید؟`)) {
      store.deleteDomainGroup(id);
      if (editingId === id) resetForm();
    }
  };

  const handleSelectPreset = (presetId: string) => {
    const preset = DOMAIN_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    if (confirm(`آیا می‌خواهید ابعاد برنامه را به «${preset.name}» تغییر دهید؟`)) {
      store.resetDomainGroupsToPreset(presetId);
      resetForm();
    }
  };

  const renderIcon = (iconName: string, size = 16, color?: string) => {
    const found = ICON_OPTIONS.find((i) => i.key === iconName);
    const IconComponent = found ? found.icon : LayoutGrid;
    return <IconComponent size={size} style={{ color: color || 'currentColor' }} />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-right"
        dir="rtl"
      >
        {/* هدر مدال */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                شخصی‌سازی ابعاد و حوزه‌های زندگی
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                ابعاد زندگی اختیاری هستند و می‌توانید متناسب با نقش‌های خود آن‌ها را بسازید یا تغییر دهید
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors cursor-pointer"
            aria-label="بستن"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* گزینه کلیدی: تنظیم به عنوان پیش‌فرض صفحه اصلی */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
                <LayoutGrid size={16} className="text-amber-700" />
                <span>نمایش ابعاد زندگی به عنوان نمای پیش‌فرض صفحه اصلی</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-relaxed max-w-lg">
                به‌طور پیش‌فرض، برنامه روی <strong>لیست استاندارد اولویت‌ها</strong> تنظیم است. با فعال کردن این گزینه، صفحه اصلی شما مستقیماً بر مبنای حوزه‌های اختصاصی بالا باز خواهد شد.
              </p>
            </div>

            <button
              type="button"
              onClick={() => store.updateSettings({ lifeDomainsMode: !settings.lifeDomainsMode })}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto ${
                settings.lifeDomainsMode
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {settings.lifeDomainsMode ? (
                <>
                  <Check size={14} />
                  <span>حالت پیش‌فرض است</span>
                </>
              ) : (
                <span>فعال‌سازی پیش‌فرض</span>
              )}
            </button>
          </div>

          {/* قالب‌های آماده و سریع (Presets) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-600" />
                <span>الگوهای پیشنهادی و سریع:</span>
              </label>
              <span className="text-[11px] text-stone-400">
                می‌توانید با یک کلیک از الگوهای متداول استفاده کنید
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {DOMAIN_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.id)}
                  className="p-3 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-right transition-all group cursor-pointer space-y-1"
                >
                  <div className="text-xs font-bold text-stone-900 group-hover:text-amber-950 flex items-center justify-between">
                    <span>{preset.name}</span>
                    <span className="text-[10px] font-mono font-normal text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded">
                      {preset.domains.length} بعد
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* فرم افزودن یا ویرایش بعد */}
          {(isAdding || editingId) && (
            <form
              onSubmit={handleSave}
              className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 sm:p-5 space-y-4 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between border-b border-stone-200/70 pb-2">
                <h4 className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-1.5">
                  <Edit2 size={14} className="text-amber-600" />
                  <span>{editingId ? 'ویرایش بعد زندگی' : 'افزودن بعد یا حوزه جدید'}</span>
                </h4>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                >
                  انصراف
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    عنوان حوزه یا بعد <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="مثلاً: کار و حرفه، خانواده، پروژه‌ها، ورزش..."
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700">
                    توضیح کوتاه / اهداف کلیدی
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="مثلاً: مسئولیت‌های شغلی و مشتریان"
                    className="w-full px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400 text-stone-700"
                  />
                </div>
              </div>

              {/* انتخاب آیکون */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">انتخاب نماد و آیکون:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ICON_OPTIONS.map((item) => {
                    const IconComp = item.icon;
                    const isSelected = formIcon === item.key;
                    return (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setFormIcon(item.key)}
                        title={item.label}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-2xs'
                            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                        }`}
                      >
                        <IconComp size={15} />
                        <span className="text-[11px] hidden sm:inline">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* انتخاب رنگ شاخص */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">انتخاب رنگ تم:</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {COLOR_PALETTE.map((c) => {
                    const isSelected = formColor === c.hex;
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => setFormColor(c.hex)}
                        title={c.label}
                        className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                          isSelected ? 'scale-115 border-stone-900 shadow-xs' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <Check size={13} className="text-white stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-100 text-xs text-stone-700 transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-stone-950 text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Check size={14} />
                  <span>{editingId ? 'ثبت ویرایش' : 'ذخیره این بعد'}</span>
                </button>
              </div>
            </form>
          )}

          {/* لیست ابعاد فعلی */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <LayoutGrid size={15} className="text-stone-700" />
                <span>ابعاد تعریف‌شده شما ({domainGroups.length} حوزه):</span>
              </h3>

              {!isAdding && !editingId && (
                <button
                  type="button"
                  onClick={startAdd}
                  className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200/80 px-2.5 py-1 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus size={14} />
                  <span>+ افزودن بعد جدید</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {domainGroups.map((group) => {
                return (
                  <div
                    key={group.id}
                    className="p-3.5 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${group.color}15`,
                          color: group.color,
                        }}
                      >
                        {renderIcon(group.icon, 18, group.color)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                          {group.title}
                        </div>
                        {group.subtitle && (
                          <div className="text-[11px] text-stone-500 truncate">
                            {group.subtitle}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => startEdit(group)}
                        className="p-1.5 text-stone-400 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                        title="ویرایش این بعد"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(group.id, group.title)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="حذف این بعد"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* فوتر مدال */}
        <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => handleSelectPreset('four_pillars')}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>بازنشانی به الگوی پیشنهادی ۴ گانه</span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 font-bold cursor-pointer"
          >
            بستن و بازگشت
          </button>
        </div>
      </div>
    </div>
  );
};
