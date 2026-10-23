import React, { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { Button } from '@/components/ui/button';
import { AppHeader, Card, Screen } from '@/components/ui/primitives';
import { formatTime, parseTime } from '@/lib/habits';
import { cancelReminders, scheduleDailyReminder } from '@/services/reminders';
import { colors, font, radius, spacing } from '@/theme/tokens';

export default function RemindersScreen() {
  const [enabled, setEnabled] = useState(true);
  const [morningTime, setMorningTime] = useState(formatTime(8, 0));
  const [nightTime, setNightTime] = useState(formatTime(21, 30));
  const [saving, setSaving] = useState(false);

  async function save() {
    const morning = parseTime(morningTime);
    if (enabled && !morning) {
      Alert.alert('HorÃ¡rio invÃ¡lido', 'Use o formato HH:MM (ex: 08:00).');
      return;
    }
    setSaving(true);
    try {
      if (enabled && morning) {
        const id = await scheduleDailyReminder(morning.hour, morning.minute);
        if (!id) {
          Alert.alert(
            'Lembretes salvos',
            'No navegador/emulador as notificaÃ§Ãµes locais sÃ£o simuladas. Em aparelho real você receberÃ¡ no horÃ¡rio definido.'
          );
        }
      } else {
        await cancelReminders();
      }
      router.back();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <AppHeader
        title="Lembretes DiÃ¡rios"
        subtitle="NotificaÃ§Ãµes gentis e sem expor dados pessoais"
      />

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.iconBox, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="notifications" size={22} color={colors.primaryDark} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Ativar Lembretes</Text>
            <Text style={styles.muted}>Avisos na tela de bloqueio com mensagem neutra.</Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ true: colors.primary }}
          />
        </View>

        {enabled && (
          <View style={styles.timeSection}>
            <View style={styles.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.timeLabel}>â˜€ï¸ Lembrete Matinal</Text>
                <Text style={styles.timeSub}>ComeÃ§ar o dia com hidrataÃ§Ã£o e metas</Text>
              </View>
              <TextInput
                value={morningTime}
                onChangeText={setMorningTime}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                style={styles.timeInput}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.timeRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.timeLabel}>ðŸŒ™ Check-in Noturno</Text>
                <Text style={styles.timeSub}>DescompressÃ£o e preparaÃ§Ã£o para o sono</Text>
              </View>
              <TextInput
                value={nightTime}
                onChangeText={setNightTime}
                keyboardType="numbers-and-punctuation"
                maxLength={5}
                style={styles.timeInput}
              />
            </View>
          </View>
        )}
      </Card>

      <Card style={styles.privacyCard}>
        <Ionicons name="shield-checkmark-outline" size={20} color={colors.primaryDark} />
        <Text style={styles.privacyText}>
          <Text style={{ fontWeight: '700' }}>Regra de Privacidade LGPD:</Text> O corpo da notificaÃ§Ã£o nunca exibe remÃ©dios, sintomas ou diagnÃ³sticos na tela bloqueada.
        </Text>
      </Card>

      <Button
        label="Salvar PreferÃªncias"
        icon="checkmark"
        loading={saving}
        onPress={save}
        style={{ marginTop: spacing.xs }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...font.bodyBold,
    color: colors.text,
  },
  muted: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeSection: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  timeLabel: {
    ...font.bodyBold,
    color: colors.text,
  },
  timeSub: {
    ...font.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  timeInput: {
    width: 80,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    textAlign: 'center',
    ...font.bodyBold,
    color: colors.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
  privacyText: {
    ...font.caption,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 18,
  },
});
