/**
 * ALCHEMY CLASH: QUESTS SCREEN (GDD-ALIGNED)
 * Simple progression quests with rewards.
 */

import gsap from 'gsap';

export class QuestsScreen {
    constructor(parent) {
        this.parent = parent;
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="quests-screen" class="game-screen active-screen">
                <div id="quests-header">
                    <div id="quests-title">QUESTS</div>
                    <button id="back-from-quests-btn" class="aaa-button small">← BACK</button>
                </div>
                <div id="quest-list">
                    <div class="quest-item">Fuse 3 new elements → Reward: 1 Epic Card</div>
                    <div class="quest-item">Win 2 battles → Reward: 2 new elements</div>
                    <div class="quest-item">Build a 8-card deck → Reward: Steam Veil card</div>
                </div>
            </div>`;

        document.getElementById('back-from-quests-btn').onclick = () => {
            if (typeof this.onBack === 'function') this.onBack();
        };
    }
}