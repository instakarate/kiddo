// SoundManager.js
export default class SoundManager {
  constructor(scene) {
    this.scene = scene;

    // Load sounds
    this.sounds = {
      punch: scene.sound.add('punch', { volume: 0.7 }),
      kick: scene.sound.add('kick', { volume: 0.7 }),
      block: scene.sound.add('block', { volume: 0.6 }),
      hit: scene.sound.add('hit', { volume: 0.8 }),
      combo: scene.sound.add('combo', { volume: 0.8 }),
      gameOver: scene.sound.add('gameOver', { volume: 0.9 }),
    };
    this.music = scene.sound.add('bgm', { volume: 0.5, loop: true });

    // Volume settings
    this.masterVolume = 1.0;
    this.sfxVolume = 0.7;
    this.musicVolume = 0.5;
    this.muted = false;
  }

  play(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].setVolume(this.sfxVolume * this.masterVolume);
      if (!this.muted) this.sounds[soundName].play();
    }
  }

  playMusic() {
    if (!this.music.isPlaying && !this.muted) this.music.play();
  }

  stopMusic() {
    if (this.music.isPlaying) this.music.stop();
  }

  setMasterVolume(vol) {
    this.masterVolume = vol;
    this.updateVolumes();
  }

  setSFXVolume(vol) {
    this.sfxVolume = vol;
    this.updateVolumes();
  }

  setMusicVolume(vol) {
    this.musicVolume = vol;
    this.music.setVolume(this.musicVolume * this.masterVolume);
  }

  toggleMute() {
    this.muted = !this.muted;
    this.updateVolumes();
    if (this.muted) this.stopMusic();
    else this.playMusic();
  }

  updateVolumes() {
    Object.values(this.sounds).forEach(snd => snd.setVolume(this.sfxVolume * this.masterVolume));
    this.music.setVolume(this.musicVolume * this.masterVolume);
  }

  integrateWithCombat(combatSystem) {
    combatSystem.on('hit', ({ attacker, defender, damage }) => {
      this.play('hit');
    });
    combatSystem.on('block', () => this.play('block'));
    combatSystem.on('combo', () => this.play('combo'));
    combatSystem.on('criticalHit', () => this.play('hit'));
  }
}
