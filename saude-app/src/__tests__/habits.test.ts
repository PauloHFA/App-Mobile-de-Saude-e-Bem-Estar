import { formatTime, habitRatio, isHabitDone, parseTime, summarize } from '@/lib/habits';
import type { Habit } from '@/services/types';

const habit = (progress: number, goal = 8): Habit => ({
  id: 'x',
  title: 't',
  description: 'd',
  category: 'water',
  iconName: 'water',
  goal,
  progress,
  unit: 'u',
  streak: 1,
  completedDays: [true, true, true, true, true, true, true],
});

describe('habitRatio', () => {
  it('calcula a fração', () => expect(habitRatio(habit(4))).toBe(0.5));
  it('limita em 1', () => expect(habitRatio(habit(20))).toBe(1));
  it('não fica negativa', () => expect(habitRatio(habit(-3))).toBe(0));
  it('meta zero não divide por zero', () => expect(habitRatio(habit(5, 0))).toBe(0));
});

describe('isHabitDone', () => {
  it('true ao atingir a meta', () => expect(isHabitDone(habit(8))).toBe(true));
  it('false abaixo da meta', () => expect(isHabitDone(habit(7))).toBe(false));
  it('meta zero nunca conclui', () => expect(isHabitDone(habit(5, 0))).toBe(false));
});

describe('summarize', () => {
  it('conta concluídos', () => {
    expect(summarize([habit(8), habit(1), habit(8)])).toEqual({ done: 2, total: 3, ratio: 2 / 3 });
  });
  it('lista vazia', () => expect(summarize([])).toEqual({ done: 0, total: 0, ratio: 0 }));
});

describe('formatTime / parseTime', () => {
  it('formata com zero à esquerda', () => expect(formatTime(7, 5)).toBe('07:05'));
  it('interpreta horário válido', () => expect(parseTime('08:30')).toEqual({ hour: 8, minute: 30 }));
  it('aceita hora com um dígito', () => expect(parseTime('7:05')).toEqual({ hour: 7, minute: 5 }));
  it.each(['24:00', '12:60', 'abc', '', '8h30'])('rejeita "%s"', (v) => expect(parseTime(v)).toBeNull());
});

