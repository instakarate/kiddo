import Phaser from 'phaser';
import EventEmitter from 'events';

export default class CombatSystem extends EventEmitter {
  constructor(scene, player, enemy) {
    super();
    this.scene = scene;
    this.player = player;
    this.enemy = enemy;

    // Combo system
    this.comboCount = 0;
    this.comboMultiplier = 1;
    this.comboTimer = null;
    this.comboBreakDuration = 4000; // 4 seconds

    // Listen for attack events
    this.player.on('attackComplete', type => this.handleAttack(this.player, this.enemy, type));
    this.enemy.on('attackComplete', type => this.handleAttack(this.enemy, this.player, type));
  }

  update() {
    // Hitbox checking logic can go here if pooling is needed
    // For prototype, simple overlap check
    // Example: check for active attack and overlap
  }

  handleAttack(attacker, defender, type) {
    // Only process if both are alive
    if (attacker.isDead || defender.isDead) return;

    // Simple hitbox check: if attacker and defender are close horizontally
    const hitRange = 70;
    if (Phaser.Math.Distance.Between(attacker.x, attacker.y, defender.x, defender.y) < hitRange) {
      let baseDamage = type === 'kick' ? 15 : 10;
      let comboBonus = this.comboMultiplier;
      let totalDamage = baseDamage * comboBonus;

      // Block mechanic
      if (defender.isBlocking) {
        totalDamage = Math.max(3, totalDamage * 0.35);
        this.emit('block', { attacker, defender, reduced: totalDamage });
      } else {
        this.emit('hit', { attacker, defender, damage: totalDamage });
      }

      defender.takeDamage(totalDamage);

      // Combo tracking
      if (attacker === this.player) {
        this.comboCount += 1;
        this.comboMultiplier = Math.min(5, 1 + Math.floor(this.comboCount / 2));
        this.player.score += totalDamage * this.comboMultiplier;
        this.emit('combo', { count: this.comboCount, multiplier: this.comboMultiplier });
        this.resetComboTimer();
      } else {
        this.comboCount = 0;
        this.comboMultiplier = 1;
        this.emit('comboEnded');
      }
    } else {
      // Missed attack resets combo
      if (attacker === this.player) {
        this.comboCount = 0;
        this.comboMultiplier = 1;
        this.emit('comboBroke');
      }
    }
  }

  resetComboTimer() {
    if (this.comboTimer) this.comboTimer.remove();
    this.comboTimer = this.scene.time.delayedCall(this.comboBreakDuration, () => {
      this.comboCount = 0;
      this.comboMultiplier = 1;
      this.emit('comboEnded');
    });
  }
}
