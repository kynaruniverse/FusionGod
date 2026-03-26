// js/game.js
class FusionGod {
  constructor() {
    this.state = { hp: 100, maxHp: 100, gold: 0, depth: 1, discoveredFusions: new Set() };
    this.handCards = [];
    this.dungeonCards = [];
    this.particles = [];
    this.screenShake = { x:0, y:0, power:0 };
    this.dragCard = null;
    this.hoverCard = null;
    this.gameRunning = false;
    this.lastTime = 0;
  }

  loadSave() {
    const saved = localStorage.getItem('fusionGodSave');
    if (saved) {
      const data = JSON.parse(saved);
      this.state.discoveredFusions = new Set(data.discovered || []);
      // you can expand this later
    }
  }

  saveGame() {
    localStorage.setItem('fusionGodSave', JSON.stringify({
      discovered: Array.from(this.state.discoveredFusions)
    }));
  }

  resetState() {
    this.state = { hp: 100, maxHp: 100, gold: 0, depth: 1, discoveredFusions: new Set() };
    this.loadSave();
  }

  // drawCard() with hand limit
  drawCard() {
    if (this.handCards.filter(c => !c.dead).length >= HAND_SLOTS) {
      const toDiscard = this.handCards.find(c => !c.data.isFusion) || this.handCards[0];
      if (toDiscard) toDiscard.dead = true;
      toast("Hand full — oldest card discarded", 1800);
    }
    // rest of original drawCard logic...
  }

  // performFusion now uses requestAnimationFrame
  performFusion(cardA, cardB) { /* upgraded version I showed earlier */ }

  // doCombat, handleDungeonInteraction, fillDungeon, layoutGame, etc. — all moved here with balance tweak
  doCombat(playerCard, dungeonCard) {
    // ... same but with gentler damage: dc.atk * 0.18
  }

  shake(power) { this.screenShake.power = power; }
  spawnBurst(x, y, color, count=20) { /* same */ }
  updateParticles(dt) { /* same */ }
  updateShake(dt) { /* same */ }
}