import { AuthCancelledError } from './auth-errors';
import { firebaseDeleteUser, firebaseSignIn, firebaseSignOut } from './firebase-auth';
import type { AuthProvider, Session } from './types';

export { AuthCancelledError };

/**
 * Provedor de autenticação. Com EXPO_PUBLIC_USE_MOCK_AUTH=false usa
 * Firebase Auth (development build); caso contrário, um mock para
 * desenvolvimento em Expo Go/web. Veja FIREBASE_SETUP.md.
 */
const USE_MOCK_AUTH = process.env.EXPO_PUBLIC_USE_MOCK_AUTH !== 'false';

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export async function signInWithProvider(provider: AuthProvider): Promise<Session> {
  if (!USE_MOCK_AUTH) return firebaseSignIn(provider);

  await wait(700);
  const isGoogle = provider === 'google';
  return {
    accessToken: `mock-token-${provider}-${Date.now()}`,
    user: {
      id: `mock-${provider}`,
      name: isGoogle ? 'Maria Souza' : 'João Lima',
      email: isGoogle ? 'maria@example.com' : 'joao@privaterelay.example.com',
      provider,
      streakDays: 7,
      level: 'Nível 3 • Consistente',
    },
  };
}

export async function signOutProvider(): Promise<void> {
  if (!USE_MOCK_AUTH) await firebaseSignOut();
}

export async function deleteProviderUser(): Promise<void> {
  if (!USE_MOCK_AUTH) await firebaseDeleteUser();
}
