import { signInWithProvider } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';

jest.mock('expo-secure-store', () => {
  const mem = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (k: string) => mem.get(k) ?? null),
    setItemAsync: jest.fn(async (k: string, v: string) => void mem.set(k, v)),
    deleteItemAsync: jest.fn(async (k: string) => void mem.delete(k)),
  };
});

describe('auth (mock)', () => {
  beforeEach(() => useAuthStore.setState({ session: null, onboarded: false, hydrated: false }));

  it('login Google devolve sessão com usuário', async () => {
    const s = await signInWithProvider('google');
    expect(s.user.provider).toBe('google');
    expect(s.accessToken).toBeTruthy();
  });

  it('login Apple devolve sessão com usuário', async () => {
    const s = await signInWithProvider('apple');
    expect(s.user.provider).toBe('apple');
  });

  it('guarda e restaura a sessão', async () => {
    const session = await signInWithProvider('google');
    await useAuthStore.getState().setSession(session);
    useAuthStore.setState({ session: null, hydrated: false });
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().session?.user.id).toBe(session.user.id);
    expect(useAuthStore.getState().hydrated).toBe(true);
  });

  it('sair limpa a sessão', async () => {
    await useAuthStore.getState().setSession(await signInWithProvider('apple'));
    useAuthStore.getState().signOutLocal();
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('onboarding persiste', async () => {
    await useAuthStore.getState().completeOnboarding();
    useAuthStore.setState({ onboarded: false });
    await useAuthStore.getState().hydrate();
    expect(useAuthStore.getState().onboarded).toBe(true);
  });
});

