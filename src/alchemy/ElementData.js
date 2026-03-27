/**
 * ALCHEMY CLASH: ELEMENT DATABASE (GDD-ALIGNED)
 * Foundational data for all elemental components and fusion rules.
 * Earth-tone / pastel alchemy theme only.
 */

export const ELEMENT_DATABASE = {
    // Basic starter elements (Step 1: Tutorial)
    'FIRE': {
        name: 'Fire',
        type: 'basic',
        color: 0xc44a2f, // soft earth red-brown
        rarity: 'COMMON',
        icon: '🔥',
        desc: 'Warm essence of flame'
    },
    'WATER': {
        name: 'Water',
        type: 'basic',
        color: 0x5a9bb0, // soft pastel blue
        rarity: 'COMMON',
        icon: '💧',
        desc: 'Flowing essence of life'
    },
    'EARTH': {
        name: 'Earth',
        type: 'basic',
        color: 0x8c6f4e, // warm beige-brown
        rarity: 'COMMON',
        icon: '🌱',
        desc: 'Solid essence of stone'
    },
    'AIR': {
        name: 'Air',
        type: 'basic',
        color: 0xb8d4d8, // soft lavender-blue
        rarity: 'COMMON',
        icon: '🌬️',
        desc: 'Breath of the sky'
    },

    // Example fused elements (expandable)
    'STEAM': {
        name: 'Steam',
        type: 'fused',
        color: 0xa8c4c7,
        rarity: 'RARE',
        icon: '☁️',
        desc: 'Fire + Water fusion',
        requires: ['FIRE', 'WATER']
    },
    'LAVA': {
        name: 'Lava',
        type: 'fused',
        color: 0xb85c2e,
        rarity: 'RARE',
        icon: '🌋',
        desc: 'Fire + Earth fusion',
        requires: ['FIRE', 'EARTH']
    }
};

// Simple fusion lookup table (2-element only for v1)
export const FUSION_RULES = {
    'FIRE+WATER': 'STEAM',
    'FIRE+EARTH': 'LAVA',
    'WATER+EARTH': 'MUD',   // placeholder – will expand
    'AIR+FIRE': 'SMOKE',
    // Add more as we iterate
};

export const STARTING_ELEMENTS = ['FIRE', 'WATER', 'EARTH', 'AIR'];