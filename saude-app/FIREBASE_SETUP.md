# Configuração do Firebase

O app roda em **modo mock** por padrão (Expo Go / web). Para o login real com
Google/Apple e o push real, é preciso um **development build** e um projeto
Firebase. Nada abaixo pôde ser feito automaticamente: depende das suas contas.

## 1. Projeto Firebase
1. Crie o projeto em https://console.firebase.google.com (idealmente um por
   ambiente: dev, homologação, produção).
2. Adicione um app **Android** e um app **iOS** com o identificador definido em
   `app.config.ts` (hoje `br.com.exemplo.bemestar`, troque pelo definitivo).
3. Baixe e coloque na raiz de `saude-app/`:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)
   Eles estão no `.gitignore`.

## 2. Authentication
- Em *Authentication → Sign-in method*, habilite **Google** e **Apple**.
- Google: copie o *Web client ID* para `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
  e cadastre o SHA-1 do build no app Android do Firebase.
- Apple: exige conta Apple Developer, *Sign in with Apple* no App ID e a chave
  configurada no Firebase.

## 3. Push (FCM)
- Android: nada além do `google-services.json`.
- iOS: envie a **chave APNs** em *Project settings → Cloud Messaging*.

## 4. Variáveis (`.env`)
```
EXPO_PUBLIC_USE_MOCK_AUTH=false
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=xxxx.apps.googleusercontent.com
# Quando existir a API real:
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_API_URL=https://api.exemplo.com
```

## 5. Build
```
npx eas-cli@latest login
npx eas-cli@latest build --profile development --platform android
```
Ou localmente: `npx expo run:android` / `npx expo run:ios` (iOS requer macOS).

## Fluxo de autenticação
Provedor nativo → Firebase Auth → ID token → `POST /auth/firebase` na API →
sessão guardada no SecureStore. Ver `src/services/firebase-auth.ts`.

