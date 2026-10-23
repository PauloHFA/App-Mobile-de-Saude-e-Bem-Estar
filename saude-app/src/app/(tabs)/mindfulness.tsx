import React, { useEffect, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/ui/button';
import { AppHeader, Badge, Card, Screen } from '@/components/ui/primitives';
import { colors, font, radius, spacing } from '@/theme/tokens';

type BreathingPhase = 'Inspire' | 'Segure' | 'Expire' | 'Pausa';

const SOUNDS = [
  { id: 'chuva', title: 'Chuva Suave na Janela', icon: 'rainy' as const, duration: 'Lofi • 45 min' },
  { id: 'floresta', title: 'Floresta ao Amanhecer', icon: 'leaf' as const, duration: 'Pássaros • 30 min' },
  { id: 'ondas', title: 'Ondas do Oceano', icon: 'water' as const, duration: 'Mar Calmo • 60 min' },
  { id: 'vento', title: 'Vento nas Montanhas', icon: 'cloud' as const, duration: 'Relax • 20 min' },
];

export default function MindfulnessScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('Inspire');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [completedSessions, setCompletedSessions] = useState(3);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);

  const [scaleAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setPhase((currPhase) => {
              if (currPhase === 'Inspire') {
                Animated.timing(scaleAnim, { toValue: 1.45, duration: 4000, useNativeDriver: true }).start();
                return 'Segure';
              } else if (currPhase === 'Segure') {
                return 'Expire';
              } else if (currPhase === 'Expire') {
                Animated.timing(scaleAnim, { toValue: 1, duration: 4000, useNativeDriver: true }).start();
                return 'Inspire';
              }
              return 'Inspire';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      Animated.timing(scaleAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    }

    return () => clearInterval(interval);
  }, [isPlaying, scaleAnim]);

  const toggleBreathing = () => {
    if (!isPlaying) {
      setPhase('Inspire');
      setSecondsLeft(4);
      Animated.timing(scaleAnim, { toValue: 1.45, duration: 4000, useNativeDriver: true }).start();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
      setCompletedSessions((s) => s + 1);
    }
  };

  return (
    <Screen>
      <AppHeader
        title="Mindfulness"
        subtitle="Acalme a mente e reduza o estresse diário"
      />

      {/* Box Breathing Interativo */}
      <Card style={styles.breathingCard}>
        <View style={styles.breathingTop}>
          <Badge label="RESPIRAÇÃO GUIADA • 4-4-4" icon="fitness" color="#6D28D9" bgColor="#F5F3FF" />
          <Text style={styles.sessionCount}>
            {completedSessions} sessões concluídas
          </Text>
        </View>

        <View style={styles.breathingVisualArea}>
          <Animated.View
            style={[
              styles.breathingCircleOuter,
              { transform: [{ scale: scaleAnim }] },
            ]}>
            <View style={styles.breathingCircleInner}>
              <Text style={styles.phaseText}>{isPlaying ? phase : 'Pronto?'}</Text>
              <Text style={styles.timerText}>{isPlaying ? `${secondsLeft}s` : 'Iniciar'}</Text>
            </View>
          </Animated.View>
        </View>

        <Text style={styles.instructionText}>
          {isPlaying
            ? phase === 'Inspire'
              ? 'Puxe o ar suavemente pelo nariz...'
              : phase === 'Segure'
                ? 'Mantenha os pulmões cheios de ar...'
                : 'Solte o ar devagar pela boca...'
            : 'Técnica 4-4-4: 4s para inspirar, 4s para reter, 4s para expirar. Reduz a pressão e clareia a mente.'}
        </Text>

        <Button
          label={isPlaying ? 'Pausar Sessão' : 'Começar Respiração (2 min)'}
          variant={isPlaying ? 'outline' : 'primary'}
          icon={isPlaying ? 'pause' : 'play'}
          onPress={toggleBreathing}
          style={{ width: '100%', marginTop: spacing.sm }}
        />
      </Card>

      {/* Paisagens Sonoras / Sons de Relaxamento */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Paisagens Sonoras</Text>
        <Text style={styles.sectionSubtitle}>Para foco ou descanso</Text>
      </View>

      <View style={styles.soundsGrid}>
        {SOUNDS.map((sound) => {
          const isSelected = selectedSound === sound.id;
          return (
            <Pressable
              key={sound.id}
              onPress={() => setSelectedSound(isSelected ? null : sound.id)}
              style={[styles.soundCard, isSelected && styles.soundCardSelected]}>
              <View style={[styles.soundIconCircle, isSelected && styles.soundIconCircleActive]}>
                <Ionicons
                  name={sound.icon}
                  size={22}
                  color={isSelected ? '#FFFFFF' : colors.primaryDark}
                />
              </View>
              <Text style={styles.soundTitle}>{sound.title}</Text>
              <Text style={styles.soundDesc}>{sound.duration}</Text>
              <View style={styles.soundPlayPill}>
                <Ionicons
                  name={isSelected ? 'pause' : 'play'}
                  size={12}
                  color={isSelected ? colors.primaryDark : colors.textMuted}
                />
                <Text style={[styles.soundPlayText, isSelected && { color: colors.primaryDark }]}>
                  {isSelected ? 'Tocando' : 'Ouvir'}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  breathingCard: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  breathingTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionCount: {
    ...font.small,
    color: colors.textMuted,
  },
  breathingVisualArea: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  breathingCircleOuter: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#F5F3FF',
    borderWidth: 2,
    borderColor: '#DDD6FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breathingCircleInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  phaseText: {
    ...font.bodyBold,
    color: '#FFFFFF',
    fontSize: 16,
  },
  timerText: {
    ...font.caption,
    color: '#E9D5FF',
    marginTop: 2,
  },
  instructionText: {
    ...font.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
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
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  soundCard: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  soundCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  soundIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  soundIconCircleActive: {
    backgroundColor: colors.primary,
  },
  soundTitle: {
    ...font.bodyBold,
    fontSize: 14,
    color: colors.text,
  },
  soundDesc: {
    ...font.small,
    fontSize: 11,
    color: colors.textMuted,
  },
  soundPlayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.xs,
  },
  soundPlayText: {
    ...font.small,
    fontSize: 11,
    color: colors.textMuted,
  },
});
