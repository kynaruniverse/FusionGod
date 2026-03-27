/**
 * ALCHEMY CLASH: CARD DATABASE (GDD-ALIGNED)
 * Earth-tone / pastel alchemy theme. Cards derived from fused elements.
 * Simple v1 set – expandable via fusion unlocks.
 */

export const CARD_DATABASE = {
    // Starter cards from basic elements
    'FIRE_BOLT': {
        name: 'Ember Spark',
        element: 'FIRE',
        cost: 1,
        power: 2,
        rarity: 'COMMON',
        ability: { type: 'BOOST_LANE', value: 1 },
        desc: 'ON REVEAL: +1 Power to this lane.',
        color: 0xc44a2f
    },
    'WATER_FLOW': {
        name: 'Gentle Current',
        element: 'WATER',
        cost: 1,
        power: 1,
        rarity: 'COMMON',
        ability: { type: 'BOOST_LANE', value: 2 },
        desc: 'ON REVEAL: +2 Power if you control this lane.',
        color: 0x5a9bb0
    },
    'EARTH_WARD': {
        name: 'Stone Shield',
        element: 'EARTH',
        cost: 2,
        power: 3,
        rarity: 'COMMON',
        ability: { type: 'NONE' },
        desc: 'Solid defense. No special effect.',
        color: 0x8c6f4e
    },
    'AIR_GUST': {
        name: 'Whispering Wind',
        element: 'AIR',
        cost: 1,
        power: 2,
        rarity: 'COMMON',
        ability: { type: 'BURN_ENEMY', value: 1 },
        desc: 'ON REVEAL: -1 Enemy Power in this lane.',
        color: 0xb8d4d8
    },

    // Fused example cards (unlocked via ElementSystem)
    'STEAM_VEIL': {
        name: 'Mist Veil',
        element: 'STEAM',
        cost: 2,
        power: 4,
        rarity: 'RARE',
        ability: { type: 'SURGE', value: 3 },
        desc: 'SURGE: +3 Power if already winning lane.',
        color: 0xa8c4c7
    }
};

export const DEFAULT_DECK = ['FIRE_BOLT', 'WATER_FLOW', 'EARTH_WARD', 'AIR_GUST'];