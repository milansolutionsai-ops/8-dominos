import AsyncStorage from '@react-native-async-storage/async-storage';
import { Domino, DAYS_OF_WEEK } from '@/types/domino';

const DOMINOS_KEY = '@dominos_data';
const ONBOARDING_KEY = '@onboarding_completed';

export class StorageService {
  static async getDominos(): Promise<Domino[]> {
    try {
      const data = await AsyncStorage.getItem(DOMINOS_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return this.getDefaultDominos();
    } catch (error) {
      console.error('Error loading dominos:', error);
      return this.getDefaultDominos();
    }
  }

  static async saveDominos(dominos: Domino[]): Promise<void> {
    try {
      await AsyncStorage.setItem(DOMINOS_KEY, JSON.stringify(dominos));
    } catch (error) {
      console.error('Error saving dominos:', error);
      throw error;
    }
  }

  static async isOnboardingCompleted(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      return value === 'true';
    } catch (error) {
      console.error('Error checking onboarding:', error);
      return false;
    }
  }

  static async setOnboardingCompleted(): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    } catch (error) {
      console.error('Error setting onboarding:', error);
      throw error;
    }
  }

  static async getSetupCompleted(): Promise<boolean> {
    return this.isOnboardingCompleted();
  }

  static async setSetupCompleted(completed: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
    } catch (error) {
      console.error('Error setting setup completed:', error);
      throw error;
    }
  }

  static createDefaultDominos(): Domino[] {
    return this.getDefaultDominos();
  }

  static async resetOnboarding(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
    } catch (error) {
      console.error('Error resetting onboarding:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([DOMINOS_KEY, ONBOARDING_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  static getDefaultDominos(): Domino[] {
    const emptyActivities = DAYS_OF_WEEK.reduce((acc, day) => {
      acc[day] = '';
      return acc;
    }, {} as Record<string, string>);

    return [
      { id: '1', title: 'Body', activities: emptyActivities, completionStatus: {} },
      { id: '2', title: 'Health', activities: emptyActivities, completionStatus: {} },
      { id: '3', title: 'Happiness', activities: emptyActivities, completionStatus: {} },
      { id: '4', title: 'Love', activities: emptyActivities, completionStatus: {} },
      { id: '5', title: 'Work', activities: emptyActivities, completionStatus: {} },
      { id: '6', title: 'Wealth', activities: emptyActivities, completionStatus: {} },
      { id: '7', title: 'Spirituality', activities: emptyActivities, completionStatus: {} },
      { id: '8', title: 'Soul', activities: emptyActivities, completionStatus: {} },
    ];
  }
  static async isSetupCompleted(): Promise<boolean> {
    return this.isOnboardingCompleted();
  }

  static async saveJournalEntry(date: string, entry: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`journal_${date}`, entry);
    } catch (error) {
      console.error('Error saving journal entry:', error);
      throw error;
    }
  }

  static async getJournalEntry(date: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`journal_${date}`);
    } catch (error) {
      console.error('Error getting journal entry:', error);
      return null;
    }
  }

  static async getAllJournalEntries(): Promise<Array<{ date: string; entry: string }>> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const journalKeys = keys.filter((key) => key.startsWith('journal_'));
      const entries = await AsyncStorage.multiGet(journalKeys);

      return entries
        .map(([key, value]: [string, string | null]) => ({
          date: key.replace('journal_', ''),
          entry: value || '',
        }))
        .sort((a: { date: string; entry: string }, b: { date: string; entry: string }) => b.date.localeCompare(a.date));
    } catch (error) {
      console.error('Error getting all journal entries:', error);
      return [];
    }
  }

  static async saveMood(date: string, period: 'morning' | 'evening', mood: number): Promise<void> {
    try {
      await AsyncStorage.setItem(`mood_${date}_${period}`, mood.toString());
    } catch (error) {
      console.error('Error saving mood:', error);
      throw error;
    }
  }

  static async getMood(date: string, period: 'morning' | 'evening'): Promise<number | null> {
    try {
      const mood = await AsyncStorage.getItem(`mood_${date}_${period}`);
      return mood ? parseInt(mood, 10) : null;
    } catch (error) {
      console.error('Error getting mood:', error);
      return null;
    }
  }

  static async getWeekMoods(startDate: string): Promise<Array<{ date: string; morning: number | null; evening: number | null }>> {
    try {
      const start = new Date(startDate);
      const weekData = [];

      for (let i = 0; i < 7; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);
        const dateStr = currentDate.toISOString().split('T')[0];

        const morning = await this.getMood(dateStr, 'morning');
        const evening = await this.getMood(dateStr, 'evening');

        weekData.push({
          date: dateStr,
          morning,
          evening,
        });
      }

      return weekData;
    } catch (error) {
      console.error('Error getting week moods:', error);
      return [];
    }
  }

  static async saveSetting(key: string, value: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(`setting_${key}`, value.toString());
    } catch (error) {
      console.error(`Error saving setting ${key}:`, error);
    }
  }

  static async getSetting(key: string, defaultValue: boolean = false): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(`setting_${key}`);
      return value !== null ? value === 'true' : defaultValue;
    } catch (error) {
      console.error(`Error getting setting ${key}:`, error);
      return defaultValue;
    }
  }
}
