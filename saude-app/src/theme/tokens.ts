/**
 * Design Tokens Premium para Saúde e Bem-Estar
 * Inspirado nas melhores diretrizes de UI (Apple Health, Headspace, Fabulous, Oura)
 */
export const colors = {
  // Primárias (Esmeralda / Menta sofisticada)
  primary: '#059669',
  primaryDark: '#064E3B',
  primaryLight: '#10B981',
  primarySoft: '#ECFDF5',
  primaryBorder: '#A7F3D0',

  // Categorias de Bem-Estar
  water: '#0284C7',
  waterSoft: '#E0F2FE',
  waterDark: '#0369A1',

  movement: '#EA580C',
  movementSoft: '#FFF7ED',
  movementDark: '#C2410C',

  mind: '#7C3AED',
  mindSoft: '#F5F3FF',
  mindDark: '#6D28D9',

  sleep: '#4F46E5',
  sleepSoft: '#EEF2FF',
  sleepDark: '#4338CA',

  nutrition: '#16A34A',
  nutritionSoft: '#F0FDF4',
  nutritionDark: '#15803D',

  // Superfícies e Neutros (Slate sofisticado)
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  surfaceElevated: '#FFFFFF',

  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textSubtle: '#94A3B8',

  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderDark: '#CBD5E1',

  // Feedback & Alertas
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  warning: '#F59E0B',
  warningSoft: '#FFFBEB',
  success: '#10B981',
  successSoft: '#ECFDF5',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  pill: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const font = {
  title: { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.6 },
  h1: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.4 },
  h2: { fontSize: 20, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.2 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyMedium: { fontSize: 15, fontWeight: '500' as const, lineHeight: 22 },
  bodyBold: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '500' as const },
  small: { fontSize: 11, fontWeight: '600' as const, letterSpacing: 0.3 },
};
