import { Platform } from 'react-native';

import { AuthCancelledError } from './auth-errors';
import type { AuthProvider, Session } from './types';

/**
 * Login real: provedor nativo -> Firebase Auth -> ID token -> API.
 * Exige development build (módulos nativos). Os imports são tardios (require)
 * para que o app continue abrindo no Expo Go/web em modo mock.
 *
 * Fluxo (opção B do documento, seção 5.2): o app envia o ID token do Firebase
 * para POST /auth/firebase e recebe a sessão da API.
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';
const USE_MOCK_API = process.env.EXPO_PUBLIC_USE_MOCK !== 'false';

export async function firebaseSignIn(provider: AuthProvider): Promise<Session> {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const auth = require('@react-native-firebase/auth').default;

  let credential;
  if (provider === 'google') {
    const { GoogleSignin, statusCodes } = require('@react-native-google-signin/google-signin');
    GoogleSignin.configure({ webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID });
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const result = await GoogleSignin.signIn();
      const idToken = result?.data?.idToken ?? result?.idToken;
      if (!idToken) throw new AuthCancelledError();
      credential = auth.GoogleAuthProvider.credential(idToken);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === statusCodes.SIGN_IN_CANCELLED) throw new AuthCancelledError();
      throw e;
    }
  } else {
    if (Platform.OS !== 'ios') throw new Error('Sign in with Apple só está disponível no iOS.');
    const AppleAuthentication = require('expo-apple-authentication');
    const Crypto = require('expo-crypto');
    const rawNonce = Crypto.randomUUID();
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, rawNonce);
    try {
      const apple = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });
      if (!apple.identityToken) throw new Error('Apple não retornou identityToken.');
      credential = auth.AppleAuthProvider.credential(apple.identityToken, rawNonce);
    } catch (e: unknown) {
      if ((e as { code?: string })?.code === 'ERR_REQUEST_CANCELED') throw new AuthCancelledError();
      throw e;
    }
  }

  const userCredential = await auth().signInWithCredential(credential);
  const user = userCredential.user;
  const idToken: string = await user.getIdToken();

  if (USE_MOCK_API) {
    return {
      accessToken: idToken,
      user: {
        id: user.uid,
        name: user.displayName ?? 'Usuário',
        email: user.email ?? '',
        provider,
        streakDays: 1,
        level: 'Iniciante',
      },
    };
  }

  const res = await fetch(`${BASE_URL}/auth/firebase`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error('Falha ao autenticar na API.');
  return (await res.json()) as Session;
}

/** Encerra a sessão no Firebase (e no Google, se aplicável). */
export async function firebaseSignOut(): Promise<void> {
  try {
    await require('@react-native-firebase/auth').default().signOut();
  } catch {
    // sem Firebase (mock): nada a fazer
  }
}

/** Remove o usuário do Firebase Auth (parte da exclusão de conta). */
export async function firebaseDeleteUser(): Promise<void> {
  try {
    await require('@react-native-firebase/auth').default().currentUser?.delete();
  } catch {
    // sem Firebase (mock): nada a fazer
  }
}
