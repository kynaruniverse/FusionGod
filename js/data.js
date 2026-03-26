// js/data.js
const CARD_W = 90, CARD_H = 120;
const HAND_Y_RATIO = 0.82;
const DUNGEON_Y_RATIO = 0.28;
const HAND_SLOTS = 5;

const ELEMENTS = { /* exact same as your original */ };
const ELEMENT_KEYS = Object.keys(ELEMENTS);

const FUSIONS = {
  // ← YOUR ORIGINAL TABLE, but with balance nerfs applied:
  'fire+water':      { id:'steam',    name:'Steam Wraith',   icon:'💨', atk:10, hp:18, color:'#b0bec5', glow:'#eceff1' },
  // ... (all others unchanged except the god-tier ones below)
  'fire+lightning':  { id:'inferno',  name:'Inferno God',    icon:'☄️', atk:24, hp:9,  color:'#e53935', glow:'#ff8f00' }, // nerfed
  'fire+void':       { id:'obliteron',name:'Obliteron',      icon:'💀', atk:28, hp:7,  color:'#37474f', glow:'#ff3d00' }, // nerfed
  'arcane+void':     { id:'singularity',name:'Singularity',  icon:'🌌', atk:32, hp:13, color:'#311b92', glow:'#9c27b0' }, // nerfed
  'shadow+void':     { id:'annihil',  name:'Annihilator',    icon:'🕳👹',atk:30, hp:10, color:'#000000', glow:'#b71c1c' }, // nerfed
  // rest of your fusions unchanged...
  // (copy the rest exactly from your original FUSIONS object)
};

const DUNGEON_POOL = [ /* exact same as original */ ];

function getFusionKey(a, b) { /* same */ }
function getFusion(idA, idB) { /* same as original */ }
function getRandomDungeonCard(depth) {
  // enhanced with boss chance
  if (depth >= 8 && Math.random() < 0.18) {
    return { id:'boss', name:'Ancient Wyrm', icon:'🐉', atk:45, hp:110, type:'enemy', color:'#b71c1c', glow:'#ef9a9a', desc:'The depths awaken.' };
  }
  // rest of your original logic unchanged
}