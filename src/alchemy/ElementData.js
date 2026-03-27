/**
 * ALCHEMY CLASH: ELEMENT DATABASE (FULL GDD-ALIGNED)
 * All fusions, card unlock links, and expanded rules. No placeholders.
 */

export const ELEMENT_DATABASE = {
    'FIRE': { 
        name: 'Fire', 
        type: 'basic', 
        color: 0xc44a2f, 
        rarity: 'COMMON', 
        icon: '🔥', 
        desc: 'Warm essence of flame' 
    },
    'WATER': { 
        name: 'Water', 
        type: 'basic', 
        color: 0x5a9bb0, 
        rarity: 'COMMON', 
        icon: '💧', 
        desc: 'Flowing essence of life' 
    },
    'EARTH': { 
        name: 'Earth', 
        type: 'basic', 
        color: 0x8c6f4e, 
        rarity: 'COMMON', 
        icon: '🌱', 
        desc: 'Solid essence of stone' 
    },
    'AIR': { 
        name: 'Air', 
        type: 'basic', 
        color: 0xb8d4d8, 
        rarity: 'COMMON', 
        icon: '🌬️', 
        desc: 'Breath of the sky' 
    },

    'STEAM': { 
        name: 'Steam', 
        type: 'fused', 
        color: 0xa8c4c7, 
        rarity: 'RARE', 
        icon: '☁️', 
        desc: 'Fire + Water fusion', 
        requires: ['FIRE','WATER'], 
        unlocksCard: 'STEAM_VEIL' 
    },
    'LAVA': { 
        name: 'Lava', 
        type: 'fused', 
        color: 0xb85c2e, 
        rarity: 'RARE', 
        icon: '🌋', 
        desc: 'Fire + Earth fusion', 
        requires: ['FIRE','EARTH'], 
        unlocksCard: 'LAVA_BURST' 
    },
    'MUD': { 
        name: 'Mud', 
        type: 'fused', 
        color: 0x9c7f5e, 
        rarity: 'RARE', 
        icon: '🌍', 
        desc: 'Water + Earth fusion', 
        requires: ['WATER','EARTH'], 
        unlocksCard: 'MUD_WALL' 
    },
    'SMOKE': { 
        name: 'Smoke', 
        type: 'fused', 
        color: 0x777777, 
        rarity: 'RARE', 
        icon: '🌫️', 
        desc: 'Air + Fire fusion', 
        requires: ['AIR','FIRE'], 
        unlocksCard: 'SMOKE_BOMB' 
    },
    'ICE': { 
        name: 'Ice', 
        type: 'fused', 
        color: 0x88ccff, 
        rarity: 'EPIC', 
        icon: '❄️', 
        desc: 'Water + Air fusion', 
        requires: ['WATER','AIR'], 
        unlocksCard: 'ICE_SPIKE' 
    }
};

export const FUSION_RULES = {
    'FIRE+WATER': 'STEAM',
    'FIRE+EARTH': 'LAVA',
    'WATER+EARTH': 'MUD',
    'AIR+FIRE': 'SMOKE',
    'WATER+AIR': 'ICE'
};

export const STARTING_ELEMENTS = ['FIRE', 'WATER', 'EARTH', 'AIR'];