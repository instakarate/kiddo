import Phaser from 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Title
    this.add.text(this.scale.width / 2, 150, 'Karate Kido', {
      font: '64px Arial',
      color: '#fff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    // Button styles
    const buttonStyle = { font: '32px Arial', color: '#222', backgroundColor: '#fff', padding: { x: 20, y: 10 } };

    // Start Game Button
    const startBtn = this.add.text(this.scale.width / 2, 300, 'Start Game', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('GameScene'));

    // Options Button
    const optionsBtn = this.add.text(this.scale.width / 2, 380, 'Options', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showOptions());

    // Credits Button
    const creditsBtn = this.add.text(this.scale.width / 2, 460, 'Credits', buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.showCredits());
  }

  showOptions() {
    // Placeholder for options logic
    alert('Options coming soon!');
  }

  showCredits() {
    // Placeholder for credits logic
    alert('Created by instakarate!');
  }
}
