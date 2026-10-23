# Guia de implementação: o que falta

Três etapas, nesta ordem. Cada uma tem **checklist** e **como validar**.
Tempo estimado: 2 a 4 horas, sem contar a espera pelo build e as contas de desenvolvedor.

> As interfaces e menus do Firebase, Apple e Google mudam com frequência.
> Se algum nome abaixo estiver diferente na tela, siga a intenção do passo.

## Pré-requisitos

- Conta Google (Firebase) e conta Expo gratuita (https://expo.dev)
- Node.js 20+ (já instalado)
- Para **Android local**: Android Studio + um emulador ou aparelho com depuração USB
- Para **iOS**: Mac com Xcode **ou** build na nuvem via EAS, e uma conta **Apple Developer** (paga)
- Para **Sign in with Apple**: a conta Apple Developer é obrigatória

---

## Etapa 1: Criar o projeto Firebase e baixar os arquivos de configuração

### 1.1 Decida o identificador do app (antes de criar nada)
O Firebase vincula os arquivos de configuração a um identificador. **Trocar depois dá retrabalho**,
então faça a Etapa 2 (identificador) primeiro ou ao mesmo tempo.
Formato recomendado: domínio invertido, tudo minúsculo, sem hífen. Exemplo: `br.com.suaempresa.bemestar`.

### 1.2 Criar o projeto
1. Abra https://console.firebase.google.com e clique em **Adicionar projeto**.
2. Nome sugerido: `bem-estar-dev`. (Idealmente um projeto por ambiente: `-dev`, `-hml`, `-prod`.)
3. Google Analytics: pode **desativar** por ora. O documento do projeto pede cuidado com dados de saúde em analytics.

### 1.3 Registrar o app Android
1. Na visão geral do projeto, clique no ícone **Android**.
2. **Nome do pacote:** o mesmo identificador da Etapa 2.
3. **Certificado SHA-1:** necessário para o login com Google. Para desenvolvimento:
   ```bash
   cd saude-app
   npx expo prebuild --platform android   # gera a pasta android/ (necessário uma vez)
   cd android && ./gradlew signingReport    # no Windows: gradlew.bat signingReport
   ```
   Copie o **SHA-1** da variante `debug`. Se usar EAS, pegue o SHA-1 com `npx eas-cli credentials`.
4. Baixe o **`google-services.json`** e salve em `saude-app/google-services.json`.

### 1.4 Registrar o app iOS
1. Clique no ícone **iOS** (ou **Adicionar app**).
2. **ID do pacote:** o mesmo identificador da Etapa 2.
3. Baixe o **`GoogleService-Info.plist`** e salve em `saude-app/GoogleService-Info.plist`.

> Os dois arquivos já estão no `.gitignore`. **Não versione.**
> Sem eles, o `app.config.ts` simplesmente não os referencia e o build do Firebase falha com mensagem clara.

### 1.5 Ativar a autenticação
1. Firebase → **Authentication** → **Começar**.
2. Aba **Sign-in method**:
   - **Google:** ativar, escolher e-mail de suporte, salvar. Depois abra o provedor e copie o **ID do cliente da Web** (*Web client ID*).
   - **Apple:** ativar (exige a configuração da Etapa 1.7).
3. Crie o arquivo `saude-app/.env`:
   ```
   EXPO_PUBLIC_USE_MOCK_AUTH=false
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=COLE_AQUI.apps.googleusercontent.com
   ```

### 1.6 Ativar push (FCM)
- **Android:** nada além do `google-services.json`. Em Android 13+, o app já pede a permissão `POST_NOTIFICATIONS`.
- **iOS:** em **Configurações do projeto → Cloud Messaging → Configuração do app Apple**, envie a **chave APNs (.p8)**.
  Para gerar: Apple Developer → *Certificates, Identifiers & Profiles* → *Keys* → nova chave com **Apple Push Notifications service (APNs)**. Anote o *Key ID* e o *Team ID*.

### 1.7 Sign in with Apple (somente iOS)
1. Apple Developer → *Identifiers* → seu App ID → habilite **Sign in with Apple** e **Push Notifications**.
2. No Firebase → Authentication → Apple, informe *Service ID*, *Team ID*, *Key ID* e a chave `.p8`. (Para app nativo iOS, o *Service ID* pode ser opcional. Confirme na tela atual.)
3. `usesAppleSignIn: true` já está no `app.config.ts`.

### Como validar a Etapa 1
- [ ] Existem `google-services.json` e `GoogleService-Info.plist` na raiz de `saude-app/`
- [ ] `git status` **não** lista esses arquivos
- [ ] `.env` tem `EXPO_PUBLIC_USE_MOCK_AUTH=false` e o *Web client ID*
- [ ] Authentication mostra Google (e Apple, se iOS) como **Ativado**

---

## Etapa 2: Trocar o identificador provisório

Hoje o identificador é `br.com.exemplo.bemestar`, definido **em dois lugares** de [`app.config.ts`](../app.config.ts):

```ts
ios:     { bundleIdentifier: 'br.com.exemplo.bemestar', ... }
android: { package:          'br.com.exemplo.bemestar', ... }
```

1. Escolha o identificador definitivo (ver 1.1). Se for um app do cliente, use o domínio dele.
2. Substitua nos dois pontos acima. Os dois podem ser iguais.
3. Se já gerou a pasta `android/` ou `ios/`, apague e gere de novo:
   ```bash
   npx expo prebuild --clean
   ```
4. Confirme que o identificador dos arquivos do Firebase (Etapa 1) é o **mesmo**.

> **Atenção:** o identificador não pode mudar depois da publicação nas lojas.
> Defina com o cliente antes de publicar.

### Como validar
- [ ] `npx expo config --type public` mostra o identificador novo em `ios.bundleIdentifier` e `android.package`
- [ ] O nome do pacote no `google-services.json` é igual ao do `app.config.ts`

---

## Etapa 3: Gerar o development build

O Expo Go **não** carrega os módulos nativos do Firebase e do Google Sign-In.
É preciso um *development build*: uma versão do app com esses módulos, que continua conectando ao servidor de desenvolvimento.

### Opção A: EAS Build, na nuvem (recomendada; não exige Android Studio nem Mac)

```bash
npm install -g eas-cli          # ou use: npx eas-cli@latest <comando>
eas login
cd saude-app
eas build:configure             # cria eas.json
```

Edite o `eas.json` e garanta um perfil de desenvolvimento:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

Instale o cliente de desenvolvimento e gere o build:
```bash
npx expo install expo-dev-client
eas build --profile development --platform android
```
- Ao final, o EAS mostra um **link/QR code**. Abra no celular Android e instale o `.apk`.
- **iOS:** `eas build --profile development --platform ios` exige conta Apple Developer. O EAS registra seu aparelho (`eas device:create`).

Variáveis do `.env` **não vão** automaticamente para o build na nuvem. Cadastre-as:
```bash
eas env:create --name EXPO_PUBLIC_USE_MOCK_AUTH --value false --environment development
eas env:create --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "SEU_ID" --environment development
```
E os arquivos do Firebase (que estão fora do Git) precisam ser enviados como *file secrets*:
```bash
eas env:create --name GOOGLE_SERVICES_JSON --type file --value ./google-services.json --environment development
```
Faça o mesmo para o iOS (`GOOGLE_SERVICE_INFO_PLIST`, apontando para o `GoogleService-Info.plist`).
O `app.config.ts` já lê essas duas variáveis; quando elas não existem, usa os arquivos locais da raiz.

### Opção B: Local no Android (`expo run:android`)

Pré-requisitos: Android Studio, SDK instalado, `ANDROID_HOME` configurado, emulador ou aparelho conectado (`adb devices`).
```bash
cd saude-app
npx expo install expo-dev-client
npx expo run:android
```
O primeiro build é demorado (10 a 20 min). Depois, `npx expo start --dev-client` basta.

### Opção C: Local no iOS
Somente em **macOS** com Xcode: `npx expo run:ios`.

### Como validar (no aparelho real)
- [ ] O app abre e mostra o onboarding
- [ ] **Continuar com Google** abre a seleção de conta do Google e volta logado
- [ ] No Firebase → Authentication → **Users**, o usuário aparece
- [ ] Cancelar o seletor do Google volta ao login **sem erro**
- [ ] Perfil → notificações mostram **"Ativadas neste dispositivo"**
- [ ] Firebase → Messaging → *Enviar mensagem de teste* para o token chega ao aparelho
- [ ] (iOS) **Continuar com Apple** funciona
- [ ] Excluir conta remove o usuário em Authentication → Users

---

## Problemas comuns

| Sintoma | Causa provável | Solução |
|---|---|---|
| Google: `DEVELOPER_ERROR` | SHA-1 não cadastrado, ou pacote diferente | Cadastre o SHA-1 do build e confira o nome do pacote |
| Google: `idToken` vazio | *Web client ID* errado | Use o ID do tipo **Web** do Authentication, não o do Android |
| Build iOS falha com Firebase | Falta `useFrameworks: 'static'` | Já está em `app.config.ts` (`expo-build-properties`) |
| `No Firebase App '[DEFAULT]'` | `google-services.json` ausente no build | Cheque o arquivo e, no EAS, o *file secret* |
| Push não chega no iOS | Chave APNs não enviada, ou simulador | Envie a chave `.p8`; teste em aparelho real |
| Push não chega no Android 13+ | Permissão negada | Reinstale ou ative em Configurações do aparelho |
| App abre no Expo Go e quebra no login real | Módulo nativo no Expo Go | Use o development build |

## Depois dessas etapas (próximos passos)
1. Apontar para a API real: `EXPO_PUBLIC_USE_MOCK=false` e `EXPO_PUBLIC_API_URL`.
2. Pedir ao cliente o Figma, a documentação da API e o ambiente de homologação.
3. Substituir os tokens provisórios pelos do Figma.
4. Crashlytics, política de privacidade, CI e publicação (ver o documento do projeto, seções 9 e 14).
