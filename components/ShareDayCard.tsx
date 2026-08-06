import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';
import { u, card } from '@/constants/shareCard';
import { ShareCardFrame } from './share/ShareCardFrame';
import { ShareCardRow } from './share/ShareCardRow';

export interface ShareDayPillar {
  title: string;
  activity: string;
  completed: boolean;
}

export interface ShareDayData {
  dateLabel: string;
  score: number;
  total: number;
  streak: number;
  pillars: ShareDayPillar[];
}

function scoreColor(score: number, total: number): string {
  const pct = total > 0 ? (score / total) * 100 : 0;
  if (pct >= 100) return colors.scoreFull;
  if (pct >= 75) return colors.scoreHigh;
  if (pct >= 50) return colors.scoreMid;
  return colors.scoreLow;
}

/**
 * Share-ready summary of a single day, exported at 1080x1920.
 *
 * The habit text is on the card deliberately. An earlier version withheld it as
 * a privacy measure, which made no sense: the app is local-only and the user is
 * the one hitting share. The actual risk was posting an image you had not seen,
 * and that is solved by SharePreviewSheet, which is the consent gate and must
 * never be bypassed on any path.
 */
export const ShareDayCard = forwardRef<View, { data: ShareDayData }>(({ data }, ref) => {
  const perfect = data.total > 0 && data.score >= data.total;

  return (
    <ShareCardFrame
      ref={ref}
      meta={data.dateLabel}
      heroValue={String(data.score)}
      heroSuffix={`/${data.total}`}
      heroColor={scoreColor(data.score, data.total)}
      heroLabel={perfect ? 'perfect day. all eight down.' : 'dominos down today'}
      heroLabelColor={perfect ? colors.scoreFull : undefined}
      footerLeft={
        <View style={styles.streak}>
          <Flame
            size={u(13)}
            color={data.streak > 0 ? colors.warning : colors.textMuted}
            strokeWidth={2.5}
          />
          <Text style={styles.streakText}>
            {data.streak} day streak
          </Text>
        </View>
      }
    >
      {data.pillars.map((pillar, i) => (
        <ShareCardRow key={pillar.title} pipCount={i + 1} title={pillar.title} active={pillar.completed}>
          <Text
            style={[styles.activity, pillar.completed ? styles.activityOn : styles.activityOff]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {pillar.activity?.trim() || '—'}
          </Text>
        </ShareCardRow>
      ))}
    </ShareCardFrame>
  );
});

ShareDayCard.displayName = 'ShareDayCard';

const styles = StyleSheet.create({
  activity: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: u(12),
    lineHeight: u(16),
    includeFontPadding: false,
    // react-native-web implements numberOfLines with -webkit-line-clamp, which
    // html2canvas does not support, so the web export would render the full
    // untruncated string and blow the row height. These three properties it
    // does honour.
    ...Platform.select({
      web: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } as object,
      default: {},
    }),
  },
  activityOn: { color: colors.textSecondary },
  activityOff: { color: colors.textMuted },
  streak: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: u(6),
  },
  streakText: {
    fontFamily: fonts.semibold,
    fontSize: u(11),
    letterSpacing: u(0.2),
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});
