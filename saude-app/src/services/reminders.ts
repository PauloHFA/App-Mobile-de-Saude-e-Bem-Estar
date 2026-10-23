import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Lembretes diários locais. O texto é GENÉRICO de propósito: notificações
 * aparecem na tela bloqueada e não podem expor dado de saúde.
 */
export const REMINDER_TEXT = {
  title: 'Bem-Estar',
  body: 'Hora de cuidar de você. Abra o app para ver seus hábitos.',
};

export async function scheduleDailyReminder(hour: number, minute: number): Promise<string | null> {
  if (Platform.OS === 'web') return null;
  const perm = await Notifications.getPermissionsAsync();
  const granted = perm.granted || (await Notifications.requestPermissionsAsync()).granted;
  if (!granted) return null;

  await cancelReminders();
  return Notifications.scheduleNotificationAsync({
    content: REMINDER_TEXT,
    trigger: { type: SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

export async function cancelReminders(): Promise<void> {
  if (Platform.OS === 'web') return;
  await Notifications.cancelAllScheduledNotificationsAsync();
}

