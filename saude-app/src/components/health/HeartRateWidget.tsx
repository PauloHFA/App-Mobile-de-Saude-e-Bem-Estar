import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from '@expo/vector-icons/Ionicons';

import { font, radius, spacing } from '@/theme/tokens';

export function HeartRateWidget() {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.25,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.delay(650),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.leftInfo}>
          <View style={styles.badgeRow}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="heart" size={16} color="#EF4444" />
            </Animated.View>
            <Text style={styles.badgeLabel}>FREQUÊNCIA CARDÍACA</Text>
          </View>
          <Text style={styles.bpmText}>
            72 <Text style={styles.bpmUnit}>BPM</Text>
          </Text>
          <Text style={styles.statusText}>
            Ritmo sinusal regular • VFC 58 ms
          </Text>
        </View>

        <View style={styles.badgeLive}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Há 2 min</Text>
        </View>
      </View>

      {/* Traçado de Onda ECG em SVG */}
      <View style={styles.ecgWrapper}>
        <Svg width="100%" height={38} viewBox="0 0 300 40">
          <Path
            d="M 0 20 L 40 20 L 50 16 L 60 22 L 70 20 L 90 20 L 100 8 L 108 34 L 116 2 L 124 28 L 130 20 L 160 20 L 170 16 L 180 22 L 190 20 L 210 20 L 220 8 L 228 34 L 236 2 L 244 28 L 250 20 L 300 20"
            fill="none"
            stroke="#F43F5E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  leftInfo: {
    gap: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeLabel: {
    ...font.small,
    fontSize: 10,
    color: '#EF4444',
    letterSpacing: 0.6,
  },
  bpmText: {
    ...font.title,
    fontSize: 26,
    color: '#0F172A',
    marginTop: 2,
  },
  bpmUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  statusText: {
    ...font.caption,
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  badgeLive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#DC2626',
  },
  ecgWrapper: {
    marginTop: spacing.xs,
    backgroundColor: '#FFF1F2',
    borderRadius: radius.sm,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: '#FFE4E6',
  },
});
