import { Audio } from 'expo-av';

/**
 * Sound layer. The design pass calls for FIVE distinct assets (see DESIGN.md §6):
 *   complete   ~160ms rising      uncomplete ~170ms falling (mirror of complete)
 *   perfect    ~1.1s arpeggio     streak     ~450ms two-note rise
 *   mood       ~450ms warm mallet
 *
 * Those licensed files are sourced by Milan. Until they land, the five keys map
 * to the three existing assets (Metro can't `require` a file that doesn't exist,
 * so we don't reference the not-yet-added files). To upgrade: drop the new files
 * into assets/sounds/, then point each key at its file in loadAllSounds().
 */
const completeAsset = require('@/assets/sounds/pop.mp3');
const perfectAsset = require('@/assets/sounds/8_dominos_completed.wav');
const moodAsset = require('@/assets/sounds/morning_check-in.mp3');

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
    // TODO(assets): swap uncomplete + streak to their own licensed files when added.
    await this.loadSound('complete', completeAsset);
    await this.loadSound('uncomplete', completeAsset);
    await this.loadSound('perfect', perfectAsset);
    await this.loadSound('streak', perfectAsset);
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
