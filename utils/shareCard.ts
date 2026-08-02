import { Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

/**
 * Capture a card component and hand it to the platform's share flow.
 *
 * Native: PNG -> the OS share sheet (WhatsApp, Instagram, etc).
 * Web:    PNG -> a file download, since expo-sharing has no web implementation.
 *         Keeps the buttons usable in a browser preview instead of dead.
 */
export async function shareCard(ref: React.RefObject<any>, filename = '8dominos.png'): Promise<void> {
  try {
    if (Platform.OS === 'web') {
      const dataUrl = (await captureRef(ref, {
        format: 'png',
        quality: 1,
        result: 'data-uri',
      })) as string;

      const anchor = document.createElement('a');
      anchor.href = dataUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }

    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error('Share failed:', error);
  }
}
