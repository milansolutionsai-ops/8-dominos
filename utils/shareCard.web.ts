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
export async function shareCard(ref: React.RefObject<any>, filename = '8dominos.png'): Promise<void> {
  try {
    const node = ref?.current as HTMLElement | null;
    if (!node || typeof (node as any).getBoundingClientRect !== 'function') {
      throw new Error('Card is not rendered yet.');
    }

    const { default: html2canvas } = await import('html2canvas');
    const canvas = await html2canvas(node, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!blob) throw new Error('Could not encode the image.');

    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Share failed:', error);
    window.alert(`Share failed: ${message}`);
  }
}
