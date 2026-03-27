/**
 * ALCHEMY CLASH: ELEMENT SYSTEM (GDD-ALIGNED)
 * Central manager for element inventory, fusion validation, and discovery tracking.
 */

import { FusionManager } from './FusionManager.js';

export class ElementSystem {
    constructor() {
        this.fusionManager = new FusionManager();
    }

    fuse(a, b) {
        return this.fusionManager.fuse(a, b);
    }

    getUnlocked() {
        return this.fusionManager.getUnlockedElements();
    }
}