import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

import { api } from './api';

/**
 * Push notifications (FCM no Android / APNs no iOS).
 * Regra de ouro: o texto da notificação NUNCA carrega dado de saúde
 * identificável (aparece na tela bloqueada). Detalhes ficam dentro do app.
 */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/** Pede permissão, obtém o token nativo e o registra na API (POST /dispositivos). */
export async function registerForPush(): Promise<string | null> {
  try {
    if (Platform.OS === 'web' || !Device.isDevice) return null;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Geral',
        importance: AndroidImportance.DEFAULT,
      });
    }

    const current = await Notifications.getPermissionsAsync();
    const status = current.granted ? current : await Notifications.requestPermissionsAsync();
    if (!status.granted) return null;

    const { data: token } = await Notifications.getDevicePushTokenAsync();
    await api.registerDevice({
      token: String(token),
      platform: Platform.OS === 'ios' ? 'ios' : 'android',
      appVersion: '1.0.0',
      locale: 'pt-BR',
    });
    return String(token);
  } catch {
    // Push remoto não é suportado no Expo Go (Android): exige development build.
    return null;
  }
}

