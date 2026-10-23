import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';

export interface PedometerData {
  steps: number;
  goal: number;
  calories: number;
  distanceKm: number;
  isLiveSensor: boolean;
}

/**
 * Serviço de Passos e Movimento com suporte a sensor real do celular (Pedometer API)
 * e fallback inteligente para simuladores / navegadores.
 */
export async function getLiveStepData(): Promise<PedometerData> {
  const goal = 10000;

  try {
    if (Platform.OS !== 'web') {
      const isAvailable = await Pedometer.isAvailableAsync();
      if (isAvailable) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();

        const result = await Pedometer.getStepCountAsync(startOfDay, endOfDay);
        if (result && typeof result.steps === 'number') {
          const steps = Math.max(0, result.steps);
          return {
            steps,
            goal,
            calories: Math.round(steps * 0.042),
            distanceKm: Number((steps * 0.00075).toFixed(2)),
            isLiveSensor: true,
          };
        }
      }
    }
  } catch {
    // Continua para o fallback inteligente
  }

  // Fallback para emulador ou web: progresso consistente do dia
  const now = new Date();
  const hoursFraction = (now.getHours() * 60 + now.getMinutes()) / 1440;
  const simulatedSteps = Math.min(goal, Math.round(7240 + hoursFraction * 1200));

  return {
    steps: simulatedSteps,
    goal,
    calories: Math.round(simulatedSteps * 0.042),
    distanceKm: Number((simulatedSteps * 0.00075).toFixed(2)),
    isLiveSensor: false,
  };
}

