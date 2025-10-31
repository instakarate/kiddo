// SpecialMovesSystem.js
import EventEmitter from 'events';

export default class SpecialMovesSystem extends EventEmitter {
  constructor(scene, player, combatSystem, uiManager) {
    super();
    this.scene = scene;
    this.player = player;
    this.combatSystem = combatSystem;
    this.uiManager = uiManager;

    // Move definitions
    this.moves = {
      dragonPunch: {
        name: 'Dragon Punch',
        damage: 40,
        cooldown: 5000,
        staminaCost: 35,
        animation: 'dragonPunch',
        lastUsed: 0,
      },
      tornadoKick: {
        name: 'Tornado Kick',
        damage: 20,
        multiHit: 3,
        cooldown: 7000,
        staminaCost: 45,
        animation: 'tornadoKick',
        lastUsed: 0,
      },
      energyWave: {
        name: 'Energy Wave',
        damage: 30,
        cooldown: 10000,
        staminaCost: 55,
        animation: 'energyWave',
        lastUsed: 0,
      },
    };

    // Listen for special move triggers
    scene.inputHandler.on('specialMove', moveName => this.executeMove(moveName));
  }

  canUseMove(moveName) {
    const move = this.moves[moveName];
    const now = this.scene.time.now;
    return (
      move &&
      this.player.stamina >= move.staminaCost &&
      now - move.lastUsed >= move.cooldown
    );
  }

  executeMove(moveName) {
    const move = this.moves[moveName];
    if (!move || !this.canUseMove(moveName) || this.player.isDead) return;

    move.lastUsed = this.scene.time.now;
    this.player.useStamina(move.staminaCost);
    this.player.play(move.animation, true);

    if (moveName === 'tornadoKick') {
      // Multi-hit logic
      for (let i = 0; i < move.multiHit; i++) {
        this.scene.time.delayedCall(i * 200, () => {
          this.combatSystem.handleAttack(this.player, this.scene.enemy, 'kick', move.damage);
        });
      }
    } else if (moveName === 'energyWave') {
      // Projectile logic
      this.emit('energyWave', { x: this.player.x, y: this.player.y, direction: this.player.flipX ? -1 : 1, damage: move.damage });
    } else {
      // Dragon Punch: single high damage
      this.combatSystem.handleAttack(this.player, this.scene.enemy, 'punch', move.damage);
    }

    this.uiManager.showSpecialMove(move.name);
    this.emit('used', moveName);
  }

  getCooldown(moveName) {
    const move = this.moves[moveName];
    if (!move) return 0;
    return Math.max(0, move.cooldown - (this.scene.time.now - move.lastUsed));
  }
}
