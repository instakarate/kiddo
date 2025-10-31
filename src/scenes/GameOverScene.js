import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.winner = data.winner;
    this.score = data.score;
  }

  create() {
    this.add.text(this.scale.width / 2, 200, `Game Over!`, {
      font: '56px Arial',
      color: '#fff'
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 300, `Winner: ${this.winner}`, {
      font: '32px Arial',
      color: '#fff'
    }).setOrigin(0.5);

    this.add.text(this.scale.width / 2, 380, `Score: ${this.score}`, {
      font: '32px Arial',
      color: '#fff'
    }).setOrigin(0.5);

    // Replay Button
    const replayBtn = this.add.text(this.scale.width / 2, 480, 'Replay', {
      font: '32px Arial', color: '#222', backgroundColor: '#fff', padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('GameScene'));

    // Menu Button
    const menuBtn = this.add.text(this.scale.width / 2, 560, 'Main Menu', {
      font: '32px Arial', color: '#222', backgroundColor: '#fff', padding: { x: 20, y: 10 }
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
