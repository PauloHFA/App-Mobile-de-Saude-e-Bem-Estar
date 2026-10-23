import React, { type ReactNode } from 'react';
import {
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from './button';
import { colors, font, radius, shadows, spacing } from '@/theme/tokens';

export function Screen({
  children,
  scroll = true,
  style,
}: {
  children: ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
}) {
  return (
    <SafeAreaView style={[styles.screen, style]} edges={['top']}>
      {scroll ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({
  children,
  style,
  elevated = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevated?: boolean;
}) {
  return (
    <View
      style={[
        styles.card,
        elevated && shadows.sm,
        style,
      ]}>
      {children}
    </View>
  );
}

export function ProgressBar({
  value,
  color = colors.primary,
  trackColor = colors.surfaceSubtle,
  height = 8,
}: {
  value: number;
  color?: string;
  trackColor?: string;
  height?: number;
}) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
      style={[styles.track, { backgroundColor: trackColor, height }]}>
      <View
        style={[
          styles.fill,
          {
            width: `${Math.round(pct * 100)}%`,
            backgroundColor: color,
            height,
          },
        ]}
      />
    </View>
  );
}

export function Badge({
  label,
  icon,
  color = colors.primaryDark,
  bgColor = colors.primarySoft,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  bgColor?: string;
}) {
  return (
    <View style={[styles.badge, { backgroundColor: bgColor }]}>
      {icon && (
        <Ionicons
          name={icon}
          size={12}
          color={color}
          style={{ marginRight: 4 }}
        />
      )}
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function AppHeader({
  title,
  subtitle,
  streak,
}: {
  title: string;
  subtitle?: string;
  streak?: number;
}) {
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        <Text style={styles.headerDate}>
          {todayFormatted.toUpperCase()}
        </Text>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {streak !== undefined && (
        <View style={styles.streakPill}>
          <Ionicons name="flame" size={18} color="#EA580C" />
          <Text style={styles.streakText}>{streak} d</Text>
        </View>
      )}
    </View>
  );
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <Card style={styles.centerCard}>
      <View style={styles.errorIconCircle}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.danger} />
      </View>
      <Text style={styles.heading}>NÃ£o foi possÃ­vel carregar</Text>
      <Text style={styles.muted}>{message}</Text>
      <Button
        label="Tentar novamente"
        variant="secondary"
        onPress={onRetry}
        style={{ marginTop: spacing.sm }}
      />
    </Card>
  );
}

export function SkeletonCard({ height = 96 }: { height?: number }) {
  return (
    <View
      style={[
        styles.card,
        {
          height,
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 0,
          opacity: 0.7,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: Platform.OS === 'web' ? 60 : spacing.xxl,
    gap: spacing.md,
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  track: {
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: radius.pill,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  badgeText: {
    ...font.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  headerDate: {
    ...font.small,
    color: colors.primaryDark,
    marginBottom: 2,
  },
  headerTitle: {
    ...font.title,
    color: colors.text,
  },
  headerSubtitle: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    gap: 4,
    ...shadows.sm,
  },
  streakText: {
    ...font.caption,
    fontWeight: '700',
    color: '#C2410C',
  },
  centerCard: {
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xl,
  },
  errorIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  heading: {
    ...font.h3,
    color: colors.text,
  },
  muted: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
