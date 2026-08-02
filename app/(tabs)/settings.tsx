import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Switch, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { Settings, Volume2, VolumeX, Bell, BellOff, RotateCcw, Trash2, Info } from 'lucide-react-native';
import { NotificationService } from '@/utils/notificationService';
import { DominoSetupForm } from '@/components/DominoSetupForm';
import { useDominos } from '@/hooks/useDominos';
import { StorageService } from '@/utils/storage';
import { DateUtils } from '@/utils/dateUtils';
import { soundEffects } from '@/utils/soundEffects';
import { DominoPips } from '@/components/DominoPips';
import { PILLAR_DESCRIPTORS } from '@/types/domino';

/** The eight pillars in domino order, Body = 1 … Soul = 8. Copy matches 8dominos.com. */
const PILLAR_ORDER = ['Body', 'Health', 'Happiness', 'Love', 'Work', 'Wealth', 'Spirituality', 'Soul'].map(
  (name) => ({ name, hint: PILLAR_DESCRIPTORS[name.toLowerCase()] })
);
import { colors, fonts } from '@/constants/theme';

import { StatsService } from '@/utils/stats';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { dominos, loading, updateDominos, refreshDominos } = useDominos();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [stats, setStats] = useState({
    totalDominos: 0,
    currentStreak: 0,
    perfectDays: 0,
    bestWeek: '-',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const sound = await StorageService.getSetting('soundEnabled', true);
    const notifications = await StorageService.getSetting('notificationsEnabled', false);

    setSoundEnabled(sound);
    setNotificationsEnabled(notifications);

    // Sync sound effects utility
    soundEffects.setEnabled(sound);
  };

  useFocusEffect(
    React.useCallback(() => {
      refreshDominos();
      loadSettings();
    }, [])
  );

  useEffect(() => {
    if (dominos.length > 0) {
      const calculatedStats = StatsService.calculateStats(dominos);
      setStats(calculatedStats);
    }
  }, [dominos]);

  const handleSave = async (newDominos: any[]) => {
    await updateDominos(newDominos);
  };

  const handleReset = async () => {
    const defaultDominos = StorageService.createDefaultDominos();
    await updateDominos(defaultDominos);
  };

  const handleResetWeek = () => {
    Alert.alert(
      'Reset This Week',
      'This will clear all completion data for the current week. Activities will remain unchanged.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Week',
          style: 'destructive',
          onPress: async () => {
            try {
              const currentWeekKey = DateUtils.getCurrentWeekKey();
              const updatedDominos = dominos.map(domino => ({
                ...domino,
                completionStatus: {
                  ...domino.completionStatus,
                  [currentWeekKey]: {
                    monday: false,
                    tuesday: false,
                    wednesday: false,
                    thursday: false,
                    friday: false,
                    saturday: false,
                    sunday: false,
                  }
                }
              }));
              await updateDominos(updatedDominos);
              Alert.alert('Week Reset', 'This week\'s progress has been cleared.');
            } catch (error) {
              console.error('Error resetting week:', error);
              Alert.alert('Error', 'Failed to reset week data.');
            }
          },
        },
      ]
    );
  };

  const handleResetAllData = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your progress and activities. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.setSetupCompleted(false);
              const defaultDominos = StorageService.createDefaultDominos();
              await updateDominos(defaultDominos);
              Alert.alert('Reset Complete', 'All data has been reset.', [
                { text: 'OK', onPress: () => router.replace('/') }
              ]);
            } catch (error) {
              console.error('Error resetting data:', error);
              Alert.alert('Error', 'Failed to reset data.');
            }
          },
        },
      ]
    );
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    soundEffects.setEnabled(enabled);
    StorageService.saveSetting('soundEnabled', enabled);
    if (enabled) {
      soundEffects.playComplete();
    }
  };


  const handleNotificationsToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    StorageService.saveSetting('notificationsEnabled', enabled);

    if (enabled) {
      await NotificationService.scheduleDailyReminder();
    } else {
      await NotificationService.cancelAllReminders();
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Settings size={32} color={colors.textPrimary} strokeWidth={2} />
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitleSmall}>Your Journey</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalDominos}</Text>
              <Text style={styles.statLabel}>Lifetime Total</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.currentStreak}</Text>
              <Text style={styles.statLabel}>Daily Streak</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.perfectDays}</Text>
              <Text style={styles.statLabel}>Lifetime Perfect</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.bestWeek}</Text>
              <Text style={styles.statLabel}>Weekly Record</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {soundEnabled ? (
                <Volume2 size={24} color={colors.textPrimary} strokeWidth={2} />
              ) : (
                <VolumeX size={24} color={colors.textPrimary} strokeWidth={2} />
              )}
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Sound Effects</Text>
                <Text style={styles.settingDescription}>Play sounds when completing dominos</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={handleSoundToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={soundEnabled ? colors.onAccent : colors.textMuted}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              {notificationsEnabled ? (
                <Bell size={24} color={colors.textPrimary} strokeWidth={2} />
              ) : (
                <BellOff size={24} color={colors.textPrimary} strokeWidth={2} />
              )}
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Daily Reminders</Text>
                <Text style={styles.settingDescription}>Get notified to complete your dominos</Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={notificationsEnabled ? colors.onAccent : colors.textMuted}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activities</Text>
          <DominoSetupForm
            dominos={dominos}
            onSave={handleSave}
            onReset={handleReset}
            onResetWeek={handleResetWeek}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetWeek}
          >
            <View style={[styles.actionIconContainer, styles.warningIconContainer]}>
              <RotateCcw size={24} color={colors.warning} strokeWidth={2} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={styles.actionTitle}>Reset This Week</Text>
              <Text style={styles.actionDescription}>Clear all progress for the current week</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetAllData}
          >
            <View style={[styles.actionIconContainer, styles.dangerIconContainer]}>
              <Trash2 size={24} color={colors.danger} strokeWidth={2} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.danger }]}>Delete All Data</Text>
              <Text style={styles.actionDescription}>Permanently remove all dominos and progress</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <Info size={24} color={colors.textPrimary} strokeWidth={2} />
              <Text style={styles.infoTitle}>The 8 Dominos Philosophy</Text>
            </View>
            <Text style={styles.infoDescription}>
              Your life stands on eight dominos. Knock one down and it tips the next.
            </Text>

            <View style={styles.pillarList}>
              {PILLAR_ORDER.map((pillar, i) => (
                <View key={pillar.name} style={styles.pillarRow}>
                  <View style={styles.pillarPip}>
                    <DominoPips count={i + 1} color={colors.onAccent} size={14} />
                  </View>
                  <Text style={styles.pillarName}>{pillar.name}</Text>
                  <Text style={styles.pillarHint}>{pillar.hint}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.infoDescription}>
              It’s not about doing more. It’s about doing what matters one day at a time, until your life reflects it.
            </Text>
            <Text style={styles.infoQuote}>“What if you did everything you said you would do? What would your life look like?”</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://8dominos.com')} activeOpacity={0.7}>
              <Text style={styles.infoLink}>8dominos.com</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.versionCard}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <Text style={styles.builtByText}>Built by Hasslogics</Text>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginTop: 12,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
    opacity: 0.6,
  },
  settingItem: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  actionButton: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  warningIconContainer: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.warning,
  },
  dangerIconContainer: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.danger,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  infoCard: {
    backgroundColor: colors.accentSoft,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  infoDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textPrimary,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoQuote: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    fontStyle: 'italic',
  },
  infoLink: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.accent,
    marginTop: 12,
  },
  pillarList: {
    marginTop: 14,
    marginBottom: 14,
    gap: 8,
  },
  pillarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillarPip: {
    width: 24,
    height: 34,
    borderRadius: 6,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pillarName: {
    fontSize: 14,
    fontFamily: fonts.semibold,
    color: colors.textPrimary,
    width: 104,
  },
  pillarHint: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  versionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  builtByText: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '800',
    fontFamily: fonts.bold,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: fonts.regular,
    color: colors.textMuted,
    textAlign: 'center',
  },
  spacer: {
    height: 20,
  },
});
