export type AuthProvider = 'google' | 'apple';

export type HabitCategory = 'water' | 'movement' | 'mind' | 'sleep' | 'nutrition';

export type MoodType = 'radiant' | 'good' | 'calm' | 'tired' | 'stressed';

export interface User {
  id: string;
  name: string;
  email: string;
  provider: AuthProvider;
  avatarUrl?: string;
  streakDays: number;
  level: string;
}

export interface Session {
  user: User;
  accessToken: string;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: HabitCategory;
  iconName: string; // Ionicons name
  goal: number;
  progress: number;
  unit: string;
  streak: number;
  completedDays: boolean[]; // Últimos 7 dias (Dom a Sáb ou Seg a Dom)
}

export interface DailyMood {
  mood: MoodType;
  label: string;
  emoji: string;
  energyLevel: number; // 1 a 5
  note?: string;
  timestamp: string;
}

export interface HomeSummary {
  greeting: string;
  score: number; // Score de Saúde de 0 a 100
  completedToday: number;
  totalToday: number;
  caloriesBurned: number;
  waterMl: number;
  mindfulMinutes: number;
  streakDays: number;
  tip: {
    title: string;
    description: string;
    category: HabitCategory;
  };
}

export interface WeeklyProgress {
  day: string;
  score: number;
  completed: boolean;
}

export interface DeviceRegistration {
  token: string;
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  locale: string;
}
