// PWA & Web Notifications Manager for Daily Study Reminders

export interface NotificationSettings {
  enabled: boolean;
  reminderHour: number; // 0 - 23 (e.g. 19 for 7:00 PM)
  lastNotifiedDate: string;
}

const STORAGE_KEY = 'sinhala_study_notifications';

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: false,
  reminderHour: 19,
  lastNotifiedDate: '',
};

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) return 'denied';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch {
    return false;
  }
}

export function loadNotificationSettings(): NotificationSettings {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATION_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_NOTIFICATION_SETTINGS;
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

export function saveNotificationSettings(settings: NotificationSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {}
}

export function sendStudyNotification(title: string, body: string, icon = '/images/apple-touch-icon.png'): boolean {
  if (!isNotificationSupported() || Notification.permission !== 'granted') return false;

  try {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon,
          badge: '/images/apple-touch-icon.png',
          tag: 'sinhala-study-reminder',
        });
      });
    } else {
      new Notification(title, {
        body,
        icon,
      });
    }
    return true;
  } catch {
    return false;
  }
}

// Daily background checker that runs when tab is active
export function checkAndTriggerDailyReminder(streak: number): boolean {
  const settings = loadNotificationSettings();
  if (!settings.enabled || Notification.permission !== 'granted') return false;

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentHour = now.getHours();

  if (settings.lastNotifiedDate !== todayStr && currentHour >= settings.reminderHour) {
    const sent = sendStudyNotification(
      '🦁 Sinhala Puluwanda — Daily Study Time!',
      `Keep your ${streak > 0 ? streak + '-day ' : ''}streak alive! Complete your 50 XP daily goal today 🔥`
    );
    if (sent) {
      settings.lastNotifiedDate = todayStr;
      saveNotificationSettings(settings);
      return true;
    }
  }
  return false;
}
