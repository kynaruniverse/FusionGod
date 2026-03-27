/**
 * ALCHEMY CLASH: DECK BUILDER (GDD-ALIGNED)
 * Parchment-style deck selection. Back returns to hub, Confirm proceeds to battle.
 */

import { CARD_DATABASE } from '../cards/CardData.js';
import gsap from 'gsap';

export class DeckBuilder {
    constructor(parent) {
        this.parent = parent;
        this.selectedDeck = [];
        this.maxDeckSize = 8;
        this.onComplete = null;   // Called when player confirms deck
        this.onBack = null;       // Called when player clicks back
        this.init();
    }

    init() {
        this.parent.innerHTML = `
            <div id="deck-builder-screen" class="game-screen active-screen">
                <div id="deck-header">
                    <div id="deck-title">BUILD YOUR DECK</div>
                    <div id="deck-count">SELECTED: <span id="deck-count-text">0/${this.maxDeckSize}</span></div>
                    <button id="back-from-deck-btn" class="aaa-button small">← BACK</button>
                </div>
                
                <div id="deck-grid-container">
                    <div id="deck-grid"></div>
                </div>
                
                <div id="deck-footer">
                    <button id="confirm-deck-btn" class="aaa-button parchment-btn" disabled>READY TO CLASH</button>
                </div>
            </div>`;

        this.renderDeckGrid();
        this.setupButtons();
    }

    renderDeckGrid() {
        const grid = document.getElementById('deck-grid');
        grid.innerHTML = '';

        Object.keys(CARD_DATABASE).forEach(key => {
            const card = CARD_DATABASE[key];
            const item = document.createElement('div');
            item.className = 'deck-card parchment-card';
            item.innerHTML = `
                <div class="card-frame">
                    <div class="card-cost">${card.cost}</div>
                    <div class="card-name">${card.name}</div>
                    <div class="card-power">POW ${card.power}</div>
                </div>
            `;
            item.dataset.key = key;

            item.addEventListener('click', () => this.toggleCardSelection(key, item));
            grid.appendChild(item);
        });
    }

    toggleCardSelection(key, element) {
        const index = this.selectedDeck.indexOf(key);
        const countEl = document.getElementById('deck-count-text');
        const confirmBtn = document.getElementById('confirm-deck-btn');

        if (index > -1) {
            this.selectedDeck.splice(index, 1);
            element.classList.remove('selected');
        } else if (this.selectedDeck.length < this.maxDeckSize) {
            this.selectedDeck.push(key);
            element.classList.add('selected');
        }

        countEl.textContent = `\( {this.selectedDeck.length}/ \){this.maxDeckSize}`;

        confirmBtn.disabled = this.selectedDeck.length !== this.maxDeckSize;
    }

    setupButtons() {
        // Back button
        document.getElementById('back-from-deck-btn').onclick = () => {
            if (typeof this.onBack === 'function') this.onBack();
            else if (typeof this.onComplete === 'function') this.onComplete([]); // fallback
        };

        // Confirm button
        document.getElementById('confirm-deck-btn').onclick = () => {
            if (this.selectedDeck.length === this.maxDeckSize && typeof this.onComplete === 'function') {
                this.onComplete(this.selectedDeck);
            }
        };
    }
}