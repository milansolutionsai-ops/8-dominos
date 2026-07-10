import { Audio } from 'expo-av';

/**
 * Sound layer — five distinct UI sounds (DESIGN.md §6), mp3 in assets/sounds/.
 *   complete · uncomplete · perfect · streak · mood
 */
const completeAsset = require('@/assets/sounds/complete.mp3');
const uncompleteAsset = require('@/assets/sounds/uncomplete.mp3');
const perfectAsset = require('@/assets/sounds/perfect.mp3');
const streakAsset = require('@/assets/sounds/streak.mp3');
const moodAsset = require('@/assets/sounds/mood.mp3');

type SoundKey = 'complete' | 'uncomplete' | 'perfect' | 'streak' | 'mood';

class SoundEffects {
  private sounds: { [key: string]: Audio.Sound } = {};
  private enabled: boolean = true;

  async initialize() {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }

  async loadSound(key: SoundKey, asset: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(asset, { shouldPlay: false });
      this.sounds[key] = sound;
    } catch (error) {
      console.warn(`Failed to load sound ${key}, skipping:`, error);
    }
  }

  async loadAllSounds() {
    await this.loadSound('complete', completeAsset);
    await this.loadSound('uncomplete', uncompleteAsset);
    await this.loadSound('perfect', perfectAsset);
    await this.loadSound('streak', streakAsset);
    await this.loadSound('mood', moodAsset);
  }

  async play(soundKey: SoundKey) {
    if (!this.enabled || !this.sounds[soundKey]) {
      return;
    }
    try {
      await this.sounds[soundKey].replayAsync();
    } catch (error) {
      console.error(`Failed to play sound ${soundKey}:`, error);
    }
  }

  async playComplete() {
    await this.play('complete');
  }

  async playUncomplete() {
    await this.play('uncomplete');
  }

  async playPerfect() {
    await this.play('perfect');
  }

  async playStreak() {
    await this.play('streak');
  }

  async playMood() {
    await this.play('mood');
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async cleanup() {
    for (const key in this.sounds) {
      try {
        await this.sounds[key].unloadAsync();
      } catch (error) {
        console.error(`Failed to unload sound ${key}:`, error);
      }
    }
    this.sounds = {};
  }
}

export const soundEffects = new SoundEffects();
