import { Alert } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

/**
 * Capture a card component and hand the PNG to the OS share sheet.
 *
 * Web has its own implementation in shareCard.web.ts (Metro picks it by
 * platform) because react-native-view-shot's web path calls findNodeHandle,
 * which react-native-web no longer supports.
 */
export async function shareCard(ref: React.RefObject<any>, filename = '8dominos.png'): Promise<void> {
  try {
    const uri = await captureRef(ref, { format: 'png', quality: 1 });
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing unavailable', 'No share target is available on this device.');
      return;
    }
    await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: filename });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Share failed:', error);
    Alert.alert('Share failed', message);
  }
}
