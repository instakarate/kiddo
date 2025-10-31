// VisualEffectsSystem.js
export default class VisualEffectsSystem {
  constructor(scene) {
    this.scene = scene;
    this.particleEmitter = scene.add.particles('spark').createEmitter({
      x: 0, y: 0, speed: { min: -100, max: 100 }, lifespan: 350, scale: { start: 0.8, end: 0 }, alpha: { start: 1, end: 0 },
      on: false
    });
    this.blockEmitter = scene.add.particles('blockSpark').createEmitter({
      x: 0, y: 0, speed: { min: -60, max: 60 }, lifespan: 200, scale: { start: 0.5, end: 0 }, alpha: { start: 1, end: 0 },
      on: false
    });
  }

  hitFlash(target) {
    const origTint = target.tintTopLeft;
    target.setTint(0xffffff);
    this.scene.time.delayedCall(80, () => target.setTint(origTint || 0xffffff));
  }

  comboParticles(x, y) {
    this.particleEmitter.setPosition(x, y);
    this.particleEmitter.explode(15, x, y);
  }

  blockSparks(x, y) {
    this.blockEmitter.setPosition(x, y);
    this.blockEmitter.explode(10, x, y);
  }

  impactShake(intensity = 0.015, duration = 180) {
    this.scene.cameras.main.shake(duration, intensity);
  }

  criticalHitFlash(target) {
    target.setTint(0xff0000);
    this.scene.time.delayedCall(120, () => target.setTint(0xffffff));
    this.scene.cameras.main.flash(180, 255, 0, 0);
  }

  integrateWithCombat(combatSystem) {
    combatSystem.on('hit', ({ defender, damage }) => {
      this.hitFlash(defender);
      if (damage > 25) this.impactShake();
    });
    combatSystem.on('block', ({ defender }) => {
      this.blockSparks(defender.x, defender.y);
    });
    combatSystem.on('combo', ({ attacker }) => {
      this.comboParticles(attacker.x, attacker.y - 30);
    });
    combatSystem.on('criticalHit', ({ defender }) => {
      this.criticalHitFlash(defender);
    });
  }
}
