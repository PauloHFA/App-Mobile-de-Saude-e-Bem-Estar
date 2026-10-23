import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { AppHeader, Badge, Card, Screen } from '@/components/ui/primitives';
import { AnimatedAvatar } from '@/components/health/AnimatedAvatar';
import { signOutProvider } from '@/services/auth';
import { registerForPush } from '@/services/push';
import { useAuthStore } from '@/store/auth-store';
import { colors, font, radius, spacing } from '@/theme/tokens';

export default function ProfileScreen() {
  const session = useAuthStore((s) => s.session);
  const signOutLocal = useAuthStore((s) => s.signOutLocal);
  const avatarGender = useAuthStore((s) => s.avatarGender);
  const setAvatarGender = useAuthStore((s) => s.setAvatarGender);

  const [pushToken, setPushToken] = useState<string | null>(null);
  const [healthSync, setHealthSync] = useState(true);

  useEffect(() => {
    void registerForPush().then((t) => setPushToken(t));
  }, []);

  if (!session) return null;

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados (LGPD)',
      'Um arquivo seguro criptografado com todos os seus dados biométricos e registros de hábitos será gerado.',
      [{ text: 'Solicitar Download' }, { text: 'Voltar', style: 'cancel' }]
    );
  };

  const handleSignOut = async () => {
    await signOutProvider();
    signOutLocal();
  };

  return (
    <Screen>
      <AppHeader title="Perfil & Conta" subtitle="Configurações, biometria e privacidade" />

      {/* Card de Identidade do Usuário com Avatarzinho Animado */}
      <Card style={styles.userCard}>
        <AnimatedAvatar
          gender={avatarGender}
          size={64}
          showBadge={false}
          onToggleGender={() => setAvatarGender(avatarGender === 'woman' ? 'man' : 'woman')}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
            <Text style={styles.userName}>{session.user.name}</Text>
            <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
          </View>
          <Text style={styles.userEmail}>{session.user.email}</Text>
          <View style={{ flexDirection: 'row', gap: spacing.xs, marginTop: 4 }}>
            <Badge
              label={session.user.provider === 'google' ? 'Google Sign-In' : 'Apple ID'}
              icon={session.user.provider === 'google' ? 'logo-google' : 'logo-apple'}
              color={colors.textSecondary}
              bgColor={colors.surfaceSubtle}
            />
            <Badge label="Nível 3 • Consistente" color={colors.primaryDark} bgColor={colors.primarySoft} />
          </View>
        </View>
      </Card>

      {/* Seletor de Avatar (Mulher / Homem) */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Escolha seu Avatar</Text>
      </View>
      <View style={styles.avatarPickerRow}>
        <Pressable
          onPress={() => setAvatarGender('woman')}
          style={[
            styles.avatarPickCard,
            avatarGender === 'woman' && styles.avatarPickCardActive,
          ]}>
          <AnimatedAvatar gender="woman" size={44} showBadge={false} />
          <Text
            style={[
              styles.avatarPickLabel,
              avatarGender === 'woman' && styles.avatarPickLabelActive,
            ]}>
            Feminino
          </Text>
          {avatarGender === 'woman' && (
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
          )}
        </Pressable>

        <Pressable
          onPress={() => setAvatarGender('man')}
          style={[
            styles.avatarPickCard,
            avatarGender === 'man' && styles.avatarPickCardActive,
          ]}>
          <AnimatedAvatar gender="man" size={44} showBadge={false} />
          <Text
            style={[
              styles.avatarPickLabel,
              avatarGender === 'man' && styles.avatarPickLabelActive,
            ]}>
            Masculino
          </Text>
          {avatarGender === 'man' && (
            <Ionicons name="checkmark-circle" size={16} color="#0284C7" />
          )}
        </Pressable>
      </View>

      {/* Dados Biométricos Rápidos */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Seus Dados de Saúde</Text>
      </View>
      <View style={styles.biometricsRow}>
        <Card style={styles.bioCard}>
          <Text style={styles.bioVal}>68.4 kg</Text>
          <Text style={styles.bioDesc}>Peso atual</Text>
        </Card>
        <Card style={styles.bioCard}>
          <Text style={styles.bioVal}>1.75 m</Text>
          <Text style={styles.bioDesc}>Altura</Text>
        </Card>
        <Card style={styles.bioCard}>
          <Text style={styles.bioVal}>2.000 ml</Text>
          <Text style={styles.bioDesc}>Meta hídrica</Text>
        </Card>
      </View>

      {/* Integrações com Apple Health / Google Fit */}
      <Card style={styles.settingCard}>
        <View style={styles.settingRow}>
          <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
            <Ionicons name="heart" size={20} color="#DC2626" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.settingTitle}>Sincronizar Apple Health / Fit</Text>
            <Text style={styles.settingSub}>Importar passos e sono automaticamente</Text>
          </View>
          <Switch
            value={healthSync}
            onValueChange={setHealthSync}
            trackColor={{ true: colors.primary }}
          />
        </View>
      </Card>

      {/* Lembretes e Push */}
      <Pressable onPress={() => router.push('/lembretes')}>
        <Card style={styles.settingCard}>
          <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="notifications" size={20} color="#D97706" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingTitle}>Lembretes Diários & Notificações</Text>
              <Text style={styles.settingSub}>
                {pushToken ? 'Push ativo • Avisos genéricos de saúde' : 'Configurar horários de lembrete'}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSubtle} />
          </View>
        </Card>
      </Pressable>

      {/* Privacidade & LGPD */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Privacidade & Segurança (LGPD)</Text>
      </View>

      <Card style={styles.lgpdCard}>
        <Pressable onPress={handleExportData} style={styles.menuItem}>
          <Ionicons name="cloud-download-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.menuItemText}>Exportar meus dados (Direito do Titular)</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
        </Pressable>

        <View style={styles.divider} />

        <Pressable
          onPress={() =>
            Alert.alert('Privacidade', 'Seus dados são criptografados em repouso e em trânsito com TLS 1.3.')
          }
          style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.menuItemText}>Termos de Uso e Política de Privacidade</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSubtle} />
        </Pressable>
      </Card>

      {/* Ações de Conta */}
      <View style={{ gap: spacing.sm, marginTop: spacing.xs }}>
        <Button
          label="Sair da Conta"
          variant="outline"
          icon="log-out-outline"
          onPress={handleSignOut}
        />
        <Button
          label="Excluir Minha Conta Permanentemente"
          variant="danger"
          icon="trash-outline"
          onPress={() => router.push('/excluir-conta')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  userCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md + 4,
  },
  userName: {
    ...font.h3,
    color: colors.text,
  },
  userEmail: {
    ...font.caption,
    color: colors.textMuted,
  },
  sectionRow: {
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...font.h3,
    color: colors.text,
  },
  avatarPickerRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  avatarPickCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    padding: spacing.sm,
  },
  avatarPickCardActive: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  avatarPickLabel: {
    ...font.bodyBold,
    fontSize: 14,
    color: '#64748B',
    flex: 1,
  },
  avatarPickLabelActive: {
    color: '#059669',
  },
  biometricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  bioCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: 2,
  },
  bioVal: {
    ...font.h3,
    color: colors.text,
  },
  bioDesc: {
    ...font.small,
    fontSize: 10,
    color: colors.textMuted,
  },
  settingCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    ...font.bodyBold,
    color: colors.text,
  },
  settingSub: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  lgpdCard: {
    backgroundColor: '#FFFFFF',
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  menuItemText: {
    ...font.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.md,
  },
});
