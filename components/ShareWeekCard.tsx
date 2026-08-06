import React, { forwardRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame } from 'lucide-react-native';
import { colors, fonts } from '@/constants/theme';
import { u, card } from '@/constants/shareCard';
import { ShareCardFrame } from './share/ShareCardFrame';
import { ShareCardRow } from './share/ShareCardRow';

export interface ShareWeekPillar {
  title: string;
  /** Days completed this week, 0..daysCounted. */
  count: number;
}

export interface ShareWeekData {
  dateRange: string;
  percentage: number;
  /** Days the score is judged against. Less than 7 while the week is running. */
  daysCounted: number;
  partial: boolean;
  perfectDays: number;
  streak: number;
  pillars: ShareWeekPillar[];
}

function pctColor(pct: number): string {
  if (pct >= 100) return colors.scoreFull;
  if (pct >= 75) return colors.scoreHigh;
  if (pct >= 50) return colors.scoreMid;
  return colors.scoreLow;
}

/**
 * Share-ready summary of the week, exported at 1080x1920.
 *
 * Every pillar row shows its real day count. The previous version rendered
 * eight permanently-lit tiles regardless of performance, so the largest graphic
 * on the artifact carried no information and openly contradicted the percentage
 * printed above it. A brand that sells accountability cannot ship that.
 *
 * "Top pillar" is gone: it broke ties on array order, so it read "Body" for
 * most of the week. The streak took its place, which is the number this app
 * actually owns and was somehow only on the day card.
 */
export const ShareWeekCard = forwardRef<View, { data: ShareWeekData }>(({ data }, ref) => {
  const days = Math.max(1, data.daysCounted);

  return (
    <ShareCardFrame
      ref={ref}
      meta={data.dateRange}
      heroValue={`${data.percentage}%`}
      heroColor={pctColor(data.percentage)}
      heroLabel={data.partial ? 'of my week so far' : 'of my week'}
      heroLabelColor={data.percentage >= 100 ? colors.scoreFull : undefined}
      footerLeft={
        <View style={styles.footerLeft}>
          <Flame
            size={u(13)}
            color={data.streak > 0 ? colors.warning : colors.textMuted}
            strokeWidth={2.5}
          />
          <Text style={styles.footerText}>
            {data.streak} day streak
            {data.perfectDays > 0
              ? `  ·  ${data.perfectDays} perfect ${data.perfectDays === 1 ? 'day' : 'days'}`
              : ''}
          </Text>
        </View>
      }
    >
      {data.pillars.map((pillar, i) => (
        <ShareCardRow
          key={pillar.title}
          pipCount={i + 1}
          title={pillar.title}
          active={pillar.count > 0}
        >
          <View style={styles.dots}>
            {Array.from({ length: days }, (_, d) => (
              <View
                key={d}
                style={[styles.dot, d < pillar.count ? styles.dotOn : styles.dotOff]}
              />
            ))}
          </View>
          <Text style={styles.count}>
            {pillar.count}/{days}
          </Text>
        </ShareCardRow>
      ))}
    </ShareCardFrame>
  );
});

ShareWeekCard.displayName = 'ShareWeekCard';

const styles = StyleSheet.create({
  dots: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: u(card.dotGap),
  },
  dot: {
    width: u(card.dotSize),
    height: u(card.dotSize),
    borderRadius: u(card.dotSize / 2),
  },
  dotOn: { backgroundColor: colors.accentBright },
  dotOff: { backgroundColor: colors.surfaceMuted, borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderStrong },
  count: {
    width: u(30),
    marginLeft: u(card.colGap),
    textAlign: 'right',
    fontFamily: fonts.semibold,
    fontSize: u(11),
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
    includeFontPadding: false,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: u(6),
  },
  footerText: {
    fontFamily: fonts.semibold,
    fontSize: u(11),
    letterSpacing: u(0.2),
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
});
