import React from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/ui/button';
import { AppHeader, Badge, Card, Screen, SkeletonCard } from '@/components/ui/primitives';
import { SleepStagesChart } from '@/components/health/SleepStagesChart';
import { api } from '@/services/api';
import { colors, font, radius, spacing } from '@/theme/tokens';

const ACHIEVEMENTS = [
  { id: '1', title: 'Mente Zen', desc: '10 dias de meditação seguidos', icon: 'leaf' as const, unlocked: true },
  { id: '2', title: 'Hidratação de Ferro', desc: 'Atingiu a meta de água por 5 dias', icon: 'water' as const, unlocked: true },
  { id: '3', title: 'Madrugador', desc: 'Dormiu e acordou no mesmo horário', icon: 'sunny' as const, unlocked: true },
  { id: '4', title: 'Mestre da Rotina', desc: 'Completar 100% de todos os hábitos', icon: 'trophy' as const, unlocked: false },
];

export default function ReportsScreen() {
  const { data: weekly, isLoading } = useQuery({
    queryKey: ['weekly'],
    queryFn: api.getWeeklyReport,
  });

  const handleExport = () => {
    Alert.alert(
      'Exportar Relatório',
      'Seu relatório de saúde dos últimos 30 dias foi compilado em PDF seguro conforme diretrizes da LGPD.',
      [{ text: 'Baixar Relatório' }, { text: 'Cancelar', style: 'cancel' }]
    );
  };

  return (
    <Screen>
      <AppHeader
        title="Sua Evolução"
        subtitle="Métricas, consistência e telemetria de saúde"
      />

      {/* Relatório Detalhado de Estágios do Sono (Estilo Mi Fitness / Apple Health) */}
      <Card style={styles.sleepCard}>
        <SleepStagesChart />
      </Card>

      {/* Gráfico Semanal de Adesão aos Hábitos */}
      {isLoading ? (
        <SkeletonCard height={200} />
      ) : (
        <Card style={styles.chartCard}>
          <View style={styles.chartTop}>
            <View>
              <Text style={styles.chartTitle}>Adesão Semanal</Text>
              <Text style={styles.chartSub}>Média de 85% de metas concluídas</Text>
            </View>
            <Badge label="+12% vs. sem. passada" color={colors.primaryDark} bgColor={colors.primarySoft} />
          </View>

          <View style={styles.barsContainer}>
            {weekly?.map((item) => {
              const heightPct = item.score;
              return (
                <View key={item.day} style={styles.barCol}>
                  <Text style={styles.barScoreText}>{item.score}%</Text>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: `${heightPct}%` },
                        item.day === 'Hoje' && styles.barFillToday,
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayLabel, item.day === 'Hoje' && styles.barDayLabelToday]}>
                    {item.day}
                  </Text>
                </View>
              );
            })}
          </View>
        </Card>
      )}

      {/* Totais Acumulados da Semana */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Totais desta Semana</Text>
      </View>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Ionicons name="water" size={22} color={colors.water} />
          <Text style={styles.statNumber}>17.5 L</Text>
          <Text style={styles.statLabel}>Água consumida</Text>
        </Card>

        <Card style={styles.statBox}>
          <Ionicons name="footsteps" size={22} color={colors.movement} />
          <Text style={styles.statNumber}>48.200</Text>
          <Text style={styles.statLabel}>Passos dados</Text>
        </Card>

        <Card style={styles.statBox}>
          <Ionicons name="leaf" size={22} color={colors.mind} />
          <Text style={styles.statNumber}>55 min</Text>
          <Text style={styles.statLabel}>Mindfulness</Text>
        </Card>

        <Card style={styles.statBox}>
          <Ionicons name="moon" size={22} color={colors.sleep} />
          <Text style={styles.statNumber}>7.4 h</Text>
          <Text style={styles.statLabel}>Média de sono/noite</Text>
        </Card>
      </View>

      {/* Conquistas / Badges */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Conquistas Desbloqueadas</Text>
        <Text style={styles.sectionSubtitle}>3 de 4</Text>
      </View>

      <View style={{ gap: spacing.sm }}>
        {ACHIEVEMENTS.map((ach) => (
          <Card key={ach.id} style={[styles.achCard, !ach.unlocked ? styles.achCardLocked : undefined]}>
            <View
              style={[
                styles.achIcon,
                ach.unlocked ? { backgroundColor: colors.primarySoft } : { backgroundColor: colors.surfaceSubtle },
              ]}>
              <Ionicons
                name={ach.icon}
                size={22}
                color={ach.unlocked ? colors.primary : colors.textSubtle}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.achTitle, !ach.unlocked && { color: colors.textMuted }]}>
                {ach.title}
              </Text>
              <Text style={styles.achDesc}>{ach.desc}</Text>
            </View>
            {ach.unlocked ? (
              <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
            ) : (
              <Ionicons name="lock-closed" size={18} color={colors.textSubtle} />
            )}
          </Card>
        ))}
      </View>

      {/* Exportação LGPD */}
      <Card style={styles.exportCard}>
        <Ionicons name="document-text-outline" size={24} color={colors.primaryDark} />
        <View style={{ flex: 1 }}>
          <Text style={styles.exportTitle}>Relatório para Profissional</Text>
          <Text style={styles.exportDesc}>
            Exporte suas métricas para compartilhar com seu médico ou nutricionista.
          </Text>
        </View>
        <Button label="Exportar" size="sm" variant="secondary" onPress={handleExport} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  sleepCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md + 2,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    gap: spacing.md,
    padding: spacing.md + 4,
  },
  chartTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  chartTitle: {
    ...font.h3,
    color: colors.text,
  },
  chartSub: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingTop: spacing.md,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barScoreText: {
    ...font.small,
    fontSize: 10,
    color: colors.textSubtle,
  },
  barTrack: {
    width: 22,
    height: 110,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: radius.pill,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primaryBorder,
    borderRadius: radius.pill,
  },
  barFillToday: {
    backgroundColor: colors.primary,
  },
  barDayLabel: {
    ...font.small,
    color: colors.textMuted,
  },
  barDayLabelToday: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...font.h3,
    color: colors.text,
  },
  sectionSubtitle: {
    ...font.caption,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statBox: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    gap: spacing.xs,
  },
  statNumber: {
    ...font.h2,
    color: colors.text,
    marginTop: 4,
  },
  statLabel: {
    ...font.caption,
    color: colors.textMuted,
  },
  achCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
  },
  achCardLocked: {
    opacity: 0.6,
  },
  achIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achTitle: {
    ...font.bodyBold,
    color: colors.text,
  },
  achDesc: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  exportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
  exportTitle: {
    ...font.bodyBold,
    color: colors.primaryDark,
  },
  exportDesc: {
    ...font.small,
    color: colors.primaryDark,
    marginTop: 2,
  },
});
