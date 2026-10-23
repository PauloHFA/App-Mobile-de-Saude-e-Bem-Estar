import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';

import { Card, ErrorState, Screen, SkeletonCard } from '@/components/ui/primitives';
import { ActivityRings } from '@/components/health/ActivityRings';
import { AnimatedAvatar } from '@/components/health/AnimatedAvatar';
import { Character3D } from '@/components/health/Character3D';
import { HeartRateWidget } from '@/components/health/HeartRateWidget';
import { WaterBottle } from '@/components/health/WaterBottle';
import { WeekCalendarStrip } from '@/components/health/WeekCalendarStrip';
import { api } from '@/services/api';
import { getLiveStepData, type PedometerData } from '@/services/pedometer';
import type { Habit, MoodType } from '@/services/types';
import { useAuthStore } from '@/store/auth-store';
import { colors, font, radius, spacing } from '@/theme/tokens';
import { isHabitDone } from '@/lib/habits';

const MOODS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'radiant', emoji: '🌟', label: 'Radiante' },
  { type: 'good', emoji: '😊', label: 'Bem' },
  { type: 'calm', emoji: '🌿', label: 'Em Paz' },
  { type: 'tired', emoji: '🥱', label: 'Cansado' },
  { type: 'stressed', emoji: '⚡', label: 'Estressado' },
];

export default function HomeScreen() {
  const qc = useQueryClient();
  const session = useAuthStore((s) => s.session);
  const avatarGender = useAuthStore((s) => s.avatarGender);
  const setAvatarGender = useAuthStore((s) => s.setAvatarGender);

  const userName = session?.user.name.split(' ')[0] ?? (avatarGender === 'woman' ? 'Maria' : 'João');

  const [waterMl, setWaterMl] = useState(1500);
  const waterGoalMl = 2000;

  const [pedometer, setPedometer] = useState<PedometerData>({
    steps: 7344,
    goal: 10000,
    calories: 308,
    distanceKm: 5.51,
    isLiveSensor: false,
  });

  useEffect(() => {
    void getLiveStepData().then((data) => setPedometer(data));
  }, []);

  const { data: home, isLoading: loadingHome, isError, error, refetch } = useQuery({
    queryKey: ['home'],
    queryFn: api.getHome,
  });

  const { data: habits } = useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
  });

  const { data: currentMood } = useQuery({
    queryKey: ['mood'],
    queryFn: api.getMood,
  });

  const moodMutation = useMutation({
    mutationFn: (mood: MoodType) => api.setMood(mood),
    onSuccess: (updated) => {
      qc.setQueryData(['mood'], updated);
    },
  });

  const updateHabit = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) => api.updateHabitProgress(id, delta),
    onSuccess: (updated) => {
      qc.setQueryData<Habit[]>(['habits'], (old) => old?.map((h) => (h.id === updated.id ? updated : h)));
      void qc.invalidateQueries({ queryKey: ['home'] });
    },
  });

  const handleAddWater = (ml: number) => {
    setWaterMl((prev) => Math.min(waterGoalMl, prev + ml));
    const waterHabit = habits?.find((h) => h.category === 'water');
    if (waterHabit) {
      updateHabit.mutate({ id: waterHabit.id, delta: 1 });
    }
  };

  const handleResetWater = () => {
    setWaterMl(0);
  };

  const toggleGender = () => {
    void setAvatarGender(avatarGender === 'woman' ? 'man' : 'woman');
  };

  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <Screen>
      {/* Header Premium com Avatar Animado & Notificações */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <AnimatedAvatar
            gender={avatarGender}
            mood={currentMood?.mood ?? 'good'}
            size={54}
            onToggleGender={toggleGender}
          />
          <View>
            <Text style={styles.headerDate}>{todayFormatted.toUpperCase()}</Text>
            <Text style={styles.headerGreeting}>Olá, {userName} 👋</Text>
            <Text style={styles.avatarHint}>Toque no avatar para alternar gênero</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={() => router.push('/lembretes')}
            accessibilityRole="button"
            accessibilityLabel="Notificações"
            style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={22} color="#0F172A" />
            <View style={styles.notifDot} />
          </Pressable>
        </View>
      </View>

      {/* Seletor Semanal de Dias (Strip Calendar) */}
      <WeekCalendarStrip />

      {loadingHome && (
        <>
          <SkeletonCard height={200} />
          <SkeletonCard height={100} />
        </>
      )}

      {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

      {home && (
        <>
          {/* 3 Anéis de Atividade Concéntricos (Mi Fitness / Apple) */}
          <Card style={styles.ringsCard}>
            <View style={styles.ringsHeader}>
              <View>
                <Text style={styles.ringsTitle}>Metas de Atividade</Text>
                <Text style={styles.ringsSub}>
                  {pedometer.isLiveSensor
                    ? '📡 Sensor de passos em tempo real'
                    : '⚡ Sincronizado com seus hábitos de hoje'}
                </Text>
              </View>
              <View style={styles.ringScoreBadge}>
                <Ionicons name="trophy" size={13} color="#059669" />
                <Text style={styles.ringScoreText}>Score {home.score}</Text>
              </View>
            </View>

            <ActivityRings
              calories={{ current: pedometer.calories, goal: 600 }}
              steps={{ current: pedometer.steps, goal: pedometer.goal }}
              water={{ current: waterMl, goal: waterGoalMl }}
            />
          </Card>

          {/* Frequência Cardíaca com Curva ECG em Tempo Real */}
          <Card style={styles.heartCard}>
            <HeartRateWidget />
          </Card>

          {/* Garrafa de Hidratação Interativa com Nível de Água Dinâmico */}
          <Card style={styles.waterCard}>
            <WaterBottle
              currentMl={waterMl}
              goalMl={waterGoalMl}
              onAddMl={handleAddWater}
              onReset={handleResetWater}
            />
          </Card>

          {/* Companheiro 3D Volumétrico & Check-in de Humor */}
          <Card style={styles.characterCard}>
            <View style={styles.characterTopRow}>
              <View>
                <View style={styles.characterBadge}>
                  <Ionicons name="cube" size={12} color="#059669" />
                  <Text style={styles.characterBadgeText}>MASCOTE 3D INTERATIVO</Text>
                </View>
                <Text style={styles.characterTitle}>Seu Companheiro de Hoje</Text>
                <Text style={styles.characterSub}>Toque no boneco ou mude seu humor abaixo</Text>
              </View>

              <Pressable
                onPress={toggleGender}
                style={styles.toggleGenderBtn}
                accessibilityRole="button"
                accessibilityLabel="Alternar gênero do mascote">
                <Ionicons name="swap-horizontal" size={14} color="#047857" />
                <Text style={styles.toggleGenderText}>
                  {avatarGender === 'woman' ? 'Ela' : 'Ele'}
                </Text>
              </Pressable>
            </View>

            {/* Boneco 3D Grande em Palco Flutuante */}
            <Character3D
              gender={avatarGender}
              mood={currentMood?.mood ?? 'good'}
            />

            {/* Seletor de Humor que altera as reações do modelo 3D */}
            <View style={styles.moodSelectorRow}>
              {MOODS.map((m) => {
                const selected = currentMood?.mood === m.type;
                return (
                  <Pressable
                    key={m.type}
                    onPress={() => moodMutation.mutate(m.type)}
                    style={[styles.moodItem, selected && styles.moodItemSelected]}>
                    <Text style={styles.moodEmoji}>{m.emoji}</Text>
                    <Text style={[styles.moodLabel, selected && styles.moodLabelSelected]}>
                      {m.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Destaque / Dica de Saúde com IA */}
          <Card style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <View style={styles.tipBadge}>
                <Ionicons name="sparkles" size={14} color="#7C3AED" />
                <Text style={styles.tipBadgeText}>INSIGHT DE BEM-ESTAR</Text>
              </View>
            </View>
            <Text style={styles.tipTitle}>{home.tip.title}</Text>
            <Text style={styles.tipBody}>{home.tip.description}</Text>
          </Card>

          {/* Hábitos de Hoje (Acesso Rápido) */}
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Hábitos prioritários</Text>
            <Pressable onPress={() => router.push('/(tabs)/habitos')}>
              <Text style={styles.seeAllText}>Ver todos ({habits?.length ?? 0})</Text>
            </Pressable>
          </View>

          {habits?.slice(0, 3).map((h) => {
            const isDone = isHabitDone(h);
            return (
              <Card key={h.id} style={styles.habitCompactCard}>
                <View style={styles.habitCompactRow}>
                  <Pressable
                    onPress={() => updateHabit.mutate({ id: h.id, delta: isDone ? -h.goal : 1 })}
                    style={[styles.checkCircle, isDone && styles.checkCircleDone]}>
                    <Ionicons
                      name={isDone ? 'checkmark' : 'ellipse-outline'}
                      size={20}
                      color={isDone ? '#FFFFFF' : colors.textSubtle}
                    />
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.habitTitle, isDone && styles.habitTitleDone]}>
                      {h.title}
                    </Text>
                    <Text style={styles.habitSub}>
                      {h.progress} de {h.goal} {h.unit} • {h.streak} dias seguidos
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => updateHabit.mutate({ id: h.id, delta: 1 })}
                    style={styles.quickAddBtn}>
                    <Ionicons name="add" size={18} color={colors.primaryDark} />
                  </Pressable>
                </View>
              </Card>
            );
          })}
        </>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerDate: {
    ...font.small,
    fontSize: 10,
    color: '#059669',
    letterSpacing: 0.8,
  },
  headerGreeting: {
    ...font.h1,
    fontSize: 22,
    color: '#0F172A',
  },
  avatarHint: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  ringsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E2E8F0',
    padding: spacing.md + 4,
    gap: spacing.sm,
  },
  ringsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  ringsTitle: {
    ...font.h3,
    color: '#0F172A',
  },
  ringsSub: {
    ...font.caption,
    color: '#64748B',
    marginTop: 1,
  },
  ringScoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  ringScoreText: {
    ...font.small,
    color: '#065F46',
    fontWeight: '700',
  },
  heartCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md + 2,
  },
  waterCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md + 2,
  },
  characterCard: {
    backgroundColor: '#FFFFFF',
    padding: spacing.md,
    gap: spacing.xs,
  },
  characterTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  characterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  characterBadgeText: {
    ...font.small,
    fontSize: 10,
    color: '#059669',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  characterTitle: {
    ...font.h3,
    color: colors.text,
  },
  characterSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  toggleGenderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  toggleGenderText: {
    ...font.small,
    fontSize: 12,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...font.h3,
    color: colors.text,
  },
  moodSubHint: {
    fontSize: 11,
    color: '#94A3B8',
  },
  moodStatusLabel: {
    ...font.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  moodSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  moodItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: 2,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  moodItemSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  moodLabel: {
    ...font.small,
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  tipCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    gap: spacing.xs,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipBadgeText: {
    ...font.small,
    color: '#7C3AED',
    letterSpacing: 0.5,
  },
  tipTitle: {
    ...font.h3,
    color: '#4C1D95',
  },
  tipBody: {
    ...font.body,
    fontSize: 14,
    color: '#5B21B6',
  },
  seeAllText: {
    ...font.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  habitCompactCard: {
    padding: spacing.md,
  },
  habitCompactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkCircleDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  habitTitle: {
    ...font.bodyBold,
    color: colors.text,
  },
  habitTitleDone: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  habitSub: {
    ...font.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  quickAddBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
