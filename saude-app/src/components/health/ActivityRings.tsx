import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

import { font, radius, spacing } from '@/theme/tokens';

interface RingData {
  current: number;
  goal: number;
  color: string;
  bgColor: string;
  unit: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ActivityRingsProps {
  calories: { current: number; goal: number };
  steps: { current: number; goal: number };
  water: { current: number; goal: number };
}

export function ActivityRings({ calories, steps, water }: ActivityRingsProps) {
  const size = 180;
  const center = size / 2;
  const strokeWidth = 11;

  const rings: RingData[] = [
    {
      current: calories.current,
      goal: calories.goal,
      color: '#F43F5E', // Rosa/Vermelho Calorias
      bgColor: '#FFE4E6',
      unit: 'kcal',
      label: 'Calorias',
      icon: 'flame',
    },
    {
      current: steps.current,
      goal: steps.goal,
      color: '#F59E0B', // Âmbar Movimento/Passos
      bgColor: '#FEF3C7',
      unit: 'passos',
      label: 'Passos',
      icon: 'footsteps',
    },
    {
      current: water.current,
      goal: water.goal,
      color: '#0284C7', // Azul Água
      bgColor: '#E0F2FE',
      unit: 'ml',
      label: 'Água',
      icon: 'water',
    },
  ];

  const radiuses = [70, 53, 36];

  return (
    <View style={styles.container}>
      {/* Gráfico Circular Concéntrico */}
      <View style={styles.svgWrapper}>
        <Svg width={size} height={size}>
          <G transform={`rotate(-90 ${center} ${center})`}>
            {rings.map((r, i) => {
              const radiusVal = radiuses[i];
              const circumference = 2 * Math.PI * radiusVal;
              const ratio = Math.max(0, Math.min(1, r.current / r.goal));
              const strokeDashoffset = circumference * (1 - ratio);

              return (
                <G key={r.label}>
                  {/* Trilha de fundo */}
                  <Circle
                    cx={center}
                    cy={center}
                    r={radiusVal}
                    stroke={r.bgColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                  />
                  {/* Arco de progresso */}
                  <Circle
                    cx={center}
                    cy={center}
                    r={radiusVal}
                    stroke={r.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </G>
              );
            })}
          </G>
        </Svg>
      </View>

      {/* Legenda Lateral no estilo Apple Health / Mi Fitness */}
      <View style={styles.metricsColumn}>
        {rings.map((r) => {
          const pct = Math.round((r.current / r.goal) * 100);
          return (
            <View key={r.label} style={styles.metricRow}>
              <View style={[styles.iconBadge, { backgroundColor: r.bgColor }]}>
                <Ionicons name={r.icon} size={15} color={r.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.labelRow}>
                  <Text style={styles.metricLabel}>{r.label}</Text>
                  <Text style={[styles.metricPct, { color: r.color }]}>{pct}%</Text>
                </View>
                <Text style={styles.metricValue}>
                  <Text style={styles.currentText}>{r.current.toLocaleString('pt-BR')}</Text>
                  <Text style={styles.goalText}> / {r.goal.toLocaleString('pt-BR')} {r.unit}</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  svgWrapper: {
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsColumn: {
    flex: 1,
    gap: spacing.sm + 2,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    ...font.small,
    color: '#64748B',
  },
  metricPct: {
    ...font.small,
    fontWeight: '800',
  },
  metricValue: {
    ...font.caption,
    marginTop: 1,
  },
  currentText: {
    fontWeight: '700',
    color: '#0F172A',
  },
  goalText: {
    color: '#94A3B8',
  },
});

