/**
 * ALCHEMY CLASH: HUB SCREEN (GDD-ALIGNED)
 * Central parchment hub with Workshop, Deck Builder, and Collections.
 */

import gsap from 'gsap';
import { CollectionsScreen } from './CollectionsScreen.js';

export class HubScreen {
    constructor(parent, elementSystem) {
        this.parent = parent;
        this.elementSystem = elementSystem;
        this.onPlay = null;
        this.onDeck = null;
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="hub-screen" class="game-screen active-screen">
                <div id="hub-header">
                    <div id="hub-title">ALCHEMY CLASH</div>
                    <div id="hub-subtitle">The Workshop Awaits</div>
                </div>
                
                <div id="hub-buttons">
                    <button id="hub-workshop-btn" class="aaa-button parchment-btn">FUSION WORKSHOP</button>
                    <button id="hub-deck-btn" class="aaa-button parchment-btn">BUILD DECK</button>
                    <button id="hub-collections-btn" class="aaa-button parchment-btn">COLLECTIONS</button>
                </div>
                
                <div id="hub-footer">
                    <div id="unlocked-count">Unlocked Elements: <span id="elem-count">4</span></div>
                </div>
            </div>`;

        document.getElementById('hub-workshop-btn').onclick = () => {
            if (typeof this.onPlay === 'function') this.onPlay();
        };

        document.getElementById('hub-deck-btn').onclick = () => {
            if (typeof this.onDeck === 'function') this.onDeck();
        };

        document.getElementById('hub-collections-btn').onclick = () => {
            const collections = new CollectionsScreen(this.parent, this.elementSystem);
            collections.onBack = () => this.init(); // return to hub
        };

        this.updateUnlockedCount();
    }

    updateUnlockedCount() {
        const countEl = document.getElementById('elem-count');
        if (countEl) countEl.textContent = this.elementSystem.getUnlocked().length;
    }
}