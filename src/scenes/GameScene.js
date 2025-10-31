import Phaser from 'phaser';
import Player from '../core/Player.js';
import Enemy from '../core/Enemy.js';
import CombatSystem from '../core/CombatSystem.js';
import UIManager from '../core/UIManager.js';
import InputHandler from '../core/InputHandler.js';

const GAME_STATE = { ACTIVE: 'active', PAUSED: 'paused', FINISHED: 'finished' };

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.state = GAME_STATE.ACTIVE;
  }

  create() {
    // Initialize player, enemy, combat system, UI
    this.player = new Player(this, 200, 500);
    this.enemy = new Enemy(this, 1080, 500, 'easy');
    this.combatSystem = new CombatSystem(this, this.player, this.enemy);
    this.uiManager = new UIManager(this, this.player, this.enemy);

    // Input handler (observer pattern)
    this.inputHandler = new InputHandler(this.input.keyboard);
    this.inputHandler.on('pause', () => this.togglePause());
    this.inputHandler.on('attack', action => this.player.handleAttack(action));

    // Listen for game over
    this.events.on('gameover', () => this.endGame());

    // ESC to pause
    this.input.keyboard.on('keydown-ESC', () => this.togglePause());
  }

  update(time, delta) {
    if (this.state === GAME_STATE.PAUSED) return;
    if (this.state === GAME_STATE.FINISHED) return;

    this.player.update(time, delta);
    this.enemy.update(time, delta);
    this.combatSystem.update(time, delta);
    this.uiManager.update();
    
    // Check for win/lose
    if (this.player.health <= 0 || this.enemy.health <= 0) {
      this.state = GAME_STATE.FINISHED;
      this.events.emit('gameover');
    }
  }

  togglePause() {
    this.state = (this.state === GAME_STATE.PAUSED) ? GAME_STATE.ACTIVE : GAME_STATE.PAUSED;
    this.uiManager.showPause(this.state === GAME_STATE.PAUSED);
  }

  endGame() {
    this.scene.start('GameOverScene', {
      winner: (this.player.health > 0) ? 'Player' : 'Enemy',
      score: this.player.score
    });
  }
}
