import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { font, radius, spacing } from '@/theme/tokens';

interface DayItem {
  name: string; // SEG, TER, QUA
  dateNumber: number;
  isToday: boolean;
  completed: boolean;
}

export function WeekCalendarStrip() {
  const [selectedDay, setSelectedDay] = useState(4); // Sexta (Hoje)

  const days: DayItem[] = [
    { name: 'SEG', dateNumber: 19, isToday: false, completed: true },
    { name: 'TER', dateNumber: 20, isToday: false, completed: true },
    { name: 'QUA', dateNumber: 21, isToday: false, completed: true },
    { name: 'QUI', dateNumber: 22, isToday: false, completed: false },
    { name: 'SEX', dateNumber: 23, isToday: true, completed: true },
    { name: 'SÁB', dateNumber: 24, isToday: false, completed: false },
    { name: 'DOM', dateNumber: 25, isToday: false, completed: false },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.stripRow}>
        {days.map((item, index) => {
          const isSelected = selectedDay === index;
          return (
            <Pressable
              key={item.name}
              onPress={() => setSelectedDay(index)}
              accessibilityRole="button"
              accessibilityLabel={`${item.name}, dia ${item.dateNumber}`}
              style={[
                styles.dayCard,
                item.isToday && styles.todayCard,
                isSelected && styles.selectedCard,
              ]}>
              <Text
                style={[
                  styles.dayNameText,
                  item.isToday && styles.todayText,
                  isSelected && styles.selectedText,
                ]}>
                {item.name}
              </Text>

              <Text
                style={[
                  styles.dateNumberText,
                  item.isToday && styles.todayDateNumber,
                  isSelected && styles.selectedDateNumber,
                ]}>
                {item.dateNumber}
              </Text>

              {/* Bolinha Indicadora de Metas Batidas */}
              <View
                style={[
                  styles.dot,
                  item.completed
                    ? isSelected
                      ? styles.dotCompletedSelected
                      : styles.dotCompleted
                    : styles.dotIncomplete,
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
  },
  stripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    padding: spacing.xs + 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    gap: 2,
  },
  todayCard: {
    backgroundColor: '#F1F5F9',
  },
  selectedCard: {
    backgroundColor: '#059669', // Verde esmeralda escuro
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dayNameText: {
    ...font.small,
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  todayText: {
    color: '#059669',
  },
  selectedText: {
    color: '#A7F3D0',
  },
  dateNumberText: {
    ...font.bodyBold,
    fontSize: 15,
    color: '#0F172A',
  },
  todayDateNumber: {
    color: '#059669',
    fontWeight: '800',
  },
  selectedDateNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 2,
  },
  dotCompleted: {
    backgroundColor: '#10B981',
  },
  dotCompletedSelected: {
    backgroundColor: '#FFFFFF',
  },
  dotIncomplete: {
    backgroundColor: '#E2E8F0',
  },
});
