/**
 * ALCHEMY CLASH: FUSION MANAGER (COMPLETE GDD-ALIGNED)
 * Handles element combination, discovery, and card unlock rewards.
 * Gentle pastel / earth-tone alchemy only. No neon.
 */

import { ELEMENT_DATABASE, FUSION_RULES, STARTING_ELEMENTS } from './ElementData.js';
import { CARD_DATABASE } from '../cards/CardData.js';

export class FusionManager {
    constructor() {
        this.unlockedElements = new Set(STARTING_ELEMENTS);
        this.unlockedCards = new Set(['FIRE_BOLT','WATER_FLOW','EARTH_WARD','AIR_GUST']);
        this.fusionHistory = [];
    }

    /**
     * Attempt to fuse two elements. Returns new element key or null.
     */
    fuse(elementA, elementB) {
        const key = [elementA, elementB].sort().join('+');
        const resultKey = FUSION_RULES[key];

        if (resultKey && !this.unlockedElements.has(resultKey)) {
            this.unlockedElements.add(resultKey);
            this.fusionHistory.push({ a: elementA, b: elementB, result: resultKey });

            const cardKey = ELEMENT_DATABASE[resultKey].unlocksCard;
            if (cardKey && CARD_DATABASE[cardKey]) {
                this.unlockedCards.add(cardKey);
            }
            return resultKey;
        }
        return null; // fusion failed or already known
    }

    getUnlockedElements() {
        return Array.from(this.unlockedElements).map(key => ELEMENT_DATABASE[key]);
    }

    getUnlockedCards() {
        return Array.from(this.unlockedCards).map(key => CARD_DATABASE[key]);
    }
}