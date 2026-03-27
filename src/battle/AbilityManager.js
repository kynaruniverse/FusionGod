/**
 * ALCHEMY CLASH: ABILITY MANAGER (GDD-ALIGNED)
 * Soft earth-tone / pastel alchemy effects only. Triggers card abilities on reveal.
 * Gentle sparkles and parchment feedback – no neon or cyber.
 */

export class AbilityManager {
    constructor(duel) {
        this.duel = duel;
    }

    trigger(card) {
        const ability = card.userData.data.ability;
        if (!ability) return;

        const type = ability.type;
        const value = ability.value || 0;

        if (type === 'BOOST_LANE') this.boostLane(card, value);
        else if (type === 'BURN_ENEMY') this.burnEnemy(card, value);
        else if (type === 'SURGE') this.surge(card, value);
        else console.warn(`AbilityManager: Unknown ability ${type}`);
    }

    boostLane(card, value) {
        const lane = card.userData.targetLane;
        if (!lane) return;

        if (card.userData.owner === 'PLAYER') {
            lane.userData.pPower = Math.min(99, lane.userData.pPower + value);
        } else {
            lane.userData.ePower = Math.min(99, lane.userData.ePower + value);
        }

        if (this.duel.vfx) this.duel.vfx.createGentleSpark(card.position, card.userData.data.color);
        this.sync();
    }

    burnEnemy(card, value) {
        const lane = card.userData.targetLane;
        if (!lane) return;

        if (card.userData.owner === 'PLAYER') {
            lane.userData.ePower = Math.max(0, lane.userData.ePower - value);
        } else {
            lane.userData.pPower = Math.max(0, lane.userData.pPower - value);
        }

        if (this.duel.vfx) this.duel.vfx.createGentleSpark(card.position, 0x8c6f4e);
        this.sync();
    }

    surge(card, value) {
        const lane = card.userData.targetLane;
        if (!lane) return;

        const isWinning = card.userData.owner === 'PLAYER'
            ? lane.userData.pPower > lane.userData.ePower
            : lane.userData.ePower > lane.userData.pPower;

        if (!isWinning) return;

        if (card.userData.owner === 'PLAYER') {
            lane.userData.pPower = Math.min(99, lane.userData.pPower + value);
        } else {
            lane.userData.ePower = Math.min(99, lane.userData.ePower + value);
        }

        if (this.duel.vfx) this.duel.vfx.createGentleSpark(card.position, 0xb8d4d8);
        this.sync();
    }

    sync() {
        this.duel.updateLaneVisuals();
        if (this.duel.ui) this.duel.ui.updateUI();
    }
}