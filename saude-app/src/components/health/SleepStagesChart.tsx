import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { font, radius, spacing } from '@/theme/tokens';

interface SleepStage {
  name: string;
  duration: string;
  pct: number; // Porcentagem de 0 a 100
  color: string;
  desc: string;
  idealRange: string;
}

export function SleepStagesChart() {
  const stages: SleepStage[] = [
    {
      name: 'Profundo',
      duration: '1h 45m',
      pct: 22,
      color: '#312E81', // Índigo escuro
      desc: 'Recuperação física & imunidade',
      idealRange: '20-25%',
    },
    {
      name: 'REM',
      duration: '2h 00m',
      pct: 26,
      color: '#7C3AED', // Violeta
      desc: 'Memória & restauração mental',
      idealRange: '20-25%',
    },
    {
      name: 'Leve',
      duration: '3h 35m',
      pct: 46,
      color: '#38BDF8', // Azul céu
      desc: 'Descanso e relaxamento motor',
      idealRange: '45-55%',
    },
    {
      name: 'Acordado',
      duration: '25m',
      pct: 6,
      color: '#F59E0B', // Âmbar
      desc: 'Micro-despertares fisiológicos',
      idealRange: '< 10%',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Cabeçalho do Relatório de Sono */}
      <View style={styles.headerRow}>
        <View>
          <View style={styles.badgeRow}>
            <Ionicons name="moon" size={14} color="#6366F1" />
            <Text style={styles.badgeText}>ANÁLISE NOTURNA • ÚLTIMA NOITE</Text>
          </View>
          <Text style={styles.totalHoursText}>
            7h 45m <Text style={styles.scorePillText}>• Score 88 (Excelente)</Text>
          </Text>
          <Text style={styles.timesSubText}>Dormiu às 23:15 • Despertou às 07:00</Text>
        </View>
      </View>

      {/* Barra Cronológica de Fases do Sono (Estilo Mi Fitness / Oura) */}
      <View style={styles.timelineWrapper}>
        <View style={styles.timelineBar}>
          {stages.map((st) => (
            <View
              key={st.name}
              style={[
                styles.stageSegment,
                { width: `${st.pct}%`, backgroundColor: st.color },
              ]}
            />
          ))}
        </View>

        {/* Régua de Horários */}
        <View style={styles.rulerRow}>
          <Text style={styles.rulerText}>23:15</Text>
          <Text style={styles.rulerText}>01:00</Text>
          <Text style={styles.rulerText}>03:00</Text>
          <Text style={styles.rulerText}>05:00</Text>
          <Text style={styles.rulerText}>07:00</Text>
        </View>
      </View>

      {/* Detalhamento dos 4 Estágios */}
      <View style={styles.stagesGrid}>
        {stages.map((st) => (
          <View key={st.name} style={styles.stageCard}>
            <View style={styles.stageTitleRow}>
              <View style={[styles.colorDot, { backgroundColor: st.color }]} />
              <Text style={styles.stageNameText}>{st.name}</Text>
              <Text style={styles.stagePctText}>{st.pct}%</Text>
            </View>
            <Text style={styles.stageDurationText}>{st.duration}</Text>
            <Text style={styles.stageDescText}>{st.desc}</Text>
            <Text style={styles.stageIdealText}>Meta ideal: {st.idealRange}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  badgeText: {
    ...font.small,
    color: '#6366F1',
    letterSpacing: 0.6,
  },
  totalHoursText: {
    ...font.h1,
    fontSize: 24,
    color: '#0F172A',
    marginTop: 2,
  },
  scorePillText: {
    ...font.bodyBold,
    fontSize: 14,
    color: '#10B981',
  },
  timesSubText: {
    ...font.caption,
    color: '#64748B',
    marginTop: 2,
  },
  timelineWrapper: {
    gap: 6,
  },
  timelineBar: {
    height: 22,
    borderRadius: radius.sm,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: '#F1F5F9',
  },
  stageSegment: {
    height: '100%',
  },
  rulerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  rulerText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stagesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  stageCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: spacing.sm + 2,
    gap: 2,
  },
  stageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stageNameText: {
    ...font.small,
    color: '#334155',
    flex: 1,
  },
  stagePctText: {
    ...font.small,
    fontWeight: '800',
    color: '#0F172A',
  },
  stageDurationText: {
    ...font.bodyBold,
    color: '#0F172A',
    marginTop: 2,
  },
  stageDescText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 15,
    marginTop: 1,
  },
  stageIdealText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 3,
  },
});

