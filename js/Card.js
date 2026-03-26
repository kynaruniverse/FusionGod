// js/Card.js
let nextId = 0;
class Card {
  constructor(data, isPlayer) {
    this.id = nextId++;
    this.data = { ...data };
    this.isPlayer = isPlayer;
    this.isDungeon = !isPlayer;
    this.x = 0; this.y = 0;
    this.targetX = 0; this.targetY = 0;
    this.scale = 0.1;
    this.alpha = 1;
    this.angle = 0;
    this.active = true;
    this.dragging = false;
    this.dragOffX = 0; this.dragOffY = 0;
    this.glowPulse = 0;
    this.glowDir = 1;
    this.hoverGlow = 0;
    this.dead = false;
    this.shakeX = 0; this.shakeY = 0;
  }
  // update(), draw(), contains(), shake() — EXACTLY the same as original
}