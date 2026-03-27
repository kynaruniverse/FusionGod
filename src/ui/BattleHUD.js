/**
 * ALCHEMY CLASH: BATTLE HUD (GDD-ALIGNED)
 * Parchment-style battle overlay: energy counter, lane scores, end-turn button.
 * Earth-tone / pastel alchemy UI – soft, no neon.
 */

import gsap from 'gsap';

export class BattleHUD {
    constructor(parent, duel) {
        this.parent = parent;
        this.duel = duel;
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="battle-hud" class="game-screen active-screen">
                <div id="lane-scores">
                    ${[0,1,2].map(i => `
                    <div class="lane-score-container">
                        <div class="enemy-lane-score" id="enemy-score-${i}">0</div>
                        <div class="player-lane-score" id="player-score-${i}">0</div>
                    </div>`).join('')}
                </div>
                
                <div id="announcer" class="parchment-announce">MATCH BEGINS</div>
                
                <div id="bottom-hud-bar">
                    <div class="mana-vial">
                        <div id="mana-value">1</div>
                        <div class="mana-label">ENERGY</div>
                    </div>
                    <button id="end-turn-button" class="aaa-button parchment-btn">END TURN</button>
                </div>
            </div>`;

        document.getElementById('end-turn-button').onclick = () => {
            if (this.duel && !this.duel.isRevealing) this.duel.processTurn();
        };
    }

    updateUI() {
        // Update lane scores
        this.duel.lanes.forEach((lane, i) => {
            const pEl = document.getElementById(`player-score-${i}`);
            const eEl = document.getElementById(`enemy-score-${i}`);
            if (pEl) pEl.textContent = lane.userData.pPower || 0;
            if (eEl) eEl.textContent = lane.userData.ePower || 0;
        });

        // Update mana
        const manaEl = document.getElementById('mana-value');
        if (manaEl) manaEl.textContent = this.duel.playerMana || 1;

        // Gentle pulse on update
        const announcer = document.getElementById('announcer');
        if (announcer) {
            gsap.fromTo(announcer, { scale: 0.95 }, { scale: 1, duration: 0.3 });
        }
    }

    announce(text) {
        const el = document.getElementById('announcer');
        if (!el) return;
        el.textContent = text;
        gsap.fromTo(el, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.4 });
    }
}