/**
 * ALCHEMY CLASH: FUSION MANAGER (GDD-ALIGNED)
 * Handles element combination, discovery, and card unlock rewards.
 * Gentle pastel / earth-tone alchemy only. No neon.
 */

import { ELEMENT_DATABASE, FUSION_RULES, STARTING_ELEMENTS } from './ElementData.js';

export class FusionManager {
    constructor() {
        this.unlockedElements = new Set(STARTING_ELEMENTS);
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
            return resultKey;
        }
        return null; // fusion failed or already known
    }

    getUnlockedElements() {
        return Array.from(this.unlockedElements).map(key => ELEMENT_DATABASE[key]);
    }

    /**
     * Placeholder for future card unlock on successful fusion
     */
    getFusionReward(fusionResult) {
        // Will connect to CardData later
        return null;
    }
}