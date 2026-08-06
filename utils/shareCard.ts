import { Platform, View, InteractionManager } from 'react-native';
import { captureRef, releaseCapture } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { EXPORT_W, EXPORT_H } from '@/constants/shareCard';

export type ShareOutcome = { ok: true } | { ok: false; message: string };

export interface ShareCardOptions {
  filename?: string;
  dialogTitle?: string;
}

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/**
 * Capture a share card and hand the PNG to the OS share sheet.
 *
 * Returns an outcome instead of alerting. The caller is the preview sheet,
 * which is already on screen and is the right place to show a failure with a
 * retry — the old version put the raw SDK exception string in an Alert.
 *
 * Web has its own implementation in shareCard.web.ts (Metro picks it by
 * platform) because react-native-view-shot's web path calls findNodeHandle,
 * which react-native-web no longer supports.
 */
export async function shareCard(
  ref: React.RefObject<View | null>,
  opts: ShareCardOptions = {}
): Promise<ShareOutcome> {
  const { filename = '8dominos.png', dialogTitle = 'Share your 8 Dominos' } = opts;
  let uri: string | undefined;

  try {
    if (!ref.current) {
      return { ok: false, message: 'The card isn’t ready yet. Give it a second and try again.' };
    }

    // Let layout settle before rasterising. iOS in particular can return a
    // blank image (and still report success) for a large view captured mid-frame.
    await InteractionManager.runAfterInteractions();
    await nextFrame();

    uri = await captureRef(ref, {
      format: 'png',
      quality: 1,
      // Points on iOS, pixels on Android. The host already renders at the
      // right point size, so this is only a rounding guard on Android and
      // would upsample to a blurry 3240px if passed on iOS.
      ...(Platform.OS === 'android' ? { width: EXPORT_W, height: EXPORT_H } : null),
    });
  } catch (error) {
    console.error('Share capture failed:', error);
    return { ok: false, message: 'We couldn’t build your card. Give it a second and try again.' };
  }

  try {
    if (!(await Sharing.isAvailableAsync())) {
      return { ok: false, message: 'This device has nowhere to send the image.' };
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'image/png',
      dialogTitle,
      UTI: 'public.png',
    });
    return { ok: true };
  } catch (error) {
    console.error('Share sheet failed:', error);
    return { ok: false, message: 'The share sheet didn’t open. Try again.' };
  } finally {
    // Captures otherwise accumulate in tmp for the lifetime of the process.
    if (uri) {
      try {
        releaseCapture(uri);
      } catch {
        /* best effort */
      }
    }
  }
}
