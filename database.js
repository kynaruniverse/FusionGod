const ELEMENT_DATA = {
    'fire': { id: 'fire', name: 'Fire', traits: ['aggressive', 'hot'], atk: 10, hp: 5 },
    'water': { id: 'water', name: 'Water', traits: ['fluid', 'cold'], atk: 5, hp: 15 },
    'wolf': { id: 'wolf', name: 'Wolf', traits: ['beast', 'fast'], atk: 8, hp: 12 }
};

const DUNGEON_DATA = {
    'slime': { name: 'Slime', hp: 15, atk: 5, color: 0x00ff00, type: 'enemy' },
    'goblin': { name: 'Goblin', hp: 25, atk: 10, color: 0x7cfc00, type: 'enemy' },
    'gold_stash': { name: 'Gold Pile', gold: 50, type: 'loot', color: 0xffd700 },
    'spike_trap': { name: 'Spikes', damage: 20, type: 'hazard', color: 0x808080 }
};

const FUSION_NAMES = {
    prefixes: { 'fire': 'Inferno', 'water': 'Tidal', 'wolf': 'Dire' },
    suffixes: { 'fire': 'Blaze', 'water': 'Hydra', 'wolf': 'Fang' }
};
