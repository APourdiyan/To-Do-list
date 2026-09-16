import React, { useState, useMemo } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getTodayJalali,
  formatJalaliDate,
  toPersianDigits,
  parseJalaliDate,
} from '../../lib/date/jalali';
import { DailyExpense, ExpenseCategory } from '../../types';
import { Modal } from '../common/Modal';
import {
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Receipt,
  Scale,
} from 'lucide-react';

interface DailyAccountingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ExpenseCategory, { label: string; color: string }> = {
  food: { label: 'خوراک و غذا', color: 'bg-emerald-100 text-emerald-800' },
  transport: { label: 'حمل‌ونقل و بنزین', color: 'bg-blue-100 text-blue-800' },
  home: { label: 'خانه و لوازم', color: 'bg-amber-100 text-amber-800' },
  education: { label: 'آموزش و کتاب', color: 'bg-purple-100 text-purple-800' },
  health: { label: 'سلامت و درمان', color: 'bg-rose-100 text-rose-800' },
  shopping: { label: 'خرید و پوشاک', color: 'bg-teal-100 text-teal-800' },
  bills: { label: 'قبوض و اقساط', color: 'bg-stone-200 text-stone-800' },
  other: { label: 'متفرقه', color: 'bg-stone-100 text-stone-700' },
};

export const DailyAccountingModal: React.FC<DailyAccountingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const dailyAccountings = useStore((s) => s.dailyAccountings);
  const dailyExpenses = useStore((s) => s.dailyExpenses);
  const selectedDate = useStore((s) => s.selectedDate);

  const today = getTodayJalali();
  const currentDate = selectedDate || today.dateStr;

  const [activeSubTab, setActiveSubTab] = useState<'accounting' | 'expenses'>('accounting');

  // داده‌های محاسبه اعمال امروز
  const accounting = dailyAccountings[currentDate] || {
    date: currentDate,
    goodDeeds: [],
    badDeeds: [],
    satisfactionScore: 7,
  };

  // ورودی‌های کار خوب و نیازمند اصلاح
  const [newGoodDeed, setNewGoodDeed] = useState('');
  const [newBadDeed, setNewBadDeed] = useState('');
  const [reflectionNote, setReflectionNote] = useState(accounting.reflectionNote || '');

  // ورودی‌های خرید جدید
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('food');

  const formattedDate = formatJalaliDate(currentDate, {
    showWeekday: true,
    showMonthName: true,
    showYear: true,
  });

  // مجموع مخارج امروز، هفته و ماه
  const { todayTotal, weekTotal, monthTotal, todayExpensesList } = useMemo(() => {
    const todayList = dailyExpenses.filter((e) => e.date === currentDate);
    const tTotal = todayList.reduce((sum, e) => sum + e.amount, 0);

    const parsedCurrent = parseJalaliDate(currentDate);

    // محاسبه مخارج ماه جاری
    let mTotal = 0;
    if (parsedCurrent) {
      mTotal = dailyExpenses
        .filter((e) => {
          const p = parseJalaliDate(e.date);
          return p && p.jy === parsedCurrent.jy && p.jm === parsedCurrent.jm;
        })
        .reduce((sum, e) => sum + e.amount, 0);
    }

    // مجموع کل هفته
    const wTotal = dailyExpenses.reduce((sum, e) => sum + e.amount, 0);

    return {
      todayTotal: tTotal,
      weekTotal: wTotal,
      monthTotal: mTotal,
      todayExpensesList: todayList,
    };
  }, [dailyExpenses, currentDate]);

  const handleAddGood = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newGoodDeed.trim();
    if (!trimmed) return;
    store.addGoodDeed(currentDate, trimmed);
    setNewGoodDeed('');
  };

  const handleAddBad = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBadDeed.trim();
    if (!trimmed) return;
    store.addBadDeed(currentDate, trimmed);
    setNewBadDeed('');
  };

  const handleSaveReflection = () => {
    store.updateDailyAccounting(currentDate, {
      reflectionNote: reflectionNote.trim(),
    });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(expenseAmount.replace(/,/g, ''), 10);
    const trimmedTitle = expenseTitle.trim();
    if (!trimmedTitle || isNaN(amountNum) || amountNum <= 0) return;

    store.addDailyExpense({
      date: currentDate,
      title: trimmedTitle,
      amount: amountNum,
      category: expenseCategory,
    });

    setExpenseTitle('');
    setExpenseAmount('');
  };

  return (
    <Modal
      id="daily-accounting-modal"
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      title={activeSubTab === 'accounting' ? 'مرور و ارزیابی روز' : 'هزینه‌ها و مخارج روزانه'}
      subtitle={formattedDate}
    >
      <div className="flex flex-col">
        {/* سوییچ بین ارزیابی روز و مخارج */}
        <div className="flex border-b border-stone-200 px-4 sm:px-5 pt-3 bg-stone-50/50 gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('accounting')}
            className={`min-h-11 flex items-center gap-1.5 pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeSubTab === 'accounting'
                ? 'border-amber-500 text-stone-950 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Scale size={16} aria-hidden="true" />
            <span>ارزیابی روز و عملکرد</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('expenses')}
            className={`min-h-11 flex items-center gap-1.5 pb-2 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeSubTab === 'expenses'
                ? 'border-amber-500 text-stone-950 font-black'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Receipt size={16} aria-hidden="true" />
            <span>هزینه‌ها و مخارج</span>
            {todayTotal > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                {toPersianDigits(todayTotal.toLocaleString('fa-IR'))}
              </span>
            )}
          </button>
        </div>

        {/* محتوای تب فعال */}
        <div className="p-4 sm:p-5 space-y-5">
          {activeSubTab === 'accounting' ? (
            <>
              {/* بخش کارهای مثبت و دستاوردها (+) */}
              <div className="bg-emerald-50/50 border border-emerald-200/90 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-xs">
                    <CheckCircle2 size={17} className="text-emerald-700" aria-hidden="true" />
                    <span>دستاوردهای مثبت و کارهای خوب (+)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    {toPersianDigits(accounting.goodDeeds.length)} مورد
                  </span>
                </div>

                {/* فرم افزودن کار خوب */}
                <form onSubmit={handleAddGood} className="flex gap-2 mb-3">
                  <label htmlFor="accounting-new-good" className="sr-only">
                    دستاورد مثبت جدید
                  </label>
                  <input
                    id="accounting-new-good"
                    type="text"
                    maxLength={200}
                    value={newGoodDeed}
                    onChange={(e) => setNewGoodDeed(e.target.value)}
                    placeholder="مثال: تمرکز کامل روی کار، پیاده‌روی، تماس با خانواده..."
                    className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900"
                  />
                  <button
                    type="submit"
                    className="min-h-10 px-3.5 py-2 text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  >
                    <Plus size={15} aria-hidden="true" />
                    <span>افزودن</span>
                  </button>
                </form>

                {/* لیست کارهای خوب ثبت شده */}
                {accounting.goodDeeds.length > 0 ? (
                  <ul className="space-y-1.5">
                    {accounting.goodDeeds.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-emerald-200/80 text-xs text-stone-800"
                      >
                        <span className="flex-1 font-medium">{item}</span>
                        <button
                          type="button"
                          onClick={() => store.removeGoodDeed(currentDate, idx)}
                          className="min-w-9 min-h-9 flex items-center justify-center text-stone-400 hover:text-rose-700 transition-colors cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                          aria-label={`حذف دستاورد: ${item}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-stone-500 text-center py-2">
                    هنوز موردی برای کارهای مثبت امروز ثبت نشده است.
                  </p>
                )}
              </div>

              {/* بخش چالش‌ها و نکات نیازمند بهبود (-) */}
              <div className="bg-rose-50/50 border border-rose-200/90 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-rose-950 font-bold text-xs">
                    <AlertCircle size={17} className="text-rose-700" aria-hidden="true" />
                    <span>چالش‌ها و نکات نیازمند بهبود (-)</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-900 bg-rose-100/90 px-2 py-0.5 rounded-full">
                    {toPersianDigits(accounting.badDeeds.length)} مورد
                  </span>
                </div>

                {/* فرم افزودن مورد اصلاحی */}
                <form onSubmit={handleAddBad} className="flex gap-2 mb-3">
                  <label htmlFor="accounting-new-bad" className="sr-only">
                    چالش یا نکته اصلاحی جدید
                  </label>
                  <input
                    id="accounting-new-bad"
                    type="text"
                    maxLength={200}
                    value={newBadDeed}
                    onChange={(e) => setNewBadDeed(e.target.value)}
                    placeholder="مثال: حواس‌پرتی در زمان کار، کم‌خوابی، تعویق انداختن کارها..."
                    className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-stone-900"
                  />
                  <button
                    type="submit"
                    className="min-h-10 px-3.5 py-2 text-xs font-bold bg-rose-700 text-white hover:bg-rose-800 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-700"
                  >
                    <Plus size={15} aria-hidden="true" />
                    <span>افزودن</span>
                  </button>
                </form>

                {/* لیست موارد اصلاحی */}
                {accounting.badDeeds.length > 0 ? (
                  <ul className="space-y-1.5">
                    {accounting.badDeeds.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2.5 bg-white rounded-xl border border-rose-200/80 text-xs text-stone-800"
                      >
                        <span className="flex-1 font-medium">{item}</span>
                        <button
                          type="button"
                          onClick={() => store.removeBadDeed(currentDate, idx)}
                          className="min-w-9 min-h-9 flex items-center justify-center text-stone-400 hover:text-rose-700 transition-colors cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                          aria-label={`حذف چالش: ${item}`}
                        >
                          <Trash2 size={14} aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-stone-500 text-center py-2">
                    موردی ثبت نشده است.
                  </p>
                )}
              </div>

              {/* نمره رضایت پایان روز (۱ تا ۱۰) */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-stone-800">
                    میزان رضایت از عملکرد امروز:
                  </span>
                  <span className="text-sm font-black text-amber-800">
                    {toPersianDigits(accounting.satisfactionScore || 7)} از ۱۰
                  </span>
                </div>
                <div className="flex items-center justify-between gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() =>
                        store.updateDailyAccounting(currentDate, {
                          satisfactionScore: num,
                        })
                      }
                      className={`min-h-10 flex-1 py-1.5 text-xs rounded-xl font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                        (accounting.satisfactionScore || 7) === num
                          ? 'bg-amber-400 text-stone-950 shadow-2xs font-black'
                          : 'bg-white text-stone-700 hover:bg-stone-200 border border-stone-200/80'
                      }`}
                    >
                      {toPersianDigits(num)}
                    </button>
                  ))}
                </div>
              </div>

              {/* یادداشت و آمادگی برای فردا */}
              <div>
                <label htmlFor="accounting-reflection-note" className="block text-xs font-bold text-stone-800 mb-1.5">
                  یادداشت و آمادگی برای فردا:
                </label>
                <textarea
                  id="accounting-reflection-note"
                  maxLength={500}
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  onBlur={handleSaveReflection}
                  rows={2}
                  placeholder="نکته مهم امروز چه بود و فردا چه چیزی را بهتر انجام می‌دهم؟"
                  className="w-full text-xs p-3 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900"
                />
              </div>
            </>
          ) : (
            <>
              {/* تب محاسبه خرید و مخارج: گزارش اتوماتیک امروز، هفته و ماه */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-amber-50/70 border border-amber-200/90 rounded-2xl text-center">
                  <span className="text-[10px] text-amber-900 font-bold block mb-1">
                    مخارج امروز
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-950">
                    {toPersianDigits(todayTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-amber-800 block mt-0.5">تومان</span>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200/90 rounded-2xl text-center">
                  <span className="text-[10px] text-blue-900 font-bold block mb-1">
                    مخارج این هفته
                  </span>
                  <span className="text-xs sm:text-sm font-black text-blue-950">
                    {toPersianDigits(weekTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-blue-800 block mt-0.5">تومان</span>
                </div>

                <div className="p-3 bg-stone-100 border border-stone-200/90 rounded-2xl text-center">
                  <span className="text-[10px] text-stone-700 font-bold block mb-1">
                    مخارج این ماه
                  </span>
                  <span className="text-xs sm:text-sm font-black text-stone-950">
                    {toPersianDigits(monthTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-stone-600 block mt-0.5">تومان</span>
                </div>
              </div>

              {/* فرم افزودن خرید جدید */}
              <form onSubmit={handleAddExpense} className="p-4 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  ثبت خرید یا هزینه جدید برای امروز:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="expense-title-input" className="sr-only">عنوان خرید</label>
                    <input
                      id="expense-title-input"
                      type="text"
                      maxLength={200}
                      value={expenseTitle}
                      onChange={(e) => setExpenseTitle(e.target.value)}
                      placeholder="عنوان خرید (مثلاً: نان و پنیر، بنزین)"
                      className="w-full text-xs px-3 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-900"
                    />
                  </div>
                  <div>
                    <label htmlFor="expense-amount-input" className="sr-only">مبلغ به تومان</label>
                    <input
                      id="expense-amount-input"
                      type="text"
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="مبلغ به تومان (مثلاً: ۵۰,۰۰۰)"
                      className="w-full text-xs px-3 py-2.5 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 font-mono text-left text-stone-900"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <label htmlFor="expense-category-select" className="sr-only">دسته‌بندی هزینه</label>
                  <select
                    id="expense-category-select"
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 text-stone-800"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, val]) => (
                      <option key={catKey} value={catKey}>
                        {val.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="min-h-10 px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 active:bg-amber-500 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                  >
                    <Plus size={16} aria-hidden="true" />
                    <span>ثبت خرید</span>
                  </button>
                </div>
              </form>

              {/* لیست خریدهای امروز */}
              <div>
                <span className="text-xs font-bold text-stone-800 block mb-2">
                  ریز خریدهای امروز ({toPersianDigits(todayExpensesList.length)} مورد):
                </span>
                {todayExpensesList.length > 0 ? (
                  <ul className="space-y-1.5">
                    {todayExpensesList.map((exp) => (
                      <li
                        key={exp.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-stone-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              CATEGORY_LABELS[exp.category]?.color || 'bg-stone-100 text-stone-700'
                            }`}
                          >
                            {CATEGORY_LABELS[exp.category]?.label || exp.category}
                          </span>
                          <span className="font-bold text-stone-900">{exp.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-900">
                            {toPersianDigits(exp.amount.toLocaleString('fa-IR'))} تومان
                          </span>
                          <button
                            type="button"
                            onClick={() => store.deleteDailyExpense(exp.id)}
                            className="min-w-8 min-h-8 flex items-center justify-center text-stone-400 hover:text-rose-700 transition-colors cursor-pointer rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                            aria-label={`حذف هزینه: ${exp.title}`}
                          >
                            <Trash2 size={14} aria-hidden="true" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500 text-center py-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-300">
                    برای امروز هزینه‌ای ثبت نشده است.
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* دکمه بستن */}
        <div className="p-3 sm:p-4 border-t border-stone-100 bg-[#fdfcf9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-5 py-2 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
          >
            بستن و ذخیره
          </button>
        </div>
      </div>
    </Modal>
  );
};
