import React, { useState, useMemo } from 'react';
import { useStore, store } from '../../store/useStore';
import {
  getTodayJalali,
  formatJalaliDate,
  toPersianDigits,
  parseJalaliDate,
} from '../../lib/date/jalali';
import { DailyExpense, ExpenseCategory } from '../../types';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Wallet,
  Receipt,
  Scale,
  Calendar,
  Sparkles,
  PieChart,
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
  const { dailyAccountings, dailyExpenses, selectedDate } = useStore();
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

  // محاسبات گزارش خودکار مخارج
  const { todayTotal, weekTotal, monthTotal, todayExpensesList } = useMemo(() => {
    const currentParsed = parseJalaliDate(currentDate) || today;

    // خریدهای امروز
    const todayList = dailyExpenses.filter((e) => e.date === currentDate);
    const todaySum = todayList.reduce((sum, e) => sum + e.amount, 0);

    // خریدهای ماه جاری
    const monthList = dailyExpenses.filter((e) => {
      const p = parseJalaliDate(e.date);
      return p && p.jy === currentParsed.jy && p.jm === currentParsed.jm;
    });
    const monthSum = monthList.reduce((sum, e) => sum + e.amount, 0);

    // خریدهای ۷ روز گذشته (هفته)
    // تقریبی بر اساس روزهای ثبت‌شده
    const weekSum = dailyExpenses
      .filter((e) => {
        const p = parseJalaliDate(e.date);
        return (
          p &&
          p.jy === currentParsed.jy &&
          p.jm === currentParsed.jm &&
          Math.abs(p.jd - currentParsed.jd) <= 7
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      todayTotal: todaySum,
      weekTotal: weekSum,
      monthTotal: monthSum,
      todayExpensesList: todayList,
    };
  }, [dailyExpenses, currentDate, today]);

  if (!isOpen) return null;

  const handleAddGood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoodDeed.trim()) return;
    store.addGoodDeed(currentDate, newGoodDeed.trim());
    setNewGoodDeed('');
  };

  const handleAddBad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBadDeed.trim()) return;
    store.addBadDeed(currentDate, newBadDeed.trim());
    setNewBadDeed('');
  };

  const handleSaveReflection = () => {
    store.updateDailyAccounting(currentDate, { reflectionNote });
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(expenseAmount.replace(/,/g, ''), 10);
    if (!expenseTitle.trim() || isNaN(amountNum) || amountNum <= 0) return;

    store.addDailyExpense({
      date: currentDate,
      title: expenseTitle.trim(),
      amount: amountNum,
      category: expenseCategory,
    });

    setExpenseTitle('');
    setExpenseAmount('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden"
        dir="rtl"
      >
        {/* سربرگ مدال */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-[#fdfcf9]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shadow-xs">
              {activeSubTab === 'accounting' ? <Scale size={18} /> : <Wallet size={18} />}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                {activeSubTab === 'accounting' ? 'مرور و ارزیابی روز' : 'هزینه‌ها و مخارج روزانه'}
              </h2>
              <p className="text-xs text-stone-500">{formattedDate}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* سوییچ بین ارزیابی روز و مخارج */}
        <div className="flex border-b border-stone-100 px-4 sm:px-5 pt-3 bg-stone-50/50 gap-2">
          <button
            onClick={() => setActiveSubTab('accounting')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'accounting'
                ? 'border-amber-500 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Scale size={15} />
            <span>ارزیابی روز و عملکرد</span>
          </button>

          <button
            onClick={() => setActiveSubTab('expenses')}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeSubTab === 'expenses'
                ? 'border-amber-500 text-stone-950'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Receipt size={15} />
            <span>هزینه‌ها و مخارج</span>
            {todayTotal > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                {toPersianDigits(todayTotal.toLocaleString('fa-IR'))}
              </span>
            )}
          </button>
        </div>

        {/* محتوای تب فعال */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {activeSubTab === 'accounting' ? (
            <>
              {/* بخش کارهای مثبت و دستاوردها (+) */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>دستاوردهای مثبت و کارهای خوب (+)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {toPersianDigits(accounting.goodDeeds.length)} مورد
                  </span>
                </div>

                {/* فرم افزودن کار خوب */}
                <form onSubmit={handleAddGood} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newGoodDeed}
                    onChange={(e) => setNewGoodDeed(e.target.value)}
                    placeholder="مثال: تمرکز کامل روی کار، پیاده‌روی، تماس با خانواده..."
                    className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>افزودن</span>
                  </button>
                </form>

                {/* لیست کارهای خوب ثبت شده */}
                {accounting.goodDeeds.length > 0 ? (
                  <ul className="space-y-1.5">
                    {accounting.goodDeeds.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-emerald-100 text-xs text-stone-800"
                      >
                        <span className="flex-1 font-medium">{item}</span>
                        <button
                          onClick={() => store.removeGoodDeed(currentDate, idx)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-2">
                    هنوز موردی برای کارهای مثبت امروز ثبت نشده است.
                  </p>
                )}
              </div>

              {/* بخش چالش‌ها و نکات نیازمند بهبود (-) */}
              <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-1.5 text-rose-900 font-bold text-xs">
                    <AlertCircle size={16} className="text-rose-600" />
                    <span>چالش‌ها و نکات نیازمند بهبود (-)</span>
                  </div>
                  <span className="text-[11px] font-bold text-rose-800 bg-rose-100/80 px-2 py-0.5 rounded-full">
                    {toPersianDigits(accounting.badDeeds.length)} مورد
                  </span>
                </div>

                {/* فرم افزودن مورد اصلاحی */}
                <form onSubmit={handleAddBad} className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newBadDeed}
                    onChange={(e) => setNewBadDeed(e.target.value)}
                    placeholder="مثال: حواس‌پرتی در زمان کار، کم‌خوابی، تعویق انداختن کارها..."
                    className="flex-1 text-xs px-3 py-2 bg-white rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>افزودن</span>
                  </button>
                </form>

                {/* لیست موارد اصلاحی */}
                {accounting.badDeeds.length > 0 ? (
                  <ul className="space-y-1.5">
                    {accounting.badDeeds.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 bg-white rounded-xl border border-rose-100 text-xs text-stone-800"
                      >
                        <span className="flex-1 font-medium">{item}</span>
                        <button
                          onClick={() => store.removeBadDeed(currentDate, idx)}
                          className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-stone-400 text-center py-2">
                    موردی ثبت نشده است.
                  </p>
                )}
              </div>

              {/* نمره رضایت پایان روز (۱ تا ۱۰) */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-800">
                    میزان رضایت از عملکرد امروز:
                  </span>
                  <span className="text-sm font-black text-amber-700">
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
                      className={`flex-1 py-1.5 text-xs rounded-lg font-bold transition-all cursor-pointer ${
                        (accounting.satisfactionScore || 7) === num
                          ? 'bg-amber-400 text-stone-950 shadow-xs'
                          : 'bg-white text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {toPersianDigits(num)}
                    </button>
                  ))}
                </div>
              </div>

              {/* یادداشت و آمادگی برای فردا */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  یادداشت و آمادگی برای فردا:
                </label>
                <textarea
                  value={reflectionNote}
                  onChange={(e) => setReflectionNote(e.target.value)}
                  onBlur={handleSaveReflection}
                  rows={2}
                  placeholder="نکته مهم امروز چه بود و فردا چه چیزی را بهتر انجام می‌دهم؟"
                  className="w-full text-xs p-3 bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </>
          ) : (
            <>
              {/* تب محاسبه خرید و مخارج: گزارش اتوماتیک امروز، هفته و ماه */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-center">
                  <span className="text-[10px] text-amber-800 font-bold block mb-1">
                    مخارج امروز
                  </span>
                  <span className="text-xs sm:text-sm font-black text-amber-950">
                    {toPersianDigits(todayTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-amber-700 block mt-0.5">تومان</span>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-center">
                  <span className="text-[10px] text-blue-800 font-bold block mb-1">
                    مخارج این هفته
                  </span>
                  <span className="text-xs sm:text-sm font-black text-blue-950">
                    {toPersianDigits(weekTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-blue-700 block mt-0.5">تومان</span>
                </div>

                <div className="p-3 bg-stone-100 border border-stone-200/90 rounded-2xl text-center">
                  <span className="text-[10px] text-stone-600 font-bold block mb-1">
                    مخارج این ماه
                  </span>
                  <span className="text-xs sm:text-sm font-black text-stone-900">
                    {toPersianDigits(monthTotal.toLocaleString('fa-IR'))}
                  </span>
                  <span className="text-[9px] text-stone-500 block mt-0.5">تومان</span>
                </div>
              </div>

              {/* فرم افزودن خرید جدید */}
              <form onSubmit={handleAddExpense} className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2.5">
                <span className="text-xs font-bold text-stone-800 block">
                  ثبت خرید یا هزینه جدید برای امروز:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="عنوان خرید (مثلاً: نان و پنیر، بنزین)"
                    className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                  <input
                    type="text"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="مبلغ به تومان (مثلاً: ۵۰,۰۰۰)"
                    className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono text-left"
                  />
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as ExpenseCategory)}
                    className="text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([catKey, val]) => (
                      <option key={catKey} value={catKey}>
                        {val.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold bg-amber-400 text-stone-950 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus size={15} />
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
                            onClick={() => store.deleteDailyExpense(exp.id)}
                            className="text-stone-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-400 text-center py-4 bg-stone-50/50 rounded-2xl border border-dashed border-stone-200">
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
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-stone-900 text-white hover:bg-stone-800 rounded-xl transition-colors cursor-pointer"
          >
            بستن و ذخیره
          </button>
        </div>
      </div>
    </div>
  );
};
