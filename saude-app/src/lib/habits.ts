import type { Habit, HabitCategory } from '@/services/types';
import { colors } from '@/theme/tokens';

export function habitRatio(h: Pick<Habit, 'progress' | 'goal'>): number {
  if (h.goal <= 0) return 0;
  return Math.max(0, Math.min(1, h.progress / h.goal));
}

export function isHabitDone(h: Pick<Habit, 'progress' | 'goal'>): boolean {
  return h.goal > 0 && h.progress >= h.goal;
}

export function summarize(habits: Habit[]) {
  const done = habits.filter(isHabitDone).length;
  return { done, total: habits.length, ratio: habits.length ? done / habits.length : 0 };
}

export function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function parseTime(value: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function getCategoryTheme(category: HabitCategory) {
  switch (category) {
    case 'water':
      return { color: colors.water, bg: colors.waterSoft, label: 'Hidratação', icon: 'water' as const };
    case 'movement':
      return { color: colors.movement, bg: colors.movementSoft, label: 'Movimento', icon: 'walk' as const };
    case 'mind':
      return { color: colors.mind, bg: colors.mindSoft, label: 'Mindfulness', icon: 'leaf' as const };
    case 'sleep':
      return { color: colors.sleep, bg: colors.sleepSoft, label: 'Sono & Repouso', icon: 'moon' as const };
    case 'nutrition':
      return { color: colors.nutrition, bg: colors.nutritionSoft, label: 'Nutrição', icon: 'restaurant' as const };
    default:
      return { color: colors.primary, bg: colors.primarySoft, label: 'Geral', icon: 'checkmark-circle' as const };
  }
}
