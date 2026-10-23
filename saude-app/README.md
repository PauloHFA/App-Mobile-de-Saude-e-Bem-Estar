# 🌿 Bem-Estar — App Mobile de Saúde, Hábitos & Mindfulness

Aplicativo mobile de alto nível para **iOS** e **Android**, desenvolvido em **React Native + Expo SDK 58 + TypeScript**. O projeto combina a telemetria biométrica de líderes mundiais como **Mi Fitness (Xiaomi)** e **Apple Health** com a experiência de mindfulness e hábitos do **Headspace** e **Fabulous**, seguindo rigorosas diretrizes de conformidade com a **LGPD** (Lei Geral de Proteção de Dados).

---

## 📑 Sumário

- [Visão Geral](#-visão-geral)
- [Stack Tecnológica Completa](#-stack-tecnológica-completa)
- [Mapeamento de APIs e Serviços Nativos](#-mapeamento-de-apis-e-serviços-nativos)
- [Funcionalidades e Telas Implementadas](#-funcionalidades-e-telas-implementadas)
- [Arquitetura e Padrões de Projeto](#-arquitetura-e-padrões-de-projeto)
- [Contrato da API REST (Backend Node.js)](#-contrato-da-api-rest-backend-nodejs)
- [Governança e Privacidade (LGPD por Design)](#-governança-e-privacidade-lgpd-por-design)
- [Instalação, Execução e Testes](#-instalação-execução-e-testes)
- [Transição de Mock para Produção](#-transição-de-mock-para-produção)

---

## 🎯 Visão Geral

O projeto foi estruturado para ser uma solução completa de saúde diária:
1. **Monitoramento Ativo:** Anéis concêntricos de atividade, contagem de passos via acelerômetro e garrafa interativa de hidratação.
2. **Sono & Recuperação:** Gráfico cronológico detalhado dos 4 estágios do sono (Profundo, REM, Leve e Acordado) com pontuação de qualidade.
3. **Equilíbrio Mental:** Box Breathing (respiração 4-4-4) guiado e animado em tempo real com paisagens sonoras para foco e relaxamento.
4. **Hábitos & Rotina:** Gestão de hábitos por categoria com histórico visual dos últimos 7 dias da semana e criação personalizada.
5. **Privacidade em Primeiro Lugar:** Sem exposição de dados sensíveis em notificações push, suporte a exportação de dados e fluxo completo de exclusão de conta.

---

## 🛠 Stack Tecnológica Completa

| Camada | Tecnologia | Versão | Justificativa / Uso no Projeto |
|---|---|---|---|
| **Core Framework** | React Native | 0.88.0 | Desenvolvimento mobile multiplataforma nativo. |
| **Plataforma / Runtime** | Expo SDK | ~58.0.17 | Facilidade de compilação, EAS Build na nuvem e módulos nativos modernos. |
| **Linguagem** | TypeScript | ~6.0.3 | Modo estrito (`strict: true`), garantindo tipagem de ponta a ponta. |
| **Roteamento & Navegação** | Expo Router | ~58.0.25 | Roteamento baseado em arquivos com abas nativas e rotas protegidas (`Stack.Protected`). |
| **Estado do Servidor** | TanStack React Query | ^5.104.5 | Gerenciamento de cache, revalidação em segundo plano e estados de carregamento/erro. |
| **Estado Local & Sessão** | Zustand | ^5.0.16 | Store leve e performático para autenticação, onboarding e preferências. |
| **Armazenamento Criptografado** | expo-secure-store | ~58.0.2 | Armazenamento de tokens de sessão no iOS Keychain e Android Keystore. |
| **Gráficos Vetoriais** | react-native-svg | 15.12.1 | Renderização dos 3 Anéis de Atividade concêntricos e da Garrafa com nível d'água. |
| **Sensores de Movimento** | expo-sensors | ~15.0.3 | API `Pedometer` para leitura de passos reais via acelerômetro do smartphone. |
| **Feedback Háptico** | expo-haptics | ~15.0.8 | Vibração tátil sutil ao registrar água, bater metas e interagir com o app. |
| **Notificações & Push** | expo-notifications | ~58.1.6 | Agendamento de lembretes diários locais e captura do token push para registro na API. |
| **Ícones do Sistema** | @expo/vector-icons | ~15.0.3 | Conjunto vetorial oficial `Ionicons` em alta definição em todos os componentes. |
| **Autenticação Nativa** | @react-native-firebase/auth | ^27.0.0 | Autenticação social e vinculação de usuários Google/Apple via Firebase. |
| **Google Sign-In** | @react-native-google-signin/google-signin | ^16.1.5 | Fluxo oficial nativo de autenticação com conta Google. |
| **Apple Sign-In** | expo-apple-authentication | ~58.0.2 | Login nativo Sign in with Apple (obrigatório para submissão na App Store). |
| **Testes Automatizados** | Jest + React Native Testing Library | ^30.5 / ^14.1 | 35 testes cobrindo regras de negócio, cálculos, API mock e componentes acessíveis. |

---

## 📡 Mapeamento de APIs e Serviços Nativos

O aplicativo foi projetado com o princípio da **Arquitetura Desacoplada**: cada recurso de hardware ou backend possui uma interface com fallback inteligente, permitindo rodar tanto em modo mock (web e Expo Go) quanto com módulos nativos (Development Build / EAS).

```
                      ┌────────────────────────────────────────┐
                      │             UI Components              │
                      │  (ActivityRings, WaterBottle, etc.)    │
                      └──────────────────┬─────────────────────┘
                                         │
        ┌────────────────────────────────┼──────────────────────────────┐
        ▼                                ▼                              ▼
┌───────────────┐              ┌───────────────────┐          ┌───────────────────┐
│ expo-sensors  │              │ react-native-svg  │          │   expo-haptics    │
│  (Pedometer)  │              │ (Concentric Rings)│          │ (Tactile Feedback)│
└───────┬───────┘              └───────────────────┘          └───────────────────┘
        │
        ├────────────────────────────────┬──────────────────────────────┐
        ▼                                ▼                              ▼
┌───────────────┐              ┌───────────────────┐          ┌───────────────────┐
│  expo-secure- │              │    expo-notif.    │          │  Firebase Auth /  │
│     store     │              │ (Local Reminders) │          │  API REST Node.js │
└───────────────┘              └───────────────────┘          └───────────────────┘
```

### Detalhamento das APIs Utilizadas:

#### 1. `Pedometer` (`expo-sensors`)
- **Arquivo:** `src/services/pedometer.ts`
- **Uso:** Verifica a disponibilidade do sensor no aparelho via `Pedometer.isAvailableAsync()`. Em dispositivos reais (iOS/Android), faz a leitura dos passos acumulados do dia com `Pedometer.getStepCountAsync(startOfDay, endOfDay)`.
- **Cálculos Derivados:**
  - Calorias Queimadas: `passos * 0.042 kcal`
  - Distância Percorrida: `passos * 0.00075 km`
- **Fallback Web/Simulador:** Estima passos com base no horário do dia para demonstração contínua.

#### 2. `Svg`, `Circle`, `G` (`react-native-svg`)
- **Arquivos:** `src/components/health/ActivityRings.tsx` e `src/components/health/WaterBottle.tsx`
- **Uso:**
  - **ActivityRings:** Desenha 3 anéis concêntricos independentes. Utiliza fórmulas trigonométricas de circunferência (`2 * Math.PI * r`) com `strokeDasharray` e `strokeDashoffset` para animar arcos proporcionais com pontas arredondadas (`strokeLinecap="round"`).
  - **WaterBottle:** Renderiza o corpo ergonômico da garrafa de água com gargalo, tampa, divisórias métricas gravadas e preenchimento dinâmico de líquido azul cristalino.

#### 3. `Haptics` (`expo-haptics`)
- **Arquivo:** `src/components/health/WaterBottle.tsx`
- **Uso:** Dispara micro-vibrações táteis (`Haptics.impactAsync(ImpactFeedbackStyle.Light)`) a cada gole de água registrado (`+150ml`, `+250ml`, `+500ml`), gerando uma resposta física satisfatória ao usuário.

#### 4. `SecureStore` (`expo-secure-store`)
- **Arquivo:** `src/store/auth-store.ts`
- **Uso:** Grava a sessão do usuário (tokens de acesso e identificadores) de forma criptografada no **iOS Keychain** e no **Android Keystore**, garantindo que dados sensíveis não fiquem expostos no `AsyncStorage` comum.

#### 5. `Notifications` (`expo-notifications`)
- **Arquivos:** `src/services/push.ts` e `src/services/reminders.ts`
- **Uso:**
  - **Push Remoto:** Solicita permissões do sistema (`requestPermissionsAsync`) e envia o token do dispositivo para a API (`POST /dispositivos`).
  - **Lembretes Diários Locais:** Configura alarmes diários recorrentes (`scheduleNotificationAsync` com trigger `DAILY`) nos horários definidos pelo usuário (matinal e noturno).
  - **Diretriz de Saúde:** O corpo da notificação nunca contém dados de saúde ou diagnósticos na tela bloqueada.

#### 6. Provedores de Autenticação Social & Firebase
- **Arquivos:** `src/services/auth.ts` e `src/services/firebase-auth.ts`
- **Uso:** Suporta login nativo com Google e Apple. O ID token gerado no Firebase Auth é enviado para a API REST existente via `POST /auth/firebase` (Opção B do documento de requisitos), que valida e retorna o JWT da sessão.

---

## 📱 Funcionalidades e Telas Implementadas

### 1. Onboarding (`src/app/onboarding.tsx`)
- 3 etapas imersivas com cartões visuais temáticos:
  - *Hábitos com Propósito* (hidratação, sono e movimento);
  - *Mente em Equilíbrio* (respiração guiada e mindfulness);
  - *Privacidade Rigorosa* (conformidade com a LGPD).
- Indicador de passos com pílula ativa e botão "Pular" direto.

### 2. Login Social & Acesso (`src/app/login.tsx`)
- Botões oficiais para **Google Sign-In** e **Sign in with Apple**.
- Selo de conformidade com a LGPD e criptografia de ponta a ponta.
- Rotas protegidas via Expo Router: usuários não logados não acessam o miolo do app.

### 3. Aba "Hoje" (`src/app/(tabs)/index.tsx`)
- **Score do Dia (0 a 100):** Cálculo dinâmico de pontuação de saúde com base nas metas atingidas.
- **Avatar Animado Expressivo:** Avatar vetorial personalizado (homem ou mulher) que reage em tempo real ao humor selecionado:
  - *Radiante:* Pula de alegria com escala ampliada;
  - *Bem:* Balança suavemente de um lado para o outro;
  - *Em Paz:* Respiração profunda e ritmo calmo;
  - *Cansado:* Inclinação e ritmo lento;
  - *Estressado:* Vibração rápida de tensão (*shake*).
- **Seletor Semanal de Dias (Strip Calendar):** Linha do tempo horizontal dos 7 dias da semana (Seg a Dom) destacando o dia atual e indicador de metas batidas.
- **Widget de Frequência Cardíaca (ECG):** Monitoramento de 72 BPM com coração pulsante dinâmico e traçado eletrocardiograma em SVG.
- **Os 3 Anéis de Atividade (Mi Fitness / Apple Health):**
  - Anel Vermelho: Calorias ativas queimadas (`308 / 600 kcal`);
  - Anel Âmbar: Passos lidos do sensor real (`7.344 / 10.000 passos`);
  - Anel Azul: Hidratação (`1.500 / 2.000 ml`).
- **Garrafa de Hidratação Interativa:** Visualização do nível de líquido em tempo real com marcadores mililitro e botões de ingestão rápida (`+150ml`, `+250ml`, `+500ml`).
- **Check-in de Humor & Energia:** 5 estados emocionais com resposta imediata e feedback visual no avatar (*Radiante, Bem, Em Paz, Cansado, Estressado*).
- **Insight de Bem-Estar:** Recomendações diárias de micro-pausas.
- **Hábitos Prioritários:** Ações diretas de conclusão com um toque.

### 4. Aba "Hábitos" (`src/app/(tabs)/habitos.tsx`)
- **Filtros por Categoria:** *Todos, 💧 Água, 🏃 Movimento, 🧠 Mente, 🌙 Sono, 🥗 Nutrição*.
- **Histórico Semanal:** Indicadores dos 7 dias da semana (*D, S, T, Q, Q, S, S*) nos próprios cards.
- **Controles Táteis:** Botões de incremento rápido, decremento e botão de conclusão instantânea.
- **Modal de Criação:** Formulário completo para cadastrar novos hábitos personalizados (título, meta diária, unidade e categoria).

### 5. Aba "Mente" (`src/app/(tabs)/mindfulness.tsx`)
- **Box Breathing 4-4-4 Guiado:**
  - Círculo animado com expansão e contração proporcional em tempo real;
  - Cronômetro regressivo com fases dinâmicas (*Inspire, Segure, Expire*);
  - Contador de sessões concluídas.
- **Paisagens Sonoras da Natureza:**
  - *Chuva Suave na Janela, Floresta ao Amanhecer, Ondas do Oceano e Vento nas Montanhas*;
  - Botões de reprodução/pausa para foco e relaxamento.

### 6. Aba "Evolução" (`src/app/(tabs)/relatorios.tsx`)
- **Gráfico de Estágios do Sono (Xiaomi / Oura Ring):**
  - Resumo: 7h 45m de sono, Score 88 (Excelente), horário de dormir e acordar;
  - Timeline cronológica contínua com régua de horários (23:15 → 07:00);
  - Detalhamento das 4 fases: **Sono Profundo (22%)**, **Sono REM (26%)**, **Sono Leve (46%)** e **Acordado (6%)** com comparação com as metas ideais da OMS.
- **Gráfico de Adesão Semanal:** Barras arredondadas com percentuais de cumprimento por dia.
- **Totais Acumulados:** Litros de água consumidos, passos totais, minutos de mindfulness e média de sono.
- **Gamificação:** Badges de conquista (*Mente Zen, Hidratação de Ferro, Madrugador*).
- **Exportação de Relatório (LGPD):** Botão para compilar dados para apresentação a médicos e nutricionistas.

### 7. Aba "Perfil" & Governança (`src/app/(tabs)/perfil.tsx`)
- Identidade visual do usuário com avatar estilizado e provedor de login.
- **Seletor de Avatar:** Escolha entre **Mulher** ou **Homem**, refletindo imediatamente no avatar animado da Home e no cabeçalho do perfil, com persistência no Zustand/SecureStore.
- **Métricas Biométricas:** Peso atual (68.4 kg), altura (1.75 m) e meta de água (2.000 ml).
- **Sincronização Apple Health / Google Fit:** Toggle para importação automática.
- **Central de Notificações:** Atalho para configurar lembretes diários.
- **Direitos do Titular LGPD:** Exportação de dados e exclusão permanente de conta.

---

## 🏗 Arquitetura e Padrões de Projeto

```
saude-app/
├── app.config.ts            Configuração dinâmica do Expo (plugins nativos, Firebase)
├── docs/
│   └── GUIA_IMPLEMENTACAO.md  Manual passo a passo para conectar Firebase real e EAS
├── src/
│   ├── app/                 Rotas do aplicativo (Expo Router)
│   │   ├── _layout.tsx      Stack principal protegida por sessão
│   │   ├── onboarding.tsx   Apresentação inicial
│   │   ├── login.tsx        Entrada social
│   │   ├── lembretes.tsx    Configuração de alarmes diários
│   │   ├── excluir-conta.tsx Fluxo de exclusão e revogação LGPD
│   │   └── (tabs)/          Navegador por abas inferiores
│   │       ├── _layout.tsx  Barra de abas com ícones Ionicons
│   │       ├── index.tsx    Aba "Hoje"
│   │       ├── habitos.tsx  Aba "Hábitos"
│   │       ├── mindfulness.tsx Aba "Mente"
│   │       ├── relatorios.tsx Aba "Evolução"
│   │       └── perfil.tsx   Aba "Perfil"
│   ├── components/
│   │   ├── health/          Componentes de telemetria médica e biométrica
│   │   │   ├── ActivityRings.tsx     Os 3 Anéis concêntricos em SVG
│   │   │   ├── WaterBottle.tsx       Garrafa de água com nível dinâmico
│   │   │   ├── SleepStagesChart.tsx  Gráfico dos estágios do sono
│   │   │   ├── Character3D.tsx       Mascote 3D de grande porte com física e poses
│   │   │   ├── AnimatedAvatar.tsx    Avatar reativo ao humor (Homem / Mulher)
│   │   │   ├── WeekCalendarStrip.tsx Calendário semanal horizontal
│   │   │   └── HeartRateWidget.tsx   Frequência cardíaca (72 BPM) com curva ECG
│   │   └── ui/              Design System (Button, Card, ProgressBar, Badge)
│   ├── lib/
│   │   └── habits.ts        Funções utilitárias e regras de negócio puras
│   ├── services/            Camada de dados, hardware e APIs
│   │   ├── api.ts           Cliente REST e Mock integrado
│   │   ├── auth.ts          Fachada de autenticação (Mock/Firebase)
│   │   ├── firebase-auth.ts Conector nativo Firebase Auth + Google/Apple
│   │   ├── pedometer.ts     Leitor de acelerômetro e contagem de passos
│   │   ├── push.ts          Registro de FCM / APNs
│   │   ├── reminders.ts     Agendamento de notificações locais
│   │   └── types.ts         Tipos TypeScript e modelos de domínio
│   ├── store/
│   │   └── auth-store.ts    Gerenciamento de sessão e persistência no SecureStore
│   ├── theme/
│   │   └── tokens.ts        Design tokens (cores, espaçamentos, tipografia, sombras)
│   └── __tests__/           Suíte de testes automatizados com Jest
```

---

## 🔌 Contrato da API REST (Backend Node.js)

A camada de serviço (`src/services/api.ts`) já está pronta para se conectar ao backend Node.js existente. Basta definir as variáveis de ambiente no arquivo `.env`.

| Método | Endpoint | Descrição / Payload | Resposta Esperada |
|---|---|---|---|
| `POST` | `/auth/firebase` | Troca o `idToken` do Firebase pela sessão da API. | `{ accessToken: string, user: User }` |
| `GET` | `/home` | Retorna o resumo do dia, score e dica ativa. | `HomeSummary` |
| `GET` | `/habitos` | Lista todos os hábitos cadastrados do usuário. | `Habit[]` |
| `PATCH` | `/habitos/:id` | Incrementa/decrementa o progresso (`{ delta: number }`). | `Habit` atualizado |
| `POST` | `/habitos` | Cadastra um novo hábito customizado. | `Habit` criado |
| `GET` | `/humor/hoje` | Obtém o último check-in de humor do dia. | `DailyMood` |
| `POST` | `/humor` | Registra novo humor (`{ mood, energyLevel }`). | `DailyMood` |
| `GET` | `/relatorios/semanal` | Retorna histórico de adesão dos últimos 7 dias. | `WeeklyProgress[]` |
| `POST` | `/dispositivos` | Registra o token push do aparelho (`{ token, platform, appVersion, locale }`). | `204 No Content` |
| `DELETE` | `/conta` | Exclui permanentemente todos os dados do titular. | `204 No Content` |

---

## 🔒 Governança e Privacidade (LGPD por Design)

1. **Dados Pessoais Sensíveis:** Em conformidade com o Art. 5º, II da LGPD, informações de saúde são tratadas com criptografia em repouso no aparelho (Keychain/Keystore) e em trânsito (HTTPS/TLS).
2. **Push Notifications Neutras:** O corpo de mensagens push nunca revela condições clínicas, medicamentos ou sintomas na tela bloqueada do celular (onde terceiros poderiam visualizar).
3. **Direito do Titular (Art. 18, VI da LGPD):** Funcionalidade nativa na aba Perfil para **Exportação Integral dos Dados** e **Exclusão Permanente de Conta**, revogando o token push e deletando registros locais e remotos.
4. **Isolamento de Cache:** Ao efetuar logout, o cache em memória do TanStack Query é limpo instantaneamente, impedindo vazamento de dados entre perfis no mesmo aparelho.

---

## 🚀 Instalação, Execução e Testes

### Pré-requisitos
- Node.js versão 20 ou superior
- npm versão 10 ou superior

### Comandos

```bash
# 1. Navegar até a pasta do aplicativo
cd saude-app

# 2. Instalar as dependências
npm install

# 3. Iniciar o servidor de desenvolvimento (Web / Metro)
npx expo start --web --port 8099
```

- Para visualizar no **Navegador:** Pressione `w` no terminal ou acesse `http://localhost:8099`.
- Para visualizar no **Celular:** Instale o aplicativo **Expo Go** e escaneie o QR Code exibido no terminal.

### Comandos de Qualidade de Código

```bash
# Executar todos os testes automatizados (Jest)
npm test

# Verificação rigorosa de tipos TypeScript (Zero erros)
npx tsc --noEmit

# Análise de linting do projeto
npx expo lint
```

---

## 🔄 Transição de Mock para Produção

O aplicativo roda **100% funcional em modo mock por padrão**. Quando for conectar ao backend real e ao Firebase definitivo:

1. Crie o arquivo `saude-app/.env`:
```env
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_USE_MOCK_AUTH=false
EXPO_PUBLIC_API_URL=https://sua-api.com.br
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=seu-id.apps.googleusercontent.com
```

2. Adicione os arquivos de configuração do Firebase baixados do console na raiz de `saude-app/`:
   - `google-services.json` (Android)
   - `GoogleService-Info.plist` (iOS)

3. Consulte o passo a passo completo no manual dedicado: [`docs/GUIA_IMPLEMENTACAO.md`](docs/GUIA_IMPLEMENTACAO.md).

---

## 👤 Autor & Desenvolvimento

<table>
  <tr>
    <td align="center" width="180">
      <a href="https://github.com/PauloHFA">
        <img src="https://github.com/PauloHFA.png" width="96" style="border-radius: 50%;" alt="Paulo Henrique"/><br />
        <sub><b>Paulo Henrique</b></sub>
      </a><br />
      <sub>Lead Developer & Arquitetura de Software</sub>
    </td>
  </tr>
</table>

- **Desenvolvimento & Arquitetura:** [Paulo Henrique (@PauloHFA)](https://github.com/PauloHFA)
- **Pair Programming & Assistência Técnica:** Antigravity (Google DeepMind)

---

## 📄 Licença

Este projeto é desenvolvido para fins profissionais e portfólio de engenharia de software mobile. Todos os direitos reservados.
