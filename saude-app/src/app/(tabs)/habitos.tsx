import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Button } from '@/components/ui/button';
import {
  AppHeader,
  Badge,
  Card,
  ErrorState,
  ProgressBar,
  Screen,
  SkeletonCard,
} from '@/components/ui/primitives';
import { api } from '@/services/api';
import type { Habit, HabitCategory } from '@/services/types';
import { colors, font, radius, spacing } from '@/theme/tokens';
import { getCategoryTheme, habitRatio, isHabitDone } from '@/lib/habits';

const CATEGORIES: { key: HabitCategory | 'all'; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'Todos', icon: 'apps' },
  { key: 'water', label: 'Água', icon: 'water' },
  { key: 'movement', label: 'Movimento', icon: 'walk' },
  { key: 'mind', label: 'Mente', icon: 'leaf' },
  { key: 'sleep', label: 'Sono', icon: 'moon' },
  { key: 'nutrition', label: 'Nutrição', icon: 'restaurant' },
];

const DAYS_OF_WEEK = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function HabitsScreen() {
  const qc = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form de novo hábito
  const [newTitle, setNewTitle] = useState('');
  const [newGoal, setNewGoal] = useState('8');
  const [newUnit, setNewUnit] = useState('copos');
  const [newCategory, setNewCategory] = useState<HabitCategory>('water');

  const { data: habits, isLoading, isError, error, refetch, isRefetching } = useQuery({
    queryKey: ['habits'],
    queryFn: api.getHabits,
  });

  const updateHabit = useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) => api.updateHabitProgress(id, delta),
    onSuccess: (updated) => {
      qc.setQueryData<Habit[]>(['habits'], (old) => old?.map((h) => (h.id === updated.id ? updated : h)));
      void qc.invalidateQueries({ queryKey: ['home'] });
    },
  });

  const createHabit = useMutation({
    mutationFn: (newHabit: Omit<Habit, 'id' | 'streak' | 'completedDays' | 'progress'>) =>
      api.addHabit(newHabit),
    onSuccess: (created) => {
      qc.setQueryData<Habit[]>(['habits'], (old) => [created, ...(old ?? [])]);
      void qc.invalidateQueries({ queryKey: ['home'] });
      setModalOpen(false);
      setNewTitle('');
    },
  });

  const filteredHabits = habits?.filter((h) =>
    selectedCategory === 'all' ? true : h.category === selectedCategory
  );

  const handleSaveHabit = () => {
    if (!newTitle.trim()) return;
    createHabit.mutate({
      title: newTitle.trim(),
      description: 'Hábito personalizado da sua rotina diária',
      category: newCategory,
      iconName: getCategoryTheme(newCategory).icon,
      goal: Number(newGoal) || 1,
      unit: newUnit.trim() || 'vezes',
    });
  };

  return (
    <Screen>
      <View style={styles.topHeader}>
        <AppHeader
          title="Hábitos & Rotina"
          subtitle="Consistência diária para grandes resultados"
        />
        <Button
          label="Novo"
          icon="add"
          size="sm"
          onPress={() => setModalOpen(true)}
          style={styles.addBtn}
        />
      </View>

      {/* Categorias / Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}>
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <Pressable
              key={cat.key}
              onPress={() => setSelectedCategory(cat.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}>
              <Ionicons
                name={cat.icon}
                size={15}
                color={active ? '#FFFFFF' : colors.textMuted}
              />
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading && (
        <>
          <SkeletonCard height={120} />
          <SkeletonCard height={120} />
          <SkeletonCard height={120} />
        </>
      )}

      {isError && <ErrorState message={error.message} onRetry={() => refetch()} />}

      {filteredHabits?.length === 0 && (
        <Card style={styles.emptyCard}>
          <Ionicons name="sparkles-outline" size={42} color={colors.primary} />
          <Text style={styles.emptyTitle}>Nenhum hábito nesta categoria</Text>
          <Text style={styles.emptyText}>
            Adicione um novo hábito ou selecione outra categoria para acompanhar.
          </Text>
          <Button
            label="Criar primeiro hábito"
            size="sm"
            onPress={() => setModalOpen(true)}
            style={{ marginTop: spacing.xs }}
          />
        </Card>
      )}

      {filteredHabits?.map((h) => {
        const theme = getCategoryTheme(h.category);
        const done = isHabitDone(h);
        const ratio = habitRatio(h);

        return (
          <Card key={h.id} style={[styles.habitCard, done ? styles.habitCardDone : undefined]}>
            <View style={styles.cardHeaderRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.bg }]}>
                <Ionicons name={theme.icon} size={22} color={theme.color} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.categoryRow}>
                  <Text style={[styles.categoryTag, { color: theme.color }]}>
                    {theme.label.toUpperCase()}
                  </Text>
                  {h.streak > 0 && (
                    <View style={styles.streakTag}>
                      <Ionicons name="flame" size={13} color="#EA580C" />
                      <Text style={styles.streakText}>{h.streak} dias</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.habitTitle}>{h.title}</Text>
                <Text style={styles.habitDesc}>{h.description}</Text>
              </View>
            </View>

            {/* Barra de Progresso com Métricas */}
            <View style={styles.progressSection}>
              <View style={styles.metricRow}>
                <Text style={styles.progressText}>
                  <Text style={styles.progressCurrent}>{h.progress}</Text> / {h.goal} {h.unit}
                </Text>
                {done ? (
                  <Badge label="META CONCLUÍDA" icon="checkmark" color={colors.primaryDark} bgColor={colors.primarySoft} />
                ) : (
                  <Text style={styles.pctText}>{Math.round(ratio * 100)}%</Text>
                )}
              </View>
              <ProgressBar value={ratio} color={theme.color} height={8} />
            </View>

            {/* Histórico Semanal de Dias */}
            <View style={styles.weekGrid}>
              {DAYS_OF_WEEK.map((d, index) => {
                const isDayDone = h.completedDays[index];
                const isToday = index === 6; // último dia
                return (
                  <View key={index} style={styles.dayCol}>
                    <Text style={[styles.dayLetter, isToday && styles.todayLetter]}>{d}</Text>
                    <View
                      style={[
                        styles.dayCircle,
                        isDayDone && { backgroundColor: theme.color },
                        isToday && !isDayDone && styles.todayCircleBorder,
                      ]}>
                      {isDayDone && <Ionicons name="checkmark" size={11} color="#FFFFFF" />}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Controles de Ação (+ / -) */}
            <View style={styles.actionsRow}>
              <Pressable
                accessibilityLabel="Diminuir"
                disabled={h.progress <= 0}
                onPress={() => updateHabit.mutate({ id: h.id, delta: -1 })}
                style={[styles.stepBtn, h.progress <= 0 && styles.stepBtnDisabled]}>
                <Ionicons name="remove" size={20} color={colors.textSecondary} />
              </Pressable>

              <Pressable
                accessibilityLabel="Aumentar"
                onPress={() => updateHabit.mutate({ id: h.id, delta: 1 })}
                style={[styles.stepBtn, styles.stepBtnPrimary, { backgroundColor: theme.bg }]}>
                <Ionicons name="add" size={22} color={theme.color} />
                <Text style={[styles.stepBtnLabel, { color: theme.color }]}>Adicionar</Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Completar tudo"
                onPress={() => updateHabit.mutate({ id: h.id, delta: h.goal - h.progress })}
                style={[styles.stepBtn, done && { backgroundColor: colors.primarySoft }]}>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'checkmark-circle-outline'}
                  size={20}
                  color={done ? colors.primary : colors.textMuted}
                />
              </Pressable>
            </View>
          </Card>
        );
      })}

      {isRefetching && <Text style={styles.syncText}>Sincronizando seus hábitos…</Text>}

      {/* Modal para Adicionar Novo Hábito */}
      <Modal visible={modalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Novo Hábito</Text>
              <Pressable onPress={() => setModalOpen(false)}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </Pressable>
            </View>

            <View style={{ gap: spacing.sm }}>
              <Text style={styles.label}>Nome do Hábito</Text>
              <TextInput
                placeholder="Ex: Alongamento matinal"
                value={newTitle}
                onChangeText={setNewTitle}
                style={styles.input}
              />

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Meta Diária</Text>
                  <TextInput
                    placeholder="Ex: 15"
                    keyboardType="numeric"
                    value={newGoal}
                    onChangeText={setNewGoal}
                    style={styles.input}
                  />
                </View>
                <View style={{ flex: 1.5 }}>
                  <Text style={styles.label}>Unidade</Text>
                  <TextInput
                    placeholder="Ex: minutos, copos, páginas"
                    value={newUnit}
                    onChangeText={setNewUnit}
                    style={styles.input}
                  />
                </View>
              </View>

              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryPicker}>
                {(['water', 'movement', 'mind', 'sleep', 'nutrition'] as HabitCategory[]).map((c) => {
                  const t = getCategoryTheme(c);
                  const active = newCategory === c;
                  return (
                    <Pressable
                      key={c}
                      onPress={() => setNewCategory(c)}
                      style={[
                        styles.categoryPickItem,
                        active && { borderColor: t.color, backgroundColor: t.bg },
                      ]}>
                      <Ionicons name={t.icon} size={18} color={t.color} />
                      <Text style={[styles.categoryPickText, active && { color: t.color, fontWeight: '700' }]}>
                        {t.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
              <Button
                label="Cancelar"
                variant="outline"
                onPress={() => setModalOpen(false)}
                style={{ flex: 1 }}
              />
              <Button
                label="Criar Hábito"
                onPress={handleSaveHabit}
                loading={createHabit.isPending}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addBtn: {
    marginTop: spacing.xs,
  },
  filterBar: {
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.pill,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    ...font.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.xs,
  },
  emptyTitle: {
    ...font.h3,
    color: colors.text,
    marginTop: spacing.sm,
  },
  emptyText: {
    ...font.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  habitCard: {
    backgroundColor: '#FFFFFF',
    gap: spacing.md,
  },
  habitCardDone: {
    borderColor: colors.primaryBorder,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryTag: {
    ...font.small,
    letterSpacing: 0.5,
  },
  streakTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  streakText: {
    ...font.small,
    color: '#C2410C',
  },
  habitTitle: {
    ...font.h3,
    color: colors.text,
    marginTop: 2,
  },
  habitDesc: {
    ...font.caption,
    color: colors.textMuted,
  },
  progressSection: {
    gap: spacing.xs,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    ...font.body,
    color: colors.textMuted,
  },
  progressCurrent: {
    fontWeight: '700',
    color: colors.text,
  },
  pctText: {
    ...font.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  weekGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.sm,
  },
  dayCol: {
    alignItems: 'center',
    gap: 4,
  },
  dayLetter: {
    ...font.small,
    fontSize: 10,
    color: colors.textMuted,
  },
  todayLetter: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  dayCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayCircleBorder: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  stepBtn: {
    height: 42,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  stepBtnLabel: {
    ...font.caption,
    fontWeight: '700',
  },
  stepBtnDisabled: {
    opacity: 0.4,
  },
  syncText: {
    ...font.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    ...font.h2,
    color: colors.text,
  },
  label: {
    ...font.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    ...font.body,
    color: colors.text,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  categoryPickItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceSubtle,
  },
  categoryPickText: {
    ...font.caption,
    color: colors.textSecondary,
  },
});
