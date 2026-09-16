/**
 * سامانه مدیریت آلارم، یادآوری صوتی و نوتیفیکیشن کارها
 */

class AlarmService {
  private audioCtx: AudioContext | null = null;
  private notifiedTaskIds = new Set<string>();

  // پخش صدای آلارم ملایم و خوش‌آهنگ با استفاده از وب اودیو
  playChime() {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const now = this.audioCtx.currentTime;

      // نت اول
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // نت دوم (هارمونی بالاتر)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.18); // A5
      gain2.gain.setValueAtTime(0.28, now + 0.18);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.18);
      osc2.stop(now + 0.9);

      // نت سوم مؤکد
      const osc3 = this.audioCtx.createOscillator();
      const gain3 = this.audioCtx.createGain();
      osc3.type = 'triangle';
      osc3.frequency.setValueAtTime(1174.66, now + 0.38); // D6
      gain3.gain.setValueAtTime(0.22, now + 0.38);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc3.connect(gain3);
      gain3.connect(this.audioCtx.destination);
      osc3.start(now + 0.38);
      osc3.stop(now + 1.2);
    } catch (e) {
      console.warn('Could not play alarm audio:', e);
    }
  }

  // درخواست مجوز نوتیفیکیشن مرورگر
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) return false;
    try {
      if (Notification.permission === 'granted') return true;
      if (Notification.permission !== 'denied') {
        const res = await Notification.requestPermission();
        return res === 'granted';
      }
    } catch {
      return false;
    }
    return false;
  }

  // ارسال اعلان مرورگر
  sendNotification(title: string, body: string) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon.svg',
          dir: 'rtl',
        });
      } catch (e) {
        console.warn('Failed to dispatch desktop notification', e);
      }
    }
  }

  hasAlreadyNotified(taskId: string, timeKey: string): boolean {
    return this.notifiedTaskIds.has(`${taskId}_${timeKey}`);
  }

  markNotified(taskId: string, timeKey: string) {
    this.notifiedTaskIds.add(`${taskId}_${timeKey}`);
  }
}

export const alarmService = new AlarmService();
