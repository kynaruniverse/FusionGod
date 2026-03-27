/**
 * ALCHEMY CLASH: AI MANAGER (GDD-ALIGNED)
 * Gentle earth-tone / pastel alchemy rival. Uses new CardData and ElementSystem.
 * Simple tactical play – no cyber/neon.
 */

import { CARD_DATABASE, DEFAULT_DECK } from '../cards/CardData.js';

export class AIManager {
    constructor(duel, factory) {
        this.duel = duel;
        this.factory = factory;
        this.deck = [...DEFAULT_DECK]; // soft starter deck
        this.hand = [];
        this.initialDraw();
    }

    initialDraw() {
        for (let i = 0; i < 3; i++) this.drawCard();
    }

    drawCard() {
        if (this.deck.length === 0) return;
        const index = Math.floor(Math.random() * this.deck.length);
        const cardKey = this.deck.splice(index, 1)[0];
        this.hand.push(cardKey);
    }

    async playTurn() {
        const delay = 800 + Math.random() * 600;
        await new Promise(r => setTimeout(r, delay));

        let energy = this.duel.currentTurn || 2;
        const played = [];

        while (this.hand.length && energy > 0) {
            const cardKey = this.hand[0];
            const data = CARD_DATABASE[cardKey];
            if (!data || data.cost > energy) break;

            const targetLane = this.duel.lanes[Math.floor(Math.random() * this.duel.lanes.length)];
            const card = this.factory.createCard(cardKey, 0, 12, 'ENEMY');
            if (card) {
                card.userData.targetLane = targetLane;
                played.push(card);
                energy -= data.cost;
                this.hand.shift();
            }
        }

        this.drawCard(); // draw for next turn
        return played;
    }
}