import Phaser from 'phaser';

export default class UIManager {
  constructor(scene, player, enemy) {
    this.scene = scene;
    this.player = player;
    this.enemy = enemy;

    // Health bars
    this.playerHealthBar = scene.add.rectangle(200, 40, 300, 28, 0x2ecc40).setOrigin(0, 0.5);
    this.enemyHealthBar = scene.add.rectangle(780, 40, 300, 28, 0xe74c3c).setOrigin(0, 0.5);

    // Score
    this.scoreText = scene.add.text(650, 20, 'Score: 0', { font: '24px Arial', color: '#fff' }).setOrigin(0.5);

    // Combo
    this.comboText = scene.add.text(650, 70, '', { font: '32px Arial', color: '#ffeb3b' }).setOrigin(0.5);

    // Stamina/Power meter
    this.staminaBar = scene.add.rectangle(200, 80, 300, 16, 0x3498db).setOrigin(0, 0.5);

    // Move list
    this.moveListText = scene.add.text(40, 120,
      'Moves: ←/→/A/D = Move | SPACE = Punch | E = Kick | Hold B = Block', { font: '18px Arial', color: '#fff' });

    // Pause overlay
    this.pauseOverlay = scene.add.rectangle(scene.scale.width / 2, scene.scale.height / 2, scene.scale.width, scene.scale.height, 0x000000, 0.4).setVisible(false);
    this.pauseText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, 'PAUSED', { font: '56px Arial', color: '#fff' }).setOrigin(0.5).setVisible(false);

    // FPS counter (for debugging)
    this.fpsText = scene.add.text(10, 10, '', { font: '16px Arial', color: '#888' });

    // Listen for combat events
    scene.combatSystem.on('combo', data => this.showCombo(data.count, data.multiplier));
    scene.combatSystem.on('comboEnded', () => this.hideCombo());
    scene.combatSystem.on('comboBroke', () => this.comboText.setText('Combo Broke!').setColor('#e74c3c'));

    // Color warning for critical health
    this.criticalHealthThreshold = 0.25;
  }

  update() {
    // Health bars
    this.playerHealthBar.width = 300 * (this.player.health / this.player.maxHealth);
    this.enemyHealthBar.width = 300 * (this.enemy.health / this.enemy.maxHealth);

    if (this.player.health / this.player.maxHealth < this.criticalHealthThreshold)
      this.playerHealthBar.setFillStyle(0xff4136);
    else
      this.playerHealthBar.setFillStyle(0x2ecc40);

    if (this.enemy.health / this.enemy.maxHealth < this.criticalHealthThreshold)
      this.enemyHealthBar.setFillStyle(0xff4136);
    else
      this.enemyHealthBar.setFillStyle(0xe74c3c);

    // Stamina
    this.staminaBar.width = 300 * (this.player.stamina / this.player.maxStamina);

    // Score
    this.scoreText.setText(`Score: ${this.player.score}`);

    // FPS (debug)
    this.fpsText.setText(`FPS: ${Math.floor(this.scene.game.loop.actualFps)}`);
  }

  showCombo(count, multiplier) {
    this.comboText.setText(`Combo x${multiplier}! (${count} hits)`).setColor('#ffeb3b');
    this.scene.tweens.add({
      targets: this.comboText,
      scale: { from: 1, to: 1.3 },
      duration: 180,
      yoyo: true
    });
  }

  hideCombo() {
    this.comboText.setText('');
  }

  showPause(isPaused) {
    this.pauseOverlay.setVisible(isPaused);
    this.pauseText.setVisible(isPaused);
  }
}
