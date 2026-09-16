import React, { useState, useEffect } from 'react';
import { useStore, store } from '../../store/useStore';
import { Priority, EventType, GoalLevel } from '../../types';
import { getTodayJalali, toPersianDigits } from '../../lib/date/jalali';
import { PersianDatePicker } from '../common/PersianDatePicker';
import { SIX_LIFE_DOMAINS } from '../../data/sixDomains';
import { Modal } from '../common/Modal';
import {
  CheckSquare,
  Calendar,
  Compass,
  Plus,
  Clock,
  Bell,
} from 'lucide-react';

export const QuickAddModal: React.FC = () => {
  const quickAddModalOpen = useStore((s) => s.quickAddModalOpen);
  const quickAddDefaultType = useStore((s) => s.quickAddDefaultType);
  const domainGroups = useStore((s) => s.domainGroups);
  const goals = useStore((s) => s.goals);
  const selectedDate = useStore((s) => s.selectedDate);
  const settings = useStore((s) => s.settings);

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

  // فیلدهای وظیفه
  const [taskTitle, setTaskTitle] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskGroupId, setTaskGroupId] = useState(domainGroups[0]?.id || 'work');
  const [taskDueDate, setTaskDueDate] = useState(selectedDate || today.dateStr);
  const [taskDueTime, setTaskDueTime] = useState('');
  const [taskHasAlarm, setTaskHasAlarm] = useState(false);
  const [taskAlarmMinutesBefore, setTaskAlarmMinutesBefore] = useState(0);
  const [taskAlarmSound, setTaskAlarmSound] = useState(true);
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
      const trimmedTitle = taskTitle.trim();
      if (!trimmedTitle) return;

      store.addTask({
        title: trimmedTitle,
        notes: taskNotes.trim() || undefined,
        groupId: taskGroupId,
        dueDate: taskDueDate,
        dueTime: taskDueTime.trim() || undefined,
        hasAlarm: taskHasAlarm,
        alarmMinutesBefore: taskHasAlarm ? taskAlarmMinutesBefore : undefined,
        alarmSound: taskHasAlarm ? taskAlarmSound : undefined,
        priority: taskPriority,
        goalId: taskGoalId || undefined,
        subtasks: [],
      });
      setTaskTitle('');
      setTaskNotes('');
    } else if (activeType === 'event') {
      const trimmedTitle = eventTitle.trim();
      if (!trimmedTitle) return;

      store.addEvent({
        title: trimmedTitle,
        type: eventType,
        date: eventDate,
        startTime: eventStartTime.trim() || undefined,
        endTime: eventEndTime.trim() || undefined,
        description: eventDescription.trim() || undefined,
      });
      setEventTitle('');
      setEventDescription('');
    } else if (activeType === 'goal') {
      const trimmedTitle = goalTitle.trim();
      if (!trimmedTitle) return;

      store.addGoal({
        title: trimmedTitle,
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
    <Modal
      id="quick-add-modal"
      isOpen={quickAddModalOpen}
      onClose={handleClose}
      maxWidth="lg"
      headerContent={
        <div className="flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl border border-stone-300/60 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveType('task')}
            className={`min-h-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeType === 'task'
                ? 'bg-stone-900 text-stone-100 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <CheckSquare size={15} aria-hidden="true" />
            <span>کار و وظیفه</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('event')}
            className={`min-h-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeType === 'event'
                ? 'bg-stone-900 text-stone-100 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Calendar size={15} aria-hidden="true" />
            <span>رویداد مهم</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveType('goal')}
            className={`min-h-10 flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
              activeType === 'goal'
                ? 'bg-stone-900 text-stone-100 shadow-xs'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            <Compass size={15} aria-hidden="true" />
            <span>مسیر و هدف</span>
          </button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* فرم وظیفه */}
        {activeType === 'task' && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="quick-add-task-title" className="text-xs font-bold text-stone-800 block">
                  عنوان کار *
                </label>
                {taskTitle.length > 150 && (
                  <span className="text-[10px] text-amber-800 font-mono font-bold">
                    {toPersianDigits(taskTitle.length)} / ۲۰۰
                  </span>
                )}
              </div>
              <input
                id="quick-add-task-title"
                type="text"
                autoFocus
                required
                maxLength={200}
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="مثال: تمرین توابع جاوااسکریپت، مطالعه کتاب، ورزش..."
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white text-stone-900 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* انتخاب حوزه */}
              <div>
                <label htmlFor="quick-add-task-group" className="text-xs font-semibold text-stone-700 block mb-1">
                  حوزه کار
                </label>
                <select
                  id="quick-add-task-group"
                  value={taskGroupId}
                  onChange={(e) => setTaskGroupId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-800/70"
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
                <span className="text-xs font-semibold text-stone-700 block mb-1">
                  اولویت
                </span>
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
                      className={`min-h-10 text-xs py-1.5 rounded-xl border font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                        taskPriority === p.id
                          ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
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

            {/* ساعت انجام و آلارم اختیاری */}
            <div className="rounded-2xl border border-stone-200 bg-stone-50/70 p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <label htmlFor="quick-add-task-duetime" className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <Clock size={15} className="text-amber-700" aria-hidden="true" />
                  <span>ساعت مشخص انجام (اختیاری)</span>
                </label>
                {taskDueTime && (
                  <button
                    type="button"
                    onClick={() => {
                      setTaskDueTime('');
                      setTaskHasAlarm(false);
                    }}
                    className="min-h-9 px-2 text-[11px] text-stone-600 hover:text-stone-900 cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-800 rounded"
                  >
                    پاک کردن ساعت
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="quick-add-task-duetime"
                  type="text"
                  value={taskDueTime}
                  onChange={(e) => setTaskDueTime(e.target.value)}
                  placeholder="مثال: ۱۰:۳۰ یا ۱۴:۰۰"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-900 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                />
                <div className="flex items-center gap-1">
                  {[
                    { label: '۰۹:۰۰ صبح', time: '۰۹:۰۰' },
                    { label: '۱۴:۰۰ ظهر', time: '۱۴:۰۰' },
                    { label: '۱۸:۰۰ عصر', time: '۱۸:۰۰' },
                    { label: '۲۱:۰۰ شب', time: '۲۱:۰۰' },
                  ].map((preset) => (
                    <button
                      key={preset.time}
                      type="button"
                      onClick={() => setTaskDueTime(preset.time)}
                      className={`min-h-9 text-[11px] px-2 py-1 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-800 ${
                        taskDueTime === preset.time
                          ? 'bg-amber-400 text-stone-950 border-amber-500 font-bold shadow-2xs'
                          : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* گزینه اختیاری فعال‌سازی آلارم */}
              <div className="pt-2 border-t border-stone-200/80 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-xl ${
                        taskHasAlarm ? 'bg-amber-100 text-amber-800' : 'bg-stone-200 text-stone-500'
                      }`}
                    >
                      <Bell size={15} aria-hidden="true" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">فعال‌سازی زنگ آلارم و هشدار</span>
                      <span className="text-[10px] text-stone-500">پخش زنگ صوتی سر ساعت مشخص</span>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer min-w-11 min-h-11 justify-center">
                    <input
                      type="checkbox"
                      checked={taskHasAlarm}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setTaskHasAlarm(checked);
                        if (checked && !taskDueTime) {
                          setTaskDueTime('۱۰:۰۰');
                        }
                      }}
                      className="sr-only peer"
                      aria-label="فعال‌سازی هشدار صوتی برای این کار"
                    />
                    <div className="w-10 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-stone-800/70 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[12px] after:left-[4px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {taskHasAlarm && (
                  <div className="flex items-center justify-between pt-1 text-xs animate-in fade-in">
                    <span className="text-[11px] text-stone-600">زمان هشدار:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { label: 'سر وقت', value: 0 },
                        { label: '۱۵ دقیقه قبل', value: 15 },
                        { label: '۳۰ دقیقه قبل', value: 30 },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setTaskAlarmMinutesBefore(opt.value)}
                          className={`min-h-9 text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-stone-800 ${
                            taskAlarmMinutesBefore === opt.value
                              ? 'bg-stone-900 text-stone-100 border-stone-900 font-bold'
                              : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* پیوند با هدف بالادستی */}
            <div>
              <label htmlFor="quick-add-task-goal" className="text-xs font-semibold text-stone-700 block mb-1">
                پیوستن به مسیر / هدف (اختیاری)
              </label>
              <select
                id="quick-add-task-goal"
                value={taskGoalId}
                onChange={(e) => setTaskGoalId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              >
                <option value="">بدون هدف (کار مستقل)</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="quick-add-task-notes" className="text-xs font-semibold text-stone-700 block mb-1">
                یادداشت یا توضیحات (اختیاری)
              </label>
              <textarea
                id="quick-add-task-notes"
                rows={2}
                maxLength={500}
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                placeholder="نکات، لینک‌ها یا مواردی که باید مد نظر باشد..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 resize-none focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              />
            </div>
          </>
        )}

        {/* فرم رویداد */}
        {activeType === 'event' && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="quick-add-event-title" className="text-xs font-bold text-stone-800 block">
                  عنوان رویداد *
                </label>
                {eventTitle.length > 150 && (
                  <span className="text-[10px] text-amber-800 font-mono font-bold">
                    {toPersianDigits(eventTitle.length)} / ۲۰۰
                  </span>
                )}
              </div>
              <input
                id="quick-add-event-title"
                type="text"
                autoFocus
                required
                maxLength={200}
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="مثال: آزمون پایان‌ترم، جلسه پروژه، زادروز دوست..."
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white text-stone-900 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="quick-add-event-type" className="text-xs font-semibold text-stone-700 block mb-1">
                  نوع رویداد
                </label>
                <select
                  id="quick-add-event-type"
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-stone-800/70"
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
                  <label htmlFor="quick-add-event-start" className="text-xs font-semibold text-stone-700 block mb-1">
                    ساعت شروع
                  </label>
                  <input
                    id="quick-add-event-start"
                    type="text"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    placeholder="۱۰:۰۰"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
                  />
                </div>
                <div>
                  <label htmlFor="quick-add-event-end" className="text-xs font-semibold text-stone-700 block mb-1">
                    ساعت پایان
                  </label>
                  <input
                    id="quick-add-event-end"
                    type="text"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    placeholder="۱۱:۳۰"
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-800/70"
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
              <label htmlFor="quick-add-event-desc" className="text-xs font-semibold text-stone-700 block mb-1">
                توضیحات تکمیلی
              </label>
              <textarea
                id="quick-add-event-desc"
                rows={2}
                maxLength={500}
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="مکان، لینک جلسه یا جزئیات مهم..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 resize-none focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              />
            </div>
          </>
        )}

        {/* فرم هدف */}
        {activeType === 'goal' && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="quick-add-goal-title" className="text-xs font-bold text-stone-800 block">
                  عنوان هدف یا مسیر *
                </label>
                {goalTitle.length > 150 && (
                  <span className="text-[10px] text-amber-800 font-mono font-bold">
                    {toPersianDigits(goalTitle.length)} / ۲۰۰
                  </span>
                )}
              </div>
              <input
                id="quick-add-goal-title"
                type="text"
                autoFocus
                required
                maxLength={200}
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="مثال: یادگیری زبان انگلیسی، توسعه پروژه پایانی..."
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white text-stone-900 bg-stone-50/50 focus:bg-white"
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-stone-700 block mb-1">
                سطح افق
              </span>
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
                    className={`min-h-10 text-xs py-1.5 rounded-xl border font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 ${
                      goalLevel === lvl.id
                        ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-2xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
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
              <label htmlFor="quick-add-goal-desc" className="text-xs font-semibold text-stone-700 block mb-1">
                توضیحات مسیر
              </label>
              <textarea
                id="quick-add-goal-desc"
                rows={2}
                maxLength={500}
                value={goalDescription}
                onChange={(e) => setGoalDescription(e.target.value)}
                placeholder="انگیزه و چشم‌انداز رسیدن به این هدف..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 text-stone-800 resize-none focus:outline-none focus:ring-2 focus:ring-stone-800/70"
              />
            </div>
          </>
        )}

        {/* پاورقی دکمه‌ها */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={handleClose}
            className="min-h-11 px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="min-h-11 px-5 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-800/70 focus:ring-offset-1 focus:ring-offset-white"
          >
            <Plus size={16} className="stroke-[2.5]" aria-hidden="true" />
            <span>ثبت در دفتر</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
