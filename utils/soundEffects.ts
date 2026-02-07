import { Audio } from 'expo-av';

// Import local sound assets
const popSoundAsset = require('@/assets/sounds/pop.mp3');
const successSoundAsset = require('@/assets/sounds/8_dominos_completed.wav');
const chimeSoundAsset = require('@/assets/sounds/morning_check-in.mp3');

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

  async loadSound(key: string, asset: any) {
    try {
      const { sound } = await Audio.Sound.createAsync(asset, { shouldPlay: false });
      this.sounds[key] = sound;
    } catch (error) {
      console.warn(`Failed to load sound ${key}, skipping:`, error);
    }
  }

  async loadAllSounds() {
    await this.loadSound('toggle', popSoundAsset);
    await this.loadSound('complete', popSoundAsset);
    await this.loadSound('perfect', successSoundAsset); // Celebration sound for confetti!
    await this.loadSound('mood', chimeSoundAsset); // Subtle chime for mood check-in
  }

  async play(soundKey: string) {
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

  async playPerfect() {
    await this.play('perfect');
  }

  async playToggle() {
    await this.play('toggle');
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
