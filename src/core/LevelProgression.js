// LevelProgression.js
export default class LevelProgression {
  constructor(scene, player, enemy, uiManager, specialMovesSystem) {
    this.scene = scene;
    this.player = player;
    this.enemy = enemy;
    this.uiManager = uiManager;
    this.specialMovesSystem = specialMovesSystem;

    // Level configs
    this.levels = [
      {
        name: 'Novice',
        enemyHealth: 60,
        enemySpeed: 120,
        attackFreq: 1800,
        unlockMoves: [],
        scoreMultiplier: 1,
      },
      {
        name: 'Adept',
        enemyHealth: 90,
        enemySpeed: 160,
        attackFreq: 1300,
        unlockMoves: ['dragonPunch'],
        scoreMultiplier: 2,
      },
      {
        name: 'Master',
        enemyHealth: 120,
        enemySpeed: 200,
        attackFreq: 900,
        unlockMoves: ['tornadoKick'],
        scoreMultiplier: 3,
      },
      {
        name: 'Elite',
        enemyHealth: 160,
        enemySpeed: 250,
        attackFreq: 650,
        unlockMoves: ['energyWave'],
        scoreMultiplier: 4,
      },
      {
        name: 'Legendary',
        enemyHealth: 240,
        enemySpeed: 320,
        attackFreq: 400,
        unlockMoves: [],
        scoreMultiplier: 5,
        isBoss: true,
      },
    ];

    this.currentLevel = 0;
    this.achievements = new Set();
    this.highScore = Number(localStorage.getItem('kkido_highscore')) || 0;
  }

  startLevel(levelIdx = 0) {
    this.currentLevel = levelIdx;
    const level = this.levels[this.currentLevel];
    // Set enemy stats
    this.enemy.health = level.enemyHealth;
    this.enemy.maxHealth = level.enemyHealth;
    this.enemy.speed = level.enemySpeed;
    this.enemy.attackFreq = level.attackFreq;
    this.enemy.isBoss = !!level.isBoss;
    this.player.scoreMultiplier = level.scoreMultiplier;

    // Unlock moves
    level.unlockMoves.forEach(mv => this.specialMovesSystem.moves[mv].unlocked = true);

    this.uiManager.showLevel(level.name, this.currentLevel + 1, level.isBoss);
  }

  nextLevel() {
    if (this.currentLevel < this.levels.length - 1) {
      this.startLevel(this.currentLevel + 1);
    } else {
      this.uiManager.showGameComplete();
    }
  }

  trackAchievement(name) {
    if (!this.achievements.has(name)) {
      this.achievements.add(name);
      this.uiManager.showAchievement(name);
    }
  }

  updateHighScore(score) {
    if (score > this.highScore) {
      this.highScore = score;
      localStorage.setItem('kkido_highscore', String(score));
      this.uiManager.showHighScore(score);
    }
  }
}
