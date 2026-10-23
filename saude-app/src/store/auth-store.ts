import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';

import type { Session } from '@/services/types';

const SESSION_KEY = 'session';
const ONBOARDED_KEY = 'onboarded';
const GENDER_KEY = 'avatar_gender';

export type AvatarGender = 'woman' | 'man';

export const storage = {
  async get(key: string): Promise<string | null> {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) ?? null;
    return SecureStore.getItemAsync(key);
  },
  async set(key: string, value: string) {
    if (Platform.OS === 'web') return globalThis.localStorage?.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  async remove(key: string) {
    if (Platform.OS === 'web') return globalThis.localStorage?.removeItem(key);
    return SecureStore.deleteItemAsync(key);
  },
};

interface AuthState {
  session: Session | null;
  onboarded: boolean;
  avatarGender: AvatarGender;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSession: (session: Session) => Promise<void>;
  setAvatarGender: (gender: AvatarGender) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  signOutLocal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  onboarded: false,
  avatarGender: 'woman', // padrão Maria Souza
  hydrated: false,
  hydrate: async () => {
    try {
      const [raw, onboarded, gender] = await Promise.all([
        storage.get(SESSION_KEY),
        storage.get(ONBOARDED_KEY),
        storage.get(GENDER_KEY),
      ]);
      set({
        session: raw ? (JSON.parse(raw) as Session) : null,
        onboarded: onboarded === '1',
        avatarGender: (gender as AvatarGender) || 'woman',
        hydrated: true,
      });
    } catch {
      set({ session: null, hydrated: true });
    }
  },
  setSession: async (session) => {
    await storage.set(SESSION_KEY, JSON.stringify(session));
    set({ session });
  },
  setAvatarGender: async (avatarGender) => {
    await storage.set(GENDER_KEY, avatarGender);
    set({ avatarGender });
  },
  completeOnboarding: async () => {
    await storage.set(ONBOARDED_KEY, '1');
    set({ onboarded: true });
  },
  signOutLocal: () => {
    void storage.remove(SESSION_KEY);
    set({ session: null });
  },
}));
