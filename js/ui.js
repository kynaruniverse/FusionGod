// js/ui.js
// All your roundRect, drawStat, shadeColor, toast(), updateHUD(), drawBackground(), drawZoneLabels(), drawParticles() live here
// I also added a tiny Web Audio sound engine:
const AudioEngine = {
  ctx: new (window.AudioContext || window.webkitAudioContext)(),
  playSFX(type) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain).connect(this.ctx.destination);
    if (type === 'fuse') { osc.frequency.setValueAtTime(420, this.ctx.currentTime); gain.gain.value = 0.3; }
    if (type === 'fight') { osc.frequency.setValueAtTime(180, this.ctx.currentTime); gain.gain.value = 0.6; }
    osc.start();
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
    osc.stop(this.ctx.currentTime + 0.4);
  }
};
// Call AudioEngine.playSFX('fuse') in performFusion, etc.