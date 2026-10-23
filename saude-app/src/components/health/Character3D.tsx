import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import * as Haptics from 'expo-haptics';

import type { MoodType } from '@/services/types';
import type { AvatarGender } from '@/store/auth-store';
import { colors, font, radius, shadows, spacing } from '@/theme/tokens';

interface Character3DProps {
  gender: AvatarGender;
  mood?: MoodType;
  onPress?: () => void;
  showSpeechBubble?: boolean;
}

const MOOD_MESSAGES: Record<MoodType, { title: string; subtitle: string; emoji: string }> = {
  radiant: {
    title: 'Energia Radiante!',
    subtitle: 'Seu foco hoje está imbatível. Vamos bater todas as metas!',
    emoji: '✨',
  },
  good: {
    title: 'Muito Bem!',
    subtitle: 'Ritmo constante e positivo para um dia saudável.',
    emoji: '🌿',
  },
  calm: {
    title: 'Mente Serena',
    subtitle: 'Respiração profunda e equilíbrio. Aproveite o momento presente.',
    emoji: '🧘',
  },
  tired: {
    title: 'Pausa Merecida',
    subtitle: 'Hidrate-se bem e respeite o seu ritmo para recarregar.',
    emoji: '💧',
  },
  stressed: {
    title: 'Respire Fundo',
    subtitle: 'Que tal 3 minutinhos de Box Breathing na aba Mente?',
    emoji: '🌬️',
  },
};

export function Character3D({
  gender,
  mood = 'good',
  onPress,
  showSpeechBubble = true,
}: Character3DProps) {
  // Valores animados
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateXAnim = useRef(new Animated.Value(0)).current;
  const rotateYAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowScale = useRef(new Animated.Value(1)).current;
  const tapBounce = useRef(new Animated.Value(0)).current;

  // Referência para parar qualquer animação em loop ativa
  const activeAnimation = useRef<Animated.CompositeAnimation | null>(null);

  // Estado de interação
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    // 1. Interrompe animação em loop anterior imediatamente
    if (activeAnimation.current) {
      activeAnimation.current.stop();
      activeAnimation.current = null;
    }

    // 2. Interrompe todas as animações individuais dos valores
    floatAnim.stopAnimation();
    shadowScale.stopAnimation();
    scaleAnim.stopAnimation();
    rotateYAnim.stopAnimation();
    rotateXAnim.stopAnimation();
    tapBounce.stopAnimation();

    // 3. Reseta todos os valores para o ponto neutro inicial
    floatAnim.setValue(0);
    shadowScale.setValue(1);
    scaleAnim.setValue(1);
    rotateYAnim.setValue(0);
    rotateXAnim.setValue(0);
    tapBounce.setValue(0);

    let anim: Animated.CompositeAnimation | null = null;

    if (mood === 'radiant') {
      // Salto 3D contínuo de alta energia
      anim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -18,
              duration: 380,
              easing: Easing.out(Easing.back(1.5)),
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 380,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(shadowScale, {
              toValue: 0.65,
              duration: 380,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
            Animated.timing(shadowScale, {
              toValue: 1,
              duration: 380,
              easing: Easing.in(Easing.quad),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    } else if (mood === 'good') {
      // Flutuação 3D suave com leve inclinação
      anim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -8,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(shadowScale, {
              toValue: 0.85,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(shadowScale, {
              toValue: 1,
              duration: 1400,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    } else if (mood === 'calm') {
      // Respiração zen profunda
      anim = Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 2200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 0.98,
              duration: 2200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(floatAnim, {
              toValue: -4,
              duration: 2200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(floatAnim, {
              toValue: 0,
              duration: 2200,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    } else if (mood === 'tired') {
      // Respiração lenta e relaxada
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 4,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      );
    } else if (mood === 'stressed') {
      // Micro-vibração de tensão com pausa para não sobrecarregar
      anim = Animated.loop(
        Animated.sequence([
          Animated.timing(rotateYAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateYAnim, {
            toValue: -1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateYAnim, {
            toValue: 1,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(rotateYAnim, {
            toValue: 0,
            duration: 80,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
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
      floatAnim.stopAnimation();
      shadowScale.stopAnimation();
      scaleAnim.stopAnimation();
      rotateYAnim.stopAnimation();
      rotateXAnim.stopAnimation();
      tapBounce.stopAnimation();
      floatAnim.setValue(0);
      shadowScale.setValue(1);
      scaleAnim.setValue(1);
      rotateYAnim.setValue(0);
      rotateXAnim.setValue(0);
      tapBounce.setValue(0);
    };
  }, [mood]);

  // Função ao tocar no boneco
  const handleTap = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    }
    setIsInteracting(true);
    Animated.sequence([
      Animated.timing(tapBounce, {
        toValue: -20,
        duration: 220,
        easing: Easing.out(Easing.back(2)),
        useNativeDriver: true,
      }),
      Animated.timing(tapBounce, {
        toValue: 0,
        duration: 300,
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsInteracting(false);
    });

    if (onPress) {
      onPress();
    }
  };

  const message = MOOD_MESSAGES[mood] || MOOD_MESSAGES.good;

  // Interpolação de rotação 3D
  const spinY = rotateYAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  return (
    <View style={styles.container}>
      {/* Balão 3D Flutuante de Expressão / Diálogo */}
      {showSpeechBubble && (
        <View style={styles.speechBubbleWrapper}>
          <View style={styles.speechBubble}>
            <View style={styles.speechHeader}>
              <Text style={styles.speechEmoji}>{message.emoji}</Text>
              <Text style={styles.speechTitle}>{message.title}</Text>
            </View>
            <Text style={styles.speechSubtitle}>{message.subtitle}</Text>
          </View>
          <View style={styles.speechTail} />
        </View>
      )}

      {/* Palco 3D com o Personagem */}
      <Pressable
        onPress={handleTap}
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Companheiro 3D ${gender === 'woman' ? 'Feminino' : 'Masculino'}, humor ${mood}`}
        accessibilityHint="Toque para interagir com seu companheiro 3D"
        style={styles.stage}
      >
        {/* Sombra de Contato Tridimensional no Piso */}
        <Animated.View
          style={[
            styles.shadowContainer,
            {
              transform: [{ scale: shadowScale }],
              opacity: shadowScale.interpolate({
                inputRange: [0.6, 1],
                outputRange: [0.25, 0.45],
              }),
            },
          ]}
        >
          <Svg width={160} height={32} viewBox="0 0 160 32">
            <Defs>
              <RadialGradient id="floorShadow" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#0B1A12" stopOpacity="0.45" />
                <Stop offset="55%" stopColor="#0F2D1E" stopOpacity="0.22" />
                <Stop offset="100%" stopColor="#0F2D1E" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Ellipse cx="80" cy="16" rx="72" ry="14" fill="url(#floorShadow)" />
          </Svg>
        </Animated.View>

        {/* Modelo 3D com Transformações de Perspectiva */}
        <Animated.View
          style={[
            styles.characterWrapper,
            {
              transform: [
                { translateY: Animated.add(floatAnim, tapBounce) },
                { scale: scaleAnim },
                { rotateY: spinY },
              ],
            },
          ]}
        >
          <Svg width={200} height={240} viewBox="0 0 200 240">
            <Defs>
              {/* Luz da Pele 3D */}
              <RadialGradient id="skin3D" cx="35%" cy="30%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FFE0B2" />
                <Stop offset="50%" stopColor="#FFCC80" />
                <Stop offset="85%" stopColor="#FFA726" />
                <Stop offset="100%" stopColor="#F57C00" />
              </RadialGradient>

              {/* Luz do Rosto 3D - Mulher */}
              <RadialGradient id="skinWoman3D" cx="35%" cy="30%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FFF3E0" />
                <Stop offset="45%" stopColor="#FFE0B2" />
                <Stop offset="80%" stopColor="#FFB74D" />
                <Stop offset="100%" stopColor="#FB8C00" />
              </RadialGradient>

              {/* Roupa 3D - Moletom Esmeralda com Sombreamento Volumétrico */}
              <LinearGradient id="hoodie3D" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#34D399" />
                <Stop offset="30%" stopColor="#10B981" />
                <Stop offset="75%" stopColor="#059669" />
                <Stop offset="100%" stopColor="#047857" />
              </LinearGradient>

              {/* Luz de Destaque da Roupa */}
              <LinearGradient id="hoodieHighlight" x1="20%" y1="0%" x2="20%" y2="100%">
                <Stop offset="0%" stopColor="#6EE7B7" stopOpacity="0.8" />
                <Stop offset="100%" stopColor="#10B981" stopOpacity="0" />
              </LinearGradient>

              {/* Cabelo Mulher 3D - Castanho Dourado Volumétrico */}
              <RadialGradient id="hairWoman3D" cx="30%" cy="20%" rx="70%" ry="70%">
                <Stop offset="0%" stopColor="#8D6E63" />
                <Stop offset="40%" stopColor="#6D4C41" />
                <Stop offset="80%" stopColor="#4E342E" />
                <Stop offset="100%" stopColor="#2E1C14" />
              </RadialGradient>

              {/* Cabelo Homem 3D - Preto / Ébano com Luz Especular */}
              <RadialGradient id="hairMan3D" cx="30%" cy="20%" rx="70%" ry="70%">
                <Stop offset="0%" stopColor="#4B5563" />
                <Stop offset="35%" stopColor="#374151" />
                <Stop offset="75%" stopColor="#1F2937" />
                <Stop offset="100%" stopColor="#111827" />
              </RadialGradient>

              {/* Bochechas 3D Coradas */}
              <RadialGradient id="blush3D" cx="50%" cy="50%" rx="50%" ry="50%">
                <Stop offset="0%" stopColor="#FF6B6B" stopOpacity="0.6" />
                <Stop offset="60%" stopColor="#FF8787" stopOpacity="0.25" />
                <Stop offset="100%" stopColor="#FFA8A8" stopOpacity="0" />
              </RadialGradient>

              {/* Brilho Especular 3D nos Olhos */}
              <RadialGradient id="eyeGloss" cx="35%" cy="30%" rx="65%" ry="65%">
                <Stop offset="0%" stopColor="#FFFFFF" />
                <Stop offset="40%" stopColor="#E0F2FE" />
                <Stop offset="90%" stopColor="#0284C7" />
                <Stop offset="100%" stopColor="#0C4A6E" />
              </RadialGradient>

              {/* Sombra de Oclusão do Pescoço */}
              <LinearGradient id="neckOcclusion" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#000000" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </LinearGradient>
            </Defs>

            {/* --- 1. CABELO DE FUNDO (Para mulher: mechas longas volumétricas) --- */}
            {gender === 'woman' && (
              <G>
                {/* Mechas atrás dos ombros */}
                <Path
                  d="M 52 90 C 40 120 42 165 58 185 C 64 165 66 125 70 100 Z"
                  fill="url(#hairWoman3D)"
                />
                <Path
                  d="M 148 90 C 160 120 158 165 142 185 C 136 165 134 125 130 100 Z"
                  fill="url(#hairWoman3D)"
                />
              </G>
            )}

            {/* --- 2. TRONCO / ROUPA 3D (Moletom Esportivo Volumétrico) --- */}
            <G>
              {/* Corpo Principal (Moletom) */}
              <Path
                d="M 62 135 C 50 148 44 195 48 225 C 75 230 125 230 152 225 C 156 195 150 148 138 135 C 126 142 74 142 62 135 Z"
                fill="url(#hoodie3D)"
              />

              {/* Luz de Volume Frontal no Peito */}
              <Path
                d="M 72 142 C 85 146 115 146 128 142 C 125 185 120 215 100 220 C 80 215 75 185 72 142 Z"
                fill="url(#hoodieHighlight)"
                opacity={0.35}
              />

              {/* Cordões do Moletom 3D */}
              <Path
                d="M 92 146 Q 90 170 88 185"
                stroke="#A7F3D0"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Circle cx="88" cy="186" r="3" fill="#ECFDF5" />

              <Path
                d="M 108 146 Q 110 170 112 185"
                stroke="#A7F3D0"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <Circle cx="112" cy="186" r="3" fill="#ECFDF5" />

              {/* Gola Volumétrica 3D */}
              <Ellipse
                cx="100"
                cy="138"
                rx="28"
                ry="10"
                fill="#047857"
              />
              <Ellipse
                cx="100"
                cy="136"
                rx="26"
                ry="8"
                fill="#10B981"
              />
            </G>

            {/* --- 3. BRAÇOS 3D E POSES DE HUMOR --- */}
            <G>
              {mood === 'radiant' ? (
                /* Pose Radiante: Braços erguidos comemorando 🙌 */
                <G>
                  {/* Braço Esquerdo Erguido */}
                  <Path
                    d="M 58 140 C 40 120 30 85 42 65 C 50 62 58 75 52 95 C 48 110 65 130 68 142 Z"
                    fill="url(#hoodie3D)"
                  />
                  {/* Mão Esquerda 3D */}
                  <Circle
                    cx="40"
                    cy="60"
                    r="10"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />

                  {/* Braço Direito Erguido */}
                  <Path
                    d="M 142 140 C 160 120 170 85 158 65 C 150 62 142 75 148 95 C 152 110 135 130 132 142 Z"
                    fill="url(#hoodie3D)"
                  />
                  {/* Mão Direita 3D */}
                  <Circle
                    cx="160"
                    cy="60"
                    r="10"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />
                </G>
              ) : mood === 'calm' ? (
                /* Pose Calma / Zen: Mãos postas no centro 🧘 */
                <G>
                  {/* Braço Esquerdo curvado */}
                  <Path
                    d="M 58 142 C 45 160 55 190 85 190 C 88 182 80 175 68 170 C 62 155 66 145 68 142 Z"
                    fill="url(#hoodie3D)"
                  />
                  {/* Braço Direito curvado */}
                  <Path
                    d="M 142 142 C 155 160 145 190 115 190 C 112 182 120 175 132 170 C 138 155 134 145 132 142 Z"
                    fill="url(#hoodie3D)"
                  />
                  {/* Mãos Zen Juntas no Centro */}
                  <Ellipse
                    cx="100"
                    cy="188"
                    rx="14"
                    ry="8"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />
                </G>
              ) : mood === 'stressed' ? (
                /* Pose Estressada: Mãos na cabeça 🤯 */
                <G>
                  {/* Braço Esquerdo até a cabeça */}
                  <Path
                    d="M 58 140 C 35 125 40 85 62 82 C 65 90 56 100 52 118 Z"
                    fill="url(#hoodie3D)"
                  />
                  <Circle
                    cx="65"
                    cy="80"
                    r="9"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />

                  {/* Braço Direito até a cabeça */}
                  <Path
                    d="M 142 140 C 165 125 160 85 138 82 C 135 90 144 100 148 118 Z"
                    fill="url(#hoodie3D)"
                  />
                  <Circle
                    cx="135"
                    cy="80"
                    r="9"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />
                </G>
              ) : (
                /* Pose Padrão / Bem: Braço acenando amigavelmente 👋 */
                <G>
                  {/* Braço Esquerdo relaxado ao lado */}
                  <Path
                    d="M 58 140 C 44 155 42 190 48 210 C 56 210 60 195 56 178 C 58 160 65 148 68 140 Z"
                    fill="url(#hoodie3D)"
                  />
                  <Circle
                    cx="48"
                    cy="214"
                    r="9"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />

                  {/* Braço Direito acenando suave */}
                  <Path
                    d="M 142 140 C 160 135 175 110 168 95 C 160 92 152 105 152 118 C 146 130 138 135 134 140 Z"
                    fill="url(#hoodie3D)"
                  />
                  <Circle
                    cx="168"
                    cy="90"
                    r="9"
                    fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
                  />
                </G>
              )}
            </G>

            {/* --- 4. PESCOÇO 3D COM SOMBRA --- */}
            <Rect
              x="90"
              y="118"
              width="20"
              height="20"
              rx="6"
              fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
            />
            {/* Sombra de oclusão do pescoço */}
            <Rect
              x="90"
              y="118"
              width="20"
              height="10"
              rx="4"
              fill="url(#neckOcclusion)"
            />

            {/* --- 5. ORELHAS 3D --- */}
            <Ellipse
              cx="54"
              cy="88"
              rx="7"
              ry="11"
              fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
            />
            <Ellipse
              cx="55"
              cy="88"
              rx="4"
              ry="7"
              fill="#F57C00"
              opacity={0.3}
            />

            <Ellipse
              cx="146"
              cy="88"
              rx="7"
              ry="11"
              fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
            />
            <Ellipse
              cx="145"
              cy="88"
              rx="4"
              ry="7"
              fill="#F57C00"
              opacity={0.3}
            />

            {/* --- 6. CABEÇA 3D ESFÉRICA VOLUMÉTRICA --- */}
            <Circle
              cx="100"
              cy="85"
              r="46"
              fill={gender === 'woman' ? 'url(#skinWoman3D)' : 'url(#skin3D)'}
            />

            {/* Bochechas Coradas 3D */}
            <Circle cx="72" cy="98" r="12" fill="url(#blush3D)" />
            <Circle cx="128" cy="98" r="12" fill="url(#blush3D)" />

            {/* --- 7. CABELO FRONTAL 3D MODELADO --- */}
            {gender === 'woman' ? (
              /* Penteado Feminino 3D Estilizado */
              <G>
                {/* Volume Superior do Cabelo com mechas modeladas */}
                <Path
                  d="M 52 80 C 48 42 75 30 100 30 C 125 30 152 42 148 80 C 142 58 132 46 100 46 C 68 46 58 58 52 80 Z"
                  fill="url(#hairWoman3D)"
                />
                {/* Franja Lateral Moderna com Luz */}
                <Path
                  d="M 60 60 C 72 45 105 48 118 62 C 105 60 85 58 70 72 Z"
                  fill="#8D6E63"
                />
                {/* Coque / Rabo Alto Estilizado no Topo */}
                <Circle cx="100" cy="24" r="16" fill="url(#hairWoman3D)" />
                <Ellipse cx="98" cy="20" rx="10" ry="6" fill="#A1887F" opacity={0.6} />
              </G>
            ) : (
              /* Penteado Masculino 3D (Topete Volumétrico Moderno) */
              <G>
                {/* Volume de Topete Superior */}
                <Path
                  d="M 54 75 C 50 38 80 26 108 26 C 132 26 150 42 146 75 C 138 46 126 38 104 38 C 76 38 64 48 54 75 Z"
                  fill="url(#hairMan3D)"
                />
                {/* Mecha de destaque com luz direcional */}
                <Path
                  d="M 66 52 C 82 34 114 34 126 48 C 112 40 90 40 76 56 Z"
                  fill="#6B7280"
                  opacity={0.8}
                />
              </G>
            )}

            {/* --- 8. OLHOS 3D EXPRESSIVOS --- */}
            {mood === 'calm' ? (
              /* Olhos Zen / Fechados em Meditação */
              <G>
                <Path
                  d="M 72 85 Q 82 93 92 85"
                  stroke="#374151"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M 108 85 Q 118 93 128 85"
                  stroke="#374151"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            ) : mood === 'tired' ? (
              /* Olhos Cansados / Caídos */
              <G>
                <Path
                  d="M 72 87 Q 82 82 92 88"
                  stroke="#4B5563"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M 108 88 Q 118 82 128 87"
                  stroke="#4B5563"
                  strokeWidth={3.5}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            ) : (
              /* Olhos Abertos com Globo Ocular e Brilho 3D */
              <G>
                {/* Esclera / Base Branca */}
                <Ellipse cx="80" cy="84" rx="8" ry="10" fill="#FFFFFF" />
                <Ellipse cx="120" cy="84" rx="8" ry="10" fill="#FFFFFF" />

                {/* Íris com Gradiente Azul Gloss */}
                <Circle cx="80" cy="84" r="6.5" fill="url(#eyeGloss)" />
                <Circle cx="120" cy="84" r="6.5" fill="url(#eyeGloss)" />

                {/* Pupila */}
                <Circle cx="80" cy="84" r="3.5" fill="#0F172A" />
                <Circle cx="120" cy="84" r="3.5" fill="#0F172A" />

                {/* Reflexo Especular da Luz (Ponto de Brilho 3D) */}
                <Circle cx="78" cy="81" r="2.2" fill="#FFFFFF" />
                <Circle cx="118" cy="81" r="2.2" fill="#FFFFFF" />
                <Circle cx="82" cy="86" r="1" fill="#FFFFFF" opacity={0.8} />
                <Circle cx="122" cy="86" r="1" fill="#FFFFFF" opacity={0.8} />
              </G>
            )}

            {/* Sobrancelhas 3D Expressivas */}
            {mood === 'stressed' ? (
              <G>
                <Path
                  d="M 70 73 L 90 77"
                  stroke="#1F2937"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
                <Path
                  d="M 110 77 L 130 73"
                  stroke="#1F2937"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              </G>
            ) : (
              <G>
                <Path
                  d="M 72 73 Q 82 69 90 73"
                  stroke="#1F2937"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M 110 73 Q 118 69 128 73"
                  stroke="#1F2937"
                  strokeWidth={2.8}
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            )}

            {/* Nariz 3D Suave */}
            <Path
              d="M 98 88 Q 100 93 103 91"
              stroke="#D97706"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
              opacity={0.4}
            />

            {/* --- 9. BOCA 3D DE ACORDO COM O HUMOR --- */}
            {mood === 'radiant' ? (
              /* Boca Aberta em Sorriso Vibrante */
              <G>
                <Path
                  d="M 86 98 Q 100 115 114 98 Z"
                  fill="#B91C1C"
                />
                <Path
                  d="M 91 99 Q 100 104 109 99 Z"
                  fill="#FFFFFF"
                />
              </G>
            ) : mood === 'tired' ? (
              /* Bocejo Suave */
              <Ellipse
                cx="100"
                cy="102"
                rx="6"
                ry="7"
                fill="#991B1B"
              />
            ) : mood === 'stressed' ? (
              /* Boca Ondulada Tensa */
              <Path
                d="M 90 103 Q 95 99 100 103 Q 105 107 110 103"
                stroke="#374151"
                strokeWidth={3}
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              /* Sorriso Amigável e Sereno */
              <Path
                d="M 88 100 Q 100 110 112 100"
                stroke="#1F2937"
                strokeWidth={3.2}
                strokeLinecap="round"
                fill="none"
              />
            )}
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  stage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 250,
    width: 220,
  },
  characterWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  shadowContainer: {
    position: 'absolute',
    bottom: 4,
    zIndex: 1,
  },
  speechBubbleWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xs,
    maxWidth: 290,
    zIndex: 10,
  },
  speechBubble: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...shadows.md,
  },
  speechHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: 2,
  },
  speechEmoji: {
    fontSize: 16,
  },
  speechTitle: {
    ...font.bodyBold,
    color: colors.text,
  },
  speechSubtitle: {
    ...font.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  speechTail: {
    width: 12,
    height: 12,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '45deg' }],
    marginTop: -6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
  },
});
