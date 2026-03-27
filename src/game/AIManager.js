/**
 * ALCHEMY CLASH: AI MANAGER (THE RIVAL)
 * Handles automated decision-making and card deployment for the opponent.
 */

import { CARD_DATABASE } from './CardData.js';

export class AIManager {
    constructor(duel, factory) {
        this.duel = duel;
        this.factory = factory;
        this.isThinking = false;
        
        // High-Tier Rival Deck (Mixed Elements)
        this.deck = [
            'FIRE_DRAGON', 'WATER_SPIRIT', 'EARTH_GOLEM', 
            'WIND_REAPER', 'FIRE_DRAGON', 'WATER_SPIRIT'
        ];
    }


    /**
     * Decides which card to play and where. 
     * Called by DuelManager during the processTurn sequence.
     */
    async playTurn() {
        if (this.isThinking) return null;
        this.isThinking = true;

        // 1. "Human-Like" Thinking Delay (1.2 to 2 seconds)
        const delay = 1200 + Math.random() * 800;
        await new Promise(resolve => setTimeout(resolve, delay));

        const turnEnergy = this.duel.currentTurn;

        
        // 1. Filter deck for cards the AI can actually afford
        const affordableIndices = this.deck.reduce((acc, key, idx) => {
            if (CARD_DATABASE[key].cost <= turnEnergy) acc.push(idx);
            return acc;
        }, []);

        if (affordableIndices.length === 0) return null;

        // 2. Pick a card and remove it from deck
        const randomIndex = affordableIndices[Math.floor(Math.random() * affordableIndices.length)];
        const cardKey = this.deck.splice(randomIndex, 1)[0];

        // 3. Strategic Lane Selection
        // The AI looks for lanes where it is currently losing or tied
        const targetLane = this.selectBestLane();

        // 4. Create the 3D Entity
        // Spawn far above the board (y=15) so it flies in from "the top"
        const card = this.factory.createCard(cardKey, targetLane.position.x, 15, 'ENEMY');
        
        // AAA Setup: Start face-down (Fog of War)
        card.rotation.y = Math.PI;
        card.userData.targetLane = targetLane;

        // 5. Deploy Animation
        // The AI "slams" the card into the enemy side of the lane (y offset +1.2)
        const yOffset = 1.2 - (targetLane.userData.eCards * 0.4);
        
        // 5. Cinematic "Slam" Animation
        gsap.to(card.position, { 
            y: targetLane.position.y + yOffset, 
            z: 0.1, 
            duration: 0.6, 
            ease: "bounce.out",
            onComplete: () => {
                // Trigger a small dust cloud or impact when AI plays
                if (this.duel.vfx) this.duel.vfx.createImpact(card.position, 0x444444);
                if (this.duel.audio) this.duel.audio.play('SNAP', 0.4);
                this.isThinking = false;
            }
        });

        return card;
    }


    /**
     * Simple tactical logic: Try to bolster lanes that are close or being lost.
     */
    selectBestLane() {
        const lanes = this.duel.lanes;
        
        // Find a lane where the player is currently winning
        const strugglingLanes = lanes.filter(l => l.userData.pPower >= l.userData.ePower);
        
        if (strugglingLanes.length > 0) {
            return strugglingLanes[Math.floor(Math.random() * strugglingLanes.length)];
        }
        
        // Otherwise, pick a random lane
        return lanes[Math.floor(Math.random() * lanes.length)];
    }
}
