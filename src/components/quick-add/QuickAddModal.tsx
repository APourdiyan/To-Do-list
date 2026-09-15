import React, { useState, useEffect } from 'react';
import { useStore, store } from '../../store/useStore';
import { Priority, EventType, GoalLevel } from '../../types';
import { getTodayJalali, addDaysJalali } from '../../lib/date/jalali';
import { PersianDatePicker } from '../common/PersianDatePicker';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import {
  CheckSquare,
  Calendar,
  Compass,
  X,
  Plus,
  Clock,
  Tag,
  AlertCircle,
} from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const { quickAddModalOpen, quickAddDefaultType, domainGroups, goals, selectedDate, settings } =
    useStore();
  const today = getTodayJalali();

  const availableDomains = settings.lifeDomainsMode ? SIX_LIFE_DOMAINS : domainGroups;

  const [activeType, setActiveType] = useState<'task' | 'event' | 'goal'>(
    quickAddDefaultType || 'task'
  );

  useEffect(() => {
    if (quickAddDefaultType) {
      setActiveType(quickAddDefaultType);
    }
  }, [quickAddDefaultType, quickAddModalOpen]);

  // فیلدهای مشترک و وظیفه
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskGroupId, setTaskGroupId] = useState(domainGroups[0]?.id || 'work');
  const [taskDueDate, setTaskDueDate] = useState(selectedDate || today.dateStr);
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskGoalId, setTaskGoalId] = useState('');

  // فیلدهای رویداد
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState<EventType>('appointment');
  const [eventDate, setEventDate] = useState(selectedDate || today.dateStr);
  const [eventStartTime, setEventStartTime] = useState('۱۰:۰۰');
  const [eventEndTime, setEventEndTime] = useState('');
  const [eventDescription, setEventDescription] = useState('');

  // فیلدهای هدف
  const [goalTitle, setGoalTitle] = useState('');
  const [goalDescription, setGoalDescription] = useState('');
  const [goalLevel, setGoalLevel] = useState<GoalLevel>('medium');
  const [goalStartDate, setGoalStartDate] = useState(today.dateStr);
  const [goalEndDate, setGoalEndDate] = useState(`${today.jy}/12/29`);

  if (!quickAddModalOpen) return null;

  const handleClose = () => {
    store.setQuickAddModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeType === 'task') {
      if (!taskTitle.trim()) return;
      store.addTask({
        title: taskTitle.trim(),
        notes: taskNotes.trim() || undefined,
        groupId: taskGroupId,
        dueDate: taskDueDate,
        dueTime: taskDueTime.trim() || undefined,
        priority: taskPriority,
        goalId: taskGoalId || undefined,
        subtasks: [],
      });
      setTaskTitle('');
      setTaskNotes('');
    } else if (activeType === 'event') {
      if (!eventTitle.trim()) return;
      store.addEvent({
        title: eventTitle.trim(),
        type: eventType,
        date: eventDate,
        startTime: eventStartTime.trim() || undefined,
        endTime: eventEndTime.trim() || undefined,
        description: eventDescription.trim() || undefined,
      });
      setEventTitle('');
      setEventDescription('');
    } else if (activeType === 'goal') {
      if (!goalTitle.trim()) return;
      store.addGoal({
        title: goalTitle.trim(),
        description: goalDescription.trim() || undefined,
        level: goalLevel,
        startDate: goalStartDate,
        endDate: goalEndDate,
        progress: 0,
        status: 'active',
      });
      setGoalTitle('');
      setGoalDescription('');
    }

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs" dir="rtl">
      <div className="bg-white border border-stone-200/90 rounded-2xl shadow-xl max-w-lg w-full overflow-hidden">
        
        {/* سربرگ مدال با انتخاب نوع آیتم */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          {/* سوئیچر نوع */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveType('task')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeType === 'task'
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <CheckSquare size={14} />
              <span>کار / وظیفه</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('event')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeType === 'event'
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Calendar size={14} />
              <span>رویداد مهم</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveType('goal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                activeType === 'goal'
                  ? 'bg-stone-900 text-stone-100 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Compass size={14} />
              <span>مسیر / هدف</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* فرم وظیفه */}
          {activeType === 'task' && (
            <>
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  عنوان کار *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="مثال: تمرین توابع جاوااسکریپت، مطالعه کتاب، ورزش..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-stone-800 text-stone-900 bg-stone-50/50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* انتخاب حوزه */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    حوزه کار
                  </label>
                  <select
                    value={taskGroupId}
                    onChange={(e) => setTaskGroupId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 bg-white"
                  >
                    {availableDomains.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* انتخاب اولویت */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    اولویت
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'low', label: 'عادی' },
                      { id: 'medium', label: 'متوسط' },
                      { id: 'high', label: 'مهم' },
                    ].map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTaskPriority(p.id as Priority)}
                        className={`text-xs py-1.5 rounded border font-semibold transition-colors ${
                          taskPriority === p.id
                            ? 'bg-stone-900 text-stone-100 border-stone-900'
                            : 'bg-stone-50 text-stone-700 border-stone-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* تاریخ موعد */}
              <PersianDatePicker
                label="تاریخ موعد انجام"
                value={taskDueDate}
                onChange={setTaskDueDate}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ساعت انجام */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    ساعت مشخص (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={taskDueTime}
                    onChange={(e) => setTaskDueTime(e.target.value)}
                    placeholder="مثال: ۱۰:۳۰"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800"
                  />
                </div>

                {/* پیوند با هدف بالادستی */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    پیوستن به مسیر / هدف (اختیاری)
                  </label>
                  <select
                    value={taskGoalId}
                    onChange={(e) => setTaskGoalId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 bg-white"
                  >
                    <option value="">بدون هدف (کار مستقل)</option>
                    {goals.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  یادداشت یا توضیحات (اختیاری)
                </label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="نکات، لینک‌ها یا مواردی که باید مد نظر باشد..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 resize-none"
                />
              </div>
            </>
          )}

          {/* فرم رویداد */}
          {activeType === 'event' && (
            <>
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  عنوان رویداد *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="مثال: آزمون پایان‌ترم، جلسه پروژه، زادروز دوست..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-stone-800 text-stone-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    نوع رویداد
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 bg-white"
                  >
                    <option value="appointment">قرار کاری / جلسه</option>
                    <option value="exam">امتحان / آزمون دانشگاهی</option>
                    <option value="birthday">زادروز / تولد</option>
                    <option value="anniversary">سالگرد / مناسبت خانوادگی</option>
                    <option value="personal">رویداد شخصی</option>
                    <option value="other">سایر</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      ساعت شروع
                    </label>
                    <input
                      type="text"
                      value={eventStartTime}
                      onChange={(e) => setEventStartTime(e.target.value)}
                      placeholder="۱۰:۰۰"
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-stone-300 text-stone-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      ساعت پایان
                    </label>
                    <input
                      type="text"
                      value={eventEndTime}
                      onChange={(e) => setEventEndTime(e.target.value)}
                      placeholder="۱۱:۳۰"
                      className="w-full px-2.5 py-2 text-xs rounded-lg border border-stone-300 text-stone-800"
                    />
                  </div>
                </div>
              </div>

              <PersianDatePicker
                label="تاریخ رویداد"
                value={eventDate}
                onChange={setEventDate}
              />

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  توضیحات تکمیلی
                </label>
                <textarea
                  rows={2}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="مکان، لینک جلسه یا جزئیات مهم..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 resize-none"
                />
              </div>
            </>
          )}

          {/* فرم هدف */}
          {activeType === 'goal' && (
            <>
              <div>
                <label className="text-xs font-bold text-stone-800 block mb-1">
                  عنوان هدف یا مسیر *
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="مثال: یادگیری زبان انگلیسی، توسعه پروژه پایانی..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 focus:outline-none focus:border-stone-800 text-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  سطح افق
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'short', label: 'کوتاه‌مدت' },
                    { id: 'medium', label: 'میان‌مدت' },
                    { id: 'long', label: 'بلندمدت' },
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setGoalLevel(lvl.id as GoalLevel)}
                      className={`text-xs py-1.5 rounded border font-semibold transition-colors ${
                        goalLevel === lvl.id
                          ? 'bg-stone-900 text-stone-100 border-stone-900'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <PersianDatePicker
                  label="تاریخ آغاز"
                  value={goalStartDate}
                  onChange={setGoalStartDate}
                  showQuickChips={false}
                />
                <PersianDatePicker
                  label="تاریخ پایان"
                  value={goalEndDate}
                  onChange={setGoalEndDate}
                  showQuickChips={false}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  توضیحات مسیر
                </label>
                <textarea
                  rows={2}
                  value={goalDescription}
                  onChange={(e) => setGoalDescription(e.target.value)}
                  placeholder="انگیزه و چشم‌انداز رسیدن به این هدف..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-stone-300 text-stone-800 resize-none"
                />
              </div>
            </>
          )}

          {/* پاورقی دکمه‌ها */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              انصراف
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} className="stroke-[2.5]" />
              <span>ثبت در دفتر</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
