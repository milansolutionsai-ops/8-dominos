import { Platform, Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

/**
 * Capture a card component and hand it to the platform's share flow.
 *
 * Native: PNG -> the OS share sheet (WhatsApp, Instagram, etc).
 * Web:    PNG -> a file download, since expo-sharing has no web implementation.
 *         Web capture goes through html2canvas, which is less reliable than the
 *         native path — treat the browser as preview only, judge the real
 *         output on a device.
 */
export async function shareCard(ref: React.RefObject<any>, filename = '8dominos.png'): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      const dataUrl = (await captureRef(ref, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      })) as string;

      // Blob + object URL rather than a raw data URI: browsers cap how large a
      // data: href can be in a download link, and these cards exceed it easily.
      const blob = await (await fetch(dataUrl)).blob();
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(objectUrl);
      return;
    }

    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing unavailable', 'This device has no share target available.');
      return;
    }
    await Sharing.shareAsync(uri);
  } catch (error) {
    // Surface it — a silent catch here is why this looked like a dead button.
    const message = error instanceof Error ? error.message : String(error);
    console.error('Share failed:', error);
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert(`Share failed: ${message}`);
    } else {
      Alert.alert('Share failed', message);
    }
  }
}
