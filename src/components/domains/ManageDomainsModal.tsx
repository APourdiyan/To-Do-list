import React, { useState } from 'react';
import { useStore, store } from '../../store/useStore';
import { DomainGroup } from '../../types';
import { DOMAIN_PRESETS } from '../../data/domainPresets';
import { Modal } from '../common/Modal';
import {
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
  const domainGroups = useStore((s) => s.domainGroups);
  const manageDomainsModalOpen = useStore((s) => s.manageDomainsModalOpen);
  const settings = useStore((s) => s.settings);

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
    return <IconComponent size={size} style={{ color: color || 'currentColor' }} aria-hidden="true" />;
  };

  return (
    <Modal
      id="manage-domains-modal"
      isOpen={manageDomainsModalOpen}
      onClose={handleClose}
      maxWidth="2xl"
      title="شخصی‌سازی ابعاد و حوزه‌های زندگی"
      subtitle="تعریف و دسته‌بندی حوزه‌های فردی، شغلی و خانوادگی متناسب با اولویت‌های شما"
    >
      <div className="p-4 sm:p-6 space-y-6">
        {/* گزینه کلیدی: تنظیم به عنوان پیش‌فرض صفحه اصلی */}
        <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-amber-950">
              <LayoutGrid size={17} className="text-amber-700" aria-hidden="true" />
              <span>نمایش ابعاد زندگی به عنوان نمای پیش‌فرض صفحه اصلی</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed max-w-lg font-medium">
              به‌طور پیش‌فرض، برنامه روی <strong>لیست استاندارد اولویت‌ها</strong> تنظیم است. با فعال کردن این گزینه، صفحه اصلی شما مستقیماً بر مبنای حوزه‌های اختصاصی بالا باز خواهد شد.
            </p>
          </div>

          <button
            type="button"
            onClick={() => store.updateSettings({ lifeDomainsMode: !settings.lifeDomainsMode })}
            className={`min-h-11 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 self-start sm:self-auto focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              settings.lifeDomainsMode
                ? 'bg-amber-500 text-stone-950 shadow-2xs font-black'
                : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-50'
            }`}
          >
            {settings.lifeDomainsMode ? (
              <>
                <Check size={15} aria-hidden="true" />
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
            <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
              <Sparkles size={15} className="text-amber-600" aria-hidden="true" />
              <span>الگوهای پیشنهادی و سریع:</span>
            </label>
            <span className="text-[11px] text-stone-500">
              می‌توانید با یک کلیک از الگوهای متداول استفاده کنید
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {DOMAIN_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.id)}
                className="p-3.5 rounded-2xl border border-stone-200 hover:border-amber-400 bg-white hover:bg-amber-50/40 text-right transition-all group cursor-pointer space-y-1 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <div className="text-xs font-bold text-stone-900 group-hover:text-amber-950 flex items-center justify-between">
                  <span>{preset.name}</span>
                  <span className="text-[10px] font-mono font-normal text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                    {preset.domains.length} بعد
                  </span>
                </div>
                <p className="text-[10px] text-stone-600 line-clamp-2 leading-relaxed font-medium">
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
                <Edit2 size={15} className="text-amber-600" aria-hidden="true" />
                <span>{editingId ? 'ویرایش بعد زندگی' : 'افزودن بعد یا حوزه جدید'}</span>
              </h4>
              <button
                type="button"
                onClick={resetForm}
                className="min-h-9 px-2 text-xs text-stone-600 hover:text-stone-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-800 rounded"
              >
                انصراف
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label htmlFor="domain-form-title" className="text-xs font-bold text-stone-700 block">
                  عنوان حوزه یا بعد <span className="text-rose-500">*</span>
                </label>
                <input
                  id="domain-form-title"
                  type="text"
                  required
                  maxLength={100}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثلاً: کار و حرفه، خانواده، پروژه‌ها، ورزش..."
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="domain-form-subtitle" className="text-xs font-bold text-stone-700 block">
                  توضیح کوتاه / اهداف کلیدی
                </label>
                <input
                  id="domain-form-subtitle"
                  type="text"
                  maxLength={150}
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="مثلاً: مسئولیت‌های شغلی و مشتریان"
                  className="w-full px-3 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-800 font-medium"
                />
              </div>
            </div>

            {/* انتخاب آیکون */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">انتخاب نماد و آیکون:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {ICON_OPTIONS.map((item) => {
                  const IconComp = item.icon;
                  const isSelected = formIcon === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setFormIcon(item.key)}
                      aria-label={`انتخاب آیکون ${item.label}`}
                      className={`min-h-10 p-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                        isSelected
                          ? 'bg-amber-100 border-amber-500 text-amber-950 font-bold shadow-2xs'
                          : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      <IconComp size={16} aria-hidden="true" />
                      <span className="text-[11px] hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* انتخاب رنگ شاخص */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-stone-700 block">انتخاب رنگ تم:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PALETTE.map((c) => {
                  const isSelected = formColor === c.hex;
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setFormColor(c.hex)}
                      aria-label={`رنگ ${c.label}`}
                      className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-stone-800 ${
                        isSelected ? 'scale-110 border-stone-950 shadow-xs' : 'border-transparent hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    >
                      {isSelected && <Check size={14} className="text-white stroke-[3]" aria-hidden="true" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={resetForm}
                className="min-h-10 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="min-h-10 px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 active:bg-amber-500 font-bold text-stone-950 text-xs shadow-xs transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <Check size={15} aria-hidden="true" />
                <span>{editingId ? 'ثبت ویرایش' : 'ذخیره این بعد'}</span>
              </button>
            </div>
          </form>
        )}

        {/* لیست ابعاد فعلی */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <LayoutGrid size={16} className="text-stone-700" aria-hidden="true" />
              <span>ابعاد تعریف‌شده شما ({domainGroups.length} حوزه):</span>
            </h3>

            {!isAdding && !editingId && (
              <button
                type="button"
                onClick={startAdd}
                className="min-h-10 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <Plus size={15} aria-hidden="true" />
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
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: `${group.color}15`,
                        color: group.color,
                      }}
                    >
                      {renderIcon(group.icon, 19, group.color)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                        {group.title}
                      </div>
                      {group.subtitle && (
                        <div className="text-[11px] text-stone-500 truncate font-medium">
                          {group.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(group)}
                      className="min-w-9 min-h-9 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800"
                      aria-label={`ویرایش بعد: ${group.title}`}
                    >
                      <Edit2 size={15} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(group.id, group.title)}
                      className="min-w-9 min-h-9 flex items-center justify-center text-stone-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800"
                      aria-label={`حذف بعد: ${group.title}`}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* فوتر مدال */}
      <div className="p-3.5 sm:p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => handleSelectPreset('four_pillars')}
          className="min-h-10 text-stone-600 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-stone-800/70 px-2 rounded-xl"
        >
          <RotateCcw size={14} aria-hidden="true" />
          <span>بازنشانی به الگوی پیشنهادی ۴ گانه</span>
        </button>

        <button
          type="button"
          onClick={handleClose}
          className="min-h-11 px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 active:bg-stone-950 text-stone-100 font-bold cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-stone-800/70"
        >
          بستن و بازگشت
        </button>
      </div>
    </Modal>
  );
};
