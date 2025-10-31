import Phaser from 'phaser';
import EventEmitter from 'events';

export default class InputHandler extends EventEmitter {
  constructor(keyboard) {
    super();
    this.keyboard = keyboard;

    // Arrow keys and WASD
    this.cursors = keyboard.createCursorKeys();
    this.keys = keyboard.addKeys({
      'W': Phaser.Input.Keyboard.KeyCodes.W,
      'A': Phaser.Input.Keyboard.KeyCodes.A,
      'S': Phaser.Input.Keyboard.KeyCodes.S,
      'D': Phaser.Input.Keyboard.KeyCodes.D,
      'SPACE': Phaser.Input.Keyboard.KeyCodes.SPACE,
      'E': Phaser.Input.Keyboard.KeyCodes.E,
      'ESC': Phaser.Input.Keyboard.KeyCodes.ESC
    });

    // Listen for attacks
    this.keys.SPACE.on('down', () => this.emit('attack', 'punch'));
    this.keys.E.on('down', () => this.emit('attack', 'kick'));

    // Listen for pause
    this.keys.ESC.on('down', () => this.emit('pause'));

    // Movement keys
    keyboard.on('keydown', event => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          this.emit('move', 'left');
          break;
        case 'ArrowRight':
        case 'KeyD':
          this.emit('move', 'right');
          break;
        case 'ArrowUp':
        case 'KeyW':
          this.emit('move', 'up');
          break;
        case 'ArrowDown':
        case 'KeyS':
          this.emit('move', 'down');
          break;
      }
    });
  }
}
