import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player_idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Player Stats
    this.health = 100;
    this.maxHealth = 100;
    this.stamina = 100;
    this.maxStamina = 100;
    this.score = 0;

    // State
    this.isMoving = false;
    this.isAttacking = false;
    this.isBlocking = false;
    this.isDead = false;

    // Setup physics body and animations
    this.body.setCollideWorldBounds(true);

    this.setupAnimations(scene);

    // Listen for input events
    scene.inputHandler.on('move', dir => this.handleMove(dir));
    scene.inputHandler.on('attack', type => this.handleAttack(type));
    scene.inputHandler.on('block', () => this.handleBlock());

    // Internal animation state
    this.currentAnim = 'idle';
  }

  setupAnimations(scene) {
    // Example: idle, walk, punch, kick, block, hurt
    scene.anims.create({ key: 'idle', frames: scene.anims.generateFrameNumbers('player_idle', { start: 0, end: 3 }), frameRate: 6, repeat: -1 });
    scene.anims.create({ key: 'walk', frames: scene.anims.generateFrameNumbers('player_walk', { start: 0, end: 5 }), frameRate: 10, repeat: -1 });
    scene.anims.create({ key: 'punch', frames: scene.anims.generateFrameNumbers('player_punch', { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'kick', frames: scene.anims.generateFrameNumbers('player_kick', { start: 0, end: 2 }), frameRate: 12, repeat: 0 });
    scene.anims.create({ key: 'block', frames: scene.anims.generateFrameNumbers('player_block', { start: 0, end: 1 }), frameRate: 8, repeat: -1 });
    scene.anims.create({ key: 'hurt', frames: scene.anims.generateFrameNumbers('player_hurt', { start: 0, end: 1 }), frameRate: 8, repeat: 0 });
  }

  update() {
    if (this.isDead) return;

    // Animation state management
    if (this.isAttacking) return;
    if (this.isBlocking) {
      this.play('block', true);
      return;
    }
    if (this.body.velocity.x !== 0) {
      this.play('walk', true);
      this.isMoving = true;
    } else {
      this.play('idle', true);
      this.isMoving = false;
    }
  }

  handleMove(dir) {
    if (this.isDead || this.isAttacking) return;
    const speed = 220;
    switch (dir) {
      case 'left':
        this.setVelocityX(-speed);
        this.setFlipX(true);
        break;
      case 'right':
        this.setVelocityX(speed);
        this.setFlipX(false);
        break;
      case 'up':
        this.setVelocityY(-speed);
        break;
      case 'down':
        this.setVelocityY(speed);
        break;
      default:
        this.setVelocity(0);
    }
  }

  handleAttack(type) {
    if (this.isDead || this.isAttacking || this.isBlocking) return;
    this.isAttacking = true;
    this.setVelocity(0);
    let anim = type === 'kick' ? 'kick' : 'punch';
    this.play(anim, true);
    this.once('animationcomplete', () => {
      this.isAttacking = false;
      this.emit('attackComplete', type);
    });
  }

  handleBlock() {
    if (this.isDead) return;
    this.isBlocking = true;
    this.play('block', true);
    // Block lasts for a short duration
    this.scene.time.delayedCall(800, () => {
      this.isBlocking = false;
    });
  }

  takeDamage(amount) {
    if (this.isBlocking) {
      amount = Math.max(3, amount * 0.35); // Block reduces damage
    }
    this.health = Math.max(0, this.health - amount);
    this.play('hurt', true);
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.setVelocity(0);
    this.play('hurt', true);
    // More death logic here
  }

  recoverStamina(amount) {
    this.stamina = Math.min(this.maxStamina, this.stamina + amount);
  }

  useStamina(amount) {
    this.stamina = Math.max(0, this.stamina - amount);
  }
}
