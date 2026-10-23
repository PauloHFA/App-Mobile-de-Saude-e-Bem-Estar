import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';
import { colors, font, spacing } from '@/theme/tokens';

const SLIDES = [
  {
    icon: 'heart-circle' as const,
    color: colors.primary,
    bgColor: colors.primarySoft,
    title: 'Hábitos com Propósito',
    subtitle: 'Hidratação, sono e movimento',
    text: 'Acompanhe metas diárias que realmente transformam sua vitalidade física e disposição mental.',
  },
  {
    icon: 'sparkles' as const,
    color: colors.mind,
    bgColor: colors.mindSoft,
    title: 'Mente em Equilíbrio',
    subtitle: 'Respiração & Mindfulness guiados',
    text: 'Técnicas de descompressão rápida para diminuir a ansiedade, aumentar o foco e relaxar.',
  },
  {
    icon: 'shield-checkmark' as const,
    color: '#0284C7',
    bgColor: '#E0F2FE',
    title: 'Privacidade Rigorosa',
    subtitle: 'Conformidade total com a LGPD',
    text: 'Seus dados de saúde são pessoais e sensíveis. Armazenamento seguro e sob seu controle.',
  },
];

export default function OnboardingScreen() {
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding);
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index];
  const last = index === SLIDES.length - 1;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <View style={styles.brandRow}>
          <Ionicons name="leaf" size={20} color={colors.primary} />
          <Text style={styles.brandName}>Bem-Estar</Text>
        </View>
        {!last && (
          <Button
            label="Pular"
            variant="ghost"
            size="sm"
            onPress={() => completeOnboarding()}
          />
        )}
      </View>

      <View style={styles.hero}>
        <View style={[styles.badge, { backgroundColor: slide.bgColor }]}>
          <Ionicons name={slide.icon} size={64} color={slide.color} />
        </View>

        <Text style={styles.categorySub}>{slide.subtitle.toUpperCase()}</Text>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.text}>{slide.text}</Text>

        <View style={styles.dotsRow} accessibilityLabel={`Passo ${index + 1} de ${SLIDES.length}`}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </View>

      <View style={styles.bottomActions}>
        <Button
          label={last ? 'Começar Minha Jornada' : 'Avançar'}
          icon={last ? 'arrow-forward' : undefined}
          onPress={() => (last ? completeOnboarding() : setIndex(index + 1))}
          style={{ width: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    ...font.bodyBold,
    color: colors.primaryDark,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  badge: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  categorySub: {
    ...font.small,
    color: colors.primaryDark,
    letterSpacing: 1,
  },
  title: {
    ...font.title,
    color: colors.text,
    textAlign: 'center',
  },
  text: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.borderDark,
  },
  dotActive: {
    width: 28,
    backgroundColor: colors.primary,
  },
  bottomActions: {
    paddingBottom: spacing.sm,
  },
});
