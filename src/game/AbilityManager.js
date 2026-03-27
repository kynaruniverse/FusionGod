/**
 * ALCHEMY CLASH: ABILITY MANAGER
 * Handles logic for special card effects (Buffs, Debuffs, and Lane manipulation).
 */

export class AbilityManager {
    constructor(duel) {
        this.duel = duel;
    }

    /**
     * Triggers a card's unique ability based on its data
     * @param {Object} card - The 3D Mesh of the card being revealed
     */
    trigger(card) {
        const ability = card.userData.data.ability;
        if (!ability) return;

        console.log(`Triggering Ability: ${ability.type} for ${card.userData.data.name}`);

        switch (ability.type) {
            case 'BOOST_LANE':
                this.boostLane(card, ability.value);
                break;
            case 'BURN_ENEMY':
                this.burnEnemy(card, ability.value);
                break;
            case 'SURGE':
                this.surge(card, ability.value);
                break;
            case 'SPY':
                this.spy(card);
                break;
        }
    }


    // Effect: Adds power to all OTHER cards in this lane
    boostLane(card, value) {
        const lane = card.userData.targetLane;
        if (card.userData.owner === 'PLAYER') lane.userData.pPower += value;
        else lane.userData.ePower += value;
        
        // AAA: Visual feedback for the boost
        if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0xffff00);
        gsap.to(lane.scale, { x: 1.1, z: 1.1, duration: 0.2, yoyo: true, repeat: 1 });
    }


    // Effect: Reduces the enemy's power in this lane
    burnEnemy(card, value) {
        const lane = card.userData.targetLane;
        if (card.userData.owner === 'PLAYER') {
            lane.userData.ePower = Math.max(0, lane.userData.ePower - value);
        } else {
            lane.userData.pPower = Math.max(0, lane.userData.pPower - value);
        }
        
        if (this.duel.vfx) this.duel.vfx.createImpact(lane.position, 0xff4400);
    }

    // Effect: Surge - Gains extra power if you are already winning this lane
    surge(card, value) {
        const lane = card.userData.targetLane;
        const isWinning = card.userData.owner === 'PLAYER' ? 
            (lane.userData.pPower > lane.userData.ePower) : 
            (lane.userData.ePower > lane.userData.pPower);

        if (isWinning) {
            if (card.userData.owner === 'PLAYER') lane.userData.pPower += value;
            else lane.userData.ePower += value;
            
            if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0x00ff00);
            console.log("SURGE ACTIVATED!");
        }
    }
    
    // Effect: Moves to the OPPONENT'S side of the lane and gives them the power
    // (Usually a low-power card that triggers a secondary negative effect)
    spy(card) {
        const lane = card.userData.targetLane;
        const power = card.userData.data.atk;

        // 1. Subtract power from current owner
        if (card.userData.owner === 'PLAYER') {
            lane.userData.pPower -= power;
            card.userData.owner = 'ENEMY';
            lane.userData.eCards++;
        } else {
            lane.userData.ePower -= power;
            card.userData.owner = 'PLAYER';
            lane.userData.pCards++;
        }

        // 2. Add power to new owner
        if (card.userData.owner === 'PLAYER') lane.userData.pPower += power;
        else lane.userData.ePower += power;

        // 3. AAA Animation: Slide the card across the board "equator"
        const newZ = card.userData.owner === 'ENEMY' ? 0.1 : 0.1; // Maintain depth
        const yOffset = card.userData.owner === 'ENEMY' ? 
            (1.2 - (lane.userData.eCards * 0.4)) : 
            (-1.2 + (lane.userData.pCards * 0.4));

        gsap.to(card.position, {
            y: lane.position.y + yOffset,
            duration: 0.8,
            ease: "expo.inOut",
            onStart: () => {
                if (this.duel.audio) this.duel.audio.play('SLIDE', 0.5);
            },
            onComplete: () => {
                if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0xff00ff);
                this.duel.updateLaneVisuals();
                this.duel.ui.updateUI();
            }
        });
    }
}
