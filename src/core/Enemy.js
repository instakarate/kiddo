import Phaser from 'phaser';

const DIFFICULTY = {
  easy: { health: 60, damage: 7, speed: 120, attackFreq: 1800 },
  medium: { health: 90, damage: 12, speed: 180, attackFreq: 1200 },
  hard: { health: 120, damage: 18, speed: 220, attackFreq: 800 },
  boss: { health: 200, damage: 25, speed: 280, attackFreq: 500 }
};

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, difficulty = 'easy') {
    super(scene, x, y, 'enemy_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.difficulty = difficulty;
    Object.assign(this, DIFFICULTY[difficulty]);

    this.maxHealth = this.health;
    this.isDead = false;
    this.state = 'patrol'; // patrol, pursue, attack, evade, defend

    this.body.setCollideWorldBounds(true);

    this.setupAnimations(scene);

    // AI decision timer
    this.decisionTimer = scene.time.addEvent({
      delay: this.attackFreq,
      loop: true,
      callback: this.aiDecision,
      callbackScope: this
    });

    this.target = scene.player; // Assumes player instance is passed or available
  }

  setupAnimations(scene) {
    scene.anims.create({ key: 'enemy_idle', frames: scene.anims.generateFrameNumbers('enemy_idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    scene.anims.create({ key: 'enemy_walk', frames: scene.anims.generateFrameNumbers('enemy_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'enemy_punch', frames: scene.anims.generateFrameNumbers('enemy_punch', { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'enemy_kick', frames: scene.anims.generateFrameNumbers('enemy_kick', { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'enemy_block', frames: scene.anims.generateFrameNumbers('enemy_block', { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'enemy_hurt', frames: scene.anims.generateFrameNumbers('enemy_hurt', { start: 0, end: 1 }), frameRate: 8, repeat: 0 });
  }

  update() {
    if (this.isDead) return;

    if (this.state === 'patrol') {
      this.patrol();
    } else if (this.state === 'pursue') {
      this.pursue();
    } else if (this.state === 'attack') {
      this.attack();
    } else if (this.state === 'evade') {
      this.evade();
    } else if (this.state === 'defend') {
      this.block();
    }
  }

  aiDecision() {
    if (this.isDead) return;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

    // Distance-based behavior
    if (distance < 80) {
      // Attack or block
      if (Math.random() < 0.7) {
        this.state = 'attack';
      } else {
        this.state = 'defend';
      }
    } else if (distance < 300) {
      // Pursue
      this.state = 'pursue';
    } else {
      // Patrol/evade
      this.state = Math.random() < 0.4 ? 'evade' : 'patrol';
    }
  }

  patrol() {
    this.setVelocityX(this.speed * (Math.random() > 0.5 ? 1 : -1));
    this.play('enemy_walk', true);
  }

  pursue() {
    const dir = (this.target.x < this.x) ? -1 : 1;
    this.setVelocityX(this.speed * dir);
    this.play('enemy_walk', true);
  }

  attack() {
    this.setVelocity(0);
    const attackType = Math.random() > 0.5 ? 'enemy_punch' : 'enemy_kick';
    this.play(attackType, true);
    this.once('animationcomplete', () => {
      // Emit attack event for CombatSystem
      this.emit('attackComplete', attackType.includes('kick') ? 'kick' : 'punch');
      this.state = 'patrol';
    });
  }

  block() {
    this.setVelocity(0);
    this.play('enemy_block', true);
    // Block lasts for a short duration
    this.scene.time.delayedCall(600, () => {
      this.state = 'patrol';
    });
  }

  evade() {
    this.setVelocityX(this.speed * (Math.random() > 0.5 ? 1 : -1));
    this.play('enemy_walk', true);
    this.scene.time.delayedCall(350, () => {
      this.state = 'patrol';
    });
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    this.play('enemy_hurt', true);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0);
    this.play('enemy_hurt', true);
    this.decisionTimer.remove();
    // More death logic here
  }
}
