import { colors } from '@/constants/theme';
import { WEB_CAPTURE_SCALE } from '@/constants/shareCard';
import type { ShareOutcome, ShareCardOptions } from './shareCard';

/**
 * Web implementation of shareCard (Metro resolves this over shareCard.ts on web).
 *
 * react-native-view-shot's own web path calls findNodeHandle(), which
 * react-native-web dropped — so it throws before it ever reaches html2canvas.
 * On react-native-web a <View> ref IS the underlying DOM node, so we can hand
 * it to html2canvas directly and skip the library entirely.
 *
 * Browsers can't open a native share sheet for a file reliably, so the web
 * path downloads the PNG instead. This is a preview convenience — judge the
 * real output on a device.
 */
export async function shareCard(
  ref: React.RefObject<any>,
  opts: ShareCardOptions = {}
): Promise<ShareOutcome> {
  const { filename = '8dominos.png' } = opts;
  try {
    const node = ref?.current as HTMLElement | null;
    if (!node || typeof node.getBoundingClientRect !== 'function') {
      return { ok: false, message: 'The card isn’t ready yet. Give it a second and try again.' };
    }

    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(node, {
      // The card is full-bleed navy; a null background would punch it out.
      backgroundColor: colors.bg,
      scale: WEB_CAPTURE_SCALE,
      logging: false,
      useCORS: true,
    });

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) return { ok: false, message: 'We couldn’t build your card. Try again.' };

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
    return { ok: true };
  } catch (error) {
    console.error('Share failed:', error);
    return { ok: false, message: 'We couldn’t build your card. Give it a second and try again.' };
  }
}
