import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import type { MoodType } from '@/services/types';
import type { AvatarGender } from '@/store/auth-store';

interface AnimatedAvatarProps {
  gender: AvatarGender;
  mood?: MoodType;
  size?: number;
  onToggleGender?: () => void;
  showBadge?: boolean;
}

export function AnimatedAvatar({
  gender,
  mood = 'good',
  size = 56,
  onToggleGender,
  showBadge = true,
}: AnimatedAvatarProps) {
  // Valores animados
  const translateY = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const shake = useRef(new Animated.Value(0)).current;

  // Referência para cancelar qualquer loop ativo anterior
  const activeAnimation = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    // 1. Interrompe animação composta anterior
    if (activeAnimation.current) {
      activeAnimation.current.stop();
      activeAnimation.current = null;
    }

    // 2. Para animações anteriores
    translateY.stopAnimation();
    rotate.stopAnimation();
    scale.stopAnimation();
    shake.stopAnimation();

    // 3. Reseta valores para neutro
    translateY.setValue(0);
    rotate.setValue(0);
    scale.setValue(1);
    shake.setValue(0);

    let anim: Animated.CompositeAnimation | null = null;

    if (mood === 'radiant') {
      // Pulo animado e entusiasmado
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -6,
            duration: 350,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 350,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      );
    } else if (mood === 'good') {
      // Balanço amigável suave
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(rotate, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(rotate, {
            toValue: -1,
            duration: 800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    } else if (mood === 'calm') {
      // Respiração lenta e relaxante
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.08,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.96,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    } else if (mood === 'tired') {
      // Leve inclinação de cansaço
      anim = Animated.parallel([
        Animated.timing(rotate, {
          toValue: 0.8,
          duration: 900,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 3,
          duration: 900,
          useNativeDriver: true,
        }),
      ]);
    } else if (mood === 'stressed') {
      // Tremidinha rápida (shake) com intervalo
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(shake, { toValue: -3, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 3, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: -2, duration: 80, useNativeDriver: true }),
          Animated.timing(shake, { toValue: 0, duration: 80, useNativeDriver: true }),
          Animated.delay(1200),
        ])
      );
    }

    if (anim) {
      activeAnimation.current = anim;
      anim.start();
    }

    return () => {
      if (activeAnimation.current) {
        activeAnimation.current.stop();
        activeAnimation.current = null;
      }
      translateY.stopAnimation();
      rotate.stopAnimation();
      scale.stopAnimation();
      shake.stopAnimation();
      translateY.setValue(0);
      rotate.setValue(0);
      scale.setValue(1);
      shake.setValue(0);
    };
  }, [mood, translateY, rotate, scale, shake]);

  const spin = rotate.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-6deg', '6deg'],
  });

  return (
    <Pressable
      onPress={onToggleGender}
      accessibilityRole="button"
      accessibilityLabel={`Avatar ${gender === 'woman' ? 'Feminino' : 'Masculino'}, toque para alternar`}
      style={styles.wrapper}>
      <Animated.View
        style={[
          styles.avatarCircle,
          { width: size, height: size, borderRadius: size / 2 },
          {
            transform: [
              { translateY },
              { rotate: spin },
              { scale },
              { translateX: shake },
            ],
          },
        ]}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          {/* Fundo do Avatar */}
          <Circle cx="50" cy="50" r="48" fill={gender === 'woman' ? '#ECFDF5' : '#EFF6FF'} />

          {/* Rosto Base */}
          <Circle cx="50" cy="52" r="28" fill="#FCD34D" />

          {gender === 'woman' ? (
            /* Cabelo e feições femininas */
            <G>
              {/* Cabelo castanho/escuro com franja e corte moderno */}
              <Path
                d="M 22 50 C 22 25, 78 25, 78 50 C 78 35, 70 20, 50 20 C 30 20, 22 35, 22 50 Z"
                fill="#451A03"
              />
              <Path
                d="M 22 45 C 18 55, 22 75, 26 80 C 24 68, 26 50, 30 45 Z"
                fill="#451A03"
              />
              <Path
                d="M 78 45 C 82 55, 78 75, 74 80 C 76 68, 74 50, 70 45 Z"
                fill="#451A03"
              />
              {/* Olhos expressivos */}
              <Circle cx="41" cy="50" r="3.2" fill="#1E293B" />
              <Circle cx="59" cy="50" r="3.2" fill="#1E293B" />
              {/* Bochechinhas rosadas */}
              <Circle cx="35" cy="56" r="4" fill="#F43F5E" opacity={0.4} />
              <Circle cx="65" cy="56" r="4" fill="#F43F5E" opacity={0.4} />
              {/* Sorriso */}
              {mood === 'tired' ? (
                <Path d="M 44 63 Q 50 60 56 63" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : mood === 'stressed' ? (
                <Path d="M 43 64 Q 50 67 57 64" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <Path d="M 43 59 Q 50 67 57 59" stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              )}
              {/* Roupa verde esmeralda */}
              <Ellipse cx="50" cy="94" rx="28" ry="16" fill="#059669" />
            </G>
          ) : (
            /* Cabelo e feições masculinas */
            <G>
              {/* Cabelo moderno estilizado com topete */}
              <Path
                d="M 24 45 C 24 22, 76 22, 76 45 C 72 26, 58 18, 50 18 C 38 18, 28 26, 24 45 Z"
                fill="#1E1B4B"
              />
              {/* Olhos */}
              <Circle cx="41" cy="50" r="3.2" fill="#1E293B" />
              <Circle cx="59" cy="50" r="3.2" fill="#1E293B" />
              {/* Sorriso */}
              {mood === 'tired' ? (
                <Path d="M 44 63 Q 50 60 56 63" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : mood === 'stressed' ? (
                <Path d="M 43 64 Q 50 67 57 64" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              ) : (
                <Path d="M 43 59 Q 50 67 57 59" stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
              )}
              {/* Roupa azul marinho */}
              <Ellipse cx="50" cy="94" rx="28" ry="16" fill="#0284C7" />
            </G>
          )}

          {/* Borda Externa Refinada */}
          <Circle cx="50" cy="50" r="48" stroke={gender === 'woman' ? '#10B981' : '#38BDF8'} strokeWidth="3" fill="none" />
        </Svg>
      </Animated.View>

      {/* Ícone de Reação / Emoção Flutuante */}
      {showBadge && (
        <View style={styles.emotionPill}>
          <Text style={styles.emotionEmoji}>
            {mood === 'radiant' ? '✨' : mood === 'good' ? '😊' : mood === 'calm' ? '🧘' : mood === 'tired' ? '💤' : '⚡'}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  avatarCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  emotionPill: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#FFFFFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emotionEmoji: {
    fontSize: 10,
  },
});
