import { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { getTodayJalali, toPersianDigits } from '../date/jalali';
import { alarmService } from './alarmManager';

export interface ActiveAlarmAlert {
  id: string;
  title: string;
  dueTime?: string;
}

export function useAlarmWatcher() {
  const { tasks } = useStore();
  const [activeAlert, setActiveAlert] = useState<ActiveAlarmAlert | null>(null);

  useEffect(() => {
    // تقاضای اختیاری دسترسی نوتیفیکیشن در اولین ورود
    alarmService.requestNotificationPermission();

    const checkAlarms = () => {
      const today = getTodayJalali().dateStr;
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTotalMinutes = currentHours * 60 + currentMinutes;

      tasks.forEach((task) => {
        if (!task.hasAlarm || !task.dueTime || task.completedAt || task.dueDate !== today) {
          return;
        }

        // تبدیل ارقام فارسی به انگلیسی برای محاسبه زمان
        const normalizedTime = task.dueTime
          .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString())
          .trim();

        const parts = normalizedTime.split(':').map((p) => parseInt(p, 10));
        if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return;

        const taskHours = parts[0];
        const taskMinutes = parts[1];
        const taskTotalMinutes = taskHours * 60 + taskMinutes;

        const offset = task.alarmMinutesBefore || 0;
        const targetAlarmMinute = taskTotalMinutes - offset;

        // اگر زمان فعلی با زمان آلارم تطابق دارد (در بازه ۱ دقیقه اخیر)
        if (
          currentTotalMinutes >= targetAlarmMinute &&
          currentTotalMinutes <= targetAlarmMinute + 2
        ) {
          const timeKey = `${today}_${taskHours}:${taskMinutes}`;
          if (!alarmService.hasAlreadyNotified(task.id, timeKey)) {
            alarmService.markNotified(task.id, timeKey);

            // پخش زنگ آلارم
            if (task.alarmSound !== false) {
              alarmService.playChime();
            }

            // ارسال نوتیفیکیشن
            alarmService.sendNotification(
              `یادآوری: ${task.title}`,
              `زمان انجام این کار فرا رسیده است (${task.dueTime})`
            );

            // نمایش هشدار روی صفحه
            setActiveAlert({
              id: task.id,
              title: task.title,
              dueTime: task.dueTime,
            });
          }
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 20000); // بررسی هر ۲۰ ثانیه

    return () => clearInterval(interval);
  }, [tasks]);

  const dismissAlert = () => {
    setActiveAlert(null);
  };

  return { activeAlert, dismissAlert };
}
