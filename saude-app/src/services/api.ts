import type { DailyMood, DeviceRegistration, Habit, HomeSummary, MoodType, WeeklyProgress } from './types';
import { useAuthStore } from '@/store/auth-store';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

const wait = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

let currentMood: DailyMood | null = {
  mood: 'good',
  label: 'Disposto',
  emoji: '✨',
  energyLevel: 4,
  timestamp: new Date().toISOString(),
};

let habitsDb: Habit[] = [
  {
    id: 'agua',
    title: 'Hidratação Diária',
    description: 'Manter corpo e mente ativos com hidratação equilibrada',
    category: 'water',
    iconName: 'water',
    goal: 8,
    progress: 5,
    unit: 'copos (250ml)',
    streak: 6,
    completedDays: [true, true, true, true, true, false, false],
  },
  {
    id: 'passos',
    title: 'Caminhada & Passos',
    description: 'Meta ativa de movimento diário ao ar livre',
    category: 'movement',
    iconName: 'walk',
    goal: 30,
    progress: 20,
    unit: 'minutos',
    streak: 4,
    completedDays: [true, true, false, true, true, false, false],
  },
  {
    id: 'meditar',
    title: 'Respiração & Mindfulness',
    description: 'Pausa para diminuir o cortisol e focar no agora',
    category: 'mind',
    iconName: 'leaf',
    goal: 10,
    progress: 10,
    unit: 'minutos',
    streak: 12,
    completedDays: [true, true, true, true, true, true, true],
  },
  {
    id: 'sono',
    title: 'Descanso Reparador',
    description: 'Dormir antes das 23h sem telas na cama',
    category: 'sleep',
    iconName: 'moon',
    goal: 8,
    progress: 7,
    unit: 'horas',
    streak: 3,
    completedDays: [false, true, true, true, false, false, false],
  },
  {
    id: 'nutricao',
    title: 'Alimentação Consciente',
    description: 'Incluir porções coloridas de vegetais e frutas frescas',
    category: 'nutrition',
    iconName: 'restaurant',
    goal: 3,
    progress: 2,
    unit: 'refeições limpas',
    streak: 5,
    completedDays: [true, true, true, false, true, false, false],
  },
];

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().session?.accessToken;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  });
  if (res.status === 401) {
    useAuthStore.getState().signOutLocal();
    throw new ApiError('Sessão expirada. Entre novamente.', 401);
  }
  if (!res.ok) throw new ApiError('Algo deu errado. Tente novamente.', res.status);
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

export const api = {
  async getHome(): Promise<HomeSummary> {
    if (!USE_MOCK) return request('/home');
    await wait(200);

    const doneCount = habitsDb.filter((h) => h.progress >= h.goal).length;
    const progressRatio = habitsDb.length ? doneCount / habitsDb.length : 0;
    const score = Math.round(50 + progressRatio * 45);

    const waterHabit = habitsDb.find((h) => h.category === 'water');
    const waterMl = (waterHabit?.progress ?? 0) * 250;
    const mindHabit = habitsDb.find((h) => h.category === 'mind');
    const mindfulMinutes = mindHabit?.progress ?? 0;

    return {
      greeting: 'Você está no caminho certo!',
      score,
      completedToday: doneCount,
      totalToday: habitsDb.length,
      caloriesBurned: 340,
      waterMl,
      mindfulMinutes,
      streakDays: 7,
      tip: {
        title: 'Micro-pausas para a mente',
        description: 'Tire 2 minutos após reuniões ou tarefas longas para respirar profundamente.',
        category: 'mind',
      },
    };
  },

  async getHabits(): Promise<Habit[]> {
    if (!USE_MOCK) return request('/habitos');
    await wait(200);
    return habitsDb.map((h) => ({ ...h }));
  },

  async updateHabitProgress(id: string, delta: number): Promise<Habit> {
    if (!USE_MOCK) {
      return request(`/habitos/${id}`, { method: 'PATCH', body: JSON.stringify({ delta }) });
    }
    await wait(100);
    const habit = habitsDb.find((h) => h.id === id);
    if (!habit) throw new ApiError('Hábito não encontrado.', 404);

    habit.progress = Math.max(0, Math.min(habit.goal, habit.progress + delta));
    return { ...habit };
  },

  async addHabit(newHabit: Omit<Habit, 'id' | 'streak' | 'completedDays' | 'progress'>): Promise<Habit> {
    if (!USE_MOCK) {
      return request('/habitos', { method: 'POST', body: JSON.stringify(newHabit) });
    }
    await wait(200);
    const created: Habit = {
      ...newHabit,
      id: `habit-${Date.now()}`,
      progress: 0,
      streak: 0,
      completedDays: [false, false, false, false, false, false, false],
    };
    habitsDb = [created, ...habitsDb];
    return created;
  },

  async getMood(): Promise<DailyMood | null> {
    if (!USE_MOCK) return request('/humor/hoje');
    await wait(100);
    return currentMood ? { ...currentMood } : null;
  },

  async setMood(mood: MoodType, energyLevel = 4): Promise<DailyMood> {
    if (!USE_MOCK) {
      return request('/humor', { method: 'POST', body: JSON.stringify({ mood, energyLevel }) });
    }
    await wait(150);
    const labels: Record<MoodType, { label: string; emoji: string }> = {
      radiant: { label: 'Radiante', emoji: '🌟' },
      good: { label: 'Muito Bem', emoji: '😊' },
      calm: { label: 'Em Paz', emoji: '🌿' },
      tired: { label: 'Cansado', emoji: '🥱' },
      stressed: { label: 'Estressado', emoji: '⚡' },
    };
    currentMood = {
      mood,
      label: labels[mood].label,
      emoji: labels[mood].emoji,
      energyLevel,
      timestamp: new Date().toISOString(),
    };
    return currentMood;
  },

  async getWeeklyReport(): Promise<WeeklyProgress[]> {
    if (!USE_MOCK) return request('/relatorios/semanal');
    await wait(200);
    return [
      { day: 'Seg', score: 85, completed: true },
      { day: 'Ter', score: 92, completed: true },
      { day: 'Qua', score: 78, completed: true },
      { day: 'Qui', score: 65, completed: false },
      { day: 'Sex', score: 88, completed: true },
      { day: 'Sáb', score: 95, completed: true },
      { day: 'Hoje', score: 82, completed: true },
    ];
  },

  async registerDevice(payload: DeviceRegistration): Promise<void> {
    if (!USE_MOCK) return request('/dispositivos', { method: 'POST', body: JSON.stringify(payload) });
    await wait(100);
  },

  async deleteAccount(): Promise<void> {
    if (!USE_MOCK) return request('/conta', { method: 'DELETE' });
    await wait(600);
  },
};
