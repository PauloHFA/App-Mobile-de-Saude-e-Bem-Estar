import React, { useState } from 'react';
import { Alert, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/ui/button';
import { AuthCancelledError, signInWithProvider } from '@/services/auth';
import type { AuthProvider } from '@/services/types';
import { useAuthStore } from '@/store/auth-store';
import { colors, font, radius, shadows, spacing } from '@/theme/tokens';

export default function LoginScreen() {
  const setSession = useAuthStore((s) => s.setSession);
  const [loading, setLoading] = useState<AuthProvider | null>(null);

  async function handle(provider: AuthProvider) {
    setLoading(provider);
    try {
      const session = await signInWithProvider(provider);
      await setSession(session);
    } catch (e) {
      if (!(e instanceof AuthCancelledError)) {
        Alert.alert('Não foi possível entrar', 'Verifique sua conexão e tente novamente.');
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <Ionicons name="heart" size={44} color="#FFFFFF" />
        </View>

        <Text style={styles.brandTitle}>Bem-Estar</Text>
        <Text style={styles.brandSubtitle}>
          Sua jornada personalizada de saúde, hábitos diários e equilíbrio mental.
        </Text>

        <View style={styles.pillFeature}>
          <Ionicons name="shield-checkmark" size={15} color={colors.primaryDark} />
          <Text style={styles.pillFeatureText}>Conforme LGPD & Criptografia Ponta-a-Ponta</Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <Button
          label="Continuar com Google"
          variant="outline"
          icon="logo-google"
          loading={loading === 'google'}
          disabled={loading !== null}
          onPress={() => handle('google')}
          style={styles.loginBtn}
        />

        {Platform.OS !== 'android' && (
          <Button
            label="Continuar com Apple"
            variant="dark"
            icon="logo-apple"
            loading={loading === 'apple'}
            disabled={loading !== null}
            onPress={() => handle('apple')}
            style={styles.loginBtn}
          />
        )}

        <View style={styles.legalNotice}>
          <Text style={styles.legalText}>
            Ao acessar você concorda com nossos{' '}
            <Text style={styles.legalLink}>Termos de Serviço</Text> e confirma ter lido nossa{' '}
            <Text style={styles.legalLink}>Política de Privacidade</Text>.
          </Text>
        </View>
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
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 8,
  },
  brandTitle: {
    ...font.title,
    fontSize: 34,
    color: colors.text,
  },
  brandSubtitle: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  pillFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    marginTop: spacing.sm,
  },
  pillFeatureText: {
    ...font.small,
    fontSize: 11,
    color: colors.primaryDark,
  },
  actionsContainer: {
    gap: spacing.sm + 4,
    paddingBottom: spacing.sm,
  },
  loginBtn: {
    ...shadows.sm,
  },
  legalNotice: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  legalText: {
    ...font.small,
    fontSize: 11,
    color: colors.textSubtle,
    textAlign: 'center',
    lineHeight: 16,
  },
  legalLink: {
    color: colors.primaryDark,
    textDecorationLine: 'underline',
  },
});
