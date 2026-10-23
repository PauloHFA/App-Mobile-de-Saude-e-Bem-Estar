import fs from 'fs';
import path from 'path';

import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Configuração dinâmica. Estende o app.json e adiciona Firebase.
 * Os arquivos google-services.json (Android) e GoogleService-Info.plist (iOS)
 * vêm do console do Firebase e NÃO são versionados (veja .gitignore).
 * Veja FIREBASE_SETUP.md.
 */
const androidFile = process.env.GOOGLE_SERVICES_JSON ?? './google-services.json';
const iosFile = process.env.GOOGLE_SERVICE_INFO_PLIST ?? './GoogleService-Info.plist';
const has = (f: string) => path.isAbsolute(f) || fs.existsSync(path.resolve(__dirname, f));

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Bem-Estar',
  slug: 'saude-app',
  ios: {
    ...config.ios,
    bundleIdentifier: 'br.com.exemplo.bemestar', // TODO: trocar pelo ID real do cliente
    usesAppleSignIn: true,
    ...(has(iosFile) ? { googleServicesFile: iosFile } : {}),
  },
  android: {
    ...config.android,
    package: 'br.com.exemplo.bemestar', // TODO: trocar pelo ID real do cliente
    ...(has(androidFile) ? { googleServicesFile: androidFile } : {}),
  },
  plugins: [
    ...(config.plugins ?? []),
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-google-signin/google-signin',
    'expo-apple-authentication',
    ['expo-build-properties', { ios: { useFrameworks: 'static' } }],
  ],
});

