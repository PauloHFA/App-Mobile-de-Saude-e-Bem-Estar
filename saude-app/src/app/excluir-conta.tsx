import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/primitives';
import { api } from '@/services/api';
import { deleteProviderUser } from '@/services/auth';
import { useAuthStore } from '@/store/auth-store';
import { colors, font, spacing } from '@/theme/tokens';

export default function DeleteAccountScreen() {
  const signOutLocal = useAuthStore((s) => s.signOutLocal);
  const [loading, setLoading] = useState(false);

  async function confirm() {
    setLoading(true);
    try {
      await api.deleteAccount();
      await deleteProviderUser();
      signOutLocal();
    } catch {
      Alert.alert('Erro ao processar', 'NÃ£o foi possÃ­vel excluir seus dados neste momento. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.iconCircle}>
        <Ionicons name="warning" size={38} color={colors.danger} />
      </View>

      <Text style={styles.title}>ExclusÃ£o de Conta & Dados</Text>

      <Text style={styles.subtitle}>
        Essa operaÃ§Ã£o Ã© permanente e atende Ã s exigÃªncias da LGPD (Art. 18, VI) e das diretrizes da Apple e Google Play.
      </Text>

      <Card style={styles.warningCard}>
        <Text style={styles.warningItem}>â€¢ Todos os seus registros de saúde serÃ£o apagados;</Text>
        <Text style={styles.warningItem}>â€¢ Seu token de notificaÃ§Ãµes FCM/APNs serÃ¡ revogado;</Text>
        <Text style={styles.warningItem}>â€¢ Seu login social no Firebase Auth serÃ¡ desvinculado;</Text>
        <Text style={styles.warningItem}>â€¢ NÃ£o serÃ¡ possÃ­vel recuperar o histÃ³rico de hábitos.</Text>
      </Card>

      <View style={styles.actions}>
        <Button
          label="Sim, Excluir Minha Conta Definitivamente"
          variant="danger"
          icon="trash"
          loading={loading}
          onPress={confirm}
        />
        <Button
          label="Cancelar e Manter Minha Conta"
          variant="outline"
          disabled={loading}
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
    gap: spacing.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.dangerSoft,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...font.title,
    fontSize: 22,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FECACA',
    gap: spacing.xs,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  warningItem: {
    ...font.caption,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});
