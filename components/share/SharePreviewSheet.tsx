import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Share2, X } from 'lucide-react-native';
import { colors, type, spacing, radius } from '@/constants/theme';
import { HOST_W, HOST_H } from '@/constants/shareCard';
import { shareCard } from '@/utils/shareCard';
import { ShareDayCard, ShareDayData } from '../ShareDayCard';
import { ShareWeekCard, ShareWeekData } from '../ShareWeekCard';

export type ShareCardPayload =
  | { kind: 'day'; data: ShareDayData }
  | { kind: 'week'; data: ShareWeekData };

interface SharePreviewSheetProps {
  /** null means closed. */
  payload: ShareCardPayload | null;
  onClose: () => void;
  /** Fires only on a successful share. Drives nudge persistence. */
  onShared?: () => void;
}

const CONTROLS_H = 132;

function Card({ payload, innerRef }: { payload: ShareCardPayload; innerRef?: React.Ref<View> }) {
  return payload.kind === 'day' ? (
    <ShareDayCard ref={innerRef} data={payload.data} />
  ) : (
    <ShareWeekCard ref={innerRef} data={payload.data} />
  );
}

/**
 * Shows the finished image before it goes anywhere, then shares it.
 *
 * This is the consent gate for putting the user's own habit text on a card that
 * leaves the device. Do not add a share path that bypasses it.
 *
 * The card renders twice, from one immutable payload so the two cannot drift:
 *
 *  1. A capture host, off-screen at left:-10000 in the NORMAL screen tree,
 *     holding the ref. Deliberately not inside the Modal — on iOS with the new
 *     architecture, view-shot resolves views through the legacy Paper registry
 *     and Modal content lives in a separately-presented UIViewController, so
 *     capturing across that boundary is unverified. Keeping the host outside
 *     means capture correctness never depends on it.
 *  2. A preview copy inside the Modal, scaled down to fit the phone.
 */
export function SharePreviewSheet({ payload, onClose, onShared }: SharePreviewSheetProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const captureRef = useRef<View>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!payload) {
      setBusy(false);
      setError(null);
    }
  }, [payload]);

  const handleShare = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    setError(null);

    const filename = payload?.kind === 'week' ? '8dominos-my-week.png' : '8dominos-my-day.png';
    const result = await shareCard(captureRef, {
      filename,
      dialogTitle: payload?.kind === 'week' ? 'Share your week' : 'Share your day',
    });

    setBusy(false);
    if (result.ok) {
      onShared?.();
      onClose();
    } else {
      setError(result.message);
    }
  }, [busy, payload, onShared, onClose]);

  if (!payload) return null;

  const maxW = width - spacing.xl * 2;
  const maxH = height - insets.top - insets.bottom - CONTROLS_H;
  const fit = Math.min(maxW / HOST_W, maxH / HOST_H, 1);

  return (
    <>
      {/* Capture host: laid out at true export size, never seen. */}
      <View style={styles.captureHost} pointerEvents="none" aria-hidden>
        <Card payload={payload} innerRef={captureRef} />
      </View>

      <Modal
        visible
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={onClose}
      >
        <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill}>
          <Pressable style={styles.scrim} onPress={onClose} accessibilityLabel="Close preview" />

          <View
            style={[styles.sheet, { paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.lg }]}
            pointerEvents="box-none"
          >
            <View style={[styles.previewWrap, { width: HOST_W * fit, height: HOST_H * fit }]}>
              <View style={[styles.preview, { transform: [{ scale: fit }] }]}>
                <Card payload={payload} />
              </View>
            </View>

            {error ? (
              <Text style={styles.error} accessibilityLiveRegion="polite">
                {error}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [styles.primary, pressed && styles.pressed, busy && styles.disabled]}
                onPress={handleShare}
                disabled={busy}
                accessibilityRole="button"
                accessibilityLabel={error ? 'Try sharing again' : 'Share'}
                accessibilityState={{ disabled: busy, busy }}
              >
                {busy ? (
                  <ActivityIndicator color={colors.onAccent} />
                ) : (
                  <>
                    <Share2 size={18} color={colors.onAccent} strokeWidth={2.5} />
                    <Text style={styles.primaryText}>{error ? 'Try again' : 'Share'}</Text>
                  </>
                )}
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.secondary, pressed && styles.pressed]}
                onPress={onClose}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <X size={18} color={colors.textSecondary} strokeWidth={2.5} />
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  captureHost: {
    position: 'absolute',
    left: -10000,
    top: 0,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
  },
  sheet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  previewWrap: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  preview: {
    width: HOST_W,
    height: HOST_H,
    transformOrigin: 'top left',
  },
  error: {
    ...type.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    alignSelf: 'stretch',
  },
  primary: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.accent,
  },
  primaryText: {
    ...type.bodyStrong,
    color: colors.onAccent,
  },
  secondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: 52,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  secondaryText: {
    ...type.bodyStrong,
    color: colors.textSecondary,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.6 },
});
