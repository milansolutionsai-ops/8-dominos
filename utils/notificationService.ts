import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { SchedulableTriggerInputTypes } from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export class NotificationService {
    static async requestPermissions() {
        if (Platform.OS === 'web') return false;

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        return finalStatus === 'granted';
    }

    static async scheduleDailyReminder() {
        if (Platform.OS === 'web') return;

        // Check if permission is granted
        const hasPermission = await this.requestPermissions();
        if (!hasPermission) return;

        // Cancel existing reminders first to avoid duplicates
        await this.cancelAllReminders();

        // Schedule for 9:00 PM (21:00)
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "8 Dominos 🏁",
                body: "Have you completed your dominos for today? Take a moment to check in.",
                sound: true,
            },
            trigger: {
                type: SchedulableTriggerInputTypes.DAILY,
                hour: 21,
                minute: 0,
            } as Notifications.DailyTriggerInput,
        });
    }

    static async cancelAllReminders() {
        if (Platform.OS === 'web') return;
        await Notifications.cancelAllScheduledNotificationsAsync();
    }
}
