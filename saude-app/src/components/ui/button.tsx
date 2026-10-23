import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors, font, radius, shadows, spacing } from '@/theme/tokens';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading,
  disabled,
  style,
}: Props) {
  const isDisabled = disabled || loading;
  const v = variants[variant];
  const s = sizes[size];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          minHeight: s.height,
          paddingHorizontal: s.px,
        },
        variant === 'primary' && shadows.sm,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={v.fg} size="small" />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={s.iconSize}
              color={v.fg}
              style={{ marginRight: spacing.xs + 2 }}
            />
          )}
          <Text style={[styles.label, { color: v.fg, fontSize: s.fontSize }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const variants = {
  primary: { bg: colors.primary, fg: '#FFFFFF', border: colors.primary },
  secondary: { bg: colors.primarySoft, fg: colors.primaryDark, border: colors.primaryBorder },
  outline: { bg: colors.surface, fg: colors.text, border: colors.border },
  dark: { bg: '#0F172A', fg: '#FFFFFF', border: '#0F172A' },
  danger: { bg: colors.danger, fg: '#FFFFFF', border: colors.danger },
  ghost: { bg: 'transparent', fg: colors.textSecondary, border: 'transparent' },
};

const sizes = {
  sm: { height: 38, px: spacing.md, fontSize: 13, iconSize: 16 },
  md: { height: 50, px: spacing.lg, fontSize: 15, iconSize: 18 },
  lg: { height: 56, px: spacing.xl, fontSize: 16, iconSize: 20 },
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...font.bodyBold,
  },
});
