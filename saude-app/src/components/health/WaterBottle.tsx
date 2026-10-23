import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

import { font, radius, spacing } from '@/theme/tokens';

interface WaterBottleProps {
  currentMl: number;
  goalMl: number;
  onAddMl: (ml: number) => void;
  onReset: () => void;
}

export function WaterBottle({ currentMl, goalMl, onAddMl, onReset }: WaterBottleProps) {
  const ratio = Math.max(0, Math.min(1, currentMl / goalMl));
  const heightPercent = Math.round(ratio * 100);

  const handleAdd = (ml: number) => {
    if (Platform.OS !== 'web') {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onAddMl(ml);
  };

  return (
    <View style={styles.container}>
      <View style={styles.bottleRow}>
        {/* Garrafa Visual */}
        <View style={styles.bottleContainer}>
          {/* Tampa */}
          <View style={styles.bottleCap} />
          {/* Gargalo */}
          <View style={styles.bottleNeck} />
          {/* Corpo Principal */}
          <View style={styles.bottleBody}>
            {/* Água Preenchida */}
            <View style={[styles.waterFill, { height: `${heightPercent}%` }]}>
              {/* Brilho da Água */}
              <View style={styles.waterWaveHighlight} />
            </View>

            {/* Marcadores de Volume Gravados na Garrafa */}
            <View style={styles.markersContainer}>
              <View style={styles.markerLine}>
                <Text style={styles.markerText}>2000ml</Text>
              </View>
              <View style={styles.markerLine}>
                <Text style={styles.markerText}>1500ml</Text>
              </View>
              <View style={styles.markerLine}>
                <Text style={styles.markerText}>1000ml</Text>
              </View>
              <View style={styles.markerLine}>
                <Text style={styles.markerText}>500ml</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Informações de Status e Ações */}
        <View style={styles.infoCol}>
          <View>
            <Text style={styles.statusLabel}>NÍVEL DE HIDRATAÇÃO</Text>
            <Text style={styles.currentValText}>
              {currentMl} <Text style={styles.goalValText}>/ {goalMl} ml</Text>
            </Text>
            <Text style={styles.encouragementText}>
              {ratio >= 1
                ? '🎉 Meta diária atingida com perfeição!'
                : ratio >= 0.7
                  ? '💧 Quase lá! Mantenha o corpo hidratado.'
                  : '🌿 Hora de beber mais um gole para manter o foco.'}
            </Text>
          </View>

          {/* Botões Rápidos de Ingestão */}
          <View style={styles.buttonsRow}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar 150ml"
              onPress={() => handleAdd(150)}
              style={styles.addBtn}>
              <Ionicons name="water-outline" size={14} color="#0369A1" />
              <Text style={styles.addBtnText}>+150ml</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar 250ml"
              onPress={() => handleAdd(250)}
              style={[styles.addBtn, styles.addBtnPrimary]}>
              <Ionicons name="water" size={14} color="#0284C7" />
              <Text style={[styles.addBtnText, styles.addBtnTextPrimary]}>+250ml</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Adicionar 500ml"
              onPress={() => handleAdd(500)}
              style={styles.addBtn}>
              <Ionicons name="flask-outline" size={14} color="#0369A1" />
              <Text style={styles.addBtnText}>+500ml</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Zerar"
              onPress={onReset}
              style={styles.resetBtn}>
              <Ionicons name="refresh" size={14} color="#94A3B8" />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  bottleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  bottleContainer: {
    alignItems: 'center',
    width: 80,
  },
  bottleCap: {
    width: 28,
    height: 8,
    backgroundColor: '#0284C7',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  bottleNeck: {
    width: 20,
    height: 8,
    backgroundColor: '#E0F2FE',
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: '#BAE6FD',
  },
  bottleBody: {
    width: 76,
    height: 170,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: '#7DD3FC',
    backgroundColor: '#F0F9FF',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  waterFill: {
    width: '100%',
    backgroundColor: '#0284C7',
    position: 'relative',
  },
  waterWaveHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#38BDF8',
    opacity: 0.8,
  },
  markersContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  markerLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(14, 165, 233, 0.35)',
    paddingBottom: 2,
  },
  markerText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#0369A1',
  },
  infoCol: {
    flex: 1,
    gap: spacing.md,
  },
  statusLabel: {
    ...font.small,
    color: '#0284C7',
    letterSpacing: 0.8,
  },
  currentValText: {
    ...font.title,
    fontSize: 26,
    color: '#0F172A',
    marginTop: 2,
  },
  goalValText: {
    ...font.body,
    color: '#64748B',
  },
  encouragementText: {
    ...font.caption,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  buttonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: spacing.sm + 4,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
  },
  addBtnPrimary: {
    backgroundColor: '#BAE6FD',
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  addBtnText: {
    ...font.small,
    color: '#0369A1',
    fontWeight: '700',
  },
  addBtnTextPrimary: {
    color: '#0284C7',
  },
  resetBtn: {
    padding: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

