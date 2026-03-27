/**
 * ALCHEMY CLASH: CARD FUSION SYSTEM (GDD-ALIGNED)
 * Allows players to merge duplicate or compatible cards outside battle
 * to upgrade power, rarity, or unlock new abilities. Earth-tone alchemy only.
 */

import { CARD_DATABASE } from './CardData.js';

export class CardFusion {
    constructor() {
        this.ownedCards = {}; // key → count
    }

    addCard(cardKey) {
        this.ownedCards[cardKey] = (this.ownedCards[cardKey] || 0) + 1;
    }

    canFuse(cardKeyA, cardKeyB) {
        // Simple rule: same element + same rarity = upgrade
        const a = CARD_DATABASE[cardKeyA];
        const b = CARD_DATABASE[cardKeyB];
        return a && b && a.element === b.element && a.rarity === b.rarity;
    }

    fuse(cardKeyA, cardKeyB) {
        if (!this.canFuse(cardKeyA, cardKeyB)) return null;

        const base = CARD_DATABASE[cardKeyA];
        // Upgrade example: +1 power, bump rarity
        const newPower = base.power + 1;
        const newRarity = base.rarity === 'COMMON' ? 'RARE' : 
                         base.rarity === 'RARE' ? 'EPIC' : 'LEGENDARY';

        // For v1 we return an upgraded version (in future: new card key)
        return {
            ...base,
            power: newPower,
            rarity: newRarity
        };
    }
}