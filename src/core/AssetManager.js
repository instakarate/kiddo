// AssetManager.js
export default class AssetManager {
  constructor(scene) {
    this.scene = scene;
    this.assetsLoaded = false;
  }

  preload() {
    // Sprites
    this.scene.load.spritesheet('player_idle', 'assets/images/player_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('player_walk', 'assets/images/player_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('player_punch', 'assets/images/player_punch.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('player_kick', 'assets/images/player_kick.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('player_block', 'assets/images/player_block.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('player_hurt', 'assets/images/player_hurt.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('dragonPunch', 'assets/images/dragon_punch.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('tornadoKick', 'assets/images/tornado_kick.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('energyWave', 'assets/images/energy_wave.png', { frameWidth: 64, frameHeight: 64 });

    this.scene.load.spritesheet('enemy_idle', 'assets/images/enemy_idle.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('enemy_walk', 'assets/images/enemy_walk.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('enemy_punch', 'assets/images/enemy_punch.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('enemy_kick', 'assets/images/enemy_kick.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('enemy_block', 'assets/images/enemy_block.png', { frameWidth: 64, frameHeight: 64 });
    this.scene.load.spritesheet('enemy_hurt', 'assets/images/enemy_hurt.png', { frameWidth: 64, frameHeight: 64 });

    // Effects
    this.scene.load.image('spark', 'assets/images/spark.png');
    this.scene.load.image('blockSpark', 'assets/images/block_spark.png');
    this.scene.load.image('energyWave_proj', 'assets/images/energy_wave_proj.png');

    // Audio
    this.scene.load.audio('punch', 'assets/audio/punch.wav');
    this.scene.load.audio('kick', 'assets/audio/kick.wav');
    this.scene.load.audio('block', 'assets/audio/block.wav');
    this.scene.load.audio('hit', 'assets/audio/hit.wav');
    this.scene.load.audio('combo', 'assets/audio/combo.wav');
    this.scene.load.audio('gameOver', 'assets/audio/gameOver.wav');
    this.scene.load.audio('bgm', 'assets/audio/bgm.mp3');

    // Backgrounds/UI
    this.scene.load.image('dojo_bg', 'assets/images/dojo_bg.png');
    this.scene.load.image('hud_ui', 'assets/images/hud_ui.png');
  }

  create() {
    this.assetsLoaded = true;
  }

  getSprite(key) {
    return this.scene.textures.exists(key) ? key : null;
  }

  getAudio(key) {
    return this.scene.sound.get(key) || null;
  }

  getImage(key) {
    return this.scene.textures.exists(key) ? key : null;
  }
}
